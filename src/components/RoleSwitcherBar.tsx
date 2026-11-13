import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PROFILE_ACCESS_MATRIX } from '../utils/accessMatrix';
import {
  Shield,
  User,
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
          <div className="absolute bottom-full right-0 mb-2 w-80 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-xl shadow-2xl p-3.5 text-gray-800 dark:text-zinc-200 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-gray-200 dark:border-zinc-800 text-xs font-bold text-gray-900 dark:text-white">
              <span className="flex items-center gap-1.5 text-[#B8860B] dark:text-[#E5B824]">
                <Shield className="w-3.5 h-3.5" />
                <span>Contrôle d’Accès ALGB</span>
              </span>
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  resetAllData();
                }}
                title="Réinitialiser les données et les accès par défaut"
                className="flex items-center gap-1 text-[11px] text-gray-500 dark:text-zinc-400 hover:text-black dark:hover:text-white cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>

            {isAuthenticated ? (
              <div className="space-y-2.5 text-xs">
                <div className="p-2.5 rounded-lg bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 space-y-1">
                  <div className="font-bold text-black dark:text-white">
                    {activeCredential.displayName}
                  </div>
                  <div className="text-[11px] text-[#B8860B] dark:text-[#E5B824] font-semibold">
                    Profil : {roleRule.label}
                  </div>
                  <div className="text-[10px] font-mono text-gray-500 dark:text-zinc-400">
                    ID : {activeCredential.identifier}
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
                      className="w-full py-2 px-3 rounded-lg bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 text-black dark:text-white font-semibold text-left flex items-center gap-2 cursor-pointer"
                    >
                      <User className="w-3.5 h-3.5 text-[#B8860B] dark:text-[#E5B824]" />
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
                      className="w-full py-2 px-3 rounded-lg bg-yellow-50 dark:bg-yellow-500/15 border border-yellow-200 dark:border-[#E5B824]/40 hover:bg-yellow-100 dark:hover:bg-yellow-500/25 text-yellow-900 dark:text-[#E5B824] font-semibold text-left flex items-center gap-2 cursor-pointer"
                    >
                      <Shield className="w-3.5 h-3.5" />
                      <span>Console Administration & Credentials</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      setIsOpen(false);
                      openAuthModal();
                    }}
                    className="w-full py-2 px-3 rounded-lg border border-gray-300 dark:border-zinc-700 hover:border-[#E5B824] text-gray-800 dark:text-zinc-200 font-semibold text-left flex items-center gap-2 cursor-pointer"
                  >
                    <KeyRound className="w-3.5 h-3.5 text-[#B8860B] dark:text-[#E5B824]" />
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
                <p className="text-[11px] text-gray-600 dark:text-zinc-400 leading-relaxed">
                  Vous naviguez en <strong className="text-black dark:text-white">Visiteur public</strong> : les menus visiteurs sont ouverts librement sans credential. Pour l’Espace Membre ou l’Administration, connectez-vous avec les accès délivrés par l’Administration.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    openAuthModal();
                  }}
                  className="w-full py-2.5 px-3 rounded-xl bg-[#E5B824] hover:bg-[#dcae1f] text-black font-bold flex items-center justify-center gap-2 cursor-pointer"
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
          className="flex items-center gap-2 px-4 py-2 bg-black dark:bg-zinc-900 border border-gray-800 dark:border-zinc-700 hover:border-[#E5B824] text-white rounded-full shadow-lg transition-all cursor-pointer text-xs"
        >
          <span
            className={`w-2 h-2 rounded-full ${
              isAuthenticated ? 'bg-emerald-400' : 'bg-[#E5B824]'
            }`}
          ></span>
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
