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
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false }
});

async function seed() {
  console.log('[Supabase] Connecting at:', supabaseUrl);
  const dbPath = path.join(__dirname, '..', 'data', 'db.json');
  if (!fs.existsSync(dbPath)) {
    console.error('[Error] data/db.json not found!');
    process.exit(1);
  }

  const localDb = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

  // 1. Seed Studio Settings
  if (localDb.settings) {
    console.log('[Settings] Seeding Studio Settings...');
    const s = localDb.settings;
    const settingsRecord = {
      id: 'primary',
      studio_name: s.studioName || 'Nails by Sirii',
      tagline: s.tagline || 'Affordable Nail Studio & Academy in Dehradun',
      owner_name: s.ownerName || 'Simran (Sirii)',
      phone: s.phone || '+91 73026 23493',
      email: s.email || 'hello@nailsbysirii.com',
      address: s.address || 'Shop No. 7, Laxmi Navraj Plaza, Garhi Cantt, Dehradun',
      instagram: s.instagram || '@nails.by.sirii',
      currency: s.currency || '₹',
      upi_id: s.upiId || 'nailsbysirii@okaxis',
      upi_name: s.upiName || 'Nails by Sirii',
      studio_logo_url: s.studioLogoUrl || '/logo.png',
      ntfy_topic: s.ntfyTopic || 'nails-by-sirii-alerts',
      timings: s.timings || '12:00 PM – 7:00 PM',
      google_rating: String(s.googleRating || '4.9')
    };

    const { error: sErr } = await supabase.from('studio_settings').upsert(settingsRecord, { onConflict: 'id' });
    if (sErr) console.warn('[Warning] studio_settings upsert:', sErr.message);
    else console.log('[Success] Studio settings seeded successfully!');
  }

  // 2. Seed Clients
  if (localDb.clients && localDb.clients.length > 0) {
    console.log(`[Clients] Seeding ${localDb.clients.length} Clients...`);
    const records = localDb.clients.map(c => ({
      id: c.id,
      name: c.name,
      phone: c.phone,
      email: c.email || null,
      instagram: c.instagram || null,
      address: c.address || null,
      preferred_shape: c.preferredShape || null,
      notes: c.notes || null,
      total_spend: Number(c.totalSpent || 0),
      visits: Number(c.totalVisits || 0),
      created_at: c.createdAt || new Date().toISOString(),
      updated_at: c.updatedAt || new Date().toISOString()
    }));

    const { error: cErr } = await supabase.from('studio_clients').upsert(records, { onConflict: 'id' });
    if (cErr) console.warn('[Warning] studio_clients upsert:', cErr.message);
    else console.log('[Success] Studio clients seeded successfully!');
  }

  // 3. Seed Appointments
  if (localDb.appointments && localDb.appointments.length > 0) {
    console.log(`[Appointments] Seeding ${localDb.appointments.length} Appointments...`);
    const records = localDb.appointments.map(a => ({
      id: a.id,
      client_name: a.clientName,
      client_phone: a.clientPhone,
      client_email: a.clientEmail || null,
      client_instagram: a.clientInstagram || null,
      service_id: a.serviceId || null,
      service_name: a.serviceName || 'Custom Nail Service',
      category: a.category || null,
      date: a.date,
      time: a.time,
      duration: Number(a.duration || 60),
      shape: a.shape || null,
      length: a.length || null,
      notes: a.notes || null,
      status: a.status || 'Confirmed',
      price: Number(a.price || 0),
      created_at: a.createdAt || new Date().toISOString(),
      updated_at: a.updatedAt || new Date().toISOString()
    }));

    const { error: aErr } = await supabase.from('studio_appointments').upsert(records, { onConflict: 'id' });
    if (aErr) console.warn('[Warning] studio_appointments upsert:', aErr.message);
    else console.log('[Success] Studio appointments seeded successfully!');
  }

  // 4. Seed Repairs
  if (localDb.repairs && localDb.repairs.length > 0) {
    console.log(`[Repairs] Seeding ${localDb.repairs.length} Repair Tickets...`);
    const records = localDb.repairs.map(r => ({
      id: r.id,
      client_name: r.clientName,
      client_phone: r.clientPhone,
      hand: r.hand || null,
      finger: r.finger || null,
      service_type: r.serviceType || null,
      issue: r.issue || null,
      urgency: r.urgency || 'Standard',
      status: r.status || 'Pending Squeeze-in',
      created_at: r.createdAt || new Date().toISOString()
    }));

    const { error: rErr } = await supabase.from('studio_repairs').upsert(records, { onConflict: 'id' });
    if (rErr) console.warn('[Warning] studio_repairs upsert:', rErr.message);
    else console.log('[Success] Studio repairs seeded successfully!');
  }

  // 5. Seed Press-On Products
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

    const { error: pErr } = await supabase.from('press_on_products').upsert(records, { onConflict: 'id' });
    if (pErr) console.warn('[Warning] press_on_products upsert:', pErr.message);
    else console.log('[Success] Press-on products seeded successfully!');
  }

  // 6. Seed Press-On Orders
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

    const { error: oErr } = await supabase.from('press_on_orders').upsert(records, { onConflict: 'id' });
    if (oErr) console.warn('[Warning] press_on_orders upsert:', oErr.message);
    else console.log('[Success] Press-on orders seeded successfully!');
  }

  console.log('\n[Complete] All 6 Supabase Tables Seeded & Synced Successfully!\n');
}

seed().catch(err => {
  console.error('[Error] Seeding failed:', err);
  process.exit(1);
});
