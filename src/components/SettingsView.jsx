import React, { useState, useEffect } from 'react';
import {
  Settings,
  Sparkles,
  CreditCard,
  Smartphone,
  Save,
  CheckCircle2,
  MapPin,
  Phone,
  Mail,
  Download,
  FileSpreadsheet,
  Image,
  Upload,
  QrCode,
  Lock,
  KeyRound
} from 'lucide-react';
import { InstagramIcon } from './Icons';
import StudioLogo from './StudioLogo';

export default function SettingsView({ settings, onSaveSettings }) {
  const [formData, setFormData] = useState({
    studioName: settings?.studioName || 'Nails by Sirii',
    tagline: settings?.tagline || 'Affordable Nail Studio & Academy in Dehradun',
    ownerName: settings?.ownerName || 'Simran (Sirii)',
    phone: settings?.phone || '+91 73026 23493',
    email: settings?.email || 'hello@nailsbysirii.com',
    address: settings?.address || 'Shop No. 7, Laxmi Navraj Plaza, Garhi Cantonment, Garhi Cantt, Dehradun, Uttarakhand 248003',
    instagram: settings?.instagram || '@nails.by.sirii',
    currency: settings?.currency || '₹',
    studioLogoUrl: settings?.studioLogoUrl || '/logo.png',
    upiId: settings?.upiId || 'nailsbysirii@okaxis',
    upiName: settings?.upiName || 'Nails by Sirii',
    ntfyTopic: settings?.ntfyTopic || 'nails-by-sirii-alerts',
    ntfyServer: settings?.ntfyServer || 'https://ntfy.sh',
    reminderLeadHours: settings?.reminderLeadHours || 2,
    autoRemindersEnabled: Boolean(settings?.autoRemindersEnabled ?? true),
    paymentInstructions:
      settings?.paymentInstructions ||
      'UPI: 7302623493 / nailsbysirii@okaxis (GPay, PhonePe, Paytm) • Cash accepted at studio',
    depositRequirement: settings?.depositRequirement || 500,
    studioPasscode: settings?.studioPasscode || 'nbs0812'
  });

  const [saving, setSaving] = useState(false);
  const [logoUploadedMsg, setLogoUploadedMsg] = useState(false);

  useEffect(() => {
    if (settings) {
      setFormData((prev) => ({
        ...prev,
        studioName: settings.studioName || prev.studioName,
        tagline: settings.tagline || prev.tagline,
        ownerName: settings.ownerName || prev.ownerName,
        phone: settings.phone || prev.phone,
        email: settings.email || prev.email,
        address: settings.address || prev.address,
        instagram: settings.instagram || prev.instagram,
        currency: settings.currency || prev.currency,
        studioLogoUrl: settings.studioLogoUrl || prev.studioLogoUrl,
        upiId: settings.upiId || prev.upiId,
        upiName: settings.upiName || prev.upiName,
        ntfyTopic: settings.ntfyTopic || prev.ntfyTopic,
        ntfyServer: settings.ntfyServer || prev.ntfyServer,
        reminderLeadHours: settings.reminderLeadHours ?? prev.reminderLeadHours,
        autoRemindersEnabled: Boolean(settings.autoRemindersEnabled ?? prev.autoRemindersEnabled),
        paymentInstructions: settings.paymentInstructions || prev.paymentInstructions,
        depositRequirement: settings.depositRequirement ?? prev.depositRequirement,
        studioPasscode: settings.studioPasscode || prev.studioPasscode
      }));
    }
  }, [settings]);

  const handleLogoFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        const base64Url = loadEvent.target?.result;
        if (base64Url) {
          setFormData({ ...formData, studioLogoUrl: base64Url });
          setLogoUploadedMsg(true);
          setTimeout(() => setLogoUploadedMsg(false), 3000);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    await onSaveSettings(formData);
    setSaving(false);
  };

  return (
    <div className="space-y-6 max-w-4xl animate-fade-in pb-16">
      {/* Header */}
      <div>
        <h2 className="font-serif italic font-bold text-2xl text-atelier-noir">
          Studio & System Settings
        </h2>
        <p className="text-xs text-atelier-muted">
          Configure branding, UPI billing parameters in Rupees (₹), custom logo, and instant phone alert triggers.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 text-xs">
        {/* Studio Identity & Custom Logo */}
        <div className="bg-white rounded-3xl p-6 border border-atelier-champagneBorder shadow-xs space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-atelier-champagneBorder/60">
            <Sparkles className="w-4 h-4 text-atelier-rose500" />
            <h3 className="font-serif italic font-bold text-base text-atelier-noir">
              Studio Identity & Brand Logo
            </h3>
          </div>

          {/* Logo Section */}
          <div className="p-4 rounded-2xl bg-atelier-cream/40 border border-atelier-champagneBorder/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <StudioLogo logoUrl={formData.studioLogoUrl} size="lg" />
              <div>
                <span className="font-bold text-atelier-noir block">
                  Studio Logo & Insignia
                </span>
                <p className="text-[11px] text-atelier-muted">
                  Displays on your mobile app bar, client digital invoices, printed receipts, and appointment cards.
                </p>
                {logoUploadedMsg && (
                  <span className="text-[11px] font-semibold text-emerald-600 block mt-1">
                    Custom logo image loaded! Save settings to apply everywhere.
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <label className="cursor-pointer px-3.5 py-2 rounded-xl bg-white border border-atelier-champagneBorder hover:border-atelier-rose400 text-atelier-charcoal font-semibold text-xs transition-all shadow-xs flex items-center justify-center gap-1.5 w-full sm:w-auto">
                <Upload className="w-3.5 h-3.5 text-atelier-rose600" />
                <span>Upload Logo File</span>
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/svg+xml, image/webp"
                  onChange={handleLogoFileChange}
                  className="hidden"
                />
              </label>

              {formData.studioLogoUrl !== '/logo.png' && (
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, studioLogoUrl: '/logo.png' })}
                  className="px-2.5 py-2 rounded-xl text-[11px] text-atelier-muted hover:text-atelier-rose600"
                >
                  Reset to NBS Logo
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-atelier-charcoal mb-1">
                Studio Brand Name *
              </label>
              <input
                type="text"
                required
                value={formData.studioName}
                onChange={(e) => setFormData({ ...formData, studioName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-atelier-champagneBorder bg-atelier-cream/40 focus:bg-white focus:border-atelier-rose400 outline-none text-base sm:text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-atelier-charcoal mb-1">
                Owner / Lead Artist Name *
              </label>
              <input
                type="text"
                required
                value={formData.ownerName}
                onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-atelier-champagneBorder bg-atelier-cream/40 focus:bg-white focus:border-atelier-rose400 outline-none text-base sm:text-xs"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-atelier-charcoal mb-1">
                Tagline / Subtitle
              </label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-atelier-champagneBorder bg-atelier-cream/40 focus:bg-white focus:border-atelier-rose400 outline-none text-base sm:text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-atelier-charcoal mb-1">
                Studio Phone / WhatsApp *
              </label>
              <input
                type="text"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-atelier-champagneBorder bg-atelier-cream/40 focus:bg-white focus:border-atelier-rose400 outline-none text-base sm:text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-atelier-charcoal mb-1">
                Studio Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-atelier-champagneBorder bg-atelier-cream/40 focus:bg-white focus:border-atelier-rose400 outline-none text-base sm:text-xs"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-atelier-charcoal mb-1">
                Studio Physical Address
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-atelier-champagneBorder bg-atelier-cream/40 focus:bg-white focus:border-atelier-rose400 outline-none text-base sm:text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-atelier-charcoal mb-1">
                Instagram Handle
              </label>
              <input
                type="text"
                value={formData.instagram}
                onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-atelier-champagneBorder bg-atelier-cream/40 focus:bg-white focus:border-atelier-rose400 outline-none text-base sm:text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-atelier-charcoal mb-1">
                Logo URL or Path
              </label>
              <input
                type="text"
                value={formData.studioLogoUrl}
                onChange={(e) => setFormData({ ...formData, studioLogoUrl: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-atelier-champagneBorder bg-atelier-cream/40 focus:bg-white focus:border-atelier-rose400 outline-none text-base sm:text-xs font-mono"
              />
            </div>
          </div>
        </div>

        {/* UPI & Billing Settings in Rupees */}
        <div className="bg-white rounded-3xl p-6 border border-atelier-champagneBorder shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-atelier-champagneBorder/60">
            <QrCode className="w-4 h-4 text-atelier-rose500" />
            <h3 className="font-serif italic font-bold text-base text-atelier-noir">
              UPI Billing & Payment Integration (Rupees)
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-atelier-charcoal mb-1">
                UPI ID / VPA *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. nailsbysirii@okaxis"
                value={formData.upiId}
                onChange={(e) => setFormData({ ...formData, upiId: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-atelier-champagneBorder bg-atelier-cream/40 focus:bg-white focus:border-atelier-rose400 outline-none text-base sm:text-xs font-mono font-semibold"
              />
              <span className="text-[10px] text-atelier-muted mt-0.5 block">
                Generates dynamic UPI QR codes for GPay, PhonePe, Paytm, and BHIM.
              </span>
            </div>

            <div>
              <label className="block font-semibold text-atelier-charcoal mb-1">
                UPI Payee Name
              </label>
              <input
                type="text"
                value={formData.upiName}
                onChange={(e) => setFormData({ ...formData, upiName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-atelier-champagneBorder bg-atelier-cream/40 focus:bg-white focus:border-atelier-rose400 outline-none text-base sm:text-xs font-semibold"
              />
            </div>

            <div>
              <label className="block font-semibold text-atelier-charcoal mb-1">
                Currency Symbol
              </label>
              <input
                type="text"
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-atelier-champagneBorder bg-atelier-cream/40 focus:bg-white focus:border-atelier-rose400 outline-none text-base sm:text-xs font-bold"
              />
            </div>

            <div>
              <label className="block font-semibold text-atelier-charcoal mb-1">
                Default Booking Deposit (₹)
              </label>
              <input
                type="number"
                min="0"
                step="50"
                value={formData.depositRequirement}
                onChange={(e) => setFormData({ ...formData, depositRequirement: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-atelier-champagneBorder bg-atelier-cream/40 focus:bg-white focus:border-atelier-rose400 outline-none text-base sm:text-xs font-semibold"
              />
            </div>

            <div>
              <label className="block font-semibold text-atelier-charcoal mb-1 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-atelier-rose500" />
                <span>Studio Hub Security Passcode</span>
              </label>
              <input
                type="text"
                value={formData.studioPasscode}
                onChange={(e) => setFormData({ ...formData, studioPasscode: e.target.value })}
                placeholder="nbs0812"
                className="w-full px-3.5 py-2.5 rounded-xl border border-atelier-champagneBorder bg-atelier-cream/40 focus:bg-white focus:border-atelier-rose400 outline-none text-base sm:text-xs font-mono font-bold tracking-wider"
              />
              <p className="text-[10px] text-atelier-muted mt-1">
                Password required to unlock your private Studio Hub (Default: nbs0812)
              </p>
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-atelier-charcoal mb-1">
                Payment Instructions on Invoices
              </label>
              <textarea
                rows={2}
                value={formData.paymentInstructions}
                onChange={(e) => setFormData({ ...formData, paymentInstructions: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-atelier-champagneBorder bg-atelier-cream/40 focus:bg-white focus:border-atelier-rose400 outline-none text-base sm:text-xs"
              />
            </div>
          </div>
        </div>

        {/* Mobile Push Reminders Configuration */}
        <div className="bg-white rounded-3xl p-6 border border-atelier-champagneBorder shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-atelier-champagneBorder/60">
            <Smartphone className="w-4 h-4 text-atelier-rose500" />
            <h3 className="font-serif italic font-bold text-base text-atelier-noir">
              Ntify Mobile Push Alert Parameters
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-atelier-charcoal mb-1">
                NTFY Server URL
              </label>
              <input
                type="text"
                value={formData.ntfyServer}
                onChange={(e) => setFormData({ ...formData, ntfyServer: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-atelier-champagneBorder bg-atelier-cream/40 focus:bg-white focus:border-atelier-rose400 outline-none text-base sm:text-xs font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-atelier-charcoal mb-1">
                Notification Topic
              </label>
              <input
                type="text"
                value={formData.ntfyTopic}
                onChange={(e) => setFormData({ ...formData, ntfyTopic: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-atelier-champagneBorder bg-atelier-cream/40 focus:bg-white focus:border-atelier-rose400 outline-none text-base sm:text-xs font-mono"
              />
            </div>
          </div>
        </div>

        {/* Studio Backup & Accountant Export */}
        <div className="bg-white rounded-3xl p-6 border border-atelier-champagneBorder shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-atelier-champagneBorder/60">
            <Download className="w-4 h-4 text-atelier-rose500" />
            <h3 className="font-serif italic font-bold text-base text-atelier-noir">
              Data Backup & Accounting Reports (₹)
            </h3>
          </div>

          <p className="text-xs text-atelier-muted">
            Download your full client records and export CSV spreadsheets for your accountant or tax filing.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <a
              href="/api/backup/invoices-csv"
              download
              className="px-4 py-2.5 rounded-xl border border-atelier-champagneBorder bg-white hover:bg-atelier-cream text-atelier-charcoal font-semibold text-xs transition-colors flex items-center gap-2 shadow-xs"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span>Download Invoices CSV Spreadsheet</span>
            </a>

            <a
              href="/api/backup/export"
              download
              className="px-4 py-2.5 rounded-xl border border-atelier-champagneBorder bg-white hover:bg-atelier-cream text-atelier-charcoal font-semibold text-xs transition-colors flex items-center gap-2 shadow-xs"
            >
              <Download className="w-4 h-4 text-atelier-noir" />
              <span>Download Full System Backup (.JSON)</span>
            </a>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 rounded-2xl bg-atelier-rose500 hover:bg-atelier-rose600 text-white font-semibold text-xs shadow-soft transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Studio Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
