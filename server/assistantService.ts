import { GoogleGenAI, ThinkingLevel } from '@google/genai';

export interface ChatHistoryTurn {
  role: 'user' | 'model';
  text: string;
}

export interface KnowledgeEntryInput {
  id: string;
  title: string;
  category: string;
  content: string;
  source: 'MANUEL' | 'PROFIL';
  authorName: string;
  authorRole: string;
  authorPromotion?: number;
  isActive: boolean;
  updatedAt: string;
}

export interface ContextSnapshot {
  settings?: {
    associationName?: string;
    associationSignature?: string;
    associationMessage?: string;
    presidentName?: string;
    secretaryGeneralName?: string;
    treasurerName?: string;
    headquartersAddress?: string;
    officialEmail?: string;
    officialPhone?: string;
    droitAdhesionAmount?: number;
    cotisationMensuelleAmount?: number;
    currency?: string;
    fiscalYear?: number;
    orangeMoneyMerchantNumber?: string;
    mtnMoMoMerchantNumber?: string;
    moovMoneyMerchantNumber?: string;
    bankName?: string;
  };
  events?: Array<{
    title: string;
    type: string;
    date: string;
    time: string;
    location: string;
    city: string;
    summary: string;
    attendeesCount: number;
  }>;
  news?: Array<{
    title: string;
    category: string;
    date: string;
    summary: string;
  }>;
  projects?: Array<{
    title: string;
    category: string;
    status: string;
    budgetGoal: number;
    budgetRaised: number;
    summary: string;
  }>;
  stats?: {
    membersCount?: number;
    promotionsCount?: number;
  };
  currentRole?: string;
  currentUserLabel?: string;
}

export interface AssistantRequestBody {
  message?: string;
  history?: ChatHistoryTurn[];
  contextSnapshot?: ContextSnapshot;
  aiKnowledgeBase?: KnowledgeEntryInput[];
}

export interface AssistantServiceResult {
  status: number;
  payload:
    | { reply: string; model: string; warning?: string }
    | { error: string };
}

