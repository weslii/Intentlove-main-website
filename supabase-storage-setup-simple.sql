-- =====================================================
-- Simplified Supabase Storage Setup
-- =====================================================
-- This script only creates the bucket
-- Policies should be set up manually in the dashboard

-- Create the product-media bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'product-media',
  'product-media',
  true, -- Public bucket (files can be accessed without authentication)
  10485760, -- 10MB file size limit
  ARRAY['image/*', 'video/*'] -- Allow images and videos
);

-- Verify bucket was created
SELECT * FROM storage.buckets WHERE id = 'product-media';

-- =====================================================
-- NEXT STEPS (Manual in Dashboard):
-- =====================================================
/*
1. Go to Storage in your Supabase dashboard
2. Click on the 'product-media' bucket
3. Go to "Policies" tab
4. Add these policies manually:

Policy 1: "Allow public downloads"
- Operation: SELECT
- Definition: true

Policy 2: "Allow authenticated uploads"  
- Operation: INSERT
- Definition: auth.role() = 'authenticated'

Policy 3: "Allow authenticated deletes"
- Operation: DELETE  
- Definition: auth.role() = 'authenticated'
*/
