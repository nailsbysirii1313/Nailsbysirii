import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isVercel = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
const STATIC_DB_FILE = path.join(__dirname, '..', 'data', 'db.json');
const DB_FILE = isVercel ? path.join('/tmp', 'db.json') : STATIC_DB_FILE;

function ensureDbFile() {
  if (isVercel && !fs.existsSync(DB_FILE)) {
    try {
      if (fs.existsSync(STATIC_DB_FILE)) {
        fs.copyFileSync(STATIC_DB_FILE, DB_FILE);
      } else {
        fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
      }
    } catch (e) {
      console.error('Error seeding /tmp/db.json on Vercel:', e);
    }
  }
}

// Generate realistic dates relative to current date (e.g. today, tomorrow, yesterday)
const todayStr = new Date().toISOString().split('T')[0];
const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
const tomorrowStr = tomorrow.toISOString().split('T')[0];

const dayAfter = new Date();
dayAfter.setDate(dayAfter.getDate() + 2);
const dayAfterStr = dayAfter.toISOString().split('T')[0];

const yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);
const yesterdayStr = yesterday.toISOString().split('T')[0];

const initialData = {
  settings: {
    studioName: "Nails by Sirii",
    tagline: "Affordable Nail Studio & Academy in Dehradun",
    ownerName: "Simran (Sirii)",
    phone: "+91 73026 23493",
    email: "hello@nailsbysirii.com",
    address: "Shop No. 7, Laxmi Navraj Plaza, Garhi Cantonment, Garhi Cantt, Dehradun, Uttarakhand 248003",
    instagram: "@nails.by.sirii",
    currency: "₹",
    upiId: "nailsbysirii@okaxis",
    upiName: "Nails by Sirii",
    studioLogoUrl: "/logo.png",
    ntfyTopic: "nails-by-sirii-alerts",
    ntfyServer: "https://ntfy.sh",
    reminderLeadHours: 2,
    autoRemindersEnabled: true,
    paymentInstructions: "UPI: 7302623493 / nailsbysirii@okaxis (GPay, PhonePe, Paytm) • Cash accepted at studio",
    defaultTaxRate: 0,
    depositRequirement: 500,
    timings: "12:00 PM – 7:00 PM",
    googleRating: "4.9",
    googleReviewCount: 344,
    googleMapsUrl: "https://maps.google.com/?q=Nails+by+Sirii+Laxmi+Navraj+Plaza+Garhi+Cantonment+Dehradun"
  },
  services: [
    {
      id: "srv_1",
      name: "Acrylic Nail Extension (Full Set)",
      category: "Extensions",
      duration: 90,
      price: 1400,
      description: "Full set strong acrylic extensions sculpted in your favorite shape and length. Durable, gorgeous, and lasts 3-4 weeks effortlessly.",
      popular: true
    },
    {
      id: "srv_2",
      name: "Acrylic Permanent Nail Extension",
      category: "Extensions",
      duration: 105,
      price: 1800,
      description: "Long-lasting permanent acrylic overlay extensions for maximum strength and length. Perfect for weddings, events, or everyday beauty.",
      popular: true
    },
    {
      id: "srv_3",
      name: "Gel / Soft Gel Extensions (Gel-X)",
      category: "Extensions",
      duration: 75,
      price: 1500,
      description: "Full cover soft gel extensions that feel lightweight, look natural, and cause zero damage to your real nail beds.",
      popular: true
    },
    {
      id: "srv_4",
      name: "Natural Nail Builder Gel (BIAB)",
      category: "Natural Nails",
      duration: 60,
      price: 1100,
      description: "Strong builder gel on your real nails so they grow long and strong without breaking! Includes Russian cuticle cleanup & glossy top coat.",
      popular: true
    },
    {
      id: "srv_5",
      name: "Nail Buffing & Cuticle Manicure",
      category: "Natural Nails",
      duration: 40,
      price: 600,
      description: "Clean Russian e-file cuticle detailing, precision nail shaping, surface buffing, and a natural shine treatment.",
      popular: false
    },
    {
      id: "srv_6",
      name: "Cute Hand-Painted Nail Art",
      category: "Nail Art",
      duration: 35,
      price: 500,
      description: "Trendy french tips, golden chrome accents, aura blush nails, cute flowers, hearts, and swirl designs on your nails.",
      popular: true
    },
    {
      id: "srv_7",
      name: "3D Charms, Bows & Crystal Gems",
      category: "Nail Art",
      duration: 45,
      price: 700,
      description: "Cute 3D bows, water drop art, crystal rhinestones, and metallic chrome charms when you want extra pretty nails!",
      popular: true
    },
    {
      id: "srv_8",
      name: "Customised Press-On Nails (Reusable Set)",
      category: "Press-Ons",
      duration: 30,
      price: 999,
      description: "Handmade reusable luxury press-ons customized to your exact nail sizes! Comes with application kit, glue, and wear instructions",
      popular: true
    },
    {
      id: "srv_9",
      name: "1:1 Certified Nail Tech Course",
      category: "Academy",
      duration: 180,
      price: 14999,
      description: "Comprehensive 1-on-1 certified masterclass by Simran mam. Learn Russian manicure, acrylics, gel extensions, and nail art from beginner to pro!",
      popular: false
    },
    {
      id: "srv_10",
      name: "Safe Gel & Acrylic Removal",
      category: "Removal",
      duration: 30,
      price: 400,
      description: "Gentle, non-damaging removal of existing gel or acrylic extensions with nourishing cuticle oil massage.",
      popular: false
    }
  ],
  clients: [],
  appointments: [],
  invoices: [],
  notifications: [],
  inventory: [
    {
      id: "inv_1",
      name: "Apres Gel-X Natural Coffin (Medium)",
      category: "Extensions & Tips",
      sku: "APX-NC-MED",
      quantity: 4,
      minThreshold: 6,
      unit: "box (500 tips)",
      supplier: "Apres Nail Professional",
      costPerUnit: 2800,
      status: "Low Stock",
      location: "Drawer A-2",
      notes: "Most requested shape and length for bridal and graduation clients."
    },
    {
      id: "inv_2",
      name: "The GelBottle BIAB Teddy (Builder in a Bottle)",
      category: "Gels & Overlays",
      sku: "TGB-BIAB-TED",
      quantity: 3,
      minThreshold: 5,
      unit: "20ml bottle",
      supplier: "The GelBottle Inc.",
      costPerUnit: 3200,
      status: "Low Stock",
      location: "Display Rack 1",
      notes: "Signature neutral builder shade, essential for weekly natural overlays."
    },
    {
      id: "inv_3",
      name: "Kokoist Mega Stick Base Gel",
      category: "Gels & Overlays",
      sku: "KOKO-MSB-15",
      quantity: 7,
      minThreshold: 3,
      unit: "15ml pot",
      supplier: "Kokoist Japan",
      costPerUnit: 3500,
      status: "In Stock",
      location: "Display Rack 1",
      notes: "Ultra adhesion Japanese semi-hard gel formulation."
    },
    {
      id: "inv_4",
      name: "Russian Safety Flame Diamond E-file Bits (023)",
      category: "Implements & Bits",
      sku: "RUS-FLM-023",
      quantity: 12,
      minThreshold: 8,
      unit: "drill bits",
      supplier: "Erica's ATA",
      costPerUnit: 1500,
      status: "In Stock",
      location: "Sterilization Station",
      notes: "Medical grade stainless diamond coating for gentle proximal nail fold lift."
    },
    {
      id: "inv_5",
      name: "Swarovski Aurora Borealis Flatback Crystals (SS5-SS12 mix)",
      category: "Art & Charms",
      sku: "SWAR-AB-MIX",
      quantity: 5,
      minThreshold: 3,
      unit: "pack (144 pcs)",
      supplier: "Dreamtime Creations",
      costPerUnit: 1800,
      status: "In Stock",
      location: "Drawer C-1",
      notes: "Authentic platinum-foiled crystals for luxury 3D jewel sets."
    },
    {
      id: "inv_6",
      name: "Glazed Donut White Pearl Chrome Powder",
      category: "Art & Charms",
      sku: "CHR-PEARL-01",
      quantity: 2,
      minThreshold: 4,
      unit: "3g jar",
      supplier: "Daily Charme",
      costPerUnit: 1300,
      status: "Low Stock",
      location: "Pigment Tray",
      notes: "Hailey Bieber glazed chrome finish staple."
    },
    {
      id: "inv_7",
      name: "Autoclave Sterilization Indicator Pouches (3.5 x 9 in)",
      category: "Sanitation & PPE",
      sku: "AUTO-PCH-200",
      quantity: 180,
      minThreshold: 50,
      unit: "pouches",
      supplier: "Medline Medical",
      costPerUnit: 12,
      status: "In Stock",
      location: "Autoclave Bay",
      notes: "Tri-check internal and external steam chemical indicators."
    },
    {
      id: "inv_8",
      name: "Organic Jojoba & Rose Cuticle Oil Retail Roller Pens",
      category: "Retail & Aftercare",
      sku: "RET-OIL-ROSE",
      quantity: 14,
      minThreshold: 10,
      unit: "roller pens",
      supplier: "Atelier Sirii Formulations",
      costPerUnit: 450,
      retailPrice: 950,
      status: "In Stock",
      location: "Checkout Display",
      notes: "Retail client favorite with cold-pressed rosehip seed and jojoba oils."
    },
    {
      id: "inv_9",
      name: "Barbicide Hospital Grade Disinfectant Concentrate",
      category: "Sanitation & PPE",
      sku: "BARB-HOSP-64",
      quantity: 1,
      minThreshold: 2,
      unit: "64 fl oz bottle",
      supplier: "King Research",
      costPerUnit: 1600,
      status: "Low Stock",
      location: "Sanitation Bay",
      notes: "EPA-registered hospital disinfectant with active rust inhibitor."
    },
    {
      id: "inv_10",
      name: "Preempt RTU Surface Disinfectant Wipes",
      category: "Sanitation & PPE",
      sku: "PRE-WIP-160",
      quantity: 3,
      minThreshold: 2,
      unit: "tub (160 wipes)",
      supplier: "Contec Healthcare",
      costPerUnit: 1400,
      status: "In Stock",
      location: "Treatment Station",
      notes: "Accelerated hydrogen peroxide 3-minute broad spectrum surface kill time."
    }
  ],
  checklist: [
    {
      id: "chk_1",
      shift: "opening",
      category: "Sterilization",
      title: "Autoclave Steam Strip Validation & Pouch Sealing",
      description: "Verify physical indicator color change on sterilizer pouch batch and prepare fresh autoclaved pouches for today's clients.",
      mandatory: true,
      completed: true,
      completedAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
      signedBy: "Sirii"
    },
    {
      id: "chk_2",
      shift: "opening",
      category: "Sanitation",
      title: "Barbicide 24-Hour Fresh Solution Mix",
      description: "Discard yesterday's disinfectant solution. Mix 2 oz Barbicide concentrate with 32 oz cold tap water in immersion glass jars.",
      mandatory: true,
      completed: true,
      completedAt: new Date(Date.now() - 2.8 * 3600 * 1000).toISOString(),
      signedBy: "Sirii"
    },
    {
      id: "chk_3",
      shift: "opening",
      category: "Air Quality",
      title: "HEPA Air Purifier & Salon Desk Dust Extractor Check",
      description: "Switch salon medical-grade HEPA-13 air purifier to high. Inspect desk dust collector suction grate & cyclone filter bag.",
      mandatory: false,
      completed: true,
      completedAt: new Date(Date.now() - 2.5 * 3600 * 1000).toISOString(),
      signedBy: "Sirii"
    },
    {
      id: "chk_4",
      shift: "opening",
      category: "Sterilization",
      title: "Ultrasonic Bath Diamond Bit Protocol",
      description: "Prepare ultrasonic cleansing bath with enzymatic neutral detergent solution for rotating carbide and diamond bits.",
      mandatory: true,
      completed: true,
      completedAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
      signedBy: "Sirii"
    },
    {
      id: "chk_5",
      shift: "opening",
      category: "Disinfection",
      title: "Curing Lamp Disinfection & Mirror Reflectors",
      description: "Wipe interior reflective removable base plates and outer housing of LED/UV lamps with 70% Isopropyl Alcohol.",
      mandatory: true,
      completed: true,
      completedAt: new Date(Date.now() - 1.5 * 3600 * 1000).toISOString(),
      signedBy: "Sirii"
    },
    {
      id: "chk_6",
      shift: "opening",
      category: "Prep Trays",
      title: "Client Station Single-Use Disposable Tray Set",
      description: "Lay out brand new single-use 100/180 grit files, mini buffing blocks, and wooden orange sticks in sealed individual client trays.",
      mandatory: false,
      completed: false,
      completedAt: null,
      signedBy: null
    },
    {
      id: "chk_7",
      shift: "opening",
      category: "Hospitality",
      title: "Hydration & Hand-Washing Station Refresh",
      description: "Replenish gentle foaming amino-acid hand wash and fresh laundered lint-free linen hand towels at the client washbasin.",
      mandatory: false,
      completed: false,
      completedAt: null,
      signedBy: null
    },
    {
      id: "chk_8",
      shift: "closing",
      category: "Sterilization",
      title: "Autoclave Final Run & Sterilization Register Log",
      description: "Load washed and dried stainless steel cuticle nippers/pushers into Class B autoclave sterilizer; run 134C cycle and log cycle number in register.",
      mandatory: true,
      completed: false,
      completedAt: null,
      signedBy: null
    },
    {
      id: "chk_9",
      shift: "closing",
      category: "Maintenance",
      title: "Gel Bottle Neck Acetone Cleanse",
      description: "Wipe all gel polish, BIAB, and top coat bottle necks with lint-free wipes soaked in pure acetone to prevent crusting and thread seal degradation.",
      mandatory: false,
      completed: false,
      completedAt: null,
      signedBy: null
    },
    {
      id: "chk_10",
      shift: "closing",
      category: "Sanitation",
      title: "Dust Collector Empty & Surface Hospital Disinfection",
      description: "Empty dust vacuum filter bag into outdoor sealed disposal; disinfect client leather chairs, armrests, and manicure station with Preempt RTU wipes.",
      mandatory: true,
      completed: false,
      completedAt: null,
      signedBy: null
    }
  ],
  repairs: [],
  giftCards: [],
  reviews: []
};

