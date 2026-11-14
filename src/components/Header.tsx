import React, { useState, useRef, useEffect } from 'react';
import { useApp, NavigationTab } from '../context/AppContext';
import { PROFILE_ACCESS_MATRIX, UNRESTRICTED_ACCESS_OVERRIDE } from '../utils/accessMatrix';
import {
  Menu,
  X,
  UserCheck,
  Shield,
  HeartHandshake,
  ChevronDown,
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
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setMoreDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNav = (tab: NavigationTab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    setMoreDropdownOpen(false);
  };

  // Navigation globale persistante : Accueil, Annuaire, Carrières, Mentorat, Événements, Mécénat
  const allPrimaryNavItems: { tab: NavigationTab; label: string }[] = [
    { tab: 'accueil', label: 'Accueil' },
    { tab: 'anciens', label: 'Annuaire' },
    { tab: 'reseau', label: 'Carrières' },
    { tab: 'mentorat', label: 'Mentorat' },
    { tab: 'actualites', label: 'Événements' },
    { tab: 'projets', label: 'Mécénat' },
  ];
  const primaryNavItems = allPrimaryNavItems.filter((item) => canAccessTab(item.tab));

  const allSecondaryNavItems: { tab: NavigationTab; label: string }[] = [
    { tab: 'amicale', label: 'L’Amicale & Gouvernance' },
    { tab: 'histoire', label: 'Histoire & Patrimoine' },
    { tab: 'mediatheque', label: 'Médiathèque & ALGB TV' },
    { tab: 'adhesion', label: 'Adhésion & Enrôlement' },
    { tab: 'contact', label: 'Contact & Partenariats' },
  ];
  const secondaryNavItems = allSecondaryNavItems.filter((item) => canAccessTab(item.tab));

  const isAuthenticated = currentRole !== 'VISITEUR' && activeCredential !== null;
  const canSeeAdmin = (UNRESTRICTED_ACCESS_OVERRIDE || isAuthenticated) && canAccessTab('admin');
  const canSeeMemberSpace = (UNRESTRICTED_ACCESS_OVERRIDE || isAuthenticated) && canAccessTab('espace-membre');

  const sessionDisplayName = currentUser
    ? `${currentUser.firstName} ${currentUser.lastName}`
    : activeCredential?.displayName || '';

  return (
    <header className="sticky top-0 z-40 bg-[#141413] text-white border-b border-white/10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between gap-4">
        {/* Zone 1: Brand mark */}
        <button
          type="button"
          onClick={() => handleNav('accueil')}
          className="flex items-center gap-3 text-left shrink-0 group cursor-pointer"
        >
          <img
            src="/assets/aistudio/IMG-20180925-WA0019_301d84a7.jpg"
            alt="Logo officiel ALGB"
            className="w-10 h-10 object-contain rounded-lg bg-white p-0.5 border border-[#F2B705]/60 shrink-0"
          />
          <div className="flex flex-col">
            <span className="text-base sm:text-lg font-bold tracking-tight text-white font-heading leading-tight group-hover:text-[#F2B705] transition-colors">
              ALGB Alumni
            </span>
            <span className="text-[10px] uppercase tracking-[0.14em] text-zinc-400 font-medium whitespace-nowrap hidden xl:inline">
              Lycée de Garçons de Bingerville
            </span>
          </div>
        </button>

        {/* Zone 2: Primary Navigation Links */}
        <nav
          aria-label="Navigation principale"
          className="hidden lg:flex items-center gap-6 text-[13px] font-medium text-white"
        >
          {primaryNavItems.map((item) => {
            const isActive = activeTab === item.tab;
            return (
              <button
                key={item.tab}
                type="button"
                onClick={() => handleNav(item.tab)}
                className={`relative py-2 whitespace-nowrap cursor-pointer transition-colors ${
                  isActive ? 'text-[#F2B705] font-semibold' : 'text-white hover:text-[#F2B705]'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#F2B705] rounded-full" />
                )}
              </button>
            );
          })}

          {secondaryNavItems.length > 0 && (
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
                className="flex items-center gap-1 py-2 text-zinc-300 hover:text-white transition-colors whitespace-nowrap cursor-pointer font-medium"
              >
                <span>Institution</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
              {moreDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-60 bg-[#141413] border border-white/15 rounded-xl shadow-2xl py-2 z-50">
                  {secondaryNavItems.map((item) => (
                    <button
                      key={item.tab}
                      type="button"
                      onClick={() => handleNav(item.tab)}
                      className={`w-full text-left px-4 py-2.5 text-xs font-medium transition-colors cursor-pointer ${
                        activeTab === item.tab
                          ? 'text-[#F2B705] bg-white/5 font-semibold'
                          : 'text-zinc-200 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </nav>

        {/* Zone 3: Actions ("Connexion" outline blanc + "Faire un don" Jaune Solaire + Theme toggle) */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Passer au mode clair' : 'Passer au mode sombre'}
            title={theme === 'dark' ? 'Passer au mode clair' : 'Passer au mode sombre'}
            className="p-2 rounded-lg border border-white/20 text-zinc-200 hover:text-[#F2B705] hover:border-[#F2B705]/60 transition-colors cursor-pointer"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {(isAuthenticated || UNRESTRICTED_ACCESS_OVERRIDE) ? (
            <div className="hidden sm:flex items-center gap-2">
              {canSeeMemberSpace && (
                <button
                  type="button"
                  onClick={() => handleNav('espace-membre')}
                  className={`px-3.5 py-2 text-xs font-semibold rounded-lg border transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                    activeTab === 'espace-membre'
                      ? 'bg-white text-[#141413] border-white'
                      : 'border-white/60 text-white hover:bg-white hover:text-[#141413]'
                  }`}
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span className="max-w-[120px] truncate">{sessionDisplayName || 'Espace Membre'}</span>
                </button>
              )}

              {canSeeAdmin && (
                <button
                  type="button"
                  onClick={() => handleNav('admin')}
                  title={`Console Admin (${PROFILE_ACCESS_MATRIX[currentRole].label})`}
                  className={`px-3 py-2 text-xs font-semibold rounded-lg border transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                    activeTab === 'admin'
                      ? 'bg-[#FEF8E6] text-[#141413] border-[#F2B705]'
                      : 'border-white/30 text-zinc-200 hover:border-[#F2B705] hover:text-[#F2B705]'
                  }`}
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span className="hidden xl:inline">Admin</span>
                </button>
              )}

              {isAuthenticated ? (
                <button
                  type="button"
                  onClick={logoutSession}
                  title="Se déconnecter"
                  aria-label="Se déconnecter"
                  className="p-2 rounded-lg border border-white/25 text-zinc-300 hover:text-white hover:border-white transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => openAuthModal()}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg border border-white/40 text-white hover:bg-white hover:text-[#141413] transition-colors cursor-pointer whitespace-nowrap"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Connexion</span>
                </button>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={() => openAuthModal()}
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg border border-white text-white hover:bg-white hover:text-[#141413] transition-colors cursor-pointer whitespace-nowrap"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Connexion</span>
            </button>
          )}

          {canAccessTab('projets') && (
            <button
              type="button"
              onClick={() => handleNav('projets')}
              className="px-4 py-2 text-xs font-semibold text-[#141413] bg-[#F2B705] hover:bg-[#dfa704] rounded-lg transition-colors cursor-pointer whitespace-nowrap inline-flex items-center gap-1.5 shadow-xs"
            >
              <HeartHandshake className="w-3.5 h-3.5 text-[#141413]" />
              <span>Faire un don</span>
            </button>
          )}

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
        <div className="lg:hidden border-t border-white/10 bg-[#141413] px-4 pt-4 pb-6 space-y-4">
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
                    <span>Espace Membre</span>
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
                    className="w-full sm:col-span-2 text-center py-2.5 px-3 text-xs font-semibold rounded-lg border border-white/40 text-white hover:bg-white hover:text-[#141413] cursor-pointer flex items-center justify-center gap-2"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Connexion Membre</span>
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
                <span>Connexion Membre</span>
              </button>
            )}
          </div>

          <div className="space-y-1">
            {primaryNavItems.map((item) => (
              <button
                key={item.tab}
                type="button"
                onClick={() => handleNav(item.tab)}
                className={`w-full text-left px-3 py-2.5 text-sm rounded-lg transition-colors cursor-pointer ${
                  activeTab === item.tab
                    ? 'bg-[#F2B705] text-[#141413] font-semibold'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                {item.label}
              </button>
            ))}

            {secondaryNavItems.length > 0 && (
              <div className="pt-2 mt-2 border-t border-white/10 space-y-1">
                <div className="px-3 py-1 text-[10px] uppercase tracking-wider text-zinc-400 font-semibold">
                  Institution & Archives
                </div>
                {secondaryNavItems.map((item) => (
                  <button
                    key={item.tab}
                    type="button"
                    onClick={() => handleNav(item.tab)}
                    className={`w-full text-left px-3 py-2 text-xs rounded-lg transition-colors cursor-pointer ${
                      activeTab === item.tab
                        ? 'text-[#F2B705] bg-white/10 font-semibold'
                        : 'text-zinc-300 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}

            {isAuthenticated && (
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  logoutSession();
                }}
                className="w-full text-left px-3 py-2.5 text-xs rounded-lg text-red-300 hover:bg-red-950/50 font-semibold flex items-center gap-2 mt-2 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Se déconnecter ({PROFILE_ACCESS_MATRIX[currentRole].label})</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
