import { AlumniMember } from '../data/mockData';
import type { NavigationTab, UserRole } from '../context/AppContext';

/**
 * RESTRICTIONS RESTORED ("GO"):
 * All role-based permissions, visitor rules, and cotisation-up-to-date gates
 * for Carrières au cœur du réseau, Trouver un Mentor, Collège des Parrains,
 * Espace Membre, and Console d'Administration are strictly enforced.
 */
export const UNRESTRICTED_ACCESS_OVERRIDE = false;

export interface ProfileAccessRule {
  role: UserRole;
  label: string;
  scopeLabel: string;
  scopeType: 'NONE' | 'SELF_ONLY' | 'PROMO_ONLY' | 'ALL_MEMBERS';
  canUpdateAllPaymentTables: boolean;
  mentorshipAccessRule: 'NONE' | 'UP_TO_DATE_ONLY';
  mentorshipRuleLabel: string;
  careersAccessRule: 'NONE' | 'UP_TO_DATE_ONLY';
  careersRuleLabel: string;
  description: string;
}

export interface MenuDefinition {
  tab: NavigationTab;
  label: string;
  category: 'PUBLIC' | 'ESPACE';
  lockedForVisitors?: boolean;
  description: string;
}

export const MENU_DEFINITIONS: MenuDefinition[] = [
  {
    tab: 'accueil',
    label: 'Accueil',
    category: 'PUBLIC',
    lockedForVisitors: true,
    description:
      'Page d’accueil officielle présentant l’Amicale et ses activités (toujours accessible sans credential).',
  },
  {
    tab: 'amicale',
    label: 'L’Amicale',
    category: 'PUBLIC',
    lockedForVisitors: true,
    description:
      'Présentation institutionnelle, missions, statuts, documents officiels et bureau exécutif.',
  },
  {
    tab: 'histoire',
    label: 'Histoire',
    category: 'PUBLIC',
    lockedForVisitors: true,
    description: 'Mémoire et patrimoine du Lycée de Garçons de Bingerville depuis 1903.',
  },
  {
    tab: 'anciens',
    label: 'Annuaire des Membres',
    category: 'PUBLIC',
    description: 'Annuaire officiel des membres, promotions, mentors et carte mondiale.',
  },
  {
    tab: 'reseau',
    label: 'Carrières & Offres',
    category: 'PUBLIC',
    description:
      'Portail emploi et mobilité. L’encart « Carrières au cœur du réseau » et les offres sont réservés aux membres à jour de cotisation.',
  },
  {
    tab: 'mentorat',
    label: 'Mentorat & Réseau Exécutif',
    category: 'PUBLIC',
    description:
      'Programme de parrainage. Les encarts « Trouver un Mentor » et « Collège des Parrains » sont réservés aux membres à jour de cotisation.',
  },
  {
    tab: 'projets',
    label: 'Mécénat & Bourses',
    category: 'PUBLIC',
    lockedForVisitors: true,
    description:
      'Mécénat en FCFA, bourses d’études, chantiers solidaires et mur des donateurs.',
  },
  {
    tab: 'actualites',
    label: 'Événements & Actualités',
    category: 'PUBLIC',
    lockedForVisitors: true,
    description: 'Gala annuel, conférences, networking, portraits et activités de l’Amicale.',
  },
  {
    tab: 'mediatheque',
    label: 'Médiathèque & Galerie',
    category: 'PUBLIC',
    lockedForVisitors: true,
    description: 'Archives photographiques et chaîne vidéo ALGB TV des activités.',
  },
  {
    tab: 'adhesion',
    label: 'Adhésion',
    category: 'PUBLIC',
    lockedForVisitors: true,
    description: 'Présentation de l’adhésion et formulaire d’enrôlement en ligne.',
  },
  {
    tab: 'contact',
    label: 'Contact & Partenariats',
    category: 'PUBLIC',
    lockedForVisitors: true,
    description: 'Coordonnées officielles et formulaire de correspondance.',
  },
  {
    tab: 'mentions-legales',
    label: 'Mentions Légales',
    category: 'PUBLIC',
    lockedForVisitors: true,
    description: 'Mentions légales officielles et gouvernance associative (Loi n° 60-315).',
  },
  {
    tab: 'confidentialite',
    label: 'Confidentialité & ARTCI',
    category: 'PUBLIC',
    lockedForVisitors: true,
    description: 'Politique de confidentialité conforme à la loi ARTCI n° 2013-450.',
  },
  {
    tab: 'cgu',
    label: 'CGU & Mécénat',
    category: 'PUBLIC',
    lockedForVisitors: true,
    description: 'Conditions générales d’utilisation et règlement des contributions en FCFA.',
  },
  {
    tab: 'espace-membre',
    label: 'Espace Membre & Paiements',
    category: 'ESPACE',
    description:
      'Tableau de bord adhérent, carte officielle QR certifiée, cotisations en FCFA, droits ARTCI et quitus.',
  },
  {
    tab: 'admin',
    label: 'Console d’Administration',
    category: 'ESPACE',
    description: 'Back-office trésorerie, adhésions, communication, gouvernance et credentials.',
  },
];

