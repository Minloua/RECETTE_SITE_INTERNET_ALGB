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
  Download,
  Eye,
  X,
  Scale,
} from 'lucide-react';

interface GovernanceDocument {
  id: string;
  title: string;
  category: string;
  updatedAt: string;
  summary: string;
  content: string;
}

const GOVERNANCE_DOCUMENTS: GovernanceDocument[] = [
  {
    id: 'doc-statuts',
    title: 'Statuts Officiels de l’ALGB (Loi n° 60-315)',
    category: 'Textes Fondateurs',
    updatedAt: 'Révision AG 2024',
    summary: 'Objet associatif, siège social à Bingerville, qualité de membre et organes dirigeants.',
    content:
      'AMICALE DES ANCIENS ÉLÈVES DU LYCÉE DE GARÇONS DE BINGERVILLE (ALGB)\n' +
      'STATUTS OFFICIELS — ASSOCIATION RÉGIE PAR LA LOI N° 60-315 DU 21 SEPTEMBRE 1960\n\n' +
      'Article 1 — Dénomination : ALGB, siège BP 24 Bingerville, République de Côte d’Ivoire.\n' +
      'Article 2 — Objet : Fédérer les promotions du LGB, soutenir les élèves méritants par des bourses en FCFA, entretenir la solidarité intergénérationnelle et préserver le patrimoine fondé en 1903.\n' +
      'Article 3 — Organes : L’Assemblée Générale Ordinaire annuelle, le Bureau Exécutif National élu pour 3 ans et le Commissariat aux Comptes.\n' +
      'Article 4 — Ressources : Droits d’adhésion (10 000 FCFA), cotisations statutaires mensuelles (2 000 FCFA/mois) et dons de mécénat affectés.',
  },
  {
    id: 'doc-reglement',
    title: 'Règlement Intérieur & Charte d’Éthique',
    category: 'Gouvernance',
    updatedAt: 'Édition 2026',
    summary: 'Règles de quorum, modalités de mentorat, éligibilité aux services et code de conduite.',
    content:
      'RÈGLEMENT INTÉRIEUR DE L’ALGB (ÉDITION 2026)\n\n' +
      'Section 1 — Cotisations & Éligibilité : L’accès au Collège des Parrains, aux offres Carrières exécutives et au droit de vote en Assemblée Générale requiert une cotisation à jour pour l’exercice en cours.\n' +
      'Section 2 — Mentorat & Réseau : Les échanges entre parrains et jeunes diplômés s’exercent à titre bénévole dans le respect strict de la déontologie.\n' +
      'Section 3 — Protection des données : Application stricte de la loi ARTCI n° 2013-450 sur la confidentialité des annuaires.',
  },
  {
    id: 'doc-rapport-financier',
    title: 'Rapport Moral & Financier — Exercice 2025',
    category: 'Transparence Financière',
    updatedAt: 'Certifié Janvier 2026',
    summary: 'Bilan complet des cotisations encaissées, dons de mécénat et décaissements en FCFA.',
    content:
      'RAPPORT MORAL & FINANCIER 2025 — COMMISSARIAT AUX COMPTES ALGB\n\n' +
      '1. Recettes globales encaissées : 29 500 000 FCFA (Cotisations : 9 200 000 FCFA · Mécénat & Bourses : 20 300 000 FCFA).\n' +
      '2. Décaissements directs sur campus : 26 400 000 FCFA (Rénovation Bibliothèque Scientifique, 18 Bourses d’Excellence, Infirmerie).\n' +
      '3. Frais de fonctionnement administratif : 6,4 % du budget total, inférieurs au plafond statutaire de 10 %.\n' +
      '4. Quitus financier accordé à l’unanimité des membres présents à jour de cotisation.',
  },
  {
    id: 'doc-pv-ag',
    title: 'Procès-Verbal de l’Assemblée Générale 2026',
    category: 'Décisions Souveraines',
    updatedAt: 'Abidjan · Mars 2026',
    summary: 'Résolutions votées pour le plan d’action 2026, digitalisation et fonds de bourses.',
    content:
      'PROCÈS-VERBAL DE L’ASSEMBLÉE GÉNÉRALE ORDINAIRE 2026\n\n' +
      'Lieu : Amphithéâtre du Lycée de Garçons de Bingerville.\n' +
      'Résolution 1 : Adoption du plan de rénovation du Laboratoire Numérique et de l’extension des bourses d’excellence (objectif 45 000 000 FCFA).\n' +
      'Résolution 2 : Déploiement des paiements certifiés UEMOA (Wave CI, Orange Money, MTN MoMo, Moov Money) et des cartes membres QR HMAC-SHA256.\n' +
      'Résolution 3 : Renforcement de la conformité ARTCI et publication semestrielle des jalons de chantiers.',
  },
];

