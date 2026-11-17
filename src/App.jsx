import React, { useState, useEffect } from 'react';
import { api } from './api';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Toast from './components/Toast';
import DashboardView from './components/DashboardView';
import ClientsView from './components/ClientsView';
import AppointmentsView from './components/AppointmentsView';
import InvoicesView from './components/InvoicesView';
import ServicesView from './components/ServicesView';
import RemindersView from './components/RemindersView';
import SettingsView from './components/SettingsView';
import AnalyticsView from './components/AnalyticsView';
import InventoryView from './components/InventoryView';
import GiftCardsView from './components/GiftCardsView';
import PublicBookingView from './components/PublicBookingView';
import NailCustomizerView from './components/NailCustomizerView';
import PublicInvoiceView from './components/PublicInvoiceView';
import QuickMessageModal from './components/QuickMessageModal';
import NewClientModal from './components/NewClientModal';
import NewAppointmentModal from './components/NewAppointmentModal';
import NewInvoiceModal from './components/NewInvoiceModal';
import InvoiceModal from './components/InvoiceModal';
import ClientDetailDrawer from './components/ClientDetailDrawer';
import QrModal from './components/QrModal';
import CommandPalette from './components/CommandPalette';
import AftercareCardModal from './components/AftercareCardModal';
import MobileBottomNav from './components/MobileBottomNav';
import MobileQuickActionSheet from './components/MobileQuickActionSheet';
import MobileStudioHubSheet from './components/MobileStudioHubSheet';
import ClientWebsite from './components/ClientWebsite';
import PasscodeModal from './components/PasscodeModal';
import ShareCatalogueModal from './components/ShareCatalogueModal';
import PublicHomePilot from './components/PublicHomePilot';
import StudioTodayPilot from './components/StudioTodayPilot';
import PressOnsView from './components/PressOnsView';
import { playStudioChime } from './utils/audio';
import { customSetToInvoiceItems } from './utils/customizerCalculator';
import { getKolkataTodayString } from './utils/dateTime';

