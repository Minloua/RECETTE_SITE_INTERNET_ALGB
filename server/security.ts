import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import type { NextFunction, Request, Response } from 'express';

export type ServerUserRole =
  | 'VISITEUR'
  | 'MEMBRE'
  | 'DELEGUE'
  | 'RESPONSABLE_COMM'
  | 'RESPONSABLE_FINANCE'
  | 'ADMIN'
  | 'SUPER_ADMIN';

export interface SessionPayload {
  credentialId: string;
  identifier: string;
  displayName: string;
  role: Exclude<ServerUserRole, 'VISITEUR'>;
  linkedMemberId?: string;
  iat: number;
  exp: number;
}

export interface RequestWithSession extends Request {
  algbSession?: SessionPayload | null;
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const SECRET_FILE = path.join(DATA_DIR, '.algb-session-secret');

function loadOrCreateSecret(): string {
  const fromEnv = process.env.SESSION_SECRET?.trim();
  if (fromEnv && fromEnv.length >= 24) return fromEnv;

  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(SECRET_FILE)) {
      const existing = fs.readFileSync(SECRET_FILE, 'utf8').trim();
      if (existing.length >= 32) return existing;
    }
    const generated = crypto.randomBytes(48).toString('hex');
    fs.writeFileSync(SECRET_FILE, generated, { mode: 0o600 });
    return generated;
  } catch {
    return crypto.createHash('sha256').update(process.cwd() + ':algb-secret-2026').digest('hex');
  }
}

const SERVER_SECRET = loadOrCreateSecret();
export const SESSION_COOKIE_NAME = 'algb_session';
const SESSION_TTL_SECONDS = 60 * 60 * 24; // 24h

// =====================================================================
// 1. Password Hashing (scrypt + random 16-byte salt + timingSafeEqual)
// =====================================================================
export function hashSecret(plainSecret: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const derived = crypto.scryptSync(plainSecret.trim(), salt, 64).toString('hex');
  return `scrypt$${salt}$${derived}`;
}

export function verifySecret(plainSecret: string, storedHash: string): boolean {
  if (!plainSecret || !storedHash || !storedHash.startsWith('scrypt$')) return false;
  const parts = storedHash.split('$');
  if (parts.length !== 3) return false;
  const [, salt, hashHex] = parts;
  if (!salt || !hashHex) return false;

  try {
    const derived = crypto.scryptSync(plainSecret.trim(), salt, 64);
    const expected = Buffer.from(hashHex, 'hex');
    if (derived.length !== expected.length) return false;
    return crypto.timingSafeEqual(derived, expected);
  } catch {
    return false;
  }
}

