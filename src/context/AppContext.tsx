import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  AlumniMember,
  Promotion,
  Project,
  ProjectContribution,
  JobOffer,
  NewsItem,
  EventItem,
  MemberTransaction,
  PaymentType,
  PaymentStatus,
  PaymentMethod,
  INITIAL_MEMBERS,
  INITIAL_PROMOTIONS,
  INITIAL_PROJECTS,
  INITIAL_JOB_OFFERS,
  INITIAL_NEWS,
  INITIAL_EVENTS,
  INITIAL_TRANSACTIONS,
  AssociationSettings,
  INITIAL_SETTINGS,
  FINANCIAL_CONSTANTS,
  MONTHS_2026,
  GalleryPhoto,
  YouTubeVideo,
  INITIAL_PHOTOS,
  INITIAL_VIDEOS,
} from '../data/mockData';
import { DEFAULT_GOOGLE_SCRIPT_URL } from '../data/enrollmentData';
import { parseMemberQrPayload } from '../utils/qrPayload';
import {
  authorizeQrPaymentAccess,
  canActiveSessionAccessMemberQr,
  QrAccessAuthResult,
} from '../utils/accessMatrix';

export interface EnrollmentPayload {
  nom: string;
  pseudo?: string;
  promo: string | number;
  niveau: string;
  tel: string;
  wa: string;
  email: string;
  pays: string;
  ville: string;
  commune?: string;
  photoDataUrl?: string;
  secteur: string;
  structure: string;
  situation: string;
  fonction: string;
  formation: string;
  competences: string[];
  niveau_competence: string;
  experience: string;
  certifications: string[];
  services: string;
  disponibilites: string[];
  bdr_annuaire: 'Oui' | 'Non' | string;
  partage_contacts: 'Oui' | 'Non' | string;
  observations?: string;
}

export type UserRole =
  | 'VISITEUR'
  | 'MEMBRE'
  | 'DELEGUE'
  | 'RESPONSABLE_COMM'
  | 'RESPONSABLE_FINANCE'
  | 'ADMIN'
  | 'SUPER_ADMIN';

export type NavigationTab =
  | 'accueil'
  | 'amicale'
  | 'histoire'
  | 'anciens'
  | 'reseau'
  | 'projets'
  | 'actualites'
  | 'galerie'
  | 'mediatheque'
  | 'adhesion'
  | 'espace-membre'
  | 'contact'
  | 'admin';

export interface ToastOptions {
  badge?: string;
  actionLabel?: string;
  onAction?: () => void;
  durationMs?: number;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error' | 'news';
  title: string;
  message: string;
  badge?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export interface PaymentModalConfig {
  isOpen: boolean;
  type: PaymentType;
  defaultAmount?: number;
  selectedMonths?: string[];
  title?: string;
  description?: string;
  targetMember?: AlumniMember;
  projectId?: string;
}

export interface MemberFinancialSummary {
  totalPaid: number;
  totalPending: number;
  totalDroitAdhesion: number;
  hasPaidAdhesion: boolean;
  totalCotisations: number;
  totalDons: number;
  totalAutres: number;
  paidMonths: string[];
  pendingMonths: string[];
  overdueMonths: string[];
  statusFinancial: 'A_JOUR' | 'PARTIEL' | 'EN_RETARD';
  transactions: MemberTransaction[];
}

export interface QrSyncParams {
  memberId: string;
  method: PaymentMethod;
  validatePendingTxIds?: string[];
  payAdhesion?: boolean;
  cotisationMonths?: string[];
  projectId?: string;
  projectDonationAmount?: number;
  notes?: string;
}

export interface QrSyncReport {
  member: AlumniMember;
  totalProcessedAmount: number;
  createdTransactions: MemberTransaction[];
  validatedTransactionIds: string[];
  updatedTables: string[];
  timestamp: string;
}

export type AiKnowledgeCategory =
  | 'ADHESION'
  | 'EVENEMENTS'
  | 'AMICALE'
  | 'PROFIL_OFFICIEL';

export interface AiKnowledgeEntry {
  id: string;
  title: string;
  category: AiKnowledgeCategory;
  content: string;
  source: 'MANUEL' | 'PROFIL';
  authorName: string;
  authorRole: UserRole;
  authorPromotion?: number;
  isActive: boolean;
  updatedAt: string;
}

interface AppContextType {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  selectedPromotionYear: number | null;
  setSelectedPromotionYear: (year: number | null) => void;
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  currentUser: AlumniMember | null;
  setCurrentUser: (user: AlumniMember | null) => void;
  members: AlumniMember[];
  promotions: Promotion[];
  projects: Project[];
  jobOffers: JobOffer[];
  news: NewsItem[];
  events: EventItem[];
  transactions: MemberTransaction[];
  contributionModalProject: Project | null;
  setContributionModalProject: (project: Project | null) => void;
  viewingCardMember: AlumniMember | null;
  setViewingCardMember: (member: AlumniMember | null) => void;
  viewingReceipt: { project: Project; contribution: ProjectContribution } | null;
  setViewingReceipt: (data: { project: Project; contribution: ProjectContribution } | null) => void;
  viewingTransactionReceipt: MemberTransaction | null;
  setViewingTransactionReceipt: (tx: MemberTransaction | null) => void;
  viewingQuitusMember: AlumniMember | null;
  setViewingQuitusMember: (member: AlumniMember | null) => void;
  paymentModalConfig: PaymentModalConfig | null;
  openPaymentModal: (config: Omit<PaymentModalConfig, 'isOpen'>) => void;
  closePaymentModal: () => void;
  toasts: ToastMessage[];
  addToast: (type: ToastMessage['type'], title: string, message: string, options?: ToastOptions) => void;
  removeToast: (id: string) => void;
  newsAlertsEnabled: boolean;
  toggleNewsAlerts: () => void;
  browserPushPermission: NotificationPermission | 'unsupported';
  requestBrowserPushPermission: () => Promise<void>;
  focusedNewsId: string | null;
  setFocusedNewsId: (id: string | null) => void;
  triggerNewsNotification: (item: NewsItem) => void;
  settings: AssociationSettings;
  updateSettings: (updates: Partial<AssociationSettings>) => void;
  updatePromotion: (year: number, updates: Partial<Promotion>) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteNewsItem: (id: string) => void;
  updateNewsItem: (id: string, updates: Partial<NewsItem>) => void;
  photos: GalleryPhoto[];
  videos: YouTubeVideo[];
  addPhoto: (photo: Omit<GalleryPhoto, 'id'>) => void;
  addYouTubeVideo: (video: Omit<YouTubeVideo, 'id'>) => void;
  deleteYouTubeVideo: (id: string) => void;
  // Financial Actions
  processPayment: (params: {
    type: PaymentType;
    amount: number;
    method: PaymentMethod;
    monthYears?: string[];
    title: string;
    description?: string;
    notes?: string;
    memberId?: string;
    status?: PaymentStatus;
  }) => MemberTransaction;
  updateTransactionStatus: (txId: string, status: PaymentStatus, validatorName?: string) => void;
  getMemberFinancialSummary: (memberId: string) => MemberFinancialSummary;
  // QR Flash & Multi-Table Payment Sync
  qrSyncModalOpen: boolean;
  qrTargetMember: AlumniMember | null;
  qrAuthVerified: boolean;
  qrAuthSession: {
    role: UserRole;
    label: string;
    authenticatedName: string;
    scopeLabel: string;
  } | null;
  lastQrSyncReport: QrSyncReport | null;
  openQrSyncModal: (member?: AlumniMember | null) => void;
  closeQrSyncModal: () => void;
  verifyQrAccess: (params: {
    role: UserRole;
    identifier: string;
    accessCode: string;
    targetMember: AlumniMember | null;
  }) => QrAccessAuthResult;
  syncQrPaymentUpdate: (params: QrSyncParams) => QrSyncReport | null;
  // AI Assistant & Knowledge Base Enrichment
  aiChatOpen: boolean;
  setAiChatOpen: (open: boolean) => void;
  aiKnowledgeEntries: AiKnowledgeEntry[];
  canEnrichAi: boolean;
  addAiKnowledgeEntry: (params: {
    title: string;
    category: AiKnowledgeCategory;
    content: string;
  }) => AiKnowledgeEntry | null;
  toggleAiKnowledgeEntry: (id: string) => void;
  deleteAiKnowledgeEntry: (id: string) => void;
  enrichAiFromCurrentProfile: (extraNote?: string) => AiKnowledgeEntry | null;
  // General Actions
  submitMembership: (data: Partial<AlumniMember>) => AlumniMember;
  approveMember: (memberId: string) => void;
  rejectMember: (memberId: string) => void;
  // Enrôlement & Annuaire BDR (algbannuaire.netlify.app)
  enrollmentModalOpen: boolean;
  setEnrollmentModalOpen: (open: boolean) => void;
  submitEnrollment: (payload: EnrollmentPayload) => Promise<AlumniMember>;
  approveEnrollment: (memberId: string) => void;
  rejectEnrollment: (memberId: string) => void;
  makeContribution: (projectId: string, contribution: Omit<ProjectContribution, 'id' | 'date'>) => ProjectContribution;
  registerForEvent: (eventId: string) => void;
  postJobOffer: (offer: Omit<JobOffer, 'id' | 'postedDate'>) => void;
  addNewsItem: (news: Omit<NewsItem, 'id' | 'date'>) => NewsItem;
  updateMemberProfile: (memberId: string, updates: Partial<AlumniMember>) => void;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;
  resetAllData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  SETTINGS: 'algb_settings_v1',
  MEMBERS: 'algb_members_v1',
  PROMOTIONS: 'algb_promotions_v1',
  PROJECTS: 'algb_projects_v1',
  JOBS: 'algb_jobs_v1',
  NEWS: 'algb_news_v1',
  EVENTS: 'algb_events_v1',
  TRANSACTIONS: 'algb_transactions_v1',
  PHOTOS: 'algb_photos_v1',
  VIDEOS: 'algb_videos_v1',
  CURRENT_USER_ID: 'algb_user_id_v1',
  CURRENT_ROLE: 'algb_user_role_v1',
  NEWS_ALERTS: 'algb_news_alerts_v1',
  AI_KNOWLEDGE: 'algb_ai_knowledge_v1',
  THEME: 'algb_theme_v1',
};

const INITIAL_AI_KNOWLEDGE: AiKnowledgeEntry[] = [
  {
    id: 'ai-kb-1',
    title: 'Accueil & Orientation des Nouveaux Membres',
    category: 'ADHESION',
    content:
      "Tout ancien élève souhaitant adhérer peut compléter la fiche d'enrôlement en ligne (rubrique Adhésion) en précisant son année de promotion et son pseudo éventuel du lycée. Dès validation, sa carte officielle avec QR Code est disponible dans l'Espace Membre.",
    source: 'MANUEL',
    authorName: 'Cellule Communication ALGB',
    authorRole: 'RESPONSABLE_COMM',
    isActive: true,
    updatedAt: '2026-11-10',
  },
  {
    id: 'ai-kb-2',
    title: 'Permanence Secrétariat & Retrouvailles 2026',
    category: 'EVENEMENTS',
    content:
      "Le secrétariat de l'Amicale est joignable du lundi au vendredi (08h30 - 17h00) pour accompagner les délégations de promotions dans la préparation de leurs retrouvailles et des dons au Lycée de Bingerville.",
    source: 'MANUEL',
    authorName: 'Secrétariat Administratif ALGB',
    authorRole: 'ADMIN',
    isActive: true,
    updatedAt: '2026-11-11',
  },
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTabState] = useState<NavigationTab>('accueil');
  const [selectedPromotionYear, setSelectedPromotionYear] = useState<number | null>(null);

