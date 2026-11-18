import { db } from './db.js';

export async function sendNtfyNotification({
  title = "Nails by Sirii Alert",
  message = "Notification from your studio atelier",
  priority = "default", // min, low, default, high, urgent
  tags = "sparkles,calendar",
  clickUrl = "",
  topic = null,
  type = "general",
  metadata = {}
}) {
  const settings = db.getSettings();
  const targetTopic = topic || settings.ntfyTopic || "nails-by-sirii-alerts";
  const server = (settings.ntfyServer || "https://ntfy.sh").replace(/\/$/, "");
  const url = `${server}/${encodeURIComponent(targetTopic)}`;

  // Sanitize headers to ASCII ByteString for node-fetch
  const cleanTitle = title.replace(/•/g, '-').replace(/[^\x00-\x7F]/g, '').trim();

  const headers = {
    "Title": cleanTitle,
    "Priority": priority,
    "Tags": tags,
  };

  if (clickUrl) {
    headers["Click"] = clickUrl;
  }

  try {
    const res = await fetch(url, {
      method: "POST",
      body: message,
      headers
    });

    const isSuccess = res.ok;
    const logEntry = db.addNotification({
      type,
      title,
      message,
      topic: targetTopic,
      status: isSuccess ? "delivered" : "failed",
      ...metadata
    });

    return {
      success: isSuccess,
      status: res.status,
      topic: targetTopic,
      log: logEntry
    };
  } catch (err) {
    console.error("Failed to send ntfy notification:", err);
    const logEntry = db.addNotification({
      type,
      title,
      message,
      topic: targetTopic,
      status: "error",
      error: err.message,
      ...metadata
    });
    return {
      success: false,
      error: err.message,
      topic: targetTopic,
      log: logEntry
    };
  }
}

export async function sendAppointmentReminder(appointment, client = null, reminderType = 'manual') {
  const cName = client ? client.name : (appointment.clientName || 'Client');
  const cPhone = client ? client.phone : (appointment.clientPhone || 'No phone provided');
  const addons = appointment.addonServiceNames && appointment.addonServiceNames.length > 0
    ? ` + ${appointment.addonServiceNames.join(', ')}`
    : '';

  let badge = 'APPOINTMENT ALERT';
  let priority = 'high';
  let tags = 'calendar,sparkles,bell';
  let asciiType = 'Reminder';

  if (reminderType === '24h') {
    badge = '24-HOUR ADVANCE ALERT';
    priority = 'high';
    tags = 'calendar,alarm_clock';
    asciiType = '24h Notice';
  } else if (reminderType === '4h') {
    badge = '4-HOUR ARRIVAL ALERT';
    priority = 'urgent';
    tags = 'alarm_clock,rotating_light,nail_care';
    asciiType = '4h Urgent Alert';
  } else if (reminderType === '1h') {
    badge = '1-HOUR FINAL ALERT';
    priority = 'urgent';
    tags = 'rotating_light,zap,heart';
    asciiType = '1h Final Call';
  }

  const title = `[${asciiType}] ${cName} - ${appointment.time}`;

  const priceNum = Number(appointment.price) || 0;
  const depositNum = Number(appointment.depositPaid || appointment.advancePaid) || 0;
  const balanceNum = Math.max(0, priceNum - depositNum);

  const message = [
    `[${badge.toUpperCase()}] • NAILS BY SIRII`,
    `━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    `Client: ${cName}`,
    `Phone: ${cPhone}`,
    `Service: ${appointment.serviceName || 'Custom Nail Service'}${addons}`,
    `Schedule: ${appointment.date} at ${appointment.time}`,
    `Price: ₹${priceNum.toLocaleString('en-IN')}${depositNum > 0 ? ` (Advance: ₹${depositNum.toLocaleString('en-IN')}, Due: ₹${balanceNum.toLocaleString('en-IN')})` : ' (Full payment at studio)'}`,
    `Location: Nails by Sirii Atelier, Garhi Cantt, Dehradun`,
    appointment.notes ? `Note: ${appointment.notes}` : null,
    `━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    `Action: Please ensure sterilization buffers & station ready.`
  ].filter(Boolean).join('\n');

  return await sendNtfyNotification({
    title,
    message,
    priority,
    tags,
    type: 'appointment_reminder',
    metadata: {
      appointmentId: appointment.id,
      clientId: appointment.clientId,
      reminderType
    }
  });
}