function readDb() {
  try {
    ensureDbFile();
    if (!fs.existsSync(DB_FILE)) {
      writeDb(initialData);
      return initialData;
    }
    const content = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(content);
    let changed = false;
    if (!parsed.settings) {
      parsed.settings = initialData.settings;
      changed = true;
    }
    if (!parsed.inventory) {
      parsed.inventory = initialData.inventory;
      changed = true;
    }
    if (!parsed.checklist) {
      parsed.checklist = initialData.checklist;
      changed = true;
    }
    if (!parsed.repairs) {
      parsed.repairs = initialData.repairs;
      changed = true;
    }
    if (!parsed.giftCards) {
      parsed.giftCards = initialData.giftCards;
      changed = true;
    }
    if (!parsed.reviews) {
      parsed.reviews = initialData.reviews;
      changed = true;
    }
    if (changed) {
      writeDb(parsed);
    }
    return parsed;
  } catch (err) {
    console.error('Error reading db:', err);
    return initialData;
  }
}

function writeDb(data) {
  try {
    ensureDbFile();
    const dir = path.dirname(DB_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const tempFile = `${DB_FILE}.tmp`;
    fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), 'utf-8');
    fs.renameSync(tempFile, DB_FILE);
  } catch (err) {
    console.error('Error writing db:', err);
  }
}

