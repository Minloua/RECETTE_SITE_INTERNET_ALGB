import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { NavigationTab, useApp } from '../context/AppContext';

const TAB_LABELS: Record<NavigationTab, string> = {
  accueil: 'Accueil',
  amicale: 'L’Amicale',
  histoire: 'Histoire',
  anciens: 'Annuaire',
  reseau: 'Carrières',
  mentorat: 'Mentorat',
  actualites: 'Événements',
  projets: 'Mécénat',
  galerie: 'Médiathèque',
  mediatheque: 'Médiathèque',
  adhesion: 'Adhésion',
  'espace-membre': 'Espace Membre',
  contact: 'Contact',
  admin: 'Administration',
};

export const PageBackBar: React.FC = () => {
  const { activeTab, previousTab, goBack, setActiveTab } = useApp();

  const currentLabel = TAB_LABELS[activeTab] || 'Page';
  const previousLabel = previousTab ? TAB_LABELS[previousTab] : null;

  return (
    <div className="bg-[#FFFFFF] dark:bg-[#191917] border-b border-[#141413]/10 dark:border-white/10 transition-colors no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={goBack}
          aria-label={
            previousLabel
              ? `Retour à la page précédente (${previousLabel})`
              : 'Retour à la page précédente'
          }
          className="group inline-flex items-center gap-2.5 px-4 py-2 rounded-lg bg-[#141413] dark:bg-[#232320] text-white border border-[#F2B705]/70 hover:bg-[#F2B705] hover:text-[#141413] hover:border-[#F2B705] text-xs sm:text-[13px] font-semibold shadow-xs transition-all duration-200 hover:-translate-x-0.5 active:scale-95 cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-[#F2B705]"
        >
          <ArrowLeft className="w-4 h-4 text-[#F2B705] group-hover:text-[#141413] transition-transform duration-200 group-hover:-translate-x-0.5 shrink-0" />
          <span>Retour à la page précédente</span>
          {previousLabel && (
            <span className="hidden sm:inline text-white/75 group-hover:text-[#141413]/85 font-medium">
              · {previousLabel}
            </span>
          )}
        </button>

        <nav
          aria-label="Fil d’Ariane"
          className="hidden sm:flex items-center gap-2 text-xs text-[#4A4A48] dark:text-zinc-400 min-w-0"
        >
          <button
            type="button"
            onClick={() => setActiveTab('accueil')}
            className="hover:text-[#141413] dark:hover:text-white transition-colors cursor-pointer whitespace-nowrap"
          >
            Accueil
          </button>
          {activeTab !== 'accueil' && (
            <>
              <span aria-hidden="true" className="text-[#141413]/30 dark:text-white/30">
                /
              </span>
              <span className="font-semibold text-[#141413] dark:text-white truncate">
                {currentLabel}
              </span>
            </>
          )}
        </nav>
      </div>
    </div>
  );
};
