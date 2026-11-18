import React, { useState, useMemo } from 'react';
import {
  Palette,
  Search,
  Check,
  Clock,
  Heart,
  Wand2,
  ArrowRight,
  MessageCircle,
  ArrowLeft,
  Calendar,
  Layers,
  Gem,
  Feather,
  Crown,
  Paintbrush,
  Ribbon,
  Sparkles,
  BookOpen
} from 'lucide-react';
import StudioLogo from './StudioLogo';

export default function CataloguePageView({
  designs = [],
  settings,
  onGoHome,
  onSelectLook,
  onSelectCustomInspo,
  onBookAppointment
}) {
  const [activeCategory, setActiveCategory] = useState('All Designs');
  const [searchQuery, setSearchQuery] = useState('');
  const [imgErrors, setImgErrors] = useState({});

  const handleImageError = (id) => {
    setImgErrors((prev) => ({ ...prev, [id]: true }));
  };

  // Strictly filter to image-based designs only (no vector/schematic placeholders)
  const imageBasedDesigns = useMemo(() => {
    return (designs || []).filter((item) => Boolean(item.imageUrl && item.imageUrl.trim() && !imgErrors[item.id]));
  }, [designs, imgErrors]);

  const categories = useMemo(() => {
    const set = new Set();
    imageBasedDesigns.forEach((d) => {
      if (d.category) set.add(d.category);
    });
    return ['All Designs', ...Array.from(set)];
  }, [imageBasedDesigns]);

  const filtered = useMemo(() => {
    const q = (searchQuery || '').trim().toLowerCase();
    return imageBasedDesigns.filter((item) => {
      const matchCat =
        activeCategory === 'All Designs' ||
        activeCategory === 'All' ||
        item.category === activeCategory;
      if (!matchCat) return false;

      if (!q) return true;
      return (
        (item.title || '').toLowerCase().includes(q) ||
        (item.category || '').toLowerCase().includes(q) ||
        (item.desc || '').toLowerCase().includes(q) ||
        (item.tag || '').toLowerCase().includes(q) ||
        (typeof item.shape === 'string' && item.shape.toLowerCase().includes(q)) ||
        (item.highlights && item.highlights.some((h) => h.toLowerCase().includes(q)))
      );
    });
  }, [imageBasedDesigns, activeCategory, searchQuery]);

  const studioPhone = settings?.phone || '+91 73026 23493';
  const cleanPhone = studioPhone.replace(/[^0-9]/g, '');

  const openWhatsAppForDesign = (design) => {
    const text = `Hi Sirii! I am browsing your design catalogue and love "${design.title}" (${design.category}). Can you share a quote and appointment availability for this look?`;
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const openWhatsAppGeneral = () => {
    const text = `Hi Sirii! I am looking at your design catalogue and would like to inquire about booking an appointment.`;
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-studio-canvas text-studio-ink font-sans selection:bg-studio-wineLight selection:text-studio-wine">
      {/* Top Standalone Header */}
      <header className="sticky top-0 z-40 bg-studio-surface/90 backdrop-blur-md border-b border-studio-border">
        <div className="max-w-7xl mx-auto px-3.5 sm:px-6 h-16 sm:h-18 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <button
              onClick={onGoHome}
              className="p-1.5 sm:p-2 -ml-1 sm:-ml-2 rounded-xl text-studio-secondary hover:text-studio-ink hover:bg-studio-canvas transition-colors flex items-center gap-1.5 text-xs font-semibold shrink-0"
              title="Return to Studio Home"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Studio Home</span>
            </button>
            <div className="h-5 w-px bg-studio-border hidden sm:block" />
            <div className="hidden sm:block">
              <StudioLogo logoUrl={settings?.studioLogoUrl} size="sm" showText />
            </div>
            <div className="sm:hidden">
              <StudioLogo logoUrl={settings?.studioLogoUrl} size="sm" showText={false} />
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            <button
              onClick={openWhatsAppGeneral}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-studio-canvas border border-studio-border hover:border-emerald-300 hover:text-emerald-700 text-studio-secondary text-xs font-semibold transition-all shadow-xs"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden sm:inline">WhatsApp Inquire</span>
              <span className="sm:hidden">Chat</span>
            </button>

            <button
              onClick={onBookAppointment}
              className="inline-flex items-center gap-1 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-studio-wine hover:bg-studio-wineHover text-white text-xs font-bold shadow-studio transition-all active:scale-95"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Book Appointment</span>
              <span className="sm:hidden">Book</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Catalogue Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
        {/* Title & Introduction */}
        <div className="text-center max-w-3xl mx-auto space-y-2.5">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-studio-wineLight text-studio-wine text-xs font-semibold border border-studio-border">
            <Sparkles className="w-3.5 h-3.5 text-studio-wine" />
            <span>Atelier Design Booklet & Lookbook</span>
          </div>
          <h1 className="font-display italic font-bold text-3xl sm:text-5xl text-studio-ink tracking-tight">
            Browse Signature Nail Designs
          </h1>
          <p className="text-xs sm:text-sm text-studio-secondary leading-relaxed max-w-2xl mx-auto font-sans">
            Explore our studio lookbook of sculpted acrylics, BIAB builder gels, Gel-X extensions, and hand-painted artistry. Pick your favorite design or connect directly for custom pricing.
          </p>
        </div>

        {/* Custom Inspo Callout Banner */}
        <div className="bg-gradient-to-r from-studio-wineLight/80 via-studio-surface to-studio-canvas border border-studio-border rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-studio-surface border border-studio-border text-studio-wine flex items-center justify-center shrink-0 shadow-xs">
              <Wand2 className="w-5 h-5 text-studio-wine" />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-studio-wine block">
                Found a Look on Instagram or Pinterest?
              </span>
              <h3 className="font-display font-semibold text-base sm:text-lg text-studio-ink">
                You are not limited to this booklet — Bring your own reference image!
              </h3>
              <p className="text-xs text-studio-secondary leading-relaxed">
                Have a specific photo from Pinterest, Google, or TikTok? Sirii recreates and customizes any reference image to suit your natural nail architecture.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 self-start md:self-auto">
            <button
              onClick={onSelectCustomInspo}
              className="px-4 py-2.5 rounded-2xl bg-studio-wine hover:bg-studio-wineHover text-white text-xs font-semibold shadow-studio transition-all active:scale-95 flex items-center gap-2 min-h-[42px]"
            >
              <Wand2 className="w-3.5 h-3.5" />
              <span>Book With Inspo Photo</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Filter Bar & Search */}
        <div className="space-y-3.5">
          <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
            {/* Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3.5 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all min-h-[38px] flex items-center gap-1.5 ${
                    activeCategory === cat
                      ? 'bg-studio-wine text-white shadow-studio'
                      : 'bg-studio-surface border border-studio-border hover:border-studio-borderStrong text-studio-secondary'
                  }`}
                >
                  {cat === 'All Designs' && <Layers className="w-3 h-3" />}
                  {cat === 'Acrylic Nails' && <Gem className="w-3 h-3" />}
                  {cat === 'BIAB / Builder Gel' && <Feather className="w-3 h-3" />}
                  {cat === 'Gel-X Extensions' && <Crown className="w-3 h-3" />}
                  {cat === 'Hand-Painted Art' && <Paintbrush className="w-3 h-3" />}
                  {cat === 'Press-On Nails' && <Ribbon className="w-3 h-3" />}
                  <span>{cat}</span>
                </button>
              ))}
            </div>

            {/* Search Box */}
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-studio-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search designs, shapes, styles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2 bg-studio-surface border border-studio-border rounded-2xl text-xs text-studio-ink focus:outline-none focus:border-studio-wine font-sans min-h-[38px]"
              />
            </div>
          </div>
        </div>

        {/* Design Cards Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 bg-studio-surface rounded-3xl border border-studio-border p-8 space-y-3 shadow-xs">
            <BookOpen className="w-12 h-12 text-studio-muted mx-auto" />
            <h3 className="font-display font-semibold text-lg text-studio-ink">
              No matching designs found
            </h3>
            <p className="text-xs text-studio-secondary max-w-sm mx-auto">
              We couldn't find anything matching "{searchQuery}". You can always bring your own photo or choose another category!
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('All Designs');
              }}
              className="px-4 py-2 rounded-xl bg-studio-wine text-white text-xs font-semibold shadow-studio"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((item) => {
              const hasImage = Boolean(item.imageUrl && !imgErrors[item.id]);
              const shapeName = typeof item.shape === 'object' ? item.shape.name : item.shape || 'Almond';
              const lengthName = typeof item.length === 'object' ? item.length.name : item.length || 'Medium';

              return (
                <div
                  key={item.id}
                  className="bg-studio-surface rounded-3xl border border-studio-border hover:border-studio-wine/40 shadow-studio hover:shadow-studio-float transition-all flex flex-col justify-between overflow-hidden group"
                >
                  {/* Visual Photography Header */}
                  <div className="relative h-60 bg-studio-canvas overflow-hidden flex items-center justify-center border-b border-studio-border">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      onError={() => handleImageError(item.id)}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                      decoding="async"
                    />

                    {/* Top Badges */}
                    <div className="absolute top-3 inset-x-3 flex items-center justify-between pointer-events-none">
                      <span className="px-2.5 py-1 rounded-full bg-studio-surface/90 backdrop-blur-md border border-studio-border text-[10px] font-bold text-studio-wine shadow-xs">
                        {item.category}
                      </span>
                      {item.tag && (
                        <span className="px-2.5 py-1 rounded-full bg-studio-surface/90 backdrop-blur-md border border-studio-border text-[10px] font-semibold text-studio-ink shadow-xs">
                          {item.tag}
                        </span>
                      )}
                    </div>

                    {/* Bottom Specs Badge */}
                    <div className="absolute bottom-2.5 right-3 pointer-events-none">
                      <span className="px-2.5 py-0.5 rounded-full bg-studio-ink/80 text-white backdrop-blur-md text-[10px] font-medium shadow-xs">
                        {shapeName} • {lengthName}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 sm:p-6 space-y-3 flex-1 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="font-display italic font-bold text-lg text-studio-ink group-hover:text-studio-wine transition-colors leading-snug">
                          {item.title}
                        </h3>
                        {item.durationNum && (
                          <span className="text-[11px] text-studio-muted font-medium flex items-center gap-1 shrink-0">
                            <Clock className="w-3 h-3 text-studio-wine" />
                            ~{item.durationNum}m
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-studio-secondary leading-relaxed font-sans line-clamp-3">
                        {item.desc}
                      </p>

                      {item.highlights && item.highlights.length > 0 && (
                        <div className="pt-2 border-t border-studio-border/60 space-y-1.5 text-[11px] text-studio-secondary font-medium">
                          {item.highlights.slice(0, 3).map((h, i) => (
                            <div key={i} className="flex items-center gap-1.5">
                              <Check className="w-3 h-3 text-studio-wine shrink-0" />
                              <span className="truncate">{h}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Pricing & Actions */}
                    <div className="pt-4 border-t border-studio-border space-y-2.5 mt-2">
                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-studio-wineLight text-studio-wine text-[11px] font-semibold">
                          <MessageCircle className="w-3 h-3" />
                          <span>Connect for Pricing</span>
                        </span>
                        <span className="text-[10px] text-studio-muted font-medium">
                          Customized per set
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => openWhatsAppForDesign(item)}
                          className="px-3 py-2 rounded-xl bg-studio-canvas border border-studio-border hover:border-emerald-300 hover:text-emerald-700 text-studio-secondary text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-xs"
                          title="Inquire on WhatsApp"
                        >
                          <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                          <span>WhatsApp</span>
                        </button>

                        <button
                          onClick={() => onSelectLook(item)}
                          className="px-3 py-2 rounded-xl bg-studio-wine hover:bg-studio-wineHover text-white text-xs font-semibold shadow-studio transition-all active:scale-95 flex items-center justify-center gap-1"
                        >
                          <Heart className="w-3 h-3 fill-white" />
                          <span>Select Look</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Catalogue Footer */}
      <footer className="mt-16 py-10 bg-studio-surface border-t border-studio-border text-xs text-studio-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <StudioLogo logoUrl={settings?.studioLogoUrl} size="sm" showText />
            <Heart className="w-2.5 h-2.5 text-studio-wine fill-studio-wine/40 shrink-0" />
            <span>{settings?.address || 'Garhi Cantt, Dehradun'}</span>
          </div>

          <div className="flex items-center gap-4">
            <button onClick={onGoHome} className="hover:text-studio-wine transition-colors">
              Studio Home
            </button>
            <button onClick={openWhatsAppGeneral} className="hover:text-studio-wine transition-colors">
              WhatsApp Consult
            </button>
            <button onClick={onBookAppointment} className="font-semibold text-studio-wine hover:underline">
              Book Appointment
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
