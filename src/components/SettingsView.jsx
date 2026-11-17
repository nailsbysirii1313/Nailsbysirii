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
  KeyRound,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';
import StudioLogo from './StudioLogo';

export default function SettingsView({ settings, onSaveSettings }) {
  const [formData, setFormData] = useState({
    studioName: settings?.studioName || 'Nails by Sirii',
    tagline: settings?.tagline || 'Sculptural Gel Architecture & Contemporary Nail Atelier',
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
      'UPI: 7302623493 / nailsbysirii@okaxis (GPay, PhonePe, Paytm) • Studio cash payments welcomed',
    depositRequirement: settings?.depositRequirement || 500,
    studioPasscode: ''
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
        studioPasscode: ''
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
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-studio-canvas border border-border-subtle text-brand-wine text-xs font-semibold mb-2">
          <Settings className="w-3.5 h-3.5" />
          <span>System & Studio Operations</span>
        </div>
        <h2 className="font-display font-semibold text-2xl sm:text-3xl text-text-ink tracking-tight">
          Studio Settings
        </h2>
        <p className="text-xs sm:text-sm text-text-muted mt-1 leading-relaxed">
          Manage atelier branding, UPI digital billing parameters in Rupees (₹), operating hours, passcodes, and NTFY notification triggers.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 text-xs">
        {/* Studio Identity & Brand Logo */}
        <div className="bg-studio-surface rounded-3xl p-5 sm:p-7 border border-border-subtle shadow-xs space-y-5">
          <div className="flex items-center gap-2.5 pb-4 border-b border-border-subtle">
            <Sparkles className="w-4 h-4 text-brand-wine" />
            <h3 className="font-display font-semibold text-base text-text-ink">
              Atelier Identity & Insignia
            </h3>
          </div>

          {/* Logo Section */}
          <div className="p-4 sm:p-5 rounded-2xl bg-studio-canvas/60 border border-border-subtle flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <StudioLogo logoUrl={formData.studioLogoUrl} size="lg" />
              <div>
                <span className="font-bold text-text-ink text-sm block">
                  Studio Insignia & Brand Mark
                </span>
                <p className="text-xs text-text-muted mt-0.5 leading-relaxed">
                  Appears on client digital invoices, printed studio receipts, mobile navigation, and booking confirmation cards.
                </p>
                {logoUploadedMsg && (
                  <span className="text-xs font-semibold text-emerald-700 block mt-1">
                    Custom logo image loaded! Click Save to apply.
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <label className="cursor-pointer px-4 py-2.5 rounded-2xl bg-studio-surface border border-border-subtle hover:border-brand-wine text-text-ink font-semibold text-xs transition-all shadow-xs flex items-center justify-center gap-2 w-full sm:w-auto min-h-[44px]">
                <Upload className="w-4 h-4 text-brand-wine" />
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
                  className="px-3 py-2.5 rounded-2xl text-xs text-text-muted hover:text-brand-wine transition-colors min-h-[44px]"
                  title="Reset to default monogram"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-text-ink mb-1.5">
                Studio Brand Name *
              </label>
              <input
                type="text"
                required
                value={formData.studioName}
                onChange={(e) => setFormData({ ...formData, studioName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-border-subtle bg-studio-canvas/40 focus:bg-white focus:border-brand-wine outline-none text-base sm:text-xs text-text-ink font-semibold"
              />
            </div>

            <div>
              <label className="block font-semibold text-text-ink mb-1.5">
                Owner / Lead Artist Name *
              </label>
              <input
                type="text"
                required
                value={formData.ownerName}
                onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-border-subtle bg-studio-canvas/40 focus:bg-white focus:border-brand-wine outline-none text-base sm:text-xs text-text-ink font-semibold"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-text-ink mb-1.5">
                Tagline / Subtitle
              </label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-border-subtle bg-studio-canvas/40 focus:bg-white focus:border-brand-wine outline-none text-base sm:text-xs text-text-ink"
              />
            </div>

            <div>
              <label className="block font-semibold text-text-ink mb-1.5">
                Studio Phone / WhatsApp *
              </label>
              <input
                type="text"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-border-subtle bg-studio-canvas/40 focus:bg-white focus:border-brand-wine outline-none text-base sm:text-xs text-text-ink font-medium"
              />
            </div>

            <div>
              <label className="block font-semibold text-text-ink mb-1.5">
                Studio Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-border-subtle bg-studio-canvas/40 focus:bg-white focus:border-brand-wine outline-none text-base sm:text-xs text-text-ink font-medium"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-text-ink mb-1.5">
                Studio Physical Address
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-border-subtle bg-studio-canvas/40 focus:bg-white focus:border-brand-wine outline-none text-base sm:text-xs text-text-ink font-medium"
              />
            </div>

            <div>
              <label className="block font-semibold text-text-ink mb-1.5">
                Instagram Handle
              </label>
              <input
                type="text"
                value={formData.instagram}
                onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-border-subtle bg-studio-canvas/40 focus:bg-white focus:border-brand-wine outline-none text-base sm:text-xs text-text-ink font-medium"
              />
            </div>

            <div>
              <label className="block font-semibold text-text-ink mb-1.5">
                Logo URL or Asset Path
              </label>
              <input
                type="text"
                value={formData.studioLogoUrl}
                onChange={(e) => setFormData({ ...formData, studioLogoUrl: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-border-subtle bg-studio-canvas/40 focus:bg-white focus:border-brand-wine outline-none text-base sm:text-xs font-mono text-text-ink"
              />
            </div>
          </div>
        </div>

        {/* UPI & Billing Settings in Rupees */}
        <div className="bg-studio-surface rounded-3xl p-5 sm:p-7 border border-border-subtle shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-4 border-b border-border-subtle">
            <QrCode className="w-4 h-4 text-brand-wine" />
            <h3 className="font-display font-semibold text-base text-text-ink">
              UPI Billing & Payment Parameters (Rupees ₹)
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-text-ink mb-1.5">
                UPI ID / VPA *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. nailsbysirii@okaxis"
                value={formData.upiId}
                onChange={(e) => setFormData({ ...formData, upiId: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-border-subtle bg-studio-canvas/40 focus:bg-white focus:border-brand-wine outline-none text-base sm:text-xs font-mono font-semibold text-text-ink"
              />
              <span className="text-[11px] text-text-muted mt-1 block">
                Generates dynamic UPI QR codes for GPay, PhonePe, Paytm, and BHIM.
              </span>
            </div>

            <div>
              <label className="block font-semibold text-text-ink mb-1.5">
                UPI Payee Name
              </label>
              <input
                type="text"
                value={formData.upiName}
                onChange={(e) => setFormData({ ...formData, upiName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-border-subtle bg-studio-canvas/40 focus:bg-white focus:border-brand-wine outline-none text-base sm:text-xs text-text-ink font-semibold"
              />
            </div>

            <div>
              <label className="block font-semibold text-text-ink mb-1.5">
                Currency Symbol
              </label>
              <input
                type="text"
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-border-subtle bg-studio-canvas/40 focus:bg-white focus:border-brand-wine outline-none text-base sm:text-xs text-text-ink font-bold"
              />
            </div>

            <div>
              <label className="block font-semibold text-text-ink mb-1.5">
                Standard Booking Deposit (₹)
              </label>
              <input
                type="number"
                min="0"
                step="50"
                value={formData.depositRequirement}
                onChange={(e) => setFormData({ ...formData, depositRequirement: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-border-subtle bg-studio-canvas/40 focus:bg-white focus:border-brand-wine outline-none text-base sm:text-xs font-semibold text-text-ink"
              />
            </div>

            <div>
              <label className="block font-semibold text-text-ink mb-1.5 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-brand-wine" />
                <span>Studio Hub Security Passcode</span>
              </label>
              <input
                type="password"
                value={formData.studioPasscode}
                onChange={(e) => setFormData({ ...formData, studioPasscode: e.target.value })}
                placeholder="Enter new passcode (leave blank to keep current)"
                className="w-full px-3.5 py-2.5 rounded-xl border border-border-subtle bg-studio-canvas/40 focus:bg-white focus:border-brand-wine outline-none text-base sm:text-xs font-mono font-bold tracking-wider text-text-ink"
              />
              <p className="text-[11px] text-text-muted mt-1">
                Passcode required to unlock Studio Hub. Leave blank to retain current passcode.
              </p>
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-text-ink mb-1.5">
                Payment Instructions on Client Invoices
              </label>
              <textarea
                rows={2}
                value={formData.paymentInstructions}
                onChange={(e) => setFormData({ ...formData, paymentInstructions: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-border-subtle bg-studio-canvas/40 focus:bg-white focus:border-brand-wine outline-none text-base sm:text-xs text-text-ink leading-relaxed"
              />
            </div>
          </div>
        </div>

        {/* Mobile Push Reminders Configuration */}
        <div className="bg-studio-surface rounded-3xl p-5 sm:p-7 border border-border-subtle shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-4 border-b border-border-subtle">
            <Smartphone className="w-4 h-4 text-brand-wine" />
            <h3 className="font-display font-semibold text-base text-text-ink">
              NTFY Mobile Push Alert Configuration
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-text-ink mb-1.5">
                NTFY Server URL
              </label>
              <input
                type="text"
                value={formData.ntfyServer}
                onChange={(e) => setFormData({ ...formData, ntfyServer: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-border-subtle bg-studio-canvas/40 focus:bg-white focus:border-brand-wine outline-none text-base sm:text-xs font-mono text-text-ink"
              />
            </div>

            <div>
              <label className="block font-semibold text-text-ink mb-1.5">
                Private Alert Topic
              </label>
              <input
                type="text"
                value={formData.ntfyTopic}
                onChange={(e) => setFormData({ ...formData, ntfyTopic: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-border-subtle bg-studio-canvas/40 focus:bg-white focus:border-brand-wine outline-none text-base sm:text-xs font-mono text-text-ink"
              />
            </div>
          </div>
        </div>

        {/* Data Backup & Tax Export */}
        <div className="bg-studio-surface rounded-3xl p-5 sm:p-7 border border-border-subtle shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-4 border-b border-border-subtle">
            <Download className="w-4 h-4 text-brand-wine" />
            <h3 className="font-display font-semibold text-base text-text-ink">
              Data Backup & Accounting Reports (₹)
            </h3>
          </div>

          <p className="text-xs text-text-muted leading-relaxed">
            Download your full client records, appointment logs, and export CSV spreadsheets for your accountant or GST tax filing.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <a
              href="/api/backup/invoices-csv"
              download
              className="px-4 py-2.5 rounded-2xl border border-border-subtle bg-studio-surface hover:bg-studio-canvas text-text-ink font-semibold text-xs transition-colors flex items-center gap-2 shadow-xs min-h-[44px]"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
              <span>Download Invoices CSV Spreadsheet</span>
            </a>

            <a
              href="/api/backup/export"
              download
              className="px-4 py-2.5 rounded-2xl border border-border-subtle bg-studio-surface hover:bg-studio-canvas text-text-ink font-semibold text-xs transition-colors flex items-center gap-2 shadow-xs min-h-[44px]"
            >
              <Download className="w-4 h-4 text-brand-wine" />
              <span>Download Full Database Backup (.JSON)</span>
            </a>
          </div>
        </div>

        {/* Submit Action */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3.5 rounded-2xl bg-brand-wine hover:bg-brand-wine/90 text-white font-semibold text-xs sm:text-sm shadow-studio transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2 min-h-[44px]"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving Preferences...' : 'Save Studio Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
