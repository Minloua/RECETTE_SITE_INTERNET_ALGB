import fs from 'node:fs';
import path from 'node:path';
import {
  AlumniMember,
  AssociationSettings,
  EventItem,
  INITIAL_EVENTS,
  INITIAL_JOB_APPLICATIONS,
  INITIAL_JOB_OFFERS,
  INITIAL_MEMBERS,
  INITIAL_MENTORSHIP_REQUESTS,
  INITIAL_NEWS,
  INITIAL_PHOTOS,
  INITIAL_PROJECTS,
  INITIAL_PROMOTIONS,
  INITIAL_SETTINGS,
  INITIAL_TRANSACTIONS,
  INITIAL_VIDEOS,
  GalleryPhoto,
  JobApplicationRecord,
  JobOffer,
  MemberTransaction,
  MentorshipRequestRecord,
  NewsItem,
  PaymentMethod,
  Project,
  Promotion,
  YouTubeVideo,
} from '../src/data/mockData.ts';
import { hashSecret, ServerUserRole } from './security.ts';

export type CredentialEmailStatus = 'NON_ENVOYE' | 'EN_COURS' | 'ENVOYE' | 'ECHEC';

export interface ServerCredentialRecord {
  id: string;
  identifier: string;
  secretHash: string;
  displayName: string;
  role: Exclude<ServerUserRole, 'VISITEUR'>;
  linkedMemberId?: string;
  recipientEmail?: string;
  allowedTabs: string[];
  isActive: boolean;
  createdAt: string;
  createdBy: string;
  lastLoginAt?: string;
  firstLoginAt?: string;
  emailStatus?: CredentialEmailStatus;
  emailSentAt?: string;
  emailSenderUsed?: string;
  emailProvider?: string;
  emailMessageId?: string;
  emailError?: string;
  ackToken?: string;
  acknowledgedAt?: string;
  notes?: string;
  isSeededDefault?: boolean;
}

export type PublicCredentialSummary = Omit<ServerCredentialRecord, 'secretHash'> & {
  hasSecret: true;
};

export interface ServerAiKnowledgeEntry {
  id: string;
  title: string;
  category: 'ADHESION' | 'EVENEMENTS' | 'AMICALE' | 'PROFIL_OFFICIEL';
  content: string;
  source: 'MANUEL' | 'PROFIL';
  authorName: string;
  authorRole: ServerUserRole;
  authorPromotion?: number;
  isActive: boolean;
  updatedAt: string;
}

export interface PaymentIntentRecord {
  id: string;
  reference: string;
  provider: 'CINETPAY' | 'PAYDUNYA' | 'WAVE' | 'SANDBOX_UEMOA';
  method: PaymentMethod;
  type: 'DROIT_ADHESION' | 'COTISATION_MENSUELLE' | 'DON_PROJET' | 'AUTRE';
  amountFcfa: number;
  currency: 'FCFA';
  memberId?: string;
  memberName?: string;
  projectId?: string;
  monthYears?: string[];
  title: string;
  description?: string;
  phoneNumber?: string;
  status: 'PENDING' | 'PAID' | 'FAILED';
  createdAt: string;
  paidAt?: string;
  signature: string;
  isAnonymous?: boolean;
  frequency?: 'PONCTUEL' | 'MENSUEL';
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: string;
  role: ServerUserRole;
  action: string;
  target?: string;
}

export interface AlgbDatabaseState {
  version: number;
  settings: AssociationSettings;
  visitorAllowedMenus: string[];
  roleMenuPermissions: Record<Exclude<ServerUserRole, 'VISITEUR'>, string[]>;
  credentials: ServerCredentialRecord[];
  members: AlumniMember[];
  promotions: Promotion[];
  projects: Project[];
  jobOffers: JobOffer[];
  news: NewsItem[];
  events: EventItem[];
  transactions: MemberTransaction[];
  mentorshipRequests: MentorshipRequestRecord[];
  jobApplications: JobApplicationRecord[];
  newsletterSubscribers: string[];
  photos: GalleryPhoto[];
  videos: YouTubeVideo[];
  aiKnowledgeEntries: ServerAiKnowledgeEntry[];
  paymentIntents: PaymentIntentRecord[];
  auditLogs: AuditLogEntry[];
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'algb-db.json');

