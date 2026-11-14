import { AlumniMember } from '../data/mockData';
import type { NavigationTab, UserRole } from '../context/AppContext';

export interface ProfileAccessRule {
  role: UserRole;
  label: string;
  accessCode: string;
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
    description: 'Page d’accueil officielle présentant l’Amicale et ses activités (toujours accessible sans credential).',
  },
  {
    tab: 'amicale',
    label: 'L’Amicale',
    category: 'PUBLIC',
    lockedForVisitors: true,
    description: 'Présentation institutionnelle, missions, statuts, bureau exécutif et FAQ (toujours accessible sans credential).',
  },
  {
    tab: 'histoire',
    label: 'Histoire',
    category: 'PUBLIC',
    lockedForVisitors: true,
    description: 'Mémoire et patrimoine du Lycée de Garçons de Bingerville (toujours accessible sans credential).',
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
    description: 'Mécénat, bourses d’études, chantiers solidaires et mur des donateurs (toujours accessible sans credential).',
  },
  {
    tab: 'actualites',
    label: 'Événements & Actualités',
    category: 'PUBLIC',
    lockedForVisitors: true,
    description: 'Gala annuel, conférences, networking, portraits et activités de l’Amicale (toujours accessible sans credential).',
  },
  {
    tab: 'mediatheque',
    label: 'Médiathèque & Galerie',
    category: 'PUBLIC',
    lockedForVisitors: true,
    description: 'Archives photographiques et chaîne vidéo ALGB TV des activités (toujours accessible sans credential).',
  },
  {
    tab: 'adhesion',
    label: 'Adhésion',
    category: 'PUBLIC',
    lockedForVisitors: true,
    description: 'Présentation de l’adhésion et formulaire d’enrôlement en ligne (toujours accessible sans credential).',
  },
  {
    tab: 'contact',
    label: 'Contact & Partenariats',
    category: 'PUBLIC',
    lockedForVisitors: true,
    description: 'Coordonnées officielles et formulaire de correspondance (toujours accessible sans credential).',
  },
  {
    tab: 'espace-membre',
    label: 'Espace Membre & Paiements',
    category: 'ESPACE',
    description: 'Tableau de bord adhérent, carte officielle, QR paiement, cotisations et quitus.',
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
];

export const ALL_PUBLIC_TABS: NavigationTab[] = [
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
];

