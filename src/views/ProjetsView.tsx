import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { Project, INITIAL_MAJOR_DONORS } from '../data/mockData';
import {
  HeartHandshake,
  Award,
  CheckCircle2,
  PackageCheck,
  X,
  Eye,
  Calendar,
  GraduationCap,
  Clock,
} from 'lucide-react';

export const ProjetsView: React.FC = () => {
  const {
    projects,
    submitPatronageDonation,
    setContributionModalProject,
    addToast,
    currentUser,
  } = useApp();

  const [selectedPresetFcfa, setSelectedPresetFcfa] = useState<25000 | 50000 | 100000 | 'LIBRE'>(50000);
  const [customFcfa, setCustomFcfa] = useState<string>('75000');
  const [frequency, setFrequency] = useState<'PONCTUEL' | 'MENSUEL'>('PONCTUEL');
  const [selectedProjectId, setSelectedProjectId] = useState<string>(projects[0]?.id || '');
  const [donorName, setDonorName] = useState<string>(
    currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : ''
  );
  const [isAnonymous, setIsAnonymous] = useState(false);

  useEffect(() => {
    if (currentUser && !donorName) {
      setDonorName(`${currentUser.firstName} ${currentUser.lastName}`);
    }
  }, [currentUser, donorName]);

  useEffect(() => {
    if (!selectedProjectId && projects[0]?.id) {
      setSelectedProjectId(projects[0].id);
    }
  }, [projects, selectedProjectId]);

  const [materialModalOpen, setMaterialModalOpen] = useState(false);
  const [detailProject, setDetailProject] = useState<Project | null>(null);
  const [materialDonation, setMaterialDonation] = useState({
    donorName: '',
    phone: '',
    itemsDescription: '',
  });

  const activeFcfa =
    selectedPresetFcfa === 'LIBRE' ? Math.max(1000, Number(customFcfa) || 0) : selectedPresetFcfa;

  const totalGoal = projects.reduce((sum, p) => sum + p.budgetGoal, 0);
  const totalRaised = projects.reduce((sum, p) => sum + p.budgetRaised, 0);
  const totalDonors = projects.reduce((sum, p) => sum + p.contributorsCount, 0);
  const globalPct = totalGoal > 0 ? Math.min(100, Math.round((totalRaised / totalGoal) * 100)) : 70;

  const selectedProject = projects.find((p) => p.id === selectedProjectId) || projects[0];

  const handleValidateDonation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject || activeFcfa <= 0) return;
    submitPatronageDonation({
      amountFcfa: activeFcfa,
      frequency,
      projectId: selectedProject.id,
      donorName,
      isAnonymous,
    });
  };

  const handleMaterialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addToast(
      'success',
      'Don matériel enregistré',
      'La Commission Projets de l’ALGB vous contactera très prochainement.'
    );
    setMaterialModalOpen(false);
    setMaterialDonation({ donorName: '', phone: '', itemsDescription: '' });
  };

  return (
    <div className="bg-[#F8F8F6] dark:bg-[#141413] min-h-screen transition-colors">
      {/* En-tête prestigieux en Vert Émeraude Sombre (#134E4A) */}
      <section className="bg-[#134E4A] text-white py-14 sm:py-20 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Impact narration */}
            <div className="lg:col-span-6 space-y-6 pt-2">
              <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] font-semibold text-[#F2B705]">
                <Award className="w-4 h-4" />
                <span>Mécénat, Bourses & Projets Étudiants</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-heading font-bold text-white leading-[1.12]">
                Soutenir la réussite et le rayonnement de notre alma mater.
              </h1>

              <p className="text-sm sm:text-base text-emerald-100 leading-relaxed max-w-xl">
                Chaque contribution soutient concrètement nos bourses d’études annuelles, la
                rénovation de la grande bibliothèque scientifique et l’équipement médical du campus
                de Bingerville.
              </p>

              <div className="grid grid-cols-3 gap-5 pt-2">
                <div>
                  <div className="text-2xl sm:text-3xl font-heading font-bold text-[#F2B705] tabular-nums">
                    {(totalRaised / 1000000).toFixed(1)} M
                  </div>
                  <div className="text-[11px] text-emerald-100 mt-0.5">FCFA collectés</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-heading font-bold text-white tabular-nums">
                    {totalDonors}
                  </div>
                  <div className="text-[11px] text-emerald-100 mt-0.5">Mécènes engagés</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-heading font-bold text-white tabular-nums">
                    {globalPct}%
                  </div>
                  <div className="text-[11px] text-emerald-100 mt-0.5">Objectif atteint</div>
                </div>
              </div>
            </div>

            {/* Module de don interactif sur carte blanche (#FFFFFF) */}
            <div className="lg:col-span-6">
              <form
                onSubmit={handleValidateDonation}
                className="bg-[#FFFFFF] text-[#141413] rounded-xl p-6 sm:p-8 shadow-2xl space-y-6"
              >
                <div className="flex items-center justify-between gap-2 pb-4 border-b border-black/10">
                  <div>
                    <span className="text-[11px] uppercase tracking-wider font-semibold text-[#134E4A]">
                      Contribution Directe & Sécurisée
                    </span>
                    <h2 className="text-xl font-heading font-bold text-[#141413]">
                      Effectuer un don à l’ALGB
                    </h2>
                  </div>

                  {/* Fréquence : Ponctuel ou Mensuel */}
                  <div className="inline-flex rounded-lg bg-[#F8F8F6] p-1 border border-black/10 text-xs">
                    {(['PONCTUEL', 'MENSUEL'] as const).map((freq) => (
                      <button
                        key={freq}
                        type="button"
                        onClick={() => setFrequency(freq)}
                        className={`px-3 py-1.5 rounded-md font-semibold cursor-pointer transition-colors ${
                          frequency === freq
                            ? 'bg-[#134E4A] text-white'
                            : 'text-[#4A4A48] hover:text-[#141413]'
                        }`}
                      >
                        {freq === 'PONCTUEL' ? 'Ponctuel' : 'Mensuel'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Choix du montant en FCFA : 25 000, 50 000, 100 000, Libre */}
                <div className="space-y-2.5">
                  <label className="block text-xs font-semibold text-[#141413]">
                    Choisissez votre montant (FCFA)
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {([25000, 50000, 100000, 'LIBRE'] as const).map((amt) => {
                      const active = selectedPresetFcfa === amt;
                      return (
                        <button
                          key={String(amt)}
                          type="button"
                          onClick={() => setSelectedPresetFcfa(amt)}
                          className={`py-3 px-2 rounded-lg text-xs font-semibold border transition-colors cursor-pointer whitespace-nowrap tabular-nums ${
                            active
                              ? 'bg-[#134E4A] text-white border-[#134E4A]'
                              : 'bg-[#F8F8F6] text-[#141413] border-black/15 hover:border-[#134E4A]'
                          }`}
                        >
                          {amt === 'LIBRE' ? 'Libre' : `${amt.toLocaleString('fr-FR')} FCFA`}
                        </button>
                      );
                    })}
                  </div>

                  {selectedPresetFcfa === 'LIBRE' && (
                    <div className="pt-1">
                      <input
                        type="number"
                        min={1000}
                        step={500}
                        required
                        value={customFcfa}
                        onChange={(e) => setCustomFcfa(e.target.value)}
                        placeholder="Montant personnalisé en FCFA"
                        className="w-full px-3.5 py-2.5 rounded-lg bg-[#F8F8F6] border border-black/15 focus:border-[#134E4A] text-xs text-[#141413] focus:outline-none font-mono"
                      />
                    </div>
                  )}

                  <div className="text-[11px] text-[#4A4A48] flex items-center justify-between">
                    <span>Devise officielle (Zone UEMOA) :</span>
                    <strong className="text-[#141413] tabular-nums">
                      {activeFcfa.toLocaleString('fr-FR')} FCFA
                    </strong>
                  </div>
                </div>

                {/* Affectation & Donateur */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block font-semibold text-[#141413] mb-1">
                      Projet soutenu
                    </label>
                    <select
                      value={selectedProjectId}
                      onChange={(e) => setSelectedProjectId(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-lg bg-[#F8F8F6] border border-black/15 text-[#141413] focus:outline-none focus:border-[#134E4A]"
                    >
                      {projects.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-[#141413] mb-1">
                      Nom du mécène
                    </label>
                    <input
                      type="text"
                      disabled={isAnonymous}
                      value={donorName}
                      onChange={(e) => setDonorName(e.target.value)}
                      placeholder="Nom & Promotion"
                      className="w-full px-3 py-2.5 rounded-lg bg-[#F8F8F6] border border-black/15 text-[#141413] focus:outline-none focus:border-[#134E4A] disabled:opacity-50"
                    />
                  </div>
                </div>

                <label className="flex items-center gap-2 text-xs text-[#4A4A48] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="rounded border-black/20 text-[#134E4A]"
                  />
                  <span>Souhaiter conserver l’anonymat sur le mur public</span>
                </label>

                {/* Jauge de collecte en Jaune Solaire (#F2B705) */}
                {selectedProject && (
                  <div className="p-4 rounded-lg bg-[#F8F8F6] space-y-2 border border-black/5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-[#4A4A48] truncate pr-2">
                        {selectedProject.title}
                      </span>
                      <span className="font-heading font-bold text-[#141413] tabular-nums">
                        {selectedProject.progressPercentage}%
                      </span>
                    </div>
                    <div className="w-full h-2.5 bg-black/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#F2B705] rounded-full transition-all duration-700"
                        style={{ width: `${selectedProject.progressPercentage}%` }}
                      />
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3.5 px-6 rounded-lg bg-[#F2B705] hover:bg-[#dfa704] text-[#141413] font-semibold text-sm inline-flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <HeartHandshake className="w-4 h-4 text-[#141413]" />
                  <span>
                    Valider mon don de {activeFcfa.toLocaleString('fr-FR')} FCFA (
                    {frequency === 'MENSUEL' ? 'par mois' : 'ponctuel'})
                  </span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-16">
        {/* Mur de reconnaissance des grands donateurs avec portraits noir et blanc contrastés */}
        <section className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-black/10 dark:border-white/10 pb-4">
            <div>
              <span className="text-xs uppercase tracking-[0.16em] font-semibold text-[#134E4A] dark:text-[#F2B705]">
                Cercle d’Honneur
              </span>
              <h2 className="text-2xl sm:text-3xl font-heading font-bold text-[#141413] dark:text-white mt-1">
                Mur de Reconnaissance des Grands Donateurs
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setMaterialModalOpen(true)}
              className="px-4 py-2.5 rounded-lg bg-white dark:bg-[#1e1e1c] border border-black/15 dark:border-white/15 text-xs font-semibold text-[#141413] dark:text-white inline-flex items-center gap-2 cursor-pointer hover:border-[#134E4A]"
            >
              <PackageCheck className="w-4 h-4 text-[#134E4A] dark:text-[#F2B705]" />
              <span>Proposer un don matériel</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {INITIAL_MAJOR_DONORS.map((donor) => (
              <article
                key={donor.id}
                className="bg-white dark:bg-[#1e1e1c] rounded-xl overflow-hidden shadow-editorial border border-black/5 dark:border-white/10 flex flex-col"
              >
                <div className="h-60 overflow-hidden bg-[#141413]">
                  <img
                    src={donor.portraitUrl}
                    alt={donor.name}
                    className="w-full h-full object-cover grayscale contrast-125"
                  />
                </div>
                <div className="p-5 space-y-1.5 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-[#134E4A] dark:text-[#F2B705]">
                      {donor.circle}
                    </span>
                    <h3 className="text-lg font-heading font-bold text-[#141413] dark:text-white mt-0.5">
                      {donor.name}
                    </h3>
                    <p className="text-xs text-[#4A4A48] dark:text-zinc-300 mt-0.5">{donor.title}</p>
                  </div>
                  <div className="pt-3 mt-3 border-t border-black/10 dark:border-white/10 flex items-center justify-between text-[11px] text-[#4A4A48] dark:text-zinc-400">
                    <span>Promo {donor.promotionYear}</span>
                    <span className="font-semibold text-[#141413] dark:text-white">
                      {donor.contributionLabel}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Chantiers détaillés & Suivi d'exécution */}
        <section className="space-y-8">
          <div className="border-b border-black/10 dark:border-white/10 pb-4">
            <span className="text-xs uppercase tracking-[0.16em] font-semibold text-[#134E4A] dark:text-[#F2B705]">
              Transparence & Exécution
            </span>
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-[#141413] dark:text-white mt-1">
              Programmes & Bourses Financés
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {projects.map((proj) => (
              <article
                key={proj.id}
                className="bg-white dark:bg-[#1e1e1c] rounded-xl overflow-hidden shadow-editorial border border-black/5 dark:border-white/10 flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-48 overflow-hidden">
                    <img src={proj.imageUrl} alt={proj.title} className="w-full h-full object-cover" />
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded bg-[#134E4A] text-white text-[10px] font-semibold uppercase">
                      {proj.category}
                    </span>
                  </div>

                  <div className="p-6 space-y-4">
                    <h3 className="text-lg font-heading font-bold text-[#141413] dark:text-white leading-snug">
                      {proj.title}
                    </h3>
                    <p className="text-xs text-[#4A4A48] dark:text-zinc-300 leading-relaxed">
                      {proj.summary}
                    </p>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span className="text-[#141413] dark:text-white tabular-nums">
                          {proj.budgetRaised.toLocaleString('fr-FR')} FCFA
                        </span>
                        <span className="text-[#134E4A] dark:text-[#F2B705] tabular-nums">
                          {proj.progressPercentage}%
                        </span>
                      </div>
                      <div className="w-full h-2.5 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#F2B705] rounded-full"
                          style={{ width: `${proj.progressPercentage}%` }}
                        />
                      </div>
                      <div className="text-[11px] text-[#4A4A48] dark:text-zinc-400 flex items-center justify-between">
                        <span>Objectif : {proj.budgetGoal.toLocaleString('fr-FR')} FCFA</span>
                        <span>{proj.contributorsCount} donateurs</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="px-6 py-4 border-t border-black/10 dark:border-white/10 flex flex-wrap items-center justify-between gap-2">
                  <span className="text-[11px] text-[#4A4A48] dark:text-zinc-400 inline-flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#134E4A] dark:text-[#F2B705]" />
                    <span>Échéance {proj.deadline}</span>
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setDetailProject(proj)}
                      className="px-3 py-2 rounded-lg border border-black/15 dark:border-white/15 hover:border-[#134E4A] text-[#141413] dark:text-zinc-200 text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#134E4A] dark:text-[#F2B705]" />
                      <span>Jalons & impact</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setContributionModalProject(proj)}
                      className="px-4 py-2 rounded-lg bg-[#F2B705] hover:bg-[#dfa704] text-[#141413] text-xs font-semibold cursor-pointer"
                    >
                      Contribuer
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>

      {/* Modal Don Matériel */}
      {materialModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white dark:bg-[#1e1e1c] rounded-xl p-6 shadow-2xl border border-black/10 dark:border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-heading font-bold text-[#141413] dark:text-white">
                Proposer un don matériel
              </h3>
              <button
                type="button"
                onClick={() => setMaterialModalOpen(false)}
                className="p-1 text-[#4A4A48] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleMaterialSubmit} className="space-y-3 text-xs">
              <input
                type="text"
                required
                placeholder="Votre nom et promotion *"
                value={materialDonation.donorName}
                onChange={(e) => setMaterialDonation({ ...materialDonation, donorName: e.target.value })}
                className="w-full bg-[#F8F8F6] dark:bg-[#141413] border border-black/15 dark:border-white/15 rounded-lg p-2.5 text-[#141413] dark:text-white"
              />
              <input
                type="tel"
                required
                placeholder="Téléphone / WhatsApp *"
                value={materialDonation.phone}
                onChange={(e) => setMaterialDonation({ ...materialDonation, phone: e.target.value })}
                className="w-full bg-[#F8F8F6] dark:bg-[#141413] border border-black/15 dark:border-white/15 rounded-lg p-2.5 text-[#141413] dark:text-white"
              />
              <textarea
                rows={4}
                required
                placeholder="Ouvrages, postes informatiques, équipements de laboratoire..."
                value={materialDonation.itemsDescription}
                onChange={(e) =>
                  setMaterialDonation({ ...materialDonation, itemsDescription: e.target.value })
                }
                className="w-full bg-[#F8F8F6] dark:bg-[#141413] border border-black/15 dark:border-white/15 rounded-lg p-2.5 text-[#141413] dark:text-white"
              />
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setMaterialModalOpen(false)}
                  className="px-4 py-2 text-[#4A4A48] cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-lg bg-[#F2B705] text-[#141413] font-semibold cursor-pointer"
                >
                  Transmettre la proposition
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Jalons, Avant/Après & Impact Boursiers */}
      {detailProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-2xl bg-white dark:bg-[#1e1e1c] rounded-xl shadow-2xl border border-black/10 dark:border-white/10 overflow-hidden my-6">
            <div className="bg-[#134E4A] text-white px-6 py-4 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <span className="text-[10px] uppercase tracking-wider font-semibold text-[#F2B705]">
                  Suivi d’exécution & Transparence · {detailProject.category}
                </span>
                <h3 className="text-lg font-heading font-bold text-white truncate">
                  {detailProject.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setDetailProject(null)}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white cursor-pointer shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-6 text-xs max-h-[75vh] overflow-y-auto">
              <p className="text-sm text-[#4A4A48] dark:text-zinc-300 leading-relaxed">
                {detailProject.context}
              </p>

              {/* Boursiers & Progression */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-[#F8F8F6] dark:bg-[#141413] border border-black/5 dark:border-white/10">
                  <span className="text-[10px] uppercase text-[#4A4A48] dark:text-zinc-400 font-semibold">
                    Mobilisé
                  </span>
                  <div className="text-base font-heading font-bold text-[#141413] dark:text-white mt-0.5 tabular-nums">
                    {detailProject.budgetRaised.toLocaleString('fr-FR')} FCFA
                  </div>
                </div>
                <div className="p-3.5 rounded-xl bg-[#F8F8F6] dark:bg-[#141413] border border-black/5 dark:border-white/10">
                  <span className="text-[10px] uppercase text-[#4A4A48] dark:text-zinc-400 font-semibold">
                    Objectif
                  </span>
                  <div className="text-base font-heading font-bold text-[#134E4A] dark:text-[#F2B705] mt-0.5 tabular-nums">
                    {detailProject.budgetGoal.toLocaleString('fr-FR')} FCFA
                  </div>
                </div>
                <div className="p-3.5 rounded-xl bg-[#F8F8F6] dark:bg-[#141413] border border-black/5 dark:border-white/10">
                  <span className="text-[10px] uppercase text-[#4A4A48] dark:text-zinc-400 font-semibold flex items-center gap-1">
                    <GraduationCap className="w-3.5 h-3.5 text-[#134E4A] dark:text-[#F2B705]" />
                    <span>Impact campus</span>
                  </span>
                  <div className="text-base font-heading font-bold text-[#141413] dark:text-white mt-0.5">
                    {detailProject.scholarsSupported
                      ? `${detailProject.scholarsSupported.count} boursiers · ${detailProject.scholarsSupported.cohortLabel}`
                      : `${detailProject.contributorsCount} mécènes`}
                  </div>
                  {detailProject.scholarsSupported && (
                    <p className="text-[10px] text-[#4A4A48] dark:text-zinc-400 mt-0.5">
                      {detailProject.scholarsSupported.details}
                    </p>
                  )}
                </div>
              </div>

              {/* Avant / Après */}
              {detailProject.beforeAfter && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-4 rounded-xl bg-[#FFF7ED] dark:bg-[#1a1310] border border-[#C2410C]/25 space-y-1">
                    <span className="text-[10px] uppercase tracking-wider font-bold text-[#C2410C] dark:text-orange-400">
                      Situation initiale (Avant)
                    </span>
                    <p className="text-[#141413] dark:text-zinc-200 leading-relaxed">
                      {detailProject.beforeAfter.beforeSummary}
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-[#F0FDF9] dark:bg-[#0f2422] border border-[#134E4A]/30 space-y-1">
                    <span className="text-[10px] uppercase tracking-wider font-bold text-[#134E4A] dark:text-emerald-400">
                      Objectif d’impact (Après)
                    </span>
                    <p className="text-[#141413] dark:text-zinc-200 leading-relaxed">
                      {detailProject.beforeAfter.afterSummary}
                    </p>
                  </div>
                </div>
              )}

              {/* Jalons */}
              {detailProject.milestones && detailProject.milestones.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-sm font-heading font-bold text-[#141413] dark:text-white">
                    Jalons d’avancement du chantier
                  </h4>
                  <div className="space-y-2.5">
                    {detailProject.milestones.map((m, idx) => (
                      <div
                        key={`${m.label}-${idx}`}
                        className="p-3.5 rounded-xl bg-[#F8F8F6] dark:bg-[#141413] border border-black/10 dark:border-white/10 flex items-start justify-between gap-3"
                      >
                        <div className="font-semibold text-[#141413] dark:text-white flex items-center gap-2">
                          {m.status === 'DONE' ? (
                            <CheckCircle2 className="w-4 h-4 text-[#134E4A] dark:text-emerald-400 shrink-0" />
                          ) : (
                            <Clock className="w-4 h-4 text-[#F2B705] shrink-0" />
                          )}
                          <span>{m.label}</span>
                        </div>
                        <div className="text-right shrink-0 space-y-1">
                          <span className="inline-flex items-center gap-1 text-[10px] font-mono text-[#4A4A48] dark:text-zinc-400">
                            <Calendar className="w-3 h-3" />
                            <span>{m.date}</span>
                          </span>
                          <div>
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                m.status === 'DONE'
                                  ? 'bg-[#F0FDF9] text-[#134E4A]'
                                  : m.status === 'IN_PROGRESS'
                                  ? 'bg-[#FEF8E6] text-[#141413]'
                                  : 'bg-zinc-200 dark:bg-white/10 text-[#4A4A48] dark:text-zinc-300'
                              }`}
                            >
                              {m.status === 'DONE'
                                ? 'Réalisé'
                                : m.status === 'IN_PROGRESS'
                                ? 'En cours'
                                : 'À venir'}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Rapports d'exécution */}
              {detailProject.executionReports.length > 0 && (
                <div className="space-y-2.5">
                  <h4 className="text-sm font-heading font-bold text-[#141413] dark:text-white">
                    Justificatifs d’exécution certifiés
                  </h4>
                  <div className="space-y-2">
                    {detailProject.executionReports.map((rep, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-lg bg-[#F8F8F6] dark:bg-[#141413] border border-black/5 dark:border-white/10 flex items-center justify-between gap-3"
                      >
                        <div>
                          <div className="font-semibold text-[#141413] dark:text-white">
                            {rep.title}
                          </div>
                          <div className="text-[11px] text-[#4A4A48] dark:text-zinc-400">
                            {rep.summary}
                          </div>
                        </div>
                        <span className="font-mono text-[11px] font-semibold text-[#134E4A] dark:text-[#F2B705] shrink-0">
                          {rep.date}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-2 flex justify-end gap-2 border-t border-black/10 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setDetailProject(null)}
                  className="px-4 py-2 rounded-lg border border-black/15 dark:border-white/15 text-[#4A4A48] dark:text-zinc-300 font-semibold cursor-pointer"
                >
                  Fermer
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const target = detailProject;
                    setDetailProject(null);
                    setContributionModalProject(target);
                  }}
                  className="px-5 py-2 rounded-lg bg-[#F2B705] hover:bg-[#dfa704] text-[#141413] font-bold cursor-pointer"
                >
                  Soutenir ce chantier
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
