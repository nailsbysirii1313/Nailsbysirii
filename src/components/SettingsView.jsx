import React, { useState, useEffect } from 'react';
import {
  Settings,
  Crown,
  Palette,
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
  RotateCcw,
  Plus,
  Trash2
} from 'lucide-react';
import StudioLogo from './StudioLogo';

export const DEFAULT_HERO_CARDS = [
  {
    id: 'soft',
    title: 'Clean Glazed Donut',
    shape: 'Almond',
    length: 'Short',
    imageUrl: '/hero/soft-simple.jpg',
    subtitle: 'Sheer strawberry gel with pearl chrome on natural nails.',
    tag: 'Studio Look'
  },
  {
    id: 'sparkle',
    title: 'Golden Pearl Chrome',
    shape: 'Coffin',
    length: 'Medium',
    imageUrl: '/hero/little-sparkle.jpg',
    subtitle: 'Champagne porcelain with pearl chrome on coffin nails.',
    tag: 'Studio Fav'
  },
  {
    id: 'statement',
    title: 'Velvet Rose Cat-Eye',
    shape: 'Stiletto',
    length: 'Long',
    imageUrl: '/hero/make-statement.jpg',
    subtitle: 'Deep berry velvet cat-eye shimmer on long sculpted tips.',
    tag: 'Studio Look'
  },
  {
    id: 'french_ombre',
    title: 'French Ombré Sculpture',
    shape: 'Almond',
    length: 'Long',
    imageUrl: '/catalogue/french-ombre.jpg',
    subtitle: 'Seamless baby boomer gradient with crystalline high-apex gloss.',
    tag: 'Studio Classic'
  },
  {
    id: 'luxe_pearl',
    title: 'Baroque Molten Gold & Pearls',
    shape: 'Coffin',
    length: 'Medium',
    imageUrl: '/catalogue/luxe-pearl.jpg',
    subtitle: 'Hand-sculpted 3D molten gold curves with real freshwater baroque pearls.',
    tag: 'Luxury Edition'
  },
  {
    id: 'milky_white',
    title: 'Milky White Gold Flake',
    shape: 'Almond',
    length: 'Medium',
    imageUrl: '/catalogue/milky-white.jpg',
    subtitle: 'Semi-translucent milk builder gel with 24k gold leaf accents.',
    tag: 'Atelier Pick'
  }
];

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
    studioPasscode: '',
    heroCards: (settings?.heroCards && Array.isArray(settings.heroCards) && settings.heroCards.length >= 3)
      ? settings.heroCards
      : DEFAULT_HERO_CARDS
  });

  const [saving, setSaving] = useState(false);
  const [logoUploadedMsg, setLogoUploadedMsg] = useState(false);
  const [cardUploadedMsgs, setCardUploadedMsgs] = useState({});

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
        studioPasscode: '',
        heroCards: (settings.heroCards && Array.isArray(settings.heroCards) && settings.heroCards.length >= 3)
          ? settings.heroCards
          : prev.heroCards || DEFAULT_HERO_CARDS
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
          setFormData((prev) => ({ ...prev, studioLogoUrl: base64Url }));
          setLogoUploadedMsg(true);
          setTimeout(() => setLogoUploadedMsg(false), 3000);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleHeroCardFieldChange = (index, field, value) => {
    setFormData((prev) => {
      const updated = [...(prev.heroCards || DEFAULT_HERO_CARDS)];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, heroCards: updated };
    });
  };

  const handleHeroCardPhotoChange = (index, e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        const base64Url = loadEvent.target?.result;
        if (base64Url) {
          handleHeroCardFieldChange(index, 'imageUrl', base64Url);
          setCardUploadedMsgs((prev) => ({ ...prev, [index]: true }));
          setTimeout(() => {
            setCardUploadedMsgs((prev) => ({ ...prev, [index]: false }));
          }, 3500);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResetHeroCard = (index) => {
    const defaultCard = DEFAULT_HERO_CARDS[index];
    if (defaultCard) {
      setFormData((prev) => {
        const updated = [...(prev.heroCards || DEFAULT_HERO_CARDS)];
        updated[index] = { ...defaultCard };
        return { ...prev, heroCards: updated };
      });
    }
  };

  const handleAddHeroCard = () => {
    const newId = `look_${Date.now()}`;
    const newCard = {
      id: newId,
      title: 'New Signature Look',
      shape: 'Almond',
      length: 'Medium',
      imageUrl: '/catalogue/french-ombre.jpg',
      subtitle: 'Handcrafted signature atelier nail art design.',
      tag: 'Studio Look'
    };
    setFormData((prev) => ({
      ...prev,
      heroCards: [...(prev.heroCards || DEFAULT_HERO_CARDS), newCard]
    }));
  };

  const handleDeleteHeroCard = (index) => {
    const current = formData.heroCards || DEFAULT_HERO_CARDS;
    if (current.length <= 3) {
      alert('The booklet deck requires at least 3 cards.');
      return;
    }
    setFormData((prev) => {
      const updated = [...(prev.heroCards || DEFAULT_HERO_CARDS)];
      updated.splice(index, 1);
      return { ...prev, heroCards: updated };
    });
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
            <Crown className="w-4 h-4 text-brand-wine" />
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

        {/* Hero Showcase Cards (Homepage "Your Next Nail Crush") */}
        <div className="bg-studio-surface rounded-3xl p-5 sm:p-7 border border-border-subtle shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border-subtle">
            <div className="flex items-center gap-2.5">
              <Palette className="w-4 h-4 text-brand-wine" />
              <div>
                <h3 className="font-display font-semibold text-base text-text-ink">
                  Hero Lookbook & Booklet Cards ("Your Next Nail Crush")
                </h3>
                <p className="text-xs text-text-muted mt-0.5 leading-relaxed">
                  Manage the interactive booklet cards deck featured on the homepage hero. Upload photos, edit titles, descriptions, tags, shapes, and lengths. (Minimum 3 cards).
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleAddHeroCard}
              className="px-4 py-2 rounded-xl bg-studio-wine hover:bg-studio-wineHover text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all active:scale-95 shrink-0 self-start sm:self-auto"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Booklet Card</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {formData.heroCards.map((card, idx) => (
              <div
                key={card.id || idx}
                className="rounded-2xl border border-border-subtle p-4 bg-studio-canvas/40 space-y-3.5 flex flex-col justify-between hover:border-brand-wine/30 transition-colors shadow-xs"
              >
                {/* Card Header */}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-studio-wineLight text-brand-wine border border-brand-wine/20">
                    Card #{idx + 1} • {card.title || 'Untitled'}
                  </span>
                  <div className="flex items-center gap-2">
                    {idx < DEFAULT_HERO_CARDS.length && (
                      <button
                        type="button"
                        onClick={() => handleResetHeroCard(idx)}
                        className="text-[11px] text-text-muted hover:text-brand-wine flex items-center gap-1 transition-colors"
                        title="Reset to default preset"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Reset</span>
                      </button>
                    )}
                    {formData.heroCards.length > 3 && (
                      <button
                        type="button"
                        onClick={() => handleDeleteHeroCard(idx)}
                        className="text-[11px] text-red-500 hover:text-red-700 flex items-center gap-1 transition-colors ml-1 p-1"
                        title="Delete card from booklet deck"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Photo Preview & Upload */}
                <div className="space-y-2">
                  <div className="relative w-full h-36 rounded-xl overflow-hidden bg-studio-surface border border-border-subtle group shadow-inner">
                    {card.imageUrl ? (
                      <img
                        src={card.imageUrl}
                        alt={card.title}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-text-muted text-xs">
                        <Image className="w-6 h-6 mb-1 opacity-50" />
                        <span>No image selected</span>
                      </div>
                    )}
                    {card.tag && (
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-white text-[9px] font-bold uppercase tracking-wider">
                        {card.tag}
                      </span>
                    )}
                  </div>

                  {cardUploadedMsgs[idx] && (
                    <p className="text-[11px] text-emerald-700 font-semibold">
                      Photo uploaded! Save settings to publish.
                    </p>
                  )}

                  <div className="flex items-center gap-2">
                    <label className="cursor-pointer flex-1 px-3 py-1.5 rounded-xl bg-studio-surface border border-border-subtle hover:border-brand-wine text-text-ink font-semibold text-[11px] flex items-center justify-center gap-1.5 shadow-xs transition-colors min-h-[34px]">
                      <Upload className="w-3.5 h-3.5 text-brand-wine" />
                      <span>Upload Photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleHeroCardPhotoChange(idx, e)}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold text-text-muted mb-1">
                      Image URL / Path
                    </label>
                    <input
                      type="text"
                      value={card.imageUrl || ''}
                      onChange={(e) => handleHeroCardFieldChange(idx, 'imageUrl', e.target.value)}
                      placeholder="/hero/photo.jpg or https://..."
                      className="w-full px-2.5 py-1.5 rounded-lg border border-border-subtle text-[11px] bg-studio-surface text-text-ink focus:border-brand-wine outline-none font-mono"
                    />
                  </div>
                </div>

                {/* Text Fields */}
                <div className="space-y-2 pt-1 border-t border-border-subtle/60">
                  <div>
                    <label className="block text-[10px] font-semibold text-text-ink mb-1">
                      Look Title *
                    </label>
                    <input
                      type="text"
                      value={card.title || ''}
                      onChange={(e) => handleHeroCardFieldChange(idx, 'title', e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-border-subtle text-xs font-semibold bg-studio-surface text-text-ink focus:border-brand-wine outline-none"
                      placeholder="e.g. Clean Glazed Donut"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold text-text-ink mb-1">
                      Details / Description
                    </label>
                    <input
                      type="text"
                      value={card.subtitle || ''}
                      onChange={(e) => handleHeroCardFieldChange(idx, 'subtitle', e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-border-subtle text-[11px] bg-studio-surface text-text-muted focus:border-brand-wine outline-none"
                      placeholder="e.g. Sheer strawberry gel with pearl chrome on natural nails."
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold text-text-ink mb-1">
                      Tag Badge (Optional)
                    </label>
                    <input
                      type="text"
                      value={card.tag || ''}
                      onChange={(e) => handleHeroCardFieldChange(idx, 'tag', e.target.value)}
                      className="w-full px-2 py-1.5 rounded-lg border border-border-subtle text-[11px] bg-studio-surface text-text-ink focus:border-brand-wine outline-none"
                      placeholder="e.g. Studio Fav, Trending Now"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-semibold text-text-muted mb-1">
                        Nail Shape
                      </label>
                      <select
                        value={card.shape || 'Almond'}
                        onChange={(e) => handleHeroCardFieldChange(idx, 'shape', e.target.value)}
                        className="w-full px-2 py-1.5 rounded-lg border border-border-subtle text-[11px] bg-studio-surface text-text-ink focus:border-brand-wine outline-none"
                      >
                        <option value="Almond">Almond</option>
                        <option value="Coffin">Coffin</option>
                        <option value="Stiletto">Stiletto</option>
                        <option value="Squoval">Squoval</option>
                        <option value="Square">Square</option>
                        <option value="Round">Round</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-text-muted mb-1">
                        Length
                      </label>
                      <select
                        value={card.length || 'Medium'}
                        onChange={(e) => handleHeroCardFieldChange(idx, 'length', e.target.value)}
                        className="w-full px-2 py-1.5 rounded-lg border border-border-subtle text-[11px] bg-studio-surface text-text-ink focus:border-brand-wine outline-none"
                      >
                        <option value="Short">Short</option>
                        <option value="Medium">Medium</option>
                        <option value="Long">Long</option>
                        <option value="Extra Long">Extra Long</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            ))}
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
