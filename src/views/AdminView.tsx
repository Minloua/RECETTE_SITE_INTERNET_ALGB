import React, { useState } from 'react';
import { useApp, AiKnowledgeCategory } from '../context/AppContext';
import {
  Shield,
  Users,
  CheckCircle,
  XCircle,
  DollarSign,
  Download,
  PlusCircle,
  TrendingUp,
  Lock,
  Megaphone,
  Banknote,
  Sliders,
  Settings,
  GraduationCap,
  Save,
  Trash2,
  AlertCircle,
  Receipt,
  Smartphone,
  Building2,
  QrCode,
  BookOpen,
  UserCheck,
  Eye,
  EyeOff,
  MessageSquareText,
} from 'lucide-react';

type AdminTab =
  | 'TRESORERIE'
  | 'PARAMETRES_FINANCIERS'
  | 'MEMBRES'
  | 'PROMOTIONS_PARAM'
  | 'PROJETS'
  | 'COMMUNICATION'
  | 'PARAMETRES_GENERAUX'
  | 'EXPORTS';

export const AdminView: React.FC = () => {
  const {
    members,
    projects,
    news,
    promotions,
    transactions,
    settings,
    updateSettings,
    updatePromotion,
    deleteNewsItem,
    approveMember,
    rejectMember,
    addNewsItem,
    setViewingCardMember,
    setViewingTransactionReceipt,
    updateTransactionStatus,
    processPayment,
    openQrSyncModal,
    currentRole,
    currentUser,
    aiKnowledgeEntries,
    canEnrichAi,
    addAiKnowledgeEntry,
    toggleAiKnowledgeEntry,
    deleteAiKnowledgeEntry,
    enrichAiFromCurrentProfile,
    setAiChatOpen,
    addToast,
  } = useApp();

  const isFinance = currentRole === 'RESPONSABLE_FINANCE';
  const isAdminOrSuper = currentRole === 'ADMIN' || currentRole === 'SUPER_ADMIN';
  const isComm = currentRole === 'RESPONSABLE_COMM';

  const isAuthorized = isFinance || isAdminOrSuper || isComm;

  const [adminTab, setAdminTab] = useState<AdminTab>(() => {
    if (isFinance) return 'TRESORERIE';
    if (isComm) return 'COMMUNICATION';
    return 'TRESORERIE';
  });

  const [txFilterStatus, setTxFilterStatus] = useState<string>('ALL');
  const [txFilterType, setTxFilterType] = useState<string>('ALL');
  const [txSearch, setTxSearch] = useState<string>('');

  const [manualModalOpen, setManualModalOpen] = useState(false);
  const [manualPayment, setManualPayment] = useState({
    memberId: members[0]?.id || '',
    type: 'COTISATION_MENSUELLE' as any,
    amount: settings.cotisationMensuelleAmount * 3,
    method: 'ESPECES' as any,
    title: 'Règlement au guichet du Trésorier Général',
    notes: 'Quittance remise en main propre',
  });

  const [financeForm, setFinanceForm] = useState({
    droitAdhesionAmount: settings.droitAdhesionAmount,
    cotisationMensuelleAmount: settings.cotisationMensuelleAmount,
    currency: settings.currency,
    fiscalYear: settings.fiscalYear,
    overdueGraceMonths: settings.overdueGraceMonths,
    orangeMoneyMerchantNumber: settings.orangeMoneyMerchantNumber,
    mtnMoMoMerchantNumber: settings.mtnMoMoMerchantNumber,
    moovMoneyMerchantNumber: settings.moovMoneyMerchantNumber,
    bankName: settings.bankName,
    bankRib: settings.bankRib,
    bankIban: settings.bankIban,
    treasurerName: settings.treasurerName,
  });

  const [generalForm, setGeneralForm] = useState({
    associationName: settings.associationName,
    associationSignature: settings.associationSignature,
    associationMessage: settings.associationMessage,
    presidentName: settings.presidentName,
    secretaryGeneralName: settings.secretaryGeneralName,
    headquartersAddress: settings.headquartersAddress,
    officialEmail: settings.officialEmail,
    officialPhone: settings.officialPhone,
    googleScriptUrl: settings.googleScriptUrl || '',
  });

  const [selectedPromoYear, setSelectedPromoYear] = useState<number>(promotions[0]?.year || 2002);
  const selectedPromo = promotions.find((p) => p.year === selectedPromoYear) || promotions[0];
  const [promoForm, setPromoForm] = useState({
    motto: selectedPromo?.motto || '',
    delegateName: selectedPromo?.delegateName || '',
    delegateContact: selectedPromo?.delegateContact || '',
    nextReunionDate: selectedPromo?.nextReunionDate || '',
    description: selectedPromo?.description || '',
  });

  const handleSelectPromo = (year: number) => {
    setSelectedPromoYear(year);
    const target = promotions.find((p) => p.year === year);
    if (target) {
      setPromoForm({
        motto: target.motto,
        delegateName: target.delegateName,
        delegateContact: target.delegateContact,
        nextReunionDate: target.nextReunionDate || '',
        description: target.description,
      });
    }
  };

  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<'COMMUNIQUE' | 'VIE_AMICALE' | 'EXCELLENCE' | 'HISTOIRE'>('COMMUNIQUE');
  const [newAuthor, setNewAuthor] = useState('Secrétariat Général ALGB');
  const [newSummary, setNewSummary] = useState('');
  const [newContent, setNewContent] = useState('');

  // AI Knowledge Enrichment states
  const [aiProfileNote, setAiProfileNote] = useState('');
  const [aiEntryTitle, setAiEntryTitle] = useState('');
  const [aiEntryCategory, setAiEntryCategory] = useState<AiKnowledgeCategory>('AMICALE');
  const [aiEntryContent, setAiEntryContent] = useState('');

  if (!isAuthorized) {
    return (
      <div className="bg-white dark:bg-zinc-950 min-h-screen transition-colors">
        <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
          <Lock className="w-12 h-12 text-[#B8860B] dark:text-[#E5B824] mx-auto" />
          <h2 className="text-xl font-bold font-heading text-black dark:text-white">
            Accès Réservé à l'Administration de l'ALGB
          </h2>
          <p className="text-xs text-gray-600 dark:text-zinc-400">
            Cette console est accessible aux profils habilités : Responsable Finance, Administrateurs, Super Administrateur et Responsable Communication. Utilisez le simulateur de rôles (en bas à droite) pour basculer sur un profil autorisé.
          </p>
        </div>
      </div>
    );
  }

  const pendingMembers = members.filter((m) => m.membershipStatus === 'EN_ATTENTE');
  const approvedMembers = members.filter((m) => m.membershipStatus === 'A_JOUR');

  const filteredTransactions = transactions.filter((tx) => {
    const matchesStatus = txFilterStatus === 'ALL' || tx.status === txFilterStatus;
    const matchesType = txFilterType === 'ALL' || tx.type === txFilterType;
    const matchesSearch =
      txSearch === '' ||
      tx.memberName.toLowerCase().includes(txSearch.toLowerCase()) ||
      tx.reference.toLowerCase().includes(txSearch.toLowerCase()) ||
      tx.receiptNumber.toLowerCase().includes(txSearch.toLowerCase());
    return matchesStatus && matchesType && matchesSearch;
  });

  const handlePublishNews = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newSummary) return;

    addNewsItem({
      title: newTitle,
      category: newCategory,
      author: newAuthor,
      summary: newSummary,
      content: newContent || newSummary,
      imageUrl: '/assets/aistudio/IMG-20180925-WA0019_301d84a7.jpg',
      isImportant: true,
    });

    setNewTitle('');
    setNewSummary('');
    setNewContent('');
  };

  const handleSaveFinancialSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      droitAdhesionAmount: Number(financeForm.droitAdhesionAmount),
      cotisationMensuelleAmount: Number(financeForm.cotisationMensuelleAmount),
      currency: financeForm.currency,
      fiscalYear: Number(financeForm.fiscalYear),
      overdueGraceMonths: Number(financeForm.overdueGraceMonths),
      orangeMoneyMerchantNumber: financeForm.orangeMoneyMerchantNumber,
      mtnMoMoMerchantNumber: financeForm.mtnMoMoMerchantNumber,
      moovMoneyMerchantNumber: financeForm.moovMoneyMerchantNumber,
      bankName: financeForm.bankName,
      bankRib: financeForm.bankRib,
      bankIban: financeForm.bankIban,
      treasurerName: financeForm.treasurerName,
    });
  };

  const handleSaveGeneralSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      associationName: generalForm.associationName,
      associationSignature: generalForm.associationSignature,
      associationMessage: generalForm.associationMessage,
      presidentName: generalForm.presidentName,
      secretaryGeneralName: generalForm.secretaryGeneralName,
      headquartersAddress: generalForm.headquartersAddress,
      officialEmail: generalForm.officialEmail,
      officialPhone: generalForm.officialPhone,
      googleScriptUrl: generalForm.googleScriptUrl,
    });
  };

  const handleSavePromo = (e: React.FormEvent) => {
    e.preventDefault();
    updatePromotion(selectedPromoYear, {
      motto: promoForm.motto,
      delegateName: promoForm.delegateName,
      delegateContact: promoForm.delegateContact,
      nextReunionDate: promoForm.nextReunionDate,
      description: promoForm.description,
    });
  };

  const handleExportCSV = () => {
    const headers =
      'ID,Matricule,Nom,Prenom,Pseudo_Lycee,Promotion,Niveau_Etude,Profession,Fonction,Entreprise,Secteur,Situation_Pro,Pays,Ville,Commune,Email,Telephone,WhatsApp,Competences_BDR,Certifications,Disponibilites,Services_Offerts,Statut_Adhesion,Date_Enrolement\n';
    const rows = members
      .map((m) => {
        const clean = (val: string | undefined | null) => (val ? `"${String(val).replace(/"/g, '""')}"` : '""');
        const compStr = m.skills ? m.skills.join('; ') : '';
        const certStr = m.certifications ? m.certifications.join('; ') : '';
        const dispStr = m.availabilities ? m.availabilities.join('; ') : '';
        return [
          clean(m.id),
          clean(m.membershipCardId),
          clean(m.lastName),
          clean(m.firstName),
          clean(m.nickname || ''),
          m.promotionYear,
          clean(m.studyLevel || ''),
          clean(m.profession),
          clean(m.currentRole),
          clean(m.company),
          clean(m.sector),
          clean(m.situation || ''),
          clean(m.country),
          clean(m.city),
          clean(m.commune || ''),
          clean(m.email),
          clean(m.phone || ''),
          clean(m.whatsapp || ''),
          clean(compStr),
          clean(certStr),
          clean(dispStr),
          clean(m.services || ''),
          clean(m.membershipStatus),
          clean(m.enrollmentDate || ''),
        ].join(',');
      })
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Annuaire_ALGB_BDR_Enrolement_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast('success', 'Exportation réussie', 'Le fichier CSV enrichi (Annuaire, Pseudo & BDR) a été téléchargé.');
  };

  const handleExportGrandLivreCSV = () => {
    const headers = 'ID,Reference,Date,Matricule_Membre,Nom_Membre,Promotion,Type_Operation,Montant,Devise,Mode_Paiement,Statut,Numero_Recu,Validateur,Notes\n';
    const rows = transactions
      .map(
        (t) =>
          `"${t.id}","${t.reference}","${t.date}","${t.memberId}","${t.memberName}",${t.promotionYear},"${t.type}",${t.amount},"${t.currency}","${t.method}","${t.status}","${t.receiptNumber}","${t.validatedBy || ''}","${t.notes || ''}"`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Grand_Livre_Comptable_ALGB_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast('success', 'Grand Livre Exporté', 'Le journal comptable complet a été exporté en CSV.');
  };

  const handleCreateManualPayment = (e: React.FormEvent) => {
    e.preventDefault();
    processPayment({
      type: manualPayment.type,
      amount: manualPayment.amount,
      method: manualPayment.method,
      title: manualPayment.title,
      notes: manualPayment.notes,
      memberId: manualPayment.memberId,
      status: 'PAYE',
    });
    setManualModalOpen(false);
  };

  const inputClass =
    'w-full bg-gray-50 dark:bg-zinc-950 border border-gray-300 dark:border-zinc-700 focus:border-[#E5B824] focus:bg-white dark:focus:bg-zinc-950 rounded-lg p-2.5 text-black dark:text-white placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none transition-colors';

  return (
    <div className="bg-white dark:bg-zinc-950 min-h-screen transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        {/* Editorial Header */}
        <div className="border-b border-gray-200 dark:border-zinc-800 pb-8 flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
          <div>
            <span className="text-xs uppercase tracking-widest font-bold text-[#B8860B] dark:text-[#E5B824] flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5" />
              <span>Console Back-Office Officielle</span>
            </span>
            <h1 className="text-2xl sm:text-4xl font-bold font-heading text-black dark:text-white mt-1">
              {isFinance ? 'Gestion Financière & Trésorerie ALGB' : 'Administration & Gouvernance ALGB'}
            </h1>
            <p className="text-sm text-gray-600 dark:text-zinc-400 font-editorial italic max-w-2xl mt-1">
              {isFinance
                ? '« Délégation exclusive de gestion des flux de trésorerie, cotisations, quittances et paramétrage financier. »'
                : '« Contrôle opérationnel intégral : cotisations, adhésions, promotions, projets, communication et gouvernance. »'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3.5 py-1.5 bg-yellow-50 dark:bg-yellow-500/15 text-[#B8860B] dark:text-[#E5B824] border border-yellow-200 dark:border-yellow-500/30 rounded-lg text-xs font-semibold">
              Profil actif : {currentRole.replace('_', ' ')}
            </span>
            {isFinance && (
              <span className="text-[11px] text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-2.5 py-1.5 rounded-md font-semibold">
                Délégation Trésorerie
              </span>
            )}
            {isAdminOrSuper && (
              <span className="text-[11px] text-black dark:text-zinc-200 bg-gray-100 dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 px-2.5 py-1.5 rounded-md font-semibold">
                Plein Exercice
              </span>
            )}
          </div>
        </div>

        {/* Navigation Sub-Tabs */}
        <div className="flex items-center gap-2 border-b border-gray-200 dark:border-zinc-800 pb-3 overflow-x-auto text-xs scrollbar-none">
          {(isFinance || isAdminOrSuper) && (
            <button
              onClick={() => setAdminTab('TRESORERIE')}
              className={`px-4 py-2 rounded-xl font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                adminTab === 'TRESORERIE'
                  ? 'bg-[#E5B824] text-black shadow-xs'
                  : 'bg-gray-100 dark:bg-zinc-900 text-gray-700 dark:text-zinc-300 hover:text-black dark:hover:text-white'
              }`}
            >
              <Banknote className="w-3.5 h-3.5" />
              <span>Trésorerie & Encaissements ({transactions.filter((t) => t.status === 'EN_ATTENTE').length})</span>
            </button>
          )}

          {(isFinance || isAdminOrSuper) && (
            <button
              onClick={() => setAdminTab('PARAMETRES_FINANCIERS')}
              className={`px-4 py-2 rounded-xl font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                adminTab === 'PARAMETRES_FINANCIERS'
                  ? 'bg-[#E5B824] text-black shadow-xs'
                  : 'bg-gray-100 dark:bg-zinc-900 text-gray-700 dark:text-zinc-300 hover:text-black dark:hover:text-white'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Paramètres Financiers & Tarifs</span>
            </button>
          )}

          {isAdminOrSuper && (
            <button
              onClick={() => setAdminTab('MEMBRES')}
              className={`px-4 py-2 rounded-xl font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                adminTab === 'MEMBRES'
                  ? 'bg-[#E5B824] text-black shadow-xs'
                  : 'bg-gray-100 dark:bg-zinc-900 text-gray-700 dark:text-zinc-300 hover:text-black dark:hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Adhésions & Membres ({pendingMembers.length})</span>
            </button>
          )}

          {isAdminOrSuper && (
            <button
              onClick={() => setAdminTab('PROMOTIONS_PARAM')}
              className={`px-4 py-2 rounded-xl font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                adminTab === 'PROMOTIONS_PARAM'
                  ? 'bg-[#E5B824] text-black shadow-xs'
                  : 'bg-gray-100 dark:bg-zinc-900 text-gray-700 dark:text-zinc-300 hover:text-black dark:hover:text-white'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Données des Promotions</span>
            </button>
          )}

          {(isAdminOrSuper || isComm) && (
            <button
              onClick={() => setAdminTab('PROJETS')}
              className={`px-4 py-2 rounded-xl font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                adminTab === 'PROJETS'
                  ? 'bg-[#E5B824] text-black shadow-xs'
                  : 'bg-gray-100 dark:bg-zinc-900 text-gray-700 dark:text-zinc-300 hover:text-black dark:hover:text-white'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Projets & Chantiers</span>
            </button>
          )}

          {(isAdminOrSuper || isComm) && (
            <button
              onClick={() => setAdminTab('COMMUNICATION')}
              className={`px-4 py-2 rounded-xl font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                adminTab === 'COMMUNICATION'
                  ? 'bg-[#E5B824] text-black shadow-xs'
                  : 'bg-gray-100 dark:bg-zinc-900 text-gray-700 dark:text-zinc-300 hover:text-black dark:hover:text-white'
              }`}
            >
              <Megaphone className="w-3.5 h-3.5" />
              <span>Communication Officielle</span>
            </button>
          )}

          {isAdminOrSuper && (
            <button
              onClick={() => setAdminTab('PARAMETRES_GENERAUX')}
              className={`px-4 py-2 rounded-xl font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                adminTab === 'PARAMETRES_GENERAUX'
                  ? 'bg-[#E5B824] text-black shadow-xs'
                  : 'bg-gray-100 dark:bg-zinc-900 text-gray-700 dark:text-zinc-300 hover:text-black dark:hover:text-white'
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Gouvernance & Textes</span>
            </button>
          )}

          {(isFinance || isAdminOrSuper) && (
            <button
              onClick={() => setAdminTab('EXPORTS')}
              className={`px-4 py-2 rounded-xl font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                adminTab === 'EXPORTS'
                  ? 'bg-[#E5B824] text-black shadow-xs'
                  : 'bg-gray-100 dark:bg-zinc-900 text-gray-700 dark:text-zinc-300 hover:text-black dark:hover:text-white'
              }`}
            >
              <Download className="w-3.5 h-3.5" />
              <span>Exports & Grand Livre</span>
            </button>
          )}
        </div>

        {/* TAB 1: TRESORERIE & ENCAISSEMENTS */}
        {adminTab === 'TRESORERIE' && (
          <div className="space-y-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-5 space-y-1">
                <span className="text-[10px] uppercase tracking-wider text-gray-500 dark:text-zinc-400 font-semibold block">
                  Droits d’Adhésion Encaissés
                </span>
                <div className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-black dark:text-white">
                  {transactions
                    .filter((t) => t.type === 'DROIT_ADHESION' && t.status === 'PAYE')
                    .reduce((sum, t) => sum + t.amount, 0)
                    .toLocaleString('fr-FR')}{' '}
                  {settings.currency}
                </div>
                <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium block">
                  {transactions.filter((t) => t.type === 'DROIT_ADHESION' && t.status === 'PAYE').length} adhésions statutaires
                </span>
              </div>

              <div className="bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-5 space-y-1">
                <span className="text-[10px] uppercase tracking-wider text-gray-500 dark:text-zinc-400 font-semibold block">
                  Cotisations Mensuelles
                </span>
                <div className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-[#B8860B] dark:text-[#E5B824]">
                  {transactions
                    .filter((t) => t.type === 'COTISATION_MENSUELLE' && t.status === 'PAYE')
                    .reduce((sum, t) => sum + t.amount, 0)
                    .toLocaleString('fr-FR')}{' '}
                  {settings.currency}
                </div>
                <span className="text-[11px] text-gray-600 dark:text-zinc-400 block">Exercice {settings.fiscalYear}</span>
              </div>

              <div className="bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-5 space-y-1">
                <span className="text-[10px] uppercase tracking-wider text-gray-500 dark:text-zinc-400 font-semibold block">
                  Dons & Mécénat Projets
                </span>
                <div className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-emerald-700 dark:text-emerald-400">
                  {transactions
                    .filter((t) => t.type === 'DON_PROJET' && t.status === 'PAYE')
                    .reduce((sum, t) => sum + t.amount, 0)
                    .toLocaleString('fr-FR')}{' '}
                  {settings.currency}
                </div>
                <span className="text-[11px] text-gray-600 dark:text-zinc-400 block">Projets Lycée</span>
              </div>

              <div className="bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-5 space-y-1">
                <span className="text-[10px] uppercase tracking-wider text-gray-500 dark:text-zinc-400 font-semibold block">
                  En Attente de Pointage
                </span>
                <div className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-amber-700 dark:text-amber-400">
                  {transactions
                    .filter((t) => t.status === 'EN_ATTENTE')
                    .reduce((sum, t) => sum + t.amount, 0)
                    .toLocaleString('fr-FR')}{' '}
                  {settings.currency}
                </div>
                <span className="text-[11px] text-amber-700 dark:text-amber-400 font-medium block">
                  {transactions.filter((t) => t.status === 'EN_ATTENTE').length} règlements à pointer
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-4 sm:p-5">
              <div className="flex flex-wrap items-center gap-2">
                <input
                  type="text"
                  placeholder="Rechercher par membre ou référence..."
                  value={txSearch}
                  onChange={(e) => setTxSearch(e.target.value)}
                  className="bg-white dark:bg-zinc-950 border border-gray-300 dark:border-zinc-700 focus:border-[#E5B824] rounded-lg px-3 py-1.5 text-xs text-black dark:text-white placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none min-w-[220px]"
                />

                <select
                  value={txFilterStatus}
                  onChange={(e) => setTxFilterStatus(e.target.value)}
                  className="bg-white dark:bg-zinc-950 border border-gray-300 dark:border-zinc-700 focus:border-[#E5B824] rounded-lg px-3 py-1.5 text-xs text-black dark:text-white focus:outline-none"
                >
                  <option value="ALL">Tous les statuts</option>
                  <option value="EN_ATTENTE">En attente de validation</option>
                  <option value="PAYE">Payé & Pointé</option>
                  <option value="ANNULE">Rejeté / Annulé</option>
                </select>

                <select
                  value={txFilterType}
                  onChange={(e) => setTxFilterType(e.target.value)}
                  className="bg-white dark:bg-zinc-950 border border-gray-300 dark:border-zinc-700 focus:border-[#E5B824] rounded-lg px-3 py-1.5 text-xs text-black dark:text-white focus:outline-none"
                >
                  <option value="ALL">Toutes les natures</option>
                  <option value="DROIT_ADHESION">Droits d'adhésion</option>
                  <option value="COTISATION_MENSUELLE">Cotisations mensuelles</option>
                  <option value="DON_PROJET">Dons aux projets</option>
                  <option value="AUTRE">Autres contributions</option>
                </select>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => openQrSyncModal(null)}
                  className="px-4 py-2 bg-black dark:bg-zinc-950 dark:border dark:border-[#E5B824]/50 text-[#E5B824] font-semibold text-xs rounded-xl hover:bg-gray-900 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <QrCode className="w-4 h-4" />
                  <span>Flasher QR Carte</span>
                </button>
                <button
                  onClick={() => setManualModalOpen(true)}
                  className="px-4 py-2 bg-[#E5B824] text-black font-semibold text-xs rounded-xl hover:bg-[#dcae1f] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Encaisser au Guichet (Espèces / Chèque)</span>
                </button>
              </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-gray-700 dark:text-zinc-300">
                  <thead className="bg-gray-50 dark:bg-zinc-950 text-gray-600 dark:text-zinc-400 text-[10px] uppercase border-b border-gray-200 dark:border-zinc-800 font-bold tracking-wider">
                    <tr>
                      <th className="p-3.5">Référence / Date</th>
                      <th className="p-3.5">Membre & Promo</th>
                      <th className="p-3.5">Nature du Règlement</th>
                      <th className="p-3.5">Mode</th>
                      <th className="p-3.5">Montant</th>
                      <th className="p-3.5">État</th>
                      <th className="p-3.5 text-right">Actions Trésorerie</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-zinc-800 font-sans">
                    {filteredTransactions.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-gray-500 dark:text-zinc-400">
                          Aucune transaction correspondant aux critères sélectionnés.
                        </td>
                      </tr>
                    ) : (
                      filteredTransactions.map((tx) => (
                        <tr key={tx.id} className="hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors">
                          <td className="p-3.5">
                            <div className="font-mono text-black dark:text-white font-semibold">{tx.reference}</div>
                            <div className="text-[10px] text-gray-500 dark:text-zinc-400">{tx.date}</div>
                          </td>
                          <td className="p-3.5">
                            <div className="font-semibold text-black dark:text-white">{tx.memberName}</div>
                            <div className="text-[10px] text-gray-500 dark:text-zinc-400 font-mono">Promo {tx.promotionYear}</div>
                          </td>
                          <td className="p-3.5">
                            <div className="text-gray-800 dark:text-zinc-200">{tx.title}</div>
                            {tx.monthYears && tx.monthYears.length > 0 && (
                              <div className="text-[10px] text-gray-500 dark:text-zinc-400">
                                {tx.monthYears.length} mois : {tx.monthYears.join(', ')}
                              </div>
                            )}
                          </td>
                          <td className="p-3.5">
                            <span className="px-2 py-0.5 rounded bg-gray-100 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-[10px] font-mono text-gray-700 dark:text-zinc-300">
                              {tx.method.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="p-3.5">
                            <span className="font-mono tabular-nums font-bold text-black dark:text-white">
                              {tx.amount.toLocaleString('fr-FR')} {tx.currency}
                            </span>
                          </td>
                          <td className="p-3.5">
                            {tx.status === 'PAYE' ? (
                              <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded-md font-semibold">
                                <CheckCircle className="w-3 h-3" />
                                <span>Validé</span>
                              </span>
                            ) : tx.status === 'EN_ATTENTE' ? (
                              <span className="inline-flex items-center gap-1 text-[10px] text-amber-800 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 px-2 py-0.5 rounded-md font-semibold">
                                <AlertCircle className="w-3 h-3" />
                                <span>À Pointer</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[10px] text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 px-2 py-0.5 rounded-md font-semibold">
                                <XCircle className="w-3 h-3" />
                                <span>Rejeté</span>
                              </span>
                            )}
                          </td>
                          <td className="p-3.5 text-right space-x-1 whitespace-nowrap">
                            <button
                              onClick={() => setViewingTransactionReceipt(tx)}
                              title="Consulter le reçu officiel"
                              className="p-1.5 hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-600 dark:text-zinc-400 hover:text-[#B8860B] dark:hover:text-[#E5B824] rounded cursor-pointer"
                            >
                              <Receipt className="w-4 h-4 inline" />
                            </button>

                            {tx.status === 'EN_ATTENTE' && (
                              <>
                                <button
                                  onClick={() => updateTransactionStatus(tx.id, 'PAYE', settings.treasurerName)}
                                  title="Valider l'encaissement"
                                  className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded text-[10px] cursor-pointer inline-flex items-center gap-1"
                                >
                                  <CheckCircle className="w-3 h-3" />
                                  <span>Valider</span>
                                </button>
                                <button
                                  onClick={() => updateTransactionStatus(tx.id, 'ANNULE', settings.treasurerName)}
                                  title="Rejeter ce règlement"
                                  className="px-2 py-1 bg-red-50 dark:bg-red-950/60 hover:bg-red-100 dark:hover:bg-red-900/60 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800 rounded text-[10px] cursor-pointer inline-flex items-center gap-1"
                                >
                                  <XCircle className="w-3 h-3" />
                                  <span>Rejeter</span>
                                </button>
                              </>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PARAMETRES FINANCIERS & TARIFS */}
        {adminTab === 'PARAMETRES_FINANCIERS' && (
          <div className="space-y-8">
            <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-gray-200 dark:border-zinc-800">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-[#B8860B] dark:text-[#E5B824] font-bold flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5" />
                    <span>Délégation Profil Finance & Trésorerie</span>
                  </span>
                  <h3 className="text-xl font-bold font-heading text-black dark:text-white mt-1">
                    Paramétrage des Données Variables Financières
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-zinc-400 mt-1">
                    Configurez les montants statutaires, l'exercice budgétaire, les numéros marchands Mobile Money et les coordonnées bancaires de l'Amicale.
                  </p>
                </div>

                <div className="p-3 bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl text-right">
                  <span className="text-[10px] text-gray-500 dark:text-zinc-400 block uppercase font-semibold">Cotisation Annuelle Pleine</span>
                  <span className="text-lg font-mono tabular-nums font-bold text-[#B8860B] dark:text-[#E5B824]">
                    {(financeForm.cotisationMensuelleAmount * 12).toLocaleString('fr-FR')} {financeForm.currency}
                  </span>
                </div>
              </div>

              <form onSubmit={handleSaveFinancialSettings} className="space-y-6 text-xs">
                <div>
                  <h4 className="text-sm font-bold text-black dark:text-white mb-3 flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-[#B8860B] dark:text-[#E5B824]" />
                    <span>1. Tarifs Statutaires des Droits et Cotisations</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="space-y-1">
                      <label className="block text-gray-700 dark:text-zinc-300 font-semibold">
                        Droits d'adhésion initiale ({financeForm.currency})
                      </label>
                      <input
                        type="number"
                        min="1000"
                        step="500"
                        required
                        value={financeForm.droitAdhesionAmount}
                        onChange={(e) => setFinanceForm({ ...financeForm, droitAdhesionAmount: Number(e.target.value) })}
                        className={`${inputClass} font-mono font-bold`}
                      />
                      <span className="text-[10px] text-gray-500 dark:text-zinc-400">Payable une seule fois lors de l'adhésion</span>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-gray-700 dark:text-zinc-300 font-semibold">
                        Cotisation mensuelle ordinaire ({financeForm.currency})
                      </label>
                      <input
                        type="number"
                        min="500"
                        step="500"
                        required
                        value={financeForm.cotisationMensuelleAmount}
                        onChange={(e) => setFinanceForm({ ...financeForm, cotisationMensuelleAmount: Number(e.target.value) })}
                        className={`${inputClass} font-mono font-bold`}
                      />
                      <span className="text-[10px] text-gray-500 dark:text-zinc-400">Montant par mois civil (base du calcul)</span>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-gray-700 dark:text-zinc-300 font-semibold">Exercice fiscal en cours</label>
                      <input
                        type="number"
                        min="2020"
                        max="2035"
                        required
                        value={financeForm.fiscalYear}
                        onChange={(e) => setFinanceForm({ ...financeForm, fiscalYear: Number(e.target.value) })}
                        className={`${inputClass} font-mono font-bold`}
                      />
                      <span className="text-[10px] text-gray-500 dark:text-zinc-400">Année comptable de référence</span>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-gray-700 dark:text-zinc-300 font-semibold">Délai de grâce impayés (mois)</label>
                      <input
                        type="number"
                        min="1"
                        max="6"
                        required
                        value={financeForm.overdueGraceMonths}
                        onChange={(e) => setFinanceForm({ ...financeForm, overdueGraceMonths: Number(e.target.value) })}
                        className={`${inputClass} font-mono`}
                      />
                      <span className="text-[10px] text-gray-500 dark:text-zinc-400">Mois d'arriéré avant alerte rouge</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200 dark:border-zinc-800">
                  <h4 className="text-sm font-bold text-black dark:text-white mb-3 flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-[#B8860B] dark:text-[#E5B824]" />
                    <span>2. Comptes Marchands Mobile Money de Réception</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="block text-[#d96200] dark:text-orange-400 font-semibold">Compte Marchand Orange Money</label>
                      <input
                        type="text"
                        required
                        value={financeForm.orangeMoneyMerchantNumber}
                        onChange={(e) => setFinanceForm({ ...financeForm, orangeMoneyMerchantNumber: e.target.value })}
                        className={`${inputClass} font-mono`}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[#B8860B] dark:text-[#E5B824] font-semibold">Compte Marchand MTN Mobile Money</label>
                      <input
                        type="text"
                        required
                        value={financeForm.mtnMoMoMerchantNumber}
                        onChange={(e) => setFinanceForm({ ...financeForm, mtnMoMoMerchantNumber: e.target.value })}
                        className={`${inputClass} font-mono`}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[#0082c3] dark:text-sky-400 font-semibold">Compte Marchand Moov Money</label>
                      <input
                        type="text"
                        required
                        value={financeForm.moovMoneyMerchantNumber}
                        onChange={(e) => setFinanceForm({ ...financeForm, moovMoneyMerchantNumber: e.target.value })}
                        className={`${inputClass} font-mono`}
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200 dark:border-zinc-800">
                  <h4 className="text-sm font-bold text-black dark:text-white mb-3 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-[#B8860B] dark:text-[#E5B824]" />
                    <span>3. Coordonnées Bancaires Officielles & Signataire</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="space-y-1">
                      <label className="block text-gray-700 dark:text-zinc-300 font-semibold">Nom de la Banque</label>
                      <input
                        type="text"
                        required
                        value={financeForm.bankName}
                        onChange={(e) => setFinanceForm({ ...financeForm, bankName: e.target.value })}
                        className={inputClass}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-gray-700 dark:text-zinc-300 font-semibold">Code Relevé d'Identité Bancaire (RIB)</label>
                      <input
                        type="text"
                        required
                        value={financeForm.bankRib}
                        onChange={(e) => setFinanceForm({ ...financeForm, bankRib: e.target.value })}
                        className={`${inputClass} font-mono`}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-gray-700 dark:text-zinc-300 font-semibold">Numéro IBAN International</label>
                      <input
                        type="text"
                        required
                        value={financeForm.bankIban}
                        onChange={(e) => setFinanceForm({ ...financeForm, bankIban: e.target.value })}
                        className={`${inputClass} font-mono`}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-gray-700 dark:text-zinc-300 font-semibold">Trésorier Général Signataire</label>
                      <input
                        type="text"
                        required
                        value={financeForm.treasurerName}
                        onChange={(e) => setFinanceForm({ ...financeForm, treasurerName: e.target.value })}
                        className={inputClass}
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#E5B824] text-black font-semibold text-xs rounded-xl hover:bg-[#dcae1f] transition-all flex items-center gap-2 cursor-pointer shadow-sm"
                  >
                    <Save className="w-4 h-4" />
                    <span>Enregistrer les Paramètres Financiers</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* TAB 3: VALIDATION DES ADHESIONS & MEMBRES */}
        {adminTab === 'MEMBRES' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-2 border-b border-gray-200 dark:border-zinc-800">
              <h3 className="text-base font-bold font-heading text-black dark:text-white">
                Dossiers d'Adhésion en Attente de Validation ({pendingMembers.length})
              </h3>
            </div>

            {pendingMembers.length === 0 ? (
              <div className="bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-10 text-center text-gray-500 dark:text-zinc-400 space-y-2">
                <CheckCircle className="w-8 h-8 text-emerald-600 dark:text-emerald-400 mx-auto" />
                <p className="text-sm text-black dark:text-white font-semibold">Tous les dossiers d'adhésion ont été traités.</p>
                <p className="text-xs text-gray-500 dark:text-zinc-400">Aucune demande en attente de validation.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {pendingMembers.map((member) => (
                  <div
                    key={member.id}
                    className="bg-white dark:bg-zinc-900 border border-yellow-300 dark:border-yellow-500/40 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xs"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs text-[#B8860B] dark:text-[#E5B824] font-bold">{member.membershipCardId}</span>
                        <span className="text-xs text-gray-600 dark:text-zinc-400">· Promotion {member.promotionYear}</span>
                        {member.nickname && (
                          <span className="text-[11px] font-semibold text-[#B8860B] dark:text-[#E5B824]">
                            « {member.nickname} »
                          </span>
                        )}
                        {member.studyLevel && (
                          <span className="text-[10px] text-gray-700 dark:text-zinc-300 bg-gray-100 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 px-2 py-0.5 rounded">
                            {member.studyLevel}
                          </span>
                        )}
                        {member.bdrRegistered && (
                          <span className="text-[10px] text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded font-semibold">
                            BDR Référencé
                          </span>
                        )}
                      </div>
                      <h4 className="text-base font-bold text-black dark:text-white font-heading">
                        {member.firstName} {member.lastName}
                      </h4>
                      <p className="text-xs text-gray-700 dark:text-zinc-300">
                        {member.profession} — {member.currentRole} chez {member.company} ({member.city}{member.commune ? `, ${member.commune}` : ''}, {member.country})
                      </p>
                      <div className="flex flex-wrap items-center gap-2 text-[11px] text-gray-500 dark:text-zinc-400">
                        <span>Email : {member.email}</span>
                        <span>·</span>
                        <span>Tél : {member.phone || 'Non renseigné'}</span>
                        {member.whatsapp && <span>· WhatsApp : {member.whatsapp}</span>}
                      </div>
                      {member.skills && member.skills.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1 pt-1">
                          <span className="text-[10px] text-gray-600 dark:text-zinc-400 font-semibold">Compétences BDR :</span>
                          {member.skills.map((s, i) => (
                            <span key={i} className="text-[10px] bg-gray-100 dark:bg-zinc-800 text-gray-800 dark:text-zinc-200 border border-gray-200 dark:border-zinc-700 px-1.5 py-0.5 rounded">
                              {s}
                            </span>
                          ))}
                        </div>
                      )}
                      {member.certifications && member.certifications.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1">
                          <span className="text-[10px] text-[#B8860B] dark:text-[#E5B824] font-semibold">Certifications :</span>
                          {member.certifications.map((c, i) => (
                            <span key={i} className="text-[10px] bg-yellow-50 dark:bg-yellow-500/15 text-[#B8860B] dark:text-[#E5B824] border border-yellow-200 dark:border-yellow-500/30 px-1.5 py-0.5 rounded">
                              {c}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => setViewingCardMember(member)}
                        className="px-3 py-1.5 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 text-black dark:text-white font-medium border border-gray-300 dark:border-zinc-700 rounded text-xs cursor-pointer"
                      >
                        Examiner
                      </button>
                      <button
                        onClick={() => rejectMember(member.id)}
                        className="px-3 py-1.5 bg-red-50 dark:bg-red-950/60 hover:bg-red-100 dark:hover:bg-red-900/60 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800 rounded text-xs cursor-pointer flex items-center gap-1"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Refuser</span>
                      </button>
                      <button
                        onClick={() => approveMember(member.id)}
                        className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded text-xs cursor-pointer flex items-center gap-1 shadow-xs"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Valider & Activer la Carte</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Approved Members Table */}
            <div className="pt-6 border-t border-gray-200 dark:border-zinc-800 space-y-4">
              <h3 className="text-base font-bold font-heading text-black dark:text-white">
                Registre des Membres Validés ({approvedMembers.length})
              </h3>
              <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-gray-700 dark:text-zinc-300">
                    <thead className="bg-gray-50 dark:bg-zinc-950 text-gray-600 dark:text-zinc-400 text-[10px] uppercase border-b border-gray-200 dark:border-zinc-800 font-bold">
                      <tr>
                        <th className="p-3.5">Matricule</th>
                        <th className="p-3.5">Membre & Pseudo</th>
                        <th className="p-3.5">Promotion</th>
                        <th className="p-3.5">Poste / Entreprise</th>
                        <th className="p-3.5">Localisation</th>
                        <th className="p-3.5">Compétences BDR</th>
                        <th className="p-3.5">Statut</th>
                        <th className="p-3.5 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-zinc-800">
                      {approvedMembers.map((m) => (
                        <tr key={m.id} className="hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors">
                          <td className="p-3.5 font-mono text-[#B8860B] dark:text-[#E5B824] font-bold">{m.membershipCardId}</td>
                          <td className="p-3.5">
                            <div className="font-semibold text-black dark:text-white">
                              {m.firstName} {m.lastName}
                            </div>
                            {m.nickname && (
                              <span className="text-[10px] text-[#B8860B] dark:text-[#E5B824] font-medium">
                                « {m.nickname} »
                              </span>
                            )}
                          </td>
                          <td className="p-3.5 font-mono">{m.promotionYear}</td>
                          <td className="p-3.5 text-gray-800 dark:text-zinc-200">
                            <div>{m.currentRole}</div>
                            <div className="text-[10px] text-gray-500 dark:text-zinc-400">{m.company}</div>
                          </td>
                          <td className="p-3.5 text-gray-600 dark:text-zinc-400">
                            {m.city} {m.commune ? `(${m.commune})` : ''}
                          </td>
                          <td className="p-3.5">
                            <div className="flex flex-wrap gap-1 max-w-[220px]">
                              {m.skills?.slice(0, 2).map((s, i) => (
                                <span key={i} className="text-[9px] bg-gray-100 dark:bg-zinc-800 text-gray-800 dark:text-zinc-200 border border-gray-200 dark:border-zinc-700 px-1.5 py-0.5 rounded">
                                  {s}
                                </span>
                              ))}
                              {(m.skills?.length || 0) > 2 && (
                                <span className="text-[9px] text-[#B8860B] dark:text-[#E5B824] font-semibold">+{m.skills!.length - 2}</span>
                              )}
                            </div>
                          </td>
                          <td className="p-3.5">
                            <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 font-mono">
                              VALIDE {settings.fiscalYear}
                            </span>
                          </td>
                          <td className="p-3.5 text-right">
                            <button
                              onClick={() => setViewingCardMember(m)}
                              className="text-[#B8860B] dark:text-[#E5B824] hover:underline cursor-pointer font-semibold"
                            >
                              Voir Carte
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: DONNEES DES PROMOTIONS */}
        {adminTab === 'PROMOTIONS_PARAM' && (
          <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-gray-200 dark:border-zinc-800">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#B8860B] dark:text-[#E5B824] font-bold flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>Gestionnaire des Promotions</span>
                </span>
                <h3 className="text-xl font-bold font-heading text-black dark:text-white mt-1">
                  Paramétrage des Données Variables des Promotions
                </h3>
                <p className="text-xs text-gray-600 dark:text-zinc-400 mt-1">
                  Sélectionnez une promotion pour éditer sa devise, les coordonnées de son délégué et ses retrouvailles.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <label className="text-xs text-gray-700 dark:text-zinc-300 font-semibold">Choisir la promotion :</label>
                <select
                  value={selectedPromoYear}
                  onChange={(e) => handleSelectPromo(Number(e.target.value))}
                  className="bg-gray-50 dark:bg-zinc-950 border border-gray-300 dark:border-zinc-700 focus:border-[#E5B824] rounded-lg px-3 py-1.5 text-xs text-black dark:text-white font-semibold focus:outline-none"
                >
                  {promotions.map((p) => (
                    <option key={p.year} value={p.year}>
                      Promotion {p.year} - {p.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <form onSubmit={handleSavePromo} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-800 dark:text-zinc-200 font-semibold mb-1">Devise de la Promotion</label>
                  <input
                    type="text"
                    required
                    value={promoForm.motto}
                    onChange={(e) => setPromoForm({ ...promoForm, motto: e.target.value })}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="block text-gray-800 dark:text-zinc-200 font-semibold mb-1">Nom du Délégué Officiel</label>
                  <input
                    type="text"
                    required
                    value={promoForm.delegateName}
                    onChange={(e) => setPromoForm({ ...promoForm, delegateName: e.target.value })}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="block text-gray-800 dark:text-zinc-200 font-semibold mb-1">Contact Délégué (Email / Téléphone)</label>
                  <input
                    type="text"
                    required
                    value={promoForm.delegateContact}
                    onChange={(e) => setPromoForm({ ...promoForm, delegateContact: e.target.value })}
                    className={`${inputClass} font-mono`}
                  />
                </div>

                <div>
                  <label className="block text-gray-800 dark:text-zinc-200 font-semibold mb-1">Date des Prochaines Retrouvailles</label>
                  <input
                    type="date"
                    value={promoForm.nextReunionDate}
                    onChange={(e) => setPromoForm({ ...promoForm, nextReunionDate: e.target.value })}
                    className={inputClass}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-gray-800 dark:text-zinc-200 font-semibold mb-1">Description & Historique de la Promotion</label>
                  <textarea
                    rows={3}
                    required
                    value={promoForm.description}
                    onChange={(e) => setPromoForm({ ...promoForm, description: e.target.value })}
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="flex items-center justify-end pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#E5B824] text-black font-semibold rounded-xl hover:bg-[#dcae1f] flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  <Save className="w-4 h-4" />
                  <span>Enregistrer la Promotion {selectedPromoYear}</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 5: SUIVI DES PROJETS & DONS */}
        {adminTab === 'PROJETS' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {projects.map((proj) => (
                <div key={proj.id} className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-5 space-y-4 shadow-xs">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#B8860B] dark:text-[#E5B824] font-bold">{proj.category}</span>
                    <span className="font-mono text-emerald-700 dark:text-emerald-400 font-bold">{proj.progressPercentage}%</span>
                  </div>
                  <h4 className="text-sm font-bold font-heading text-black dark:text-white leading-snug">
                    {proj.title}
                  </h4>
                  <div className="text-xs text-gray-600 dark:text-zinc-400 space-y-1">
                    <div>
                      Collecté :{' '}
                      <span className="text-black dark:text-white font-semibold font-mono">
                        {proj.budgetRaised.toLocaleString('fr-FR')} {settings.currency}
                      </span>
                    </div>
                    <div>
                      Objectif :{' '}
                      <span className="text-gray-700 dark:text-zinc-300 font-mono">
                        {proj.budgetGoal.toLocaleString('fr-FR')} {settings.currency}
                      </span>
                    </div>
                    <div>
                      Nombre de donateurs : <span className="text-black dark:text-white font-semibold">{proj.contributorsCount}</span>
                    </div>
                    <div>
                      Échéance : <span className="text-gray-700 dark:text-zinc-300 font-mono">{proj.deadline}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: COMMUNICATION OFFICIELLE */}
        {adminTab === 'COMMUNICATION' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-5 shadow-xs">
              <h3 className="text-base font-bold font-heading text-black dark:text-white flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-[#B8860B] dark:text-[#E5B824]" />
                <span>Rédiger et Diffuser un Communiqué Officiel</span>
              </h3>

              <form onSubmit={handlePublishNews} className="space-y-4 text-xs">
                <div>
                  <label className="block text-gray-800 dark:text-zinc-200 font-semibold mb-1">Titre du communiqué</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Rapport de l’Assemblée Générale Ordinaire 2026"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className={inputClass}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-gray-800 dark:text-zinc-200 font-semibold mb-1">Catégorie</label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value as any)}
                      className={inputClass}
                    >
                      <option value="ANNONCES">Annonces</option>
                      <option value="EVENEMENTS">Événements</option>
                      <option value="REUSSITE">Réussite</option>
                      <option value="COMMUNIQUE">Communiqué officiel</option>
                      <option value="VIE_AMICALE">Vie de l’Amicale</option>
                      <option value="EXCELLENCE">Excellence & Mérite</option>
                      <option value="HISTOIRE">Histoire & Mémoire</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-800 dark:text-zinc-200 font-semibold mb-1">Organe émetteur</label>
                    <input
                      type="text"
                      required
                      value={newAuthor}
                      onChange={(e) => setNewAuthor(e.target.value)}
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-800 dark:text-zinc-200 font-semibold mb-1">Résumé synthétique (accroche)</label>
                  <textarea
                    rows={2}
                    required
                    placeholder="Courte description de l'annonce..."
                    value={newSummary}
                    onChange={(e) => setNewSummary(e.target.value)}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="block text-gray-800 dark:text-zinc-200 font-semibold mb-1">Texte intégral du communiqué</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Corps du communiqué officiel..."
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    className={`${inputClass} font-editorial`}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#E5B824] text-black font-semibold rounded-lg hover:bg-[#dcae1f] cursor-pointer shadow-xs"
                >
                  Diffuser sur le site officiel
                </button>
              </form>
            </div>

            <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-4 shadow-xs">
              <h3 className="text-base font-bold font-heading text-black dark:text-white">
                Communiqués Publiés ({news.length})
              </h3>
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                {news.map((item) => (
                  <div key={item.id} className="p-3.5 bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl space-y-2">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-[#B8860B] dark:text-[#E5B824] font-bold">{item.category}</span>
                      <span className="text-gray-500 dark:text-zinc-400 font-mono">{item.date}</span>
                    </div>
                    <h4 className="text-xs font-bold text-black dark:text-white line-clamp-1">{item.title}</h4>
                    <p className="text-[11px] text-gray-600 dark:text-zinc-400 line-clamp-2">{item.summary}</p>
                    <div className="flex items-center justify-between pt-1 text-[10px] text-gray-500 dark:text-zinc-400 border-t border-gray-200 dark:border-zinc-800">
                      <span>Par : {item.author}</span>
                      <button
                        onClick={() => deleteNewsItem(item.id)}
                        className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Supprimer</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {canEnrichAi && (
              <div className="lg:col-span-2 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200 dark:border-zinc-800">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#B8860B] dark:text-[#E5B824] font-bold flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Base de Connaissances · Assistant IA ALGB</span>
                    </span>
                    <h3 className="text-base font-bold font-heading text-black dark:text-white mt-1">
                      Enrichir l’Assistant IA depuis votre Profil & Directives Officielles
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-zinc-400 mt-0.5">
                      Les administrateurs et le pôle Communication peuvent injecter leurs données de profil ou des notes officielles directement dans l’assistant flottant.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setAiChatOpen(true)}
                    className="px-4 py-2 rounded-lg bg-black dark:bg-[#E5B824] hover:bg-gray-900 dark:hover:bg-[#dcae1f] text-[#E5B824] dark:text-black text-xs font-bold flex items-center gap-2 cursor-pointer shrink-0 self-start sm:self-center"
                  >
                    <MessageSquareText className="w-4 h-4" />
                    <span>Tester l’Assistant IA</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Left: Profile Sync + Manual Form */}
                  <div className="space-y-5">
                    <div className="p-4 rounded-xl bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 space-y-3 text-xs">
                      <div className="font-bold text-black dark:text-white flex items-center gap-2">
                        <UserCheck className="w-4 h-4 text-[#B8860B] dark:text-[#E5B824]" />
                        <span>
                          Synchroniser depuis le profil actif (
                          {currentUser
                            ? `${currentUser.firstName} ${currentUser.lastName} · Promo ${currentUser.promotionYear}`
                            : currentRole}
                          )
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-600 dark:text-zinc-400 leading-relaxed">
                        {currentUser
                          ? `Extrait : fonction (${currentUser.currentRole} chez ${currentUser.company}), secteur (${currentUser.sector}), ville (${currentUser.city}, ${currentUser.country}), expertises BDR et présentation.`
                          : 'Synchronise votre rôle officiel actif dans la base de connaissances de l’assistant.'}
                      </p>
                      <textarea
                        rows={2}
                        value={aiProfileNote}
                        onChange={(e) => setAiProfileNote(e.target.value)}
                        placeholder="Note complémentaire de votre profil à transmettre à l’IA (optionnel)..."
                        className={inputClass}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          enrichAiFromCurrentProfile(aiProfileNote);
                          setAiProfileNote('');
                        }}
                        className="w-full py-2.5 px-4 rounded-lg bg-black dark:bg-zinc-800 dark:border dark:border-[#E5B824]/50 hover:bg-gray-900 dark:hover:bg-zinc-700 text-[#E5B824] font-bold text-xs cursor-pointer flex items-center justify-center gap-2"
                      >
                        <UserCheck className="w-4 h-4" />
                        <span>Enrichir l’IA avec mon profil</span>
                      </button>
                    </div>

                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (!aiEntryTitle.trim() || !aiEntryContent.trim()) return;
                        const added = addAiKnowledgeEntry({
                          title: aiEntryTitle,
                          category: aiEntryCategory,
                          content: aiEntryContent,
                        });
                        if (added) {
                          setAiEntryTitle('');
                          setAiEntryContent('');
                        }
                      }}
                      className="p-4 rounded-xl bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 space-y-3 text-xs"
                    >
                      <div className="font-bold text-black dark:text-white flex items-center gap-2">
                        <PlusCircle className="w-4 h-4 text-[#B8860B] dark:text-[#E5B824]" />
                        <span>Ajouter une nouvelle connaissance IA</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input
                          type="text"
                          required
                          value={aiEntryTitle}
                          onChange={(e) => setAiEntryTitle(e.target.value)}
                          placeholder="Titre de la directive"
                          className={inputClass}
                        />
                        <select
                          value={aiEntryCategory}
                          onChange={(e) =>
                            setAiEntryCategory(e.target.value as AiKnowledgeCategory)
                          }
                          className={inputClass}
                        >
                          <option value="AMICALE">Vie de l’Amicale</option>
                          <option value="ADHESION">Adhésion & Cotisations</option>
                          <option value="EVENEMENTS">Événements & Agenda</option>
                          <option value="PROFIL_OFFICIEL">Profil Référent</option>
                        </select>
                      </div>
                      <textarea
                        rows={3}
                        required
                        value={aiEntryContent}
                        onChange={(e) => setAiEntryContent(e.target.value)}
                        placeholder="Contenu détaillé pour l’assistant IA..."
                        className={inputClass}
                      />
                      <button
                        type="submit"
                        className="w-full py-2.5 px-4 rounded-lg bg-[#E5B824] hover:bg-[#dcae1f] text-black font-semibold text-xs cursor-pointer"
                      >
                        Ajouter à l’Assistant IA
                      </button>
                    </form>
                  </div>

                  {/* Right: Active Knowledge Base List */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs font-bold text-black dark:text-white">
                      <span>Base de connaissances active ({aiKnowledgeEntries.length})</span>
                      <span className="text-[11px] font-normal text-gray-500 dark:text-zinc-400 tabular-nums">
                        {aiKnowledgeEntries.filter((e) => e.isActive).length} actives
                      </span>
                    </div>
                    <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
                      {aiKnowledgeEntries.map((entry) => (
                        <div
                          key={entry.id}
                          className={`p-3.5 rounded-xl border text-xs space-y-1.5 ${
                            entry.isActive
                              ? 'bg-gray-50 dark:bg-zinc-950 border-gray-200 dark:border-zinc-800'
                              : 'bg-gray-50/50 dark:bg-zinc-950/50 border-gray-200 dark:border-zinc-800 opacity-60'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="text-[10px] text-gray-500 dark:text-zinc-400 flex flex-wrap items-center gap-1.5">
                                <span className="font-bold text-[#B8860B] dark:text-[#E5B824] uppercase">
                                  {entry.source === 'PROFIL' ? 'Profil' : 'Directive'}
                                </span>
                                <span aria-hidden="true">·</span>
                                <span>{entry.category}</span>
                                <span aria-hidden="true">·</span>
                                <span className="font-mono tabular-nums">{entry.updatedAt}</span>
                              </div>
                              <h4 className="font-bold text-black dark:text-white mt-0.5">{entry.title}</h4>
                            </div>

                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                type="button"
                                onClick={() => toggleAiKnowledgeEntry(entry.id)}
                                title={entry.isActive ? 'Désactiver' : 'Activer'}
                                className="p-1.5 rounded-lg bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 hover:border-black dark:hover:border-[#E5B824] text-gray-700 dark:text-zinc-300 cursor-pointer"
                              >
                                {entry.isActive ? (
                                  <Eye className="w-3.5 h-3.5" />
                                ) : (
                                  <EyeOff className="w-3.5 h-3.5" />
                                )}
                              </button>
                              <button
                                type="button"
                                onClick={() => deleteAiKnowledgeEntry(entry.id)}
                                title="Supprimer"
                                className="p-1.5 rounded-lg bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 hover:border-red-500 text-red-600 dark:text-red-400 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                          <p className="text-[11px] text-gray-700 dark:text-zinc-300 leading-relaxed">{entry.content}</p>
                          <div className="text-[10px] text-gray-500 dark:text-zinc-400">
                            Par : {entry.authorName} ({entry.authorRole})
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 7: PARAMETRES GENERAUX & GOUVERNANCE */}
        {adminTab === 'PARAMETRES_GENERAUX' && (
          <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="pb-4 border-b border-gray-200 dark:border-zinc-800">
              <span className="text-[10px] uppercase tracking-wider text-[#B8860B] dark:text-[#E5B824] font-bold flex items-center gap-1.5">
                <Settings className="w-3.5 h-3.5" />
                <span>Plein Exercice Administration</span>
              </span>
              <h3 className="text-xl font-bold font-heading text-black dark:text-white mt-1">
                Paramètres Institutionnels & Identité de l'Amicale
              </h3>
              <p className="text-xs text-gray-600 dark:text-zinc-400 mt-1">
                Personnalisez les coordonnées du siège, les signataires officiels, la devise et le message central de l'ALGB.
              </p>
            </div>

            <form onSubmit={handleSaveGeneralSettings} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-gray-800 dark:text-zinc-200 font-semibold mb-1">Raison Sociale Officielle</label>
                  <input
                    type="text"
                    required
                    value={generalForm.associationName}
                    onChange={(e) => setGeneralForm({ ...generalForm, associationName: e.target.value })}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="block text-gray-800 dark:text-zinc-200 font-semibold mb-1">Signature Institutionnelle</label>
                  <input
                    type="text"
                    required
                    value={generalForm.associationSignature}
                    onChange={(e) => setGeneralForm({ ...generalForm, associationSignature: e.target.value })}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="block text-gray-800 dark:text-zinc-200 font-semibold mb-1">Message Central</label>
                  <input
                    type="text"
                    required
                    value={generalForm.associationMessage}
                    onChange={(e) => setGeneralForm({ ...generalForm, associationMessage: e.target.value })}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="block text-gray-800 dark:text-zinc-200 font-semibold mb-1">Président du Bureau Exécutif</label>
                  <input
                    type="text"
                    required
                    value={generalForm.presidentName}
                    onChange={(e) => setGeneralForm({ ...generalForm, presidentName: e.target.value })}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="block text-gray-800 dark:text-zinc-200 font-semibold mb-1">Secrétaire Général</label>
                  <input
                    type="text"
                    required
                    value={generalForm.secretaryGeneralName}
                    onChange={(e) => setGeneralForm({ ...generalForm, secretaryGeneralName: e.target.value })}
                    className={inputClass}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-gray-800 dark:text-zinc-200 font-semibold mb-1">Adresse Officielle du Siège</label>
                  <input
                    type="text"
                    required
                    value={generalForm.headquartersAddress}
                    onChange={(e) => setGeneralForm({ ...generalForm, headquartersAddress: e.target.value })}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="block text-gray-800 dark:text-zinc-200 font-semibold mb-1">Email Officiel</label>
                  <input
                    type="email"
                    required
                    value={generalForm.officialEmail}
                    onChange={(e) => setGeneralForm({ ...generalForm, officialEmail: e.target.value })}
                    className={`${inputClass} font-mono`}
                  />
                </div>

                <div>
                  <label className="block text-gray-800 dark:text-zinc-200 font-semibold mb-1">Téléphone de Contact</label>
                  <input
                    type="text"
                    required
                    value={generalForm.officialPhone}
                    onChange={(e) => setGeneralForm({ ...generalForm, officialPhone: e.target.value })}
                    className={`${inputClass} font-mono`}
                  />
                </div>

                <div className="sm:col-span-2 pt-2 border-t border-gray-200 dark:border-zinc-800">
                  <label className="block text-[#B8860B] dark:text-[#E5B824] font-bold mb-1 flex items-center justify-between">
                    <span>Passerelle Webhook Google Apps Script / Google Sheets (Stratégie Enrôlement)</span>
                    <span className="text-[10px] text-gray-500 dark:text-zinc-400 font-normal">algbannuaire.netlify.app</span>
                  </label>
                  <input
                    type="url"
                    value={generalForm.googleScriptUrl}
                    onChange={(e) => setGeneralForm({ ...generalForm, googleScriptUrl: e.target.value })}
                    placeholder="https://script.google.com/macros/s/.../exec"
                    className={`${inputClass} font-mono text-xs`}
                  />
                  <p className="text-[11px] text-gray-600 dark:text-zinc-400 mt-1">
                    URL du déploiement Webhook Apps Script recevant chaque enrôlement d’adhérent en temps réel (POST asynchrone no-cors et sauvegarde locale).
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end pt-3">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#E5B824] text-black font-semibold rounded-xl hover:bg-[#dcae1f] flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  <Save className="w-4 h-4" />
                  <span>Mettre à Jour la Gouvernance</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 8: EXPORTS CSV & GRAND LIVRE */}
        {adminTab === 'EXPORTS' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-5 shadow-xs">
              <h3 className="text-base font-bold font-heading text-black dark:text-white flex items-center gap-2">
                <Banknote className="w-5 h-5 text-[#B8860B] dark:text-[#E5B824]" />
                <span>Grand Livre & Journal Comptable (Trésorerie)</span>
              </h3>

              <p className="text-gray-700 dark:text-zinc-300 leading-relaxed">
                Exportez l'intégralité des transactions, encaissements par Mobile Money, virements SGBCI et espèces avec leurs références, statuts et numéros de quittances.
              </p>

              <div className="p-4 rounded-xl bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 space-y-2">
                <div className="flex items-center justify-between text-gray-800 dark:text-zinc-200 font-medium">
                  <span>Transactions enregistrées :</span>
                  <span className="font-mono text-[#B8860B] dark:text-[#E5B824] font-bold">{transactions.length} écritures</span>
                </div>
                <div className="flex items-center justify-between text-gray-800 dark:text-zinc-200 font-medium">
                  <span>Total Encaissé ({settings.fiscalYear}) :</span>
                  <span className="font-mono text-emerald-700 dark:text-emerald-400 font-bold">
                    {transactions
                      .filter((t) => t.status === 'PAYE')
                      .reduce((sum, t) => sum + t.amount, 0)
                      .toLocaleString('fr-FR')}{' '}
                    {settings.currency}
                  </span>
                </div>
              </div>

              <button
                onClick={handleExportGrandLivreCSV}
                className="w-full py-3 bg-[#E5B824] text-black font-semibold rounded-xl hover:bg-[#dcae1f] flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <Download className="w-4 h-4" />
                <span>Télécharger le Grand Livre (CSV)</span>
              </button>
            </div>

            <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-5 shadow-xs">
              <h3 className="text-base font-bold font-heading text-black dark:text-white flex items-center gap-2">
                <Download className="w-5 h-5 text-[#B8860B] dark:text-[#E5B824]" />
                <span>Registre Officiel des Membres & Diplômés</span>
              </h3>

              <p className="text-gray-700 dark:text-zinc-300 leading-relaxed">
                Téléchargez la liste complète des anciens élèves avec leurs matricules biométriques, années de promotion, statuts de cotisation et coordonnées professionnelles.
              </p>

              <div className="p-4 rounded-xl bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 space-y-2">
                <div className="flex items-center justify-between text-gray-800 dark:text-zinc-200 font-medium">
                  <span>Membres inscrits :</span>
                  <span className="font-mono text-[#B8860B] dark:text-[#E5B824] font-bold">{members.length} alumni</span>
                </div>
                <div className="flex items-center justify-between text-gray-800 dark:text-zinc-200 font-medium">
                  <span>Membres statutairement à jour :</span>
                  <span className="font-mono text-emerald-700 dark:text-emerald-400 font-bold">{approvedMembers.length} adhérents</span>
                </div>
              </div>

              <button
                onClick={handleExportCSV}
                className="w-full py-3 bg-black dark:bg-zinc-800 hover:bg-gray-800 dark:hover:bg-zinc-700 text-white font-semibold rounded-xl border border-transparent dark:border-zinc-700 flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Télécharger l'Annuaire (CSV)</span>
              </button>
            </div>
          </div>
        )}

        {/* Manual Cash/Check Encaissement Modal */}
        {manualModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl max-w-lg w-full p-6 space-y-5 text-xs shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-zinc-800">
                <h3 className="text-base font-bold text-black dark:text-white font-heading flex items-center gap-2">
                  <Banknote className="w-5 h-5 text-[#B8860B] dark:text-[#E5B824]" />
                  <span>Encaisser un Règlement au Guichet Trésorerie</span>
                </h3>
                <button
                  onClick={() => setManualModalOpen(false)}
                  className="text-gray-500 dark:text-zinc-400 hover:text-black dark:hover:text-white cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateManualPayment} className="space-y-4">
                <div>
                  <label className="block text-gray-800 dark:text-zinc-200 font-semibold mb-1">Adhérent concerné</label>
                  <select
                    value={manualPayment.memberId}
                    onChange={(e) => setManualPayment({ ...manualPayment, memberId: e.target.value })}
                    className={inputClass}
                  >
                    {members.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.firstName} {m.lastName} (Promo {m.promotionYear} - {m.membershipCardId})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-gray-800 dark:text-zinc-200 font-semibold mb-1">Nature</label>
                    <select
                      value={manualPayment.type}
                      onChange={(e) => setManualPayment({ ...manualPayment, type: e.target.value as any })}
                      className={inputClass}
                    >
                      <option value="COTISATION_MENSUELLE">Cotisation mensuelle</option>
                      <option value="DROIT_ADHESION">Droits d'adhésion</option>
                      <option value="DON_PROJET">Don pour projet</option>
                      <option value="AUTRE">Autre versement</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-800 dark:text-zinc-200 font-semibold mb-1">Mode de règlement</label>
                    <select
                      value={manualPayment.method}
                      onChange={(e) => setManualPayment({ ...manualPayment, method: e.target.value as any })}
                      className={inputClass}
                    >
                      <option value="ESPECES">Espèces (Guichet)</option>
                      <option value="VIREMENT">Virement bancaire</option>
                      <option value="ORANGE_MONEY">Orange Money direct</option>
                      <option value="MTN_MOMO">MTN MoMo direct</option>
                      <option value="MOOV_MONEY">Moov Money direct</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-800 dark:text-zinc-200 font-semibold mb-1">Montant perçu ({settings.currency})</label>
                  <input
                    type="number"
                    min="500"
                    step="500"
                    required
                    value={manualPayment.amount}
                    onChange={(e) => setManualPayment({ ...manualPayment, amount: Number(e.target.value) })}
                    className={`${inputClass} font-mono font-bold`}
                  />
                </div>

                <div>
                  <label className="block text-gray-800 dark:text-zinc-200 font-semibold mb-1">Libellé de l'encaissement</label>
                  <input
                    type="text"
                    required
                    value={manualPayment.title}
                    onChange={(e) => setManualPayment({ ...manualPayment, title: e.target.value })}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="block text-gray-800 dark:text-zinc-200 font-semibold mb-1">Notes / Référence du reçu manuel</label>
                  <input
                    type="text"
                    value={manualPayment.notes}
                    onChange={(e) => setManualPayment({ ...manualPayment, notes: e.target.value })}
                    className={inputClass}
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setManualModalOpen(false)}
                    className="px-4 py-2 text-gray-600 dark:text-zinc-400 hover:text-black dark:hover:text-white cursor-pointer"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-[#E5B824] text-black font-semibold rounded-xl hover:bg-[#dcae1f] cursor-pointer"
                  >
                    Enregistrer & Générer la Quittance
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
