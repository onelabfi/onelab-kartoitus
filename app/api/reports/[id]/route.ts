import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase';

const SETTINGS_ID = '00000000-0000-0000-0000-000000000001';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = createServerSupabase();
  const { id } = await params;

  const [{ data: survey }, { data: samples }, { data: appSettings }] = await Promise.all([
    admin.from('surveys').select('*').eq('id', id).single(),
    admin.from('survey_samples').select('*').eq('survey_id', id).order('created_at'),
    admin.from('app_settings').select('*').eq('id', SETTINGS_ID).single(),
  ]);

  if (!survey) {
    return NextResponse.json({ error: 'not found' }, { status: 404 });
  }

  return NextResponse.json({ survey, samples: samples ?? [], appSettings });
}