const ALL_PUBLIC_TABS = [
  'accueil',
  'amicale',
  'histoire',
  'anciens',
  'reseau',
  'mentorat',
  'projets',
  'actualites',
  'mediatheque',
  'galerie',
  'adhesion',
  'contact',
  'mentions-legales',
  'confidentialite',
  'cgu',
];

const DEFAULT_ROLE_MENUS: Record<Exclude<ServerUserRole, 'VISITEUR'>, string[]> = {
  MEMBRE: [...ALL_PUBLIC_TABS, 'espace-membre'],
  DELEGUE: [...ALL_PUBLIC_TABS, 'espace-membre'],
  RESPONSABLE_COMM: [...ALL_PUBLIC_TABS, 'espace-membre', 'admin'],
  RESPONSABLE_FINANCE: [...ALL_PUBLIC_TABS, 'espace-membre', 'admin'],
  ADMIN: [...ALL_PUBLIC_TABS, 'espace-membre', 'admin'],
  SUPER_ADMIN: [...ALL_PUBLIC_TABS, 'espace-membre', 'admin'],
};

const INITIAL_AI_KNOWLEDGE: ServerAiKnowledgeEntry[] = [
  {
    id: 'ai-kb-1',
    title: 'Accueil & Orientation des Nouveaux Membres',
    category: 'ADHESION',
    content:
      "Tout ancien élève souhaitant adhérer peut compléter la fiche d'enrôlement en ligne (rubrique Adhésion) en précisant son année de promotion et son pseudo éventuel du lycée. Dès validation, sa carte officielle avec QR Code certifié est disponible dans l'Espace Membre.",
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

function createSeedCredentials(): ServerCredentialRecord[] {
  const seeded: Array<{
    id: string;
    identifier: string;
    initialPass: string;
    displayName: string;
    role: Exclude<ServerUserRole, 'VISITEUR'>;
    linkedMemberId?: string;
    notes: string;
  }> = [
    {
      id: 'cred-superadmin',
      identifier: 'superadmin@algb.ci',
      initialPass: process.env.ALGB_SEED_SUPERADMIN || 'ALGB-SUP-2026',
      displayName: 'Dr. Sébastien Yapi (Super Admin)',
      role: 'SUPER_ADMIN',
      linkedMemberId: 'mem-002',
      notes: 'Compte Super Administrateur initial — Autorité complète et gestion des credentials.',
    },
    {
      id: 'cred-admin',
      identifier: 'admin@algb.ci',
      initialPass: process.env.ALGB_SEED_ADMIN || 'ALGB-ADM-2026',
      displayName: 'Jean-Luc Bamba (Administrateur)',
      role: 'ADMIN',
      linkedMemberId: 'mem-003',
      notes: 'Compte Administration générale & gouvernance ALGB.',
    },
    {
      id: 'cred-finance',
      identifier: 'tresorier@algb.ci',
      initialPass: process.env.ALGB_SEED_FINANCE || 'ALGB-FIN-2026',
      displayName: 'Idriss Coulibaly (Trésorier)',
      role: 'RESPONSABLE_FINANCE',
      linkedMemberId: 'mem-006',
      notes: 'Trésorerie générale, validation des encaissements et quitus.',
    },
    {
      id: 'cred-comm',
      identifier: 'comm@algb.ci',
      initialPass: process.env.ALGB_SEED_COMM || 'ALGB-COM-2026',
      displayName: 'Me Moussa Diomandé (Communication)',
      role: 'RESPONSABLE_COMM',
      linkedMemberId: 'mem-004',
      notes: 'Gestion des communiqués officiels, agenda et base IA.',
    },
    {
      id: 'cred-delegue',
      identifier: 'amadou.toure@algb-alumni.ci',
      initialPass: process.env.ALGB_SEED_DELEGUE || 'ALGB-DEL-2026',
      displayName: 'Amadou Touré (Délégué Promo 2002)',
      role: 'DELEGUE',
      linkedMemberId: 'mem-001',
      notes: 'Délégué Promotion 2002 — Suivi promotion et paiements promo.',
    },
    {
      id: 'cred-membre',
      identifier: 'stephane.kassi@algb-alumni.ci',
      initialPass: process.env.ALGB_SEED_MEMBRE || 'ALGB-MEM-2026',
      displayName: 'Stéphane Kassi (Membre Adhérent)',
      role: 'MEMBRE',
      linkedMemberId: 'mem-005',
      notes: 'Accès membre adhérent standard.',
    },
  ];

  return seeded.map((item) => ({
    id: item.id,
    identifier: item.identifier,
    secretHash: hashSecret(item.initialPass),
    displayName: item.displayName,
    role: item.role,
    linkedMemberId: item.linkedMemberId,
    allowedTabs: DEFAULT_ROLE_MENUS[item.role],
    isActive: true,
    createdAt: '2026-01-10',
    createdBy: 'Système ALGB',
    notes: item.notes,
    isSeededDefault: true,
  }));
}

function buildInitialDb(): AlgbDatabaseState {
  return {
    version: 1,
    settings: { ...INITIAL_SETTINGS, currency: 'FCFA' },
    visitorAllowedMenus: [...ALL_PUBLIC_TABS],
    roleMenuPermissions: DEFAULT_ROLE_MENUS,
    credentials: createSeedCredentials(),
    members: INITIAL_MEMBERS,
    promotions: INITIAL_PROMOTIONS,
    projects: INITIAL_PROJECTS,
    jobOffers: INITIAL_JOB_OFFERS,
    news: INITIAL_NEWS,
    events: INITIAL_EVENTS,
    transactions: INITIAL_TRANSACTIONS,
    mentorshipRequests: INITIAL_MENTORSHIP_REQUESTS,
    jobApplications: INITIAL_JOB_APPLICATIONS,
    newsletterSubscribers: [],
    photos: INITIAL_PHOTOS,
    videos: INITIAL_VIDEOS,
    aiKnowledgeEntries: INITIAL_AI_KNOWLEDGE,
    paymentIntents: [],
    auditLogs: [],
  };
}

let cachedDb: AlgbDatabaseState | null = null;

export function getDb(): AlgbDatabaseState {
  if (cachedDb) return cachedDb;
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf8');
      const parsed = JSON.parse(raw) as AlgbDatabaseState;
      if (parsed && Array.isArray(parsed.members) && Array.isArray(parsed.credentials)) {
        parsed.settings = { ...INITIAL_SETTINGS, ...parsed.settings, currency: 'FCFA' };
        cachedDb = parsed;
        return cachedDb;
      }
    }
  } catch (err) {
    console.warn('Initialisation d’une nouvelle base ALGB suite à erreur lecture:', err);
  }

  cachedDb = buildInitialDb();
  persistDb(cachedDb);
  return cachedDb;
}

