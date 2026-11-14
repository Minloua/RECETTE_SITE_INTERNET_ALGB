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
              className="pointer-events-auto p-4 rounded-xl border-2 border-[#F2B705] bg-white dark:bg-[#1e1e1c] text-[#141413] dark:text-white shadow-2xl flex flex-col gap-2.5 transition-all animate-in fade-in slide-in-from-right-4 duration-200"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#141413] text-[#F2B705] flex items-center justify-center shrink-0">
                    <BellRing className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    {toast.badge && (
                      <span className="inline-block px-2 py-0.5 rounded bg-[#FEF8E6] dark:bg-[#2a2719] border border-[#F2B705]/40 text-[10px] font-bold uppercase tracking-wider text-[#141413] dark:text-[#FEF8E6] mb-1">
                        {toast.badge}
                      </span>
                    )}
                    <div className="text-xs font-bold leading-snug text-[#141413] dark:text-white font-heading">
                      {toast.title}
                    </div>
                    <div className="text-[11px] text-[#4A4A48] dark:text-zinc-300 mt-1 leading-snug line-clamp-2">
                      {toast.message}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => removeToast(toast.id)}
                  aria-label="Fermer l’alerte"
                  className="text-[#4A4A48] hover:text-[#141413] dark:hover:text-white p-1 rounded-lg hover:bg-[#F8F8F6] dark:hover:bg-white/10 cursor-pointer shrink-0"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {toast.actionLabel && toast.onAction && (
                <div className="pt-2 border-t border-[#141413]/10 dark:border-white/10 flex items-center justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      toast.onAction?.();
                      removeToast(toast.id);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#F2B705] hover:bg-[#dfa704] text-[#141413] text-[11px] font-bold rounded-lg transition-colors cursor-pointer"
                  >
                    <span>{toast.actionLabel}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          );
        }

        let borderClass = 'border-[#141413]/15 dark:border-white/15 bg-white dark:bg-[#1e1e1c] text-[#141413] dark:text-zinc-100';
        let icon = <Info className="w-4 h-4 text-[#141413] dark:text-[#F2B705] shrink-0 mt-0.5" />;

        if (toast.type === 'success') {
          borderClass = 'border-[#134E4A]/35 dark:border-emerald-700 bg-[#F0FDF9] dark:bg-[#0f2422] text-[#141413] dark:text-emerald-50';
          icon = <CheckCircle2 className="w-4 h-4 text-[#134E4A] dark:text-emerald-400 shrink-0 mt-0.5" />;
        } else if (toast.type === 'warning' || toast.type === 'error') {
          borderClass = 'border-[#C2410C]/35 dark:border-amber-700 bg-[#FFF7ED] dark:bg-[#1a1310] text-[#141413] dark:text-amber-50';
          icon = <AlertCircle className="w-4 h-4 text-[#C2410C] dark:text-[#F2B705] shrink-0 mt-0.5" />;
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
                <div className="text-xs font-bold leading-tight text-[#141413] dark:text-white">{toast.title}</div>
                <div className="text-[11px] text-[#4A4A48] dark:text-zinc-300 mt-0.5 leading-snug">{toast.message}</div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              aria-label="Fermer la notification"
              className="text-[#4A4A48] hover:text-[#141413] dark:hover:text-white p-0.5 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
