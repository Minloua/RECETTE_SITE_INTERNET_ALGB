import React, { useState } from 'react';
import { Download, Smartphone, X } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  if (isInstalled) {
    return null;
  }

  if (isInstallable) {
    return (
      <button
        type="button"
        onClick={() => void install()}
        className="w-full py-2.5 px-3.5 rounded-lg bg-[#16324F] hover:bg-[#1e4268] text-white border border-[#F2B705]/40 text-xs font-semibold flex items-center justify-center gap-2 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
      >
        <Download className="w-3.5 h-3.5 text-[#F2B705]" />
        <span>Installer l’App ALGB</span>
      </button>
    );
  }

  if (isIOS) {
    return (
      <>
        <button
          type="button"
          onClick={() => setShowIOSGuide(true)}
          className="w-full py-2.5 px-3.5 rounded-lg bg-[#F8F8F6] dark:bg-[#141413] border border-[#141413]/15 dark:border-white/20 text-[#141413] dark:text-zinc-200 hover:border-[#F2B705] text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <Smartphone className="w-3.5 h-3.5 text-[#16324F] dark:text-[#F2B705]" />
          <span>Installer sur iPhone / iPad</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="w-full max-w-sm rounded-xl bg-white dark:bg-[#1e1e1c] border border-black/10 dark:border-white/15 p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-heading font-bold text-[#141413] dark:text-white">
                  Installer ALGB Alumni sur iOS
                </h3>
                <button
                  type="button"
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1 text-[#4A4A48] dark:text-zinc-400 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <ol className="text-xs text-[#4A4A48] dark:text-zinc-300 space-y-2 list-decimal pl-4">
                <li>
                  Appuyez sur le bouton <strong>Partager</strong> dans la barre Safari.
                </li>
                <li>
                  Faites défiler vers le bas puis sélectionnez{' '}
                  <strong>Sur l’écran d’accueil</strong>.
                </li>
                <li>
                  Votre carte de membre et son QR certifié seront accessibles même hors connexion.
                </li>
              </ol>
              <button
                type="button"
                onClick={() => setShowIOSGuide(false)}
                className="w-full py-2.5 rounded-lg bg-[#F2B705] text-[#141413] font-bold text-xs cursor-pointer"
              >
                Compris
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