export const ALWAYS_PUBLIC_AMICALE_TABS: NavigationTab[] = [
  'accueil',
  'amicale',
  'histoire',
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

export const DEFAULT_VISITOR_ALLOWED_MENUS: NavigationTab[] = [
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

export const ALL_PUBLIC_TABS: NavigationTab[] = [...DEFAULT_VISITOR_ALLOWED_MENUS];

export const DEFAULT_ROLE_MENU_PERMISSIONS: Record<
  Exclude<UserRole, 'VISITEUR'>,
  NavigationTab[]
> = {
  MEMBRE: [...ALL_PUBLIC_TABS, 'espace-membre'],
  DELEGUE: [...ALL_PUBLIC_TABS, 'espace-membre'],
  RESPONSABLE_COMM: [...ALL_PUBLIC_TABS, 'espace-membre', 'admin'],
  RESPONSABLE_FINANCE: [...ALL_PUBLIC_TABS, 'espace-membre', 'admin'],
  ADMIN: [...ALL_PUBLIC_TABS, 'espace-membre', 'admin'],
  SUPER_ADMIN: [...ALL_PUBLIC_TABS, 'espace-membre', 'admin'],
};

export type CredentialEmailStatus = 'NON_ENVOYE' | 'EN_COURS' | 'ENVOYE' | 'ECHEC';

export interface AccessCredential {
  id: string;
  identifier: string;
  hasSecret?: boolean;
  displayName: string;
  role: Exclude<UserRole, 'VISITEUR'>;
  linkedMemberId?: string;
  recipientEmail?: string;
  allowedTabs: NavigationTab[];
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

export function generateAckToken(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  for (let i = 0; i < 20; i++) {
    token += chars[Math.floor(Math.random() * chars.length)];
  }
  return token;
}

export function resolveCredentialRecipientEmail(
  cred: Pick<AccessCredential, 'recipientEmail' | 'identifier' | 'linkedMemberId'>,
  members: AlumniMember[]
): string {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (cred.recipientEmail && emailRegex.test(cred.recipientEmail.trim())) {
    return cred.recipientEmail.trim();
  }
  if (cred.identifier && emailRegex.test(cred.identifier.trim())) {
    return cred.identifier.trim();
  }
  if (cred.linkedMemberId) {
    const linked = members.find((m) => m.id === cred.linkedMemberId);
    if (linked?.email && emailRegex.test(linked.email.trim())) {
      return linked.email.trim();
    }
  }
  return '';
}

export const PROFILE_ACCESS_MATRIX: Record<UserRole, ProfileAccessRule> = {
  VISITEUR: {
    role: 'VISITEUR',
    label: 'Visiteur public',
    scopeLabel: 'Présentation Amicale & Activités sans credential',
    scopeType: 'NONE',
    canUpdateAllPaymentTables: false,
    mentorshipAccessRule: 'NONE',
    mentorshipRuleLabel:
      'Trouver un Mentor & Collège des Parrains : Verrouillés (membres à jour uniquement)',
    careersAccessRule: 'NONE',
    careersRuleLabel: 'Carrières au cœur du réseau : Verrouillé (membres à jour uniquement)',
    description:
      'Consultation libre sans credential des informations publiques présentant l’Amicale et ses activités. Les espaces membres, carrières et parrainages sont protégés.',
  },
  MEMBRE: {
    role: 'MEMBRE',
    label: 'Membre Adhérent',
    scopeLabel: 'Espace personnel uniquement',
    scopeType: 'SELF_ONLY',
    canUpdateAllPaymentTables: false,
    mentorshipAccessRule: 'UP_TO_DATE_ONLY',
    mentorshipRuleLabel: 'Trouver un Mentor & Collège des Parrains : si cotisation à jour',
    careersAccessRule: 'UP_TO_DATE_ONLY',
    careersRuleLabel: 'Carrières au cœur du réseau : si cotisation à jour',
    description:
      'Accède à son espace membre, sa carte officielle QR et ses cotisations. Accède à « Trouver un Mentor », au « Collège des Parrains » et à « Carrières au cœur du réseau » uniquement si sa cotisation est à jour.',
  },
  DELEGUE: {
    role: 'DELEGUE',
    label: 'Délégué de Promotion',
    scopeLabel: 'Sa promotion & espace personnel',
    scopeType: 'PROMO_ONLY',
    canUpdateAllPaymentTables: false,
    mentorshipAccessRule: 'UP_TO_DATE_ONLY',
    mentorshipRuleLabel: 'Trouver un Mentor & Collège des Parrains : si cotisation à jour',
    careersAccessRule: 'UP_TO_DATE_ONLY',
    careersRuleLabel: 'Carrières au cœur du réseau : si cotisation à jour',
    description:
      'Accède à son espace membre et peut régulariser les paiements de sa promotion. L’accès aux carrières et au mentorat requiert une cotisation à jour.',
  },
  RESPONSABLE_COMM: {
    role: 'RESPONSABLE_COMM',
    label: 'Resp. Communication',
    scopeLabel: 'Communication & espace personnel',
    scopeType: 'SELF_ONLY',
    canUpdateAllPaymentTables: false,
    mentorshipAccessRule: 'UP_TO_DATE_ONLY',
    mentorshipRuleLabel: 'Trouver un Mentor & Collège des Parrains : si cotisation à jour',
    careersAccessRule: 'UP_TO_DATE_ONLY',
    careersRuleLabel: 'Carrières au cœur du réseau : si cotisation à jour',
    description:
      'Gère les communiqués officiels, actualités et base IA. L’accès personnel aux carrières et au mentorat est conditionné au statut de cotisation à jour.',
  },
  RESPONSABLE_FINANCE: {
    role: 'RESPONSABLE_FINANCE',
    label: 'Responsable Finance / Trésorier',
    scopeLabel: 'Tous les membres & Trésorerie',
    scopeType: 'ALL_MEMBERS',
    canUpdateAllPaymentTables: true,
    mentorshipAccessRule: 'UP_TO_DATE_ONLY',
    mentorshipRuleLabel: 'Trouver un Mentor & Collège des Parrains : si cotisation à jour',
    careersAccessRule: 'UP_TO_DATE_ONLY',
    careersRuleLabel: 'Carrières au cœur du réseau : si cotisation à jour',
    description:
      'Accès complet à la console trésorerie, encaissements en FCFA, pointages QR et tables comptables.',
  },
  ADMIN: {
    role: 'ADMIN',
    label: 'Administrateur ALGB',
    scopeLabel: 'Gouvernance & Credentials',
    scopeType: 'ALL_MEMBERS',
    canUpdateAllPaymentTables: true,
    mentorshipAccessRule: 'UP_TO_DATE_ONLY',
    mentorshipRuleLabel: 'Trouver un Mentor & Collège des Parrains : si cotisation à jour',
    careersAccessRule: 'UP_TO_DATE_ONLY',
    careersRuleLabel: 'Carrières au cœur du réseau : si cotisation à jour',
    description:
      'Plein exercice sur les profils, credentials, adhésions, finances, projets et communication.',
  },
  SUPER_ADMIN: {
    role: 'SUPER_ADMIN',
    label: 'Super Administrateur',
    scopeLabel: 'Autorité totale (Toutes tables)',
    scopeType: 'ALL_MEMBERS',
    canUpdateAllPaymentTables: true,
    mentorshipAccessRule: 'UP_TO_DATE_ONLY',
    mentorshipRuleLabel: 'Trouver un Mentor & Collège des Parrains : si cotisation à jour',
    careersAccessRule: 'UP_TO_DATE_ONLY',
    careersRuleLabel: 'Carrières au cœur du réseau : si cotisation à jour',
    description:
      'Contrôle complet sur tous les credentials, menus visiteurs, espaces de paiement et exports.',
  },
};

export interface CredentialAuthResult {
  allowed: boolean;
  reason?: string;
  credential?: AccessCredential;
  linkedMember?: AlumniMember | null;
}

export interface QrAccessAuthResult {
  allowed: boolean;
  reason?: string;
  authenticatedMember?: AlumniMember | null;
  rule: ProfileAccessRule;
}

export const canActiveSessionAccessMemberQr = (
  role: UserRole,
  currentUser: AlumniMember | null,
  targetMember: AlumniMember | null
): boolean => {
  if (UNRESTRICTED_ACCESS_OVERRIDE) return true;
  const rule = PROFILE_ACCESS_MATRIX[role];
  if (!rule || rule.scopeType === 'NONE') return false;
  if (rule.scopeType === 'ALL_MEMBERS') return true;
  if (!targetMember) return true;
  if (!currentUser) return false;
  if (rule.scopeType === 'SELF_ONLY') return currentUser.id === targetMember.id;
  if (rule.scopeType === 'PROMO_ONLY') return currentUser.promotionYear === targetMember.promotionYear;
  return false;
};
