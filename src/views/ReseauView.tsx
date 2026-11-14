import React, { useEffect, useMemo, useState } from 'react';
import { useApp } from '../context/AppContext';
import { JobOffer } from '../data/mockData';
import {
  Briefcase,
  MapPin,
  PlusCircle,
  Search,
  Building2,
  CheckCircle2,
  Lock,
  CreditCard,
  KeyRound,
  X,
} from 'lucide-react';

type ContractFilter = 'ALL' | 'STAGE' | 'ALTERNANCE' | 'CDI' | 'EXECUTIVE';

export const ReseauView: React.FC = () => {
  const {
    jobOffers,
    postJobOffer,
    applyToJobOffer,
    currentUser,
    currentRole,
    activeCredential,
    isCurrentMemberUpToDate,
    currentMemberFinancialSummary,
    openAuthModal,
    openPaymentModal,
    setActiveTab,
  } = useApp();

  const [contractFilter, setContractFilter] = useState<ContractFilter>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Publier une offre modal
  const [jobModalOpen, setJobModalOpen] = useState(false);
  const [newJob, setNewJob] = useState({
    title: '',
    type: 'CDI' as JobOffer['type'],
    company: currentUser?.company || '',
    sector: currentUser?.sector || 'Technologie & Numérique',
    location: 'Abidjan',
    description: '',
    requirements: '',
    contactEmail: currentUser?.email || 'recrutement@algb-alumni.ci',
  });

  useEffect(() => {
    if (!currentUser) return;
    setNewJob((prev) => ({
      ...prev,
      company: prev.company || currentUser.company || '',
      sector: prev.sector === 'Technologie & Numérique' ? currentUser.sector || prev.sector : prev.sector,
      contactEmail:
        prev.contactEmail === 'recrutement@algb-alumni.ci'
          ? currentUser.email || prev.contactEmail
          : prev.contactEmail,
    }));
  }, [currentUser]);

  // Postuler modal
  const [applyModalJob, setApplyModalJob] = useState<JobOffer | null>(null);
  const [coverNote, setCoverNote] = useState('');

  const contractTabs: { id: ContractFilter; label: string }[] = [
    { id: 'ALL', label: 'Toutes les offres' },
    { id: 'STAGE', label: 'Stage' },
    { id: 'ALTERNANCE', label: 'Alternance' },
    { id: 'CDI', label: 'CDI' },
    { id: 'EXECUTIVE', label: 'Executive' },
  ];

  const filteredJobs = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return jobOffers.filter((job) => {
      if (contractFilter !== 'ALL' && job.type !== contractFilter) return false;
      if (!q) return true;
      return (
        job.title.toLowerCase().includes(q) ||
        job.company.toLowerCase().includes(q) ||
        job.location.toLowerCase().includes(q) ||
        job.sector.toLowerCase().includes(q)
      );
    });
  }, [jobOffers, contractFilter, searchQuery]);

  const handleCreateJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJob.title.trim() || !newJob.description.trim()) return;

    postJobOffer({
      title: newJob.title.trim(),
      type: newJob.type,
      company: newJob.company.trim() || 'Entreprise Partenaire ALGB',
      sector: newJob.sector.trim(),
      location: newJob.location.trim(),
      postedBy: currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : 'Alumni ALGB',
      postedByPromo: currentUser?.promotionYear || 2002,
      deadline: '2026-12-31',
      description: newJob.description.trim(),
      requirements: newJob.requirements
        .split('\n')
        .map((r) => r.trim())
        .filter(Boolean),
      contactEmail: newJob.contactEmail.trim() || 'recrutement@algb-alumni.ci',
    });

    setJobModalOpen(false);
    setNewJob({
      title: '',
      type: 'CDI',
      company: currentUser?.company || '',
      sector: currentUser?.sector || 'Technologie & Numérique',
      location: 'Abidjan',
      description: '',
      requirements: '',
      contactEmail: currentUser?.email || 'recrutement@algb-alumni.ci',
    });
  };

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applyModalJob || !coverNote.trim()) return;
    applyToJobOffer({ jobId: applyModalJob.id, note: coverNote.trim() });
    setApplyModalJob(null);
    setCoverNote('');
  };

  const getContractLabel = (type: JobOffer['type']) => {
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

  const getCompanyMonogram = (company: string) =>
    company
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase() || '')
      .join('');

  const inputClass =
    'w-full bg-[#F8F8F6] dark:bg-[#141413] border border-black/15 dark:border-white/15 focus:border-[#C2410C] dark:focus:border-[#F2B705] rounded-lg px-3.5 py-2.5 text-xs text-[#141413] dark:text-white placeholder-[#4A4A48]/70 focus:outline-none';

  return (
    <div className="bg-[#F8F8F6] dark:bg-[#141413] min-h-screen transition-colors">
      {/* Univers Terracotta doux (#FFF7ED) */}
      <section className="bg-[#FFF7ED] dark:bg-[#221712] border-b border-[#C2410C]/15 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <span className="text-xs uppercase tracking-[0.16em] font-semibold text-[#C2410C] dark:text-orange-400 inline-flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5" />
                <span>Jeunes Diplômés & Mobilité Exécutive</span>
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-[#141413] dark:text-white">
                Carrières & Opportunités Alumni
              </h1>
              <p className="text-sm text-[#4A4A48] dark:text-zinc-300 leading-relaxed">
                Accédez aux postes ouverts par nos diplômés en poste en Côte d’Ivoire, en Afrique de
                l’Ouest et à l’international, du premier stage jusqu’aux directions générales.
              </p>
            </div>

            {isCurrentMemberUpToDate ? (
              <button
                type="button"
                onClick={() => setJobModalOpen(true)}
                className="px-5 py-3 rounded-lg bg-[#F2B705] hover:bg-[#dfa704] text-[#141413] font-semibold text-xs sm:text-sm inline-flex items-center gap-2 cursor-pointer transition-colors shrink-0 self-start md:self-auto shadow-xs"
              >
                <PlusCircle className="w-4 h-4 text-[#141413]" />
                <span>Publier une offre</span>
              </button>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white dark:bg-[#1e1e1c] border border-[#C2410C]/25 text-[#C2410C] dark:text-orange-300 text-xs font-semibold shrink-0 self-start md:self-auto">
                <Lock className="w-3.5 h-3.5" />
                <span>Réservé aux membres à jour de cotisation</span>
              </span>
            )}
          </div>

          {isCurrentMemberUpToDate && (
            /* Filtres rapides par type de contrat (Terracotta Intense #C2410C) + Recherche */
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2">
                {contractTabs.map((tab) => {
                  const active = contractFilter === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setContractFilter(tab.id)}
                      className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                        active
                          ? 'bg-[#C2410C] text-white shadow-xs'
                          : 'bg-white dark:bg-[#1e1e1c] text-[#141413] dark:text-zinc-200 border border-black/10 dark:border-white/10 hover:border-[#C2410C]'
                      }`}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              <div className="relative w-full lg:w-80">
                <Search className="w-4 h-4 text-[#4A4A48] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher un poste, entreprise, ville..."
                  className="w-full bg-white dark:bg-[#1e1e1c] border border-black/15 dark:border-white/15 focus:border-[#C2410C] rounded-lg pl-9 pr-3 py-2 text-xs text-[#141413] dark:text-white placeholder-[#4A4A48]/70 focus:outline-none"
                />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Liste de cartes d'offres (uniquement membres à jour de cotisation) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        {!isCurrentMemberUpToDate ? (
          <div className="bg-white dark:bg-[#1e1e1c] rounded-xl p-8 sm:p-10 shadow-editorial border border-[#C2410C]/20 dark:border-white/10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#C2410C] dark:text-orange-400">
                <Lock className="w-4 h-4" />
                <span>Carrières au cœur du réseau · {jobOffers.length} opportunités actives</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-heading font-bold text-[#141413] dark:text-white">
                Accès exclusif aux membres à jour de cotisation
              </h2>
              <p className="text-xs sm:text-sm text-[#4A4A48] dark:text-zinc-300 leading-relaxed">
                Conformément à la matrice des profils ALGB, la consultation des offres de stages,
                d’alternance, de CDI et de postes exécutifs, ainsi que la publication d’offres et
                le dépôt de candidatures, sont réservés aux membres connectés à jour de leur
                cotisation annuelle.
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
        ) : filteredJobs.length === 0 ? (
          <div className="bg-white dark:bg-[#1e1e1c] rounded-xl p-12 text-center shadow-editorial border border-black/5 dark:border-white/10 space-y-3">
            <Briefcase className="w-10 h-10 text-[#C2410C] mx-auto" />
            <h2 className="text-lg font-heading font-bold text-[#141413] dark:text-white">
              Aucune offre ne correspond à ce filtre
            </h2>
            <p className="text-xs text-[#4A4A48] dark:text-zinc-400">
              Affichez toutes les catégories de contrats ou publiez une nouvelle opportunité.
            </p>
            <button
              type="button"
              onClick={() => {
                setContractFilter('ALL');
                setSearchQuery('');
              }}
              className="px-4 py-2 rounded-lg bg-[#F2B705] text-[#141413] text-xs font-semibold cursor-pointer"
            >
              Afficher toutes les offres
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredJobs.map((job) => (
              <article
                key={job.id}
                className="bg-[#FFFFFF] dark:bg-[#1e1e1c] rounded-xl p-6 shadow-editorial border border-black/5 dark:border-white/10 flex flex-col justify-between gap-5"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3.5 min-w-0">
                      {/* Logo entreprise monogramme */}
                      <div className="w-12 h-12 rounded-xl bg-[#FFF7ED] dark:bg-[#2b1b15] border border-[#C2410C]/25 flex items-center justify-center font-heading font-bold text-sm text-[#C2410C] dark:text-orange-400 shrink-0">
                        {getCompanyMonogram(job.company) || <Building2 className="w-5 h-5" />}
                      </div>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className="px-2 py-0.5 rounded bg-[#C2410C] text-white text-[10px] font-semibold uppercase tracking-wide">
                            {getContractLabel(job.type)}
                          </span>
                          <span className="px-2.5 py-0.5 rounded bg-[#FEF8E6] text-[#141413] text-[10px] font-semibold">
                            Publié par un Alumni
                          </span>
                        </div>
                        <h3 className="text-lg font-heading font-bold text-[#141413] dark:text-white leading-snug">
                          {job.title}
                        </h3>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#4A4A48] dark:text-zinc-300">
                    <span className="font-semibold text-[#141413] dark:text-white">{job.company}</span>
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#C2410C] dark:text-orange-400" />
                      <span>{job.location}</span>
                    </span>
                    <span>· {job.sector}</span>
                  </div>

                  <p className="text-xs sm:text-sm text-[#4A4A48] dark:text-zinc-300 leading-relaxed">
                    {job.description}
                  </p>

                  {job.requirements.length > 0 && (
                    <ul className="space-y-1 text-xs text-[#4A4A48] dark:text-zinc-400">
                      {job.requirements.map((req, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#C2410C] dark:text-orange-400 shrink-0 mt-0.5" />
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="pt-4 border-t border-black/10 dark:border-white/10 flex flex-wrap items-center justify-between gap-3">
                  <div className="text-[11px] text-[#4A4A48] dark:text-zinc-400">
                    Déposé par <strong className="text-[#141413] dark:text-white">{job.postedBy}</strong> (Promo{' '}
                    {job.postedByPromo})
                  </div>

                  <button
                    type="button"
                    onClick={() => setApplyModalJob(job)}
                    className="px-5 py-2.5 rounded-lg bg-[#F2B705] hover:bg-[#dfa704] text-[#141413] font-semibold text-xs cursor-pointer transition-colors"
                  >
                    Postuler
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* Modal: Publier une offre */}
      {jobModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-xl bg-white dark:bg-[#1e1e1c] rounded-xl p-6 shadow-2xl border border-black/10 dark:border-white/10 space-y-5 my-8">
            <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-3">
              <h3 className="text-lg font-heading font-bold text-[#141413] dark:text-white">
                Publier une offre sur le portail Carrières
              </h3>
              <button
                type="button"
                onClick={() => setJobModalOpen(false)}
                aria-label="Fermer"
                className="p-1.5 rounded-lg text-[#4A4A48] hover:text-[#141413] dark:hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateJob} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[#141413] dark:text-white mb-1">
                  Intitulé du poste *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex : Ingénieur Data & Cloud Junior"
                  value={newJob.title}
                  onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                  className={inputClass}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#141413] dark:text-white mb-1">
                    Type de contrat *
                  </label>
                  <select
                    value={newJob.type}
                    onChange={(e) => setNewJob({ ...newJob, type: e.target.value as JobOffer['type'] })}
                    className={inputClass}
                  >
                    <option value="STAGE">Stage</option>
                    <option value="ALTERNANCE">Alternance</option>
                    <option value="CDI">CDI</option>
                    <option value="EXECUTIVE">Executive</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-[#141413] dark:text-white mb-1">
                    Entreprise / Institution *
                  </label>
                  <input
                    type="text"
                    required
                    value={newJob.company}
                    onChange={(e) => setNewJob({ ...newJob, company: e.target.value })}
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#141413] dark:text-white mb-1">
                    Localisation *
                  </label>
                  <input
                    type="text"
                    required
                    value={newJob.location}
                    onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#141413] dark:text-white mb-1">
                    Secteur *
                  </label>
                  <input
                    type="text"
                    required
                    value={newJob.sector}
                    onChange={(e) => setNewJob({ ...newJob, sector: e.target.value })}
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#141413] dark:text-white mb-1">
                  Description de la mission *
                </label>
                <textarea
                  rows={3}
                  required
                  value={newJob.description}
                  onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                  placeholder="Contexte, missions principales et impact..."
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block font-semibold text-[#141413] dark:text-white mb-1">
                  Critères recherchés (1 ligne par critère)
                </label>
                <textarea
                  rows={2}
                  value={newJob.requirements}
                  onChange={(e) => setNewJob({ ...newJob, requirements: e.target.value })}
                  placeholder="Ex : Bac+5 École d'Ingénieur ou Commerce&#10;Maîtrise du français et de l'anglais"
                  className={inputClass}
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setJobModalOpen(false)}
                  className="px-4 py-2 text-[#4A4A48] dark:text-zinc-400 hover:text-[#141413] dark:hover:text-white cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-lg bg-[#F2B705] hover:bg-[#dfa704] text-[#141413] font-semibold cursor-pointer"
                >
                  Publier l’offre
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Postuler */}
      {applyModalJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white dark:bg-[#1e1e1c] rounded-xl p-6 shadow-2xl border border-black/10 dark:border-white/10 space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#C2410C] dark:text-orange-400">
                  {getContractLabel(applyModalJob.type)} · {applyModalJob.company}
                </span>
                <h3 className="text-lg font-heading font-bold text-[#141413] dark:text-white mt-0.5">
                  Postuler : {applyModalJob.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setApplyModalJob(null)}
                aria-label="Fermer"
                className="p-1 text-[#4A4A48] hover:text-[#141413] dark:hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleApplySubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[#141413] dark:text-white mb-1">
                  Note de candidature & présentation de votre parcours
                </label>
                <textarea
                  rows={4}
                  required
                  value={coverNote}
                  onChange={(e) => setCoverNote(e.target.value)}
                  placeholder="Précisez votre promotion, vos compétences clés et votre motivation..."
                  className={inputClass}
                />
              </div>

              <div className="p-3 rounded-lg bg-[#FEF8E6] text-[#141413] text-[11px]">
                Votre candidature sera transmise à {applyModalJob.postedBy} et enregistrée dans votre
                suivi Espace Membre.
              </div>

              <div className="flex items-center justify-end gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setApplyModalJob(null)}
                  className="px-4 py-2 text-[#4A4A48] dark:text-zinc-400 cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-lg bg-[#F2B705] hover:bg-[#dfa704] text-[#141413] font-semibold cursor-pointer"
                >
                  Envoyer ma candidature
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
