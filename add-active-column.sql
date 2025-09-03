-- Add active column to products table
-- This column will control whether products are visible on the website

ALTER TABLE products 
ADD COLUMN active BOOLEAN DEFAULT true;

-- Update existing products to be active by default
UPDATE products 
SET active = true 
WHERE active IS NULL;

-- Add a comment to document the column
COMMENT ON COLUMN products.active IS 'Controls whether the product is visible on the website. Defaults to true.';

-- Create shipping_zones table
CREATE TABLE IF NOT EXISTS shipping_zones (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    center_coordinates JSONB NOT NULL, -- {"lat": 6.5244, "lng": 3.3792} for Lagos
    radius_km DECIMAL(10,2) NOT NULL DEFAULT 50, -- Radius in kilometers
    rates JSONB NOT NULL DEFAULT '{"standard": 0, "express": 0}',
    delivery_times JSONB NOT NULL DEFAULT '{"standard": "", "express": ""}',
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster location searches
CREATE INDEX IF NOT EXISTS idx_shipping_zones_locations ON shipping_zones USING GIN (locations);
CREATE INDEX IF NOT EXISTS idx_shipping_zones_active ON shipping_zones (active);

-- Insert some default shipping zones for Nigeria
INSERT INTO shipping_zones (name, description, center_coordinates, radius_km, rates, delivery_times) VALUES
(
    'Lagos Metro',
    'Lagos and surrounding areas',
    '{"lat": 6.5244, "lng": 3.3792}',
    50.0,
    '{"standard": 1500, "express": 2500}',
    '{"standard": "3-5 business days", "express": "1-2 business days"}'
),
(
    'Abuja Capital',
    'Abuja and surrounding areas',
    '{"lat": 9.0820, "lng": 7.3986}',
    40.0,
    '{"standard": 2000, "express": 3000}',
    '{"standard": "4-6 business days", "express": "2-3 business days"}'
),
(
    'Port Harcourt',
    'Port Harcourt and surrounding areas',
    '{"lat": 4.8156, "lng": 7.0498}',
    35.0,
    '{"standard": 1800, "express": 2800}',
    '{"standard": "4-6 business days", "express": "2-3 business days"}'
),
(
    'Kano Metro',
    'Kano and surrounding areas',
    '{"lat": 11.9914, "lng": 8.5317}',
    45.0,
    '{"standard": 2200, "express": 3200}',
    '{"standard": "5-7 business days", "express": "3-4 business days"}'
),
(
    'Ibadan Metro',
    'Ibadan and surrounding areas',
    '{"lat": 7.3964, "lng": 3.8867}',
    40.0,
    '{"standard": 1700, "express": 2700}',
    '{"standard": "4-6 business days", "express": "2-3 business days"}'
);

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_shipping_zones_updated_at 
    BEFORE UPDATE ON shipping_zones 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
