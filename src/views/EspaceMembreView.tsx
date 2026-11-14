import React, { useEffect, useMemo, useState } from 'react';
import { useApp } from '../context/AppContext';
import { MONTHS_2026 } from '../data/mockData';
import { CotisationsChartDashboard } from '../components/CotisationsChartDashboard';
import { UNRESTRICTED_ACCESS_OVERRIDE } from '../utils/accessMatrix';
import {
  User,
  CreditCard,
  Briefcase,
  Users,
  LayoutDashboard,
  Lock,
  Eye,
  CheckCircle2,
  AlertCircle,
  Clock,
  FileText,
  Award,
  Receipt,
  QrCode,
  UserCheck,
  MessageSquareText,
  ShieldCheck,
  Download,
  WifiOff,
  Trash2,
} from 'lucide-react';
import { OFFLINE_CARD_STORAGE_KEY } from '../context/AppContext';

type MemberSidebarSection =
  | 'OVERVIEW'
  | 'COTISATIONS'
  | 'MENTORAT_CANDIDATURES'
  | 'PROFIL'
  | 'ARTCI_PRIVACY';

export const EspaceMembreView: React.FC = () => {
  const {
    members,
    currentUser,
    currentRole,
    activeCredential,
    openAuthModal,
    canAccessTab,
    setViewingCardMember,
    updateMemberProfile,
    setActiveTab,
    openPaymentModal,
    setViewingTransactionReceipt,
    setViewingQuitusMember,
    getMemberFinancialSummary,
    isCurrentMemberUpToDate,
    openQrSyncModal,
    canEnrichAi,
    enrichAiFromCurrentProfile,
    setAiChatOpen,
    settings,
    mentorshipRequests,
    updateMentorshipRequestStatus,
    jobApplications,
    theme,
    updateMyPrivacy,
    exportMyArtciData,
    anonymizeMyAccount,
    cacheOfflineMemberCard,
    addToast,
  } = useApp();

  const [section, setSection] = useState<MemberSidebarSection>('OVERVIEW');
  const [aiProfileNote, setAiProfileNote] = useState('');
  const [previewMemberId, setPreviewMemberId] = useState<string>('');
  const [confirmAnonymize, setConfirmAnonymize] = useState(false);
  const [offlineSyncedAt, setOfflineSyncedAt] = useState<string | null>(() => {
    try {
      const raw = localStorage.getItem(OFFLINE_CARD_STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as { cachedAt?: string };
      return parsed.cachedAt || null;
    } catch {
      return null;
    }
  });

  const activeMember = useMemo(
    () =>
      currentUser ||
      (UNRESTRICTED_ACCESS_OVERRIDE
        ? members.find((m) => m.id === previewMemberId) || members[0] || null
        : null),
    [currentUser, members, previewMemberId]
  );

  const [profileForm, setProfileForm] = useState({
    firstName: activeMember?.firstName || '',
    lastName: activeMember?.lastName || '',
    profession: activeMember?.profession || '',
    currentRole: activeMember?.currentRole || '',
    company: activeMember?.company || '',
    sector: activeMember?.sector || '',
    city: activeMember?.city || '',
    country: activeMember?.country || '',
    phone: activeMember?.phone || '',
    email: activeMember?.email || '',
    bio: activeMember?.bio || '',
    isMentor: activeMember?.isMentor ?? false,
    showEmail: activeMember?.privacy.showEmail ?? true,
    showPhone: activeMember?.privacy.showPhone ?? false,
    allowMentorshipRequests: activeMember?.privacy.allowMentorshipRequests ?? true,
  });

  useEffect(() => {
    if (!activeMember) return;
    setProfileForm({
      firstName: activeMember.firstName || '',
      lastName: activeMember.lastName || '',
      profession: activeMember.profession || '',
      currentRole: activeMember.currentRole || '',
      company: activeMember.company || '',
      sector: activeMember.sector || '',
      city: activeMember.city || '',
      country: activeMember.country || '',
      phone: activeMember.phone || '',
      email: activeMember.email || '',
      bio: activeMember.bio || '',
      isMentor: activeMember.isMentor ?? false,
      showEmail: activeMember.privacy.showEmail ?? true,
      showPhone: activeMember.privacy.showPhone ?? false,
      allowMentorshipRequests: activeMember.privacy.allowMentorshipRequests ?? true,
    });
  }, [activeMember]);

  const receivedMentorship = useMemo(() => {
    if (!activeMember) return [];
    return mentorshipRequests.filter(
      (r) =>
        UNRESTRICTED_ACCESS_OVERRIDE ||
        r.mentorId === activeMember.id ||
        currentRole === 'ADMIN' ||
        currentRole === 'SUPER_ADMIN'
    );
  }, [mentorshipRequests, activeMember, currentRole]);

  const trackedApplications = useMemo(() => {
    if (!activeMember) return [];
    const mine = jobApplications.filter(
      (a) => a.applicantId === activeMember.id || a.applicantId === 'mem-guest'
    );
    return mine.length > 0 ? mine : jobApplications;
  }, [jobApplications, activeMember]);

  if (!UNRESTRICTED_ACCESS_OVERRIDE && (currentRole === 'VISITEUR' || !activeCredential)) {
    return (
      <div className="bg-[#F8F8F6] dark:bg-[#141413] min-h-screen py-20 px-4 transition-colors">
        <div className="max-w-xl mx-auto bg-white dark:bg-[#1e1e1c] rounded-xl p-8 text-center shadow-editorial border border-black/5 dark:border-white/10 space-y-5">
          <div className="w-14 h-14 rounded-full bg-[#141413] text-[#F2B705] flex items-center justify-center mx-auto">
            <Lock className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-heading font-bold text-[#141413] dark:text-white">
            Connexion à votre Espace Membre
          </h2>
          <p className="text-xs sm:text-sm text-[#4A4A48] dark:text-zinc-300 leading-relaxed">
            Identifiez-vous avec votre credential personnel attribué par l’Administration ALGB pour
            consulter votre statut de cotisation, vos demandes de mentorat et vos candidatures.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => openAuthModal('espace-membre')}
              className="px-6 py-3 rounded-lg bg-[#F2B705] hover:bg-[#dfa704] text-[#141413] text-xs font-semibold cursor-pointer"
            >
              Se connecter avec mes accès
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('adhesion')}
              className="px-5 py-3 rounded-lg border border-black/15 dark:border-white/15 text-xs font-medium text-[#141413] dark:text-white cursor-pointer"
            >
              Adhérer à l’ALGB
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!activeMember) {
    return (
      <div className="bg-[#F8F8F6] dark:bg-[#141413] min-h-screen py-20 px-4 transition-colors">
        <div className="max-w-xl mx-auto bg-white dark:bg-[#1e1e1c] rounded-xl p-8 text-center shadow-editorial border border-black/5 dark:border-white/10 space-y-5">
          <div className="w-14 h-14 rounded-full bg-[#141413] text-[#F2B705] flex items-center justify-center mx-auto">
            <UserCheck className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-heading font-bold text-[#141413] dark:text-white">
            Compte fonctionnel : {activeCredential?.displayName || 'Profil ALGB'}
          </h2>
          <p className="text-xs sm:text-sm text-[#4A4A48] dark:text-zinc-300">
            Ce credential ({activeCredential?.identifier || 'Accès libre'}) est dédié à la gestion institutionnelle.
            Les encarts « Trouver un Mentor », « Collège des Parrains » et « Carrières au cœur du réseau » nécessitent une fiche membre rattachée à jour de sa cotisation.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {canAccessTab('admin') && (
              <button
                type="button"
                onClick={() => setActiveTab('admin')}
                className="px-6 py-3 rounded-lg bg-[#F2B705] text-[#141413] text-xs font-semibold cursor-pointer"
              >
                Ouvrir la Console d’Administration
              </button>
            )}
            <button
              type="button"
              onClick={() => setActiveTab('anciens')}
              className="px-5 py-3 rounded-lg border border-black/15 dark:border-white/15 text-xs font-medium text-[#141413] dark:text-white cursor-pointer"
            >
              Consulter l’Annuaire
            </button>
          </div>
        </div>
      </div>
    );
  }

  const financialSummary = getMemberFinancialSummary(activeMember.id);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateMemberProfile(activeMember.id, {
      firstName: profileForm.firstName.trim() || activeMember.firstName,
      lastName: profileForm.lastName.trim() || activeMember.lastName,
      profession: profileForm.profession.trim(),
      currentRole: profileForm.currentRole.trim(),
      company: profileForm.company.trim(),
      sector: profileForm.sector.trim(),
      city: profileForm.city.trim(),
      country: profileForm.country.trim(),
      phone: profileForm.phone.trim(),
      email: profileForm.email.trim(),
      bio: profileForm.bio.trim(),
      isMentor: profileForm.isMentor,
      privacy: {
        showEmail: profileForm.showEmail,
        showPhone: profileForm.showPhone,
        allowMentorshipRequests: profileForm.allowMentorshipRequests,
      },
    });
  };

  const sidebarItems: { id: MemberSidebarSection; label: string; icon: React.ReactNode }[] = [
    { id: 'OVERVIEW', label: 'Vue d’ensemble', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'COTISATIONS', label: 'Cotisations & Quitus', icon: <CreditCard className="w-4 h-4" /> },
    {
      id: 'MENTORAT_CANDIDATURES',
      label: 'Mentorat & Candidatures',
      icon: <Briefcase className="w-4 h-4" />,
    },
    { id: 'PROFIL', label: 'Édition du profil', icon: <User className="w-4 h-4" /> },
    { id: 'ARTCI_PRIVACY', label: 'Mes données & ARTCI', icon: <ShieldCheck className="w-4 h-4" /> },
  ];

  const inputClass =
    'w-full bg-[#F8F8F6] dark:bg-[#141413] border border-black/15 dark:border-white/15 focus:border-[#141413] dark:focus:border-[#F2B705] rounded-lg px-3.5 py-2.5 text-xs text-[#141413] dark:text-white focus:outline-none';

  return (
    <div className="bg-[#F8F8F6] dark:bg-[#141413] min-h-screen transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Menu latéral sombre en Noir Carbone (#141413) */}
          <aside className="lg:col-span-3 bg-[#141413] text-white rounded-xl p-6 space-y-6 lg:sticky lg:top-24 shadow-editorial">
            <div className="flex items-center gap-3.5 pb-5 border-b border-white/10">
              <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-[#F2B705] bg-white/10 flex items-center justify-center font-heading font-bold text-lg text-[#F2B705] shrink-0">
                {activeMember.avatarUrl ? (
                  <img
                    src={activeMember.avatarUrl}
                    alt={activeMember.firstName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <>
                    {activeMember.firstName[0]}
                    {activeMember.lastName[0]}
                  </>
                )}
              </div>
              <div className="min-w-0">
                <span className="text-[10px] uppercase tracking-wider text-[#F2B705] font-semibold block">
                  Promo {activeMember.promotionYear}
                </span>
                <h2 className="text-base font-heading font-bold text-white truncate">
                  {activeMember.firstName} {activeMember.lastName}
                </h2>
                <span className="text-[11px] font-mono text-zinc-400 block truncate">
                  {activeMember.membershipCardId}
                </span>
              </div>
            </div>

            {!currentUser && UNRESTRICTED_ACCESS_OVERRIDE && (
              <div className="space-y-1.5 text-xs">
                <label className="block text-[10px] uppercase tracking-wider text-zinc-400 font-semibold">
                  Profil consulté (Accès libre)
                </label>
                <select
                  value={activeMember.id}
                  onChange={(e) => setPreviewMemberId(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-2.5 py-2 text-xs text-white focus:outline-none focus:border-[#F2B705]"
                >
                  {members.map((m) => (
                    <option key={m.id} value={m.id} className="text-[#141413] bg-white">
                      {m.firstName} {m.lastName} (Promo {m.promotionYear})
                    </option>
                  ))}
                </select>
              </div>
            )}

            <nav className="space-y-1.5" aria-label="Menu Espace Membre">
              {sidebarItems.map((item) => {
                const active = section === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSection(item.id)}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                      active
                        ? 'bg-[#F2B705] text-[#141413] font-semibold'
                        : 'text-zinc-300 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            <div className="pt-4 border-t border-white/10 space-y-2 text-xs">
              <button
                type="button"
                onClick={() => setViewingCardMember(activeMember)}
                className="w-full py-2.5 px-3 rounded-lg border border-white/25 text-white hover:bg-white hover:text-[#141413] transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Ma Carte Officielle</span>
              </button>
              <button
                type="button"
                onClick={() => openQrSyncModal(activeMember)}
                className="w-full py-2.5 px-3 rounded-lg bg-white/10 hover:bg-white/20 text-[#F2B705] transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>Flasher QR Paiement</span>
              </button>
            </div>
          </aside>

          {/* Main Workspace on #F8F8F6 */}
          <div className="lg:col-span-9 space-y-8">
            {/* OVERVIEW SECTION */}
            {section === 'OVERVIEW' && (
              <div className="space-y-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-xs uppercase tracking-[0.16em] font-semibold text-[#4A4A48] dark:text-[#F2B705]">
                      Tableau de bord personnel
                    </span>
                    <h1 className="text-2xl sm:text-3xl font-heading font-bold text-[#141413] dark:text-white mt-0.5">
                      Bienvenue, {activeMember.firstName}
                    </h1>
                  </div>
                  <button
                    type="button"
                    onClick={() => openPaymentModal({ type: 'COTISATION_MENSUELLE' })}
                    className="px-5 py-2.5 rounded-lg bg-[#F2B705] hover:bg-[#dfa704] text-[#141413] text-xs font-semibold inline-flex items-center gap-2 cursor-pointer self-start sm:self-auto"
                  >
                    <CreditCard className="w-4 h-4 text-[#141413]" />
                    <span>Régler ma cotisation</span>
                  </button>
                </div>

                {/* Statut de cotisation card */}
                <div className="bg-white dark:bg-[#1e1e1c] rounded-xl p-6 shadow-editorial border border-black/5 dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    {financialSummary.statusFinancial === 'A_JOUR' ? (
                      <CheckCircle2 className="w-6 h-6 text-[#134E4A] dark:text-emerald-400 shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-6 h-6 text-[#C2410C] shrink-0 mt-0.5" />
                    )}
                    <div>
                      <span className="text-[11px] uppercase tracking-wider font-semibold text-[#4A4A48] dark:text-zinc-400">
                        Statut de cotisation {settings.fiscalYear}
                      </span>
                      <h3 className="text-lg font-heading font-bold text-[#141413] dark:text-white">
                        {financialSummary.statusFinancial === 'A_JOUR' && 'À jour de toutes cotisations'}
                        {financialSummary.statusFinancial === 'PARTIEL' &&
                          `Partiellement à jour (${financialSummary.overdueMonths.length} mois à régulariser)`}
                        {financialSummary.statusFinancial === 'EN_RETARD' &&
                          `Cotisations en retard (${financialSummary.overdueMonths.length} mois)`}
                      </h3>
                      <p className="text-xs text-[#4A4A48] dark:text-zinc-300 mt-0.5">
                        {financialSummary.paidMonths.length} / 12 mois acquittés · Total versé :{' '}
                        <strong className="text-[#141413] dark:text-white">
                          {financialSummary.totalPaid.toLocaleString('fr-FR')} {settings.currency}
                        </strong>
                      </p>
                      <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-[#F8F8F6] dark:bg-[#141413] border border-black/10 dark:border-white/10">
                        {isCurrentMemberUpToDate ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#134E4A] dark:text-emerald-400" />
                            <span className="text-[#134E4A] dark:text-emerald-400">
                              Trouver un Mentor, Collège des Parrains & Carrières au cœur du réseau : Débloqués
                            </span>
                          </>
                        ) : (
                          <>
                            <Lock className="w-3.5 h-3.5 text-[#C2410C] dark:text-amber-400" />
                            <span className="text-[#C2410C] dark:text-amber-300">
                              Mentorat, Parrains & Carrières au cœur du réseau : Verrouillés (cotisation à jour requise)
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {financialSummary.statusFinancial === 'A_JOUR' ? (
                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => setActiveTab('mentorat')}
                        className="px-4 py-2.5 rounded-lg bg-[#16324F] hover:bg-[#1e4268] text-white text-xs font-semibold cursor-pointer"
                      >
                        Collège des Parrains
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTab('reseau')}
                        className="px-4 py-2.5 rounded-lg bg-[#C2410C] hover:bg-[#9a3412] text-white text-xs font-semibold cursor-pointer"
                      >
                        Carrières
                      </button>
                      <button
                        type="button"
                        onClick={() => setViewingQuitusMember(activeMember)}
                        className="px-4 py-2.5 rounded-lg bg-[#134E4A] text-white text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        <Award className="w-4 h-4" />
                        <span>Quitus officiel</span>
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() =>
                        openPaymentModal({
                          type: 'COTISATION_MENSUELLE',
                          selectedMonths: financialSummary.overdueMonths,
                        })
                      }
                      className="px-4 py-2.5 rounded-lg bg-[#F2B705] text-[#141413] text-xs font-semibold cursor-pointer shrink-0"
                    >
                      Régulariser maintenant
                    </button>
                  )}
                </div>

                {/* 3 Summary KPIs */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  <div className="bg-white dark:bg-[#1e1e1c] rounded-xl p-5 shadow-editorial border border-black/5 dark:border-white/10">
                    <span className="text-[11px] uppercase tracking-wider font-semibold text-[#4A4A48] dark:text-zinc-400">
                      Cotisations acquittées
                    </span>
                    <div className="text-2xl font-heading font-bold text-[#141413] dark:text-white mt-1 tabular-nums">
                      {financialSummary.paidMonths.length} / 12 mois
                    </div>
                  </div>
                  <div className="bg-white dark:bg-[#1e1e1c] rounded-xl p-5 shadow-editorial border border-black/5 dark:border-white/10">
                    <span className="text-[11px] uppercase tracking-wider font-semibold text-[#4A4A48] dark:text-zinc-400">
                      Demandes de mentorat reçues
                    </span>
                    <div className="text-2xl font-heading font-bold text-[#16324F] dark:text-[#F2B705] mt-1 tabular-nums">
                      {receivedMentorship.length}
                    </div>
                  </div>
                  <div className="bg-white dark:bg-[#1e1e1c] rounded-xl p-5 shadow-editorial border border-black/5 dark:border-white/10">
                    <span className="text-[11px] uppercase tracking-wider font-semibold text-[#4A4A48] dark:text-zinc-400">
                      Candidatures suivies
                    </span>
                    <div className="text-2xl font-heading font-bold text-[#C2410C] dark:text-orange-400 mt-1 tabular-nums">
                      {trackedApplications.length}
                    </div>
                  </div>
                </div>

                {/* Tableau de bord visuel Recharts des cotisations */}
                <CotisationsChartDashboard
                  financialSummary={financialSummary}
                  fiscalYear={settings.fiscalYear}
                  monthlyAmount={settings.cotisationMensuelleAmount}
                  currency={settings.currency}
                  theme={theme}
                  onPayMonths={(months) =>
                    openPaymentModal({
                      type: 'COTISATION_MENSUELLE',
                      selectedMonths: months,
                    })
                  }
                  onOpenNewPayment={(type) =>
                    openPaymentModal({ type: type || 'COTISATION_MENSUELLE' })
                  }
                />

                {/* Demandes de mentorat & Candidatures suivies */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Demandes de mentorat reçues */}
                  <div className="bg-white dark:bg-[#1e1e1c] rounded-xl p-6 shadow-editorial border border-black/5 dark:border-white/10 space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-black/10 dark:border-white/10">
                      <h3 className="text-base font-heading font-bold text-[#141413] dark:text-white flex items-center gap-2">
                        <Users className="w-4 h-4 text-[#16324F] dark:text-[#F2B705]" />
                        <span>Demandes de mentorat reçues</span>
                      </h3>
                      <button
                        type="button"
                        onClick={() => setSection('MENTORAT_CANDIDATURES')}
                        className="text-xs font-medium text-[#16324F] dark:text-[#F2B705] hover:underline cursor-pointer"
                      >
                        Tout voir
                      </button>
                    </div>

                    {receivedMentorship.length === 0 ? (
                      <p className="text-xs text-[#4A4A48] dark:text-zinc-400">
                        Aucune demande de parrainage reçue pour le moment.
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {receivedMentorship.slice(0, 3).map((req) => (
                          <div
                            key={req.id}
                            className="p-3.5 rounded-lg bg-[#F8F8F6] dark:bg-[#141413] border border-black/5 dark:border-white/10 space-y-2"
                          >
                            <div className="flex items-center justify-between gap-2 text-xs">
                              <span className="font-semibold text-[#141413] dark:text-white">
                                {req.menteeName} (Promo {req.menteePromo})
                              </span>
                              <span className="px-2 py-0.5 rounded bg-[#FEF8E6] text-[#141413] text-[10px] font-semibold">
                                {req.status.replace('_', ' ')}
                              </span>
                            </div>
                            <p className="text-xs text-[#4A4A48] dark:text-zinc-400 line-clamp-2">
                              {req.objective}
                            </p>
                            {req.status === 'EN_ATTENTE' && (
                              <div className="flex items-center gap-2 pt-1">
                                <button
                                  type="button"
                                  onClick={() => updateMentorshipRequestStatus(req.id, 'ACCEPTEE')}
                                  className="px-3 py-1 rounded-md bg-[#F2B705] text-[#141413] text-[11px] font-semibold cursor-pointer"
                                >
                                  Accepter
                                </button>
                                <button
                                  type="button"
                                  onClick={() => updateMentorshipRequestStatus(req.id, 'PLANIFIEE')}
                                  className="px-3 py-1 rounded-md border border-black/15 dark:border-white/15 text-[#141413] dark:text-white text-[11px] font-medium cursor-pointer"
                                >
                                  Planifier RDV
                                </button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Candidatures suivies */}
                  <div className="bg-white dark:bg-[#1e1e1c] rounded-xl p-6 shadow-editorial border border-black/5 dark:border-white/10 space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-black/10 dark:border-white/10">
                      <h3 className="text-base font-heading font-bold text-[#141413] dark:text-white flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-[#C2410C] dark:text-orange-400" />
                        <span>Candidatures suivies</span>
                      </h3>
                      <button
                        type="button"
                        onClick={() => setActiveTab('reseau')}
                        className="text-xs font-medium text-[#C2410C] dark:text-[#F2B705] hover:underline cursor-pointer"
                      >
                        Offres Carrières
                      </button>
                    </div>

                    {trackedApplications.length === 0 ? (
                      <p className="text-xs text-[#4A4A48] dark:text-zinc-400">
                        Aucune candidature enregistrée. Postulez depuis la rubrique Carrières.
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {trackedApplications.slice(0, 3).map((app) => (
                          <div
                            key={app.id}
                            className="p-3.5 rounded-lg bg-[#F8F8F6] dark:bg-[#141413] border border-black/5 dark:border-white/10 space-y-1.5"
                          >
                            <div className="flex items-center justify-between gap-2 text-xs">
                              <span className="font-semibold text-[#141413] dark:text-white truncate">
                                {app.jobTitle}
                              </span>
                              <span className="px-2 py-0.5 rounded bg-[#FFF7ED] text-[#C2410C] text-[10px] font-semibold shrink-0">
                                {app.status.replace('_', ' ')}
                              </span>
                            </div>
                            <div className="text-[11px] text-[#4A4A48] dark:text-zinc-400">
                              {app.company} · {app.contractType} · Déposée le {app.appliedAt}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* COTISATIONS SECTION */}
            {section === 'COTISATIONS' && (
              <div className="space-y-8">
                <CotisationsChartDashboard
                  financialSummary={financialSummary}
                  fiscalYear={settings.fiscalYear}
                  monthlyAmount={settings.cotisationMensuelleAmount}
                  currency={settings.currency}
                  theme={theme}
                  onPayMonths={(months) =>
                    openPaymentModal({
                      type: 'COTISATION_MENSUELLE',
                      selectedMonths: months,
                    })
                  }
                  onOpenNewPayment={(type) =>
                    openPaymentModal({ type: type || 'COTISATION_MENSUELLE' })
                  }
                />

                <div className="bg-white dark:bg-[#1e1e1c] rounded-xl p-6 sm:p-8 shadow-editorial border border-black/5 dark:border-white/10 space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-black/10 dark:border-white/10">
                    <div>
                      <span className="text-xs uppercase tracking-wider font-semibold text-[#4A4A48] dark:text-[#F2B705]">
                        Échéancier {settings.fiscalYear}
                      </span>
                      <h2 className="text-xl font-heading font-bold text-[#141413] dark:text-white">
                        Calendrier des Cotisations Mensuelles
                      </h2>
                    </div>
                    <button
                      type="button"
                      onClick={() => openPaymentModal({ type: 'COTISATION_MENSUELLE' })}
                      className="px-4 py-2.5 rounded-lg bg-[#F2B705] text-[#141413] text-xs font-semibold cursor-pointer"
                    >
                      Nouveau versement
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                    {MONTHS_2026.map((m) => {
                      const isPaid = financialSummary.paidMonths.includes(m.key);
                      const isPending = financialSummary.pendingMonths.includes(m.key);
                      const isOverdue = financialSummary.overdueMonths.includes(m.key);
                      return (
                        <div
                          key={m.key}
                          className={`p-3.5 rounded-xl border text-xs space-y-2 ${
                            isPaid
                              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800'
                              : isPending
                              ? 'bg-[#FEF8E6] dark:bg-amber-950/40 border-amber-200 dark:border-amber-800'
                              : isOverdue
                              ? 'bg-[#FFF7ED] dark:bg-orange-950/40 border-orange-200 dark:border-orange-800'
                              : 'bg-[#F8F8F6] dark:bg-[#141413] border-black/10 dark:border-white/10'
                          }`}
                        >
                          <div className="font-semibold text-[#141413] dark:text-white">
                            {m.short} {settings.fiscalYear}
                          </div>
                          {isPaid && (
                            <div className="text-[11px] font-semibold text-[#134E4A] dark:text-emerald-400 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Acquitté</span>
                            </div>
                          )}
                          {isPending && (
                            <div className="text-[11px] font-semibold text-amber-800 dark:text-amber-300 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span>En attente</span>
                            </div>
                          )}
                          {isOverdue && (
                            <button
                              type="button"
                              onClick={() =>
                                openPaymentModal({
                                  type: 'COTISATION_MENSUELLE',
                                  selectedMonths: [m.key],
                                })
                              }
                              className="text-[11px] font-semibold text-[#C2410C] dark:text-orange-400 hover:underline cursor-pointer"
                            >
                              Régler →
                            </button>
                          )}
                          {!isPaid && !isPending && !isOverdue && (
                            <div className="text-[11px] text-[#4A4A48] dark:text-zinc-500">À échoir</div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Historique des versements */}
                <div className="bg-white dark:bg-[#1e1e1c] rounded-xl p-6 sm:p-8 shadow-editorial border border-black/5 dark:border-white/10 space-y-4">
                  <h3 className="text-lg font-heading font-bold text-[#141413] dark:text-white flex items-center gap-2">
                    <Receipt className="w-5 h-5 text-[#F2B705]" />
                    <span>Historique des Versements & Quittances</span>
                  </h3>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#F8F8F6] dark:bg-[#141413] text-[#4A4A48] dark:text-zinc-400 uppercase text-[10px]">
                        <tr>
                          <th className="p-3">Référence</th>
                          <th className="p-3">Date</th>
                          <th className="p-3">Objet</th>
                          <th className="p-3">Montant</th>
                          <th className="p-3">Statut</th>
                          <th className="p-3 text-right">Quittance</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-black/10 dark:divide-white/10">
                        {financialSummary.transactions.map((tx) => (
                          <tr key={tx.id}>
                            <td className="p-3 font-mono text-[#4A4A48] dark:text-zinc-400">{tx.reference}</td>
                            <td className="p-3 whitespace-nowrap">{tx.date}</td>
                            <td className="p-3 font-semibold text-[#141413] dark:text-white">{tx.title}</td>
                            <td className="p-3 font-mono font-semibold whitespace-nowrap">
                              {tx.amount.toLocaleString('fr-FR')} {tx.currency || 'FCFA'}
                            </td>
                            <td className="p-3 whitespace-nowrap">
                              <span className="px-2 py-0.5 rounded bg-[#FEF8E6] text-[#141413] text-[10px] font-semibold">
                                {tx.status}
                              </span>
                            </td>
                            <td className="p-3 text-right">
                              <button
                                type="button"
                                onClick={() => setViewingTransactionReceipt(tx)}
                                className="px-2.5 py-1 rounded bg-[#F8F8F6] dark:bg-[#141413] border border-black/15 dark:border-white/15 text-[11px] font-medium inline-flex items-center gap-1 cursor-pointer"
                              >
                                <FileText className="w-3 h-3" />
                                <span>Reçu</span>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* MENTORAT & CANDIDATURES SECTION */}
            {section === 'MENTORAT_CANDIDATURES' && (
              <div className="space-y-6">
                <div className="bg-white dark:bg-[#1e1e1c] rounded-xl p-6 sm:p-8 shadow-editorial border border-black/5 dark:border-white/10 space-y-4">
                  <h2 className="text-xl font-heading font-bold text-[#141413] dark:text-white">
                    Demandes de mentorat ({receivedMentorship.length})
                  </h2>
                  <div className="space-y-3">
                    {receivedMentorship.map((req) => (
                      <div
                        key={req.id}
                        className="p-4 rounded-xl bg-[#F8F8F6] dark:bg-[#141413] border border-black/5 dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div className="space-y-1">
                          <div className="text-xs font-semibold text-[#141413] dark:text-white">
                            {req.menteeName} · Promo {req.menteePromo}
                          </div>
                          <p className="text-xs text-[#4A4A48] dark:text-zinc-300">{req.objective}</p>
                          <div className="text-[11px] text-[#4A4A48] dark:text-zinc-400">
                            Reçue le {req.createdAt} · Statut : <strong>{req.status}</strong>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => updateMentorshipRequestStatus(req.id, 'ACCEPTEE')}
                            className="px-3.5 py-2 rounded-lg bg-[#F2B705] text-[#141413] text-xs font-semibold cursor-pointer"
                          >
                            Accepter
                          </button>
                          <button
                            type="button"
                            onClick={() => updateMentorshipRequestStatus(req.id, 'PLANIFIEE')}
                            className="px-3.5 py-2 rounded-lg border border-black/15 dark:border-white/15 text-[#141413] dark:text-white text-xs font-medium cursor-pointer"
                          >
                            Planifier
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white dark:bg-[#1e1e1c] rounded-xl p-6 sm:p-8 shadow-editorial border border-black/5 dark:border-white/10 space-y-4">
                  <h2 className="text-xl font-heading font-bold text-[#141413] dark:text-white">
                    Candidatures Carrières suivies ({trackedApplications.length})
                  </h2>
                  <div className="space-y-3">
                    {trackedApplications.map((app) => (
                      <div
                        key={app.id}
                        className="p-4 rounded-xl bg-[#F8F8F6] dark:bg-[#141413] border border-black/5 dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="space-y-1">
                          <div className="text-sm font-heading font-bold text-[#141413] dark:text-white">
                            {app.jobTitle}
                          </div>
                          <div className="text-xs text-[#4A4A48] dark:text-zinc-300">
                            {app.company} ({app.contractType}) · Envoyée le {app.appliedAt}
                          </div>
                          <p className="text-xs text-[#4A4A48] dark:text-zinc-400 italic">« {app.note} »</p>
                        </div>
                        <span className="px-3 py-1 rounded-lg bg-[#FFF7ED] text-[#C2410C] text-xs font-semibold self-start sm:self-center">
                          {app.status.replace('_', ' ')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* EDITION DU PROFIL COMPLET */}
            {section === 'PROFIL' && (
              <div className="space-y-6">
                <form
                  onSubmit={handleSaveProfile}
                  className="bg-white dark:bg-[#1e1e1c] rounded-xl p-6 sm:p-8 shadow-editorial border border-black/5 dark:border-white/10 space-y-6"
                >
                  <div className="pb-4 border-b border-black/10 dark:border-white/10">
                    <span className="text-xs uppercase tracking-wider font-semibold text-[#4A4A48] dark:text-[#F2B705]">
                      Annuaire & Confidentialité
                    </span>
                    <h2 className="text-2xl font-heading font-bold text-[#141413] dark:text-white mt-0.5">
                      Formulaire d’édition de profil complet
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block font-semibold text-[#141413] dark:text-white mb-1">Prénom</label>
                      <input
                        type="text"
                        required
                        value={profileForm.firstName}
                        onChange={(e) => setProfileForm({ ...profileForm, firstName: e.target.value })}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-[#141413] dark:text-white mb-1">Nom</label>
                      <input
                        type="text"
                        required
                        value={profileForm.lastName}
                        onChange={(e) => setProfileForm({ ...profileForm, lastName: e.target.value })}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-[#141413] dark:text-white mb-1">Poste actuel</label>
                      <input
                        type="text"
                        value={profileForm.currentRole}
                        onChange={(e) => setProfileForm({ ...profileForm, currentRole: e.target.value })}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-[#141413] dark:text-white mb-1">Entreprise / Structure</label>
                      <input
                        type="text"
                        value={profileForm.company}
                        onChange={(e) => setProfileForm({ ...profileForm, company: e.target.value })}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-[#141413] dark:text-white mb-1">Secteur d’activité</label>
                      <input
                        type="text"
                        value={profileForm.sector}
                        onChange={(e) => setProfileForm({ ...profileForm, sector: e.target.value })}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-[#141413] dark:text-white mb-1">Téléphone / WhatsApp</label>
                      <input
                        type="text"
                        value={profileForm.phone}
                        onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-[#141413] dark:text-white mb-1">Ville</label>
                      <input
                        type="text"
                        value={profileForm.city}
                        onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-[#141413] dark:text-white mb-1">Pays</label>
                      <input
                        type="text"
                        value={profileForm.country}
                        onChange={(e) => setProfileForm({ ...profileForm, country: e.target.value })}
                        className={inputClass}
                      />
                    </div>
                  </div>

                  <div className="text-xs">
                    <label className="block font-semibold text-[#141413] dark:text-white mb-1">
                      Présentation professionnelle & parcours
                    </label>
                    <textarea
                      rows={3}
                      value={profileForm.bio}
                      onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                      className={inputClass}
                    />
                  </div>

                  <div className="space-y-2.5 text-xs">
                    <label className="flex items-center gap-2.5 p-3 rounded-lg bg-[#FEF8E6] text-[#141413] cursor-pointer font-medium">
                      <input
                        type="checkbox"
                        checked={profileForm.isMentor}
                        onChange={(e) => setProfileForm({ ...profileForm, isMentor: e.target.checked })}
                        className="rounded border-black/20"
                      />
                      <span>Apparaître comme Mentor disponible dans l’Annuaire et le programme Mentorat</span>
                    </label>

                    <label className="flex items-center gap-2.5 p-3 rounded-lg bg-[#F8F8F6] dark:bg-[#141413] text-[#141413] dark:text-zinc-200 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={profileForm.showPhone}
                        onChange={(e) => setProfileForm({ ...profileForm, showPhone: e.target.checked })}
                        className="rounded border-black/20"
                      />
                      <span>Autoriser l’affichage de mon numéro aux membres connectés</span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-3 rounded-lg bg-[#F2B705] hover:bg-[#dfa704] text-[#141413] text-xs font-semibold cursor-pointer transition-colors"
                  >
                    Enregistrer mon profil
                  </button>
                </form>

                {canEnrichAi && (
                  <div className="bg-white dark:bg-[#1e1e1c] rounded-xl p-6 shadow-editorial border border-black/5 dark:border-white/10 space-y-4">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="text-base font-heading font-bold text-[#141413] dark:text-white">
                        Synchronisation avec l’Assistant ALGB
                      </h3>
                      <button
                        type="button"
                        onClick={() => setAiChatOpen(true)}
                        className="px-3 py-1.5 rounded-lg border border-black/15 dark:border-white/15 text-xs font-medium inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        <MessageSquareText className="w-3.5 h-3.5" />
                        <span>Ouvrir</span>
                      </button>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <input
                        type="text"
                        value={aiProfileNote}
                        onChange={(e) => setAiProfileNote(e.target.value)}
                        placeholder="Précision institutionnelle facultative..."
                        className={inputClass}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          enrichAiFromCurrentProfile(aiProfileNote);
                          setAiProfileNote('');
                        }}
                        className="px-5 py-2.5 rounded-lg bg-[#141413] text-[#F2B705] text-xs font-semibold shrink-0 cursor-pointer"
                      >
                        Synchroniser
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* MES DONNEES & CONFIDENTIALITE (ARTCI) + CARTE HORS-LIGNE */}
            {section === 'ARTCI_PRIVACY' && (
              <div className="space-y-6">
                {/* Carte QR Hors-Ligne PWA */}
                <div className="bg-white dark:bg-[#1e1e1c] rounded-xl p-6 sm:p-8 shadow-editorial border border-black/5 dark:border-white/10 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#16324F] text-[#F2B705] flex items-center justify-center shrink-0">
                        <WifiOff className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[11px] uppercase tracking-wider font-semibold text-[#16324F] dark:text-[#F2B705]">
                          Mode Hors-Ligne PWA
                        </span>
                        <h2 className="text-lg font-heading font-bold text-[#141413] dark:text-white">
                          Carte d’Adhérent & QR Certifié disponibles hors connexion
                        </h2>
                        <p className="text-xs text-[#4A4A48] dark:text-zinc-400 mt-0.5">
                          {offlineSyncedAt
                            ? `Dernière mise en cache locale : ${new Date(offlineSyncedAt).toLocaleString('fr-FR')}. Présentable sans réseau aux Galas et Assemblées Générales.`
                            : 'Synchronisez votre carte numérique signée pour y accéder même sans connexion internet.'}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        void (async () => {
                          await cacheOfflineMemberCard(activeMember);
                          const nowIso = new Date().toISOString();
                          setOfflineSyncedAt(nowIso);
                          addToast(
                            'success',
                            'Carte synchronisée hors-ligne',
                            'Votre carte et son QR code certifié HMAC-SHA256 sont enregistrés pour un usage sans connexion.'
                          );
                        })();
                      }}
                      className="px-4 py-2.5 rounded-lg bg-[#F2B705] hover:bg-[#dfa704] text-[#141413] text-xs font-bold inline-flex items-center gap-2 shrink-0 cursor-pointer"
                    >
                      <QrCode className="w-4 h-4" />
                      <span>Synchroniser hors-ligne</span>
                    </button>
                  </div>
                </div>

                {/* Droits ARTCI Loi 2013-450 */}
                <div className="bg-white dark:bg-[#1e1e1c] rounded-xl p-6 sm:p-8 shadow-editorial border border-black/5 dark:border-white/10 space-y-6">
                  <div className="pb-4 border-b border-black/10 dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <span className="text-xs uppercase tracking-wider font-semibold text-[#134E4A] dark:text-[#F2B705]">
                        Loi n° 2013-450 (ARTCI Côte d’Ivoire)
                      </span>
                      <h2 className="text-2xl font-heading font-bold text-[#141413] dark:text-white mt-0.5">
                        Mes données & Confidentialité
                      </h2>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveTab('confidentialite')}
                      className="text-xs font-semibold text-[#16324F] dark:text-[#F2B705] hover:underline cursor-pointer self-start"
                    >
                      Consulter la politique ARTCI →
                    </button>
                  </div>

                  <div className="space-y-3 text-xs">
                    {[
                      {
                        key: 'showEmail' as const,
                        label: 'Afficher mon adresse e-mail aux membres connectés de l’Annuaire',
                        value: activeMember.privacy.showEmail,
                      },
                      {
                        key: 'showPhone' as const,
                        label: 'Afficher mon numéro de téléphone / WhatsApp aux membres connectés',
                        value: activeMember.privacy.showPhone,
                      },
                      {
                        key: 'allowMentorshipRequests' as const,
                        label: 'Autoriser les sollicitations de Mentorat exécutif',
                        value: activeMember.privacy.allowMentorshipRequests,
                      },
                      {
                        key: 'shareContactsConsent' as const,
                        label: 'Autoriser la mise en relation institutionnelle par le Secrétariat Général',
                        value: activeMember.shareContactsConsent ?? true,
                      },
                      {
                        key: 'bdrRegistered' as const,
                        label: 'Figurer dans la Base de Données des Compétences (BDR)',
                        value: activeMember.bdrRegistered ?? true,
                      },
                    ].map((pref) => (
                      <label
                        key={pref.key}
                        className="flex items-center justify-between gap-4 p-4 rounded-xl bg-[#F8F8F6] dark:bg-[#141413] border border-black/10 dark:border-white/10 cursor-pointer"
                      >
                        <span className="font-medium text-[#141413] dark:text-zinc-200">{pref.label}</span>
                        <input
                          type="checkbox"
                          checked={pref.value}
                          onChange={(e) => {
                            void updateMyPrivacy({ [pref.key]: e.target.checked });
                          }}
                          className="w-4 h-4 accent-[#16324F] shrink-0 cursor-pointer"
                        />
                      </label>
                    ))}
                  </div>

                  {/* Export JSON + Anonymisation */}
                  <div className="pt-4 border-t border-black/10 dark:border-white/10 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-5 rounded-xl bg-[#F8F8F6] dark:bg-[#141413] border border-black/10 dark:border-white/10 space-y-3">
                      <h3 className="text-sm font-heading font-bold text-[#141413] dark:text-white">
                        Portabilité des données (Droit d’accès)
                      </h3>
                      <p className="text-xs text-[#4A4A48] dark:text-zinc-400">
                        Téléchargez une archive complète au format JSON de votre fiche membre et de vos écritures de cotisation.
                      </p>
                      <button
                        type="button"
                        onClick={() => void exportMyArtciData()}
                        className="px-4 py-2.5 rounded-lg bg-[#16324F] hover:bg-[#1e4268] text-white text-xs font-semibold inline-flex items-center gap-2 cursor-pointer"
                      >
                        <Download className="w-4 h-4 text-[#F2B705]" />
                        <span>Exporter mes données (JSON)</span>
                      </button>
                    </div>

                    <div className="p-5 rounded-xl bg-red-50/60 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 space-y-3">
                      <h3 className="text-sm font-heading font-bold text-red-800 dark:text-red-300">
                        Droit à l’oubli & Anonymisation
                      </h3>
                      <p className="text-xs text-red-700 dark:text-red-300/80">
                        Remplace vos informations nominatives par des libellés anonymisés tout en conservant les pièces comptables légales.
                      </p>
                      {!confirmAnonymize ? (
                        <button
                          type="button"
                          onClick={() => setConfirmAnonymize(true)}
                          className="px-4 py-2.5 rounded-lg border border-red-400 text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-950/50 text-xs font-semibold inline-flex items-center gap-2 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>Anonymiser mon compte</span>
                        </button>
                      ) : (
                        <div className="p-3 rounded-lg bg-white dark:bg-[#141413] border border-red-300 dark:border-red-800 space-y-2.5">
                          <p className="text-[11px] font-semibold text-red-800 dark:text-red-300">
                            Confirmer l’anonymisation définitive et la fermeture de session ?
                          </p>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setConfirmAnonymize(false);
                                void anonymizeMyAccount();
                              }}
                              className="px-3 py-1.5 rounded-md bg-red-700 text-white text-[11px] font-bold cursor-pointer"
                            >
                              Confirmer
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmAnonymize(false)}
                              className="px-3 py-1.5 rounded-md border border-black/15 dark:border-white/15 text-[11px] font-semibold cursor-pointer"
                            >
                              Annuler
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
