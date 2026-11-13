import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { generateMemberQrDataUrl } from '../utils/qrPayload';
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
  const [avatarError, setAvatarError] = useState<boolean>(false);

  useEffect(() => {
    setAvatarError(false);
    if (!viewingCardMember) {
      setQrDataUrl('');
      return;
    }

    let cancelled = false;
    generateMemberQrDataUrl(viewingCardMember)
      .then((url) => {
        if (!cancelled) setQrDataUrl(url);
      })
      .catch(() => {
        if (!cancelled) setQrDataUrl('');
      });

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 dark:bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden my-6">
        {/* Modal Controls */}
        <div className="no-print bg-gray-50 dark:bg-zinc-950 px-5 sm:px-6 py-3.5 border-b border-gray-200 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-3 text-gray-900 dark:text-zinc-100">
          <div className="flex items-center gap-2 text-xs font-bold text-black dark:text-white">
            <ShieldCheck className="w-4 h-4 text-[#B8860B] dark:text-[#E5B824]" />
            <span>Carte Officielle d’Adhérent ALGB</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleFlashQr}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-black dark:bg-zinc-800 text-[#E5B824] rounded-lg text-xs font-bold hover:bg-gray-900 dark:hover:bg-zinc-700 transition-all cursor-pointer shadow-xs"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>Flasher QR (Paiement)</span>
            </button>

            {qrDataUrl && (
              <button
                type="button"
                onClick={handleDownloadQr}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 text-black dark:text-white rounded-lg text-xs font-semibold hover:bg-gray-100 dark:hover:bg-zinc-800 transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-[#B8860B] dark:text-[#E5B824]" />
                <span>QR PNG</span>
              </button>
            )}

            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#E5B824] text-black rounded-lg text-xs font-bold hover:bg-[#dcae1f] transition-all cursor-pointer shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimer</span>
            </button>

            <button
              type="button"
              onClick={() => setViewingCardMember(null)}
              aria-label="Fermer la carte"
              className="p-1.5 text-gray-500 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:bg-gray-200 dark:hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Card Stage */}
        <div className="p-4 sm:p-8 flex flex-col items-center justify-center bg-gray-100 dark:bg-zinc-950">
          {/* Official ALGB Membership Card (White / Light Gray / Black / Yellow Charter) */}
          <div className="w-full max-w-[660px] rounded-2xl bg-white border-2 border-black shadow-2xl overflow-hidden relative text-black">
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
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white border-[2.5px] border-black ring-2 ring-[#E5B824]/80 p-1 shadow-md shrink-0 flex items-center justify-center overflow-hidden">
                <img
                  src="/assets/aistudio/IMG-20180925-WA0019_301d84a7.jpg"
                  alt="Logo Officiel ALGB"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain rounded-full"
                />
              </div>

              {/* Vertical Divider */}
              <div className="w-[1.5px] h-14 sm:h-16 bg-black/25 shrink-0" />

              {/* Institutional Header Typography */}
              <div className="min-w-0 flex-1">
                <div className="text-[10px] sm:text-xs font-heading font-bold uppercase tracking-wider text-black leading-tight">
                  Amicale des Anciens Élèves
                </div>
                <div className="text-lg sm:text-[23px] font-heading font-extrabold uppercase tracking-tight text-black leading-none mt-0.5">
                  Lycée de Bingerville
                </div>
                <div className="text-[10px] sm:text-[11px] font-editorial italic font-semibold text-[#B8860B] mt-1 truncate">
                  {cleanSignature}
                </div>
              </div>
            </div>

            {/* Top Sweeping Dual-Ribbon Curve (Yellow + Black) */}
            <div className="relative z-10 w-full -mt-1 pointer-events-none select-none">
              <svg
                viewBox="0 0 660 34"
                className="w-full h-6 sm:h-7 block"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <path
                  d="M 240,29 C 390,28 530,18 660,0 L 660,11 C 530,27 390,32 240,30 Z"
                  fill="#E5B824"
                />
                <path
                  d="M 190,31 C 370,31 530,24 660,7 L 660,17 C 530,31 370,33 190,32 Z"
                  fill="#0A0A0A"
                />
              </svg>
            </div>

            {/* Main 3-Column Card Body */}
            <div className="relative z-10 px-5 sm:px-7 pt-1 pb-4 flex flex-col sm:flex-row items-center sm:items-stretch gap-4 sm:gap-5">
              {/* Left Column: Portrait Photo */}
              <div className="w-28 sm:w-[134px] shrink-0">
                <div className="aspect-[3/4] w-full rounded-xl bg-gray-100 border-2 border-black shadow-sm overflow-hidden flex flex-col items-center justify-center relative">
                  {viewingCardMember.avatarUrl && !avatarError ? (
                    <img
                      src={viewingCardMember.avatarUrl}
                      alt={`${viewingCardMember.firstName} ${viewingCardMember.lastName}`}
                      referrerPolicy="no-referrer"
                      onError={() => setAvatarError(true)}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-b from-gray-100 to-gray-200 flex flex-col items-center justify-center p-2 text-center">
                      <span className="text-2xl sm:text-3xl font-heading font-bold text-black">
                        {viewingCardMember.firstName[0]}
                        {viewingCardMember.lastName[0]}
                      </span>
                      <span className="text-[8px] uppercase tracking-widest font-semibold text-gray-500 mt-1">
                        Photo Officielle
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Center Column: Member Information & Active Capsule */}
              <div className="flex-1 min-w-0 flex flex-col justify-between w-full">
                <div>
                  <h2 className="text-lg sm:text-[20px] font-bold text-black tracking-tight leading-snug truncate">
                    {viewingCardMember.firstName} {viewingCardMember.lastName}
                    {viewingCardMember.nickname && (
                      <span className="text-xs font-semibold text-[#B8860B] ml-1.5">
                        « {viewingCardMember.nickname} »
                      </span>
                    )}
                  </h2>

                  <ul className="mt-2 space-y-1.5 text-xs text-gray-800">
                    <li className="flex items-center gap-2.5">
                      <GraduationCap className="w-3.5 h-3.5 text-black shrink-0" />
                      <span className="truncate">
                        Ancien Élève
                        {viewingCardMember.bacSeries ? ` · ${viewingCardMember.bacSeries}` : ''}
                        {viewingCardMember.isRep ? ' · Délégué' : ''}
                      </span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Calendar className="w-3.5 h-3.5 text-black shrink-0" />
                      <span className="truncate font-medium">
                        Promotion : {viewingCardMember.promotionYear}
                        {viewingCardMember.studyLevel ? ` · ${viewingCardMember.studyLevel}` : ''}
                      </span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Briefcase className="w-3.5 h-3.5 text-black shrink-0" />
                      <span className="truncate">
                        Profession : {viewingCardMember.currentRole}
                        {viewingCardMember.company ? ` — ${viewingCardMember.company}` : ''}
                      </span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <MapPin className="w-3.5 h-3.5 text-black shrink-0" />
                      <span className="truncate">
                        {viewingCardMember.city}
                        {viewingCardMember.commune ? ` (${viewingCardMember.commune})` : ''} –{' '}
                        {viewingCardMember.country}
                      </span>
                    </li>
                  </ul>
                </div>

                {/* Hairline Divider & Status Capsule */}
                <div className="pt-2.5 mt-2.5 border-t border-gray-200">
                  <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-black text-white border border-[#E5B824] shadow-xs max-w-full">
                    <Users className="w-5 h-5 text-[#E5B824] shrink-0" />
                    <div className="w-px h-6 bg-white/25 shrink-0" />
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-white leading-tight truncate">
                        {statusLabel}
                      </div>
                      <div className="text-[10px] font-mono font-semibold text-[#E5B824] tracking-wider leading-tight mt-0.5 truncate">
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
                  className="w-24 h-24 sm:w-[106px] sm:h-[106px] p-1.5 bg-white rounded-xl border-2 border-black hover:border-[#E5B824] shadow-sm transition-all cursor-pointer flex items-center justify-center group"
                >
                  {qrDataUrl ? (
                    <img
                      src={qrDataUrl}
                      alt={`QR Code paiement ${viewingCardMember.membershipCardId}`}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <QrCode className="w-10 h-10 text-black animate-pulse" />
                  )}
                </button>
                <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-gray-600 mt-1">
                  Scan Paiement
                </span>
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
                  fill="#E5B824"
                />
                <path
                  d="M 0,14 C 115,36 235,43 375,46 L 0,46 Z"
                  fill="#0A0A0A"
                />
              </svg>

              <div className="relative z-10 hidden sm:block w-24 text-[9px] font-mono font-bold text-white/95">
                {settings.fiscalYear}–{settings.fiscalYear + 1}
              </div>

              <div className="relative z-10 text-[11px] sm:text-xs font-editorial italic font-bold text-black text-center bg-white/80 sm:bg-transparent px-2 rounded">
                « {cleanMotto} »
              </div>

              <div className="relative z-10 flex items-center gap-1.5 shrink-0">
                <span className="w-6 sm:w-8 h-[1.5px] bg-black" />
                <span className="text-black text-[11px] tracking-widest leading-none">★★★</span>
                <span className="w-6 sm:w-8 h-[1.5px] bg-black" />
              </div>
            </div>
          </div>

          {/* Non-Printable Interactive Financial & QR Sync Strip */}
          <div className="no-print mt-5 w-full max-w-[660px] bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="space-y-0.5">
              <div className="font-bold text-black dark:text-white">
                QR Code connecté à l’Espace Paiement & à la Trésorerie
              </div>
              <p className="text-[11px] text-gray-600 dark:text-zinc-400">
                Situation actuelle :{' '}
                <strong className="font-mono text-black dark:text-white">
                  {financialSummary.paidMonths.length}/12 mois acquittés
                </strong>{' '}
                · Total encaissé :{' '}
                <strong className="font-mono text-[#B8860B] dark:text-[#E5B824]">
                  {financialSummary.totalPaid.toLocaleString('fr-FR')} {settings.currency}
                </strong>
                . Flashez ce QR code pour mettre à jour les cotisations et toutes les tables du site.
              </p>
            </div>
            <button
              type="button"
              onClick={handleFlashQr}
              className="px-4 py-2 bg-[#E5B824] hover:bg-[#dcae1f] text-black font-bold text-xs rounded-xl inline-flex items-center justify-center gap-1.5 shrink-0 cursor-pointer shadow-xs"
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
