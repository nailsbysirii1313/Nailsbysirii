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

  // Interactive Customizer State
  const shapes = [
    { id: 'almond', name: 'Medium Almond', desc: 'Classic, slim & makes fingers look long' },
    { id: 'coffin', name: 'Long Coffin', desc: 'Trendy tapered shape with a flat tip' },
    { id: 'squoval', name: 'Short Squoval', desc: 'Square with soft rounded corners' },
    { id: 'round', name: 'Short Round', desc: 'Cute, neat & easy for everyday college/work' },
    { id: 'stiletto', name: 'Stiletto', desc: 'Pointed, sharp & bold statement look' },
    { id: 'square', name: 'Square', desc: 'Sharp edges & clean modern aesthetic' }
  ];

  const lengths = [
    { id: 'short', name: 'Short', extra: 0, time: 0 },
    { id: 'medium', name: 'Medium', extra: 300, time: 15 },
    { id: 'long', name: 'Long', extra: 600, time: 25 },
    { id: 'xl', name: 'Extra Long', extra: 900, time: 35 }
  ];

  const baseColors = [
    { id: 'milky', name: 'Milky White', hex: '#F8F1EB', border: '#E7DDD5' },
    { id: 'blush', name: 'Strawberry Jelly Pink', hex: '#F9D5DC', border: '#EBB4C0' },
    { id: 'nude', name: 'Soft Warm Nude', hex: '#E8CFBE', border: '#D6BAA6' },
    { id: 'rose', name: 'Sheer Rose Pink', hex: '#F4BBC6', border: '#E59EA9' },
    { id: 'espresso', name: 'Deep Choco Brown', hex: '#312527', border: '#4E3E41' },
    { id: 'matcha', name: 'Pastel Sage Green', hex: '#CBD2BC', border: '#B4BC9F' }
  ];

  const finishes = [
    { id: 'chrome', name: 'Hailey Glazed Chrome', price: 600, time: 15, desc: 'Shiny pearly glaze over your nails ✨' },
    { id: 'cateye', name: 'Velvet Cat-Eye Sparkle', price: 700, time: 20, desc: 'Shimmery magnetic silk glow in the light' },
    { id: 'orbit3d', name: '3D Metallic Chrome Swirls', price: 1200, time: 30, desc: 'Raised silver/gold chrome swirls & stars' },
    { id: 'pearls', name: 'Cute Pearls & Crystal Gems', price: 1400, time: 25, desc: 'Sparkly rhinestones, cute pearls & waterdrops' },
    { id: 'french', name: 'Classic French Tip Line', price: 600, time: 15, desc: 'Super clean, thin white or colored tips' },
    { id: 'gloss', name: 'Super Glossy Topcoat', price: 0, time: 0, desc: 'Glass-like shine that stays shiny for weeks' }
  ];

  const [customShape, setCustomShape] = useState(shapes[0]);
  const [customLength, setCustomLength] = useState(lengths[1]);
  const [customBase, setCustomBase] = useState(baseColors[1]);
  const [customFinish, setCustomFinish] = useState(finishes[0]);

  // Booking Flow State
  const [bookingStep, setBookingStep] = useState(1);
  const [selectedServiceId, setSelectedServiceId] = useState(services[0]?.id || '');
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [selectedShape, setSelectedShape] = useState('Medium Almond');
  const [selectedLength, setSelectedLength] = useState('Medium');
  const [selectedAesthetic, setSelectedAesthetic] = useState('3D Chrome & Glaze');
  const [bookingDate, setBookingDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [bookingTime, setBookingTime] = useState('14:30');
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

  const addonServices = addonsList.filter((a) => selectedAddons.includes(a.name));
  const totalDuration = (selectedService?.duration || 60) + addonServices.reduce((sum, a) => sum + (a.duration || 0), 0);
  const totalPrice = (selectedService?.price || 0) + addonServices.reduce((sum, a) => sum + (a.price || 0), 0);

  // Customizer Calculation
  const customizerBasePrice = 2200;
  const customizerTotalPrice = customizerBasePrice + customLength.extra + customFinish.price;
  const customizerTotalDuration = 75 + customLength.time + customFinish.time;

  // Reviews avg
  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + (Number(r.rating) || 5), 0) / reviews.length).toFixed(1)
    : '5.0';

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
    setSelectedServiceId(srv.id);
    scrollTo('booking-section');
    setBookingStep(1);
    if (onAddToast) {
      onAddToast('Treatment Selected', `${srv.name} ready for booking.`, 'success');
    }
  };

  // Handle apply custom set into booking
  const handleBookCustomSet = () => {
    setSelectedShape(customShape.name);
    setSelectedLength(customLength.name);
    setSelectedAesthetic(`${customBase.name} with ${customFinish.name}`);
    setClientNotes(`Customizer selections: Shape: ${customShape.name}, Length: ${customLength.name}, Base: ${customBase.name}, Finish: ${customFinish.name}`);

    const matchingService = services.find(s => s.name.toLowerCase().includes('biab')) || services[0];
    if (matchingService) setSelectedServiceId(matchingService.id);

    scrollTo('booking-section');
    setBookingStep(3); // jump to date & time
    if (onAddToast) {
      onAddToast('Custom Set Configured!', 'Jumped to Date & Time selection.', 'success');
    }
  };

  // Handle booking form submission
  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!clientName.trim() || !clientPhone.trim()) {
      if (onAddToast) {
        onAddToast('Missing Details 💕', 'Please provide your name and phone number to reserve your appointment.', 'error');
      }
      return;
    }
    const cleanDigits = clientPhone.replace(/[^0-9]/g, '');
    if (cleanDigits.length < 10) {
      if (onAddToast) {
        onAddToast('Invalid Phone Number', 'Please enter a valid 10-digit mobile number for appointment confirmation 💕', 'error');
      }
      return;
    }

    setIsSubmittingBooking(true);

    try {
      const advanceNum = clientAdvanceToggle ? Math.min(totalPrice, Math.max(0, Number(clientAdvanceAmount) || 0)) : 0;
      const pendingAmt = Math.max(0, totalPrice - advanceNum);

      const payload = {
        clientName: clientName.trim(),
        clientPhone: clientPhone.trim(),
        clientEmail: clientEmail.trim(),
        clientInstagram: clientInstagram.trim(),
        serviceId: selectedService?.id || 'srv_1',
        serviceName: selectedService?.name || 'Signature Nail Service',
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
        notes: `Preferences: ${selectedShape}, ${selectedLength}, ${selectedAesthetic}. Allergies: ${allergies}.${clientUpiRef ? ` Advance UPI UTR: ${clientUpiRef}.` : ''} Note: ${clientNotes}`,
        notifyImmediate: true,
        status: 'Confirmed'
      };

      const result = await onBookingComplete(payload);
      setConfirmedBooking({ ...payload, id: result?.id || 'apt_new' });
      setBookingStep(5);
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // Confetti non-fatal fallback
      }
    } catch (err) {
      if (onAddToast) {
        onAddToast('Failed to submit booking', err.message, 'error');
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
          date: new Date().toISOString().split('T')[0]
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
      if (onAddToast) onAddToast('Thank you for reviewing Nails by Sirii!', 'success');
    } catch (err) {
      if (onAddToast) onAddToast(err.message || 'Failed to submit review', 'error');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  // Lookbook items
  const lookbookItems = [
    {
      title: 'Glazed Donut Nails',
      tag: 'Trending Viral',
      desc: 'Pearlescent glazed chrome over soft strawberry jelly pink builder gel.',
      shape: 'Medium Almond',
      price: '₹2,800',
      duration: '75 mins'
    },
    {
      title: 'Cute 3D Chrome Swirls',
      tag: 'Baddie Aesthetic',
      desc: 'Raised metallic chrome stars and ribbon swirls on long coffin nails.',
      shape: 'Long Coffin',
      price: '₹3,800',
      duration: '90 mins'
    },
    {
      title: 'Velvet Cat-Eye Shine',
      tag: 'Sparkly Velvet',
      desc: 'Soft sparkling magnetic glow that changes shimmer when you move your hands.',
      shape: 'Medium Almond',
      price: '₹3,100',
      duration: '80 mins'
    },
    {
      title: 'Clean Girl French Tips',
      tag: 'Bridal & Clean',
      desc: 'Super neat thin white french tips over natural nude BIAB overlay.',
      shape: 'Short Squoval',
      price: '₹2,600',
      duration: '75 mins'
    },
    {
      title: 'Bling Crystal Dewdrops',
      tag: 'Glam Party',
      desc: 'Clear 3D gel waterdrops with tiny cute pearls and sparkly stones.',
      shape: 'Stiletto',
      price: '₹3,600',
      duration: '105 mins'
    },
    {
      title: 'Matcha Green Aura Art',
      tag: 'Cute Minimal',
      desc: 'Soft pastel sage green aura with little gold glitter accents.',
      shape: 'Short Round',
      price: '₹2,700',
      duration: '70 mins'
    }
  ];

  // Filter services - dynamically extracted from catalog with 'All' upfront
  const categories = ['All', ...Array.from(new Set(services.map((s) => s.category).filter(Boolean)))];
  const filteredServices = services.filter((s) => {
    const q = (searchQuery || '').toLowerCase();
    const matchesCategory = activeCategory === 'All' || s.category === activeCategory;
    const matchesSearch =
      (s.name || '').toLowerCase().includes(q) ||
      (s.description && s.description.toLowerCase().includes(q));
    return matchesCategory && matchesSearch;
  });

  const timeSlots = ['11:30', '12:30', '13:45', '15:00', '16:15', '17:30', '18:30'];

  const whatsappPhone = settings?.phone ? settings.phone.replace(/[^0-9]/g, '') : '917302623493';
  const whatsappUrl = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
    `Hi Sirii! 💕 I saw your cute nail designs on your website and would love to book an appointment with you in Dehradun!`
  )}`;

  return (
    <div className="min-h-screen bg-atelier-cream text-atelier-noir font-sans selection:bg-atelier-rose200 selection:text-atelier-noir overflow-x-hidden pb-20 sm:pb-0">
      {/* 1. TOP CLIENT HEADER / NAVIGATION */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-atelier-champagneBorder/70 px-3.5 sm:px-6 py-2.5 sm:py-3 transition-all pt-[calc(0.6rem+env(safe-area-inset-top))]">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          {/* Logo & Atelier Brand */}
          <a href="#" className="flex items-center gap-2.5 sm:gap-3 group shrink-0 min-w-0">
            <StudioLogo logoUrl={settings?.studioLogoUrl} size="md" />
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-serif italic font-bold text-base sm:text-xl text-atelier-noir tracking-tight group-hover:text-atelier-rose600 transition-colors truncate">
                  {settings?.studioName || 'Nails by Sirii'}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-atelier-rose500 animate-pulse shrink-0" />
              </div>
              <p className="text-[9px] sm:text-[10px] text-atelier-rose600 tracking-wider font-semibold truncate">
                Cute Nail Studio • Dehradun 💕
              </p>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-atelier-charcoal">
            <a href="#catalogue" className="hover:text-atelier-rose600 transition-colors">
              Services & Menu
            </a>
            <a href="#customizer" className="hover:text-atelier-rose600 transition-colors">
              Design Your Nails
            </a>
            <a href="#lookbook" className="hover:text-atelier-rose600 transition-colors">
              Nail Inspo
            </a>
            <a href="#booking-section" className="hover:text-atelier-rose600 transition-colors">
              Book Appointment
            </a>
            <a href="#reviews" className="hover:text-atelier-rose600 transition-colors">
              Client Love 💕
            </a>
            <a href="#studio-info" className="hover:text-atelier-rose600 transition-colors">
              Nail Care Tips
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
              className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${hidePrices
                ? 'bg-amber-50 border-amber-200 text-amber-800'
                : 'bg-white border-atelier-champagneBorder text-atelier-charcoal hover:border-atelier-rose300'
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
                  <Eye className="w-3.5 h-3.5 text-atelier-muted" />
                  <span>Prices: Visible</span>
                </>
              )}
            </button>

            {/* Share Catalogue Button */}
            <button
              onClick={() => setIsShareModalOpen(true)}
              className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-white border border-atelier-champagneBorder hover:border-atelier-rose300 text-atelier-charcoal text-xs font-semibold shadow-xs transition-all flex items-center gap-1.5 active:scale-95"
              title="Share catalogue without prices"
            >
              <Share2 className="w-3.5 h-3.5 text-atelier-rose500" />
              <span className="hidden sm:inline">Share</span>
            </button>

            {/* Book Now Primary CTA */}
            <a
              href="#booking-section"
              className="px-3 sm:px-4 py-1.5 rounded-xl bg-atelier-rose500 hover:bg-atelier-rose600 text-white text-xs font-semibold shadow-soft hover:shadow-float active:scale-95 transition-all flex items-center gap-1.5"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Book Session</span>
              <span className="xs:hidden">Book</span>
            </a>

            {/* Studio Hub (Owner Password Protected) */}
            <button
              onClick={onOpenPasscodeModal}
              className="w-8 h-8 rounded-xl bg-atelier-noir hover:bg-stone-800 text-white flex items-center justify-center transition-all active:scale-95 shadow-xs"
              title="Studio Hub • Owner Passcode Access (nbs0812)"
            >
              <Lock className="w-3.5 h-3.5 text-atelier-champagne" />
            </button>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden w-8 h-8 rounded-xl bg-atelier-cream border border-atelier-champagneBorder flex items-center justify-center text-atelier-charcoal hover:text-atelier-noir active:scale-95"
            >
              <Menu className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* LUXURY MOBILE SLIDE-OVER DRAWER */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex justify-end bg-atelier-noir/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className="fixed inset-0"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />
          <div className="relative w-full max-w-xs bg-white h-full shadow-2xl p-6 flex flex-col justify-between overflow-y-auto z-10 animate-in slide-in-from-right duration-300">
            <div className="space-y-6">
              {/* Drawer Top Branding & Close Button */}
              <div className="flex items-center justify-between pb-4 border-b border-atelier-champagneBorder/60">
                <div className="flex items-center gap-2.5">
                  <StudioLogo logoUrl={settings?.studioLogoUrl} size="sm" />
                  <div>
                    <span className="font-serif italic font-bold text-sm text-atelier-noir block">
                      {settings?.studioName || 'Nails by Sirii'}
                    </span>
                    <span className="text-[10px] text-atelier-muted">Client Menu</span>
                  </div>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-8 h-8 rounded-full bg-atelier-cream hover:bg-atelier-rose50 flex items-center justify-center text-atelier-charcoal"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="space-y-1.5 text-xs font-semibold text-atelier-charcoal">
                <a
                  href="#catalogue"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 p-3 rounded-2xl hover:bg-atelier-rose50 hover:text-atelier-rose600 transition-colors"
                >
                  <Sparkles className="w-4 h-4 text-atelier-rose500" />
                  <span>Services & Menu</span>
                </a>
                <a
                  href="#customizer"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 p-3 rounded-2xl hover:bg-atelier-rose50 hover:text-atelier-rose600 transition-colors"
                >
                  <Palette className="w-4 h-4 text-purple-500" />
                  <span>Design Your Nails</span>
                </a>
                <a
                  href="#lookbook"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 p-3 rounded-2xl hover:bg-atelier-rose50 hover:text-atelier-rose600 transition-colors"
                >
                  <Eye className="w-4 h-4 text-amber-500" />
                  <span>Trending Looks (Inspo)</span>
                </a>
                <a
                  href="#booking-section"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 p-3 rounded-2xl hover:bg-atelier-rose50 hover:text-atelier-rose600 transition-colors"
                >
                  <Calendar className="w-4 h-4 text-emerald-500" />
                  <span>Book Your Slot 💕</span>
                </a>
                <a
                  href="#reviews"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 p-3 rounded-2xl hover:bg-atelier-rose50 hover:text-atelier-rose600 transition-colors"
                >
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span>Client Love{reviews.length > 0 ? ` (${avgRating} ★)` : ''}</span>
                </a>
                <a
                  href="#studio-info"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 p-3 rounded-2xl hover:bg-atelier-rose50 hover:text-atelier-rose600 transition-colors"
                >
                  <ShieldCheck className="w-4 h-4 text-blue-500" />
                  <span>Nail Care & Tips</span>
                </a>
              </nav>

              {/* Price Visibility Switch inside Drawer */}
              <div className="p-3.5 rounded-2xl bg-atelier-cream border border-atelier-champagneBorder/60 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-atelier-muted block">
                  Catalogue Presentation
                </span>
                <div className="flex rounded-xl bg-white p-1 border border-atelier-champagneBorder text-[11px] font-semibold">
                  <button
                    onClick={() => setHidePrices(false)}
                    className={`flex-1 py-1.5 rounded-lg transition-all ${!hidePrices ? 'bg-atelier-rose500 text-white shadow-xs' : 'text-atelier-muted'
                      }`}
                  >
                    With Prices
                  </button>
                  <button
                    onClick={() => setHidePrices(true)}
                    className={`flex-1 py-1.5 rounded-lg transition-all ${hidePrices ? 'bg-amber-600 text-white shadow-xs' : 'text-atelier-muted'
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
                  className="w-full py-2.5 px-4 rounded-xl bg-white border border-atelier-rose200 text-atelier-rose600 hover:bg-atelier-rose50 text-xs font-semibold flex items-center justify-center gap-2 shadow-xs"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Share Catalogue (No Prices)</span>
                </button>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-xs"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp Sirii Directly</span>
                </a>
              </div>
            </div>

            {/* Bottom Owner Link */}
            <div className="pt-6 border-t border-atelier-champagneBorder/60 text-center">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenPasscodeModal();
                }}
                className="text-[11px] font-semibold text-atelier-muted hover:text-atelier-noir flex items-center justify-center gap-1.5 mx-auto"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Studio Hub Owner Access (nbs0812)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. HERO SECTION */}
      <section className="relative overflow-hidden pt-8 pb-16 sm:pt-16 sm:pb-24 px-4 sm:px-6">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-b from-atelier-rose100/60 via-atelier-blush/30 to-transparent blur-3xl pointer-events-none -z-10" />

        <div className="max-w-4xl mx-auto text-center space-y-5">
          <div className="inline-flex flex-wrap items-center justify-center gap-2">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-atelier-rose200 shadow-xs text-atelier-rose600 text-[11px] sm:text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Nails by Sirii • Garhi Cantt, Dehradun 💕</span>
            </div>
            <a
              href="https://maps.google.com/?q=Nails+by+Sirii+Laxmi+Navraj+Plaza+Garhi+Cantonment+Dehradun"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 shadow-xs text-amber-800 text-[11px] sm:text-xs font-bold hover:bg-amber-100 transition-colors"
            >
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
              <span>4.9 ★ (344 Google Reviews)</span>
            </a>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] sm:text-xs font-semibold">
              <Clock className="w-3.5 h-3.5 text-emerald-600" />
              <span>Open Daily: 12:00 PM – 7:00 PM</span>
            </div>
          </div>

          <h1 className="font-serif italic font-bold text-3xl sm:text-5xl md:text-6xl text-atelier-noir tracking-tight leading-[1.15]">
            Affordable, Cute & Aesthetic Nails <br className="hidden sm:inline" /> in{' '}
            <span className="text-atelier-rose600 not-italic font-normal">Dehradun</span> 💕
          </h1>

          <p className="text-xs sm:text-sm text-atelier-muted max-w-xl mx-auto leading-relaxed">
            Hey babe! Welcome to Nails by Sirii ✨ We do beautiful acrylic & soft gel extensions, strong natural builder gel, detailed hand-painted nail art, customized press-on nails, and 1:1 certified nail courses by Simran mam!
          </p>

          {/* Key Standards Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 pt-2 text-[10px] sm:text-[11px] text-atelier-charcoal font-semibold">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 border border-atelier-champagneBorder shadow-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>100% Clean & Sanitized Tools 🌸</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 border border-atelier-champagneBorder shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-atelier-rose500" />
              <span>1:1 Certified Nail Academy 🦋</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 border border-atelier-champagneBorder shadow-xs">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>Lasts 3-4 Weeks Without Chipping 💕</span>
            </div>
          </div>

          {/* Call to Actions on Mobile / Desktop */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-3 pt-4 max-w-md sm:max-w-none mx-auto">
            <a
              href="#booking-section"
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-gradient-to-r from-atelier-rose500 to-atelier-rose600 hover:from-atelier-rose600 hover:to-atelier-rose500 text-white font-semibold text-xs shadow-soft hover:shadow-float active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <span>Book Your Nail Slot 💕</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <a
              href="tel:07302623493"
              className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-white border border-atelier-champagneBorder hover:border-atelier-rose300 text-atelier-charcoal font-semibold text-xs shadow-sm transition-all flex items-center justify-center gap-2"
            >
              <Phone className="w-3.5 h-3.5 text-atelier-rose500" />
              <span>Call 073026 23493</span>
            </a>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 font-semibold text-xs shadow-xs transition-all flex items-center justify-center gap-2 hover:bg-emerald-100"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>WhatsApp Simran</span>
            </a>
          </div>
        </div>
      </section>

      {/* 3. DEDICATED SERVICES & ART CATALOGUE */}
      <section id="catalogue" className="py-14 sm:py-20 px-4 sm:px-6 max-w-7xl mx-auto border-t border-atelier-champagneBorder/60">
        <div className="space-y-6 sm:space-y-8">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-atelier-rose100 text-atelier-rose600 text-[11px] font-semibold">
                <Sparkles className="w-3 h-3" />
                <span>🌸 Studio Nail Menu</span>
              </div>
              <h2 className="font-serif italic font-bold text-2xl sm:text-4xl text-atelier-noir">
                Nail Services & Pricing
              </h2>
              <p className="text-xs text-atelier-muted max-w-lg leading-relaxed">
                Every nail session includes super clean Russian cuticle cleanup, strong nail prep so your nails last 3+ weeks without chipping, and soothing cuticle oil! 💕
              </p>
            </div>

            {/* Catalogue Control Bar: Hide Prices Switcher & Share */}
            <div className="flex items-center gap-2">
              <div className="flex items-center rounded-2xl bg-white border border-atelier-champagneBorder p-1 shadow-xs">
                <button
                  onClick={() => setHidePrices(false)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${!hidePrices
                    ? 'bg-atelier-rose500 text-white shadow-xs'
                    : 'text-atelier-muted hover:text-atelier-noir'
                    }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>With Prices</span>
                </button>
                <button
                  onClick={() => setHidePrices(true)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${hidePrices
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-atelier-muted hover:text-atelier-noir'
                    }`}
                >
                  <EyeOff className="w-3.5 h-3.5" />
                  <span>Without Prices</span>
                </button>
              </div>

              <button
                onClick={() => setIsShareModalOpen(true)}
                className="px-3.5 py-1.5 rounded-2xl bg-white border border-atelier-champagneBorder hover:border-atelier-rose300 text-atelier-charcoal font-semibold text-xs shadow-xs transition-all flex items-center gap-1.5"
              >
                <Share2 className="w-3.5 h-3.5 text-atelier-rose500" />
                <span className="hidden xs:inline">Share</span>
              </button>
            </div>
          </div>

          {/* Notification when hidePrices is active */}
          {hidePrices && (
            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200/80 text-amber-900 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 animate-in fade-in">
              <div className="flex items-center gap-2">
                <EyeOff className="w-4 h-4 text-amber-600 shrink-0" />
                <div>
                  <span className="font-semibold">Catalogue Without Prices:</span>{' '}
                  <span className="text-amber-800">
                    Showing all cute nail designs & services without prices. Perfect for sharing with clients on WhatsApp or Instagram!
                  </span>
                </div>
              </div>
              <button
                onClick={() => setHidePrices(false)}
                className="self-start sm:self-auto px-3 py-1 rounded-xl bg-white border border-amber-300 text-amber-900 font-bold hover:bg-amber-100 transition-colors text-[11px] shrink-0"
              >
                Show Prices
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
                    className={`px-3.5 py-2 sm:py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${activeCategory === cat
                      ? 'bg-atelier-rose500 text-white shadow-xs'
                      : 'bg-white border border-atelier-champagneBorder hover:border-atelier-rose200 text-atelier-charcoal'
                      }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Search Bar */}
              <div className="relative sm:w-64">
                <Search className="w-3.5 h-3.5 text-atelier-muted absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search treatments or art..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-white border border-atelier-champagneBorder rounded-xl text-base sm:text-xs text-atelier-charcoal focus:outline-none focus:border-atelier-rose400"
                />
              </div>
            </div>
          </div>

          {/* Catalogue Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredServices.map((srv) => (
              <div
                key={srv.id}
                className="bg-white rounded-3xl p-5 sm:p-6 border border-atelier-champagneBorder hover:border-atelier-rose300 shadow-sm hover:shadow-soft transition-all space-y-4 flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  {/* Top tags */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-atelier-rose50 text-atelier-rose600 border border-atelier-rose200/60">
                      {srv.category}
                    </span>
                    <span className="text-[10px] text-atelier-muted font-semibold flex items-center gap-1">
                      <Clock className="w-3 h-3 text-atelier-rose400" />
                      {srv.duration} mins
                    </span>
                  </div>

                  {/* Service Title */}
                  <div>
                    <h3 className="font-serif italic font-bold text-lg text-atelier-noir group-hover:text-atelier-rose600 transition-colors">
                      {srv.name}
                    </h3>
                    {srv.popular && (
                      <span className="inline-block mt-1 text-[9px] font-bold px-2 py-0.2 rounded-full bg-rose-50 text-rose-600 border border-rose-200">
                        Most Popular 💕
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-xs text-atelier-muted leading-relaxed">
                    {srv.description}
                  </p>

                  {/* Quality Checklist */}
                  <div className="pt-2 border-t border-atelier-champagneBorder/40 space-y-1 text-[11px] text-atelier-charcoal font-medium">
                    <div className="flex items-center gap-1.5">
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span>Clean Russian cuticle cleanup</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span>Zero damage & safe on real nails</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Card Footer: Price & Booking */}
                <div className="pt-4 border-t border-atelier-champagneBorder/60 flex items-center justify-between gap-3">
                  <div>
                    {hidePrices ? (
                      <div>
                        <span className="text-[9px] font-bold uppercase tracking-wider text-atelier-muted block">
                          Nail Service
                        </span>
                        <span className="text-xs font-serif italic font-bold text-atelier-rose600">
                          Price on Request 💕
                        </span>
                      </div>
                    ) : (
                      <div>
                        <span className="text-[9px] font-bold uppercase tracking-wider text-atelier-muted block">
                          Service Price
                        </span>
                        <span className="font-serif font-bold text-lg text-atelier-noir">
                          ₹{Number(srv.price).toLocaleString('en-IN')}
                        </span>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => handleSelectFromCatalogue(srv)}
                    className="px-4 py-2.5 sm:py-2 rounded-xl bg-atelier-cream hover:bg-atelier-rose50 text-atelier-charcoal hover:text-atelier-rose600 border border-atelier-champagneBorder font-semibold text-xs transition-all flex items-center gap-1.5 active:scale-95 shadow-xs"
                  >
                    <span>Book This 💕</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. INTERACTIVE VIRTUAL NAIL STUDIO / CUSTOMIZER (Mobile First Order) */}
      <section id="customizer" className="py-14 sm:py-20 px-4 sm:px-6 max-w-7xl mx-auto border-t border-atelier-champagneBorder/60">
        <div className="space-y-6 sm:space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-atelier-rose100 text-atelier-rose600 text-[11px] font-semibold">
              <Palette className="w-3 h-3" />
              <span>✨ Try Your Nails Online</span>
            </div>
            <h2 className="font-serif italic font-bold text-2xl sm:text-4xl text-atelier-noir">
              Design Your Dream Nail Set 💕
            </h2>
            <p className="text-xs text-atelier-muted leading-relaxed">
              Play around with pretty shapes, lengths, soft jelly shades, and sparkly chrome finishes to see what looks cute on your hands!
            </p>
          </div>

          {/* On mobile: Preview is placed FIRST (order-first) so changes are instantly visible! */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-start">
            {/* Visual Preview Card: TOP on Mobile, Sticky Right on Desktop */}
            <div className="order-first lg:order-last space-y-4 lg:sticky lg:top-24">
              <div className="bg-white rounded-3xl p-5 sm:p-6 border border-atelier-champagneBorder shadow-float space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-atelier-rose600 block">
                    Live Nail Preview ✨
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-atelier-rose50 text-atelier-rose600 font-bold border border-atelier-rose200">
                    Interactive
                  </span>
                </div>

                {/* Stylized Visual Display with Realistic Nail Tip Geometry */}
                <div
                  className="h-52 sm:h-56 rounded-3xl p-6 flex flex-col items-center justify-center text-center relative overflow-hidden transition-all duration-300 border border-atelier-champagneBorder shadow-inner"
                  style={{ backgroundColor: customBase.hex }}
                >
                  {/* Iridescent chrome glaze glow */}
                  {customFinish.id === 'chrome' && (
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/50 via-pink-300/30 to-purple-300/30 mix-blend-overlay pointer-events-none animate-pulse" />
                  )}

                  {/* Cat-eye magnet silk glare */}
                  {customFinish.id === 'cateye' && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent -rotate-45 pointer-events-none" />
                  )}

                  {/* 3D Liquid metallic swells */}
                  {customFinish.id === 'orbit3d' && (
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.4),transparent_60%)] pointer-events-none" />
                  )}

                  {/* Stylized Nail Tip Card */}
                  <div className="relative z-10 space-y-1.5 p-4 bg-white/90 backdrop-blur-md rounded-2xl border border-white/80 shadow-md max-w-[220px]">
                    <span className="font-serif italic font-bold text-base text-atelier-noir block">
                      {customShape.name}
                    </span>
                    <span className="text-[11px] font-semibold text-atelier-rose600 block">
                      {customLength.name} Length
                    </span>
                    <span className="text-[10px] text-atelier-charcoal font-medium block">
                      {customBase.name} • {customFinish.name}
                    </span>
                  </div>
                </div>

                {/* Price & Time Summary */}
                <div className="p-3.5 sm:p-4 rounded-2xl bg-atelier-blush border border-atelier-rose200/80 space-y-2 text-xs">
                  <div className="flex justify-between text-atelier-charcoal">
                    <span>Base Service:</span>
                    <span className="font-semibold text-atelier-noir">Natural Builder Gel / Overlay</span>
                  </div>

                  <div className="flex justify-between text-atelier-muted">
                    <span>Nail Shape:</span>
                    <span className="font-semibold text-atelier-noir">{customShape.name}</span>
                  </div>

                  <div className="flex justify-between text-atelier-muted">
                    <span>Nail Art / Finish:</span>
                    <span className="font-semibold text-atelier-noir">{customFinish.name}</span>
                  </div>

                  <div className="flex justify-between text-atelier-muted pt-2 border-t border-atelier-rose200">
                    <span>Approx Time:</span>
                    <span className="font-semibold text-atelier-noir">{customizerTotalDuration} mins</span>
                  </div>

                  {!hidePrices && (
                    <div className="flex justify-between items-baseline pt-2 border-t border-atelier-rose200">
                      <span className="font-bold text-atelier-noir">Estimated Bill:</span>
                      <span className="font-serif italic font-bold text-xl sm:text-2xl text-atelier-rose600">
                        ₹{Number(customizerTotalPrice).toLocaleString('en-IN')}
                      </span>
                    </div>
                  )}

                  {hidePrices && (
                    <div className="pt-2 border-t border-atelier-rose200 text-center text-[11px] text-atelier-rose600 font-serif italic">
                      Price shared on request 💕
                    </div>
                  )}
                </div>

                {/* Book This Custom Set CTA */}
                <button
                  onClick={handleBookCustomSet}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-atelier-rose500 to-atelier-rose600 hover:from-atelier-rose600 hover:to-atelier-rose500 text-white font-semibold text-xs shadow-soft transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Book This Custom Set 💕</span>
                </button>
              </div>
            </div>

            {/* Step-by-Step Selectors (Below preview on mobile) */}
            <div className="lg:col-span-2 space-y-4 sm:space-y-6">
              {/* 1. Shape */}
              <div className="bg-white rounded-3xl p-5 sm:p-6 border border-atelier-champagneBorder shadow-sm space-y-3">
                <span className="text-xs font-bold text-atelier-noir uppercase tracking-wider block">
                  1. Pick Your Nail Shape
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                  {shapes.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setCustomShape(s)}
                      className={`p-3 sm:p-3.5 rounded-2xl border text-left text-xs transition-all active:scale-95 ${customShape.id === s.id
                        ? 'border-atelier-rose500 bg-atelier-rose50/70 shadow-sm'
                        : 'border-atelier-champagneBorder bg-white hover:border-atelier-rose200'
                        }`}
                    >
                      <span className="font-serif italic font-bold text-sm text-atelier-noir block">
                        {s.name}
                      </span>
                      <span className="text-[10px] text-atelier-muted leading-tight block mt-0.5">
                        {s.desc}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Length */}
              <div className="bg-white rounded-3xl p-5 sm:p-6 border border-atelier-champagneBorder shadow-sm space-y-3">
                <span className="text-xs font-bold text-atelier-noir uppercase tracking-wider block">
                  2. Pick Your Nail Length
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                  {lengths.map((l) => (
                    <button
                      key={l.id}
                      onClick={() => setCustomLength(l)}
                      className={`p-3 sm:p-3.5 rounded-2xl border text-center text-xs transition-all active:scale-95 ${customLength.id === l.id
                        ? 'border-atelier-rose500 bg-atelier-rose500 text-white font-bold shadow-sm'
                        : 'border-atelier-champagneBorder bg-white hover:border-atelier-rose200 text-atelier-charcoal font-semibold'
                        }`}
                    >
                      <span className="block">{l.name}</span>
                      <span
                        className={`text-[10px] block mt-0.5 ${customLength.id === l.id ? 'text-white/80' : 'text-atelier-muted'
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
              <div className="bg-white rounded-3xl p-5 sm:p-6 border border-atelier-champagneBorder shadow-sm space-y-3">
                <span className="text-xs font-bold text-atelier-noir uppercase tracking-wider block">
                  3. Pick Your Nude / Jelly Color
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                  {baseColors.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setCustomBase(c)}
                      className={`p-2.5 sm:p-3 rounded-2xl border flex items-center gap-2.5 text-xs transition-all active:scale-95 ${customBase.id === c.id
                        ? 'border-atelier-rose500 bg-atelier-rose50/60 shadow-sm'
                        : 'border-atelier-champagneBorder bg-white hover:border-atelier-rose200'
                        }`}
                    >
                      <div
                        className="w-6 h-6 sm:w-7 sm:h-7 rounded-full shadow-inner border shrink-0"
                        style={{ backgroundColor: c.hex, borderColor: c.border }}
                      />
                      <span className="font-semibold text-atelier-noir text-xs truncate">{c.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. Finish & Nail Art Tier */}
              <div className="bg-white rounded-3xl p-5 sm:p-6 border border-atelier-champagneBorder shadow-sm space-y-3">
                <span className="text-xs font-bold text-atelier-noir uppercase tracking-wider block">
                  4. Pick Your Nail Art & Shimmer
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                  {finishes.map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setCustomFinish(f)}
                      className={`p-3 sm:p-3.5 rounded-2xl border text-left text-xs transition-all flex items-start justify-between active:scale-95 ${customFinish.id === f.id
                        ? 'border-atelier-rose500 bg-atelier-rose50/70 shadow-sm'
                        : 'border-atelier-champagneBorder bg-white hover:border-atelier-rose200'
                        }`}
                    >
                      <div>
                        <span className="font-serif italic font-bold text-sm text-atelier-noir block">
                          {f.name}
                        </span>
                        <span className="text-[10px] text-atelier-muted block mt-0.5">
                          {f.desc}
                        </span>
                      </div>
                      {!hidePrices && (
                        <span className="font-serif font-bold text-atelier-rose600 shrink-0 ml-2">
                          {f.price > 0 ? `+₹${f.price}` : 'Free'}
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

      {/* 5. ATELIER LOOKBOOK GALLERY */}
      <section id="lookbook" className="py-14 sm:py-20 px-4 sm:px-6 max-w-7xl mx-auto border-t border-atelier-champagneBorder/60">
        <div className="space-y-6 sm:space-y-8">
          <div className="text-center space-y-2">
            <span className="text-[10px] uppercase font-bold tracking-widest text-atelier-rose600 block">
              💖 Client Favorites
            </span>
            <h2 className="font-serif italic font-bold text-2xl sm:text-4xl text-atelier-noir">
              Trending Nail Inspo 💕
            </h2>
            <p className="text-xs text-atelier-muted max-w-md mx-auto">
              Cute nail designs loved by our Dehradun girls! Pick any design below, or bring any Pinterest photo you love to your appointment.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {lookbookItems.map((item, idx) => (
              <div
                key={idx}
                className="bg-white rounded-3xl p-5 sm:p-6 border border-atelier-champagneBorder hover:border-atelier-rose300 shadow-sm hover:shadow-soft transition-all space-y-4 group flex flex-col justify-between"
              >
                <div>
                  <div className="h-40 sm:h-44 rounded-2xl bg-gradient-to-tr from-atelier-rose100 via-atelier-blush to-atelier-cream border border-atelier-rose200/50 flex flex-col items-center justify-center text-center p-4 relative overflow-hidden">
                    <Sparkles className="w-8 h-8 text-atelier-rose400 mb-2 group-hover:scale-110 transition-transform" />
                    <span className="font-serif italic font-bold text-lg text-atelier-noir">
                      {item.title}
                    </span>
                    <span className="text-[10px] font-semibold text-atelier-rose600 uppercase tracking-wider mt-1">
                      {item.tag}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs pt-4">
                    <div className="flex justify-between items-baseline">
                      <span className="font-bold text-atelier-noir">{item.shape}</span>
                      {!hidePrices && (
                        <span className="font-serif font-bold text-atelier-rose600 text-sm">
                          {item.price}
                        </span>
                      )}
                      {hidePrices && (
                        <span className="text-[10px] text-atelier-muted font-serif italic">
                          Price on Request
                        </span>
                      )}
                    </div>
                    <p className="text-atelier-muted leading-relaxed">{item.desc}</p>
                  </div>
                </div>

                <a
                  href="#booking-section"
                  onClick={() => {
                    setSelectedAesthetic(item.title);
                    setSelectedShape(item.shape);
                    setBookingStep(1);
                  }}
                  className="w-full py-2.5 rounded-xl bg-atelier-cream hover:bg-atelier-rose50 text-atelier-charcoal hover:text-atelier-rose600 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 active:scale-95 border border-atelier-champagneBorder/60"
                >
                  <span>Book This Look 💕</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. ONLINE SELF-BOOKING WIZARD */}
      <section id="booking-section" className="py-14 sm:py-20 px-4 sm:px-6 max-w-4xl mx-auto border-t border-atelier-champagneBorder/60">
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <span className="text-[10px] uppercase font-bold tracking-widest text-atelier-rose600 block">
              ✨ Quick & Easy Booking
            </span>
            <h2 className="font-serif italic font-bold text-2xl sm:text-4xl text-atelier-noir">
              Book Your Appointment with Sirii 💕
            </h2>
            <p className="text-xs text-atelier-muted max-w-md mx-auto">
              Pick your nail service, choose your favorite shape, and reserve your time slot in just a few taps!
            </p>
          </div>

          {/* Stepper indicator */}
          <div className="flex items-center justify-center gap-2 max-w-md mx-auto py-2">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${bookingStep === s
                    ? 'bg-atelier-rose500 text-white shadow-sm'
                    : bookingStep > s
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-atelier-cream border border-atelier-champagneBorder text-atelier-muted'
                    }`}
                >
                  {bookingStep > s ? '✓' : s}
                </div>
                {s < 4 && <div className="w-6 sm:w-10 h-0.5 bg-atelier-champagneBorder" />}
              </div>
            ))}
          </div>

          <div className="bg-white rounded-3xl p-5 sm:p-8 border border-atelier-champagneBorder shadow-soft">
            {/* STEP 1: Select Service */}
            {bookingStep === 1 && (
              <div className="space-y-5 sm:space-y-6 animate-fade-in text-xs">
                <div>
                  <h3 className="font-serif italic font-bold text-lg sm:text-xl text-atelier-noir mb-1">
                    1. Pick Your Main Service
                  </h3>
                  <p className="text-atelier-muted text-xs">
                    Choose what you want done on your nails:
                  </p>
                </div>

                <div className="space-y-2.5">
                  {services
                    .filter((s) => s.category !== 'Nail Art' && s.category !== 'Add-on')
                    .map((srv) => (
                      <div
                        key={srv.id}
                        onClick={() => setSelectedServiceId(srv.id)}
                        className={`p-3.5 sm:p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${selectedServiceId === srv.id
                          ? 'border-atelier-rose400 bg-atelier-rose50/60 shadow-sm'
                          : 'border-atelier-champagneBorder hover:border-atelier-rose200 bg-white'
                          }`}
                      >
                        <div className="space-y-1 pr-3">
                          <div className="flex items-center gap-2">
                            <span className="font-serif italic font-bold text-sm text-atelier-noir">
                              {srv.name}
                            </span>
                            {srv.popular && (
                              <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-rose-50 text-rose-600 border border-rose-200">
                                Most Loved 💕
                              </span>
                            )}
                          </div>
                          <p className="text-atelier-muted text-[11px] leading-relaxed">
                            {srv.description}
                          </p>
                          <span className="text-[10px] text-atelier-charcoal font-medium block">
                            Time: ~{srv.duration} mins
                          </span>
                        </div>
                        <div className="text-right shrink-0">
                          {hidePrices ? (
                            <span className="text-xs font-serif italic text-atelier-rose600 font-bold">
                              Price on Request
                            </span>
                          ) : (
                            <span className="font-serif font-bold text-base text-atelier-noir">
                              ₹{Number(srv.price).toLocaleString('en-IN')}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                </div>

                {/* Addons Selection */}
                <div className="pt-4 border-t border-atelier-champagneBorder/60 space-y-3">
                  <span className="font-semibold text-atelier-noir block">
                    Add Cute Nail Art & Charms (Optional) ✨
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {addonsList.map((addon) => {
                      const isSelected = selectedAddons.includes(addon.name);
                      return (
                        <button
                          type="button"
                          key={addon.id}
                          onClick={() => toggleAddon(addon.name)}
                          className={`p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between active:scale-95 ${isSelected
                            ? 'bg-atelier-rose100 text-atelier-rose600 border-atelier-rose300 font-semibold shadow-sm'
                            : 'bg-atelier-cream/50 border-atelier-champagneBorder hover:bg-white text-atelier-charcoal'
                            }`}
                        >
                          <span className="truncate pr-1">{addon.name}</span>
                          {!hidePrices && (
                            <span className="shrink-0 font-serif font-bold text-atelier-noir">
                              +₹{Number(addon.price).toLocaleString('en-IN')}
                            </span>
                          )}
                          {hidePrices && (
                            <span className="shrink-0 text-[10px] text-atelier-muted font-medium">
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
                    className="w-full sm:w-auto px-6 py-3 sm:py-2.5 rounded-xl bg-atelier-rose500 hover:bg-atelier-rose600 text-white font-semibold text-xs shadow-soft transition-all flex items-center justify-center gap-1.5 active:scale-95"
                  >
                    <span>Next: Choose Shape & Style</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: Shape & Style */}
            {bookingStep === 2 && (
              <div className="space-y-5 sm:space-y-6 animate-fade-in text-xs">
                <div>
                  <h3 className="font-serif italic font-bold text-lg sm:text-xl text-atelier-noir mb-1">
                    2. Choose Your Shape & Vibe
                  </h3>
                  <p className="text-atelier-muted text-xs">
                    Sirii will customize the shape so your hands look pretty, neat, and elegant!
                  </p>
                </div>

                {/* Shape */}
                <div className="space-y-2">
                  <label className="font-semibold text-atelier-charcoal block">
                    Pick Your Nail Shape
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {[
                      'Medium Almond',
                      'Short Squoval',
                      'Long Coffin',
                      'Short Round',
                      'Stiletto',
                      'Square'
                    ].map((shape) => (
                      <button
                        type="button"
                        key={shape}
                        onClick={() => setSelectedShape(shape)}
                        className={`p-2.5 rounded-xl border text-xs font-semibold transition-all active:scale-95 ${selectedShape === shape
                          ? 'bg-atelier-rose500 text-white border-atelier-rose500 shadow-sm'
                          : 'bg-white border-atelier-champagneBorder hover:bg-atelier-cream text-atelier-charcoal'
                          }`}
                      >
                        {shape}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Length */}
                <div className="space-y-2">
                  <label className="font-semibold text-atelier-charcoal block">
                    Pick Your Length
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {['Short', 'Medium', 'Long', 'Extra Long'].map((len) => (
                      <button
                        type="button"
                        key={len}
                        onClick={() => setSelectedLength(len)}
                        className={`p-2.5 rounded-xl border text-xs font-semibold transition-all active:scale-95 ${selectedLength === len
                          ? 'bg-atelier-rose500 text-white border-atelier-rose500 shadow-sm'
                          : 'bg-white border-atelier-champagneBorder hover:bg-atelier-cream text-atelier-charcoal'
                          }`}
                      >
                        {len}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Aesthetic */}
                <div className="space-y-2">
                  <label className="font-semibold text-atelier-charcoal block">
                    Pick Your Vibe & Art Style
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {[
                      '3D Chrome & Glaze',
                      'BIAB Clean Natural',
                      'French Ombre Minimalist',
                      'Velvet Cat Eye',
                      'Y2K Kawaii 3D Charms',
                      'Hand-Painted Abstract'
                    ].map((aesthetic) => (
                      <button
                        type="button"
                        key={aesthetic}
                        onClick={() => setSelectedAesthetic(aesthetic)}
                        className={`p-2.5 rounded-xl border text-left text-xs font-semibold transition-all active:scale-95 ${selectedAesthetic === aesthetic
                          ? 'bg-atelier-rose100 text-atelier-rose600 border-atelier-rose300 shadow-sm'
                          : 'bg-white border-atelier-champagneBorder hover:bg-atelier-cream text-atelier-charcoal'
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
                    className="px-4 py-2.5 rounded-xl border border-atelier-champagneBorder text-atelier-charcoal hover:bg-atelier-cream text-xs font-semibold"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setBookingStep(3)}
                    className="px-6 py-2.5 rounded-xl bg-atelier-rose500 hover:bg-atelier-rose600 text-white font-semibold text-xs shadow-soft transition-all flex items-center gap-1.5 active:scale-95"
                  >
                    <span>Next: Pick Date & Time →</span>
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Date & Time */}
            {bookingStep === 3 && (
              <div className="space-y-5 sm:space-y-6 animate-fade-in text-xs">
                <div>
                  <h3 className="font-serif italic font-bold text-lg sm:text-xl text-atelier-noir mb-1">
                    3. Pick Your Day & Time Slot 💕
                  </h3>
                  <p className="text-atelier-muted text-xs">
                    Estimated session time: ~{totalDuration} mins. Pick a slot that works best for you!
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="font-semibold text-atelier-charcoal block">
                    Choose Date
                  </label>
                  <input
                    type="date"
                    required
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-atelier-champagneBorder bg-atelier-cream/40 focus:bg-white focus:border-atelier-rose400 outline-none text-base sm:text-xs text-atelier-noir"
                  />
                </div>

                <div className="space-y-2">
                  <label className="font-semibold text-atelier-charcoal block">
                    Available Time Slots in Dehradun
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {timeSlots.map((slot) => (
                      <button
                        type="button"
                        key={slot}
                        onClick={() => setBookingTime(slot)}
                        className={`p-3 rounded-xl border text-xs font-semibold transition-all active:scale-95 ${bookingTime === slot
                          ? 'bg-atelier-rose500 text-white border-atelier-rose500 shadow-sm'
                          : 'bg-white border-atelier-champagneBorder hover:bg-atelier-cream text-atelier-charcoal'
                          }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Estimate Box */}
                <div className="p-4 rounded-2xl bg-atelier-blush border border-atelier-rose200/80 flex items-center justify-between">
                  <div>
                    <span className="text-atelier-muted text-[10px] uppercase font-bold block">
                      Session Time
                    </span>
                    <span className="font-semibold text-atelier-noir">
                      {totalDuration} mins (~{(totalDuration / 60).toFixed(1)} hrs)
                    </span>
                  </div>
                  {!hidePrices && (
                    <div className="text-right">
                      <span className="text-atelier-muted text-[10px] uppercase font-bold block">
                        Estimated Total Bill
                      </span>
                      <span className="font-serif italic font-bold text-xl text-atelier-rose600">
                        ₹{Number(totalPrice).toLocaleString('en-IN')}
                      </span>
                    </div>
                  )}
                  {hidePrices && (
                    <div className="text-right">
                      <span className="text-atelier-muted text-[10px] uppercase font-bold block">
                        Pricing
                      </span>
                      <span className="font-serif italic font-bold text-sm text-atelier-rose600">
                        Price on request 💕
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex justify-between pt-4 gap-2">
                  <button
                    type="button"
                    onClick={() => setBookingStep(2)}
                    className="px-4 py-2.5 rounded-xl border border-atelier-champagneBorder text-atelier-charcoal hover:bg-atelier-cream text-xs font-semibold"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setBookingStep(4)}
                    className="px-6 py-2.5 rounded-xl bg-atelier-rose500 hover:bg-atelier-rose600 text-white font-semibold text-xs shadow-soft transition-all flex items-center gap-1.5 active:scale-95"
                  >
                    <span>Next: Your Details →</span>
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: Client Info & Submit */}
            {bookingStep === 4 && (
              <form onSubmit={handleBookingSubmit} className="space-y-4 sm:space-y-5 animate-fade-in text-xs">
                <div>
                  <h3 className="font-serif italic font-bold text-lg sm:text-xl text-atelier-noir mb-1">
                    4. Your Details & Confirmation 💕
                  </h3>
                  <p className="text-atelier-muted text-xs">
                    Sirii will review your booking and send a sweet confirmation message on WhatsApp!
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block font-semibold text-atelier-charcoal mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ananya Sharma"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-atelier-champagneBorder bg-atelier-cream/40 focus:bg-white focus:border-atelier-rose400 outline-none text-base sm:text-xs text-atelier-noir"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-atelier-charcoal mb-1">
                      Phone Number (for SMS & WhatsApp) *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-atelier-champagneBorder bg-atelier-cream/40 focus:bg-white focus:border-atelier-rose400 outline-none text-base sm:text-xs text-atelier-noir"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-atelier-charcoal mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="client@gmail.com"
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-atelier-champagneBorder bg-atelier-cream/40 focus:bg-white focus:border-atelier-rose400 outline-none text-base sm:text-xs text-atelier-noir"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-atelier-charcoal mb-1">
                      Instagram Handle (optional)
                    </label>
                    <input
                      type="text"
                      placeholder="@yourhandle"
                      value={clientInstagram}
                      onChange={(e) => setClientInstagram(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-atelier-champagneBorder bg-atelier-cream/40 focus:bg-white focus:border-atelier-rose400 outline-none text-base sm:text-xs text-atelier-noir"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-atelier-charcoal mb-1">
                    Allergies or Sensitivities
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. None, or sensitive cuticles / need HEMA-free"
                    value={allergies}
                    onChange={(e) => setAllergies(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-atelier-champagneBorder bg-atelier-cream/40 focus:bg-white focus:border-atelier-rose400 outline-none text-base sm:text-xs text-atelier-noir"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-atelier-charcoal mb-1">
                    Cute Nail Ideas / Special Requests for Sirii 💕
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Tell Sirii what you have in mind! You can also show her Pinterest photos at the studio..."
                    value={clientNotes}
                    onChange={(e) => setClientNotes(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-atelier-champagneBorder bg-atelier-cream/40 focus:bg-white focus:border-atelier-rose400 outline-none text-base sm:text-xs text-atelier-noir"
                  />
                </div>

                {/* Advance Deposit Option with Toggle */}
                <div className="p-4 rounded-2xl bg-atelier-cream/60 border border-atelier-champagneBorder space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <span className="font-semibold text-atelier-noir text-xs flex items-center gap-1.5">
                        <Wallet className="w-3.5 h-3.5 text-atelier-rose500" />
                        <span>Pay Small Advance to Hold Slot (Optional) 💳</span>
                      </span>
                      <p className="text-[11px] text-atelier-muted">
                        Transfer a small advance via GPay / PhonePe to confirm your slot. Deducted from final bill!
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setClientAdvanceToggle(!clientAdvanceToggle)}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${clientAdvanceToggle ? 'bg-atelier-rose500' : 'bg-stone-300'
                        }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${clientAdvanceToggle ? 'translate-x-5' : 'translate-x-0'
                          }`}
                      />
                    </button>
                  </div>

                  {clientAdvanceToggle ? (
                    <div className="space-y-3 pt-2 border-t border-atelier-champagneBorder/60 animate-in fade-in">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block font-semibold text-atelier-charcoal mb-1">
                            Advance Amount (₹)
                          </label>
                          <input
                            type="number"
                            min="100"
                            max={totalPrice}
                            step="50"
                            value={clientAdvanceAmount}
                            onChange={(e) => setClientAdvanceAmount(e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-atelier-champagneBorder bg-white focus:border-atelier-rose400 outline-none text-base sm:text-xs font-semibold text-emerald-700"
                          />
                        </div>

                        <div>
                          <label className="block font-semibold text-atelier-charcoal mb-1">
                            GPay / PhonePe Ref or UTR (Optional)
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. 12-digit UTR or GPay Ref"
                            value={clientUpiRef}
                            onChange={(e) => setClientUpiRef(e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-atelier-champagneBorder bg-white focus:border-atelier-rose400 outline-none text-base sm:text-xs text-atelier-noir"
                          />
                        </div>
                      </div>

                      {/* Studio UPI ID Callout */}
                      <div className="p-3 rounded-xl bg-white border border-atelier-champagneBorder flex items-center justify-between gap-2 text-[11px]">
                        <div>
                          <span className="text-atelier-muted">Sirii's UPI ID (GPay / PhonePe):</span>{' '}
                          <span className="font-mono font-bold text-atelier-rose600 select-all">
                            {settings?.upiId || 'nailsbysirii@okaxis'}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(settings?.upiId || 'nailsbysirii@okaxis');
                            if (onAddToast) onAddToast('UPI ID Copied', 'Paste into Google Pay or PhonePe', 'success');
                          }}
                          className="px-2.5 py-1 rounded-lg bg-atelier-rose50 text-atelier-rose600 font-semibold hover:bg-atelier-rose100 transition-colors"
                        >
                          Copy UPI
                        </button>
                      </div>

                      {/* Live Breakdown */}
                      <div className="p-3 rounded-xl bg-atelier-blush border border-atelier-rose200/80 flex items-center justify-between text-xs">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-emerald-700 block tracking-wider">
                            Advance Paid Now
                          </span>
                          <span className="font-serif italic font-bold text-sm text-emerald-700">
                            ₹{Number(clientAdvanceAmount || 0).toLocaleString('en-IN')}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] uppercase font-bold text-amber-700 block tracking-wider">
                            Pending Amount at Studio
                          </span>
                          <span className="font-serif italic font-bold text-base text-amber-700">
                            ₹{Number(Math.max(0, totalPrice - (Number(clientAdvanceAmount) || 0))).toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-[11px] text-atelier-muted italic">
                      No advance required right now babe! You can pay the full amount at the studio after your nails are done 💕
                    </p>
                  )}
                </div>

                <div className="flex justify-between pt-4 gap-2">
                  <button
                    type="button"
                    onClick={() => setBookingStep(3)}
                    className="px-4 py-2.5 rounded-xl border border-atelier-champagneBorder text-atelier-charcoal hover:bg-atelier-cream text-xs font-semibold"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingBooking}
                    className="px-8 py-3 rounded-xl bg-atelier-rose500 hover:bg-atelier-rose600 text-white font-semibold text-xs shadow-soft transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>{isSubmittingBooking ? 'Saving Your Slot 💕...' : 'Book My Appointment 💕'}</span>
                  </button>
                </div>
              </form>
            )}

            {/* STEP 5: Booking Confirmed Screen */}
            {bookingStep === 5 && confirmedBooking && (
              <div className="text-center space-y-6 py-6 animate-fade-in text-xs">
                <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <div className="space-y-1.5">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-atelier-rose600 block">
                    Yay, You're Booked! 💕
                  </span>
                  <h3 className="font-serif italic font-bold text-2xl text-atelier-noir">
                    See You Soon, {confirmedBooking.clientName}! 💕
                  </h3>
                  <p className="text-atelier-muted text-xs max-w-md mx-auto">
                    Your appointment is reserved with Nails by Sirii in Dehradun! Sirii has received your booking on her phone and will message you shortly on WhatsApp.
                  </p>
                </div>

                {/* Appointment Card Recap with Advance & Pending */}
                <div className="p-5 rounded-2xl bg-atelier-cream/60 border border-atelier-champagneBorder max-w-md mx-auto text-left space-y-2.5">
                  <div className="flex justify-between items-baseline pb-2 border-b border-atelier-champagneBorder">
                    <span className="font-semibold text-atelier-noir">{confirmedBooking.serviceName}</span>
                    {!hidePrices && (
                      <span className="font-serif font-bold text-atelier-rose600 text-base">
                        ₹{Number(confirmedBooking.price).toLocaleString('en-IN')}
                      </span>
                    )}
                    {hidePrices && (
                      <span className="font-serif italic text-atelier-rose600 text-xs">
                        Price on Request 💕
                      </span>
                    )}
                  </div>
                  <div className="text-atelier-charcoal space-y-1 text-xs">
                    <p>
                      <strong>Date & Time:</strong> {confirmedBooking.date} at {confirmedBooking.time}
                    </p>
                    <p>
                      <strong>Studio:</strong> {settings?.studioName || 'Nails by Sirii'}
                    </p>
                    <p>
                      <strong>Location:</strong> {settings?.address || 'Shop No. 7, Laxmi Navraj Plaza, Garhi Cantt, Dehradun 248003'}
                    </p>
                    <p>
                      <strong>Your Vibe:</strong> {selectedShape} • {selectedLength} • {selectedAesthetic}
                    </p>
                    {Number(confirmedBooking.depositPaid || 0) > 0 && (
                      <div className="pt-2 mt-2 border-t border-atelier-champagneBorder flex items-center justify-between text-[11px]">
                        <span className="text-emerald-700 font-semibold">
                          Advance Paid: ₹{Number(confirmedBooking.depositPaid).toLocaleString('en-IN')}
                        </span>
                        <span className="text-amber-700 font-bold">
                          To Pay at Studio: ₹{Number(Math.max(0, confirmedBooking.price - confirmedBooking.depositPaid)).toLocaleString('en-IN')}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <a
                    href={`https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
                      `Hi Sirii! 💕 I just booked an appointment on your website!\n\nName: ${confirmedBooking.clientName}\nService: ${confirmedBooking.serviceName}\nDate & Time: ${confirmedBooking.date} at ${confirmedBooking.time}\nPhone: ${confirmedBooking.clientPhone}${
                        Number(confirmedBooking.depositPaid || 0) > 0 ? `\nAdvance Paid: ₹${confirmedBooking.depositPaid}` : ''
                      }\n\nLooking forward to seeing you at your Garhi Cantt studio! ✨`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-soft transition-all active:scale-95 flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Message Sirii on WhatsApp to Confirm 💕</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => setBookingStep(1)}
                    className="w-full sm:w-auto px-5 py-3 rounded-xl border border-atelier-champagneBorder bg-white hover:bg-atelier-cream text-xs font-semibold text-atelier-charcoal active:scale-95"
                  >
                    Book Another Set 💕
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 7. VERIFIED CLIENT TESTIMONIALS */}
      <section id="reviews" className="py-14 sm:py-20 px-4 sm:px-6 max-w-7xl mx-auto border-t border-atelier-champagneBorder/60">
        <div className="space-y-6 sm:space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-widest text-atelier-rose600 block">
                  💕 Real Client Love
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
              <h2 className="font-serif italic font-bold text-2xl sm:text-4xl text-atelier-noir">
                What Dehradun Girls Say About Us 💕
              </h2>
              <p className="text-xs text-atelier-muted max-w-md">
                Sweet reviews from our clients who love their cute, long-lasting gel nails & nail art!
              </p>
            </div>

            <button
              onClick={() => setShowReviewModal(true)}
              className="self-start sm:self-auto px-4 py-2 rounded-xl bg-atelier-blush hover:bg-atelier-rose100 text-atelier-rose600 border border-atelier-rose200/80 text-xs font-semibold transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Leave a Sweet Review 💕</span>
            </button>
          </div>

          {reviews.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 sm:p-12 border border-dashed border-atelier-champagneBorder text-center space-y-4 max-w-2xl mx-auto">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-500 border border-amber-200/60 flex items-center justify-center mx-auto shadow-xs">
                <Star className="w-6 h-6 fill-amber-300 text-amber-400" />
              </div>
              <div className="space-y-1">
                <h3 className="font-serif italic font-bold text-lg text-atelier-noir">
                  Be the First to Review Nails by Sirii 💕
                </h3>
                <p className="text-xs text-atelier-muted max-w-md mx-auto leading-relaxed">
                  Got your nails done by Sirii recently? We'd love to hear how much you loved your fresh set!
                </p>
              </div>
              <button
                onClick={() => setShowReviewModal(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-atelier-noir hover:bg-atelier-charcoal text-white text-xs font-semibold shadow-soft transition-all active:scale-95"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Write a Review 💕</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="bg-white rounded-3xl p-5 sm:p-6 border border-atelier-champagneBorder shadow-sm space-y-3 hover:border-atelier-rose200 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-amber-400">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${i < (rev.rating || 5)
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-stone-200'
                              }`}
                          />
                        ))}
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                        <ShieldCheck className="w-3 h-3 text-emerald-500" />
                        <span>{rev.source || 'Google Review (Verified)'}</span>
                      </div>
                    </div>

                    <p className="text-xs text-atelier-charcoal italic leading-relaxed">
                      "{rev.comment}"
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-stone-100 text-[11px]">
                    <div className="space-y-0.5">
                      <span className="font-semibold text-stone-900 block">{rev.clientName}</span>
                      <span className="text-[10px] text-stone-400">{rev.serviceRendered || 'Cute Gel Nails'}</span>
                    </div>
                    {rev.aestheticTag && (
                      <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 text-[10px] font-medium border border-rose-100">
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

      {/* 8. STUDIO POLICIES & LOCATION FOOTER */}
      <footer id="studio-info" className="bg-white border-t border-atelier-champagneBorder/70 pt-12 pb-10 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto space-y-10">
          {/* Policies Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 text-xs text-atelier-charcoal">
            <div className="space-y-2 p-5 rounded-3xl bg-atelier-cream/60 border border-atelier-champagneBorder/60">
              <span className="font-serif italic font-bold text-sm text-atelier-noir block">
                Please Arrive on Time ⏰
              </span>
              <p className="text-atelier-muted leading-relaxed">
                To give you full attention and create detailed nail art without rushing, please reach on time! If you need old gel removed, please select Gel Removal during booking.
              </p>
            </div>

            <div className="space-y-2 p-5 rounded-3xl bg-atelier-cream/60 border border-atelier-champagneBorder/60">
              <span className="font-serif italic font-bold text-sm text-atelier-noir block">
                100% Clean & Sanitized 🧼
              </span>
              <p className="text-atelier-muted leading-relaxed">
                Your health & safety come first! All our nail tools are thoroughly sanitized and sterilized for each client. We use fresh disposable files and buffers every single time.
              </p>
            </div>

            <div className="space-y-2 p-5 rounded-3xl bg-atelier-cream/60 border border-atelier-champagneBorder/60">
              <span className="font-serif italic font-bold text-sm text-atelier-noir block">
                How to Keep Your Nails Lasting 3-4 Weeks 💅
              </span>
              <p className="text-atelier-muted leading-relaxed">
                Apply cuticle oil or coconut oil daily to keep your nail beds hydrated and glowing. Don't pick or peel gel off, and treat your nails like jewels, not tools!
              </p>
            </div>
          </div>

          {/* Studio Details & Contact */}
          <div className="pt-6 border-t border-atelier-champagneBorder/60 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-center md:text-left">
            <div className="flex items-center gap-3">
              <StudioLogo logoUrl={settings?.studioLogoUrl} size="md" />
              <div>
                <span className="font-serif italic font-bold text-base text-atelier-noir">
                  {settings?.studioName || 'Nails by Sirii'}
                </span>
                <p className="text-atelier-muted text-[11px] max-w-sm">
                  {settings?.address || 'Shop No. 7, Laxmi Navraj Plaza, Garhi Cantonment, Garhi Cantt, Dehradun, Uttarakhand 248003'}
                </p>
                <div className="flex items-center gap-3 mt-1 justify-center md:justify-start">
                  <a
                    href="https://maps.google.com/?q=Nails+by+Sirii+Laxmi+Navraj+Plaza+Garhi+Cantonment+Dehradun"
                    target="_blank"
                    rel="noreferrer"
                    className="text-atelier-rose600 hover:underline font-semibold flex items-center gap-1 text-[11px]"
                  >
                    <MapPin className="w-3 h-3 shrink-0" />
                    <span>Get Directions on Maps</span>
                  </a>
                  <span className="text-stone-300">•</span>
                  <span className="text-emerald-700 font-semibold text-[11px] flex items-center gap-1">
                    <Clock className="w-3 h-3 text-emerald-600" />
                    <span>12:00 PM – 7:00 PM</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-atelier-muted">
              {settings?.phone && (
                <a
                  href={`tel:${settings.phone}`}
                  className="hover:text-atelier-rose600 flex items-center gap-1.5 transition-colors font-semibold"
                >
                  <Phone className="w-3.5 h-3.5 text-atelier-rose500" />
                  <span>{settings.phone}</span>
                </a>
              )}
              {settings?.instagram && (
                <a
                  href={`https://instagram.com/${settings.instagram.replace('@', '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-atelier-rose600 flex items-center gap-1.5 transition-colors font-semibold"
                >
                  <InstagramIcon className="w-3.5 h-3.5 text-pink-600" />
                  <span>{settings.instagram}</span>
                </a>
              )}
              {settings?.email && (
                <a
                  href={`mailto:${settings.email}`}
                  className="hover:text-atelier-rose600 flex items-center gap-1.5 transition-colors"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>{settings.email}</span>
                </a>
              )}
            </div>

            {/* Studio Hub Passcode Gate Button */}
            <button
              onClick={onOpenPasscodeModal}
              className="px-3 py-1.5 rounded-xl bg-atelier-cream hover:bg-atelier-rose50 border border-atelier-champagneBorder text-[11px] font-semibold text-atelier-charcoal hover:text-atelier-rose600 transition-all flex items-center gap-1.5 shadow-xs active:scale-95"
            >
              <Lock className="w-3 h-3 text-atelier-muted" />
              <span>Studio Hub (Sirii Only 🔒)</span>
            </button>
          </div>

          <div className="text-center text-[10px] text-atelier-muted pt-3 border-t border-atelier-champagneBorder/40">
            © {new Date().getFullYear()} {settings?.studioName || 'Nails by Sirii'} • Handcrafted with love at Garhi Cantt, Dehradun 💕. All rights reserved.
          </div>
        </div>
      </footer>

      {/* 9. FLOATING MOBILE ATELIER CONCIERGE BAR (Mobile Screen Only) */}
      <div className="sm:hidden fixed bottom-3 inset-x-3 z-30 max-w-sm mx-auto">
        <div className="bg-white/95 backdrop-blur-2xl border border-atelier-rose200/90 shadow-float rounded-2xl p-2 flex items-center justify-between gap-2">
          {/* Quick Book Button */}
          <a
            href="#booking-section"
            className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-atelier-rose500 to-atelier-rose600 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Book Slot 💕</span>
          </a>

          {/* Quick WhatsApp Link */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center active:scale-95 shrink-0"
            title="Chat on WhatsApp"
          >
            <MessageCircle className="w-4 h-4" />
          </a>

          {/* Quick Share Modal */}
          <button
            onClick={() => setIsShareModalOpen(true)}
            className="w-10 h-10 rounded-xl bg-atelier-rose50 border border-atelier-rose200 text-atelier-rose600 flex items-center justify-center active:scale-95 shrink-0"
            title="Share Catalogue Without Prices"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-atelier-noir/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-atelier-champagneBorder space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center">
                  <Star className="w-4 h-4 fill-amber-400" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-stone-900">Share Your Nail Experience 💕</h3>
                  <p className="text-[11px] text-stone-400">Tell Sirii how much you loved your new nails!</p>
                </div>
              </div>
              <button
                onClick={() => setShowReviewModal(false)}
                className="w-7 h-7 rounded-full hover:bg-stone-100 flex items-center justify-center text-stone-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleReviewSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Your Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ananya, Priya, Simran..."
                  value={reviewForm.clientName}
                  onChange={(e) => setReviewForm({ ...reviewForm, clientName: e.target.value })}
                  className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-200 focus:bg-white text-base sm:text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Rating
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                      className="p-1 hover:scale-110 transition-transform active:scale-95"
                    >
                      <Star
                        className={`w-6 h-6 ${star <= reviewForm.rating
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-stone-200'
                          }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-semibold text-amber-700 ml-1">
                    {reviewForm.rating} / 5 Stars 💕
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Service You Got
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. BIAB Gel, Gel-X Extensions"
                    value={reviewForm.serviceRendered}
                    onChange={(e) => setReviewForm({ ...reviewForm, serviceRendered: e.target.value })}
                    className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-200 focus:bg-white text-base sm:text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Nail Art / Vibe
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. French Tips, Cat-Eye, Glazed Donut"
                    value={reviewForm.aestheticTag}
                    onChange={(e) => setReviewForm({ ...reviewForm, aestheticTag: e.target.value })}
                    className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-200 focus:bg-white text-base sm:text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Your Review / Experience 💕 *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Tell us what you loved about your nails, how long they lasted, or how sweet the experience was! 💕"
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                  className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-200 focus:bg-white resize-none text-base sm:text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setShowReviewModal(false)}
                  className="px-4 py-2 text-stone-500 hover:bg-stone-100 rounded-xl font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingReview}
                  className="px-5 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-xl font-medium shadow-sm flex items-center gap-1.5 disabled:opacity-50 active:scale-95"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isSubmittingReview ? 'Submitting...' : 'Post Review 💕'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
