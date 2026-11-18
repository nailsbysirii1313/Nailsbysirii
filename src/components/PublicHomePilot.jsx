import React, { useState } from 'react';
import ModalPortal from './ModalPortal';
import {
  Calendar,
  Clock,
  ArrowRight,
  ShieldCheck,
  Star,
  MapPin,
  Share2,
  Lock,
  Eye,
  EyeOff,
  Palette,
  ChevronRight,
  Phone,
  MessageCircle,
  Menu,
  X
} from 'lucide-react';
import StudioLogo from './StudioLogo';
import NailTipSchematic from './NailTipSchematic';
import { SHAPES, LENGTHS, BASE_COLORS, FINISHES } from '../utils/customizerCalculator';

/**
 * PublicHomePilot
 * Mobile-First (390px default) Pilot Screen for Nails by Sirii Public Experience.
 * Embodying the contemporary, artist-led nail studio aesthetic:
 * - Concise, editorial typography (Fraunces + Plus Jakarta Sans)
 * - Warm studio linen palette (#FAF6F0) with deep wine accents (#7D2838)
 * - Immediate visual nail showcase above the fold
 * - Transparent pricing and honest time estimates
 * - Accessible 44px+ touch targets and discreet sticky booking bar
 */
export default function PublicHomePilot({
  services = [],
  settings,
  reviews = [],
  hidePrices = false,
  setHidePrices,
  onOpenPasscodeModal,
  onSelectService,
  onOpenCustomizer,
  onOpenBooking,
  onOpenShareModal
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', ...Array.from(new Set(services.map((s) => s.category).filter(Boolean)))];
  const filteredServices = services.filter((s) => {
    if (activeCategory === 'All') return true;
    return s.category === activeCategory;
  });

  const featuredLooks = [
    {
      title: 'Glazed Pearl Donut',
      shape: SHAPES[0], // Almond
      length: LENGTHS[1], // Medium
      base: BASE_COLORS[1], // Strawberry Jelly
      finish: FINISHES[0], // Hailey Glazed Chrome
      price: 2800,
      duration: 75,
      tag: 'Studio Signature'
    },
    {
      title: 'Sculpted 3D Liquid Chrome',
      shape: SHAPES[1], // Coffin
      length: LENGTHS[2], // Long
      base: BASE_COLORS[0], // Milky Silk
      finish: FINISHES[2], // 3D Liquid Chrome Swirls
      price: 3800,
      duration: 90,
      tag: 'Bespoke Art'
    },
    {
      title: 'Cosmic Cat-Eye Velvet',
      shape: SHAPES[0], // Almond
      length: LENGTHS[1], // Medium
      base: BASE_COLORS[4], // Deep Noir Espresso
      finish: FINISHES[1], // Cosmic Cat-Eye Velvet
      price: 3100,
      duration: 80,
      tag: 'Magnetic Silk'
    },
    {
      title: 'Micro-French Porcelain',
      shape: SHAPES[2], // Squoval
      length: LENGTHS[0], // Short
      base: BASE_COLORS[2], // Cashmere Nude
      finish: FINISHES[4], // Micro-French
      price: 2600,
      duration: 75,
      tag: 'Clean Minimal'
    }
  ];

  const whatsappPhone = settings?.phone ? settings.phone.replace(/[^0-9]/g, '') : '917302623493';

  return (
    <div className="min-h-screen bg-studio-canvas text-studio-ink font-sans antialiased selection:bg-studio-wineLight selection:text-studio-wine">
      {/* 1. COMPACT ACCESSIBLE HEADER */}
      <header className="sticky top-0 z-40 bg-studio-canvas/90 backdrop-blur-md border-b border-studio-border px-4 py-3 pt-[calc(0.75rem+env(safe-area-inset-top))]">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
          {/* Brandmark */}
          <a href="#" className="flex items-center gap-2.5 group">
            <StudioLogo logoUrl={settings?.studioLogoUrl} size="sm" />
            <div className="flex flex-col">
              <span className="font-display italic font-bold text-base sm:text-lg text-studio-ink tracking-tight group-hover:text-studio-wine transition-colors">
                {settings?.studioName || 'Nails by Sirii'}
              </span>
              <span className="text-[10px] text-studio-muted font-medium tracking-wide">
                Garhi Cantt, Dehradun
              </span>
            </div>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-studio-secondary">
            <a href="#services" className="hover:text-studio-wine transition-colors">Treatments</a>
            <a href="#featured-looks" className="hover:text-studio-wine transition-colors">Signature Looks</a>
            <a href="#customizer" className="hover:text-studio-wine transition-colors">Customizer</a>
            <a href="#studio-visit" className="hover:text-studio-wine transition-colors">Visit & Hours</a>
          </nav>

          {/* Header Action Controls */}
          <div className="flex items-center gap-2">
            {/* Price Visibility Pill */}
            <button
              onClick={() => {
                const next = !hidePrices;
                setHidePrices(next);
              }}
              className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium transition-all ${
                hidePrices
                  ? 'bg-amber-50 border-amber-200 text-amber-800'
                  : 'bg-white border-studio-border text-studio-secondary hover:border-studio-wine/40'
              }`}
              title={hidePrices ? 'Click to show transparent prices' : 'Click to hide prices for catalogue sharing'}
            >
              {hidePrices ? <EyeOff className="w-3.5 h-3.5 text-amber-600" /> : <Eye className="w-3.5 h-3.5 text-studio-muted" />}
              <span>{hidePrices ? 'Prices Hidden' : 'Prices Shown'}</span>
            </button>

            {/* Book CTA */}
            <button
              onClick={onOpenBooking}
              className="px-4 py-2 rounded-full bg-studio-wine hover:bg-studio-wineHover text-white text-xs font-semibold shadow-studio transition-all active:scale-[0.98] min-h-[44px] flex items-center gap-1.5"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Book Session</span>
            </button>

            {/* Studio Hub Gate */}
            <button
              onClick={onOpenPasscodeModal}
              className="w-11 h-11 rounded-full bg-studio-surface border border-studio-border hover:border-studio-wine/40 text-studio-ink flex items-center justify-center transition-all active:scale-[0.98]"
              title="Studio Hub Owner Login"
              aria-label="Studio Hub Owner Login"
            >
              <Lock className="w-4 h-4 text-studio-secondary" />
            </button>

            {/* Mobile Menu */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden w-11 h-11 rounded-full bg-studio-surface border border-studio-border flex items-center justify-center text-studio-ink active:scale-[0.98]"
              aria-label="Open Navigation Menu"
            >
              <Menu className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE SLIDE DRAWER */}
      {mobileMenuOpen && (
        <ModalPortal isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)}>
          <div className="fixed inset-0 z-[70] md:hidden flex justify-end bg-studio-ink/60 backdrop-blur-md">
            <div className="fixed inset-0" onClick={() => setMobileMenuOpen(false)} />
            <div className="relative w-full max-w-xs bg-studio-surface h-full shadow-2xl p-6 flex flex-col justify-between overflow-y-auto z-10 animate-fade-in">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-studio-border">
                <span className="font-display italic font-bold text-base text-studio-ink">
                  Navigation
                </span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-10 h-10 rounded-full bg-studio-subtle flex items-center justify-center text-studio-ink"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2 text-sm font-semibold text-studio-secondary">
                <a
                  href="#services"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block p-3 rounded-xl hover:bg-studio-subtle hover:text-studio-wine"
                >
                  Treatment Menu
                </a>
                <a
                  href="#featured-looks"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block p-3 rounded-xl hover:bg-studio-subtle hover:text-studio-wine"
                >
                  Signature Looks
                </a>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenCustomizer();
                  }}
                  className="w-full text-left p-3 rounded-xl hover:bg-studio-subtle hover:text-studio-wine"
                >
                  Design Custom Set
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenBooking();
                  }}
                  className="w-full text-left p-3 rounded-xl bg-studio-wine text-white"
                >
                  Book Appointment
                </button>
              </div>

              <div className="pt-4 border-t border-studio-border">
                <button
                  onClick={() => setHidePrices(!hidePrices)}
                  className="w-full p-3 rounded-xl border border-studio-border text-xs font-semibold flex items-center justify-between text-studio-secondary"
                >
                  <span>Catalogue Price Mode</span>
                  <span className="font-bold text-studio-wine">
                    {hidePrices ? 'Hidden' : 'Visible'}
                  </span>
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-studio-border text-center">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenPasscodeModal();
                }}
                className="text-xs text-studio-muted font-medium inline-flex items-center gap-1.5"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Owner Console Access</span>
              </button>
            </div>
          </div>
        </div>
        </ModalPortal>
      )}

      {/* 2. HERO: FOCUSED, ARTIST-LED, IMMEDIATE NAIL WORK VISIBLE (390px Viewport Target) */}
      <section className="px-4 pt-6 pb-10 max-w-6xl mx-auto">
        <div className="space-y-6 text-center max-w-2xl mx-auto">
          {/* Studio Meta Badge */}
          <div className="inline-flex flex-wrap items-center justify-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-studio-surface border border-studio-border text-[11px] font-semibold text-studio-secondary shadow-xs">
              <Palette className="w-3.5 h-3.5 text-studio-wine" />
              <span>Bespoke Nail Atelier</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-studio-emeraldLight border border-emerald-200 text-[11px] font-semibold text-emerald-800">
              <Clock className="w-3.5 h-3.5 text-emerald-600" />
              <span>Open Daily: {settings?.timings || '12:00 PM – 7:00 PM'}</span>
            </span>
          </div>

          {/* Concise Headline Strategy */}
          <div className="space-y-2">
            <h1 className="font-display italic font-bold text-3xl sm:text-4xl md:text-5xl text-studio-ink tracking-tight leading-[1.12]">
              Sculptural Precision & Hand-Painted Nail Art.
            </h1>
            <p className="text-xs sm:text-sm text-studio-secondary max-w-lg mx-auto leading-relaxed">
              Personalized builder gel architectures, Japanese soft gel overlays, and bespoke chrome finishes created one-on-one by Sirii in Garhi Cantt, Dehradun.
            </p>
          </div>

          {/* Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2.5 pt-1">
            <button
              onClick={onOpenBooking}
              className="px-6 py-3.5 rounded-full bg-studio-wine hover:bg-studio-wineHover text-white text-xs font-semibold shadow-studio transition-all active:scale-[0.98] min-h-[44px] flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              <span>Reserve Studio Session</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onOpenCustomizer}
              className="px-5 py-3.5 rounded-full bg-studio-surface hover:bg-studio-subtle border border-studio-border text-studio-ink text-xs font-semibold transition-all active:scale-[0.98] min-h-[44px] flex items-center justify-center gap-2"
            >
              <Palette className="w-4 h-4 text-studio-wine" />
              <span>Customizer & Bill Calculator</span>
            </button>
          </div>
        </div>

        {/* 3. VISUAL ANCHOR: WORK SHOWCASE IMMEDIATELY VISIBLE ON MOBILE */}
        <div id="featured-looks" className="mt-8 pt-6 border-t border-studio-border">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-studio-wine block">
                Atelier Portfolio
              </span>
              <h2 className="font-display italic font-bold text-lg sm:text-xl text-studio-ink">
                Featured Architectures
              </h2>
            </div>
            <button
              onClick={onOpenCustomizer}
              className="text-xs font-semibold text-studio-wine hover:underline inline-flex items-center gap-1"
            >
              <span>Explore all styles</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Horizontal / Grid Showcase with Geometric SVG Silhouettes */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {featuredLooks.map((look, idx) => (
              <div
                key={idx}
                className="bg-studio-surface rounded-2xl p-4 border border-studio-border shadow-xs hover:shadow-studio transition-all flex flex-col justify-between group"
              >
                {/* Visual Geometric Silhouette */}
                <div className="h-40 rounded-xl bg-studio-canvas flex flex-col items-center justify-center relative overflow-hidden border border-studio-border/60">
                  <NailTipSchematic
                    shape={look.shape}
                    length={look.length}
                    baseColor={look.base}
                    finish={look.finish}
                    size="md"
                  />
                  <span className="absolute bottom-2 left-2 text-[9px] font-bold px-2 py-0.5 rounded-full bg-white/90 text-studio-ink border border-studio-border">
                    {look.tag}
                  </span>
                </div>

                {/* Details */}
                <div className="mt-3 space-y-1">
                  <h3 className="font-display italic font-bold text-sm text-studio-ink line-clamp-1">
                    {look.title}
                  </h3>
                  <div className="flex items-center justify-between text-[11px] text-studio-muted">
                    <span>{look.shape.name}</span>
                    <span>~{look.duration}m</span>
                  </div>
                  {!hidePrices ? (
                    <div className="font-display font-bold text-sm text-studio-wine pt-1">
                      ₹{look.price.toLocaleString('en-IN')}
                    </div>
                  ) : (
                    <div className="text-[10px] text-studio-muted font-medium pt-1">
                      Transparent Quote
                    </div>
                  )}
                </div>

                {/* Book Action */}
                <button
                  onClick={onOpenBooking}
                  className="mt-3 w-full py-2 rounded-xl bg-studio-subtle hover:bg-studio-wine hover:text-white text-studio-ink text-[11px] font-semibold transition-all min-h-[40px] flex items-center justify-center gap-1"
                >
                  <span>Select Look</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. SCANNABLE TREATMENT MENU (Mobile-First Single Column Scan) */}
      <section id="services" className="px-4 py-10 bg-studio-surface border-y border-studio-border">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center space-y-1.5 max-w-md mx-auto">
            <span className="text-[10px] uppercase font-bold tracking-widest text-studio-wine block">
              Transparent Offerings
            </span>
            <h2 className="font-display italic font-bold text-2xl text-studio-ink">
              Studio Service Menu
            </h2>
            <p className="text-xs text-studio-muted">
              Health-first natural nail architecture, sculpted extensions, and editorial finishes.
            </p>
          </div>

          {/* Category Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all min-h-[38px] ${
                  activeCategory === cat
                    ? 'bg-studio-wine text-white shadow-xs'
                    : 'bg-studio-canvas border border-studio-border text-studio-secondary hover:text-studio-ink'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Service Cards List */}
          <div className="space-y-3">
            {filteredServices.map((srv) => (
              <div
                key={srv.id}
                className="p-4 sm:p-5 rounded-2xl bg-studio-canvas border border-studio-border hover:border-studio-borderStrong transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1 max-w-lg">
                  <div className="flex items-center gap-2">
                    <h3 className="font-display italic font-bold text-base text-studio-ink">
                      {srv.name}
                    </h3>
                    {srv.popular && (
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-studio-wineLight text-studio-wine border border-studio-wine/20">
                        Signature
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-studio-secondary leading-relaxed">
                    {srv.description}
                  </p>
                  <div className="flex items-center gap-3 text-[11px] text-studio-muted pt-0.5">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-studio-muted" />
                      <span>{srv.duration} mins</span>
                    </span>
                    <span>•</span>
                    <span>{srv.category}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:flex-col sm:items-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-studio-border">
                  {!hidePrices ? (
                    <div className="text-left sm:text-right">
                      <span className="text-[10px] text-studio-muted uppercase block font-medium">Standard</span>
                      <span className="font-display font-bold text-lg text-studio-ink">
                        ₹{Number(srv.price).toLocaleString('en-IN')}
                      </span>
                    </div>
                  ) : (
                    <span className="text-xs font-display italic text-studio-wine font-semibold">
                      Quote on request
                    </span>
                  )}

                  <button
                    onClick={() => {
                      if (onSelectService) onSelectService(srv);
                      else onOpenBooking();
                    }}
                    className="px-4 py-2 rounded-xl bg-studio-wine text-white text-xs font-semibold hover:bg-studio-wineHover transition-all active:scale-[0.98] min-h-[44px] flex items-center gap-1.5"
                  >
                    <span>Book Service</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. STUDIO VISIT & HEALTH STANDARDS */}
      <section id="studio-visit" className="px-4 py-12 max-w-4xl mx-auto space-y-6">
        <div className="bg-studio-surface rounded-3xl p-6 sm:p-8 border border-studio-border shadow-xs space-y-5">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-widest text-studio-wine block">
              Sanitation & Atmosphere
            </span>
            <h2 className="font-display italic font-bold text-xl sm:text-2xl text-studio-ink">
              Studio Protocols in Garhi Cantt
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-studio-canvas border border-studio-border space-y-1.5">
              <ShieldCheck className="w-5 h-5 text-emerald-700" />
              <h3 className="font-semibold text-studio-ink">Hospital-Grade Sterilization</h3>
              <p className="text-studio-secondary leading-relaxed">
                All metal bits and implements pass through high-heat autoclave sterilization between every client.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-studio-canvas border border-studio-border space-y-1.5">
              <ShieldCheck className="w-5 h-5 text-studio-wine" />
              <h3 className="font-semibold text-studio-ink">Health-First Natural Nail Care</h3>
              <p className="text-studio-secondary leading-relaxed">
                Zero aggressive e-file cuticle carving. We focus on long-term nail plate health, strength, and integrity.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-studio-canvas border border-studio-border space-y-1.5">
              <MapPin className="w-5 h-5 text-amber-700" />
              <h3 className="font-semibold text-studio-ink">Private Studio Setting</h3>
              <p className="text-studio-secondary leading-relaxed">
                Shop No. 7, Laxmi Navraj Plaza. Free parking, peaceful atmosphere, and personalized consultations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. DISCREET MOBILE STICKY BOOKING ACTION (Respects Safe Area & Does Not Block Content) */}
      <div className="fixed bottom-0 inset-x-0 z-30 p-3 bg-studio-canvas/95 backdrop-blur-md border-t border-studio-border pb-[calc(0.75rem+env(safe-area-inset-bottom))] md:hidden shadow-lg">
        <div className="flex items-center gap-2 max-w-sm mx-auto">
          <a
            href={`https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
              'Hi Sirii! I am interested in booking a nail appointment at your Garhi Cantt studio.'
            )}`}
            target="_blank"
            rel="noreferrer"
            className="w-12 h-12 rounded-xl bg-studio-surface border border-studio-border flex items-center justify-center text-emerald-600 active:scale-95 shrink-0"
            aria-label="Message Sirii on WhatsApp"
          >
            <MessageCircle className="w-5 h-5" />
          </a>

          <button
            onClick={onOpenBooking}
            className="flex-1 py-3 px-4 rounded-xl bg-studio-wine text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-studio active:scale-95 min-h-[44px]"
          >
            <Calendar className="w-4 h-4" />
            <span>Book Appointment (12–7 PM)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
