import React, { useState } from 'react';
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
  Send,
  Eye,
  AlertTriangle,
  MessageSquare,
  X
} from 'lucide-react';
import { InstagramIcon } from './Icons';
import EmergencyRepairModal from './EmergencyRepairModal';
import StudioLogo from './StudioLogo';

export default function PublicBookingView({
  services,
  settings,
  reviews = [],
  onBookingComplete,
  onSubmitRepair,
  onSaveReview,
  onSwitchToStudio,
  onAddToast
}) {
  const [isRepairModalOpen, setIsRepairModalOpen] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    clientName: '',
    rating: 5,
    serviceRendered: 'Signature BIAB Overlay',
    aestheticTag: 'Glazed Pearl Donut',
    comment: ''
  });
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [step, setStep] = useState(1); // 1: Select Service, 2: Shape & Style, 3: Date & Time, 4: Client Info, 5: Confirmed
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

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

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + (Number(r.rating) || 5), 0) / reviews.length).toFixed(1)
    : '5.0';

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

  const timeSlots = ['11:30', '12:30', '13:45', '15:00', '16:15', '17:30', '18:30'];

  const lookbookItems = [
    {
      title: 'Glazed Pearl Donut',
      tag: 'Hailey Chrome',
      desc: 'Iridescent pearl chrome over sheer strawberry milk builder gel.',
      shape: 'Medium Almond',
      price: '₹2,800'
    },
    {
      title: '3D Liquid Chrome Orbit',
      tag: 'Futuristic Chic',
      desc: 'Hand-sculpted raised metallic swirls with micro-star accents.',
      shape: 'Long Coffin',
      price: '₹3,800'
    },
    {
      title: 'Velvet Cat-Eye Magnetism',
      tag: 'Dual Silk Shift',
      desc: 'Deep multi-dimensional cosmic cat-eye magnetic silk shimmer.',
      shape: 'Medium Almond',
      price: '₹3,100'
    },
    {
      title: 'Micro-French Ombre',
      tag: 'Minimalist Bridal',
      desc: 'Crisp razor-thin white smile line over rosy nude BIAB overlay.',
      shape: 'Short Squoval',
      price: '₹2,600'
    },
    {
      title: 'Baroque Pearl Droplets',
      tag: 'High Fashion',
      desc: 'Clear 3D gel dew drops paired with embedded ivory seed pearls.',
      shape: 'Stiletto',
      price: '₹3,600'
    },
    {
      title: 'Matcha Minimalist Negative',
      tag: 'Editorial Clean',
      desc: 'Abstract sage green waves with delicate 24k gold leaf foil.',
      shape: 'Short Round',
      price: '₹2,700'
    }
  ];

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!clientName.trim() || !clientPhone.trim()) {
      if (onAddToast) {
        onAddToast('Missing Details', 'Please provide your name and phone number so Sirii can confirm your appointment.', 'error');
      }
      return;
    }

    setIsSubmitting(true);

    try {
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
        depositPaid: 0,
        notes: `Preferences: ${selectedShape}, ${selectedLength}, ${selectedAesthetic}. Allergies: ${allergies}. Note: ${clientNotes}`,
        notifyImmediate: true, // Will immediately alert Sirii's phone via ntfy!
        status: 'Confirmed'
      };

      const result = await onBookingComplete(payload);
      setConfirmedBooking({ ...payload, id: result?.id || 'apt_new' });
      setStep(5);
    } catch (err) {
      alert('Failed to submit booking: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-16 animate-fade-in pb-16">
      {/* Top Banner Navigation for Owner */}
      <div className="bg-atelier-blush/80 border border-atelier-rose200/80 rounded-2xl p-3 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 text-atelier-charcoal">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="font-semibold">Public Client View:</span>
          <span className="text-atelier-muted hidden sm:inline">
            This is the live landing page and self-booking experience your clients see.
          </span>
        </div>
        <button
          onClick={onSwitchToStudio}
          className="px-3 py-1.5 rounded-xl bg-white border border-atelier-champagneBorder hover:border-atelier-rose300 text-atelier-noir font-semibold shadow-sm transition-all text-xs"
        >
          Return to Studio OS
        </button>
      </div>

      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto space-y-4 pt-4">
        <StudioLogo logoUrl={settings?.studioLogoUrl} size="xl" showText className="justify-center mb-2" />

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-atelier-rose200 shadow-sm text-atelier-rose600 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Cute & Aesthetic Nail Studio • Dehradun</span>
        </div>

        <p className="text-sm sm:text-base text-atelier-muted max-w-xl mx-auto leading-relaxed">
          Gorgeous builder gel nails, soft gel extensions, and cute hand-painted nail art. Handcrafted with love at our private studio in Garhi Cantt, Dehradun!
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
          <a
            href="#booking-section"
            className="px-6 py-3 rounded-2xl bg-atelier-rose500 hover:bg-atelier-rose600 text-white font-semibold text-xs shadow-soft transition-all active:scale-95 flex items-center gap-2"
          >
            <span>Book Your Slot</span>
            <ArrowRight className="w-4 h-4" />
          </a>
          <a
            href="#lookbook"
            className="px-6 py-3 rounded-2xl bg-white border border-atelier-champagneBorder hover:border-atelier-rose300 text-atelier-charcoal font-semibold text-xs shadow-sm transition-all"
          >
            Nail Inspo
          </a>
          <button
            type="button"
            onClick={() => setIsRepairModalOpen(true)}
            className="px-5 py-3 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-semibold text-xs transition-all flex items-center gap-2"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
            <span>Fix Broken Nail</span>
          </button>
        </div>
      </div>

      {/* 4 Feature Highlights */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-atelier-champagneBorder text-center space-y-1">
          <span className="text-[10px] uppercase font-bold tracking-wider text-atelier-rose600 block">
            Clean & Safe
          </span>
          <p className="font-serif italic font-bold text-sm text-atelier-noir">
            Russian Cuticle Care
          </p>
          <p className="text-[11px] text-atelier-muted">Super clean cuticle cleanup</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-atelier-champagneBorder text-center space-y-1">
          <span className="text-[10px] uppercase font-bold tracking-wider text-atelier-rose600 block">
            Nail Health First
          </span>
          <p className="font-serif italic font-bold text-sm text-atelier-noir">
            Zero Damage Gel
          </p>
          <p className="text-[11px] text-atelier-muted">Safe builder gel on natural nails</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-atelier-champagneBorder text-center space-y-1">
          <span className="text-[10px] uppercase font-bold tracking-wider text-atelier-rose600 block">
            Private & Relaxing
          </span>
          <p className="font-serif italic font-bold text-sm text-atelier-noir">
            1-on-1 Studio Session
          </p>
          <p className="text-[11px] text-atelier-muted">Cozy & warm personal attention</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-atelier-champagneBorder text-center space-y-1">
          <span className="text-[10px] uppercase font-bold tracking-wider text-atelier-rose600 block">
            Long Lasting
          </span>
          <p className="font-serif italic font-bold text-sm text-atelier-noir">
            Lasts 3-4 Weeks
          </p>
          <p className="text-[11px] text-atelier-muted">Strong gel with zero chipping</p>
        </div>
      </div>

      {/* Interactive Self-Booking System */}
      <div id="booking-section" className="scroll-mt-10">
        <div className="bg-white rounded-3xl border border-atelier-champagneBorder p-6 sm:p-10 shadow-float max-w-3xl mx-auto">
          {/* Booking Progress Indicator */}
          {step < 5 && (
            <div className="mb-8">
              <div className="flex items-center justify-between text-xs mb-3">
                <span className="font-serif italic font-bold text-lg text-atelier-noir">
                  Book Your Appointment with Sirii
                </span>
                <span className="font-semibold text-atelier-rose600">
                  Step {step} of 4
                </span>
              </div>
              <div className="w-full bg-atelier-cream h-2 rounded-full overflow-hidden">
                <div
                  className="bg-atelier-rose500 h-full transition-all duration-300"
                  style={{ width: `${(step / 4) * 100}%` }}
                />
              </div>
            </div>
          )}

          {/* STEP 1: Service & Addons */}
          {step === 1 && (
            <div className="space-y-6 animate-fade-in text-xs">
              <div>
                <h3 className="font-serif italic font-bold text-xl text-atelier-noir mb-1">
                  1. Choose Your Primary Treatment
                </h3>
                <p className="text-atelier-muted text-xs">
                  Select the base service for your natural nails or extensions.
                </p>
              </div>

              <div className="space-y-2.5">
                {services
                  .filter((s) => s.category !== 'Nail Art' && s.category !== 'Add-on')
                  .map((srv) => (
                    <div
                      key={srv.id}
                      onClick={() => setSelectedServiceId(srv.id)}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${selectedServiceId === srv.id
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
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                              Popular
                            </span>
                          )}
                        </div>
                        <p className="text-atelier-muted text-[11px] leading-relaxed">
                          {srv.description}
                        </p>
                        <span className="text-[10px] text-atelier-charcoal font-medium block">
                          Duration: {srv.duration} mins
                        </span>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="font-serif font-bold text-base text-atelier-noir">
                          ₹{Number(srv.price).toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>

              {/* Addons Selection */}
              <div className="pt-4 border-t border-atelier-champagneBorder/60 space-y-3">
                <span className="font-semibold text-atelier-noir block">
                  Add-on Nail Art & Custom Enhancements (Optional)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {addonsList.map((addon) => {
                    const isSelected = selectedAddons.includes(addon.name);
                    return (
                      <button
                        type="button"
                        key={addon.id}
                        onClick={() => toggleAddon(addon.name)}
                        className={`p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${isSelected
                          ? 'bg-atelier-rose100 text-atelier-rose600 border-atelier-rose300 font-semibold shadow-sm'
                          : 'bg-atelier-cream/50 border-atelier-champagneBorder hover:bg-white text-atelier-charcoal'
                          }`}
                      >
                        <span className="truncate pr-1">{addon.name}</span>
                        <span className="shrink-0 font-serif font-bold text-atelier-noir">
                          +₹{Number(addon.price).toLocaleString('en-IN')}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-6 py-2.5 rounded-xl bg-atelier-rose500 hover:bg-atelier-rose600 text-white font-semibold text-xs shadow-soft transition-all flex items-center gap-1.5"
                >
                  <span>Continue to Shape & Style</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Shape & Style */}
          {step === 2 && (
            <div className="space-y-6 animate-fade-in text-xs">
              <div>
                <h3 className="font-serif italic font-bold text-xl text-atelier-noir mb-1">
                  2. Nail Shape & Aesthetic Preferences
                </h3>
                <p className="text-atelier-muted text-xs">
                  Sirii customizes each tip and apex to flatter your natural nail anatomy.
                </p>
              </div>

              {/* Shape */}
              <div className="space-y-2">
                <label className="font-semibold text-atelier-charcoal block">
                  Select Desired Shape
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
                      className={`p-2.5 rounded-xl border text-xs font-semibold transition-all ${selectedShape === shape
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
                  Select Length
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {['Short', 'Medium', 'Long', 'Extra Long'].map((len) => (
                    <button
                      type="button"
                      key={len}
                      onClick={() => setSelectedLength(len)}
                      className={`p-2.5 rounded-xl border text-xs font-semibold transition-all ${selectedLength === len
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
                  Signature Style Direction
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
                      className={`p-2.5 rounded-xl border text-left text-xs font-semibold transition-all ${selectedAesthetic === aesthetic
                        ? 'bg-atelier-rose100 text-atelier-rose600 border-atelier-rose300 shadow-sm'
                        : 'bg-white border-atelier-champagneBorder hover:bg-atelier-cream text-atelier-charcoal'
                        }`}
                    >
                      {aesthetic}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2.5 rounded-xl border border-atelier-champagneBorder text-atelier-charcoal hover:bg-atelier-cream text-xs font-semibold"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-6 py-2.5 rounded-xl bg-atelier-rose500 hover:bg-atelier-rose600 text-white font-semibold text-xs shadow-soft transition-all flex items-center gap-1.5"
                >
                  <span>Choose Date & Time</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Date & Time */}
          {step === 3 && (
            <div className="space-y-6 animate-fade-in text-xs">
              <div>
                <h3 className="font-serif italic font-bold text-xl text-atelier-noir mb-1">
                  3. Select Date & Time Slot
                </h3>
                <p className="text-atelier-muted text-xs">
                  Estimated session time: ~{totalDuration} minutes.
                </p>
              </div>

              <div className="space-y-2">
                <label className="font-semibold text-atelier-charcoal block">
                  Select Date
                </label>
                <input
                  type="date"
                  required
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-atelier-champagneBorder bg-atelier-cream/40 focus:bg-white focus:border-atelier-rose400 outline-none text-base sm:text-xs"
                />
              </div>

              <div className="space-y-2">
                <label className="font-semibold text-atelier-charcoal block">
                  Available Studio Time Slots
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {timeSlots.map((slot) => (
                    <button
                      type="button"
                      key={slot}
                      onClick={() => setBookingTime(slot)}
                      className={`p-3 rounded-xl border text-xs font-semibold transition-all ${bookingTime === slot
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
                    Session Duration
                  </span>
                  <span className="font-semibold text-atelier-noir">
                    {totalDuration} mins (~{(totalDuration / 60).toFixed(1)} hrs)
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-atelier-muted text-[10px] uppercase font-bold block">
                    Total Estimated
                  </span>
                  <span className="font-serif italic font-bold text-xl text-atelier-rose600">
                    ₹{Number(totalPrice).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-2.5 rounded-xl border border-atelier-champagneBorder text-atelier-charcoal hover:bg-atelier-cream text-xs font-semibold"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="px-6 py-2.5 rounded-xl bg-atelier-rose500 hover:bg-atelier-rose600 text-white font-semibold text-xs shadow-soft transition-all flex items-center gap-1.5"
                >
                  <span>Your Contact Details</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Client Info & Submit */}
          {step === 4 && (
            <form onSubmit={handleBookingSubmit} className="space-y-5 animate-fade-in text-xs">
              <div>
                <h3 className="font-serif italic font-bold text-xl text-atelier-noir mb-1">
                  4. Your Details & Confirmation
                </h3>
                <p className="text-atelier-muted text-xs">
                  Sirii will review your booking and send confirmation to your phone.
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
                    placeholder="e.g. Mia Sterling"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-atelier-champagneBorder bg-atelier-cream/40 focus:bg-white focus:border-atelier-rose400 outline-none text-base sm:text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-atelier-charcoal mb-1">
                    Phone Number (for SMS & confirmation) *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-atelier-champagneBorder bg-atelier-cream/40 focus:bg-white focus:border-atelier-rose400 outline-none text-base sm:text-xs"
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
                    className="w-full px-3.5 py-2.5 rounded-xl border border-atelier-champagneBorder bg-atelier-cream/40 focus:bg-white focus:border-atelier-rose400 outline-none text-base sm:text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-atelier-charcoal mb-1">
                    Instagram Handle (for nail inspiration sharing)
                  </label>
                  <input
                    type="text"
                    placeholder="@miasterling"
                    value={clientInstagram}
                    onChange={(e) => setClientInstagram(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-atelier-champagneBorder bg-atelier-cream/40 focus:bg-white focus:border-atelier-rose400 outline-none text-base sm:text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-atelier-charcoal mb-1">
                  Allergies, Cuticle Sensitivities, or Health Notes
                </label>
                <input
                  type="text"
                  placeholder="e.g. None, or sensitive to acetone / need HEMA-free"
                  value={allergies}
                  onChange={(e) => setAllergies(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-atelier-champagneBorder bg-atelier-cream/40 focus:bg-white focus:border-atelier-rose400 outline-none text-base sm:text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-atelier-charcoal mb-1">
                  Design Vision / Notes for Sirii
                </label>
                <textarea
                  rows={2}
                  placeholder="Tell Sirii about any inspiration photos or special event colors..."
                  value={clientNotes}
                  onChange={(e) => setClientNotes(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-atelier-champagneBorder bg-atelier-cream/40 focus:bg-white focus:border-atelier-rose400 outline-none text-base sm:text-xs"
                />
              </div>

              {/* Deposit Policy Notice */}
              <div className="p-3.5 rounded-2xl bg-atelier-cream border border-atelier-champagneBorder text-[11px] text-atelier-charcoal space-y-1">
                <span className="font-semibold text-atelier-noir block">
                  Holding Your Appointment Slot
                </span>
                <p className="text-atelier-muted leading-relaxed">
                  A small advance of ₹{settings?.depositRequirement || 500} will hold your slot and be deducted from your final bill. If you need to reschedule, please let Sirii know 24 hours prior
                </p>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-4 py-2.5 rounded-xl border border-atelier-champagneBorder text-atelier-charcoal hover:bg-atelier-cream text-xs font-semibold"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-3 rounded-xl bg-atelier-rose500 hover:bg-atelier-rose600 text-white font-semibold text-xs shadow-soft transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isSubmitting ? 'Saving Your Slot...' : 'Book My Appointment'}</span>
                </button>
              </div>
            </form>
          )}

          {/* STEP 5: Booking Confirmed Screen */}
          {step === 5 && confirmedBooking && (
            <div className="text-center space-y-6 py-6 animate-fade-in text-xs">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-1.5">
                <span className="text-[10px] uppercase font-bold tracking-widest text-atelier-rose600 block">
                  Yay, You're Booked!
                </span>
                <h3 className="font-serif italic font-bold text-2xl text-atelier-noir">
                  See You Soon, {confirmedBooking.clientName}!
                </h3>
                <p className="text-atelier-muted text-xs max-w-md mx-auto">
                  Your appointment is confirmed with Nails by Sirii in Dehradun! Sirii has received your booking and will message you on WhatsApp shortly.
                </p>
              </div>

              {/* Appointment Card Recap */}
              <div className="p-5 rounded-2xl bg-atelier-cream/60 border border-atelier-champagneBorder max-w-md mx-auto text-left space-y-2.5">
                <div className="flex justify-between items-baseline pb-2 border-b border-atelier-champagneBorder">
                  <span className="font-semibold text-atelier-noir">{confirmedBooking.serviceName}</span>
                  <span className="font-serif font-bold text-atelier-rose600 text-base">
                    ₹{Number(confirmedBooking.price).toLocaleString('en-IN')}
                  </span>
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
                    <strong>Style Chosen:</strong> {selectedShape} • {selectedLength} • {selectedAesthetic}
                  </p>
                </div>
              </div>

              <div className="pt-2 flex justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-5 py-2.5 rounded-xl border border-atelier-champagneBorder bg-white hover:bg-atelier-cream text-xs font-semibold text-atelier-charcoal"
                >
                  Book Another Set
                </button>
                <button
                  type="button"
                  onClick={onSwitchToStudio}
                  className="px-5 py-2.5 rounded-xl bg-atelier-rose500 hover:bg-atelier-rose600 text-white text-xs font-semibold shadow-soft"
                >
                  Open Studio OS (Admin)
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Lookbook Gallery */}
      <div id="lookbook" className="space-y-6 pt-8 border-t border-atelier-champagneBorder/60">
        <div className="text-center space-y-2">
          <span className="text-[10px] uppercase font-bold tracking-widest text-atelier-rose600 block">
            Cute Nail Inspo
          </span>
          <h2 className="font-serif italic font-bold text-3xl text-atelier-noir">
            Trending Studio Looks
          </h2>
          <p className="text-xs text-atelier-muted max-w-md mx-auto">
            Our most-loved nail art, glazed donut shines, and 3D charms created in Dehradun!
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {lookbookItems.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl p-6 border border-atelier-champagneBorder hover:border-atelier-rose300 shadow-sm hover:shadow-soft transition-all space-y-4 group"
            >
              <div className="h-40 rounded-2xl bg-gradient-to-tr from-atelier-rose100 via-atelier-blush to-atelier-cream border border-atelier-rose200/50 flex flex-col items-center justify-center text-center p-4 relative overflow-hidden">
                <Sparkles className="w-8 h-8 text-atelier-rose400 mb-2 group-hover:scale-110 transition-transform" />
                <span className="font-serif italic font-bold text-lg text-atelier-noir">
                  {item.title}
                </span>
                <span className="text-[10px] font-semibold text-atelier-rose600 uppercase tracking-wider mt-1">
                  {item.tag}
                </span>
              </div>

              <div className="space-y-1 text-xs">
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-atelier-noir">{item.shape}</span>
                  <span className="font-serif font-bold text-atelier-rose600 text-sm">
                    {item.price}
                  </span>
                </div>
                <p className="text-atelier-muted leading-relaxed">{item.desc}</p>
              </div>

              <a
                href="#booking-section"
                onClick={() => {
                  setSelectedAesthetic(item.title);
                  setStep(1);
                }}
                className="w-full py-2 rounded-xl bg-atelier-cream/80 hover:bg-atelier-rose50 text-atelier-charcoal hover:text-atelier-rose600 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Book This Look</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Verified Client Reviews & Testimonials Wall */}
      <div id="reviews" className="space-y-6 pt-8 border-t border-atelier-champagneBorder/60">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold tracking-widest text-atelier-rose600 block">
 Real Client Love
              </span>
              {reviews.length > 0 ? (
                <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[10px] font-semibold flex items-center gap-1 border border-amber-200">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  {avgRating} Star Rating
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full bg-atelier-rose50 text-atelier-rose600 text-[10px] font-semibold flex items-center gap-1 border border-atelier-rose200">
                  <Sparkles className="w-3 h-3 text-atelier-rose500" />
                  Client Reviews
                </span>
              )}
            </div>
            <h2 className="font-serif italic font-bold text-3xl text-atelier-noir">
              What Dehradun Girls Say About Us
            </h2>
            <p className="text-xs text-atelier-muted max-w-md">
              Sweet reviews from our clients who love their cute, long-lasting gel nails & nail art!
            </p>
          </div>

          <button
            onClick={() => setShowReviewModal(true)}
            className="self-start sm:self-auto px-4 py-2 rounded-xl bg-atelier-blush hover:bg-atelier-rose100 text-atelier-rose600 border border-atelier-rose200/80 text-xs font-semibold transition-all flex items-center gap-1.5 shadow-sm hover:scale-[1.02] active:scale-[0.98]"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Leave a Sweet Review</span>
          </button>
        </div>

        {reviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="bg-white rounded-3xl p-6 border border-atelier-champagneBorder shadow-sm space-y-3 hover:border-atelier-rose200 transition-all"
              >
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
                  <div className="flex items-center gap-1.5 text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                    <ShieldCheck className="w-3 h-3 text-emerald-500" />
                    Happy Client
                  </div>
                </div>

                <p className="text-xs text-atelier-charcoal italic leading-relaxed">
                  "{rev.comment}"
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-[11px]">
                  <div className="space-y-0.5">
                    <span className="font-semibold text-stone-900 block">{rev.clientName}</span>
                    <span className="text-[10px] text-stone-400">{rev.serviceRendered}</span>
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
        ) : (
          <div className="bg-white rounded-3xl p-8 border border-dashed border-atelier-champagneBorder text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-atelier-rose100 text-atelier-rose500 flex items-center justify-center mx-auto">
              <Star className="w-6 h-6 fill-atelier-rose300 text-atelier-rose500" />
            </div>
            <div className="space-y-1">
              <h3 className="font-serif italic font-bold text-lg text-atelier-noir">
                Be the First to Review Nails by Sirii
              </h3>
              <p className="text-xs text-atelier-muted max-w-sm mx-auto">
                Got your nails done by Sirii recently? We'd love to hear how much you loved your fresh set!
              </p>
            </div>
            <button
              onClick={() => setShowReviewModal(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-atelier-rose500 hover:bg-atelier-rose600 text-white font-semibold text-xs shadow-sm transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Write a Review</span>
            </button>
          </div>
        )}
      </div>

      {/* Studio Policies & Aftercare Footer */}
      <div className="bg-white rounded-3xl p-8 border border-atelier-champagneBorder shadow-sm space-y-6">
        <h3 className="font-serif italic font-bold text-xl text-atelier-noir text-center">
          Studio Tips & Easy Aftercare
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-atelier-charcoal">
          <div className="space-y-2 p-4 rounded-2xl bg-atelier-cream/50 border border-atelier-champagneBorder/60">
            <span className="font-bold text-atelier-noir block">Please Be On Time ⏰</span>
            <p className="text-atelier-muted leading-relaxed">
              To give you full attention and create detailed nail art without rushing, please reach on time! If you need old gel removed, please let us know during booking.
            </p>
          </div>

          <div className="space-y-2 p-4 rounded-2xl bg-atelier-cream/50 border border-atelier-champagneBorder/60">
            <span className="font-bold text-atelier-noir block">Super Clean & Safe</span>
            <p className="text-atelier-muted leading-relaxed">
              All metal tools are thoroughly sanitized and sterilized for each client. We use fresh disposable files and buffers every single time.
            </p>
          </div>

          <div className="space-y-2 p-4 rounded-2xl bg-atelier-cream/50 border border-atelier-champagneBorder/60">
            <span className="font-bold text-atelier-noir block">How to Keep Your Nails Lasting</span>
            <p className="text-atelier-muted leading-relaxed">
              Apply cuticle oil or coconut oil daily to keep your nail beds hydrated. Don't peel or pick gel off, and treat your nails like jewels, not tools!
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-atelier-champagneBorder/60 text-center text-xs text-atelier-muted space-y-1">
          <p className="font-serif italic font-semibold text-atelier-noir">
            {settings?.studioName || 'Nails by Sirii'} • {settings?.address || 'Shop No. 7, Laxmi Navraj Plaza, Garhi Cantonment, Garhi Cantt, Dehradun 248003'}
          </p>
          <p>{settings?.phone || '+91 73026 23493'} • {settings?.instagram || '@nails.by.sirii'}</p>
        </div>
      </div>

      {/* Emergency Broken Nail Repair Modal */}
      <EmergencyRepairModal
        isOpen={isRepairModalOpen}
        onClose={() => setIsRepairModalOpen(false)}
        onSubmitRepair={onSubmitRepair}
        settings={settings}
        onAddToast={onAddToast}
      />

      {/* Write Atelier Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-stone-900/50 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border-t sm:border border-stone-200 space-y-4 max-h-[92vh] overflow-y-auto">
            <div className="w-10 h-1.5 rounded-full bg-stone-300 mx-auto sm:hidden" />
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center">
                  <Star className="w-4 h-4 fill-amber-400" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-stone-900">Share Your Nail Experience</h3>
                  <p className="text-[11px] text-stone-400">Tell Sirii how much you loved your new nails!</p>
                </div>
              </div>
              <button
                onClick={() => setShowReviewModal(false)}
                className="w-7 h-7 rounded-full hover:bg-stone-100 flex items-center justify-center text-stone-400 hover:text-stone-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleReviewSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Vivienne St. Claire"
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
                    {reviewForm.rating} / 5 Stars
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Service Rendered
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Signature BIAB"
                    value={reviewForm.serviceRendered}
                    onChange={(e) => setReviewForm({ ...reviewForm, serviceRendered: e.target.value })}
                    className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-200 focus:bg-white text-base sm:text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Aesthetic Style
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Glazed Pearl"
                    value={reviewForm.aestheticTag}
                    onChange={(e) => setReviewForm({ ...reviewForm, aestheticTag: e.target.value })}
                    className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-200 focus:bg-white text-base sm:text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Your Review / Testimonial *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Share details about the appointment, retention, or studio vibe..."
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
                  className="px-5 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-xl font-medium shadow-sm flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isSubmittingReview ? 'Submitting...' : 'Post Review'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

