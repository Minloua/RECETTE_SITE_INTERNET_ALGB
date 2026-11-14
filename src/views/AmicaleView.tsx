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
    <div className="bg-[#F8F8F6] dark:bg-[#141413] min-h-screen text-[#141413] dark:text-[#F8F8F6] transition-colors">
      {/* Deep Ultramarine Institutional Hero */}
      <section className="bg-[#16324F] text-white border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
          <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-6">
            <div className="flex items-center gap-5">
              <img
                src="/assets/aistudio/IMG-20180925-WA0019_301d84a7.jpg"
                alt="Logo ALGB"
                className="w-16 h-16 sm:w-20 sm:h-20 object-contain rounded-xl bg-white p-1.5 border border-[#F2B705]/70 shadow-sm shrink-0"
              />
              <div>
                <span className="text-xs uppercase tracking-[0.16em] font-semibold text-[#F2B705]">
                  Institution & Gouvernance
                </span>
                <h1 className="text-2xl sm:text-4xl font-bold font-heading text-white mt-1">
                  L’Amicale des Anciens Élèves (ALGB)
                </h1>
                <p className="text-xs sm:text-sm text-zinc-200 font-editorial italic mt-1">
                  « Une histoire, des générations, un même engagement. »
                </p>
              </div>
            </div>

            {/* Sub-tabs */}
            <div className="flex flex-wrap gap-1.5 p-1.5 bg-white/10 border border-white/15 rounded-xl text-xs">
              <button
                type="button"
                onClick={() => setActiveTabSub('MISSIONS')}
                className={`px-3.5 py-2 rounded-lg transition-colors cursor-pointer font-semibold whitespace-nowrap ${
                  activeTabSub === 'MISSIONS'
                    ? 'bg-[#F2B705] text-[#141413]'
                    : 'text-zinc-200 hover:text-white hover:bg-white/10'
                }`}
              >
                Missions & Vision
              </button>
              <button
                type="button"
                onClick={() => setActiveTabSub('BUREAU')}
                className={`px-3.5 py-2 rounded-lg transition-colors cursor-pointer font-semibold whitespace-nowrap ${
                  activeTabSub === 'BUREAU'
                    ? 'bg-[#F2B705] text-[#141413]'
                    : 'text-zinc-200 hover:text-white hover:bg-white/10'
                }`}
              >
                Bureau Exécutif
              </button>
              <button
                type="button"
                onClick={() => setActiveTabSub('STATUTS')}
                className={`px-3.5 py-2 rounded-lg transition-colors cursor-pointer font-semibold whitespace-nowrap ${
                  activeTabSub === 'STATUTS'
                    ? 'bg-[#F2B705] text-[#141413]'
                    : 'text-zinc-200 hover:text-white hover:bg-white/10'
                }`}
              >
                Statuts & Règlement
              </button>
              <button
                type="button"
                onClick={() => setActiveTabSub('PARTENAIRES')}
                className={`px-3.5 py-2 rounded-lg transition-colors cursor-pointer font-semibold whitespace-nowrap ${
                  activeTabSub === 'PARTENAIRES'
                    ? 'bg-[#F2B705] text-[#141413]'
                    : 'text-zinc-200 hover:text-white hover:bg-white/10'
                }`}
              >
                Partenaires
              </button>
              <button
                type="button"
                onClick={() => {
                  document.getElementById('faq-amicale')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-3.5 py-2 rounded-lg transition-colors cursor-pointer font-semibold whitespace-nowrap text-zinc-200 hover:text-white hover:bg-white/10"
              >
                FAQ
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        {/* Tab: Missions & Vision */}
        {activeTabSub === 'MISSIONS' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <span className="text-xs uppercase tracking-[0.14em] font-semibold text-[#16324F] dark:text-[#F2B705] block">
                Vocation Fraternelle
              </span>
              <h2 className="text-2xl font-bold font-heading text-[#141413] dark:text-white">
                La Raison d’Être de notre Amicale
              </h2>
              <p className="text-sm text-[#4A4A48] dark:text-zinc-300 leading-relaxed">
                Créée pour maintenir vivace la flamme de la fraternité et de la reconnaissance, l’Amicale des Anciens Élèves du Lycée de Garçons de Bingerville rassemble tous ceux qui ont partagé les bancs, les dortoirs, les laboratoires et les terrains de sport de cette prestigieuse institution.
              </p>
              <p className="text-sm text-[#4A4A48] dark:text-zinc-400 leading-relaxed">
                Notre mission s’articule autour de la transmission intergénérationnelle : faire en sorte que chaque nouvelle promotion bénéficie de l’expérience, du réseau et de l’appui bienveillant des promotions aînées, tout en rendant au lycée ce qu’il nous a si généreusement donné.
              </p>
            </div>

            <div className="bg-white dark:bg-[#1e1e1c] border border-[#141413]/10 dark:border-white/10 rounded-xl p-6 sm:p-7 space-y-4 shadow-editorial">
              <h3 className="text-base font-bold text-[#16324F] dark:text-[#F2B705] font-heading border-b border-[#141413]/10 dark:border-white/10 pb-3">
                Nos Valeurs Cardinales
              </h3>
              <div className="space-y-4 text-xs sm:text-sm">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 text-[#16324F] dark:text-[#F2B705] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#141413] dark:text-white block font-semibold">Excellence & Mérite Académique</strong>
                    <span className="text-[#4A4A48] dark:text-zinc-400 text-xs">Promouvoir le travail acharné, la rigueur intellectuelle et récompenser les meilleurs talents.</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 text-[#16324F] dark:text-[#F2B705] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#141413] dark:text-white block font-semibold">Fraternité & Solidarité Agissante</strong>
                    <span className="text-[#4A4A48] dark:text-zinc-400 text-xs">Ne laisser aucun ancien élève ni aucun jeune élève isolé dans l’adversité.</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 text-[#16324F] dark:text-[#F2B705] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#141413] dark:text-white block font-semibold">Devoir de Mémoire & Préservation</strong>
                    <span className="text-[#4A4A48] dark:text-zinc-400 text-xs">Sauvegarder le patrimoine architectural, historique et archivistique du Lycée de Bingerville.</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 text-[#16324F] dark:text-[#F2B705] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#141413] dark:text-white block font-semibold">Intégrité & Transparence</strong>
                    <span className="text-[#4A4A48] dark:text-zinc-400 text-xs">Gouvernance démocratique, traçabilité rigoureuse de chaque cotisation et don perçu.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab: Bureau Exécutif */}
        {activeTabSub === 'BUREAU' && (
          <div className="space-y-8">
            <div className="bg-[#FEF8E6] dark:bg-[#2a2719] border border-[#F2B705]/40 rounded-xl p-4 sm:p-5 flex items-start gap-3 text-xs text-[#141413] dark:text-[#FEF8E6]">
              <Info className="w-4 h-4 text-[#16324F] dark:text-[#F2B705] shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#141413] dark:text-white block font-semibold">Organisation Institutionnelle Réglementaire</strong>
                <span className="text-[#4A4A48] dark:text-zinc-300">
                  Le Bureau Exécutif est élu en Assemblée Générale pour un mandat de 3 ans. Conformément à la règle de rigueur institutionnelle, les mandats et compositions sont mis à jour après chaque scrutin officiel.
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {EXECUTIVE_BOARD.map((officer, idx) => (
                <div
                  key={idx}
                  className="bg-white dark:bg-[#1e1e1c] border border-[#141413]/10 dark:border-white/10 rounded-xl p-6 space-y-4 shadow-editorial hover:border-[#16324F]/40 dark:hover:border-[#F2B705]/50 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-[#4A4A48] dark:text-zinc-400 mb-2">
                      <span className="text-[#16324F] dark:text-[#F2B705] font-semibold font-mono">{officer.mandate}</span>
                      <span className="text-[#4A4A48] dark:text-zinc-300 font-medium">
                        {officer.promotion}
                      </span>
                    </div>

                    <h3 className="text-xs font-semibold text-[#4A4A48] dark:text-zinc-400 uppercase tracking-wider font-sans">
                      {officer.role}
                    </h3>
                    <div className="text-lg font-bold font-heading text-[#141413] dark:text-white mt-1">
                      {officer.name}
                    </div>
                    <div className="text-xs text-[#4A4A48] dark:text-zinc-300 mt-1">
                      {officer.profession}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#141413]/10 dark:border-white/10 text-[11px] text-[#16324F] dark:text-[#F2B705] flex items-center gap-1.5 font-semibold">
                    <CheckCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{officer.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab: Statuts & Règlement */}
        {activeTabSub === 'STATUTS' && (
          <div className="bg-white dark:bg-[#1e1e1c] border border-[#141413]/10 dark:border-white/10 rounded-xl p-6 sm:p-8 space-y-6 shadow-editorial">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#141413]/10 dark:border-white/10">
              <div>
                <span className="text-xs uppercase tracking-[0.14em] font-semibold text-[#16324F] dark:text-[#F2B705]">
                  Textes Fondateurs
                </span>
                <h3 className="text-xl font-heading font-bold text-[#141413] dark:text-white mt-1">
                  Statuts & Règlement Intérieur de l’ALGB
                </h3>
                <p className="text-xs text-[#4A4A48] dark:text-zinc-400 mt-1">
                  Adoptés en Assemblée Générale Constitutive et conformes à la loi ivoirienne sur les associations.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setStatutModalOpen(true)}
                className="px-5 py-2.5 text-xs font-semibold rounded-lg bg-[#F2B705] text-[#141413] hover:bg-[#dfa704] transition-colors flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0"
              >
                <FileText className="w-4 h-4 text-[#141413]" />
                <span>Consulter le Texte Intégral</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
              <div className="p-5 rounded-xl bg-[#F8F8F6] dark:bg-[#141413] border border-[#141413]/10 dark:border-white/10 space-y-2">
                <span className="font-bold text-sm text-[#141413] dark:text-white block font-heading">Titre I : Dénomination & Siège</span>
                <p className="text-[#4A4A48] dark:text-zinc-400 leading-relaxed">
                  L’association dénommée « Amicale des Anciens Élèves du Lycée de Garçons de Bingerville » (ALGB) a son siège social à Bingerville.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-[#F8F8F6] dark:bg-[#141413] border border-[#141413]/10 dark:border-white/10 space-y-2">
                <span className="font-bold text-sm text-[#141413] dark:text-white block font-heading">Titre II : Adhésion & Membres</span>
                <p className="text-[#4A4A48] dark:text-zinc-400 leading-relaxed">
                  Peut être membre toute personne ayant effectué au moins une année scolaire au Lycée de Garçons de Bingerville et s’acquittant de sa cotisation statutaire.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-[#F8F8F6] dark:bg-[#141413] border border-[#141413]/10 dark:border-white/10 space-y-2">
                <span className="font-bold text-sm text-[#141413] dark:text-white block font-heading">Titre III : Assemblée Générale</span>
                <p className="text-[#4A4A48] dark:text-zinc-400 leading-relaxed">
                  L’Assemblée Générale est l’organe suprême de l’association. Elle se réunit en session ordinaire une fois par an et élit le Bureau Exécutif.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab: Partenaires */}
        {activeTabSub === 'PARTENAIRES' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-[#1e1e1c] border border-[#141413]/10 dark:border-white/10 rounded-xl p-6 text-center space-y-3 shadow-editorial hover:border-[#16324F]/40 transition-all">
              <Building className="w-8 h-8 text-[#16324F] dark:text-[#F2B705] mx-auto" />
              <h4 className="text-sm font-bold text-[#141413] dark:text-white font-heading">
                Ministère de l’Éducation Nationale
              </h4>
              <p className="text-xs text-[#4A4A48] dark:text-zinc-400 leading-relaxed">
                Tutelle ministérielle et direction régionale de l’enseignement d’Abidjan.
              </p>
            </div>

            <div className="bg-white dark:bg-[#1e1e1c] border border-[#141413]/10 dark:border-white/10 rounded-xl p-6 text-center space-y-3 shadow-editorial hover:border-[#16324F]/40 transition-all">
              <Shield className="w-8 h-8 text-[#16324F] dark:text-[#F2B705] mx-auto" />
              <h4 className="text-sm font-bold text-[#141413] dark:text-white font-heading">
                Mairie de Bingerville
              </h4>
              <p className="text-xs text-[#4A4A48] dark:text-zinc-400 leading-relaxed">
                Partenaire territorial historique dans la préservation du patrimoine de la commune.
              </p>
            </div>

            <div className="bg-white dark:bg-[#1e1e1c] border border-[#141413]/10 dark:border-white/10 rounded-xl p-6 text-center space-y-3 shadow-editorial hover:border-[#16324F]/40 transition-all">
              <Award className="w-8 h-8 text-[#16324F] dark:text-[#F2B705] mx-auto" />
              <h4 className="text-sm font-bold text-[#141413] dark:text-white font-heading">
                Grandes Écoles & Universités
              </h4>
              <p className="text-xs text-[#4A4A48] dark:text-zinc-400 leading-relaxed">
                Partenariats avec l’INP-HB, l’UFHB et les écoles d’ingénieurs pour l’accueil de nos boursiers.
              </p>
            </div>

            <div className="bg-white dark:bg-[#1e1e1c] border border-[#141413]/10 dark:border-white/10 rounded-xl p-6 text-center space-y-3 shadow-editorial hover:border-[#16324F]/40 transition-all">
              <Users className="w-8 h-8 text-[#16324F] dark:text-[#F2B705] mx-auto" />
              <h4 className="text-sm font-bold text-[#141413] dark:text-white font-heading">
                Entreprises Partenaires ALGB
              </h4>
              <p className="text-xs text-[#4A4A48] dark:text-zinc-400 leading-relaxed">
                Réseau de sociétés dirigées par des anciens offrant stages et financements de mécénat.
              </p>
            </div>
          </div>
        )}

        {/* Interactive FAQ Section */}
        <AmicaleFaqSection />
      </div>

      {/* Modal Textes Statuts */}
      {statutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#141413]/70 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl bg-white dark:bg-[#1e1e1c] border border-[#141413]/15 dark:border-white/15 rounded-xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col">
            <div className="bg-[#16324F] text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2 font-heading font-bold text-sm">
                <FileText className="w-4 h-4 text-[#F2B705]" />
                <span>Extrait Officiel des Statuts ALGB</span>
              </div>
              <button
                type="button"
                onClick={() => setStatutModalOpen(false)}
                className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold text-xs cursor-pointer transition-colors"
              >
                Fermer ✕
              </button>
            </div>
            <div className="p-6 overflow-y-auto text-xs sm:text-sm text-[#4A4A48] dark:text-zinc-300 space-y-4 font-editorial leading-relaxed">
              <p className="font-bold text-[#141413] dark:text-white uppercase font-heading">
                PRÉAMBULE
              </p>
              <p>
                Considérant l’attachement indéfectible des anciens élèves au Lycée de Garçons de Bingerville, creuset de leur formation civique et intellectuelle, les membres fondateurs ont résolu de s’unir au sein d’une association apolitique et laïque ayant pour vocation la solidarité et le développement de leur ancien établissement.
              </p>
              <p className="font-bold text-[#141413] dark:text-white uppercase font-heading">
                ARTICLE 1 : CRÉATION & OBJET
              </p>
              <p>
                Il est fondé entre les adhérents aux présents statuts une association régie par la loi du 21 septembre 1960, ayant pour dénomination : « Amicale des Anciens Élèves du Lycée de Garçons de Bingerville » (ALGB).
              </p>
              <p className="font-bold text-[#141413] dark:text-white uppercase font-heading">
                ARTICLE 4 : RESSOURCES FINANCIÈRES
              </p>
              <p>
                Les ressources de l’Amicale proviennent des cotisations annuelles des membres, des dons, des souscriptions pour projets spécifiques et des subventions publiques autorisées par la loi. La gestion est assurée selon les règles de la comptabilité moderne sous contrôle annuel du Commissariat aux Comptes.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
