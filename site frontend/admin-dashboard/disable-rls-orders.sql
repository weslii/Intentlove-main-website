-- Fallback: Disable RLS on orders table completely
-- Use this ONLY if the fix-rls-policies.sql doesn't work
-- Run this in your Supabase SQL editor

-- Check current RLS status
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'orders';

-- Disable RLS completely on orders table
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;

-- Drop all policies (they won't be needed)
DROP POLICY IF EXISTS "Admins can insert orders" ON orders;
DROP POLICY IF EXISTS "Anyone can insert orders" ON orders;
DROP POLICY IF EXISTS "Allow public order creation" ON orders;
DROP POLICY IF EXISTS "Admins can view all orders" ON orders;
DROP POLICY IF EXISTS "Admins can update orders" ON orders;
DROP POLICY IF EXISTS "Users can view their own orders" ON orders;
DROP POLICY IF EXISTS "Allow all operations on orders" ON orders;

-- Verify RLS is disabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'orders';

-- Test insert (this will be rolled back)
BEGIN;
INSERT INTO orders (customer_name, customer_email, total_amount, shipping_address, items, shipping_info, subtotal, payment_reference, status) 
VALUES ('test', 'test@test.com', 0, 'test', '[]'::jsonb, '{}'::jsonb, 0, 'test', 'pending');
ROLLBACK;

-- Note: This approach removes all security restrictions on the orders table
-- Only use this if you're okay with public access to orders data
-- You can re-enable RLS later with proper policies once the basic functionality works

