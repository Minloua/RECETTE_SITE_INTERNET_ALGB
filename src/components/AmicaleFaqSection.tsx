import React, { useMemo, useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Search,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  HelpCircle,
  X,
} from 'lucide-react';

export type FaqTopic = 'TOUTES' | 'ADHESION' | 'PROJETS' | 'RESEAU';

interface FaqItem {
  id: string;
  number: string;
  topic: Exclude<FaqTopic, 'TOUTES'>;
  topicLabel: string;
  reference: string;
  question: string;
  answer: string;
  details?: string[];
  action?: {
    label: string;
    onTrigger: 'adhesion' | 'projets' | 'anciens' | 'reseau' | 'espace-membre' | 'contact' | 'enroll';
  };
}

const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'faq-adh-1',
    number: '01',
    topic: 'ADHESION',
    topicLabel: 'Adhésion',
    reference: 'Statuts Titre II · Conditions',
    question: 'Qui peut devenir membre de l’Amicale (ALGB) et comment s’inscrire ?',
    answer:
      'Toute personne ayant effectué au moins une année scolaire au Lycée de Garçons de Bingerville peut rejoindre l’Amicale. L’inscription s’effectue en ligne en renseignant votre promotion de sortie, votre parcours professionnel et vos préférences de confidentialité.',
    details: [
      'Validation de la demande par le délégué de promotion ou le secrétariat du Bureau Exécutif.',
      'Attribution automatique d’un matricule officiel ALGB et génération de votre carte d’adhérent.',
    ],
    action: {
      label: 'Accéder au formulaire d’adhésion',
      onTrigger: 'adhesion',
    },
  },
  {
    id: 'faq-adh-2',
    number: '02',
    topic: 'ADHESION',
    topicLabel: 'Adhésion',
    reference: 'Trésorerie · Cotisations',
    question: 'Quel est le montant des cotisations et quels moyens de paiement sont acceptés ?',
    answer:
      'La cotisation mensuelle statutaire est fixée à 5 000 FCFA (soit 60 000 FCFA par an), accompagnée du droit d’adhésion initial lors de l’entrée dans l’Amicale. Vous pouvez régler vos échéances en une ou plusieurs mensualités depuis votre Espace Membre.',
    details: [
      'Paiement mobile accepté : Orange Money, MTN MoMo et Moov Money.',
      'Paiement bancaire accepté : Carte Bancaire et Virement sur le compte officiel de l’ALGB.',
      'Un reçu numéroté et un quitus financier sont édités immédiatement après validation.',
    ],
    action: {
      label: 'Ouvrir mon espace de paiement',
      onTrigger: 'espace-membre',
    },
  },
  {
    id: 'faq-adh-3',
    number: '03',
    topic: 'ADHESION',
    topicLabel: 'Adhésion',
    reference: 'Carte Officielle · QR Code',
    question: 'À quoi sert le QR Code présent sur la carte officielle de membre ?',
    answer:
      'Chaque carte de membre intègre un QR Code sécurisé lié à votre matricule ALGB. Lorsqu’il est flashé lors des assemblées, retrouvailles ou opérations de trésorerie, il permet de vérifier instantanément le statut d’adhésion et de synchroniser les tables de paiement après authentification selon la matrice des profils.',
    action: {
      label: 'Voir ma carte dans l’Espace Membre',
      onTrigger: 'espace-membre',
    },
  },
  {
    id: 'faq-proj-1',
    number: '04',
    topic: 'PROJETS',
    topicLabel: 'Projets',
    reference: 'Action Sociale & Lycée',
    question: 'Comment sont sélectionnés et financés les projets pour le Lycée de Bingerville ?',
    answer:
      'Les projets sont identifiés conjointement avec la Direction du Lycée et les commissions techniques de l’ALGB selon cinq axes : Infrastructure, Éducation, Numérique, Santé et Solidarité. Chaque initiative dispose d’un objectif budgétaire public et d’un suivi transparent des décaissements.',
    details: [
      'Appels à contribution ouverts à titre individuel ou collectif par promotion.',
      'Traçabilité complète : chaque don apparaît dans le journal financier du projet concerné.',
    ],
    action: {
      label: 'Découvrir les projets en cours',
      onTrigger: 'projets',
    },
  },
  {
    id: 'faq-proj-2',
    number: '05',
    topic: 'PROJETS',
    topicLabel: 'Projets',
    reference: 'Mécénat · Transparence',
    question: 'Puis-je contribuer à un projet spécifique au nom de ma promotion ou de façon anonyme ?',
    answer:
      'Oui. Lors d’une contribution sur la page Projets, vous pouvez associer votre don à votre année de promotion afin de soutenir la mobilisation intergénérationnelle, ou choisir la confidentialité tout en conservant votre reçu nominatif dans votre historique personnel.',
    action: {
      label: 'Soutenir un projet du lycée',
      onTrigger: 'projets',
    },
  },
  {
    id: 'faq-proj-3',
    number: '06',
    topic: 'PROJETS',
    topicLabel: 'Projets',
    reference: 'Commissions · Propositions',
    question: 'Comment soumettre une idée de projet ou devenir partenaire technique d’un chantier ?',
    answer:
      'Tout membre actif peut proposer une initiative (réhabilitation, dotation informatique, bourse d’excellence ou parrainage médical) en adressant une note de cadrage au Bureau Exécutif via la rubrique Contact, ou en sollicitant son délégué de promotion.',
    action: {
      label: 'Contacter le Bureau Exécutif',
      onTrigger: 'contact',
    },
  },
  {
    id: 'faq-res-1',
    number: '07',
    topic: 'RESEAU',
    topicLabel: 'Réseau',
    reference: 'Annuaire & BDR',
    question: 'Comment retrouver un ancien camarade par sa promotion, son pseudo ou son secteur ?',
    answer:
      'L’Annuaire des Anciens Élèves permet d’effectuer une recherche rapide par nom, prénom, pseudo du lycée, année de promotion ou secteur d’activité. La carte mondiale interactive visualise également la répartition des membres en Côte d’Ivoire et au sein de la diaspora.',
    action: {
      label: 'Explorer l’Annuaire & Promotions',
      onTrigger: 'anciens',
    },
  },
  {
    id: 'faq-res-2',
    number: '08',
    topic: 'RESEAU',
    topicLabel: 'Réseau',
    reference: 'Mentorat · Entraide',
    question: 'Comment intégrer la Base de Données des Compétences (BDR) ou devenir mentor ?',
    answer:
      'La Base de Données des Compétences recense les expertises de nos anciens élèves pour faciliter les stages, le mentorat des cadets, le conseil et les opportunités d’affaires. Vous pouvez actualiser vos domaines de maîtrise et disponibilités à tout moment via l’enrôlement BDR.',
    details: [
      'Disponibilités configurables : mentorat, formations, consultances, stages ou animation.',
      'Respect strict du consentement RGPD : vos coordonnées directes ne sont visibles que selon vos réglages et pour les membres habilités.',
    ],
    action: {
      label: 'Mettre à jour mon profil BDR',
      onTrigger: 'enroll',
    },
  },
  {
    id: 'faq-res-3',
    number: '09',
    topic: 'RESEAU',
    topicLabel: 'Réseau',
    reference: 'Hub Réseau · Opportunités',
    question: 'Comment fonctionne la mise en relation professionnelle et l’espace mentorat ?',
    answer:
      'Le portail Réseau centralise les offres d’emploi, les stages réservés aux cadets du lycée et les profils de mentors volontaires. Les membres connectés peuvent solliciter une mise en relation directe ou filtrer les mentors disponibles par expertise.',
    action: {
      label: 'Accéder au Réseau & Mentorat',
      onTrigger: 'reseau',
    },
  },
];

