import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  User,
  CreditCard,
  GraduationCap,
  Lock,
  Eye,
  CheckCircle2,
  AlertCircle,
  Clock,
  FileText,
  Award,
  PlusCircle,
  Receipt,
  QrCode,
  UserCheck,
  MessageSquareText,
} from 'lucide-react';
import { MONTHS_2026 } from '../data/mockData';

export const EspaceMembreView: React.FC = () => {
  const {
    currentUser,
    currentRole,
    activeCredential,
    openAuthModal,
    canAccessTab,
    setViewingCardMember,
    updateMemberProfile,
    setActiveTab,
    setSelectedPromotionYear,
    openPaymentModal,
    setViewingTransactionReceipt,
    setViewingQuitusMember,
    getMemberFinancialSummary,
    openQrSyncModal,
    canEnrichAi,
    enrichAiFromCurrentProfile,
    setAiChatOpen,
    settings,
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'FINANCES' | 'PROFIL' | 'PROMOTION'>('FINANCES');
  const [editMode, setEditMode] = useState(false);
  const [aiProfileNote, setAiProfileNote] = useState('');
  const [profileForm, setProfileForm] = useState({
    profession: currentUser?.profession || '',
    currentRole: currentUser?.currentRole || '',
    company: currentUser?.company || '',
    city: currentUser?.city || '',
    phone: currentUser?.phone || '',
    showEmail: currentUser?.privacy.showEmail ?? true,
    showPhone: currentUser?.privacy.showPhone ?? false,
    allowMentorshipRequests: currentUser?.privacy.allowMentorshipRequests ?? true,
    isMentor: currentUser?.isMentor ?? false,
  });

  if (currentRole === 'VISITEUR' || !activeCredential) {
    return (
      <div className="bg-white dark:bg-zinc-950 min-h-screen transition-colors">
        <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 flex items-center justify-center text-[#B8860B] dark:text-[#E5B824] mx-auto">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold font-heading text-black dark:text-white">
            Connexion à l’Espace Membre
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-zinc-400">
            Connectez-vous avec votre identifiant et votre code d’accès (credential) délivrés par l’Administration ALGB, ou déposez votre demande d’adhésion.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => openAuthModal('espace-membre')}
              className="px-6 py-2.5 bg-[#E5B824] text-black font-bold text-xs rounded-xl hover:bg-[#dcae1f] cursor-pointer"
            >
              Se connecter avec mes accès
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('adhesion')}
              className="px-6 py-2.5 bg-gray-100 dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 text-gray-800 dark:text-zinc-200 font-semibold text-xs rounded-xl hover:bg-gray-200 dark:hover:bg-zinc-800 cursor-pointer"
            >
              Formulaire d’Adhésion ALGB
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="bg-white dark:bg-zinc-950 min-h-screen transition-colors">
        <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-5">
          <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 flex items-center justify-center text-[#B8860B] dark:text-[#E5B824] mx-auto">
            <UserCheck className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold font-heading text-black dark:text-white">
            Compte fonctionnel : {activeCredential.displayName}
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-zinc-400">
            Ce credential ({activeCredential.identifier}) est un compte de gestion sans fiche individuelle rattachée dans l’annuaire des anciens élèves.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {canAccessTab('admin') && (
              <button
                type="button"
                onClick={() => setActiveTab('admin')}
                className="px-6 py-2.5 bg-[#E5B824] text-black font-bold text-xs rounded-xl hover:bg-[#dcae1f] cursor-pointer"
              >
                Ouvrir la Console d’Administration
              </button>
            )}
            <button
              type="button"
              onClick={() => setActiveTab('anciens')}
              className="px-6 py-2.5 bg-gray-100 dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 text-gray-800 dark:text-zinc-200 font-semibold text-xs rounded-xl hover:bg-gray-200 dark:hover:bg-zinc-800 cursor-pointer"
            >
              Consulter les Promotions
            </button>
          </div>
        </div>
      </div>
    );
  }

  const financialSummary = getMemberFinancialSummary(currentUser.id);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateMemberProfile(currentUser.id, {
      profession: profileForm.profession,
      currentRole: profileForm.currentRole,
      company: profileForm.company,
      city: profileForm.city,
      phone: profileForm.phone,
      isMentor: profileForm.isMentor,
      privacy: {
        showEmail: profileForm.showEmail,
        showPhone: profileForm.showPhone,
        allowMentorshipRequests: profileForm.allowMentorshipRequests,
      },
    });
    setEditMode(false);
  };

  return (
    <div className="bg-white dark:bg-zinc-950 min-h-screen transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        {/* Editorial Header */}
        <div className="border-b border-gray-200 dark:border-zinc-800 pb-8 flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-zinc-900 border-2 border-[#E5B824] flex items-center justify-center text-xl font-heading font-bold text-[#B8860B] dark:text-[#E5B824] shrink-0 overflow-hidden">
              {currentUser.avatarUrl ? (
                <img src={currentUser.avatarUrl} alt={currentUser.firstName} className="w-full h-full object-cover" />
              ) : (
                <>
                  {currentUser.firstName[0]}
                  {currentUser.lastName[0]}
                </>
              )}
            </div>
            <div>
              <span className="text-xs uppercase tracking-widest font-bold text-[#B8860B] dark:text-[#E5B824]">
                Tableau de Bord Adhérent
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold font-heading text-black dark:text-white mt-0.5">
                {currentUser.firstName} {currentUser.lastName}
              </h1>
              <p className="text-xs text-gray-600 dark:text-zinc-400 font-mono mt-0.5">
                Matricule : {currentUser.membershipCardId} · Promotion {currentUser.promotionYear} ({currentUser.bacSeries})
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setViewingCardMember(currentUser)}
              className="px-4 py-2 bg-gray-100 dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 hover:bg-gray-200 dark:hover:bg-zinc-800 text-black dark:text-white font-semibold text-xs rounded-xl flex items-center gap-2 cursor-pointer transition-all"
            >
              <Eye className="w-4 h-4 text-[#B8860B] dark:text-[#E5B824]" />
              <span>Ma Carte Officielle</span>
            </button>

            {financialSummary.statusFinancial === 'A_JOUR' && (
              <button
                onClick={() => setViewingQuitusMember(currentUser)}
                className="px-4 py-2 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 font-semibold text-xs rounded-xl flex items-center gap-2 cursor-pointer transition-all"
              >
                <Award className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Mon Quitus Financier</span>
              </button>
            )}

            <button
              onClick={() => openQrSyncModal(currentUser)}
              className="px-4 py-2 bg-black dark:bg-zinc-900 dark:border dark:border-[#E5B824]/50 text-[#E5B824] hover:bg-gray-900 dark:hover:bg-zinc-800 font-semibold text-xs rounded-xl flex items-center gap-2 cursor-pointer transition-all shadow-xs"
            >
              <QrCode className="w-4 h-4" />
              <span>Flasher QR Paiement</span>
            </button>

            <button
              onClick={() =>
                openPaymentModal({
                  type: 'COTISATION_MENSUELLE',
                })
              }
              className="px-4 py-2 bg-[#E5B824] text-black font-semibold text-xs rounded-xl hover:bg-[#dcae1f] flex items-center gap-2 cursor-pointer shadow-sm transition-all"
            >
              <CreditCard className="w-4 h-4" />
              <span>Effectuer un Paiement</span>
            </button>
          </div>
        </div>

        {/* Navigation Sub-Tabs */}
        <div className="flex flex-wrap items-center gap-2 p-1.5 bg-gray-100 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl w-fit text-xs">
          <button
            onClick={() => setActiveSubTab('FINANCES')}
            className={`px-4 py-2 rounded-xl font-semibold transition-all cursor-pointer flex items-center gap-2 ${
              activeSubTab === 'FINANCES'
                ? 'bg-[#E5B824] text-black shadow-xs'
                : 'text-gray-700 dark:text-zinc-300 hover:text-black dark:hover:text-white'
            }`}
          >
            <Receipt className="w-3.5 h-3.5" />
            <span>Situation Financière & Cotisations</span>
          </button>

          <button
            onClick={() => setActiveSubTab('PROFIL')}
            className={`px-4 py-2 rounded-xl font-semibold transition-all cursor-pointer flex items-center gap-2 ${
              activeSubTab === 'PROFIL'
                ? 'bg-[#E5B824] text-black shadow-xs'
                : 'text-gray-700 dark:text-zinc-300 hover:text-black dark:hover:text-white'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Profil & Coordonnées</span>
          </button>

          <button
            onClick={() => setActiveSubTab('PROMOTION')}
            className={`px-4 py-2 rounded-xl font-semibold transition-all cursor-pointer flex items-center gap-2 ${
              activeSubTab === 'PROMOTION'
                ? 'bg-[#E5B824] text-black shadow-xs'
                : 'text-gray-700 dark:text-zinc-300 hover:text-black dark:hover:text-white'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Espace Promo {currentUser.promotionYear}</span>
          </button>
        </div>

        {/* Tab 1: Situation Financière */}
        {activeSubTab === 'FINANCES' && (
          <div className="space-y-8">
            {/* Status Alert Banner */}
            <div
              className={`p-5 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                financialSummary.statusFinancial === 'A_JOUR'
                  ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800 text-gray-800 dark:text-zinc-200'
                  : financialSummary.statusFinancial === 'PARTIEL'
                  ? 'bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-800 text-gray-800 dark:text-zinc-200'
                  : 'bg-red-50 dark:bg-red-950/50 border-red-200 dark:border-red-800 text-gray-800 dark:text-zinc-200'
              }`}
            >
              <div className="flex items-start gap-3.5">
                {financialSummary.statusFinancial === 'A_JOUR' ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle
                    className={`w-6 h-6 shrink-0 mt-0.5 ${
                      financialSummary.statusFinancial === 'PARTIEL' ? 'text-amber-600 dark:text-amber-400' : 'text-red-600 dark:text-red-400'
                    }`}
                  />
                )}
                <div>
                  <h3 className="font-heading font-bold text-base text-black dark:text-white">
                    Statut de Conformité Financière :{' '}
                    <span
                      className={
                        financialSummary.statusFinancial === 'A_JOUR'
                          ? 'text-emerald-700 dark:text-emerald-400'
                          : financialSummary.statusFinancial === 'PARTIEL'
                          ? 'text-amber-800 dark:text-amber-400'
                          : 'text-red-700 dark:text-red-400'
                      }
                    >
                      {financialSummary.statusFinancial === 'A_JOUR' && 'À JOUR DE TOUTES COTISATIONS'}
                      {financialSummary.statusFinancial === 'PARTIEL' && 'PARTIELLEMENT À JOUR'}
                      {financialSummary.statusFinancial === 'EN_RETARD' && 'COTISATIONS EN RETARD'}
                    </span>
                  </h3>
                  <p className="text-xs text-gray-700 dark:text-zinc-300 mt-1">
                    {financialSummary.statusFinancial === 'A_JOUR' &&
                      'Toutes vos obligations statutaires (droits d’adhésion et cotisations mensuelles échues) sont en règle. Vous disposez du droit de vote aux Assemblées Générales.'}
                    {financialSummary.statusFinancial === 'PARTIEL' &&
                      `Vous avez ${financialSummary.overdueMonths.length} mensualité(s) échue(s) non acquittée(s). Vous pouvez régulariser votre compte en un clic.`}
                    {financialSummary.statusFinancial === 'EN_RETARD' &&
                      `Attention : ${financialSummary.overdueMonths.length} cotisations mensuelles sont en souffrance. Régularisez votre situation pour conserver vos droits d’adhérent.`}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {financialSummary.statusFinancial === 'A_JOUR' ? (
                  <button
                    onClick={() => setViewingQuitusMember(currentUser)}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Award className="w-4 h-4" />
                    <span>Télécharger le Quitus Officiel</span>
                  </button>
                ) : (
                  <button
                    onClick={() =>
                      openPaymentModal({
                        type: 'COTISATION_MENSUELLE',
                        selectedMonths: financialSummary.overdueMonths,
                      })
                    }
                    className="px-4 py-2 bg-[#E5B824] hover:bg-[#dcae1f] text-black font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Régulariser mes impayés</span>
                  </button>
                )}
              </div>
            </div>

            {/* 4 KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-5 space-y-1">
                <span className="text-[10px] uppercase tracking-wider text-gray-500 dark:text-zinc-400 font-semibold block">
                  Total des Versements Encaissés
                </span>
                <div className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-emerald-700 dark:text-emerald-400">
                  {financialSummary.totalPaid.toLocaleString('fr-FR')} F
                </div>
                <span className="text-[11px] text-gray-500 dark:text-zinc-400 block">Droits + Cotisations + Dons</span>
              </div>

              <div className="bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-5 space-y-1">
                <span className="text-[10px] uppercase tracking-wider text-gray-500 dark:text-zinc-400 font-semibold block">
                  Droits d’Adhésion Statutaires
                </span>
                <div className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-black dark:text-white">
                  {financialSummary.totalDroitAdhesion.toLocaleString('fr-FR')} F
                </div>
                <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium flex items-center gap-1 mt-0.5">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Statut Validé à vie</span>
                </span>
              </div>

              <div className="bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-5 space-y-1">
                <span className="text-[10px] uppercase tracking-wider text-gray-500 dark:text-zinc-400 font-semibold block">
                  Cotisations Mensuelles 2026
                </span>
                <div className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-[#B8860B] dark:text-[#E5B824]">
                  {financialSummary.totalCotisations.toLocaleString('fr-FR')} F
                </div>
                <span className="text-[11px] text-gray-600 dark:text-zinc-400 block">
                  {financialSummary.paidMonths.length} / 12 mois acquittés
                </span>
              </div>

              <div className="bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-5 space-y-1">
                <span className="text-[10px] uppercase tracking-wider text-gray-500 dark:text-zinc-400 font-semibold block">
                  Dons & Mécénat Projets
                </span>
                <div className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-black dark:text-white">
                  {financialSummary.totalDons.toLocaleString('fr-FR')} F
                </div>
                <span className="text-[11px] text-gray-500 dark:text-zinc-400 block">Soutien aux infrastructures</span>
              </div>
            </div>

            {/* Monthly Dues Grid */}
            <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-5 shadow-xs">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-gray-200 dark:border-zinc-800">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-gray-500 dark:text-zinc-400 font-semibold block">
                    Échéancier Mensuel {settings.fiscalYear} ({settings.cotisationMensuelleAmount.toLocaleString('fr-FR')} {settings.currency} / mois)
                  </span>
                  <h3 className="text-base font-bold font-heading text-black dark:text-white mt-0.5">
                    Calendrier de Paiement des Cotisations
                  </h3>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-gray-700 dark:text-zinc-300 font-medium">
                  <span>Payé ({financialSummary.paidMonths.length})</span>
                  <span className="text-gray-300 dark:text-zinc-600">·</span>
                  <span>En attente ({financialSummary.pendingMonths.length})</span>
                  <span className="text-gray-300 dark:text-zinc-600">·</span>
                  <span>En retard ({financialSummary.overdueMonths.length})</span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {MONTHS_2026.map((m) => {
                  const isPaid = financialSummary.paidMonths.includes(m.key);
                  const isPending = financialSummary.pendingMonths.includes(m.key);
                  const isOverdue = financialSummary.overdueMonths.includes(m.key);
                  const isFuture = m.key > '2026-11' && !isPaid && !isPending;

                  return (
                    <div
                      key={m.key}
                      className={`p-3.5 rounded-xl border flex flex-col justify-between space-y-2 transition-all ${
                        isPaid
                          ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                          : isPending
                          ? 'bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200'
                          : isOverdue
                          ? 'bg-red-50 dark:bg-red-950/50 border-red-200 dark:border-red-800 text-red-900 dark:text-red-200'
                          : 'bg-gray-50 dark:bg-zinc-950 border-gray-200 dark:border-zinc-800 text-gray-600 dark:text-zinc-400'
                      }`}
                    >
                      <div>
                        <span className="text-xs font-bold block text-black dark:text-white">{m.short} {settings.fiscalYear}</span>
                        <span className="text-[10px] font-mono text-gray-600 dark:text-zinc-400">{settings.cotisationMensuelleAmount.toLocaleString('fr-FR')} {settings.currency}</span>
                      </div>

                      <div className="pt-2 border-t border-gray-200/80 dark:border-zinc-800 flex items-center justify-between text-[10px]">
                        {isPaid && (
                          <span className="text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Acquitté</span>
                          </span>
                        )}
                        {isPending && (
                          <span className="text-amber-800 dark:text-amber-400 font-bold flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>En attente</span>
                          </span>
                        )}
                        {isOverdue && (
                          <button
                            onClick={() =>
                              openPaymentModal({
                                type: 'COTISATION_MENSUELLE',
                                selectedMonths: [m.key],
                              })
                            }
                            className="text-red-700 dark:text-red-400 font-bold hover:underline cursor-pointer flex items-center gap-1"
                          >
                            <span>Payer</span>
                            <span>→</span>
                          </button>
                        )}
                        {isFuture && (
                          <span className="text-gray-500 dark:text-zinc-500 italic">À échoir</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Transactions Statement Table */}
            <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-5 shadow-xs">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-gray-200 dark:border-zinc-800">
                <div>
                  <h3 className="text-base font-bold font-heading text-black dark:text-white flex items-center gap-2">
                    <Receipt className="w-5 h-5 text-[#B8860B] dark:text-[#E5B824]" />
                    <span>Historique des Versements & Quittances</span>
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-zinc-400 mt-0.5">
                    Relevé complet de vos droits d'adhésion, cotisations mensuelles et contributions aux projets.
                  </p>
                </div>

                <button
                  onClick={() =>
                    openPaymentModal({
                      type: 'COTISATION_MENSUELLE',
                    })
                  }
                  className="px-4 py-2 bg-[#E5B824] text-black font-semibold text-xs rounded-xl hover:bg-[#dcae1f] flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Nouveau Versement</span>
                </button>
              </div>

              {financialSummary.transactions.length === 0 ? (
                <div className="text-center py-10 text-gray-500 dark:text-zinc-400 text-xs">
                  Aucune transaction enregistrée pour l'instant.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-gray-700 dark:text-zinc-300">
                    <thead className="bg-gray-50 dark:bg-zinc-950 text-gray-600 dark:text-zinc-400 text-[10px] uppercase border-b border-gray-200 dark:border-zinc-800 font-bold">
                      <tr>
                        <th className="p-3.5">Référence</th>
                        <th className="p-3.5">Date</th>
                        <th className="p-3.5">Type & Objet</th>
                        <th className="p-3.5">Mode</th>
                        <th className="p-3.5">Montant</th>
                        <th className="p-3.5">État</th>
                        <th className="p-3.5 text-right">Quittance</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-zinc-800 font-sans">
                      {financialSummary.transactions.map((t) => (
                        <tr key={t.id} className="hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors">
                          <td className="p-3.5 font-mono text-gray-600 dark:text-zinc-400 font-medium">
                            {t.reference}
                          </td>
                          <td className="p-3.5 text-gray-600 dark:text-zinc-400 whitespace-nowrap">
                            {t.date}
                          </td>
                          <td className="p-3.5">
                            <span className="font-semibold text-black dark:text-white block">{t.title}</span>
                            {t.description && (
                              <span className="text-[11px] text-gray-500 dark:text-zinc-400 block truncate max-w-xs">
                                {t.description}
                              </span>
                            )}
                          </td>
                          <td className="p-3.5 text-gray-700 dark:text-zinc-300 whitespace-nowrap font-mono text-[11px]">
                            {t.method.replace('_', ' ')}
                          </td>
                          <td className="p-3.5 font-mono tabular-nums font-bold text-black dark:text-white whitespace-nowrap">
                            {t.amount.toLocaleString('fr-FR')} F
                          </td>
                          <td className="p-3.5 whitespace-nowrap">
                            {t.status === 'PAYE' && (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                                PAYÉ
                              </span>
                            )}
                            {t.status === 'EN_ATTENTE' && (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                                EN ATTENTE
                              </span>
                            )}
                            {t.status === 'EN_RETARD' && (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800">
                                EN RETARD
                              </span>
                            )}
                            {t.status === 'ANNULE' && (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-gray-100 dark:bg-zinc-800 text-gray-500 dark:text-zinc-400 border border-gray-200 dark:border-zinc-700">
                                ANNULÉ
                              </span>
                            )}
                          </td>
                          <td className="p-3.5 text-right whitespace-nowrap">
                            <button
                              onClick={() => setViewingTransactionReceipt(t)}
                              className="px-2.5 py-1 rounded bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 border border-gray-300 dark:border-zinc-700 text-black dark:text-white font-semibold text-[11px] cursor-pointer flex items-center gap-1 ml-auto"
                            >
                              <FileText className="w-3 h-3 text-[#B8860B] dark:text-[#E5B824]" />
                              <span>Reçu</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Profile & Coordonnées */}
        {activeSubTab === 'PROFIL' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-5 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-zinc-800">
                <h3 className="text-base font-heading font-bold text-black dark:text-white">
                  Coordonnées Personnelles & Professionnelles
                </h3>
                <button
                  onClick={() => setEditMode(!editMode)}
                  className="text-xs text-[#B8860B] dark:text-[#E5B824] hover:underline font-semibold cursor-pointer"
                >
                  {editMode ? 'Annuler' : 'Modifier'}
                </button>
              </div>

              {!editMode ? (
                <div className="space-y-3.5 text-xs">
                  <div>
                    <span className="text-gray-500 dark:text-zinc-400 block text-[10px] uppercase font-semibold">Poste / Fonction</span>
                    <span className="text-black dark:text-white font-semibold text-sm">{currentUser.currentRole}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-zinc-400 block text-[10px] uppercase font-semibold">Entreprise</span>
                    <span className="text-gray-800 dark:text-zinc-200">{currentUser.company}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-zinc-400 block text-[10px] uppercase font-semibold">Secteur</span>
                    <span className="text-gray-800 dark:text-zinc-200">{currentUser.sector}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-zinc-400 block text-[10px] uppercase font-semibold">Résidence</span>
                    <span className="text-gray-800 dark:text-zinc-200">{currentUser.city}, {currentUser.country}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-zinc-400 block text-[10px] uppercase font-semibold">E-mail</span>
                    <span className="text-gray-800 dark:text-zinc-200 font-mono">{currentUser.email}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-zinc-400 block text-[10px] uppercase font-semibold">Téléphone</span>
                    <span className="text-gray-800 dark:text-zinc-200 font-mono">{currentUser.phone || 'Non renseigné'}</span>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSaveProfile} className="space-y-3 text-xs">
                  <div>
                    <label className="block text-gray-700 dark:text-zinc-300 font-semibold mb-1">Poste actuel</label>
                    <input
                      type="text"
                      value={profileForm.currentRole}
                      onChange={(e) => setProfileForm({ ...profileForm, currentRole: e.target.value })}
                      className="w-full bg-gray-50 dark:bg-zinc-950 border border-gray-300 dark:border-zinc-700 focus:border-[#E5B824] rounded-lg p-2.5 text-black dark:text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 dark:text-zinc-300 font-semibold mb-1">Entreprise</label>
                    <input
                      type="text"
                      value={profileForm.company}
                      onChange={(e) => setProfileForm({ ...profileForm, company: e.target.value })}
                      className="w-full bg-gray-50 dark:bg-zinc-950 border border-gray-300 dark:border-zinc-700 focus:border-[#E5B824] rounded-lg p-2.5 text-black dark:text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 dark:text-zinc-300 font-semibold mb-1">Téléphone</label>
                    <input
                      type="text"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                      className="w-full bg-gray-50 dark:bg-zinc-950 border border-gray-300 dark:border-zinc-700 focus:border-[#E5B824] rounded-lg p-2.5 text-black dark:text-white font-mono focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-[#E5B824] text-black font-semibold rounded-lg hover:bg-[#dcae1f] mt-3 cursor-pointer"
                  >
                    Enregistrer les modifications
                  </button>
                </form>
              )}
            </div>

            <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-4 shadow-xs">
              <h3 className="text-base font-heading font-bold text-black dark:text-white pb-3 border-b border-gray-200 dark:border-zinc-800">
                Paramètres de Confidentialité & Mentorat
              </h3>
              <div className="space-y-3 text-xs text-gray-700 dark:text-zinc-300">
                <label className="flex items-center gap-2.5 cursor-pointer p-3 rounded-xl bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800">
                  <input
                    type="checkbox"
                    checked={profileForm.showPhone}
                    onChange={(e) => {
                      const next = e.target.checked;
                      setProfileForm({ ...profileForm, showPhone: next });
                      updateMemberProfile(currentUser.id, {
                        privacy: { ...currentUser.privacy, showPhone: next },
                      });
                    }}
                    className="rounded border-gray-300 dark:border-zinc-600 text-[#E5B824] focus:ring-[#E5B824]"
                  />
                  <span>Afficher mon téléphone aux camarades de promotion</span>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer p-3 rounded-xl bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800">
                  <input
                    type="checkbox"
                    checked={currentUser.isMentor}
                    onChange={(e) => {
                      const next = e.target.checked;
                      updateMemberProfile(currentUser.id, { isMentor: next });
                    }}
                    className="rounded border-gray-300 dark:border-zinc-600 text-[#E5B824] focus:ring-[#E5B824]"
                  />
                  <span>Participer au Programme de Mentorat pour conseiller les jeunes diplômés</span>
                </label>
              </div>
            </div>

            {canEnrichAi && (
              <div className="md:col-span-2 bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-200 dark:border-zinc-800">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider font-bold text-[#B8860B] dark:text-[#E5B824]">
                      Privilège Administration & Communication
                    </span>
                    <h3 className="text-base font-heading font-bold text-black dark:text-white mt-0.5">
                      Enrichir l’Assistant IA avec les données de votre profil
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAiChatOpen(true)}
                    className="px-3.5 py-2 rounded-xl bg-white dark:bg-zinc-950 border border-gray-300 dark:border-zinc-700 hover:border-black dark:hover:border-[#E5B824] text-xs font-semibold text-black dark:text-white flex items-center gap-2 cursor-pointer self-start sm:self-center"
                  >
                    <MessageSquareText className="w-3.5 h-3.5 text-[#B8860B] dark:text-[#E5B824]" />
                    <span>Ouvrir l’Assistant IA</span>
                  </button>
                </div>

                <p className="text-xs text-gray-700 dark:text-zinc-300 leading-relaxed">
                  Votre profil habilité ({currentRole === 'RESPONSABLE_COMM' ? 'Responsable Communication' : currentRole}) peut être synchronisé en un clic afin que l’Assistant IA de l’ALGB relaie vos coordonnées autorisées, votre expertise, votre promotion et votre message institutionnel auprès des membres.
                </p>

                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    value={aiProfileNote}
                    onChange={(e) => setAiProfileNote(e.target.value)}
                    placeholder="Précision facultative à joindre depuis votre profil..."
                    className="flex-1 bg-white dark:bg-zinc-950 border border-gray-300 dark:border-zinc-700 focus:border-[#E5B824] rounded-xl px-3.5 py-2.5 text-xs text-black dark:text-white placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      enrichAiFromCurrentProfile(aiProfileNote);
                      setAiProfileNote('');
                    }}
                    className="px-5 py-2.5 rounded-xl bg-black dark:bg-[#E5B824] hover:bg-gray-900 dark:hover:bg-[#dcae1f] text-[#E5B824] dark:text-black font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shrink-0"
                  >
                    <UserCheck className="w-4 h-4" />
                    <span>Synchroniser mon profil vers l’IA</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Promotion */}
        {activeSubTab === 'PROMOTION' && (
          <div className="bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-4 max-w-2xl">
            <h3 className="text-lg font-heading font-bold text-black dark:text-white flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-[#B8860B] dark:text-[#E5B824]" />
              <span>Promotion {currentUser.promotionYear} : Communauté & Délégués</span>
            </h3>
            <p className="text-xs text-gray-700 dark:text-zinc-300 leading-relaxed">
              Votre promotion constitue votre premier cercle de solidarité. Vous pouvez consulter l'annuaire de votre classe, suivre les annonces du délégué et participer aux cotisations de groupe.
            </p>
            <div className="pt-2">
              <button
                onClick={() => {
                  setSelectedPromotionYear(currentUser.promotionYear);
                  setActiveTab('anciens');
                }}
                className="px-5 py-2.5 bg-[#E5B824] text-black font-semibold text-xs rounded-xl hover:bg-[#dcae1f] cursor-pointer"
              >
                Ouvrir l’espace dédié Promotion {currentUser.promotionYear}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
