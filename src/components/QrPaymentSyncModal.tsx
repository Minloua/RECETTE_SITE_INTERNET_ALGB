import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useApp, QrSyncReport, UserRole } from '../context/AppContext';
import {
  AlumniMember,
  MONTHS_2026,
  PaymentMethod,
} from '../data/mockData';
import { parseMemberQrPayload } from '../utils/qrPayload';
import {
  canActiveSessionAccessMemberQr,
  PROFILE_ACCESS_MATRIX,
} from '../utils/accessMatrix';
import {
  AlertTriangle,
  Banknote,
  Building2,
  Camera,
  CheckCircle2,
  CreditCard,
  Database,
  Eye,
  EyeOff,
  FileText,
  KeyRound,
  Lock,
  QrCode,
  RefreshCw,
  Search,
  ShieldCheck,
  Smartphone,
  X,
} from 'lucide-react';

interface BarcodeDetectorLike {
  detect: (source: ImageBitmapSource) => Promise<Array<{ rawValue?: string }>>;
}

declare global {
  interface Window {
    BarcodeDetector?: new (options?: { formats?: string[] }) => BarcodeDetectorLike;
  }
}

const AUTH_ROLES: UserRole[] = [
  'MEMBRE',
  'DELEGUE',
  'RESPONSABLE_FINANCE',
  'ADMIN',
  'SUPER_ADMIN',
  'RESPONSABLE_COMM',
];

