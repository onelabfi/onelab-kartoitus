import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase';
import { Resend } from 'resend';

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const reportUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://onelab-kartoitus.vercel.app';

function getResend() {
  if (!RESEND_API_KEY) throw new Error('Missing RESEND_API_KEY');
  return new Resend(RESEND_API_KEY);
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createServerSupabase();

  const { data: survey } = await supabase
    .from('surveys')
    .select('*')
    .eq('id', id)
    .single();

  if (!survey) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const recipientEmail = survey.tilaaja_email;
  if (!recipientEmail) {
    return NextResponse.json({ error: 'Tilaajan sähköposti puuttuu kartoituksesta' }, { status: 400 });
  }

  // Update status
  await supabase
    .from('surveys')
    .update({
      status: 'complete',
      report_sent_at: new Date().toISOString(),
    })
    .eq('id', id);

  const reportLink = `${reportUrl}/r/${id}`;

  if (RESEND_API_KEY) {
    const userEmail = recipientEmail;
    try {
      await getResend().emails.send({
        from: 'Asbestikartoitus <noreply@asbesti.pro>',
        to: userEmail,
        subject: `Asbestikartoitusraportti valmis — ${survey.name}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
            <h2 style="color: #1B2B4B;">Kartoitusraportti on valmis</h2>
            <p>Hei,</p>
            <p>Asbestikartoitusraporttisi kohteesta <strong>${survey.name}</strong> on valmis.</p>
            <a href="${reportLink}" style="display: inline-block; background: #2563EB; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; margin: 16px 0;">
              Avaa raportti
            </a>
            <p style="color: #6B7280; font-size: 12px; margin-top: 24px;">Analyysi: Onelab</p>
          </div>
        `,
      });
    } catch (e) {
      console.error('Email send failed:', e);
    }
  }

  return NextResponse.json({ ok: true });
}