  const [settings, setSettings] = useState<AssociationSettings>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
  });

  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_ROLE);
    return (saved as UserRole) || 'MEMBRE';
  });

  const [members, setMembers] = useState<AlumniMember[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.MEMBERS);
    return saved ? JSON.parse(saved) : INITIAL_MEMBERS;
  });

  const [photos, setPhotos] = useState<GalleryPhoto[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PHOTOS);
    return saved ? JSON.parse(saved) : INITIAL_PHOTOS;
  });

  const [videos, setVideos] = useState<YouTubeVideo[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.VIDEOS);
    return saved ? JSON.parse(saved) : INITIAL_VIDEOS;
  });

  const [promotions, setPromotions] = useState<Promotion[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PROMOTIONS);
    return saved ? JSON.parse(saved) : INITIAL_PROMOTIONS;
  });

  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PROJECTS);
    return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
  });

  const [jobOffers, setJobOffers] = useState<JobOffer[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.JOBS);
    return saved ? JSON.parse(saved) : INITIAL_JOB_OFFERS;
  });

  const [news, setNews] = useState<NewsItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.NEWS);
    return saved ? JSON.parse(saved) : INITIAL_NEWS;
  });

  const [events, setEvents] = useState<EventItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.EVENTS);
    return saved ? JSON.parse(saved) : INITIAL_EVENTS;
  });

  const [transactions, setTransactions] = useState<MemberTransaction[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  // Current logged in user (defaults to Amadou Touré for realistic interactive demonstration)
  const [currentUser, setCurrentUser] = useState<AlumniMember | null>(() => {
    const savedId = localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID);
    if (savedId) {
      const found = members.find((m) => m.id === savedId);
      if (found) return found;
    }
    return members[0] || null;
  });

  const [contributionModalProject, setContributionModalProject] = useState<Project | null>(null);
  const [viewingCardMember, setViewingCardMember] = useState<AlumniMember | null>(null);
  const [viewingReceipt, setViewingReceipt] = useState<{ project: Project; contribution: ProjectContribution } | null>(null);
  const [viewingTransactionReceipt, setViewingTransactionReceipt] = useState<MemberTransaction | null>(null);
  const [viewingQuitusMember, setViewingQuitusMember] = useState<AlumniMember | null>(null);
  const [paymentModalConfig, setPaymentModalConfig] = useState<PaymentModalConfig | null>(null);
  const [enrollmentModalOpen, setEnrollmentModalOpen] = useState(false);
  const [qrSyncModalOpen, setQrSyncModalOpen] = useState(false);
  const [qrTargetMember, setQrTargetMember] = useState<AlumniMember | null>(null);
  const [qrAuthVerified, setQrAuthVerified] = useState(false);
  const [qrAuthSession, setQrAuthSession] = useState<{
    role: UserRole;
    label: string;
    authenticatedName: string;
    scopeLabel: string;
  } | null>(null);
  const [lastQrSyncReport, setLastQrSyncReport] = useState<QrSyncReport | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [newsAlertsEnabled, setNewsAlertsEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.NEWS_ALERTS);
    return saved === null ? true : saved === 'true';
  });
  const [browserPushPermission, setBrowserPushPermission] = useState<NotificationPermission | 'unsupported'>(() => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return 'unsupported';
    }
    return Notification.permission;
  });
  const [focusedNewsId, setFocusedNewsId] = useState<string | null>(null);
  const [aiChatOpen, setAiChatOpen] = useState(false);
  const [aiKnowledgeEntries, setAiKnowledgeEntries] = useState<AiKnowledgeEntry[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.AI_KNOWLEDGE);
      return saved ? JSON.parse(saved) : INITIAL_AI_KNOWLEDGE;
    } catch {
      return INITIAL_AI_KNOWLEDGE;
    }
  });

  const canEnrichAi =
    currentRole === 'ADMIN' ||
    currentRole === 'SUPER_ADMIN' ||
    currentRole === 'RESPONSABLE_COMM';

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.AI_KNOWLEDGE, JSON.stringify(aiKnowledgeEntries));
    } catch {
      // ignore
    }
  }, [aiKnowledgeEntries]);

  const [theme, setThemeState] = useState<'light' | 'dark'>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.THEME);
      if (saved === 'dark' || saved === 'light') return saved;
      if (typeof document !== 'undefined' && document.documentElement.classList.contains('dark')) {
        return 'dark';
      }
    } catch {
      // ignore
    }
    return 'light';
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.THEME, theme);
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch {
      // ignore
    }
  }, [theme]);

  const setTheme = (nextTheme: 'light' | 'dark') => setThemeState(nextTheme);
  const toggleTheme = () => setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'));

  // Local storage persistence
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch {
      // ignore
    }
  }, [settings]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PROMOTIONS, JSON.stringify(promotions));
    } catch {
      // ignore
    }
  }, [promotions]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(members));
    } catch {
      // ignore
    }
  }, [members]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
    } catch {
      // ignore
    }
  }, [transactions]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
    } catch {
      // ignore
    }
  }, [projects]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(jobOffers));
    } catch {
      // ignore
    }
  }, [jobOffers]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.NEWS, JSON.stringify(news));
    } catch {
      // ignore
    }
  }, [news]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PHOTOS, JSON.stringify(photos));
    } catch {
      // ignore
    }
  }, [photos]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.VIDEOS, JSON.stringify(videos));
    } catch {
      // ignore
    }
  }, [videos]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CURRENT_ROLE, currentRole);
    } catch {
      // ignore
    }
  }, [currentRole]);

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, currentUser.id);
      } else {
        localStorage.removeItem(STORAGE_KEYS.CURRENT_USER_ID);
      }
    } catch {
      // ignore
    }
  }, [currentUser]);

  const addToast = (
    type: ToastMessage['type'],
    title: string,
    message: string,
    options?: ToastOptions
  ) => {
    const id = 'toast-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [
      ...prev,
      {
        id,
        type,
        title,
        message,
        badge: options?.badge,
        actionLabel: options?.actionLabel,
        onAction: options?.onAction,
      },
    ]);
    setTimeout(() => {
      removeToast(id);
    }, options?.durationMs ?? 5000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const setActiveTab = (tab: NavigationTab) => {
    setActiveTabState(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const formatNewsAlertCategory = (category: NewsItem['category']): string => {
    if (category === 'EVENEMENTS' || category === 'VIE_AMICALE') return 'Événements';
    if (category === 'REUSSITE' || category === 'EXCELLENCE' || category === 'HISTOIRE') return 'Réussite';
    return 'Annonces';
  };

  const triggerNewsNotification = (item: NewsItem) => {
    const categoryLabel = formatNewsAlertCategory(item.category);

    addToast('news', item.title, item.summary, {
      badge: `Alerte ALGB · ${categoryLabel}`,
      actionLabel: 'Lire l’actualité →',
      durationMs: 8500,
      onAction: () => {
        setActiveTab('actualites');
        setFocusedNewsId(item.id);
      },
    });

    if (
      typeof window !== 'undefined' &&
      'Notification' in window &&
      Notification.permission === 'granted'
    ) {
      try {
        const notification = new Notification(`ALGB · ${categoryLabel}`, {
          body: `${item.title} — ${item.summary}`,
          icon: '/assets/aistudio/IMG-20180925-WA0019_301d84a7.jpg',
          tag: `algb-news-${item.id}`,
        });
        notification.onclick = () => {
          window.focus();
          setActiveTab('actualites');
          setFocusedNewsId(item.id);
          notification.close();
        };
      } catch {
        // Ignore notification errors in restricted iframe contexts
      }
    }
  };

  const toggleNewsAlerts = () => {
    setNewsAlertsEnabled((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(STORAGE_KEYS.NEWS_ALERTS, String(next));
      } catch {
        // ignore
      }
      addToast(
        next ? 'success' : 'info',
        next ? 'Alertes d’actualités activées' : 'Alertes d’actualités en pause',
        next
          ? 'Vous recevrez une alerte instantanée via ToastContainer à chaque nouvelle publication.'
          : 'Les alertes push lors des nouvelles publications sont suspendues.'
      );
      return next;
    });
  };

  const requestBrowserPushPermission = async () => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      setBrowserPushPermission('unsupported');
      addToast(
        'info',
        'Alertes intégrées actives',
        'Votre navigateur ne prend pas en charge les notifications système externes ; les alertes restent actives via ToastContainer.'
      );
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      setBrowserPushPermission(permission);
      if (permission === 'granted') {
        if (!newsAlertsEnabled) {
          setNewsAlertsEnabled(true);
          localStorage.setItem(STORAGE_KEYS.NEWS_ALERTS, 'true');
        }
        addToast(
          'success',
          'Notifications Push activées',
          'Les nouvelles publications déclencheront une alerte ToastContainer et une notification navigateur.'
        );
      } else {
        addToast(
          'warning',
          'Permission navigateur refusée',
          'Les notifications d’actualités continueront d’apparaître directement dans ToastContainer.'
        );
      }
    } catch {
      addToast(
        'info',
        'Mode intégré actif',
        'Les alertes en temps réel restent assurées via ToastContainer dans le portail.'
      );
    }
  };

  // Cross-tab synchronization for newly published news
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key !== STORAGE_KEYS.NEWS || !event.newValue) return;
      try {
        const incoming: NewsItem[] = JSON.parse(event.newValue);
        if (!Array.isArray(incoming) || incoming.length === 0) return;

        setNews((prev) => {
          const existingIds = new Set(prev.map((n) => n.id));
          const brandNew = incoming.filter((item) => !existingIds.has(item.id));
          if (brandNew.length > 0 && newsAlertsEnabled) {
            setTimeout(() => {
              triggerNewsNotification(brandNew[0]);
            }, 0);
          }
          return incoming;
        });
      } catch {
        // ignore invalid storage payload
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [newsAlertsEnabled]);

  // Deep-link handler when a member card QR code is flashed externally
  useEffect(() => {
    if (typeof window === 'undefined' || !window.location.search) return;
    const params = new URLSearchParams(window.location.search);
    if (params.get('qrPay') === '1' || params.get('qrAction') === 'member-pay') {
      const matched = parseMemberQrPayload(window.location.search, members);
      setQrAuthVerified(false);
      setQrAuthSession(null);
      setQrTargetMember(matched || null);
      setQrSyncModalOpen(true);
      setLastQrSyncReport(null);
      addToast(
        'info',
        'Lien QR détecté — Accès restreint',
        matched
          ? `Carte ciblée : ${matched.membershipCardId}. Veuillez saisir vos accès dédiés selon la matrice des profils pour ouvrir l’espace de paiement.`
          : 'Veuillez saisir vos accès dédiés selon la matrice des profils pour poursuivre.',
        { badge: 'Contrôle d’accès ALGB' }
      );
      try {
        window.history.replaceState({}, '', window.location.pathname);
      } catch {
        // ignore history error
      }
    }
  }, []);

  // Submit new alumni membership
  const submitMembership = (data: Partial<AlumniMember>): AlumniMember => {
    const newId = `mem-${Date.now().toString().slice(-4)}`;
    const promoYear = data.promotionYear || 2024;
    const matricule = `ALGB-${promoYear}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newMember: AlumniMember = {
      id: newId,
      firstName: data.firstName || 'Ancien',
      lastName: data.lastName || 'Élève',
      promotionYear: promoYear,
      promotionName: data.promotionName || `Promotion ${promoYear}`,
      bacSeries: data.bacSeries || 'Série C',
      profession: data.profession || 'Cadre',
      currentRole: data.currentRole || 'Professionnel',
      company: data.company || 'Entreprise',
      sector: data.sector || 'Technologie & Numérique',
      city: data.city || 'Abidjan',
      country: data.country || 'Côte d’Ivoire',
      email: data.email || 'adherent@algb.ci',
      phone: data.phone || '+225 00 00 00 00 00',
      isMentor: !!data.isMentor,
      isRegistered: true,
      membershipStatus: 'EN_ATTENTE',
      membershipCardId: matricule,
      bio: data.bio || 'Fier ancien du Lycée de Garçons de Bingerville.',
      skills: data.skills && data.skills.length > 0 ? data.skills : ['Gestion de projet', 'Leadership'],
      isRep: false,
      privacy: data.privacy || {
        showEmail: true,
        showPhone: false,
        allowMentorshipRequests: true,
      },
    };

    setMembers((prev) => [newMember, ...prev]);

    // Update promo total
    setPromotions((prev) =>
      prev.map((p) => (p.year === promoYear ? { ...p, registeredMembers: p.registeredMembers + 1 } : p))
    );

    addToast(
      'success',
      'Adhésion enregistrée avec succès !',
      `Votre matricule provisoire est ${matricule}. Votre dossier est en cours de validation par le Secrétariat.`
    );

    // Auto set as current user and open member card
    setCurrentUser(newMember);
    setCurrentRole('MEMBRE');
    return newMember;
  };

  // Administrator approval
  const approveMember = (memberId: string) => {
    setMembers((prev) =>
      prev.map((m) => (m.id === memberId ? { ...m, membershipStatus: 'A_JOUR' } : m))
    );
    addToast('success', 'Adhésion validée', 'Le membre a été validé et sa carte officielle est active.');
  };

  const rejectMember = (memberId: string) => {
    setMembers((prev) =>
      prev.map((m) => (m.id === memberId ? { ...m, membershipStatus: 'EXPIRE' } : m))
    );
    addToast('warning', 'Dossier rejeté', 'L’adhésion a été marquée comme non validée.');
  };

  // Enrôlement 4 étapes (stratégie algbannuaire.netlify.app)
  const submitEnrollment = async (payload: EnrollmentPayload): Promise<AlumniMember> => {
    const newId = `mem-${Date.now().toString().slice(-4)}`;
    const promoYear = parseInt(String(payload.promo), 10) || 2024;
    const matricule = `ALGB-${promoYear}-${Math.floor(1000 + Math.random() * 9000)}`;

    const rawNames = (payload.nom || '').trim().split(' ').filter(Boolean);
    const firstName = rawNames.length > 1 ? rawNames.slice(0, -1).join(' ') : (rawNames[0] || 'Ancien');
    const lastName = rawNames.length > 1 ? rawNames[rawNames.length - 1] : 'Élève';

    const newMember: AlumniMember = {
      id: newId,
      firstName,
      lastName,
      nickname: payload.pseudo?.trim() || undefined,
      promotionYear: promoYear,
      promotionName: `Promotion ${promoYear}`,
      bacSeries: 'Série Scientifique / Générale',
      studyLevel: payload.niveau,
      profession: payload.fonction || 'Professionnel',
      currentRole: payload.fonction || 'Professionnel',
      company: payload.structure || 'Institution / Entreprise',
      sector: payload.secteur,
      situation: payload.situation,
      country: payload.pays,
      city: payload.ville,
      commune: payload.commune,
      email: payload.email,
      phone: payload.tel,
      whatsapp: payload.wa || payload.tel,
      isMentor: payload.disponibilites.includes('Mentorat'),
      isRegistered: true,
      membershipStatus: 'A_JOUR',
      membershipCardId: matricule,
      avatarUrl: payload.photoDataUrl,
      bio: `Ancien élève du Lycée de Garçons de Bingerville (${payload.promo}). ${payload.situation} chez ${payload.structure} en qualité de ${payload.fonction || 'cadre'}.`,
      mainFormation: payload.formation,
      skills: payload.competences && payload.competences.length > 0 ? payload.competences : ['Gestion de projets'],
      skillLevel: payload.niveau_competence,
      experienceYears: payload.experience,
      certifications: payload.certifications,
      services: payload.services,
      availabilities: payload.disponibilites,
      bdrRegistered: payload.bdr_annuaire === 'Oui',
      shareContactsConsent: payload.partage_contacts === 'Oui',
      observations: payload.observations,
      enrollmentDate: new Date().toLocaleString('fr-FR', { timeZone: 'Africa/Abidjan' }),
      enrollmentStatus: 'VALIDE',
      isRep: false,
      privacy: {
        showEmail: true,
        showPhone: payload.partage_contacts === 'Oui',
        allowMentorshipRequests: payload.disponibilites.includes('Mentorat'),
      },
    };

    // Update members list
    setMembers((prev) => [newMember, ...prev]);

    // Update promo counts
    setPromotions((prev) =>
      prev.map((p) => (p.year === promoYear ? { ...p, registeredMembers: p.registeredMembers + 1 } : p))
    );

    // Asynchronous dispatch to Google Apps Script webhook
    try {
      const scriptUrl = settings.googleScriptUrl || DEFAULT_GOOGLE_SCRIPT_URL;
      if (scriptUrl) {
        const googleData = {
          date_enrolement: newMember.enrollmentDate,
          nom: payload.nom,
          pseudo: payload.pseudo || '',
          promo: payload.promo,
          niveau: payload.niveau,
          tel: payload.tel,
          wa: payload.wa,
          email: payload.email,
          pays: payload.pays,
          ville: payload.ville,
          commune: payload.commune || '',
          secteur: payload.secteur,
          structure: payload.structure,
          situation: payload.situation,
          fonction: payload.fonction,
          formation: payload.formation,
          competences: payload.competences.join(' | '),
          niveau_competence: payload.niveau_competence,
          experience: payload.experience,
          certifications: payload.certifications.join(' | '),
          services: payload.services,
          disponibilites: payload.disponibilites.join(' | '),
          bdr_annuaire: payload.bdr_annuaire,
          partage_contacts: payload.partage_contacts,
          observations: payload.observations || '',
        };

        fetch(scriptUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(googleData),
        }).catch((e) => console.log('Google Script Sync Note:', e));
      }
    } catch {
      // safe fallback
    }

    addToast(
      'success',
      'Enrôlement enregistré avec succès !',
      `Félicitations ! Votre profil et matricule officiel (${matricule}) ont été intégrés à l'Annuaire & Base de Données des Compétences de l'ALGB.`
    );

    // Set as current user & open card
    setCurrentUser(newMember);
    setCurrentRole('MEMBRE');
    setViewingCardMember(newMember);

    return newMember;
  };

  const approveEnrollment = (memberId: string) => {
    setMembers((prev) =>
      prev.map((m) =>
        m.id === memberId
          ? { ...m, enrollmentStatus: 'VALIDE', membershipStatus: 'A_JOUR' }
          : m
      )
    );
    addToast('success', 'Enrôlement validé', 'Le dossier a été validé et activé dans l’Annuaire & BDR officiel.');
  };

  const rejectEnrollment = (memberId: string) => {
    setMembers((prev) =>
      prev.map((m) =>
        m.id === memberId ? { ...m, enrollmentStatus: 'REJETE' } : m
      )
    );
    addToast('warning', 'Enrôlement rejeté', 'Le dossier d’enrôlement a été refusé.');
  };

  // Make contribution
  const makeContribution = (
    projectId: string,
    contributionData: Omit<ProjectContribution, 'id' | 'date'>
  ): ProjectContribution => {
    const contributionId = `rec-${Date.now().toString().slice(-6)}`;
    const today = new Date().toISOString().split('T')[0];

    const newContribution: ProjectContribution = {
      ...contributionData,
      id: contributionId,
      date: today,
    };

    let targetProject: Project | null = null;

    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === projectId) {
          const newRaised = p.budgetRaised + newContribution.amount;
          const newPercentage = Math.min(100, Math.round((newRaised / p.budgetGoal) * 100));
          const updated = {
            ...p,
            budgetRaised: newRaised,
            contributorsCount: p.contributorsCount + 1,
            progressPercentage: newPercentage,
            contributions: [newContribution, ...p.contributions],
          };
          targetProject = updated;
          return updated;
        }
        return p;
      })
    );

    addToast(
      'success',
      'Contribution enregistrée avec honneur !',
      `Merci pour votre générosité de ${newContribution.amount.toLocaleString('fr-FR')} FCFA. Votre reçu officiel est disponible.`
    );

    if (targetProject) {
      setViewingReceipt({ project: targetProject, contribution: newContribution });
    }

    return newContribution;
  };

  // Register for event
  const registerForEvent = (eventId: string) => {
    setEvents((prev) =>
      prev.map((ev) => (ev.id === eventId ? { ...ev, attendeesCount: ev.attendeesCount + 1 } : ev))
    );
    addToast('success', 'Inscription confirmée !', 'Votre place a été réservée. Un e-mail récapitulatif vous a été envoyé.');
  };

  // Post job offer
  const postJobOffer = (offer: Omit<JobOffer, 'id' | 'postedDate'>) => {
    const newOffer: JobOffer = {
      ...offer,
      id: `job-${Date.now().toString().slice(-4)}`,
      postedDate: new Date().toISOString().split('T')[0],
    };
    setJobOffers((prev) => [newOffer, ...prev]);
    addToast('success', 'Offre publiée', 'L’opportunité est désormais visible pour tous les anciens élèves.');
  };

  // Add news
  const addNewsItem = (item: Omit<NewsItem, 'id' | 'date'>): NewsItem => {
    const newItem: NewsItem = {
      ...item,
      id: `news-${Date.now().toString().slice(-4)}`,
      date: new Date().toISOString().split('T')[0],
    };
    setNews((prev) => [newItem, ...prev]);

    if (newsAlertsEnabled) {
      triggerNewsNotification(newItem);
    } else {
      addToast('success', 'Actualité diffusée', 'Le communiqué a été publié sur la page officielle.');
    }

    return newItem;
  };

  // Update member profile
  const updateMemberProfile = (memberId: string, updates: Partial<AlumniMember>) => {
    setMembers((prev) =>
      prev.map((m) => {
        if (m.id === memberId) {
          const updated = { ...m, ...updates };
          if (currentUser?.id === memberId) {
            setCurrentUser(updated);
          }
          return updated;
        }
        return m;
      })
    );
    addToast('success', 'Profil actualisé', 'Vos modifications ont été enregistrées avec succès.');
  };

  // Variable parameter management
  const updateSettings = (updates: Partial<AssociationSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...updates };
      try {
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
    addToast('success', 'Paramètres enregistrés', 'Les données ont été mises à jour avec succès.');
  };

  const updatePromotion = (year: number, updates: Partial<Promotion>) => {
    setPromotions((prev) => {
      const updated = prev.map((p) => (p.year === year ? { ...p, ...updates } : p));
      try {
        localStorage.setItem(STORAGE_KEYS.PROMOTIONS, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
    addToast('success', 'Promotion actualisée', `Les données de la promotion ${year} ont été modifiées.`);
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    setProjects((prev) => {
      const updated = prev.map((p) => (p.id === id ? { ...p, ...updates } : p));
      try {
        localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
    addToast('success', 'Projet mis à jour', 'Les données du projet ont été actualisées.');
  };

  const deleteNewsItem = (id: string) => {
    setNews((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      try {
        localStorage.setItem(STORAGE_KEYS.NEWS, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
    addToast('info', 'Communiqué supprimé', 'L’article a été retiré des publications.');
  };

  const updateNewsItem = (id: string, updates: Partial<NewsItem>) => {
    setNews((prev) => {
      const updated = prev.map((item) => (item.id === id ? { ...item, ...updates } : item));
      try {
        localStorage.setItem(STORAGE_KEYS.NEWS, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
    addToast('success', 'Publication modifiée', 'Le communiqué a été mis à jour.');
  };

  // Media Library Actions
  const addPhoto = (photo: Omit<GalleryPhoto, 'id'>) => {
    const newPhoto: GalleryPhoto = {
      ...photo,
      id: `gal-${Date.now().toString().slice(-4)}`,
    };
    setPhotos((prev) => [newPhoto, ...prev]);
    addToast('success', 'Photographie ajoutée', 'La photo a été intégrée à la médiathèque.');
  };

  const addYouTubeVideo = (video: Omit<YouTubeVideo, 'id'>) => {
    const newVideo: YouTubeVideo = {
      ...video,
      id: `yt-${Date.now().toString().slice(-4)}`,
    };
    setVideos((prev) => [newVideo, ...prev]);
    addToast('success', 'Vidéo YouTube ajoutée', 'La vidéo a été ajoutée à la chaîne ALGB et à la médiathèque.');
  };

  const deleteYouTubeVideo = (id: string) => {
    setVideos((prev) => prev.filter((v) => v.id !== id));
    addToast('info', 'Vidéo supprimée', 'La vidéo a été retirée de la médiathèque.');
  };

  // Financial Actions
  const openPaymentModal = (config: Omit<PaymentModalConfig, 'isOpen'>) => {
    setPaymentModalConfig({ ...config, isOpen: true });
  };

  const closePaymentModal = () => {
    setPaymentModalConfig(null);
  };

  const processPayment = (params: {
    type: PaymentType;
    amount: number;
    method: PaymentMethod;
    monthYears?: string[];
    title: string;
    description?: string;
    notes?: string;
    memberId?: string;
    status?: PaymentStatus;
  }): MemberTransaction => {
    const targetMember = params.memberId
      ? members.find((m) => m.id === params.memberId) || currentUser
      : currentUser;

    const memberName = targetMember
      ? `${targetMember.firstName} ${targetMember.lastName}`
      : 'Membre Adhérent ALGB';
    const promoYear = targetMember?.promotionYear || 2002;
    const memberId = targetMember?.id || 'mem-anon';

    const txId = `tx-${Date.now().toString().slice(-6)}`;
    const refCode = `ALGB-${params.type.slice(0, 3)}-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const recNumber = `REC-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const status: PaymentStatus =
      params.status || (params.method === 'VIREMENT' ? 'EN_ATTENTE' : 'PAYE');

    const newTx: MemberTransaction = {
      id: txId,
      reference: refCode,
      memberId: memberId,
      memberName: memberName,
      promotionYear: promoYear,
      type: params.type,
      title: params.title,
      description: params.description,
      monthYears: params.monthYears,
      amount: params.amount,
      currency: 'FCFA',
      date: new Date().toISOString().split('T')[0],
      method: params.method,
      status: status,
      receiptNumber: recNumber,
      validatedBy: status === 'PAYE' ? 'Trésorerie Générale ALGB' : undefined,
      notes: params.notes,
    };

    setTransactions((prev) => [newTx, ...prev]);

    // If Droit d'adhésion is payé, update membership status
    if (params.type === 'DROIT_ADHESION' && status === 'PAYE') {
      setMembers((prev) =>
        prev.map((m) => (m.id === memberId ? { ...m, membershipStatus: 'A_JOUR' } : m))
      );
      if (currentUser?.id === memberId) {
        setCurrentUser((prev) => (prev ? { ...prev, membershipStatus: 'A_JOUR' } : prev));
      }
    }

    if (status === 'PAYE') {
      addToast(
        'success',
        'Paiement validé avec succès !',
        `Règlement de ${params.amount.toLocaleString('fr-FR')} FCFA enregistré pour ${params.title}. Reçu n° ${recNumber}.`
      );
    } else {
      addToast(
        'info',
        'Règlement en attente de pointage',
        `Votre déclaration de ${params.amount.toLocaleString('fr-FR')} FCFA a été transmise au Trésorier Général pour validation.`
      );
    }

    setViewingTransactionReceipt(newTx);
    return newTx;
  };

  const updateTransactionStatus = (txId: string, status: PaymentStatus, validatorName?: string) => {
    let affectedTx: MemberTransaction | null = null;
    setTransactions((prev) =>
      prev.map((tx) => {
        if (tx.id === txId) {
          const updated = {
            ...tx,
            status,
            validatedBy: status === 'PAYE' ? validatorName || 'Idriss Coulibaly (Trésorier)' : tx.validatedBy,
          };
          affectedTx = updated;
          return updated;
        }
        return tx;
      })
    );

    if (affectedTx && (affectedTx as MemberTransaction).type === 'DROIT_ADHESION' && status === 'PAYE') {
      const memId = (affectedTx as MemberTransaction).memberId;
      setMembers((prev) =>
        prev.map((m) => (m.id === memId ? { ...m, membershipStatus: 'A_JOUR' } : m))
      );
    }

    addToast(
      status === 'PAYE' ? 'success' : 'warning',
      `Transaction mise à jour : ${status}`,
      `L'état de la transaction a été modifié par le Trésorier.`
    );
  };

  const openQrSyncModal = (member?: AlumniMember | null) => {
    setLastQrSyncReport(null);
    setQrAuthVerified(false);
    setQrAuthSession(null);
    setQrTargetMember(member ?? null);
    setQrSyncModalOpen(true);
  };

  const closeQrSyncModal = () => {
    setQrSyncModalOpen(false);
    setQrTargetMember(null);
    setQrAuthVerified(false);
    setQrAuthSession(null);
  };

  const verifyQrAccess = (params: {
    role: UserRole;
    identifier: string;
    accessCode: string;
    targetMember: AlumniMember | null;
  }): QrAccessAuthResult => {
    const result = authorizeQrPaymentAccess({
      ...params,
      members,
    });

    if (result.allowed) {
      setCurrentRole(params.role);
      const authMember = result.authenticatedMember || currentUser || members[0] || null;
      if (authMember && (params.role === 'MEMBRE' || params.role === 'DELEGUE' || params.role === 'RESPONSABLE_COMM')) {
        setCurrentUser(authMember);
      } else if (params.targetMember && result.rule.scopeType === 'ALL_MEMBERS') {
        // For Finance / Admin / Super Admin, keep or set authenticated user context without impersonating unless viewing member space
        if (!currentUser && authMember) setCurrentUser(authMember);
      }
      const displayName = authMember
        ? `${authMember.firstName} ${authMember.lastName}`
        : params.identifier.trim();

      setQrAuthVerified(true);
      setQrAuthSession({
        role: params.role,
        label: result.rule.label,
        authenticatedName: displayName,
        scopeLabel: result.rule.scopeLabel,
      });

      addToast(
        'success',
        `Accès déverrouillé : ${result.rule.label}`,
        `Habilitation vérifiée (${result.rule.scopeLabel}).`
      );
    }

    return result;
  };

  const syncQrPaymentUpdate = (params: QrSyncParams): QrSyncReport | null => {
    const targetMember = members.find((m) => m.id === params.memberId) || currentUser;
    if (!targetMember) return null;

    if (!qrAuthVerified || !canActiveSessionAccessMemberQr(currentRole, currentUser, targetMember)) {
      addToast(
        'error',
        'Accès non autorisé',
        'Veuillez valider vos accès dédiés selon la matrice des profils en vigueur avant de modifier les tables de paiement.'
      );
      return null;
    }

    const nowDate = new Date().toISOString().split('T')[0];
    const memberFullName = `${targetMember.firstName} ${targetMember.lastName}`;
    const validateIds = params.validatePendingTxIds || [];
    const createdTxs: MemberTransaction[] = [];
    let totalProcessedAmount = 0;

    // 1. Create new transactions (Adhesion, Cotisations, Project donation)
    const noteSuffix = params.notes?.trim()
      ? `${params.notes.trim()} · Synchro QR ${targetMember.membershipCardId}`
      : `Paiement & synchronisation par flash QR Carte Membre (${targetMember.membershipCardId})`;

    if (params.payAdhesion) {
      const amt = settings.droitAdhesionAmount;
      totalProcessedAmount += amt;
      createdTxs.push({
        id: `tx-qr-adh-${Date.now().toString().slice(-6)}`,
        reference: `ALGB-QR-ADH-${Math.floor(1000 + Math.random() * 9000)}`,
        memberId: targetMember.id,
        memberName: memberFullName,
        promotionYear: targetMember.promotionYear,
        type: 'DROIT_ADHESION',
        title: 'Droits d’Adhésion Statutaire (Flash QR)',
        description: 'Validation et mise à jour des droits d’adhésion via QR Code Carte Officielle.',
        amount: amt,
        currency: settings.currency,
        date: nowDate,
        method: params.method,
        status: 'PAYE',
        receiptNumber: `REC-QR-${Math.floor(1000 + Math.random() * 9000)}`,
        validatedBy: 'Synchro QR Automatique ALGB',
        notes: noteSuffix,
      });
    }

    if (params.cotisationMonths && params.cotisationMonths.length > 0) {
      const sortedMonths = [...params.cotisationMonths].sort();
      const amt = sortedMonths.length * settings.cotisationMensuelleAmount;
      totalProcessedAmount += amt;
      const monthNames = sortedMonths
        .map((k) => MONTHS_2026.find((m) => m.key === k)?.short || k)
        .join(', ');

      createdTxs.push({
        id: `tx-qr-cot-${Date.now().toString().slice(-6)}1`,
        reference: `ALGB-QR-COT-${Math.floor(1000 + Math.random() * 9000)}`,
        memberId: targetMember.id,
        memberName: memberFullName,
        promotionYear: targetMember.promotionYear,
        type: 'COTISATION_MENSUELLE',
        title: `Cotisations Mensuelles (${sortedMonths.length} mois : ${monthNames})`,
        description: `Régularisation de ${sortedMonths.length} mensualité(s) via QR Code de carte adhérent.`,
        monthYears: sortedMonths,
        amount: amt,
        currency: settings.currency,
        date: nowDate,
        method: params.method,
        status: 'PAYE',
        receiptNumber: `REC-QR-${Math.floor(1000 + Math.random() * 9000)}`,
        validatedBy: 'Synchro QR Automatique ALGB',
        notes: noteSuffix,
      });
    }

    const projectAmt = params.projectDonationAmount || 0;
    const targetProject = params.projectId
      ? projects.find((p) => p.id === params.projectId)
      : undefined;

    if (targetProject && projectAmt > 0) {
      totalProcessedAmount += projectAmt;
      createdTxs.push({
        id: `tx-qr-prj-${Date.now().toString().slice(-6)}2`,
        reference: `ALGB-QR-DON-${Math.floor(1000 + Math.random() * 9000)}`,
        memberId: targetMember.id,
        memberName: memberFullName,
        promotionYear: targetMember.promotionYear,
        type: 'DON_PROJET',
        title: `Don Projet : ${targetProject.title}`,
        description: `Contribution solidaire affectée au chantier ${targetProject.title} via QR Code.`,
        amount: projectAmt,
        currency: settings.currency,
        date: nowDate,
        method: params.method,
        status: 'PAYE',
        receiptNumber: `REC-QR-${Math.floor(1000 + Math.random() * 9000)}`,
        validatedBy: 'Synchro QR Automatique ALGB',
        notes: noteSuffix,
      });

      const contributionMethod: ProjectContribution['method'] =
        params.method === 'ESPECES' ? 'VIREMENT' : params.method;

      const newContribution: ProjectContribution = {
        id: `rec-qr-${Date.now().toString().slice(-6)}`,
        contributorName: memberFullName,
        promotionYear: targetMember.promotionYear,
        amount: projectAmt,
        currency: settings.currency,
        date: nowDate,
        method: contributionMethod,
        isAnonymous: false,
        message: 'Contribution synchronisée par QR Code Carte Membre ALGB',
      };

      setProjects((prev) =>
        prev.map((proj) => {
          if (proj.id !== targetProject.id) return proj;
          const nextRaised = proj.budgetRaised + projectAmt;
          return {
            ...proj,
            budgetRaised: nextRaised,
            contributorsCount: proj.contributorsCount + 1,
            progressPercentage: Math.min(100, Math.round((nextRaised / proj.budgetGoal) * 100)),
            contributions: [newContribution, ...proj.contributions],
          };
        })
      );
    }

    // 2. Atomically update transactions table (validate pending + prepend newly created)
    setTransactions((prev) => {
      const updatedExisting = prev.map((tx) => {
        if (validateIds.includes(tx.id) && tx.status !== 'PAYE') {
          return {
            ...tx,
            status: 'PAYE' as PaymentStatus,
            validatedBy: 'Synchro QR Carte Membre',
            notes: tx.notes ? `${tx.notes} · Validé par QR` : 'Validé par flash QR Carte Membre',
          };
        }
        return tx;
      });
      return [...createdTxs, ...updatedExisting];
    });

    const pendingToValidateSum = transactions
      .filter((tx) => validateIds.includes(tx.id) && tx.status !== 'PAYE')
      .reduce((sum, tx) => sum + tx.amount, 0);
    totalProcessedAmount += pendingToValidateSum;

    // 3. Synchronize member record, active currentUser & viewingCardMember
    const updatedMember: AlumniMember = {
      ...targetMember,
      membershipStatus: 'A_JOUR',
      enrollmentStatus: 'VALIDE',
    };

    setMembers((prev) => prev.map((m) => (m.id === targetMember.id ? updatedMember : m)));
    if (currentUser?.id === targetMember.id) {
      setCurrentUser(updatedMember);
    }
    if (viewingCardMember?.id === targetMember.id) {
      setViewingCardMember(updatedMember);
    }
    setQrTargetMember(updatedMember);

    const updatedTables = [
      'Espace de paiement membre (KPI & Échéancier 2026)',
      'Table Historique des Versements & Quittances',
      'Table Trésorerie Générale & Grand Livre (Admin)',
      'Registre des Membres & Carte Officielle (Statut À JOUR)',
    ];
    if (targetProject && projectAmt > 0) {
      updatedTables.push(`Table Projets & Chantiers (${targetProject.title})`);
    }

    const report: QrSyncReport = {
      member: updatedMember,
      totalProcessedAmount,
      createdTransactions: createdTxs,
      validatedTransactionIds: validateIds,
      updatedTables,
      timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    };

    setLastQrSyncReport(report);

    addToast(
      'success',
      'Paiement & Tables synchronisés via QR',
      `${memberFullName} (${targetMember.membershipCardId}) : ${totalProcessedAmount.toLocaleString('fr-FR')} ${settings.currency} mis à jour sur toutes les tables.`,
      {
        badge: 'Synchro QR ALGB',
        actionLabel: 'Voir Espace Paiement →',
        durationMs: 7000,
        onAction: () => {
          setCurrentUser(updatedMember);
          setActiveTab('espace-membre');
        },
      }
    );

    return report;
  };

  const getMemberFinancialSummary = (memberId: string): MemberFinancialSummary => {
    const memberTxs = transactions.filter((t) => t.memberId === memberId);

    const paidTxs = memberTxs.filter((t) => t.status === 'PAYE');
    const pendingTxs = memberTxs.filter((t) => t.status === 'EN_ATTENTE');

    const totalPaid = paidTxs.reduce((sum, t) => sum + t.amount, 0);
    const totalPending = pendingTxs.reduce((sum, t) => sum + t.amount, 0);

    const totalDroitAdhesion = paidTxs
      .filter((t) => t.type === 'DROIT_ADHESION')
      .reduce((sum, t) => sum + t.amount, 0);

    const hasPaidAdhesion =
      totalDroitAdhesion > 0 || members.find((m) => m.id === memberId)?.membershipStatus === 'A_JOUR';

    const totalCotisations = paidTxs
      .filter((t) => t.type === 'COTISATION_MENSUELLE')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalDons = paidTxs
      .filter((t) => t.type === 'DON_PROJET')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalAutres = paidTxs
      .filter((t) => t.type === 'AUTRE')
      .reduce((sum, t) => sum + t.amount, 0);

    // Paid month keys
    const paidMonths: string[] = [];
    paidTxs.forEach((t) => {
      if (t.type === 'COTISATION_MENSUELLE' && t.monthYears) {
        paidMonths.push(...t.monthYears);
      }
    });

    const pendingMonths: string[] = [];
    pendingTxs.forEach((t) => {
      if (t.type === 'COTISATION_MENSUELLE' && t.monthYears) {
        pendingMonths.push(...t.monthYears);
      }
    });

    // Check months 2026 up to current month (November 2026 = 2026-11)
    const currentMonthKey = '2026-11';
    const elapsedMonths = MONTHS_2026.filter((m) => m.key <= currentMonthKey).map((m) => m.key);
    const overdueMonths = elapsedMonths.filter(
      (mKey) => !paidMonths.includes(mKey) && !pendingMonths.includes(mKey)
    );

    let statusFinancial: 'A_JOUR' | 'PARTIEL' | 'EN_RETARD' = 'A_JOUR';
    if (overdueMonths.length > 2) {
      statusFinancial = 'EN_RETARD';
    } else if (overdueMonths.length > 0 || pendingMonths.length > 0) {
      statusFinancial = 'PARTIEL';
    }

    return {
      totalPaid,
      totalPending,
      totalDroitAdhesion,
      hasPaidAdhesion: !!hasPaidAdhesion,
      totalCotisations,
      totalDons,
      totalAutres,
      paidMonths: Array.from(new Set(paidMonths)),
      pendingMonths: Array.from(new Set(pendingMonths)),
      overdueMonths,
      statusFinancial,
      transactions: memberTxs,
    };
  };

  const addAiKnowledgeEntry = (params: {
    title: string;
    category: AiKnowledgeCategory;
    content: string;
  }): AiKnowledgeEntry | null => {
    if (!canEnrichAi) {
      addToast(
        'error',
        'Action réservée',
        'Seuls les profils Administrateur, Super Administrateur et Responsable Communication peuvent enrichir l’assistant IA.'
      );
      return null;
    }

    const authorName = currentUser
      ? `${currentUser.firstName} ${currentUser.lastName}`
      : currentRole === 'RESPONSABLE_COMM'
      ? 'Responsable Communication ALGB'
      : 'Administrateur ALGB';

    const newEntry: AiKnowledgeEntry = {
      id: `ai-kb-${Date.now()}`,
      title: params.title.trim(),
      category: params.category,
      content: params.content.trim(),
      source: 'MANUEL',
      authorName,
      authorRole: currentRole,
      authorPromotion: currentUser?.promotionYear,
      isActive: true,
      updatedAt: new Date().toISOString().split('T')[0],
    };

    setAiKnowledgeEntries((prev) => [newEntry, ...prev]);
    addToast(
      'success',
      'Assistant IA enrichi',
      `La note « ${newEntry.title} » est désormais intégrée aux réponses de l’assistant.`
    );
    return newEntry;
  };

  const toggleAiKnowledgeEntry = (id: string) => {
    if (!canEnrichAi) return;
    setAiKnowledgeEntries((prev) =>
      prev.map((entry) =>
        entry.id === id ? { ...entry, isActive: !entry.isActive } : entry
      )
    );
  };

  const deleteAiKnowledgeEntry = (id: string) => {
    if (!canEnrichAi) return;
    setAiKnowledgeEntries((prev) => prev.filter((entry) => entry.id !== id));
    addToast('info', 'Information retirée', 'L’entrée a été supprimée de la base de l’assistant IA.');
  };

  const enrichAiFromCurrentProfile = (extraNote?: string): AiKnowledgeEntry | null => {
    if (!canEnrichAi) {
      addToast(
        'error',
        'Accès refusé',
        'Seuls les profils Administration et Communication peuvent synchroniser leur profil vers l’IA.'
      );
      return null;
    }

    const roleLabel =
      currentRole === 'RESPONSABLE_COMM'
        ? 'Responsable Communication ALGB'
        : currentRole === 'SUPER_ADMIN'
        ? 'Super Administrateur ALGB'
        : 'Administrateur ALGB';

    const today = new Date().toISOString().split('T')[0];

    let profileName = roleLabel;
    let profileContent = '';
    let authorPromotion: number | undefined;

    if (currentUser) {
      profileName = `${currentUser.firstName} ${currentUser.lastName}`;
      authorPromotion = currentUser.promotionYear;

      const details: string[] = [
        `Profil référent (${roleLabel}) : ${profileName}${
          currentUser.nickname ? ` dit « ${currentUser.nickname} »` : ''
        }, Promotion ${currentUser.promotionYear} (${currentUser.promotionName}).`,
        `Fonction actuelle : ${currentUser.currentRole} chez ${currentUser.company} (secteur ${currentUser.sector}).`,
        `Localisation : ${currentUser.city}${
          currentUser.commune ? ` (${currentUser.commune})` : ''
        }, ${currentUser.country}.`,
      ];

      if (currentUser.bio) {
        details.push(`Présentation : ${currentUser.bio}`);
      }
      if (currentUser.skills && currentUser.skills.length > 0) {
        details.push(`Domaines d'expertise BDR : ${currentUser.skills.join(', ')}.`);
      }
      if (currentUser.services) {
        details.push(`Appui offert au réseau : ${currentUser.services}`);
      }
      if (currentUser.availabilities && currentUser.availabilities.length > 0) {
        details.push(`Disponibilités : ${currentUser.availabilities.join(', ')}.`);
      }
      if (currentUser.email && currentUser.privacy?.showEmail) {
        details.push(`Contact courriel professionnel : ${currentUser.email}.`);
      }
      if (extraNote && extraNote.trim()) {
        details.push(`Précision officielle ajoutée : ${extraNote.trim()}`);
      }

      profileContent = details.join(' ');
    } else {
      profileContent = `Référent officiel actif : ${roleLabel}. ${
        extraNote?.trim() ||
        'Disponible pour accompagner les membres sur la gouvernance, les adhésions et la communication institutionnelle de l’ALGB.'
      }`;
    }

    const entryId = `ai-kb-profile-${currentRole}-${currentUser?.id || 'system'}`;
    const entry: AiKnowledgeEntry = {
      id: entryId,
      title: `Référent ${roleLabel} · ${profileName}`,
      category: 'PROFIL_OFFICIEL',
      content: profileContent,
      source: 'PROFIL',
      authorName: profileName,
      authorRole: currentRole,
      authorPromotion,
      isActive: true,
      updatedAt: today,
    };

    setAiKnowledgeEntries((prev) => {
      const exists = prev.some((e) => e.id === entryId);
      if (exists) {
        return prev.map((e) => (e.id === entryId ? entry : e));
      }
      return [entry, ...prev];
    });

    addToast(
      'success',
      'Profil synchronisé avec l’IA',
      `Les données du profil ${profileName} (${roleLabel}) enrichissent désormais l’assistant.`
    );
    return entry;
  };

  // Reset to initial
  const resetAllData = () => {
    localStorage.clear();
    setSettings(INITIAL_SETTINGS);
    setMembers(INITIAL_MEMBERS);
    setPromotions(INITIAL_PROMOTIONS);
    setProjects(INITIAL_PROJECTS);
    setJobOffers(INITIAL_JOB_OFFERS);
    setNews(INITIAL_NEWS);
    setEvents(INITIAL_EVENTS);
    setTransactions(INITIAL_TRANSACTIONS);
    setPhotos(INITIAL_PHOTOS);
    setVideos(INITIAL_VIDEOS);
    setAiKnowledgeEntries(INITIAL_AI_KNOWLEDGE);
    setCurrentUser(INITIAL_MEMBERS[0]);
    setCurrentRole('MEMBRE');
    addToast('info', 'Réinitialisation terminée', 'Toutes les données ont été réinitialisées.');
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        selectedPromotionYear,
        setSelectedPromotionYear,
        currentRole,
        setCurrentRole,
        currentUser,
        setCurrentUser,
        members,
        promotions,
        projects,
        jobOffers,
        news,
        events,
        transactions,
        settings,
        updateSettings,
        updatePromotion,
        updateProject,
        deleteNewsItem,
        updateNewsItem,
        photos,
        videos,
        addPhoto,
        addYouTubeVideo,
        deleteYouTubeVideo,
        contributionModalProject,
        setContributionModalProject,
        viewingCardMember,
        setViewingCardMember,
        viewingReceipt,
        setViewingReceipt,
        viewingTransactionReceipt,
        setViewingTransactionReceipt,
        viewingQuitusMember,
        setViewingQuitusMember,
        paymentModalConfig,
        openPaymentModal,
        closePaymentModal,
        toasts,
        addToast,
        removeToast,
        newsAlertsEnabled,
        toggleNewsAlerts,
        browserPushPermission,
        requestBrowserPushPermission,
        focusedNewsId,
        setFocusedNewsId,
        triggerNewsNotification,
        processPayment,
        updateTransactionStatus,
        getMemberFinancialSummary,
        qrSyncModalOpen,
        qrTargetMember,
        qrAuthVerified,
        qrAuthSession,
        lastQrSyncReport,
        openQrSyncModal,
        closeQrSyncModal,
        verifyQrAccess,
        syncQrPaymentUpdate,
        aiChatOpen,
        setAiChatOpen,
        aiKnowledgeEntries,
        canEnrichAi,
        addAiKnowledgeEntry,
        toggleAiKnowledgeEntry,
        deleteAiKnowledgeEntry,
        enrichAiFromCurrentProfile,
        submitMembership,
        approveMember,
        rejectMember,
        enrollmentModalOpen,
        setEnrollmentModalOpen,
        submitEnrollment,
        approveEnrollment,
        rejectEnrollment,
        makeContribution,
        registerForEvent,
        postJobOffer,
        addNewsItem,
        updateMemberProfile,
        theme,
        setTheme,
        toggleTheme,
        resetAllData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
