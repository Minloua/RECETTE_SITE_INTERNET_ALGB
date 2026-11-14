import React, { useEffect, useState } from 'react';
import { NavigationTab } from '../context/AppContext';
import {
  ArrowRight,
  Award,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Pause,
  Play,
  Quote,
} from 'lucide-react';

export interface AlumniTestimonial {
  id: string;
  name: string;
  initials: string;
  nickname: string;
  promotionYear: number;
  promotionName: string;
  role: string;
  company: string;
  location: string;
  highlight: string;
  quote: string;
  careerNote: string;
}

const ALUMNI_TESTIMONIALS: AlumniTestimonial[] = [
  {
    id: 'test-yapi',
    name: 'Dr. Sébastien Yapi',
    initials: 'SY',
    nickname: 'Major Yapi',
    promotionYear: 1995,
    promotionName: 'Promotion Excellence',
    role: 'Médecin Chirurgien & Chef de Service Adjoint',
    company: 'CHU de Treichville',
    location: 'Abidjan, Côte d’Ivoire',
    highlight: 'Santé & Missions Humanitaires',
    quote:
      'Le Lycée de Garçons de Bingerville m’a appris la rigueur scientifique, le respect de la parole donnée et l’amour inconditionnel de notre patrie. L’Amicale est notre devoir de transmission envers nos cadets.',
    careerNote:
      'Coordonne les caravanes médicales bénévoles de l’ALGB et pilote le projet de modernisation de l’infirmerie du lycée.',
  },
  {
    id: 'test-toure',
    name: 'Amadou Touré',
    initials: 'AT',
    nickname: 'Le Sphinx',
    promotionYear: 2002,
    promotionName: 'Promotion Millénaire',
    role: 'Chief Technology Officer (CTO)',
    company: 'Fintech West Africa Group',
    location: 'Abidjan, Côte d’Ivoire',
    highlight: 'Innovation & Mentorat Tech',
    quote:
      'À l’internat de Bingerville, nous avons appris que le mérite ne dépend pas d’où l’on vient, mais de la discipline que l’on s’impose. Aujourd’hui, j’ouvre les portes de la fintech à nos jeunes frères ingénieurs.',
    careerNote:
      'Lauréat d’innovation numérique en zone UEMOA et mentor actif pour les jeunes diplômés de l’INP-HB et de l’ESATIC.',
  },
  {
    id: 'test-bamba',
    name: 'Jean-Luc Bamba',
    initials: 'JB',
    nickname: 'Koro Bamba',
    promotionYear: 1988,
    promotionName: 'Promotion Émergence',
    role: 'Ingénieur des Ponts et Chaussées — Directeur des Grands Travaux',
    company: 'Cabinet d’Ingénierie & BTP Côte d’Ivoire',
    location: 'Yamoussoukro, Côte d’Ivoire',
    highlight: 'Infrastructures & Patrimoine',
    quote:
      'Chaque pont et chaque route que nous bâtissons porte l’empreinte de l’exigence reçue sous les arcades du LGB. Réhabiliter notre lycée, c’est préserver le socle d’excellence de toute la nation.',
    careerNote:
      'Plus de 30 ans à la direction de grands chantiers ouest-africains et parrain technique de la rénovation du campus.',
  },
  {
    id: 'test-diomande',
    name: 'Maître Moussa Diomandé',
    initials: 'MD',
    nickname: 'Le Doyen Juriste',
    promotionYear: 1982,
    promotionName: 'Promotion Fraternité',
    role: 'Avocat au Barreau & Associé Gérant',
    company: 'Cabinet Diomandé & Associés',
    location: 'Abidjan-Plateau, Côte d’Ivoire',
    highlight: 'Droit & Gouvernance',
    quote:
      'La fraternité forgée au Lycée de Garçons traverse les décennies sans jamais faiblir. Nos statuts et notre engagement collectif garantissent que chaque promotion soutient la suivante avec intégrité.',
    careerNote:
      'Conseiller juridique de l’Amicale depuis plus de quinze ans et garant de la transparence institutionnelle.',
  },
  {
    id: 'test-drogba',
    name: 'Patrick Drogba',
    initials: 'PD',
    nickname: 'Le Doyen Parisien',
    promotionYear: 1999,
    promotionName: 'Promotion Pionniers Tech',
    role: 'Principal Cloud Solution Architect',
    company: 'Cabinet Conseil International Paris',
    location: 'Paris, France',
    highlight: 'Diaspora & Rayonnement Mondial',
    quote:
      'Même à des milliers de kilomètres de la lagune Ébrié, l’uniforme du LGB reste notre boussole commune. La section Diaspora accompagne chaque année nos bacheliers vers les grandes écoles européennes.',
    careerNote:
      'Président de la section ALGB Diaspora France & Europe et animateur des sessions d’orientation internationale.',
  },
  {
    id: 'test-kassi',
    name: 'Stéphane Kassi',
    initials: 'SK',
    nickname: 'Data Boy',
    promotionYear: 2018,
    promotionName: 'Promotion Renaissance',
    role: 'Senior Data Scientist',
    company: 'Banque Atlantique / Groupe BCP',
    location: 'Abidjan, Côte d’Ivoire',
    highlight: 'Nouvelle Génération & IA',
    quote:
      'Les bourses et le parrainage des doyens de l’Amicale m’ont permis de me consacrer pleinement à mes études d’ingénieur. Revenir animer des ateliers d’IA pour les élèves de Terminale est ma plus grande fierté.',
    careerNote:
      'Lauréat du Prix d’Excellence LGB 2018 et coordinateur des ateliers d’initiation au code sur le campus.',
  },
];

