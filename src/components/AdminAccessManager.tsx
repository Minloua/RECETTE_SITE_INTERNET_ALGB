import React, { useEffect, useState } from 'react';
import { useApp, NavigationTab, UserRole } from '../context/AppContext';
import {
  AccessCredential,
  MENU_DEFINITIONS,
  PROFILE_ACCESS_MATRIX,
  UNRESTRICTED_ACCESS_OVERRIDE,
} from '../utils/accessMatrix';
import {
  AlertTriangle,
  Check,
  CheckCircle2,
  Clock,
  Copy,
  CreditCard,
  Edit3,
  Eye,
  EyeOff,
  Globe,
  KeyRound,
  Loader2,
  Lock,
  Mail,
  PlusCircle,
  RefreshCw,
  Save,
  Search,
  Send,
  ShieldCheck,
  Trash2,
  UserCheck,
  UserX,
  X,
} from 'lucide-react';

type AuthRoleKey = Exclude<UserRole, 'VISITEUR'>;

const ASSIGNABLE_ROLES: AuthRoleKey[] = [
  'MEMBRE',
  'DELEGUE',
  'RESPONSABLE_COMM',
  'RESPONSABLE_FINANCE',
  'ADMIN',
  'SUPER_ADMIN',
];

function generateRandomSecret(role: AuthRoleKey): string {
  const prefixMap: Record<AuthRoleKey, string> = {
    MEMBRE: 'MEM',
    DELEGUE: 'DEL',
    RESPONSABLE_COMM: 'COM',
    RESPONSABLE_FINANCE: 'FIN',
    ADMIN: 'ADM',
    SUPER_ADMIN: 'SUP',
  };
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let rand = '';
  for (let i = 0; i < 6; i++) {
    rand += chars[Math.floor(Math.random() * chars.length)];
  }
  return `ALGB-${prefixMap[role]}-${rand}`;
}