function resolveApiKey(): string | null {
  const rawKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
  if (!rawKey) return null;
  const apiKey = rawKey.trim().replace(/^["']+|["']+$/g, '').trim();
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey.length < 10) return null;
  return apiKey;
}

export function getGeminiClient(): GoogleGenAI | null {
  const apiKey = resolveApiKey();
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

function sanitizeErrorMessage(msg: unknown): string {
  const raw = typeof msg === 'string' ? msg : '';
  return raw.replace(/AIza[0-9A-Za-z_-]{20,}/g, '[CLE_MASQUEE]').slice(0, 220);
}

/**
 * Normalizes conversation history for Gemini `generateContent`:
 * - Strips empty turns
 * - Ensures the conversation starts with a 'user' turn
 * - Merges consecutive same-role turns so roles strictly alternate ('user' -> 'model')
 * - Ensures the last history turn before the new 'user' message is 'model'
 */
function normalizeHistoryForGemini(history: ChatHistoryTurn[] | undefined): ChatHistoryTurn[] {
  if (!Array.isArray(history)) return [];
  const cleaned: ChatHistoryTurn[] = [];

  for (const turn of history) {
    if (!turn || (turn.role !== 'user' && turn.role !== 'model')) continue;
    const text = typeof turn.text === 'string' ? turn.text.trim() : '';
    if (!text) continue;

    if (cleaned.length === 0 && turn.role !== 'user') {
      continue;
    }

    const last = cleaned[cleaned.length - 1];
    if (last && last.role === turn.role) {
      last.text = `${last.text}\n${text}`;
    } else {
      cleaned.push({ role: turn.role, text });
    }
  }

  // Since the current prompt is a 'user' message, history must end with 'model'
  if (cleaned.length > 0 && cleaned[cleaned.length - 1].role === 'user') {
    cleaned.pop();
  }

  return cleaned.slice(-12);
}

export function buildSystemInstruction(
  snapshot: ContextSnapshot | undefined,
  knowledgeBase: KnowledgeEntryInput[] | undefined
): string {
  const s = snapshot?.settings || {};
  const currency = s.currency || 'FCFA';

  const eventsBlock =
    snapshot?.events && snapshot.events.length > 0
      ? snapshot.events
          .slice(0, 10)
          .map(
            (ev) =>
              `- ${ev.title} (${ev.type}) : le ${ev.date} à ${ev.time}, lieu : ${ev.location} (${ev.city}). ${ev.summary} [${ev.attendeesCount} inscrits]`
          )
          .join('\n')
      : 'Aucun événement enregistré pour le moment.';

  const newsBlock =
    snapshot?.news && snapshot.news.length > 0
      ? snapshot.news
          .slice(0, 6)
          .map((n) => `- [${n.date}] ${n.title} (${n.category}) : ${n.summary}`)
          .join('\n')
      : 'Aucune actualité récente.';

  const projectsBlock =
    snapshot?.projects && snapshot.projects.length > 0
      ? snapshot.projects
          .slice(0, 6)
          .map(
            (p) =>
              `- ${p.title} (${p.category}, ${p.status}) : ${p.budgetRaised.toLocaleString('fr-FR')} / ${p.budgetGoal.toLocaleString('fr-FR')} ${currency}. ${p.summary}`
          )
          .join('\n')
      : 'Aucun projet actif.';

  const activeKnowledge = (knowledgeBase || []).filter((k) => k.isActive);
  const enrichedBlock =
    activeKnowledge.length > 0
      ? activeKnowledge
          .map(
            (k) =>
              `- [${k.category} · Source: ${k.source === 'PROFIL' ? 'Profil officiel' : 'Note'} · Par ${k.authorName} (${k.authorRole}${k.authorPromotion ? `, Promo ${k.authorPromotion}` : ''}) · Maj ${k.updatedAt}] ${k.title} : ${k.content}`
          )
          .join('\n')
      : 'Aucune note complémentaire enregistrée pour le moment.';

  return `Tu es l'Assistant Officiel de l'ALGB (${s.associationName || "Amicale des Anciens Élèves du Lycée de Garçons de Bingerville"}).
Devise et signature : ${s.associationSignature || 'Excellence, Fraternité, Devoir de Mémoire'} — ${s.associationMessage || 'Une histoire, des générations, un même engagement'}.

RÔLE ET TON :
- Réponds toujours en français clair, chaleureux, respectueux et institutionnel.
- Sois concis et structuré (utilise des phrases courtes ou des listes à puces simples quand tu détailles une procédure).
- Appuie-toi uniquement sur les données officielles ci-dessous et sur la base de connaissances enrichie par l'Administration et la Communication.
- Si une information précise n'est pas disponible dans ces données, indique-le honnêtement et invite le membre à contacter le secrétariat officiel (${s.officialEmail || 'contact@algb-bingerville.org'}).
- Indique quand c'est pertinent la rubrique du portail à consulter : "Adhésion", "Actualités", "Projets", "Promotions", "Réseau", "Amicale" (FAQ & Statuts) ou "Espace Membre".

DONNÉES INSTITUTIONNELLES ACTUELLES :
- Président : ${s.presidentName || 'Bureau Exécutif ALGB'}
- Secrétaire Général : ${s.secretaryGeneralName || 'Secrétariat Général ALGB'}
- Trésorier Général : ${s.treasurerName || 'Trésorerie ALGB'}
- Siège social : ${s.headquartersAddress || 'Lycée Classique / de Garçons de Bingerville, Côte d’Ivoire'}
- Email officiel : ${s.officialEmail || 'contact@algb-bingerville.org'} | Téléphone : ${s.officialPhone || '+225 27 22 40 31 00'}
- Statistiques portail : ${snapshot?.stats?.membersCount ?? 'Plusieurs'} membres inscrits répartis sur ${snapshot?.stats?.promotionsCount ?? 'plusieurs'} promotions.
- Profil consultant actuellement l'assistant : ${snapshot?.currentRole || 'VISITEUR'}${snapshot?.currentUserLabel ? ` (${snapshot.currentUserLabel})` : ''}.

PROCÉDURES D'ADHÉSION & COTISATIONS :
1. Éligibilité : toute personne ayant effectué au moins une année scolaire au Lycée de Garçons de Bingerville.
2. Enrôlement en ligne : depuis la rubrique "Adhésion" (ou le bouton "S'enrôler dans l'Annuaire & BDR"), renseigner identité, promotion de sortie, pseudo éventuel, parcours professionnel, compétences (BDR) et préférences de confidentialité.
3. Validation : la demande est examinée et validée par le Délégué de promotion, l'Administrateur ou le Bureau Exécutif. Un matricule officiel et une carte d'adhérent (avec QR Code sécurisé de suivi et de synchronisation des paiements) sont générés.
4. Montants statutaires :
   - Droit d'adhésion initial : ${(s.droitAdhesionAmount ?? 10000).toLocaleString('fr-FR')} ${currency}
   - Cotisation mensuelle : ${(s.cotisationMensuelleAmount ?? 5000).toLocaleString('fr-FR')} ${currency} / mois (Exercice ${s.fiscalYear ?? 2026})
5. Moyens de paiement acceptés : Orange Money (${s.orangeMoneyMerchantNumber || 'service marchand'}), MTN MoMo (${s.mtnMoMoMerchantNumber || 'service marchand'}), Moov Money (${s.moovMoneyMerchantNumber || 'service marchand'}), Carte Bancaire, Virement (${s.bankName || 'Compte ALGB'}) ou règlement au guichet du Trésorier avec édition immédiate de reçu et quitus financier depuis l'Espace Membre.

ÉVÉNEMENTS À VENIR & AGENDA :
${eventsBlock}

ACTUALITÉS RÉCENTES :
${newsBlock}

PROJETS DU LYCÉE & SOLIDARITÉ :
${projectsBlock}

BASE DE CONNAISSANCES ENRICHIE PAR L'ADMINISTRATION & LA COMMUNICATION (PRIORITAIRE) :
${enrichedBlock}`;
}

export function buildLocalAssistantReply(
  query: string,
  snapshot: ContextSnapshot | undefined,
  knowledgeBase: KnowledgeEntryInput[] | undefined
): string {
  const q = query
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  const s = snapshot?.settings || {};
  const currency = s.currency || 'FCFA';
  const adhesionFee = (s.droitAdhesionAmount ?? 10000).toLocaleString('fr-FR');
  const monthlyFee = (s.cotisationMensuelleAmount ?? 5000).toLocaleString('fr-FR');
  const activeKb = (knowledgeBase || []).filter((k) => k.isActive);

  // Check matching enriched KB entries first
  const matchingKb = activeKb.filter((k) => {
    const hay = `${k.title} ${k.content} ${k.category}`
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
    const words = q.split(/\s+/).filter((w) => w.length >= 4);
    return words.some((w) => hay.includes(w));
  });

  if (q.includes('adher') || q.includes('inscri') || q.includes('enrol') || q.includes('cotis') || q.includes('paiement') || q.includes('tarif') || q.includes('montant')) {
    return [
      `Pour rejoindre l'ALGB (${s.associationName || "Amicale des Anciens Élèves du Lycée de Garçons de Bingerville"}) et régler vos cotisations :`,
      `• Éligibilité : avoir effectué au moins une année scolaire au Lycée de Garçons de Bingerville.`,
      `• Enrôlement : rendez-vous dans la rubrique "Adhésion" pour compléter votre dossier (identité, promotion, parcours BDR).`,
      `• Droits d'adhésion : ${adhesionFee} ${currency} · Cotisation mensuelle : ${monthlyFee} ${currency} / mois (Exercice ${s.fiscalYear ?? 2026}).`,
      `• Paiements : Orange Money (${s.orangeMoneyMerchantNumber || 'marchand'}), MTN MoMo (${s.mtnMoMoMerchantNumber || 'marchand'}), Moov Money, Carte Bancaire, Virement (${s.bankName || 'Compte ALGB'}) ou guichet du Trésorier avec édition de reçu et quitus dans votre Espace Membre.`,
    ].join('\n');
  }

  if (q.includes('evenement') || q.includes('agenda') || q.includes('gala') || q.includes('retrouvailles') || q.includes('conference') || q.includes('date')) {
    const events = snapshot?.events || [];
    if (events.length > 0) {
      const list = events
        .slice(0, 4)
        .map((ev) => `• ${ev.title} (${ev.type}) — le ${ev.date} à ${ev.time}, ${ev.location} (${ev.city}).`)
        .join('\n');
      return `Voici les prochains événements inscrits à l'agenda officiel de l'ALGB :\n${list}\n\nRetrouvez tous les détails et inscriptions dans la rubrique "Actualités & Événements".`;
    }
    return `Consultez la rubrique "Actualités & Événements" pour découvrir le calendrier des rencontres, galas et assemblées générales de l'ALGB.`;
  }

  if (q.includes('projet') || q.includes('mecenat') || q.includes('don') || q.includes('bourse') || q.includes('lycee') || q.includes('solidarite')) {
    const projects = snapshot?.projects || [];
    if (projects.length > 0) {
      const list = projects
        .slice(0, 4)
        .map(
          (p) =>
            `• ${p.title} (${p.status}) — ${p.budgetRaised.toLocaleString('fr-FR')} / ${p.budgetGoal.toLocaleString('fr-FR')} ${currency}.`
        )
        .join('\n');
      return `Voici les projets prioritaires soutenus par l'ALGB en faveur du Lycée de Bingerville :\n${list}\n\nVous pouvez contribuer ou consulter les rapports d'exécution depuis la rubrique "Projets & Mécénat".`;
    }
  }

  if (q.includes('carte') || q.includes('qr') || q.includes('matricule') || q.includes('quitus') || q.includes('espace membre')) {
    return [
      `Concernant votre carte d'adhérent et votre Espace Membre ALGB :`,
      `• Après validation de votre adhésion, un matricule officiel et une carte d'adhérent avec QR Code sécurisé vous sont attribués.`,
      `• Depuis l'"Espace Membre", vous pouvez afficher votre carte officielle, flasher le QR Code pour synchroniser un paiement, consulter l'historique graphique de vos cotisations et télécharger vos reçus et quitus.`,
    ].join('\n');
  }

  if (q.includes('mentor') || q.includes('parrain') || q.includes('carriere') || q.includes('emploi') || q.includes('stage')) {
    return [
      `Les programmes "Trouver un Mentor", "Collège des Parrains" et "Carrières au cœur du réseau" sont réservés aux membres connectés à jour de leurs cotisations.`,
      `• Connectez-vous avec votre credential membre dans "Espace Membre" et vérifiez que votre statut financier est "À jour".`,
      `• L'Annuaire des Anciens et les pages de présentation de l'Amicale restent accessibles à tout moment.`,
    ].join('\n');
  }

  if (matchingKb.length > 0) {
    const kbLines = matchingKb
      .slice(0, 3)
      .map((k) => `• ${k.title} : ${k.content}`)
      .join('\n');
    return `Voici les informations officielles enregistrées pour votre question :\n${kbLines}`;
  }

  return [
    `Bienvenue auprès de l'Assistant ALGB (${s.associationSignature || 'Excellence, Fraternité, Devoir de Mémoire'}).`,
    `Je peux vous renseigner sur :`,
    `• L'adhésion et les cotisations (${adhesionFee} ${currency} d'adhésion · ${monthlyFee} ${currency}/mois)`,
    `• Les prochains événements et actualités (${snapshot?.events?.length ?? 0} événement(s) à l'agenda)`,
    `• Les projets du Lycée et le mécénat (${snapshot?.projects?.length ?? 0} projet(s) suivi(s))`,
    `• L'Espace Membre, la carte QR Code, le Mentorat et l'Annuaire des Promotions.`,
    `Pour toute demande spécifique, contactez le secrétariat : ${s.officialEmail || 'contact@algb-bingerville.org'} (${s.officialPhone || '+225 27 22 40 31 00'}).`,
  ].join('\n');
}

function describeGeminiIssue(status: number | undefined, detail: string): string {
  const lower = detail.toLowerCase();
  if (status === 403 || lower.includes('permission') || lower.includes('referer') || lower.includes('referrer')) {
    return lower.includes('referer') || lower.includes('referrer')
      ? "Clé Gemini restreinte par domaine HTTP : réponse fournie via la base officielle ALGB."
      : "Accès Gemini (403) refusé : vérifiez la clé GEMINI_API_KEY dans les secrets serveur. Réponse fournie via la base officielle ALGB.";
  }
  if (status === 400 || lower.includes('api key') || lower.includes('api_key_invalid')) {
    return "Clé GEMINI_API_KEY invalide ou absente : vérifiez Settings > Secrets. Réponse fournie via la base officielle ALGB.";
  }
  if (status === 429) {
    return "Quota Gemini temporairement atteint : réponse fournie via la base officielle ALGB.";
  }
  return "Service Gemini temporairement indisponible : réponse fournie via la base officielle ALGB.";
}

export async function handleAssistantChat(
  body: AssistantRequestBody
): Promise<AssistantServiceResult> {
  const { message, history, contextSnapshot, aiKnowledgeBase } = body || {};

  const trimmedMessage = typeof message === 'string' ? message.trim() : '';
  if (!trimmedMessage) {
    return {
      status: 400,
      payload: { error: 'Veuillez saisir une question pour démarrer la discussion.' },
    };
  }

  const ai = getGeminiClient();
  if (!ai) {
    return {
      status: 200,
      payload: {
        reply: buildLocalAssistantReply(trimmedMessage, contextSnapshot, aiKnowledgeBase),
        model: 'algb-base-officielle',
        warning:
          "Clé GEMINI_API_KEY non configurée dans l'environnement serveur : réponse générée depuis la base officielle ALGB.",
      },
    };
  }

  try {
    const systemInstruction = buildSystemInstruction(contextSnapshot, aiKnowledgeBase);
    const normalizedHistory = normalizeHistoryForGemini(history);

    const contents = [
      ...normalizedHistory.map((turn) => ({
        role: turn.role,
        parts: [{ text: turn.text }],
      })),
      {
        role: 'user' as const,
        parts: [{ text: trimmedMessage }],
      },
    ];

    let usedModel = 'gemini-4-hydrogen';
    let response;
    try {
      response = await ai.models.generateContent({
        model: usedModel,
        contents,
        config: {
          systemInstruction,
          thinkingConfig: {
            thinkingLevel: ThinkingLevel.LOW,
          },
        },
      });
    } catch (primaryErr: unknown) {
      const primaryObj = primaryErr as { status?: number; message?: string };
      const primaryMsg = (primaryObj?.message || '').toLowerCase();
      const isKeyOrPermissionError =
        primaryObj?.status === 403 ||
        primaryMsg.includes('api key') ||
        primaryMsg.includes('api_key_invalid') ||
        primaryMsg.includes('permission');

      if (isKeyOrPermissionError) {
        throw primaryErr;
      }

      usedModel = 'gemini-3.1-flash-lite';
      response = await ai.models.generateContent({
        model: usedModel,
        contents,
        config: {
          systemInstruction,
        },
      });
    }

    const reply = (response.text || '').trim();
    if (!reply) {
      return {
        status: 200,
        payload: {
          reply: buildLocalAssistantReply(trimmedMessage, contextSnapshot, aiKnowledgeBase),
          model: 'algb-base-officielle',
          warning: "Réponse Gemini vide : réponse générée depuis la base officielle ALGB.",
        },
      };
    }

    return {
      status: 200,
      payload: {
        reply,
        model: usedModel,
      },
    };
  } catch (err: unknown) {
    const errorObj = err as { status?: number; message?: string };
    const safeDetail = sanitizeErrorMessage(errorObj?.message);
    console.error('Erreur assistant chat (basculé en base officielle ALGB):', errorObj?.status, safeDetail || err);

    return {
      status: 200,
      payload: {
        reply: buildLocalAssistantReply(trimmedMessage, contextSnapshot, aiKnowledgeBase),
        model: 'algb-base-officielle',
        warning: describeGeminiIssue(errorObj?.status, safeDetail),
      },
    };
  }
}
