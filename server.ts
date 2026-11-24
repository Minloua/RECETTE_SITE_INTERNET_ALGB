import 'dotenv/config';
import express from 'express';
import type { Request, Response } from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { handleAssistantChat, type AssistantRequestBody } from './server/assistantService.ts';
import {
  handleSendCredentialEmail,
  type CredentialEmailRequestBody,
} from './server/credentialEmailService.ts';
import {
  appendAuditLog,
  getDb,
  persistDb,
  resetDbToInitial,
  sanitizeCredential,
  sanitizeMemberForViewer,
} from './server/database.ts';
import {
  attachSession,
  clearSessionCookie,
  createRateLimiter,
  createSessionToken,
  hashSecret,
  requireAuth,
  requireRole,
  securityHeaders,
  setSessionCookie,
  signQrPayload,
  verifyPaymentSignature,
  verifyQrPayloadSignature,
  verifySecret,
} from './server/security.ts';
import type { RequestWithSession, ServerUserRole } from './server/security.ts';
import { createPaymentIntent, settlePaymentIntent } from './server/paymentGateway.ts';
import type {
  AlumniMember,
  AssociationSettings,
  EventItem,
  GalleryPhoto,
  JobApplicationRecord,
  JobOffer,
  MemberTransaction,
  MentorshipRequestRecord,
  NewsItem,
  PaymentMethod,
  PaymentType,
  Project,
  Promotion,
  YouTubeVideo,
} from './src/data/mockData.ts';
import type { ServerAiKnowledgeEntry } from './server/database.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function computeMemberUpToDate(memberId: string, db: ReturnType<typeof getDb>): boolean {
  const memberTxs = db.transactions.filter((t) => t.memberId === memberId && t.status === 'PAYE');
  const paidMonths = new Set<string>();
  memberTxs.forEach((t) => {
    if (t.type === 'COTISATION_MENSUELLE' && Array.isArray(t.monthYears)) {
      t.monthYears.forEach((m) => paidMonths.add(m));
    }
  });
  return paidMonths.size >= 11;
}

