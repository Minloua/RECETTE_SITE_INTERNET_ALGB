import React, { useState } from 'react';
import { EXECUTIVE_BOARD } from '../data/mockData';
import { AmicaleFaqSection } from '../components/AmicaleFaqSection';
import {
  Shield,
  Award,
  FileText,
  Users,
  Building,
  CheckCircle,
  Info,
} from 'lucide-react';

export const AmicaleView: React.FC = () => {
  const [activeTabSub, setActiveTabSub] = useState<'MISSIONS' | 'BUREAU' | 'STATUTS' | 'PARTENAIRES'>('MISSIONS');
  const [statutModalOpen, setStatutModalOpen] = useState(false);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 bg-white dark:bg-zinc-950 text-gray-900 dark:text-zinc-100">
      {/* Title & Institutional Intro */}
      <div className="border-b border-gray-200 dark:border-zinc-800 pb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <img
            src="/assets/aistudio/IMG-20180925-WA0019_301d84a7.jpg"
            alt="Logo ALGB"
            className="w-20 h-20 object-contain rounded-xl bg-white p-1.5 border border-gray-200 dark:border-zinc-700 shadow-sm shrink-0"
          />
          <div>
            <span className="text-xs uppercase tracking-widest font-bold text-[#B8860B] dark:text-[#E5B824]">
              Institution & Gouvernance
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold font-heading text-black dark:text-white mt-1">
              L’Amicale des Anciens Élèves (ALGB)
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-zinc-400 font-editorial italic mt-0.5">
              « Une histoire, des générations, un même engagement. »
            </p>
          </div>
        </div>

        {/* Sub-tabs */}
        <div className="flex flex-wrap gap-1 p-1 bg-gray-100 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl text-xs">
          <button
            onClick={() => setActiveTabSub('MISSIONS')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer font-bold ${
              activeTabSub === 'MISSIONS'
                ? 'bg-[#E5B824] text-black shadow-xs'
                : 'text-gray-700 dark:text-zinc-300 hover:text-black dark:hover:text-white'
            }`}
          >
            Missions & Vision
          </button>
          <button
            onClick={() => setActiveTabSub('BUREAU')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer font-bold ${
              activeTabSub === 'BUREAU'
                ? 'bg-[#E5B824] text-black shadow-xs'
                : 'text-gray-700 dark:text-zinc-300 hover:text-black dark:hover:text-white'
            }`}
          >
            Bureau Exécutif
          </button>
          <button
            onClick={() => setActiveTabSub('STATUTS')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer font-bold ${
              activeTabSub === 'STATUTS'
                ? 'bg-[#E5B824] text-black shadow-xs'
                : 'text-gray-700 dark:text-zinc-300 hover:text-black dark:hover:text-white'
            }`}
          >
            Statuts & Règlement
          </button>
          <button
            onClick={() => setActiveTabSub('PARTENAIRES')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer font-bold ${
              activeTabSub === 'PARTENAIRES'
                ? 'bg-[#E5B824] text-black shadow-xs'
                : 'text-gray-700 dark:text-zinc-300 hover:text-black dark:hover:text-white'
            }`}
          >
            Partenaires
          </button>
          <button
            type="button"
            onClick={() => {
              document.getElementById('faq-amicale')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-3 py-1.5 rounded-lg transition-colors cursor-pointer font-bold text-gray-700 dark:text-zinc-300 hover:text-black dark:hover:text-white hover:bg-white dark:hover:bg-zinc-800"
          >
            FAQ
          </button>
        </div>
      </div>

      {/* Tab: Missions & Vision */}
      {activeTabSub === 'MISSIONS' && (
        <div className="space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <h2 className="text-xl font-bold font-heading text-black dark:text-white">
                La Raison d’Être de notre Amicale
              </h2>
              <p className="text-xs sm:text-sm text-gray-700 dark:text-zinc-300 leading-relaxed">
                Créée pour maintenir vivace la flamme de la fraternité et de la reconnaissance, l'Amicale des Anciens Élèves du Lycée de Garçons de Bingerville rassemble tous ceux qui ont partagé les bancs, les dortoirs, les laboratoires et les terrains de sport de cette prestigieuse institution.
              </p>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-zinc-400 leading-relaxed">
                Notre mission s'articule autour de la transmission intergénérationnelle : faire en sorte que chaque nouvelle promotion bénéficie de l'expérience, du réseau et de l'appui bienveillant des promotions aînées, tout en rendant au lycée ce qu'il nous a si généreusement donné.
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-6 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#B8860B] dark:text-[#E5B824] font-heading">
                Nos Valeurs Cardinales
              </h3>
              <div className="space-y-3 text-xs">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 text-[#B8860B] dark:text-[#E5B824] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-gray-900 dark:text-white block font-bold">Excellence & Mérite Académique</strong>
                    <span className="text-gray-600 dark:text-zinc-400">Promouvoir le travail acharné, la rigueur intellectuelle et récompenser les meilleurs talents.</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 text-[#B8860B] dark:text-[#E5B824] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-gray-900 dark:text-white block font-bold">Fraternité & Solidarité Agissante</strong>
                    <span className="text-gray-600 dark:text-zinc-400">Ne laisser aucun ancien élève ni aucun jeune élève isolé dans l'adversité.</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 text-[#B8860B] dark:text-[#E5B824] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-gray-900 dark:text-white block font-bold">Devoir de Mémoire & Préservation</strong>
                    <span className="text-gray-600 dark:text-zinc-400">Sauvegarder le patrimoine architectural, historique et archivistique du Lycée de Bingerville.</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 text-[#B8860B] dark:text-[#E5B824] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-gray-900 dark:text-white block font-bold">Intégrité & Transparence</strong>
                    <span className="text-gray-600 dark:text-zinc-400">Gouvernance démocratique, traçabilité rigoureuse de chaque cotisation et don perçu.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Bureau Exécutif */}
      {activeTabSub === 'BUREAU' && (
        <div className="space-y-8">
          <div className="bg-yellow-50/70 dark:bg-yellow-500/15 border border-yellow-200 dark:border-yellow-500/30 rounded-xl p-4 flex items-start gap-3 text-xs text-gray-700 dark:text-zinc-300">
            <Info className="w-4 h-4 text-[#B8860B] dark:text-[#E5B824] shrink-0 mt-0.5" />
            <div>
              <strong className="text-gray-900 dark:text-white block font-bold">Organisation Institutionnelle Réglementaire</strong>
              <span>
                Le Bureau Exécutif est élu en Assemblée Générale pour un mandat de 3 ans. Conformément à la règle de rigueur institutionnelle, les mandats et compositions sont mis à jour après chaque scrutin officiel.
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {EXECUTIVE_BOARD.map((officer, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-6 space-y-4 hover:border-gray-400 dark:hover:border-zinc-600 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] text-gray-500 dark:text-zinc-400 mb-2">
                    <span className="text-[#B8860B] dark:text-[#E5B824] font-bold font-mono">{officer.mandate}</span>
                    <span className="px-2 py-0.5 bg-gray-100 dark:bg-zinc-800 rounded border border-gray-200 dark:border-zinc-700 font-medium dark:text-zinc-300">
                      {officer.promotion}
                    </span>
                  </div>

                  <h3 className="text-xs font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">
                    {officer.role}
                  </h3>
                  <div className="text-base font-bold font-heading text-black dark:text-white mt-1">
                    {officer.name}
                  </div>
                  <div className="text-xs text-gray-700 dark:text-zinc-300 mt-1">
                    {officer.profession}
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-100 dark:border-zinc-800 text-[10px] text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5 font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span>{officer.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Statuts & Règlement */}
      {activeTabSub === 'STATUTS' && (
        <div className="space-y-8">
          <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-gray-200 dark:border-zinc-800">
              <div>
                <span className="text-xs uppercase tracking-widest font-bold text-[#B8860B] dark:text-[#E5B824]">
                  Textes Fondateurs
                </span>
                <h3 className="text-lg font-heading font-bold text-black dark:text-white mt-1">
                  Statuts & Règlement Intérieur de l’ALGB
                </h3>
                <p className="text-xs text-gray-600 dark:text-zinc-400 mt-1">
                  Adoptés en Assemblée Générale Constitutive et conformes à la loi ivoirienne sur les associations.
                </p>
              </div>

              <button
                onClick={() => setStatutModalOpen(true)}
                className="px-5 py-2.5 text-xs font-bold rounded-lg bg-[#E5B824] text-black hover:bg-[#dcae1f] transition-all flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <FileText className="w-4 h-4" />
                <span>Consulter le Texte Intégral</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
              <div className="p-4 rounded-xl bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 space-y-2">
                <span className="font-bold text-gray-900 dark:text-white block font-heading">Titre I : Dénomination & Siège</span>
                <p className="text-gray-600 dark:text-zinc-400">
                  L'association dénommée « Amicale des Anciens Élèves du Lycée de Garçons de Bingerville » (ALGB) a son siège social à Bingerville.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 space-y-2">
                <span className="font-bold text-gray-900 dark:text-white block font-heading">Titre II : Adhésion & Membres</span>
                <p className="text-gray-600 dark:text-zinc-400">
                  Peut être membre toute personne ayant effectué au moins une année scolaire au Lycée de Garçons de Bingerville et s'acquittant de sa cotisation statutaire.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 space-y-2">
                <span className="font-bold text-gray-900 dark:text-white block font-heading">Titre III : Assemblée Générale</span>
                <p className="text-gray-600 dark:text-zinc-400">
                  L'Assemblée Générale est l'organe suprême de l'association. Elle se réunit en session ordinaire une fois par an et élit le Bureau Exécutif.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Partenaires */}
      {activeTabSub === 'PARTENAIRES' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-6 text-center space-y-3 hover:shadow-md transition-all">
              <Building className="w-8 h-8 text-[#B8860B] dark:text-[#E5B824] mx-auto" />
              <h4 className="text-xs font-bold text-gray-900 dark:text-white font-heading">
                Ministère de l’Éducation Nationale
              </h4>
              <p className="text-[11px] text-gray-600 dark:text-zinc-400">
                Tutelle ministérielle et direction régionale de l'enseignement d'Abidjan.
              </p>
            </div>

            <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-6 text-center space-y-3 hover:shadow-md transition-all">
              <Shield className="w-8 h-8 text-[#B8860B] dark:text-[#E5B824] mx-auto" />
              <h4 className="text-xs font-bold text-gray-900 dark:text-white font-heading">
                Mairie de Bingerville
              </h4>
              <p className="text-[11px] text-gray-600 dark:text-zinc-400">
                Partenaire territorial historique dans la préservation du patrimoine de la commune.
              </p>
            </div>

            <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-6 text-center space-y-3 hover:shadow-md transition-all">
              <Award className="w-8 h-8 text-[#B8860B] dark:text-[#E5B824] mx-auto" />
              <h4 className="text-xs font-bold text-gray-900 dark:text-white font-heading">
                Grandes Écoles & Universités
              </h4>
              <p className="text-[11px] text-gray-600 dark:text-zinc-400">
                Partenariats avec l'INP-HB, l'UFHB et les écoles d'ingénieurs pour l'accueil de nos boursiers.
              </p>
            </div>

            <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-6 text-center space-y-3 hover:shadow-md transition-all">
              <Users className="w-8 h-8 text-[#B8860B] dark:text-[#E5B824] mx-auto" />
              <h4 className="text-xs font-bold text-gray-900 dark:text-white font-heading">
                Entreprises Partenaires ALGB
              </h4>
              <p className="text-[11px] text-gray-600 dark:text-zinc-400">
                Réseau de sociétés dirigées par des anciens offrant stages et financements de mécénat.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Interactive FAQ Section */}
      <AmicaleFaqSection />

      {/* Modal Textes Statuts */}
      {statutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/75 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col">
            <div className="bg-gray-50 dark:bg-zinc-950 px-6 py-4 border-b border-gray-200 dark:border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-2 text-black dark:text-white font-heading font-bold text-sm">
                <FileText className="w-4 h-4 text-[#B8860B] dark:text-[#E5B824]" />
                <span>Extrait Officiel des Statuts ALGB</span>
              </div>
              <button
                onClick={() => setStatutModalOpen(false)}
                className="text-gray-500 dark:text-zinc-400 hover:text-black dark:hover:text-white font-semibold text-xs cursor-pointer"
              >
                Fermer ✕
              </button>
            </div>
            <div className="p-6 overflow-y-auto text-xs text-gray-800 dark:text-zinc-300 space-y-4 font-editorial leading-relaxed">
              <p className="font-bold text-black dark:text-white uppercase font-heading">
                PRÉAMBULE
              </p>
              <p>
                Considérant l'attachement indéfectible des anciens élèves au Lycée de Garçons de Bingerville, creuset de leur formation civique et intellectuelle, les membres fondateurs ont résolu de s'unir au sein d'une association apolitique et laïque ayant pour vocation la solidarité et le développement de leur ancien établissement.
              </p>
              <p className="font-bold text-black dark:text-white uppercase font-heading">
                ARTICLE 1 : CRÉATION & OBJET
              </p>
              <p>
                Il est fondé entre les adhérents aux présents statuts une association régie par la loi du 21 septembre 1960, ayant pour dénomination : « Amicale des Anciens Élèves du Lycée de Garçons de Bingerville » (ALGB).
              </p>
              <p className="font-bold text-black dark:text-white uppercase font-heading">
                ARTICLE 4 : RESSOURCES FINANCIÈRES
              </p>
              <p>
                Les ressources de l'Amicale proviennent des cotisations annuelles des membres, des dons, des souscriptions pour projets spécifiques et des subventions publiques autorisées par la loi. La gestion est assurée selon les règles de la comptabilité moderne sous contrôle annuel du Commissariat aux Comptes.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
