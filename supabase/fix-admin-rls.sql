-- Allow admins to read/write all survey_samples
CREATE POLICY "Admins see all samples" ON survey_samples FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid())
);

-- Allow authenticated users to read their own admin_users row (needed for admin auth check)
CREATE POLICY "Users read own admin row" ON admin_users FOR SELECT TO authenticated USING (
  user_id = auth.uid()
);
