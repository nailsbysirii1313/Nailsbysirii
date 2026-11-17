import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rawSupabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const supabaseUrl = rawSupabaseUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/$/, '');
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('\n[Error] SUPABASE_URL and SUPABASE_ANON_KEY (or SERVICE_ROLE_KEY) are missing in .env');
  console.log('To link your free Supabase database:');
  console.log('1. Go to https://supabase.com and create a free project.');
  console.log('2. In Project Settings > API, copy Project URL and anon public / service_role API key.');
  console.log('3. Add them to your .env file:');
  console.log('   SUPABASE_URL=https://your-project.supabase.co');
  console.log('   SUPABASE_ANON_KEY=your-anon-key\n');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  console.log('[Supabase] Connecting at:', supabaseUrl);
  const dbPath = path.join(__dirname, '..', 'data', 'db.json');
  if (!fs.existsSync(dbPath)) {
    console.error('[Error] data/db.json not found!');
    process.exit(1);
  }

  const localDb = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

  // 1. Seed Press-On Products
  if (localDb.pressOnProducts && localDb.pressOnProducts.length > 0) {
    console.log(`[Press-Ons] Seeding ${localDb.pressOnProducts.length} Press-On Products...`);
    const records = localDb.pressOnProducts.map(p => ({
      id: p.id,
      title: p.title,
      collection: p.collection || 'Signature',
      shape: p.shape,
      length: p.length,
      base_color: p.baseColor,
      finish: p.finish,
      price: p.price,
      stock: p.stock,
      is_available: p.isAvailable,
      tag: p.tag,
      description: p.description,
      included_kit: p.includedKit
    }));

    const { error } = await supabase.from('press_on_products').upsert(records, { onConflict: 'id' });
    if (error) {
      console.warn('[Warning] press_on_products upsert:', error.message);
    } else {
      console.log('[Success] Press-on products seeded successfully!');
    }
  }

  // 2. Seed Press-On Orders
  if (localDb.pressOnOrders && localDb.pressOnOrders.length > 0) {
    console.log(`[Press-Ons] Seeding ${localDb.pressOnOrders.length} Press-On Orders...`);
    const records = localDb.pressOnOrders.map(o => ({
      id: o.id,
      order_number: o.orderNumber,
      product_id: o.productId,
      product_title: o.productTitle,
      shape: o.shape,
      length: o.length,
      size: o.size,
      custom_sizes: o.customSizes ? JSON.stringify(o.customSizes) : null,
      wear_method: o.wearMethod,
      quantity: o.quantity,
      total_amount: o.totalAmount,
      client_name: o.clientName,
      client_phone: o.clientPhone,
      client_email: o.clientEmail,
      client_instagram: o.clientInstagram,
      address_street: o.addressStreet,
      address_city: o.addressCity,
      address_state: o.addressState,
      address_pincode: o.addressPincode,
      payment_status: o.paymentStatus,
      payment_ref: o.paymentRef,
      fulfillment_status: o.fulfillmentStatus,
      courier_partner: o.courierPartner,
      tracking_number: o.trackingNumber,
      notes: o.notes
    }));

    const { error } = await supabase.from('press_on_orders').upsert(records, { onConflict: 'id' });
    if (error) {
      console.warn('[Warning] press_on_orders upsert:', error.message);
    } else {
      console.log('[Success] Press-on orders seeded successfully!');
    }
  }

  console.log('\n[Complete] Supabase Database Sync Complete!\n');
}

seed().catch(err => {
  console.error('[Error] Seeding failed:', err);
  process.exit(1);
});
