-- Fix orders table schema to match frontend expectations
-- Run this in your Supabase SQL editor

-- Add missing columns to orders table
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS items JSONB,
ADD COLUMN IF NOT EXISTS shipping_info JSONB,
ADD COLUMN IF NOT EXISTS subtotal DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS payment_reference TEXT,
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS shipping_status TEXT CHECK (shipping_status IN ('pending', 'shipped', 'delivered')) DEFAULT 'pending';

-- Update existing orders to have default values for new columns
UPDATE orders 
SET 
  items = '[]'::jsonb,
  shipping_info = jsonb_build_object(
    'fullName', customer_name,
    'email', customer_email,
    'address', shipping_address
  ),
  subtotal = total_amount,
  payment_reference = 'legacy_order',
  shipping_status = CASE 
    WHEN status = 'delivered' THEN 'delivered'
    WHEN status = 'shipped' THEN 'shipped'
    ELSE 'pending'
  END
WHERE items IS NULL;

-- Update the status check constraint to include 'completed'
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_status_check;
ALTER TABLE orders ADD CONSTRAINT orders_status_check 
  CHECK (status IN ('pending', 'processing', 'completed', 'shipped', 'delivered', 'cancelled'));

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);

-- Update RLS policies to allow public inserts (for checkout)
DROP POLICY IF EXISTS "Admins can insert orders" ON orders;
CREATE POLICY "Anyone can insert orders" ON orders
  FOR INSERT WITH CHECK (true);

-- Keep existing select and update policies for admins

