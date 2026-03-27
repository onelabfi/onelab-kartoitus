import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getUserFromRequest, createServerSupabase } from '@/lib/supabase';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2026-02-25.clover' });

const PRICE_PER_SAMPLE_CENTS = 3990; // 39.90€ ex-VAT
const VAT_RATE = 0.255; // 25.5% Finnish VAT

export async function POST(req: NextRequest) {
  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { surveyId, sampleCount, surveyAddress } = await req.json();

  if (!surveyId || !sampleCount) {
    return NextResponse.json({ error: 'Missing params' }, { status: 400 });
  }

  const count = Number(sampleCount);
  if (!Number.isInteger(count) || count < 1 || count > 100) {
    return NextResponse.json({ error: 'Invalid sample count' }, { status: 400 });
  }

  // Verify the survey belongs to this user
  const db = createServerSupabase();
  const { data: survey } = await db.from('surveys').select('id, user_id').eq('id', surveyId).single();
  if (!survey || survey.user_id !== user.id) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const unitAmountWithVat = Math.round(PRICE_PER_SAMPLE_CENTS * (1 + VAT_RATE)); // 50.07€
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://onelab-kartoitus.vercel.app';

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    client_reference_id: surveyId,
    line_items: [
      {
        price_data: {
          currency: 'eur',
          product_data: {
            name: 'Asbestinäyteanalyysi',
            description: `${sampleCount} näyte${sampleCount > 1 ? 'ttä' : ''} — ${surveyAddress || ''} | Sis. ALV 25,5%`,
          },
          unit_amount: unitAmountWithVat,
        },
        quantity: count,
      },
    ],
    success_url: `${appUrl}/kartoitukset/${surveyId}?paid=1`,
    cancel_url: `${appUrl}/kartoitukset/${surveyId}?cancelled=1`,
    metadata: {
      surveyId,
      sampleCount: String(count),
    },
  });

  return NextResponse.json({ url: session.url });
}
