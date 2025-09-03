-- Test order insertion with all required fields
-- Run this in your Supabase SQL editor to verify the schema works

-- Test insert with all required fields
INSERT INTO orders (
  customer_name,
  customer_email,
  total_amount,
  shipping_address,
  items,
  shipping_info,
  subtotal,
  payment_reference,
  status
) VALUES (
  'John Doe',
  'john@example.com',
  150.00,
  '123 Main St, Lagos, Lagos State',
  '[{"name": "Test Product", "price": 150, "quantity": 1}]'::jsonb,
  '{"fullName": "John Doe", "email": "john@example.com", "phone": "1234567890", "address": "123 Main St", "city": "Lagos", "state": "Lagos State"}'::jsonb,
  150.00,
  'test-ref-123',
  'pending'
);

-- Check if the order was created
SELECT id, customer_name, customer_email, total_amount, status, created_at 
FROM orders 
WHERE payment_reference = 'test-ref-123';

-- Clean up test data
DELETE FROM orders WHERE payment_reference = 'test-ref-123';

