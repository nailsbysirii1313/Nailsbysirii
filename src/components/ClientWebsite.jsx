import React, { useState, useEffect } from 'react';
import {
  Gem,
  Crown,
  Flower2,
  Wand2,
  Paintbrush,
  Ribbon,
  Feather,
  GraduationCap,
  Stars,
  PackageCheck,
  HeartHandshake,
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
  Camera,
  Image as ImageIcon,
  Compass,
  BookOpen,
  ShoppingBag,
  Package,
  Truck,
  Ruler,
  HelpCircle,
  Copy,
  QrCode,
  Quote,
  ThumbsUp
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { InstagramIcon } from './Icons';
import StudioLogo from './StudioLogo';
import ModalPortal from './ModalPortal';
import InteractiveHeroCardFan from './InteractiveHeroCardFan';

// Lazy-load modal dialogs triggered only on specific user clicks
const EmergencyRepairModal = React.lazy(() => import('./EmergencyRepairModal'));
const ShareCatalogueModal = React.lazy(() => import('./ShareCatalogueModal'));
import confetti from 'canvas-confetti';
import { calculateCustomSet, SHAPES, LENGTHS, BASE_COLORS, FINISHES } from '../utils/customizerCalculator';
import { getKolkataTodayString, getKolkataTomorrowString, getAvailableSlotsForDuration, formatTime12h } from '../utils/dateTime';
import NailTipSchematic from './NailTipSchematic';

const DEFAULT_STUDIO_REVIEWS = [
  {
    id: 'rev_google_5',
    clientName: 'Da Suttiwanna',
    rating: 5,
    serviceRendered: 'Hand-Painted Floral Nail Art',
    aestheticTag: 'Detailed Hand Art',
    comment: "It was my first time getting my nails done at Nails by Sirii and I can't get over how gorgeous these nails turned out! I showed them the inspiration pictures and they executed it perfectly. The artistry and precision in the hand painted flowers are truly impressive. Thank you so much, I love them!",
    date: 'Verified Client',
    source: 'Google Review',
    likes: 42
  },
  {
    id: 'rev_google_3',
    clientName: 'Simran Thapa',
    rating: 5,
    serviceRendered: 'Almond Nude & Chrome French',
    aestheticTag: 'Classy & Neat Finishing',
    comment: "Got my nails done by siri and I'm in love! I chose almond shape with nude base and golden chrome French tips. Finishing is super neat and classy, exactly like the reference picture. The couple was very polite and hygienic. Totally worth it, highly recommend!",
    date: '4 weeks ago',
    source: 'Google Review',
    likes: 31
  },
  {
    id: 'rev_google_1',
    clientName: 'Paaky Biswas',
    rating: 5,
    serviceRendered: 'Nail Extensions & Gel Overlay',
    aestheticTag: 'Super Clean & Friendly',
    comment: 'The studio is super clean, the vibe is very friendly. Simran mam is amazing at understanding what you want. She gives such great ideas and helps you find the perfect design and colour! Definitely coming back again. Highly recommend!',
    date: '2 months ago',
    source: 'Google Review',
    likes: 24
  },
  {
    id: 'rev_google_8',
    clientName: 'Jyoti Mehta',
    rating: 5,
    serviceRendered: 'Nail Extensions & Inspo Set',
    aestheticTag: 'Exact Match to Inspo',
    comment: 'I had a great experience with both of them. They are not just great at what they do but very humble and calm human beings. I just showed them a picture of what I wanted and I got the exact same. Definitely going to revisit. Much love',
    date: '6 months ago',
    source: 'Google Review',
    likes: 22
  },
  {
    id: 'rev_google_2',
    clientName: 'Pratiksha Raturi',
    rating: 5,
    serviceRendered: 'Custom Nail Art & Manicure',
    aestheticTag: 'Relaxing & Cosy Studio',
    comment: "Absolutely loved my nails! They turned out so pretty, and I'm genuinely happy with how they look. The owners were super sweet, friendly, and helpful with their suggestions, which made the whole experience even better. They really understand what suits you and help you choose the best design.",
    date: '4 weeks ago',
    source: 'Google Review',
    likes: 19
  },
  {
    id: 'rev_google_7',
    clientName: 'Boby-Kabo Rana',
    rating: 5,
    serviceRendered: '1:1 Certified Nail Course',
    aestheticTag: 'Nail Tech Academy',
    comment: "Simran ma'am is so good in teaching Nail Course. I was a beginner to understand the whole things about Nails, but Ma'am and Sir both made me super Pro and trust me everyone now I am doing so good. If you are planning to get your nails done or take a Nail Tech Course, I'll genuinely suggest Nails by Sirii — super reasonable!",
    date: '4 months ago',
    source: 'Google Review',
    likes: 29
  },
  {
    id: 'rev_google_4',
    clientName: 'Ashutosh Duklan',
    rating: 5,
    serviceRendered: 'Nail Extensions',
    aestheticTag: 'Warm Hospitality',
    comment: "Recently visited Nails by Siri with my sister, and this review isn't just about the amazing nail services, it's also about the incredible hospitality we experienced there. The couple running the studio was genuinely warm, sweet, and extremely welcoming. The services were absolutely top-notch!",
    date: '7 months ago',
    source: 'Google Review',
    likes: 15
  },
  {
    id: 'rev_google_6',
    clientName: 'Rohini Rwt',
    rating: 5,
    serviceRendered: 'Sculpted Acrylic Extensions',
    aestheticTag: 'Neat & Polite Staff',
    comment: 'I had a wonderful experience! The nail extensions turned out so beautiful and exactly how I wanted. The work was neat, the finishing was perfect, and the staff was very polite and friendly. They paid attention to every little detail. Highly recommended!',
    date: '1 week ago',
    source: 'Google Review',
    likes: 18
  },
  {
    id: 'rev_google_9',
    clientName: 'Tannu Dhiman',
    rating: 5,
    serviceRendered: 'Custom Gel Extensions',
    aestheticTag: 'Sweet Owners & Exact Nails',
    comment: 'I have done the nails exactly as told and they look very nice to me and the owner, both are very sweet, thank you so much, nails by Siri!',
    date: '2 months ago',
    source: 'Google Review',
    likes: 14
  }
];

const REVIEW_CATEGORIES = [
  'All Reviews',
  'Exact Inspo Match',
  'Extensions & BIAB',
  'Hand-Painted Art',
  'Hygiene & Hospitality',
  'Nail Tech Academy'
];

const AVATAR_BG_COLORS = [
  'bg-rose-100 text-rose-800 border-rose-200',
  'bg-amber-100 text-amber-800 border-amber-200',
  'bg-emerald-100 text-emerald-800 border-emerald-200',
  'bg-purple-100 text-purple-800 border-purple-200',
  'bg-sky-100 text-sky-800 border-sky-200',
  'bg-orange-100 text-orange-800 border-orange-200'
];

function getInitials(name) {
  if (!name) return 'NB';
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function getAvatarColor(name) {
  let hash = 0;
  for (let i = 0; i < (name || '').length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_BG_COLORS[Math.abs(hash) % AVATAR_BG_COLORS.length];
}

function classifyReview(r) {
  const text = `${r.comment || ''} ${r.serviceRendered || ''} ${r.aestheticTag || ''}`.toLowerCase();
  if (text.includes('course') || text.includes('teaching') || text.includes('academy') || text.includes('student') || text.includes('pro')) {
    return 'Nail Tech Academy';
  }
  if (text.includes('inspo') || text.includes('picture') || text.includes('photo') || text.includes('reference') || text.includes('exact') || text.includes('same')) {
    return 'Exact Inspo Match';
  }
  if (text.includes('art') || text.includes('flower') || text.includes('chrome') || text.includes('painted') || text.includes('tips') || text.includes('design')) {
    return 'Hand-Painted Art';
  }
  if (text.includes('clean') || text.includes('hygien') || text.includes('polite') || text.includes('sweet') || text.includes('hospitality') || text.includes('welcoming') || text.includes('vibe') || text.includes('owners')) {
    return 'Hygiene & Hospitality';
  }
  return 'Extensions & BIAB';
}

export const DEFAULT_HERO_CARDS = [
  {
    id: 'soft',
    label: 'Soft & Simple',
    title: 'Clean Glazed Donut',
    shape: 'Almond',
    length: 'Short',
    imageUrl: '/hero/soft-simple.jpg',
    baseColor: '#FDF2F8',
    finish: 'chrome',
    subtitle: 'Sheer strawberry nude • Natural almond',
    tag: 'Trending Now'
  },
  {
    id: 'sparkle',
    label: 'A Little Sparkle',
    title: 'Golden Pearl Chrome',
    shape: 'Coffin',
    length: 'Medium',
    imageUrl: '/hero/little-sparkle.jpg',
    baseColor: '#FFFBEB',
    finish: 'chrome',
    subtitle: 'Champagne porcelain • Molten chrome shine',
    tag: 'Studio Fav'
  },
  {
    id: 'statement',
    label: 'Make a Statement',
    title: 'Velvet Rose Cat-Eye',
    shape: 'Stiletto',
    length: 'Long',
    imageUrl: '/hero/make-statement.jpg',
    baseColor: '#D4386A',
    finish: 'cat-eye',
    subtitle: 'Magnetic silk shimmer • Sculpted stiletto',
    tag: 'Statement Art'
  }
];

export default function ClientWebsite({
  services = [],
  settings,
  reviews = [],
  pressOnProducts = [],
  onOrderPressOn,
  hidePrices = false,
  setHidePrices,
  onOpenPasscodeModal,
  onBookingComplete,
  onSubmitRepair,
  onSaveReview,
  onAddToast,
  onOpenCatalogue,
  catalogueDesigns = [],
  initialSelectedLook = null
}) {
  // Navigation & Modals
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isRepairModalOpen, setIsRepairModalOpen] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);

  // Hero Interactive Fan State (from settings or defaults)
  const heroCards = (settings?.heroCards && Array.isArray(settings.heroCards) && settings.heroCards.length >= 3)
    ? settings.heroCards
    : DEFAULT_HERO_CARDS;
  const [activeHeroStyle, setActiveHeroStyle] = useState(() => heroCards[1]?.id || 'sparkle');

  // Catalogue Filters
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Interactive Customizer State (Single Source of Truth)
  const shapes = SHAPES;
  const lengths = LENGTHS;
  const baseColors = BASE_COLORS;
  const finishes = FINISHES;

  const [customShape, setCustomShape] = useState(shapes[0]); // Almond
  const [customLength, setCustomLength] = useState(lengths[1]); // Medium
  const [customBase, setCustomBase] = useState(baseColors[1]); // Strawberry Jelly
  const [customFinish, setCustomFinish] = useState(finishes[0]); // Hailey Glazed Chrome

  // Booking Flow State
  const [bookingStep, setBookingStep] = useState(1);
  const [bookingMode, setBookingMode] = useState('lookbook'); // 'lookbook' | 'customInspo' | 'customSet'
  const [selectedLook, setSelectedLook] = useState(null);
  const [inspoUrl, setInspoUrl] = useState('');
  const [inspoDescription, setInspoDescription] = useState('');
  const [selectedShape, setSelectedShape] = useState('Almond');
  const [selectedLength, setSelectedLength] = useState('Medium');
  const [selectedAesthetic, setSelectedAesthetic] = useState('Hand-Painted Nail Art');
  const [bookingDate, setBookingDate] = useState(() => getKolkataTomorrowString());
  const [bookingTime, setBookingTime] = useState('12:00');
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientInstagram, setClientInstagram] = useState('');
  const [allergies, setAllergies] = useState('None');
  const [clientNotes, setClientNotes] = useState('');
  const [isSubmittingBooking, setIsSubmittingBooking] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  // Review Form State
  const [reviewForm, setReviewForm] = useState({
    clientName: '',
    rating: 5,
    serviceRendered: 'Acrylic Nail Sculpting',
    aestheticTag: 'French Ombré Acrylic',
    comment: ''
  });
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // Reviews & Testimonials Filter and Interaction States
  const [reviewFilter, setReviewFilter] = useState('All Reviews');
  const [reviewLikes, setReviewLikes] = useState({
    rev_google_5: 42,
    rev_google_3: 31,
    rev_google_1: 24,
    rev_google_8: 22,
    rev_google_2: 19,
    rev_google_7: 29,
    rev_google_4: 15,
    rev_google_6: 18,
    rev_google_9: 14,
    rev_1794928419012: 16
  });
  const [likedReviews, setLikedReviews] = useState(new Set());

  const handleToggleLikeReview = (reviewId) => {
    setLikedReviews((prev) => {
      const next = new Set(prev);
      const isLiked = next.has(reviewId);
      if (isLiked) {
        next.delete(reviewId);
        setReviewLikes((l) => ({ ...l, [reviewId]: Math.max(0, (l[reviewId] || 1) - 1) }));
      } else {
        next.add(reviewId);
        setReviewLikes((l) => ({ ...l, [reviewId]: (l[reviewId] || 0) + 1 }));
        if (onAddToast) {
          onAddToast('Thank you!', 'Appreciation recorded for this client review.', 'success');
        }
      }
      return next;
    });
  };

  // Press-On Nails Boutique E-Commerce State
  const defaultPressOnCatalog = [
    {
      id: 'pop_1',
      title: 'Hailey Glazed Pearl Chrome',
      collection: 'Signature Ethereal',
      shape: 'Almond',
      length: 'Medium',
      baseColor: '#FDF2F8',
      finish: 'Hailey Glazed Chrome',
      price: 1299,
      stock: 8,
      isAvailable: true,
      tag: 'Bestseller',
      description: 'Ultra-popular pearlescent glazed chrome over sheer strawberry milk builder gel. Hand-buffed with salon chrome powder for an ethereal mirror shine.',
      includedKit: '10 Handcrafted Nails, Salon Liquid Glue, 24 Jelly Sticky Tabs, Cuticle Pusher, Mini Buffer, 2 Prep Wipes'
    },
    {
      id: 'pop_2',
      title: 'Velvet Rose Quartz Cat-Eye',
      collection: 'Magnetic Silk',
      shape: 'Almond',
      length: 'Long',
      baseColor: '#BE185D',
      finish: 'Velvet Cat-Eye',
      price: 1499,
      stock: 6,
      isAvailable: true,
      tag: 'Studio Pick',
      description: 'Deep dimensional velvet magnetic shimmer refracting light across long sculpted stilettos. Dramatic, luxurious, and chip-proof.',
      includedKit: '10 Handcrafted Nails, Salon Liquid Glue, 24 Jelly Sticky Tabs, Cuticle Pusher, Mini Buffer, 2 Prep Wipes'
    },
    {
      id: 'pop_3',
      title: '3D Molten Gold & Baroque Pearls',
      collection: 'Artisan Couture',
      shape: 'Coffin',
      length: 'Medium',
      baseColor: '#FFFBEB',
      finish: 'Sculpted 3D Chrome',
      price: 1699,
      stock: 5,
      isAvailable: true,
      tag: 'Luxury Edition',
      description: 'Hand-sculpted 3D liquid molten gold curves and real freshwater baroque pearl accents encrusted over an ivory porcelain bed.',
      includedKit: '10 Handcrafted Nails, Salon Liquid Glue, 24 Jelly Sticky Tabs, Cuticle Pusher, Mini Buffer, 2 Prep Wipes'
    },
    {
      id: 'pop_4',
      title: 'French Ombré Classic Porcelain',
      collection: 'Everyday Minimalist',
      shape: 'Squoval',
      length: 'Short',
      baseColor: '#FCE7F3',
      finish: 'High-Gloss Glass',
      price: 1199,
      stock: 10,
      isAvailable: true,
      tag: 'Clean Aesthetic',
      description: 'Seamless airbrushed baby boomer pink-and-white ombré gradient with high-apex reinforcement. Natural, clean, and workplace ready.',
      includedKit: '10 Handcrafted Nails, Salon Liquid Glue, 24 Jelly Sticky Tabs, Cuticle Pusher, Mini Buffer, 2 Prep Wipes'
    },
    {
      id: 'pop_5',
      title: 'Y2K Cyber Chrome Starbursts',
      collection: 'Streetwear Art',
      shape: 'Stiletto',
      length: 'Long',
      baseColor: '#F3F4F6',
      finish: 'Reflective Chrome',
      price: 1599,
      stock: 4,
      isAvailable: true,
      tag: 'Trending',
      description: 'High-shine liquid silver chrome starbursts, cross-stars, and geometric cyber accents set against a sheer neutral canvas.',
      includedKit: '10 Handcrafted Nails, Salon Liquid Glue, 24 Jelly Sticky Tabs, Cuticle Pusher, Mini Buffer, 2 Prep Wipes'
    },
    {
      id: 'pop_6',
      title: 'Milky Quartz & Gold Leaf Inlay',
      collection: 'Mineral Geode',
      shape: 'Coffin',
      length: 'Long',
      baseColor: '#F5F5F4',
      finish: 'Encapsulated Leaf',
      price: 1499,
      stock: 7,
      isAvailable: true,
      tag: 'Handcrafted',
      description: 'Subtle translucent white marble veining swirled with pure 24K gold foil flecks suspended in crystal clear gel depth.',
      includedKit: '10 Handcrafted Nails, Salon Liquid Glue, 24 Jelly Sticky Tabs, Cuticle Pusher, Mini Buffer, 2 Prep Wipes'
    }
  ];

  // Active products in the store
  const activePressOnProducts = (pressOnProducts && pressOnProducts.length > 0)
    ? pressOnProducts
    : defaultPressOnCatalog;

  const [isSizingModalOpen, setIsSizingModalOpen] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [selectedPressOnForOrder, setSelectedPressOnForOrder] = useState(null);
  const [checkoutStep, setCheckoutStep] = useState(1); // 1: Size & Kit, 2: Address, 3: Payment, 4: Confirmed
  const [copiedUpi, setCopiedUpi] = useState(false);

  const [pressOnOrderForm, setPressOnOrderForm] = useState({
    size: 'S',
    customSizes: '',
    wearMethod: 'Adhesive Jelly Tabs (Temporary 3–5 days, 100% reusable)',
    quantity: 1,
    clientName: '',
    clientPhone: '',
    clientEmail: '',
    addressStreet: '',
    addressCity: 'Dehradun',
    addressState: 'Uttarakhand',
    addressPincode: '',
    notes: '',
    paymentRef: ''
  });
  const [isPlacingPressOnOrder, setIsPlacingPressOnOrder] = useState(false);
  const [confirmedPressOnOrder, setConfirmedPressOnOrder] = useState(null);

  // Curated Image-Based Design Booklet Items (Only real photography looks)
  const defaultImageDesigns = [
    {
      id: 'acrylic_1',
      category: 'Acrylic Nails',
      title: 'French Ombré Acrylic Sculpture',
      tag: 'Studio Classic',
      desc: 'Seamless airbrushed transition of soft white powder into a translucent blush pink acrylic bed. Sculpted with strong structural apex architecture.',
      shape: SHAPES[0],
      length: LENGTHS[2],
      base: BASE_COLORS[1],
      finish: FINISHES[5],
      durationNum: 90,
      imageUrl: '/catalogue/french-ombre.jpg',
      highlights: ['Seamless pink-and-white ombré blend', 'Structural apex reinforcement', 'Russian dry e-file prep included']
    },
    {
      id: 'acrylic_4',
      category: 'Acrylic Nails',
      title: 'Velvet Cat-Eye Stiletto Acrylics',
      tag: 'Magnetic Silk Shift',
      desc: 'Deep dimensional velvet magnetic shimmer refracting light across long sculpted stilettos. Dramatic, luxurious, and chip-proof.',
      shape: SHAPES[4],
      length: LENGTHS[2],
      base: BASE_COLORS[4],
      finish: FINISHES[1],
      durationNum: 95,
      imageUrl: '/hero/make-statement.jpg',
      highlights: ['Multi-angle magnetic illumination', 'Precision razor stiletto apex', 'Lasts 4+ weeks effortlessly']
    },
    {
      id: 'biab_1',
      category: 'BIAB / Builder Gel',
      title: 'Glazed Pearl Donut BIAB',
      tag: 'Studio Signature',
      desc: 'Pearlescent glazed chrome powder hand-buffed over sheer strawberry jelly builder gel. The quintessential ethereal modern manicure.',
      shape: SHAPES[0],
      length: LENGTHS[1],
      base: BASE_COLORS[1],
      finish: FINISHES[0],
      durationNum: 75,
      imageUrl: '/hero/little-sparkle.jpg',
      highlights: ['Micro-fine iridescent chrome buff', 'Flexible natural apex reinforcement', 'Gentle non-damaging soak-off']
    },
    {
      id: 'biab_2',
      category: 'BIAB / Builder Gel',
      title: 'Milky White Clean Chrome BIAB',
      tag: 'Clean Aesthetic',
      desc: 'Semi-translucent porcelain white builder gel with a soft champagne reflection. Elegant, minimalist, and flattering on any skin tone.',
      shape: SHAPES[3],
      length: LENGTHS[0],
      base: BASE_COLORS[0],
      finish: FINISHES[0],
      durationNum: 75,
      imageUrl: '/catalogue/milky-white.jpg',
      highlights: ['Porcelain semi-sheer overlay', 'Reinforces weak natural nails', 'Ultra-clean cuticle framing']
    },
    {
      id: 'biab_glazed',
      category: 'BIAB / Builder Gel',
      title: 'Hailey Glazed Chrome Gel Overlay',
      tag: 'Ethereal Glaze',
      desc: 'High-reflectivity mirror chrome powder buffed over natural builder gel apex. Ethereal, glossy, and durable.',
      shape: SHAPES[0],
      length: LENGTHS[1],
      base: BASE_COLORS[1],
      finish: FINISHES[0],
      durationNum: 80,
      imageUrl: '/catalogue/glazed-donut.jpg',
      highlights: ['High-reflectivity chrome pearl', 'Flexible protective builder base', 'High-shine mirror top coat']
    },
    {
      id: 'bridal_1',
      category: 'Bridal & Occasion',
      title: 'Luxe Pearl & Crystal Sculpture',
      tag: 'Wedding & Celebration',
      desc: 'Graduated real freshwater-look pearls and genuine Swarovski crystal placements clustered along the cuticle and free edge.',
      shape: SHAPES[0],
      length: LENGTHS[2],
      base: BASE_COLORS[1],
      finish: FINISHES[3],
      durationNum: 100,
      imageUrl: '/catalogue/luxe-pearl.jpg',
      highlights: ['Secure crystal encapsulation', 'Soft bridal blush nude base', 'Photograph-perfect elegance']
    },
    {
      id: 'natural_1',
      category: 'Natural Nails',
      title: 'Soft & Simple Natural Sheer Nude',
      tag: 'Everyday Chic',
      desc: 'Clean Russian manicure detailing with sheer strawberry nude gloss. Minimalist, healthy, and pristine natural nails.',
      shape: SHAPES[0],
      length: LENGTHS[1],
      base: BASE_COLORS[1],
      finish: FINISHES[5],
      durationNum: 60,
      imageUrl: '/hero/soft-simple.jpg',
      highlights: ['Sheer strawberry jelly finish', 'Russian cuticle precision', 'Gentle natural strengthening']
    }
  ];

  // Strictly filter to image-based designs only (no schematic vector placeholders)
  const validPropDesigns = Array.isArray(catalogueDesigns)
    ? catalogueDesigns.filter(d => Boolean(d.imageUrl && d.imageUrl.trim()))
    : [];

  const catalogueBooklet = validPropDesigns.length > 0 ? validPropDesigns : defaultImageDesigns;

  // Catalogue Category Options
  const catalogueCategories = [
    'All Designs',
    'Acrylic Nails',
    'BIAB / Builder Gel',
    'Gel-X Extensions',
    'Hand-Painted Art',
    'Bridal & Occasion',
    'Press-On Nails'
  ];

  // Filtered catalogue items
  const filteredCatalogue = catalogueBooklet.filter((item) => {
    const q = (searchQuery || '').toLowerCase();
    const matchesCategory =
      activeCategory === 'All' ||
      activeCategory === 'All Designs' ||
      item.category === activeCategory;
    const matchesSearch =
      (item.title || '').toLowerCase().includes(q) ||
      (item.category || '').toLowerCase().includes(q) ||
      (item.desc || '').toLowerCase().includes(q) ||
      (item.tag || '').toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  // Calculate duration
  const totalDuration =
    bookingMode === 'customSet'
      ? 90
      : bookingMode === 'lookbook' && selectedLook
        ? selectedLook.durationNum
        : 75;

  // Operating Hours (12:00 PM – 7:00 PM): Filter slots so service finishes before closing
  const timeSlots = getAvailableSlotsForDuration(totalDuration);

  // Synchronize slot when duration changes
  useEffect(() => {
    if (timeSlots.length > 0 && !timeSlots.includes(bookingTime)) {
      setBookingTime(timeSlots[0]);
    }
  }, [totalDuration]);

  // Reviews data & classification
  const allReviews = (reviews && reviews.length > 0) ? reviews : DEFAULT_STUDIO_REVIEWS;

  const avgRating = allReviews.length > 0
    ? (allReviews.reduce((sum, r) => sum + (Number(r.rating) || 5), 0) / allReviews.length).toFixed(1)
    : '4.9';

  const getCategoryCount = (category) => {
    if (category === 'All Reviews') return allReviews.length;
    return allReviews.filter((r) => classifyReview(r) === category).length;
  };

  const filteredReviews = reviewFilter === 'All Reviews'
    ? allReviews
    : allReviews.filter((r) => classifyReview(r) === reviewFilter);

  // Smooth scroll helper / standalone page router
  const scrollTo = (id) => {
    if (id === 'catalogue') {
      if (onOpenCatalogue) onOpenCatalogue();
      else window.location.hash = '#catalogue';
      setMobileMenuOpen(false);
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  // Select design from catalogue
  const handleSelectLook = (item) => {
    if (!item) return;
    setBookingMode('lookbook');
    setSelectedLook(item);
    setSelectedAesthetic(item.title || 'Signature Look');
    const shapeName = typeof item.shape === 'object' ? item.shape.name : (item.shape || 'Almond');
    const lengthName = typeof item.length === 'object' ? item.length.name : (item.length || 'Medium');
    setSelectedShape(shapeName);
    setSelectedLength(lengthName);
    setClientNotes(`Catalogue Look: ${item.title || 'Signature Look'} (${item.category || 'Atelier Set'})`);

    scrollTo('booking-section');
    setBookingStep(1);
    if (onAddToast) {
      onAddToast('Design Selected', `"${item.title || 'Design'}" loaded into reservation.`, 'success');
    }
  };

  useEffect(() => {
    if (initialSelectedLook) {
      handleSelectLook(initialSelectedLook);
    }
  }, [initialSelectedLook]);

  // Bring Your Own Inspo (Found online)
  const handleSelectCustomInspo = () => {
    setBookingMode('customInspo');
    setSelectedLook(null);
    setSelectedAesthetic('Custom Internet Inspo (Pinterest / Instagram)');
    setClientNotes('Custom design found online. Image reference provided.');

    scrollTo('booking-section');
    setBookingStep(1);
    if (onAddToast) {
      onAddToast('Custom Inspo Mode', 'Ready to upload or describe your reference photo.', 'info');
    }
  };

  // Hero Look Quick Booking Handler
  const handleBookHeroStyle = (styleId) => {
    const styleObj = heroCards.find((s) => s.id === styleId) || heroCards[1];
    let matchedLook = null;
    if (styleObj.id === 'soft') {
      matchedLook = catalogueBooklet.find((b) => b.id === 'natural_1') || catalogueBooklet[0];
    } else if (styleObj.id === 'sparkle') {
      matchedLook = catalogueBooklet.find((b) => b.id === 'biab_1') || catalogueBooklet[2];
    } else {
      matchedLook = catalogueBooklet.find((b) => b.id === 'acrylic_4') || catalogueBooklet[1];
    }

    setBookingMode('lookbook');
    setSelectedLook(matchedLook);
    setSelectedAesthetic(`${styleObj.label} (${styleObj.title})`);
    const shapeStr = String(styleObj.shape || 'Almond');
    const lengthStr = String(styleObj.length || 'Medium');
    setSelectedShape(shapeStr.charAt(0).toUpperCase() + shapeStr.slice(1));
    setSelectedLength(lengthStr.charAt(0).toUpperCase() + lengthStr.slice(1));
    setClientNotes(`Hero Selection: ${styleObj.label} — ${styleObj.title} (${styleObj.subtitle})`);
    scrollTo('booking-section');
    setBookingStep(1);
    if (onAddToast) {
      onAddToast('Look Selected', `"${styleObj.label}" loaded into booking reservation.`, 'success');
    }
  };

  // Apply custom set from Customizer
  const handleBookCustomSet = () => {
    setBookingMode('customSet');
    setSelectedLook(null);
    setSelectedShape(customShape.name);
    setSelectedLength(customLength.name);
    setSelectedAesthetic(`${customBase.name} with ${customFinish.name}`);
    setClientNotes(`Custom Silhouette: ${customShape.name}, ${customLength.name}, ${customBase.name}, ${customFinish.name}`);

    scrollTo('booking-section');
    setBookingStep(1);
    if (onAddToast) {
      onAddToast('Silhouette Configured', `${customShape.name} (${customLength.name}) ready for reservation.`, 'success');
    }
  };

  // Handle booking form submission (NO price calculation or deposit requirements)
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
      const designTitle =
        bookingMode === 'customInspo'
          ? `Custom Internet Inspo: ${inspoDescription.slice(0, 40) || 'Client Photo Reference'}`
          : bookingMode === 'customSet'
            ? `Custom Silhouette: ${customShape.name} (${customLength.name})`
            : selectedLook?.title || selectedAesthetic;

      const payload = {
        clientName: clientName.trim(),
        clientPhone: clientPhone.trim(),
        clientEmail: clientEmail.trim(),
        clientInstagram: clientInstagram.trim(),
        serviceId: selectedLook?.id || 'srv_catalogue',
        serviceName: designTitle,
        category: selectedLook?.category || 'Custom Request',
        date: bookingDate,
        time: bookingTime,
        duration: totalDuration,
        shape: selectedShape,
        length: selectedLength,
        aesthetic: selectedAesthetic,
        inspoUrl: inspoUrl.trim(),
        notes: `Selected Design: ${designTitle}. Preferred Shape: ${selectedShape}, Length: ${selectedLength}. Inspo Link: ${inspoUrl || 'None'}. Allergies: ${allergies}. Notes: ${clientNotes} ${inspoDescription}`,
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
        onAddToast('Booking Error', err.message || 'Failed to submit reservation. Please try again.', 'error');
      }
    } finally {
      setIsSubmittingBooking(false);
    }
  };

  // Submit client review
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewForm.clientName.trim() || !reviewForm.comment.trim()) {
      if (onAddToast) {
        onAddToast('Incomplete Review', 'Please include your name and review experience.', 'error');
      }
      return;
    }

    setIsSubmittingReview(true);
    try {
      await onSaveReview({
        ...reviewForm,
        date: getKolkataTodayString()
      });
      setShowReviewModal(false);
      setReviewForm({
        clientName: '',
        rating: 5,
        serviceRendered: 'Acrylic Nail Sculpting',
        aestheticTag: 'French Ombré Acrylic',
        comment: ''
      });
      if (typeof confetti === 'function') {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
      if (onAddToast) {
        onAddToast('Thank You!', 'Your review has been verified and added to the atelier showcase.', 'success');
      }
    } catch (err) {
      if (onAddToast) {
        onAddToast('Submission Failed', err.message, 'error');
      }
    } finally {
      setIsSubmittingReview(false);
    }
  };

  // Open Press-On Checkout Modal
  const handleOpenPressOnCheckout = (product) => {
    setSelectedPressOnForOrder(product);
    setCheckoutStep(1);
    setPressOnOrderForm({
      size: 'S',
      customSizes: '',
      wearMethod: 'Adhesive Jelly Tabs (Temporary 3–5 days, 100% reusable)',
      quantity: 1,
      clientName: '',
      clientPhone: '',
      clientEmail: '',
      addressStreet: '',
      addressCity: 'Dehradun',
      addressState: 'Uttarakhand',
      addressPincode: '',
      notes: '',
      paymentRef: ''
    });
    setIsCheckoutModalOpen(true);
  };

  // Submit Press-On Order
  const handlePressOnOrderSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPressOnForOrder) return;
    if (!pressOnOrderForm.clientName.trim() || !pressOnOrderForm.clientPhone.trim() || !pressOnOrderForm.addressStreet.trim()) {
      if (onAddToast) onAddToast('Missing Details', 'Please provide your name, phone number, and delivery street address.', 'error');
      return;
    }

    const cleanDigits = pressOnOrderForm.clientPhone.replace(/[^0-9]/g, '');
    if (cleanDigits.length < 10) {
      if (onAddToast) onAddToast('Invalid Mobile Number', 'Please enter a valid 10-digit phone number for delivery updates.', 'error');
      return;
    }

    setIsPlacingPressOnOrder(true);
    try {
      const total = Number(selectedPressOnForOrder.price || 1299) * Number(pressOnOrderForm.quantity || 1);
      const payload = {
        productId: selectedPressOnForOrder.id,
        productTitle: selectedPressOnForOrder.title,
        shape: selectedPressOnForOrder.shape || 'Almond',
        length: selectedPressOnForOrder.length || 'Medium',
        size: pressOnOrderForm.size,
        customSizes: pressOnOrderForm.size === 'Custom' ? pressOnOrderForm.customSizes : null,
        wearMethod: pressOnOrderForm.wearMethod,
        quantity: Number(pressOnOrderForm.quantity || 1),
        totalAmount: total,
        clientName: pressOnOrderForm.clientName.trim(),
        clientPhone: pressOnOrderForm.clientPhone.trim(),
        clientEmail: pressOnOrderForm.clientEmail.trim(),
        addressStreet: pressOnOrderForm.addressStreet.trim(),
        addressCity: pressOnOrderForm.addressCity.trim(),
        addressState: pressOnOrderForm.addressState.trim(),
        addressPincode: pressOnOrderForm.addressPincode.trim(),
        notes: pressOnOrderForm.notes.trim(),
        paymentRef: pressOnOrderForm.paymentRef.trim(),
        paymentStatus: pressOnOrderForm.paymentRef ? 'Paid (UPI Verified)' : 'Pending UPI'
      };

      let result;
      if (onOrderPressOn) {
        result = await onOrderPressOn(payload);
      } else {
        const res = await fetch('/api/press-on-orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        result = await res.json();
      }

      setConfirmedPressOnOrder(result);
      setCheckoutStep(4);
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // Confetti fallback
      }
    } catch (err) {
      if (onAddToast) onAddToast('Order Error', err.message || 'Could not place order. Please try again.', 'error');
    } finally {
      setIsPlacingPressOnOrder(false);
    }
  };

  const copyUpiId = () => {
    const upi = settings?.upiId || 'nailsbysirii@okaxis';
    navigator.clipboard.writeText(upi);
    setCopiedUpi(true);
    if (onAddToast) onAddToast('UPI ID Copied', `${upi} copied to clipboard.`, 'success');
    setTimeout(() => setCopiedUpi(false), 3000);
  };

  const whatsappPhone = settings?.phone ? settings.phone.replace(/[^0-9]/g, '') : '917302623493';
  const studioFormattedPhone = settings?.phone || '+91 73026 23493';
  const cleanTelPhone = studioFormattedPhone.replace(/[^0-9+]/g, '');

  const whatsappUrl = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
    `Hello Sirii! I am viewing your design catalogue on your website and would like to reserve an appointment at your studio in Garhi Cantt, Dehradun.`
  )}`;

  const getBookingWhatsAppUrl = () => {
    let msg = `Hello Sirii! I would like to book an appointment at Nails by Sirii in Dehradun.`;
    if (selectedLook) {
      msg = `Hello Sirii! I am viewing your website and would love to book an appointment for "${selectedLook.title}" (${selectedLook.category || 'Atelier Set'}).\n\n• Desired Silhouette: ${selectedShape || 'Almond'}\n• Desired Length: ${selectedLength || 'Medium'}\n\nCould you please share your upcoming availability and confirm the slot?`;
    } else if (bookingMode === 'customInspo') {
      msg = `Hello Sirii! I would like to book an appointment with my own nail inspiration reference photo. Could you please check your availability?`;
      if (inspoUrl) {
        msg += `\n\n• Reference Link: ${inspoUrl}`;
      }
      if (inspoDescription) {
        msg += `\n• Design Notes: ${inspoDescription}`;
      }
    } else if (bookingMode === 'customSet') {
      msg = `Hello Sirii! I customized a nail set on your website:\n• Shape: ${selectedShape || customShape.name}\n• Length: ${selectedLength || customLength.name}\n• Base: ${customBase.name}\n• Finish: ${customFinish.name}\n\nCould you please share your available appointment slots?`;
    }
    return `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(msg)}`;
  };

  return (
    <div className="min-h-screen bg-studio-canvas text-studio-ink font-sans selection:bg-studio-wineLight selection:text-studio-wine overflow-x-hidden pb-24 sm:pb-0">
      {/* 1. TOP CLIENT HEADER / NAVIGATION (~60px tall) */}
      <header className="sticky top-0 z-40 bg-studio-canvas/95 backdrop-blur-md border-b border-studio-border h-[60px] px-4 sm:px-6 transition-all pt-[env(safe-area-inset-top)] flex items-center">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-3">
          {/* Logo & Atelier Brand */}
          <a href="#" className="flex items-center gap-2.5 sm:gap-3 group shrink-0 min-w-0" aria-label="Nails by Sirii Home">
            <StudioLogo logoUrl={settings?.studioLogoUrl} size="sm" />
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-sans font-bold text-base sm:text-lg text-studio-ink tracking-tight group-hover:text-studio-wine transition-colors truncate">
                  {settings?.studioName || 'Nails by Sirii'}
                </span>
                <Heart className="w-3 h-3 text-studio-wine fill-studio-wine shrink-0" />
              </div>
              <p className="text-[10px] text-studio-muted font-medium truncate hidden sm:block">
                Nail Studio • Dehradun
              </p>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-studio-secondary">
            <button
              onClick={() => (onOpenCatalogue ? onOpenCatalogue() : (window.location.hash = '#catalogue'))}
              className="hover:text-studio-wine transition-colors text-xs font-semibold text-studio-secondary"
            >
              Nail Ideas
            </button>
            <a href="#customizer" className="hover:text-studio-wine transition-colors">
              Design Your Nails
            </a>
            <a href="#press-ons" className="hover:text-studio-wine transition-colors">
              Press-On Boutique
            </a>
            <a href="#reviews" className="hover:text-studio-wine transition-colors">
              Reviews
            </a>
            <a href="#studio-info" className="hover:text-studio-wine transition-colors">
              Visit Us
            </a>
          </nav>

          {/* Header Action Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Desktop Share Booklet */}
            <button
              onClick={() => setIsShareModalOpen(true)}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-studio-surface border border-studio-border hover:border-studio-borderStrong text-studio-secondary text-xs font-semibold shadow-xs transition-all active:scale-95"
              title="Share Design Booklet"
            >
              <Ribbon className="w-3.5 h-3.5 text-studio-wine" />
              <span>Share Booklet</span>
            </button>

            {/* Book Appointment Primary CTA */}
            <a
              href="#booking-section"
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-studio-wine hover:bg-studio-wineHover text-white text-xs font-bold shadow-studio active:scale-95 transition-all"
            >
              <Heart className="w-3.5 h-3.5 fill-white text-white" />
              <span>Book Appointment</span>
            </a>

            {/* Studio Hub (Owner Passcode Protected - Discreet) */}
            <button
              onClick={onOpenPasscodeModal}
              className="hidden lg:flex w-8 h-8 rounded-xl bg-studio-surface border border-studio-border hover:border-studio-borderStrong text-studio-secondary items-center justify-center transition-all active:scale-95 shadow-xs"
              title="Studio Hub (Owner Access)"
              aria-label="Studio Hub Owner Access"
            >
              <Lock className="w-3.5 h-3.5 text-studio-muted" />
            </button>

            {/* Mobile Clearly Labelled Menu Control */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-studio-surface border border-studio-border text-studio-ink text-xs font-bold shadow-xs hover:border-studio-wine/40 active:scale-95 transition-all lg:hidden"
              aria-label="Open navigation menu"
            >
              <Menu className="w-4 h-4 text-studio-wine" />
              <span>Menu</span>
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE SLIDE-OVER DRAWER */}
      {mobileMenuOpen && (
        <ModalPortal isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)}>
          <div className="fixed inset-0 z-[70] lg:hidden flex justify-end bg-studio-ink/60 backdrop-blur-md animate-in fade-in duration-200">
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
                    <span className="font-sans font-bold text-sm text-studio-ink block">
                      {settings?.studioName || 'Nails by Sirii'}
                    </span>
                    <span className="text-[10px] text-studio-muted">Nail Studio • Dehradun</span>
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
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (onOpenCatalogue) onOpenCatalogue();
                    else window.location.hash = '#catalogue';
                  }}
                  className="w-full flex items-center gap-3 p-3 rounded-2xl bg-studio-wineLight text-studio-wine font-bold text-left text-xs font-sans"
                >
                  <Palette className="w-4 h-4 text-studio-wine" />
                  <span>Nail Ideas & Catalogue</span>
                </button>
                <a
                  href="#customizer"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 p-3 rounded-2xl hover:bg-studio-wineLight hover:text-studio-wine transition-colors"
                >
                  <Wand2 className="w-4 h-4 text-studio-wine" />
                  <span>Design Your Nails</span>
                </a>
                <a
                  href="#press-ons"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 p-3 rounded-2xl hover:bg-studio-wineLight hover:text-studio-wine transition-colors"
                >
                  <Ribbon className="w-4 h-4 text-studio-wine" />
                  <span>Press-On Boutique</span>
                </a>
                <a
                  href="#booking-section"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 p-3 rounded-2xl hover:bg-studio-wineLight hover:text-studio-wine transition-colors"
                >
                  <Calendar className="w-4 h-4 text-studio-wine" />
                  <span>Book Appointment</span>
                </a>
                <a
                  href="#reviews"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 p-3 rounded-2xl hover:bg-studio-wineLight hover:text-studio-wine transition-colors"
                >
                  <Heart className="w-4 h-4 text-rose-500 fill-rose-100" />
                  <span>Reviews ({reviews.length})</span>
                </a>
                <a
                  href="#studio-info"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 p-3 rounded-2xl hover:bg-studio-wineLight hover:text-studio-wine transition-colors"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Visit Us</span>
                </a>
              </nav>

              {/* Secondary Utilities in Drawer */}
              <div className="pt-4 border-t border-studio-border space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-studio-muted block px-1">
                  Utilities
                </span>

                {/* Share Booklet */}
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setIsShareModalOpen(true);
                  }}
                  className="w-full py-2.5 px-3 rounded-xl bg-studio-surface border border-studio-border text-xs font-semibold text-studio-ink flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <Ribbon className="w-3.5 h-3.5 text-studio-wine" />
                    <span>Share Booklet</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-studio-muted" />
                </button>

                {/* Emergency Nail Repair */}
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setIsRepairModalOpen(true);
                  }}
                  className="w-full py-2.5 px-3 rounded-xl bg-red-50 text-red-800 border border-red-200 text-xs font-semibold flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <HeartHandshake className="w-3.5 h-3.5 text-red-600" />
                    <span>Emergency Nail Repair</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-red-400" />
                </button>

                {/* Direct WhatsApp Chat */}
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2.5 px-3 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>WhatsApp Chat</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-emerald-600" />
                </a>

                {/* Discreet Studio Hub Owner Access */}
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenPasscodeModal();
                  }}
                  className="w-full py-2.5 px-3 rounded-xl bg-studio-subtle/80 text-studio-ink text-xs font-semibold flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <Lock className="w-3.5 h-3.5 text-studio-muted" />
                    <span>Studio Hub (Owner)</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-studio-muted" />
                </button>
              </div>
            </div>

            {/* Bottom Studio Info */}
            <div className="pt-6 border-t border-studio-border space-y-1 text-[11px] text-studio-muted">
              <p className="font-semibold text-studio-ink">Nails by Sirii</p>
              <p>Shop No. 7, Laxmi Navraj Plaza, Garhi Cantt, Dehradun</p>
              <p className="text-studio-wine font-semibold">12:00 PM – 7:00 PM • Dedicated 1-on-1</p>
            </div>
          </div>
        </div>
        </ModalPortal>
      )}

      {/* 2. HERO SECTION: "YOUR NEXT NAIL CRUSH" */}
      <section className="relative pt-6 sm:pt-10 lg:pt-14 pb-10 sm:pb-14 px-5 sm:px-6 max-w-6xl mx-auto overflow-hidden">
        {/* MOBILE VIEW (< lg) */}
        <div className="flex flex-col items-center text-center space-y-5 lg:hidden animate-hero-fade-up">
          {/* 1. Small location line */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-studio-wineLight border border-studio-wine/20 text-studio-wine text-xs font-bold uppercase tracking-wider shadow-xs">
            <MapPin className="w-3 h-3 text-studio-wine" />
            <span>Nail studio in Dehradun</span>
          </div>

          {/* 2. Short headline with deliberate line breaks */}
          <h1 className="font-sans font-extrabold text-[42px] sm:text-5xl text-studio-ink leading-[1.08] tracking-tight">
            Your next<br />
            <span className="text-studio-wine">
              nail <span className="font-display italic font-bold">crush.</span>
            </span>
          </h1>

          {/* 3. One supporting sentence */}
          <p className="text-base text-studio-secondary leading-relaxed max-w-sm px-1">
            Simple, sparkly, or something totally you. Let’s find your next look.
          </p>

          {/* 4. Smooth Finger-Slidable & Interactive Hero Card Deck */}
          <InteractiveHeroCardFan
            heroCards={heroCards}
            activeHeroStyle={activeHeroStyle}
            setActiveHeroStyle={setActiveHeroStyle}
            onBookHeroStyle={handleBookHeroStyle}
            onAddToast={onAddToast}
            className="my-1"
          />

          {/* 6. Primary booking button & 7. Secondary nail-ideas link */}
          <div className="w-full pt-2 flex flex-col items-center gap-3">
            <a
              href="#booking-section"
              onClick={() => handleBookHeroStyle(activeHeroStyle)}
              className="w-full max-w-xs py-3.5 px-6 rounded-2xl bg-studio-wine hover:bg-studio-wineHover text-white text-sm font-bold shadow-studio hover:shadow-glow transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <Heart className="w-4 h-4 fill-white text-white" />
              <span>Book Your Nails</span>
            </a>

            <button
              onClick={() => (onOpenCatalogue ? onOpenCatalogue() : (window.location.hash = '#catalogue'))}
              className="text-xs sm:text-sm font-semibold text-studio-secondary hover:text-studio-wine transition-colors inline-flex items-center gap-1 py-1 underline-offset-4 hover:underline"
            >
              <span>See All Nail Ideas</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* DESKTOP TWO-COLUMN VIEW (lg+) */}
        <div className="hidden lg:grid lg:grid-cols-12 lg:items-center lg:gap-12 animate-hero-fade-up">
          {/* Left Column: Copy & Actions */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-studio-wineLight border border-studio-wine/20 text-studio-wine text-xs font-bold uppercase tracking-wider shadow-xs">
              <MapPin className="w-3 h-3 text-studio-wine" />
              <span>Nail studio in Dehradun</span>
            </div>

            <h1 className="font-sans font-extrabold text-5xl xl:text-6xl text-studio-ink leading-[1.08] tracking-tight">
              Your next<br />
              <span className="text-studio-wine">
                nail <span className="font-display italic font-bold">crush.</span>
              </span>
            </h1>

            <p className="text-base text-studio-secondary leading-relaxed max-w-md">
              Simple, sparkly, or something totally you. Let’s find your next look.
            </p>

            <div className="pt-2 flex items-center gap-4">
              <a
                href="#booking-section"
                onClick={() => handleBookHeroStyle(activeHeroStyle)}
                className="py-3.5 px-7 rounded-2xl bg-studio-wine hover:bg-studio-wineHover text-white text-sm font-bold shadow-studio hover:shadow-glow transition-all active:scale-95 inline-flex items-center justify-center gap-2"
              >
                <Heart className="w-4 h-4 fill-white text-white" />
                <span>Book Your Nails</span>
              </a>

              <button
                onClick={() => (onOpenCatalogue ? onOpenCatalogue() : (window.location.hash = '#catalogue'))}
                className="text-sm font-semibold text-studio-secondary hover:text-studio-wine transition-colors inline-flex items-center gap-1.5 py-1 underline-offset-4 hover:underline"
              >
                <span>See All Nail Ideas</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Right Column: Smooth Finger-Slidable & Interactive Hero Card Deck */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center">
            <InteractiveHeroCardFan
              heroCards={heroCards}
              activeHeroStyle={activeHeroStyle}
              setActiveHeroStyle={setActiveHeroStyle}
              onBookHeroStyle={handleBookHeroStyle}
              onAddToast={onAddToast}
            />
          </div>
        </div>
      </section>

      {/* 3. ATELIER DESIGN CATALOGUE SHOWCASE & LOOKBOOK GATEWAY */}
      <section id="catalogue-showcase" className="py-10 sm:py-16 px-4 sm:px-6 max-w-7xl mx-auto border-t border-studio-border">
        <div className="space-y-6 sm:space-y-8">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto space-y-2.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-studio-wineLight text-studio-wine text-[11px] font-semibold">
              <Palette className="w-3.5 h-3.5" />
              <span>Atelier Design Booklet & Catalogue</span>
            </div>
            <h2 className="font-display italic font-bold text-2xl sm:text-4xl text-studio-ink">
              Signature Nail Designs & Lookbook
            </h2>
            <p className="text-xs sm:text-sm text-studio-secondary leading-relaxed font-sans">
              We have created a dedicated design catalogue to make choosing your nails effortless. Browse sculpted acrylics, BIAB builder gels, Gel-X extensions, or bring your own reference photo!
            </p>
          </div>

          {/* Bookmarking / Custom Inspo Callout Banner */}
          <div className="bg-gradient-to-r from-studio-wineLight/90 via-studio-surface to-studio-canvas border border-studio-border rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-studio-surface border border-studio-border text-studio-wine flex items-center justify-center shrink-0 shadow-xs">
                <Wand2 className="w-5 h-5 text-studio-wine" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-studio-wine block">
                  Found an Inspiring Design on Instagram or Pinterest?
                </span>
                <h3 className="font-display font-semibold text-base sm:text-lg text-studio-ink">
                  You are not limited to this booklet — Bring your own reference image!
                </h3>
                <p className="text-xs text-studio-secondary leading-relaxed">
                  Have a specific screenshot from Pinterest, Google, or TikTok? Sirii recreates and customizes any reference photo to fit your natural nail architecture.
                </p>
              </div>
            </div>

            <button
              onClick={handleSelectCustomInspo}
              className="self-start md:self-auto px-5 py-3 rounded-2xl bg-studio-wine hover:bg-studio-wineHover text-white text-xs font-semibold shadow-studio transition-all active:scale-95 flex items-center gap-2 shrink-0 min-h-[44px]"
            >
              <Wand2 className="w-3.5 h-3.5" />
              <span>Book With My Inspo Photo</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Featured Teaser Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
            {catalogueBooklet.slice(0, 3).map((item) => (
              <div
                key={item.id}
                className="bg-studio-surface rounded-3xl p-5 sm:p-6 border border-studio-border hover:border-studio-wine/40 shadow-studio transition-all flex flex-col justify-between group space-y-4"
              >
                <div className="space-y-4">
                  {/* Visual Photography Preview */}
                  <div className="h-48 sm:h-52 rounded-2xl bg-studio-canvas border border-studio-border relative overflow-hidden group-hover:border-studio-wine/30 transition-all">
                    <img
                      src={item.imageUrl || '/hero/soft-simple.jpg'}
                      alt={item.title || 'Signature Design'}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                      decoding="async"
                    />

                    <span className="absolute bottom-2.5 right-2.5 px-2.5 py-0.5 rounded-full bg-studio-surface/90 backdrop-blur-sm border border-studio-border text-[10px] font-semibold text-studio-secondary">
                      {typeof item.shape === 'object' ? item.shape.name : item.shape || 'Almond'} • {typeof item.length === 'object' ? item.length.name : item.length || 'Medium'}
                    </span>

                    <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-studio-surface/90 backdrop-blur-sm border border-studio-border text-[10px] font-bold text-studio-wine">
                      {item.category || 'Signature Art'}
                    </span>
                  </div>

                  {/* Design Header */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-studio-wine block">
                        {item.tag || 'Studio Look'}
                      </span>
                      <span className="text-[10px] text-studio-muted font-medium flex items-center gap-1">
                        <Clock className="w-3 h-3 text-studio-wine" />
                        ~{item.durationNum} mins
                      </span>
                    </div>

                    <h3 className="font-display italic font-bold text-lg text-studio-ink group-hover:text-studio-wine transition-colors">
                      {item.title}
                    </h3>

                    <p className="text-xs text-studio-secondary leading-relaxed font-sans pt-1">
                      {item.desc || item.description || ''}
                    </p>
                  </div>

                  {/* Highlights Checklist */}
                  {Array.isArray(item.highlights) && item.highlights.length > 0 && (
                    <div className="pt-2 border-t border-studio-border/60 space-y-1.5 text-[11px] text-studio-secondary font-medium">
                      {item.highlights.slice(0, 2).map((h, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <Check className="w-3 h-3 text-studio-wine shrink-0" />
                          <span>{h}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Card Action: Book This Look */}
                <div className="pt-4 border-t border-studio-border flex items-center justify-between gap-3">
                  <div className="text-[11px] text-studio-wine font-medium">
                    Connect for Pricing
                  </div>

                  <button
                    onClick={() => handleSelectLook(item)}
                    className="px-4 py-2 rounded-xl bg-studio-wine hover:bg-studio-wineHover text-white text-xs font-semibold shadow-studio transition-all flex items-center gap-1.5 active:scale-95"
                  >
                    <Heart className="w-3 h-3 fill-white text-white" />
                    <span>Select Look</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Open Full Dedicated Catalogue Page Button */}
          <div className="text-center pt-2">
            <button
              onClick={() => (onOpenCatalogue ? onOpenCatalogue() : (window.location.hash = '#catalogue'))}
              className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-2xl bg-studio-wine hover:bg-studio-wineHover text-white text-sm font-bold shadow-studio hover:shadow-glow transition-all active:scale-95"
            >
              <BookOpen className="w-4 h-4" />
              <span>Explore All Signature Looks in Design Catalogue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 4. PRE-MADE LUXURY PRESS-ON NAILS BOUTIQUE (E-COMMERCE) */}
      <section id="press-ons" className="py-12 sm:py-20 px-4 sm:px-6 max-w-7xl mx-auto border-t border-studio-border">
        <div className="space-y-8 sm:space-y-10">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-studio-wineLight text-studio-wine text-xs font-semibold">
              <Ribbon className="w-3.5 h-3.5" />
              <span>Atelier Ready-to-Wear Collection • Pan-India Delivery</span>
            </div>
            <h2 className="font-display italic font-bold text-3xl sm:text-5xl text-studio-ink tracking-tight">
              Luxury Handcrafted Press-On Nails
            </h2>
            <p className="text-xs sm:text-sm text-studio-secondary max-w-2xl mx-auto leading-relaxed font-sans">
              Handcrafted salon-quality reusable gel nails custom-fitted to your natural nail beds. Reusable 5+ times with zero natural nail damage. Every set includes your complimentary luxury prep & application kit.
            </p>
          </div>

          {/* Boutique Value Proposition Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-studio-surface p-4 rounded-3xl border border-studio-border shadow-xs text-center space-y-1.5">
              <div className="w-9 h-9 rounded-2xl bg-studio-wineLight text-studio-wine flex items-center justify-center mx-auto">
                <Crown className="w-4 h-4" />
              </div>
              <h4 className="font-semibold text-xs text-studio-ink">Reusable 5+ Times</h4>
              <p className="text-[10px] text-studio-secondary leading-normal">
                Multi-layer salon builder gel apex for salon durability.
              </p>
            </div>

            <div className="bg-studio-surface p-4 rounded-3xl border border-studio-border shadow-xs text-center space-y-1.5">
              <div className="w-9 h-9 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center justify-center mx-auto">
                <Feather className="w-4 h-4" />
              </div>
              <h4 className="font-semibold text-xs text-studio-ink">Zero Nail Damage</h4>
              <p className="text-[10px] text-studio-secondary leading-normal">
                Peel-off jelly tabs preserve and protect natural nail health.
              </p>
            </div>

            <div className="bg-studio-surface p-4 rounded-3xl border border-studio-border shadow-xs text-center space-y-1.5">
              <div className="w-9 h-9 rounded-2xl bg-purple-50 text-purple-800 border border-purple-200 flex items-center justify-center mx-auto">
                <PackageCheck className="w-4 h-4" />
              </div>
              <h4 className="font-semibold text-xs text-studio-ink">Full Prep Kit Included</h4>
              <p className="text-[10px] text-studio-secondary leading-normal">
                Glue, 24 jelly tabs, cuticle pusher, buffer & alcohol pads.
              </p>
            </div>

            <div className="bg-studio-surface p-4 rounded-3xl border border-studio-border shadow-xs text-center space-y-1.5">
              <div className="w-9 h-9 rounded-2xl bg-blue-50 text-blue-800 border border-blue-200 flex items-center justify-center mx-auto">
                <Truck className="w-4 h-4" />
              </div>
              <h4 className="font-semibold text-xs text-studio-ink">Pan-India Express</h4>
              <p className="text-[10px] text-studio-secondary leading-normal">
                Carefully packaged in Dehradun and shipped in 24–48 hours.
              </p>
            </div>
          </div>

          {/* Sizing Assistant Banner */}
          <div className="bg-gradient-to-r from-studio-wineLight/80 via-studio-surface to-studio-canvas border border-studio-border rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-studio-surface border border-studio-border text-studio-wine flex items-center justify-center shrink-0 shadow-xs">
                <Ruler className="w-5 h-5 text-studio-wine" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-studio-wine block">
                  Find Your Perfect Atelier Fit
                </span>
                <h3 className="font-display font-semibold text-base sm:text-lg text-studio-ink">
                  Not sure about your nail size? Use our quick 1-minute sizing guide.
                </h3>
                <p className="text-xs text-studio-secondary leading-relaxed">
                  Learn how to measure your natural nail bed with tape and a ruler, or order a custom set tailored to your exact mm numbers.
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsSizingModalOpen(true)}
              className="self-start md:self-auto px-5 py-3 rounded-2xl bg-studio-surface hover:bg-studio-subtle text-studio-ink border border-studio-border font-semibold text-xs shadow-xs transition-all flex items-center gap-2 shrink-0 active:scale-95 min-h-[44px]"
            >
              <Ruler className="w-3.5 h-3.5 text-studio-wine" />
              <span>Open Nail Sizing Guide</span>
            </button>
          </div>

          {/* Press-On Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activePressOnProducts.map((product) => (
              <div
                key={product.id}
                className="bg-studio-surface rounded-3xl p-5 sm:p-6 border border-studio-border hover:border-studio-wine/40 shadow-studio transition-all flex flex-col justify-between group space-y-4"
              >
                <div className="space-y-4">
                  {/* Visual Schematic Preview */}
                  <div className="h-48 rounded-2xl bg-studio-canvas/70 border border-studio-border flex flex-col items-center justify-center relative overflow-hidden group-hover:border-studio-wine/30 transition-all p-3">
                    <NailTipSchematic
                      shape={product.shape || 'Almond'}
                      length={product.length || 'Medium'}
                      baseColor={product.baseColor || '#FDF2F8'}
                      finish={product.finish || 'Hailey Glazed Chrome'}
                      className="scale-105 transition-transform group-hover:scale-110 duration-300"
                    />

                    {/* Tag badge */}
                    <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-studio-surface/90 backdrop-blur-sm border border-studio-border text-[10px] font-bold text-studio-wine shadow-xs">
                      {product.tag || 'Handcrafted'}
                    </span>

                    {/* Silhouette info */}
                    <span className="absolute bottom-3 right-3 px-2.5 py-0.5 rounded-full bg-studio-surface/90 backdrop-blur-sm border border-studio-border text-[10px] font-semibold text-studio-secondary">
                      {product.shape} • {product.length}
                    </span>
                  </div>

                  {/* Product Details */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-studio-wine block">
                      {product.collection || 'Signature Boutique'}
                    </span>
                    <h3 className="font-display italic font-bold text-lg text-studio-ink group-hover:text-studio-wine transition-colors">
                      {product.title}
                    </h3>
                    <p className="text-xs text-studio-secondary leading-relaxed font-sans pt-0.5">
                      {product.description}
                    </p>
                  </div>

                  {/* Included Kit Summary */}
                  <div className="pt-2 border-t border-studio-border/60 text-[11px] text-studio-secondary space-y-1">
                    <span className="text-[10px] font-semibold text-studio-ink block">Included in Box:</span>
                    <p className="text-[10px] text-studio-muted leading-relaxed">
                      {product.includedKit || '10 Handcrafted Nails, Salon Liquid Glue, 24 Jelly Sticky Tabs, Cuticle Pusher, Mini Buffer & 2 Prep Wipes'}
                    </p>
                  </div>
                </div>

                {/* Price, Stock & Order CTA */}
                <div className="pt-4 border-t border-studio-border flex items-center justify-between gap-3">
                  <div>
                    <div className="font-display italic font-bold text-xl text-studio-ink">
                      ₹{product.price}
                    </div>
                    <span className="text-[10px] text-emerald-700 font-semibold block">
                      Free Pan-India Delivery
                    </span>
                  </div>

                  <button
                    onClick={() => handleOpenPressOnCheckout(product)}
                    className="px-5 py-2.5 rounded-2xl bg-studio-wine hover:bg-studio-wineHover text-white text-xs font-semibold shadow-studio transition-all active:scale-95 flex items-center gap-1.5 min-h-[42px]"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Order Set</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. DIRECT APPOINTMENT BOOKING: WHATSAPP & PHONE CALL */}
      <section id="booking-section" className="py-12 sm:py-16 px-4 sm:px-6 max-w-4xl mx-auto border-t border-studio-border">
        <div className="bg-studio-surface rounded-3xl border border-studio-border p-6 sm:p-10 shadow-studio space-y-8">
          {/* Header */}
          <div className="text-center space-y-2.5 max-w-xl mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-studio-wineLight text-studio-wine text-[11px] font-semibold">
              <Calendar className="w-3.5 h-3.5" />
              <span>Dedicated Studio Consultation</span>
            </div>
            <h2 className="font-display italic font-bold text-2xl sm:text-4xl text-studio-ink">
              Reserve Your Appointment
            </h2>
            <p className="text-xs sm:text-sm text-studio-secondary leading-relaxed font-sans">
              To ensure dedicated focus and customized artistry for every client, all appointments are scheduled directly with Sirii. Reach out on WhatsApp or call to discuss your look, share reference photos, and lock in your slot.
            </p>
          </div>

          {/* Context Banner if client pre-selected a look or custom inspo */}
          {selectedLook && (
            <div className="p-4 sm:p-5 rounded-2xl bg-studio-wineLight/60 border border-studio-wine/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-studio-surface border border-studio-wine/20 flex items-center justify-center shrink-0 text-studio-wine shadow-xs">
                  <Palette className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-studio-wine block">
                    Your Inquired Design
                  </span>
                  <strong className="text-studio-ink text-sm font-display font-semibold">
                    {selectedLook.title}
                  </strong>
                  <p className="text-[11px] text-studio-secondary">
                    {selectedShape || 'Almond'} • {selectedLength || 'Medium'} • {selectedLook.category || 'Atelier Set'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedLook(null);
                  if (onOpenCatalogue) onOpenCatalogue();
                  else window.location.hash = '#catalogue';
                }}
                className="text-xs text-studio-wine hover:underline font-semibold shrink-0 self-start sm:self-auto"
              >
                Change Look
              </button>
            </div>
          )}

          {bookingMode === 'customInspo' && !selectedLook && (
            <div className="p-4 sm:p-5 rounded-2xl bg-studio-wineLight/60 border border-studio-wine/30 flex items-start gap-3 text-xs">
              <div className="w-9 h-9 rounded-xl bg-studio-surface border border-studio-wine/20 flex items-center justify-center shrink-0 text-studio-wine shadow-xs">
                <Wand2 className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-studio-wine block">
                  Reference Image Booking
                </span>
                <strong className="text-studio-ink text-sm font-display font-semibold">
                  Bring Your Own Inspo Photo
                </strong>
                <p className="text-[11px] text-studio-secondary">
                  Send your screenshot or Pinterest/Instagram link directly over WhatsApp for an exact quote and slot reservation.
                </p>
              </div>
            </div>
          )}

          {/* Primary Direct Contact Channels Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {/* WhatsApp Booking Card */}
            <a
              href={getBookingWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="group p-6 rounded-3xl bg-gradient-to-br from-emerald-500/10 via-studio-surface to-studio-canvas border border-emerald-500/30 hover:border-emerald-600 shadow-studio transition-all flex flex-col justify-between space-y-5 hover:-translate-y-0.5"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      Recommended
                    </span>
                    <span className="text-[11px] text-studio-muted font-medium">Fast Response</span>
                  </div>
                  <h3 className="font-display font-bold text-xl sm:text-2xl text-studio-ink mt-1.5 group-hover:text-emerald-700 transition-colors">
                    Book on WhatsApp
                  </h3>
                  <p className="text-xs text-studio-secondary leading-relaxed font-sans mt-1">
                    Send your inspo photos, check available slots, and discuss nail prep directly with Sirii on WhatsApp.
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <div className="w-full py-3.5 px-5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold shadow-studio transition-all flex items-center justify-center gap-2 group-hover:shadow-glow">
                  <MessageCircle className="w-4 h-4" />
                  <span>Chat on WhatsApp</span>
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </a>

            {/* Direct Call Card */}
            <a
              href={`tel:${cleanTelPhone}`}
              className="group p-6 rounded-3xl bg-gradient-to-br from-studio-wineLight/70 via-studio-surface to-studio-canvas border border-studio-wine/30 hover:border-studio-wine shadow-studio transition-all flex flex-col justify-between space-y-5 hover:-translate-y-0.5"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-studio-wine text-white flex items-center justify-center shadow-xs">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-studio-wine bg-studio-wineLight px-2 py-0.5 rounded-full">
                      Instant Confirmation
                    </span>
                    <span className="text-[11px] text-studio-muted font-medium">12 PM – 7 PM</span>
                  </div>
                  <h3 className="font-display font-bold text-xl sm:text-2xl text-studio-ink mt-1.5 group-hover:text-studio-wine transition-colors">
                    Call Studio Directly
                  </h3>
                  <p className="text-xs text-studio-secondary leading-relaxed font-sans mt-1">
                    Speak directly with Sirii for immediate inquiries, same-week slots, or studio directions in Garhi Cantt.
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <div className="w-full py-3.5 px-5 rounded-2xl bg-studio-wine hover:bg-studio-wineHover text-white text-xs sm:text-sm font-bold shadow-studio transition-all flex items-center justify-center gap-2 group-hover:shadow-glow">
                  <Phone className="w-4 h-4" />
                  <span>Call {studioFormattedPhone}</span>
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </a>
          </div>

          {/* Helpful Atelier Booking Guidelines */}
          <div className="pt-4 border-t border-studio-border grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-studio-canvas border border-studio-border">
              <Clock className="w-4 h-4 text-studio-wine shrink-0 mt-0.5" />
              <div>
                <strong className="text-studio-ink font-semibold block">Studio Hours</strong>
                <span className="text-[11px] text-studio-secondary">Tue – Sun: 12:00 PM – 7:00 PM<br />(Monday Closed)</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-studio-canvas border border-studio-border">
              <MapPin className="w-4 h-4 text-studio-wine shrink-0 mt-0.5" />
              <div>
                <strong className="text-studio-ink font-semibold block">Studio Location</strong>
                <span className="text-[11px] text-studio-secondary">Laxmi Navraj Plaza, Garhi Cantt, Dehradun</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-studio-canvas border border-studio-border">
              <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <strong className="text-studio-ink font-semibold block">Sterilization Buffers</strong>
                <span className="text-[11px] text-studio-secondary">Dedicated clinical sanitation buffer between each client.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CLIENT REVIEWS SECTION */}
      <section id="reviews" className="py-12 sm:py-20 px-4 sm:px-6 max-w-7xl mx-auto border-t border-studio-border">
        <div className="space-y-8 sm:space-y-10">
          {/* Section Header */}
          <div className="space-y-2">
            <span className="text-[10px] uppercase font-bold tracking-widest text-studio-wine px-3 py-1 rounded-full bg-studio-wineLight/60 border border-studio-wine/10 inline-flex items-center gap-1.5">
              <Heart className="w-3 h-3 text-studio-wine fill-studio-wine/20" />
              Verified Client Love & Accolades
            </span>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h2 className="font-display italic font-bold text-3xl sm:text-4xl md:text-5xl text-studio-ink leading-tight">
                  Loved by 340+ Clients in Dehradun
                </h2>
                <p className="text-xs sm:text-sm text-studio-secondary max-w-2xl font-sans leading-relaxed mt-1">
                  From Pinterest inspiration matches to clinical Russian cuticle care and masterclass training, explore verified experiences from our atelier community.
                </p>
              </div>

              <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
                <button
                  onClick={() => setShowReviewModal(true)}
                  className="px-4 py-2.5 rounded-2xl bg-studio-wine hover:bg-studio-wine/90 text-white text-xs font-semibold shadow-studio transition-all flex items-center gap-1.5 min-h-[42px]"
                >
                  <Star className="w-3.5 h-3.5 fill-white" />
                  <span>Share Your Review</span>
                </button>
              </div>
            </div>
          </div>

          {/* GOOGLE TRUST SCORECARD & REPUTATION BANNER */}
          <div className="bg-gradient-to-br from-studio-surface via-studio-surface to-studio-wineLight/25 rounded-3xl p-6 sm:p-8 border border-studio-border shadow-studio space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-studio-border/70">
              {/* Left: Google rating & Verified badge */}
              <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white border border-studio-border/80 shadow-xs flex flex-col items-center justify-center p-2 shrink-0">
                  <svg className="w-6 h-6 sm:w-7 sm:h-7" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span className="text-[9px] font-bold text-studio-secondary mt-1">Google</span>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                    <span className="font-display font-bold text-3xl sm:text-4xl text-studio-ink tracking-tight">{avgRating}</span>
                    <div className="space-y-0.5">
                      <div className="flex items-center text-amber-500">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-500" />
                        ))}
                      </div>
                      <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 inline-flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" /> 100% 5-Star Satisfaction
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-studio-secondary">
                    Based on <strong className="text-studio-ink font-semibold">344+ verified reviews</strong> • Garhi Cantt, Dehradun
                  </p>
                </div>
              </div>

              {/* Right: Map direct link */}
              <div className="flex items-center gap-2.5 sm:gap-3">
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Nails+by+Sirii+Garhi+Cantt+Dehradun"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-2xl bg-studio-surface hover:bg-studio-subtle text-studio-ink border border-studio-border text-xs font-semibold transition-all flex items-center gap-2 min-h-[42px] shadow-xs"
                >
                  <span>Read on Google Maps</span>
                  <ExternalLink className="w-3.5 h-3.5 text-studio-muted" />
                </a>
              </div>
            </div>

            {/* Trust Pillars Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 pt-1">
              <div className="p-3.5 rounded-2xl bg-studio-canvas/80 border border-studio-border/70 space-y-1">
                <div className="flex items-center gap-1.5 text-studio-wine font-semibold text-xs">
                  <Wand2 className="w-3.5 h-3.5" />
                  <span>Exact Inspo Match</span>
                </div>
                <p className="text-[11px] text-studio-secondary leading-snug">
                  Pinterest and IG reference photos replicated down to exact lines.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-studio-canvas/80 border border-studio-border/70 space-y-1">
                <div className="flex items-center gap-1.5 text-emerald-800 font-semibold text-xs">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Class-B Autoclave</span>
                </div>
                <p className="text-[11px] text-studio-secondary leading-snug">
                  Hospital sterile implements opened fresh before each treatment.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-studio-canvas/80 border border-studio-border/70 space-y-1">
                <div className="flex items-center gap-1.5 text-amber-700 font-semibold text-xs">
                  <Gem className="w-3.5 h-3.5" />
                  <span>4+ Week Retention</span>
                </div>
                <p className="text-[11px] text-studio-secondary leading-snug">
                  Russian e-file cuticle prep for zero lifting or chipping.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-studio-canvas/80 border border-studio-border/70 space-y-1">
                <div className="flex items-center gap-1.5 text-rose-700 font-semibold text-xs">
                  <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-100" />
                  <span>Sweet Hospitality</span>
                </div>
                <p className="text-[11px] text-studio-secondary leading-snug">
                  Beloved couple-run studio with custom design guidance.
                </p>
              </div>
            </div>
          </div>

          {/* EDITORIAL SPOTLIGHT: CLIENT STORY OF THE MONTH */}
          <div className="relative overflow-hidden rounded-3xl bg-studio-surface border border-studio-wine/25 p-6 sm:p-8 shadow-studio">
            <div className="absolute -right-8 -bottom-8 w-44 h-44 bg-studio-wineLight/30 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
              <div className="space-y-3 max-w-2xl">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-3 py-1 rounded-full bg-studio-wine text-white text-[10px] font-bold tracking-wider uppercase inline-flex items-center gap-1 shadow-xs">
                    <Crown className="w-3 h-3 text-amber-300" /> Client Spotlight of the Month
                  </span>
                  <span className="text-[11px] text-studio-muted font-medium">Exact Reference Photo Match</span>
                </div>

                <div className="relative">
                  <Quote className="w-8 h-8 text-studio-wine/20 absolute -top-3 -left-3 pointer-events-none" />
                  <p className="font-display italic text-base sm:text-lg md:text-xl text-studio-ink leading-relaxed pl-5">
                    "It was my first time getting my nails done at Nails by Sirii and I can't get over how gorgeous these nails turned out! I showed them the inspiration pictures and they executed it perfectly. The artistry and precision in the hand painted flowers are truly impressive. Thank you so much, I love them!"
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-800 border border-rose-200 flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                    DS
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-semibold text-xs sm:text-sm text-studio-ink">Da Suttiwanna</span>
                      <span className="text-[10px] bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded border border-emerald-200 inline-flex items-center gap-0.5 font-medium">
                        <Check className="w-2.5 h-2.5 text-emerald-600" /> Verified Google Review
                      </span>
                    </div>
                    <span className="text-[11px] text-studio-muted block">Hand-Painted Floral Nail Art • Dehradun</span>
                  </div>
                </div>
              </div>

              {/* Right quick badge */}
              <div className="shrink-0 bg-white/90 backdrop-blur-xs rounded-2xl p-5 border border-studio-border space-y-2 w-full md:w-56 text-center shadow-xs">
                <div className="flex justify-center text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-xs font-bold text-studio-ink">100% Inspo Recreation</p>
                <p className="text-[10px] text-studio-secondary leading-tight">
                  Complex multi-finger Pinterest nail art executed without compromise.
                </p>
              </div>
            </div>
          </div>

          {/* CATEGORY FILTER TABS */}
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none w-full sm:w-auto">
                {REVIEW_CATEGORIES.map((cat) => {
                  const count = getCategoryCount(cat);
                  const isActive = reviewFilter === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => setReviewFilter(cat)}
                      className={`px-3.5 py-2 rounded-2xl text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 min-h-[38px] ${isActive
                        ? 'bg-studio-wine text-white font-semibold shadow-studio'
                        : 'bg-studio-surface hover:bg-studio-wineLight text-studio-secondary border border-studio-border'
                        }`}
                    >
                      {cat === 'All Reviews' && <Stars className="w-3.5 h-3.5" />}
                      {cat === 'Exact Inspo Match' && <Wand2 className="w-3.5 h-3.5" />}
                      {cat === 'Extensions & BIAB' && <Gem className="w-3.5 h-3.5" />}
                      {cat === 'Hand-Painted Art' && <Paintbrush className="w-3.5 h-3.5" />}
                      {cat === 'Hygiene & Hospitality' && <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-100" />}
                      {cat === 'Nail Tech Academy' && <GraduationCap className="w-3.5 h-3.5" />}
                      <span>{cat}</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-full ${isActive ? 'bg-white/20 text-white' : 'bg-studio-canvas text-studio-muted'
                          }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              <span className="text-xs text-studio-muted hidden sm:inline">
                Showing <strong className="text-studio-ink">{filteredReviews.length}</strong> client experiences
              </span>
            </div>

            {/* REVIEWS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filteredReviews.map((r) => {
                const isLiked = likedReviews.has(r.id);
                const likeCount = reviewLikes[r.id] || (r.likes || 12);
                const initials = getInitials(r.clientName);
                const avatarColor = getAvatarColor(r.clientName);

                return (
                  <div
                    key={r.id}
                    className="bg-studio-surface rounded-3xl p-5 sm:p-6 border border-studio-border shadow-studio hover:shadow-studio-float transition-all flex flex-col justify-between space-y-4 group"
                  >
                    <div className="space-y-3">
                      {/* Header: Avatar, Name, Verified Badge, Rating */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-full border flex items-center justify-center font-bold text-xs shrink-0 ${avatarColor}`}
                          >
                            {initials}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <h4 className="font-semibold text-xs sm:text-sm text-studio-ink">
                                {r.clientName}
                              </h4>
                              <span className="w-3.5 h-3.5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center" title="Verified Client">
                                <Check className="w-2.5 h-2.5" />
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5 text-[10px] text-studio-muted">
                              <span>{r.source || 'Google Review'}</span>
                              <span>•</span>
                              <span>{r.date || 'Recent'}</span>
                            </div>
                          </div>
                        </div>

                        {/* Stars */}
                        <div className="flex items-center text-amber-400 shrink-0">
                          {[...Array(Number(r.rating) || 5)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                      </div>

                      {/* Service & Aesthetic Tags */}
                      <div className="flex flex-wrap gap-1.5 pt-0.5">
                        {r.serviceRendered && (
                          <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-studio-canvas text-studio-ink font-medium border border-studio-border">
                            {r.serviceRendered}
                          </span>
                        )}
                        {r.aestheticTag && (
                          <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-studio-wineLight/70 text-studio-wine font-semibold border border-studio-wine/15">
                            {r.aestheticTag}
                          </span>
                        )}
                      </div>

                      {/* Comment */}
                      <p className="text-xs text-studio-secondary italic leading-relaxed pt-1 font-sans">
                        "{r.comment}"
                      </p>
                    </div>

                    {/* Footer: Interactive Like / Love button & verified mark */}
                    <div className="pt-3 border-t border-studio-border/60 flex items-center justify-between text-[11px]">
                      <span className="text-studio-muted text-[10px] flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Verified Visit
                      </span>

                      <button
                        onClick={() => handleToggleLikeReview(r.id)}
                        className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 min-h-[30px] ${isLiked
                          ? 'bg-rose-50 text-rose-600 border border-rose-200 shadow-xs'
                          : 'bg-studio-canvas hover:bg-rose-50/50 text-studio-muted hover:text-rose-600 border border-studio-border'
                          }`}
                        title="Mark as helpful / appreciative"
                      >
                        <Heart
                          className={`w-3.5 h-3.5 transition-transform ${isLiked ? 'fill-rose-500 text-rose-500 scale-110' : 'text-current'
                            }`}
                        />
                        <span className="font-semibold text-[11px]">{likeCount}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredReviews.length === 0 && (
              <div className="text-center py-12 bg-studio-surface rounded-3xl border border-studio-border p-6 space-y-3">
                <p className="text-xs text-studio-secondary">No reviews under this category yet.</p>
                <button
                  onClick={() => setReviewFilter('All Reviews')}
                  className="px-4 py-2 rounded-2xl bg-studio-wine text-white text-xs font-semibold"
                >
                  View All Reviews
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 7. STUDIO HYGIENE & LOCATION */}
      <section id="studio-info" className="py-12 sm:py-16 px-4 sm:px-6 max-w-7xl mx-auto border-t border-studio-border">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <span className="text-[10px] uppercase font-bold tracking-widest text-studio-wine block">
              Medical-Grade Standards
            </span>
            <h2 className="font-display italic font-bold text-2xl sm:text-4xl text-studio-ink">
              Clinical Hygiene in a Contemporary Atelier
            </h2>
            <p className="text-xs sm:text-sm text-studio-secondary leading-relaxed font-sans">
              At Nails by Sirii, client safety is non-negotiable. Every metal implement undergoes a multi-stage ultrasonic cleanse and medical-grade autoclave sterilization. All files, buffers, and orange sticks are single-use or sanitized according to State Board and OSHA protocols.
            </p>
            <div className="space-y-2.5 pt-2 text-xs text-studio-secondary">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Autoclave pouch opened fresh in front of every client</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Feather className="w-4 h-4 text-teal-700 shrink-0" />
                <span>HEPA source air capture for clean, dust-free breathing</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Heart className="w-4 h-4 text-rose-600 fill-rose-100 shrink-0" />
                <span>Health-first natural nail preservation without drilling through the plate</span>
              </div>
            </div>
          </div>

          <div className="bg-studio-surface rounded-3xl p-6 sm:p-8 border border-studio-border shadow-studio space-y-4 text-xs font-sans">
            <h3 className="font-display italic font-bold text-lg text-studio-ink">
              Visit Nails by Sirii
            </h3>
            <div className="space-y-2.5 text-studio-secondary">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-studio-wine shrink-0 mt-0.5" />
                <span>Shop No. 7, Laxmi Navraj Plaza, Garhi Cantonment, Garhi Cantt, Dehradun, Uttarakhand 248003</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-studio-wine shrink-0" />
                <span>Tuesday – Sunday • 12:00 PM – 7:00 PM (By Appointment)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-studio-wine shrink-0" />
                <span>+91 73026 23493 (WhatsApp / Direct)</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setIsRepairModalOpen(true)}
                className="w-full py-2.5 rounded-2xl bg-red-50 hover:bg-red-100/80 text-red-800 border border-red-200 font-semibold text-xs transition-all flex items-center justify-center gap-2 min-h-[44px]"
              >
                <HeartHandshake className="w-4 h-4 text-red-600" />
                <span>Have a Chipped Nail? Request Emergency Squeeze-in</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 8. FOOTER */}
      <footer className="py-8 px-4 sm:px-6 border-t border-studio-border bg-studio-canvas text-center space-y-3">
        <StudioLogo logoUrl={settings?.studioLogoUrl} size="sm" showText className="justify-center" />
        <p className="text-[11px] text-studio-muted">
          Nails by Sirii • Garhi Cantt, Dehradun • All sessions by prior reservation.
        </p>
      </footer>

      {/* EMERGENCY REPAIR & SHARE MODALS (Lazy-Loaded) */}
      <React.Suspense fallback={null}>
        <EmergencyRepairModal
          isOpen={isRepairModalOpen}
          onClose={() => setIsRepairModalOpen(false)}
          onSubmitRepair={onSubmitRepair}
          onAddToast={onAddToast}
        />

        <ShareCatalogueModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          settings={settings}
        />
      </React.Suspense>

      {/* CLIENT REVIEW MODAL */}
      {showReviewModal && (
        <ModalPortal isOpen={showReviewModal} onClose={() => setShowReviewModal(false)}>
          {/* Dedicated full-bleed non-scrolling backdrop */}
          <div
            className="fixed inset-0 z-[70] bg-studio-ink/60 backdrop-blur-md transition-opacity"
            onClick={() => setShowReviewModal(false)}
            aria-hidden="true"
          />
          {/* Scrollable floating dialog container */}
          <div className="fixed inset-0 z-[71] overflow-y-auto p-4 flex items-center justify-center pointer-events-none animate-fade-in">
            <div className="bg-studio-surface rounded-3xl max-w-lg w-full p-6 sm:p-7 border border-studio-border shadow-studio-float space-y-5 my-6 max-h-[92vh] overflow-y-auto pointer-events-auto">
            <div className="flex items-center justify-between pb-3.5 border-b border-studio-border">
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold text-studio-wine uppercase tracking-widest block">
                  Atelier Community
                </span>
                <h3 className="font-display italic font-bold text-xl text-studio-ink">
                  Share Your Experience
                </h3>
              </div>
              <button
                onClick={() => setShowReviewModal(false)}
                className="w-8 h-8 rounded-full bg-studio-subtle flex items-center justify-center text-studio-secondary hover:text-studio-ink transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleReviewSubmit} className="space-y-4 text-xs font-sans">
              {/* Rating Selector */}
              <div className="p-3.5 rounded-2xl bg-studio-canvas border border-studio-border space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-studio-ink">Overall Rating *</label>
                  <span className="text-[11px] font-bold text-amber-600">
                    {reviewForm.rating === 5 && '5.0 / 5.0 — Exceptional Artistry & Retention'}
                    {reviewForm.rating === 4 && '4.0 / 5.0 — Very Good Service & Beautiful Nails'}
                    {reviewForm.rating === 3 && '3.0 / 5.0 — Good & Satisfactory'}
                    {reviewForm.rating === 2 && '2.0 / 5.0 — Needs Attention'}
                    {reviewForm.rating === 1 && '1.0 / 5.0 — Disappointing'}
                  </span>
                </div>
                <div className="flex items-center gap-2 pt-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                      className="p-1 text-amber-400 hover:scale-125 transition-transform"
                    >
                      <Star
                        className={`w-6 h-6 transition-colors ${star <= reviewForm.rating
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-studio-border hover:text-amber-300'
                          }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Client Name */}
              <div>
                <label className="block font-semibold text-studio-ink mb-1">Your Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Ananya Sharma"
                  value={reviewForm.clientName}
                  onChange={(e) => setReviewForm({ ...reviewForm, clientName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-studio-border bg-studio-canvas text-base sm:text-xs text-studio-ink outline-none focus:border-studio-wine"
                />
              </div>

              {/* Treatment Rendered with Quick Suggestion Chips */}
              <div className="space-y-1.5">
                <label className="block font-semibold text-studio-ink">Service / Treatment Rendered</label>
                <input
                  type="text"
                  placeholder="e.g., Acrylic Nail Extension with French Chrome"
                  value={reviewForm.serviceRendered}
                  onChange={(e) => setReviewForm({ ...reviewForm, serviceRendered: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-studio-border bg-studio-canvas text-base sm:text-xs text-studio-ink outline-none focus:border-studio-wine"
                />
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {[
                    'Acrylic Extensions',
                    'Gel-X Soft Gel',
                    'BIAB Natural Overlay',
                    'Press-On Nails',
                    'Hand-Painted Nail Art',
                    '1:1 Certified Course'
                  ].map((service) => (
                    <button
                      type="button"
                      key={service}
                      onClick={() => setReviewForm({ ...reviewForm, serviceRendered: service })}
                      className={`text-[10px] px-2.5 py-1 rounded-full border transition-all ${reviewForm.serviceRendered === service
                        ? 'bg-studio-wine text-white border-studio-wine font-semibold'
                        : 'bg-studio-canvas hover:bg-studio-surface text-studio-secondary border-studio-border'
                        }`}
                    >
                      {service}
                    </button>
                  ))}
                </div>
              </div>

              {/* Aesthetic Tag with Chips */}
              <div className="space-y-1.5">
                <label className="block font-semibold text-studio-ink">Experience Highlight / Aesthetic Tag</label>
                <input
                  type="text"
                  placeholder="e.g., Exact Match to Inspo"
                  value={reviewForm.aestheticTag}
                  onChange={(e) => setReviewForm({ ...reviewForm, aestheticTag: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-studio-border bg-studio-canvas text-base sm:text-xs text-studio-ink outline-none focus:border-studio-wine"
                />
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {[
                    'Exact Match to Inspo',
                    'Russian Cuticle Detailing',
                    'Super Clean & Friendly',
                    '4+ Week Retention',
                    'Warm Hospitality',
                    'Classy & Neat Finishing'
                  ].map((tag) => (
                    <button
                      type="button"
                      key={tag}
                      onClick={() => setReviewForm({ ...reviewForm, aestheticTag: tag })}
                      className={`text-[10px] px-2.5 py-1 rounded-full border transition-all ${reviewForm.aestheticTag === tag
                        ? 'bg-studio-wineLight text-studio-wine border-studio-wine font-semibold'
                        : 'bg-studio-canvas hover:bg-studio-surface text-studio-secondary border-studio-border'
                        }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Review Comment */}
              <div>
                <label className="block font-semibold text-studio-ink mb-1">Your Review / Experience *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Describe your session: how well your inspo photo was recreated, hygiene standards, longevity, or hospitality..."
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-studio-border bg-studio-canvas text-base sm:text-xs text-studio-ink outline-none focus:border-studio-wine leading-relaxed"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowReviewModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-studio-border text-studio-secondary hover:bg-studio-subtle transition-colors min-h-[42px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingReview}
                  className="px-6 py-2.5 rounded-xl bg-studio-wine hover:bg-studio-wine/90 text-white font-semibold shadow-studio transition-all min-h-[42px] disabled:opacity-50"
                >
                  {isSubmittingReview ? 'Posting Review...' : 'Post Verified Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </ModalPortal>
    )}

      {/* 8. MODAL: NAIL SIZING GUIDE & MEASUREMENT ASSISTANT */}
      {isSizingModalOpen && (
        <ModalPortal isOpen={isSizingModalOpen} onClose={() => setIsSizingModalOpen(false)}>
          {/* Dedicated full-bleed non-scrolling backdrop */}
          <div
            className="fixed inset-0 z-[70] bg-studio-ink/60 backdrop-blur-md transition-opacity"
            onClick={() => setIsSizingModalOpen(false)}
            aria-hidden="true"
          />
          {/* Scrollable floating dialog container */}
          <div className="fixed inset-0 z-[71] overflow-y-auto p-4 flex items-center justify-center pointer-events-none animate-in fade-in">
            <div className="bg-studio-surface rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-studio-float border border-studio-border space-y-5 my-6 max-h-[92vh] overflow-y-auto pointer-events-auto">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-studio-border">
              <div className="flex items-center gap-2">
                <Ruler className="w-4 h-4 text-studio-wine" />
                <h3 className="font-display italic font-bold text-xl text-studio-ink">
                  Nail Sizing & Fit Guide
                </h3>
              </div>
              <button
                onClick={() => setIsSizingModalOpen(false)}
                className="w-8 h-8 rounded-full bg-studio-subtle flex items-center justify-center text-studio-secondary hover:text-studio-ink"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Step-by-Step Instructions */}
            <div className="space-y-3 text-xs font-sans">
              <span className="text-[10px] font-bold uppercase tracking-wider text-studio-wine block">
                How to Measure Your Nails at Home (1-Minute Method)
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-2xl bg-studio-canvas border border-studio-border space-y-1">
                  <span className="w-5 h-5 rounded-full bg-studio-wine text-white flex items-center justify-center text-[10px] font-bold">1</span>
                  <p className="font-semibold text-studio-ink">Apply Tape</p>
                  <p className="text-[11px] text-studio-secondary leading-relaxed">
                    Place a strip of clear tape across the widest part of your natural nail bed.
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-studio-canvas border border-studio-border space-y-1">
                  <span className="w-5 h-5 rounded-full bg-studio-wine text-white flex items-center justify-center text-[10px] font-bold">2</span>
                  <p className="font-semibold text-studio-ink">Mark Edges</p>
                  <p className="text-[11px] text-studio-secondary leading-relaxed">
                    Press tape into both sidewalls and mark lines with a pen on each side.
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-studio-canvas border border-studio-border space-y-1">
                  <span className="w-5 h-5 rounded-full bg-studio-wine text-white flex items-center justify-center text-[10px] font-bold">3</span>
                  <p className="font-semibold text-studio-ink">Measure (mm)</p>
                  <p className="text-[11px] text-studio-secondary leading-relaxed">
                    Peel tape and measure the millimeter distance with a ruler.
                  </p>
                </div>
              </div>

              {/* Standard Sizing Table */}
              <div className="pt-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-studio-wine block mb-1.5">
                  Standard Atelier Sizes (Thumb to Pinky in mm)
                </span>
                <div className="border border-studio-border rounded-2xl overflow-hidden bg-studio-surface text-[11px]">
                  <table className="w-full text-left">
                    <thead className="bg-studio-subtle text-studio-secondary font-semibold border-b border-studio-border">
                      <tr>
                        <th className="p-2.5">Size</th>
                        <th className="p-2.5">Thumb</th>
                        <th className="p-2.5">Index</th>
                        <th className="p-2.5">Middle</th>
                        <th className="p-2.5">Ring</th>
                        <th className="p-2.5">Pinky</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-studio-border text-studio-ink">
                      <tr>
                        <td className="p-2.5 font-bold text-studio-wine">XS</td>
                        <td className="p-2.5">14 mm</td>
                        <td className="p-2.5">11 mm</td>
                        <td className="p-2.5">12 mm</td>
                        <td className="p-2.5">11 mm</td>
                        <td className="p-2.5">8 mm</td>
                      </tr>
                      <tr className="bg-studio-wineLight/30 font-medium">
                        <td className="p-2.5 font-bold text-studio-wine">S (Popular)</td>
                        <td className="p-2.5">15 mm</td>
                        <td className="p-2.5">12 mm</td>
                        <td className="p-2.5">13 mm</td>
                        <td className="p-2.5">12 mm</td>
                        <td className="p-2.5">9 mm</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-bold text-studio-wine">M</td>
                        <td className="p-2.5">16 mm</td>
                        <td className="p-2.5">13 mm</td>
                        <td className="p-2.5">14 mm</td>
                        <td className="p-2.5">13 mm</td>
                        <td className="p-2.5">10 mm</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-bold text-studio-wine">L</td>
                        <td className="p-2.5">17 mm</td>
                        <td className="p-2.5">14 mm</td>
                        <td className="p-2.5">15 mm</td>
                        <td className="p-2.5">14 mm</td>
                        <td className="p-2.5">11 mm</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Sizing Reassurance Card */}
              <div className="p-3.5 rounded-2xl bg-studio-canvas border border-studio-border text-xs text-studio-secondary space-y-1">
                <div className="flex items-center gap-1.5 font-semibold text-studio-ink">
                  <CheckCircle2 className="w-3.5 h-3.5 text-studio-wine" />
                  <span>Between Sizes? Always Size Up</span>
                </div>
                <p className="leading-relaxed text-[11px]">
                  If your nails are between sizes, pick the larger size. You can gently file down the edges using the complimentary mini buffer included with every set for a 100% seamless bespoke fit.
                </p>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setIsSizingModalOpen(false)}
                  className="px-6 py-2.5 rounded-xl bg-studio-wine hover:bg-studio-wineHover text-white font-semibold text-xs shadow-studio"
                >
                  Got It! Choose My Size
                </button>
              </div>
            </div>
          </div>
        </div>
      </ModalPortal>
    )}

      {/* 9. MODAL: PRESS-ON BOUTIQUE CHECKOUT & INSTANT UPI */}
      {isCheckoutModalOpen && selectedPressOnForOrder && (
        <ModalPortal isOpen={isCheckoutModalOpen} onClose={() => setIsCheckoutModalOpen(false)}>
          {/* Dedicated full-bleed non-scrolling backdrop */}
          <div
            className="fixed inset-0 z-[70] bg-studio-ink/60 backdrop-blur-md transition-opacity"
            onClick={() => setIsCheckoutModalOpen(false)}
            aria-hidden="true"
          />
          {/* Scrollable floating dialog container */}
          <div className="fixed inset-0 z-[71] overflow-y-auto p-4 flex items-center justify-center pointer-events-none animate-in fade-in">
            <div className="bg-studio-surface rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-studio-float border border-studio-border space-y-5 my-6 max-h-[92vh] overflow-y-auto pointer-events-auto">
            {/* Header & Close */}
            <div className="flex items-center justify-between pb-3 border-b border-studio-border">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-studio-wine" />
                <h3 className="font-display italic font-bold text-lg text-studio-ink">
                  {checkoutStep === 4 ? 'Order Confirmed' : `Order: ${selectedPressOnForOrder.title}`}
                </h3>
              </div>
              <button
                onClick={() => setIsCheckoutModalOpen(false)}
                className="w-8 h-8 rounded-full bg-studio-subtle flex items-center justify-center text-studio-secondary hover:text-studio-ink"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Stepper Breadcrumb */}
            {checkoutStep < 4 && (
              <div className="flex items-center justify-between text-[11px] font-semibold text-studio-secondary pb-1 border-b border-studio-border/60">
                <span className={checkoutStep === 1 ? 'text-studio-wine font-bold' : ''}>1. Size & Kit</span>
                <span>→</span>
                <span className={checkoutStep === 2 ? 'text-studio-wine font-bold' : ''}>2. Delivery Address</span>
                <span>→</span>
                <span className={checkoutStep === 3 ? 'text-studio-wine font-bold' : ''}>3. Payment</span>
              </div>
            )}

            {/* STEP 1: SIZE, WEAR METHOD & QUANTITY */}
            {checkoutStep === 1 && (
              <div className="space-y-4 text-xs font-sans animate-in fade-in">
                {/* Product Summary */}
                <div className="p-3.5 rounded-2xl bg-studio-canvas border border-studio-border flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-studio-ink text-sm">{selectedPressOnForOrder.title}</h4>
                    <p className="text-[11px] text-studio-secondary">
                      {selectedPressOnForOrder.shape} • {selectedPressOnForOrder.length} • {selectedPressOnForOrder.collection}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="font-display italic font-bold text-base text-studio-ink">
                      ₹{selectedPressOnForOrder.price}
                    </span>
                    <span className="text-[10px] text-emerald-700 block font-medium">Free Delivery</span>
                  </div>
                </div>

                {/* Size Choice */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="font-semibold text-studio-ink">
                      Select Your Size
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsSizingModalOpen(true)}
                      className="text-[11px] text-studio-wine hover:underline font-semibold flex items-center gap-1"
                    >
                      <Ruler className="w-3 h-3" />
                      <span>Sizing Guide</span>
                    </button>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {['XS', 'S', 'M', 'L'].map((sz) => (
                      <button
                        type="button"
                        key={sz}
                        onClick={() => setPressOnOrderForm({ ...pressOnOrderForm, size: sz })}
                        className={`p-2.5 rounded-xl border text-center transition-all ${pressOnOrderForm.size === sz
                          ? 'bg-studio-wine text-white font-bold border-studio-wine shadow-xs'
                          : 'bg-studio-surface border-studio-border text-studio-secondary hover:bg-studio-subtle'
                          }`}
                      >
                        <span className="block text-xs font-bold">{sz}</span>
                        <span className="text-[9px] opacity-80">{sz === 'S' ? 'Most Popular' : sz === 'XS' ? 'Petite' : sz === 'M' ? 'Medium' : 'Wide'}</span>
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => setPressOnOrderForm({ ...pressOnOrderForm, size: 'Custom' })}
                    className={`w-full p-2.5 rounded-xl border text-left transition-all flex items-center justify-between ${pressOnOrderForm.size === 'Custom'
                      ? 'bg-studio-wineLight border-studio-wine text-studio-wine font-semibold'
                      : 'bg-studio-surface border-studio-border text-studio-secondary'
                      }`}
                  >
                    <span>Custom Size (Enter exact mm numbers)</span>
                    <span className="text-[10px]">Thumb to Pinky</span>
                  </button>

                  {pressOnOrderForm.size === 'Custom' && (
                    <input
                      type="text"
                      placeholder="e.g. 15mm, 12mm, 13mm, 11mm, 8mm"
                      value={pressOnOrderForm.customSizes}
                      onChange={(e) => setPressOnOrderForm({ ...pressOnOrderForm, customSizes: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-studio-border bg-studio-canvas text-base sm:text-xs text-studio-ink font-mono"
                    />
                  )}
                </div>

                {/* Wear Method Preference */}
                <div className="space-y-2">
                  <label className="font-semibold text-studio-ink block">
                    Preferred Application Method
                  </label>
                  <div className="space-y-1.5">
                    {[
                      {
                        title: '24 Jelly Sticky Tabs (Temporary Wear)',
                        desc: 'Lasts 3–5 days. 100% reusable, peels off cleanly with zero natural nail damage.'
                      },
                      {
                        title: 'Salon Liquid Nail Glue (Long Wear)',
                        desc: 'Lasts 2–3 weeks. Extra strong bond for weddings, holidays, and extended wear.'
                      }
                    ].map((method) => (
                      <button
                        type="button"
                        key={method.title}
                        onClick={() => setPressOnOrderForm({ ...pressOnOrderForm, wearMethod: method.title })}
                        className={`w-full p-3 rounded-2xl border text-left transition-all ${pressOnOrderForm.wearMethod === method.title
                          ? 'bg-studio-wineLight border-studio-wine'
                          : 'bg-studio-surface border-studio-border hover:bg-studio-subtle'
                          }`}
                      >
                        <span className={`block font-semibold ${pressOnOrderForm.wearMethod === method.title ? 'text-studio-wine' : 'text-studio-ink'}`}>
                          {method.title}
                        </span>
                        <span className="text-[10px] text-studio-secondary leading-normal block mt-0.5">
                          {method.desc}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quantity */}
                <div className="flex items-center justify-between pt-2">
                  <span className="font-semibold text-studio-ink">Quantity</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setPressOnOrderForm({ ...pressOnOrderForm, quantity: Math.max(1, (pressOnOrderForm.quantity || 1) - 1) })}
                      className="w-8 h-8 rounded-xl bg-studio-canvas border border-studio-border font-bold text-studio-ink hover:bg-studio-subtle"
                    >
                      -
                    </button>
                    <span className="font-bold text-sm w-6 text-center">{pressOnOrderForm.quantity || 1}</span>
                    <button
                      type="button"
                      onClick={() => setPressOnOrderForm({ ...pressOnOrderForm, quantity: (pressOnOrderForm.quantity || 1) + 1 })}
                      className="w-8 h-8 rounded-xl bg-studio-canvas border border-studio-border font-bold text-studio-ink hover:bg-studio-subtle"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Subtotal & Next */}
                <div className="pt-3 border-t border-studio-border flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-studio-muted block">Subtotal</span>
                    <span className="font-display italic font-bold text-lg text-studio-ink">
                      ₹{(Number(selectedPressOnForOrder.price || 1299) * Number(pressOnOrderForm.quantity || 1)).toLocaleString('en-IN')}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCheckoutStep(2)}
                    className="px-6 py-3 rounded-2xl bg-studio-wine hover:bg-studio-wineHover text-white font-semibold text-xs shadow-studio flex items-center gap-2"
                  >
                    <span>Delivery Address</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: SHIPPING ADDRESS */}
            {checkoutStep === 2 && (
              <div className="space-y-4 text-xs font-sans animate-in fade-in">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-studio-ink mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rhea Kapoor"
                      value={pressOnOrderForm.clientName}
                      onChange={(e) => setPressOnOrderForm({ ...pressOnOrderForm, clientName: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-studio-border bg-studio-canvas text-base sm:text-xs text-studio-ink font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-studio-ink mb-1">WhatsApp Phone *</label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 98765 43210"
                      value={pressOnOrderForm.clientPhone}
                      onChange={(e) => setPressOnOrderForm({ ...pressOnOrderForm, clientPhone: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-studio-border bg-studio-canvas text-base sm:text-xs text-studio-ink font-semibold"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-semibold text-studio-ink mb-1">Email (Optional)</label>
                    <input
                      type="email"
                      placeholder="for shipping tracking updates"
                      value={pressOnOrderForm.clientEmail}
                      onChange={(e) => setPressOnOrderForm({ ...pressOnOrderForm, clientEmail: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-studio-border bg-studio-canvas text-base sm:text-xs text-studio-ink"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-semibold text-studio-ink mb-1">Street Address / Landmark *</label>
                    <input
                      type="text"
                      required
                      placeholder="House/Flat No, Apartment, Street name"
                      value={pressOnOrderForm.addressStreet}
                      onChange={(e) => setPressOnOrderForm({ ...pressOnOrderForm, addressStreet: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-studio-border bg-studio-canvas text-base sm:text-xs text-studio-ink"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-studio-ink mb-1">City *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Dehradun"
                      value={pressOnOrderForm.addressCity}
                      onChange={(e) => setPressOnOrderForm({ ...pressOnOrderForm, addressCity: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-studio-border bg-studio-canvas text-base sm:text-xs text-studio-ink"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-studio-ink mb-1">State *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Uttarakhand"
                      value={pressOnOrderForm.addressState}
                      onChange={(e) => setPressOnOrderForm({ ...pressOnOrderForm, addressState: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-studio-border bg-studio-canvas text-base sm:text-xs text-studio-ink"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-studio-ink mb-1">Pincode *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 248001"
                      value={pressOnOrderForm.addressPincode}
                      onChange={(e) => setPressOnOrderForm({ ...pressOnOrderForm, addressPincode: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-studio-border bg-studio-canvas text-base sm:text-xs text-studio-ink font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-studio-ink mb-1">Order Notes (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. Gifting notes, extra sticky tabs"
                      value={pressOnOrderForm.notes}
                      onChange={(e) => setPressOnOrderForm({ ...pressOnOrderForm, notes: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-studio-border bg-studio-canvas text-base sm:text-xs text-studio-ink"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-studio-border flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setCheckoutStep(1)}
                    className="px-4 py-2.5 rounded-xl border border-studio-border text-studio-secondary"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (!pressOnOrderForm.clientName || !pressOnOrderForm.clientPhone || !pressOnOrderForm.addressStreet) {
                        if (onAddToast) onAddToast('Missing Information', 'Please complete your name, phone number, and street address.', 'error');
                        return;
                      }
                      setCheckoutStep(3);
                    }}
                    className="px-6 py-3 rounded-2xl bg-studio-wine hover:bg-studio-wineHover text-white font-semibold text-xs shadow-studio flex items-center gap-2"
                  >
                    <span>Proceed to Payment</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: PAYMENT VIA UPI & DISPATCH */}
            {checkoutStep === 3 && (
              <form onSubmit={handlePressOnOrderSubmit} className="space-y-4 text-xs font-sans animate-in fade-in">
                {/* Total Summary */}
                <div className="p-4 rounded-2xl bg-studio-wineLight/60 border border-studio-border flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-studio-wine font-bold uppercase tracking-wider block">Total Amount Due</span>
                    <h4 className="font-semibold text-studio-ink text-sm">
                      {selectedPressOnForOrder.title} ({pressOnOrderForm.size}) × {pressOnOrderForm.quantity}
                    </h4>
                  </div>
                  <div className="text-right">
                    <span className="font-display italic font-bold text-2xl text-studio-wine">
                      ₹{(Number(selectedPressOnForOrder.price || 1299) * Number(pressOnOrderForm.quantity || 1)).toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] text-emerald-700 block font-semibold">Free Express Shipping</span>
                  </div>
                </div>

                {/* Instant Dynamic UPI QR Code */}
                <div className="p-4 rounded-2xl bg-studio-canvas border border-studio-border text-center space-y-3">
                  <span className="text-[11px] font-semibold text-studio-ink block">
                    Scan with any UPI App (GPay, PhonePe, Paytm, CRED)
                  </span>
                  <div className="p-3 bg-white rounded-2xl border border-studio-border inline-block shadow-studio">
                    <QRCodeSVG
                      value={`upi://pay?pa=${settings?.upiId || 'nailsbysirii@okaxis'}&pn=Nails%20by%20Sirii&am=${Number(selectedPressOnForOrder.price || 1299) * Number(pressOnOrderForm.quantity || 1)}&cu=INR&tn=PressOn-${encodeURIComponent(selectedPressOnForOrder.title)}`}
                      size={150}
                      level="M"
                      includeMargin
                      fgColor="#1C1917"
                    />
                  </div>

                  <div className="flex items-center justify-center gap-2 pt-1">
                    <span className="font-mono text-xs text-studio-secondary bg-studio-surface px-3 py-1 rounded-lg border border-studio-border">
                      {settings?.upiId || 'nailsbysirii@okaxis'}
                    </span>
                    <button
                      type="button"
                      onClick={copyUpiId}
                      className="px-3 py-1 rounded-lg bg-studio-wine text-white font-semibold text-[11px] shadow-xs flex items-center gap-1 active:scale-95"
                    >
                      <Copy className="w-3 h-3" />
                      <span>{copiedUpi ? 'Copied' : 'Copy UPI'}</span>
                    </button>
                  </div>
                </div>

                {/* Optional UTR / Reference */}
                <div>
                  <label className="block font-semibold text-studio-ink mb-1">
                    UPI Transaction UTR / Ref Number (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="Enter 12-digit UTR if paid"
                    value={pressOnOrderForm.paymentRef}
                    onChange={(e) => setPressOnOrderForm({ ...pressOnOrderForm, paymentRef: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-studio-border bg-studio-canvas text-base sm:text-xs text-studio-ink font-mono"
                  />
                  <p className="text-[10px] text-studio-muted mt-0.5">
                    You can also confirm payment directly on WhatsApp after placing order.
                  </p>
                </div>

                {/* Actions */}
                <div className="pt-3 border-t border-studio-border flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setCheckoutStep(2)}
                    className="px-4 py-2.5 rounded-xl border border-studio-border text-studio-secondary"
                  >
                    Back
                  </button>

                  <button
                    type="submit"
                    disabled={isPlacingPressOnOrder}
                    className="px-6 py-3 rounded-2xl bg-studio-wine hover:bg-studio-wineHover text-white font-semibold text-xs sm:text-sm shadow-studio flex items-center gap-2 active:scale-95 disabled:opacity-50"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>{isPlacingPressOnOrder ? 'Placing Order...' : 'Confirm & Place Order'}</span>
                  </button>
                </div>
              </form>
            )}

            {/* STEP 4: ORDER CONFIRMED SCREEN */}
            {checkoutStep === 4 && confirmedPressOnOrder && (
              <div className="text-center space-y-5 py-4 text-xs font-sans animate-in fade-in">
                <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center mx-auto shadow-studio">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-studio-wine block">
                    Order Received Successfully
                  </span>
                  <h3 className="font-display italic font-bold text-2xl text-studio-ink">
                    Thank You, {confirmedPressOnOrder.clientName}!
                  </h3>
                  <p className="text-studio-secondary text-xs max-w-sm mx-auto leading-relaxed">
                    Your order <strong className="text-studio-ink">#{confirmedPressOnOrder.orderNumber || confirmedPressOnOrder.id}</strong> has been transmitted to Sirii's console.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-studio-canvas border border-studio-border text-left max-w-sm mx-auto space-y-1.5 text-[11px]">
                  <p><strong className="text-studio-ink">Set:</strong> {confirmedPressOnOrder.productTitle}</p>
                  <p><strong className="text-studio-ink">Size:</strong> {confirmedPressOnOrder.size} • Qty: {confirmedPressOnOrder.quantity || 1}</p>
                  <p><strong className="text-studio-ink">Shipping To:</strong> {confirmedPressOnOrder.addressStreet}, {confirmedPressOnOrder.addressCity} - {confirmedPressOnOrder.addressPincode}</p>
                  <p><strong className="text-studio-ink">Dispatch Estimate:</strong> Dispatched in 24–48 hours with live tracking on WhatsApp.</p>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2">
                  <a
                    href={`https://wa.me/${whatsappPhone}?text=${encodeURIComponent(`Hello Sirii! I just placed an order for the ${confirmedPressOnOrder.productTitle} press-on set (Order #${confirmedPressOnOrder.orderNumber || confirmedPressOnOrder.id}). Excited to receive it!`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs shadow-studio flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>WhatsApp Order Update</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => setIsCheckoutModalOpen(false)}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-2xl border border-studio-border text-studio-secondary hover:bg-studio-subtle font-semibold text-xs"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </ModalPortal>
    )}
    </div>
  );
}