export const db = {
  get() {
    return readDb();
  },
  save(data) {
    writeDb(data);
  },
  
  // Clients
  getClients() {
    return readDb().clients || [];
  },
  getClientById(id) {
    return (readDb().clients || []).find(c => c.id === id);
  },
  saveClient(client) {
    const data = readDb();
    if (!data.clients) data.clients = [];
    const idx = data.clients.findIndex(c => c.id === client.id);
    let record;
    if (idx >= 0) {
      record = { ...data.clients[idx], ...client, updatedAt: new Date().toISOString() };
      data.clients[idx] = record;
    } else {
      record = {
        ...client,
        id: client.id || `cl_${Date.now()}`,
        totalVisits: client.totalVisits || 0,
        totalSpent: client.totalSpent || 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      data.clients.unshift(record);
    }
    writeDb(data);
    return record;
  },
  deleteClient(id) {
    const data = readDb();
    data.clients = (data.clients || []).filter(c => c.id !== id);
    writeDb(data);
  },

  // Services
  getServices() {
    return readDb().services || [];
  },
  saveService(service) {
    const data = readDb();
    if (!data.services) data.services = [];
    const idx = data.services.findIndex(s => s.id === service.id);
    if (idx >= 0) {
      data.services[idx] = { ...data.services[idx], ...service };
    } else {
      service.id = service.id || `srv_${Date.now()}`;
      data.services.push(service);
    }
    writeDb(data);
    return service;
  },
  deleteService(id) {
    const data = readDb();
    data.services = (data.services || []).filter(s => s.id !== id);
    writeDb(data);
  },

  // Appointments
  getAppointments() {
    return readDb().appointments || [];
  },
  saveAppointment(appointment) {
    const data = readDb();
    if (!data.appointments) data.appointments = [];
    const idx = data.appointments.findIndex(a => a.id === appointment.id);
    let record;
    if (idx >= 0) {
      record = { ...data.appointments[idx], ...appointment, updatedAt: new Date().toISOString() };
      data.appointments[idx] = record;
    } else {
      record = {
        ...appointment,
        id: appointment.id || `apt_${Date.now()}`,
        status: appointment.status || 'Confirmed',
        reminderSent: false,
        lastReminderAt: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      data.appointments.unshift(record);
    }
    writeDb(data);
    return record;
  },
  deleteAppointment(id) {
    const data = readDb();
    data.appointments = (data.appointments || []).filter(a => a.id !== id);
    writeDb(data);
  },

  // Invoices
  getInvoices() {
    return readDb().invoices || [];
  },
  saveInvoice(invoice) {
    const data = readDb();
    if (!data.invoices) data.invoices = [];
    const idx = data.invoices.findIndex(i => i.id === invoice.id);
    let record;
    if (idx >= 0) {
      record = { ...data.invoices[idx], ...invoice, updatedAt: new Date().toISOString() };
      data.invoices[idx] = record;
    } else {
      const count = (data.invoices || []).length + 1;
      const num = String(count).padStart(3, '0');
      const invoiceNumber = invoice.invoiceNumber || `INV-${new Date().getFullYear()}-${num}`;
      record = {
        ...invoice,
        id: invoice.id || invoiceNumber,
        invoiceNumber,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      data.invoices.unshift(record);
    }
    writeDb(data);
    return record;
  },
  deleteInvoice(id) {
    const data = readDb();
    data.invoices = (data.invoices || []).filter(i => i.id !== id);
    writeDb(data);
  },

  // Notifications
  getNotifications() {
    return readDb().notifications || [];
  },
  addNotification(notification) {
    const data = readDb();
    if (!data.notifications) data.notifications = [];
    const record = {
      ...notification,
      id: notification.id || `notif_${Date.now()}`,
      sentAt: new Date().toISOString()
    };
    data.notifications.unshift(record);
    // keep max 100
    if (data.notifications.length > 100) {
      data.notifications = data.notifications.slice(0, 100);
    }
    writeDb(data);
    return record;
  },

  // Settings
  getSettings() {
    return readDb().settings || initialData.settings;
  },
  saveSettings(settings) {
    const data = readDb();
    data.settings = { ...data.settings, ...settings };
    writeDb(data);
    return data.settings;
  },

  // Inventory & Supplies
  getInventory() {
    return readDb().inventory || [];
  },
  saveInventoryItem(item) {
    const data = readDb();
    if (!data.inventory) data.inventory = [];
    const idx = data.inventory.findIndex(i => i.id === item.id);
    const quantity = Number(item.quantity) || 0;
    const minThreshold = Number(item.minThreshold) || 0;
    const status = quantity <= 0 ? 'Out of Stock' : (quantity <= minThreshold ? 'Low Stock' : 'In Stock');
    const record = {
      ...item,
      quantity,
      minThreshold,
      costPerUnit: Number(item.costPerUnit) || 0,
      retailPrice: item.retailPrice ? Number(item.retailPrice) : undefined,
      status: item.status || status,
      updatedAt: new Date().toISOString()
    };
    if (idx >= 0) {
      data.inventory[idx] = { ...data.inventory[idx], ...record };
    } else {
      record.id = record.id || `inv_${Date.now()}`;
      record.createdAt = new Date().toISOString();
      data.inventory.unshift(record);
    }
    writeDb(data);
    return record;
  },
  adjustInventoryStock(id, delta) {
    const data = readDb();
    if (!data.inventory) data.inventory = [];
    const idx = data.inventory.findIndex(i => i.id === id);
    if (idx >= 0) {
      const item = data.inventory[idx];
      const newQty = Math.max(0, (Number(item.quantity) || 0) + delta);
      item.quantity = newQty;
      item.status = newQty <= 0 ? 'Out of Stock' : (newQty <= (Number(item.minThreshold) || 0) ? 'Low Stock' : 'In Stock');
      item.updatedAt = new Date().toISOString();
      writeDb(data);
      return item;
    }
    return null;
  },
  deleteInventoryItem(id) {
    const data = readDb();
    data.inventory = (data.inventory || []).filter(i => i.id !== id);
    writeDb(data);
  },

  // Daily Sanitization Checklist
  getChecklist() {
    return readDb().checklist || [];
  },
  toggleChecklistItem(id, signedBy = 'Sirii') {
    const data = readDb();
    if (!data.checklist) data.checklist = [];
    const item = data.checklist.find(c => c.id === id);
    if (item) {
      item.completed = !item.completed;
      item.completedAt = item.completed ? new Date().toISOString() : null;
      item.signedBy = item.completed ? signedBy : null;
      writeDb(data);
      return item;
    }
    return null;
  },
  resetChecklist() {
    const data = readDb();
    if (data.checklist) {
      data.checklist = data.checklist.map(item => ({
        ...item,
        completed: false,
        completedAt: null,
        signedBy: null
      }));
      writeDb(data);
    }
    return data.checklist || [];
  },

  // Emergency Repairs
  getRepairs() {
    return readDb().repairs || [];
  },
  saveRepair(repair) {
    const data = readDb();
    if (!data.repairs) data.repairs = [];
    const idx = data.repairs.findIndex(r => r.id === repair.id);
    const record = {
      ...repair,
      id: repair.id || `rep_${Date.now()}`,
      status: repair.status || 'Pending Squeeze-in',
      createdAt: repair.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    if (idx >= 0) {
      data.repairs[idx] = { ...data.repairs[idx], ...record };
    } else {
      data.repairs.unshift(record);
    }
    writeDb(data);
    return record;
  },
  updateRepairStatus(id, status) {
    const data = readDb();
    if (!data.repairs) data.repairs = [];
    const item = data.repairs.find(r => r.id === id);
    if (item) {
      item.status = status;
      item.updatedAt = new Date().toISOString();
      writeDb(data);
      return item;
    }
    return null;
  },
  deleteRepair(id) {
    const data = readDb();
    data.repairs = (data.repairs || []).filter(r => r.id !== id);
    writeDb(data);
  },

  // Studio Gift Cards & Vouchers
  getGiftCards() {
    return readDb().giftCards || [];
  },
  saveGiftCard(card) {
    const data = readDb();
    if (!data.giftCards) data.giftCards = [];
    const idx = data.giftCards.findIndex(g => g.id === card.id);
    const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    const code = card.code || `GIFT-SIRII-${randomSuffix}`;
    const initialAmount = Number(card.initialAmount) || 2000;
    const currentBalance = card.currentBalance !== undefined ? Number(card.currentBalance) : initialAmount;
    const record = {
      ...card,
      id: card.id || `gift_${Date.now()}`,
      code: code.toUpperCase().trim(),
      initialAmount,
      currentBalance,
      theme: card.theme || 'Blush Rose Quartz',
      status: currentBalance <= 0 ? 'Redeemed' : 'Active',
      createdAt: card.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    if (idx >= 0) {
      data.giftCards[idx] = { ...data.giftCards[idx], ...record };
    } else {
      data.giftCards.unshift(record);
    }
    writeDb(data);
    return record;
  },
  redeemGiftCard(code, amount) {
    const data = readDb();
    if (!data.giftCards) data.giftCards = [];
    const normalizedCode = (code || '').toUpperCase().trim();
    const card = data.giftCards.find(g => g.code === normalizedCode);
    if (!card) return { success: false, error: 'Gift voucher code not found' };
    if (card.currentBalance <= 0) return { success: false, error: 'Gift voucher balance is ₹0' };

    const deduct = Math.min(Number(card.currentBalance), Number(amount));
    card.currentBalance = Math.max(0, card.currentBalance - deduct);
    card.status = card.currentBalance <= 0 ? 'Redeemed' : 'Active';
    card.updatedAt = new Date().toISOString();
    writeDb(data);
    return { success: true, deducted: deduct, remainingBalance: card.currentBalance, card };
  },
  deleteGiftCard(id) {
    const data = readDb();
    data.giftCards = (data.giftCards || []).filter(g => g.id !== id);
    writeDb(data);
  },

  // Client Reviews & Testimonials
  getReviews() {
    return readDb().reviews || [];
  },
  saveReview(review) {
    const data = readDb();
    if (!data.reviews) data.reviews = [];
    const idx = data.reviews.findIndex(r => r.id === review.id);
    const record = {
      ...review,
      id: review.id || `rev_${Date.now()}`,
      rating: Number(review.rating) || 5,
      date: review.date || new Date().toISOString().split('T')[0],
      verified: review.verified !== undefined ? review.verified : true,
      createdAt: review.createdAt || new Date().toISOString()
    };
    if (idx >= 0) {
      data.reviews[idx] = { ...data.reviews[idx], ...record };
    } else {
      data.reviews.unshift(record);
    }
    writeDb(data);
    return record;
  },
  deleteReview(id) {
    const data = readDb();
    data.reviews = (data.reviews || []).filter(r => r.id !== id);
    writeDb(data);
  }
};
