-- Surveys table
CREATE TABLE surveys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  name text NOT NULL,
  city text NOT NULL,
  date date NOT NULL,
  status text NOT NULL DEFAULT 'draft', -- draft, submitted, analyzing, complete
  created_at timestamptz DEFAULT now()
);

-- Samples table
CREATE TABLE samples (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  survey_id uuid REFERENCES surveys(id) ON DELETE CASCADE,
  sample_code text, -- e.g. N-001
  location text NOT NULL, -- Keittiö, WC, etc.
  material text NOT NULL, -- Laatta, Liima, etc.
  description text,
  photo_url text,
  asbestos_detected boolean,
  asbestos_type text,
  lab_notes text,
  created_at timestamptz DEFAULT now()
);

-- Admin users table
CREATE TABLE admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) UNIQUE,
  created_at timestamptz DEFAULT now()
);

-- Row level security
ALTER TABLE surveys ENABLE ROW LEVEL SECURITY;
ALTER TABLE samples ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users see own surveys" ON surveys FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users see own samples" ON samples FOR ALL USING (
  survey_id IN (SELECT id FROM surveys WHERE user_id = auth.uid())
);
CREATE POLICY "Admins see all" ON surveys FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid())
);
