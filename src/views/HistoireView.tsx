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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16 bg-white dark:bg-zinc-950 text-gray-900 dark:text-zinc-100">
      {/* Editorial Header */}
      <div className="border-b border-gray-200 dark:border-zinc-800 pb-8 flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
        <div className="space-y-2">
          <span className="text-xs uppercase tracking-widest font-bold text-[#B8860B] dark:text-[#E5B824]">
            Patrimoine & Mémoire
          </span>
          <h1 className="text-2xl sm:text-4xl font-bold font-heading text-black dark:text-white">
            Histoire du Lycée de Garçons de Bingerville
          </h1>
          <p className="text-sm text-gray-600 dark:text-zinc-400 font-editorial italic max-w-2xl">
            « Plus d’un siècle au cœur de la formation républicaine, intellectuelle et civique de la nation ivoirienne. »
          </p>
        </div>

        <div className="text-left md:text-right text-xs text-gray-600 dark:text-zinc-400">
          <span className="font-heading font-bold text-xl text-[#B8860B] dark:text-[#E5B824] block">1903 - Aujourd’hui</span>
          <span>Archives et témoignages de l'Amicale</span>
        </div>
      </div>

      {/* Featured Archival Hero Block */}
      <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-0 shadow-sm">
        <div className="lg:col-span-7 relative h-72 lg:h-auto min-h-[360px]">
          <img
            src="/assets/images/bingerville_historic_heritage_1794382830908.jpg"
            alt="Allée historique des palmiers royaux du Lycée de Bingerville"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-black/60 via-transparent to-transparent"></div>
          <div className="absolute bottom-4 left-4 right-4 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md p-3 rounded-lg border border-gray-200 dark:border-zinc-700 text-xs text-gray-900 dark:text-zinc-100 italic font-editorial shadow-xs">
            Archives historiques : L'allée majestueuse des palmiers royaux menant au pavillon central du lycée (circa 1950).
          </div>
        </div>

        <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-6 bg-gray-50/60 dark:bg-zinc-900">
          <div className="space-y-4">
            <span className="text-xs font-bold text-[#B8860B] dark:text-[#E5B824] uppercase tracking-wider block">
              Origines & Contexte
            </span>
            <h2 className="text-xl font-heading font-bold text-black dark:text-white leading-snug">
              Bingerville, Sanctuaire de l'Esprit et de la Rigueur
            </h2>
            <p className="text-xs sm:text-sm text-gray-700 dark:text-zinc-300 leading-relaxed">
              Lorsque l'ancienne capitale coloniale de Grand-Bassam fut frappée par l'épidémie de fièvre jaune en 1899, le gouverneur Louis-Gustave Binger déplaça le siège de la colonie sur les plateaux aérés et salubres de Bingerville.
            </p>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-zinc-400 leading-relaxed">
              C'est dans ce cadre arboré exceptionnel, surplombant la lagune Ébrié, que fut érigée l'école primaire supérieure qui deviendra le prestigieux Lycée de Garçons. Dès ses premières années, l'établissement s'est imposé comme l'école de l'excellence où se forgèrent les amitiés indéfectibles qui ont traversé les décennies.
            </p>
          </div>

          <div className="p-4 bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl text-xs text-gray-800 dark:text-zinc-200 space-y-1 shadow-xs">
            <strong className="text-[#B8860B] dark:text-[#E5B824] block font-bold">La devise informelle des internes :</strong>
            <span className="italic font-editorial">« Bien faire et se tenir droit, pour que brille le flambeau de Bingerville. »</span>
          </div>
        </div>
      </div>

      {/* Interactive Timeline Rail */}
      <section className="space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs uppercase tracking-widest font-bold text-[#B8860B] dark:text-[#E5B824]">
            Chronologie Interactive
          </span>
          <h2 className="text-2xl font-bold font-heading text-black dark:text-white">
            Les Grandes Époques du Lycée
          </h2>
          <p className="text-xs text-gray-600 dark:text-zinc-400">
            Cliquez sur une date charnière pour afficher les détails historiques et les documents d'archives.
          </p>
        </div>

        {/* Horizontal Era Navigation Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none justify-start md:justify-center">
          {HISTORIC_TIMELINE.map((item, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedEraIndex(idx)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer border flex items-center gap-2 ${
                selectedEraIndex === idx
                  ? 'bg-[#E5B824] text-black border-[#E5B824] shadow-sm scale-105'
                  : 'bg-white dark:bg-zinc-900 text-gray-700 dark:text-zinc-300 border-gray-300 dark:border-zinc-700 hover:text-black dark:hover:text-white hover:border-gray-400 dark:hover:border-zinc-500'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>{item.year}</span>
            </button>
          ))}
        </div>

        {/* Selected Era Detailed Card */}
        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-6 sm:p-10 space-y-6 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-gray-200 dark:border-zinc-800">
            <div>
              <span className="text-xs font-bold text-[#B8860B] dark:text-[#E5B824] uppercase tracking-wider font-mono">
                Période {activeEra.year}
              </span>
              <h3 className="text-xl sm:text-2xl font-heading font-bold text-black dark:text-white mt-1">
                {activeEra.title}
              </h3>
            </div>

            <div className="flex items-center gap-2 text-xs text-gray-800 dark:text-zinc-200 px-3.5 py-1.5 bg-gray-100 dark:bg-zinc-800 rounded-lg border border-gray-200 dark:border-zinc-700 font-medium">
              <MapPin className="w-4 h-4 text-[#B8860B] dark:text-[#E5B824]" />
              <span>{activeEra.location}</span>
            </div>
          </div>

          <p className="text-sm sm:text-base text-gray-800 dark:text-zinc-200 font-editorial leading-relaxed max-w-4xl">
            {activeEra.description}
          </p>

          <div className="pt-6 border-t border-gray-100 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-4 text-xs text-gray-500 dark:text-zinc-400">
            <span>Fonds documentaire : Commission Archives et Histoire de l'Amicale ALGB</span>
            <div className="flex items-center gap-2">
              <button
                disabled={selectedEraIndex === 0}
                onClick={() => setSelectedEraIndex((prev) => prev - 1)}
                className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-800 dark:text-zinc-200 font-semibold disabled:opacity-30 cursor-pointer transition-colors"
              >
                ← Période précédente
              </button>
              <button
                disabled={selectedEraIndex === HISTORIC_TIMELINE.length - 1}
                onClick={() => setSelectedEraIndex((prev) => prev + 1)}
                className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-800 dark:text-zinc-200 font-semibold disabled:opacity-30 cursor-pointer transition-colors"
              >
                Période suivante →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Traditions and Heritage of LGB */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-6 space-y-3 hover:shadow-md transition-all">
          <BookOpen className="w-7 h-7 text-[#B8860B] dark:text-[#E5B824]" />
          <h4 className="text-sm font-bold text-black dark:text-white font-heading">
            L'Internat & la Fraternité
          </h4>
          <p className="text-xs text-gray-600 dark:text-zinc-400 leading-relaxed">
            L'internat du LGB a accueilli les jeunes garçons venant de toutes les contrées de la Côte d'Ivoire. Cette mixité géographique et sociale a forgé le sentiment d'une appartenance commune qui dure toute la vie.
          </p>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-6 space-y-3 hover:shadow-md transition-all">
          <Award className="w-7 h-7 text-[#B8860B] dark:text-[#E5B824]" />
          <h4 className="text-sm font-bold text-black dark:text-white font-heading">
            Le Culte des Séries C et D
          </h4>
          <p className="text-xs text-gray-600 dark:text-zinc-400 leading-relaxed">
            Réputé pour son exigence scientifique et ses professeurs de renom, le lycée a fourni les majors nationaux au baccalauréat et formé des générations d'ingénieurs des grandes écoles (INP-HB, Polytechnique, etc.).
          </p>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-6 space-y-3 hover:shadow-md transition-all">
          <Sparkles className="w-7 h-7 text-[#B8860B] dark:text-[#E5B824]" />
          <h4 className="text-sm font-bold text-black dark:text-white font-heading">
            La Transmission Intergénérationnelle
          </h4>
          <p className="text-xs text-gray-600 dark:text-zinc-400 leading-relaxed">
            Chaque promotion parraine la suivante. Le traditionnel tournoi de la « Coupe du Proviseur » et la journée d'orientation perpétuent ce relais indispensable entre aînés et cadets.
          </p>
        </div>
      </section>
    </div>
  );
};
