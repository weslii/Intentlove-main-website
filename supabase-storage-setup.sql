-- =====================================================
-- Supabase Storage Setup for Product Media
-- =====================================================
-- Run this script in your Supabase SQL Editor
-- Project: htnxqfnzirxxvuepdaof

-- =====================================================
-- 1. CREATE STORAGE BUCKET
-- =====================================================

-- Create the product-media bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'product-media',
  'product-media',
  true, -- Public bucket (files can be accessed without authentication)
  10485760, -- 10MB file size limit
  ARRAY['image/*', 'video/*'] -- Allow images and videos
);

-- =====================================================
-- 2. CREATE STORAGE POLICIES
-- =====================================================

-- Policy 1: Allow public downloads (for displaying images/videos on website)
CREATE POLICY "Allow public downloads" ON storage.objects
FOR SELECT USING (bucket_id = 'product-media');

-- Policy 2: Allow authenticated users to upload files
CREATE POLICY "Allow authenticated uploads" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'product-media' AND 
  auth.role() = 'authenticated'
);

-- Policy 3: Allow authenticated users to update their uploads
CREATE POLICY "Allow authenticated updates" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'product-media' AND 
  auth.role() = 'authenticated'
);

-- Policy 4: Allow authenticated users to delete files
CREATE POLICY "Allow authenticated deletes" ON storage.objects
FOR DELETE USING (
  bucket_id = 'product-media' AND 
  auth.role() = 'authenticated'
);

-- =====================================================
-- 3. VERIFICATION QUERIES
-- =====================================================

-- Check if bucket was created successfully
SELECT * FROM storage.buckets WHERE id = 'product-media';

-- Check if policies were created successfully
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'objects' 
AND schemaname = 'storage'
ORDER BY policyname;

-- =====================================================
-- 4. OPTIONAL: CREATE ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS on storage.objects (if not already enabled)
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 5. USAGE NOTES
-- =====================================================
/*
After running this script:

1. Your storage bucket 'product-media' will be created
2. Files can be uploaded via the admin dashboard
3. Files can be accessed publicly (for website display)
4. File size limit is 10MB
5. Only images and videos are allowed

To test the setup:
1. Go to Storage in your Supabase dashboard
2. You should see the 'product-media' bucket
3. Try uploading a test image/video
4. Check that the file URL is publicly accessible

The admin dashboard will now be able to:
- Upload product images and videos
- Store them securely in Supabase
- Display them on your main website
- Delete them when needed
*/
