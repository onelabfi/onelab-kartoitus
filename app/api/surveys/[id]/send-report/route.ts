import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase, getUserFromRequest, isAdmin } from '@/lib/supabase';
import { Resend } from 'resend';

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const reportUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://onelab-kartoitus.vercel.app';

function getResend() {
  if (!RESEND_API_KEY) throw new Error('Missing RESEND_API_KEY');
  return new Resend(RESEND_API_KEY);
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!await isAdmin(user.id)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

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

  if (!RESEND_API_KEY) {
    return NextResponse.json({ error: 'RESEND_API_KEY ei ole asetettu palvelimella' }, { status: 500 });
  }

  const reportLink = `${reportUrl}/r/${id}`;

  const { data: emailData, error: emailError } = await getResend().emails.send({
    from: 'Kartoittaja.com <onboarding@resend.dev>',
    to: recipientEmail,
    subject: `Asbestikartoitusraportti valmis — ${survey.name}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
        <h2 style="color: #1B2B4B;">Kartoitusraportti on valmis</h2>
        <p>Hei,</p>
        <p>Asbestikartoitusraporttisi kohteesta <strong>${survey.name}</strong> on valmis.</p>
        <a href="${reportLink}" style="display: inline-block; background: #2563EB; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; margin: 16px 0;">
          Avaa raportti
        </a>
        <p style="color: #6B7280; font-size: 12px; margin-top: 24px;">Analyysi: Onelab Oy</p>
      </div>
    `,
  });

  if (emailError) {
    console.error('Resend error:', JSON.stringify(emailError));
    return NextResponse.json({ error: `Sähköpostin lähetys epäonnistui: ${emailError.message}` }, { status: 500 });
  }

  // Update status only after email confirmed sent
  await supabase
    .from('surveys')
    .update({
      status: 'complete',
      report_sent_at: new Date().toISOString(),
    })
    .eq('id', id);

  console.log('Email sent successfully:', emailData?.id);

  return NextResponse.json({ ok: true });
}
