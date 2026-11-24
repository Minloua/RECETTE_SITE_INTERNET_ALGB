import QRCode from 'qrcode';
import { AlumniMember } from '../data/mockData';

export interface SignedQrMetadata {
  ts?: number;
  sig?: string;
}

export interface QrVerificationResponse {
  ok: boolean;
  authentic: boolean;
  legacyUnsigned?: boolean;
  error?: string;
  member?: {
    id: string;
    fullName: string;
    promotionYear: number;
    membershipCardId: string;
    membershipStatus: string;
    isUpToDate: boolean;
    city: string;
    country: string;
  };
}

export const buildMemberQrUrl = (
  member: AlumniMember,
  signature?: SignedQrMetadata
): string => {
  const origin =
    typeof window !== 'undefined' && window.location?.origin
      ? window.location.origin
      : 'https://algb-bingerville.ci';

  const params = new URLSearchParams({
    qrPay: '1',
    m: member.id,
    c: member.membershipCardId,
  });

  if (signature?.ts && signature?.sig) {
    params.set('ts', String(signature.ts));
    params.set('sig', signature.sig);
  }

  return `${origin}/?${params.toString()}`;
};

const getQrRequestHeaders = (): Record<string, string> => {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  try {
    const token =
      typeof window !== 'undefined'
        ? window.sessionStorage.getItem('algb_session_token_fallback_v1')
        : null;
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  } catch {
    // Ignore storage access errors
  }
  return headers;
};

export const fetchSignedQrMetadata = async (
  member: AlumniMember
): Promise<SignedQrMetadata | null> => {
  try {
    const res = await fetch('/api/qr/sign', {
      method: 'POST',
      headers: getQrRequestHeaders(),
      credentials: 'include',
      body: JSON.stringify({
        memberId: member.id,
        cardId: member.membershipCardId,
      }),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { ok?: boolean; ts?: number; sig?: string };
    if (data.ok && data.ts && data.sig) {
      return { ts: data.ts, sig: data.sig };
    }
  } catch {
    // Offline fallback: caller may use cached offline card signature
  }
  return null;
};

export const generateMemberQrDataUrl = async (
  member: AlumniMember,
  signature?: SignedQrMetadata
): Promise<string> => {
  let effectiveSig = signature;
  if (!effectiveSig) {
    const serverSig = await fetchSignedQrMetadata(member);
    if (serverSig) effectiveSig = serverSig;
  }

  const url = buildMemberQrUrl(member, effectiveSig);
  return QRCode.toDataURL(url, {
    width: 320,
    margin: 1,
    errorCorrectionLevel: 'M',
    color: {
      dark: '#0A0A0A',
      light: '#FFFFFF',
    },
  });
};

export const extractQrSignatureParams = (
  rawInput: string
): { memberId?: string; cardId?: string; ts?: number; sig?: string } => {
  const trimmed = rawInput.trim();
  if (!trimmed) return {};
  try {
    const urlObj = trimmed.startsWith('http')
      ? new URL(trimmed)
      : new URL(trimmed.startsWith('?') ? `https://algb.local/${trimmed}` : `https://algb.local/?${trimmed}`);

    const memberId = urlObj.searchParams.get('m') || urlObj.searchParams.get('memberId') || undefined;
    const cardId = urlObj.searchParams.get('c') || urlObj.searchParams.get('cardId') || undefined;
    const tsRaw = urlObj.searchParams.get('ts');
    const sig = urlObj.searchParams.get('sig') || undefined;
    const ts = tsRaw ? Number(tsRaw) : undefined;
    return { memberId, cardId, ts: Number.isFinite(ts) ? ts : undefined, sig };
  } catch {
    return { cardId: trimmed };
  }
};

export const verifyMemberQrAuthenticity = async (
  rawInput: string
): Promise<QrVerificationResponse> => {
  const parsed = extractQrSignatureParams(rawInput);
  try {
    const res = await fetch('/api/qr/verify', {
      method: 'POST',
      headers: getQrRequestHeaders(),
      credentials: 'include',
      body: JSON.stringify(parsed),
    });
    const data = (await res.json()) as QrVerificationResponse;
    return data;
  } catch {
    return {
      ok: false,
      authentic: false,
      error: 'Impossible de joindre le serveur de vérification cryptographique.',
    };
  }
};

export const parseMemberQrPayload = (
  rawInput: string,
  members: AlumniMember[]
): AlumniMember | null => {
  const trimmed = rawInput.trim();
  if (!trimmed) return null;

  // 1. Try URL query parsing (full URL or ?query string)
  try {
    const urlObj = trimmed.startsWith('http')
      ? new URL(trimmed)
      : new URL(trimmed.startsWith('?') ? `https://algb.local/${trimmed}` : `https://algb.local/?${trimmed}`);

    const memberIdParam = urlObj.searchParams.get('m') || urlObj.searchParams.get('memberId');
    const cardIdParam = urlObj.searchParams.get('c') || urlObj.searchParams.get('cardId');

    if (memberIdParam || cardIdParam) {
      const found = members.find(
        (mem) =>
          (memberIdParam && mem.id.toLowerCase() === memberIdParam.toLowerCase()) ||
          (cardIdParam && mem.membershipCardId.toLowerCase() === cardIdParam.toLowerCase())
      );
      if (found) return found;
    }
  } catch {
    // Continue to JSON / direct matricule matching
  }

  // 2. Try JSON payload
  if (trimmed.startsWith('{')) {
    try {
      const parsed = JSON.parse(trimmed) as { memberId?: string; cardId?: string; m?: string; c?: string };
      const mId = parsed.memberId || parsed.m;
      const cId = parsed.cardId || parsed.c;
      const found = members.find(
        (mem) =>
          (mId && mem.id.toLowerCase() === mId.toLowerCase()) ||
          (cId && mem.membershipCardId.toLowerCase() === cId.toLowerCase())
      );
      if (found) return found;
    } catch {
      // Ignore invalid JSON
    }
  }

  // 3. Direct matricule / ID match
  const normalized = trimmed.toLowerCase();
  return (
    members.find(
      (mem) =>
        mem.membershipCardId.toLowerCase() === normalized ||
        mem.id.toLowerCase() === normalized
    ) || null
  );
};
