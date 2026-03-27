import { createClient } from '@supabase/supabase-js';

export type Survey = {
  id: string;
  user_id: string;
  name: string;
  city: string;
  date: string;
  status: 'draft' | 'pending_payment' | 'submitted' | 'analyzing' | 'complete';
  created_at: string;
  kohde_tyyppi: string | null;
  kohde_muu: string | null;
  report_sent_at: string | null;
  tilaaja_nimi: string | null;
  tilaaja_email: string | null;
  tilaaja_puhelin: string | null;
};

export type AppSettings = {
  id: string;
  logo_url: string | null;
  company_name: string;
  kartoittaja_name: string;
  kartoittaja_title: string;
  kartoittaja_credentials: string;
  signature_url: string | null;
  updated_at: string;
};

export type Sample = {
  id: string;
  survey_id: string;
  sample_code: string;
  location: string;
  material: string;
  description: string | null;
  photo_url: string | null;
  bag_photo_url: string | null;
  asbestos_detected: boolean | null;
  asbestos_type: string | null;
  lab_notes: string | null;
  created_at: string;
  sub_location: string | null;
  area_m2: number | null;
  materials: string[] | null;
  location_muu: string | null;
  material_muu: string | null;
  sub_location_muu: string | null;
  polyavyys: number | null;
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export function createServerSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
    process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder'
  );
}

/** Extract and verify the Supabase user from a Bearer token in the Authorization header. */
export async function getUserFromRequest(req: import('next/server').NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '');
  if (!token) return null;
  const { data: { user } } = await supabase.auth.getUser(token);
  return user ?? null;
}

/** Returns true if userId is in the admin_users table. */
export async function isAdmin(userId: string): Promise<boolean> {
  const admin = createServerSupabase();
  const { data } = await admin.from('admin_users').select('id').eq('user_id', userId).single();
  return !!data;
}
