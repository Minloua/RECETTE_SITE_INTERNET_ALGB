import { AlumniMember } from '../data/mockData';
import type { UserRole } from '../context/AppContext';

export interface ProfileAccessRule {
  role: UserRole;
  label: string;
  accessCode: string;
  scopeLabel: string;
  scopeType: 'NONE' | 'SELF_ONLY' | 'PROMO_ONLY' | 'ALL_MEMBERS';
  canUpdateAllPaymentTables: boolean;
  description: string;
}

export const PROFILE_ACCESS_MATRIX: Record<UserRole, ProfileAccessRule> = {
  VISITEUR: {
    role: 'VISITEUR',
    label: 'Visiteur public',
    accessCode: '',
    scopeLabel: 'Aucun accès paiement',
    scopeType: 'NONE',
    canUpdateAllPaymentTables: false,
    description: 'Consultation publique uniquement. Authentification requise pour accéder aux liens QR de paiement.',
  },
  MEMBRE: {
    role: 'MEMBRE',
    label: 'Membre Adhérent',
    accessCode: 'ALGB-MEM-2026',
    scopeLabel: 'Espace personnel uniquement',
    scopeType: 'SELF_ONLY',
    canUpdateAllPaymentTables: false,
    description: 'Peut accéder à sa propre carte, régler ses cotisations et mettre à jour son espace de paiement personnel.',
  },
  DELEGUE: {
    role: 'DELEGUE',
    label: 'Délégué de Promotion',
    accessCode: 'ALGB-DEL-2026',
    scopeLabel: 'Sa promotion & espace personnel',
    scopeType: 'PROMO_ONLY',
    canUpdateAllPaymentTables: false,
    description: 'Peut accéder et régulariser les paiements pour les membres de sa propre promotion.',
  },
  RESPONSABLE_COMM: {
    role: 'RESPONSABLE_COMM',
    label: 'Resp. Communication',
    accessCode: 'ALGB-COM-2026',
    scopeLabel: 'Espace personnel uniquement',
    scopeType: 'SELF_ONLY',
    canUpdateAllPaymentTables: false,
    description: 'Accès limité à son propre espace de paiement personnel (aucun accès aux fiches financières d’autres membres).',
  },
  RESPONSABLE_FINANCE: {
    role: 'RESPONSABLE_FINANCE',
    label: 'Responsable Finance / Trésorier',
    accessCode: 'ALGB-FIN-2026',
    scopeLabel: 'Tous les membres & Trésorerie',
    scopeType: 'ALL_MEMBERS',
    canUpdateAllPaymentTables: true,
    description: 'Accès complet à tous les liens QR adhérents, encaissements, pointage et tables comptables.',
  },
  ADMIN: {
    role: 'ADMIN',
    label: 'Administrateur ALGB',
    accessCode: 'ALGB-ADM-2026',
    scopeLabel: 'Tous les membres & Gouvernance',
    scopeType: 'ALL_MEMBERS',
    canUpdateAllPaymentTables: true,
    description: 'Plein exercice sur les paiements, validations d’adhésion et tables de trésorerie.',
  },
  SUPER_ADMIN: {
    role: 'SUPER_ADMIN',
    label: 'Super Administrateur',
    accessCode: 'ALGB-SUP-2026',
    scopeLabel: 'Autorité totale (Toutes tables)',
    scopeType: 'ALL_MEMBERS',
    canUpdateAllPaymentTables: true,
    description: 'Contrôle complet sur l’ensemble des espaces de paiement, tables financières et exports.',
  },
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
}): QrAccessAuthResult => {
  const rule = PROFILE_ACCESS_MATRIX[params.role];

  if (!rule || rule.scopeType === 'NONE') {
    return {
      allowed: false,
      rule,
      reason: 'Le profil Visiteur public n’est pas autorisé à accéder aux espaces de paiement. Sélectionnez un profil habilité.',
    };
  }

  const trimmedId = params.identifier.trim().toLowerCase();
  const trimmedCode = params.accessCode.trim();

  if (!trimmedId) {
    return {
      allowed: false,
      rule,
      reason: 'Veuillez saisir votre identifiant dédié (e-mail, matricule ALGB-... ou identifiant fonction).',
    };
  }

  if (!trimmedCode) {
    return {
      allowed: false,
      rule,
      reason: 'Veuillez saisir le code d’accès dédié correspondant à votre profil.',
    };
  }

  // Validate dedicated profile access code (or member matricule-based personal PIN for MEMBRE)
  const expectedRoleCode = rule.accessCode;
  const matchedMember = params.members.find(
    (m) =>
      m.email.toLowerCase() === trimmedId ||
      m.membershipCardId.toLowerCase() === trimmedId ||
      m.id.toLowerCase() === trimmedId
  );

  // Special functional identifiers allowed for Finance/Admin/SuperAdmin/Comm
  const roleAliasMatch =
    (params.role === 'RESPONSABLE_FINANCE' &&
      (trimmedId === 'tresorier@algb.ci' || trimmedId === 'finance@algb.ci' || trimmedId === 'tresorier')) ||
    (params.role === 'ADMIN' && (trimmedId === 'admin@algb.ci' || trimmedId === 'admin')) ||
    (params.role === 'SUPER_ADMIN' && (trimmedId === 'superadmin@algb.ci' || trimmedId === 'superadmin')) ||
    (params.role === 'RESPONSABLE_COMM' && (trimmedId === 'comm@algb.ci' || trimmedId === 'communication'));

  if (!matchedMember && !roleAliasMatch) {
    return {
      allowed: false,
      rule,
      reason: 'Identifiant introuvable dans le registre ALGB. Utilisez votre e-mail ou votre matricule (ex: ALGB-2002-0001).',
    };
  }

  // Verify access code
  const isPersonalCardCodeValid =
    params.role === 'MEMBRE' &&
    matchedMember &&
    trimmedCode.toUpperCase() === matchedMember.membershipCardId.toUpperCase();

  if (trimmedCode.toUpperCase() !== expectedRoleCode.toUpperCase() && !isPersonalCardCodeValid) {
    return {
      allowed: false,
      rule,
      reason: `Code d’accès invalide pour le profil « ${rule.label} ». Vérifiez la matrice des accès dédiés.`,
    };
  }

  // Enforce matrix scope against targetMember if a specific card link was flashed
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

  // Fallback member session for role aliases (Treasurer/Admin)
  const sessionMember =
    matchedMember ||
    params.targetMember ||
    params.members[0] ||
    null;

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
  if (!targetMember) return true; // Scanner mode allowed after auth
  if (!currentUser) return false;
  if (rule.scopeType === 'SELF_ONLY') return currentUser.id === targetMember.id;
  if (rule.scopeType === 'PROMO_ONLY') return currentUser.promotionYear === targetMember.promotionYear;
  return false;
};
