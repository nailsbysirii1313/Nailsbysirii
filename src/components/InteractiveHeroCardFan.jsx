import React, { useState, useRef } from 'react';
import {
  Heart,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Info,
  Flame,
  ArrowRight,
  X
} from 'lucide-react';
import { playStudioChime } from '../utils/audio';
import ModalPortal from './ModalPortal';

// Nail Recipe data for creative engagement
const NAIL_RECIPES = {
  soft: {
    prep: 'Russian dry manicure & precision cuticle e-file',
    base: 'Semi-sheer strawberry milk BIAB gel reinforcement',
    finish: 'Pearlized glazed chrome buffed to high-mirror sheen',
    wear: '3–4 Weeks chip-free wear',
    time: '60–75 mins'
  },
  sparkle: {
    prep: 'Structural apex alignment & diamond cuticle buff',
    base: 'Champagne porcelain acrylic sculpture or soft gel',
    finish: 'Molten liquid gold pearl chrome with glass topcoat',
    wear: '4+ Weeks high-gloss retention',
    time: '75–90 mins'
  },
  statement: {
    prep: 'Razor-sharp stiletto architecture & apex balance',
    base: 'Deep dimensional velvet rose magnetic cat-eye',
    finish: 'Multi-angle optical shimmer & optional crystal accent',
    wear: '4+ Weeks structural durability',
    time: '90–105 mins'
  }
};