export function persistDb(db: AlgbDatabaseState): void {
  cachedDb = db;
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    const tmpFile = `${DB_FILE}.tmp`;
    fs.writeFileSync(tmpFile, JSON.stringify(db, null, 2), 'utf8');
    fs.renameSync(tmpFile, DB_FILE);
  } catch (err) {
    console.error('Erreur lors de la sauvegarde base de données ALGB:', err);
  }
}

export function resetDbToInitial(): AlgbDatabaseState {
  const fresh = buildInitialDb();
  persistDb(fresh);
  return fresh;
}

export function appendAuditLog(
  db: AlgbDatabaseState,
  entry: Omit<AuditLogEntry, 'id' | 'timestamp'>
): void {
  db.auditLogs = [
    {
      id: `audit-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      timestamp: new Date().toISOString(),
      ...entry,
    },
    ...db.auditLogs.slice(0, 199),
  ];
}

export function sanitizeCredential(cred: ServerCredentialRecord): PublicCredentialSummary {
  const { secretHash: _removed, ...safe } = cred;
  return { ...safe, hasSecret: true };
}

export function sanitizeMemberForViewer(
  member: AlumniMember,
  viewerRole: ServerUserRole,
  viewerMemberId?: string
): AlumniMember {
  const isPrivileged =
    viewerRole === 'ADMIN' ||
    viewerRole === 'SUPER_ADMIN' ||
    viewerRole === 'RESPONSABLE_FINANCE' ||
    (viewerMemberId && viewerMemberId === member.id);

  if (isPrivileged) {
    return member;
  }

  const isAuthenticated = viewerRole !== 'VISITEUR';
  const showEmail = isAuthenticated && member.privacy?.showEmail;
  const showPhone = isAuthenticated && member.privacy?.showPhone && member.shareContactsConsent !== false;

  return {
    ...member,
    email: showEmail ? member.email : 'contact-protege@algb.ci',
    phone: showPhone ? member.phone : undefined,
    whatsapp: showPhone ? member.whatsapp : undefined,
    observations: undefined,
  };
}