export default function App() {
  // Authentication & Passcode protection (nbs0812)
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('nbs_studio_auth') === 'true';
  });
  const [isPasscodeModalOpen, setIsPasscodeModalOpen] = useState(false);
  const [isShareCatalogueOpen, setIsShareCatalogueOpen] = useState(false);
  const [pendingTab, setPendingTab] = useState('dashboard');

  // Catalogue Price Visibility Mode: check ?hidePrices=true / ?noPrices=1 / hash
  const [hidePrices, setHidePrices] = useState(() => {
    if (typeof window === 'undefined') return false;
    const params = new URLSearchParams(window.location.search);
    return (
      params.get('hidePrices') === 'true' ||
      params.get('noPrices') === '1' ||
      window.location.hash.includes('no-prices')
    );
  });

  // Design Mode for Creative Redesign: 'redesigned' (Full Phase 3) | 'pilot' (Phase 2 Preview)
  const [designMode, setDesignMode] = useState('redesigned');

  // Current View: defaults to client-facing website for clients
  const [currentTab, setTabState] = useState(() => {
    if (typeof window === 'undefined') return 'clientWebsite';
    const params = new URLSearchParams(window.location.search);
    const hash = window.location.hash;
    const authed = localStorage.getItem('nbs_studio_auth') === 'true';
    if (hash.startsWith('#invoice-')) {
      return 'publicInvoice';
    }
    if ((params.get('view') === 'studio' || hash.startsWith('#studio')) && authed) {
      return 'dashboard';
    }
    return 'clientWebsite';
  });

  // Protected Tab Switcher
  const setTab = (targetTab) => {
    if (targetTab === 'clientWebsite' || targetTab === 'publicBooking') {
      setTabState('clientWebsite');
      return;
    }
    // Studio admin views require authentication
    if (!isAuthenticated) {
      setPendingTab(targetTab);
      setIsPasscodeModalOpen(true);
      return;
    }
    setTabState(targetTab);
  };

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
    setTabState(pendingTab || 'dashboard');
    addToast('Studio Hub Unlocked', 'Welcome back, Sirii! Management console ready.', 'success');
  };

  const handleLockStudio = () => {
    localStorage.removeItem('nbs_studio_auth');
    localStorage.removeItem('nbs_studio_token');
    setIsAuthenticated(false);
    setTabState('clientWebsite');
    addToast('Studio Hub Locked', 'Logged out and returned to public client website.', 'info');
  };

  const [loading, setLoading] = useState(true);

  // Core Data State
  const [overview, setOverview] = useState(null);
  const [clients, setClients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [services, setServices] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [settings, setSettings] = useState(null);
  const [inventory, setInventory] = useState([]);
  const [checklist, setChecklist] = useState([]);
  const [repairs, setRepairs] = useState([]);
  const [giftCards, setGiftCards] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [pressOnProducts, setPressOnProducts] = useState([]);
  const [pressOnOrders, setPressOnOrders] = useState([]);

  // Aftercare Modal State
  const [isAftercareModalOpen, setIsAftercareModalOpen] = useState(false);
  const [aftercareClient, setAftercareClient] = useState(null);
  const [aftercareAppointment, setAftercareAppointment] = useState(null);

  // Toasts
  const [toasts, setToasts] = useState([]);

  // Modals & Drawers
  const [isNewClientOpen, setIsNewClientOpen] = useState(false);
  const [clientToEdit, setClientToEdit] = useState(null);

  const [isNewAppointmentOpen, setIsNewAppointmentOpen] = useState(false);
  const [preselectedClientForAppointment, setPreselectedClientForAppointment] = useState(null);
  const [preselectedDateForAppointment, setPreselectedDateForAppointment] = useState(null);
  const [preselectedTimeForAppointment, setPreselectedTimeForAppointment] = useState(null);
  const [appointmentToEdit, setAppointmentToEdit] = useState(null);

  const [isNewInvoiceOpen, setIsNewInvoiceOpen] = useState(false);
  const [preselectedAppointmentForInvoice, setPreselectedAppointmentForInvoice] = useState(null);
  const [preselectedClientForInvoice, setPreselectedClientForInvoice] = useState(null);
  const [invoiceToEdit, setInvoiceToEdit] = useState(null);

  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [isInvoiceDetailOpen, setIsInvoiceDetailOpen] = useState(false);

  const [selectedClient, setSelectedClient] = useState(null);
  const [isClientDetailOpen, setIsClientDetailOpen] = useState(false);

  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isMobileQuickActionOpen, setIsMobileQuickActionOpen] = useState(false);
  const [isMobileHubSheetOpen, setIsMobileHubSheetOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Listen to hash and query changes for live deep-linking
  useEffect(() => {
    const handleUrlRouting = () => {
      const params = new URLSearchParams(window.location.search);
      const hash = window.location.hash;
      const authed = localStorage.getItem('nbs_studio_auth') === 'true';

      if (params.get('hidePrices') === 'true' || params.get('noPrices') === '1' || hash.includes('no-prices')) {
        setHidePrices(true);
      } else if (params.get('hidePrices') === 'false') {
        setHidePrices(false);
      }

      if (hash.startsWith('#invoice-')) {
        const invId = hash.replace('#invoice-', '');
        const target = (invoices || []).find((i) => i.id === invId);
        if (target) {
          setSelectedInvoice(target);
        }
        setTabState('publicInvoice');
      } else if (params.get('view') === 'studio' || hash.startsWith('#studio')) {
        if (authed) {
          setTabState('dashboard');
        } else {
          setPendingTab('dashboard');
          setIsPasscodeModalOpen(true);
        }
      }
    };

    window.addEventListener('hashchange', handleUrlRouting);
    window.addEventListener('popstate', handleUrlRouting);
    return () => {
      window.removeEventListener('hashchange', handleUrlRouting);
      window.removeEventListener('popstate', handleUrlRouting);
    };
  }, [invoices]);

  // Quick Messaging State
  const [isQuickMessageOpen, setIsQuickMessageOpen] = useState(false);
  const [quickMessageClient, setQuickMessageClient] = useState(null);
  const [quickMessageAppointment, setQuickMessageAppointment] = useState(null);

  const openQuickMessage = (client, appointment = null) => {
    setQuickMessageClient(client);
    setQuickMessageAppointment(appointment);
    setIsQuickMessageOpen(true);
  };

  // Toast Helper
  const addToast = (title, message = '', type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Load All Studio Data
  const loadData = async () => {
    try {
      setLoading(true);
      const [
        overviewData,
        clientsData,
        appointmentsData,
        servicesData,
        invoicesData,
        notificationsData,
        settingsData,
        inventoryData,
        checklistData,
        repairsData,
        giftCardsData,
        reviewsData,
        pressOnProductsData,
        pressOnOrdersData
      ] = await Promise.all([
        api.getOverview().catch(() => null),
        api.getClients().catch(() => []),
        api.getAppointments().catch(() => []),
        api.getServices().catch(() => []),
        api.getInvoices().catch(() => []),
        api.getNotifications().catch(() => []),
        api.getSettings().catch(() => null),
        api.getInventory().catch(() => []),
        api.getChecklist().catch(() => []),
        api.getRepairs().catch(() => []),
        api.getGiftCards().catch(() => []),
        api.getReviews().catch(() => []),
        api.getPressOnProducts().catch(() => []),
        api.getPressOnOrders().catch(() => [])
      ]);

      if (overviewData) setOverview(overviewData);
      setClients(clientsData);
      setAppointments(appointmentsData);
      setServices(servicesData);
      setInvoices(invoicesData);
      setNotifications(notificationsData);
      if (settingsData) setSettings(settingsData);
      setInventory(inventoryData);
      setChecklist(checklistData);
      setRepairs(repairsData);
      setGiftCards(giftCardsData);
      setReviews(reviewsData);
      setPressOnProducts(pressOnProductsData);
      setPressOnOrders(pressOnOrdersData);

      // Deep link to client invoice if opened with #invoice-xxx
      if (typeof window !== 'undefined' && window.location.hash.startsWith('#invoice-')) {
        const invId = window.location.hash.replace('#invoice-', '');
        const target = invoicesData.find((i) => i.id === invId);
        if (target) {
          setSelectedInvoice(target);
          setTabState('publicInvoice');
        }
      }
    } catch (err) {
      console.error('Error loading studio data:', err);
      addToast('Error', 'Failed to connect to studio server', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Handlers for Phone Alerts & NTFY
  const handleTestAlert = async (customParams = null) => {
    try {
      const res = await api.sendTestNotification(
        customParams || {
          title: 'Nails by Sirii • Studio Alert',
          message: 'Mobile alert system connected and ready for client reminders.'
        }
      );

      if (res.success) {
        addToast(
          'Phone Alert Dispatched!',
          `Sent to topic "${res.topic}". Check your phone notification screen.`,
          'success'
        );
        // refresh notifications
        const notifs = await api.getNotifications().catch(() => []);
        setNotifications(notifs);
      } else {
        addToast(
          'Alert Notice',
          `Dispatched to topic "${res.topic}". (Check internet / ntfy topic settings)`,
          'info'
        );
      }
    } catch (err) {
      addToast('Failed to Send Alert', err.message, 'error');
    }
  };

  const handleRemindAppointment = async (appointment) => {
    try {
      const res = await api.remindAppointment(appointment.id);
      addToast(
        'Phone Reminder Sent!',
        `Alert for ${appointment.clientName} (${appointment.time}) sent to your phone.`,
        'success'
      );
      // update appointment reminderSent locally
      setAppointments((prev) =>
        prev.map((a) => (a.id === appointment.id ? { ...a, reminderSent: true } : a))
      );
      const notifs = await api.getNotifications().catch(() => []);
      setNotifications(notifs);
    } catch (err) {
      addToast('Reminder Failed', err.message, 'error');
    }
  };

  // Client Handlers
  const handleSaveClient = async (formData) => {
    try {
      if (clientToEdit) {
        const updated = await api.updateClient(clientToEdit.id, formData);
        setClients((prev) => prev.map((c) => (c.id === clientToEdit.id ? updated : c)));
        addToast('Client Updated', `${formData.name}'s profile has been updated.`);
        if (selectedClient && selectedClient.id === clientToEdit.id) {
          setSelectedClient(updated);
        }
      } else {
        const created = await api.createClient(formData);
        setClients((prev) => [created, ...prev]);
        addToast('Client Registered', `${formData.name} added to your client roster.`);
      }
      setIsNewClientOpen(false);
      setClientToEdit(null);
    } catch (err) {
      addToast('Error', err.message, 'error');
    }
  };

  const handleDeleteClient = async (id) => {
    if (!window.confirm('Are you sure you want to delete this client profile?')) return;
    try {
      await api.deleteClient(id);
      setClients((prev) => prev.filter((c) => c.id !== id));
      setIsClientDetailOpen(false);
      addToast('Client Removed', 'Client profile deleted successfully.');
    } catch (err) {
      addToast('Error', err.message, 'error');
    }
  };

  // Appointment Handlers
  const handleSaveAppointment = async (formData) => {
    try {
      if (appointmentToEdit) {
        const updated = await api.updateAppointment(appointmentToEdit.id, formData);
        setAppointments((prev) =>
          prev.map((a) => (a.id === appointmentToEdit.id ? updated : a))
        );
        addToast('Appointment Updated', `Booking for ${formData.clientName} updated.`);
      } else {
        const created = await api.createAppointment(formData);
        setAppointments((prev) => [created, ...prev]);
        addToast(
          'Appointment Booked!',
          `Scheduled for ${formData.clientName} on ${formData.date} at ${formData.time}.`
        );
      }
      setIsNewAppointmentOpen(false);
      setAppointmentToEdit(null);
      setPreselectedClientForAppointment(null);
    } catch (err) {
      addToast('Error', err.message, 'error');
    }
  };

  const handleUpdateAppointmentStatus = async (id, status) => {
    try {
      const updated = await api.updateAppointmentStatus(id, status);
      setAppointments((prev) => prev.map((a) => (a.id === id ? updated : a)));
      addToast('Status Updated', `Appointment marked as ${status}.`);
      if (status === 'Completed') {
        // reload clients to update total spent/visits
        const freshClients = await api.getClients();
        setClients(freshClients);
      }
    } catch (err) {
      addToast('Error', err.message, 'error');
    }
  };

  const handleDeleteAppointment = async (id) => {
    if (!window.confirm('Are you sure you want to delete this appointment?')) return;
    try {
      await api.deleteAppointment(id);
      setAppointments((prev) => prev.filter((a) => a.id !== id));
      addToast('Appointment Cancelled', 'Booking deleted from schedule.');
    } catch (err) {
      addToast('Error', err.message, 'error');
    }
  };

  // Invoice Handlers
  const handleSaveInvoice = async (formData) => {
    try {
      if (invoiceToEdit) {
        const updated = await api.updateInvoice(invoiceToEdit.id, formData);
        setInvoices((prev) => prev.map((i) => (i.id === invoiceToEdit.id ? updated : i)));
        addToast('Invoice Updated', `${updated.invoiceNumber} saved.`);
      } else {
        const created = await api.createInvoice(formData);
        setInvoices((prev) => [created, ...prev]);
        addToast('Invoice Created!', `${created.invoiceNumber} ready to share with client.`);
        // Open the newly created invoice modal directly so Sirii can print or share
        setSelectedInvoice(created);
        setIsInvoiceDetailOpen(true);
      }
      setIsNewInvoiceOpen(false);
      setInvoiceToEdit(null);
      setPreselectedAppointmentForInvoice(null);
      setPreselectedClientForInvoice(null);
    } catch (err) {
      addToast('Error', err.message, 'error');
    }
  };

  const handleMarkPaid = async (id, details = {}) => {
    try {
      const paymentDetails = typeof details === 'string' ? { paymentMethod: details } : details;
      const updated = await api.updateInvoiceStatus(id, 'Paid', {
        paymentMethod: paymentDetails.paymentMethod || 'UPI (Settled)',
        utr: paymentDetails.utr,
        tip: paymentDetails.tip
      });
      setInvoices((prev) => prev.map((i) => (i.id === id ? updated : i)));
      if (selectedInvoice && selectedInvoice.id === id) {
        setSelectedInvoice(updated);
      }
      playStudioChime();
      addToast('Payment Received!', `${updated.invoiceNumber} settled via ${updated.paymentMethod || 'UPI'}.`);
    } catch (err) {
      addToast('Error', err.message, 'error');
    }
  };

  const handleDeleteInvoice = async (id) => {
    if (!window.confirm('Delete this invoice?')) return;
    try {
      await api.deleteInvoice(id);
      setInvoices((prev) => prev.filter((i) => i.id !== id));
      if (selectedInvoice && selectedInvoice.id === id) {
        setIsInvoiceDetailOpen(false);
      }
      addToast('Invoice Deleted', 'Invoice removed.');
    } catch (err) {
      addToast('Error', err.message, 'error');
    }
  };

  // Service Handlers
  const handleSaveService = async (formData) => {
    try {
      if (formData.id) {
        const updated = await api.updateService(formData.id, formData);
        setServices((prev) => prev.map((s) => (s.id === formData.id ? updated : s)));
        addToast('Service Saved', `${formData.name} updated.`);
      } else {
        const created = await api.createService(formData);
        setServices((prev) => [...prev, created]);
        addToast('Service Added', `${formData.name} added to service menu.`);
      }
    } catch (err) {
      addToast('Error', err.message, 'error');
    }
  };

  const handleDeleteService = async (id) => {
    if (!window.confirm('Delete this service?')) return;
    try {
      await api.deleteService(id);
      setServices((prev) => prev.filter((s) => s.id !== id));
      addToast('Service Removed', 'Service deleted from catalog.');
    } catch (err) {
      addToast('Error', err.message, 'error');
    }
  };

  // Settings Handlers
  const handleSaveSettings = async (formData) => {
    try {
      const updated = await api.updateSettings(formData);
      setSettings(updated);
      addToast('Settings Saved', 'Studio configurations updated successfully.');
    } catch (err) {
      addToast('Error', err.message, 'error');
    }
  };

  // Inventory & Supplies Handlers
  const handleSaveInventoryItem = async (formData) => {
    try {
      if (formData.id) {
        const updated = await api.updateInventoryItem(formData.id, formData);
        setInventory((prev) => prev.map((i) => (i.id === formData.id ? updated : i)));
        addToast('Supply Updated', `${formData.name} updated.`);
      } else {
        const created = await api.createInventoryItem(formData);
        setInventory((prev) => [created, ...prev]);
        addToast('Supply Added', `${formData.name} cataloged into studio inventory.`);
      }
    } catch (err) {
      addToast('Error', err.message, 'error');
    }
  };

  const handleAdjustInventoryStock = async (id, delta, notify = false) => {
    try {
      const updated = await api.adjustInventoryStock(id, delta, notify);
      setInventory((prev) => prev.map((i) => (i.id === id ? updated : i)));
      if (notify && updated.quantity <= updated.minThreshold) {
        addToast('Low Stock Notice', `${updated.name} dropped to ${updated.quantity} ${updated.unit}. Phone notification dispatched.`, 'info');
      }
    } catch (err) {
      addToast('Error', err.message, 'error');
    }
  };

  const handleDeleteInventoryItem = async (id) => {
    if (!window.confirm('Remove this supply item from inventory?')) return;
    try {
      await api.deleteInventoryItem(id);
      setInventory((prev) => prev.filter((i) => i.id !== id));
      addToast('Supply Removed', 'Item deleted from inventory.');
    } catch (err) {
      addToast('Error', err.message, 'error');
    }
  };

  const handleSendInventoryAlert = async () => {
    try {
      const res = await api.sendInventoryLowStockAlert();
      if (res.success) {
        addToast('Restock Alert Dispatched', `Phone alert sent for ${res.count} items.`, 'success');
        const notifs = await api.getNotifications().catch(() => []);
        setNotifications(notifs);
      } else {
        addToast('Inventory Check', res.message || 'No low-stock items detected.', 'info');
      }
    } catch (err) {
      addToast('Alert Failed', err.message, 'error');
    }
  };

  // Sanitization Checklist Handlers
  const handleToggleChecklistItem = async (id) => {
    try {
      const updated = await api.toggleChecklistItem(id, settings?.ownerName || 'Sirii');
      setChecklist((prev) => prev.map((c) => (c.id === id ? updated : c)));
      if (updated.completed) {
        playStudioChime('crystal');
        addToast('Protocol Verified', `Marked "${updated.title}" as complete.`);
      }
    } catch (err) {
      addToast('Error', err.message, 'error');
    }
  };

  const handleResetChecklist = async () => {
    if (!window.confirm("Reset all today's sanitization protocol checks for a fresh opening shift?")) return;
    try {
      const reset = await api.resetChecklist();
      setChecklist(reset);
      addToast('Checklist Reset', 'Sanitization checklist ready for opening shift.');
    } catch (err) {
      addToast('Error', err.message, 'error');
    }
  };

  // Aftercare Card Opener
  const openAftercareModal = (client, appointment = null) => {
    setAftercareClient(client);
    setAftercareAppointment(appointment);
    setIsAftercareModalOpen(true);
  };

  // Emergency Repair Handlers
  const handleCreateRepair = async (repairData) => {
    try {
      const created = await api.createRepair(repairData);
      setRepairs((prev) => [created, ...prev]);
      addToast('Repair Dispatched', `Emergency alert for ${created.clientName} sent to Sirii's phone.`);
      const notifs = await api.getNotifications().catch(() => []);
      setNotifications(notifs);
      return created;
    } catch (err) {
      addToast('Error', err.message, 'error');
      throw err;
    }
  };

  const handleUpdateRepairStatus = async (id, status) => {
    try {
      const updated = await api.updateRepairStatus(id, status);
      setRepairs((prev) => prev.map((r) => (r.id === id ? updated : r)));
      addToast('Repair Status Updated', `Marked as ${status}.`);
    } catch (err) {
      addToast('Error', err.message, 'error');
    }
  };

  // Gift Cards & Vouchers Handlers
  const handleSaveGiftCard = async (cardData) => {
    try {
      const saved = await api.createGiftCard(cardData);
      setGiftCards((prev) => [saved, ...prev.filter((c) => c.id !== saved.id)]);
      playStudioChime('celebration');
      const notifs = await api.getNotifications().catch(() => []);
      setNotifications(notifs);
      return saved;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const handleRedeemGiftCard = async (code, amount) => {
    try {
      const result = await api.redeemGiftCard(code, amount);
      if (result.card) {
        setGiftCards((prev) =>
          prev.map((c) => (c.id === result.card.id ? result.card : c))
        );
      }
      playStudioChime('crystal');
      return result;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const handleDeleteGiftCard = async (id) => {
    try {
      await api.deleteGiftCard(id);
      setGiftCards((prev) => prev.filter((c) => c.id !== id));
      addToast('Gift Certificate Deleted', '', 'info');
    } catch (err) {
      console.error(err);
      addToast('Error', 'Failed to delete gift certificate', 'error');
    }
  };

  // Client Reviews Handlers
  const handleSaveReview = async (reviewData) => {
    try {
      const saved = await api.createReview(reviewData);
      setReviews((prev) => [saved, ...prev.filter((r) => r.id !== saved.id)]);
      playStudioChime('chime');
      return saved;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const handleDeleteReview = async (id) => {
    try {
      await api.deleteReview(id);
      setReviews((prev) => prev.filter((r) => r.id !== id));
      addToast('Review Removed', '', 'info');
    } catch (err) {
      console.error(err);
      addToast('Error', 'Failed to delete review', 'error');
    }
  };

  // Press-On Nails E-Commerce Handlers
  const loadPressOnProducts = async () => {
    try {
      const fresh = isAuthenticated ? await api.getAllPressOnProducts() : await api.getPressOnProducts();
      setPressOnProducts(fresh);
    } catch (err) {
      console.error(err);
    }
  };

  const loadPressOnOrders = async () => {
    try {
      if (isAuthenticated) {
        const fresh = await api.getPressOnOrders();
        setPressOnOrders(fresh);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreatePressOnProduct = async (productData) => {
    try {
      const created = await api.createPressOnProduct(productData);
      setPressOnProducts((prev) => [created, ...prev]);
      return created;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const handleUpdatePressOnProduct = async (id, productData) => {
    try {
      const updated = await api.updatePressOnProduct(id, productData);
      setPressOnProducts((prev) => prev.map((p) => (p.id === id ? updated : p)));
      return updated;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const handleDeletePressOnProduct = async (id) => {
    try {
      await api.deletePressOnProduct(id);
      setPressOnProducts((prev) => prev.filter((p) => p.id !== id));
      addToast('Product Deleted', 'Removed from boutique catalog.', 'info');
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const handleCreatePressOnOrder = async (orderData) => {
    try {
      const created = await api.createPressOnOrder(orderData);
      setPressOnOrders((prev) => [created, ...prev]);
      setPressOnProducts((prev) =>
        prev.map((p) => {
          if (p.id === orderData.productId && p.stock !== undefined) {
            const newStock = Math.max(0, p.stock - (orderData.quantity || 1));
            return { ...p, stock: newStock, isAvailable: newStock > 0 };
          }
          return p;
        })
      );
      playStudioChime('crystal');
      addToast(
        'Press-On Order Placed!',
        `Order #${created.orderNumber} for ${created.clientName} confirmed.`,
        'success'
      );
      return created;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const handleUpdatePressOnOrder = async (id, updateData) => {
    try {
      const updated = await api.updatePressOnOrder(id, updateData);
      setPressOnOrders((prev) => prev.map((o) => (o.id === id ? updated : o)));
      return updated;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const handleDeletePressOnOrder = async (id) => {
    try {
      await api.deletePressOnOrder(id);
      setPressOnOrders((prev) => prev.filter((o) => o.id !== id));
      addToast('Order Deleted', '', 'info');
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  // Public Booking & Customizer Handlers
  const handlePublicBookingComplete = async (bookingPayload) => {
    try {
      let matchedClient = clients.find(
        (c) =>
          (c.phone && bookingPayload.clientPhone && c.phone.replace(/[^0-9]/g, '') === bookingPayload.clientPhone.replace(/[^0-9]/g, '')) ||
          (c.name && bookingPayload.clientName && c.name.trim().toLowerCase() === bookingPayload.clientName.trim().toLowerCase())
      );
      if (!matchedClient) {
        matchedClient = await api.createClient({
          name: bookingPayload.clientName,
          phone: bookingPayload.clientPhone,
          email: bookingPayload.clientEmail,
          instagram: bookingPayload.clientInstagram,
          preferredShape: 'Medium Almond',
          preferredAesthetic: '3D Chrome & Glaze',
          notes: bookingPayload.notes,
          vip: false
        });
        setClients((prev) => [matchedClient, ...prev]);
      }

      const apt = await api.createAppointment({
        ...bookingPayload,
        clientId: matchedClient.id
      });
      setAppointments((prev) => [apt, ...prev]);

      playStudioChime();
      addToast(
        'New Client Booking Received!',
        `${bookingPayload.clientName} booked for ${bookingPayload.date} at ${bookingPayload.time}. Sent alert to your phone.`
      );

      return apt;
    } catch (err) {
      addToast('Booking Error', err.message, 'error');
      throw err;
    }
  };

  const handleBookFromCustomizer = (customData) => {
    setPreselectedClientForAppointment(null);
    setAppointmentToEdit({
      price: customData.price,
      duration: customData.duration,
      customSet: customData,
      notes: `Custom Set: ${customData.shape}, ${customData.length}, ${customData.baseColor}, ${customData.finish}.`
    });
    setIsNewAppointmentOpen(true);
    addToast(
      'Custom Design Loaded',
      `Custom ${customData.shape} set (₹${Number(customData.price).toLocaleString('en-IN')}, ${customData.duration} mins) ready to schedule.`
    );
  };

  const handleInvoiceFromCustomizer = (customData) => {
    setPreselectedAppointmentForInvoice(null);
    setPreselectedClientForInvoice(null);
    const lineItems = customSetToInvoiceItems(customData);
    const subtotal = lineItems.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
    setInvoiceToEdit({
      items: lineItems,
      subtotal: subtotal || customData.price,
      total: subtotal || customData.price,
      balanceDue: subtotal || customData.price,
      status: 'Unpaid',
      notes: `Consultation custom set: ${customData.shape}, ${customData.length}, ${customData.baseColor}, ${customData.finish}.`
    });
    setIsNewInvoiceOpen(true);
  };

  // Navigation / Modal Triggers
  const openNewClient = () => {
    setClientToEdit(null);
    setIsNewClientOpen(true);
  };

  const openEditClient = (client) => {
    setClientToEdit(client);
    setIsNewClientOpen(true);
  };

  const openClientProfile = (client) => {
    setSelectedClient(client);
    setIsClientDetailOpen(true);
  };

  const openNewAppointment = (clientOrOptions = null) => {
    setAppointmentToEdit(null);
    if (clientOrOptions && typeof clientOrOptions === 'object') {
      if (clientOrOptions.date || clientOrOptions.time) {
        setPreselectedClientForAppointment(clientOrOptions.client || null);
        setPreselectedDateForAppointment(clientOrOptions.date || null);
        setPreselectedTimeForAppointment(clientOrOptions.time || null);
      } else if (clientOrOptions.name) {
        // It's a client object
        setPreselectedClientForAppointment(clientOrOptions);
        setPreselectedDateForAppointment(null);
        setPreselectedTimeForAppointment(null);
      } else {
        setPreselectedClientForAppointment(null);
        setPreselectedDateForAppointment(null);
        setPreselectedTimeForAppointment(null);
      }
    } else if (typeof clientOrOptions === 'string') {
      // Date string passed
      setPreselectedClientForAppointment(null);
      setPreselectedDateForAppointment(clientOrOptions);
      setPreselectedTimeForAppointment(null);
    } else {
      setPreselectedClientForAppointment(null);
      setPreselectedDateForAppointment(null);
      setPreselectedTimeForAppointment(null);
    }
    setIsNewAppointmentOpen(true);
  };

  const openEditAppointment = (appointment) => {
    setAppointmentToEdit(appointment);
    setPreselectedClientForAppointment(null);
    setPreselectedDateForAppointment(null);
    setPreselectedTimeForAppointment(null);
    setIsNewAppointmentOpen(true);
  };

  const openNewInvoice = (appointmentOrClient = null) => {
    setInvoiceToEdit(null);
    if (appointmentOrClient && appointmentOrClient.serviceName) {
      // It's an appointment
      setPreselectedAppointmentForInvoice(appointmentOrClient);
      setPreselectedClientForInvoice(null);
    } else if (appointmentOrClient && appointmentOrClient.preferredShape) {
      // It's a client
      setPreselectedAppointmentForInvoice(null);
      setPreselectedClientForInvoice(appointmentOrClient);
    } else {
      setPreselectedAppointmentForInvoice(null);
      setPreselectedClientForInvoice(null);
    }
    setIsNewInvoiceOpen(true);
  };

  const openInvoiceDetail = (invoice) => {
    setSelectedInvoice(invoice);
    setIsInvoiceDetailOpen(true);
  };

  // Compute live counts
  const todayStr = getKolkataTodayString();
  const todayAppointments = appointments.filter((a) => a.date === todayStr);
  const pendingAppointments = appointments.filter(
    (a) => a.status === 'Confirmed' && a.date >= todayStr
  );
  const unpaidInvoices = invoices.filter((i) => i.status !== 'Paid');

  // Main Client-Facing Website View (Default for Clients)
  if (currentTab === 'clientWebsite') {
    return (
      <div className="min-h-screen bg-studio-canvas text-studio-ink">
        {/* Toast Notifications */}
        <Toast toasts={toasts} onDismiss={removeToast} />

        <ClientWebsite
          services={services}
          settings={settings}
          reviews={reviews}
          pressOnProducts={pressOnProducts}
          onOrderPressOn={handleCreatePressOnOrder}
          hidePrices={true}
          setHidePrices={() => { }}
          onOpenPasscodeModal={() => {
            if (isAuthenticated) {
              setTabState('dashboard');
            } else {
              setPendingTab('dashboard');
              setIsPasscodeModalOpen(true);
            }
          }}
          onBookingComplete={handlePublicBookingComplete}
          onSubmitRepair={handleCreateRepair}
          onSaveReview={handleSaveReview}
          onAddToast={addToast}
        />

        {/* Studio Passcode Gate Modal (nbs0812) */}
        <PasscodeModal
          isOpen={isPasscodeModalOpen}
          onClose={() => setIsPasscodeModalOpen(false)}
          onSuccess={handleAuthSuccess}
          settings={settings}
        />

        {/* Share Catalogue Modal (With & Without Prices) */}
        <ShareCatalogueModal
          isOpen={isShareCatalogueOpen}
          onClose={() => setIsShareCatalogueOpen(false)}
          settings={settings}
          onAddToast={addToast}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-studio-canvas text-text-ink font-sans">
      {/* Toast Notifications */}
      <Toast toasts={toasts} onDismiss={removeToast} />

      {/* Left Sidebar */}
      <Sidebar
        currentTab={currentTab}
        setTab={setTab}
        settings={settings}
        onOpenShareCatalogue={() => setIsShareCatalogueOpen(true)}
        onLockStudio={handleLockStudio}
        counts={{
          todayAppointments: todayAppointments.length,
          clients: clients.length,
          pendingAppointments: pendingAppointments.length,
          unpaidInvoices: unpaidInvoices.length,
          pressOnOrders: pressOnOrders.filter((o) => o.fulfillmentStatus === 'New Order').length,
          lowStockCount: inventory.filter((i) => (Number(i.quantity) || 0) <= (Number(i.minThreshold) || 0)).length
        }}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Top Header */}
        <Header
          settings={settings}
          currentTab={currentTab}
          setTab={setTab}
          onOpenNewAppointment={() => openNewAppointment(null)}
          onOpenNewClient={openNewClient}
          onTestAlert={handleTestAlert}
          onOpenQrModal={() => setIsQrModalOpen(true)}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
          onOpenShareCatalogue={() => setIsShareCatalogueOpen(true)}
          onLockStudio={handleLockStudio}
        />

        {/* Tab View Container */}
        <main className="flex-1 px-3.5 py-4 sm:p-6 md:p-8 max-w-7xl w-full mx-auto pb-28 md:pb-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-3">
              <div className="w-10 h-10 rounded-full border-2 border-border-subtle border-t-brand-wine animate-spin" />
              <p className="font-display font-medium text-sm text-text-muted">
                Opening Nails by Sirii Studio OS...
              </p>
            </div>
          ) : (
            <>
              {currentTab === 'dashboard' && (
                <div className="space-y-4">
                  {/* Phase 2 Design Pilot Switcher Header */}
                  <div className="flex items-center justify-between p-2 rounded-2xl bg-studio-surface border border-studio-border">
                    <div className="flex items-center gap-2 pl-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-xs font-semibold text-studio-ink">
                        {designMode === 'pilot' ? 'Redesigned "Today" Pilot (Mobile-First)' : 'Classic Dashboard Baseline'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 bg-studio-canvas p-1 rounded-xl border border-studio-border">
                      <button
                        onClick={() => setDesignMode('pilot')}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${designMode === 'pilot' ? 'bg-studio-wine text-white shadow-xs' : 'text-studio-secondary hover:text-studio-ink'
                          }`}
                      >
                        Redesigned Pilot
                      </button>
                      <button
                        onClick={() => setDesignMode('classic')}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${designMode === 'classic' ? 'bg-studio-wine text-white shadow-xs' : 'text-studio-secondary hover:text-studio-ink'
                          }`}
                      >
                        Classic Baseline
                      </button>
                    </div>
                  </div>

                  {designMode === 'pilot' ? (
                    <StudioTodayPilot
                      appointments={appointments}
                      clients={clients}
                      invoices={invoices}
                      repairs={repairs}
                      checklist={checklist}
                      settings={settings}
                      onOpenNewAppointment={() => openNewAppointment(null)}
                      onOpenNewInvoice={() => openNewInvoice(null)}
                      onOpenClientProfile={openClientProfile}
                      onUpdateStatus={handleUpdateAppointmentStatus}
                      onTestAlert={handleTestAlert}
                      onLockStudio={handleLockStudio}
                      onSwitchTab={setTab}
                    />
                  ) : (
                    <DashboardView
                      overview={overview}
                      appointments={appointments}
                      clients={clients}
                      invoices={invoices}
                      settings={settings}
                      inventory={inventory}
                      checklist={checklist}
                      repairs={repairs}
                      onUpdateRepairStatus={handleUpdateRepairStatus}
                      onToggleChecklistItem={handleToggleChecklistItem}
                      onRemindAppointment={handleRemindAppointment}
                      onOpenNewAppointment={() => openNewAppointment(null)}
                      onOpenNewClient={openNewClient}
                      onOpenNewInvoice={openNewInvoice}
                      onOpenInvoiceDetail={openInvoiceDetail}
                      onOpenClientProfile={openClientProfile}
                      onUpdateAppointmentStatus={handleUpdateAppointmentStatus}
                      onTestAlert={handleTestAlert}
                      onOpenQrModal={() => setIsQrModalOpen(true)}
                      setTab={setTab}
                    />
                  )}
                </div>
              )}

              {currentTab === 'inventory' && (
                <InventoryView
                  inventory={inventory}
                  checklist={checklist}
                  onSaveItem={handleSaveInventoryItem}
                  onAdjustStock={handleAdjustInventoryStock}
                  onDeleteItem={handleDeleteInventoryItem}
                  onSendLowStockAlert={handleSendInventoryAlert}
                  onToggleChecklistItem={handleToggleChecklistItem}
                  onResetChecklist={handleResetChecklist}
                  onAddToast={addToast}
                />
              )}

              {currentTab === 'clients' && (
                <ClientsView
                  clients={clients}
                  onOpenNewClient={openNewClient}
                  onOpenClientProfile={openClientProfile}
                  onBookAppointment={(c) => openNewAppointment(c)}
                  onCreateInvoice={(c) => openNewInvoice(c)}
                />
              )}

              {currentTab === 'appointments' && (
                <AppointmentsView
                  appointments={appointments}
                  clients={clients}
                  settings={settings}
                  repairs={repairs}
                  onUpdateRepairStatus={handleUpdateRepairStatus}
                  onOpenNewAppointment={() => openNewAppointment(null)}
                  onEditAppointment={openEditAppointment}
                  onDeleteAppointment={handleDeleteAppointment}
                  onUpdateStatus={handleUpdateAppointmentStatus}
                  onRemindAppointment={handleRemindAppointment}
                  onOpenNewInvoice={openNewInvoice}
                  onOpenClientProfile={openClientProfile}
                />
              )}

              {currentTab === 'invoices' && (
                <InvoicesView
                  invoices={invoices}
                  settings={settings}
                  onOpenNewInvoice={openNewInvoice}
                  onOpenInvoiceDetail={openInvoiceDetail}
                  onMarkPaid={handleMarkPaid}
                  onDeleteInvoice={handleDeleteInvoice}
                />
              )}

              {currentTab === 'giftcards' && (
                <GiftCardsView
                  giftCards={giftCards}
                  onSaveGiftCard={handleSaveGiftCard}
                  onRedeemGiftCard={handleRedeemGiftCard}
                  onDeleteGiftCard={handleDeleteGiftCard}
                  onAddToast={addToast}
                />
              )}

              {currentTab === 'services' && (
                <ServicesView
                  services={services}
                  onSaveService={handleSaveService}
                  onDeleteService={handleDeleteService}
                />
              )}

              {currentTab === 'reminders' && (
                <RemindersView
                  settings={settings}
                  notifications={notifications}
                  onUpdateSettings={handleSaveSettings}
                  onSendTestNotification={handleTestAlert}
                  onRefreshNotifications={async () => {
                    const fresh = await api.getNotifications();
                    setNotifications(fresh);
                  }}
                />
              )}

              {currentTab === 'pressons' && (
                <PressOnsView
                  products={pressOnProducts}
                  orders={pressOnOrders}
                  settings={settings}
                  onRefreshProducts={loadPressOnProducts}
                  onRefreshOrders={loadPressOnOrders}
                  onCreateProduct={handleCreatePressOnProduct}
                  onUpdateProduct={handleUpdatePressOnProduct}
                  onDeleteProduct={handleDeletePressOnProduct}
                  onUpdateOrder={handleUpdatePressOnOrder}
                  onDeleteOrder={handleDeletePressOnOrder}
                  onAddToast={addToast}
                />
              )}

              {currentTab === 'customizer' && (
                <NailCustomizerView
                  onBookCustomDesign={handleBookFromCustomizer}
                  onCreateInvoiceFromDesign={handleInvoiceFromCustomizer}
                  onSwitchToStudio={() => setTab('dashboard')}
                />
              )}

              {currentTab === 'publicBooking' && (
                <PublicBookingView
                  services={services}
                  settings={settings}
                  reviews={reviews}
                  pressOnProducts={pressOnProducts}
                  onOrderPressOn={handleCreatePressOnOrder}
                  onBookingComplete={handlePublicBookingComplete}
                  onSubmitRepair={handleCreateRepair}
                  onSaveReview={handleSaveReview}
                  onSwitchToStudio={() => setTab('dashboard')}
                  onAddToast={addToast}
                />
              )}

              {currentTab === 'publicInvoice' && (
                <PublicInvoiceView
                  invoice={selectedInvoice || invoices[0]}
                  settings={settings}
                  onMarkPaid={handleMarkPaid}
                  onReturnToStudio={() => setTab('invoices')}
                />
              )}

              {currentTab === 'analytics' && (
                <AnalyticsView
                  clients={clients}
                  appointments={appointments}
                  invoices={invoices}
                  services={services}
                  settings={settings}
                />
              )}

              {currentTab === 'settings' && (
                <SettingsView
                  settings={settings}
                  onSaveSettings={handleSaveSettings}
                />
              )}
            </>
          )}
        </main>
      </div>

      {/* Global Modals */}
      <NewClientModal
        isOpen={isNewClientOpen}
        onClose={() => setIsNewClientOpen(false)}
        onSave={handleSaveClient}
        clientToEdit={clientToEdit}
      />

      <NewAppointmentModal
        isOpen={isNewAppointmentOpen}
        onClose={() => setIsNewAppointmentOpen(false)}
        onSave={handleSaveAppointment}
        clients={clients}
        services={services}
        preselectedClient={preselectedClientForAppointment}
        preselectedDate={preselectedDateForAppointment}
        preselectedTime={preselectedTimeForAppointment}
        appointmentToEdit={appointmentToEdit}
      />

      <NewInvoiceModal
        isOpen={isNewInvoiceOpen}
        onClose={() => setIsNewInvoiceOpen(false)}
        onSave={handleSaveInvoice}
        clients={clients}
        services={services}
        preselectedAppointment={preselectedAppointmentForInvoice}
        preselectedClient={preselectedClientForInvoice}
        invoiceToEdit={invoiceToEdit}
      />

      <InvoiceModal
        invoice={selectedInvoice}
        settings={settings}
        isOpen={isInvoiceDetailOpen}
        onClose={() => setIsInvoiceDetailOpen(false)}
        onMarkPaid={handleMarkPaid}
        onUpdateStatus={handleSaveInvoice}
        onOpenPublicInvoice={(inv) => {
          setSelectedInvoice(inv);
          setTab('publicInvoice');
        }}
      />

      <ClientDetailDrawer
        client={selectedClient}
        appointments={appointments}
        invoices={invoices}
        isOpen={isClientDetailOpen}
        onClose={() => setIsClientDetailOpen(false)}
        onEditClient={openEditClient}
        onDeleteClient={handleDeleteClient}
        onBookAppointment={(c) => {
          setIsClientDetailOpen(false);
          openNewAppointment(c);
        }}
        onOpenInvoice={(inv) => {
          setIsClientDetailOpen(false);
          openInvoiceDetail(inv);
        }}
        onCreateInvoice={(c) => {
          setIsClientDetailOpen(false);
          openNewInvoice(c);
        }}
        onOpenMessageModal={(c) => openQuickMessage(c)}
        onOpenAftercareModal={(c, apt) => openAftercareModal(c, apt)}
      />

      <AftercareCardModal
        isOpen={isAftercareModalOpen}
        onClose={() => setIsAftercareModalOpen(false)}
        client={aftercareClient}
        appointment={aftercareAppointment}
        settings={settings}
        onAddToast={addToast}
      />

      <QuickMessageModal
        isOpen={isQuickMessageOpen}
        onClose={() => setIsQuickMessageOpen(false)}
        client={quickMessageClient}
        appointment={quickMessageAppointment}
        settings={settings}
      />

      <QrModal
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
        settings={settings}
        onTestAlert={handleTestAlert}
      />

      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        clients={clients}
        appointments={appointments}
        invoices={invoices}
        onSelectClient={openClientProfile}
        onSelectAppointment={() => setTab('appointments')}
        onSelectInvoice={openInvoiceDetail}
        onAction={(actId) => {
          if (actId === 'new_apt') openNewAppointment(null);
          else if (actId === 'new_client') openNewClient();
          else if (actId === 'new_invoice') openNewInvoice(null);
          else if (actId === 'giftcards') setTab('giftcards');
          else if (actId === 'repairs_queue') setTab('appointments');
          else if (actId === 'aftercare') openAftercareModal(clients[0] || null, appointments[0] || null);
          else if (actId === 'inventory' || actId === 'sanitization') setTab('inventory');
          else if (actId === 'restock_alert') handleSendInventoryAlert();
          else if (actId === 'customizer') setTab('customizer');
          else if (actId === 'portal') setTab('clientWebsite');
          else if (actId === 'test_phone') handleTestAlert();
          else if (actId === 'export_csv') {
            window.location.href = '/api/backup/invoices-csv';
          }
        }}
      />

      {/* Mobile-First Bottom Navigation Bar */}
      <MobileBottomNav
        currentTab={currentTab}
        setTab={setTab}
        counts={{
          todayAppointments: todayAppointments.length,
          pendingAppointments: pendingAppointments.length,
          unpaidInvoices: unpaidInvoices.length,
          lowStockCount: inventory.filter(
            (i) => (Number(i.quantity) || 0) <= (Number(i.minThreshold) || 0)
          ).length,
          pendingRepairs: repairs.filter((r) => r.status === 'Pending Squeeze-in').length
        }}
        onOpenQuickAction={() => setIsMobileQuickActionOpen(true)}
        onOpenHubSheet={() => setIsMobileHubSheetOpen(true)}
      />

      {/* Mobile Center Quick Action Bottom Sheet */}
      <MobileQuickActionSheet
        isOpen={isMobileQuickActionOpen}
        onClose={() => setIsMobileQuickActionOpen(false)}
        onOpenNewAppointment={() => openNewAppointment(null)}
        onOpenNewClient={openNewClient}
        onOpenNewInvoice={() => openNewInvoice(null)}
        onOpenRepairQueue={() => setTab('appointments')}
        onOpenGiftCard={() => setTab('giftcards')}
        onOpenQrModal={() => setIsQrModalOpen(true)}
        onOpenShareCatalogue={() => setIsShareCatalogueOpen(true)}
      />

      {/* Mobile Studio Hub Bottom Sheet */}
      <MobileStudioHubSheet
        isOpen={isMobileHubSheetOpen}
        onClose={() => setIsMobileHubSheetOpen(false)}
        setTab={setTab}
        counts={{
          todayAppointments: todayAppointments.length,
          unpaidInvoices: unpaidInvoices.length,
          lowStockCount: inventory.filter(
            (i) => (Number(i.quantity) || 0) <= (Number(i.minThreshold) || 0)
          ).length,
          pendingRepairs: repairs.filter((r) => r.status === 'Pending Squeeze-in').length
        }}
        onOpenQrModal={() => setIsQrModalOpen(true)}
      />

      {/* Studio Passcode Gate Modal (nbs0812) */}
      <PasscodeModal
        isOpen={isPasscodeModalOpen}
        onClose={() => setIsPasscodeModalOpen(false)}
        onSuccess={handleAuthSuccess}
        settings={settings}
      />

      {/* Share Catalogue Modal */}
      <ShareCatalogueModal
        isOpen={isShareCatalogueOpen}
        onClose={() => setIsShareCatalogueOpen(false)}
        settings={settings}
        onAddToast={addToast}
      />
    </div>
  );
}
