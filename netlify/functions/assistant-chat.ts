import { handleAssistantChat, type AssistantRequestBody } from '../../server/assistantService.ts';

const JSON_CORS_HEADERS = {
  'Content-Type': 'application/json; charset=utf-8',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export default async function handler(req: Request): Promise<Response> {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: JSON_CORS_HEADERS,
    });
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Méthode non autorisée. Utilisez POST.' }),
      { status: 405, headers: JSON_CORS_HEADERS }
    );
  }

  let body: AssistantRequestBody = {};
  try {
    body = (await req.json()) as AssistantRequestBody;
  } catch {
    return new Response(
      JSON.stringify({ error: 'Corps de requête JSON invalide.' }),
      { status: 400, headers: JSON_CORS_HEADERS }
    );
  }

  try {
    const result = await handleAssistantChat(body);
    return new Response(JSON.stringify(result.payload), {
      status: result.status,
      headers: JSON_CORS_HEADERS,
    });
  } catch (err) {
    console.error('Erreur critique Netlify assistant-chat:', err);
    return new Response(
      JSON.stringify({ error: "Erreur serveur lors du traitement de la demande." }),
      { status: 500, headers: JSON_CORS_HEADERS }
    );
  }
}
