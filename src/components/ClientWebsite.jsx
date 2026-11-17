import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Star,
  MapPin,
  ChevronRight,
  Heart,
  Share2,
  Lock,
  Eye,
  EyeOff,
  AlertTriangle,
  MessageSquare,
  X,
  Search,
  Palette,
  Check,
  ExternalLink,
  MessageCircle,
  Menu,
  Droplets,
  Layers,
  ChevronDown,
  Wallet
} from 'lucide-react';
import { InstagramIcon } from './Icons';
import StudioLogo from './StudioLogo';
import EmergencyRepairModal from './EmergencyRepairModal';
import ShareCatalogueModal from './ShareCatalogueModal';
import confetti from 'canvas-confetti';
import { calculateCustomSet, SHAPES, LENGTHS, BASE_COLORS, FINISHES } from '../utils/customizerCalculator';
import { getKolkataTodayString, getKolkataTomorrowString, getAvailableSlotsForDuration } from '../utils/dateTime';
import NailTipSchematic from './NailTipSchematic';

export default function ClientWebsite({
  services = [],
  settings,
  reviews = [],
  hidePrices = false,
  setHidePrices,
  onOpenPasscodeModal,
  onBookingComplete,
  onSubmitRepair,
  onSaveReview,
  onAddToast
}) {
  // Navigation & Modals
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isRepairModalOpen, setIsRepairModalOpen] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);

  // Catalogue Filters
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Interactive Customizer State (Single Source of Truth)
  const shapes = SHAPES;
  const lengths = LENGTHS;
  const baseColors = BASE_COLORS;
  const finishes = FINISHES;

  const [customShape, setCustomShape] = useState(shapes[0]);
  const [customLength, setCustomLength] = useState(lengths[1]);
  const [customBase, setCustomBase] = useState(baseColors[1]);
  const [customFinish, setCustomFinish] = useState(finishes[0]);

  // Booking Flow State
  const [bookingStep, setBookingStep] = useState(1);
  const [bookingMode, setBookingMode] = useState('service'); // 'service' | 'customSet' | 'lookbook'
  const [selectedLook, setSelectedLook] = useState(null);
  const [selectedServiceId, setSelectedServiceId] = useState(services[0]?.id || '');
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [selectedShape, setSelectedShape] = useState('Almond');
  const [selectedLength, setSelectedLength] = useState('Medium');
  const [selectedAesthetic, setSelectedAesthetic] = useState('3D Chrome & Glaze');
  const [bookingDate, setBookingDate] = useState(() => getKolkataTomorrowString());
  const [bookingTime, setBookingTime] = useState('12:00');
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientInstagram, setClientInstagram] = useState('');
  const [allergies, setAllergies] = useState('None');
  const [clientNotes, setClientNotes] = useState('');
  const [clientAdvanceToggle, setClientAdvanceToggle] = useState(false);
  const [clientAdvanceAmount, setClientAdvanceAmount] = useState(500);
  const [clientUpiRef, setClientUpiRef] = useState('');
  const [isSubmittingBooking, setIsSubmittingBooking] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  // Review Form State
  const [reviewForm, setReviewForm] = useState({
    clientName: '',
    rating: 5,
    serviceRendered: 'Signature BIAB Overlay',
    aestheticTag: 'Glazed Pearl Donut',
    comment: ''
  });
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // Synchronize initial service selection
  useEffect(() => {
    if (!selectedServiceId && services.length > 0) {
      setSelectedServiceId(services[0].id);
    }
  }, [services]);

  const selectedService = services.find((s) => s.id === selectedServiceId) || services[0];
  const addonsList = services.filter((s) => s.category === 'Nail Art' || s.category === 'Add-on');

  const toggleAddon = (name) => {
    if (selectedAddons.includes(name)) {
      setSelectedAddons(selectedAddons.filter((n) => n !== name));
    } else {
      setSelectedAddons([...selectedAddons, name]);
    }
  };

  // Customizer Calculation from shared Single Source of Truth
  const customCalculation = calculateCustomSet({
    length: customLength,
    finish: customFinish
  });
  const customizerTotalPrice = customCalculation.totalPrice;
  const customizerTotalDuration = customCalculation.totalDuration;

  const addonServices = addonsList.filter((a) => selectedAddons.includes(a.name));
  const addonDuration = addonServices.reduce((sum, a) => sum + (a.duration || 0), 0);
  const addonPrice = addonServices.reduce((sum, a) => sum + (a.price || 0), 0);

  const basePrice = bookingMode === 'customSet'
    ? customizerTotalPrice
    : bookingMode === 'lookbook'
      ? (selectedLook?.priceNum || 2800)
      : (selectedService?.price || 0);

  const baseDuration = bookingMode === 'customSet'
    ? customizerTotalDuration
    : bookingMode === 'lookbook'
      ? (selectedLook?.durationNum || 75)
      : (selectedService?.duration || 60);

  const totalPrice = basePrice + addonPrice;
  const totalDuration = baseDuration + addonDuration;

  // Operating Hours (12:00 PM – 7:00 PM): Filter slots so service finishes before closing
  const timeSlots = getAvailableSlotsForDuration(totalDuration);

  // Synchronize slot when duration changes
  useEffect(() => {
    if (timeSlots.length > 0 && !timeSlots.includes(bookingTime)) {
      setBookingTime(timeSlots[0]);
    }
  }, [totalDuration]);

  // Reviews avg
  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + (Number(r.rating) || 5), 0) / reviews.length).toFixed(1)
    : '4.9';

  // Smooth scroll helper
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  // Handle select service from catalogue
  const handleSelectFromCatalogue = (srv) => {
    setBookingMode('service');
    setSelectedLook(null);
    setSelectedServiceId(srv.id);
    scrollTo('booking-section');
    setBookingStep(1);
    if (onAddToast) {
      onAddToast('Treatment Selected', `${srv.name} ready for reservation.`, 'success');
    }
  };

  // Handle apply custom set into booking
  const handleBookCustomSet = () => {
    setBookingMode('customSet');
    setSelectedLook(null);
    setSelectedShape(customShape.name);
    setSelectedLength(customLength.name);
    setSelectedAesthetic(`${customBase.name} with ${customFinish.name}`);
    setClientNotes(`Custom Set: ${customShape.name}, ${customLength.name}, ${customBase.name}, ${customFinish.name}`);

    scrollTo('booking-section');
    setBookingStep(1);
    if (onAddToast) {
      onAddToast('Custom Set Configured', `${customShape.name} (${customLength.name}) at ₹${customizerTotalPrice.toLocaleString('en-IN')} ready for reservation.`, 'success');
    }
  };

  const handleBookLook = (item) => {
    setBookingMode('lookbook');
    setSelectedLook(item);
    setSelectedAesthetic(item.title);
    setSelectedShape(item.shape.name);
    setSelectedLength(item.length.name);
    setClientNotes(`Inspo Look: ${item.title} (${item.shape.name})`);

    scrollTo('booking-section');
    setBookingStep(1);
    if (onAddToast) {
      onAddToast('Look Selected', `${item.title} ready for reservation.`, 'success');
    }
  };

  // Handle booking form submission
  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!clientName.trim() || !clientPhone.trim()) {
      if (onAddToast) {
        onAddToast('Missing Details', 'Please provide your name and phone number to reserve your appointment.', 'error');
      }
      return;
    }
    const cleanDigits = clientPhone.replace(/[^0-9]/g, '');
    if (cleanDigits.length < 10) {
      if (onAddToast) {
        onAddToast('Invalid Phone Number', 'Please enter a valid 10-digit mobile number for appointment confirmation.', 'error');
      }
      return;
    }

    setIsSubmittingBooking(true);

    try {
      const advanceNum = clientAdvanceToggle ? Math.min(totalPrice, Math.max(0, Number(clientAdvanceAmount) || 0)) : 0;
      const pendingAmt = Math.max(0, totalPrice - advanceNum);

      const serviceName = bookingMode === 'customSet'
        ? `Custom Set: ${customShape.name} (${customLength.name})`
        : bookingMode === 'lookbook'
          ? `Inspo Look: ${selectedLook?.title || selectedAesthetic}`
          : (selectedService?.name || 'Signature Nail Service');

      const serviceId = bookingMode === 'customSet'
        ? 'srv_custom'
        : bookingMode === 'lookbook'
          ? (selectedLook?.id || 'srv_look')
          : (selectedService?.id || 'srv_1');

      const payload = {
        clientName: clientName.trim(),
        clientPhone: clientPhone.trim(),
        clientEmail: clientEmail.trim(),
        clientInstagram: clientInstagram.trim(),
        serviceId,
        serviceName,
        addonServiceNames: selectedAddons,
        date: bookingDate,
        time: bookingTime,
        duration: totalDuration,
        price: totalPrice,
        depositPaid: advanceNum,
        advancePaid: advanceNum,
        hasAdvancePayment: clientAdvanceToggle,
        advancePaymentMethod: clientAdvanceToggle ? 'UPI (Google Pay / PhonePe)' : null,
        pendingAmount: pendingAmt,
        balanceDue: pendingAmt,
        customSet: bookingMode === 'customSet' ? {
          shape: customShape.name,
          length: customLength.name,
          baseColor: customBase.name,
          finish: customFinish.name,
          price: customizerTotalPrice,
          duration: customizerTotalDuration,
          lineItems: customCalculation.lineItems
        } : null,
        notes: `Preferences: ${selectedShape}, ${selectedLength}, ${selectedAesthetic}. Allergies: ${allergies}.${clientUpiRef ? ` Advance UPI UTR: ${clientUpiRef}.` : ''} Note: ${clientNotes}`,
        notifyImmediate: true,
        status: 'Confirmed'
      };

      const result = await onBookingComplete(payload);
      setConfirmedBooking({ ...payload, id: result?.id || 'apt_new' });
      setBookingStep(5);
      try {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch {
        // Confetti non-fatal fallback
      }
    } catch (err) {
      if (onAddToast) {
        onAddToast('Failed to submit reservation', err.message, 'error');
      }
    } finally {
      setIsSubmittingBooking(false);
    }
  };

  // Handle Review submission
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewForm.clientName.trim() || !reviewForm.comment.trim()) {
      if (onAddToast) onAddToast('Please fill in your name and review', 'error');
      return;
    }
    setIsSubmittingReview(true);
    try {
      if (onSaveReview) {
        await onSaveReview({
          ...reviewForm,
          verified: true,
          date: getKolkataTodayString()
        });
      }
      setShowReviewModal(false);
      setReviewForm({
        clientName: '',
        rating: 5,
        serviceRendered: 'Signature BIAB Overlay',
        aestheticTag: 'Glazed Pearl Donut',
        comment: ''
      });
      if (onAddToast) onAddToast('Thank you for sharing your experience!', 'success');
    } catch (err) {
      if (onAddToast) onAddToast(err.message || 'Failed to submit review', 'error');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  // Curated Lookbook items with geometric silhouettes
  const lookbookItems = [
    {
      id: 'look_1',
      title: 'Glazed Pearl Donut',
      tag: 'Studio Signature',
      desc: 'Pearlescent glazed chrome buffed over sheer strawberry jelly builder gel.',
      shape: SHAPES[0], // Almond
      length: LENGTHS[1], // Medium
      base: BASE_COLORS[1], // Strawberry Jelly
      finish: FINISHES[0], // Hailey Glazed Chrome
      price: '₹2,800',
      priceNum: 2800,
      duration: '75 mins',
      durationNum: 75
    },
    {
      id: 'look_2',
      title: 'Sculpted 3D Liquid Chrome',
      tag: 'Editorial Art',
      desc: 'Raised sculptural silver chrome ribbons over a milky semi-translucent base.',
      shape: SHAPES[1], // Coffin
      length: LENGTHS[2], // Long
      base: BASE_COLORS[0], // Milky Silk
      finish: FINISHES[2], // 3D Liquid Chrome
      price: '₹3,800',
      priceNum: 3800,
      duration: '90 mins',
      durationNum: 90
    },
    {
      id: 'look_3',
      title: 'Cosmic Cat-Eye Velvet',
      tag: 'Magnetic Silk',
      desc: 'Deep multi-dimensional magnetic shimmer with fluid velvet light refraction.',
      shape: SHAPES[0], // Almond
      length: LENGTHS[1], // Medium
      base: BASE_COLORS[4], // Deep Noir
      finish: FINISHES[1], // Cat-Eye Velvet
      price: '₹3,100',
      priceNum: 3100,
      duration: '80 mins',
      durationNum: 80
    },
    {
      id: 'look_4',
      title: 'Micro-French Porcelain',
      tag: 'Clean Architecture',
      desc: 'Precision micro-fine white tips over high-apex natural nude BIAB overlay.',
      shape: SHAPES[2], // Squoval
      length: LENGTHS[0], // Short
      base: BASE_COLORS[2], // Cashmere Nude
      finish: FINISHES[4], // Micro-French
      price: '₹2,600',
      priceNum: 2600,
      duration: '75 mins',
      durationNum: 75
    },
    {
      id: 'look_5',
      title: 'Dewdrop Glass Crystal',
      tag: 'Reflective Art',
      desc: 'Crystal-clear 3D gel droplets with micro pearl accents and glass shine.',
      shape: SHAPES[4], // Stiletto
      length: LENGTHS[2], // Long
      base: BASE_COLORS[5], // Frosted Glaze
      finish: FINISHES[3], // Crystal Dewdrops
      price: '₹3,600',
      priceNum: 3600,
      duration: '105 mins',
      durationNum: 105
    },
    {
      id: 'look_6',
      title: 'Aura Halo Soft Gradient',
      tag: 'Soft Minimal',
      desc: 'Diffused pastel aura gradient centered on clean rounded natural architecture.',
      shape: SHAPES[3], // Round
      length: LENGTHS[0], // Short
      base: BASE_COLORS[3], // Bare Petal
      finish: FINISHES[5], // Clean Gloss
      price: '₹2,700',
      priceNum: 2700,
      duration: '70 mins',
      durationNum: 70
    }
  ];

  // Dynamic categories
  const categories = ['All', ...Array.from(new Set(services.map((s) => s.category).filter(Boolean)))];
  const filteredServices = services.filter((s) => {
    const q = (searchQuery || '').toLowerCase();
    const matchesCategory = activeCategory === 'All' || s.category === activeCategory;
    const matchesSearch =
      (s.name || '').toLowerCase().includes(q) ||
      (s.description && s.description.toLowerCase().includes(q));
    return matchesCategory && matchesSearch;
  });

  const whatsappPhone = settings?.phone ? settings.phone.replace(/[^0-9]/g, '') : '917302623493';
  const whatsappUrl = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
    `Hello Sirii! I am viewing your portfolio on your website and would like to reserve an appointment at your studio in Garhi Cantt, Dehradun.`
  )}`;

  return (
    <div className="min-h-screen bg-studio-canvas text-studio-ink font-sans selection:bg-studio-wineLight selection:text-studio-wine overflow-x-hidden pb-24 sm:pb-0">
      {/* 1. TOP CLIENT HEADER / NAVIGATION (Mobile First, 390px Optimized) */}
      <header className="sticky top-0 z-40 bg-studio-canvas/90 backdrop-blur-md border-b border-studio-border px-3.5 sm:px-6 py-2.5 sm:py-3 transition-all pt-[calc(0.6rem+env(safe-area-inset-top))]">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          {/* Logo & Atelier Brand */}
          <a href="#" className="flex items-center gap-2.5 sm:gap-3 group shrink-0 min-w-0">
            <StudioLogo logoUrl={settings?.studioLogoUrl} size="md" />
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-display italic font-bold text-base sm:text-xl text-studio-ink tracking-tight group-hover:text-studio-wine transition-colors truncate">
                  {settings?.studioName || 'Nails by Sirii'}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-studio-wine animate-pulse shrink-0" />
              </div>
              <p className="text-[9px] sm:text-[10px] text-studio-secondary tracking-wider font-semibold truncate">
                Bespoke Nail Atelier • Dehradun
              </p>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-studio-secondary">
            <a href="#catalogue" className="hover:text-studio-wine transition-colors">
              Menu & Services
            </a>
            <a href="#customizer" className="hover:text-studio-wine transition-colors">
              Interactive Customizer
            </a>
            <a href="#lookbook" className="hover:text-studio-wine transition-colors">
              Curated Looks
            </a>
            <a href="#booking-section" className="hover:text-studio-wine transition-colors">
              Reserve Appointment
            </a>
            <a href="#reviews" className="hover:text-studio-wine transition-colors">
              Client Feedback
            </a>
            <a href="#studio-info" className="hover:text-studio-wine transition-colors">
              Hygiene & Visit
            </a>
          </nav>

          {/* Header Action Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Price Visibility Switch (Desktop) */}
            <button
              onClick={() => {
                const nextState = !hidePrices;
                setHidePrices(nextState);
                if (onAddToast) {
                  onAddToast(
                    nextState ? 'Catalogue Mode: Prices Hidden' : 'Transparent Pricing Enabled',
                    nextState
                      ? 'Displaying treatments without prices. Ideal for client previews.'
                      : 'Displaying complete price list.',
                    'info'
                  );
                }
              }}
              className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                hidePrices
                  ? 'bg-amber-50 border-amber-200 text-amber-800'
                  : 'bg-studio-surface border-studio-border text-studio-secondary hover:border-studio-borderStrong'
              }`}
              title={hidePrices ? 'Click to show prices' : 'Click to hide prices for catalogue sharing'}
            >
              {hidePrices ? (
                <>
                  <EyeOff className="w-3.5 h-3.5 text-amber-600" />
                  <span>Prices: Hidden</span>
                </>
              ) : (
                <>
                  <Eye className="w-3.5 h-3.5 text-studio-muted" />
                  <span>Prices: Visible</span>
                </>
              )}
            </button>

            {/* Share Catalogue Button */}
            <button
              onClick={() => setIsShareModalOpen(true)}
              className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-studio-surface border border-studio-border hover:border-studio-borderStrong text-studio-secondary text-xs font-semibold shadow-studio transition-all flex items-center gap-1.5 active:scale-95"
              title="Share catalogue without prices"
            >
              <Share2 className="w-3.5 h-3.5 text-studio-wine" />
              <span className="hidden sm:inline">Share</span>
            </button>

            {/* Book Now Primary CTA */}
            <a
              href="#booking-section"
              className="px-3.5 sm:px-4 py-1.5 rounded-xl bg-studio-wine hover:bg-studio-wineHover text-white text-xs font-semibold shadow-studio active:scale-95 transition-all flex items-center gap-1.5"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Reserve Slot</span>
              <span className="xs:hidden">Reserve</span>
            </a>

            {/* Studio Hub (Owner Passcode Protected) */}
            <button
              onClick={onOpenPasscodeModal}
              className="w-8 h-8 rounded-xl bg-studio-ink hover:bg-black text-white flex items-center justify-center transition-all active:scale-95 shadow-studio"
              title="Studio Hub Owner Access"
              aria-label="Studio Hub Owner Access"
            >
              <Lock className="w-3.5 h-3.5 text-studio-gold" />
            </button>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden w-8 h-8 rounded-xl bg-studio-surface border border-studio-border flex items-center justify-center text-studio-secondary hover:text-studio-ink active:scale-95"
              aria-label="Open Navigation Menu"
            >
              <Menu className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE SLIDE-OVER DRAWER */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex justify-end bg-studio-ink/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className="fixed inset-0"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />
          <div className="relative w-full max-w-xs bg-studio-surface h-full shadow-2xl p-6 flex flex-col justify-between overflow-y-auto z-10 animate-in slide-in-from-right duration-300">
            <div className="space-y-6">
              {/* Drawer Top Branding & Close Button */}
              <div className="flex items-center justify-between pb-4 border-b border-studio-border">
                <div className="flex items-center gap-2.5">
                  <StudioLogo logoUrl={settings?.studioLogoUrl} size="sm" />
                  <div>
                    <span className="font-display italic font-bold text-sm text-studio-ink block">
                      {settings?.studioName || 'Nails by Sirii'}
                    </span>
                    <span className="text-[10px] text-studio-muted">Client Menu</span>
                  </div>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-8 h-8 rounded-full bg-studio-subtle flex items-center justify-center text-studio-secondary hover:text-studio-ink"
                  aria-label="Close Menu"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="space-y-1.5 text-xs font-semibold text-studio-secondary font-sans">
                <a
                  href="#catalogue"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 p-3 rounded-2xl hover:bg-studio-wineLight hover:text-studio-wine transition-colors"
                >
                  <Sparkles className="w-4 h-4 text-studio-wine" />
                  <span>Menu & Services</span>
                </a>
                <a
                  href="#customizer"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 p-3 rounded-2xl hover:bg-studio-wineLight hover:text-studio-wine transition-colors"
                >
                  <Palette className="w-4 h-4 text-purple-600" />
                  <span>Interactive Customizer</span>
                </a>
                <a
                  href="#lookbook"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 p-3 rounded-2xl hover:bg-studio-wineLight hover:text-studio-wine transition-colors"
                >
                  <Eye className="w-4 h-4 text-studio-gold" />
                  <span>Curated Looks</span>
                </a>
                <a
                  href="#booking-section"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 p-3 rounded-2xl hover:bg-studio-wineLight hover:text-studio-wine transition-colors"
                >
                  <Calendar className="w-4 h-4 text-emerald-600" />
                  <span>Reserve Appointment</span>
                </a>
                <a
                  href="#reviews"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 p-3 rounded-2xl hover:bg-studio-wineLight hover:text-studio-wine transition-colors"
                >
                  <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
                  <span>Client Feedback ({avgRating} ★)</span>
                </a>
                <a
                  href="#studio-info"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 p-3 rounded-2xl hover:bg-studio-wineLight hover:text-studio-wine transition-colors"
                >
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  <span>Hygiene & Location</span>
                </a>
              </nav>

              {/* Price Visibility Switch inside Drawer */}
              <div className="p-3.5 rounded-2xl bg-studio-subtle border border-studio-border space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-studio-muted block">
                  Catalogue Presentation
                </span>
                <div className="flex rounded-xl bg-studio-surface p-1 border border-studio-border text-[11px] font-semibold">
                  <button
                    onClick={() => setHidePrices(false)}
                    className={`flex-1 py-1.5 rounded-lg transition-all ${
                      !hidePrices ? 'bg-studio-wine text-white shadow-xs' : 'text-studio-muted'
                    }`}
                  >
                    With Prices
                  </button>
                  <button
                    onClick={() => setHidePrices(true)}
                    className={`flex-1 py-1.5 rounded-lg transition-all ${
                      hidePrices ? 'bg-amber-700 text-white shadow-xs' : 'text-studio-muted'
                    }`}
                  >
                    No Prices
                  </button>
                </div>
              </div>

              {/* Quick Actions in Drawer */}
              <div className="space-y-2 pt-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setIsShareModalOpen(true);
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-studio-surface border border-studio-border text-studio-wine hover:bg-studio-wineLight text-xs font-semibold flex items-center justify-center gap-2 shadow-xs"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Share Catalogue (No Prices)</span>
                </button>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-xs"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp Sirii Directly</span>
                </a>
              </div>
            </div>

            {/* Bottom Owner Link */}
            <div className="pt-6 border-t border-studio-border text-center">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenPasscodeModal();
                }}
                className="text-[11px] font-semibold text-studio-muted hover:text-studio-ink flex items-center justify-center gap-1.5 mx-auto"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Studio Hub Owner Access</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. HERO SECTION & POSITIONING STATEMENT */}
      <section className="relative overflow-hidden pt-8 pb-12 sm:pt-14 sm:pb-16 px-4 sm:px-6">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-b from-studio-subtle via-studio-wineLight/20 to-transparent blur-3xl pointer-events-none -z-10" />

        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex flex-wrap items-center justify-center gap-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-studio-surface border border-studio-border shadow-xs text-studio-wine text-[11px] sm:text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Nails by Sirii • Garhi Cantt, Dehradun</span>
            </div>
            <a
              href="https://maps.google.com/?q=Nails+by+Sirii+Laxmi+Navraj+Plaza+Garhi+Cantonment+Dehradun"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 shadow-xs text-amber-800 text-[11px] sm:text-xs font-bold hover:bg-amber-100 transition-colors"
            >
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
              <span>4.9 ★ (344 Google Reviews)</span>
            </a>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] sm:text-xs font-semibold">
              <Clock className="w-3.5 h-3.5 text-emerald-600" />
              <span>Open Daily: {settings?.timings || '12:00 PM – 7:00 PM'}</span>
            </div>
          </div>

          <h1 className="font-display italic font-bold text-3xl sm:text-5xl md:text-6xl text-studio-ink tracking-tight leading-[1.12]">
            Sculptural Nail Architecture & <br className="hidden sm:inline" />
            <span className="not-italic text-studio-wine">Bespoke Hand-Painted Art</span>
          </h1>

          <p className="text-xs sm:text-sm text-studio-secondary max-w-xl mx-auto leading-relaxed font-sans">
            An intimate studio in Garhi Cantt dedicated to natural nail health, Japanese builder gel (BIAB) overlays, precision sculpted extensions, and thoughtful editorial art. Transparent pricing and honest time estimates.
          </p>

          {/* Key Standards Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 pt-1 text-[10px] sm:text-[11px] text-studio-secondary font-semibold font-sans">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-studio-surface border border-studio-border shadow-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>100% Autoclave-Sterilized Tools</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-studio-surface border border-studio-border shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-studio-wine" />
              <span>Zero Natural Nail Damage</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-studio-surface border border-studio-border shadow-xs">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
              <span>3–4 Week Retention</span>
            </div>
          </div>

          {/* Call to Actions on Mobile / Desktop */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-3 pt-3 max-w-md sm:max-w-none mx-auto">
            <a
              href="#booking-section"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-studio-wine hover:bg-studio-wineHover text-white font-semibold text-xs shadow-studio active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <span>Reserve Your Appointment</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <a
              href="#customizer"
              className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-studio-surface border border-studio-border hover:border-studio-borderStrong text-studio-ink font-semibold text-xs shadow-studio transition-all flex items-center justify-center gap-2"
            >
              <Palette className="w-3.5 h-3.5 text-purple-600" />
              <span>Interactive Customizer</span>
            </a>

            <button
              onClick={() => setIsRepairModalOpen(true)}
              className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 font-semibold text-xs shadow-xs transition-all flex items-center justify-center gap-2 hover:bg-amber-100"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              <span>Urgent Repair Desk</span>
            </button>
          </div>
        </div>

        {/* 3. IMMEDIATE VISUAL SHOWCASE (Above the Fold Engagement) */}
        <div className="max-w-5xl mx-auto mt-10">
          <div className="flex items-center justify-between pb-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-studio-wine block">
                Signature Portfolio
              </span>
              <h2 className="font-display italic font-bold text-lg sm:text-xl text-studio-ink">
                Featured Atelier Sets
              </h2>
            </div>
            <a
              href="#lookbook"
              className="text-xs font-semibold text-studio-wine hover:underline flex items-center gap-1"
            >
              <span>View All Looks</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {lookbookItems.slice(0, 4).map((look) => (
              <div
                key={look.id}
                className="bg-studio-surface rounded-2xl p-3.5 sm:p-4 border border-studio-border hover:border-studio-borderStrong shadow-studio transition-all flex flex-col justify-between group"
              >
                <div className="space-y-2.5">
                  {/* Schematic Silhouette Visual */}
                  <div className="h-36 sm:h-40 rounded-xl bg-studio-subtle/60 flex items-center justify-center relative overflow-hidden group-hover:bg-studio-wineLight/40 transition-colors">
                    <NailTipSchematic
                      shape={look.shape}
                      length={look.length}
                      baseColor={look.base}
                      finish={look.finish}
                      size="sm"
                    />
                    <span className="absolute top-2 left-2 text-[9px] px-2 py-0.5 rounded-full bg-studio-surface/90 text-studio-ink font-semibold border border-studio-border">
                      {look.shape.name}
                    </span>
                  </div>

                  <div>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-studio-wine block">
                      {look.tag}
                    </span>
                    <h3 className="font-display italic font-bold text-sm text-studio-ink truncate">
                      {look.title}
                    </h3>
                    <p className="text-[11px] text-studio-muted line-clamp-2 leading-snug mt-0.5">
                      {look.desc}
                    </p>
                  </div>
                </div>

                <div className="pt-3 mt-2 border-t border-studio-border/60 flex items-center justify-between gap-1">
                  <div>
                    {!hidePrices ? (
                      <span className="font-display font-bold text-sm text-studio-ink block">
                        {look.price}
                      </span>
                    ) : (
                      <span className="text-[10px] font-display italic text-studio-wine block">
                        On request
                      </span>
                    )}
                    <span className="text-[9px] text-studio-muted block">
                      {look.duration}
                    </span>
                  </div>

                  <button
                    onClick={() => handleBookLook(look)}
                    className="px-2.5 py-1.5 rounded-lg bg-studio-wine hover:bg-studio-wineHover text-white text-[10px] font-semibold transition-all active:scale-95 shadow-xs flex items-center gap-1"
                  >
                    <span>Reserve</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. DEDICATED SERVICES & ART CATALOGUE */}
      <section id="catalogue" className="py-12 sm:py-16 px-4 sm:px-6 max-w-7xl mx-auto border-t border-studio-border">
        <div className="space-y-6 sm:space-y-8">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-studio-wineLight text-studio-wine text-[11px] font-semibold">
                <Sparkles className="w-3 h-3" />
                <span>Atelier Service Menu</span>
              </div>
              <h2 className="font-display italic font-bold text-2xl sm:text-4xl text-studio-ink">
                Services & Transparent Pricing
              </h2>
              <p className="text-xs text-studio-secondary max-w-lg leading-relaxed font-sans">
                Every service includes comprehensive dry Russian e-file cuticle detailing, high-adhesion nail preparation, structural apex balance, and deep cuticle nourishment.
              </p>
            </div>

            {/* Catalogue Control Bar: Hide Prices Switcher & Share */}
            <div className="flex items-center gap-2">
              <div className="flex items-center rounded-2xl bg-studio-surface border border-studio-border p-1 shadow-xs">
                <button
                  onClick={() => setHidePrices(false)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    !hidePrices
                      ? 'bg-studio-wine text-white shadow-xs'
                      : 'text-studio-muted hover:text-studio-ink'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>With Prices</span>
                </button>
                <button
                  onClick={() => setHidePrices(true)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    hidePrices
                      ? 'bg-amber-700 text-white shadow-xs'
                      : 'text-studio-muted hover:text-studio-ink'
                  }`}
                >
                  <EyeOff className="w-3.5 h-3.5" />
                  <span>Without Prices</span>
                </button>
              </div>

              <button
                onClick={() => setIsShareModalOpen(true)}
                className="px-3.5 py-1.5 rounded-2xl bg-studio-surface border border-studio-border hover:border-studio-borderStrong text-studio-secondary font-semibold text-xs shadow-studio transition-all flex items-center gap-1.5"
              >
                <Share2 className="w-3.5 h-3.5 text-studio-wine" />
                <span className="hidden xs:inline">Share</span>
              </button>
            </div>
          </div>

          {/* Notification when hidePrices is active */}
          {hidePrices && (
            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200/80 text-amber-900 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 animate-in fade-in">
              <div className="flex items-center gap-2">
                <EyeOff className="w-4 h-4 text-amber-700 shrink-0" />
                <div>
                  <span className="font-semibold">Portfolio Preview Mode:</span>{' '}
                  <span className="text-amber-800">
                    All treatments and designs are shown without prices. Suitable for portfolio sharing with clients.
                  </span>
                </div>
              </div>
              <button
                onClick={() => setHidePrices(false)}
                className="self-start sm:self-auto px-3 py-1 rounded-xl bg-white border border-amber-300 text-amber-900 font-bold hover:bg-amber-100 transition-colors text-[11px] shrink-0"
              >
                Restore Prices
              </button>
            </div>
          )}

          {/* Search & Category Tabs */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
              {/* Category Pills (Touch scrollable) */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3.5 py-2 sm:py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                      activeCategory === cat
                        ? 'bg-studio-wine text-white shadow-xs'
                        : 'bg-studio-surface border border-studio-border hover:border-studio-borderStrong text-studio-secondary'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Search Bar */}
              <div className="relative sm:w-64">
                <Search className="w-3.5 h-3.5 text-studio-muted absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search treatments or art..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-studio-surface border border-studio-border rounded-xl text-base sm:text-xs text-studio-ink focus:outline-none focus:border-studio-wine font-sans"
                />
              </div>
            </div>
          </div>

          {/* Catalogue Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredServices.map((srv) => (
              <div
                key={srv.id}
                className="bg-studio-surface rounded-3xl p-5 sm:p-6 border border-studio-border hover:border-studio-borderStrong shadow-studio transition-all space-y-4 flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  {/* Top tags */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-studio-wineLight text-studio-wine border border-studio-border">
                      {srv.category}
                    </span>
                    <span className="text-[10px] text-studio-muted font-semibold flex items-center gap-1">
                      <Clock className="w-3 h-3 text-studio-wine" />
                      {srv.duration} mins
                    </span>
                  </div>

                  {/* Service Title */}
                  <div>
                    <h3 className="font-display italic font-bold text-lg text-studio-ink group-hover:text-studio-wine transition-colors">
                      {srv.name}
                    </h3>
                    {srv.popular && (
                      <span className="inline-block mt-1 text-[9px] font-bold px-2 py-0.5 rounded-full bg-studio-goldLight text-amber-900 border border-amber-200">
                        Signature Treatment
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-xs text-studio-secondary leading-relaxed font-sans">
                    {srv.description}
                  </p>

                  {/* Quality Checklist */}
                  <div className="pt-2 border-t border-studio-border/50 space-y-1 text-[11px] text-studio-secondary font-medium font-sans">
                    <div className="flex items-center gap-1.5">
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span>Dry Russian e-file cuticle care</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span>Health-first natural nail preservation</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Card Footer: Price & Booking */}
                <div className="pt-4 border-t border-studio-border flex items-center justify-between gap-3">
                  <div>
                    {hidePrices ? (
                      <div>
                        <span className="text-[9px] font-bold uppercase tracking-wider text-studio-muted block">
                          Treatment
                        </span>
                        <span className="text-xs font-display italic font-bold text-studio-wine">
                          Price on Request
                        </span>
                      </div>
                    ) : (
                      <div>
                        <span className="text-[9px] font-bold uppercase tracking-wider text-studio-muted block">
                          Treatment Fee
                        </span>
                        <span className="font-display font-bold text-lg text-studio-ink">
                          ₹{Number(srv.price).toLocaleString('en-IN')}
                        </span>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => handleSelectFromCatalogue(srv)}
                    className="px-4 py-2.5 sm:py-2 rounded-xl bg-studio-canvas hover:bg-studio-wineLight text-studio-ink hover:text-studio-wine border border-studio-border font-semibold text-xs transition-all flex items-center gap-1.5 active:scale-95 shadow-xs"
                  >
                    <span>Select</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. INTERACTIVE VIRTUAL NAIL STUDIO / CUSTOMIZER (Mobile First Order) */}
      <section id="customizer" className="py-12 sm:py-16 px-4 sm:px-6 max-w-7xl mx-auto border-t border-studio-border">
        <div className="space-y-6 sm:space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-studio-wineLight text-studio-wine text-[11px] font-semibold">
              <Palette className="w-3 h-3" />
              <span>Interactive Set Customizer</span>
            </div>
            <h2 className="font-display italic font-bold text-2xl sm:text-4xl text-studio-ink">
              Design Your Bespoke Nail Set
            </h2>
            <p className="text-xs text-studio-secondary leading-relaxed font-sans">
              Select your preferred silhouette, extension length, base mineral shade, and hand-painted art finish with instant price and time synchronization.
            </p>
          </div>

          {/* On mobile: Preview is placed FIRST (order-first) so changes are instantly visible! */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-start">
            {/* Visual Preview Card: TOP on Mobile, Sticky Right on Desktop */}
            <div className="order-first lg:order-last space-y-4 lg:sticky lg:top-24">
              <div className="bg-studio-surface rounded-3xl p-5 sm:p-6 border border-studio-border shadow-studio-float space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-studio-wine block">
                    Live Nail Preview
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-studio-wineLight text-studio-wine font-bold border border-studio-border">
                    Illustrative Schematic Preview
                  </span>
                </div>

                {/* Honest Illustrative Schematic Visual Display */}
                <div className="h-56 sm:h-60 rounded-3xl p-5 flex flex-col items-center justify-center text-center relative overflow-hidden transition-all duration-300 border border-studio-border bg-studio-canvas/50">
                  <NailTipSchematic
                    shape={customShape}
                    length={customLength}
                    baseColor={customBase}
                    finish={customFinish}
                    size="md"
                  />

                  {/* Stylized Nail Tip Card */}
                  <div className="mt-3 relative z-10 space-y-0.5 p-2.5 bg-studio-surface/95 backdrop-blur-md rounded-xl border border-studio-border shadow-studio max-w-[220px]">
                    <span className="font-display italic font-bold text-xs text-studio-ink block">
                      {customShape.name} • {customLength.name}
                    </span>
                    <span className="text-[10px] text-studio-secondary font-medium block">
                      {customBase.name} • {customFinish.name}
                    </span>
                  </div>
                </div>

                {/* Price & Time Summary */}
                <div className="p-3.5 sm:p-4 rounded-2xl bg-studio-subtle border border-studio-border space-y-2 text-xs font-sans">
                  <div className="flex justify-between text-studio-secondary">
                    <span>Base Architecture:</span>
                    <span className="font-semibold text-studio-ink">Natural Builder Gel / Overlay</span>
                  </div>

                  <div className="flex justify-between text-studio-secondary">
                    <span>Selected Shape:</span>
                    <span className="font-semibold text-studio-ink">{customShape.name}</span>
                  </div>

                  <div className="flex justify-between text-studio-secondary">
                    <span>Finish & Art:</span>
                    <span className="font-semibold text-studio-ink">{customFinish.name}</span>
                  </div>

                  <div className="flex justify-between text-studio-secondary pt-2 border-t border-studio-border">
                    <span>Estimated Duration:</span>
                    <span className="font-semibold text-studio-ink">{customizerTotalDuration} mins</span>
                  </div>

                  {!hidePrices && (
                    <div className="flex justify-between items-baseline pt-2 border-t border-studio-border">
                      <span className="font-bold text-studio-ink">Estimated Bill:</span>
                      <span className="font-display italic font-bold text-xl sm:text-2xl text-studio-wine">
                        ₹{Number(customizerTotalPrice).toLocaleString('en-IN')}
                      </span>
                    </div>
                  )}

                  {hidePrices && (
                    <div className="pt-2 border-t border-studio-border text-center text-[11px] text-studio-wine font-display italic">
                      Pricing provided upon reservation
                    </div>
                  )}
                </div>

                {/* Book This Custom Set CTA */}
                <button
                  onClick={handleBookCustomSet}
                  className="w-full py-3.5 rounded-xl bg-studio-wine hover:bg-studio-wineHover text-white font-semibold text-xs shadow-studio transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Reserve This Custom Set</span>
                </button>
              </div>
            </div>

            {/* Step-by-Step Selectors (Below preview on mobile) */}
            <div className="lg:col-span-2 space-y-4 sm:space-y-6 font-sans">
              {/* 1. Shape */}
              <div className="bg-studio-surface rounded-3xl p-5 sm:p-6 border border-studio-border shadow-studio space-y-3">
                <span className="text-xs font-bold text-studio-ink uppercase tracking-wider block">
                  1. Choose Nail Silhouette
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                  {shapes.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setCustomShape(s)}
                      className={`p-3 sm:p-3.5 rounded-2xl border text-left text-xs transition-all active:scale-95 ${
                        customShape.id === s.id
                          ? 'border-studio-wine bg-studio-wineLight shadow-xs'
                          : 'border-studio-border bg-studio-surface hover:border-studio-borderStrong'
                      }`}
                    >
                      <span className="font-display italic font-bold text-sm text-studio-ink block">
                        {s.name}
                      </span>
                      <span className="text-[10px] text-studio-muted leading-tight block mt-0.5">
                        {s.desc}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Length */}
              <div className="bg-studio-surface rounded-3xl p-5 sm:p-6 border border-studio-border shadow-studio space-y-3">
                <span className="text-xs font-bold text-studio-ink uppercase tracking-wider block">
                  2. Choose Extension Length
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                  {lengths.map((l) => (
                    <button
                      key={l.id}
                      onClick={() => setCustomLength(l)}
                      className={`p-3 sm:p-3.5 rounded-2xl border text-center text-xs transition-all active:scale-95 ${
                        customLength.id === l.id
                          ? 'border-studio-wine bg-studio-wine text-white font-bold shadow-xs'
                          : 'border-studio-border bg-studio-surface hover:border-studio-borderStrong text-studio-secondary font-semibold'
                      }`}
                    >
                      <span className="block">{l.name}</span>
                      <span
                        className={`text-[10px] block mt-0.5 ${
                          customLength.id === l.id ? 'text-white/80' : 'text-studio-muted'
                        }`}
                      >
                        {hidePrices
                          ? 'Length'
                          : l.extra > 0
                            ? `+₹${l.extra}`
                            : 'Included'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Base Coat Palette */}
              <div className="bg-studio-surface rounded-3xl p-5 sm:p-6 border border-studio-border shadow-studio space-y-3">
                <span className="text-xs font-bold text-studio-ink uppercase tracking-wider block">
                  3. Choose Base Mineral Tint
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                  {baseColors.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setCustomBase(c)}
                      className={`p-2.5 sm:p-3 rounded-2xl border flex items-center gap-2.5 text-xs transition-all active:scale-95 ${
                        customBase.id === c.id
                          ? 'border-studio-wine bg-studio-wineLight shadow-xs'
                          : 'border-studio-border bg-studio-surface hover:border-studio-borderStrong'
                      }`}
                    >
                      <div
                        className="w-6 h-6 sm:w-7 sm:h-7 rounded-full shadow-inner border shrink-0"
                        style={{ backgroundColor: c.hex, borderColor: c.border }}
                      />
                      <span className="font-semibold text-studio-ink text-xs truncate">{c.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. Finish & Nail Art Tier */}
              <div className="bg-studio-surface rounded-3xl p-5 sm:p-6 border border-studio-border shadow-studio space-y-3">
                <span className="text-xs font-bold text-studio-ink uppercase tracking-wider block">
                  4. Choose Art Finish & Shimmer
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                  {finishes.map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setCustomFinish(f)}
                      className={`p-3 sm:p-3.5 rounded-2xl border text-left text-xs transition-all flex items-start justify-between active:scale-95 ${
                        customFinish.id === f.id
                          ? 'border-studio-wine bg-studio-wineLight shadow-xs'
                          : 'border-studio-border bg-studio-surface hover:border-studio-borderStrong'
                      }`}
                    >
                      <div>
                        <span className="font-display italic font-bold text-sm text-studio-ink block">
                          {f.name}
                        </span>
                        <span className="text-[10px] text-studio-muted block mt-0.5">
                          {f.desc}
                        </span>
                      </div>
                      {!hidePrices && (
                        <span className="font-display font-bold text-studio-wine shrink-0 ml-2">
                          {f.price > 0 ? `+₹${f.price}` : 'Included'}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CURATED LOOKBOOK GALLERY */}
      <section id="lookbook" className="py-12 sm:py-16 px-4 sm:px-6 max-w-7xl mx-auto border-t border-studio-border">
        <div className="space-y-6 sm:space-y-8">
          <div className="text-center space-y-2">
            <span className="text-[10px] uppercase font-bold tracking-widest text-studio-wine block">
              Editorial Portfolio
            </span>
            <h2 className="font-display italic font-bold text-2xl sm:text-4xl text-studio-ink">
              Curated Studio Looks
            </h2>
            <p className="text-xs text-studio-secondary max-w-md mx-auto font-sans">
              Signature looks crafted at our Garhi Cantt atelier. Select any design to initialize your appointment reservation, or bring custom visual references to your session.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {lookbookItems.map((item) => (
              <div
                key={item.id}
                className="bg-studio-surface rounded-3xl p-5 sm:p-6 border border-studio-border hover:border-studio-borderStrong shadow-studio transition-all space-y-4 group flex flex-col justify-between"
              >
                <div>
                  <div className="h-44 sm:h-48 rounded-2xl bg-studio-subtle flex flex-col items-center justify-center text-center p-4 relative overflow-hidden group-hover:bg-studio-wineLight/40 transition-colors">
                    <NailTipSchematic
                      shape={item.shape}
                      length={item.length}
                      baseColor={item.base}
                      finish={item.finish}
                      size="md"
                    />
                    <span className="absolute top-3 left-3 text-[10px] font-semibold text-studio-wine uppercase tracking-wider bg-studio-surface/90 px-2.5 py-0.5 rounded-full border border-studio-border">
                      {item.tag}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs pt-4 font-sans">
                    <div className="flex justify-between items-baseline">
                      <span className="font-display italic font-bold text-base text-studio-ink">
                        {item.title}
                      </span>
                      {!hidePrices && (
                        <span className="font-display font-bold text-studio-wine text-base">
                          {item.price}
                        </span>
                      )}
                      {hidePrices && (
                        <span className="text-[10px] text-studio-muted font-display italic">
                          On Request
                        </span>
                      )}
                    </div>
                    <p className="text-studio-secondary leading-relaxed">{item.desc}</p>
                    <div className="flex items-center gap-2 pt-1 text-[11px] text-studio-muted font-medium">
                      <span>{item.shape.name} ({item.length.name})</span>
                      <span>•</span>
                      <span>~{item.duration}</span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleBookLook(item)}
                  className="w-full py-2.5 rounded-xl bg-studio-canvas hover:bg-studio-wineLight text-studio-ink hover:text-studio-wine font-semibold text-xs transition-all flex items-center justify-center gap-1.5 active:scale-95 border border-studio-border"
                >
                  <span>Reserve This Look</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. ONLINE SELF-BOOKING WIZARD */}
      <section id="booking-section" className="py-12 sm:py-16 px-4 sm:px-6 max-w-4xl mx-auto border-t border-studio-border">
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <span className="text-[10px] uppercase font-bold tracking-widest text-studio-wine block">
              Online Reservation
            </span>
            <h2 className="font-display italic font-bold text-2xl sm:text-4xl text-studio-ink">
              Reserve Your Studio Session
            </h2>
            <p className="text-xs text-studio-secondary max-w-md mx-auto font-sans">
              Choose your service or custom set, select your preferred time slot within operating hours (12:00 PM – 7:00 PM), and receive your confirmation.
            </p>
          </div>

          {/* Stepper indicator */}
          <div className="flex items-center justify-center gap-2 max-w-md mx-auto py-2">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    bookingStep === s
                      ? 'bg-studio-wine text-white shadow-studio'
                      : bookingStep > s
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-studio-subtle border border-studio-border text-studio-muted'
                  }`}
                >
                  {bookingStep > s ? '✓' : s}
                </div>
                {s < 4 && <div className="w-6 sm:w-10 h-0.5 bg-studio-border" />}
              </div>
            ))}
          </div>

          <div className="bg-studio-surface rounded-3xl p-5 sm:p-8 border border-studio-border shadow-studio-float">
            {/* STEP 1: Select Service */}
            {bookingStep === 1 && (
              <div className="space-y-5 sm:space-y-6 animate-fade-in text-xs font-sans">
                <div>
                  <h3 className="font-display italic font-bold text-lg sm:text-xl text-studio-ink mb-1">
                    1. Select Service or Custom Set
                  </h3>
                  <p className="text-studio-secondary text-xs">
                    Choose the primary treatment for your appointment:
                  </p>
                </div>

                {/* Customizer Active Selection Card */}
                {bookingMode === 'customSet' && (
                  <div className="p-4 sm:p-5 rounded-2xl border-2 border-studio-wine bg-studio-wineLight/70 shadow-xs space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-studio-wine" />
                        <span className="font-display italic font-bold text-base text-studio-ink">
                          Configured Custom Set
                        </span>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-studio-surface text-studio-wine font-bold border border-studio-border">
                        From Customizer
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] p-3 rounded-xl bg-studio-surface border border-studio-border">
                      <div>
                        <span className="text-studio-muted block">Silhouette</span>
                        <span className="font-semibold text-studio-ink">{customShape.name}</span>
                      </div>
                      <div>
                        <span className="text-studio-muted block">Length</span>
                        <span className="font-semibold text-studio-ink">
                          {customLength.name} {customLength.extra > 0 && !hidePrices ? `(+₹${customLength.extra})` : ''}
                        </span>
                      </div>
                      <div>
                        <span className="text-studio-muted block">Base Tint</span>
                        <span className="font-semibold text-studio-ink">{customBase.name}</span>
                      </div>
                      <div>
                        <span className="text-studio-muted block">Art Finish</span>
                        <span className="font-semibold text-studio-ink">
                          {customFinish.name} {customFinish.price > 0 && !hidePrices ? `(+₹${customFinish.price})` : ''}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <div className="text-[11px] text-studio-secondary">
                        Session Duration: <strong className="text-studio-ink">~{customizerTotalDuration} mins</strong>
                      </div>
                      {!hidePrices && (
                        <div className="font-display font-bold text-lg text-studio-wine">
                          ₹{Number(customizerTotalPrice).toLocaleString('en-IN')}
                        </div>
                      )}
                      {hidePrices && (
                        <div className="text-xs font-display italic text-studio-wine font-bold">
                          Price on Request
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-studio-border text-xs">
                      <button
                        type="button"
                        onClick={() => scrollTo('customizer')}
                        className="text-studio-wine hover:underline font-semibold text-left"
                      >
                        ✎ Modify specifications in customizer
                      </button>
                      <button
                        type="button"
                        onClick={() => setBookingMode('service')}
                        className="text-studio-muted hover:text-studio-ink font-medium text-left"
                      >
                        Switch to standard catalogue service
                      </button>
                    </div>
                  </div>
                )}

                {/* Lookbook Active Selection Card */}
                {bookingMode === 'lookbook' && selectedLook && (
                  <div className="p-4 sm:p-5 rounded-2xl border-2 border-studio-wine bg-studio-wineLight/70 shadow-xs space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-studio-wine" />
                        <span className="font-display italic font-bold text-base text-studio-ink">
                          Curated Look: {selectedLook.title}
                        </span>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-studio-surface text-studio-wine font-bold border border-studio-border">
                        {selectedLook.tag}
                      </span>
                    </div>

                    <p className="text-[11px] text-studio-secondary">{selectedLook.desc}</p>

                    <div className="flex items-center justify-between pt-1">
                      <div className="text-[11px] text-studio-secondary">
                        Silhouette: <strong className="text-studio-ink">{selectedLook.shape.name}</strong> • Time: <strong className="text-studio-ink">~{selectedLook.durationNum} mins</strong>
                      </div>
                      {!hidePrices && (
                        <div className="font-display font-bold text-lg text-studio-wine">
                          ₹{Number(selectedLook.priceNum).toLocaleString('en-IN')}
                        </div>
                      )}
                      {hidePrices && (
                        <div className="text-xs font-display italic text-studio-wine font-bold">
                          Price on Request
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-studio-border text-xs">
                      <button
                        type="button"
                        onClick={() => scrollTo('lookbook')}
                        className="text-studio-wine hover:underline font-semibold text-left"
                      >
                        ← Choose a different look
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setBookingMode('service');
                          setSelectedLook(null);
                        }}
                        className="text-studio-muted hover:text-studio-ink font-medium text-left"
                      >
                        Switch to standard catalogue service
                      </button>
                    </div>
                  </div>
                )}

                {/* Catalogue Services List */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-studio-secondary">
                      {bookingMode === 'service' ? 'All Studio Services' : 'Or switch to standard service:'}
                    </span>
                  </div>
                  {services
                    .filter((s) => s.category !== 'Nail Art' && s.category !== 'Add-on')
                    .map((srv) => {
                      const isSelected = bookingMode === 'service' && selectedServiceId === srv.id;
                      return (
                        <div
                          key={srv.id}
                          onClick={() => {
                            setBookingMode('service');
                            setSelectedLook(null);
                            setSelectedServiceId(srv.id);
                          }}
                          className={`p-3.5 sm:p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                            isSelected
                              ? 'border-studio-wine bg-studio-wineLight/70 shadow-xs'
                              : 'border-studio-border hover:border-studio-borderStrong bg-studio-surface'
                          }`}
                        >
                          <div className="space-y-1 pr-3">
                            <div className="flex items-center gap-2">
                              <span className="font-display italic font-bold text-sm text-studio-ink">
                                {srv.name}
                              </span>
                              {srv.popular && (
                                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-studio-goldLight text-amber-900 border border-amber-200">
                                  Most Popular
                                </span>
                              )}
                            </div>
                            <p className="text-studio-secondary text-[11px] leading-relaxed">
                              {srv.description}
                            </p>
                            <span className="text-[10px] text-studio-muted font-medium block">
                              Duration: ~{srv.duration} mins
                            </span>
                          </div>
                          <div className="text-right shrink-0">
                            {hidePrices ? (
                              <span className="text-xs font-display italic text-studio-wine font-bold">
                                On Request
                              </span>
                            ) : (
                              <span className="font-display font-bold text-base text-studio-ink">
                                ₹{Number(srv.price).toLocaleString('en-IN')}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                </div>

                {/* Addons Selection */}
                <div className="pt-4 border-t border-studio-border space-y-3">
                  <span className="font-semibold text-studio-ink block">
                    Optional Nail Art Accents & Add-ons
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {addonsList.map((addon) => {
                      const isSelected = selectedAddons.includes(addon.name);
                      return (
                        <button
                          type="button"
                          key={addon.id}
                          onClick={() => toggleAddon(addon.name)}
                          className={`p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between active:scale-95 ${
                            isSelected
                              ? 'bg-studio-wineLight text-studio-wine border-studio-wine font-semibold shadow-xs'
                              : 'bg-studio-canvas/50 border-studio-border hover:bg-studio-surface text-studio-secondary'
                          }`}
                        >
                          <span className="truncate pr-1">{addon.name}</span>
                          {!hidePrices && (
                            <span className="shrink-0 font-display font-bold text-studio-ink">
                              +₹{Number(addon.price).toLocaleString('en-IN')}
                            </span>
                          )}
                          {hidePrices && (
                            <span className="shrink-0 text-[10px] text-studio-muted font-medium">
                              Optional
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    type="button"
                    onClick={() => setBookingStep(2)}
                    className="w-full sm:w-auto px-6 py-3 sm:py-2.5 rounded-xl bg-studio-wine hover:bg-studio-wineHover text-white font-semibold text-xs shadow-studio transition-all flex items-center justify-center gap-1.5 active:scale-95"
                  >
                    <span>Next: Shape & Aesthetic</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: Shape & Style */}
            {bookingStep === 2 && (
              <div className="space-y-5 sm:space-y-6 animate-fade-in text-xs font-sans">
                <div>
                  <h3 className="font-display italic font-bold text-lg sm:text-xl text-studio-ink mb-1">
                    2. Choose Silhouette & Aesthetic
                  </h3>
                  <p className="text-studio-secondary text-xs">
                    Sirii will customize and balance the architecture to complement your natural nail bed.
                  </p>
                </div>

                {/* Shape */}
                <div className="space-y-2">
                  <label className="font-semibold text-studio-secondary block">
                    Nail Silhouette
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {shapes.map((s) => (
                      <button
                        type="button"
                        key={s.id}
                        onClick={() => setSelectedShape(s.name)}
                        className={`p-2.5 rounded-xl border text-xs font-semibold transition-all active:scale-95 ${
                          selectedShape === s.name
                            ? 'bg-studio-wine text-white border-studio-wine shadow-xs'
                            : 'bg-studio-surface border-studio-border hover:bg-studio-subtle text-studio-secondary'
                        }`}
                      >
                        {s.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Length */}
                <div className="space-y-2">
                  <label className="font-semibold text-studio-secondary block">
                    Extension Length
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {['Short', 'Medium', 'Long', 'Extra Long'].map((len) => (
                      <button
                        type="button"
                        key={len}
                        onClick={() => setSelectedLength(len)}
                        className={`p-2.5 rounded-xl border text-xs font-semibold transition-all active:scale-95 ${
                          selectedLength === len
                            ? 'bg-studio-wine text-white border-studio-wine shadow-xs'
                            : 'bg-studio-surface border-studio-border hover:bg-studio-subtle text-studio-secondary'
                        }`}
                      >
                        {len}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Aesthetic */}
                <div className="space-y-2">
                  <label className="font-semibold text-studio-secondary block">
                    Aesthetic Direction
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {[
                      '3D Chrome & Glaze',
                      'BIAB Clean Natural Architecture',
                      'French Ombre Minimalist',
                      'Velvet Cat Eye Magnetic',
                      'Sculptural Charms & Textures',
                      'Hand-Painted Editorial Abstract'
                    ].map((aesthetic) => (
                      <button
                        type="button"
                        key={aesthetic}
                        onClick={() => setSelectedAesthetic(aesthetic)}
                        className={`p-2.5 rounded-xl border text-left text-xs font-semibold transition-all active:scale-95 ${
                          selectedAesthetic === aesthetic
                            ? 'bg-studio-wineLight text-studio-wine border-studio-wine shadow-xs'
                            : 'bg-studio-surface border-studio-border hover:bg-studio-subtle text-studio-secondary'
                        }`}
                      >
                        {aesthetic}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between pt-4 gap-2">
                  <button
                    type="button"
                    onClick={() => setBookingStep(1)}
                    className="px-4 py-2.5 rounded-xl border border-studio-border text-studio-secondary hover:bg-studio-subtle text-xs font-semibold"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setBookingStep(3)}
                    className="px-6 py-2.5 rounded-xl bg-studio-wine hover:bg-studio-wineHover text-white font-semibold text-xs shadow-studio transition-all flex items-center gap-1.5 active:scale-95"
                  >
                    <span>Next: Date & Time →</span>
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Date & Time */}
            {bookingStep === 3 && (
              <div className="space-y-5 sm:space-y-6 animate-fade-in text-xs font-sans">
                <div>
                  <h3 className="font-display italic font-bold text-lg sm:text-xl text-studio-ink mb-1">
                    3. Select Date & Appointment Slot
                  </h3>
                  <p className="text-studio-secondary text-xs">
                    Estimated session time: ~{totalDuration} mins. Operating hours: 12:00 PM – 7:00 PM IST.
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="font-semibold text-studio-secondary block">
                    Choose Date
                  </label>
                  <input
                    type="date"
                    required
                    min={getKolkataTodayString()}
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-studio-border bg-studio-canvas/50 focus:bg-studio-surface focus:border-studio-wine outline-none text-base sm:text-xs text-studio-ink"
                  />
                </div>

                <div className="space-y-2">
                  <label className="font-semibold text-studio-secondary block">
                    Available Time Slots (Garhi Cantt Studio)
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {timeSlots.map((slot) => (
                      <button
                        type="button"
                        key={slot}
                        onClick={() => setBookingTime(slot)}
                        className={`p-3 rounded-xl border text-xs font-semibold transition-all active:scale-95 ${
                          bookingTime === slot
                            ? 'bg-studio-wine text-white border-studio-wine shadow-xs'
                            : 'bg-studio-surface border-studio-border hover:bg-studio-subtle text-studio-secondary'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Estimate Box */}
                <div className="p-4 rounded-2xl bg-studio-subtle border border-studio-border flex items-center justify-between">
                  <div>
                    <span className="text-studio-muted text-[10px] uppercase font-bold block">
                      Estimated Duration
                    </span>
                    <span className="font-semibold text-studio-ink">
                      {totalDuration} mins (~{(totalDuration / 60).toFixed(1)} hrs)
                    </span>
                  </div>
                  {!hidePrices && (
                    <div className="text-right">
                      <span className="text-studio-muted text-[10px] uppercase font-bold block">
                        Estimated Total
                      </span>
                      <span className="font-display italic font-bold text-xl text-studio-wine">
                        ₹{Number(totalPrice).toLocaleString('en-IN')}
                      </span>
                    </div>
                  )}
                  {hidePrices && (
                    <div className="text-right">
                      <span className="text-studio-muted text-[10px] uppercase font-bold block">
                        Pricing
                      </span>
                      <span className="font-display italic font-bold text-sm text-studio-wine">
                        On Request
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex justify-between pt-4 gap-2">
                  <button
                    type="button"
                    onClick={() => setBookingStep(2)}
                    className="px-4 py-2.5 rounded-xl border border-studio-border text-studio-secondary hover:bg-studio-subtle text-xs font-semibold"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setBookingStep(4)}
                    className="px-6 py-2.5 rounded-xl bg-studio-wine hover:bg-studio-wineHover text-white font-semibold text-xs shadow-studio transition-all flex items-center gap-1.5 active:scale-95"
                  >
                    <span>Next: Client Details →</span>
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: Client Info & Submit */}
            {bookingStep === 4 && (
              <form onSubmit={handleBookingSubmit} className="space-y-4 sm:space-y-5 animate-fade-in text-xs font-sans">
                <div>
                  <h3 className="font-display italic font-bold text-lg sm:text-xl text-studio-ink mb-1">
                    4. Your Information & Confirmation
                  </h3>
                  <p className="text-studio-secondary text-xs">
                    Please provide your contact details. Sirii will review and confirm your session directly on WhatsApp.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block font-semibold text-studio-secondary mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ananya Sharma"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-studio-border bg-studio-canvas/50 focus:bg-studio-surface focus:border-studio-wine outline-none text-base sm:text-xs text-studio-ink"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-studio-secondary mb-1">
                      Phone Number (for SMS & WhatsApp) *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-studio-border bg-studio-canvas/50 focus:bg-studio-surface focus:border-studio-wine outline-none text-base sm:text-xs text-studio-ink"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-studio-secondary mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="client@gmail.com"
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-studio-border bg-studio-canvas/50 focus:bg-studio-surface focus:border-studio-wine outline-none text-base sm:text-xs text-studio-ink"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-studio-secondary mb-1">
                      Instagram Handle (optional)
                    </label>
                    <input
                      type="text"
                      placeholder="@yourhandle"
                      value={clientInstagram}
                      onChange={(e) => setClientInstagram(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-studio-border bg-studio-canvas/50 focus:bg-studio-surface focus:border-studio-wine outline-none text-base sm:text-xs text-studio-ink"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-studio-secondary mb-1">
                    Allergies or Skin Sensitivities
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. None, or sensitive cuticles / HEMA sensitivity"
                    value={allergies}
                    onChange={(e) => setAllergies(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-studio-border bg-studio-canvas/50 focus:bg-studio-surface focus:border-studio-wine outline-none text-base sm:text-xs text-studio-ink"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-studio-secondary mb-1">
                    Special Requests / Inspo References
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Share any specific design ideas or notes for Sirii. You are also welcome to bring reference images to the studio."
                    value={clientNotes}
                    onChange={(e) => setClientNotes(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-studio-border bg-studio-canvas/50 focus:bg-studio-surface focus:border-studio-wine outline-none text-base sm:text-xs text-studio-ink"
                  />
                </div>

                {/* Advance Deposit Option with Toggle */}
                <div className="p-4 rounded-2xl bg-studio-subtle border border-studio-border space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <span className="font-semibold text-studio-ink text-xs flex items-center gap-1.5">
                        <Wallet className="w-3.5 h-3.5 text-studio-wine" />
                        <span>Optional Advance Deposit to Hold Slot</span>
                      </span>
                      <p className="text-[11px] text-studio-secondary">
                        Transfer a small advance via UPI (GPay / PhonePe) to guarantee your time slot. Fully credited on your final bill.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setClientAdvanceToggle(!clientAdvanceToggle)}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        clientAdvanceToggle ? 'bg-studio-wine' : 'bg-studio-borderStrong'
                      }`}
                      aria-label="Toggle advance payment"
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                          clientAdvanceToggle ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {clientAdvanceToggle ? (
                    <div className="space-y-3 pt-2 border-t border-studio-border animate-in fade-in">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block font-semibold text-studio-secondary mb-1">
                            Advance Amount (₹)
                          </label>
                          <input
                            type="number"
                            min="100"
                            max={totalPrice}
                            step="50"
                            value={clientAdvanceAmount}
                            onChange={(e) => setClientAdvanceAmount(e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-studio-border bg-studio-surface focus:border-studio-wine outline-none text-base sm:text-xs font-semibold text-emerald-800"
                          />
                        </div>

                        <div>
                          <label className="block font-semibold text-studio-secondary mb-1">
                            UPI Transaction Ref / UTR (Optional)
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. 12-digit UTR from GPay / PhonePe"
                            value={clientUpiRef}
                            onChange={(e) => setClientUpiRef(e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-studio-border bg-studio-surface focus:border-studio-wine outline-none text-base sm:text-xs text-studio-ink"
                          />
                        </div>
                      </div>

                      {/* Studio UPI ID Callout */}
                      <div className="p-3 rounded-xl bg-studio-surface border border-studio-border flex items-center justify-between gap-2 text-[11px]">
                        <div>
                          <span className="text-studio-muted">Studio UPI ID (GPay / PhonePe):</span>{' '}
                          <span className="font-mono font-bold text-studio-wine select-all">
                            {settings?.upiId || 'nailsbysirii@okaxis'}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(settings?.upiId || 'nailsbysirii@okaxis');
                            if (onAddToast) onAddToast('UPI ID Copied', 'Paste into Google Pay or PhonePe', 'success');
                          }}
                          className="px-2.5 py-1 rounded-lg bg-studio-wineLight text-studio-wine font-semibold hover:bg-studio-wineLight/80 transition-colors"
                        >
                          Copy UPI
                        </button>
                      </div>

                      {/* Live Breakdown */}
                      <div className="p-3 rounded-xl bg-studio-canvas border border-studio-border flex items-center justify-between text-xs">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-emerald-800 block tracking-wider">
                            Advance Paid Now
                          </span>
                          <span className="font-display italic font-bold text-sm text-emerald-800">
                            ₹{Number(clientAdvanceAmount || 0).toLocaleString('en-IN')}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] uppercase font-bold text-amber-800 block tracking-wider">
                            Pending Balance at Studio
                          </span>
                          {!hidePrices ? (
                            <span className="font-display italic font-bold text-base text-amber-800">
                              ₹{Number(Math.max(0, totalPrice - (Number(clientAdvanceAmount) || 0))).toLocaleString('en-IN')}
                            </span>
                          ) : (
                            <span className="font-display italic font-semibold text-xs text-amber-800">
                              Balance due at appointment
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-[11px] text-studio-muted italic">
                      No advance payment required. The full balance may be settled at the studio upon completion of your nails.
                    </p>
                  )}
                </div>

                <div className="flex justify-between pt-4 gap-2">
                  <button
                    type="button"
                    onClick={() => setBookingStep(3)}
                    className="px-4 py-2.5 rounded-xl border border-studio-border text-studio-secondary hover:bg-studio-subtle text-xs font-semibold"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingBooking}
                    className="px-8 py-3 rounded-xl bg-studio-wine hover:bg-studio-wineHover text-white font-semibold text-xs shadow-studio transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>{isSubmittingBooking ? 'Reserving Your Slot...' : 'Confirm Reservation'}</span>
                  </button>
                </div>
              </form>
            )}

            {/* STEP 5: Booking Confirmed Screen */}
            {bookingStep === 5 && confirmedBooking && (
              <div className="text-center space-y-6 py-6 animate-fade-in text-xs font-sans">
                <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto shadow-studio">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <div className="space-y-1.5">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-studio-wine block">
                    Reservation Confirmed
                  </span>
                  <h3 className="font-display italic font-bold text-2xl text-studio-ink">
                    Thank You, {confirmedBooking.clientName}
                  </h3>
                  <p className="text-studio-secondary text-xs max-w-md mx-auto">
                    Your appointment has been dispatched to Nails by Sirii in Dehradun. Sirii has received the notification and will send a confirmation on WhatsApp.
                  </p>
                </div>

                {/* Appointment Card Recap with Advance & Pending */}
                <div className="p-5 rounded-2xl bg-studio-canvas border border-studio-border max-w-md mx-auto text-left space-y-2.5">
                  <div className="flex justify-between items-baseline pb-2 border-b border-studio-border">
                    <span className="font-semibold text-studio-ink">{confirmedBooking.serviceName}</span>
                    {!hidePrices && (
                      <span className="font-display font-bold text-studio-wine text-base">
                        ₹{Number(confirmedBooking.price).toLocaleString('en-IN')}
                      </span>
                    )}
                    {hidePrices && (
                      <span className="font-display italic text-studio-wine text-xs">
                        Price on Request
                      </span>
                    )}
                  </div>
                  <div className="text-studio-secondary space-y-1 text-xs">
                    <p>
                      <strong className="text-studio-ink">Date & Time:</strong> {confirmedBooking.date} at {confirmedBooking.time}
                    </p>
                    <p>
                      <strong className="text-studio-ink">Studio:</strong> {settings?.studioName || 'Nails by Sirii'}
                    </p>
                    <p>
                      <strong className="text-studio-ink">Location:</strong> {settings?.address || 'Shop No. 7, Laxmi Navraj Plaza, Garhi Cantt, Dehradun 248003'}
                    </p>
                    <p>
                      <strong className="text-studio-ink">Specifications:</strong> {selectedShape} • {selectedLength} • {selectedAesthetic}
                    </p>
                    {Number(confirmedBooking.depositPaid || 0) > 0 && (
                      <div className="pt-2 mt-2 border-t border-studio-border flex items-center justify-between text-[11px]">
                        <span className="text-emerald-800 font-semibold">
                          Advance Paid: ₹{Number(confirmedBooking.depositPaid).toLocaleString('en-IN')}
                        </span>
                        {!hidePrices ? (
                          <span className="text-amber-800 font-bold">
                            To Settle at Studio: ₹{Number(Math.max(0, confirmedBooking.price - confirmedBooking.depositPaid)).toLocaleString('en-IN')}
                          </span>
                        ) : (
                          <span className="text-amber-800 font-semibold">
                            Balance due at studio
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <a
                    href={`https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
                      `Hello Sirii! I have reserved an appointment through your website:\n\nName: ${confirmedBooking.clientName}\nService: ${confirmedBooking.serviceName}\nDate & Time: ${confirmedBooking.date} at ${confirmedBooking.time}\nPhone: ${confirmedBooking.clientPhone}${
                        Number(confirmedBooking.depositPaid || 0) > 0 ? `\nAdvance Paid: ₹${confirmedBooking.depositPaid}` : ''
                      }\n\nLooking forward to my appointment at your Garhi Cantt studio!`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs shadow-studio transition-all active:scale-95 flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Confirm via WhatsApp</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => setBookingStep(1)}
                    className="w-full sm:w-auto px-5 py-3 rounded-xl border border-studio-border bg-studio-surface hover:bg-studio-subtle text-xs font-semibold text-studio-secondary active:scale-95"
                  >
                    Reserve Another Session
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 8. VERIFIED CLIENT TESTIMONIALS */}
      <section id="reviews" className="py-12 sm:py-16 px-4 sm:px-6 max-w-7xl mx-auto border-t border-studio-border">
        <div className="space-y-6 sm:space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-widest text-studio-wine block">
                  Client Experiences
                </span>
                <a
                  href="https://maps.google.com/?q=Nails+by+Sirii+Laxmi+Navraj+Plaza+Garhi+Cantonment+Dehradun"
                  target="_blank"
                  rel="noreferrer"
                  className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 text-[10px] font-bold flex items-center gap-1 border border-amber-200 hover:bg-amber-100 transition-colors"
                >
                  <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                  <span>4.9 ★ on Google (344+ Reviews)</span>
                </a>
              </div>
              <h2 className="font-display italic font-bold text-2xl sm:text-4xl text-studio-ink">
                Verified Studio Feedback
              </h2>
              <p className="text-xs text-studio-secondary max-w-md font-sans">
                Authentic reviews from clients who value health-first nail architecture, long-lasting builder gel, and delicate hand-painted art.
              </p>
            </div>

            <button
              onClick={() => setShowReviewModal(true)}
              className="self-start sm:self-auto px-4 py-2 rounded-xl bg-studio-wineLight hover:bg-studio-subtle text-studio-wine border border-studio-border text-xs font-semibold transition-all flex items-center gap-1.5 shadow-xs active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Share Your Experience</span>
            </button>
          </div>

          {reviews.length === 0 ? (
            <div className="bg-studio-surface rounded-3xl p-8 sm:p-12 border border-dashed border-studio-border text-center space-y-4 max-w-2xl mx-auto">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-500 border border-amber-200 flex items-center justify-center mx-auto shadow-xs">
                <Star className="w-6 h-6 fill-amber-400 text-amber-500" />
              </div>
              <div className="space-y-1">
                <h3 className="font-display italic font-bold text-lg text-studio-ink">
                  Be the First to Review Nails by Sirii
                </h3>
                <p className="text-xs text-studio-secondary max-w-md mx-auto leading-relaxed">
                  Visited our studio recently? We would love to hear about your experience.
                </p>
              </div>
              <button
                onClick={() => setShowReviewModal(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-studio-ink hover:bg-black text-white text-xs font-semibold shadow-studio transition-all active:scale-95"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Write a Review</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="bg-studio-surface rounded-3xl p-5 sm:p-6 border border-studio-border shadow-studio space-y-3 hover:border-studio-borderStrong transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-amber-500">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < (rev.rating || 5)
                                ? 'fill-amber-400 text-amber-500'
                                : 'text-stone-200'
                            }`}
                          />
                        ))}
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] text-emerald-800 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        <ShieldCheck className="w-3 h-3 text-emerald-600" />
                        <span>{rev.source || 'Verified Client'}</span>
                      </div>
                    </div>

                    <p className="text-xs text-studio-secondary italic leading-relaxed font-sans">
                      "{rev.comment}"
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-studio-border text-[11px] font-sans">
                    <div className="space-y-0.5">
                      <span className="font-semibold text-studio-ink block">{rev.clientName}</span>
                      <span className="text-[10px] text-studio-muted">{rev.serviceRendered || 'Signature Gel Service'}</span>
                    </div>
                    {rev.aestheticTag && (
                      <span className="px-2 py-0.5 rounded-full bg-studio-wineLight text-studio-wine text-[10px] font-medium border border-studio-border">
                        {rev.aestheticTag}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 9. STUDIO POLICIES & LOCATION FOOTER */}
      <footer id="studio-info" className="bg-studio-surface border-t border-studio-border pt-12 pb-10 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto space-y-10">
          {/* Policies Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 text-xs text-studio-secondary font-sans">
            <div className="space-y-2 p-5 rounded-3xl bg-studio-canvas border border-studio-border">
              <span className="font-display italic font-bold text-sm text-studio-ink block">
                Appointment Etiquette ⏰
              </span>
              <p className="text-studio-secondary leading-relaxed">
                To dedicate focused attention to every delicate detail, please arrive on time. For existing gel sets requiring removal, select Gel Removal during booking so appropriate time is allocated.
              </p>
            </div>

            <div className="space-y-2 p-5 rounded-3xl bg-studio-canvas border border-studio-border">
              <span className="font-display italic font-bold text-sm text-studio-ink block">
                Hospital-Grade Sterilization
              </span>
              <p className="text-studio-secondary leading-relaxed">
                Your health is uncompromised. All stainless steel implements undergo medical-grade ultrasonic cleaning and high-temperature autoclave sterilization, unsealed in front of you. Files and buffers are single-use.
              </p>
            </div>

            <div className="space-y-2 p-5 rounded-3xl bg-studio-canvas border border-studio-border">
              <span className="font-display italic font-bold text-sm text-studio-ink block">
                3–4 Week Durability & Care
              </span>
              <p className="text-studio-secondary leading-relaxed">
                Apply nourishing cuticle oil daily to maintain natural nail flexibility and prevent lifting. Avoid using nails as tools, and never peel gel off natural nail plates.
              </p>
            </div>
          </div>

          {/* Studio Details & Contact */}
          <div className="pt-6 border-t border-studio-border flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-center md:text-left">
            <div className="flex items-center gap-3">
              <StudioLogo logoUrl={settings?.studioLogoUrl} size="md" />
              <div>
                <span className="font-display italic font-bold text-base text-studio-ink">
                  {settings?.studioName || 'Nails by Sirii'}
                </span>
                <p className="text-studio-muted text-[11px] max-w-sm">
                  {settings?.address || 'Shop No. 7, Laxmi Navraj Plaza, Garhi Cantonment, Garhi Cantt, Dehradun, Uttarakhand 248003'}
                </p>
                <div className="flex items-center gap-3 mt-1 justify-center md:justify-start">
                  <a
                    href="https://maps.google.com/?q=Nails+by+Sirii+Laxmi+Navraj+Plaza+Garhi+Cantonment+Dehradun"
                    target="_blank"
                    rel="noreferrer"
                    className="text-studio-wine hover:underline font-semibold flex items-center gap-1 text-[11px]"
                  >
                    <MapPin className="w-3 h-3 shrink-0" />
                    <span>Get Directions on Maps</span>
                  </a>
                  <span className="text-studio-border">•</span>
                  <span className="text-emerald-800 font-semibold text-[11px] flex items-center gap-1">
                    <Clock className="w-3 h-3 text-emerald-600" />
                    <span>{settings?.timings || '12:00 PM – 7:00 PM'}</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-studio-muted">
              {settings?.phone && (
                <a
                  href={`tel:${settings.phone}`}
                  className="hover:text-studio-wine flex items-center gap-1.5 transition-colors font-semibold"
                >
                  <Phone className="w-3.5 h-3.5 text-studio-wine" />
                  <span>{settings.phone}</span>
                </a>
              )}
              {settings?.instagram && (
                <a
                  href={`https://instagram.com/${settings.instagram.replace('@', '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-studio-wine flex items-center gap-1.5 transition-colors font-semibold"
                >
                  <InstagramIcon className="w-3.5 h-3.5 text-pink-700" />
                  <span>{settings.instagram}</span>
                </a>
              )}
              {settings?.email && (
                <a
                  href={`mailto:${settings.email}`}
                  className="hover:text-studio-wine flex items-center gap-1.5 transition-colors"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>{settings.email}</span>
                </a>
              )}
            </div>

            {/* Studio Hub Passcode Gate Button */}
            <button
              onClick={onOpenPasscodeModal}
              className="px-3 py-1.5 rounded-xl bg-studio-canvas hover:bg-studio-wineLight border border-studio-border text-[11px] font-semibold text-studio-secondary hover:text-studio-wine transition-all flex items-center gap-1.5 shadow-xs active:scale-95"
            >
              <Lock className="w-3 h-3 text-studio-muted" />
              <span>Studio Hub (Owner)</span>
            </button>
          </div>

          <div className="text-center text-[10px] text-studio-muted pt-3 border-t border-studio-border">
            © {new Date().getFullYear()} {settings?.studioName || 'Nails by Sirii'} • Handcrafted with precision in Garhi Cantt, Dehradun.
          </div>
        </div>
      </footer>

      {/* 10. DISCREET FLOATING MOBILE ATELIER CONCIERGE BAR (Mobile Screen Only) */}
      <div className="sm:hidden fixed bottom-3 inset-x-3 z-30 max-w-sm mx-auto">
        <div className="bg-studio-surface/95 backdrop-blur-2xl border border-studio-border shadow-studio-float rounded-2xl p-2 flex items-center justify-between gap-2">
          {/* Quick Reserve Button */}
          <a
            href="#booking-section"
            className="flex-1 py-2.5 px-3 rounded-xl bg-studio-wine hover:bg-studio-wineHover text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-xs active:scale-95"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Reserve Slot</span>
          </a>

          {/* Quick WhatsApp Link */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center justify-center active:scale-95 shrink-0"
            title="Chat on WhatsApp"
            aria-label="Chat on WhatsApp"
          >
            <MessageCircle className="w-4 h-4" />
          </a>

          {/* Quick Share Modal */}
          <button
            onClick={() => setIsShareModalOpen(true)}
            className="w-10 h-10 rounded-xl bg-studio-wineLight border border-studio-border text-studio-wine flex items-center justify-center active:scale-95 shrink-0"
            title="Share Catalogue Without Prices"
            aria-label="Share Catalogue Without Prices"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Emergency Broken Nail Modal */}
      <EmergencyRepairModal
        isOpen={isRepairModalOpen}
        onClose={() => setIsRepairModalOpen(false)}
        onSubmitRepair={onSubmitRepair}
        settings={settings}
        onAddToast={onAddToast}
      />

      {/* Share Catalogue Modal */}
      <ShareCatalogueModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        settings={settings}
        onAddToast={onAddToast}
      />

      {/* Leave Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-studio-ink/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-studio-surface rounded-3xl max-w-lg w-full p-6 shadow-studio-float border border-studio-border space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-studio-border">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center">
                  <Star className="w-4 h-4 fill-amber-400" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-studio-ink">Share Your Studio Experience</h3>
                  <p className="text-[11px] text-studio-muted">We appreciate your feedback on your fresh set.</p>
                </div>
              </div>
              <button
                onClick={() => setShowReviewModal(false)}
                className="w-7 h-7 rounded-full hover:bg-studio-subtle flex items-center justify-center text-studio-muted"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleReviewSubmit} className="space-y-3.5 text-xs font-sans">
              <div>
                <label className="block font-semibold text-studio-secondary mb-1">
                  Your Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ananya, Priya, Simran..."
                  value={reviewForm.clientName}
                  onChange={(e) => setReviewForm({ ...reviewForm, clientName: e.target.value })}
                  className="w-full px-3 py-2.5 bg-studio-canvas/50 border border-studio-border rounded-xl focus:outline-none focus:border-studio-wine focus:bg-studio-surface text-base sm:text-xs text-studio-ink"
                />
              </div>

              <div>
                <label className="block font-semibold text-studio-secondary mb-1">
                  Rating
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                      className="p-1 hover:scale-110 transition-transform active:scale-95"
                      aria-label={`${star} star rating`}
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= reviewForm.rating
                            ? 'fill-amber-400 text-amber-500'
                            : 'text-stone-200'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-semibold text-amber-800 ml-1">
                    {reviewForm.rating} / 5 Stars
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-studio-secondary mb-1">
                    Service Rendered
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. BIAB Overlay, Gel-X Extensions"
                    value={reviewForm.serviceRendered}
                    onChange={(e) => setReviewForm({ ...reviewForm, serviceRendered: e.target.value })}
                    className="w-full px-3 py-2.5 bg-studio-canvas/50 border border-studio-border rounded-xl focus:outline-none focus:border-studio-wine focus:bg-studio-surface text-base sm:text-xs text-studio-ink"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-studio-secondary mb-1">
                    Nail Art / Aesthetic Tag
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. French Tips, Cat-Eye, Glazed Donut"
                    value={reviewForm.aestheticTag}
                    onChange={(e) => setReviewForm({ ...reviewForm, aestheticTag: e.target.value })}
                    className="w-full px-3 py-2.5 bg-studio-canvas/50 border border-studio-border rounded-xl focus:outline-none focus:border-studio-wine focus:bg-studio-surface text-base sm:text-xs text-studio-ink"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-studio-secondary mb-1">
                  Your Review / Experience *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Tell us what you appreciated about your nails, retention, and studio experience..."
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                  className="w-full px-3 py-2.5 bg-studio-canvas/50 border border-studio-border rounded-xl focus:outline-none focus:border-studio-wine focus:bg-studio-surface resize-none text-base sm:text-xs text-studio-ink"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-studio-border">
                <button
                  type="button"
                  onClick={() => setShowReviewModal(false)}
                  className="px-4 py-2 text-studio-muted hover:bg-studio-subtle rounded-xl font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingReview}
                  className="px-5 py-2 bg-studio-wine hover:bg-studio-wineHover text-white rounded-xl font-medium shadow-studio flex items-center gap-1.5 disabled:opacity-50 active:scale-95"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isSubmittingReview ? 'Submitting...' : 'Submit Review'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
