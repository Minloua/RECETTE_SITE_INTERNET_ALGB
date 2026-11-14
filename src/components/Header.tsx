import React, { useEffect, useRef, useState } from 'react';
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
  ChevronDown,
} from 'lucide-react';

interface NavPoleDropdown {
  id: 'institution' | 'reseau' | 'rejoindre';
  label: string;
  items: { tab: NavigationTab; label: string; description: string }[];
}

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
  const [openDropdown, setOpenDropdown] = useState<'institution' | 'reseau' | 'rejoindre' | null>(null);
  const navRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpenDropdown(null);
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const handleNav = (tab: NavigationTab) => {
    setActiveTab(tab);
    setOpenDropdown(null);
    setMobileMenuOpen(false);
  };

  const poles: Array<
    | { kind: 'single'; tab: NavigationTab; label: string }
    | ({ kind: 'dropdown' } & NavPoleDropdown)
  > = [
    { kind: 'single', tab: 'accueil', label: 'Accueil' },
    {
      kind: 'dropdown',
      id: 'institution',
      label: 'Institution',
      items: [
        { tab: 'amicale', label: 'L’Amicale', description: 'Bureau Exécutif, Statuts & Transparence' },
        { tab: 'histoire', label: 'Histoire & Patrimoine', description: 'Mémoire du Lycée depuis 1903' },
      ],
    },
    {
      kind: 'dropdown',
      id: 'reseau',
      label: 'Réseau',
      items: [
        { tab: 'anciens', label: 'Annuaire', description: 'Promotions & Base des compétences BDR' },
        { tab: 'reseau', label: 'Carrières', description: 'Offres & opportunités exécutives' },
        { tab: 'mentorat', label: 'Mentorat', description: 'Collège des Parrains & dirigeants' },
        { tab: 'mediatheque', label: 'Médiathèque', description: 'Archives photo & chaîne vidéo' },
      ],
    },
    { kind: 'single', tab: 'actualites', label: 'Événements' },
    { kind: 'single', tab: 'projets', label: 'Mécénat' },
    {
      kind: 'dropdown',
      id: 'rejoindre',
      label: 'Rejoindre',
      items: [
        { tab: 'adhesion', label: 'Adhésion', description: 'Enrôlement officiel & carte ALGB' },
        { tab: 'contact', label: 'Contact', description: 'Secrétariat Général & permanences' },
      ],
    },
  ];

  const isAuthenticated = currentRole !== 'VISITEUR' && activeCredential !== null;
  const canSeeAdmin = (UNRESTRICTED_ACCESS_OVERRIDE || isAuthenticated) && canAccessTab('admin');
  const canSeeMemberSpace =
    (UNRESTRICTED_ACCESS_OVERRIDE || isAuthenticated) && canAccessTab('espace-membre');

  const sessionDisplayName = currentUser
    ? `${currentUser.firstName} ${currentUser.lastName}`
    : activeCredential?.displayName || '';

  return (
    <header className="sticky top-0 z-40 bg-[#141413] text-white border-b border-white/10 transition-colors">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-[72px] flex items-center justify-between gap-4 lg:gap-8">
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

        {/* Zone 2: 6 Pôles de Navigation Aérés & Animés */}
        <nav
          ref={navRef}
          aria-label="Navigation principale en 6 pôles"
          className="hidden lg:flex flex-1 items-center justify-center gap-2 xl:gap-4"
        >
          {poles.map((pole) => {
            if (pole.kind === 'single') {
              if (!canAccessTab(pole.tab)) return null;
              const isActive = activeTab === pole.tab;
              return (
                <button
                  key={pole.tab}
                  type="button"
                  onClick={() => handleNav(pole.tab)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`group relative px-3.5 py-2 rounded-lg text-[14px] tracking-[0.02em] whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#F2B705] nav-menu-item ${
                    isActive
                      ? 'text-[#F2B705] font-bold bg-[#F2B705]/15 nav-menu-item-active'
                      : 'text-white font-semibold hover:text-[#F2B705] hover:bg-white/10'
                  }`}
                >
                  <span className="relative z-10">{pole.label}</span>
                  <span
                    aria-hidden="true"
                    className={`nav-menu-underline absolute bottom-0.5 left-2.5 right-2.5 rounded-full ${
                      isActive
                        ? 'h-[3px] scale-x-100 opacity-100 nav-menu-underline-active'
                        : 'h-[2.5px] bg-[#F2B705] scale-x-0 opacity-0 origin-center group-hover:scale-x-100 group-hover:opacity-100'
                    }`}
                  />
                </button>
              );
            }

            const visibleSubItems = pole.items.filter((sub) => canAccessTab(sub.tab));
            if (visibleSubItems.length === 0) return null;

            const isGroupActive = visibleSubItems.some(
              (sub) =>
                activeTab === sub.tab ||
                (sub.tab === 'mediatheque' && activeTab === 'galerie')
            );
            const isOpen = openDropdown === pole.id;

            return (
              <div
                key={pole.id}
                className="relative"
                onMouseEnter={() => setOpenDropdown(pole.id)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <button
                  type="button"
                  onClick={() => setOpenDropdown(isOpen ? null : pole.id)}
                  aria-expanded={isOpen}
                  aria-haspopup="menu"
                  className={`group relative px-3.5 py-2 rounded-lg text-[14px] tracking-[0.02em] whitespace-nowrap shrink-0 cursor-pointer inline-flex items-center gap-1.5 focus-visible:outline-2 focus-visible:outline-[#F2B705] nav-menu-item ${
                    isGroupActive || isOpen
                      ? 'text-[#F2B705] font-bold bg-[#F2B705]/15 nav-menu-item-active'
                      : 'text-white font-semibold hover:text-[#F2B705] hover:bg-white/10'
                  }`}
                >
                  <span className="relative z-10">{pole.label}</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-[#F2B705]' : ''
                    }`}
                  />
                  <span
                    aria-hidden="true"
                    className={`nav-menu-underline absolute bottom-0.5 left-2.5 right-2.5 rounded-full ${
                      isGroupActive
                        ? 'h-[3px] scale-x-100 opacity-100 nav-menu-underline-active'
                        : 'h-[2.5px] bg-[#F2B705] scale-x-0 opacity-0 origin-center group-hover:scale-x-100 group-hover:opacity-100'
                    }`}
                  />
                </button>

                {isOpen && (
                  <div
                    role="menu"
                    className="absolute left-0 top-full pt-1.5 w-64 z-50"
                  >
                    <div className="rounded-xl bg-[#191917] border border-[#F2B705]/30 shadow-2xl p-1.5 space-y-1">
                      {visibleSubItems.map((sub) => {
                        const subActive =
                          activeTab === sub.tab ||
                          (sub.tab === 'mediatheque' && activeTab === 'galerie');
                        return (
                          <button
                            key={sub.tab}
                            type="button"
                            role="menuitem"
                            onClick={() => handleNav(sub.tab)}
                            className={`w-full text-left px-3 py-2.5 rounded-lg transition-all cursor-pointer block ${
                              subActive
                                ? 'bg-[#F2B705] text-[#141413]'
                                : 'text-white hover:bg-white/10 hover:text-[#F2B705]'
                            }`}
                          >
                            <div className="text-xs font-bold leading-tight">{sub.label}</div>
                            <div
                              className={`text-[10px] mt-0.5 leading-snug ${
                                subActive ? 'text-[#141413]/80 font-medium' : 'text-zinc-400'
                              }`}
                            >
                              {sub.description}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
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
            {isAuthenticated || UNRESTRICTED_ACCESS_OVERRIDE ? (
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

          <div className="space-y-3">
            {poles.map((pole) => {
              if (pole.kind === 'single') {
                if (!canAccessTab(pole.tab)) return null;
                const isActive = activeTab === pole.tab;
                return (
                  <button
                    key={pole.tab}
                    type="button"
                    onClick={() => handleNav(pole.tab)}
                    className={`w-full text-left px-3 py-2.5 text-sm font-semibold rounded-lg transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#F2B705] text-[#141413] font-bold'
                        : 'text-white bg-white/5 hover:bg-white/10 hover:text-[#F2B705]'
                    }`}
                  >
                    {pole.label}
                  </button>
                );
              }
              const visibleItems = pole.items.filter((i) => canAccessTab(i.tab));
              if (visibleItems.length === 0) return null;
              return (
                <div key={pole.id} className="space-y-1.5">
                  <div className="px-2 text-[10px] uppercase tracking-[0.14em] font-semibold text-[#F2B705]">
                    {pole.label}
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    {visibleItems.map((sub) => {
                      const subActive =
                        activeTab === sub.tab ||
                        (sub.tab === 'mediatheque' && activeTab === 'galerie');
                      return (
                        <button
                          key={sub.tab}
                          type="button"
                          onClick={() => handleNav(sub.tab)}
                          className={`text-left px-3 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                            subActive
                              ? 'bg-[#F2B705] text-[#141413] font-bold'
                              : 'text-white bg-white/5 hover:bg-white/10 hover:text-[#F2B705]'
                          }`}
                        >
                          {sub.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-2 border-t border-white/10 flex flex-wrap gap-3 text-[11px] text-zinc-400">
            <button type="button" onClick={() => handleNav('mentions-legales')} className="hover:text-[#F2B705] cursor-pointer">
              Mentions légales
            </button>
            <button type="button" onClick={() => handleNav('confidentialite')} className="hover:text-[#F2B705] cursor-pointer">
              Confidentialité ARTCI
            </button>
            <button type="button" onClick={() => handleNav('cgu')} className="hover:text-[#F2B705] cursor-pointer">
              CGU & Mécénat
            </button>
          </div>

          {isAuthenticated && (
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                void logoutSession();
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
