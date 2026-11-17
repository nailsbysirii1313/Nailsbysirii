-- =========================================================================
-- Nails by Sirii — Complete Supabase PostgreSQL Schema (Free Tier Database)
-- Copy and paste this directly into your Supabase project's SQL Editor and run.
-- =========================================================================

-- 1. Press-On Nails Products (E-Commerce Boutique)
CREATE TABLE IF NOT EXISTS press_on_products (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  collection TEXT DEFAULT 'Signature',
  shape TEXT NOT NULL DEFAULT 'Almond',
  length TEXT NOT NULL DEFAULT 'Medium',
  base_color TEXT DEFAULT '#FDF2F8',
  finish TEXT DEFAULT 'High-Gloss Glass',
  price NUMERIC NOT NULL DEFAULT 1299,
  stock INTEGER NOT NULL DEFAULT 5,
  is_available BOOLEAN DEFAULT true,
  tag TEXT DEFAULT 'Handcrafted',
  description TEXT,
  included_kit TEXT DEFAULT '10 Handcrafted Nails, Salon Liquid Glue, 24 Jelly Sticky Tabs, Cuticle Pusher, Mini Buffer, 2 Prep Wipes',
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Press-On Nails Customer Orders
CREATE TABLE IF NOT EXISTS press_on_orders (
  id TEXT PRIMARY KEY,
  order_number TEXT UNIQUE NOT NULL,
  product_id TEXT REFERENCES press_on_products(id) ON DELETE SET NULL,
  product_title TEXT NOT NULL,
  shape TEXT NOT NULL,
  length TEXT NOT NULL,
  size TEXT NOT NULL DEFAULT 'M',
  custom_sizes TEXT,
  wear_method TEXT DEFAULT 'Adhesive Jelly Tabs',
  quantity INTEGER DEFAULT 1,
  total_amount NUMERIC NOT NULL DEFAULT 0,
  client_name TEXT NOT NULL,
  client_phone TEXT NOT NULL,
  client_email TEXT,
  client_instagram TEXT,
  address_street TEXT NOT NULL,
  address_city TEXT NOT NULL,
  address_state TEXT NOT NULL,
  address_pincode TEXT NOT NULL,
  payment_status TEXT DEFAULT 'Pending UPI',
  payment_ref TEXT,
  fulfillment_status TEXT DEFAULT 'New Order',
  courier_partner TEXT,
  tracking_number TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Studio Settings
CREATE TABLE IF NOT EXISTS studio_settings (
  id TEXT PRIMARY KEY DEFAULT 'primary',
  studio_name TEXT DEFAULT 'Nails by Sirii',
  tagline TEXT,
  owner_name TEXT DEFAULT 'Simran (Sirii)',
  phone TEXT DEFAULT '+91 73026 23493',
  email TEXT DEFAULT 'hello@nailsbysirii.com',
  address TEXT DEFAULT 'Shop No. 7, Laxmi Navraj Plaza, Garhi Cantt, Dehradun',
  instagram TEXT DEFAULT '@nails.by.sirii',
  currency TEXT DEFAULT '₹',
  upi_id TEXT DEFAULT 'nailsbysirii@okaxis',
  upi_name TEXT DEFAULT 'Nails by Sirii',
  studio_logo_url TEXT DEFAULT '/logo.png',
  ntfy_topic TEXT DEFAULT 'nails-by-sirii-alerts',
  timings TEXT DEFAULT '12:00 PM – 7:00 PM',
  google_rating TEXT DEFAULT '4.9',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Studio Appointments & Client Schedule
CREATE TABLE IF NOT EXISTS studio_appointments (
  id TEXT PRIMARY KEY,
  client_name TEXT NOT NULL,
  client_phone TEXT NOT NULL,
  client_email TEXT,
  client_instagram TEXT,
  service_id TEXT,
  service_name TEXT NOT NULL,
  category TEXT,
  date DATE NOT NULL,
  time TEXT NOT NULL,
  duration INTEGER DEFAULT 60,
  shape TEXT,
  length TEXT,
  notes TEXT,
  status TEXT DEFAULT 'Confirmed',
  price NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Studio Clients & Profiles
CREATE TABLE IF NOT EXISTS studio_clients (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  instagram TEXT,
  address TEXT,
  preferred_shape TEXT,
  notes TEXT,
  total_spend NUMERIC DEFAULT 0,
  visits INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Emergency Repair Tickets
CREATE TABLE IF NOT EXISTS studio_repairs (
  id TEXT PRIMARY KEY,
  client_name TEXT NOT NULL,
  client_phone TEXT NOT NULL,
  hand TEXT,
  finger TEXT,
  service_type TEXT,
  issue TEXT,
  urgency TEXT DEFAULT 'Standard',
  status TEXT DEFAULT 'Pending Squeeze-in',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS) with Public Read / Write policies for client portal
ALTER TABLE press_on_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE press_on_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE studio_appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE studio_repairs ENABLE ROW LEVEL SECURITY;

-- Allow public read of press-on products
CREATE POLICY "Public press-on products viewable" ON press_on_products FOR SELECT USING (true);
CREATE POLICY "Admin manage press-on products" ON press_on_products FOR ALL USING (true);

-- Allow public order submission
CREATE POLICY "Public create press-on orders" ON press_on_orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin manage press-on orders" ON press_on_orders FOR ALL USING (true);

-- Allow public appointment bookings & repairs
CREATE POLICY "Public create appointments" ON studio_appointments FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin manage appointments" ON studio_appointments FOR ALL USING (true);
CREATE POLICY "Public create repairs" ON studio_repairs FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin manage repairs" ON studio_repairs FOR ALL USING (true);
