import type { PaymentIntentRecord, AlgbDatabaseState } from './database.ts';
import type { PaymentMethod, PaymentType } from '../src/data/mockData.ts';
import { signPaymentPayload } from './security.ts';

export interface InitiatePaymentInput {
  type: PaymentType;
  amountFcfa: number;
  method: PaymentMethod;
  title: string;
  description?: string;
  memberId?: string;
  memberName?: string;
  projectId?: string;
  monthYears?: string[];
  phoneNumber?: string;
  isAnonymous?: boolean;
  frequency?: 'PONCTUEL' | 'MENSUEL';
}

export function resolveGatewayProvider(): PaymentIntentRecord['provider'] {
  const configured = (process.env.PAYMENT_GATEWAY_PROVIDER || '').trim().toUpperCase();
  if (configured === 'CINETPAY') return 'CINETPAY';
  if (configured === 'PAYDUNYA') return 'PAYDUNYA';
  if (configured === 'WAVE') return 'WAVE';
  return 'SANDBOX_UEMOA';
}

export function createPaymentIntent(
  db: AlgbDatabaseState,
  input: InitiatePaymentInput
): PaymentIntentRecord {
  const id = `pi-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const reference = `ALGB-${input.type.slice(0, 3)}-2026-${Math.floor(1000 + Math.random() * 9000)}`;
  const createdAt = new Date().toISOString();
  const provider = resolveGatewayProvider();

  const signature = signPaymentPayload(`${id}:${reference}:${input.amountFcfa}:FCFA`);

  const intent: PaymentIntentRecord = {
    id,
    reference,
    provider,
    method: input.method,
    type: input.type,
    amountFcfa: Math.round(input.amountFcfa),
    currency: 'FCFA',
    memberId: input.memberId,
    memberName: input.memberName,
    projectId: input.projectId,
    monthYears: input.monthYears,
    title: input.title,
    description: input.description,
    phoneNumber: input.phoneNumber,
    status: 'PENDING',
    createdAt,
    signature,
    isAnonymous: input.isAnonymous,
    frequency: input.frequency,
  };

  db.paymentIntents = [intent, ...db.paymentIntents.slice(0, 499)];
  return intent;
}

export function settlePaymentIntent(
  db: AlgbDatabaseState,
  intent: PaymentIntentRecord,
  validatorLabel = 'Passerelle Agréée UEMOA (Webhook HMAC)'
) {
  if (intent.status === 'PAID') {
    return { alreadyPaid: true, transaction: null, contribution: null };
  }

  intent.status = 'PAID';
  intent.paidAt = new Date().toISOString();

  const today = new Date().toISOString().split('T')[0];
  let createdTx = null;
  let createdContribution = null;

  if (intent.memberId) {
    const member = db.members.find((m) => m.id === intent.memberId);
    const txId = `tx-${Date.now().toString().slice(-6)}`;
    const recNumber = `REC-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    createdTx = {
      id: txId,
      reference: intent.reference,
      memberId: intent.memberId,
      memberName: intent.memberName || (member ? `${member.firstName} ${member.lastName}` : 'Membre ALGB'),
      promotionYear: member?.promotionYear || 2024,
      type: intent.type,
      title: intent.title,
      description: intent.description || `Règlement vérifié (${intent.provider})`,
      monthYears: intent.monthYears,
      amount: intent.amountFcfa,
      currency: 'FCFA',
      date: today,
      method: intent.method,
      status: 'PAYE' as const,
      receiptNumber: recNumber,
      validatedBy: validatorLabel,
      notes: `Signature webhook vérifiée (${intent.id})`,
    };
    db.transactions = [createdTx, ...db.transactions];
  }

  if (intent.projectId) {
    const proj = db.projects.find((p) => p.id === intent.projectId);
    if (proj) {
      const contribMethod: 'ORANGE_MONEY' | 'MTN_MOMO' | 'MOOV_MONEY' | 'WAVE' | 'CARTE_BANCAIRE' | 'VIREMENT' =
        intent.method === 'ESPECES' ? 'VIREMENT' : intent.method;

      createdContribution = {
        id: `c-${Date.now().toString().slice(-5)}`,
        contributorName: intent.isAnonymous
          ? 'Mécène Anonyme ALGB'
          : intent.memberName || 'Mécène & Ami de l’ALGB',
        amount: intent.amountFcfa,
        currency: 'FCFA',
        date: today,
        method: contribMethod,
        isAnonymous: !!intent.isAnonymous,
        message: intent.description || `Contribution vérifiée (${intent.provider})`,
      };

      const nextRaised = proj.budgetRaised + intent.amountFcfa;
      const nextProgress = Math.min(100, Math.round((nextRaised / proj.budgetGoal) * 100));
      proj.budgetRaised = nextRaised;
      proj.contributorsCount += 1;
      proj.progressPercentage = nextProgress;
      proj.contributions = [createdContribution, ...proj.contributions];
    }
  }

  return {
    alreadyPaid: false,
    transaction: createdTx,
    contribution: createdContribution,
  };
}
