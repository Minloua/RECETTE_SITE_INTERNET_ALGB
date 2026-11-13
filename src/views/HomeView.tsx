import React from 'react';
import { useApp } from '../context/AppContext';
import { TestimonialsCarousel } from '../components/TestimonialsCarousel';
import {
  Users,
  Briefcase,
  HeartHandshake,
  BookOpen,
  ArrowRight,
  GraduationCap,
  Clock,
  MapPin,
  Video,
  Play,
  ExternalLink,
  Camera,
} from 'lucide-react';

export const HomeView: React.FC = () => {
  const { setActiveTab, projects, news, events, promotions, setContributionModalProject } = useApp();

  const featuredProjects = projects.filter((p) => p.status === 'EN_COURS').slice(0, 2);
  const latestNews = news.slice(0, 3);
  const upcomingEvents = events.slice(0, 3);

  return (
    <div className="space-y-16 pb-20 bg-white dark:bg-zinc-950 text-gray-900 dark:text-zinc-100 transition-colors">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-gray-50 via-white to-gray-50/50 dark:from-zinc-900 dark:via-zinc-950 dark:to-zinc-950 border-b border-gray-200 dark:border-zinc-800">
        {/* Backdrop Campus Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/assets/images/bingerville_lycee_campus_1794382827777.jpg"
            alt="Campus historique du Lycée de Garçons de Bingerville"
            className="w-full h-full object-cover opacity-15 dark:opacity-10 filter saturate-75"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-white/85 to-gray-50/70 dark:from-zinc-950 dark:via-zinc-950/88 dark:to-zinc-900/75"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-20 sm:pt-20 sm:pb-28">
          <div className="max-w-3xl space-y-6">
            {/* Institution Badge */}
            <div className="inline-flex items-center gap-3.5 p-1.5 pr-4 rounded-xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 shadow-sm">
              <img
                src="/assets/aistudio/IMG-20180925-WA0019_301d84a7.jpg"
                alt="Logo Officiel ALGB"
                className="w-10 h-10 object-contain rounded-lg bg-white p-0.5 border border-[#E5B824]/50 shadow-xs"
              />
              <span className="text-xs font-bold uppercase tracking-wider text-[#B8860B] dark:text-[#E5B824]">
                Amicale des Anciens Élèves du Lycée de Garçons de Bingerville
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-heading text-black dark:text-white tracking-tight leading-tight">
              « Une histoire, des générations, un même engagement. »
            </h1>

            {/* Sub-headline / Message Central */}
            <p className="text-base sm:text-xl text-[#B8860B] dark:text-[#E5B824] font-editorial italic max-w-2xl leading-relaxed">
              « Notre histoire nous rassemble. Notre engagement construit l'avenir. »
            </p>

            <p className="text-sm text-gray-700 dark:text-zinc-300 leading-relaxed max-w-2xl">
              Bienvenue sur la plateforme officielle de ralliement, de solidarité et d’excellence
              des générations formées au Lycée de Garçons de Bingerville. Retrouvez vos camarades de
              promotion, valorisez votre parcours professionnel et participez activement au rayonnement de notre alma mater.
            </p>

            {/* 4 Primary Action CTAs */}
            <div className="pt-4 flex flex-wrap items-center gap-3">
              <button
                onClick={() => setActiveTab('anciens')}
                className="px-5 py-3 rounded-xl font-bold text-xs text-black bg-[#E5B824] hover:bg-[#dcae1f] transition-all shadow-sm flex items-center gap-2 cursor-pointer"
              >
                <Users className="w-4 h-4" />
                <span>Retrouver sa promotion</span>
              </button>

              <button
                onClick={() => setActiveTab('adhesion')}
                className="px-5 py-3 rounded-xl font-bold text-xs text-white bg-black dark:bg-zinc-900 dark:border dark:border-[#E5B824] hover:bg-gray-800 dark:hover:bg-zinc-800 transition-all flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <GraduationCap className="w-4 h-4 text-[#E5B824]" />
                <span>Adhérer à l’Amicale</span>
              </button>

              <button
                onClick={() => setActiveTab('reseau')}
                className="px-4 py-3 rounded-xl font-semibold text-xs text-gray-800 dark:text-zinc-100 bg-white dark:bg-zinc-900 hover:bg-gray-100 dark:hover:bg-zinc-800 border border-gray-300 dark:border-zinc-700 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Briefcase className="w-4 h-4 text-gray-500 dark:text-[#E5B824]" />
                <span>Réseau Professionnel</span>
              </button>

              <button
                onClick={() => setActiveTab('projets')}
                className="px-4 py-3 rounded-xl font-semibold text-xs text-gray-800 dark:text-zinc-100 bg-white dark:bg-zinc-900 hover:bg-gray-100 dark:hover:bg-zinc-800 border border-gray-300 dark:border-zinc-700 transition-all flex items-center gap-2 cursor-pointer"
              >
                <HeartHandshake className="w-4 h-4 text-gray-500 dark:text-[#E5B824]" />
                <span>Soutenir un projet</span>
              </button>
            </div>
          </div>
        </div>

        {/* Quantitative Rigor Strip */}
        <div className="relative border-t border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900/90">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-left">
              <div>
                <div className="text-2xl sm:text-3xl font-heading font-bold text-[#B8860B] dark:text-[#E5B824] tabular-nums">
                  1903
                </div>
                <div className="text-xs text-gray-600 dark:text-zinc-400 uppercase tracking-wider font-medium mt-0.5">
                  Origine & Fondation séculaire
                </div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-heading font-bold text-black dark:text-white tabular-nums">
                  8 500+
                </div>
                <div className="text-xs text-gray-600 dark:text-zinc-400 uppercase tracking-wider font-medium mt-0.5">
                  Anciens élèves en Côte d'Ivoire & diaspora
                </div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-heading font-bold text-black dark:text-white tabular-nums">
                  70+
                </div>
                <div className="text-xs text-gray-600 dark:text-zinc-400 uppercase tracking-wider font-medium mt-0.5">
                  Promotions répertoriées
                </div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-heading font-bold text-emerald-700 dark:text-emerald-400 tabular-nums">
                  44 450 000 F
                </div>
                <div className="text-xs text-gray-600 dark:text-zinc-400 uppercase tracking-wider font-medium mt-0.5">
                  Mobilisés pour les projets du lycée
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The 3 Pillars Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <span className="text-xs uppercase tracking-widest font-bold text-[#B8860B] dark:text-[#E5B824]">
            Les Fondements de l’Amicale
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-heading text-black dark:text-white">
            Trois Piliers pour Bâtir l’Avenir
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-zinc-400">
            L’ALGB œuvre quotidiennement pour perpétuer les idéaux républicains d'excellence, de probité et de confraternité légués par le Lycée de Garçons de Bingerville.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Pillar 1 */}
          <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-4 hover:border-[#E5B824] hover:shadow-md transition-all flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-yellow-50 dark:bg-yellow-500/15 border border-yellow-200 dark:border-yellow-500/30 flex items-center justify-center text-[#B8860B] dark:text-[#E5B824]">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-heading font-bold text-gray-900 dark:text-white">
                01. Mémoire & Fraternité
              </h3>
              <p className="text-xs text-gray-600 dark:text-zinc-400 leading-relaxed">
                Sauvegarder l’histoire séculaire du lycée, immortaliser les archives des promotions,
                honorer les enseignants émérites et organiser les retrouvailles annuelles.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('histoire')}
              className="text-xs font-bold text-[#B8860B] dark:text-[#E5B824] hover:text-[#dcae1f] flex items-center gap-1.5 pt-4 border-t border-gray-100 dark:border-zinc-800 cursor-pointer"
            >
              <span>Découvrir l’Histoire & la Frise</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Pillar 2 */}
          <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-4 hover:border-gray-400 dark:hover:border-zinc-600 hover:shadow-md transition-all flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 flex items-center justify-center text-gray-800 dark:text-zinc-200">
                <Briefcase className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-heading font-bold text-gray-900 dark:text-white">
                02. Réseau & Opportunités
              </h3>
              <p className="text-xs text-gray-600 dark:text-zinc-400 leading-relaxed">
                Créer une synergie professionnelle féconde entre les doyens expérimentés et les jeunes diplômés.
                Offres d'emploi, stages exclusifs, mentorat et opportunités d'affaires.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('reseau')}
              className="text-xs font-bold text-black dark:text-white hover:text-gray-700 dark:hover:text-[#E5B824] flex items-center gap-1.5 pt-4 border-t border-gray-100 dark:border-zinc-800 cursor-pointer"
            >
              <span>Accéder au Réseau Pro</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Pillar 3 */}
          <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-4 hover:border-emerald-400 dark:hover:border-emerald-600 hover:shadow-md transition-all flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-500/15 border border-emerald-200 dark:border-emerald-500/30 flex items-center justify-center text-emerald-700 dark:text-emerald-400">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-heading font-bold text-gray-900 dark:text-white">
                03. Engagement & Solidarité
              </h3>
              <p className="text-xs text-gray-600 dark:text-zinc-400 leading-relaxed">
                Réhabiliter les infrastructures du lycée, financer des bourses d'études pour les élèves
                méritants défavorisés et soutenir la rénovation des laboratoires scientifiques.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('projets')}
              className="text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 flex items-center gap-1.5 pt-4 border-t border-gray-100 dark:border-zinc-800 cursor-pointer"
            >
              <span>Voir les Chantiers & Contribuer</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* Featured Projects Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between pb-6 border-b border-gray-200 dark:border-zinc-800 gap-4">
          <div>
            <span className="text-xs uppercase tracking-widest font-bold text-[#B8860B] dark:text-[#E5B824]">
              Chantiers Stratégiques
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-heading text-black dark:text-white mt-1">
              Actions & Projets Prioritaires
            </h2>
          </div>
          <button
            onClick={() => setActiveTab('projets')}
            className="text-xs font-bold text-[#B8860B] dark:text-[#E5B824] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Consulter tous les projets ({projects.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          {featuredProjects.map((project) => (
            <div
              key={project.id}
              className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl overflow-hidden flex flex-col justify-between hover:border-gray-400 dark:hover:border-zinc-600 hover:shadow-lg transition-all"
            >
              <div>
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded bg-black/80 backdrop-blur-md text-[10px] font-bold text-white border border-black uppercase">
                    {project.category}
                  </div>
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded bg-[#E5B824] text-black text-[10px] font-bold uppercase shadow-sm">
                    Échéance : {project.deadline}
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <h3 className="text-lg font-heading font-bold text-gray-900 dark:text-white leading-snug">
                    {project.title}
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                    {project.summary}
                  </p>

                  {/* Funding Gauge */}
                  <div className="space-y-1.5 pt-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-900 dark:text-white font-bold font-mono">
                        {project.budgetRaised.toLocaleString('fr-FR')} FCFA mobilisés
                      </span>
                      <span className="text-[#B8860B] dark:text-[#E5B824] font-bold font-mono">
                        {project.progressPercentage}%
                      </span>
                    </div>

                    <div className="w-full h-2.5 bg-gray-100 dark:bg-zinc-800 rounded-full overflow-hidden border border-gray-200 dark:border-zinc-700">
                      <div
                        className="h-full bg-gradient-to-r from-[#D4AF37] to-[#E5B824] rounded-full transition-all duration-700"
                        style={{ width: `${project.progressPercentage}%` }}
                      ></div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-gray-500 dark:text-zinc-400">
                      <span>Objectif : {project.budgetGoal.toLocaleString('fr-FR')} FCFA</span>
                      <span>{project.contributorsCount} contributeurs</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-6 pb-6 pt-3 border-t border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900/60 flex items-center justify-between">
                <button
                  onClick={() => setActiveTab('projets')}
                  className="text-xs font-medium text-gray-600 dark:text-zinc-400 hover:text-black dark:hover:text-white cursor-pointer"
                >
                  Détails du cahier des charges
                </button>
                <button
                  onClick={() => setContributionModalProject(project)}
                  className="px-4 py-2 rounded-lg text-xs font-bold text-black bg-[#E5B824] hover:bg-[#dcae1f] transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
                >
                  <HeartHandshake className="w-3.5 h-3.5" />
                  <span>Soutenir ce projet</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Promotions & Generational Bridge Section */}
      <section className="bg-gray-50 dark:bg-zinc-900/60 border-y border-gray-200 dark:border-zinc-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 pb-8 border-b border-gray-200 dark:border-zinc-800">
            <div>
              <span className="text-xs uppercase tracking-widest font-bold text-[#B8860B] dark:text-[#E5B824]">
                Espace Intergénérationnel
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold font-heading text-black dark:text-white mt-1">
                L’Annuaire des Promotions
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-zinc-400 mt-1">
                De la Promotion 1970 aux plus récents bacheliers 2024, retrouvez vos condisciples et délégués.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('anciens')}
              className="px-5 py-2.5 rounded-lg text-xs font-bold text-gray-900 dark:text-white bg-white dark:bg-zinc-900 hover:bg-gray-100 dark:hover:bg-zinc-800 border border-gray-300 dark:border-zinc-700 shadow-sm cursor-pointer flex items-center gap-1.5"
            >
              <span>Accéder à l’Annuaire Complet</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-8">
            {promotions.slice(0, 8).map((promo) => (
              <div
                key={promo.year}
                onClick={() => setActiveTab('anciens')}
                className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 hover:border-[#E5B824] hover:shadow-md rounded-xl p-4 transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-heading font-bold text-base text-[#B8860B] dark:text-[#E5B824] group-hover:text-black dark:group-hover:text-white">
                      {promo.year}
                    </span>
                    <span className="text-[10px] text-gray-500 dark:text-zinc-400 font-mono font-medium">
                      {promo.registeredMembers} inscrits
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-gray-900 dark:text-white truncate">
                    {promo.name}
                  </h4>
                  <p className="text-[11px] text-gray-600 dark:text-zinc-400 italic mt-0.5 line-clamp-1 font-editorial">
                    « {promo.motto} »
                  </p>
                </div>
                <div className="pt-3 mt-3 border-t border-gray-100 dark:border-zinc-800 text-[10px] text-gray-500 dark:text-zinc-400 flex items-center justify-between">
                  <span>Délégué : {promo.delegateName.split(' ')[0]}</span>
                  <span className="text-[#B8860B] dark:text-[#E5B824] group-hover:translate-x-1 transition-transform font-bold">→</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* News & Events Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* 2 Cols for News */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-zinc-800">
              <div>
                <span className="text-xs uppercase tracking-widest font-bold text-[#B8860B] dark:text-[#E5B824]">
                  Vie de l’Amicale
                </span>
                <h3 className="text-xl font-bold font-heading text-black dark:text-white">
                  Dernières Actualités & Communiqués
                </h3>
              </div>
              <button
                onClick={() => setActiveTab('actualites')}
                className="text-xs font-bold text-[#B8860B] dark:text-[#E5B824] hover:underline cursor-pointer"
              >
                Tout voir
              </button>
            </div>

            <div className="space-y-4">
              {latestNews.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setActiveTab('actualites')}
                  className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 hover:border-gray-400 dark:hover:border-zinc-600 hover:shadow-md rounded-xl p-4 sm:p-5 transition-all cursor-pointer flex flex-col sm:flex-row gap-4"
                >
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full sm:w-36 h-28 object-cover rounded-lg shrink-0 border border-gray-100 dark:border-zinc-800"
                  />
                  <div className="flex flex-col justify-between flex-1">
                    <div>
                      <div className="flex items-center gap-2 text-[11px] text-gray-500 dark:text-zinc-400 mb-1">
                        <span className="text-[#B8860B] dark:text-[#E5B824] font-bold">{item.category}</span>
                        <span>·</span>
                        <span>{item.date}</span>
                      </div>
                      <h4 className="text-sm font-bold text-gray-900 dark:text-white hover:text-[#B8860B] dark:hover:text-[#E5B824] transition-colors leading-snug">
                        {item.title}
                      </h4>
                      <p className="text-xs text-gray-600 dark:text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                        {item.summary}
                      </p>
                    </div>
                    <div className="text-[11px] text-gray-500 dark:text-zinc-400 mt-2 font-medium">
                      Source : {item.author}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 1 Col for Agenda */}
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-zinc-800">
              <div>
                <span className="text-xs uppercase tracking-widest font-bold text-[#B8860B] dark:text-[#E5B824]">
                  Agenda Officiel
                </span>
                <h3 className="text-xl font-bold font-heading text-black dark:text-white">
                  Prochains Événements
                </h3>
              </div>
              <button
                onClick={() => setActiveTab('actualites')}
                className="text-xs font-bold text-[#B8860B] dark:text-[#E5B824] hover:underline cursor-pointer"
              >
                Calendrier
              </button>
            </div>

            <div className="space-y-4">
              {upcomingEvents.map((ev) => (
                <div
                  key={ev.id}
                  className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-4 space-y-3 hover:shadow-sm"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-yellow-50 dark:bg-yellow-500/15 text-[#B8860B] dark:text-[#E5B824] border border-yellow-200 dark:border-yellow-500/30 uppercase">
                      {ev.type.replace('_', ' ')}
                    </span>
                    <span className="text-[11px] text-gray-500 dark:text-zinc-400 font-mono font-medium">{ev.date}</span>
                  </div>

                  <h4 className="text-xs font-bold text-gray-900 dark:text-white leading-snug">
                    {ev.title}
                  </h4>

                  <div className="text-[11px] text-gray-600 dark:text-zinc-400 space-y-1">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-gray-400 dark:text-zinc-500" />
                      <span>{ev.time}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-gray-400 dark:text-zinc-500" />
                      <span className="truncate">{ev.location}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-gray-100 dark:border-zinc-800 flex items-center justify-between">
                    <span className="text-[10px] text-gray-500 dark:text-zinc-400">
                      {ev.attendeesCount} participants inscrits
                    </span>
                    <button
                      onClick={() => setActiveTab('actualites')}
                      className="px-3 py-1 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-800 dark:text-zinc-100 rounded text-xs font-semibold transition-colors cursor-pointer border border-gray-200 dark:border-zinc-700"
                    >
                      Participer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Alumni Testimonials Carousel Section */}
      <TestimonialsCarousel onNavigate={setActiveTab} />

      {/* Médiathèque & Chaîne YouTube Officielle ALGB TV */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-b from-gray-50 to-white dark:from-zinc-900 dark:to-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-10 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-400/5 rounded-full blur-3xl pointer-events-none"></div>

          {/* Section Header */}
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 pb-8 border-b border-gray-200 dark:border-zinc-800">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900/60 text-red-700 dark:text-red-400 text-xs font-bold uppercase tracking-wider mb-2">
                <Video className="w-3.5 h-3.5" />
                <span>Chaîne YouTube Officielle ALGB TV & Archives</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold font-heading text-black dark:text-white">
                La Médiathèque en Images & Vidéos
              </h2>
              <p className="text-sm text-gray-600 dark:text-zinc-400 font-editorial italic mt-1 max-w-2xl">
                « Revivez les documentaires exclusifs, les discours historiques des galas et les souvenirs inoubliables de nos promotions. »
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveTab('mediatheque')}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#E5B824] text-black hover:bg-[#dcae1f] transition-all flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <Play className="w-3.5 h-3.5 fill-black" />
                <span>Explorer la Médiathèque</span>
              </button>
            </div>
          </div>

          {/* YouTube Channel Banner Teaser */}
          <div className="mt-8 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="relative">
                <img
                  src="/assets/aistudio/IMG-20180925-WA0019_301d84a7.jpg"
                  alt="Logo ALGB YouTube"
                  className="w-14 h-14 object-contain rounded-xl border border-gray-200 dark:border-zinc-700 bg-white p-1 shadow-xs"
                />
                <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-red-600 rounded-full flex items-center justify-center text-[10px] text-white">
                  ▶
                </span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-base font-bold text-gray-900 dark:text-white">ALGB TV — Lycée de Bingerville</h4>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 font-mono font-medium">
                    @ALGB_Officiel
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-600 dark:text-zinc-400 mt-0.5">
                  <span className="text-black dark:text-white font-semibold">3 850 abonnés</span>
                  <span>·</span>
                  <span>48 vidéos officielles</span>
                  <span>·</span>
                  <span className="text-[#B8860B] dark:text-[#E5B824] font-semibold">Chaîne certifiée</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <a
                href="https://www.youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-none text-center px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-xs"
              >
                <span>S'abonner sur YouTube</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <button
                onClick={() => setActiveTab('mediatheque')}
                className="flex-1 sm:flex-none text-center px-4 py-2 rounded-lg bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-800 dark:text-zinc-100 text-xs font-semibold transition-colors border border-gray-300 dark:border-zinc-700"
              >
                Voir la chaîne intégrée
              </button>
            </div>
          </div>

          {/* Featured Video and Photo Highlights Grid */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Highlight 1 */}
            <div
              onClick={() => setActiveTab('mediatheque')}
              className="group bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 hover:border-gray-400 dark:hover:border-zinc-600 rounded-2xl overflow-hidden cursor-pointer transition-all shadow-sm hover:shadow-md flex flex-col"
            >
              <div className="relative aspect-video overflow-hidden">
                <img
                  src="/assets/images/algb_youtube_doc_cover_1794388504553.jpg"
                  alt="Documentaire ALGB"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/15 transition-colors flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center shadow-xl group-hover:scale-110 transition-all">
                    <Play className="w-5 h-5 fill-white ml-0.5" />
                  </div>
                </div>
                <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded bg-black/80 font-mono text-[11px] text-white">
                  38:40
                </div>
                <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-red-600 text-white font-bold text-[10px] uppercase tracking-wider">
                  Documentaire Grand Format
                </div>
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                <div>
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-[#B8860B] dark:group-hover:text-[#E5B824] transition-colors line-clamp-2">
                    Les Bâtisseurs de Bingerville : 120 Ans d'Excellence et d'Honneur
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-zinc-400 mt-1 line-clamp-2 font-editorial italic">
                    Plongée au cœur de la fondation séculaire de 1903, les témoignages des doyens et la fierté de l'uniforme.
                  </p>
                </div>
                <div className="text-[11px] text-gray-500 dark:text-zinc-400 flex items-center justify-between pt-2 border-t border-gray-100 dark:border-zinc-800">
                  <span>14,8 k vues</span>
                  <span className="text-[#B8860B] dark:text-[#E5B824] font-bold">Lire la vidéo →</span>
                </div>
              </div>
            </div>

            {/* Highlight 2 */}
            <div
              onClick={() => setActiveTab('mediatheque')}
              className="group bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 hover:border-gray-400 dark:hover:border-zinc-600 rounded-2xl overflow-hidden cursor-pointer transition-all shadow-sm hover:shadow-md flex flex-col"
            >
              <div className="relative aspect-video overflow-hidden">
                <img
                  src="/assets/images/algb_youtube_gala_ceremony_1794388517940.jpg"
                  alt="Dîner de Gala"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/15 transition-colors flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center shadow-xl group-hover:scale-110 transition-all">
                    <Play className="w-5 h-5 fill-white ml-0.5" />
                  </div>
                </div>
                <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded bg-black/80 font-mono text-[11px] text-white">
                  24:15
                </div>
                <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-[#E5B824] text-black font-bold text-[10px] uppercase tracking-wider">
                  Cérémonie & Gala
                </div>
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                <div>
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-[#B8860B] dark:group-hover:text-[#E5B824] transition-colors line-clamp-2">
                    Grande Soirée de Fraternité & Dîner de Gala des Anciens 2026
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-zinc-400 mt-1 line-clamp-2 font-editorial italic">
                    Retrouvailles mémorables réunissant les promotions 1974 à 2024 et remise des Prix d'Excellence.
                  </p>
                </div>
                <div className="text-[11px] text-gray-500 dark:text-zinc-400 flex items-center justify-between pt-2 border-t border-gray-100 dark:border-zinc-800">
                  <span>6,2 k vues</span>
                  <span className="text-[#B8860B] dark:text-[#E5B824] font-bold">Lire la vidéo →</span>
                </div>
              </div>
            </div>

            {/* Highlight 3 */}
            <div
              onClick={() => setActiveTab('mediatheque')}
              className="group bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 hover:border-gray-400 dark:hover:border-zinc-600 rounded-2xl overflow-hidden cursor-pointer transition-all shadow-sm hover:shadow-md flex flex-col"
            >
              <div className="relative aspect-video overflow-hidden">
                <img
                  src="/assets/images/algb_vintage_students_archive_1794388532357.jpg"
                  alt="Archives Vintage"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-white/95 dark:bg-zinc-900/95 text-black dark:text-white font-bold text-[10px] uppercase tracking-wider border border-gray-200 dark:border-zinc-700 shadow-xs">
                  Archives 1962
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Camera className="w-3.5 h-3.5 text-[#E5B824]" />
                    <span>Galerie Photos d'Époque</span>
                  </span>
                </div>
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                <div>
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-[#B8860B] dark:group-hover:text-[#E5B824] transition-colors line-clamp-2">
                    Archives Historiques : Les Générations sous les Palmiers
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-zinc-400 mt-1 line-clamp-2 font-editorial italic">
                    Photographies authentiques des promotions, défilés patriotiques et cours d’honneur de Bingerville.
                  </p>
                </div>
                <div className="text-[11px] text-gray-500 dark:text-zinc-400 flex items-center justify-between pt-2 border-t border-gray-100 dark:border-zinc-800">
                  <span>6 albums d'archives</span>
                  <span className="text-[#B8860B] dark:text-[#E5B824] font-bold">Voir les photos →</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