export const DEFAULT_ROLE_MENU_PERMISSIONS: Record<Exclude<UserRole, 'VISITEUR'>, NavigationTab[]> = {
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
  secretCode: string;
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

export const INITIAL_ACCESS_CREDENTIALS: AccessCredential[] = [
  {
    id: 'cred-superadmin',
    identifier: 'superadmin@algb.ci',
    secretCode: 'ALGB-SUP-2026',
    displayName: 'Dr. Sébastien Yapi (Super Admin)',
    role: 'SUPER_ADMIN',
    linkedMemberId: 'mem-002',
    allowedTabs: DEFAULT_ROLE_MENU_PERMISSIONS.SUPER_ADMIN,
    isActive: true,
    createdAt: '2026-01-10',
    createdBy: 'Système ALGB',
    notes: 'Compte Super Administrateur initial — Autorité complète et gestion des credentials.',
    isSeededDefault: true,
  },
  {
    id: 'cred-admin',
    identifier: 'admin@algb.ci',
    secretCode: 'ALGB-ADM-2026',
    displayName: 'Jean-Luc Bamba (Administrateur)',
    role: 'ADMIN',
    linkedMemberId: 'mem-003',
    allowedTabs: DEFAULT_ROLE_MENU_PERMISSIONS.ADMIN,
    isActive: true,
    createdAt: '2026-01-10',
    createdBy: 'Super Administrateur',
    notes: 'Compte Administration générale & gouvernance ALGB.',
    isSeededDefault: true,
  },
  {
    id: 'cred-finance',
    identifier: 'tresorier@algb.ci',
    secretCode: 'ALGB-FIN-2026',
    displayName: 'Idriss Coulibaly (Trésorier)',
    role: 'RESPONSABLE_FINANCE',
    linkedMemberId: 'mem-006',
    allowedTabs: DEFAULT_ROLE_MENU_PERMISSIONS.RESPONSABLE_FINANCE,
    isActive: true,
    createdAt: '2026-01-10',
    createdBy: 'Super Administrateur',
    notes: 'Trésorerie générale, validation des encaissements et quitus.',
    isSeededDefault: true,
  },
  {
    id: 'cred-comm',
    identifier: 'comm@algb.ci',
    secretCode: 'ALGB-COM-2026',
    displayName: 'Me Moussa Diomandé (Communication)',
    role: 'RESPONSABLE_COMM',
    linkedMemberId: 'mem-004',
    allowedTabs: DEFAULT_ROLE_MENU_PERMISSIONS.RESPONSABLE_COMM,
    isActive: true,
    createdAt: '2026-01-10',
    createdBy: 'Administrateur ALGB',
    notes: 'Gestion des communiqués officiels, agenda et base IA.',
    isSeededDefault: true,
  },
  {
    id: 'cred-delegue',
    identifier: 'amadou.toure@algb-alumni.ci',
    secretCode: 'ALGB-DEL-2026',
    displayName: 'Amadou Touré (Délégué Promo 2002)',
    role: 'DELEGUE',
    linkedMemberId: 'mem-001',
    allowedTabs: DEFAULT_ROLE_MENU_PERMISSIONS.DELEGUE,
    isActive: true,
    createdAt: '2026-01-12',
    createdBy: 'Administrateur ALGB',
    notes: 'Délégué Promotion 2002 — Suivi promotion et paiements promo.',
    isSeededDefault: true,
  },
  {
    id: 'cred-membre',
    identifier: 'stephane.kassi@algb-alumni.ci',
    secretCode: 'ALGB-MEM-2026',
    displayName: 'Stéphane Kassi (Membre Adhérent)',
    role: 'MEMBRE',
    linkedMemberId: 'mem-005',
    allowedTabs: DEFAULT_ROLE_MENU_PERMISSIONS.MEMBRE,
    isActive: true,
    createdAt: '2026-01-15',
    createdBy: 'Administrateur ALGB',
    notes: 'Accès membre adhérent standard.',
    isSeededDefault: true,
  },
];

export const PROFILE_ACCESS_MATRIX: Record<UserRole, ProfileAccessRule> = {
  VISITEUR: {
    role: 'VISITEUR',
    label: 'Visiteur public',
    accessCode: '',
    scopeLabel: 'Présentation Amicale & Activités sans credential',
    scopeType: 'NONE',
    canUpdateAllPaymentTables: false,
    mentorshipAccessRule: 'NONE',
    mentorshipRuleLabel: 'Trouver un Mentor & Collège des Parrains : Verrouillés (membres à jour uniquement)',
    careersAccessRule: 'NONE',
    careersRuleLabel: 'Carrières au cœur du réseau : Verrouillé (membres à jour uniquement)',
    description:
      'Consultation libre sans credential de toutes les informations présentant l’Amicale et ses activités (Accueil, L’Amicale, Histoire, Événements, Mécénat, Médiathèque, Adhésion, Contact). Les encarts « Trouver un Mentor », « Collège des Parrains » et « Carrières au cœur du réseau » restent verrouillés.',
  },
  MEMBRE: {
    role: 'MEMBRE',
    label: 'Membre Adhérent',
    accessCode: 'ALGB-MEM-2026',
    scopeLabel: 'Espace personnel uniquement',
    scopeType: 'SELF_ONLY',
    canUpdateAllPaymentTables: false,
    mentorshipAccessRule: 'UP_TO_DATE_ONLY',
    mentorshipRuleLabel: 'Trouver un Mentor & Collège des Parrains : si cotisation à jour',
    careersAccessRule: 'UP_TO_DATE_ONLY',
    careersRuleLabel: 'Carrières au cœur du réseau : si cotisation à jour',
    description:
      'Accède à son espace membre, sa carte officielle et ses cotisations. Accède à « Trouver un Mentor », au « Collège des Parrains » et à « Carrières au cœur du réseau » uniquement si sa cotisation est à jour.',
  },
  DELEGUE: {
    role: 'DELEGUE',
    label: 'Délégué de Promotion',
    accessCode: 'ALGB-DEL-2026',
    scopeLabel: 'Sa promotion & espace personnel',
    scopeType: 'PROMO_ONLY',
    canUpdateAllPaymentTables: false,
    mentorshipAccessRule: 'UP_TO_DATE_ONLY',
    mentorshipRuleLabel: 'Trouver un Mentor & Collège des Parrains : si cotisation à jour',
    careersAccessRule: 'UP_TO_DATE_ONLY',
    careersRuleLabel: 'Carrières au cœur du réseau : si cotisation à jour',
    description:
      'Accède à son espace membre et peut régulariser les paiements de sa promotion. L’accès à « Trouver un Mentor », au « Collège des Parrains » et à « Carrières au cœur du réseau » requiert une cotisation à jour.',
  },
  RESPONSABLE_COMM: {
    role: 'RESPONSABLE_COMM',
    label: 'Resp. Communication',
    accessCode: 'ALGB-COM-2026',
    scopeLabel: 'Communication & espace personnel',
    scopeType: 'SELF_ONLY',
    canUpdateAllPaymentTables: false,
    mentorshipAccessRule: 'UP_TO_DATE_ONLY',
    mentorshipRuleLabel: 'Trouver un Mentor & Collège des Parrains : si cotisation à jour',
    careersAccessRule: 'UP_TO_DATE_ONLY',
    careersRuleLabel: 'Carrières au cœur du réseau : si cotisation à jour',
    description:
      'Gère les communiqués officiels, actualités et base IA. L’accès à « Trouver un Mentor », au « Collège des Parrains » et à « Carrières au cœur du réseau » est conditionné au statut de cotisation à jour.',
  },
  RESPONSABLE_FINANCE: {
    role: 'RESPONSABLE_FINANCE',
    label: 'Responsable Finance / Trésorier',
    accessCode: 'ALGB-FIN-2026',
    scopeLabel: 'Tous les membres & Trésorerie',
    scopeType: 'ALL_MEMBERS',
    canUpdateAllPaymentTables: true,
    mentorshipAccessRule: 'UP_TO_DATE_ONLY',
    mentorshipRuleLabel: 'Trouver un Mentor & Collège des Parrains : si cotisation à jour',
    careersAccessRule: 'UP_TO_DATE_ONLY',
    careersRuleLabel: 'Carrières au cœur du réseau : si cotisation à jour',
    description:
      'Accès complet à la console trésorerie, encaissements, pointages QR et tables comptables. L’accès au Collège des Parrains et à Carrières au cœur du réseau suit la règle de cotisation à jour.',
  },
  ADMIN: {
    role: 'ADMIN',
    label: 'Administrateur ALGB',
    accessCode: 'ALGB-ADM-2026',
    scopeLabel: 'Gouvernance & Credentials',
    scopeType: 'ALL_MEMBERS',
    canUpdateAllPaymentTables: true,
    mentorshipAccessRule: 'UP_TO_DATE_ONLY',
    mentorshipRuleLabel: 'Trouver un Mentor & Collège des Parrains : si cotisation à jour',
    careersAccessRule: 'UP_TO_DATE_ONLY',
    careersRuleLabel: 'Carrières au cœur du réseau : si cotisation à jour',
    description:
      'Plein exercice sur les profils, credentials, adhésions, finances, projets et communication. L’accès personnel au Collège des Parrains et à Carrières au cœur du réseau reste soumis à une cotisation à jour.',
  },
  SUPER_ADMIN: {
    role: 'SUPER_ADMIN',
    label: 'Super Administrateur',
    accessCode: 'ALGB-SUP-2026',
    scopeLabel: 'Autorité totale (Toutes tables)',
    scopeType: 'ALL_MEMBERS',
    canUpdateAllPaymentTables: true,
    mentorshipAccessRule: 'UP_TO_DATE_ONLY',
    mentorshipRuleLabel: 'Trouver un Mentor & Collège des Parrains : si cotisation à jour',
    careersAccessRule: 'UP_TO_DATE_ONLY',
    careersRuleLabel: 'Carrières au cœur du réseau : si cotisation à jour',
    description:
      'Contrôle complet sur tous les credentials, menus visiteurs, espaces de paiement et exports. L’accès personnel au Collège des Parrains et à Carrières au cœur du réseau requiert une cotisation à jour.',
  },
};

export interface CredentialAuthResult {
  allowed: boolean;
  reason?: string;
  credential?: AccessCredential;
  linkedMember?: AlumniMember | null;
}

export const authenticateUserCredential = (params: {
  identifier: string;
  secretCode: string;
  credentials: AccessCredential[];
  members: AlumniMember[];
}): CredentialAuthResult => {
  const trimmedId = params.identifier.trim().toLowerCase();
  const trimmedCode = params.secretCode.trim();

  if (!trimmedId) {
    return {
      allowed: false,
      reason: 'Veuillez saisir votre identifiant de connexion (e-mail, matricule ou login).',
    };
  }

  if (!trimmedCode) {
    return {
      allowed: false,
      reason: 'Veuillez saisir votre code d’accès (credential).',
    };
  }

  const matchedCredential = params.credentials.find((cred) => {
    if (cred.identifier.trim().toLowerCase() === trimmedId) return true;
    if (cred.linkedMemberId) {
      const m = params.members.find((mem) => mem.id === cred.linkedMemberId);
      if (
        m &&
        (m.email.toLowerCase() === trimmedId || m.membershipCardId.toLowerCase() === trimmedId)
      ) {
        return true;
      }
    }
    return false;
  });

  if (!matchedCredential) {
    return {
      allowed: false,
      reason:
        'Aucun credential correspondant trouvé. Contactez l’Administration ALGB pour obtenir vos accès.',
    };
  }

  if (!matchedCredential.isActive) {
    return {
      allowed: false,
      reason:
        'Ce compte d’accès a été suspendu par l’Administration ALGB. Veuillez contacter le secrétariat.',
    };
  }

  if (matchedCredential.secretCode.trim() !== trimmedCode) {
    return {
      allowed: false,
      reason: 'Code d’accès incorrect pour cet identifiant. Vérifiez vos informations.',
    };
  }

  const linkedMember = matchedCredential.linkedMemberId
    ? params.members.find((m) => m.id === matchedCredential.linkedMemberId) || null
    : null;

  return {
    allowed: true,
    credential: matchedCredential,
    linkedMember,
  };
};

export interface QrAccessAuthResult {
  allowed: boolean;
  reason?: string;
  authenticatedMember?: AlumniMember | null;
  rule: ProfileAccessRule;
}

export const authorizeQrPaymentAccess = (params: {
  role: UserRole;
  identifier: string;
  accessCode: string;
  targetMember: AlumniMember | null;
  members: AlumniMember[];
  credentials?: AccessCredential[];
}): QrAccessAuthResult => {
  const rule = PROFILE_ACCESS_MATRIX[params.role];

  if (!rule || rule.scopeType === 'NONE') {
    return {
      allowed: false,
      rule,
      reason:
        'Le profil Visiteur public n’est pas autorisé à accéder aux espaces de paiement. Sélectionnez un profil habilité.',
    };
  }

  const trimmedId = params.identifier.trim().toLowerCase();
  const trimmedCode = params.accessCode.trim();

  if (!trimmedId) {
    return {
      allowed: false,
      rule,
      reason:
        'Veuillez saisir votre identifiant dédié (e-mail, matricule ALGB-... ou identifiant fonction).',
    };
  }

  if (!trimmedCode) {
    return {
      allowed: false,
      rule,
      reason: 'Veuillez saisir le code d’accès dédié correspondant à votre profil.',
    };
  }

  // 1. Check dynamic credentials created in Administration first
  if (params.credentials && params.credentials.length > 0) {
    const matchedCred = params.credentials.find((cred) => {
      if (cred.identifier.trim().toLowerCase() === trimmedId) return true;
      if (cred.linkedMemberId) {
        const m = params.members.find((mem) => mem.id === cred.linkedMemberId);
        if (
          m &&
          (m.email.toLowerCase() === trimmedId || m.membershipCardId.toLowerCase() === trimmedId)
        ) {
          return true;
        }
      }
      return false;
    });

    if (matchedCred) {
      if (!matchedCred.isActive) {
        return {
          allowed: false,
          rule,
          reason:
            'Ce credential est actuellement suspendu par l’Administration ALGB. Déverrouillage impossible.',
        };
      }

      const matchedMember = matchedCred.linkedMemberId
        ? params.members.find((m) => m.id === matchedCred.linkedMemberId) || null
        : null;

      const matchesSecret =
        matchedCred.secretCode.trim() === trimmedCode ||
        (matchedCred.role === 'MEMBRE' &&
          matchedMember &&
          trimmedCode.toUpperCase() === matchedMember.membershipCardId.toUpperCase());

      if (!matchesSecret) {
        return {
          allowed: false,
          rule,
          reason: 'Credential invalide pour cet identifiant. Vérifiez le code créé en Administration.',
        };
      }

      if (matchedCred.role !== params.role) {
        return {
          allowed: false,
          rule,
          reason: `Ce credential appartient au profil « ${PROFILE_ACCESS_MATRIX[matchedCred.role].label} » et non à « ${rule.label} ». Sélectionnez le profil correspondant.`,
        };
      }

      if (params.targetMember) {
        if (rule.scopeType === 'SELF_ONLY') {
          if (!matchedMember || matchedMember.id !== params.targetMember.id) {
            return {
              allowed: false,
              rule,
              reason: `Accès refusé par la matrice des profils : le profil « ${rule.label} » ne peut accéder qu’à son propre lien QR et son propre espace de paiement (ici la carte appartient à ${params.targetMember.firstName} ${params.targetMember.lastName}).`,
            };
          }
        }

        if (rule.scopeType === 'PROMO_ONLY') {
          if (!matchedMember || matchedMember.promotionYear !== params.targetMember.promotionYear) {
            return {
              allowed: false,
              rule,
              reason: `Accès refusé par la matrice des profils : un Délégué de Promotion ne peut accéder qu’aux cartes de sa propre promotion (${matchedMember ? `Promo ${matchedMember.promotionYear}` : 'non identifiée'} ≠ Promo ${params.targetMember.promotionYear}).`,
            };
          }
        }
      }

      return {
        allowed: true,
        rule,
        authenticatedMember: matchedMember || params.targetMember || params.members[0] || null,
      };
    }
  }

  // 2. Legacy matrix fallback for direct member matricules without explicit custom credential
  const expectedRoleCode = rule.accessCode;
  const matchedMember = params.members.find(
    (m) =>
      m.email.toLowerCase() === trimmedId ||
      m.membershipCardId.toLowerCase() === trimmedId ||
      m.id.toLowerCase() === trimmedId
  );

  const roleAliasMatch =
    (params.role === 'RESPONSABLE_FINANCE' &&
      (trimmedId === 'tresorier@algb.ci' ||
        trimmedId === 'finance@algb.ci' ||
        trimmedId === 'tresorier')) ||
    (params.role === 'ADMIN' && (trimmedId === 'admin@algb.ci' || trimmedId === 'admin')) ||
    (params.role === 'SUPER_ADMIN' &&
      (trimmedId === 'superadmin@algb.ci' || trimmedId === 'superadmin')) ||
    (params.role === 'RESPONSABLE_COMM' &&
      (trimmedId === 'comm@algb.ci' || trimmedId === 'communication'));

  if (!matchedMember && !roleAliasMatch) {
    return {
      allowed: false,
      rule,
      reason:
        'Identifiant introuvable dans le registre des credentials ALGB. Utilisez votre identifiant créé depuis l’Administration.',
    };
  }

  const isPersonalCardCodeValid =
    params.role === 'MEMBRE' &&
    matchedMember &&
    trimmedCode.toUpperCase() === matchedMember.membershipCardId.toUpperCase();

  if (trimmedCode.toUpperCase() !== expectedRoleCode.toUpperCase() && !isPersonalCardCodeValid) {
    return {
      allowed: false,
      rule,
      reason: `Code d’accès invalide pour le profil « ${rule.label} ». Vérifiez vos credentials.`,
    };
  }

  if (params.targetMember) {
    if (rule.scopeType === 'SELF_ONLY') {
      if (!matchedMember || matchedMember.id !== params.targetMember.id) {
        return {
          allowed: false,
          rule,
          reason: `Accès refusé par la matrice des profils : le profil « ${rule.label} » ne peut accéder qu’à son propre lien QR et son propre espace de paiement (ici la carte appartient à ${params.targetMember.firstName} ${params.targetMember.lastName}).`,
        };
      }
    }

    if (rule.scopeType === 'PROMO_ONLY') {
      if (!matchedMember || matchedMember.promotionYear !== params.targetMember.promotionYear) {
        return {
          allowed: false,
          rule,
          reason: `Accès refusé par la matrice des profils : un Délégué de Promotion ne peut accéder qu’aux cartes de sa propre promotion (${matchedMember ? `Promo ${matchedMember.promotionYear}` : 'non identifiée'} ≠ Promo ${params.targetMember.promotionYear}).`,
        };
      }
    }
  }

  const sessionMember = matchedMember || params.targetMember || params.members[0] || null;

  return {
    allowed: true,
    rule,
    authenticatedMember: sessionMember,
  };
};

export const canActiveSessionAccessMemberQr = (
  role: UserRole,
  currentUser: AlumniMember | null,
  targetMember: AlumniMember | null
): boolean => {
  const rule = PROFILE_ACCESS_MATRIX[role];
  if (!rule || rule.scopeType === 'NONE') return false;
  if (rule.scopeType === 'ALL_MEMBERS') return true;
  if (!targetMember) return true;
  if (!currentUser) return false;
  if (rule.scopeType === 'SELF_ONLY') return currentUser.id === targetMember.id;
  if (rule.scopeType === 'PROMO_ONLY') return currentUser.promotionYear === targetMember.promotionYear;
  return false;
};