const TOPIC_OPTIONS: { id: FaqTopic; label: string }[] = [
  { id: 'TOUTES', label: 'Toutes' },
  { id: 'ADHESION', label: 'Adhésion' },
  { id: 'PROJETS', label: 'Projets' },
  { id: 'RESEAU', label: 'Réseau' },
];

export const AmicaleFaqSection: React.FC = () => {
  const { setActiveTab, setEnrollmentModalOpen } = useApp();
  const [selectedTopic, setSelectedTopic] = useState<FaqTopic>('TOUTES');
  const [searchTerm, setSearchTerm] = useState('');
  const [openIds, setOpenIds] = useState<string[]>([FAQ_ITEMS[0].id]);

  const topicCounts = useMemo(() => {
    return {
      TOUTES: FAQ_ITEMS.length,
      ADHESION: FAQ_ITEMS.filter((i) => i.topic === 'ADHESION').length,
      PROJETS: FAQ_ITEMS.filter((i) => i.topic === 'PROJETS').length,
      RESEAU: FAQ_ITEMS.filter((i) => i.topic === 'RESEAU').length,
    };
  }, []);

  const filteredFaq = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return FAQ_ITEMS.filter((item) => {
      if (selectedTopic !== 'TOUTES' && item.topic !== selectedTopic) {
        return false;
      }
      if (!q) return true;
      const inDetails = (item.details || []).some((d) => d.toLowerCase().includes(q));
      return (
        item.question.toLowerCase().includes(q) ||
        item.answer.toLowerCase().includes(q) ||
        item.topicLabel.toLowerCase().includes(q) ||
        item.reference.toLowerCase().includes(q) ||
        inDetails
      );
    });
  }, [selectedTopic, searchTerm]);

  const toggleItem = (id: string) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  const allVisibleExpanded =
    filteredFaq.length > 0 && filteredFaq.every((item) => openIds.includes(item.id));

  const handleToggleAll = () => {
    if (allVisibleExpanded) {
      const visibleIds = new Set(filteredFaq.map((i) => i.id));
      setOpenIds((prev) => prev.filter((id) => !visibleIds.has(id)));
    } else {
      setOpenIds((prev) => Array.from(new Set([...prev, ...filteredFaq.map((i) => i.id)])));
    }
  };

  const handleActionTrigger = (
    trigger: NonNullable<FaqItem['action']>['onTrigger']
  ) => {
    if (trigger === 'enroll') {
      setEnrollmentModalOpen(true);
      return;
    }
    setActiveTab(trigger);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTopicChange = (topic: FaqTopic) => {
    setSelectedTopic(topic);
    const firstMatch = FAQ_ITEMS.find((item) => topic === 'TOUTES' || item.topic === topic);
    if (firstMatch && !openIds.includes(firstMatch.id)) {
      setOpenIds((prev) => [...prev, firstMatch.id]);
    }
  };

  return (
    <section
      id="faq-amicale"
      aria-labelledby="faq-amicale-heading"
      className="border-t border-gray-200 dark:border-zinc-800 pt-10 space-y-6"
    >
      {/* Editorial Section Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-[#B8860B] dark:text-[#E5B824]">
            <HelpCircle className="w-3.5 h-3.5 shrink-0" />
            <span>Centre d’Information & Guide Pratique</span>
          </div>
          <h2
            id="faq-amicale-heading"
            className="text-xl sm:text-2xl font-bold font-heading text-black dark:text-white"
          >
            Foire aux Questions de l’Amicale
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-zinc-400 leading-relaxed">
            Retrouvez rapidement les réponses essentielles concernant votre adhésion, les projets soutenus au lycée et les services du réseau ALGB.
          </p>
        </div>

        {/* Thematic Filter Tabs */}
        <div
          role="tablist"
          aria-label="Filtrer les questions par thématique"
          className="flex flex-wrap items-center gap-1 p-1 bg-gray-100 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl w-fit"
        >
          {TOPIC_OPTIONS.map((topic) => {
            const isActive = selectedTopic === topic.id;
            return (
              <button
                key={topic.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => handleTopicChange(topic.id)}
                className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1.5 focus-visible:outline-2 focus-visible:outline-[#B8860B] ${
                  isActive
                    ? 'bg-[#E5B824] text-black shadow-xs'
                    : 'text-gray-700 dark:text-zinc-300 hover:text-black dark:hover:text-white'
                }`}
              >
                <span>{topic.label}</span>
                <span
                  className={`font-mono text-[11px] tabular-nums ${
                    isActive ? 'text-black/80' : 'text-gray-500 dark:text-zinc-400'
                  }`}
                >
                  ({topicCounts[topic.id]})
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Search & Bulk Expand Controls */}
      <div className="bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 dark:text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher une question, un mot-clé (ex: cotisation, QR code, mentorat, BDR)..."
            aria-label="Rechercher dans la foire aux questions"
            className="w-full bg-white dark:bg-zinc-950 border border-gray-300 dark:border-zinc-700 focus:border-[#E5B824] rounded-xl pl-10 pr-9 py-2.5 text-xs text-black dark:text-white placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              aria-label="Effacer la recherche"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black dark:hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
          <span className="text-xs text-gray-600 dark:text-zinc-400 tabular-nums">
            <strong className="font-mono text-black dark:text-white">{filteredFaq.length}</strong> question
            {filteredFaq.length > 1 ? 's' : ''}
          </span>

          {filteredFaq.length > 0 && (
            <button
              type="button"
              onClick={handleToggleAll}
              className="px-3.5 py-2 rounded-xl border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 hover:border-black dark:hover:border-zinc-500 text-xs font-semibold text-black dark:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1.5"
            >
              {allVisibleExpanded ? (
                <>
                  <ChevronUp className="w-3.5 h-3.5" />
                  <span>Tout replier</span>
                </>
              ) : (
                <>
                  <ChevronDown className="w-3.5 h-3.5" />
                  <span>Tout déplier</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* FAQ Accordion List */}
      {filteredFaq.length === 0 ? (
        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-8 text-center space-y-3">
          <p className="text-sm font-semibold text-black dark:text-white font-heading">
            Aucune question ne correspond à votre recherche.
          </p>
          <p className="text-xs text-gray-600 dark:text-zinc-400 max-w-md mx-auto">
            Essayez un autre mot-clé ou réinitialisez le filtre thématique pour consulter l’ensemble de la base d’informations de l’Amicale.
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedTopic('TOUTES');
              setSearchTerm('');
            }}
            className="px-4 py-2 rounded-lg bg-[#E5B824] hover:bg-[#dcae1f] text-black text-xs font-bold transition-colors cursor-pointer"
          >
            Afficher toutes les questions
          </button>
        </div>
      ) : (
        <div className="divide-y divide-gray-200 dark:divide-zinc-800 border border-gray-200 dark:border-zinc-800 rounded-2xl bg-white dark:bg-zinc-900 overflow-hidden">
          {filteredFaq.map((item) => {
            const isOpen = openIds.includes(item.id);
            const panelId = `${item.id}-panel`;
            const buttonId = `${item.id}-button`;

            return (
              <article key={item.id} className={isOpen ? 'bg-gray-50/60 dark:bg-zinc-800/40' : 'bg-white dark:bg-zinc-900'}>
                <button
                  id={buttonId}
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => toggleItem(item.id)}
                  className="w-full text-left px-5 sm:px-6 py-4 sm:py-5 flex items-start justify-between gap-4 hover:bg-gray-50 dark:hover:bg-zinc-800/60 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-[#B8860B]"
                >
                  <div className="space-y-1.5 min-w-0">
                    {/* Clean unboxed typographic metadata (zero-pill discipline) */}
                    <div className="flex flex-wrap items-center gap-2 text-[11px] text-gray-500 dark:text-zinc-400">
                      <span className="font-mono font-bold text-[#B8860B] dark:text-[#E5B824] tabular-nums">
                        {item.number}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="font-semibold uppercase tracking-wider text-gray-800 dark:text-zinc-200">
                        {item.topicLabel}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{item.reference}</span>
                    </div>

                    <h3 className="text-sm sm:text-base font-bold font-heading text-black dark:text-white leading-snug">
                      {item.question}
                    </h3>
                  </div>

                  <span
                    className={`mt-1 w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 transition-colors ${
                      isOpen
                        ? 'bg-[#E5B824] border-[#E5B824] text-black'
                        : 'bg-white dark:bg-zinc-950 border-gray-200 dark:border-zinc-700 text-gray-600 dark:text-zinc-400'
                    }`}
                  >
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-150 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </span>
                </button>

                {isOpen && (
                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={buttonId}
                    className="px-5 sm:px-6 pb-5 sm:pb-6 pt-1 space-y-4 max-w-4xl"
                  >
                    <p className="text-xs sm:text-sm text-gray-700 dark:text-zinc-300 leading-relaxed">
                      {item.answer}
                    </p>

                    {item.details && item.details.length > 0 && (
                      <ul className="space-y-1.5 text-xs text-gray-600 dark:text-zinc-400 pl-4 list-disc marker:text-[#B8860B] dark:marker:text-[#E5B824]">
                        {item.details.map((detail, idx) => (
                          <li key={idx} className="leading-relaxed">
                            {detail}
                          </li>
                        ))}
                      </ul>
                    )}

                    {item.action && (
                      <div className="pt-1">
                        <button
                          type="button"
                          onClick={() => handleActionTrigger(item.action!.onTrigger)}
                          className="inline-flex items-center gap-2 text-xs font-bold text-black dark:text-white hover:text-[#B8860B] dark:hover:text-[#E5B824] underline underline-offset-4 decoration-[#E5B824] decoration-2 cursor-pointer transition-colors"
                        >
                          <span>{item.action.label}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
};