export default function InteractiveHeroCardFan({
  heroCards = [],
  activeHeroStyle,
  setActiveHeroStyle,
  onBookHeroStyle,
  onAddToast,
  className = ''
}) {
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [likedCardIds, setLikedCardIds] = useState(new Set(['sparkle']));
  const [floatingHearts, setFloatingHearts] = useState([]);
  const [showRecipeModal, setShowRecipeModal] = useState(false);

  const dragStartX = useRef(0);
  const dragStartY = useRef(0);
  const dragStartTime = useRef(0);
  const isVerticalScroll = useRef(false);
  const isPointerDown = useRef(false);
  const deckRef = useRef(null);

  const activeIdx = Math.max(
    0,
    heroCards.findIndex((c) => c.id === activeHeroStyle)
  );

  // Cycle through cards (-1 = previous, +1 = next)
  const cycleCard = (direction) => {
    if (!heroCards.length) return;
    const nextIdx = (activeIdx + direction + heroCards.length) % heroCards.length;
    const nextCard = heroCards[nextIdx];
    if (nextCard) {
      setActiveHeroStyle(nextCard.id);
      playStudioChime();
    }
  };

  // Touch event handlers for mobile
  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    dragStartX.current = touch.clientX;
    dragStartY.current = touch.clientY;
    dragStartTime.current = Date.now();
    isVerticalScroll.current = false;
    setIsDragging(true);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const touch = e.touches[0];
    const deltaX = touch.clientX - dragStartX.current;
    const deltaY = touch.clientY - dragStartY.current;

    // Detect if user intended to scroll vertically down the page
    if (!isVerticalScroll.current && Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > 8) {
      isVerticalScroll.current = true;
      setDragX(0);
      setIsDragging(false);
      return;
    }

    if (!isVerticalScroll.current) {
      // Horizontal swipe dominant: prevent page scroll jitter and track 1:1
      if (Math.abs(deltaX) > 6 && e.cancelable) {
        e.preventDefault();
      }
      setDragX(deltaX * 0.9);
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    const elapsed = Date.now() - dragStartTime.current;
    const velocity = Math.abs(dragX) / (elapsed || 1);

    // Swipe trigger: distance > 45px or quick velocity flick > 0.35
    if (Math.abs(dragX) > 45 || (velocity > 0.35 && Math.abs(dragX) > 20)) {
      if (dragX < 0) {
        cycleCard(1); // Swiped left -> next card
      } else {
        cycleCard(-1); // Swiped right -> previous card
      }
    }

    setDragX(0);
    setIsDragging(false);
  };

  // Mouse drag handlers for desktop / trackpad
  const handleMouseDown = (e) => {
    // Only primary mouse button
    if (e.button !== 0) return;
    isPointerDown.current = true;
    dragStartX.current = e.clientX;
    dragStartY.current = e.clientY;
    dragStartTime.current = Date.now();
    isVerticalScroll.current = false;
    setIsDragging(true);
  };

  const handleMouseMove = (e) => {
    if (!isPointerDown.current || !isDragging) return;
    const deltaX = e.clientX - dragStartX.current;
    setDragX(deltaX * 0.9);
  };

  const handleMouseUp = () => {
    if (!isPointerDown.current) return;
    isPointerDown.current = false;
    const elapsed = Date.now() - dragStartTime.current;
    const velocity = Math.abs(dragX) / (elapsed || 1);

    if (Math.abs(dragX) > 45 || (velocity > 0.35 && Math.abs(dragX) > 20)) {
      if (dragX < 0) {
        cycleCard(1);
      } else {
        cycleCard(-1);
      }
    }

    setDragX(0);
    setIsDragging(false);
  };

  // Like card and trigger micro-heart burst particles
  const handleToggleLike = (e, card) => {
    e.stopPropagation();
    const nextSet = new Set(likedCardIds);
    const wasLiked = nextSet.has(card.id);

    if (wasLiked) {
      nextSet.delete(card.id);
    } else {
      nextSet.add(card.id);
      playStudioChime();

      // Spawn floating hearts
      const rect = e.currentTarget.getBoundingClientRect();
      const parentRect = deckRef.current ? deckRef.current.getBoundingClientRect() : rect;
      const originX = rect.left - parentRect.left + rect.width / 2;
      const originY = rect.top - parentRect.top;

      const particles = Array.from({ length: 4 }).map((_, i) => ({
        id: `${Date.now()}-${i}`,
        x: originX,
        y: originY,
        tx: `${(i - 1.5) * 16}px`,
        rot: `${(i - 1.5) * 18}deg`
      }));

      setFloatingHearts((prev) => [...prev, ...particles]);
      setTimeout(() => {
        setFloatingHearts((prev) => prev.filter((p) => !particles.some((np) => np.id === p.id)));
      }, 750);

      if (onAddToast) {
        onAddToast('Wishlist Saved', `Saved "${card.title}" to your inspired looks!`);
      }
    }

    setLikedCardIds(nextSet);
  };

  const activeCard = heroCards[activeIdx] || heroCards[1] || heroCards[0];
  const recipeData = NAIL_RECIPES[activeCard?.id] || NAIL_RECIPES.sparkle;

  return (
    <div className={`relative flex flex-col items-center select-none w-full ${className}`}>
      {/* 1. Touch & Mouse Interactive Fan Deck Container */}
      <div
        ref={deckRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className="relative w-full max-w-[340px] sm:max-w-[380px] h-[270px] sm:h-[295px] flex items-center justify-center cursor-grab active:cursor-grabbing touch-pan-y"
        style={{ perspective: '1100px' }}
      >
        {/* Soft Pink Ambient Glow Aura */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none -z-10"
          aria-hidden="true"
        >
          <div
            className="w-[300px] sm:w-[340px] h-[240px] rounded-full blur-3xl transition-all duration-700"
            style={{
              backgroundColor: activeCard?.baseColor
                ? `${activeCard.baseColor}40`
                : 'rgba(244, 114, 182, 0.25)'
            }}
          />
        </div>

        {/* Floating Heart Burst Particles */}
        {floatingHearts.map((h) => (
          <div
            key={h.id}
            className="absolute pointer-events-none z-40 animate-float-heart"
            style={{
              left: `${h.x}px`,
              top: `${h.y}px`,
              '--tx': h.tx,
              '--rot': h.rot
            }}
          >
            <Heart className="w-4 h-4 text-brand-wine fill-brand-wine drop-shadow-sm" />
          </div>
        ))}

        {/* Three Overlapping Cards */}
        {heroCards.map((style, idx) => {
          const isFront = activeIdx === idx;
          const diff = (idx - activeIdx + heroCards.length) % heroCards.length;
          const isLiked = likedCardIds.has(style.id);

          // Card transformation calculation based on position & dragOffset
          let transformStyle = {};
          let zIndex = 10;
          let opacity = 0.88;
          let cursor = 'pointer';

          if (isFront) {
            zIndex = 30;
            opacity = 1;
            cursor = isDragging ? 'grabbing' : 'grab';

            // Real-time drag follow
            const rotateDeg = isDragging ? dragX * 0.08 : 0;
            const translateX = isDragging ? dragX : 0;
            const scale = isDragging ? 1 - Math.min(Math.abs(dragX) / 1000, 0.04) : 1;

            transformStyle = {
              transform: `translate3d(${translateX}px, 0px, 0px) rotate(${rotateDeg}deg) scale(${scale})`,
              transition: isDragging
                ? 'none'
                : 'transform 380ms cubic-bezier(0.25, 1, 0.5, 1), box-shadow 380ms ease'
            };
          } else if (diff === 1) {
            // Right Card: default translate right +8deg
            zIndex = 15;
            const baseTranslate = 68; // px
            const dragFactor = isDragging && dragX < 0 ? Math.min(Math.abs(dragX) / 80, 1) : 0;
            const currentTranslate = baseTranslate - dragFactor * 40;
            const currentRotate = 8 - dragFactor * 8;
            const currentScale = 0.88 + dragFactor * 0.08;
            opacity = 0.82 + dragFactor * 0.18;

            transformStyle = {
              transform: `translate3d(${currentTranslate}px, 0px, -20px) rotate(${currentRotate}deg) scale(${currentScale})`,
              transition: isDragging
                ? 'none'
                : 'transform 380ms cubic-bezier(0.25, 1, 0.5, 1), opacity 380ms ease'
            };
          } else {
            // Left Card: default translate left -8deg
            zIndex = 15;
            const baseTranslate = -68; // px
            const dragFactor = isDragging && dragX > 0 ? Math.min(dragX / 80, 1) : 0;
            const currentTranslate = baseTranslate + dragFactor * 40;
            const currentRotate = -8 + dragFactor * 8;
            const currentScale = 0.88 + dragFactor * 0.08;
            opacity = 0.82 + dragFactor * 0.18;

            transformStyle = {
              transform: `translate3d(${currentTranslate}px, 0px, -20px) rotate(${currentRotate}deg) scale(${currentScale})`,
              transition: isDragging
                ? 'none'
                : 'transform 380ms cubic-bezier(0.25, 1, 0.5, 1), opacity 380ms ease'
            };
          }

          const fallbackImg =
            idx === 0
              ? '/hero/soft-simple.jpg'
              : idx === 1
              ? '/hero/little-sparkle.jpg'
              : '/hero/make-statement.jpg';
          const cardImage = style.imageUrl || fallbackImg;

          return (
            <div
              key={style.id || idx}
              onClick={() => {
                if (!isFront) {
                  setActiveHeroStyle(style.id);
                  playStudioChime();
                }
              }}
              style={{
                ...transformStyle,
                zIndex,
                opacity,
                cursor
              }}
              className={`absolute w-[176px] sm:w-[195px] h-[256px] sm:h-[276px] rounded-[24px] bg-white border overflow-hidden flex flex-col justify-between shadow-studio-float ${
                isFront
                  ? 'border-brand-wine/45 ring-4 ring-brand-wine/15 shadow-float'
                  : 'border-border-subtle hover:border-brand-wine/40'
              }`}
            >
              {/* Photo & Badges Area */}
              <div className="relative w-full h-[62%] overflow-hidden bg-studio-canvas group">
                <img
                  src={cardImage}
                  alt={style.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 pointer-events-none"
                  loading="eager"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/20 pointer-events-none" />

                {/* Top Badge: Trend / Studio Fav */}
                <div className="absolute top-2.5 left-2.5 z-10">
                  <span className="inline-flex items-center gap-1 text-[9px] font-extrabold uppercase tracking-wider text-white bg-black/60 backdrop-blur-md border border-white/25 px-2 py-0.5 rounded-full shadow-xs">
                    <Sparkles className="w-2.5 h-2.5 text-pink-300" />
                    <span>{style.tag || 'Studio Look'}</span>
                  </span>
                </div>

                {/* Bottom Photo Pill: Shape & Length */}
                <div className="absolute bottom-2 right-2.5 z-10">
                  <span className="text-[9px] font-bold text-white bg-brand-wine/90 backdrop-blur-md px-2.5 py-0.5 rounded-full shadow-xs">
                    {style.shape} • {style.length}
                  </span>
                </div>

                {/* Quick Info/Recipe button on front card */}
                {isFront && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowRecipeModal(true);
                    }}
                    title="Inspect Nail Atelier Recipe"
                    className="absolute bottom-2 left-2.5 z-10 w-6 h-6 rounded-full bg-white/80 hover:bg-white backdrop-blur-md text-text-ink flex items-center justify-center transition-transform hover:scale-110 shadow-xs"
                  >
                    <Info className="w-3.5 h-3.5 text-brand-wine" />
                  </button>
                )}
              </div>

              {/* Bottom Card Details (Clean White Card Body) */}
              <div className="p-2.5 sm:p-3 bg-white flex-1 flex flex-col justify-between text-left border-t border-border-subtle/50 relative z-10">
                <div>
                  <div className="flex items-start justify-between gap-1">
                    <h4 className="font-sans font-bold text-xs sm:text-[13px] text-text-ink leading-snug">
                      {style.title}
                    </h4>
                    {/* Heart Favorite Button */}
                    <button
                      onClick={(e) => handleToggleLike(e, style)}
                      className="p-1 rounded-full hover:bg-pink-50 transition-colors active:scale-125 shrink-0 -mt-0.5"
                      title={isLiked ? 'Remove from wishlist' : 'Save to wishlist'}
                      aria-label="Wishlist look"
                    >
                      <Heart
                        className={`w-3.5 h-3.5 transition-all ${
                          isLiked
                            ? 'text-brand-wine fill-brand-wine scale-110 drop-shadow-xs'
                            : 'text-text-muted hover:text-brand-wine'
                        }`}
                      />
                    </button>
                  </div>
                  <p className="text-[10px] text-text-muted line-clamp-1 mt-0.5 leading-snug">
                    {style.subtitle}
                  </p>
                </div>

                {isFront && (
                  <div className="pt-1 flex items-center justify-between">
                    <span className="text-[9px] font-bold text-brand-wine uppercase tracking-wider flex items-center gap-1">
                      <Flame className="w-2.5 h-2.5 text-brand-wine fill-brand-wine" />
                      <span>Ready to Sculpt</span>
                    </span>
                    <span className="text-[9px] text-text-muted font-medium inline-flex items-center gap-0.5">
                      Swipe cards <ArrowRight className="w-2.5 h-2.5 text-text-muted" />
                    </span>
                  </div>
                )}
              </div>

              {/* Front Card Dynamic Specular Glint */}
              {isFront && (
                <div
                  className="absolute inset-0 pointer-events-none rounded-[24px] overflow-hidden z-20"
                  aria-hidden="true"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-hero-shine" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 2. Tactile Slider Controls & Segmented Pill Navigation */}
      <div className="w-full max-w-[360px] sm:max-w-sm mt-3 px-1 sm:px-2 flex flex-col items-center gap-2">
        {/* Swipe Guidance & Navigation Bar */}
        <div className="flex items-center justify-between w-full gap-1.5 sm:gap-2">
          {/* Previous Arrow Button */}
          <button
            onClick={() => cycleCard(-1)}
            aria-label="Previous look"
            className="w-8 h-8 rounded-full bg-studio-surface hover:bg-studio-canvas border border-border-subtle text-text-muted hover:text-brand-wine flex items-center justify-center transition-all active:scale-90 shadow-xs shrink-0"
            title="Previous Nail Look"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Segmented Mood Tabs */}
          <div className="flex-1 flex items-center justify-center gap-1 sm:gap-1.5 p-1 rounded-full bg-studio-surface border border-border-subtle shadow-xs min-w-0">
            {heroCards.map((style, idx) => {
              const isSelected = activeIdx === idx;
              const label =
                style.id === 'statement' ? (
                  <span>
                    <span className="hidden sm:inline">Make a </span>Statement
                  </span>
                ) : style.id === 'sparkle' ? (
                  <span>
                    <span className="hidden sm:inline">A </span>Little Sparkle
                  </span>
                ) : (
                  style.label
                );

              return (
                <button
                  key={style.id}
                  onClick={() => {
                    setActiveHeroStyle(style.id);
                    playStudioChime();
                  }}
                  className={`flex-1 py-1 px-1 sm:px-2 rounded-full text-[10px] sm:text-[11px] font-semibold transition-all whitespace-nowrap active:scale-95 text-center ${
                    isSelected
                      ? 'bg-brand-wine text-white shadow-xs font-bold'
                      : 'text-text-muted hover:text-text-ink hover:bg-studio-canvas'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* Next Arrow Button */}
          <button
            onClick={() => cycleCard(1)}
            aria-label="Next look"
            className="w-8 h-8 rounded-full bg-studio-surface hover:bg-studio-canvas border border-border-subtle text-text-muted hover:text-brand-wine flex items-center justify-center transition-all active:scale-90 shadow-xs shrink-0"
            title="Next Nail Look"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Micro Interaction Hint */}
        <div className="flex items-center justify-center gap-1 text-[10px] text-text-muted font-medium pt-0.5">
          <span>Slide with finger</span>
          <span className="text-brand-wine font-semibold">•</span>
          <span>Tap side cards</span>
          <span className="text-brand-wine font-semibold">•</span>
          <span>Tap heart to save</span>
        </div>
      </div>

      {/* 3. Bespoke Nail Recipe Floating Modal / Bottom Sheet */}
      <ModalPortal isOpen={showRecipeModal} onClose={() => setShowRecipeModal(false)}>
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in"
          onClick={() => setShowRecipeModal(false)}
        >
          <div
            className="bg-studio-surface rounded-3xl max-w-sm w-full p-5 sm:p-6 shadow-studio-float border border-border-subtle space-y-4 text-xs font-sans relative my-auto animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-pink-50 text-brand-wine flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-wine block">
                    Atelier Recipe & Specs
                  </span>
                  <h3 className="font-display font-semibold text-base text-text-ink">
                    {activeCard?.title}
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setShowRecipeModal(false)}
                className="w-7 h-7 rounded-full bg-studio-canvas flex items-center justify-center text-text-muted hover:text-text-ink min-h-[36px] min-w-[36px]"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Recipe Details List */}
            <div className="space-y-2.5">
              <div className="p-3 rounded-2xl bg-studio-canvas border border-border-subtle space-y-1">
                <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">
                  Prep & Base Layer
                </span>
                <p className="text-xs font-medium text-text-ink leading-relaxed">
                  {recipeData.prep}
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-studio-canvas border border-border-subtle space-y-1">
                <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">
                  Color & Art Technique
                </span>
                <p className="text-xs font-medium text-text-ink leading-relaxed">
                  {recipeData.base}
                </p>
                <p className="text-xs font-medium text-brand-wine leading-relaxed pt-0.5">
                  Finish: {recipeData.finish}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900">
                  <span className="text-[9px] font-bold uppercase tracking-wider block text-emerald-700">Durability</span>
                  <span className="font-bold">{recipeData.wear}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-purple-50 border border-purple-200 text-purple-900">
                  <span className="text-[9px] font-bold uppercase tracking-wider block text-purple-700">Studio Session</span>
                  <span className="font-bold">{recipeData.time}</span>
                </div>
              </div>
            </div>

            {/* Action inside modal */}
            <div className="pt-2 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => setShowRecipeModal(false)}
                className="px-4 py-2.5 rounded-xl border border-border-subtle text-text-secondary text-xs font-semibold hover:bg-studio-canvas min-h-[40px]"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowRecipeModal(false);
                  if (onBookHeroStyle) onBookHeroStyle(activeCard?.id);
                }}
                className="flex-1 py-2.5 px-4 rounded-xl bg-brand-wine hover:bg-brand-wineHover text-white text-xs font-semibold shadow-studio transition-all active:scale-95 flex items-center justify-center gap-1.5 min-h-[40px]"
              >
                <Heart className="w-3.5 h-3.5 fill-white text-white" />
                <span>Book This Look</span>
              </button>
            </div>
          </div>
        </div>
      </ModalPortal>
    </div>
  );
}
