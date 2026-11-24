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
  MentorshipRequestRecord,
  JobApplicationRecord,
  INITIAL_MENTORSHIP_REQUESTS,
  INITIAL_JOB_APPLICATIONS,
} from '../data/mockData';
import { DEFAULT_GOOGLE_SCRIPT_URL } from '../data/enrollmentData';
import {
  fetchSignedQrMetadata,
  generateMemberQrDataUrl,
  parseMemberQrPayload,
  QrVerificationResponse,
  verifyMemberQrAuthenticity,
} from '../utils/qrPayload';
import { resolveTabFromPath, TAB_TO_PATH } from '../utils/routes';
import { applySeoForTab } from '../utils/seo';
import {
  AccessCredential,
  ALWAYS_PUBLIC_AMICALE_TABS,
  canActiveSessionAccessMemberQr,
  CredentialAuthResult,
  DEFAULT_ROLE_MENU_PERMISSIONS,
  DEFAULT_VISITOR_ALLOWED_MENUS,
  generateAckToken,
  MENU_DEFINITIONS,
  PROFILE_ACCESS_MATRIX,
  QrAccessAuthResult,
  resolveCredentialRecipientEmail,
  UNRESTRICTED_ACCESS_OVERRIDE,
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
  | 'mentorat'
  | 'projets'
  | 'actualites'
  | 'galerie'
  | 'mediatheque'
  | 'adhesion'
  | 'espace-membre'
  | 'contact'
  | 'admin'
  | 'mentions-legales'
  | 'confidentialite'
  | 'cgu';

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
  tabHistory: NavigationTab[];
  previousTab: NavigationTab | null;
  canGoBack: boolean;
  goBack: () => void;
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
  isMemberUpToDate: (memberId: string) => boolean;
  isCurrentMemberUpToDate: boolean;
  currentMemberFinancialSummary: MemberFinancialSummary | null;
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
  }) => Promise<QrAccessAuthResult>;
  verifyQrAuthenticity: (rawInput: string) => Promise<QrVerificationResponse>;
  syncQrPaymentUpdate: (params: QrSyncParams) => QrSyncReport | null;
  // UEMOA Payment Gateway & ARTCI Privacy
  initiateUemoaPayment: (params: {
    type: PaymentType;
    amountFcfa: number;
    method: PaymentMethod;
    title: string;
    description?: string;
    memberId?: string;
    memberName?: string;
    projectId?: string;
    monthYears?: string[];
    phoneNumber?: string;
    isAnonymous?: boolean;
    frequency?: 'PONCTUEL' | 'MENSUEL';
  }) => Promise<{
    ok: boolean;
    intent?: { id: string; reference: string; signature: string; provider: string; amountFcfa: number };
    error?: string;
  }>;
  confirmUemoaPaymentWebhook: (
    intentId: string,
    signature: string
  ) => Promise<{
    ok: boolean;
    transaction?: MemberTransaction;
    contribution?: ProjectContribution;
    error?: string;
  }>;
  updateMyPrivacy: (updates: {
    showEmail?: boolean;
    showPhone?: boolean;
    allowMentorshipRequests?: boolean;
    shareContactsConsent?: boolean;
    bdrRegistered?: boolean;
  }) => Promise<boolean>;
  exportMyArtciData: () => Promise<boolean>;
  anonymizeMyAccount: () => Promise<boolean>;
  cacheOfflineMemberCard: (member: AlumniMember) => Promise<void>;
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
  // Profils, Credentials & Permissions d'accès
  accessCredentials: AccessCredential[];
  activeCredential: AccessCredential | null;
  sendingCredentialIds: string[];
  visitorAllowedMenus: NavigationTab[];
  roleMenuPermissions: Record<Exclude<UserRole, 'VISITEUR'>, NavigationTab[]>;
  authModalOpen: boolean;
  authRedirectTab: NavigationTab | null;
  openAuthModal: (redirectTab?: NavigationTab | null) => void;
  closeAuthModal: () => void;
  loginWithCredential: (identifier: string, secretCode: string) => Promise<CredentialAuthResult>;
  logoutSession: () => Promise<void>;
  createAccessCredential: (params: {
    identifier: string;
    secretCode: string;
    displayName: string;
    role: Exclude<UserRole, 'VISITEUR'>;
    linkedMemberId?: string;
    recipientEmail?: string;
    allowedTabs?: NavigationTab[];
    notes?: string;
    skipAutoEmail?: boolean;
  }) => Promise<AccessCredential | null>;
  sendCredentialEmail: (
    credentialId: string,
    sourceTrigger?: 'MANUAL' | 'APPROVE_MEMBER' | 'ENROLLMENT' | 'RESEND',
    overrideCred?: AccessCredential,
    initialSecretCode?: string
  ) => Promise<{ ok: boolean; error?: string }>;
  updateAccessCredential: (
    id: string,
    updates: Partial<AccessCredential> & { secretCode?: string }
  ) => Promise<void>;
  deleteAccessCredential: (id: string) => Promise<void>;
  updateVisitorAllowedMenus: (menus: NavigationTab[]) => void;
  updateRoleMenuPermissions: (role: Exclude<UserRole, 'VISITEUR'>, menus: NavigationTab[]) => void;
  canAccessTab: (tab: NavigationTab) => boolean;
  // Carrières, Mentorat, Mécénat & Newsletter
  mentorshipRequests: MentorshipRequestRecord[];
  jobApplications: JobApplicationRecord[];
  submitMentorshipRequest: (params: { mentorId: string; objective: string }) => MentorshipRequestRecord | null;
  updateMentorshipRequestStatus: (requestId: string, status: MentorshipRequestRecord['status']) => void;
  becomeMentor: (params: { currentRole?: string; company?: string; bio?: string; availabilities?: string[] }) => void;
  applyToJobOffer: (params: { jobId: string; note: string }) => JobApplicationRecord | null;
  submitPatronageDonation: (params: {
    amountFcfa: number;
    frequency: 'PONCTUEL' | 'MENSUEL';
    projectId: string;
    donorName?: string;
    isAnonymous?: boolean;
    method?: PaymentMethod;
  }) => ProjectContribution | null;
  newsletterSubscribers: string[];
  subscribeNewsletter: (email: string) => boolean;
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
  CREDENTIALS: 'algb_access_credentials_v1',
  ACTIVE_CREDENTIAL_ID: 'algb_active_credential_id_v1',
  VISITOR_MENUS: 'algb_visitor_menus_v1',
  ROLE_MENUS: 'algb_role_menus_v1',
  MENTORSHIP_REQUESTS: 'algb_mentorship_requests_v1',
  JOB_APPLICATIONS: 'algb_job_applications_v1',
  NEWSLETTER: 'algb_newsletter_v1',
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

export const OFFLINE_CARD_STORAGE_KEY = 'algb_offline_card_v1';
const SESSION_TOKEN_STORAGE_KEY = 'algb_session_token_fallback_v1';

function getStoredSessionToken(): string | null {
  try {
    return typeof window !== 'undefined'
      ? window.sessionStorage.getItem(SESSION_TOKEN_STORAGE_KEY)
      : null;
  } catch {
    return null;
  }
}

function setStoredSessionToken(token: string | null): void {
  try {
    if (typeof window === 'undefined') return;
    if (token) {
      window.sessionStorage.setItem(SESSION_TOKEN_STORAGE_KEY, token);
    } else {
      window.sessionStorage.removeItem(SESSION_TOKEN_STORAGE_KEY);
    }
  } catch {
    // ignore storage restriction
  }
}