export const AdminAccessManager: React.FC = () => {
  const {
    currentRole,
    activeCredential,
    members,
    settings,
    updateSettings,
    accessCredentials,
    sendingCredentialIds,
    visitorAllowedMenus,
    roleMenuPermissions,
    createAccessCredential,
    sendCredentialEmail,
    updateAccessCredential,
    deleteAccessCredential,
    updateVisitorAllowedMenus,
    updateRoleMenuPermissions,
    getMemberFinancialSummary,
    isMemberUpToDate,
    openPaymentModal,
    addToast,
  } = useApp();

  const isSuperAdmin = UNRESTRICTED_ACCESS_OVERRIDE || currentRole === 'SUPER_ADMIN';

  // Sender email settings state
  const [senderEmailInput, setSenderEmailInput] = useState<string>(
    settings.credentialSenderEmail || settings.officialEmail
  );
  const [senderNameInput, setSenderNameInput] = useState<string>(
    settings.credentialSenderName || 'Secrétariat Général ALGB'
  );
  const [autoSendEnabled, setAutoSendEnabled] = useState<boolean>(
    settings.autoSendCredentialEmail !== false
  );
  const [ackCopyEnabled, setAckCopyEnabled] = useState<boolean>(
    settings.credentialAckCopyToAdmin !== false
  );

  useEffect(() => {
    setSenderEmailInput(settings.credentialSenderEmail || settings.officialEmail);
    setSenderNameInput(settings.credentialSenderName || 'Secrétariat Général ALGB');
    setAutoSendEnabled(settings.autoSendCredentialEmail !== false);
    setAckCopyEnabled(settings.credentialAckCopyToAdmin !== false);
    setSendNowOnCreate(settings.autoSendCredentialEmail !== false);
  }, [
    settings.credentialSenderEmail,
    settings.credentialSenderName,
    settings.autoSendCredentialEmail,
    settings.credentialAckCopyToAdmin,
    settings.officialEmail,
  ]);

  // Creation form state
  const [linkedMemberId, setLinkedMemberId] = useState<string>('');
  const [displayName, setDisplayName] = useState<string>('');
  const [identifier, setIdentifier] = useState<string>('');
  const [recipientEmail, setRecipientEmail] = useState<string>('');
  const [sendNowOnCreate, setSendNowOnCreate] = useState<boolean>(
    settings.autoSendCredentialEmail !== false
  );
  const [role, setRole] = useState<AuthRoleKey>('MEMBRE');
  const [secretCode, setSecretCode] = useState<string>(() => generateRandomSecret('MEMBRE'));
  const [allowedTabs, setAllowedTabs] = useState<NavigationTab[]>(roleMenuPermissions.MEMBRE);
  const [notes, setNotes] = useState<string>('');

  // List filters & visibility
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'ALL' | AuthRoleKey>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'SUSPENDED'>('ALL');
  const [revealedIds, setRevealedIds] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Inline editing state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<{
    displayName: string;
    identifier: string;
    recipientEmail: string;
    secretCode: string;
    role: AuthRoleKey;
    linkedMemberId: string;
    allowedTabs: NavigationTab[];
    notes: string;
  } | null>(null);

  const inputClass =
    'w-full bg-[#F8F8F6] dark:bg-[#141413] border border-[#141413]/15 dark:border-white/15 focus:border-[#F2B705] focus:bg-white dark:focus:bg-[#1e1e1c] rounded-lg p-2.5 text-xs text-[#141413] dark:text-white placeholder-[#4A4A48]/60 dark:placeholder-zinc-500 focus:outline-none transition-colors';

  const publicMenus = MENU_DEFINITIONS.filter((m) => m.category === 'PUBLIC');

  const handleToggleVisitorMenu = (tab: NavigationTab) => {
    if (tab === 'accueil') return;
    const exists = visitorAllowedMenus.includes(tab);
    const next = exists
      ? visitorAllowedMenus.filter((t) => t !== tab)
      : [...visitorAllowedMenus, tab];
    updateVisitorAllowedMenus(next);
  };

  const handleSaveMailSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      credentialSenderEmail: senderEmailInput.trim(),
      credentialSenderName: senderNameInput.trim(),
      autoSendCredentialEmail: autoSendEnabled,
      credentialAckCopyToAdmin: ackCopyEnabled,
    });
    setSendNowOnCreate(autoSendEnabled);
  };

  const handleSelectLinkedMember = (memberId: string) => {
    setLinkedMemberId(memberId);
    if (!memberId) return;
    const found = members.find((m) => m.id === memberId);
    if (found) {
      setDisplayName(`${found.firstName} ${found.lastName}`);
      setIdentifier(found.email || found.membershipCardId);
      setRecipientEmail(found.email || '');
      if (found.isRep && role === 'MEMBRE') {
        setRole('DELEGUE');
        setAllowedTabs(roleMenuPermissions.DELEGUE);
        setSecretCode(generateRandomSecret('DELEGUE'));
      }
    }
  };

  const handleRoleChange = (nextRole: AuthRoleKey) => {
    setRole(nextRole);
    setAllowedTabs(roleMenuPermissions[nextRole]);
    if (!secretCode.trim()) {
      setSecretCode(generateRandomSecret(nextRole));
    }
  };

  const toggleCreateTab = (tab: NavigationTab) => {
    if (tab === 'accueil') return;
    setAllowedTabs((prev) =>
      prev.includes(tab) ? prev.filter((t) => t !== tab) : [...prev, tab]
    );
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (role === 'SUPER_ADMIN' && !isSuperAdmin) {
      addToast(
        'error',
        'Habilitation requise',
        'Seul un Super Administrateur peut créer un credential Super Administrateur.'
      );
      return;
    }

    const created = createAccessCredential({
      identifier,
      secretCode,
      displayName,
      role,
      linkedMemberId: linkedMemberId || undefined,
      recipientEmail: recipientEmail.trim() || undefined,
      allowedTabs,
      notes,
      skipAutoEmail: !sendNowOnCreate,
    });

    if (created) {
      setLinkedMemberId('');
      setDisplayName('');
      setIdentifier('');
      setRecipientEmail('');
      setRole('MEMBRE');
      setSecretCode(generateRandomSecret('MEMBRE'));
      setAllowedTabs(roleMenuPermissions.MEMBRE);
      setNotes('');
    }
  };

  const toggleReveal = (id: string) => {
    setRevealedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCopyCredentials = async (cred: AccessCredential) => {
    const text = `Accès ALGB (${PROFILE_ACCESS_MATRIX[cred.role].label})\nIdentifiant : ${cred.identifier}\nCode d'accès : ${cred.secretCode}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(cred.id);
      addToast('success', 'Accès copiés', `Identifiant et code de ${cred.displayName} copiés.`);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      addToast('info', 'Copie manuelle', `ID : ${cred.identifier} | Code : ${cred.secretCode}`);
    }
  };

  const startEditing = (cred: AccessCredential) => {
    setEditingId(cred.id);
    const linked = cred.linkedMemberId
      ? members.find((m) => m.id === cred.linkedMemberId)
      : undefined;
    setEditForm({
      displayName: cred.displayName,
      identifier: cred.identifier,
      recipientEmail:
        cred.recipientEmail ||
        (cred.identifier.includes('@') ? cred.identifier : linked?.email || ''),
      secretCode: cred.secretCode,
      role: cred.role,
      linkedMemberId: cred.linkedMemberId || '',
      allowedTabs: cred.allowedTabs,
      notes: cred.notes || '',
    });
  };

  const handleSaveEdit = (credId: string) => {
    if (!editForm) return;
    if (editForm.role === 'SUPER_ADMIN' && !isSuperAdmin) {
      addToast(
        'error',
        'Habilitation requise',
        'Seul un Super Administrateur peut attribuer le profil Super Administrateur.'
      );
      return;
    }
    updateAccessCredential(credId, {
      displayName: editForm.displayName.trim(),
      identifier: editForm.identifier.trim(),
      recipientEmail: editForm.recipientEmail.trim() || undefined,
      secretCode: editForm.secretCode.trim(),
      role: editForm.role,
      linkedMemberId: editForm.linkedMemberId || undefined,
      allowedTabs: Array.from(new Set<NavigationTab>(['accueil', ...editForm.allowedTabs])),
      notes: editForm.notes.trim() || undefined,
    });
    setEditingId(null);
    setEditForm(null);
  };

  const filteredCredentials = accessCredentials.filter((cred) => {
    const q = searchTerm.trim().toLowerCase();
    const matchesSearch =
      !q ||
      cred.displayName.toLowerCase().includes(q) ||
      cred.identifier.toLowerCase().includes(q) ||
      PROFILE_ACCESS_MATRIX[cred.role].label.toLowerCase().includes(q);
    const matchesRole = roleFilter === 'ALL' || cred.role === roleFilter;
    const matchesStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'ACTIVE' && cred.isActive) ||
      (statusFilter === 'SUSPENDED' && !cred.isActive);
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleToggleDefaultRoleMenu = (roleKey: AuthRoleKey, tab: NavigationTab) => {
    if (tab === 'accueil') return;
    const currentList = roleMenuPermissions[roleKey] || [];
    const next = currentList.includes(tab)
      ? currentList.filter((t) => t !== tab)
      : [...currentList, tab];
    updateRoleMenuPermissions(roleKey, next);
  };

  return (
    <div className="space-y-8 text-xs">
      {/* 1. VISITOR PUBLIC MENUS (NO CREDENTIAL REQUIRED) */}
      <div className="bg-white dark:bg-[#1e1e1c] border border-[#141413]/10 dark:border-white/10 rounded-xl p-6 sm:p-8 space-y-5 shadow-editorial">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-[#141413]/10 dark:border-white/10">
          <div>
            <span className="text-[10px] uppercase tracking-wider font-bold text-[#141413] dark:text-[#F2B705] flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-[#F2B705]" />
              <span>Accès Public Sans Credential</span>
            </span>
            <h3 className="text-lg font-bold font-heading text-[#141413] dark:text-white mt-1">
              Menus ouverts aux Visiteurs (sans authentification)
            </h3>
            <p className="text-xs text-[#4A4A48] dark:text-zinc-400 mt-1">
              Toutes les rubriques présentant l’Amicale et ses activités (Accueil, L’Amicale, Histoire, Événements, Mécénat, Médiathèque, Adhésion, Contact) sont toujours ouvertes sans credential. Les encarts « Trouver un Mentor », « Collège des Parrains » et « Carrières au cœur du réseau » restent réservés aux membres à jour de cotisation.
            </p>
          </div>

          <span className="px-3 py-1.5 rounded-lg bg-[#F0FDF9] dark:bg-[#0f2422] border border-[#134E4A]/30 dark:border-emerald-800 text-[#134E4A] dark:text-emerald-400 font-semibold shrink-0 w-fit">
            {publicMenus.filter((m) => m.lockedForVisitors || visitorAllowedMenus.includes(m.tab)).length} / {publicMenus.length} menus publics actifs
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {publicMenus.map((menu) => {
            const isChecked = !!menu.lockedForVisitors || visitorAllowedMenus.includes(menu.tab);
            return (
              <label
                key={menu.tab}
                className={`flex items-start gap-3 p-3.5 rounded-xl border transition-all ${
                  menu.lockedForVisitors
                    ? 'bg-[#F0FDF9]/60 dark:bg-[#0f2422]/40 border-[#134E4A]/25 dark:border-emerald-900/60 cursor-not-allowed'
                    : isChecked
                    ? 'bg-[#FEF8E6] dark:bg-[#2a2719] border-[#F2B705]/60 cursor-pointer'
                    : 'bg-[#F8F8F6] dark:bg-[#141413] border-[#141413]/10 dark:border-white/10 hover:border-[#141413]/30 dark:hover:border-white/25 cursor-pointer'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  disabled={menu.lockedForVisitors}
                  onChange={() => handleToggleVisitorMenu(menu.tab)}
                  className="mt-0.5 accent-[#F2B705] w-4 h-4 shrink-0 cursor-pointer"
                />
                <div className="min-w-0">
                  <div className="font-bold text-[#141413] dark:text-white flex items-center gap-1.5 flex-wrap">
                    <span>{menu.label}</span>
                    {menu.lockedForVisitors && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#134E4A] text-white font-semibold">
                        Public · Sans credential
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-[#4A4A48] dark:text-zinc-400 mt-0.5 leading-snug">
                    {menu.description}
                  </p>
                </div>
              </label>
            );
          })}
        </div>
      </div>

      {/* 1B. EMAIL DISPATCH & ACKNOWLEDGMENT PARAMETERS */}
      <div className="bg-white dark:bg-[#1e1e1c] border border-[#141413]/10 dark:border-white/10 rounded-xl p-6 sm:p-8 space-y-5 shadow-editorial">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-[#141413]/10 dark:border-white/10">
          <div>
            <span className="text-[10px] uppercase tracking-wider font-bold text-[#141413] dark:text-[#F2B705] flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-[#F2B705]" />
              <span>Notification E-mail & Accusé de Réception</span>
            </span>
            <h3 className="text-lg font-bold font-heading text-[#141413] dark:text-white mt-1">
              Paramètres d’expédition automatique des Credentials
            </h3>
            <p className="text-xs text-[#4A4A48] dark:text-zinc-400 mt-1">
              Dès qu’un credential est créé (manuellement, par validation d’adhésion ou par enrôlement en ligne), la route serveur{' '}
              <code className="font-mono text-[#141413] dark:text-zinc-200">/api/credentials/send-email</code> envoie les accès avec un lien d’accusé de réception.
            </p>
          </div>
        </div>

        <form onSubmit={handleSaveMailSettings} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-[#141413] dark:text-zinc-200 mb-1">
                Adresse e-mail d’expédition & de réception des accusés *
              </label>
              <input
                type="email"
                required
                value={senderEmailInput}
                onChange={(e) => setSenderEmailInput(e.target.value)}
                placeholder="ex: secretariat@algb-bingerville.ci"
                className={`${inputClass} font-mono`}
              />
            </div>

            <div>
              <label className="block font-semibold text-[#141413] dark:text-zinc-200 mb-1">
                Nom d’expéditeur affiché *
              </label>
              <input
                type="text"
                required
                value={senderNameInput}
                onChange={(e) => setSenderNameInput(e.target.value)}
                placeholder="Secrétariat Général ALGB"
                className={inputClass}
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
            <div className="flex flex-wrap gap-5">
              <label className="inline-flex items-center gap-2 text-[#141413] dark:text-zinc-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoSendEnabled}
                  onChange={(e) => setAutoSendEnabled(e.target.checked)}
                  className="accent-[#F2B705] w-4 h-4"
                />
                <span>Envoi automatique dès création</span>
              </label>

              <label className="inline-flex items-center gap-2 text-[#141413] dark:text-zinc-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={ackCopyEnabled}
                  onChange={(e) => setAckCopyEnabled(e.target.checked)}
                  className="accent-[#F2B705] w-4 h-4"
                />
                <span>Copie BCC & accusé vers l’adresse administrateur</span>
              </label>
            </div>

            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-[#141413] dark:bg-white/10 hover:bg-[#141413]/90 dark:hover:bg-white/15 text-[#F2B705] font-bold flex items-center gap-1.5 cursor-pointer border border-transparent dark:border-[#F2B705]/40"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Enregistrer l’expéditeur</span>
            </button>
          </div>
        </form>
      </div>

      {/* 2. CREATE NEW CREDENTIAL FORM */}
      <div className="bg-white dark:bg-[#1e1e1c] border border-[#141413]/10 dark:border-white/10 rounded-xl p-6 sm:p-8 space-y-6 shadow-editorial">
        <div className="pb-4 border-b border-[#141413]/10 dark:border-white/10">
          <span className="text-[10px] uppercase tracking-wider font-bold text-[#141413] dark:text-[#F2B705] flex items-center gap-1.5">
            <PlusCircle className="w-3.5 h-3.5 text-[#F2B705]" />
            <span>Attribution d’Accès Nominatifs & Fonctionnels</span>
          </span>
          <h3 className="text-lg font-bold font-heading text-[#141413] dark:text-white mt-1">
            Créer un nouveau Credential d’accès
          </h3>
          <p className="text-xs text-[#4A4A48] dark:text-zinc-400 mt-1">
            Générez des identifiants dédiés pour les adhérents, délégués de promotion, responsables communication, trésoriers ou administrateurs.
          </p>
        </div>

        <form onSubmit={handleCreateSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-[#141413] dark:text-zinc-200 mb-1">
                Rattacher un ancien élève (optionnel)
              </label>
              <select
                value={linkedMemberId}
                onChange={(e) => handleSelectLinkedMember(e.target.value)}
                className={inputClass}
              >
                <option value="">— Compte fonctionnel libre / non rattaché —</option>
                {members.map((m) => {
                  const upToDate = isMemberUpToDate(m.id);
                  return (
                    <option key={m.id} value={m.id}>
                      {m.firstName} {m.lastName} · Promo {m.promotionYear} ({m.membershipCardId}) ·{' '}
                      {upToDate ? 'Cotisation à jour' : 'À régulariser'}
                    </option>
                  );
                })}
              </select>
              {linkedMemberId && (
                <div className="mt-1.5 text-[11px] flex items-center gap-1.5">
                  {isMemberUpToDate(linkedMemberId) ? (
                    <span className="text-[#134E4A] dark:text-emerald-400 font-semibold inline-flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      <span>
                        Cotisation à jour : « Trouver un Mentor », « Collège des Parrains » & « Carrières au cœur du réseau » débloqués
                      </span>
                    </span>
                  ) : (
                    <span className="text-[#C2410C] dark:text-amber-300 font-semibold inline-flex items-center gap-1">
                      <Lock className="w-3.5 h-3.5 shrink-0" />
                      <span>
                        Cotisation non à jour : « Trouver un Mentor », « Collège des Parrains » & « Carrières au cœur du réseau » verrouillés
                      </span>
                    </span>
                  )}
                </div>
              )}
            </div>

            <div>
              <label className="block font-semibold text-[#141413] dark:text-zinc-200 mb-1">
                Profil attribué
              </label>
              <select
                value={role}
                onChange={(e) => handleRoleChange(e.target.value as AuthRoleKey)}
                className={inputClass}
              >
                {ASSIGNABLE_ROLES.map((rKey) => (
                  <option
                    key={rKey}
                    value={rKey}
                    disabled={rKey === 'SUPER_ADMIN' && !isSuperAdmin}
                  >
                    {PROFILE_ACCESS_MATRIX[rKey].label} ({PROFILE_ACCESS_MATRIX[rKey].scopeLabel})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-[#141413] dark:text-zinc-200 mb-1">
                Nom complet ou intitulé du compte *
              </label>
              <input
                type="text"
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="ex: Kouadio Marc (Délégué Promo 2008)"
                className={inputClass}
              />
            </div>

            <div>
              <label className="block font-semibold text-[#141413] dark:text-zinc-200 mb-1">
                Identifiant de connexion (e-mail, matricule ou login) *
              </label>
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => {
                  const val = e.target.value;
                  setIdentifier(val);
                  if (!recipientEmail && val.includes('@')) {
                    setRecipientEmail(val);
                  }
                }}
                placeholder="ex: marc.kouadio@algb-alumni.ci"
                className={`${inputClass} font-mono`}
              />
            </div>

            <div>
              <label className="block font-semibold text-[#141413] dark:text-zinc-200 mb-1">
                E-mail destinataire (pour l’envoi & accusé de réception)
              </label>
              <input
                type="email"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                placeholder="Auto-détecté si l’identifiant est un e-mail"
                className={`${inputClass} font-mono`}
              />
            </div>

            <div>
              <label className="block font-semibold text-[#141413] dark:text-zinc-200 mb-1">
                Code d’accès secret (Credential) *
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  required
                  value={secretCode}
                  onChange={(e) => setSecretCode(e.target.value)}
                  className={`${inputClass} font-mono font-bold`}
                />
                <button
                  type="button"
                  onClick={() => setSecretCode(generateRandomSecret(role))}
                  title="Générer un nouveau code aléatoire"
                  className="px-3 py-2.5 rounded-lg bg-[#F8F8F6] dark:bg-[#141413] border border-[#141413]/15 dark:border-white/15 hover:border-[#F2B705] text-[#141413] dark:text-zinc-200 font-semibold flex items-center gap-1.5 shrink-0 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-[#141413] dark:text-[#F2B705]" />
                  <span>Générer</span>
                </button>
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block font-semibold text-[#141413] dark:text-zinc-200 mb-1">
                Note d’affectation (facultatif)
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="ex: Accès bureau exécutif mandat 2026-2028"
                className={inputClass}
              />
            </div>
          </div>

          {/* Per-credential menu permissions */}
          <div className="p-4 rounded-xl bg-[#F8F8F6] dark:bg-[#141413] border border-[#141413]/10 dark:border-white/10 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <span className="font-bold text-[#141413] dark:text-white">
                Menus accessibles pour ce credential ({allowedTabs.filter((t) => t !== 'galerie').length})
              </span>
              <span className="text-[11px] text-[#4A4A48] dark:text-zinc-400">
                Pré-remplis selon le profil « {PROFILE_ACCESS_MATRIX[role].label} »
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
              {MENU_DEFINITIONS.map((menu) => {
                const checked = allowedTabs.includes(menu.tab);
                return (
                  <label
                    key={menu.tab}
                    className={`flex items-center gap-2 p-2 rounded-lg border text-[11px] transition-colors ${
                      menu.tab === 'accueil'
                        ? 'bg-[#F8F8F6] dark:bg-[#1e1e1c] border-[#141413]/10 dark:border-white/10 cursor-not-allowed'
                        : checked
                        ? 'bg-[#FEF8E6] dark:bg-[#2a2719] border-[#F2B705] text-[#141413] dark:text-[#FEF8E6] font-semibold cursor-pointer'
                        : 'bg-white dark:bg-[#1e1e1c] border-[#141413]/10 dark:border-white/10 text-[#4A4A48] dark:text-zinc-400 cursor-pointer'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      disabled={menu.tab === 'accueil'}
                      onChange={() => toggleCreateTab(menu.tab)}
                      className="accent-[#F2B705] w-3.5 h-3.5 cursor-pointer"
                    />
                    <span className="truncate">{menu.label}</span>
                  </label>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <label className="inline-flex items-center gap-2 text-[#141413] dark:text-zinc-200 cursor-pointer">
              <input
                type="checkbox"
                checked={sendNowOnCreate}
                onChange={(e) => setSendNowOnCreate(e.target.checked)}
                className="accent-[#F2B705] w-4 h-4"
              />
              <span>Envoyer automatiquement par e-mail dès création (avec accusé de réception)</span>
            </label>

            <button
              type="submit"
              className="px-6 py-2.5 bg-[#F2B705] hover:bg-[#dfa704] text-[#141413] font-bold rounded-lg flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <KeyRound className="w-4 h-4" />
              <span>Créer le Credential & Activer l’accès</span>
            </button>
          </div>
        </form>
      </div>

      {/* 3. CREDENTIALS REGISTRY */}
      <div className="bg-white dark:bg-[#1e1e1c] border border-[#141413]/10 dark:border-white/10 rounded-xl p-6 sm:p-8 space-y-5 shadow-editorial">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#141413]/10 dark:border-white/10">
          <div>
            <h3 className="text-lg font-bold font-heading text-[#141413] dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#F2B705]" />
              <span>Registre des Credentials Actifs & Suspendus ({accessCredentials.length})</span>
            </h3>
            <p className="text-xs text-[#4A4A48] dark:text-zinc-400 mt-0.5">
              Chaque credential contrôle l’accès aux espaces protégés du portail ainsi que le déverrouillage des liens QR de paiement.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#4A4A48] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Rechercher..."
                className="bg-[#F8F8F6] dark:bg-[#141413] border border-[#141413]/15 dark:border-white/15 rounded-lg pl-8 pr-3 py-1.5 text-xs text-[#141413] dark:text-white focus:border-[#F2B705] focus:outline-none"
              />
            </div>

            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as 'ALL' | AuthRoleKey)}
              className="bg-[#F8F8F6] dark:bg-[#141413] border border-[#141413]/15 dark:border-white/15 rounded-lg px-2.5 py-1.5 text-xs text-[#141413] dark:text-white focus:border-[#F2B705] focus:outline-none"
            >
              <option value="ALL">Tous profils</option>
              {ASSIGNABLE_ROLES.map((rKey) => (
                <option key={rKey} value={rKey}>
                  {PROFILE_ACCESS_MATRIX[rKey].label}
                </option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'ALL' | 'ACTIVE' | 'SUSPENDED')}
              className="bg-[#F8F8F6] dark:bg-[#141413] border border-[#141413]/15 dark:border-white/15 rounded-lg px-2.5 py-1.5 text-xs text-[#141413] dark:text-white focus:border-[#F2B705] focus:outline-none"
            >
              <option value="ALL">Tous statuts</option>
              <option value="ACTIVE">Actifs</option>
              <option value="SUSPENDED">Suspendus</option>
            </select>
          </div>
        </div>

        <div className="space-y-3">
          {filteredCredentials.map((cred) => {
            const isRevealed = !!revealedIds[cred.id];
            const isSelf = activeCredential?.id === cred.id;
            const isSendingEmail = sendingCredentialIds.includes(cred.id);
            const isEditing = editingId === cred.id && editForm !== null;
            const linkedMember = cred.linkedMemberId
              ? members.find((m) => m.id === cred.linkedMemberId)
              : null;
            const linkedSummary = linkedMember ? getMemberFinancialSummary(linkedMember.id) : null;
            const linkedUpToDate = linkedMember ? isMemberUpToDate(linkedMember.id) : false;
            const resolvedEmail =
              cred.recipientEmail ||
              (cred.identifier.includes('@') ? cred.identifier : linkedMember?.email || '');

            return (
              <div
                key={cred.id}
                className={`p-4 rounded-xl border transition-colors ${
                  cred.isActive
                    ? 'bg-[#F8F8F6] dark:bg-[#141413] border-[#141413]/10 dark:border-white/10'
                    : 'bg-red-50/40 dark:bg-red-950/20 border-red-200 dark:border-red-900/60 opacity-85'
                }`}
              >
                {!isEditing ? (
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="space-y-1.5 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-sm text-[#141413] dark:text-white">
                          {cred.displayName}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-[#FEF8E6] dark:bg-[#2a2719] text-[#141413] dark:text-[#FEF8E6] border border-[#F2B705]/40 text-[10px] font-bold">
                          {PROFILE_ACCESS_MATRIX[cred.role].label}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            cred.isActive
                              ? 'bg-[#F0FDF9] dark:bg-[#0f2422] text-[#134E4A] dark:text-emerald-400 border border-[#134E4A]/30 dark:border-emerald-800'
                              : 'bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800'
                          }`}
                        >
                          {cred.isActive ? 'Actif' : 'Suspendu'}
                        </span>
                        {isSelf && (
                          <span className="px-2 py-0.5 rounded bg-[#141413] dark:bg-white text-white dark:text-[#141413] text-[10px] font-bold">
                            Session en cours
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-[#4A4A48] dark:text-zinc-400">
                        <span>
                          Identifiant :{' '}
                          <strong className="font-mono text-[#141413] dark:text-zinc-200">
                            {cred.identifier}
                          </strong>
                        </span>
                        {resolvedEmail && resolvedEmail.toLowerCase() !== cred.identifier.toLowerCase() && (
                          <span>
                            E-mail :{' '}
                            <strong className="font-mono text-[#141413] dark:text-zinc-200">
                              {resolvedEmail}
                            </strong>
                          </span>
                        )}
                        <span className="flex items-center gap-1.5">
                          Code secret :{' '}
                          <strong className="font-mono text-[#141413] dark:text-[#F2B705]">
                            {isRevealed ? cred.secretCode : '••••••••••••'}
                          </strong>
                          <button
                            type="button"
                            onClick={() => toggleReveal(cred.id)}
                            title={isRevealed ? 'Masquer le code' : 'Afficher le code'}
                            className="p-0.5 text-[#4A4A48] hover:text-[#141413] dark:hover:text-white cursor-pointer"
                          >
                            {isRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        </span>
                        <span>
                          Menus :{' '}
                          <strong className="text-[#141413] dark:text-zinc-200">
                            {cred.allowedTabs.filter((t) => t !== 'galerie').length} rubriques
                          </strong>
                        </span>
                      </div>

                      {/* Statut d'envoi e-mail & confirmation de réception */}
                      <div className="flex flex-wrap items-center gap-2 pt-0.5">
                        {isSendingEmail || cred.emailStatus === 'EN_COURS' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-[10px] font-semibold">
                            <Loader2 className="w-3 h-3 animate-spin" />
                            <span>Envoi en cours vers {resolvedEmail || 'destinataire'}...</span>
                          </span>
                        ) : cred.emailStatus === 'ENVOYE' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#F0FDF9] dark:bg-[#0f2422] border border-[#134E4A]/30 dark:border-emerald-800 text-[#134E4A] dark:text-emerald-400 text-[10px] font-semibold">
                            <Mail className="w-3 h-3" />
                            <span>
                              Envoyé le {cred.emailSentAt || cred.createdAt}
                              {cred.emailProvider ? ` (${cred.emailProvider})` : ''}
                            </span>
                          </span>
                        ) : cred.emailStatus === 'ECHEC' ? (
                          <span
                            title={cred.emailError || "Échec lors de l'envoi e-mail"}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-[10px] font-semibold"
                          >
                            <AlertTriangle className="w-3 h-3" />
                            <span>Échec d’envoi</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white dark:bg-[#1e1e1c] border border-[#141413]/15 dark:border-white/15 text-[#4A4A48] dark:text-zinc-400 text-[10px] font-semibold">
                            <Mail className="w-3 h-3" />
                            <span>Non envoyé par e-mail</span>
                          </span>
                        )}

                        {cred.acknowledgedAt && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#F0FDF9] dark:bg-[#0f2422] border border-[#134E4A]/35 dark:border-emerald-700 text-[#134E4A] dark:text-emerald-300 text-[10px] font-semibold">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Accusé confirmé le {cred.acknowledgedAt}</span>
                          </span>
                        )}

                        {cred.firstLoginAt && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#FEF8E6] dark:bg-[#2a2719] border border-[#F2B705]/40 text-[#141413] dark:text-[#FEF8E6] text-[10px] font-semibold">
                            <UserCheck className="w-3 h-3" />
                            <span>1re connexion le {cred.firstLoginAt}</span>
                          </span>
                        )}

                        {!cred.acknowledgedAt && !cred.firstLoginAt && cred.emailStatus === 'ENVOYE' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white dark:bg-[#1e1e1c] border border-[#141413]/15 dark:border-white/15 text-[#4A4A48] dark:text-zinc-400 text-[10px]">
                            <Clock className="w-3 h-3" />
                            <span>En attente d’accusé ou de 1re connexion</span>
                          </span>
                        )}
                      </div>

                      {cred.emailStatus === 'ECHEC' && cred.emailError && (
                        <p className="text-[11px] text-red-700 dark:text-red-400 bg-red-50/70 dark:bg-red-950/30 border border-red-200 dark:border-red-900/60 rounded-lg px-2.5 py-1.5">
                          Détail e-mail : {cred.emailError}
                        </p>
                      )}

                      {/* Statut Cotisation & Éligibilité Mentorat / Collège des Parrains / Carrières */}
                      <div className="flex flex-wrap items-center gap-2">
                        {linkedMember ? (
                          linkedUpToDate ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#F0FDF9] dark:bg-[#0f2422] border border-[#134E4A]/30 dark:border-emerald-800 text-[#134E4A] dark:text-emerald-400 text-[10px] font-semibold">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>
                                Cotisation à jour ({linkedSummary?.paidMonths.length ?? 0}/12) · Mentorat, Parrains & Carrières débloqués
                              </span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#FFF7ED] dark:bg-[#1a1310] border border-[#C2410C]/30 dark:border-amber-800 text-[#C2410C] dark:text-amber-300 text-[10px] font-semibold">
                              <Lock className="w-3 h-3" />
                              <span>
                                Cotisation {linkedSummary?.statusFinancial === 'PARTIEL' ? 'partielle' : 'en retard'} ({linkedSummary?.paidMonths.length ?? 0}/12) · Mentorat, Parrains & Carrières verrouillés
                              </span>
                            </span>
                          )
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white dark:bg-[#1e1e1c] border border-[#141413]/15 dark:border-white/15 text-[#4A4A48] dark:text-zinc-400 text-[10px] font-semibold">
                            <Lock className="w-3 h-3" />
                            <span>Compte sans fiche membre liée · Mentorat, Parrains & Carrières verrouillés</span>
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-[#4A4A48] dark:text-zinc-400">
                        {linkedMember && (
                          <span>
                            Annuaire : {linkedMember.membershipCardId} (Promo {linkedMember.promotionYear})
                          </span>
                        )}
                        <span>Créé le {cred.createdAt} par {cred.createdBy}</span>
                        {cred.lastLoginAt && <span>Dernière connexion : {cred.lastLoginAt}</span>}
                      </div>
                      {cred.notes && (
                        <p className="text-[11px] italic text-[#4A4A48] dark:text-zinc-400">
                          {cred.notes}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      {linkedMember && !linkedUpToDate && (
                        <button
                          type="button"
                          onClick={() =>
                            openPaymentModal({
                              type: 'COTISATION_MENSUELLE',
                              targetMember: linkedMember,
                              selectedMonths: linkedSummary?.overdueMonths,
                            })
                          }
                          className="px-2.5 py-1.5 rounded-lg bg-[#141413] hover:bg-[#1e1e1c] text-[#F2B705] border border-[#F2B705]/40 font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <CreditCard className="w-3.5 h-3.5 text-[#F2B705]" />
                          <span>Régulariser cotisation</span>
                        </button>
                      )}

                      <button
                        type="button"
                        disabled={isSendingEmail}
                        onClick={() => void sendCredentialEmail(cred.id, 'RESEND')}
                        className="px-2.5 py-1.5 rounded-lg bg-[#FEF8E6] dark:bg-[#2a2719] border border-[#F2B705]/50 hover:bg-[#F2B705] hover:text-[#141413] text-[#141413] dark:text-[#FEF8E6] font-semibold flex items-center gap-1 cursor-pointer disabled:opacity-50 transition-colors"
                      >
                        {isSendingEmail ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Send className="w-3.5 h-3.5" />
                        )}
                        <span>
                          {cred.emailStatus === 'ENVOYE' || cred.emailStatus === 'ECHEC'
                            ? 'Renvoyer par e-mail'
                            : 'Envoyer par e-mail'}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleCopyCredentials(cred)}
                        className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-[#1e1e1c] border border-[#141413]/15 dark:border-white/15 hover:border-[#F2B705] text-[#141413] dark:text-zinc-200 font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        {copiedId === cred.id ? (
                          <Check className="w-3.5 h-3.5 text-[#134E4A] dark:text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5 text-[#141413] dark:text-[#F2B705]" />
                        )}
                        <span>Copier</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => startEditing(cred)}
                        className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-[#1e1e1c] border border-[#141413]/15 dark:border-white/15 hover:border-[#141413] dark:hover:border-white text-[#141413] dark:text-zinc-200 font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Modifier</span>
                      </button>

                      <button
                        type="button"
                        disabled={isSelf}
                        onClick={() =>
                          updateAccessCredential(cred.id, { isActive: !cred.isActive })
                        }
                        className={`px-2.5 py-1.5 rounded-lg border font-semibold flex items-center gap-1 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                          cred.isActive
                            ? 'bg-[#FEF8E6] dark:bg-[#2a2719] border-[#F2B705]/40 text-[#141413] dark:text-[#FEF8E6] hover:bg-[#F2B705]/25'
                            : 'bg-[#F0FDF9] dark:bg-[#0f2422] border-[#134E4A]/30 dark:border-emerald-800 text-[#134E4A] dark:text-emerald-400 hover:bg-[#134E4A]/15'
                        }`}
                      >
                        {cred.isActive ? (
                          <>
                            <UserX className="w-3.5 h-3.5" />
                            <span>Suspendre</span>
                          </>
                        ) : (
                          <>
                            <UserCheck className="w-3.5 h-3.5" />
                            <span>Réactiver</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        disabled={isSelf}
                        onClick={() => deleteAccessCredential(cred.id)}
                        title="Supprimer ce credential"
                        className="p-1.5 rounded-lg border border-[#141413]/15 dark:border-white/15 hover:border-red-500 text-red-600 dark:text-red-400 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-[#141413]/10 dark:border-white/10 pb-2">
                      <span className="font-bold text-[#141413] dark:text-white flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5 text-[#F2B705]" />
                        <span>Modifier le credential : {cred.displayName}</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingId(null);
                          setEditForm(null);
                        }}
                        className="p-1 text-[#4A4A48] hover:text-[#141413] dark:hover:text-white cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      <div>
                        <label className="block font-semibold mb-1 text-[#141413] dark:text-zinc-300">
                          Nom affiché
                        </label>
                        <input
                          type="text"
                          value={editForm.displayName}
                          onChange={(e) =>
                            setEditForm({ ...editForm, displayName: e.target.value })
                          }
                          className={inputClass}
                        />
                      </div>

                      <div>
                        <label className="block font-semibold mb-1 text-[#141413] dark:text-zinc-300">
                          Identifiant
                        </label>
                        <input
                          type="text"
                          value={editForm.identifier}
                          onChange={(e) =>
                            setEditForm({ ...editForm, identifier: e.target.value })
                          }
                          className={`${inputClass} font-mono`}
                        />
                      </div>

                      <div>
                        <label className="block font-semibold mb-1 text-[#141413] dark:text-zinc-300">
                          E-mail destinataire
                        </label>
                        <input
                          type="email"
                          value={editForm.recipientEmail}
                          onChange={(e) =>
                            setEditForm({ ...editForm, recipientEmail: e.target.value })
                          }
                          placeholder="destinataire@exemple.com"
                          className={`${inputClass} font-mono`}
                        />
                      </div>

                      <div>
                        <label className="block font-semibold mb-1 text-[#141413] dark:text-zinc-300">
                          Nouveau code secret
                        </label>
                        <div className="flex items-center gap-1.5">
                          <input
                            type="text"
                            value={editForm.secretCode}
                            onChange={(e) =>
                              setEditForm({ ...editForm, secretCode: e.target.value })
                            }
                            className={`${inputClass} font-mono font-bold`}
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setEditForm({
                                ...editForm,
                                secretCode: generateRandomSecret(editForm.role),
                              })
                            }
                            className="p-2.5 rounded-lg bg-[#F8F8F6] dark:bg-[#141413] border border-[#141413]/15 dark:border-white/15 cursor-pointer"
                            title="Générer un nouveau code"
                          >
                            <RefreshCw className="w-3.5 h-3.5 text-[#141413] dark:text-[#F2B705]" />
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block font-semibold mb-1 text-[#141413] dark:text-zinc-300">
                          Profil
                        </label>
                        <select
                          value={editForm.role}
                          onChange={(e) => {
                            const nextRole = e.target.value as AuthRoleKey;
                            setEditForm({
                              ...editForm,
                              role: nextRole,
                              allowedTabs: roleMenuPermissions[nextRole],
                            });
                          }}
                          className={inputClass}
                        >
                          {ASSIGNABLE_ROLES.map((rKey) => (
                            <option
                              key={rKey}
                              value={rKey}
                              disabled={rKey === 'SUPER_ADMIN' && !isSuperAdmin}
                            >
                              {PROFILE_ACCESS_MATRIX[rKey].label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block font-semibold mb-1 text-[#141413] dark:text-zinc-300">
                          Membre rattaché
                        </label>
                        <select
                          value={editForm.linkedMemberId}
                          onChange={(e) =>
                            setEditForm({ ...editForm, linkedMemberId: e.target.value })
                          }
                          className={inputClass}
                        >
                          <option value="">— Aucun membre rattaché —</option>
                          {members.map((m) => (
                            <option key={m.id} value={m.id}>
                              {m.firstName} {m.lastName} ({m.membershipCardId}) ·{' '}
                              {isMemberUpToDate(m.id) ? 'Cotisation à jour' : 'À régulariser'}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block font-semibold mb-1 text-[#141413] dark:text-zinc-300">
                          Notes
                        </label>
                        <input
                          type="text"
                          value={editForm.notes}
                          onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                          className={inputClass}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 pt-1">
                      {MENU_DEFINITIONS.map((menu) => {
                        const checked = editForm.allowedTabs.includes(menu.tab);
                        return (
                          <label
                            key={menu.tab}
                            className="flex items-center gap-2 p-2 rounded-lg border border-[#141413]/15 dark:border-white/15 bg-white dark:bg-[#1e1e1c] text-[11px] cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              disabled={menu.tab === 'accueil'}
                              onChange={() => {
                                if (menu.tab === 'accueil') return;
                                const nextTabs = checked
                                  ? editForm.allowedTabs.filter((t) => t !== menu.tab)
                                  : [...editForm.allowedTabs, menu.tab];
                                setEditForm({ ...editForm, allowedTabs: nextTabs });
                              }}
                              className="accent-[#F2B705] w-3.5 h-3.5"
                            />
                            <span className="truncate">{menu.label}</span>
                          </label>
                        );
                      })}
                    </div>

                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingId(null);
                          setEditForm(null);
                        }}
                        className="px-4 py-2 rounded-lg border border-[#141413]/15 dark:border-white/15 text-[#4A4A48] dark:text-zinc-300 cursor-pointer"
                      >
                        Annuler
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSaveEdit(cred.id)}
                        className="px-5 py-2 rounded-lg bg-[#F2B705] hover:bg-[#dfa704] text-[#141413] font-bold flex items-center gap-1.5 cursor-pointer"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>Enregistrer</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {filteredCredentials.length === 0 && (
            <div className="text-center py-8 text-[#4A4A48] dark:text-zinc-400">
              Aucun credential ne correspond à votre recherche.
            </div>
          )}
        </div>
      </div>

      {/* 4. ROLE MATRIX REFERENCE & DEFAULT MENUS */}
      <div className="bg-white dark:bg-[#1e1e1c] border border-[#141413]/10 dark:border-white/10 rounded-xl p-6 sm:p-8 space-y-5 shadow-editorial">
        <div className="pb-4 border-b border-[#141413]/10 dark:border-white/10">
          <h3 className="text-lg font-bold font-heading text-[#141413] dark:text-white">
            Matrice des Profils & Menus par défaut
          </h3>
          <p className="text-xs text-[#4A4A48] dark:text-zinc-400 mt-1">
            Définissez les rubriques pré-cochées automatiquement lorsque vous créez un credential pour chaque profil.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-[#F8F8F6] dark:bg-[#141413] border border-[#141413]/10 dark:border-white/10 space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="font-bold text-[#141413] dark:text-white">
              {PROFILE_ACCESS_MATRIX.VISITEUR.label}
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] px-2 py-0.5 rounded bg-[#F0FDF9] dark:bg-[#0f2422] border border-[#134E4A]/30 dark:border-emerald-800 text-[#134E4A] dark:text-emerald-300 font-semibold">
                {PROFILE_ACCESS_MATRIX.VISITEUR.scopeLabel}
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded bg-[#FEF8E6] dark:bg-[#2a2719] border border-[#F2B705]/40 text-[#141413] dark:text-[#FEF8E6] font-semibold">
                <Lock className="w-3 h-3" />
                <span>{PROFILE_ACCESS_MATRIX.VISITEUR.mentorshipRuleLabel}</span>
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded bg-[#FEF8E6] dark:bg-[#2a2719] border border-[#F2B705]/40 text-[#141413] dark:text-[#FEF8E6] font-semibold">
                <Lock className="w-3 h-3" />
                <span>{PROFILE_ACCESS_MATRIX.VISITEUR.careersRuleLabel}</span>
              </span>
            </div>
          </div>
          <p className="text-[11px] text-[#4A4A48] dark:text-zinc-400">
            {PROFILE_ACCESS_MATRIX.VISITEUR.description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ASSIGNABLE_ROLES.map((roleKey) => {
            const rule = PROFILE_ACCESS_MATRIX[roleKey];
            const defaults = roleMenuPermissions[roleKey] || [];
            return (
              <div
                key={roleKey}
                className="p-4 rounded-xl bg-[#F8F8F6] dark:bg-[#141413] border border-[#141413]/10 dark:border-white/10 space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-[#141413] dark:text-white">{rule.label}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-[#FEF8E6] dark:bg-[#2a2719] text-[#141413] dark:text-[#FEF8E6] border border-[#F2B705]/40 font-semibold">
                      {rule.scopeLabel}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#4A4A48] dark:text-zinc-400 mt-1">
                    {rule.description}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white dark:bg-[#1e1e1c] border border-[#141413]/15 dark:border-white/15 text-[10px] font-semibold text-[#141413] dark:text-[#F2B705]">
                      <ShieldCheck className="w-3 h-3 shrink-0 text-[#F2B705]" />
                      <span>{rule.mentorshipRuleLabel}</span>
                    </div>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white dark:bg-[#1e1e1c] border border-[#141413]/15 dark:border-white/15 text-[10px] font-semibold text-[#141413] dark:text-zinc-200">
                      <ShieldCheck className="w-3 h-3 shrink-0 text-[#F2B705]" />
                      <span>{rule.careersRuleLabel}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {MENU_DEFINITIONS.map((menu) => {
                    const active = defaults.includes(menu.tab);
                    return (
                      <button
                        key={menu.tab}
                        type="button"
                        disabled={menu.tab === 'accueil'}
                        onClick={() => handleToggleDefaultRoleMenu(roleKey, menu.tab)}
                        className={`px-2 py-1 rounded-lg text-[10px] font-semibold border transition-colors ${
                          menu.tab === 'accueil'
                            ? 'bg-[#F8F8F6] dark:bg-[#1e1e1c] border-[#141413]/15 dark:border-white/15 text-[#4A4A48] dark:text-zinc-400 cursor-not-allowed'
                            : active
                            ? 'bg-[#FEF8E6] dark:bg-[#2a2719] border-[#F2B705] text-[#141413] dark:text-[#FEF8E6] cursor-pointer'
                            : 'bg-white dark:bg-[#1e1e1c] border-[#141413]/10 dark:border-white/10 text-[#4A4A48] dark:text-zinc-400 cursor-pointer'
                        }`}
                      >
                        {menu.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
