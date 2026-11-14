import React, { useMemo, useState } from 'react';
import { WifiOff, QrCode, ShieldCheck, X } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { OFFLINE_CARD_STORAGE_KEY } from '../context/AppContext';
import type { AlumniMember } from '../data/mockData';

interface CachedOfflineCard {
  member: AlumniMember;
  qrDataUrl?: string;
  sig?: { ts: number; sig: string } | null;
  cachedAt: string;
}

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();
  const [showOfflineCard, setShowOfflineCard] = useState(false);

  const cachedCard = useMemo<CachedOfflineCard | null>(() => {
    if (isOnline && !showOfflineCard) return null;
    try {
      const raw = localStorage.getItem(OFFLINE_CARD_STORAGE_KEY);
      return raw ? (JSON.parse(raw) as CachedOfflineCard) : null;
    } catch {
      return null;
    }
  }, [isOnline, showOfflineCard]);

  if (isOnline && !showOfflineCard) return null;

  return (
    <>
      {!isOnline && (
        <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2.5 rounded-xl bg-[#141413] border border-[#F2B705] px-3.5 py-2 text-xs font-medium text-white shadow-2xl no-print">
          <WifiOff className="w-3.5 h-3.5 text-[#F2B705] shrink-0" />
          <span>Mode hors-ligne · Données locales</span>
          {cachedCard && (
            <button
              type="button"
              onClick={() => setShowOfflineCard(true)}
              className="ml-1 px-2.5 py-1 rounded-md bg-[#F2B705] text-[#141413] font-bold text-[11px] inline-flex items-center gap-1 cursor-pointer"
            >
              <QrCode className="w-3 h-3" />
              <span>Carte QR</span>
            </button>
          )}
        </div>
      )}

      {showOfflineCard && cachedCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-xl bg-white dark:bg-[#1e1e1c] border-2 border-[#141413] dark:border-[#F2B705]/60 p-6 shadow-2xl space-y-4 text-[#141413] dark:text-white">
            <div className="flex items-center justify-between pb-3 border-b border-black/10 dark:border-white/10">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#134E4A] dark:text-[#F2B705]" />
                <span className="text-xs font-bold uppercase tracking-wider">
                  Carte Hors-Ligne ALGB
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowOfflineCard(false)}
                className="p-1 text-[#4A4A48] dark:text-zinc-400 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-center space-y-1">
              <div className="text-lg font-heading font-bold">
                {cachedCard.member.firstName} {cachedCard.member.lastName}
              </div>
              <div className="text-xs font-mono font-semibold text-[#16324F] dark:text-[#F2B705]">
                {cachedCard.member.membershipCardId} · Promo {cachedCard.member.promotionYear}
              </div>
              <div className="text-[11px] text-[#4A4A48] dark:text-zinc-400">
                {cachedCard.member.currentRole} — {cachedCard.member.company}
              </div>
            </div>

            {cachedCard.qrDataUrl && (
              <div className="flex flex-col items-center p-3 rounded-xl bg-[#F8F8F6] border border-black/10">
                <img
                  src={cachedCard.qrDataUrl}
                  alt={`QR hors-ligne ${cachedCard.member.membershipCardId}`}
                  className="w-44 h-44 object-contain"
                />
                {cachedCard.sig && (
                  <span className="mt-2 text-[10px] font-mono text-[#134E4A] font-semibold">
                    Signature HMAC-SHA256 certifiée
                  </span>
                )}
              </div>
            )}

            <p className="text-[10px] text-center text-[#4A4A48] dark:text-zinc-400">
              Synchronisée le {new Date(cachedCard.cachedAt).toLocaleString('fr-FR')}. Présentez ce
              badge à l’accueil de l’AG ou du Gala.
            </p>
          </div>
        </div>
      )}
    </>
  );
};
