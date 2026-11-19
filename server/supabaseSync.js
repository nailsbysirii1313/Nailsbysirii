import { supabase, isSupabaseConfigured } from './supabase.js';

// Mappers between JS camelCase application objects and Supabase snake_case tables

export function clientToRow(c) {
  return {
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
  };
}

export function rowToClient(r) {
  return {
    id: r.id,
    name: r.name,
    phone: r.phone,
    email: r.email || '',
    instagram: r.instagram || '',
    address: r.address || '',
    preferredShape: r.preferred_shape || '',
    notes: r.notes || '',
    totalSpent: Number(r.total_spend || 0),
    totalVisits: Number(r.visits || 0),
    createdAt: r.created_at,
    updatedAt: r.updated_at
  };
}

export function aptToRow(a) {
  return {
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
  };
}

export function rowToApt(r) {
  return {
    id: r.id,
    clientName: r.client_name,
    clientPhone: r.client_phone,
    clientEmail: r.client_email || '',
    clientInstagram: r.client_instagram || '',
    serviceId: r.service_id || '',
    serviceName: r.service_name || '',
    category: r.category || '',
    date: r.date,
    time: r.time,
    duration: Number(r.duration || 60),
    shape: r.shape || '',
    length: r.length || '',
    notes: r.notes || '',
    status: r.status || 'Confirmed',
    price: Number(r.price || 0),
    createdAt: r.created_at,
    updatedAt: r.updated_at
  };
}

export function repairToRow(r) {
  return {
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
  };
}

export function rowToRepair(r) {
  return {
    id: r.id,
    clientName: r.client_name,
    clientPhone: r.client_phone,
    hand: r.hand || '',
    finger: r.finger || '',
    serviceType: r.service_type || '',
    issue: r.issue || '',
    urgency: r.urgency || 'Standard',
    status: r.status || 'Pending Squeeze-in',
    createdAt: r.created_at,
    updatedAt: r.created_at
  };
}

export function pressOnProdToRow(p) {
  return {
    id: p.id,
    title: p.title,
    collection: p.collection || 'Signature',
    shape: p.shape,
    length: p.length,
    base_color: p.baseColor,
    finish: p.finish,
    price: Number(p.price || 0),
    stock: Number(p.stock !== undefined ? p.stock : 5),
    is_available: Boolean(p.isAvailable),
    tag: p.tag || 'Handcrafted',
    description: p.description || '',
    included_kit: p.includedKit || '',
    image_url: p.imageUrl || null
  };
}

export function rowToPressOnProd(r) {
  return {
    id: r.id,
    title: r.title,
    collection: r.collection || 'Signature',
    shape: r.shape,
    length: r.length,
    baseColor: r.base_color,
    finish: r.finish,
    price: Number(r.price),
    stock: Number(r.stock),
    isAvailable: Boolean(r.is_available),
    tag: r.tag,
    description: r.description,
    includedKit: r.included_kit,
    imageUrl: r.image_url
  };
}

export function pressOnOrderToRow(o) {
  return {
    id: o.id,
    order_number: o.orderNumber,
    product_id: o.productId || null,
    product_title: o.productTitle || '',
    shape: o.shape || '',
    length: o.length || '',
    size: o.size || 'M',
    custom_sizes: o.customSizes ? (typeof o.customSizes === 'string' ? o.customSizes : JSON.stringify(o.customSizes)) : null,
    wear_method: o.wearMethod || 'Adhesive Jelly Tabs',
    quantity: Number(o.quantity || 1),
    total_amount: Number(o.totalAmount || 0),
    client_name: o.clientName || '',
    client_phone: o.clientPhone || '',
    client_email: o.clientEmail || null,
    client_instagram: o.clientInstagram || null,
    address_street: o.addressStreet || '',
    address_city: o.addressCity || '',
    address_state: o.addressState || '',
    address_pincode: o.addressPincode || '',
    payment_status: o.paymentStatus || 'Pending UPI',
    payment_ref: o.paymentRef || null,
    fulfillment_status: o.fulfillmentStatus || 'New Order',
    courier_partner: o.courierPartner || null,
    tracking_number: o.trackingNumber || null,
    notes: o.notes || null,
    created_at: o.createdAt || new Date().toISOString(),
    updated_at: o.updatedAt || new Date().toISOString()
  };
}

export function rowToPressOnOrder(r) {
  let customSizes = null;
  if (r.custom_sizes) {
    try {
      customSizes = typeof r.custom_sizes === 'string' ? JSON.parse(r.custom_sizes) : r.custom_sizes;
    } catch (_) {}
  }
  return {
    id: r.id,
    orderNumber: r.order_number,
    productId: r.product_id,
    productTitle: r.product_title,
    shape: r.shape,
    length: r.length,
    size: r.size,
    customSizes,
    wearMethod: r.wear_method,
    quantity: Number(r.quantity),
    totalAmount: Number(r.total_amount),
    clientName: r.client_name,
    clientPhone: r.client_phone,
    clientEmail: r.client_email,
    clientInstagram: r.client_instagram,
    addressStreet: r.address_street,
    addressCity: r.address_city,
    addressState: r.address_state,
    addressPincode: r.address_pincode,
    paymentStatus: r.payment_status,
    paymentRef: r.payment_ref,
    fulfillmentStatus: r.fulfillment_status,
    courierPartner: r.courier_partner,
    trackingNumber: r.tracking_number,
    notes: r.notes,
    createdAt: r.created_at,
    updatedAt: r.updated_at
  };
}

