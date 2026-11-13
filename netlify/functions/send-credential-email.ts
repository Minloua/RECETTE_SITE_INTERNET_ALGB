import {
  handleSendCredentialEmail,
  type CredentialEmailRequestBody,
} from '../../server/credentialEmailService.ts';

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
      { ok: false, error: 'Méthode non autorisée. Utilisez POST.' },
      { status: 405 }
    );
  }

  let body: CredentialEmailRequestBody = {};
  try {
    body = (await req.json()) as CredentialEmailRequestBody;
  } catch {
    return Response.json(
      { ok: false, error: 'Corps de requête JSON invalide.' },
      { status: 400 }
    );
  }

  const result = await handleSendCredentialEmail(body);
  return Response.json(result.payload, { status: result.status });
}
