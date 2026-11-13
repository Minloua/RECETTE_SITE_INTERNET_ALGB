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
  payload: { reply: string; model: string } | { error: string };
}

export function getGeminiClient(): GoogleGenAI | null {
  const rawKey = process.env.GEMINI_API_KEY;
  if (!rawKey) return null;
  const apiKey = rawKey.trim().replace(/^["']+|["']+$/g, '').trim();
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

export async function handleAssistantChat(
  body: AssistantRequestBody
): Promise<AssistantServiceResult> {
  try {
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
        status: 503,
        payload: {
          error:
            "La clé d'API Gemini (GEMINI_API_KEY) n'est pas encore configurée dans les variables d'environnement du serveur.",
        },
      };
    }

    const systemInstruction = buildSystemInstruction(contextSnapshot, aiKnowledgeBase);

    const safeHistory: ChatHistoryTurn[] = Array.isArray(history)
      ? history
          .filter(
            (turn) =>
              (turn.role === 'user' || turn.role === 'model') &&
              typeof turn.text === 'string' &&
              turn.text.trim().length > 0
          )
          .slice(-12)
      : [];

    const contents = [
      ...safeHistory.map((turn) => ({
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

      usedModel = 'gemini-2.5-flash';
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
        status: 502,
        payload: {
          error:
            "L'assistant n'a pas pu formuler de réponse pour cette requête. Veuillez réessayer.",
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
    const lowerDetail = safeDetail.toLowerCase();
    console.error('Erreur assistant chat:', errorObj?.status, safeDetail || err);

    if (errorObj?.status === 403 || lowerDetail.includes('permission') || lowerDetail.includes('referer')) {
      const isReferer = lowerDetail.includes('referer') || lowerDetail.includes('referrer');
      return {
        status: 403,
        payload: {
          error: isReferer
            ? "Clé Gemini bloquée par une restriction de domaine (HTTP Referrer). Dans Google Cloud Console, retirez la restriction de site web sur votre clé car elle est appelée côté serveur par Netlify."
            : `Accès refusé par l'API Gemini (403). Vérifiez que l'API Generative Language est active sur votre clé et qu'elle n'est pas restreinte par domaine ou IP. (${safeDetail})`,
        },
      };
    }

    if (errorObj?.status === 400) {
      return {
        status: 400,
        payload: {
          error: `Requête ou clé API Gemini invalide (400). Vérifiez la valeur de GEMINI_API_KEY dans Netlify (sans guillemets ni espaces) puis redéployez. (${safeDetail})`,
        },
      };
    }

    if (errorObj?.status === 429) {
      return {
        status: 429,
        payload: {
          error:
            "Le service d'assistance reçoit actuellement trop de requêtes. Veuillez patienter quelques instants.",
        },
      };
    }

    return {
      status: 500,
      payload: {
        error:
          "Une erreur est survenue lors de la consultation de l'assistant IA. Veuillez réessayer.",
      },
    };
  }
}