export const QrPaymentSyncModal: React.FC = () => {
  const {
    qrSyncModalOpen,
    qrTargetMember,
    qrAuthVerified,
    qrAuthSession,
    closeQrSyncModal,
    verifyQrAccess,
    members,
    projects,
    settings,
    currentUser,
    currentRole,
    setCurrentUser,
    setActiveTab,
    setViewingCardMember,
    setViewingTransactionReceipt,
    getMemberFinancialSummary,
    syncQrPaymentUpdate,
  } = useApp();

  // Auth Gate state
  const [authRole, setAuthRole] = useState<UserRole>('MEMBRE');
  const [authIdentifier, setAuthIdentifier] = useState('');
  const [authCode, setAuthCode] = useState('');
  const [showAuthCode, setShowAuthCode] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [showMatrixDetails, setShowMatrixDetails] = useState(false);

  // Target & Scan state
  const [selectedMember, setSelectedMember] = useState<AlumniMember | null>(null);
  const [scanInput, setScanInput] = useState('');
  const [scanError, setScanError] = useState<string | null>(null);
  const [memberSearch, setMemberSearch] = useState('');

  // Camera scanner state
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraMessage, setCameraMessage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | null>(null);

  // Payment sync form state
  const [selectedPendingIds, setSelectedPendingIds] = useState<string[]>([]);
  const [payAdhesion, setPayAdhesion] = useState(false);
  const [selectedMonths, setSelectedMonths] = useState<string[]>([]);
  const [includeProjectDonation, setIncludeProjectDonation] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState(projects[0]?.id || '');
  const [projectAmount, setProjectAmount] = useState(15000);
  const [method, setMethod] = useState<PaymentMethod>('ORANGE_MONEY');
  const [notes, setNotes] = useState('');
  const [syncReport, setSyncReport] = useState<QrSyncReport | null>(null);

  const stopCamera = () => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  useEffect(() => {
    if (!qrSyncModalOpen) {
      stopCamera();
      setSyncReport(null);
      setScanError(null);
      setAuthError(null);
      setCameraMessage(null);
      return;
    }

    setSyncReport(null);
    setScanError(null);
    setAuthError(null);
    setScanInput('');
    setAuthCode('');
    setAuthRole(currentRole !== 'VISITEUR' ? currentRole : 'MEMBRE');
    setAuthIdentifier(
      currentRole !== 'VISITEUR' && currentUser ? currentUser.membershipCardId : ''
    );
    setSelectedMember(qrTargetMember);
  }, [qrSyncModalOpen, qrTargetMember]);

  useEffect(() => {
    return () => stopCamera();
  }, []);

  // Pre-populate payment defaults when authenticated and member is selected
  useEffect(() => {
    if (!selectedMember || !qrAuthVerified) return;
    const summary = getMemberFinancialSummary(selectedMember.id);
    const pendingIds = summary.transactions
      .filter((t) => t.status === 'EN_ATTENTE')
      .map((t) => t.id);

    setSelectedPendingIds(pendingIds);
    setPayAdhesion(!summary.hasPaidAdhesion);

    if (summary.overdueMonths.length > 0) {
      setSelectedMonths(summary.overdueMonths);
    } else {
      const nextUnpaid = MONTHS_2026.find(
        (m) => !summary.paidMonths.includes(m.key) && !summary.pendingMonths.includes(m.key)
      );
      setSelectedMonths(nextUnpaid ? [nextUnpaid.key] : []);
    }
    setIncludeProjectDonation(false);
    setNotes('');
  }, [selectedMember?.id, qrAuthVerified]);

  const activeMemberSummary = useMemo(() => {
    if (!selectedMember || !qrAuthVerified) return null;
    return getMemberFinancialSummary(selectedMember.id);
  }, [selectedMember, qrAuthVerified, getMemberFinancialSummary]);

  const pendingTxs = useMemo(() => {
    if (!activeMemberSummary) return [];
    return activeMemberSummary.transactions.filter((t) => t.status === 'EN_ATTENTE');
  }, [activeMemberSummary]);

  // Only expose directory cards permitted by the authenticated profile's matrix scope
  const authorizedDirectoryMembers = useMemo(() => {
    if (!qrAuthVerified) return [];
    const scoped = members.filter((m) =>
      canActiveSessionAccessMemberQr(currentRole, currentUser, m)
    );
    const q = memberSearch.trim().toLowerCase();
    if (!q) return scoped.slice(0, 6);
    return scoped
      .filter(
        (m) =>
          `${m.firstName} ${m.lastName}`.toLowerCase().includes(q) ||
          m.membershipCardId.toLowerCase().includes(q) ||
          String(m.promotionYear).includes(q)
      )
      .slice(0, 6);
  }, [members, memberSearch, qrAuthVerified, currentRole, currentUser]);

  const totalToSync = useMemo(() => {
    const pendingSum = pendingTxs
      .filter((t) => selectedPendingIds.includes(t.id))
      .reduce((acc, t) => acc + t.amount, 0);
    const adhesionSum = payAdhesion ? settings.droitAdhesionAmount : 0;
    const cotisationSum = selectedMonths.length * settings.cotisationMensuelleAmount;
    const donationSum = includeProjectDonation && selectedProjectId ? Math.max(0, projectAmount) : 0;
    return pendingSum + adhesionSum + cotisationSum + donationSum;
  }, [
    pendingTxs,
    selectedPendingIds,
    payAdhesion,
    selectedMonths,
    includeProjectDonation,
    selectedProjectId,
    projectAmount,
    settings,
  ]);

  if (!qrSyncModalOpen) return null;

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = verifyQrAccess({
      role: authRole,
      identifier: authIdentifier,
      accessCode: authCode,
      targetMember: qrTargetMember,
    });

    if (!res.allowed) {
      setAuthError(res.reason || 'Accès refusé selon la matrice des profils.');
      return;
    }

    setAuthError(null);
    if (qrTargetMember) {
      setSelectedMember(qrTargetMember);
    } else if (res.rule.scopeType === 'SELF_ONLY' && res.authenticatedMember) {
      setSelectedMember(res.authenticatedMember);
    }
  };

  const handleStartCamera = async () => {
    setCameraMessage(null);
    setScanError(null);

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraMessage(
        'La caméra directe n’est pas disponible dans cet environnement. Collez le lien du QR code ou sélectionnez une carte autorisée ci-dessous.'
      );
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      streamRef.current = stream;
      setCameraActive(true);

      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => undefined);
        }
      }, 50);

      if (window.BarcodeDetector) {
        const detector = new window.BarcodeDetector({ formats: ['qr_code'] });
        const scanLoop = async () => {
          if (!videoRef.current || !streamRef.current) return;
          try {
            const barcodes = await detector.detect(videoRef.current);
            if (barcodes.length > 0 && barcodes[0].rawValue) {
              const matched = parseMemberQrPayload(barcodes[0].rawValue, members);
              if (matched) {
                if (!canActiveSessionAccessMemberQr(currentRole, currentUser, matched)) {
                  setScanError(
                    `Accès refusé par la matrice : votre profil (${PROFILE_ACCESS_MATRIX[currentRole].label}) n’est pas habilité pour la carte ${matched.membershipCardId}.`
                  );
                  stopCamera();
                  return;
                }
                stopCamera();
                setSelectedMember(matched);
                return;
              }
            }
          } catch {
            // Continue scanning frames
          }
          rafRef.current = requestAnimationFrame(scanLoop);
        };
        rafRef.current = requestAnimationFrame(scanLoop);
      } else {
        setCameraMessage(
          'Caméra active. Si votre navigateur ne prend pas en charge la lecture automatique BarcodeDetector, saisissez le matricule ou collez le lien ci-dessous.'
        );
      }
    } catch {
      setCameraMessage(
        'Accès caméra refusé ou indisponible. Utilisez la saisie du matricule/lien QR ou le flash rapide ci-dessous.'
      );
    }
  };

  const handleManualScanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const matched = parseMemberQrPayload(scanInput, members);
    if (!matched) {
      setScanError(
        'Aucun adhérent reconnu pour ce QR code ou matricule. Vérifiez le format (ex: ALGB-2002-0001).'
      );
      return;
    }
    if (!canActiveSessionAccessMemberQr(currentRole, currentUser, matched)) {
      setScanError(
        `Accès refusé selon la matrice des profils : votre habilitation (${PROFILE_ACCESS_MATRIX[currentRole].label}) ne couvre pas la carte ${matched.membershipCardId}.`
      );
      return;
    }
    setScanError(null);
    stopCamera();
    setSelectedMember(matched);
  };

  const toggleMonth = (key: string) => {
    setSelectedMonths((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key].sort()
    );
  };

  const togglePendingTx = (txId: string) => {
    setSelectedPendingIds((prev) =>
      prev.includes(txId) ? prev.filter((id) => id !== txId) : [...prev, txId]
    );
  };

  const handleExecuteSync = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMember) return;

    const report = syncQrPaymentUpdate({
      memberId: selectedMember.id,
      method,
      validatePendingTxIds: selectedPendingIds,
      payAdhesion,
      cotisationMonths: selectedMonths,
      projectId: includeProjectDonation ? selectedProjectId : undefined,
      projectDonationAmount: includeProjectDonation ? projectAmount : 0,
      notes,
    });

    if (report) {
      setSyncReport(report);
    }
  };

  const canAccessAdmin =
    currentRole === 'ADMIN' ||
    currentRole === 'SUPER_ADMIN' ||
    currentRole === 'RESPONSABLE_FINANCE';

  const selectedRule = PROFILE_ACCESS_MATRIX[authRole];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 dark:bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden my-8 text-gray-900 dark:text-zinc-100">
        {/* Header */}
        <div className="bg-black dark:bg-zinc-950 px-6 py-4 flex items-center justify-between text-white border-b-2 border-[#E5B824]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#E5B824] text-black flex items-center justify-center shrink-0">
              {qrAuthVerified ? <QrCode className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-heading font-bold text-white">
                {qrAuthVerified
                  ? 'Flash QR Code — Paiement & Synchronisation ALGB'
                  : 'Accès Sécurisé — Matrice des Profils ALGB'}
              </h3>
              <p className="text-[11px] text-gray-300">
                {qrAuthVerified
                  ? 'Mise à jour instantanée de l’espace de paiement et des tables de trésorerie'
                  : 'Authentification dédiée requise pour accéder au lien QR de paiement'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              stopCamera();
              closeQrSyncModal();
            }}
            className="p-1.5 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5 max-h-[82vh] overflow-y-auto">
          {/* STEP 0: PROFILE MATRIX AUTHENTICATION GATE */}
          {!qrAuthVerified && (
            <div className="space-y-5 text-xs">
              {qrTargetMember && (
                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 flex items-start gap-3">
                  <QrCode className="w-5 h-5 text-[#B8860B] dark:text-[#E5B824] shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-black dark:text-white">
                      Lien QR détecté : Carte N°{' '}
                      <span className="font-mono text-[#B8860B] dark:text-[#E5B824]">
                        {qrTargetMember.membershipCardId}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-600 dark:text-zinc-400 mt-0.5">
                      Titulaire : {qrTargetMember.firstName} {qrTargetMember.lastName} (Promotion{' '}
                      {qrTargetMember.promotionYear}). Conformément à la matrice des profils en vigueur, veuillez saisir vos accès dédiés pour déverrouiller cet espace.
                    </p>
                  </div>
                </div>
              )}

              <form onSubmit={handleAuthSubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-bold text-gray-700 dark:text-zinc-300 mb-1.5">
                    1. Profil habilité selon la matrice en vigueur
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {AUTH_ROLES.map((rKey) => {
                      const rule = PROFILE_ACCESS_MATRIX[rKey];
                      const active = authRole === rKey;
                      return (
                        <button
                          key={rKey}
                          type="button"
                          onClick={() => {
                            setAuthRole(rKey);
                            setAuthError(null);
                          }}
                          className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                            active
                              ? 'bg-black dark:bg-zinc-950 text-white border-black dark:border-[#E5B824] shadow-xs'
                              : 'bg-gray-50 dark:bg-zinc-950 text-gray-800 dark:text-zinc-200 border-gray-200 dark:border-zinc-800 hover:border-gray-400 dark:hover:border-zinc-600'
                          }`}
                        >
                          <div className="font-bold flex items-center justify-between gap-2">
                            <span className={active ? 'text-[#E5B824]' : 'text-black dark:text-white'}>
                              {rule.label}
                            </span>
                          </div>
                          <div
                            className={`text-[10px] mt-0.5 ${
                              active ? 'text-gray-300' : 'text-gray-500 dark:text-zinc-400'
                            }`}
                          >
                            {rule.scopeLabel}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-yellow-50/70 dark:bg-yellow-500/10 border border-yellow-200 dark:border-yellow-500/30 text-[11px] text-gray-800 dark:text-zinc-200">
                  <strong className="text-black dark:text-white">Périmètre du profil sélectionné :</strong>{' '}
                  {selectedRule.description}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-gray-700 dark:text-zinc-300 font-bold mb-1">
                      Identifiant dédié (E-mail ou Matricule)
                    </label>
                    <input
                      type="text"
                      required
                      value={authIdentifier}
                      onChange={(e) => setAuthIdentifier(e.target.value)}
                      placeholder={
                        authRole === 'RESPONSABLE_FINANCE'
                          ? 'tresorier@algb.ci ou matricule'
                          : authRole === 'ADMIN'
                          ? 'admin@algb.ci ou matricule'
                          : 'ex: ALGB-2002-0001 ou email'
                      }
                      className="w-full bg-gray-50 dark:bg-zinc-950 border border-gray-300 dark:border-zinc-700 focus:border-[#E5B824] focus:bg-white dark:focus:bg-zinc-900 rounded-xl px-3 py-2.5 text-black dark:text-white font-mono text-xs focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 dark:text-zinc-300 font-bold mb-1">
                      Code d’accès dédié du profil
                    </label>
                    <div className="relative">
                      <input
                        type={showAuthCode ? 'text' : 'password'}
                        required
                        value={authCode}
                        onChange={(e) => setAuthCode(e.target.value)}
                        placeholder="Saisissez le code d’accès..."
                        className="w-full bg-gray-50 dark:bg-zinc-950 border border-gray-300 dark:border-zinc-700 focus:border-[#E5B824] focus:bg-white dark:focus:bg-zinc-900 rounded-xl pl-3 pr-9 py-2.5 text-black dark:text-white font-mono text-xs focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowAuthCode(!showAuthCode)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 dark:text-zinc-400 hover:text-black dark:hover:text-white cursor-pointer"
                        aria-label="Afficher ou masquer le code"
                      >
                        {showAuthCode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                {authError && (
                  <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 text-red-800 dark:text-red-300 flex items-start gap-2 text-xs">
                    <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                    <span>{authError}</span>
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowMatrixDetails(!showMatrixDetails)}
                    className="text-[11px] font-semibold text-[#B8860B] dark:text-[#E5B824] hover:underline inline-flex items-center gap-1 cursor-pointer"
                  >
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>
                      {showMatrixDetails
                        ? 'Masquer la matrice des accès dédiés'
                        : 'Consulter la matrice des accès dédiés'}
                    </span>
                  </button>

                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-[#E5B824] hover:bg-[#dcae1f] text-black font-bold text-xs rounded-xl inline-flex items-center gap-2 shadow-sm cursor-pointer"
                  >
                    <Lock className="w-4 h-4" />
                    <span>Valider mes accès & Ouvrir</span>
                  </button>
                </div>
              </form>

              {showMatrixDetails && (
                <div className="bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-2xl p-4 space-y-2.5">
                  <div className="text-[10px] font-heading font-bold uppercase tracking-wider text-black dark:text-white">
                    Référentiel des Accès Dédiés (Matrice en vigueur)
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-[11px] text-gray-700 dark:text-zinc-300">
                      <thead className="border-b border-gray-200 dark:border-zinc-800 text-gray-500 dark:text-zinc-400 uppercase text-[9px]">
                        <tr>
                          <th className="py-1.5 pr-2">Profil</th>
                          <th className="py-1.5 pr-2">Périmètre QR & Tables</th>
                          <th className="py-1.5 pr-2">Identifiant exemple</th>
                          <th className="py-1.5 text-right">Code dédié</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-zinc-800">
                        {AUTH_ROLES.map((rKey) => {
                          const rule = PROFILE_ACCESS_MATRIX[rKey];
                          const sampleId =
                            rKey === 'RESPONSABLE_FINANCE'
                              ? 'tresorier@algb.ci'
                              : rKey === 'ADMIN'
                              ? 'admin@algb.ci'
                              : rKey === 'SUPER_ADMIN'
                              ? 'superadmin@algb.ci'
                              : rKey === 'DELEGUE'
                              ? members.find((m) => m.isRep)?.membershipCardId || 'ALGB-2002-0001'
                              : qrTargetMember?.membershipCardId || members[0]?.membershipCardId || 'ALGB-2002-0001';

                          return (
                            <tr key={rKey} className="hover:bg-white dark:hover:bg-zinc-900">
                              <td className="py-2 pr-2 font-bold text-black dark:text-white">{rule.label}</td>
                              <td className="py-2 pr-2">{rule.scopeLabel}</td>
                              <td className="py-2 pr-2 font-mono text-gray-600 dark:text-zinc-400">{sampleId}</td>
                              <td className="py-2 text-right font-mono font-bold text-[#B8860B] dark:text-[#E5B824]">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setAuthRole(rKey);
                                    setAuthIdentifier(sampleId);
                                    setAuthCode(rule.accessCode);
                                    setAuthError(null);
                                  }}
                                  className="hover:underline cursor-pointer"
                                  title="Utiliser ces identifiants dans le formulaire"
                                >
                                  {rule.accessCode}
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  <p className="text-[10px] text-gray-500 dark:text-zinc-400">
                    Un Membre Adhérent peut également utiliser son propre matricule comme code d’accès personnel pour sa propre carte.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* AUTHENTICATED SESSION BADGE */}
          {qrAuthVerified && qrAuthSession && (
            <div className="px-3.5 py-2 rounded-xl bg-gray-100 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-2 text-[11px]">
              <div className="flex items-center gap-2 text-black dark:text-white font-semibold">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>
                  Habilitation active : <strong>{qrAuthSession.label}</strong> (
                  {qrAuthSession.authenticatedName})
                </span>
              </div>
              <span className="text-[10px] font-mono font-bold text-[#B8860B] dark:text-[#E5B824]">
                {qrAuthSession.scopeLabel}
              </span>
            </div>
          )}

          {/* STEP 1: SCANNER / IDENTIFY CARD (ONLY AFTER AUTH) */}
          {qrAuthVerified && !selectedMember && (
            <div className="space-y-5">
              {/* Camera Scanner Box */}
              <div className="bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-2xl p-4 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h4 className="text-xs font-heading font-bold text-black dark:text-white uppercase tracking-wider">
                      1. Scanner le QR Code de la Carte
                    </h4>
                    <p className="text-[11px] text-gray-600 dark:text-zinc-400">
                      Utilisez la caméra de votre appareil ou collez l’URL/matricule lu par votre lecteur.
                    </p>
                  </div>
                  {!cameraActive ? (
                    <button
                      type="button"
                      onClick={handleStartCamera}
                      className="px-3.5 py-2 bg-black dark:bg-zinc-800 text-white hover:bg-[#E5B824] hover:text-black rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Camera className="w-4 h-4" />
                      <span>Activer la caméra</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={stopCamera}
                      className="px-3.5 py-2 bg-red-600 text-white rounded-xl text-xs font-semibold cursor-pointer"
                    >
                      Arrêter la caméra
                    </button>
                  )}
                </div>

                {cameraActive && (
                  <div className="relative rounded-xl overflow-hidden bg-black aspect-video max-h-56 mx-auto border-2 border-[#E5B824]">
                    <video
                      ref={videoRef}
                      className="w-full h-full object-cover"
                      playsInline
                      muted
                    />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-36 h-36 border-2 border-[#E5B824] rounded-2xl shadow-[0_0_0_9999px_rgba(0,0,0,0.35)]" />
                    </div>
                  </div>
                )}

                {cameraMessage && (
                  <p className="text-[11px] text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 rounded-lg px-3 py-2">
                    {cameraMessage}
                  </p>
                )}

                <form onSubmit={handleManualScanSubmit} className="flex flex-col sm:flex-row gap-2 pt-1">
                  <input
                    type="text"
                    value={scanInput}
                    onChange={(e) => setScanInput(e.target.value)}
                    placeholder="Coller le lien QR scanné ou saisir le matricule (ex: ALGB-2002-0001)"
                    className="flex-1 bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 focus:border-[#E5B824] rounded-xl px-3.5 py-2 text-xs font-mono text-black dark:text-white focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#E5B824] hover:bg-[#dcae1f] text-black font-bold text-xs rounded-xl cursor-pointer shrink-0"
                  >
                    Identifier la carte
                  </button>
                </form>

                {scanError && (
                  <p className="text-[11px] text-red-700 dark:text-red-400 font-medium">{scanError}</p>
                )}
              </div>

              {/* Quick Select Member Card to Flash (filtered by profile matrix scope) */}
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h4 className="text-xs font-heading font-bold text-black dark:text-white uppercase tracking-wider">
                    2. Cartes accessibles selon votre profil ({authorizedDirectoryMembers.length})
                  </h4>
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-gray-400 dark:text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={memberSearch}
                      onChange={(e) => setMemberSearch(e.target.value)}
                      placeholder="Nom, promo ou matricule..."
                      className="pl-8 pr-3 py-1.5 bg-gray-50 dark:bg-zinc-950 border border-gray-300 dark:border-zinc-700 rounded-lg text-xs text-black dark:text-white focus:outline-none focus:border-[#E5B824]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {authorizedDirectoryMembers.map((m) => {
                    const summary = getMemberFinancialSummary(m.id);
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setSelectedMember(m)}
                        className="p-3 rounded-xl bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 hover:border-[#E5B824] hover:bg-yellow-50/40 dark:hover:bg-yellow-500/10 text-left transition-all cursor-pointer flex items-center justify-between gap-3"
                      >
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-black dark:text-white truncate">
                            {m.firstName} {m.lastName}
                          </div>
                          <div className="text-[10px] font-mono text-gray-500 dark:text-zinc-400">
                            {m.membershipCardId} · Promo {m.promotionYear}
                          </div>
                          <div className="text-[10px] mt-1 font-semibold text-[#B8860B] dark:text-[#E5B824]">
                            {summary.overdueMonths.length > 0
                              ? `${summary.overdueMonths.length} mois à régulariser`
                              : 'Cotisations à jour'}
                          </div>
                        </div>
                        <span className="px-2.5 py-1.5 rounded-lg bg-black dark:bg-zinc-800 text-[#E5B824] text-[10px] font-bold shrink-0">
                          Flasher →
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: CONFIGURE & CONFIRM PAYMENT SYNC */}
          {qrAuthVerified && selectedMember && !syncReport && activeMemberSummary && (
            <form onSubmit={handleExecuteSync} className="space-y-5 text-xs">
              {/* Identified Member Card Banner */}
              <div className="p-4 rounded-2xl bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-black text-[#E5B824] font-heading font-bold flex items-center justify-center overflow-hidden shrink-0 border border-[#E5B824]">
                    {selectedMember.avatarUrl ? (
                      <img
                        src={selectedMember.avatarUrl}
                        alt={selectedMember.firstName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span>
                        {selectedMember.firstName[0]}
                        {selectedMember.lastName[0]}
                      </span>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-heading font-bold text-black dark:text-white">
                        {selectedMember.firstName} {selectedMember.lastName}
                      </span>
                      <span className="text-[10px] font-mono font-bold text-[#B8860B] dark:text-[#E5B824]">
                        {selectedMember.membershipCardId}
                      </span>
                    </div>
                    <div className="text-[11px] text-gray-600 dark:text-zinc-400 mt-0.5">
                      Promotion {selectedMember.promotionYear} · {selectedMember.city}, {selectedMember.country}
                    </div>
                    <div className="text-[11px] font-semibold mt-1 text-black dark:text-white">
                      Statut actuel :{' '}
                      <span
                        className={
                          activeMemberSummary.statusFinancial === 'A_JOUR'
                            ? 'text-emerald-700 dark:text-emerald-400'
                            : 'text-[#B8860B] dark:text-[#E5B824]'
                        }
                      >
                        {activeMemberSummary.statusFinancial === 'A_JOUR'
                          ? 'À jour des cotisations'
                          : activeMemberSummary.statusFinancial === 'PARTIEL'
                          ? `Partiel (${activeMemberSummary.overdueMonths.length} mois dus)`
                          : `En retard (${activeMemberSummary.overdueMonths.length} mois dus)`}
                      </span>
                    </div>
                  </div>
                </div>

                {PROFILE_ACCESS_MATRIX[currentRole].scopeType !== 'SELF_ONLY' && (
                  <button
                    type="button"
                    onClick={() => setSelectedMember(null)}
                    className="text-[11px] font-semibold text-gray-600 dark:text-zinc-400 hover:text-black dark:hover:text-white underline cursor-pointer self-start sm:self-center"
                  >
                    Changer de carte
                  </button>
                )}
              </div>

              {/* Pending transactions to validate */}
              {pendingTxs.length > 0 && (
                <div className="space-y-2">
                  <label className="block text-[10px] uppercase tracking-wider font-bold text-gray-700 dark:text-zinc-300">
                    Paiements en attente de pointage ({pendingTxs.length})
                  </label>
                  <div className="space-y-1.5">
                    {pendingTxs.map((tx) => {
                      const checked = selectedPendingIds.includes(tx.id);
                      return (
                        <label
                          key={tx.id}
                          className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer ${
                            checked
                              ? 'bg-yellow-50 dark:bg-yellow-500/15 border-[#E5B824]'
                              : 'bg-white dark:bg-zinc-950 border-gray-200 dark:border-zinc-800'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => togglePendingTx(tx.id)}
                              className="rounded border-gray-300 text-[#E5B824] focus:ring-[#E5B824]"
                            />
                            <div>
                              <div className="font-bold text-black dark:text-white">{tx.title}</div>
                              <div className="text-[10px] font-mono text-gray-500 dark:text-zinc-400">
                                Réf. {tx.reference} · {tx.method.replace('_', ' ')}
                              </div>
                            </div>
                          </div>
                          <span className="font-mono font-bold text-black dark:text-white tabular-nums">
                            {tx.amount.toLocaleString('fr-FR')} {settings.currency}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Adhesion Fee if not paid */}
              {!activeMemberSummary.hasPaidAdhesion && (
                <label className="flex items-center justify-between p-3.5 rounded-xl bg-yellow-50 dark:bg-yellow-500/15 border border-[#E5B824] cursor-pointer">
                  <div className="flex items-center gap-2.5">
                    <input
                      type="checkbox"
                      checked={payAdhesion}
                      onChange={(e) => setPayAdhesion(e.target.checked)}
                      className="rounded border-gray-300 text-[#E5B824] focus:ring-[#E5B824]"
                    />
                    <div>
                      <div className="font-bold text-black dark:text-white">
                        Régulariser les Droits d’Adhésion Statutaires
                      </div>
                      <div className="text-[10px] text-gray-600 dark:text-zinc-300">
                        Active définitivement la carte officielle ALGB du membre
                      </div>
                    </div>
                  </div>
                  <span className="font-mono font-bold text-[#B8860B] dark:text-[#E5B824] tabular-nums">
                    {settings.droitAdhesionAmount.toLocaleString('fr-FR')} {settings.currency}
                  </span>
                </label>
              )}

              {/* Monthly Dues Selection */}
              <div className="space-y-2.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <label className="text-[10px] uppercase tracking-wider font-bold text-gray-700 dark:text-zinc-300">
                    Cotisations Mensuelles {settings.fiscalYear} ({settings.cotisationMensuelleAmount.toLocaleString('fr-FR')} {settings.currency} / mois)
                  </label>
                  <div className="flex items-center gap-2 text-[11px]">
                    {activeMemberSummary.overdueMonths.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setSelectedMonths(activeMemberSummary.overdueMonths)}
                        className="text-[#B8860B] dark:text-[#E5B824] font-bold hover:underline cursor-pointer"
                      >
                        Retards ({activeMemberSummary.overdueMonths.length})
                      </button>
                    )}
                    <span className="text-gray-300 dark:text-zinc-700">·</span>
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedMonths(
                          MONTHS_2026.filter(
                            (m) => !activeMemberSummary.paidMonths.includes(m.key)
                          ).map((m) => m.key)
                        )
                      }
                      className="text-black dark:text-white font-semibold hover:underline cursor-pointer"
                    >
                      Soldes restants
                    </button>
                    <span className="text-gray-300 dark:text-zinc-700">·</span>
                    <button
                      type="button"
                      onClick={() => setSelectedMonths([])}
                      className="text-gray-500 dark:text-zinc-400 hover:text-black dark:hover:text-white cursor-pointer"
                    >
                      Effacer
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {MONTHS_2026.map((m) => {
                    const alreadyPaid = activeMemberSummary.paidMonths.includes(m.key);
                    const isSelected = selectedMonths.includes(m.key);
                    return (
                      <button
                        key={m.key}
                        type="button"
                        disabled={alreadyPaid}
                        onClick={() => toggleMonth(m.key)}
                        className={`p-2 rounded-lg border text-left transition-all ${
                          alreadyPaid
                            ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 cursor-default opacity-80'
                            : isSelected
                            ? 'bg-[#E5B824] border-black text-black font-bold cursor-pointer'
                            : 'bg-gray-50 dark:bg-zinc-950 border-gray-200 dark:border-zinc-800 text-gray-700 dark:text-zinc-300 hover:border-gray-400 dark:hover:border-zinc-600 cursor-pointer'
                        }`}
                      >
                        <div className="text-[11px] font-bold">{m.short}</div>
                        <div className="text-[9px] font-mono">
                          {alreadyPaid ? 'Payé' : isSelected ? 'Sélect.' : 'À payer'}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Optional Project Contribution */}
              <div className="bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl p-3.5 space-y-3">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="font-bold text-black dark:text-white">
                    Ajouter une contribution aux Chantiers & Projets du Lycée
                  </span>
                  <input
                    type="checkbox"
                    checked={includeProjectDonation}
                    onChange={(e) => setIncludeProjectDonation(e.target.checked)}
                    className="rounded border-gray-300 text-[#E5B824] focus:ring-[#E5B824]"
                  />
                </label>

                {includeProjectDonation && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <div className="sm:col-span-2">
                      <select
                        value={selectedProjectId}
                        onChange={(e) => setSelectedProjectId(e.target.value)}
                        className="w-full bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded-lg p-2 text-xs text-black dark:text-white focus:outline-none focus:border-[#E5B824]"
                      >
                        {projects.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.title}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <input
                        type="number"
                        min="1000"
                        step="1000"
                        value={projectAmount}
                        onChange={(e) => setProjectAmount(Number(e.target.value) || 0)}
                        className="w-full bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded-lg p-2 text-xs font-mono font-bold text-black dark:text-white focus:outline-none focus:border-[#E5B824]"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Payment Method */}
              <div className="space-y-2">
                <label className="block text-[10px] uppercase tracking-wider font-bold text-gray-700 dark:text-zinc-300">
                  Canal de règlement utilisé
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {(
                    [
                      { id: 'ORANGE_MONEY', label: 'Orange Money', Icon: Smartphone },
                      { id: 'MTN_MOMO', label: 'MTN MoMo', Icon: Smartphone },
                      { id: 'MOOV_MONEY', label: 'Moov Money', Icon: Smartphone },
                      { id: 'CARTE_BANCAIRE', label: 'Carte Bancaire', Icon: CreditCard },
                      { id: 'ESPECES', label: 'Guichet / Espèces', Icon: Banknote },
                    ] as const
                  ).map(({ id, label, Icon }) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setMethod(id)}
                      className={`p-2 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-1.5 ${
                        method === id
                          ? 'bg-black dark:bg-zinc-950 text-[#E5B824] border-black dark:border-[#E5B824] font-bold'
                          : 'bg-gray-50 dark:bg-zinc-950 text-gray-700 dark:text-zinc-300 border-gray-200 dark:border-zinc-800 hover:border-gray-400 dark:hover:border-zinc-600'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5 shrink-0" />
                      <span className="text-[10px] leading-tight">{label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Note / Référence complémentaire (optionnel)"
                  className="w-full bg-gray-50 dark:bg-zinc-950 border border-gray-300 dark:border-zinc-700 rounded-xl px-3 py-2 text-xs text-black dark:text-white focus:outline-none focus:border-[#E5B824]"
                />
              </div>

              {/* Summary Footer & CTA */}
              <div className="pt-3 border-t border-gray-200 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] uppercase tracking-wider font-bold text-gray-500 dark:text-zinc-400 block">
                    Total à encaisser & synchroniser
                  </span>
                  <span className="text-xl font-mono font-bold text-black dark:text-white tabular-nums">
                    {totalToSync.toLocaleString('fr-FR')} {settings.currency}
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={totalToSync <= 0}
                  className="px-5 py-3 bg-[#E5B824] hover:bg-[#dcae1f] text-black font-bold text-xs rounded-xl inline-flex items-center justify-center gap-2 shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Valider & Mettre à jour toutes les tables</span>
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: MULTI-TABLE SYNC CONFIRMATION REPORT */}
          {qrAuthVerified && syncReport && (
            <div className="space-y-5 text-xs">
              <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-start gap-3.5">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-base font-heading font-bold text-black dark:text-white">
                    Espace de paiement et tables synchronisés
                  </h4>
                  <p className="text-xs text-gray-700 dark:text-zinc-300 mt-1">
                    Règlement de{' '}
                    <strong className="font-mono text-black dark:text-white">
                      {syncReport.totalProcessedAmount.toLocaleString('fr-FR')} {settings.currency}
                    </strong>{' '}
                    enregistré à {syncReport.timestamp} pour{' '}
                    <strong className="text-black dark:text-white">
                      {syncReport.member.firstName} {syncReport.member.lastName}
                    </strong>{' '}
                    ({syncReport.member.membershipCardId}).
                  </p>
                </div>
              </div>

              {/* Updated Tables Checklist */}
              <div className="bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-2xl p-4 space-y-2.5">
                <div className="flex items-center gap-2 text-[11px] font-heading font-bold uppercase tracking-wider text-black dark:text-white">
                  <Database className="w-4 h-4 text-[#B8860B] dark:text-[#E5B824]" />
                  <span>Tables mises à jour sur le portail</span>
                </div>
                <ul className="space-y-1.5">
                  {syncReport.updatedTables.map((tbl) => (
                    <li
                      key={tbl}
                      className="flex items-center gap-2 text-xs text-gray-800 dark:text-zinc-200 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg px-3 py-2"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span>{tbl}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Generated Receipts */}
              {syncReport.createdTransactions.length > 0 && (
                <div className="space-y-2">
                  <div className="text-[11px] font-heading font-bold uppercase tracking-wider text-gray-700 dark:text-zinc-300">
                    Quittances générées ({syncReport.createdTransactions.length})
                  </div>
                  <div className="space-y-1.5">
                    {syncReport.createdTransactions.map((tx) => (
                      <div
                        key={tx.id}
                        className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800"
                      >
                        <div>
                          <div className="font-bold text-black dark:text-white">{tx.title}</div>
                          <div className="text-[10px] font-mono text-gray-500 dark:text-zinc-400">
                            {tx.receiptNumber} · Réf. {tx.reference}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400 tabular-nums">
                            {tx.amount.toLocaleString('fr-FR')} {tx.currency}
                          </span>
                          <button
                            type="button"
                            onClick={() => setViewingTransactionReceipt(tx)}
                            className="px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 border border-gray-300 dark:border-zinc-700 text-black dark:text-white font-semibold inline-flex items-center gap-1 cursor-pointer"
                          >
                            <FileText className="w-3 h-3 text-[#B8860B] dark:text-[#E5B824]" />
                            <span>Reçu</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Navigation Actions */}
              <div className="flex flex-wrap items-center justify-end gap-2.5 pt-2 border-t border-gray-200 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => {
                    setViewingCardMember(syncReport.member);
                    closeQrSyncModal();
                  }}
                  className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 border border-gray-300 dark:border-zinc-700 text-black dark:text-white font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5 text-[#B8860B] dark:text-[#E5B824]" />
                  <span>Voir la Carte actualisée</span>
                </button>

                {canAccessAdmin && (
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('admin');
                      closeQrSyncModal();
                    }}
                    className="px-4 py-2 rounded-xl bg-black dark:bg-zinc-800 hover:bg-gray-800 dark:hover:bg-zinc-700 text-white font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <Building2 className="w-3.5 h-3.5 text-[#E5B824]" />
                    <span>Trésorerie Admin</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    if (currentUser?.id !== syncReport.member.id) {
                      setCurrentUser(syncReport.member);
                    }
                    setActiveTab('espace-membre');
                    closeQrSyncModal();
                  }}
                  className="px-5 py-2 rounded-xl bg-[#E5B824] hover:bg-[#dcae1f] text-black font-bold inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Ouvrir Espace de Paiement</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
