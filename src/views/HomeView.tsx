import React from 'react';
import { useApp } from '../context/AppContext';
import {
  ArrowRight,
  Briefcase,
  MapPin,
  Users,
  HeartHandshake,
  GraduationCap,
  Award,
  Sparkles,
  Lock,
  CreditCard,
  KeyRound,
} from 'lucide-react';

export const HomeView: React.FC = () => {
  const {
    setActiveTab,
    jobOffers,
    members,
    projects,
    events,
    setContributionModalProject,
    isCurrentMemberUpToDate,
    currentMemberFinancialSummary,
    currentRole,
    activeCredential,
    currentUser,
    openAuthModal,
    openPaymentModal,
  } = useApp();

  const latestJobs = jobOffers.slice(0, 3);
  const featuredMentors = members.filter((m) => m.isMentor && m.avatarUrl).slice(0, 4);

  const totalGoal = projects.reduce((sum, p) => sum + p.budgetGoal, 0);
  const totalRaised = projects.reduce((sum, p) => sum + p.budgetRaised, 0);
  const globalPct = totalGoal > 0 ? Math.min(100, Math.round((totalRaised / totalGoal) * 100)) : 72;
  const totalDonors = projects.reduce((sum, p) => sum + p.contributorsCount, 0);
  const nextEvent = events[0];

  const getContractBadge = (type: string) => {
    switch (type) {
      case 'EXECUTIVE':
        return 'Executive';
      case 'ALTERNANCE':
        return 'Alternance';
      case 'STAGE':
        return 'Stage';
      default:
        return type;
    }
  };

  return (
    <div className="bg-[#F8F8F6] dark:bg-[#141413] text-[#141413] dark:text-[#F8F8F6] transition-colors">
      {/* 1. HERO SECTION — Noir Carbone (#141413) */}
      <section className="bg-[#141413] text-white border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2.5 text-xs uppercase tracking-[0.18em] text-[#F2B705] font-semibold">
                <GraduationCap className="w-4 h-4" />
                <span>Réseau Officiel · Bingerville & Diaspora</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-[52px] font-heading font-bold text-white leading-[1.12] tracking-tight">
                Une histoire d’excellence, un réseau mondial d’engagement.
              </h1>

              <p className="text-sm sm:text-base text-zinc-300 leading-relaxed max-w-xl">
                Depuis 1903, le Lycée de Garçons de Bingerville forme des bâtisseurs, dirigeants et
                scientifiques. Retrouvez vos promotions, activez le mentorat exécutif et soutenez les
                bourses d’études de la nouvelle génération.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-3.5">
                <button
                  type="button"
                  onClick={() => setActiveTab('adhesion')}
                  className="px-6 py-3.5 rounded-lg bg-[#F2B705] hover:bg-[#dfa704] text-[#141413] font-semibold text-sm transition-colors inline-flex items-center gap-2 cursor-pointer"
                >
                  <span>Rejoindre le réseau</span>
                  <ArrowRight className="w-4 h-4 text-[#141413]" />
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('anciens')}
                  className="px-5 py-3.5 rounded-lg border border-white/50 text-white hover:bg-white hover:text-[#141413] font-medium text-sm transition-colors cursor-pointer"
                >
                  Explorer l’annuaire
                </button>
              </div>

              <div className="pt-6 border-t border-white/10 grid grid-cols-3 gap-6 max-w-lg">
                <div>
                  <div className="text-2xl sm:text-3xl font-heading font-bold text-[#F2B705] tabular-nums">
                    8 500+
                  </div>
                  <div className="text-[11px] text-zinc-400 mt-0.5">Alumni recensés</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-heading font-bold text-white tabular-nums">
                    70+
                  </div>
                  <div className="text-[11px] text-zinc-400 mt-0.5">Promotions actives</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-heading font-bold text-white tabular-nums">
                    28 pays
                  </div>
                  <div className="text-[11px] text-zinc-400 mt-0.5">Sections diaspora</div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="relative rounded-xl overflow-hidden border border-white/15 shadow-2xl">
                <img
                  src="/assets/images/alumni_hero_graduates_1794580775498.jpg"
                  alt="Anciens élèves diplômés du Lycée de Garçons de Bingerville"
                  className="w-full h-[320px] sm:h-[420px] lg:h-[460px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#141413]/90 via-transparent to-transparent" />
                {nextEvent && (
                  <div className="absolute bottom-4 left-4 right-4 bg-[#141413]/90 backdrop-blur-md border border-white/15 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider font-semibold text-[#F2B705]">
                        Prochain rendez-vous · {nextEvent.date}
                      </span>
                      <p className="text-xs sm:text-sm font-heading font-semibold text-white mt-0.5">
                        {nextEvent.title}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveTab('actualites')}
                      className="px-3.5 py-2 rounded-lg bg-[#F2B705] hover:bg-[#dfa704] text-[#141413] text-xs font-semibold shrink-0 cursor-pointer transition-colors"
                    >
                      Voir l’agenda
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. APERÇU CARRIÈRES — Blanc Albâtre (#F8F8F6) & Badges Terracotta (#C2410C) */}
      <section className="bg-[#F8F8F6] dark:bg-[#191917] py-16 sm:py-20 border-b border-black/5 dark:border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <span className="text-xs uppercase tracking-[0.16em] font-semibold text-[#C2410C] dark:text-orange-400 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5" />
                <span>Jeunes Diplômés & Opportunités</span>
              </span>
              <h2 className="text-2xl sm:text-4xl font-heading font-bold text-[#141413] dark:text-white">
                Carrières au cœur du réseau
              </h2>
              <p className="text-sm text-[#4A4A48] dark:text-zinc-400 max-w-2xl">
                Les dernières offres de stages, d’alternance, de CDI et de direction publiées directement par nos alumni recruteurs.
              </p>
            </div>

            {isCurrentMemberUpToDate ? (
              <button
                type="button"
                onClick={() => setActiveTab('reseau')}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#C2410C] hover:bg-[#9a3412] text-white text-xs font-semibold transition-colors cursor-pointer self-start md:self-auto"
              >
                <span>Toutes les offres ({jobOffers.length})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FFF7ED] dark:bg-[#2b1b15] border border-[#C2410C]/25 text-[#C2410C] dark:text-orange-300 text-xs font-semibold w-fit">
                <Lock className="w-3.5 h-3.5" />
                <span>Réservé aux membres à jour de cotisation</span>
              </span>
            )}
          </div>

          {isCurrentMemberUpToDate ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {latestJobs.map((job) => (
                <article
                  key={job.id}
                  className="bg-white dark:bg-[#20201e] rounded-xl p-6 shadow-editorial border border-black/5 dark:border-white/10 flex flex-col justify-between gap-5 hover:-translate-y-0.5 transition-transform"
                >
                  <div className="space-y-3.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2.5 py-1 rounded-md bg-[#C2410C] text-white text-[11px] font-semibold uppercase tracking-wide">
                        {getContractBadge(job.type)}
                      </span>
                      <span className="px-2.5 py-1 rounded-md bg-[#FEF8E6] text-[#141413] text-[11px] font-medium">
                        Publié par un Alumni
                      </span>
                    </div>

                    <div>
                      <h3 className="text-lg font-heading font-bold text-[#141413] dark:text-white leading-snug">
                        {job.title}
                      </h3>
                      <p className="text-xs font-semibold text-[#C2410C] dark:text-orange-400 mt-1">
                        {job.company}
                      </p>
                    </div>

                    <p className="text-xs text-[#4A4A48] dark:text-zinc-300 line-clamp-2 leading-relaxed">
                      {job.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-black/5 dark:border-white/10 flex items-center justify-between gap-2">
                    <span className="text-[11px] text-[#4A4A48] dark:text-zinc-400 flex items-center gap-1 truncate">
                      <MapPin className="w-3.5 h-3.5 text-[#C2410C] dark:text-orange-400 shrink-0" />
                      <span className="truncate">{job.location}</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setActiveTab('reseau')}
                      className="px-3.5 py-2 rounded-lg bg-[#F2B705] hover:bg-[#dfa704] text-[#141413] text-xs font-semibold shrink-0 cursor-pointer transition-colors"
                    >
                      Postuler
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-[#20201e] rounded-xl p-8 sm:p-10 shadow-editorial border border-[#C2410C]/20 dark:border-white/10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
              <div className="space-y-3 max-w-2xl">
                <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#C2410C] dark:text-orange-400">
                  <Lock className="w-4 h-4" />
                  <span>{jobOffers.length} opportunités actives (Stage, Alternance, CDI, Executive)</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-heading font-bold text-[#141413] dark:text-white">
                  Débloquez l’encart « Carrières au cœur du réseau » avec une cotisation à jour
                </h3>
                <p className="text-xs sm:text-sm text-[#4A4A48] dark:text-zinc-300 leading-relaxed">
                  L’accès aux offres d’emploi publiées par nos alumni recruteurs, la consultation des
                  fiches de poste et le dépôt de candidature sont exclusivement réservés aux membres
                  ALGB connectés et à jour de leur cotisation annuelle.
                </p>
                {currentRole !== 'VISITEUR' && activeCredential && currentUser && currentMemberFinancialSummary && (
                  <div className="p-3.5 rounded-lg bg-[#FFF7ED] dark:bg-[#2b1b15] border border-[#C2410C]/20 text-xs space-y-1">
                    <div className="font-semibold text-[#C2410C] dark:text-orange-300">
                      Statut de votre dossier ({currentUser.firstName} {currentUser.lastName}) :
                    </div>
                    <div className="text-[#4A4A48] dark:text-zinc-300">
                      {currentMemberFinancialSummary.paidMonths.length} / 12 mois acquittés
                      {currentMemberFinancialSummary.overdueMonths.length > 0 &&
                        ` · ${currentMemberFinancialSummary.overdueMonths.length} mois à régulariser`}
                      {currentMemberFinancialSummary.pendingMonths.length > 0 &&
                        ` · ${currentMemberFinancialSummary.pendingMonths.length} en attente de pointage`}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-3 shrink-0">
                {currentRole === 'VISITEUR' || !activeCredential ? (
                  <>
                    <button
                      type="button"
                      onClick={() => openAuthModal('reseau')}
                      className="px-5 py-3 rounded-lg bg-[#F2B705] hover:bg-[#dfa704] text-[#141413] text-xs font-semibold inline-flex items-center gap-2 cursor-pointer transition-colors"
                    >
                      <KeyRound className="w-4 h-4 text-[#141413]" />
                      <span>Me connecter avec mon credential</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('adhesion')}
                      className="px-4 py-3 rounded-lg border border-black/15 dark:border-white/15 text-[#141413] dark:text-white text-xs font-medium cursor-pointer"
                    >
                      Adhérer à l’ALGB
                    </button>
                  </>
                ) : currentUser ? (
                  <>
                    <button
                      type="button"
                      onClick={() =>
                        openPaymentModal({
                          type: 'COTISATION_MENSUELLE',
                          selectedMonths: currentMemberFinancialSummary?.overdueMonths,
                        })
                      }
                      className="px-5 py-3 rounded-lg bg-[#F2B705] hover:bg-[#dfa704] text-[#141413] text-xs font-semibold inline-flex items-center gap-2 cursor-pointer transition-colors"
                    >
                      <CreditCard className="w-4 h-4 text-[#141413]" />
                      <span>Régulariser ma cotisation</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('espace-membre')}
                      className="px-4 py-3 rounded-lg border border-black/15 dark:border-white/15 text-[#141413] dark:text-white text-xs font-medium cursor-pointer"
                    >
                      Mon Espace Cotisations
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => setActiveTab('espace-membre')}
                    className="px-5 py-3 rounded-lg bg-[#F2B705] hover:bg-[#dfa704] text-[#141413] text-xs font-semibold cursor-pointer transition-colors"
                  >
                    Consulter mon profil membre
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 3. APERÇU MENTORAT & DIRIGEANTS — Bleu Outremer Profond (#16324F) */}
      <section className="bg-[#16324F] text-white py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <span className="text-xs uppercase tracking-[0.16em] font-semibold text-[#F2B705] flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" />
                <span>Cadres Dirigeants & Transmission</span>
              </span>
              <h2 className="text-2xl sm:text-4xl font-heading font-bold text-white">
                Mentorat & Collège des Dirigeants
              </h2>
              <p className="text-sm text-slate-200 max-w-2xl">
                Des anciens élèves dirigeants, chercheurs et entrepreneurs accompagnent personnellement l’essor professionnel des plus jeunes promotions.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => setActiveTab('mentorat')}
                className="px-4 py-2.5 rounded-lg bg-[#F2B705] hover:bg-[#dfa704] text-[#141413] text-xs font-semibold transition-colors cursor-pointer inline-flex items-center gap-2"
              >
                <span>Découvrir le programme</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#141413]" />
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('anciens')}
                className="px-4 py-2.5 rounded-lg border border-white/40 text-white hover:bg-white hover:text-[#16324F] text-xs font-medium transition-colors cursor-pointer"
              >
                Annuaire complet
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredMentors.map((mentor) => (
              <div
                key={mentor.id}
                onClick={() => setActiveTab('mentorat')}
                className="bg-white/10 hover:bg-white/15 border border-white/15 rounded-xl p-6 text-center space-y-4 transition-colors cursor-pointer"
              >
                <div className="w-24 h-24 mx-auto rounded-full overflow-hidden border-2 border-[#F2B705] p-0.5 bg-[#141413]">
                  <img
                    src={mentor.avatarUrl}
                    alt={`${mentor.firstName} ${mentor.lastName}`}
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#F2B705]">
                    Promotion {mentor.promotionYear}
                  </span>
                  <h3 className="text-lg font-heading font-bold text-white">
                    {mentor.firstName} {mentor.lastName}
                  </h3>
                  <p className="text-xs font-medium text-slate-200">{mentor.currentRole}</p>
                  <p className="text-[11px] text-slate-300 truncate">{mentor.company}</p>
                </div>

                <div className="pt-2 border-t border-white/15 text-[11px] text-[#FEF8E6] font-medium inline-flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#F2B705]" />
                  <span>Disponible pour mentorat</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. APERÇU MÉCÉNAT — Vert Émeraude Sombre (#134E4A) */}
      <section className="bg-[#134E4A] text-white py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] font-semibold text-[#F2B705]">
                <Award className="w-4 h-4" />
                <span>Mécénat, Bourses & Solidarité</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-heading font-bold text-white leading-tight">
                Investir dans l’excellence des générations futures de Bingerville.
              </h2>

              <p className="text-sm text-emerald-100 leading-relaxed">
                Chaque don finance directement les bourses d’internat des élèves méritants, la
                modernisation de la grande bibliothèque et l’équipement des laboratoires scientifiques du lycée.
              </p>

              <div className="grid grid-cols-3 gap-5 pt-2">
                <div>
                  <div className="text-2xl sm:text-3xl font-heading font-bold text-[#F2B705] tabular-nums">
                    {(totalRaised / 1000000).toFixed(1)} M
                  </div>
                  <div className="text-[11px] text-emerald-100 mt-0.5">FCFA déjà mobilisés</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-heading font-bold text-white tabular-nums">
                    25
                  </div>
                  <div className="text-[11px] text-emerald-100 mt-0.5">Bourses financées</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-heading font-bold text-white tabular-nums">
                    {totalDonors}
                  </div>
                  <div className="text-[11px] text-emerald-100 mt-0.5">Alumni contributeurs</div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="bg-white/10 border border-white/15 rounded-xl p-6 sm:p-8 space-y-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <span className="text-xs uppercase tracking-wider font-semibold text-[#F2B705]">
                      Campagne Annuelle 2026–2027
                    </span>
                    <h3 className="text-xl font-heading font-bold text-white mt-1">
                      Fonds Prioritaires ALGB
                    </h3>
                  </div>
                  <span className="text-2xl font-heading font-bold text-[#F2B705] tabular-nums">
                    {globalPct}%
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="w-full h-3.5 bg-black/30 rounded-full overflow-hidden border border-white/15">
                    <div
                      className="h-full bg-[#F2B705] rounded-full transition-all duration-700"
                      style={{ width: `${globalPct}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs text-emerald-100 tabular-nums">
                    <span>{totalRaised.toLocaleString('fr-FR')} FCFA collectés</span>
                    <span>Objectif : {totalGoal.toLocaleString('fr-FR')} FCFA</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('projets')}
                    className="px-6 py-3 rounded-lg bg-[#F2B705] hover:bg-[#dfa704] text-[#141413] font-semibold text-xs sm:text-sm inline-flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <HeartHandshake className="w-4 h-4 text-[#141413]" />
                    <span>Soutenir un projet</span>
                  </button>

                  {projects[0] && (
                    <button
                      type="button"
                      onClick={() => setContributionModalProject(projects[0])}
                      className="px-5 py-3 rounded-lg border border-white/40 text-white hover:bg-white hover:text-[#134E4A] text-xs font-semibold cursor-pointer transition-colors"
                    >
                      Contribuer directement
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
