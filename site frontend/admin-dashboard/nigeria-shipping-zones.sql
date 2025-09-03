-- Nigeria Shipping Zones Setup
-- This script creates comprehensive shipping zones for Nigeria
-- Lagos is divided into multiple zones for better delivery precision
-- Other states are single zones covering the entire state

-- First, let's clear any existing shipping zones (optional - uncomment if needed)
-- DELETE FROM shipping_zones;

-- Lagos Zones (Detailed breakdown)
INSERT INTO shipping_zones (name, description, center_coordinates, radius_km, rates, delivery_times, active) VALUES
-- Lagos Island Zone (Victoria Island, Ikoyi, Lekki Phase 1, etc.)
(
  'Lagos Island',
  'Victoria Island, Ikoyi, Lekki Phase 1, Oniru, Banana Island, and surrounding areas',
  '{"lat": 6.4531, "lng": 3.3958}',
  15,
  '{"standard": 1500, "express": 2500}',
  '{"standard": "2-3 business days", "express": "Same day delivery"}',
  true
),

-- Lagos Mainland Central Zone (Ikeja, Surulere, Yaba, etc.)
(
  'Lagos Mainland Central',
  'Ikeja, Surulere, Yaba, Mushin, Oshodi, and surrounding areas',
  '{"lat": 6.6018, "lng": 3.3515}',
  20,
  '{"standard": 1200, "express": 2000}',
  '{"standard": "2-3 business days", "express": "Same day delivery"}',
  true
),

-- Lagos Mainland West Zone (Alimosho, Agege, Ifako-Ijaiye, etc.)
(
  'Lagos Mainland West',
  'Alimosho, Agege, Ifako-Ijaiye, Ojokoro, and surrounding areas',
  '{"lat": 6.6144, "lng": 3.2547}',
  25,
  '{"standard": 1500, "express": 2500}',
  '{"standard": "2-3 business days", "express": "Next day delivery"}',
  true
),

-- Lagos Mainland East Zone (Somolu, Bariga, Kosofe, etc.)
(
  'Lagos Mainland East',
  'Somolu, Bariga, Kosofe, Oworonsoki, and surrounding areas',
  '{"lat": 6.5448, "lng": 3.3792}',
  20,
  '{"standard": 1300, "express": 2200}',
  '{"standard": "2-3 business days", "express": "Next day delivery"}',
  true
),

-- Lagos Outskirts Zone (Ikorodu, Epe, Badagry, etc.)
(
  'Lagos Outskirts',
  'Ikorodu, Epe, Badagry, Ojo, and other outskirts areas',
  '{"lat": 6.6144, "lng": 3.2547}',
  40,
  '{"standard": 2000, "express": 3500}',
  '{"standard": "3-4 business days", "express": "2-3 business days"}',
  true
);

-- Other Nigerian States (Single zones per state)
INSERT INTO shipping_zones (name, description, center_coordinates, radius_km, rates, delivery_times, active) VALUES
-- South West States
(
  'Ogun State',
  'Entire Ogun State including Abeokuta, Sagamu, Ijebu-Ode, etc.',
  '{"lat": 7.1557, "lng": 3.3451}',
  100,
  '{"standard": 2500, "express": 4000}',
  '{"standard": "3-4 business days", "express": "2-3 business days"}',
  true
),

(
  'Oyo State',
  'Entire Oyo State including Ibadan, Ogbomoso, Oyo, etc.',
  '{"lat": 7.3961, "lng": 3.8967}',
  120,
  '{"standard": 3000, "express": 5000}',
  '{"standard": "3-5 business days", "express": "2-3 business days"}',
  true
),

(
  'Osun State',
  'Entire Osun State including Osogbo, Ile-Ife, Ilesha, etc.',
  '{"lat": 7.7669, "lng": 4.5601}',
  80,
  '{"standard": 2800, "express": 4500}',
  '{"standard": "3-4 business days", "express": "2-3 business days"}',
  true
),

(
  'Ondo State',
  'Entire Ondo State including Akure, Ondo, Okitipupa, etc.',
  '{"lat": 7.2526, "lng": 5.1933}',
  90,
  '{"standard": 3200, "express": 5200}',
  '{"standard": "3-5 business days", "express": "2-3 business days"}',
  true
),

(
  'Ekiti State',
  'Entire Ekiti State including Ado-Ekiti, Ikere-Ekiti, etc.',
  '{"lat": 7.6233, "lng": 5.2209}',
  70,
  '{"standard": 3000, "express": 4800}',
  '{"standard": "3-4 business days", "express": "2-3 business days"}',
  true
),

-- South East States
(
  'Anambra State',
  'Entire Anambra State including Awka, Onitsha, Nnewi, etc.',
  '{"lat": 6.2104, "lng": 7.0724}',
  80,
  '{"standard": 3500, "express": 5800}',
  '{"standard": "4-5 business days", "express": "3-4 business days"}',
  true
),

