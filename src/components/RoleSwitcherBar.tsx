import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PROFILE_ACCESS_MATRIX } from '../utils/accessMatrix';
import {
  Shield,
  User,
  UserCheck,
  LogIn,
  LogOut,
  ChevronDown,
  KeyRound,
  RotateCcw,
} from 'lucide-react';

export const RoleSwitcherBar: React.FC = () => {
  const {
    currentRole,
    activeCredential,
    isCurrentMemberUpToDate,
    openAuthModal,
    logoutSession,
    setActiveTab,
    canAccessTab,
    resetAllData,
  } = useApp();
  const [isOpen, setIsOpen] = useState(false);

  const isAuthenticated = currentRole !== 'VISITEUR' && activeCredential !== null;
  const roleRule = PROFILE_ACCESS_MATRIX[currentRole];

  return (
    <div className="fixed bottom-4 right-4 z-50 no-print">
      <div className="relative">
        {isOpen && (
          <div className="absolute bottom-full right-0 mb-2 w-80 bg-white dark:bg-[#1e1e1c] border border-[#141413]/15 dark:border-white/15 rounded-xl shadow-2xl p-3.5 text-[#141413] dark:text-zinc-200 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#141413]/10 dark:border-white/10 text-xs font-bold text-[#141413] dark:text-white">
              <span className="flex items-center gap-1.5 text-[#141413] dark:text-[#F2B705]">
                <Shield className="w-3.5 h-3.5 text-[#F2B705]" />
                <span>Contrôle d’Accès ALGB</span>
              </span>
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  resetAllData();
                }}
                title="Réinitialiser les données et les accès par défaut"
                className="flex items-center gap-1 text-[11px] text-[#4A4A48] dark:text-zinc-400 hover:text-[#141413] dark:hover:text-white cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>

            {isAuthenticated ? (
              <div className="space-y-2.5 text-xs">
                <div className="p-2.5 rounded-xl bg-[#F8F8F6] dark:bg-[#141413] border border-[#141413]/10 dark:border-white/10 space-y-1">
                  <div className="font-bold text-[#141413] dark:text-white">
                    {activeCredential.displayName}
                  </div>
                  <div className="text-[11px] text-[#141413] dark:text-[#F2B705] font-semibold">
                    Profil : {roleRule.label}
                  </div>
                  <div className="text-[10px] font-mono text-[#4A4A48] dark:text-zinc-400">
                    ID : {activeCredential.identifier}
                  </div>
                  <div
                    className={`text-[10px] font-semibold pt-0.5 ${
                      isCurrentMemberUpToDate
                        ? 'text-[#134E4A] dark:text-emerald-400'
                        : 'text-[#C2410C] dark:text-amber-300'
                    }`}
                  >
                    Mentorat, Parrains & Carrières :{' '}
                    {isCurrentMemberUpToDate
                      ? 'Débloqués (cotisation à jour)'
                      : 'Verrouillés (cotisation requise)'}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-1.5">
                  {canAccessTab('espace-membre') && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsOpen(false);
                        setActiveTab('espace-membre');
                      }}
                      className="w-full py-2 px-3 rounded-lg bg-[#F8F8F6] dark:bg-[#141413] hover:bg-[#FEF8E6] dark:hover:bg-white/10 text-[#141413] dark:text-white font-semibold text-left flex items-center gap-2 cursor-pointer"
                    >
                      <User className="w-3.5 h-3.5 text-[#141413] dark:text-[#F2B705]" />
                      <span>Ouvrir mon Espace Membre</span>
                    </button>
                  )}

                  {canAccessTab('admin') && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsOpen(false);
                        setActiveTab('admin');
                      }}
                      className="w-full py-2 px-3 rounded-lg bg-[#FEF8E6] dark:bg-[#2a2719] border border-[#F2B705]/40 hover:bg-[#F2B705]/25 text-[#141413] dark:text-[#FEF8E6] font-semibold text-left flex items-center gap-2 cursor-pointer"
                    >
                      <Shield className="w-3.5 h-3.5 text-[#141413] dark:text-[#F2B705]" />
                      <span>Console Administration & Credentials</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      setIsOpen(false);
                      openAuthModal();
                    }}
                    className="w-full py-2 px-3 rounded-lg border border-[#141413]/15 dark:border-white/15 hover:border-[#F2B705] text-[#141413] dark:text-zinc-200 font-semibold text-left flex items-center gap-2 cursor-pointer"
                  >
                    <KeyRound className="w-3.5 h-3.5 text-[#141413] dark:text-[#F2B705]" />
                    <span>Changer de compte (Credential)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsOpen(false);
                      logoutSession();
                    }}
                    className="w-full py-2 px-3 rounded-lg bg-red-50 dark:bg-red-950/40 hover:bg-red-100 dark:hover:bg-red-950/70 text-red-700 dark:text-red-400 font-semibold text-left flex items-center gap-2 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Déconnexion (retour Visiteur public)</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3 text-xs">
                <p className="text-[11px] text-[#4A4A48] dark:text-zinc-400 leading-relaxed">
                  Vous naviguez en <strong className="text-[#141413] dark:text-white">Visiteur public</strong> : toutes les informations présentant l’Amicale et ses activités sont ouvertes librement sans credential. Pour l’Espace Membre, Carrières au cœur du réseau ou le Collège des Parrains, connectez-vous avec votre credential.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    openAuthModal();
                  }}
                  className="w-full py-2.5 px-3 rounded-lg bg-[#F2B705] hover:bg-[#dfa704] text-[#141413] font-bold flex items-center justify-center gap-2 cursor-pointer"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Se connecter par Credential</span>
                </button>
              </div>
            )}
          </div>
        )}

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-4 py-2 bg-[#141413] border border-white/15 hover:border-[#F2B705] text-white rounded-lg shadow-lg transition-all cursor-pointer text-xs"
        >
          {isAuthenticated ? (
            <UserCheck className="w-3.5 h-3.5 text-[#F2B705] shrink-0" />
          ) : (
            <Shield className="w-3.5 h-3.5 text-[#F2B705] shrink-0" />
          )}
          <span className="font-semibold">
            {isAuthenticated
              ? `${roleRule.label}`
              : 'Visiteur public · Connexion'}
          </span>
          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>
    </div>
  );
};