// =====================================================================
// 2. Signed HttpOnly Session Cookies (HMAC-SHA256)
// =====================================================================
function base64UrlEncode(input: Buffer | string): string {
  return Buffer.from(input)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function base64UrlDecode(input: string): string {
  const pad = input.length % 4 === 0 ? '' : '='.repeat(4 - (input.length % 4));
  const normalized = input.replace(/-/g, '+').replace(/_/g, '/') + pad;
  return Buffer.from(normalized, 'base64').toString('utf8');
}

export function createSessionToken(
  payload: Omit<SessionPayload, 'iat' | 'exp'>
): string {
  const now = Math.floor(Date.now() / 1000);
  const fullPayload: SessionPayload = {
    ...payload,
    iat: now,
    exp: now + SESSION_TTL_SECONDS,
  };
  const encoded = base64UrlEncode(JSON.stringify(fullPayload));
  const sig = base64UrlEncode(
    crypto.createHmac('sha256', SERVER_SECRET).update(encoded).digest()
  );
  return `${encoded}.${sig}`;
}

export function verifySessionToken(token: string | undefined): SessionPayload | null {
  if (!token || typeof token !== 'string') return null;
  const dotIdx = token.indexOf('.');
  if (dotIdx <= 0) return null;

  const encoded = token.slice(0, dotIdx);
  const providedSig = token.slice(dotIdx + 1);
  if (!encoded || !providedSig) return null;

  const expectedSig = base64UrlEncode(
    crypto.createHmac('sha256', SERVER_SECRET).update(encoded).digest()
  );
  try {
    const a = Buffer.from(providedSig);
    const b = Buffer.from(expectedSig);
    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;

    const parsed = JSON.parse(base64UrlDecode(encoded)) as SessionPayload;
    if (!parsed || typeof parsed.exp !== 'number') return null;
    if (parsed.exp < Math.floor(Date.now() / 1000)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function parseCookies(cookieHeader: string | undefined): Record<string, string> {
  const cookies: Record<string, string> = {};
  if (!cookieHeader) return cookies;
  cookieHeader.split(';').forEach((part) => {
    const idx = part.indexOf('=');
    if (idx > 0) {
      const key = part.slice(0, idx).trim();
      const val = part.slice(idx + 1).trim();
      try {
        cookies[key] = decodeURIComponent(val);
      } catch {
        cookies[key] = val;
      }
    }
  });
  return cookies;
}

function isHttpsRequest(req?: Request): boolean {
  if (!req) {
    return process.env.NODE_ENV === 'production';
  }
  const forwardedProto = req.headers['x-forwarded-proto'];
  const protoStr = Array.isArray(forwardedProto) ? forwardedProto[0] : forwardedProto || '';
  return (
    req.secure ||
    protoStr.toLowerCase().includes('https') ||
    process.env.NODE_ENV === 'production'
  );
}

export function setSessionCookie(res: Response, token: string, req?: Request): void {
  const isHttps = isHttpsRequest(req);
  const attrs = [
    `${SESSION_COOKIE_NAME}=${encodeURIComponent(token)}`,
    'Path=/',
    'HttpOnly',
    isHttps ? 'SameSite=None' : 'SameSite=Lax',
    `Max-Age=${SESSION_TTL_SECONDS}`,
  ];
  if (isHttps) {
    attrs.push('Secure');
    attrs.push('Partitioned');
  }
  res.setHeader('Set-Cookie', attrs.join('; '));
}

export function clearSessionCookie(res: Response, req?: Request): void {
  const isHttps = isHttpsRequest(req);
  const attrs = [
    `${SESSION_COOKIE_NAME}=`,
    'Path=/',
    'HttpOnly',
    isHttps ? 'SameSite=None' : 'SameSite=Lax',
    'Max-Age=0',
  ];
  if (isHttps) {
    attrs.push('Secure');
    attrs.push('Partitioned');
  }
  res.setHeader('Set-Cookie', attrs.join('; '));
}

export function attachSession(req: Request, _res: Response, next: NextFunction): void {
  const cookies = parseCookies(req.headers.cookie);
  let token = cookies[SESSION_COOKIE_NAME];
  if (!token) {
    const authHeader = req.headers.authorization;
    if (typeof authHeader === 'string' && authHeader.toLowerCase().startsWith('bearer ')) {
      token = authHeader.slice(7).trim();
    } else if (typeof req.headers['x-algb-session'] === 'string') {
      token = req.headers['x-algb-session'].trim();
    }
  }
  (req as RequestWithSession).algbSession = verifySessionToken(token);
  next();
}

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const session = (req as RequestWithSession).algbSession;
  if (!session) {
    res.status(401).json({
      ok: false,
      error: 'Authentification requise. Veuillez vous connecter avec vos accès ALGB.',
    });
    return;
  }
  next();
}

export function requireRole(...roles: Array<Exclude<ServerUserRole, 'VISITEUR'>>) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const session = (req as RequestWithSession).algbSession;
    if (!session) {
      res.status(401).json({
        ok: false,
        error: 'Session expirée ou absente. Authentification requise.',
      });
      return;
    }
    if (!roles.includes(session.role)) {
      res.status(403).json({
        ok: false,
        error: `Accès refusé : le profil « ${session.role} » n’est pas habilité pour cette action.`,
      });
      return;
    }
    next();
  };
}

// =====================================================================
// 3. Cryptographic QR Code Signatures (HMAC-SHA256)
// =====================================================================
export function signQrPayload(memberId: string, cardId: string, issuedAt?: number): {
  ts: number;
  sig: string;
} {
  const ts = issuedAt || Math.floor(Date.now() / 1000);
  const canonical = `${memberId}:${cardId}:${ts}`;
  const sig = crypto
    .createHmac('sha256', SERVER_SECRET)
    .update(canonical)
    .digest('hex')
    .slice(0, 24);
  return { ts, sig };
}

export function verifyQrPayloadSignature(
  memberId: string,
  cardId: string,
  ts: number,
  providedSig: string
): boolean {
  if (!memberId || !cardId || !ts || !providedSig) return false;
  const canonical = `${memberId}:${cardId}:${ts}`;
  const expected = crypto
    .createHmac('sha256', SERVER_SECRET)
    .update(canonical)
    .digest('hex')
    .slice(0, 24);
  try {
    const a = Buffer.from(providedSig);
    const b = Buffer.from(expected);
    return a.length === b.length && crypto.timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

// =====================================================================
// 4. Payment Webhook HMAC Verification
// =====================================================================
export function getWebhookSecret(): string {
  return process.env.PAYMENT_WEBHOOK_SECRET?.trim() || SERVER_SECRET;
}

export function signPaymentPayload(payloadString: string): string {
  return crypto
    .createHmac('sha256', getWebhookSecret())
    .update(payloadString)
    .digest('hex');
}

export function verifyPaymentSignature(payloadString: string, signature: string): boolean {
  if (!signature) return false;
  const expected = signPaymentPayload(payloadString);
  try {
    const a = Buffer.from(signature);
    const b = Buffer.from(expected);
    return a.length === b.length && crypto.timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

// =====================================================================
// 5. Security Headers & Sliding-Window Rate Limiting
// =====================================================================
export function securityHeaders(_req: Request, res: Response, next: NextFunction): void {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(self), geolocation=(), microphone=()');
  res.setHeader('X-XSS-Protection', '0');
  next();
}

interface RateBucket {
  timestamps: number[];
}

export function createRateLimiter(options: {
  windowMs: number;
  max: number;
  keyPrefix: string;
  message?: string;
}) {
  const buckets = new Map<string, RateBucket>();

  return (req: Request, res: Response, next: NextFunction): void => {
    const now = Date.now();
    const ip =
      (typeof req.headers['x-forwarded-for'] === 'string'
        ? req.headers['x-forwarded-for'].split(',')[0].trim()
        : req.ip) || 'unknown';
    const key = `${options.keyPrefix}:${ip}`;
    const bucket = buckets.get(key) || { timestamps: [] };
    const cutoff = now - options.windowMs;
    bucket.timestamps = bucket.timestamps.filter((t) => t > cutoff);

    if (bucket.timestamps.length >= options.max) {
      res.status(429).json({
        ok: false,
        error:
          options.message ||
          'Trop de requêtes effectuées en peu de temps. Veuillez patienter quelques instants.',
      });
      return;
    }

    bucket.timestamps.push(now);
    buckets.set(key, bucket);

    if (buckets.size > 2000) {
      for (const [k, b] of buckets.entries()) {
        if (b.timestamps.every((t) => t <= cutoff)) {
          buckets.delete(k);
        }
      }
    }
    next();
  };
}
