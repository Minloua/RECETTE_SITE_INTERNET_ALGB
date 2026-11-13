import QRCode from 'qrcode';
import { AlumniMember } from '../data/mockData';

export const buildMemberQrUrl = (member: AlumniMember): string => {
  const origin =
    typeof window !== 'undefined' && window.location?.origin
      ? window.location.origin
      : 'https://algb-bingerville.netlify.app';

  const params = new URLSearchParams({
    qrPay: '1',
    m: member.id,
    c: member.membershipCardId,
  });

  return `${origin}/?${params.toString()}`;
};

export const generateMemberQrDataUrl = async (member: AlumniMember): Promise<string> => {
  const url = buildMemberQrUrl(member);
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
