import { createClient } from '@supabase/supabase-js';

export type Survey = {
  id: string;
  user_id: string;
  name: string;
  city: string;
  date: string;
  status: 'draft' | 'submitted' | 'analyzing' | 'complete';
  created_at: string;
};

export type Sample = {
  id: string;
  survey_id: string;
  sample_code: string;
  location: string;
  material: string;
  description: string | null;
  photo_url: string | null;
  asbestos_detected: boolean | null;
  asbestos_type: string | null;
  lab_notes: string | null;
  created_at: string;
};

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export function createServerSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}
