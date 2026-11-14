import React from 'react';
import { useApp, NavigationTab } from '../context/AppContext';
import { PROFILE_ACCESS_MATRIX, UNRESTRICTED_ACCESS_OVERRIDE } from '../utils/accessMatrix';
import {
  UserCheck,
  Shield,
  HeartHandshake,
  LogIn,
  LogOut,
  KeyRound,
  MessageSquareText,
  ArrowRight,
  RotateCcw,
  User,
} from 'lucide-react';

export const RightActionSidebar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    currentRole,
    currentUser,
    activeCredential,
    canAccessTab,
    openAuthModal,
    logoutSession,
    setAiChatOpen,
    resetAllData,
  } = useApp();

  const isAuthenticated = currentRole !== 'VISITEUR' && activeCredential !== null;
  const roleRule = PROFILE_ACCESS_MATRIX[currentRole];
  const canSeeMemberSpace =
    (UNRESTRICTED_ACCESS_OVERRIDE || isAuthenticated) && canAccessTab('espace-membre');
  const canSeeAdmin = (UNRESTRICTED_ACCESS_OVERRIDE || isAuthenticated) && canAccessTab('admin');
  const canSeeDonate = canAccessTab('projets');

  const sessionDisplayName = currentUser
    ? `${currentUser.firstName} ${currentUser.lastName}`
    : activeCredential?.displayName || '';

  const initials = currentUser
    ? `${currentUser.firstName[0] || ''}${currentUser.lastName[0] || ''}`.toUpperCase()
    : activeCredential?.displayName
        ?.split(/\s+/)
        .slice(0, 2)
        .map((w) => w[0]?.toUpperCase() || '')
        .join('') || 'AL';

  const handleNav = (tab: NavigationTab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <aside
      aria-label="Barre latérale d’actions et compte ALGB"
      className="hidden lg:block w-[236px] xl:w-[256px] shrink-0 bg-[#FFFFFF] dark:bg-[#191917] border-l border-[#141413]/10 dark:border-white/10 transition-colors no-print"
    >
      <div className="sticky top-[72px] max-h-[calc(100vh-72px)] overflow-y-auto p-4 xl:p-5 flex flex-col gap-5">
        {/* 1. COMPTE CONNECTÉ / CONNEXION */}
        <section className="rounded-xl bg-[#F8F8F6] dark:bg-[#141413] border border-[#141413]/10 dark:border-white/10 p-4 space-y-3.5 shadow-editorial">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] uppercase tracking-[0.14em] font-semibold text-[#4A4A48] dark:text-zinc-400">
              {isAuthenticated ? 'Compte connecté' : 'Accès Réseau'}
            </span>
            {isAuthenticated && (
              <span className="text-[11px] font-semibold text-[#134E4A] dark:text-emerald-400">
                Actif
              </span>
            )}
          </div>

          {isAuthenticated ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#141413] dark:bg-[#232320] border-2 border-[#F2B705] text-[#F2B705] flex items-center justify-center font-heading font-bold text-sm shrink-0">
                  {initials}
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-heading font-bold text-[#141413] dark:text-white truncate">
                    {sessionDisplayName}
                  </div>
                  <div className="text-[11px] font-semibold text-[#16324F] dark:text-[#F2B705] truncate">
                    {roleRule.label}
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-[#141413]/10 dark:border-white/10 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => openAuthModal()}
                  className="w-full py-2 px-3 rounded-lg border border-[#141413]/15 dark:border-white/15 hover:border-[#F2B705] bg-white dark:bg-[#1e1e1c] text-[#141413] dark:text-zinc-200 text-xs font-semibold flex items-center justify-center gap-2 transition-all duration-150 hover:-translate-y-0.5 cursor-pointer whitespace-nowrap"
                >
                  <KeyRound className="w-3.5 h-3.5 text-[#16324F] dark:text-[#F2B705]" />
                  <span>Changer de compte</span>
                </button>

                <button
                  type="button"
                  onClick={logoutSession}
                  className="w-full py-2 px-3 rounded-lg border border-red-200 dark:border-red-900/60 bg-red-50/70 dark:bg-red-950/30 hover:bg-red-100 dark:hover:bg-red-950/60 text-red-700 dark:text-red-300 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer whitespace-nowrap"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Déconnexion</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#141413] text-[#F2B705] flex items-center justify-center shrink-0">
                  <User className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-heading font-bold text-[#141413] dark:text-white leading-snug">
                    Session Visiteur
                  </div>
                  <div className="text-[11px] text-[#4A4A48] dark:text-zinc-400">
                    {UNRESTRICTED_ACCESS_OVERRIDE
                      ? 'Accès libre actif'
                      : 'Identification membre'}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => openAuthModal()}
                className="w-full py-2.5 px-4 rounded-lg border-2 border-[#141413] dark:border-white text-[#141413] dark:text-white hover:bg-[#141413] hover:text-white dark:hover:bg-white dark:hover:text-[#141413] text-xs font-bold flex items-center justify-center gap-2 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer whitespace-nowrap"
              >
                <LogIn className="w-4 h-4" />
                <span>Connexion</span>
              </button>
            </div>
          )}
        </section>

        {/* 2. BOUTON ESPACE MEMBRE & ADMINISTRATION */}
        {(canSeeMemberSpace || canSeeAdmin) && (
          <section className="space-y-2.5">
            <span className="text-[11px] uppercase tracking-[0.14em] font-semibold text-[#4A4A48] dark:text-zinc-400 block px-1">
              Espaces dédiés
            </span>

            {canSeeMemberSpace && (
              <button
                type="button"
                onClick={() => handleNav('espace-membre')}
                className={`group w-full py-3 px-4 rounded-lg text-xs font-bold flex items-center justify-between gap-2 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer whitespace-nowrap border ${
                  activeTab === 'espace-membre'
                    ? 'bg-[#16324F] text-white border-[#16324F] shadow-md'
                    : 'bg-[#FFFFFF] dark:bg-[#141413] text-[#141413] dark:text-white border-[#141413]/15 dark:border-white/15 hover:border-[#16324F] dark:hover:border-[#F2B705]'
                }`}
              >
                <span className="flex items-center gap-2.5 min-w-0">
                  <UserCheck
                    className={`w-4 h-4 shrink-0 ${
                      activeTab === 'espace-membre'
                        ? 'text-[#F2B705]'
                        : 'text-[#16324F] dark:text-[#F2B705]'
                    }`}
                  />
                  <span className="truncate">Espace Membre</span>
                </span>
                <ArrowRight className="w-3.5 h-3.5 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5" />
              </button>
            )}

            {canSeeAdmin && (
              <button
                type="button"
                onClick={() => handleNav('admin')}
                className={`group w-full py-2.5 px-4 rounded-lg text-xs font-semibold flex items-center justify-between gap-2 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer whitespace-nowrap border ${
                  activeTab === 'admin'
                    ? 'bg-[#141413] text-[#F2B705] border-[#F2B705]'
                    : 'bg-[#F8F8F6] dark:bg-[#141413] text-[#141413] dark:text-zinc-200 border-[#141413]/15 dark:border-white/15 hover:border-[#F2B705] hover:text-[#141413] dark:hover:text-[#F2B705]'
                }`}
              >
                <span className="flex items-center gap-2.5 min-w-0">
                  <Shield className="w-4 h-4 shrink-0 text-[#F2B705]" />
                  <span className="truncate">Administration</span>
                </span>
                <ArrowRight className="w-3.5 h-3.5 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5" />
              </button>
            )}
          </section>
        )}

        {/* 3. FAIRE UN DON — CTA UNIVERS MÉCÉNAT */}
        {canSeeDonate && (
          <section className="rounded-xl bg-[#134E4A] text-white p-4 space-y-3 shadow-editorial">
            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-[0.16em] font-semibold text-[#F2B705] block">
                Mécénat & Bourses
              </span>
              <h3 className="text-base font-heading font-bold text-white leading-snug">
                Soutenir le Lycée
              </h3>
              <p className="text-[11px] text-emerald-100 leading-relaxed">
                Financez les bourses d’excellence et les chantiers solidaires de Bingerville.
              </p>
            </div>

            <button
              type="button"
              onClick={() => handleNav('projets')}
              className="group w-full py-3 px-4 rounded-lg bg-[#F2B705] hover:bg-[#dfa704] text-[#141413] font-bold text-xs flex items-center justify-center gap-2 transition-all duration-200 hover:-translate-y-0.5 shadow-sm cursor-pointer whitespace-nowrap"
            >
              <HeartHandshake className="w-4 h-4 text-[#141413] transition-transform duration-200 group-hover:scale-110" />
              <span>Faire un don</span>
            </button>
          </section>
        )}

        {/* 4. UTILITAIRES : ASSISTANT ALGB & RÉINITIALISATION */}
        <div className="pt-3 border-t border-[#141413]/10 dark:border-white/10 space-y-2">
          <button
            type="button"
            onClick={() => setAiChatOpen(true)}
            className="w-full py-2.5 px-3.5 rounded-lg bg-[#141413] hover:bg-[#1e1e1c] text-white border border-[#F2B705]/60 text-xs font-semibold flex items-center gap-2.5 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
          >
            <span className="w-6 h-6 rounded-md bg-[#F2B705] text-[#141413] flex items-center justify-center shrink-0">
              <MessageSquareText className="w-3.5 h-3.5" />
            </span>
            <span className="truncate">Assistant ALGB</span>
          </button>

          <button
            type="button"
            onClick={resetAllData}
            title="Réinitialiser les données de démonstration"
            className="w-full py-1.5 px-3 text-[11px] font-medium text-[#4A4A48] dark:text-zinc-400 hover:text-[#141413] dark:hover:text-white flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Réinitialiser la session</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