function getAuthHeaders(extra?: Record<string, string>): Record<string, string> {
  const headers: Record<string, string> = { ...(extra || {}) };
  const token = getStoredSessionToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

async function syncServerSlice(slice: string, data: unknown): Promise<void> {
  try {
    await fetch('/api/state/sync', {
      method: 'POST',
      headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
      credentials: 'include',
      body: JSON.stringify({ slice, data }),
    });
  } catch {
    // Offline fallback: localStorage retains updates cleanly
  }
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTabState] = useState<NavigationTab>(() => {
    if (typeof window !== 'undefined') {
      return resolveTabFromPath(window.location.pathname);
    }
    return 'accueil';
  });
  const [tabHistory, setTabHistory] = useState<NavigationTab[]>([]);
  const [selectedPromotionYear, setSelectedPromotionYear] = useState<number | null>(null);

  const [settings, setSettings] = useState<AssociationSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (saved) {
        return { ...INITIAL_SETTINGS, ...JSON.parse(saved), currency: 'FCFA' };
      }
      return { ...INITIAL_SETTINGS, currency: 'FCFA' };
    } catch {
      return { ...INITIAL_SETTINGS, currency: 'FCFA' };
    }
  });

  const [accessCredentials, setAccessCredentials] = useState<AccessCredential[]>([]);

  const [sendingCredentialIds, setSendingCredentialIds] = useState<string[]>([]);

  const [visitorAllowedMenus, setVisitorAllowedMenus] = useState<NavigationTab[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.VISITOR_MENUS);
      if (saved) {
        const parsed = JSON.parse(saved) as NavigationTab[];
        if (Array.isArray(parsed)) {
          const withPublicAmicale = Array.from(
            new Set<NavigationTab>([
              ...ALWAYS_PUBLIC_AMICALE_TABS,
              ...parsed.filter((t) => t !== 'admin' && t !== 'espace-membre'),
            ])
          );
          if (!withPublicAmicale.includes('mentorat') && withPublicAmicale.includes('reseau')) {
            return [...withPublicAmicale, 'mentorat'];
          }
          return withPublicAmicale;
        }
      }
    } catch {
      // ignore
    }
    return DEFAULT_VISITOR_ALLOWED_MENUS;
  });

  const [roleMenuPermissions, setRoleMenuPermissions] = useState<
    Record<Exclude<UserRole, 'VISITEUR'>, NavigationTab[]>
  >(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ROLE_MENUS);
      if (saved) {
        const parsed = JSON.parse(saved) as Record<Exclude<UserRole, 'VISITEUR'>, NavigationTab[]>;
        const merged = { ...DEFAULT_ROLE_MENU_PERMISSIONS, ...parsed };
        (Object.keys(merged) as Array<Exclude<UserRole, 'VISITEUR'>>).forEach((r) => {
          if (!merged[r].includes('mentorat')) {
            merged[r] = [...merged[r], 'mentorat'];
          }
        });
        return merged;
      }
    } catch {
      // ignore
    }
    return DEFAULT_ROLE_MENU_PERMISSIONS;
  });

  const [activeCredentialState, setActiveCredentialState] = useState<AccessCredential | null>(null);
  const activeCredential = activeCredentialState && activeCredentialState.isActive ? activeCredentialState : null;

  const [currentRole, setCurrentRole] = useState<UserRole>('VISITEUR');

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authRedirectTab, setAuthRedirectTab] = useState<NavigationTab | null>(null);

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

  const [mentorshipRequests, setMentorshipRequests] = useState<MentorshipRequestRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MENTORSHIP_REQUESTS);
      return saved ? JSON.parse(saved) : INITIAL_MENTORSHIP_REQUESTS;
    } catch {
      return INITIAL_MENTORSHIP_REQUESTS;
    }
  });

  const [jobApplications, setJobApplications] = useState<JobApplicationRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.JOB_APPLICATIONS);
      return saved ? JSON.parse(saved) : INITIAL_JOB_APPLICATIONS;
    } catch {
      return INITIAL_JOB_APPLICATIONS;
    }
  });

  const [newsletterSubscribers, setNewsletterSubscribers] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NEWSLETTER);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Current logged in user (null in public Visitor mode until authenticated by server HttpOnly session)
  const [currentUser, setCurrentUser] = useState<AlumniMember | null>(null);

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
    UNRESTRICTED_ACCESS_OVERRIDE ||
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
      localStorage.setItem(STORAGE_KEYS.VISITOR_MENUS, JSON.stringify(visitorAllowedMenus));
    } catch {
      // ignore
    }
  }, [visitorAllowedMenus]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ROLE_MENUS, JSON.stringify(roleMenuPermissions));
    } catch {
      // ignore
    }
  }, [roleMenuPermissions]);

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

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.MENTORSHIP_REQUESTS, JSON.stringify(mentorshipRequests));
    } catch {
      // ignore
    }
  }, [mentorshipRequests]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.JOB_APPLICATIONS, JSON.stringify(jobApplications));
    } catch {
      // ignore
    }
  }, [jobApplications]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.NEWSLETTER, JSON.stringify(newsletterSubscribers));
    } catch {
      // ignore
    }
  }, [newsletterSubscribers]);

  // Dynamic SEO & Real URL Routing (History API)
  useEffect(() => {
    applySeoForTab(activeTab);
  }, [activeTab]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handlePopState = () => {
      const resolved = resolveTabFromPath(window.location.pathname);
      setActiveTabState(resolved);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Server Bootstrap (restores HttpOnly cookie session & authoritative state)
  const refreshBootstrap = async () => {
    try {
      const res = await fetch('/api/bootstrap', {
        headers: getAuthHeaders(),
        credentials: 'include',
      });
      if (!res.ok) return;
      const payload = (await res.json()) as {
        ok?: boolean;
        session?: {
          credential: AccessCredential;
          role: UserRole;
          currentUser: AlumniMember | null;
        } | null;
        settings?: AssociationSettings;
        visitorAllowedMenus?: NavigationTab[];
        roleMenuPermissions?: Record<Exclude<UserRole, 'VISITEUR'>, NavigationTab[]>;
        members?: AlumniMember[];
        promotions?: Promotion[];
        projects?: Project[];
        jobOffers?: JobOffer[];
        news?: NewsItem[];
        events?: EventItem[];
        transactions?: MemberTransaction[];
        mentorshipRequests?: MentorshipRequestRecord[];
        jobApplications?: JobApplicationRecord[];
        photos?: GalleryPhoto[];
        videos?: YouTubeVideo[];
        aiKnowledgeEntries?: AiKnowledgeEntry[];
        credentials?: AccessCredential[];
      };

      if (!payload.ok) return;
      if (payload.settings) setSettings({ ...payload.settings, currency: 'FCFA' });
      if (Array.isArray(payload.visitorAllowedMenus)) setVisitorAllowedMenus(payload.visitorAllowedMenus);
      if (payload.roleMenuPermissions) setRoleMenuPermissions(payload.roleMenuPermissions);
      if (Array.isArray(payload.members)) setMembers(payload.members);
      if (Array.isArray(payload.promotions)) setPromotions(payload.promotions);
      if (Array.isArray(payload.projects)) setProjects(payload.projects);
      if (Array.isArray(payload.jobOffers)) setJobOffers(payload.jobOffers);
      if (Array.isArray(payload.news)) setNews(payload.news);
      if (Array.isArray(payload.events)) setEvents(payload.events);
      if (Array.isArray(payload.transactions)) setTransactions(payload.transactions);
      if (Array.isArray(payload.mentorshipRequests)) setMentorshipRequests(payload.mentorshipRequests);
      if (Array.isArray(payload.jobApplications)) setJobApplications(payload.jobApplications);
      if (Array.isArray(payload.photos)) setPhotos(payload.photos);
      if (Array.isArray(payload.videos)) setVideos(payload.videos);
      if (Array.isArray(payload.aiKnowledgeEntries)) setAiKnowledgeEntries(payload.aiKnowledgeEntries);
      if (Array.isArray(payload.credentials)) setAccessCredentials(payload.credentials);

      if (payload.session) {
        setActiveCredentialState(payload.session.credential);
        setCurrentRole(payload.session.role);
        setCurrentUser(payload.session.currentUser);
      } else {
        setStoredSessionToken(null);
        setActiveCredentialState(null);
        setCurrentRole('VISITEUR');
        setCurrentUser(null);
      }
    } catch {
      // Offline mode: retained from localStorage
    }
  };

  useEffect(() => {
    void refreshBootstrap();
  }, []);

  // Cache authenticated member's signed digital card & QR for offline presentation at events/AGs
  const cacheOfflineMemberCard = async (member: AlumniMember) => {
    try {
      const sig = await fetchSignedQrMetadata(member);
      const qrDataUrl = await generateMemberQrDataUrl(member, sig || undefined);
      const payload = {
        member,
        qrDataUrl,
        sig,
        cachedAt: new Date().toISOString(),
      };
      localStorage.setItem(OFFLINE_CARD_STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // ignore offline cache failure
    }
  };

  useEffect(() => {
    if (currentUser && typeof navigator !== 'undefined' && navigator.onLine) {
      void cacheOfflineMemberCard(currentUser);
    }
  }, [currentUser?.id, currentUser?.membershipStatus]);

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
    setActiveTabState((prevTab) => {
      if (prevTab !== tab) {
        setTabHistory((history) => [...history.slice(-29), prevTab]);
      }
      return tab;
    });
    if (typeof window !== 'undefined') {
      const targetPath = TAB_TO_PATH[tab] || '/';
      if (window.location.pathname !== targetPath) {
        window.history.pushState({ tab }, '', targetPath);
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const previousTab: NavigationTab | null =
    tabHistory.length > 0
      ? tabHistory[tabHistory.length - 1]
      : activeTab !== 'accueil'
      ? 'accueil'
      : null;

  const canGoBack = tabHistory.length > 0 || activeTab !== 'accueil';

  const goBack = () => {
    if (tabHistory.length > 0) {
      const targetTab = tabHistory[tabHistory.length - 1];
      setTabHistory((history) => history.slice(0, -1));
      setActiveTabState(targetTab);
      if (typeof window !== 'undefined') {
        const targetPath = TAB_TO_PATH[targetTab] || '/';
        if (window.location.pathname !== targetPath) {
          window.history.pushState({ tab: targetTab }, '', targetPath);
        }
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (activeTab !== 'accueil') {
      setActiveTabState('accueil');
      if (typeof window !== 'undefined' && window.location.pathname !== '/') {
        window.history.pushState({ tab: 'accueil' }, '', '/');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (typeof window !== 'undefined' && window.history.length > 1) {
      window.history.back();
      return;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
    addToast(
      'info',
      'Page d’accueil active',
      'Vous êtes actuellement sur la page d’accueil. Visitez une rubrique pour utiliser le retour arrière.'
    );
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

  // Deep-link handlers: QR card scan & Credential email acknowledgment (?ackCred=...&token=...)
  useEffect(() => {
    if (typeof window === 'undefined' || !window.location.search) return;
    const params = new URLSearchParams(window.location.search);

    const ackCredId = params.get('ackCred');
    if (ackCredId) {
      const ackToken = params.get('token') || '';
      void (async () => {
        try {
          const res = await fetch('/api/auth/ack-credential', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ credentialId: ackCredId, token: ackToken }),
          });
          const data = (await res.json()) as {
            ok?: boolean;
            displayName?: string;
            identifier?: string;
            error?: string;
          };
          if (res.ok && data.ok) {
            addToast(
              'success',
              'Accusé de réception confirmé',
              `Réception des accès confirmée pour ${data.displayName} (${data.identifier}). Vous pouvez désormais vous connecter.`,
              {
                badge: 'Confirmation ALGB',
                durationMs: 9000,
                actionLabel: 'Se connecter →',
                onAction: () => openAuthModal('espace-membre'),
              }
            );
            void refreshBootstrap();
          } else {
            addToast(
              'warning',
              'Lien de confirmation expiré ou introuvable',
              data.error || 'Ce lien d’accusé de réception ne correspond à aucun credential actif.'
            );
          }
        } catch {
          addToast('warning', 'Confirmation impossible', 'Serveur indisponible.');
        }
      })();
      try {
        window.history.replaceState({}, '', window.location.pathname);
      } catch {
        // ignore history error
      }
      return;
    }

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

    setMembers((prev) => {
      const next = [newMember, ...prev];
      void syncServerSlice('enrollMember', newMember);
      return next;
    });

    // Update promo total
    setPromotions((prev) =>
      prev.map((p) => (p.year === promoYear ? { ...p, registeredMembers: p.registeredMembers + 1 } : p))
    );

    addToast(
      'success',
      'Adhésion enregistrée avec succès !',
      `Votre matricule provisoire est ${matricule}. Votre dossier est en cours de validation par l’Administration qui activera votre credential d’accès.`
    );

    return newMember;
  };

  // Administrator approval
  const approveMember = (memberId: string) => {
    const targetMember = members.find((m) => m.id === memberId);
    setMembers((prev) => {
      const next = prev.map((m) => (m.id === memberId ? { ...m, membershipStatus: 'A_JOUR' as const } : m));
      void syncServerSlice('members', next);
      return next;
    });

    const shouldAutoSend = settings.autoSendCredentialEmail !== false;

    if (targetMember) {
      const alreadyHasCred = accessCredentials.some(
        (c) =>
          c.linkedMemberId === targetMember.id ||
          c.identifier.toLowerCase() === targetMember.email.toLowerCase()
      );
      if (!alreadyHasCred) {
        void createAccessCredential({
          identifier: targetMember.email || targetMember.membershipCardId,
          secretCode: targetMember.membershipCardId,
          displayName: `${targetMember.firstName} ${targetMember.lastName}`,
          role: 'MEMBRE',
          linkedMemberId: targetMember.id,
          recipientEmail: targetMember.email || undefined,
          allowedTabs: roleMenuPermissions.MEMBRE,
          notes: 'Credential généré automatiquement lors de la validation d’adhésion.',
          skipAutoEmail: !shouldAutoSend,
        });
      }
    }

    addToast(
      'success',
      'Adhésion validée',
      'Le membre a été validé, sa carte officielle est active et son credential d’accès est prêt.'
    );
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

    const shouldAutoSend = settings.autoSendCredentialEmail !== false;
    let activatedCred: AccessCredential | null = null;
    let initialSecret = matricule;

    try {
      const enrollRes = await fetch('/api/enrollments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ member: newMember }),
      });
      if (enrollRes.ok) {
        const enrollData = (await enrollRes.json()) as {
          ok?: boolean;
          sessionToken?: string;
          credential?: AccessCredential;
          initialSecret?: string;
        };
        if (enrollData.sessionToken) {
          setStoredSessionToken(enrollData.sessionToken);
        }
        if (enrollData.ok && enrollData.credential) {
          activatedCred = enrollData.credential;
          initialSecret = enrollData.initialSecret || matricule;
        }
      }
    } catch {
      // Fallback local si hors-ligne
    }

    if (!activatedCred) {
      activatedCred = {
        id: `cred-${Date.now().toString().slice(-6)}`,
        identifier: newMember.email || matricule,
        hasSecret: true,
        displayName: `${newMember.firstName} ${newMember.lastName}`,
        role: 'MEMBRE',
        linkedMemberId: newMember.id,
        recipientEmail: newMember.email || undefined,
        allowedTabs: roleMenuPermissions.MEMBRE,
        isActive: true,
        createdAt: new Date().toISOString().split('T')[0],
        createdBy: 'Enrôlement en ligne ALGB',
        ackToken: generateAckToken(),
        emailStatus: shouldAutoSend && newMember.email ? 'EN_COURS' : 'NON_ENVOYE',
        notes: `Enrôlement en ligne (${matricule})`,
      };
    }

    setAccessCredentials((prev) => [activatedCred!, ...prev]);
    setActiveCredentialState(activatedCred);
    setCurrentRole('MEMBRE');
    setCurrentUser(newMember);
    setViewingCardMember(newMember);

    addToast(
      'success',
      'Enrôlement & Credential activés !',
      `Matricule ${matricule} intégré à l'annuaire. Identifiant : ${activatedCred.identifier} (Code initial : votre matricule ${initialSecret}).`
    );

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
    if (!UNRESTRICTED_ACCESS_OVERRIDE && (currentRole === 'VISITEUR' || !activeCredential)) {
      addToast(
        'warning',
        'Accès réservé aux membres à jour',
        'L’encart « Carrières au cœur du réseau » est réservé aux membres connectés à jour de leur cotisation.',
        {
          badge: 'Règle Carrières ALGB',
          actionLabel: 'Se connecter →',
          onAction: () => openAuthModal('reseau'),
        }
      );
      return;
    }

    if (!UNRESTRICTED_ACCESS_OVERRIDE && (!currentUser || !isCurrentMemberUpToDate)) {
      addToast(
        'warning',
        'Cotisation non à jour',
        'Régularisez votre cotisation pour publier une offre dans « Carrières au cœur du réseau ».',
        {
          badge: 'Cotisation requise',
          actionLabel: 'Régulariser →',
          onAction: () => {
            if (currentUser) {
              openPaymentModal({
                type: 'COTISATION_MENSUELLE',
                selectedMonths: currentMemberFinancialSummary?.overdueMonths,
              });
            } else {
              setActiveTab('espace-membre');
            }
          },
        }
      );
      return;
    }

    const newOffer: JobOffer = {
      ...offer,
      id: `job-${Date.now().toString().slice(-4)}`,
      postedDate: new Date().toISOString().split('T')[0],
    };
    setJobOffers((prev) => {
      const next = [newOffer, ...prev];
      void syncServerSlice('jobOffers', next);
      return next;
    });
    addToast('success', 'Offre publiée', 'L’opportunité est désormais visible pour les membres à jour.');
  };

  // Add news
  const addNewsItem = (item: Omit<NewsItem, 'id' | 'date'>): NewsItem => {
    const newItem: NewsItem = {
      ...item,
      id: `news-${Date.now().toString().slice(-4)}`,
      date: new Date().toISOString().split('T')[0],
    };
    setNews((prev) => {
      const next = [newItem, ...prev];
      void syncServerSlice('news', next);
      return next;
    });

    if (newsAlertsEnabled) {
      triggerNewsNotification(newItem);
    } else {
      addToast('success', 'Actualité diffusée', 'Le communiqué a été publié sur la page officielle.');
    }

    return newItem;
  };

  // Update member profile
  const updateMemberProfile = (memberId: string, updates: Partial<AlumniMember>) => {
    setMembers((prev) => {
      const next = prev.map((m) => {
        if (m.id === memberId) {
          const updated = { ...m, ...updates };
          if (currentUser?.id === memberId) {
            setCurrentUser(updated);
          }
          return updated;
        }
        return m;
      });
      void syncServerSlice('members', next);
      return next;
    });
    addToast('success', 'Profil actualisé', 'Vos modifications ont été enregistrées avec succès.');
  };

  // Carrières, Mentorat, Mécénat & Newsletter actions
  const submitMentorshipRequest = (params: {
    mentorId: string;
    objective: string;
  }): MentorshipRequestRecord | null => {
    if (!UNRESTRICTED_ACCESS_OVERRIDE && (currentRole === 'VISITEUR' || !activeCredential)) {
      addToast(
        'warning',
        'Accès réservé aux membres à jour',
        'Les encarts « Trouver un Mentor » et « Collège des Parrains » sont réservés aux membres connectés à jour de leur cotisation.',
        {
          badge: 'Règle Mentorat ALGB',
          actionLabel: 'Se connecter →',
          onAction: () => openAuthModal('mentorat'),
        }
      );
      return null;
    }

    if (!UNRESTRICTED_ACCESS_OVERRIDE && (!currentUser || !isCurrentMemberUpToDate)) {
      addToast(
        'warning',
        'Cotisation non à jour',
        'Régularisez votre cotisation pour accéder au « Collège des Parrains » et solliciter un mentor.',
        {
          badge: 'Cotisation requise',
          actionLabel: 'Régulariser →',
          onAction: () => {
            if (currentUser) {
              openPaymentModal({
                type: 'COTISATION_MENSUELLE',
                selectedMonths: currentMemberFinancialSummary?.overdueMonths,
              });
            } else {
              setActiveTab('espace-membre');
            }
          },
        }
      );
      return null;
    }

    const mentor = members.find((m) => m.id === params.mentorId);
    if (!mentor) return null;

    const effectiveUser = currentUser || (UNRESTRICTED_ACCESS_OVERRIDE ? members[0] || null : null);
    const menteeName = effectiveUser
      ? `${effectiveUser.firstName} ${effectiveUser.lastName}`
      : activeCredential?.displayName || 'Membre / Visiteur ALGB';

    const newReq: MentorshipRequestRecord = {
      id: `mreq-${Date.now().toString().slice(-5)}`,
      mentorId: mentor.id,
      mentorName: `${mentor.firstName} ${mentor.lastName}`,
      mentorRole: mentor.currentRole,
      menteeId: effectiveUser?.id || 'mem-guest',
      menteeName,
      menteePromo: effectiveUser?.promotionYear || 2024,
      objective: params.objective.trim(),
      status: 'EN_ATTENTE',
      createdAt: new Date().toISOString().split('T')[0],
    };

    setMentorshipRequests((prev) => {
      const next = [newReq, ...prev];
      void syncServerSlice('mentorshipRequests', next);
      return next;
    });
    addToast(
      'success',
      'Demande de mentorat transmise',
      `Votre sollicitation a été adressée à ${mentor.firstName} ${mentor.lastName} (${mentor.currentRole}).`
    );
    return newReq;
  };

  const updateMentorshipRequestStatus = (
    requestId: string,
    status: MentorshipRequestRecord['status']
  ) => {
    setMentorshipRequests((prev) => {
      const next = prev.map((req) => (req.id === requestId ? { ...req, status } : req));
      void syncServerSlice('mentorshipRequests', next);
      return next;
    });
    addToast(
      'success',
      'Statut de mentorat mis à jour',
      status === 'ACCEPTEE'
        ? 'Le parrainage est accepté.'
        : status === 'PLANIFIEE'
        ? 'Une session d’entretien est planifiée.'
        : 'La demande reste en attente.'
    );
  };

  const becomeMentor = (params: {
    currentRole?: string;
    company?: string;
    bio?: string;
    availabilities?: string[];
  }) => {
    const targetMember = currentUser || (UNRESTRICTED_ACCESS_OVERRIDE ? members[0] || null : null);
    if (targetMember) {
      updateMemberProfile(targetMember.id, {
        isMentor: true,
        currentRole: params.currentRole?.trim() || targetMember.currentRole,
        company: params.company?.trim() || targetMember.company,
        bio: params.bio?.trim() || targetMember.bio,
        availabilities:
          params.availabilities && params.availabilities.length > 0
            ? params.availabilities
            : Array.from(new Set([...(targetMember.availabilities || []), 'Mentorat'])),
        privacy: { ...targetMember.privacy, allowMentorshipRequests: true },
      });
      addToast(
        'success',
        'Statut Mentor activé',
        'Vous apparaissez désormais dans le collège des mentors dirigeants de l’ALGB.'
      );
      return;
    }

    addToast(
      'info',
      'Candidature Mentor enregistrée',
      'Connectez-vous ou finalisez votre adhésion pour activer votre badge Mentor sur votre fiche.'
    );
  };

  const applyToJobOffer = (params: {
    jobId: string;
    note: string;
  }): JobApplicationRecord | null => {
    if (!UNRESTRICTED_ACCESS_OVERRIDE && (currentRole === 'VISITEUR' || !activeCredential)) {
      addToast(
        'warning',
        'Accès réservé aux membres à jour',
        'L’encart « Carrières au cœur du réseau » et le dépôt de candidature sont réservés aux membres connectés à jour de leur cotisation.',
        {
          badge: 'Règle Carrières ALGB',
          actionLabel: 'Se connecter →',
          onAction: () => openAuthModal('reseau'),
        }
      );
      return null;
    }

    if (!UNRESTRICTED_ACCESS_OVERRIDE && (!currentUser || !isCurrentMemberUpToDate)) {
      addToast(
        'warning',
        'Cotisation non à jour',
        'Régularisez votre cotisation pour accéder aux offres « Carrières au cœur du réseau » et postuler.',
        {
          badge: 'Cotisation requise',
          actionLabel: 'Régulariser →',
          onAction: () => {
            if (currentUser) {
              openPaymentModal({
                type: 'COTISATION_MENSUELLE',
                selectedMonths: currentMemberFinancialSummary?.overdueMonths,
              });
            } else {
              setActiveTab('espace-membre');
            }
          },
        }
      );
      return null;
    }

    const job = jobOffers.find((j) => j.id === params.jobId);
    if (!job) return null;

    const effectiveUser = currentUser || (UNRESTRICTED_ACCESS_OVERRIDE ? members[0] || null : null);
    const applicantName = effectiveUser
      ? `${effectiveUser.firstName} ${effectiveUser.lastName}`
      : activeCredential?.displayName || 'Candidat ALGB';

    const newApp: JobApplicationRecord = {
      id: `japp-${Date.now().toString().slice(-5)}`,
      jobId: job.id,
      jobTitle: job.title,
      company: job.company,
      contractType: job.type,
      applicantId: effectiveUser?.id || 'mem-guest',
      applicantName,
      note: params.note.trim(),
      status: 'TRANSMISE',
      appliedAt: new Date().toISOString().split('T')[0],
    };

    setJobApplications((prev) => {
      const next = [newApp, ...prev];
      void syncServerSlice('jobApplications', next);
      return next;
    });
    addToast(
      'success',
      'Candidature transmise',
      `Votre dossier pour « ${job.title} » chez ${job.company} a été envoyé à ${job.postedBy} et ajouté à votre suivi.`
    );
    return newApp;
  };

  const submitPatronageDonation = (params: {
    amountFcfa: number;
    frequency: 'PONCTUEL' | 'MENSUEL';
    projectId: string;
    donorName?: string;
    isAnonymous?: boolean;
    method?: PaymentMethod;
  }): ProjectContribution | null => {
    const targetProject = projects.find((p) => p.id === params.projectId) || projects[0];
    if (!targetProject || params.amountFcfa <= 0) return null;

    const contributorName = params.isAnonymous
      ? 'Mécène Anonyme ALGB'
      : params.donorName?.trim() ||
        (currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : 'Mécène & Ami de l’ALGB');

    const freqLabel = params.frequency === 'MENSUEL' ? 'Engagement mensuel' : 'Don ponctuel';
    const fcfaLabel = `${params.amountFcfa.toLocaleString('fr-FR')} FCFA`;
    const usedMethod: PaymentMethod = params.method || 'WAVE';
    const contribMethod: ProjectContribution['method'] =
      usedMethod === 'ESPECES' ? 'VIREMENT' : usedMethod;

    const contribution = makeContribution(targetProject.id, {
      contributorName,
      promotionYear: currentUser?.promotionYear,
      amount: params.amountFcfa,
      currency: 'FCFA',
      method: contribMethod,
      isAnonymous: !!params.isAnonymous,
      message: `${freqLabel} de ${fcfaLabel} via l'espace Mécénat ALGB.`,
    });

    if (currentUser) {
      processPayment({
        type: 'DON_PROJET',
        amount: params.amountFcfa,
        method: usedMethod,
        title: `Mécénat : ${targetProject.title}`,
        description: `${freqLabel} · ${fcfaLabel}`,
        memberId: currentUser.id,
        status: 'PAYE',
      });
    }

    return contribution;
  };

  const subscribeNewsletter = (email: string): boolean => {
    const clean = email.trim().toLowerCase();
    if (!clean || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean)) {
      addToast('warning', 'Adresse invalide', 'Veuillez saisir une adresse e-mail valide pour la lettre d’information.');
      return false;
    }
    if (newsletterSubscribers.includes(clean)) {
      addToast('info', 'Déjà inscrit', `${clean} reçoit déjà la lettre mensuelle de l’ALGB.`);
      return true;
    }
    setNewsletterSubscribers((prev) => {
      const next = [clean, ...prev];
      void syncServerSlice('newsletter', next);
      return next;
    });
    addToast(
      'success',
      'Inscription confirmée',
      `Vous recevrez prochainement les éditions de la lettre institutionnelle ALGB sur ${clean}.`
    );
    return true;
  };

  // Variable parameter management
  const updateSettings = (updates: Partial<AssociationSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...updates, currency: 'FCFA' };
      try {
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
      } catch {
        // ignore
      }
      void syncServerSlice('settings', updated);
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
      void syncServerSlice('promotions', updated);
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
      void syncServerSlice('projects', updated);
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
      void syncServerSlice('news', updated);
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
      void syncServerSlice('news', updated);
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
    setPhotos((prev) => {
      const next = [newPhoto, ...prev];
      void syncServerSlice('photos', next);
      return next;
    });
    addToast('success', 'Photographie ajoutée', 'La photo a été intégrée à la médiathèque.');
  };

  const addYouTubeVideo = (video: Omit<YouTubeVideo, 'id'>) => {
    const newVideo: YouTubeVideo = {
      ...video,
      id: `yt-${Date.now().toString().slice(-4)}`,
    };
    setVideos((prev) => {
      const next = [newVideo, ...prev];
      void syncServerSlice('videos', next);
      return next;
    });
    addToast('success', 'Vidéo YouTube ajoutée', 'La vidéo a été ajoutée à la chaîne ALGB et à la médiathèque.');
  };

  const deleteYouTubeVideo = (id: string) => {
    setVideos((prev) => {
      const next = prev.filter((v) => v.id !== id);
      void syncServerSlice('videos', next);
      return next;
    });
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

    setTransactions((prev) => {
      const next = [newTx, ...prev];
      void syncServerSlice('transactions', next);
      return next;
    });

    // If Droit d'adhésion is payé, update membership status
    if (params.type === 'DROIT_ADHESION' && status === 'PAYE') {
      setMembers((prev) => {
        const next = prev.map((m) => (m.id === memberId ? { ...m, membershipStatus: 'A_JOUR' as const } : m));
        void syncServerSlice('members', next);
        return next;
      });
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
    setTransactions((prev) => {
      const next = prev.map((tx) => {
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
      });
      void syncServerSlice('transactions', next);
      return next;
    });

    if (affectedTx && (affectedTx as MemberTransaction).type === 'DROIT_ADHESION' && status === 'PAYE') {
      const memId = (affectedTx as MemberTransaction).memberId;
      setMembers((prev) => {
        const next = prev.map((m) => (m.id === memId ? { ...m, membershipStatus: 'A_JOUR' as const } : m));
        void syncServerSlice('members', next);
        return next;
      });
    }

    addToast(
      status === 'PAYE' ? 'success' : 'warning',
      `Transaction mise à jour : ${status}`,
      `L'état de la transaction a été modifié par le Trésorier.`
    );
  };

  const openQrSyncModal = (member?: AlumniMember | null) => {
    setLastQrSyncReport(null);
    if (UNRESTRICTED_ACCESS_OVERRIDE) {
      setQrAuthVerified(true);
      setQrAuthSession({
        role: currentRole,
        label: 'Accès libre temporaire',
        authenticatedName: currentUser
          ? `${currentUser.firstName} ${currentUser.lastName}`
          : activeCredential?.displayName || 'Tous profils (Accès ouvert)',
        scopeLabel: 'Toutes les cartes & tables de paiement',
      });
    } else {
      setQrAuthVerified(false);
      setQrAuthSession(null);
    }
    setQrTargetMember(member ?? null);
    setQrSyncModalOpen(true);
  };

  const closeQrSyncModal = () => {
    setQrSyncModalOpen(false);
    setQrTargetMember(null);
    setQrAuthVerified(false);
    setQrAuthSession(null);
  };

  const verifyQrAccess = async (params: {
    role: UserRole;
    identifier: string;
    accessCode: string;
    targetMember: AlumniMember | null;
  }): Promise<QrAccessAuthResult> => {
    const rule = PROFILE_ACCESS_MATRIX[params.role] || PROFILE_ACCESS_MATRIX.VISITEUR;
    if (UNRESTRICTED_ACCESS_OVERRIDE) {
      const authMember = currentUser || members[0] || null;
      setQrAuthVerified(true);
      setQrAuthSession({
        role: params.role,
        label: rule.label,
        authenticatedName: authMember ? `${authMember.firstName} ${authMember.lastName}` : params.identifier,
        scopeLabel: rule.scopeLabel,
      });
      return { allowed: true, authenticatedMember: authMember, rule };
    }

    try {
      const res = await fetch('/api/auth/verify-qr-operator', {
        method: 'POST',
        headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
        credentials: 'include',
        body: JSON.stringify({
          identifier: params.identifier,
          accessCode: params.accessCode,
          targetMemberId: params.targetMember?.id,
        }),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        credential?: AccessCredential;
        authenticatedName?: string;
        error?: string;
      };

      if (!res.ok || !data.ok || !data.credential) {
        return {
          allowed: false,
          reason: data.error || 'Identifiant ou code d’autorisation QR invalide.',
          rule,
        };
      }

      const matchedRule = PROFILE_ACCESS_MATRIX[data.credential.role] || rule;
      const linkedMember = data.credential.linkedMemberId
        ? members.find((m) => m.id === data.credential!.linkedMemberId) || null
        : null;

      setActiveCredentialState(data.credential);
      setCurrentRole(data.credential.role);
      if (linkedMember) {
        setCurrentUser(linkedMember);
      }

      const displayName = data.authenticatedName || data.credential.displayName;
      setQrAuthVerified(true);
      setQrAuthSession({
        role: data.credential.role,
        label: matchedRule.label,
        authenticatedName: displayName,
        scopeLabel: matchedRule.scopeLabel,
      });

      addToast(
        'success',
        `Accès déverrouillé : ${matchedRule.label}`,
        `Habilitation vérifiée (${matchedRule.scopeLabel}).`
      );

      return {
        allowed: true,
        authenticatedMember: linkedMember,
        rule: matchedRule,
      };
    } catch {
      return {
        allowed: false,
        reason: 'Serveur de vérification indisponible.',
        rule,
      };
    }
  };

  const verifyQrAuthenticity = async (rawInput: string): Promise<QrVerificationResponse> => {
    return verifyMemberQrAuthenticity(rawInput);
  };

  // UEMOA Payment Gateway (Wave, Orange Money, MTN MoMo, Moov Money, CB, Virement)
  const initiateUemoaPayment = async (params: {
    type: PaymentType;
    amountFcfa: number;
    method: PaymentMethod;
    title: string;
    description?: string;
    memberId?: string;
    memberName?: string;
    projectId?: string;
    monthYears?: string[];
    phoneNumber?: string;
    isAnonymous?: boolean;
    frequency?: 'PONCTUEL' | 'MENSUEL';
  }) => {
    try {
      const res = await fetch('/api/payments/initiate', {
        method: 'POST',
        headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
        credentials: 'include',
        body: JSON.stringify(params),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        intent?: { id: string; reference: string; signature: string; provider: string; amountFcfa: number };
        error?: string;
      };
      if (!res.ok || !data.ok || !data.intent) {
        return { ok: false, error: data.error || 'Échec d’initialisation du paiement.' };
      }
      return { ok: true, intent: data.intent };
    } catch {
      return { ok: false, error: 'Passerelle de paiement temporairement inaccessible.' };
    }
  };

  const confirmUemoaPaymentWebhook = async (intentId: string, signature: string) => {
    try {
      const res = await fetch('/api/payments/webhook', {
        method: 'POST',
        headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
        credentials: 'include',
        body: JSON.stringify({
          intentId,
          signature,
          event: 'PAYMENT_SUCCEEDED',
        }),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        transaction?: MemberTransaction;
        contribution?: ProjectContribution;
        error?: string;
      };
      if (!res.ok || !data.ok) {
        return { ok: false, error: data.error || 'Confirmation webhook refusée.' };
      }
      await refreshBootstrap();
      if (data.transaction) {
        setViewingTransactionReceipt(data.transaction);
        addToast(
          'success',
          'Paiement certifié par la passerelle ALGB',
          `Règlement de ${data.transaction.amount.toLocaleString('fr-FR')} FCFA validé (${data.transaction.receiptNumber}).`
        );
      }
      return {
        ok: true,
        transaction: data.transaction,
        contribution: data.contribution,
      };
    } catch {
      return { ok: false, error: 'Erreur réseau lors de la confirmation webhook.' };
    }
  };

  // ARTCI Privacy Rights (Loi n° 2013-450)
  const updateMyPrivacy = async (updates: {
    showEmail?: boolean;
    showPhone?: boolean;
    allowMentorshipRequests?: boolean;
    shareContactsConsent?: boolean;
    bdrRegistered?: boolean;
  }): Promise<boolean> => {
    try {
      const res = await fetch('/api/members/me/privacy', {
        method: 'PATCH',
        headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
        credentials: 'include',
        body: JSON.stringify(updates),
      });
      const data = (await res.json()) as { ok?: boolean; member?: AlumniMember; error?: string };
      if (!res.ok || !data.ok || !data.member) {
        addToast('warning', 'Mise à jour impossible', data.error || 'Action non autorisée.');
        return false;
      }
      setCurrentUser(data.member);
      setMembers((prev) => prev.map((m) => (m.id === data.member!.id ? data.member! : m)));
      addToast(
        'success',
        'Préférences ARTCI enregistrées',
        'Vos choix de visibilité et de consentement (Loi n° 2013-450) sont appliqués immédiatement.'
      );
      return true;
    } catch {
      addToast('error', 'Erreur réseau', 'Impossible d’enregistrer vos préférences.');
      return false;
    }
  };

  const exportMyArtciData = async (): Promise<boolean> => {
    try {
      const res = await fetch('/api/members/me/export', {
        headers: getAuthHeaders(),
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        addToast('warning', 'Export refusé', data.error || 'Veuillez vous connecter.');
        return false;
      }
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ALGB-Donnees-Personnelles-${currentUser?.membershipCardId || 'membre'}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      addToast(
        'success',
        'Export ARTCI téléchargé',
        'L’ensemble de vos données personnelles et transactions a été exporté au format JSON.'
      );
      return true;
    } catch {
      addToast('error', 'Erreur réseau', 'Impossible de générer votre export JSON.');
      return false;
    }
  };

  const anonymizeMyAccount = async (): Promise<boolean> => {
    try {
      const res = await fetch('/api/members/me/anonymize', {
        method: 'POST',
        headers: getAuthHeaders(),
        credentials: 'include',
      });
      if (!res.ok) {
        addToast('warning', 'Action impossible', 'Votre compte ne peut pas être anonymisé automatiquement.');
        return false;
      }
      setStoredSessionToken(null);
      setActiveCredentialState(null);
      setCurrentRole('VISITEUR');
      setCurrentUser(null);
      localStorage.removeItem(OFFLINE_CARD_STORAGE_KEY);
      setActiveTab('accueil');
      await refreshBootstrap();
      addToast(
        'info',
        'Compte anonymisé (Droit à l’oubli ARTCI)',
        'Vos données personnelles ont été effacées et anonymisées conformément à la loi n° 2013-450.'
      );
      return true;
    } catch {
      return false;
    }
  };

  const syncQrPaymentUpdate = (params: QrSyncParams): QrSyncReport | null => {
    const targetMember = members.find((m) => m.id === params.memberId) || currentUser;
    if (!targetMember) return null;

    if (
      !UNRESTRICTED_ACCESS_OVERRIDE &&
      (!qrAuthVerified || !canActiveSessionAccessMemberQr(currentRole, currentUser, targetMember))
    ) {
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

    const uniquePaidMonths = Array.from(new Set(paidMonths));
    const uniquePendingMonths = Array.from(new Set(pendingMonths)).filter(
      (mKey) => !uniquePaidMonths.includes(mKey)
    );

    // Check months 2026 up to current month (November 2026 = 2026-11)
    const currentMonthKey = '2026-11';
    const elapsedMonths = MONTHS_2026.filter((m) => m.key <= currentMonthKey).map((m) => m.key);
    const overdueMonths = elapsedMonths.filter(
      (mKey) => !uniquePaidMonths.includes(mKey) && !uniquePendingMonths.includes(mKey)
    );

    let statusFinancial: 'A_JOUR' | 'PARTIEL' | 'EN_RETARD' = 'A_JOUR';
    if (overdueMonths.length > 2) {
      statusFinancial = 'EN_RETARD';
    } else if (overdueMonths.length > 0 || uniquePendingMonths.length > 0) {
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
      paidMonths: uniquePaidMonths,
      pendingMonths: uniquePendingMonths,
      overdueMonths,
      statusFinancial,
      transactions: memberTxs,
    };
  };

  const isMemberUpToDate = (memberId: string): boolean => {
    const member = members.find((m) => m.id === memberId);
    if (!member || member.membershipStatus !== 'A_JOUR') return false;
    return getMemberFinancialSummary(memberId).statusFinancial === 'A_JOUR';
  };

  const currentMemberFinancialSummary = currentUser
    ? getMemberFinancialSummary(currentUser.id)
    : null;

  const isCurrentMemberUpToDate =
    UNRESTRICTED_ACCESS_OVERRIDE ||
    Boolean(
      currentRole !== 'VISITEUR' &&
        activeCredential &&
        currentUser &&
        currentUser.membershipStatus === 'A_JOUR' &&
        currentMemberFinancialSummary?.statusFinancial === 'A_JOUR'
    );

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

  // Credential Authentication & Access Control
  const openAuthModal = (redirectTab?: NavigationTab | null) => {
    setAuthRedirectTab(redirectTab ?? null);
    setAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setAuthModalOpen(false);
    setAuthRedirectTab(null);
  };

  const loginWithCredential = async (
    identifier: string,
    secretCode: string
  ): Promise<CredentialAuthResult> => {
    const maxAttempts = 3;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ identifier, secretCode }),
        });

        if (res.url && res.url.includes('__cookie_check')) {
          return {
            allowed: false,
            reason:
              'La session sécurisée de prévisualisation a expiré. Veuillez recharger la page (F5) puis vous reconnecter.',
          };
        }

        const rawBody = await res.text();
        const trimmed = rawBody.trim();
        const looksLikeHtml =
          trimmed.startsWith('<!') || trimmed.startsWith('<html') || trimmed.startsWith('<HTML');

        if ((res.status === 502 || res.status === 503 || res.status === 504) && attempt < maxAttempts - 1) {
          await new Promise((r) => setTimeout(r, 800 * (attempt + 1)));
          await fetch('/api/health', { credentials: 'include' }).catch(() => undefined);
          continue;
        }

        if (looksLikeHtml) {
          if (attempt < maxAttempts - 1) {
            await new Promise((r) => setTimeout(r, 800 * (attempt + 1)));
            continue;
          }
          return {
            allowed: false,
            reason:
              res.status === 502 || res.status === 503 || res.status === 504
                ? `Le serveur ALGB est en cours de redémarrage (HTTP ${res.status}). Patientez quelques secondes puis réessayez.`
                : `Le serveur API (/api/auth/login) a renvoyé une page HTML au lieu de JSON (HTTP ${res.status}). Rechargez la page (F5) et réessayez.`,
          };
        }

        let data: {
          ok?: boolean;
          sessionToken?: string;
          credential?: AccessCredential;
          currentUser?: AlumniMember | null;
          error?: string;
        } = {};
        try {
          data = rawBody ? (JSON.parse(rawBody) as typeof data) : {};
        } catch {
          return {
            allowed: false,
            reason: `Réponse inattendue du serveur d’authentification (HTTP ${res.status}).`,
          };
        }

        if (!res.ok || !data.ok || !data.credential) {
          return {
            allowed: false,
            reason: data.error || 'Identifiant ou code d’accès incorrect.',
          };
        }

        if (data.sessionToken) {
          setStoredSessionToken(data.sessionToken);
        }

        const cred = data.credential;
        setActiveCredentialState(cred);
        setCurrentRole(cred.role);
        setCurrentUser(data.currentUser ?? null);
        void refreshBootstrap();

        addToast(
          'success',
          `Bienvenue, ${cred.displayName}`,
          `Profil actif : ${PROFILE_ACCESS_MATRIX[cred.role].label}.`
        );

        const targetTab = authRedirectTab;
        setAuthModalOpen(false);
        setAuthRedirectTab(null);

        if (targetTab) {
          const normalized = targetTab === 'galerie' ? 'mediatheque' : targetTab;
          if (
            UNRESTRICTED_ACCESS_OVERRIDE ||
            cred.allowedTabs.includes(targetTab) ||
            cred.allowedTabs.includes(normalized)
          ) {
            setActiveTab(targetTab);
          } else {
            addToast(
              'warning',
              'Menu non attribué à ce profil',
              `Votre credential (${PROFILE_ACCESS_MATRIX[cred.role].label}) n’inclut pas l’accès à cette section.`
            );
          }
        }

        return {
          allowed: true,
          credential: cred,
          linkedMember: data.currentUser ?? null,
        };
      } catch {
        if (attempt < maxAttempts - 1) {
          await new Promise((r) => setTimeout(r, 800 * (attempt + 1)));
          await fetch('/api/health', { credentials: 'include' }).catch(() => undefined);
          continue;
        }
        const isOffline = typeof navigator !== 'undefined' && navigator.onLine === false;
        return {
          allowed: false,
          reason: isOffline
            ? 'Votre appareil semble hors ligne. Vérifiez votre connexion Internet puis réessayez.'
            : 'Serveur d’authentification temporairement inaccessible. Rechargez la page (F5) et réessayez.',
        };
      }
    }

    return {
      allowed: false,
      reason: 'Serveur d’authentification indisponible. Vérifiez votre connexion.',
    };
  };

  const logoutSession = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: getAuthHeaders(),
        credentials: 'include',
      });
    } catch {
      // ignore offline logout
    }

    setStoredSessionToken(null);
    setActiveCredentialState(null);
    setCurrentRole('VISITEUR');
    setCurrentUser(null);

    const normalizedActive = activeTab === 'galerie' ? 'mediatheque' : activeTab;
    const canKeepActive =
      UNRESTRICTED_ACCESS_OVERRIDE ||
      ALWAYS_PUBLIC_AMICALE_TABS.includes(activeTab) ||
      ALWAYS_PUBLIC_AMICALE_TABS.includes(normalizedActive) ||
      visitorAllowedMenus.includes(activeTab) ||
      visitorAllowedMenus.includes(normalizedActive);
    if (!canKeepActive) {
      setActiveTab('accueil');
    }

    void refreshBootstrap();
    addToast(
      'info',
      'Session déconnectée',
      'Vous naviguez désormais en mode Visiteur public (menus visiteurs sans credential).'
    );
  };

  const canManageCredentials =
    UNRESTRICTED_ACCESS_OVERRIDE || currentRole === 'ADMIN' || currentRole === 'SUPER_ADMIN';

  const sendCredentialEmail = async (
    credentialId: string,
    sourceTrigger: 'MANUAL' | 'APPROVE_MEMBER' | 'ENROLLMENT' | 'RESEND' = 'RESEND',
    overrideCred?: AccessCredential,
    initialSecretCode?: string
  ): Promise<{ ok: boolean; error?: string }> => {
    const targetCred =
      overrideCred || accessCredentials.find((c) => c.id === credentialId);

    if (!targetCred) {
      return { ok: false, error: 'Credential introuvable dans le registre.' };
    }

    const recipientEmail = resolveCredentialRecipientEmail(targetCred, members);
    if (!recipientEmail) {
      const missingErr =
        "Aucune adresse e-mail valide pour ce credential. Renseignez une adresse e-mail destinataire dans la fiche.";
      setAccessCredentials((prev) =>
        prev.map((c) =>
          c.id === targetCred.id
            ? { ...c, emailStatus: 'ECHEC', emailError: missingErr }
            : c
        )
      );
      if (sourceTrigger === 'RESEND') {
        addToast('warning', 'Envoi impossible', missingErr);
      }
      return { ok: false, error: missingErr };
    }

    const ackToken = targetCred.ackToken || generateAckToken();
    const senderEmail = (
      settings.credentialSenderEmail ||
      settings.officialEmail ||
      'contact@algb-bingerville.ci'
    ).trim();
    const senderName = (
      settings.credentialSenderName ||
      'Secrétariat Général ALGB'
    ).trim();

    const portalUrl =
      typeof window !== 'undefined' ? window.location.origin : 'https://algb.netlify.app';
    const ackUrl = `${portalUrl}/?ackCred=${encodeURIComponent(
      targetCred.id
    )}&token=${encodeURIComponent(ackToken)}`;

    const allowedMenusLabels = targetCred.allowedTabs
      .filter((t) => t !== 'galerie')
      .map((t) => MENU_DEFINITIONS.find((m) => m.tab === t)?.label || t);

    setSendingCredentialIds((prev) =>
      prev.includes(targetCred.id) ? prev : [...prev, targetCred.id]
    );
    setAccessCredentials((prev) =>
      prev.map((c) =>
        c.id === targetCred.id
          ? {
              ...c,
              ackToken,
              recipientEmail: c.recipientEmail || recipientEmail,
              emailStatus: 'EN_COURS',
              emailError: undefined,
            }
          : c
      )
    );

    try {
      const response = await fetch('/api/credentials/send-email', {
        method: 'POST',
        headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
        credentials: 'include',
        body: JSON.stringify({
          credentialId: targetCred.id,
          recipientEmail,
          recipientName: targetCred.displayName,
          identifier: targetCred.identifier,
          secretCode: initialSecretCode || '',
          roleLabel: PROFILE_ACCESS_MATRIX[targetCred.role].label,
          allowedMenusLabels,
          senderEmail,
          senderName,
          associationName: settings.associationName,
          portalUrl,
          ackUrl,
          copyToAdmin: settings.credentialAckCopyToAdmin !== false,
          sourceTrigger,
        }),
      });

      const data = (await response.json().catch(() => ({}))) as {
        ok?: boolean;
        provider?: string;
        messageId?: string;
        sentAt?: string;
        senderUsed?: string;
        error?: string;
      };

      if (!response.ok || !data.ok) {
        const errorMsg =
          data.error || `Échec serveur lors de l’envoi e-mail (HTTP ${response.status}).`;
        setAccessCredentials((prev) =>
          prev.map((c) =>
            c.id === targetCred.id
              ? {
                  ...c,
                  emailStatus: 'ECHEC',
                  emailError: errorMsg,
                }
              : c
          )
        );
        addToast('warning', 'Envoi e-mail non abouti', errorMsg, { durationMs: 7000 });
        return { ok: false, error: errorMsg };
      }

      const sentAt =
        data.sentAt ||
        new Date().toLocaleString('fr-FR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });

      setAccessCredentials((prev) =>
        prev.map((c) =>
          c.id === targetCred.id
            ? {
                ...c,
                ackToken,
                recipientEmail: c.recipientEmail || recipientEmail,
                emailStatus: 'ENVOYE',
                emailSentAt: sentAt,
                emailSenderUsed: data.senderUsed || senderEmail,
                emailProvider: data.provider || 'Serveur Mail',
                emailMessageId: data.messageId,
                emailError: undefined,
              }
            : c
        )
      );

      addToast(
        'success',
        'Credential envoyé par e-mail',
        `Transmis à ${recipientEmail} depuis ${data.senderUsed || senderEmail} avec demande d’accusé de réception.`,
        { badge: data.provider || 'E-mail ALGB', durationMs: 6500 }
      );
      return { ok: true };
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error
          ? err.message
          : 'Impossible de joindre la route serveur /api/credentials/send-email.';
      setAccessCredentials((prev) =>
        prev.map((c) =>
          c.id === targetCred.id
            ? {
                ...c,
                emailStatus: 'ECHEC',
                emailError: errorMsg,
              }
            : c
        )
      );
      addToast('warning', 'Erreur réseau envoi e-mail', errorMsg);
      return { ok: false, error: errorMsg };
    } finally {
      setSendingCredentialIds((prev) => prev.filter((id) => id !== targetCred.id));
    }
  };

  const createAccessCredential = async (params: {
    identifier: string;
    secretCode: string;
    displayName: string;
    role: Exclude<UserRole, 'VISITEUR'>;
    linkedMemberId?: string;
    recipientEmail?: string;
    allowedTabs?: NavigationTab[];
    notes?: string;
    skipAutoEmail?: boolean;
  }): Promise<AccessCredential | null> => {
    if (!canManageCredentials) {
      addToast(
        'error',
        'Action réservée',
        'Seuls les profils Administrateur et Super Administrateur peuvent créer des credentials.'
      );
      return null;
    }

    const cleanId = params.identifier.trim();
    const cleanCode = params.secretCode.trim();
    const cleanName = params.displayName.trim();

    if (!cleanId || !cleanCode || !cleanName) {
      addToast('error', 'Champs requis', 'Identifiant, nom affiché et code secret sont obligatoires.');
      return null;
    }

    const tabs =
      params.allowedTabs && params.allowedTabs.length > 0
        ? params.allowedTabs
        : roleMenuPermissions[params.role];

    const resolvedRecipient = resolveCredentialRecipientEmail(
      {
        recipientEmail: params.recipientEmail,
        identifier: cleanId,
        linkedMemberId: params.linkedMemberId,
      },
      members
    );

    try {
      const res = await fetch('/api/credentials', {
        method: 'POST',
        headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
        credentials: 'include',
        body: JSON.stringify({
          identifier: cleanId,
          secretCode: cleanCode,
          displayName: cleanName,
          role: params.role,
          linkedMemberId: params.linkedMemberId || undefined,
          recipientEmail: resolvedRecipient || params.recipientEmail?.trim() || undefined,
          allowedTabs: Array.from(new Set(['accueil', ...tabs])),
          notes: params.notes?.trim() || undefined,
        }),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        credential?: AccessCredential;
        error?: string;
      };
      if (!res.ok || !data.ok || !data.credential) {
        addToast('error', 'Création refusée', data.error || 'Impossible de créer le credential.');
        return null;
      }

      const newCred = data.credential;
      setAccessCredentials((prev) => [newCred, ...prev]);
      addToast(
        'success',
        'Credential créé et haché sur serveur',
        `Accès « ${newCred.identifier} » activé pour le profil ${PROFILE_ACCESS_MATRIX[newCred.role].label}.`
      );

      const shouldAutoSend = !params.skipAutoEmail && settings.autoSendCredentialEmail !== false;
      if (shouldAutoSend && resolvedRecipient) {
        void sendCredentialEmail(newCred.id, 'MANUAL', newCred, cleanCode);
      }

      return newCred;
    } catch {
      addToast('error', 'Erreur réseau', 'Impossible de joindre le serveur.');
      return null;
    }
  };

  const updateAccessCredential = async (
    id: string,
    updates: Partial<AccessCredential> & { secretCode?: string }
  ): Promise<void> => {
    if (!canManageCredentials) return;
    try {
      const res = await fetch(`/api/credentials/${encodeURIComponent(id)}`, {
        method: 'PATCH',
        headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
        credentials: 'include',
        body: JSON.stringify(updates),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        credential?: AccessCredential;
        error?: string;
      };
      if (!res.ok || !data.ok || !data.credential) {
        addToast('warning', 'Mise à jour refusée', data.error || 'Échec de modification.');
        return;
      }
      setAccessCredentials((prev) => prev.map((c) => (c.id === id ? data.credential! : c)));
      if (activeCredential?.id === id) {
        setActiveCredentialState(data.credential);
      }
      addToast('success', 'Credential mis à jour', 'Les droits et paramètres d’accès ont été enregistrés.');
    } catch {
      addToast('error', 'Erreur réseau', 'Impossible de joindre le serveur.');
    }
  };

  const deleteAccessCredential = async (id: string): Promise<void> => {
    if (!canManageCredentials) return;
    if (activeCredential && id === activeCredential.id) {
      addToast(
        'warning',
        'Action bloquée',
        'Vous ne pouvez pas supprimer le credential actuellement connecté.'
      );
      return;
    }
    try {
      const res = await fetch(`/api/credentials/${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
        credentials: 'include',
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        addToast('warning', 'Suppression bloquée', data.error || 'Échec de suppression.');
        return;
      }
      setAccessCredentials((prev) => prev.filter((c) => c.id !== id));
      addToast('info', 'Credential supprimé', 'L’accès a été révoqué et retiré du registre.');
    } catch {
      addToast('error', 'Erreur réseau', 'Impossible de joindre le serveur.');
    }
  };

  const updateVisitorAllowedMenus = (menus: NavigationTab[]) => {
    if (!canManageCredentials) return;
    const sanitized = Array.from(
      new Set<NavigationTab>([
        ...ALWAYS_PUBLIC_AMICALE_TABS,
        ...menus.filter((m) => m !== 'admin' && m !== 'espace-membre'),
      ])
    );
    if (sanitized.includes('mediatheque') && !sanitized.includes('galerie')) {
      sanitized.push('galerie');
    }
    setVisitorAllowedMenus(sanitized);
    void syncServerSlice('visitorAllowedMenus', sanitized);
    addToast(
      'success',
      'Menus Visiteurs mis à jour',
      'Les rubriques publiques accessibles sans credential ont été enregistrées.'
    );
  };

  const updateRoleMenuPermissions = (
    role: Exclude<UserRole, 'VISITEUR'>,
    menus: NavigationTab[]
  ) => {
    if (!canManageCredentials) return;
    const sanitized = Array.from(new Set<NavigationTab>(['accueil', ...menus]));
    if (sanitized.includes('mediatheque') && !sanitized.includes('galerie')) {
      sanitized.push('galerie');
    }
    setRoleMenuPermissions((prev) => {
      const next = {
        ...prev,
        [role]: sanitized,
      };
      void syncServerSlice('roleMenuPermissions', next);
      return next;
    });
    addToast(
      'success',
      `Matrice ${PROFILE_ACCESS_MATRIX[role].label} mise à jour`,
      'Les menus par défaut du profil ont été enregistrés.'
    );
  };

  const canAccessTab = (tab: NavigationTab): boolean => {
    if (UNRESTRICTED_ACCESS_OVERRIDE) return true;
    const normalized: NavigationTab = tab === 'galerie' ? 'mediatheque' : tab;
    if (currentRole === 'VISITEUR' || !activeCredential) {
      if (normalized === 'admin' || normalized === 'espace-membre') return false;
      if (
        ALWAYS_PUBLIC_AMICALE_TABS.includes(tab) ||
        ALWAYS_PUBLIC_AMICALE_TABS.includes(normalized)
      ) {
        return true;
      }
      return visitorAllowedMenus.includes(tab) || visitorAllowedMenus.includes(normalized);
    }
    return (
      activeCredential.allowedTabs.includes(tab) ||
      activeCredential.allowedTabs.includes(normalized)
    );
  };

  // Reset to initial
  const resetAllData = () => {
    localStorage.clear();
    void syncServerSlice('resetDemo', true);
    setSettings(INITIAL_SETTINGS);
    setMembers(INITIAL_MEMBERS);
    setPromotions(INITIAL_PROMOTIONS);
    setProjects(INITIAL_PROJECTS);
    setJobOffers(INITIAL_JOB_OFFERS);
    setNews(INITIAL_NEWS);
    setEvents(INITIAL_EVENTS);
    setTransactions(INITIAL_TRANSACTIONS);
    setMentorshipRequests(INITIAL_MENTORSHIP_REQUESTS);
    setJobApplications(INITIAL_JOB_APPLICATIONS);
    setNewsletterSubscribers([]);
    setPhotos(INITIAL_PHOTOS);
    setVideos(INITIAL_VIDEOS);
    setAiKnowledgeEntries(INITIAL_AI_KNOWLEDGE);
    setAccessCredentials([]);
    setSendingCredentialIds([]);
    setVisitorAllowedMenus(DEFAULT_VISITOR_ALLOWED_MENUS);
    setRoleMenuPermissions(DEFAULT_ROLE_MENU_PERMISSIONS);
    setActiveCredentialState(null);
    setCurrentUser(null);
    setCurrentRole('VISITEUR');
    setTabHistory([]);
    setActiveTabState('accueil');
    if (typeof window !== 'undefined') {
      window.history.pushState({ tab: 'accueil' }, '', '/');
    }
    void refreshBootstrap();
    addToast('info', 'Réinitialisation terminée', 'Données et sessions réinitialisées (mode Visiteur public).');
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        tabHistory,
        previousTab,
        canGoBack,
        goBack,
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
        isMemberUpToDate,
        isCurrentMemberUpToDate,
        currentMemberFinancialSummary,
        qrSyncModalOpen,
        qrTargetMember,
        qrAuthVerified,
        qrAuthSession,
        lastQrSyncReport,
        openQrSyncModal,
        closeQrSyncModal,
        verifyQrAccess,
        verifyQrAuthenticity,
        syncQrPaymentUpdate,
        initiateUemoaPayment,
        confirmUemoaPaymentWebhook,
        updateMyPrivacy,
        exportMyArtciData,
        anonymizeMyAccount,
        cacheOfflineMemberCard,
        aiChatOpen,
        setAiChatOpen,
        aiKnowledgeEntries,
        canEnrichAi,
        addAiKnowledgeEntry,
        toggleAiKnowledgeEntry,
        deleteAiKnowledgeEntry,
        enrichAiFromCurrentProfile,
        accessCredentials,
        activeCredential,
        sendingCredentialIds,
        visitorAllowedMenus,
        roleMenuPermissions,
        authModalOpen,
        authRedirectTab,
        openAuthModal,
        closeAuthModal,
        loginWithCredential,
        logoutSession,
        createAccessCredential,
        sendCredentialEmail,
        updateAccessCredential,
        deleteAccessCredential,
        updateVisitorAllowedMenus,
        updateRoleMenuPermissions,
        canAccessTab,
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
        mentorshipRequests,
        jobApplications,
        submitMentorshipRequest,
        updateMentorshipRequestStatus,
        becomeMentor,
        applyToJobOffer,
        submitPatronageDonation,
        newsletterSubscribers,
        subscribeNewsletter,
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
