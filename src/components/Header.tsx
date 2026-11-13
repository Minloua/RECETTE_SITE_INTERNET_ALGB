import React, { useState } from 'react';
import { useApp, NavigationTab } from '../context/AppContext';
import {
  Menu,
  X,
  UserCheck,
  Shield,
  CreditCard,
  ChevronDown,
  Sun,
  Moon,
} from 'lucide-react';

export const Header: React.FC = () => {
  const { activeTab, setActiveTab, currentRole, currentUser, theme, toggleTheme } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);

  const handleNav = (tab: NavigationTab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    setMoreDropdownOpen(false);
  };

  const primaryNavItems: { tab: NavigationTab; label: string }[] = [
    { tab: 'accueil', label: 'Accueil' },
    { tab: 'amicale', label: 'L’Amicale' },
    { tab: 'histoire', label: 'Histoire' },
    { tab: 'anciens', label: 'Promotions' },
    { tab: 'reseau', label: 'Réseau Pro' },
    { tab: 'projets', label: 'Projets' },
  ];

  const secondaryNavItems: { tab: NavigationTab; label: string }[] = [
    { tab: 'actualites', label: 'Actualités & Agenda' },
    { tab: 'mediatheque', label: 'Médiathèque (Photos & Vidéos ALGB TV)' },
    { tab: 'contact', label: 'Contact & Partenariats' },
  ];

  const isAdminRole =
    currentRole === 'ADMIN' ||
    currentRole === 'SUPER_ADMIN' ||
    currentRole === 'RESPONSABLE_FINANCE' ||
    currentRole === 'RESPONSABLE_COMM';

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md border-b border-gray-200 dark:border-zinc-800 transition-colors shadow-xs">
      {/* Top Banner Notice: Signature & Status */}
      <div className="bg-gray-50 dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 px-4 py-1.5 text-xs text-gray-600 dark:text-zinc-300 transition-colors">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
            <span className="text-[#B8860B] dark:text-[#E5B824] font-bold tracking-wide uppercase text-[10px] md:text-xs">
              Plateforme Officielle ALGB
            </span>
            <span className="hidden sm:inline text-gray-300 dark:text-zinc-700">|</span>
            <span className="hidden sm:inline italic text-gray-700 dark:text-zinc-300 font-medium">
              « Une histoire, des générations, un même engagement. »
            </span>
          </div>

          <div className="flex items-center gap-3 shrink-0 text-[11px]">
            {currentUser && currentRole !== 'VISITEUR' ? (
              <span className="flex items-center gap-1.5 text-gray-700 dark:text-zinc-300">
                <span className="w-2 h-2 rounded-full bg-[#E5B824]"></span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {currentUser.firstName} {currentUser.lastName}
                </span>
                <span className="text-gray-500 dark:text-zinc-400 font-mono">({currentUser.promotionYear})</span>
              </span>
            ) : (
              <span className="text-gray-500 dark:text-zinc-400">Bingerville, Côte d’Ivoire</span>
            )}

            {isAdminRole && (
              <button
                onClick={() => handleNav('admin')}
                className="flex items-center gap-1 px-2.5 py-0.5 bg-yellow-50 dark:bg-yellow-500/15 text-yellow-900 dark:text-[#E5B824] border border-yellow-300 dark:border-[#E5B824]/40 rounded text-[11px] font-semibold hover:bg-yellow-100 dark:hover:bg-yellow-500/25 transition-colors cursor-pointer"
              >
                <Shield className="w-3 h-3 text-[#B8860B] dark:text-[#E5B824]" />
                <span>Administration</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-8">
        {/* Zone 1: Brand mark featuring the original logo */}
        <button
          onClick={() => handleNav('accueil')}
          className="flex items-center gap-3 text-left shrink-0 group cursor-pointer"
        >
          <img
            src="/assets/aistudio/IMG-20180925-WA0019_301d84a7.jpg"
            alt="Logo officiel ALGB"
            className="w-13 h-13 object-contain rounded-xl bg-white p-0.5 border border-gray-200 dark:border-zinc-700 shadow-sm group-hover:border-[#E5B824] transition-all"
          />
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight text-gray-900 dark:text-white font-heading leading-tight group-hover:text-[#B8860B] dark:group-hover:text-[#E5B824] transition-colors">
              ALGB
            </span>
            <span className="text-[11px] uppercase tracking-wider text-gray-500 dark:text-zinc-400 font-medium whitespace-nowrap hidden lg:inline">
              Lycée de Garçons de Bingerville
            </span>
          </div>
        </button>

        {/* Zone 2: Navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-700 dark:text-zinc-300">
          {primaryNavItems.map((item) => {
            const isActive = activeTab === item.tab;
            return (
              <button
                key={item.tab}
                onClick={() => handleNav(item.tab)}
                className={`transition-colors whitespace-nowrap cursor-pointer py-1 relative ${
                  isActive
                    ? 'text-black dark:text-white font-bold'
                    : 'text-gray-700 dark:text-zinc-300 hover:text-black dark:hover:text-white'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#E5B824] rounded-full"></span>
                )}
              </button>
            );
          })}

          {/* More menu dropdown */}
          <div className="relative">
            <button
              onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
              className="flex items-center gap-1 text-gray-700 dark:text-zinc-300 hover:text-black dark:hover:text-white py-1 transition-colors whitespace-nowrap cursor-pointer font-medium"
            >
              <span>Plus</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
            {moreDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-52 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-xl shadow-xl py-2 z-50">
                {secondaryNavItems.map((item) => (
                  <button
                    key={item.tab}
                    onClick={() => handleNav(item.tab)}
                    className="w-full text-left px-4 py-2.5 text-xs text-gray-700 dark:text-zinc-200 hover:bg-yellow-50 dark:hover:bg-zinc-800 hover:text-gray-900 dark:hover:text-[#E5B824] font-medium transition-colors cursor-pointer"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* Zone 3: Theme Toggle & Primary action button */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Passer au mode clair' : 'Passer au mode sombre'}
            title={theme === 'dark' ? 'Passer au mode clair' : 'Passer au mode sombre'}
            className="p-2 rounded-lg border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-900 text-gray-700 dark:text-[#E5B824] hover:border-[#E5B824] hover:text-black dark:hover:bg-zinc-800 transition-colors cursor-pointer shrink-0 flex items-center gap-1.5"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
            <span className="hidden xl:inline text-[11px] font-semibold">
              {theme === 'dark' ? 'Clair' : 'Sombre'}
            </span>
          </button>

          {currentUser && currentRole !== 'VISITEUR' ? (
            <button
              onClick={() => handleNav('espace-membre')}
              className={`px-4 py-2 text-xs font-semibold rounded-lg border transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'espace-membre'
                  ? 'bg-[#E5B824] text-black border-[#E5B824] shadow-sm'
                  : 'bg-gray-100 dark:bg-zinc-900 text-gray-800 dark:text-zinc-100 border-gray-300 dark:border-zinc-700 hover:border-[#E5B824] hover:bg-gray-200 dark:hover:bg-zinc-800'
              }`}
            >
              <UserCheck className={`w-3.5 h-3.5 ${activeTab === 'espace-membre' ? 'text-black' : 'text-black dark:text-[#E5B824]'}`} />
              <span>Espace Membre</span>
            </button>
          ) : (
            <button
              onClick={() => handleNav('adhesion')}
              className="px-4 py-2 text-xs font-bold text-black bg-[#E5B824] hover:bg-[#dcae1f] rounded-lg transition-all shadow-sm cursor-pointer whitespace-nowrap flex items-center gap-1.5"
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Rejoindre l’ALGB</span>
            </button>
          )}

          {/* Mobile hamburger toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-600 dark:text-zinc-300 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 pt-3 pb-6 space-y-2">
          <div className="grid grid-cols-2 gap-2 pb-3 border-b border-gray-200 dark:border-zinc-800">
            <button
              onClick={() => handleNav('adhesion')}
              className="w-full text-center py-2 px-3 text-xs font-bold rounded-lg bg-[#E5B824] text-black"
            >
              Adhérer à l’Amicale
            </button>
            <button
              onClick={() => handleNav('espace-membre')}
              className="w-full text-center py-2 px-3 text-xs font-medium rounded-lg border border-gray-300 dark:border-zinc-700 text-gray-800 dark:text-zinc-100 bg-gray-50 dark:bg-zinc-900"
            >
              Espace Membre
            </button>
          </div>

          <div className="space-y-1">
            {[...primaryNavItems, ...secondaryNavItems].map((item) => (
              <button
                key={item.tab}
                onClick={() => handleNav(item.tab)}
                className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors cursor-pointer ${
                  activeTab === item.tab
                    ? 'bg-yellow-50 dark:bg-yellow-500/15 text-black dark:text-[#E5B824] font-bold'
                    : 'text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-900'
                }`}
              >
                {item.label}
              </button>
            ))}

            {isAdminRole && (
              <button
                onClick={() => handleNav('admin')}
                className="w-full text-left px-3 py-2 text-sm rounded-lg text-yellow-900 dark:text-[#E5B824] bg-yellow-50 dark:bg-yellow-500/15 font-bold flex items-center gap-2 mt-2"
              >
                <Shield className="w-4 h-4 text-[#B8860B] dark:text-[#E5B824]" />
                <span>Console d’Administration</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