export async function sendInventoryAlert(items) {
  const lowCount = items.length;
  const title = `Inventory Alert: ${lowCount} Supply Item${lowCount > 1 ? 's' : ''} Low`;
  const itemListStr = items
    .map(i => `[${i.category}] ${i.name}: ${i.quantity} ${i.unit} (Min: ${i.minThreshold})`)
    .join('\n');
  const message = `The following studio supplies are running low at Nails by Sirii:\n\n${itemListStr}\n\nRestock orders can be reviewed in Studio OS Inventory.`;

  return await sendNtfyNotification({
    title,
    message,
    priority: "high",
    tags: "package,warning",
    type: "inventory_alert",
    metadata: {
      lowStockItemCount: lowCount,
      itemIds: items.map(i => i.id)
    }
  });
}

export async function sendEmergencyRepairAlert(repair) {
  const title = `URGENT REPAIR: ${repair.clientName} (${repair.finger || 'Nail'})`;
  const message = `${repair.clientName} submitted an urgent repair request!\n\nHand & Finger: ${repair.hand || ''} ${repair.finger || ''}\nService: ${repair.serviceType || 'Gel'}\nIssue: ${repair.issue || 'Chipped / Broken'}\nUrgency: ${repair.urgency || 'ASAP'}\nPhone: ${repair.clientPhone}`;

  return await sendNtfyNotification({
    title,
    message,
    priority: "urgent",
    tags: "rotating_light,fire,sos",
    type: "emergency_repair",
    metadata: {
      repairId: repair.id,
      clientName: repair.clientName,
      finger: repair.finger
    }
  });
}

export async function sendGiftCardIssuedAlert(card) {
  const title = `Gift Voucher Issued: ${card.recipientName} (INR ${card.initialAmount})`;
  const message = `A new boutique gift voucher has been generated!\n\nCode: ${card.code}\nRecipient: ${card.recipientName} (${card.recipientEmail || 'N/A'})\nFrom: ${card.senderName || 'Atelier Gift'}\nAmount: INR ${card.initialAmount}\nTheme: ${card.theme || 'Blush Rose Quartz'}${card.personalMessage ? `\nNote: "${card.personalMessage}"` : ''}`;

  return await sendNtfyNotification({
    title,
    message,
    priority: "default",
    tags: "gift,heart,credit_card",
    type: "gift_card_issued",
    metadata: {
      cardId: card.id,
      code: card.code,
      amount: card.initialAmount
    }
  });
}

export async function sendPressOnOrderAlert(order) {
  const title = `New Press-On Order: ${order.clientName} (INR ${order.totalAmount || 0})`;
  const message = `${order.clientName} ordered "${order.productTitle || 'Press-On Set'}"!\n\nSize: ${order.size} (Qty: ${order.quantity || 1})\nTotal: INR ${order.totalAmount || 0}\nPhone: ${order.clientPhone}\nAddress: ${order.addressStreet || ''}, ${order.addressCity || ''} ${order.addressPincode || ''}\nWear Kit: ${order.wearMethod || 'Adhesive Tabs'}`;

  return await sendNtfyNotification({
    title,
    message,
    priority: "high",
    tags: "package,shopping_cart,gem",
    type: "press_on_order",
    metadata: {
      orderId: order.id,
      clientName: order.clientName,
      totalAmount: order.totalAmount
    }
  });
}