export function settingsToRow(s) {
  return {
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
    timings: s.timings || '12:00 PM - 7:00 PM',
    google_rating: String(s.googleRating || '4.9')
  };
}

// Background Cloud Sync Functions

export async function cloudSyncClient(client) {
  if (!isSupabaseConfigured || !supabase) return;
  try {
    const row = clientToRow(client);
    const { error } = await supabase.from('studio_clients').upsert(row, { onConflict: 'id' });
    if (error) console.warn('[Supabase Sync Warning] saveClient:', error.message);
  } catch (err) {
    console.warn('[Supabase Sync Error] saveClient:', err.message);
  }
}

export async function cloudDeleteClient(id) {
  if (!isSupabaseConfigured || !supabase) return;
  try {
    const { error } = await supabase.from('studio_clients').delete().eq('id', id);
    if (error) console.warn('[Supabase Sync Warning] deleteClient:', error.message);
  } catch (err) {
    console.warn('[Supabase Sync Error] deleteClient:', err.message);
  }
}

export async function cloudSyncAppointment(apt) {
  if (!isSupabaseConfigured || !supabase) return;
  try {
    const row = aptToRow(apt);
    const { error } = await supabase.from('studio_appointments').upsert(row, { onConflict: 'id' });
    if (error) console.warn('[Supabase Sync Warning] saveAppointment:', error.message);
  } catch (err) {
    console.warn('[Supabase Sync Error] saveAppointment:', err.message);
  }
}

export async function cloudDeleteAppointment(id) {
  if (!isSupabaseConfigured || !supabase) return;
  try {
    const { error } = await supabase.from('studio_appointments').delete().eq('id', id);
    if (error) console.warn('[Supabase Sync Warning] deleteAppointment:', error.message);
  } catch (err) {
    console.warn('[Supabase Sync Error] deleteAppointment:', err.message);
  }
}

export async function cloudSyncRepair(repair) {
  if (!isSupabaseConfigured || !supabase) return;
  try {
    const row = repairToRow(repair);
    const { error } = await supabase.from('studio_repairs').upsert(row, { onConflict: 'id' });
    if (error) console.warn('[Supabase Sync Warning] saveRepair:', error.message);
  } catch (err) {
    console.warn('[Supabase Sync Error] saveRepair:', err.message);
  }
}

export async function cloudDeleteRepair(id) {
  if (!isSupabaseConfigured || !supabase) return;
  try {
    const { error } = await supabase.from('studio_repairs').delete().eq('id', id);
    if (error) console.warn('[Supabase Sync Warning] deleteRepair:', error.message);
  } catch (err) {
    console.warn('[Supabase Sync Error] deleteRepair:', err.message);
  }
}

export async function cloudSyncPressOnProduct(product) {
  if (!isSupabaseConfigured || !supabase) return;
  try {
    const row = pressOnProdToRow(product);
    const { error } = await supabase.from('press_on_products').upsert(row, { onConflict: 'id' });
    if (error) console.warn('[Supabase Sync Warning] savePressOnProduct:', error.message);
  } catch (err) {
    console.warn('[Supabase Sync Error] savePressOnProduct:', err.message);
  }
}

export async function cloudDeletePressOnProduct(id) {
  if (!isSupabaseConfigured || !supabase) return;
  try {
    const { error } = await supabase.from('press_on_products').delete().eq('id', id);
    if (error) console.warn('[Supabase Sync Warning] deletePressOnProduct:', error.message);
  } catch (err) {
    console.warn('[Supabase Sync Error] deletePressOnProduct:', err.message);
  }
}

export async function cloudSyncPressOnOrder(order) {
  if (!isSupabaseConfigured || !supabase) return;
  try {
    const row = pressOnOrderToRow(order);
    const { error } = await supabase.from('press_on_orders').upsert(row, { onConflict: 'id' });
    if (error) console.warn('[Supabase Sync Warning] savePressOnOrder:', error.message);
  } catch (err) {
    console.warn('[Supabase Sync Error] savePressOnOrder:', err.message);
  }
}

export async function cloudDeletePressOnOrder(id) {
  if (!isSupabaseConfigured || !supabase) return;
  try {
    const { error } = await supabase.from('press_on_orders').delete().eq('id', id);
    if (error) console.warn('[Supabase Sync Warning] deletePressOnOrder:', error.message);
  } catch (err) {
    console.warn('[Supabase Sync Error] deletePressOnOrder:', err.message);
  }
}

export async function cloudSyncSettings(settings) {
  if (!isSupabaseConfigured || !supabase) return;
  try {
    const row = settingsToRow(settings);
    const { error } = await supabase.from('studio_settings').upsert(row, { onConflict: 'id' });
    if (error) console.warn('[Supabase Sync Warning] saveSettings:', error.message);
  } catch (err) {
    console.warn('[Supabase Sync Error] saveSettings:', err.message);
  }
}
