import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { fetchSignedQrMetadata, generateMemberQrDataUrl } from '../utils/qrPayload';
import {
  Briefcase,
  Calendar,
  Download,
  GraduationCap,
  MapPin,
  Printer,
  QrCode,
  ShieldCheck,
  Users,
  X,
} from 'lucide-react';

export const MembershipCardModal: React.FC = () => {
  const {
    viewingCardMember,
    setViewingCardMember,
    settings,
    getMemberFinancialSummary,
    openQrSyncModal,
  } = useApp();

  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [qrSigned, setQrSigned] = useState<boolean>(false);
  const [avatarError, setAvatarError] = useState<boolean>(false);

  useEffect(() => {
    setAvatarError(false);
    setQrSigned(false);
    if (!viewingCardMember) {
      setQrDataUrl('');
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const sig = await fetchSignedQrMetadata(viewingCardMember);
        const url = await generateMemberQrDataUrl(viewingCardMember, sig || undefined);
        if (!cancelled) {
          setQrDataUrl(url);
          setQrSigned(Boolean(sig));
        }
      } catch {
        if (!cancelled) {
          setQrDataUrl('');
          setQrSigned(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [viewingCardMember?.id, viewingCardMember?.membershipCardId]);

  if (!viewingCardMember) return null;

  const financialSummary = getMemberFinancialSummary(viewingCardMember.id);

  const statusLabel = (() => {
    if (viewingCardMember.membershipStatus === 'A_JOUR' && financialSummary.statusFinancial === 'A_JOUR') {
      return 'Membre Actif · À jour';
    }
    if (viewingCardMember.membershipStatus === 'A_JOUR') {
      return 'Membre Actif';
    }
    if (viewingCardMember.membershipStatus === 'EN_ATTENTE') {
      return 'En attente de validation';
    }
    return 'Cotisation à régulariser';
  })();

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadQr = () => {
    if (!qrDataUrl) return;
    const link = document.createElement('a');
    link.href = qrDataUrl;
    link.download = `QR_${viewingCardMember.membershipCardId}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFlashQr = () => {
    const target = viewingCardMember;
    setViewingCardMember(null);
    openQrSyncModal(target);
  };

  const cleanSignature = settings.associationSignature.replace(/[«»]/g, '').trim();
  const cleanMotto = settings.associationMessage.replace(/[«»]/g, '').trim();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#141413]/75 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white dark:bg-[#1e1e1c] border border-[#141413]/15 dark:border-white/15 rounded-xl shadow-2xl overflow-hidden my-6">
        {/* Modal Controls */}
        <div className="no-print bg-[#16324F] px-5 sm:px-6 py-3.5 border-b border-[#F2B705]/40 flex flex-wrap items-center justify-between gap-3 text-white">
          <div className="flex items-center gap-2.5 text-xs font-bold text-white">
            <div className="w-7 h-7 rounded-lg bg-[#F2B705] text-[#141413] flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <span>Carte Officielle d’Adhérent ALGB</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleFlashQr}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#141413] text-[#F2B705] border border-[#F2B705]/40 rounded-lg text-xs font-bold hover:bg-black transition-all cursor-pointer shadow-xs"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>Flasher QR (Paiement)</span>
            </button>

            {qrDataUrl && (
              <button
                type="button"
                onClick={handleDownloadQr}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 border border-white/25 text-white rounded-lg text-xs font-semibold hover:bg-white/20 transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-[#F2B705]" />
                <span>QR PNG</span>
              </button>
            )}

            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F2B705] text-[#141413] rounded-lg text-xs font-bold hover:bg-[#dfa704] transition-all cursor-pointer shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimer</span>
            </button>

            <button
              type="button"
              onClick={() => setViewingCardMember(null)}
              aria-label="Fermer la carte"
              className="p-1.5 text-white/80 hover:text-white hover:bg-white/15 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Card Stage */}
        <div className="p-4 sm:p-8 flex flex-col items-center justify-center bg-[#F8F8F6] dark:bg-[#141413]">
          {/* Official ALGB Membership Card (Pure White / Alabaster / Carbon Black / Solar Yellow Charter) */}
          <div className="w-full max-w-[660px] rounded-xl bg-white border-2 border-[#141413] shadow-editorial overflow-hidden relative text-[#141413]">
            {/* Top-right subtle campus architectural backdrop (faded cleanly into white) */}
            <div className="absolute top-0 right-0 w-[62%] h-[155px] pointer-events-none overflow-hidden">
              <img
                src="/assets/images/bingerville_lycee_campus_1794382827777.jpg"
                alt=""
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center opacity-25 grayscale-[30%]"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-white via-white/75 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-white/30" />
            </div>

            {/* Header Row: Circular Crest + Vertical Hairline + Title Block */}
            <div className="relative z-10 px-5 sm:px-7 pt-4 sm:pt-5 pb-2 flex items-center gap-3.5 sm:gap-5">
              {/* Circular Emblem */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white border-[2.5px] border-[#141413] ring-2 ring-[#F2B705]/90 p-1 shadow-md shrink-0 flex items-center justify-center overflow-hidden">
                <img
                  src="/assets/aistudio/IMG-20180925-WA0019_301d84a7.jpg"
                  alt="Logo Officiel ALGB"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain rounded-full"
                />
              </div>

              {/* Vertical Divider */}
              <div className="w-[1.5px] h-14 sm:h-16 bg-[#141413]/25 shrink-0" />

              {/* Institutional Header Typography */}
              <div className="min-w-0 flex-1">
                <div className="text-[10px] sm:text-xs font-heading font-bold uppercase tracking-wider text-[#141413] leading-tight">
                  Amicale des Anciens Élèves
                </div>
                <div className="text-lg sm:text-[23px] font-heading font-extrabold uppercase tracking-tight text-[#141413] leading-none mt-0.5">
                  Lycée de Bingerville
                </div>
                <div className="text-[10px] sm:text-[11px] font-editorial italic font-semibold text-[#16324F] mt-1 truncate">
                  {cleanSignature}
                </div>
              </div>
            </div>

            {/* Top Sweeping Dual-Ribbon Curve (Solar Yellow + Carbon Black) */}
            <div className="relative z-10 w-full -mt-1 pointer-events-none select-none">
              <svg
                viewBox="0 0 660 34"
                className="w-full h-6 sm:h-7 block"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <path
                  d="M 240,29 C 390,28 530,18 660,0 L 660,11 C 530,27 390,32 240,30 Z"
                  fill="#F2B705"
                />
                <path
                  d="M 190,31 C 370,31 530,24 660,7 L 660,17 C 530,31 370,33 190,32 Z"
                  fill="#141413"
                />
              </svg>
            </div>

            {/* Main 3-Column Card Body */}
            <div className="relative z-10 px-5 sm:px-7 pt-1 pb-4 flex flex-col sm:flex-row items-center sm:items-stretch gap-4 sm:gap-5">
              {/* Left Column: Portrait Photo */}
              <div className="w-28 sm:w-[134px] shrink-0">
                <div className="aspect-[3/4] w-full rounded-xl bg-[#F8F8F6] border-2 border-[#141413] shadow-sm overflow-hidden flex flex-col items-center justify-center relative">
                  {viewingCardMember.avatarUrl && !avatarError ? (
                    <img
                      src={viewingCardMember.avatarUrl}
                      alt={`${viewingCardMember.firstName} ${viewingCardMember.lastName}`}
                      referrerPolicy="no-referrer"
                      onError={() => setAvatarError(true)}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-b from-[#F8F8F6] to-[#141413]/10 flex flex-col items-center justify-center p-2 text-center">
                      <span className="text-2xl sm:text-3xl font-heading font-bold text-[#141413]">
                        {viewingCardMember.firstName[0]}
                        {viewingCardMember.lastName[0]}
                      </span>
                      <span className="text-[8px] uppercase tracking-widest font-semibold text-[#4A4A48] mt-1">
                        Photo Officielle
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Center Column: Member Information & Active Capsule */}
              <div className="flex-1 min-w-0 flex flex-col justify-between w-full">
                <div>
                  <h2 className="text-lg sm:text-[20px] font-heading font-bold text-[#141413] tracking-tight leading-snug truncate">
                    {viewingCardMember.firstName} {viewingCardMember.lastName}
                    {viewingCardMember.nickname && (
                      <span className="text-xs font-semibold text-[#16324F] ml-1.5">
                        « {viewingCardMember.nickname} »
                      </span>
                    )}
                  </h2>

                  <ul className="mt-2 space-y-1.5 text-xs text-[#4A4A48]">
                    <li className="flex items-center gap-2.5">
                      <GraduationCap className="w-3.5 h-3.5 text-[#141413] shrink-0" />
                      <span className="truncate">
                        Ancien Élève
                        {viewingCardMember.bacSeries ? ` · ${viewingCardMember.bacSeries}` : ''}
                        {viewingCardMember.isRep ? ' · Délégué' : ''}
                      </span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Calendar className="w-3.5 h-3.5 text-[#141413] shrink-0" />
                      <span className="truncate font-medium text-[#141413]">
                        Promotion : {viewingCardMember.promotionYear}
                        {viewingCardMember.studyLevel ? ` · ${viewingCardMember.studyLevel}` : ''}
                      </span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Briefcase className="w-3.5 h-3.5 text-[#141413] shrink-0" />
                      <span className="truncate">
                        Profession : {viewingCardMember.currentRole}
                        {viewingCardMember.company ? ` — ${viewingCardMember.company}` : ''}
                      </span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <MapPin className="w-3.5 h-3.5 text-[#141413] shrink-0" />
                      <span className="truncate">
                        {viewingCardMember.city}
                        {viewingCardMember.commune ? ` (${viewingCardMember.commune})` : ''} –{' '}
                        {viewingCardMember.country}
                      </span>
                    </li>
                  </ul>
                </div>

                {/* Hairline Divider & Status Capsule */}
                <div className="pt-2.5 mt-2.5 border-t border-[#141413]/10">
                  <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-[#141413] text-white border border-[#F2B705] shadow-xs max-w-full">
                    <Users className="w-5 h-5 text-[#F2B705] shrink-0" />
                    <div className="w-px h-6 bg-white/25 shrink-0" />
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-white leading-tight truncate">
                        {statusLabel}
                      </div>
                      <div className="text-[10px] font-mono font-semibold text-[#F2B705] tracking-wider leading-tight mt-0.5 truncate">
                        N° {viewingCardMember.membershipCardId}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Scannable QR Code */}
              <div className="shrink-0 flex flex-col items-center justify-end">
                <button
                  type="button"
                  onClick={handleFlashQr}
                  title="Cliquer ou flasher pour mettre à jour l'espace de paiement"
                  className="w-24 h-24 sm:w-[106px] sm:h-[106px] p-1.5 bg-white rounded-lg border-2 border-[#141413] hover:border-[#F2B705] shadow-sm transition-all cursor-pointer flex items-center justify-center group"
                >
                  {qrDataUrl ? (
                    <img
                      src={qrDataUrl}
                      alt={`QR Code paiement ${viewingCardMember.membershipCardId}`}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <QrCode className="w-10 h-10 text-[#141413] animate-pulse" />
                  )}
                </button>
                <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-[#4A4A48] mt-1">
                  Scan Paiement
                </span>
                {qrSigned && (
                  <span className="text-[8px] font-mono font-semibold text-[#134E4A] tracking-tight">
                    Certifié HMAC-SHA256
                  </span>
                )}
              </div>
            </div>

            {/* Bottom Footer: Sweeping Bottom-Left Ribbon + Motto + 3 Stars */}
            <div className="relative pt-2 pb-3 px-5 sm:px-7 flex flex-col sm:flex-row items-center justify-between gap-2 overflow-hidden">
              {/* Sweeping Bottom-Left Curve */}
              <svg
                viewBox="0 0 660 46"
                className="absolute left-0 bottom-0 w-full h-11 pointer-events-none select-none"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <path
                  d="M 0,4 C 130,30 265,40 420,45 L 0,46 Z"
                  fill="#F2B705"
                />
                <path
                  d="M 0,14 C 115,36 235,43 375,46 L 0,46 Z"
                  fill="#141413"
                />
              </svg>

              <div className="relative z-10 hidden sm:block w-24 text-[9px] font-mono font-bold text-white/95">
                {settings.fiscalYear}–{settings.fiscalYear + 1}
              </div>

              <div className="relative z-10 text-[11px] sm:text-xs font-editorial italic font-bold text-[#141413] text-center bg-white/85 sm:bg-transparent px-2 rounded">
                « {cleanMotto} »
              </div>

              <div className="relative z-10 flex items-center gap-1.5 shrink-0">
                <span className="w-6 sm:w-8 h-[1.5px] bg-[#141413]" />
                <span className="text-[#141413] text-[11px] tracking-widest leading-none">★★★</span>
                <span className="w-6 sm:w-8 h-[1.5px] bg-[#141413]" />
              </div>
            </div>
          </div>

          {/* Non-Printable Interactive Financial & QR Sync Strip */}
          <div className="no-print mt-5 w-full max-w-[660px] bg-white dark:bg-[#1e1e1c] border border-[#141413]/10 dark:border-white/10 rounded-xl shadow-editorial p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="space-y-0.5">
              <div className="font-bold text-[#141413] dark:text-white">
                QR Code connecté à l’Espace Paiement & à la Trésorerie
              </div>
              <p className="text-[11px] text-[#4A4A48] dark:text-zinc-400">
                Situation actuelle :{' '}
                <strong className="font-mono text-[#141413] dark:text-white">
                  {financialSummary.paidMonths.length}/12 mois acquittés
                </strong>{' '}
                · Total encaissé :{' '}
                <strong className="font-mono text-[#16324F] dark:text-[#F2B705]">
                  {financialSummary.totalPaid.toLocaleString('fr-FR')} {settings.currency}
                </strong>
                . Flashez ce QR code pour mettre à jour les cotisations et toutes les tables du site.
              </p>
            </div>
            <button
              type="button"
              onClick={handleFlashQr}
              className="px-4 py-2 bg-[#F2B705] hover:bg-[#dfa704] text-[#141413] font-bold text-xs rounded-lg inline-flex items-center justify-center gap-1.5 shrink-0 cursor-pointer shadow-xs transition-colors"
            >
              <QrCode className="w-4 h-4" />
              <span>Simuler le flash QR</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
