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

export async function sendAppointmentReminder(appointment, client = null) {
  const settings = db.getSettings();
  const cName = client ? client.name : appointment.clientName;
  const cPhone = client ? client.phone : appointment.clientPhone;
  const addons = appointment.addonServiceNames && appointment.addonServiceNames.length > 0
    ? ` + ${appointment.addonServiceNames.join(', ')}`
    : '';

  const title = `Upcoming Client: ${cName}`;
  const message = `${cName} is booked for ${appointment.serviceName}${addons} on ${appointment.date} at ${appointment.time}.\nPhone: ${cPhone || 'N/A'}\nNotes: ${appointment.notes || 'None'}`;

  return await sendNtfyNotification({
    title,
    message,
    priority: "high",
    tags: "sparkles,calendar,gem",
    type: "appointment_reminder",
    metadata: {
      appointmentId: appointment.id,
      clientId: appointment.clientId
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

