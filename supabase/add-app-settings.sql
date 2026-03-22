CREATE TABLE IF NOT EXISTS app_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  logo_url text,
  company_name text DEFAULT 'Yritys',
  kartoittaja_name text DEFAULT 'Kartoittaja',
  kartoittaja_title text DEFAULT 'Asbestikartoittaja',
  kartoittaja_credentials text DEFAULT '',
  signature_url text,
  updated_at timestamptz DEFAULT now()
);

-- Storage bucket for admin assets
INSERT INTO app_settings (id) VALUES ('00000000-0000-0000-0000-000000000001') ON CONFLICT DO NOTHING;
