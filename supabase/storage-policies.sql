-- Run this in Supabase Dashboard → SQL Editor to fix "Upload denied by storage policy"
-- Make sure the bucket "resumes" exists (Storage → New bucket → name: resumes, Private).

-- Remove existing policies we're about to recreate (avoid "policy already exists")
DROP POLICY IF EXISTS "resumes_upload" ON storage.objects;
DROP POLICY IF EXISTS "resumes_select" ON storage.objects;
DROP POLICY IF EXISTS "resumes_delete" ON storage.objects;

-- Allow uploads only when the object path starts with the user's ID (e.g. "uuid-here/123-resume.pdf")
CREATE POLICY "resumes_upload"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'resumes'
    AND name LIKE (auth.uid()::text || '/%')
  );

CREATE POLICY "resumes_select"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'resumes'
    AND name LIKE (auth.uid()::text || '/%')
  );

CREATE POLICY "resumes_delete"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'resumes'
    AND name LIKE (auth.uid()::text || '/%')
  );
