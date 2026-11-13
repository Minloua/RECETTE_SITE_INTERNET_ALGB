import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X, BellRing, ArrowRight } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed top-24 right-4 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none"
      aria-live="polite"
      aria-label="Notifications et alertes"
    >
      {toasts.map((toast) => {
        if (toast.type === 'news') {
          return (
            <div
              key={toast.id}
              role="alert"
              className="pointer-events-auto p-4 rounded-2xl border-2 border-[#E5B824] bg-white dark:bg-zinc-900 text-black dark:text-white shadow-2xl flex flex-col gap-2.5 transition-all animate-in fade-in slide-in-from-right-4 duration-200"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-black dark:bg-zinc-800 text-[#E5B824] flex items-center justify-center shrink-0 relative">
                    <BellRing className="w-4 h-4" />
                    <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#E5B824] ring-2 ring-white dark:ring-zinc-900 animate-pulse" />
                  </div>
                  <div className="min-w-0">
                    {toast.badge && (
                      <span className="inline-block px-2 py-0.5 rounded bg-yellow-50 dark:bg-yellow-500/15 border border-yellow-200 dark:border-yellow-500/40 text-[10px] font-bold uppercase tracking-wider text-[#B8860B] dark:text-[#E5B824] mb-1">
                        {toast.badge}
                      </span>
                    )}
                    <div className="text-xs font-bold leading-snug text-black dark:text-white font-heading">
                      {toast.title}
                    </div>
                    <div className="text-[11px] text-gray-600 dark:text-zinc-300 mt-1 leading-snug line-clamp-2">
                      {toast.message}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => removeToast(toast.id)}
                  aria-label="Fermer l’alerte"
                  className="text-gray-400 hover:text-black dark:hover:text-white p-1 rounded-md hover:bg-gray-100 dark:hover:bg-zinc-800 cursor-pointer shrink-0"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {toast.actionLabel && toast.onAction && (
                <div className="pt-2 border-t border-gray-100 dark:border-zinc-800 flex items-center justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      toast.onAction?.();
                      removeToast(toast.id);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#E5B824] hover:bg-[#dcae1f] text-black text-[11px] font-bold rounded-lg transition-colors cursor-pointer"
                  >
                    <span>{toast.actionLabel}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          );
        }

        let borderClass = 'border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-900 dark:text-zinc-100';
        let icon = <Info className="w-4 h-4 text-[#B8860B] dark:text-[#E5B824] shrink-0 mt-0.5" />;

        if (toast.type === 'success') {
          borderClass = 'border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/80 text-gray-900 dark:text-emerald-50';
          icon = <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />;
        } else if (toast.type === 'warning' || toast.type === 'error') {
          borderClass = 'border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/80 text-gray-900 dark:text-amber-50';
          icon = <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />;
        }

        return (
          <div
            key={toast.id}
            role="status"
            className={`pointer-events-auto p-3.5 rounded-xl border shadow-lg flex items-start justify-between gap-3 transition-all animate-in fade-in slide-in-from-right-4 duration-200 ${borderClass}`}
          >
            <div className="flex items-start gap-2.5">
              {icon}
              <div>
                <div className="text-xs font-bold leading-tight text-black dark:text-white">{toast.title}</div>
                <div className="text-[11px] text-gray-700 dark:text-zinc-300 mt-0.5 leading-snug">{toast.message}</div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              aria-label="Fermer la notification"
              className="text-gray-400 hover:text-black dark:hover:text-white p-0.5 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
