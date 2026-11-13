import { handleAssistantChat, type AssistantRequestBody } from '../../server/assistantService.ts';

export default async function handler(req: Request): Promise<Response> {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  if (req.method !== 'POST') {
    return Response.json(
      { error: 'Méthode non autorisée. Utilisez POST.' },
      { status: 405 }
    );
  }

  let body: AssistantRequestBody = {};
  try {
    body = (await req.json()) as AssistantRequestBody;
  } catch {
    return Response.json(
      { error: 'Corps de requête JSON invalide.' },
      { status: 400 }
    );
  }

  const result = await handleAssistantChat(body);
  return Response.json(result.payload, { status: result.status });
}
