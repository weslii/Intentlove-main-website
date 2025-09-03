-- Database setup for Intentlove Admin Dashboard
-- Run this in your Supabase SQL editor
-- This script only creates tables that don't exist yet (admin_users, orders, customers)
-- The products table already exists and will not be modified

-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  role TEXT CHECK (role IN ('admin', 'super_admin')) DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on admin_users
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for admin_users
CREATE POLICY "Admin users can view their own profile" ON admin_users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admin users can update their own profile" ON admin_users
  FOR UPDATE USING (auth.uid() = id);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  status TEXT CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')) DEFAULT 'pending',
  payment_status TEXT CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')) DEFAULT 'pending',
  shipping_address TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on orders
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for orders (admin can view all orders)
CREATE POLICY "Admins can view all orders" ON orders
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = auth.uid()
    )
  );

CREATE POLICY "Admins can update orders" ON orders
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = auth.uid()
    )
  );

-- Note: We're not creating a new products table since you already have one
-- The existing products table should have these columns based on your interface:
-- id, name, type, theme, description, image, images, price, originalPrice, isOnSale, isFavorite, size, tags

-- Enable RLS on existing products table (if not already enabled)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for existing products table
CREATE POLICY "Admins can view all products" ON products
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = auth.uid()
    )
  );

CREATE POLICY "Admins can insert products" ON products
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = auth.uid()
    )
  );

CREATE POLICY "Admins can update products" ON products
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = auth.uid()
    )
  );

CREATE POLICY "Admins can delete products" ON products
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = auth.uid()
    )
  );

-- Create customers table
CREATE TABLE IF NOT EXISTS customers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  total_orders INTEGER DEFAULT 0,
  total_spent DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on customers
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for customers
CREATE POLICY "Admins can view all customers" ON customers
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = auth.uid()
    )
  );

CREATE POLICY "Admins can insert customers" ON customers
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = auth.uid()
    )
  );

CREATE POLICY "Admins can update customers" ON customers
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = auth.uid()
    )
  );

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_admin_users_updated_at BEFORE UPDATE ON admin_users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Note: We're not creating triggers for the products table since it already exists
-- If you want to add the updated_at trigger to your existing products table, run this separately:
-- CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
--     FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Sample data for testing (only for new tables)
INSERT INTO customers (email, first_name, last_name, phone, total_orders, total_spent) VALUES
('john.doe@example.com', 'John', 'Doe', '+1234567890', 3, 239.97),
('jane.smith@example.com', 'Jane', 'Smith', '+1234567891', 2, 159.98),
('mike.wilson@example.com', 'Mike', 'Wilson', '+1234567892', 1, 89.99);

INSERT INTO orders (customer_name, customer_email, total_amount, status, payment_status, shipping_address) VALUES
('John Doe', 'john.doe@example.com', 89.99, 'delivered', 'paid', '123 Main St, City, State 12345'),
('Jane Smith', 'jane.smith@example.com', 159.98, 'shipped', 'paid', '456 Oak Ave, City, State 12345'),
('Mike Wilson', 'mike.wilson@example.com', 89.99, 'processing', 'paid', '789 Pine Rd, City, State 12345'); 