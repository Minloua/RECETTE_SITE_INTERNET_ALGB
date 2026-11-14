import React, { useState } from 'react';
import { useApp, NavigationTab } from '../context/AppContext';
import { PROFILE_ACCESS_MATRIX, UNRESTRICTED_ACCESS_OVERRIDE } from '../utils/accessMatrix';
import {
  Menu,
  X,
  UserCheck,
  Shield,
  HeartHandshake,
  Sun,
  Moon,
  LogIn,
  LogOut,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    currentRole,
    currentUser,
    activeCredential,
    canAccessTab,
    openAuthModal,
    logoutSession,
    theme,
    toggleTheme,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNav = (tab: NavigationTab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  // Tous les menus alignés dans la barre du haut
  const allNavItems: { tab: NavigationTab; label: string }[] = [
    { tab: 'accueil', label: 'Accueil' },
    { tab: 'amicale', label: 'L’Amicale' },
    { tab: 'histoire', label: 'Histoire' },
    { tab: 'anciens', label: 'Annuaire' },
    { tab: 'reseau', label: 'Carrières' },
    { tab: 'mentorat', label: 'Mentorat' },
    { tab: 'actualites', label: 'Événements' },
    { tab: 'projets', label: 'Mécénat' },
    { tab: 'mediatheque', label: 'Médiathèque' },
    { tab: 'adhesion', label: 'Adhésion' },
    { tab: 'contact', label: 'Contact' },
  ];
  const visibleNavItems = allNavItems.filter((item) => canAccessTab(item.tab));

  const isAuthenticated = currentRole !== 'VISITEUR' && activeCredential !== null;
  const canSeeAdmin = (UNRESTRICTED_ACCESS_OVERRIDE || isAuthenticated) && canAccessTab('admin');
  const canSeeMemberSpace =
    (UNRESTRICTED_ACCESS_OVERRIDE || isAuthenticated) && canAccessTab('espace-membre');

  const sessionDisplayName = currentUser
    ? `${currentUser.firstName} ${currentUser.lastName}`
    : activeCredential?.displayName || '';

  return (
    <header className="sticky top-0 z-40 bg-[#141413] text-white border-b border-white/10 transition-colors">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-[72px] flex items-center justify-between gap-4 lg:gap-6">
        {/* Zone 1: Brand mark */}
        <button
          type="button"
          onClick={() => handleNav('accueil')}
          className="flex items-center gap-2.5 text-left shrink-0 group cursor-pointer focus-visible:outline-2 focus-visible:outline-[#F2B705] rounded-lg"
        >
          <img
            src="/assets/aistudio/IMG-20180925-WA0019_301d84a7.jpg"
            alt="Logo officiel ALGB"
            className="w-10 h-10 object-contain rounded-lg bg-white p-0.5 border border-[#F2B705]/60 shrink-0 transition-transform duration-200 group-hover:scale-105"
          />
          <span className="text-base sm:text-lg font-bold tracking-tight text-white font-heading leading-tight whitespace-nowrap group-hover:text-[#F2B705] transition-colors">
            ALGB Alumni
          </span>
        </button>

        {/* Zone 2: Tous les menus alignés sur une seule ligne, police bien visible et très animée */}
        <nav
          aria-label="Navigation principale"
          className="hidden lg:flex flex-1 items-center justify-center gap-1 xl:gap-1.5 overflow-x-auto scrollbar-none py-1"
        >
          {visibleNavItems.map((item) => {
            const isActive =
              activeTab === item.tab ||
              (item.tab === 'mediatheque' && activeTab === 'galerie');
            return (
              <button
                key={item.tab}
                type="button"
                onClick={() => handleNav(item.tab)}
                aria-current={isActive ? 'page' : undefined}
                className={`group relative px-2.5 xl:px-3 py-2 rounded-lg text-[13.5px] xl:text-[14px] tracking-[0.015em] whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#F2B705] nav-menu-item ${
                  isActive
                    ? 'text-[#F2B705] font-bold bg-[#F2B705]/15 nav-menu-item-active'
                    : 'text-white font-semibold hover:text-[#F2B705] hover:bg-white/10'
                }`}
              >
                <span className="relative z-10">{item.label}</span>

                {/* Barre inférieure animée */}
                <span
                  aria-hidden="true"
                  className={`nav-menu-underline absolute bottom-0.5 left-2 right-2 rounded-full ${
                    isActive
                      ? 'h-[3px] scale-x-100 opacity-100 nav-menu-underline-active'
                      : 'h-[2.5px] bg-[#F2B705] scale-x-0 opacity-0 origin-center group-hover:scale-x-100 group-hover:opacity-100'
                  }`}
                />
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Bouton Mode Sombre aligné dans la barre en haut + Menu Mobile */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Passer au mode clair' : 'Passer au mode sombre'}
            title={theme === 'dark' ? 'Passer au mode clair' : 'Passer au mode sombre'}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-white/25 bg-white/5 text-white hover:text-[#F2B705] hover:border-[#F2B705] hover:bg-[#F2B705]/10 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer whitespace-nowrap focus-visible:outline-2 focus-visible:outline-[#F2B705]"
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-4 h-4 text-[#F2B705]" />
                <span className="hidden xl:inline text-xs font-semibold">Mode clair</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-[#F2B705]" />
                <span className="hidden xl:inline text-xs font-semibold">Mode sombre</span>
              </>
            )}
          </button>

          {/* Mobile Burger Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-white hover:text-[#F2B705] rounded-lg border border-white/20 transition-colors cursor-pointer"
            aria-label={mobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Responsive Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-white/10 bg-[#141413] px-4 pt-4 pb-6 space-y-4 max-h-[82vh] overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {(isAuthenticated || UNRESTRICTED_ACCESS_OVERRIDE) ? (
              <>
                {canSeeMemberSpace && (
                  <button
                    type="button"
                    onClick={() => handleNav('espace-membre')}
                    className="w-full text-center py-2.5 px-3 text-xs font-semibold rounded-lg border border-white text-white hover:bg-white hover:text-[#141413] cursor-pointer flex items-center justify-center gap-2"
                  >
                    <UserCheck className="w-4 h-4" />
                    <span>{sessionDisplayName || 'Espace Membre'}</span>
                  </button>
                )}
                {canSeeAdmin && (
                  <button
                    type="button"
                    onClick={() => handleNav('admin')}
                    className="w-full text-center py-2.5 px-3 text-xs font-semibold rounded-lg border border-[#F2B705]/60 text-[#F2B705] cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Shield className="w-4 h-4" />
                    <span>Administration</span>
                  </button>
                )}
                {!isAuthenticated && (
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      openAuthModal();
                    }}
                    className="w-full text-center py-2.5 px-3 text-xs font-semibold rounded-lg border border-white/40 text-white hover:bg-white hover:text-[#141413] cursor-pointer flex items-center justify-center gap-2"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Connexion</span>
                  </button>
                )}
              </>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  openAuthModal();
                }}
                className="w-full text-center py-2.5 px-3 text-xs font-semibold rounded-lg border border-white text-white hover:bg-white hover:text-[#141413] cursor-pointer flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                <span>Connexion</span>
              </button>
            )}

            {canAccessTab('projets') && (
              <button
                type="button"
                onClick={() => handleNav('projets')}
                className="w-full text-center py-2.5 px-3 text-xs font-bold rounded-lg bg-[#F2B705] text-[#141413] cursor-pointer flex items-center justify-center gap-2"
              >
                <HeartHandshake className="w-4 h-4 text-[#141413]" />
                <span>Faire un don</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-1.5">
            {visibleNavItems.map((item) => {
              const isActive =
                activeTab === item.tab ||
                (item.tab === 'mediatheque' && activeTab === 'galerie');
              return (
                <button
                  key={item.tab}
                  type="button"
                  onClick={() => handleNav(item.tab)}
                  className={`text-left px-3 py-2.5 text-sm font-semibold rounded-lg transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#F2B705] text-[#141413] font-bold'
                      : 'text-white hover:bg-white/10 hover:text-[#F2B705]'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          {isAuthenticated && (
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                logoutSession();
              }}
              className="w-full text-left px-3 py-2.5 text-xs rounded-lg text-red-300 hover:bg-red-950/50 font-semibold flex items-center gap-2 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Se déconnecter ({PROFILE_ACCESS_MATRIX[currentRole].label})</span>
            </button>
          )}
        </div>
      )}
    </header>
  );
};