async function startServer() {
  const app = express();
  app.set('trust proxy', 1);
  const port = Number(process.env.PORT) || 3000;

  // Ensure persistent DB is initialized at boot
  getDb();

  app.use(securityHeaders);
  app.use(express.json({ limit: '1mb' }));
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({ ok: true, status: 'ready', ts: Date.now() });
  });
  app.use(attachSession);

  // Rate limiters
  const authLimiter = createRateLimiter({
    windowMs: 5 * 60 * 1000,
    max: 25,
    keyPrefix: 'auth',
    message: 'Trop de tentatives de connexion. Réessayez dans quelques minutes.',
  });
  const aiLimiter = createRateLimiter({
    windowMs: 5 * 60 * 1000,
    max: 40,
    keyPrefix: 'assistant',
    message: 'Limite de requêtes de l’assistant atteinte. Patientez quelques instants.',
  });
  const emailLimiter = createRateLimiter({
    windowMs: 10 * 60 * 1000,
    max: 25,
    keyPrefix: 'email',
  });
  const paymentLimiter = createRateLimiter({
    windowMs: 5 * 60 * 1000,
    max: 35,
    keyPrefix: 'payment',
  });

  // ===================================================================
  // 1. BOOTSTRAP & SESSION AUTHENTICATION (HttpOnly Signed Cookie)
  // ===================================================================
  app.get('/api/bootstrap', (req: Request, res: Response) => {
    const db = getDb();
    const session = (req as RequestWithSession).algbSession || null;
    const role: ServerUserRole = session ? session.role : 'VISITEUR';
    const linkedMemberId = session?.linkedMemberId;
    const isAdminOrFinance =
      role === 'ADMIN' || role === 'SUPER_ADMIN' || role === 'RESPONSABLE_FINANCE';
    const isAdmin = role === 'ADMIN' || role === 'SUPER_ADMIN';

    const matchedCred = session
      ? db.credentials.find((c) => c.id === session.credentialId && c.isActive) || null
      : null;

    const effectiveRole: ServerUserRole = matchedCred ? matchedCred.role : 'VISITEUR';
    const currentUser =
      matchedCred && matchedCred.linkedMemberId
        ? db.members.find((m) => m.id === matchedCred.linkedMemberId) || null
        : null;

    const isUpToDate = currentUser ? computeMemberUpToDate(currentUser.id, db) : false;
    const canSeeCareers = isAdminOrFinance || (effectiveRole !== 'VISITEUR' && isUpToDate);

    const sanitizedMembers = db.members.map((m) =>
      sanitizeMemberForViewer(m, effectiveRole, currentUser?.id)
    );

    const scopedTransactions = isAdminOrFinance
      ? db.transactions
      : currentUser
      ? db.transactions.filter((t) => t.memberId === currentUser.id)
      : [];

    const scopedCredentials = isAdmin
      ? db.credentials.map(sanitizeCredential)
      : matchedCred
      ? [sanitizeCredential(matchedCred)]
      : [];

    res.json({
      ok: true,
      session: matchedCred
        ? {
            credential: sanitizeCredential(matchedCred),
            role: matchedCred.role,
            currentUser,
          }
        : null,
      settings: db.settings,
      visitorAllowedMenus: db.visitorAllowedMenus,
      roleMenuPermissions: db.roleMenuPermissions,
      members: sanitizedMembers,
      promotions: db.promotions,
      projects: db.projects,
      jobOffers: canSeeCareers ? db.jobOffers : db.jobOffers.map((j) => ({ ...j, contactEmail: '' })),
      news: db.news,
      events: db.events,
      transactions: scopedTransactions,
      mentorshipRequests: isAdmin
        ? db.mentorshipRequests
        : currentUser
        ? db.mentorshipRequests.filter(
            (r) => r.menteeId === currentUser.id || r.mentorId === currentUser.id
          )
        : [],
      jobApplications: isAdmin
        ? db.jobApplications
        : currentUser
        ? db.jobApplications.filter((a) => a.applicantId === currentUser.id)
        : [],
      newsletterCount: db.newsletterSubscribers.length,
      photos: db.photos,
      videos: db.videos,
      aiKnowledgeEntries: db.aiKnowledgeEntries,
      credentials: scopedCredentials,
    });
  });

  app.get('/api/auth/me', (req: Request, res: Response) => {
    const db = getDb();
    const session = (req as RequestWithSession).algbSession;
    if (!session) {
      res.json({ ok: true, authenticated: false, session: null });
      return;
    }
    const cred = db.credentials.find((c) => c.id === session.credentialId && c.isActive);
    if (!cred) {
      clearSessionCookie(res, req);
      res.json({ ok: true, authenticated: false, session: null });
      return;
    }
    const currentUser = cred.linkedMemberId
      ? db.members.find((m) => m.id === cred.linkedMemberId) || null
      : null;

    res.json({
      ok: true,
      authenticated: true,
      credential: sanitizeCredential(cred),
      currentUser,
    });
  });

  app.post('/api/auth/login', authLimiter, (req: Request, res: Response) => {
    const db = getDb();
    const { identifier, secretCode } = (req.body || {}) as {
      identifier?: string;
      secretCode?: string;
    };

    const cleanId = (identifier || '').trim().toLowerCase();
    const cleanSecret = (secretCode || '').trim();

    if (!cleanId || !cleanSecret || cleanId.length > 160 || cleanSecret.length > 160) {
      res.status(400).json({
        ok: false,
        error: 'Identifiant et code d’accès requis.',
      });
      return;
    }

    const matched = db.credentials.find(
      (c) => c.identifier.trim().toLowerCase() === cleanId
    );

    if (!matched || !verifySecret(cleanSecret, matched.secretHash)) {
      res.status(401).json({
        ok: false,
        error: 'Identifiant ou code d’accès incorrect. Vérifiez vos accès ALGB.',
      });
      return;
    }

    if (!matched.isActive) {
      res.status(403).json({
        ok: false,
        error: 'Ce credential est temporairement suspendu par l’Administration.',
      });
      return;
    }

    const nowStamp = new Date().toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
    matched.firstLoginAt = matched.firstLoginAt || nowStamp;
    matched.lastLoginAt = nowStamp;

    appendAuditLog(db, {
      actor: matched.displayName,
      role: matched.role,
      action: 'AUTH_LOGIN',
      target: matched.identifier,
    });
    persistDb(db);

    const token = createSessionToken({
      credentialId: matched.id,
      identifier: matched.identifier,
      displayName: matched.displayName,
      role: matched.role,
      linkedMemberId: matched.linkedMemberId,
    });
    setSessionCookie(res, token, req);

    const currentUser = matched.linkedMemberId
      ? db.members.find((m) => m.id === matched.linkedMemberId) || null
      : null;

    res.json({
      ok: true,
      sessionToken: token,
      credential: sanitizeCredential(matched),
      currentUser,
    });
  });

  app.post('/api/auth/logout', (req: Request, res: Response) => {
    const session = (req as RequestWithSession).algbSession;
    if (session) {
      const db = getDb();
      appendAuditLog(db, {
        actor: session.displayName,
        role: session.role,
        action: 'AUTH_LOGOUT',
      });
      persistDb(db);
    }
    clearSessionCookie(res, req);
    res.json({ ok: true });
  });

  app.post('/api/auth/change-password', requireAuth, (req: Request, res: Response) => {
    const db = getDb();
    const session = (req as RequestWithSession).algbSession!;
    const { currentSecret, newSecret } = (req.body || {}) as {
      currentSecret?: string;
      newSecret?: string;
    };

    if (!currentSecret || !newSecret || newSecret.trim().length < 6) {
      res.status(400).json({
        ok: false,
        error: 'Le nouveau code d’accès doit contenir au moins 6 caractères.',
      });
      return;
    }

    const cred = db.credentials.find((c) => c.id === session.credentialId);
    if (!cred || !verifySecret(currentSecret, cred.secretHash)) {
      res.status(401).json({
        ok: false,
        error: 'Code d’accès actuel incorrect.',
      });
      return;
    }

    cred.secretHash = hashSecret(newSecret);
    cred.isSeededDefault = false;
    appendAuditLog(db, {
      actor: session.displayName,
      role: session.role,
      action: 'PASSWORD_CHANGED',
    });
    persistDb(db);

    res.json({ ok: true });
  });

  // Verification for QR Scanner operator (server-side, never exposes secret hashes)
  app.post('/api/auth/verify-qr-operator', authLimiter, (req: Request, res: Response) => {
    const db = getDb();
    const { identifier, accessCode, targetMemberId } = (req.body || {}) as {
      identifier?: string;
      accessCode?: string;
      targetMemberId?: string;
    };

    const cleanId = (identifier || '').trim().toLowerCase();
    const cleanCode = (accessCode || '').trim();
    if (!cleanId || !cleanCode) {
      res.status(400).json({ ok: false, error: 'Identifiant et code requis.' });
      return;
    }

    const cred = db.credentials.find((c) => c.identifier.toLowerCase() === cleanId && c.isActive);
    if (!cred || !verifySecret(cleanCode, cred.secretHash)) {
      res.status(401).json({ ok: false, error: 'Credential ou code d’autorisation QR invalide.' });
      return;
    }

    const actorMember = cred.linkedMemberId
      ? db.members.find((m) => m.id === cred.linkedMemberId) || null
      : null;
    const targetMember = targetMemberId
      ? db.members.find((m) => m.id === targetMemberId) || null
      : null;

    if (
      cred.role === 'MEMBRE' &&
      targetMember &&
      actorMember &&
      actorMember.id !== targetMember.id
    ) {
      res.status(403).json({
        ok: false,
        error: 'Un Membre Adhérent ne peut flasher que sa propre carte officielle.',
      });
      return;
    }

    if (
      cred.role === 'DELEGUE' &&
      targetMember &&
      actorMember &&
      actorMember.promotionYear !== targetMember.promotionYear
    ) {
      res.status(403).json({
        ok: false,
        error: `Ce Délégué est habilité uniquement pour la Promotion ${actorMember.promotionYear}.`,
      });
      return;
    }

    res.json({
      ok: true,
      credential: sanitizeCredential(cred),
      authenticatedName: actorMember
        ? `${actorMember.firstName} ${actorMember.lastName}`
        : cred.displayName,
    });
  });

  // ===================================================================
  // 2. CREDENTIALS MANAGEMENT & PROTECTED EMAIL DISPATCH (Admin only)
  // ===================================================================
  app.get(
    '/api/credentials',
    requireRole('ADMIN', 'SUPER_ADMIN'),
    (_req: Request, res: Response) => {
      const db = getDb();
      res.json({
        ok: true,
        credentials: db.credentials.map(sanitizeCredential),
      });
    }
  );

  app.post(
    '/api/credentials',
    requireRole('ADMIN', 'SUPER_ADMIN'),
    (req: Request, res: Response) => {
      const db = getDb();
      const session = (req as RequestWithSession).algbSession!;
      const body = (req.body || {}) as {
        identifier?: string;
        secretCode?: string;
        displayName?: string;
        role?: Exclude<ServerUserRole, 'VISITEUR'>;
        linkedMemberId?: string;
        recipientEmail?: string;
        allowedTabs?: string[];
        notes?: string;
      };

      const cleanId = (body.identifier || '').trim().toLowerCase();
      const cleanSecret = (body.secretCode || '').trim();
      if (!cleanId || !cleanSecret || !body.displayName || !body.role) {
        res.status(400).json({ ok: false, error: 'Champs obligatoires manquants.' });
        return;
      }
      if (body.role === 'SUPER_ADMIN' && session.role !== 'SUPER_ADMIN') {
        res.status(403).json({
          ok: false,
          error: 'Seul le Super Administrateur peut créer un compte Super Admin.',
        });
        return;
      }
      if (db.credentials.some((c) => c.identifier.toLowerCase() === cleanId)) {
        res.status(409).json({
          ok: false,
          error: `Un credential existe déjà pour « ${cleanId} ».`,
        });
        return;
      }

      const newCred = {
        id: `cred-${Date.now().toString().slice(-6)}`,
        identifier: cleanId,
        secretHash: hashSecret(cleanSecret),
        displayName: body.displayName.trim(),
        role: body.role,
        linkedMemberId: body.linkedMemberId || undefined,
        recipientEmail: body.recipientEmail?.trim() || undefined,
        allowedTabs:
          body.allowedTabs && body.allowedTabs.length > 0
            ? body.allowedTabs
            : db.roleMenuPermissions[body.role] || [],
        isActive: true,
        createdAt: new Date().toISOString().split('T')[0],
        createdBy: session.displayName,
        emailStatus: 'NON_ENVOYE' as const,
        notes: body.notes?.trim() || undefined,
        isSeededDefault: false,
      };

      db.credentials = [newCred, ...db.credentials];
      appendAuditLog(db, {
        actor: session.displayName,
        role: session.role,
        action: 'CREDENTIAL_CREATED',
        target: newCred.identifier,
      });
      persistDb(db);

      res.status(201).json({
        ok: true,
        credential: sanitizeCredential(newCred),
      });
    }
  );

  app.patch(
    '/api/credentials/:id',
    requireRole('ADMIN', 'SUPER_ADMIN'),
    (req: Request, res: Response) => {
      const db = getDb();
      const session = (req as RequestWithSession).algbSession!;
      const target = db.credentials.find((c) => c.id === req.params.id);
      if (!target) {
        res.status(404).json({ ok: false, error: 'Credential introuvable.' });
        return;
      }
      if (target.role === 'SUPER_ADMIN' && session.role !== 'SUPER_ADMIN') {
        res.status(403).json({
          ok: false,
          error: 'Seul le Super Administrateur peut modifier un compte Super Admin.',
        });
        return;
      }

      const updates = (req.body || {}) as Record<string, unknown>;
      if (typeof updates.identifier === 'string' && updates.identifier.trim()) {
        target.identifier = updates.identifier.trim().toLowerCase();
        target.isSeededDefault = false;
      }
      if (typeof updates.secretCode === 'string' && updates.secretCode.trim()) {
        target.secretHash = hashSecret(updates.secretCode);
        target.isSeededDefault = false;
      }
      if (typeof updates.displayName === 'string' && updates.displayName.trim()) {
        target.displayName = updates.displayName.trim();
      }
      if (typeof updates.role === 'string' && updates.role !== 'VISITEUR') {
        target.role = updates.role as Exclude<ServerUserRole, 'VISITEUR'>;
      }
      if (typeof updates.isActive === 'boolean') {
        target.isActive = updates.isActive;
      }
      if (Array.isArray(updates.allowedTabs)) {
        target.allowedTabs = updates.allowedTabs.filter((t): t is string => typeof t === 'string');
      }
      if (typeof updates.recipientEmail === 'string') {
        target.recipientEmail = updates.recipientEmail.trim() || undefined;
      }
      if (typeof updates.notes === 'string') {
        target.notes = updates.notes.trim() || undefined;
      }

      appendAuditLog(db, {
        actor: session.displayName,
        role: session.role,
        action: 'CREDENTIAL_UPDATED',
        target: target.identifier,
      });
      persistDb(db);

      res.json({ ok: true, credential: sanitizeCredential(target) });
    }
  );

  app.delete(
    '/api/credentials/:id',
    requireRole('ADMIN', 'SUPER_ADMIN'),
    (req: Request, res: Response) => {
      const db = getDb();
      const session = (req as RequestWithSession).algbSession!;
      const target = db.credentials.find((c) => c.id === req.params.id);
      if (!target) {
        res.status(404).json({ ok: false, error: 'Credential introuvable.' });
        return;
      }
      if (target.id === 'cred-superadmin' || target.id === session.credentialId) {
        res.status(400).json({
          ok: false,
          error: 'Impossible de supprimer le compte Super Admin ou votre session active.',
        });
        return;
      }

      db.credentials = db.credentials.filter((c) => c.id !== target.id);
      appendAuditLog(db, {
        actor: session.displayName,
        role: session.role,
        action: 'CREDENTIAL_DELETED',
        target: target.identifier,
      });
      persistDb(db);

      res.json({ ok: true });
    }
  );

  // Public online enrollment (registers member, creates hashed credential, opens HttpOnly session)
  app.post('/api/enrollments', authLimiter, (req: Request, res: Response) => {
    const db = getDb();
    const body = (req.body || {}) as { member?: AlumniMember };
    const newMember = body.member;
    if (!newMember || !newMember.id || !newMember.membershipCardId || !newMember.email) {
      res.status(400).json({ ok: false, error: 'Données d’enrôlement incomplètes.' });
      return;
    }

    const exists = db.members.some(
      (m) =>
        m.id === newMember.id ||
        m.membershipCardId.toLowerCase() === newMember.membershipCardId.toLowerCase()
    );
    if (!exists) {
      db.members = [newMember, ...db.members];
      db.promotions = db.promotions.map((p) =>
        p.year === newMember.promotionYear
          ? { ...p, registeredMembers: p.registeredMembers + 1 }
          : p
      );
    }

    const identifier = (newMember.email || newMember.membershipCardId).trim().toLowerCase();
    const initialSecret = newMember.membershipCardId;
    let cred = db.credentials.find(
      (c) => c.identifier.toLowerCase() === identifier || c.linkedMemberId === newMember.id
    );
    if (!cred) {
      cred = {
        id: `cred-${Date.now().toString().slice(-6)}`,
        identifier,
        secretHash: hashSecret(initialSecret),
        displayName: `${newMember.firstName} ${newMember.lastName}`,
        role: 'MEMBRE',
        linkedMemberId: newMember.id,
        recipientEmail: newMember.email || undefined,
        allowedTabs: db.roleMenuPermissions.MEMBRE || [],
        isActive: true,
        createdAt: new Date().toISOString().split('T')[0],
        createdBy: 'Enrôlement en ligne ALGB',
        ackToken: Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2),
        emailStatus: 'NON_ENVOYE',
        notes: `Enrôlement en ligne (${newMember.membershipCardId})`,
        isSeededDefault: false,
      };
      db.credentials = [cred, ...db.credentials];
    }

    appendAuditLog(db, {
      actor: `${newMember.firstName} ${newMember.lastName}`,
      role: 'MEMBRE',
      action: 'ONLINE_ENROLLMENT',
      target: newMember.membershipCardId,
    });
    persistDb(db);

    const token = createSessionToken({
      credentialId: cred.id,
      identifier: cred.identifier,
      displayName: cred.displayName,
      role: cred.role,
      linkedMemberId: cred.linkedMemberId,
    });
    setSessionCookie(res, token);

    res.status(201).json({
      ok: true,
      member: newMember,
      credential: sanitizeCredential(cred),
      initialSecret,
    });
  });

  // Acknowledge credential reception from confirmation link
  app.post('/api/auth/ack-credential', (req: Request, res: Response) => {
    const db = getDb();
    const { credentialId, token } = (req.body || {}) as { credentialId?: string; token?: string };
    const cred = db.credentials.find((c) => c.id === credentialId);
    if (!cred || (cred.ackToken && token && cred.ackToken !== token)) {
      res.status(404).json({ ok: false, error: 'Lien de confirmation expiré ou invalide.' });
      return;
    }
    const nowStamp = new Date().toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
    cred.acknowledgedAt = cred.acknowledgedAt || nowStamp;
    persistDb(db);
    res.json({ ok: true, displayName: cred.displayName, identifier: cred.identifier, acknowledgedAt: cred.acknowledgedAt });
  });

  // Protected credential email sending (Admin/Super Admin only + rate limited)
  app.post(
    '/api/credentials/send-email',
    emailLimiter,
    requireRole('ADMIN', 'SUPER_ADMIN'),
    async (req: Request, res: Response) => {
      const db = getDb();
      const body = { ...(req.body || {}) } as CredentialEmailRequestBody;
      const targetCred = body.credentialId
        ? db.credentials.find((c) => c.id === body.credentialId)
        : undefined;

      // Never recover plaintext hashes; on resend without secretCode, rotate to a fresh temporary code
      if (targetCred && (!body.secretCode || !body.secretCode.trim())) {
        const tempCode = `ALGB-${Math.floor(100000 + Math.random() * 899999)}`;
        targetCred.secretHash = hashSecret(tempCode);
        targetCred.isSeededDefault = false;
        body.secretCode = tempCode;
      }

      const result = await handleSendCredentialEmail(body);
      if (targetCred) {
        if (result.payload.ok) {
          targetCred.emailStatus = 'ENVOYE';
          targetCred.emailSentAt = result.payload.sentAt;
          targetCred.emailSenderUsed = result.payload.senderUsed;
          targetCred.emailProvider = result.payload.provider;
          targetCred.emailMessageId = result.payload.messageId;
          targetCred.emailError = undefined;
        } else {
          targetCred.emailStatus = 'ECHEC';
          targetCred.emailError = result.payload.error;
        }
        persistDb(db);
      }

      res.status(result.status).json(result.payload);
    }
  );

  // ===================================================================
  // 3. AI ASSISTANT ROUTE (Rate-limited + Input-bounded)
  // ===================================================================
  app.post('/api/assistant/chat', aiLimiter, async (req: Request, res: Response) => {
    const body = (req.body || {}) as AssistantRequestBody;
    if (!body.message || typeof body.message !== 'string' || body.message.trim().length > 2000) {
      res.status(400).json({
        ok: false,
        error: 'Message invalide ou trop long (2 000 caractères max).',
      });
      return;
    }
    const result = await handleAssistantChat(body);
    res.status(result.status).json(result.payload);
  });

  // ===================================================================
  // 4. CRYPTOGRAPHIC QR SIGNING & EVENT SCANNER VERIFICATION
  // ===================================================================
  app.post('/api/qr/sign', (req: Request, res: Response) => {
    const db = getDb();
    const { memberId, cardId } = (req.body || {}) as { memberId?: string; cardId?: string };
    const member = db.members.find(
      (m) =>
        (memberId && m.id === memberId) ||
        (cardId && m.membershipCardId.toLowerCase() === cardId.toLowerCase())
    );
    if (!member) {
      res.status(404).json({ ok: false, error: 'Membre introuvable.' });
      return;
    }
    const { ts, sig } = signQrPayload(member.id, member.membershipCardId);
    res.json({
      ok: true,
      memberId: member.id,
      cardId: member.membershipCardId,
      ts,
      sig,
    });
  });

  app.post('/api/qr/verify', (req: Request, res: Response) => {
    const db = getDb();
    const { memberId, cardId, ts, sig } = (req.body || {}) as {
      memberId?: string;
      cardId?: string;
      ts?: number;
      sig?: string;
    };

    const member = db.members.find(
      (m) =>
        (memberId && m.id.toLowerCase() === memberId.toLowerCase()) ||
        (cardId && m.membershipCardId.toLowerCase() === cardId.toLowerCase())
    );

    if (!member) {
      res.status(404).json({
        ok: false,
        authentic: false,
        error: 'Aucune carte membre ALGB ne correspond à ce QR Code.',
      });
      return;
    }

    const isCryptographicallyValid =
      typeof ts === 'number' &&
      typeof sig === 'string' &&
      verifyQrPayloadSignature(member.id, member.membershipCardId, ts, sig);

    const upToDate = computeMemberUpToDate(member.id, db);

    res.json({
      ok: true,
      authentic: isCryptographicallyValid,
      legacyUnsigned: !sig,
      member: {
        id: member.id,
        fullName: `${member.firstName} ${member.lastName}`,
        promotionYear: member.promotionYear,
        membershipCardId: member.membershipCardId,
        membershipStatus: member.membershipStatus,
        isUpToDate: upToDate,
        city: member.city,
        country: member.country,
      },
    });
  });

  // ===================================================================
  // 5. UEMOA PAYMENT GATEWAY (FCFA) & SIGNED WEBHOOK
  // ===================================================================
  app.post('/api/payments/initiate', paymentLimiter, (req: Request, res: Response) => {
    const db = getDb();
    const session = (req as RequestWithSession).algbSession;
    const body = (req.body || {}) as {
      type?: PaymentType;
      amountFcfa?: number;
      method?: PaymentMethod;
      title?: string;
      description?: string;
      memberId?: string;
      memberName?: string;
      projectId?: string;
      monthYears?: string[];
      phoneNumber?: string;
      isAnonymous?: boolean;
      frequency?: 'PONCTUEL' | 'MENSUEL';
    };

    if (!body.amountFcfa || typeof body.amountFcfa !== 'number' || body.amountFcfa < 500) {
      res.status(400).json({
        ok: false,
        error: 'Le montant minimal de règlement est de 500 FCFA.',
      });
      return;
    }

    const intent = createPaymentIntent(db, {
      type: body.type || 'COTISATION_MENSUELLE',
      amountFcfa: body.amountFcfa,
      method: body.method || 'ORANGE_MONEY',
      title: body.title || 'Règlement ALGB (FCFA)',
      description: body.description,
      memberId: body.memberId || session?.linkedMemberId,
      memberName: body.memberName || session?.displayName,
      projectId: body.projectId,
      monthYears: body.monthYears,
      phoneNumber: body.phoneNumber,
      isAnonymous: body.isAnonymous,
      frequency: body.frequency,
    });
    persistDb(db);

    res.status(201).json({ ok: true, intent });
  });

  app.post('/api/payments/webhook', paymentLimiter, (req: Request, res: Response) => {
    const db = getDb();
    const { intentId, signature, event } = (req.body || {}) as {
      intentId?: string;
      signature?: string;
      event?: 'PAYMENT_SUCCEEDED' | 'PAYMENT_FAILED';
    };

    const intent = db.paymentIntents.find((p) => p.id === intentId);
    if (!intent) {
      res.status(404).json({ ok: false, error: 'Intention de paiement introuvable.' });
      return;
    }

    const expectedPayload = `${intent.id}:${intent.reference}:${intent.amountFcfa}:FCFA`;
    if (!signature || !verifyPaymentSignature(expectedPayload, signature)) {
      res.status(403).json({
        ok: false,
        error: 'Signature HMAC du webhook de paiement invalide.',
      });
      return;
    }

    if (event === 'PAYMENT_FAILED') {
      intent.status = 'FAILED';
      persistDb(db);
      res.json({ ok: true, status: 'FAILED' });
      return;
    }

    const settled = settlePaymentIntent(db, intent);
    persistDb(db);

    res.json({
      ok: true,
      status: 'PAID',
      transaction: settled.transaction,
      contribution: settled.contribution,
    });
  });

  // ===================================================================
  // 6. ARTCI PRIVACY RIGHTS (Loi n° 2013-450 Côte d'Ivoire)
  // ===================================================================
  app.patch('/api/members/me/privacy', requireAuth, (req: Request, res: Response) => {
    const db = getDb();
    const session = (req as RequestWithSession).algbSession!;
    if (!session.linkedMemberId) {
      res.status(404).json({ ok: false, error: 'Aucune fiche membre liée à ce compte.' });
      return;
    }

    const member = db.members.find((m) => m.id === session.linkedMemberId);
    if (!member) {
      res.status(404).json({ ok: false, error: 'Fiche membre introuvable.' });
      return;
    }

    const updates = (req.body || {}) as {
      showEmail?: boolean;
      showPhone?: boolean;
      allowMentorshipRequests?: boolean;
      shareContactsConsent?: boolean;
      bdrRegistered?: boolean;
    };

    member.privacy = {
      showEmail: typeof updates.showEmail === 'boolean' ? updates.showEmail : member.privacy.showEmail,
      showPhone: typeof updates.showPhone === 'boolean' ? updates.showPhone : member.privacy.showPhone,
      allowMentorshipRequests:
        typeof updates.allowMentorshipRequests === 'boolean'
          ? updates.allowMentorshipRequests
          : member.privacy.allowMentorshipRequests,
    };
    if (typeof updates.shareContactsConsent === 'boolean') {
      member.shareContactsConsent = updates.shareContactsConsent;
    }
    if (typeof updates.bdrRegistered === 'boolean') {
      member.bdrRegistered = updates.bdrRegistered;
    }

    appendAuditLog(db, {
      actor: session.displayName,
      role: session.role,
      action: 'ARTCI_PRIVACY_UPDATED',
      target: member.id,
    });
    persistDb(db);

    res.json({ ok: true, member });
  });

  app.get('/api/members/me/export', requireAuth, (req: Request, res: Response) => {
    const db = getDb();
    const session = (req as RequestWithSession).algbSession!;
    const member = session.linkedMemberId
      ? db.members.find((m) => m.id === session.linkedMemberId) || null
      : null;

    const myTransactions = member
      ? db.transactions.filter((t) => t.memberId === member.id)
      : [];
    const myMentorships = member
      ? db.mentorshipRequests.filter((r) => r.menteeId === member.id || r.mentorId === member.id)
      : [];
    const myApplications = member
      ? db.jobApplications.filter((a) => a.applicantId === member.id)
      : [];

    appendAuditLog(db, {
      actor: session.displayName,
      role: session.role,
      action: 'ARTCI_DATA_EXPORT',
    });
    persistDb(db);

    res.json({
      ok: true,
      exportedAt: new Date().toISOString(),
      legalBasis: 'Loi n° 2013-450 relative à la protection des données à caractère personnel (ARTCI - Côte d’Ivoire)',
      account: {
        identifier: session.identifier,
        displayName: session.displayName,
        role: session.role,
      },
      memberProfile: member,
      transactions: myTransactions,
      mentorshipRequests: myMentorships,
      jobApplications: myApplications,
    });
  });

  app.post('/api/members/me/anonymize', requireAuth, (req: Request, res: Response) => {
    const db = getDb();
    const session = (req as RequestWithSession).algbSession!;
    if (!session.linkedMemberId) {
      res.status(400).json({ ok: false, error: 'Compte système non anonymisable.' });
      return;
    }

    const member = db.members.find((m) => m.id === session.linkedMemberId);
    if (member) {
      member.firstName = 'Membre';
      member.lastName = `Anonymisé (${member.promotionYear})`;
      member.nickname = undefined;
      member.email = `anonymise-${member.id}@algb.ci`;
      member.phone = undefined;
      member.whatsapp = undefined;
      member.linkedin = undefined;
      member.bio = 'Profil anonymisé à la demande du titulaire (Conformité ARTCI Loi n° 2013-450).';
      member.bdrRegistered = false;
      member.shareContactsConsent = false;
      member.privacy = {
        showEmail: false,
        showPhone: false,
        allowMentorshipRequests: false,
      };
    }

    const cred = db.credentials.find((c) => c.id === session.credentialId);
    if (cred) {
      cred.isActive = false;
    }

    appendAuditLog(db, {
      actor: session.displayName,
      role: session.role,
      action: 'ARTCI_ACCOUNT_ANONYMIZED',
      target: session.linkedMemberId,
    });
    persistDb(db);
    clearSessionCookie(res, req);

    res.json({ ok: true });
  });

  // ===================================================================
  // 7. STATE PERSISTENCE SYNC (Authenticated or public enrollment/newsletter)
  // ===================================================================
  app.post('/api/state/sync', (req: Request, res: Response) => {
    const db = getDb();
    const session = (req as RequestWithSession).algbSession;
    const { slice, data } = (req.body || {}) as { slice?: string; data?: unknown };

    if (!slice || data === undefined) {
      res.status(400).json({ ok: false, error: 'Paramètres de synchronisation invalides.' });
      return;
    }

    const isAdmin = session && (session.role === 'ADMIN' || session.role === 'SUPER_ADMIN');
    const isFinance = session && (isAdmin || session.role === 'RESPONSABLE_FINANCE');
    const isComm = session && (isAdmin || session.role === 'RESPONSABLE_COMM');

    switch (slice) {
      case 'newsletter':
        if (Array.isArray(data)) {
          db.newsletterSubscribers = data.filter((e): e is string => typeof e === 'string').slice(0, 5000);
        }
        break;
      case 'settings':
        if (!isAdmin && !isFinance) {
          res.status(403).json({ ok: false, error: 'Droits administrateur ou finance requis.' });
          return;
        }
        if (data && typeof data === 'object') {
          db.settings = {
            ...db.settings,
            ...(data as Partial<AssociationSettings>),
            currency: 'FCFA',
          };
        }
        break;
      case 'visitorAllowedMenus':
      case 'roleMenuPermissions':
        if (!isAdmin) {
          res.status(403).json({ ok: false, error: 'Droits administrateur requis.' });
          return;
        }
        if (slice === 'visitorAllowedMenus' && Array.isArray(data)) {
          db.visitorAllowedMenus = data.filter((item): item is string => typeof item === 'string');
        } else if (slice === 'roleMenuPermissions' && data && typeof data === 'object') {
          db.roleMenuPermissions = data as typeof db.roleMenuPermissions;
        }
        break;
      case 'news':
      case 'events':
      case 'photos':
      case 'videos':
      case 'aiKnowledgeEntries':
        if (!isComm) {
          res.status(403).json({ ok: false, error: 'Droits communication ou administrateur requis.' });
          return;
        }
        if (slice === 'news' && Array.isArray(data)) db.news = data as NewsItem[];
        if (slice === 'events' && Array.isArray(data)) db.events = data as EventItem[];
        if (slice === 'photos' && Array.isArray(data)) db.photos = data as GalleryPhoto[];
        if (slice === 'videos' && Array.isArray(data)) db.videos = data as YouTubeVideo[];
        if (slice === 'aiKnowledgeEntries' && Array.isArray(data)) {
          db.aiKnowledgeEntries = data as ServerAiKnowledgeEntry[];
        }
        break;
      case 'promotions':
      case 'projects':
      case 'jobOffers':
      case 'transactions':
      case 'members':
        if (!session) {
          res.status(401).json({ ok: false, error: 'Session authentifiée requise.' });
          return;
        }
        if (slice === 'promotions' && Array.isArray(data) && isAdmin) {
          db.promotions = data as Promotion[];
        }
        if (slice === 'projects' && Array.isArray(data)) {
          db.projects = data as Project[];
        }
        if (slice === 'jobOffers' && Array.isArray(data)) {
          db.jobOffers = data as JobOffer[];
        }
        if (slice === 'transactions' && Array.isArray(data) && (isFinance || session.role === 'DELEGUE')) {
          db.transactions = data as MemberTransaction[];
        }
        if (slice === 'members' && Array.isArray(data) && isAdmin) {
          db.members = data as AlumniMember[];
        }
        break;
      case 'enrollMember':
        if (data && typeof data === 'object') {
          db.members = [data as AlumniMember, ...db.members];
        }
        break;
      case 'mentorshipRequests':
        if (!session) {
          res.status(401).json({ ok: false, error: 'Authentification requise.' });
          return;
        }
        if (Array.isArray(data)) {
          db.mentorshipRequests = data as MentorshipRequestRecord[];
        }
        break;
      case 'jobApplications':
        if (!session) {
          res.status(401).json({ ok: false, error: 'Authentification requise.' });
          return;
        }
        if (Array.isArray(data)) {
          db.jobApplications = data as JobApplicationRecord[];
        }
        break;
      case 'resetDemo':
        if (!isAdmin) {
          res.status(403).json({ ok: false, error: 'Seul un administrateur peut réinitialiser la base.' });
          return;
        }
        resetDbToInitial();
        res.json({ ok: true });
        return;
      default:
        res.status(400).json({ ok: false, error: 'Tranche de données inconnue.' });
        return;
    }

    persistDb(db);
    res.json({ ok: true });
  });

  app.use(
    '/deliverables_video',
    express.static(path.resolve(__dirname, 'deliverables_video'), {
      acceptRanges: true,
      maxAge: '1h',
      setHeaders: (res, filePath) => {
        if (filePath.endsWith('.zip')) {
          res.setHeader(
            'Content-Disposition',
            `attachment; filename="${path.basename(filePath)}"`
          );
        }
      },
    })
  );

  if (process.env.NODE_ENV === 'production') {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Serveur ALGB sécurisé prêt sur http://0.0.0.0:${port}`);
  });
}

startServer().catch((err) => {
  console.error('Échec du démarrage du serveur:', err);
  process.exit(1);
});