interface TestimonialsCarouselProps {
  onNavigate: (tab: NavigationTab) => void;
}

export const TestimonialsCarousel: React.FC<TestimonialsCarouselProps> = ({
  onNavigate,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  const total = ALUMNI_TESTIMONIALS.length;
  const active = ALUMNI_TESTIMONIALS[activeIndex];

  useEffect(() => {
    if (!isAutoPlay || isHovered) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % total);
    }, 6500);
    return () => clearInterval(timer);
  }, [isAutoPlay, isHovered, total]);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + total) % total);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % total);
  };

  return (
    <section
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      aria-label="Témoignages et parcours inspirants d'anciens élèves"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="space-y-8">
        {/* Section Header + Carousel Controls */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 pb-5 border-b border-[#141413]/10 dark:border-white/10">
          <div>
            <span className="text-xs uppercase tracking-widest font-bold text-[#141413] dark:text-[#F2B705]">
              Voix & Parcours d’Excellence
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-heading text-[#141413] dark:text-white mt-1">
              Témoignages & Parcours Inspirants
            </h2>
            <p className="text-xs sm:text-sm text-[#4A4A48] dark:text-zinc-400 mt-1 max-w-2xl">
              De la Promotion 1982 aux jeunes talents de la Promotion 2018, découvrez comment l’héritage de Bingerville façonne des parcours d’exception.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setIsAutoPlay((prev) => !prev)}
              aria-label={isAutoPlay ? 'Mettre le carrousel en pause' : 'Reprendre la lecture automatique'}
              className="p-2.5 rounded-lg bg-white dark:bg-[#1e1e1c] hover:bg-[#F8F8F6] dark:hover:bg-white/10 text-[#141413] dark:text-white border border-[#141413]/15 dark:border-white/15 transition-colors cursor-pointer"
              title={isAutoPlay ? 'Pause' : 'Lecture automatique'}
            >
              {isAutoPlay ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4" />
              )}
            </button>
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Témoignage précédent"
              className="p-2.5 rounded-lg bg-white dark:bg-[#1e1e1c] hover:bg-[#F8F8F6] dark:hover:bg-white/10 text-[#141413] dark:text-white border border-[#141413]/15 dark:border-white/15 shadow-xs transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2.5 text-xs font-mono font-bold text-[#141413] dark:text-zinc-300 tabular-nums">
              {String(activeIndex + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
            </span>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Témoignage suivant"
              className="p-2.5 rounded-lg bg-[#F2B705] hover:bg-[#dfa704] text-[#141413] shadow-xs transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main Spotlight Testimonial Card */}
        <div className="bg-white dark:bg-[#1e1e1c] border border-[#141413]/10 dark:border-white/10 rounded-xl overflow-hidden shadow-editorial grid grid-cols-1 lg:grid-cols-12">
          {/* Left Carbon Black Identity Panel */}
          <div className="lg:col-span-4 bg-[#141413] text-white p-6 sm:p-8 flex flex-col justify-between space-y-6 relative overflow-hidden">
            <div className="space-y-4 relative z-10">
              <div className="flex items-center justify-between gap-2">
                <span className="px-2.5 py-1 rounded-md bg-[#F2B705] text-[#141413] text-[10px] font-bold uppercase tracking-wider">
                  Promo {active.promotionYear}
                </span>
                <span className="text-[11px] font-mono text-zinc-400">
                  {active.promotionName}
                </span>
              </div>

              <div className="flex items-center gap-4 pt-2">
                <div className="w-16 h-16 rounded-xl bg-[#F2B705] text-[#141413] border-2 border-[#F2B705] font-heading font-bold text-xl flex items-center justify-center shrink-0 shadow-sm">
                  {active.initials}
                </div>
                <div className="min-w-0">
                  <h3 className="text-lg font-heading font-bold text-white leading-tight">
                    {active.name}
                  </h3>
                  <p className="text-xs text-[#F2B705] font-editorial italic mt-0.5">
                    « {active.nickname} »
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-white/10 relative z-10">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-zinc-400 block font-semibold">
                  Fonction & Institution
                </span>
                <p className="text-xs font-bold text-white mt-0.5 leading-snug">
                  {active.role}
                </p>
                <p className="text-xs text-zinc-300 mt-0.5">{active.company}</p>
              </div>

              <div className="flex items-center gap-1.5 text-[11px] text-zinc-300 pt-1">
                <MapPin className="w-3.5 h-3.5 text-[#F2B705] shrink-0" />
                <span>{active.location}</span>
              </div>
            </div>
          </div>

          {/* Right Editorial Quote Panel */}
          <div className="lg:col-span-8 p-6 sm:p-10 flex flex-col justify-between space-y-6 bg-white dark:bg-[#1e1e1c]">
            <div className="space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#FEF8E6] dark:bg-[#2a2719] border border-[#F2B705]/40 text-[#141413] dark:text-[#FEF8E6] text-[11px] font-bold uppercase tracking-wider">
                  <Award className="w-3.5 h-3.5 text-[#141413] dark:text-[#F2B705]" />
                  <span>{active.highlight}</span>
                </span>
                <Quote className="w-8 h-8 text-[#F2B705]/50 shrink-0" />
              </div>

              <blockquote className="text-base sm:text-xl font-editorial italic text-[#141413] dark:text-white leading-relaxed">
                « {active.quote} »
              </blockquote>

              <div className="p-4 rounded-xl bg-[#F8F8F6] dark:bg-[#141413] border border-[#141413]/10 dark:border-white/10 space-y-1">
                <span className="text-[10px] uppercase tracking-wider font-bold text-[#141413] dark:text-[#F2B705] block">
                  Parcours & Contribution au Réseau ALGB
                </span>
                <p className="text-xs text-[#4A4A48] dark:text-zinc-300 leading-relaxed">
                  {active.careerNote}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-[#141413]/10 dark:border-white/10 flex flex-wrap items-center justify-between gap-3">
              {/* Slide Indicators */}
              <div className="flex items-center gap-1.5" role="tablist" aria-label="Sélectionner un témoignage">
                {ALUMNI_TESTIMONIALS.map((item, idx) => (
                  <button
                    key={item.id}
                    type="button"
                    role="tab"
                    aria-selected={idx === activeIndex}
                    aria-label={`Témoignage de ${item.name}`}
                    onClick={() => setActiveIndex(idx)}
                    className={`h-2 rounded-sm transition-all cursor-pointer ${
                      idx === activeIndex
                        ? 'w-8 bg-[#F2B705]'
                        : 'w-2.5 bg-[#141413]/15 dark:bg-white/20 hover:bg-[#141413]/30 dark:hover:bg-white/40'
                    }`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => onNavigate('reseau')}
                  className="text-xs font-bold text-[#141413] dark:text-white hover:text-[#F2B705] flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <span>Explorer le Réseau Pro</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Alumni Thumbnails Selector Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {ALUMNI_TESTIMONIALS.map((item, idx) => {
            const isSelected = idx === activeIndex;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveIndex(idx)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2.5 ${
                  isSelected
                    ? 'bg-[#FEF8E6] dark:bg-[#2a2719] border-2 border-[#F2B705] shadow-editorial'
                    : 'bg-white dark:bg-[#1e1e1c] border-[#141413]/10 dark:border-white/10 hover:border-[#F2B705]/60'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center text-xs font-heading font-bold shrink-0 ${
                    isSelected
                      ? 'bg-[#141413] text-[#F2B705]'
                      : 'bg-[#F8F8F6] dark:bg-[#141413] text-[#141413] dark:text-white border border-[#141413]/10 dark:border-white/15'
                  }`}
                >
                  {item.initials}
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] font-mono font-bold text-[#141413] dark:text-[#F2B705]">
                    Promo {item.promotionYear}
                  </div>
                  <div className="text-xs font-bold text-[#141413] dark:text-white truncate">
                    {item.name}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
