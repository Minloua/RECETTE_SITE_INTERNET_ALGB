import React, { useState } from 'react';
import { HISTORIC_TIMELINE } from '../data/mockData';
import {
  MapPin,
  Calendar,
  Award,
  BookOpen,
  Sparkles,
} from 'lucide-react';

export const HistoireView: React.FC = () => {
  const [selectedEraIndex, setSelectedEraIndex] = useState(0);

  const activeEra = HISTORIC_TIMELINE[selectedEraIndex];

  return (
    <div className="bg-[#F8F8F6] dark:bg-[#141413] min-h-screen text-[#141413] dark:text-[#F8F8F6] transition-colors">
      {/* Carbon Black Archival Hero */}
      <section className="bg-[#141413] text-white border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
            <div className="space-y-2">
              <span className="text-xs uppercase tracking-[0.16em] font-semibold text-[#F2B705]">
                Patrimoine & Mémoire
              </span>
              <h1 className="text-2xl sm:text-4xl font-bold font-heading text-white">
                Histoire du Lycée de Garçons de Bingerville
              </h1>
              <p className="text-sm text-zinc-300 font-editorial italic max-w-2xl">
                « Plus d’un siècle au cœur de la formation républicaine, intellectuelle et civique de la nation ivoirienne. »
              </p>
            </div>

            <div className="text-left md:text-right text-xs text-zinc-400 shrink-0">
              <span className="font-heading font-bold text-2xl sm:text-3xl text-[#F2B705] block tabular-nums">
                1903 — Aujourd’hui
              </span>
              <span>Archives et témoignages de l’Amicale</span>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
        {/* Featured Archival Hero Block */}
        <div className="bg-white dark:bg-[#1e1e1c] border border-[#141413]/10 dark:border-white/10 rounded-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-0 shadow-editorial">
          <div className="lg:col-span-7 relative h-72 lg:h-auto min-h-[360px]">
            <img
              src="/assets/images/bingerville_historic_heritage_1794382830908.jpg"
              alt="Allée historique des palmiers royaux du Lycée de Bingerville"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-[#141413]/70 via-[#141413]/15 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 bg-white/95 dark:bg-[#141413]/90 backdrop-blur-md p-3.5 rounded-lg border border-[#141413]/15 dark:border-white/15 text-xs text-[#141413] dark:text-[#F8F8F6] italic font-editorial">
              Archives historiques : L’allée majestueuse des palmiers royaux menant au pavillon central du lycée (circa 1950).
            </div>
          </div>

          <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-6 bg-white dark:bg-[#1e1e1c]">
            <div className="space-y-4">
              <span className="text-xs font-semibold text-[#141413] dark:text-[#F2B705] uppercase tracking-[0.14em] block">
                Origines & Contexte
              </span>
              <h2 className="text-2xl font-heading font-bold text-[#141413] dark:text-white leading-snug">
                Bingerville, Sanctuaire de l’Esprit et de la Rigueur
              </h2>
              <p className="text-xs sm:text-sm text-[#4A4A48] dark:text-zinc-300 leading-relaxed">
                Lorsque l’ancienne capitale coloniale de Grand-Bassam fut frappée par l’épidémie de fièvre jaune en 1899, le gouverneur Louis-Gustave Binger déplaça le siège de la colonie sur les plateaux aérés et salubres de Bingerville.
              </p>
              <p className="text-xs sm:text-sm text-[#4A4A48] dark:text-zinc-400 leading-relaxed">
                C’est dans ce cadre arboré exceptionnel, surplombant la lagune Ébrié, que fut érigée l’école primaire supérieure qui deviendra le prestigieux Lycée de Garçons. Dès ses premières années, l’établissement s’est imposé comme l’école de l’excellence où se forgèrent les amitiés indéfectibles qui ont traversé les décennies.
              </p>
            </div>

            <div className="p-4 bg-[#FEF8E6] dark:bg-[#2a2719] border border-[#F2B705]/40 rounded-xl text-xs text-[#141413] dark:text-[#FEF8E6] space-y-1">
              <strong className="text-[#141413] dark:text-[#F2B705] block font-semibold">
                La devise informelle des internes :
              </strong>
              <span className="italic font-editorial">
                « Bien faire et se tenir droit, pour que brille le flambeau de Bingerville. »
              </span>
            </div>
          </div>
        </div>

        {/* Interactive Timeline Rail */}
        <section className="space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-xs uppercase tracking-[0.16em] font-semibold text-[#4A4A48] dark:text-[#F2B705]">
              Chronologie Interactive
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-heading text-[#141413] dark:text-white">
              Les Grandes Époques du Lycée
            </h2>
            <p className="text-xs sm:text-sm text-[#4A4A48] dark:text-zinc-400">
              Cliquez sur une date charnière pour afficher les détails historiques et les documents d’archives.
            </p>
          </div>

          {/* Horizontal Era Navigation Buttons */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none justify-start md:justify-center">
            {HISTORIC_TIMELINE.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedEraIndex(idx)}
                className={`px-4 py-2.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer border flex items-center gap-2 ${
                  selectedEraIndex === idx
                    ? 'bg-[#F2B705] text-[#141413] border-[#F2B705]'
                    : 'bg-white dark:bg-[#1e1e1c] text-[#4A4A48] dark:text-zinc-300 border-[#141413]/15 dark:border-white/15 hover:text-[#141413] dark:hover:text-white'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>{item.year}</span>
              </button>
            ))}
          </div>

          {/* Selected Era Detailed Card */}
          <div className="bg-white dark:bg-[#1e1e1c] border border-[#141413]/10 dark:border-white/10 rounded-xl p-6 sm:p-10 space-y-6 shadow-editorial">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#141413]/10 dark:border-white/10">
              <div>
                <span className="text-xs font-semibold text-[#4A4A48] dark:text-[#F2B705] uppercase tracking-wider font-mono">
                  Période {activeEra.year}
                </span>
                <h3 className="text-xl sm:text-2xl font-heading font-bold text-[#141413] dark:text-white mt-1">
                  {activeEra.title}
                </h3>
              </div>

              <div className="flex items-center gap-2 text-xs text-[#141413] dark:text-zinc-200 px-3.5 py-2 bg-[#F8F8F6] dark:bg-[#141413] rounded-lg border border-[#141413]/10 dark:border-white/10 font-medium">
                <MapPin className="w-4 h-4 text-[#141413] dark:text-[#F2B705]" />
                <span>{activeEra.location}</span>
              </div>
            </div>

            <p className="text-sm sm:text-base text-[#4A4A48] dark:text-zinc-200 font-editorial leading-relaxed max-w-4xl">
              {activeEra.description}
            </p>

            <div className="pt-6 border-t border-[#141413]/10 dark:border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs text-[#4A4A48] dark:text-zinc-400">
              <span>Fonds documentaire : Commission Archives et Histoire de l’Amicale ALGB</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={selectedEraIndex === 0}
                  onClick={() => setSelectedEraIndex((prev) => prev - 1)}
                  className="px-4 py-2 rounded-lg bg-[#F8F8F6] dark:bg-[#141413] border border-[#141413]/15 dark:border-white/15 hover:border-[#141413] text-[#141413] dark:text-zinc-200 font-semibold disabled:opacity-35 cursor-pointer transition-colors"
                >
                  ← Période précédente
                </button>
                <button
                  type="button"
                  disabled={selectedEraIndex === HISTORIC_TIMELINE.length - 1}
                  onClick={() => setSelectedEraIndex((prev) => prev + 1)}
                  className="px-4 py-2 rounded-lg bg-[#F2B705] hover:bg-[#dfa704] text-[#141413] font-semibold disabled:opacity-35 cursor-pointer transition-colors"
                >
                  Période suivante →
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Traditions and Heritage of LGB */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-[#1e1e1c] border border-[#141413]/10 dark:border-white/10 rounded-xl p-6 space-y-3 shadow-editorial">
            <BookOpen className="w-7 h-7 text-[#141413] dark:text-[#F2B705]" />
            <h4 className="text-base font-bold text-[#141413] dark:text-white font-heading">
              L’Internat & la Fraternité
            </h4>
            <p className="text-xs text-[#4A4A48] dark:text-zinc-400 leading-relaxed">
              L’internat du LGB a accueilli les jeunes garçons venant de toutes les contrées de la Côte d’Ivoire. Cette mixité géographique et sociale a forgé le sentiment d’une appartenance commune qui dure toute la vie.
            </p>
          </div>

          <div className="bg-white dark:bg-[#1e1e1c] border border-[#141413]/10 dark:border-white/10 rounded-xl p-6 space-y-3 shadow-editorial">
            <Award className="w-7 h-7 text-[#141413] dark:text-[#F2B705]" />
            <h4 className="text-base font-bold text-[#141413] dark:text-white font-heading">
              Le Culte des Séries C et D
            </h4>
            <p className="text-xs text-[#4A4A48] dark:text-zinc-400 leading-relaxed">
              Réputé pour son exigence scientifique et ses professeurs de renom, le lycée a fourni les majors nationaux au baccalauréat et formé des générations d’ingénieurs des grandes écoles (INP-HB, Polytechnique, etc.).
            </p>
          </div>

          <div className="bg-white dark:bg-[#1e1e1c] border border-[#141413]/10 dark:border-white/10 rounded-xl p-6 space-y-3 shadow-editorial">
            <Sparkles className="w-7 h-7 text-[#141413] dark:text-[#F2B705]" />
            <h4 className="text-base font-bold text-[#141413] dark:text-white font-heading">
              La Transmission Intergénérationnelle
            </h4>
            <p className="text-xs text-[#4A4A48] dark:text-zinc-400 leading-relaxed">
              Chaque promotion parraine la suivante. Le traditionnel tournoi de la « Coupe du Proviseur » et la journée d’orientation perpétuent ce relais indispensable entre aînés et cadets.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};