export const AmicaleView: React.FC = () => {
  const [activeTabSub, setActiveTabSub] = useState<'MISSIONS' | 'BUREAU' | 'STATUTS' | 'PARTENAIRES'>('MISSIONS');
  const [statutModalOpen, setStatutModalOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<GovernanceDocument | null>(null);

  const handleDownloadDoc = (doc: GovernanceDocument) => {
    const blob = new Blob([doc.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${doc.id}-ALGB.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

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

        {/* Transparence & Documents Officiels */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-[#141413]/10 dark:border-white/10 pb-4">
            <div>
              <span className="text-xs uppercase tracking-[0.16em] font-semibold text-[#16324F] dark:text-[#F2B705] inline-flex items-center gap-1.5">
                <Scale className="w-3.5 h-3.5" />
                <span>Gouvernance & Redevabilité</span>
              </span>
              <h2 className="text-2xl font-heading font-bold text-[#141413] dark:text-white mt-1">
                Transparence & Documents Officiels
              </h2>
            </div>
            <p className="text-xs text-[#4A4A48] dark:text-zinc-400">
              Textes statutaires, rapports financiers certifiés en FCFA et procès-verbaux d’Assemblée Générale.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {GOVERNANCE_DOCUMENTS.map((doc) => (
              <article
                key={doc.id}
                className="bg-white dark:bg-[#1e1e1c] border border-[#141413]/10 dark:border-white/10 rounded-xl p-5 shadow-editorial flex flex-col justify-between gap-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2 text-[11px]">
                    <span className="px-2.5 py-0.5 rounded bg-[#FEF8E6] dark:bg-[#2a2719] text-[#141413] dark:text-[#F2B705] font-semibold">
                      {doc.category}
                    </span>
                    <span className="font-mono text-[#4A4A48] dark:text-zinc-400">{doc.updatedAt}</span>
                  </div>
                  <h3 className="text-base font-heading font-bold text-[#141413] dark:text-white">
                    {doc.title}
                  </h3>
                  <p className="text-xs text-[#4A4A48] dark:text-zinc-300 leading-relaxed">
                    {doc.summary}
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-[#141413]/10 dark:border-white/10">
                  <button
                    type="button"
                    onClick={() => setSelectedDoc(doc)}
                    className="px-3.5 py-2 rounded-lg bg-[#16324F] hover:bg-[#1e4268] text-white text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-[#F2B705]" />
                    <span>Consulter</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDownloadDoc(doc)}
                    className="px-3.5 py-2 rounded-lg border border-[#141413]/15 dark:border-white/15 hover:border-[#F2B705] text-[#141413] dark:text-zinc-200 text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Télécharger (.txt)</span>
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Interactive FAQ Section */}
        <AmicaleFaqSection />
      </div>

      {/* Modal Document Officiel */}
      {selectedDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#141413]/70 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl bg-white dark:bg-[#1e1e1c] border border-[#141413]/15 dark:border-white/15 rounded-xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col">
            <div className="bg-[#16324F] text-white px-6 py-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 font-heading font-bold text-sm min-w-0">
                <FileText className="w-4 h-4 text-[#F2B705] shrink-0" />
                <span className="truncate">{selectedDoc.title}</span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => handleDownloadDoc(selectedDoc)}
                  className="px-3 py-1 rounded-lg bg-[#F2B705] text-[#141413] font-bold text-xs inline-flex items-center gap-1 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Télécharger</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedDoc(null)}
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            <pre className="p-6 overflow-y-auto whitespace-pre-wrap font-sans text-xs sm:text-sm text-[#141413] dark:text-zinc-200 leading-relaxed">
              {selectedDoc.content}
            </pre>
          </div>
        </div>
      )}

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