(
  'Enugu State',
  'Entire Enugu State including Enugu, Nsukka, etc.',
  '{"lat": 6.4584, "lng": 7.5464}',
  90,
  '{"standard": 3800, "express": 6200}',
  '{"standard": "4-5 business days", "express": "3-4 business days"}',
  true
),

(
  'Imo State',
  'Entire Imo State including Owerri, Orlu, Okigwe, etc.',
  '{"lat": 5.4836, "lng": 7.0333}',
  70,
  '{"standard": 3600, "express": 5900}',
  '{"standard": "4-5 business days", "express": "3-4 business days"}',
  true
),

(
  'Abia State',
  'Entire Abia State including Umuahia, Aba, etc.',
  '{"lat": 5.5320, "lng": 7.4860}',
  80,
  '{"standard": 3700, "express": 6100}',
  '{"standard": "4-5 business days", "express": "3-4 business days"}',
  true
),

(
  'Ebonyi State',
  'Entire Ebonyi State including Abakaliki, Afikpo, etc.',
  '{"lat": 6.3239, "lng": 8.1134}',
  70,
  '{"standard": 4000, "express": 6500}',
  '{"standard": "4-6 business days", "express": "3-4 business days"}',
  true
),

-- South South States
(
  'Rivers State',
  'Entire Rivers State including Port Harcourt, Obio-Akpor, etc.',
  '{"lat": 4.8156, "lng": 7.0498}',
  90,
  '{"standard": 4200, "express": 6800}',
  '{"standard": "4-6 business days", "express": "3-4 business days"}',
  true
),

(
  'Delta State',
  'Entire Delta State including Asaba, Warri, Sapele, etc.',
  '{"lat": 5.5560, "lng": 5.8814}',
  100,
  '{"standard": 3800, "express": 6200}',
  '{"standard": "4-5 business days", "express": "3-4 business days"}',
  true
),

(
  'Edo State',
  'Entire Edo State including Benin City, Auchi, etc.',
  '{"lat": 6.3176, "lng": 5.6145}',
  90,
  '{"standard": 3500, "express": 5800}',
  '{"standard": "4-5 business days", "express": "3-4 business days"}',
  true
),

(
  'Cross River State',
  'Entire Cross River State including Calabar, Uyo, etc.',
  '{"lat": 4.9757, "lng": 8.3417}',
  120,
  '{"standard": 4500, "express": 7200}',
  '{"standard": "5-6 business days", "express": "4-5 business days"}',
  true
),

(
  'Akwa Ibom State',
  'Entire Akwa Ibom State including Uyo, Eket, etc.',
  '{"lat": 5.0377, "lng": 7.9129}',
  100,
  '{"standard": 4300, "express": 7000}',
  '{"standard": "4-6 business days", "express": "3-4 business days"}',
  true
),

(
  'Bayelsa State',
  'Entire Bayelsa State including Yenagoa, etc.',
  '{"lat": 4.9267, "lng": 6.2676}',
  80,
  '{"standard": 4400, "express": 7100}',
  '{"standard": "4-6 business days", "express": "3-4 business days"}',
  true
),

-- North Central States
(
  'Federal Capital Territory (Abuja)',
  'Entire FCT including Abuja, Gwagwalada, etc.',
  '{"lat": 9.0820, "lng": 7.3986}',
  80,
  '{"standard": 3500, "express": 5800}',
  '{"standard": "3-4 business days", "express": "2-3 business days"}',
  true
),

(
  'Nasarawa State',
  'Entire Nasarawa State including Lafia, Keffi, etc.',
  '{"lat": 8.4991, "lng": 8.5227}',
  90,
  '{"standard": 3800, "express": 6200}',
  '{"standard": "4-5 business days", "express": "3-4 business days"}',
  true
),

(
  'Kogi State',
  'Entire Kogi State including Lokoja, Okene, etc.',
  '{"lat": 7.8023, "lng": 6.7333}',
  100,
  '{"standard": 3200, "express": 5200}',
  '{"standard": "3-4 business days", "express": "2-3 business days"}',
  true
),

(
  'Kwara State',
  'Entire Kwara State including Ilorin, Offa, etc.',
  '{"lat": 8.5000, "lng": 4.5500}',
  100,
  '{"standard": 3000, "express": 5000}',
  '{"standard": "3-4 business days", "express": "2-3 business days"}',
  true
),

(
  'Plateau State',
  'Entire Plateau State including Jos, Pankshin, etc.',
  '{"lat": 9.8965, "lng": 8.8583}',
  120,
  '{"standard": 4200, "express": 6800}',
  '{"standard": "4-6 business days", "express": "3-4 business days"}',
  true
),

(
  'Niger State',
  'Entire Niger State including Minna, Bida, etc.',
  '{"lat": 9.5833, "lng": 6.5500}',
  150,
  '{"standard": 4000, "express": 6500}',
  '{"standard": "4-6 business days", "express": "3-4 business days"}',
  true
),

