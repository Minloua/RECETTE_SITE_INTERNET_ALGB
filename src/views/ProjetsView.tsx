import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  HeartHandshake,
  PackageCheck,
  FileCheck2,
  Users,
  CheckCircle2,
} from 'lucide-react';

export const ProjetsView: React.FC = () => {
  const { projects, setContributionModalProject, addToast } = useApp();
  const [selectedProjectId, setSelectedProjectId] = useState<string>(projects[0]?.id || '');
  const [materialModalOpen, setMaterialModalOpen] = useState(false);
  const [materialDonation, setMaterialDonation] = useState({
    donorName: '',
    phone: '',
    itemsDescription: '',
  });

  const selectedProject = projects.find((p) => p.id === selectedProjectId) || projects[0];

  const totalBudget = projects.reduce((acc, p) => acc + p.budgetGoal, 0);
  const totalRaised = projects.reduce((acc, p) => acc + p.budgetRaised, 0);
  const totalContributors = projects.reduce((acc, p) => acc + p.contributorsCount, 0);
  const globalProgress = Math.round((totalRaised / totalBudget) * 100);

  const handleMaterialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addToast(
      'success',
      'Proposition de don matériel enregistrée',
      'La Commission Projets & Patrimoine de l’ALGB vous contactera pour convenir de la logistique de réception.'
    );
    setMaterialModalOpen(false);
    setMaterialDonation({ donorName: '', phone: '', itemsDescription: '' });
  };

  return (
    <div className="bg-white dark:bg-zinc-950 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        {/* Editorial Header */}
        <div className="border-b border-gray-200 dark:border-zinc-800 pb-8 flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
          <div>
            <span className="text-xs uppercase tracking-widest font-bold text-[#B8860B] dark:text-[#E5B824]">
              Patrimoine & Mobilisation
            </span>
            <h1 className="text-2xl sm:text-4xl font-bold font-heading text-black dark:text-white mt-1">
              Projets & Contributions Solidaires
            </h1>
            <p className="text-sm text-gray-600 dark:text-zinc-400 font-editorial italic max-w-2xl mt-1">
              « Mobilisation collective et transparence absolue pour restaurer l'excellence de notre alma mater. »
            </p>
          </div>

          <button
            onClick={() => setMaterialModalOpen(true)}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-gray-100 dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 hover:bg-gray-200 dark:hover:bg-zinc-800 text-black dark:text-white transition-all flex items-center gap-2 cursor-pointer"
          >
            <PackageCheck className="w-4 h-4 text-[#B8860B] dark:text-[#E5B824]" />
            <span>Proposer un don matériel en nature</span>
          </button>
        </div>

        {/* Global Transparency Dashboard Strip */}
        <div className="bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-gray-200 dark:border-zinc-800">
            <div>
              <span className="text-xs uppercase tracking-widest font-semibold text-gray-500 dark:text-zinc-400">
                Tableau de Bord Consolidé
              </span>
              <h2 className="text-xl font-heading font-bold text-black dark:text-white mt-0.5">
                Engagement Financier Global de la Communauté ALGB
              </h2>
            </div>
            <span className="text-xs text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-3 py-1 rounded-lg flex items-center gap-1.5 font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Audité par le Commissariat aux Comptes</span>
            </span>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-4 rounded-xl bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 shadow-xs">
              <span className="text-gray-500 dark:text-zinc-400 text-[10px] uppercase tracking-wider font-semibold block">
                Budget Prévisionnel Cumulé
              </span>
              <div className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-black dark:text-white mt-1">
                {totalBudget.toLocaleString('fr-FR')} F
              </div>
              <span className="text-[11px] text-gray-500 dark:text-zinc-400 mt-0.5 block">{projects.length} projets prioritaires</span>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 shadow-xs">
              <span className="text-gray-500 dark:text-zinc-400 text-[10px] uppercase tracking-wider font-semibold block">
                Montant Mobilisé à ce jour
              </span>
              <div className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-[#B8860B] dark:text-[#E5B824] mt-1">
                {totalRaised.toLocaleString('fr-FR')} F
              </div>
              <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium mt-0.5 block">100% alloué aux chantiers</span>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 shadow-xs">
              <span className="text-gray-500 dark:text-zinc-400 text-[10px] uppercase tracking-wider font-semibold block">
                Montant Restant à Collecter
              </span>
              <div className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-gray-800 dark:text-zinc-200 mt-1">
                {(totalBudget - totalRaised).toLocaleString('fr-FR')} F
              </div>
              <span className="text-[11px] text-gray-500 dark:text-zinc-400 mt-0.5 block">À mobiliser d'ici 2027</span>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 shadow-xs">
              <span className="text-gray-500 dark:text-zinc-400 text-[10px] uppercase tracking-wider font-semibold block">
                Taux Moyen de Réalisation
              </span>
              <div className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-emerald-700 dark:text-emerald-400 mt-1">
                {globalProgress}%
              </div>
              <span className="text-[11px] text-gray-500 dark:text-zinc-400 mt-0.5 block">{totalContributors} donateurs enregistrés</span>
            </div>
          </div>
        </div>

        {/* Projects Selection Tabs */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {projects.map((proj) => {
              const isSelected = selectedProjectId === proj.id;
              return (
                <button
                  key={proj.id}
                  onClick={() => setSelectedProjectId(proj.id)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border shrink-0 cursor-pointer flex items-center gap-2.5 ${
                    isSelected
                      ? 'bg-[#E5B824] text-black border-[#E5B824] shadow-sm'
                      : 'bg-gray-100 dark:bg-zinc-900 text-gray-700 dark:text-zinc-300 border-gray-200 dark:border-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-800 hover:text-black dark:hover:text-white'
                  }`}
                >
                  <span>{proj.title}</span>
                  <span className="font-mono text-[10px] opacity-80">({proj.progressPercentage}%)</span>
                </button>
              );
            })}
          </div>

          {/* Selected Project Full Detailed Sheet */}
          {selectedProject && (
            <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
              {/* Visual Header */}
              <div className="relative h-72 sm:h-80 overflow-hidden bg-gray-900">
                <img
                  src={selectedProject.imageUrl}
                  alt={selectedProject.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent"></div>

                <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
                  <div className="max-w-2xl space-y-2">
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-[#E5B824] text-black uppercase">
                      {selectedProject.category}
                    </span>
                    <h2 className="text-xl sm:text-2xl font-bold font-heading text-white">
                      {selectedProject.title}
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-200 line-clamp-2">
                      {selectedProject.summary}
                    </p>
                  </div>

                  <button
                    onClick={() => setContributionModalProject(selectedProject)}
                    className="px-6 py-3 rounded-xl font-bold text-xs text-black bg-[#E5B824] hover:bg-[#dcae1f] transition-all shadow-lg flex items-center gap-2 shrink-0 cursor-pointer"
                  >
                    <HeartHandshake className="w-4 h-4" />
                    <span>Faire un don financier</span>
                  </button>
                </div>
              </div>

              {/* Financial Status Gauge */}
              <div className="bg-gray-50 dark:bg-zinc-950 border-y border-gray-200 dark:border-zinc-800 p-6 sm:p-8 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
                  <div>
                    <span className="text-gray-500 dark:text-zinc-400 font-semibold block text-[10px] uppercase">Budget requis</span>
                    <span className="font-mono tabular-nums text-base font-bold text-black dark:text-white">
                      {selectedProject.budgetGoal.toLocaleString('fr-FR')} FCFA
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-zinc-400 font-semibold block text-[10px] uppercase">Mobilisé</span>
                    <span className="font-mono tabular-nums text-base font-bold text-[#B8860B] dark:text-[#E5B824]">
                      {selectedProject.budgetRaised.toLocaleString('fr-FR')} FCFA
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-zinc-400 font-semibold block text-[10px] uppercase">Reste à mobiliser</span>
                    <span className="font-mono tabular-nums text-base font-bold text-gray-700 dark:text-zinc-300">
                      {(selectedProject.budgetGoal - selectedProject.budgetRaised).toLocaleString('fr-FR')} FCFA
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-zinc-400 font-semibold block text-[10px] uppercase">Contributeurs</span>
                    <span className="font-mono tabular-nums text-base font-bold text-emerald-700 dark:text-emerald-400">
                      {selectedProject.contributorsCount} donateurs
                    </span>
                  </div>
                </div>

                <div className="w-full h-3 bg-gray-200 dark:bg-zinc-800 rounded-full overflow-hidden border border-gray-300 dark:border-zinc-700">
                  <div
                    className="h-full bg-[#E5B824] rounded-full transition-all duration-700"
                    style={{ width: `${selectedProject.progressPercentage}%` }}
                  ></div>
                </div>
              </div>

              {/* Project Details Grid */}
              <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6 text-xs sm:text-sm text-gray-700 dark:text-zinc-300">
                  <div className="space-y-2">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-[#B8860B] dark:text-[#E5B824] font-heading">
                      Contexte & Justification
                    </h3>
                    <p className="leading-relaxed text-gray-700 dark:text-zinc-300">{selectedProject.context}</p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-[#B8860B] dark:text-[#E5B824] font-heading">
                      Objectifs Opérationnels
                    </h3>
                    <ul className="space-y-2 list-disc list-inside text-gray-700 dark:text-zinc-300">
                      {selectedProject.objectives.map((obj, i) => (
                        <li key={i}>{obj}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-[#B8860B] dark:text-[#E5B824] font-heading">
                      Bénéficiaires Directs
                    </h3>
                    <p className="text-gray-700 dark:text-zinc-300">{selectedProject.beneficiaries}</p>
                  </div>

                  {/* Execution Reports */}
                  <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-zinc-800">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-[#B8860B] dark:text-[#E5B824] font-heading flex items-center gap-2">
                      <FileCheck2 className="w-4 h-4" />
                      <span>Rapports d’Exécution & Jalons Validés</span>
                    </h3>
                    <div className="space-y-3">
                      {selectedProject.executionReports.map((report, idx) => (
                        <div key={idx} className="p-3.5 bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl space-y-1">
                          <div className="flex items-center justify-between text-xs font-semibold text-black dark:text-white">
                            <span>{report.title}</span>
                            <span className="text-[10px] text-gray-500 dark:text-zinc-400 font-mono">{report.date}</span>
                          </div>
                          <p className="text-xs text-gray-600 dark:text-zinc-400">{report.summary}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 1 Col: Material Needs & Recent Donors */}
                <div className="space-y-6">
                  <div className="bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl p-5 space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-black dark:text-white font-heading flex items-center gap-2">
                      <PackageCheck className="w-4 h-4 text-[#B8860B] dark:text-[#E5B824]" />
                      <span>Besoins Matériels en Nature</span>
                    </h4>
                    <ul className="text-xs text-gray-700 dark:text-zinc-300 space-y-1.5 list-disc list-inside">
                      {selectedProject.materialNeeds.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                    <button
                      onClick={() => setMaterialModalOpen(true)}
                      className="w-full mt-2 py-2 px-3 bg-white dark:bg-zinc-900 hover:bg-gray-100 dark:hover:bg-zinc-800 text-black dark:text-white font-semibold border border-gray-300 dark:border-zinc-700 rounded-lg text-xs transition-colors cursor-pointer"
                    >
                      Faire un don en matériel
                    </button>
                  </div>

                  <div className="bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl p-5 space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-black dark:text-white font-heading flex items-center gap-2">
                      <Users className="w-4 h-4 text-[#B8860B] dark:text-[#E5B824]" />
                      <span>Dernières Contributions Enregistrées</span>
                    </h4>

                    <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                      {selectedProject.contributions.map((cnt) => (
                        <div
                          key={cnt.id}
                          className="p-2.5 rounded-lg bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 text-xs space-y-0.5"
                        >
                          <div className="flex items-center justify-between font-semibold text-black dark:text-white">
                            <span className="truncate max-w-[140px]">{cnt.contributorName}</span>
                            <span className="text-emerald-700 dark:text-emerald-400 font-mono text-[11px]">
                              +{cnt.amount.toLocaleString('fr-FR')} F
                            </span>
                          </div>
                          <div className="text-[10px] text-gray-500 dark:text-zinc-400 flex items-center justify-between">
                            <span>{cnt.promotionYear ? `Promo ${cnt.promotionYear}` : 'Alumni'}</span>
                            <span>{cnt.date}</span>
                          </div>
                          {cnt.message && (
                            <div className="text-[11px] text-gray-600 dark:text-zinc-400 italic pt-1 border-t border-gray-200 dark:border-zinc-800 font-editorial">
                              « {cnt.message} »
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal: Don Matériel */}
        {materialModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/75 backdrop-blur-sm">
            <div className="relative w-full max-w-lg bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-6 shadow-2xl space-y-4">
              <h3 className="text-base font-bold font-heading text-black dark:text-white">
                Proposer un don matériel ou une prestation bénévole
              </h3>
              <p className="text-xs text-gray-600 dark:text-zinc-400">
                Livres, équipements informatiques, mobilier, médicaments, mécénat technique...
              </p>

              <form onSubmit={handleMaterialSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-gray-800 dark:text-zinc-200 font-semibold mb-1">Votre Nom & Promotion</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Jean Bamba (Promo 1988)"
                    value={materialDonation.donorName}
                    onChange={(e) => setMaterialDonation({ ...materialDonation, donorName: e.target.value })}
                    className="w-full bg-gray-50 dark:bg-zinc-950 border border-gray-300 dark:border-zinc-700 focus:border-[#E5B824] rounded-lg p-2.5 text-black dark:text-white placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-800 dark:text-zinc-200 font-semibold mb-1">Téléphone de contact (WhatsApp / Mobile)</label>
                  <input
                    type="tel"
                    required
                    placeholder="+225 07 XX XX XX XX"
                    value={materialDonation.phone}
                    onChange={(e) => setMaterialDonation({ ...materialDonation, phone: e.target.value })}
                    className="w-full bg-gray-50 dark:bg-zinc-950 border border-gray-300 dark:border-zinc-700 focus:border-[#E5B824] rounded-lg p-2.5 text-black dark:text-white placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-800 dark:text-zinc-200 font-semibold mb-1">Description des matériels proposés</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Ex: Lot de 10 ordinateurs portables reconditionnés ou 50 manuels de physique de Terminale C..."
                    value={materialDonation.itemsDescription}
                    onChange={(e) => setMaterialDonation({ ...materialDonation, itemsDescription: e.target.value })}
                    className="w-full bg-gray-50 dark:bg-zinc-950 border border-gray-300 dark:border-zinc-700 focus:border-[#E5B824] rounded-lg p-2.5 text-black dark:text-white placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setMaterialModalOpen(false)}
                    className="px-3 py-1.5 text-gray-600 dark:text-zinc-400 hover:text-black dark:hover:text-white cursor-pointer"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#E5B824] text-black font-semibold rounded-lg hover:bg-[#dcae1f] cursor-pointer"
                  >
                    Transmettre la proposition
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
