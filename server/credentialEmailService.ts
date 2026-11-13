import nodemailer from 'nodemailer';

export interface CredentialEmailRequestBody {
  credentialId?: string;
  recipientEmail?: string;
  recipientName?: string;
  identifier?: string;
  secretCode?: string;
  roleLabel?: string;
  allowedMenusLabels?: string[];
  senderEmail?: string;
  senderName?: string;
  associationName?: string;
  portalUrl?: string;
  ackUrl?: string;
  copyToAdmin?: boolean;
  sourceTrigger?: 'MANUAL' | 'APPROVE_MEMBER' | 'ENROLLMENT' | 'RESEND';
}

export interface CredentialEmailServiceResult {
  status: number;
  payload: {
    ok: boolean;
    provider?: string;
    messageId?: string;
    sentAt?: string;
    senderUsed?: string;
    configured?: boolean;
    error?: string;
  };
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function cleanEnv(name: string): string {
  const raw = process.env[name];
  if (!raw) return '';
  return raw.trim().replace(/^["']+|["']+$/g, '').trim();
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function sanitizeError(err: unknown): string {
  const msg = err instanceof Error ? err.message : typeof err === 'string' ? err : 'Erreur inconnue';
  return msg
    .replace(/(Bearer\s+|xkeysib-|re_|AIza)[0-9A-Za-z._-]+/gi, '[SECRET_MASQUE]')
    .slice(0, 240);
}

function buildEmailContent(input: {
  recipientName: string;
  identifier: string;
  secretCode: string;
  roleLabel: string;
  allowedMenusLabels: string[];
  associationName: string;
  senderEmail: string;
  senderName: string;
  portalUrl: string;
  ackUrl: string;
}) {
  const subject = `[${input.associationName}] Vos accès personnels au portail (${input.roleLabel})`;

  const menusText =
    input.allowedMenusLabels.length > 0
      ? input.allowedMenusLabels.join(', ')
      : 'Menus standards du profil attribué';

  const text = [
    `Bonjour ${input.recipientName},`,
    '',
    `Votre accès personnel au portail officiel de l'${input.associationName} vient d'être activé.`,
    '',
    `Profil attribué : ${input.roleLabel}`,
    `Identifiant de connexion : ${input.identifier}`,
    `Code d'accès (Credential) : ${input.secretCode}`,
    `Rubriques autorisées : ${menusText}`,
    '',
    input.ackUrl
      ? `IMPORTANT — Confirmez la bonne réception de vos accès (accusé de réception) :\n${input.ackUrl}\n`
      : '',
    `Accéder directement au portail : ${input.portalUrl}`,
    '',
    `Pour toute assistance, répondez directement à cet e-mail (${input.senderEmail}).`,
    '',
    `Cordialement,`,
    `${input.senderName}`,
    `${input.associationName}`,
  ]
    .filter(Boolean)
    .join('\n');

  const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <title>${escapeHtml(subject)}</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f4f5;font-family:Arial,Helvetica,sans-serif;color:#18181b;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="padding:24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width:600px;width:100%;background-color:#ffffff;border:1px solid #e4e4e7;border-radius:14px;overflow:hidden;">
          <tr>
            <td style="background-color:#09090b;padding:22px 28px;border-bottom:3px solid #E5B824;">
              <div style="font-size:11px;letter-spacing:1.6px;text-transform:uppercase;color:#E5B824;font-weight:bold;">
                Portail Officiel · Bingerville
              </div>
              <div style="font-size:18px;font-weight:bold;color:#ffffff;margin-top:4px;">
                ${escapeHtml(input.associationName)}
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding:26px 28px;font-size:14px;line-height:1.6;color:#27272a;">
              <p style="margin:0 0 14px 0;">Bonjour <strong>${escapeHtml(input.recipientName)}</strong>,</p>
              <p style="margin:0 0 18px 0;">
                Un credential d'accès personnel vient d'être créé et activé pour votre profil sur le portail officiel de l'Amicale.
              </p>

              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#fafafa;border:1px solid #e4e4e7;border-left:4px solid #E5B824;border-radius:10px;margin-bottom:20px;">
                <tr>
                  <td style="padding:16px 18px;">
                    <div style="font-size:11px;text-transform:uppercase;color:#71717a;font-weight:bold;margin-bottom:8px;">
                      Paramètres de connexion confidentiels
                    </div>
                    <p style="margin:4px 0;font-size:13px;">
                      <strong>Profil attribué :</strong> ${escapeHtml(input.roleLabel)}
                    </p>
                    <p style="margin:4px 0;font-size:13px;">
                      <strong>Identifiant :</strong>
                      <code style="background:#f4f4f5;padding:2px 6px;border-radius:4px;font-family:monospace;color:#111827;">${escapeHtml(input.identifier)}</code>
                    </p>
                    <p style="margin:4px 0;font-size:13px;">
                      <strong>Code secret (Credential) :</strong>
                      <code style="background:#fef3c7;padding:3px 8px;border-radius:4px;font-family:monospace;font-weight:bold;color:#92400e;">${escapeHtml(input.secretCode)}</code>
                    </p>
                    <p style="margin:10px 0 0 0;font-size:12px;color:#52525b;">
                      <strong>Rubriques accessibles :</strong> ${escapeHtml(menusText)}
                    </p>
                  </td>
                </tr>
              </table>

              ${
                input.ackUrl
                  ? `<div style="margin:0 0 18px 0;text-align:center;">
                      <a href="${escapeHtml(input.ackUrl)}" style="display:inline-block;background-color:#E5B824;color:#09090b;text-decoration:none;font-weight:bold;font-size:13px;padding:12px 22px;border-radius:10px;">
                        Confirmer la réception de mes accès (Accusé)
                      </a>
                    </div>`
                  : ''
              }

              <div style="margin:0 0 18px 0;text-align:center;">
                <a href="${escapeHtml(input.portalUrl)}" style="display:inline-block;background-color:#18181b;color:#ffffff;text-decoration:none;font-weight:bold;font-size:12px;padding:10px 18px;border-radius:8px;">
                  Ouvrir le portail ALGB
                </a>
              </div>

              <p style="margin:16px 0 0 0;font-size:12px;color:#52525b;">
                Conservez ce code secret de manière confidentielle. Pour toute demande d'assistance ou rectification, répondez à
                <a href="mailto:${escapeHtml(input.senderEmail)}" style="color:#92400e;">${escapeHtml(input.senderEmail)}</a>.
              </p>
            </td>
          </tr>
          <tr>
            <td style="background-color:#fafafa;padding:14px 28px;border-top:1px solid #e4e4e7;font-size:11px;color:#71717a;">
              Expédié par ${escapeHtml(input.senderName)} (${escapeHtml(input.senderEmail)}) · Notification automatique ALGB.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  return { subject, text, html };
}

export async function handleSendCredentialEmail(
  body: CredentialEmailRequestBody
): Promise<CredentialEmailServiceResult> {
  try {
    const recipientEmail = (body.recipientEmail || '').trim();
    const recipientName = (body.recipientName || 'Membre ALGB').trim();
    const identifier = (body.identifier || '').trim();
    const secretCode = (body.secretCode || '').trim();
    const roleLabel = (body.roleLabel || 'Membre Adhérent').trim();
    const allowedMenusLabels = Array.isArray(body.allowedMenusLabels)
      ? body.allowedMenusLabels.filter((m): m is string => typeof m === 'string' && m.trim().length > 0)
      : [];

    const envDefaultSender = cleanEnv('CREDENTIAL_SENDER_EMAIL') || cleanEnv('SMTP_FROM') || cleanEnv('SMTP_USER');
    const requestedSender = (body.senderEmail || '').trim();
    const senderEmail = EMAIL_REGEX.test(requestedSender)
      ? requestedSender
      : EMAIL_REGEX.test(envDefaultSender)
      ? envDefaultSender
      : '';

    const senderName = (body.senderName || 'Administration ALGB').trim();
    const associationName = (
      body.associationName || "Amicale des Anciens Élèves du Lycée de Garçons de Bingerville"
    ).trim();
    const portalUrl = (body.portalUrl || cleanEnv('APP_URL') || 'https://algb.netlify.app').trim();
    const ackUrl = (body.ackUrl || '').trim();
    const copyToAdmin = body.copyToAdmin !== false;

    if (!EMAIL_REGEX.test(recipientEmail)) {
      return {
        status: 400,
        payload: {
          ok: false,
          error: `Adresse e-mail destinataire invalide ou manquante (« ${recipientEmail || 'vide'} »).`,
        },
      };
    }

    if (!identifier || !secretCode) {
      return {
        status: 400,
        payload: {
          ok: false,
          error: 'Identifiant et code secret requis pour expédier le credential par e-mail.',
        },
      };
    }

    if (!senderEmail) {
      return {
        status: 400,
        payload: {
          ok: false,
          error:
            "Aucune adresse d'expédition administrateur valide n'est renseignée dans les paramètres du site.",
        },
      };
    }

    const { subject, text, html } = buildEmailContent({
      recipientName,
      identifier,
      secretCode,
      roleLabel,
      allowedMenusLabels,
      associationName,
      senderEmail,
      senderName,
      portalUrl,
      ackUrl,
    });

    const receiptHeaders: Record<string, string> = {
      'Disposition-Notification-To': senderEmail,
      'Return-Receipt-To': senderEmail,
      'X-Confirm-Reading-To': senderEmail,
    };

    const nowStamp = new Date().toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const shouldBccAdmin =
      copyToAdmin && senderEmail.toLowerCase() !== recipientEmail.toLowerCase();

    // 1. Brevo HTTP API
    const brevoKey = cleanEnv('BREVO_API_KEY');
    if (brevoKey) {
      const brevoFromEmail = EMAIL_REGEX.test(cleanEnv('BREVO_SENDER_EMAIL'))
        ? cleanEnv('BREVO_SENDER_EMAIL')
        : senderEmail;

      const payload: Record<string, unknown> = {
        sender: { name: senderName, email: brevoFromEmail },
        replyTo: { name: senderName, email: senderEmail },
        to: [{ email: recipientEmail, name: recipientName }],
        subject,
        htmlContent: html,
        textContent: text,
        headers: receiptHeaders,
      };
      if (shouldBccAdmin) {
        payload.bcc = [{ email: senderEmail, name: senderName }];
      }

      const resp = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'api-key': brevoKey,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = (await resp.json().catch(() => ({}))) as { messageId?: string; message?: string };
      if (!resp.ok) {
        return {
          status: resp.status,
          payload: {
            ok: false,
            configured: true,
            provider: 'Brevo',
            error: data.message || `Erreur API Brevo (${resp.status})`,
          },
        };
      }

      return {
        status: 200,
        payload: {
          ok: true,
          configured: true,
          provider: 'Brevo',
          messageId: data.messageId || `brevo-${Date.now()}`,
          sentAt: nowStamp,
          senderUsed: brevoFromEmail,
        },
      };
    }

    // 2. Resend HTTP API
    const resendKey = cleanEnv('RESEND_API_KEY');
    if (resendKey) {
      const resendFromEmail = EMAIL_REGEX.test(cleanEnv('RESEND_SENDER_EMAIL'))
        ? cleanEnv('RESEND_SENDER_EMAIL')
        : senderEmail;

      const payload: Record<string, unknown> = {
        from: `${senderName} <${resendFromEmail}>`,
        reply_to: senderEmail,
        to: [recipientEmail],
        subject,
        html,
        text,
        headers: receiptHeaders,
      };
      if (shouldBccAdmin) {
        payload.bcc = [senderEmail];
      }

      const resp = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = (await resp.json().catch(() => ({}))) as { id?: string; message?: string };
      if (!resp.ok) {
        return {
          status: resp.status,
          payload: {
            ok: false,
            configured: true,
            provider: 'Resend',
            error: data.message || `Erreur API Resend (${resp.status})`,
          },
        };
      }

      return {
        status: 200,
        payload: {
          ok: true,
          configured: true,
          provider: 'Resend',
          messageId: data.id || `resend-${Date.now()}`,
          sentAt: nowStamp,
          senderUsed: resendFromEmail,
        },
      };
    }

    // 3. Nodemailer SMTP
    const smtpHost = cleanEnv('SMTP_HOST');
    const smtpUser = cleanEnv('SMTP_USER');
    const smtpPass = cleanEnv('SMTP_PASS') || cleanEnv('SMTP_PASSWORD');
    if (smtpHost && smtpUser && smtpPass) {
      const smtpPort = Number(cleanEnv('SMTP_PORT') || '587');
      const smtpSecure =
        cleanEnv('SMTP_SECURE').toLowerCase() === 'true' || smtpPort === 465;

      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpSecure,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      const fromEmail = EMAIL_REGEX.test(cleanEnv('SMTP_FROM'))
        ? cleanEnv('SMTP_FROM')
        : EMAIL_REGEX.test(smtpUser)
        ? smtpUser
        : senderEmail;

      const info = await transporter.sendMail({
        from: `"${senderName.replace(/"/g, '')}" <${fromEmail}>`,
        replyTo: senderEmail,
        to: recipientEmail,
        bcc: shouldBccAdmin ? senderEmail : undefined,
        subject,
        text,
        html,
        headers: receiptHeaders,
      });

      return {
        status: 200,
        payload: {
          ok: true,
          configured: true,
          provider: `SMTP (${smtpHost})`,
          messageId: info.messageId || `smtp-${Date.now()}`,
          sentAt: nowStamp,
          senderUsed: fromEmail,
        },
      };
    }

    // 4. Optional server-side Email Webhook (e.g. dedicated Apps Script mailer)
    const emailWebhookUrl = cleanEnv('EMAIL_WEBHOOK_URL');
    if (emailWebhookUrl) {
      const resp = await fetch(emailWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'SEND_CREDENTIAL_EMAIL',
          credentialId: body.credentialId,
          recipientEmail,
          recipientName,
          identifier,
          secretCode,
          roleLabel,
          senderEmail,
          senderName,
          copyToAdmin,
          subject,
          text,
          html,
          ackUrl,
          portalUrl,
        }),
      });

      if (!resp.ok) {
        return {
          status: resp.status,
          payload: {
            ok: false,
            configured: true,
            provider: 'Webhook Mail',
            error: `Le webhook e-mail a répondu avec le statut ${resp.status}.`,
          },
        };
      }

      return {
        status: 200,
        payload: {
          ok: true,
          configured: true,
          provider: 'Webhook Mail',
          messageId: `webhook-${Date.now()}`,
          sentAt: nowStamp,
          senderUsed: senderEmail,
        },
      };
    }

    // 5. No email provider configured on server yet
    return {
      status: 503,
      payload: {
        ok: false,
        configured: false,
        error:
          "Serveur d'envoi e-mail non configuré : définissez BREVO_API_KEY, RESEND_API_KEY ou SMTP_HOST / SMTP_USER / SMTP_PASS dans les variables d'environnement Netlify.",
      },
    };
  } catch (err: unknown) {
    const msg = sanitizeError(err);
    console.error('Erreur envoi credential email:', msg);
    return {
      status: 500,
      payload: {
        ok: false,
        error: `Échec lors de l'envoi de l'e-mail : ${msg}`,
      },
    };
  }
}
