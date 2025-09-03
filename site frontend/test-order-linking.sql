-- Test Order Linking Functionality
-- This script tests that orders can be properly linked to user accounts

-- 1. First, let's check the current orders table structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'orders' 
ORDER BY ordinal_position;

-- 2. Test creating an order without a user_id (guest checkout)
INSERT INTO orders (
  items,
  shipping_info,
  subtotal,
  payment_reference,
  user_id,
  status,
  customer_name,
  customer_email,
  shipping_address,
  total_amount
) VALUES (
  '[{"productId": "test-product-1", "quantity": 2, "price": 1500}]'::jsonb,
  '{"fullName": "John Doe", "email": "john@example.com", "phone": "1234567890", "address": "123 Main St", "city": "Lagos", "state": "Lagos"}'::jsonb,
  3000.00,
  'test-ref-001',
  NULL, -- No user_id for guest checkout
  'pending',
  'John Doe',
  'john@example.com',
  '123 Main St, Lagos, Lagos',
  3000.00
);

-- 3. Test creating another order with the same email but no user_id
INSERT INTO orders (
  items,
  shipping_info,
  subtotal,
  payment_reference,
  user_id,
  status,
  customer_name,
  customer_email,
  shipping_address,
  total_amount
) VALUES (
  '[{"productId": "test-product-2", "quantity": 1, "price": 2000}]'::jsonb,
  '{"fullName": "John Doe", "email": "john@example.com", "phone": "1234567890", "address": "123 Main St", "city": "Lagos", "state": "Lagos"}'::jsonb,
  2000.00,
  'test-ref-002',
  NULL, -- No user_id for guest checkout
  'pending',
  'John Doe',
  'john@example.com',
  '123 Main St, Lagos, Lagos',
  2000.00
);

-- 4. Check that we have orders without user_id
SELECT id, customer_email, user_id, payment_reference 
FROM orders 
WHERE customer_email = 'john@example.com' AND user_id IS NULL;

-- 5. Simulate linking orders to a user (this would be done by the linkOrdersToUser function)
-- First, let's create a test user_id (in real scenario, this would be from auth.users)
UPDATE orders 
SET user_id = '550e8400-e29b-41d4-a716-446655440000'::uuid
WHERE customer_email = 'john@example.com' AND user_id IS NULL;

-- 6. Verify the linking worked
SELECT id, customer_email, user_id, payment_reference 
FROM orders 
WHERE customer_email = 'john@example.com';

-- 7. Test getting orders for a specific user (this would be done by getUserOrders function)
SELECT * FROM orders 
WHERE user_id = '550e8400-e29b-41d4-a716-446655440000'::uuid
ORDER BY created_at DESC;

-- 8. Clean up test data
DELETE FROM orders WHERE customer_email = 'john@example.com';

-- 9. Verify the orders table has the correct structure for our functionality
SELECT 
  'user_id column exists' as check_name,
  CASE WHEN EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'orders' AND column_name = 'user_id'
  ) THEN 'PASS' ELSE 'FAIL' END as result
UNION ALL
SELECT 
  'customer_email column exists',
  CASE WHEN EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'orders' AND column_name = 'customer_email'
  ) THEN 'PASS' ELSE 'FAIL' END
UNION ALL
SELECT 
  'user_id allows NULL values',
  CASE WHEN is_nullable = 'YES' THEN 'PASS' ELSE 'FAIL' END
FROM information_schema.columns 
WHERE table_name = 'orders' AND column_name = 'user_id';