(
  'Benue State',
  'Entire Benue State including Makurdi, Gboko, etc.',
  '{"lat": 7.7325, "lng": 8.5391}',
  120,
  '{"standard": 3800, "express": 6200}',
  '{"standard": "4-5 business days", "express": "3-4 business days"}',
  true
),

-- North West States
(
  'Kaduna State',
  'Entire Kaduna State including Kaduna, Zaria, etc.',
  '{"lat": 10.5222, "lng": 7.4384}',
  120,
  '{"standard": 4200, "express": 6800}',
  '{"standard": "4-6 business days", "express": "3-4 business days"}',
  true
),

(
  'Kano State',
  'Entire Kano State including Kano, etc.',
  '{"lat": 11.9914, "lng": 8.5317}',
  130,
  '{"standard": 4500, "express": 7200}',
  '{"standard": "5-6 business days", "express": "4-5 business days"}',
  true
),

(
  'Katsina State',
  'Entire Katsina State including Katsina, Daura, etc.',
  '{"lat": 12.9914, "lng": 7.6011}',
  140,
  '{"standard": 4800, "express": 7500}',
  '{"standard": "5-7 business days", "express": "4-5 business days"}',
  true
),

(
  'Jigawa State',
  'Entire Jigawa State including Dutse, Hadejia, etc.',
  '{"lat": 12.7500, "lng": 9.9667}',
  120,
  '{"standard": 4700, "express": 7400}',
  '{"standard": "5-6 business days", "express": "4-5 business days"}',
  true
),

(
  'Sokoto State',
  'Entire Sokoto State including Sokoto, etc.',
  '{"lat": 13.0669, "lng": 5.2333}',
  150,
  '{"standard": 5200, "express": 8000}',
  '{"standard": "6-7 business days", "express": "5-6 business days"}',
  true
),

(
  'Kebbi State',
  'Entire Kebbi State including Birnin Kebbi, etc.',
  '{"lat": 12.4500, "lng": 4.2000}',
  130,
  '{"standard": 5000, "express": 7800}',
  '{"standard": "5-7 business days", "express": "4-5 business days"}',
  true
),

(
  'Zamfara State',
  'Entire Zamfara State including Gusau, etc.',
  '{"lat": 12.1667, "lng": 6.6667}',
  120,
  '{"standard": 4900, "express": 7600}',
  '{"standard": "5-6 business days", "express": "4-5 business days"}',
  true
),

-- North East States
(
  'Borno State',
  'Entire Borno State including Maiduguri, etc.',
  '{"lat": 11.8333, "lng": 13.1500}',
  160,
  '{"standard": 5500, "express": 8500}',
  '{"standard": "6-8 business days", "express": "5-6 business days"}',
  true
),

(
  'Yobe State',
  'Entire Yobe State including Damaturu, Potiskum, etc.',
  '{"lat": 11.7483, "lng": 11.9669}',
  140,
  '{"standard": 5300, "express": 8200}',
  '{"standard": "6-7 business days", "express": "5-6 business days"}',
  true
),

(
  'Adamawa State',
  'Entire Adamawa State including Yola, etc.',
  '{"lat": 9.2035, "lng": 12.4954}',
  150,
  '{"standard": 5000, "express": 7800}',
  '{"standard": "5-7 business days", "express": "4-5 business days"}',
  true
),

(
  'Taraba State',
  'Entire Taraba State including Jalingo, etc.',
  '{"lat": 8.9000, "lng": 11.3667}',
  130,
  '{"standard": 4800, "express": 7500}',
  '{"standard": "5-6 business days", "express": "4-5 business days"}',
  true
),

(
  'Gombe State',
  'Entire Gombe State including Gombe, etc.',
  '{"lat": 10.2897, "lng": 11.1673}',
  100,
  '{"standard": 4600, "express": 7300}',
  '{"standard": "5-6 business days", "express": "4-5 business days"}',
  true
),

(
  'Bauchi State',
  'Entire Bauchi State including Bauchi, etc.',
  '{"lat": 10.3158, "lng": 9.8442}',
  120,
  '{"standard": 4400, "express": 7100}',
  '{"standard": "5-6 business days", "express": "4-5 business days"}',
  true
);

-- Create an index for better performance (if not already exists)
CREATE INDEX IF NOT EXISTS idx_shipping_zones_active ON shipping_zones(active);
CREATE INDEX IF NOT EXISTS idx_shipping_zones_name ON shipping_zones(name);

-- Add comments for documentation
COMMENT ON TABLE shipping_zones IS 'Shipping zones for Nigeria with detailed Lagos zones and state-wide zones for other states';
COMMENT ON COLUMN shipping_zones.center_coordinates IS 'JSON object with lat and lng coordinates for zone center';
COMMENT ON COLUMN shipping_zones.radius_km IS 'Radius in kilometers from center point';
COMMENT ON COLUMN shipping_zones.rates IS 'JSON object with standard and express shipping rates in Naira';
COMMENT ON COLUMN shipping_zones.delivery_times IS 'JSON object with standard and express delivery time estimates';
