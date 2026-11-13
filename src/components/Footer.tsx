import React from 'react';
import { useApp, NavigationTab } from '../context/AppContext';
import {
  MapPin,
  Mail,
  Phone,
  ShieldCheck,
  Award,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { setActiveTab } = useApp();

  const handleNav = (tab: NavigationTab) => {
    setActiveTab(tab);
  };

  return (
    <footer className="border-t border-gray-200 dark:border-zinc-800 text-sm">
      {/* Top Prominent Signature Strip */}
      <div className="border-b border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 py-8 px-4 sm:px-6 lg:px-8 transition-colors">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="flex items-center gap-4">
            <img
              src="/assets/aistudio/IMG-20180925-WA0019_301d84a7.jpg"
              alt="Logo ALGB"
              className="w-16 h-16 object-contain rounded-xl bg-white p-1 border border-gray-200 dark:border-zinc-700 shadow-sm shrink-0"
            />
            <div>
              <p className="text-[#B8860B] dark:text-[#E5B824] font-heading font-bold text-base sm:text-lg tracking-wide uppercase">
                « Une histoire, des générations, un même engagement. »
              </p>
              <p className="text-gray-600 dark:text-zinc-400 text-xs sm:text-sm font-editorial italic mt-0.5">
                « Notre histoire nous rassemble. Notre engagement construit l'avenir. »
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => handleNav('adhesion')}
              className="px-5 py-2.5 text-xs font-bold text-black bg-[#E5B824] hover:bg-[#dcae1f] rounded-lg transition-all cursor-pointer shadow-sm"
            >
              Rejoindre l’Amicale
            </button>
            <button
              onClick={() => handleNav('projets')}
              className="px-5 py-2.5 text-xs font-semibold text-gray-800 dark:text-zinc-100 border border-gray-300 dark:border-zinc-700 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition-all cursor-pointer bg-gray-50 dark:bg-zinc-900"
            >
              Soutenir un projet
            </button>
          </div>
        </div>
      </div>

      {/* Main 4-Column Directory - Deep Noir Impérial with Jaune and Gris Clair */}
      <div className="bg-[#0B0C0E] text-gray-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* Column 1: L'Institution */}
            <div className="space-y-4">
              <h4 className="text-white font-heading text-sm font-bold tracking-wider uppercase border-b border-gray-800 pb-2">
                L’Amicale ALGB
              </h4>
              <p className="text-xs leading-relaxed text-gray-400">
                L’Amicale des Anciens Élèves du Lycée de Garçons de Bingerville fédère toutes les générations
                d’anciens élèves au service de la mémoire, de la fraternité et de l’excellence de notre établissement.
              </p>
              <div className="pt-2">
                <span className="text-[11px] text-gray-500 block uppercase tracking-wider font-semibold">Statut légal</span>
                <span className="text-xs text-gray-300">
                  Association déclarée régie par la loi du 21 septembre 1960 de la République de Côte d’Ivoire.
                </span>
              </div>
            </div>

          {/* Column 2: Navigation Rapide */}
          <div className="space-y-4">
            <h4 className="text-white font-heading text-sm font-semibold tracking-wider uppercase border-b border-gray-800 pb-2">
              Rubriques Principales
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => handleNav('amicale')}
                  className="hover:text-[#E5B824] transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <ChevronRight className="w-3 h-3 text-[#E5B824]" />
                  <span>Présentation & Gouvernance</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('histoire')}
                  className="hover:text-[#E5B824] transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <ChevronRight className="w-3 h-3 text-[#E5B824]" />
                  <span>Histoire & Chronologie du Lycée</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('anciens')}
                  className="hover:text-[#E5B824] transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <ChevronRight className="w-3 h-3 text-[#E5B824]" />
                  <span>Annuaire des Promotions</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('reseau')}
                  className="hover:text-[#E5B824] transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <ChevronRight className="w-3 h-3 text-[#E5B824]" />
                  <span>Réseau Professionnel & Mentorat</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('projets')}
                  className="hover:text-[#E5B824] transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <ChevronRight className="w-3 h-3 text-[#E5B824]" />
                  <span>Projets & Contributions Solidaires</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('mediatheque')}
                  className="hover:text-[#E5B824] transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <ChevronRight className="w-3 h-3 text-[#E5B824]" />
                  <span className="font-semibold text-gray-200">Médiathèque (Photos & YouTube ALGB TV)</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('espace-membre')}
                  className="hover:text-[#E5B824] transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <ChevronRight className="w-3 h-3 text-[#E5B824]" />
                  <span>Tableau de Bord Membre & Cotisation</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Coordonnées & Localisation */}
          <div className="space-y-4">
            <h4 className="text-white font-heading text-sm font-semibold tracking-wider uppercase border-b border-gray-800 pb-2">
              Siège & Contact
            </h4>
            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#E5B824] shrink-0 mt-0.5" />
                <span>
                  Lycée de Garçons de Bingerville, Boulevard Principal, BP 24 Bingerville, District Autonome d’Abidjan, Côte d’Ivoire.
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#E5B824] shrink-0" />
                <span>contact@algb-bingerville.ci</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#E5B824] shrink-0" />
                <span>+225 27 22 40 12 00 / 07 08 09 10 11</span>
              </div>
            </div>
          </div>

          {/* Column 4: Protection des Données & Transparence */}
          <div className="space-y-4">
            <h4 className="text-white font-heading text-sm font-semibold tracking-wider uppercase border-b border-gray-800 pb-2">
              Conformité & Éthique
            </h4>
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-3 space-y-2">
              <div className="flex items-center gap-2 text-white text-xs font-bold">
                <ShieldCheck className="w-4 h-4 text-[#E5B824]" />
                <span>Protection des Données (ARTCI)</span>
              </div>
              <p className="text-[11px] leading-relaxed text-gray-400">
                Traitement des coordonnées conforme à la Loi n° 2013-450 de la République de Côte d’Ivoire. Les coordonnées privées des anciens ne sont jamais commercialisées ni cédées à des tiers.
              </p>
            </div>
            <div className="text-[11px] text-gray-500">
              <span>Gestion financière sous contrôle du Commissariat aux Comptes ALGB.</span>
            </div>
          </div>
        </div>
      </div>
    </div>

      {/* Bottom Bar: Copyright & Mentions */}
      <div className="border-t border-gray-900 bg-black py-4 px-4 sm:px-6 lg:px-8 text-xs text-gray-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <p>© {new Date().getFullYear()} Amicale des Anciens Élèves du Lycée de Garçons de Bingerville (ALGB). Tous droits réservés.</p>
          <div className="flex items-center gap-4 text-[11px]">
            <button onClick={() => handleNav('amicale')} className="hover:text-[#E5B824] transition-colors cursor-pointer">
              Statuts & Règlement
            </button>
            <span aria-hidden="true" className="text-gray-700">·</span>
            <button onClick={() => handleNav('contact')} className="hover:text-[#E5B824] transition-colors cursor-pointer">
              Mentions Légales
            </button>
            <span aria-hidden="true" className="text-gray-700">·</span>
            <button onClick={() => handleNav('contact')} className="hover:text-[#E5B824] transition-colors cursor-pointer">
              Assistance Adhérent
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
