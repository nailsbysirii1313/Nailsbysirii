import React, { useState, useRef, useEffect } from 'react';
import { Info, X, Maximize2 } from 'lucide-react';
import { playStudioChime } from '../utils/audio';
import ModalPortal from './ModalPortal';

// Verified plain-language descriptions for each displayed look
const VERIFIED_DESCRIPTIONS = {
  soft: 'Sheer strawberry gel with pearl chrome on natural nails.',
  sparkle: 'Champagne porcelain with pearl chrome on coffin nails.',
  statement: 'Deep berry velvet cat-eye shimmer on long sculpted tips.'
};

const MOOD_LABELS = {
  soft: 'Simple',
  sparkle: 'Sparkly',
  statement: 'Bold'
};

// Nail recipe details for optional info modal
const NAIL_RECIPES = {
  soft: {
    prep: 'Dry Russian cuticle care with precision e-file',
    base: 'Sheer strawberry milk builder gel reinforcement',
    finish: 'Pearlized glazed chrome buffed to high-mirror shine',
    wear: '3-4 weeks chip-free wear',
    time: '60-75 mins'
  },
  sparkle: {
    prep: 'Apex alignment and diamond cuticle buffer',
    base: 'Champagne porcelain acrylic or soft gel sculpture',
    finish: 'Molten pearl chrome with glass topcoat',
    wear: '4+ weeks high-gloss retention',
    time: '75-90 mins'
  },
  statement: {
    prep: 'Stiletto architecture and apex balance',
    base: 'Deep berry velvet rose magnetic cat-eye gel',
    finish: 'Multi-angle optical shimmer and gloss topcoat',
    wear: '4+ weeks structural durability',
    time: '90-105 mins'
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
  const [showRecipeModal, setShowRecipeModal] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const dragStartX = useRef(0);
  const dragStartY = useRef(0);
  const dragStartTime = useRef(0);
  const isVerticalScroll = useRef(false);
  const isPointerDown = useRef(false);
  const deckRef = useRef(null);
  const expandBtnRef = useRef(null);
  const closePhotoBtnRef = useRef(null);

  const handleOpenPhotoModal = (e) => {
    e.stopPropagation();
    setShowPhotoModal(true);
  };

  const handleClosePhotoModal = () => {
    setShowPhotoModal(false);
    setTimeout(() => {
      expandBtnRef.current?.focus();
    }, 50);
  };

  useEffect(() => {
    if (showPhotoModal) {
      setTimeout(() => {
        closePhotoBtnRef.current?.focus();
      }, 50);
    }
  }, [showPhotoModal]);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      const media = window.matchMedia('(prefers-reduced-motion: reduce)');
      setPrefersReducedMotion(media.matches);
      const listener = (e) => setPrefersReducedMotion(e.matches);
      media.addEventListener('change', listener);
      return () => media.removeEventListener('change', listener);
    }
  }, []);

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

  // Touch handlers for mobile
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
      // Horizontal swipe dominant: prevent page scroll jitter
      if (Math.abs(deltaX) > 6 && e.cancelable) {
        e.preventDefault();
      }
      setDragX(deltaX * 0.85);
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    const elapsed = Date.now() - dragStartTime.current;
    const velocity = Math.abs(dragX) / (elapsed || 1);

    // Swipe trigger: distance > 38px or quick velocity flick
    if (Math.abs(dragX) > 38 || (velocity > 0.3 && Math.abs(dragX) > 18)) {
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
    setDragX(deltaX * 0.85);
  };

  const handleMouseUp = () => {
    if (!isPointerDown.current) return;
    isPointerDown.current = false;
    const elapsed = Date.now() - dragStartTime.current;
    const velocity = Math.abs(dragX) / (elapsed || 1);

    if (Math.abs(dragX) > 38 || (velocity > 0.3 && Math.abs(dragX) > 18)) {
      if (dragX < 0) {
        cycleCard(1);
      } else {
        cycleCard(-1);
      }
    }

    setDragX(0);
    setIsDragging(false);
  };

  const activeCard = heroCards[activeIdx] || heroCards[1] || heroCards[0];
  const recipeData = NAIL_RECIPES[activeCard?.id] || NAIL_RECIPES.sparkle;

  const transitionDuration = prefersReducedMotion ? '0ms' : '300ms';
  const transitionEase = 'cubic-bezier(0.2, 0.8, 0.2, 1)';

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
        className="relative w-full max-w-[320px] sm:max-w-[360px] h-[255px] sm:h-[275px] flex items-center justify-center cursor-grab active:cursor-grabbing touch-pan-y"
        style={{ perspective: '1000px' }}
      >
        {/* Soft Faint Blush Oval Backdrop (Slightly off-centre, behind card imagery only) */}
        <div
          aria-hidden="true"
          className="absolute left-1/2 top-[46%] -translate-x-[47%] -translate-y-1/2 w-[265px] sm:w-[305px] h-[185px] sm:h-[205px] rounded-[50%] bg-[#F5E6E5]/70 pointer-events-none select-none z-0"
        />

        {/* Three Overlapping Cards */}
        {heroCards.map((style, idx) => {
          const isFront = activeIdx === idx;
          const diff = (idx - activeIdx + heroCards.length) % heroCards.length;

          // Card transformation calculation based on position & dragOffset
          let transformStyle = {};
          let zIndex = 10;
          let opacity = 0.94;
          let cursor = 'pointer';

          if (isFront) {
            zIndex = 30;
            opacity = 1;
            cursor = isDragging ? 'grabbing' : 'grab';

            // Real-time drag follow
            const rotateDeg = isDragging ? dragX * 0.07 : 0;
            const translateX = isDragging ? dragX : 0;
            const scale = isDragging ? 1 - Math.min(Math.abs(dragX) / 1100, 0.03) : 1;

            transformStyle = {
              transform: `translate3d(${translateX}px, 0px, 0px) rotate(${rotateDeg}deg) scale(${scale})`,
              transition: isDragging
                ? 'none'
                : `transform ${transitionDuration} ${transitionEase}, box-shadow ${transitionDuration} ease`
            };
          } else if (diff === 1) {
            // Right Card: default translate right +8deg
            zIndex = 15;
            const baseTranslate = 64; // px
            const dragFactor = isDragging && dragX < 0 ? Math.min(Math.abs(dragX) / 75, 1) : 0;
            const currentTranslate = baseTranslate - dragFactor * 38;
            const currentRotate = 8 - dragFactor * 8;
            const currentScale = 0.9 + dragFactor * 0.08;
            opacity = 0.88 + dragFactor * 0.12;

            transformStyle = {
              transform: `translate3d(${currentTranslate}px, 0px, -20px) rotate(${currentRotate}deg) scale(${currentScale})`,
              transition: isDragging
                ? 'none'
                : `transform ${transitionDuration} ${transitionEase}, opacity ${transitionDuration} ease`
            };
          } else {
            // Left Card: default translate left -8deg
            zIndex = 15;
            const baseTranslate = -64; // px
            const dragFactor = isDragging && dragX > 0 ? Math.min(dragX / 75, 1) : 0;
            const currentTranslate = baseTranslate + dragFactor * 38;
            const currentRotate = -8 + dragFactor * 8;
            const currentScale = 0.9 + dragFactor * 0.08;
            opacity = 0.88 + dragFactor * 0.12;

            transformStyle = {
              transform: `translate3d(${currentTranslate}px, 0px, -20px) rotate(${currentRotate}deg) scale(${currentScale})`,
              transition: isDragging
                ? 'none'
                : `transform ${transitionDuration} ${transitionEase}, opacity ${transitionDuration} ease`
            };
          }

          const fallbackImg =
            idx === 0
              ? '/hero/soft-simple.jpg'
              : idx === 1
              ? '/hero/little-sparkle.jpg'
              : '/hero/make-statement.jpg';
          const cardImage = style.imageUrl || fallbackImg;
          const description = VERIFIED_DESCRIPTIONS[style.id] || style.subtitle || '';

          return (
            <div
              key={style.id || idx}
              role={!isFront ? 'button' : undefined}
              aria-label={!isFront ? `Select ${style.title}` : undefined}
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
              className={`absolute w-[172px] sm:w-[192px] h-[246px] sm:h-[268px] rounded-2xl bg-white border overflow-hidden flex flex-col justify-between ${
                isFront
                  ? 'border-studio-borderStrong/70 shadow-[0_6px_16px_-6px_rgba(35,31,32,0.10)] ring-0'
                  : 'border-studio-border shadow-[0_2px_8px_-3px_rgba(35,31,32,0.06)]'
              }`}
            >
              {/* Photo Area */}
              <div className="relative w-full h-[64%] overflow-hidden bg-studio-canvas">
                <img
                  src={cardImage}
                  alt={style.title}
                  className="w-full h-full object-cover object-center pointer-events-none"
                  loading="eager"
                  decoding="async"
                />

                {/* Subtle gradient for label contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/15 pointer-events-none" />

                {/* Studio Fav badge (only on Studio Pick card when in front) */}
                {isFront && style.id === 'sparkle' && (
                  <div className="absolute top-2 left-2 z-10">
                    <span className="text-[9px] font-semibold text-white/95 bg-black/45 backdrop-blur-sm px-2 py-0.5 rounded-full">
                      Studio Fav
                    </span>
                  </div>
                )}

                {/* Expand Photo Button on front card */}
                {isFront && (
                  <button
                    ref={expandBtnRef}
                    type="button"
                    onClick={handleOpenPhotoModal}
                    title={`View ${style.title} photo`}
                    aria-label={`View ${style.title} photo`}
                    className="absolute top-2 right-2 z-10 w-6 h-6 rounded-full bg-white/90 hover:bg-white text-studio-ink flex items-center justify-center transition-transform active:scale-95 shadow-xs"
                  >
                    <Maximize2 className="w-3.5 h-3.5 text-studio-secondary hover:text-studio-ink" />
                  </button>
                )}

                {/* Shape and Length Pill (only on front card to prevent edge clutter on back cards) */}
                {isFront && (
                  <div className="absolute bottom-2 right-2 z-10">
                    <span className="text-[10px] font-medium text-white/95 bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded-full shadow-2xs">
                      {style.shape} • {style.length}
                    </span>
                  </div>
                )}

                {/* Recipe Info Button on front card */}
                {isFront && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowRecipeModal(true);
                    }}
                    title="Nail design details"
                    aria-label="View nail details"
                    className="absolute bottom-2 left-2 z-10 w-6 h-6 rounded-full bg-white/90 hover:bg-white text-studio-ink flex items-center justify-center transition-transform active:scale-95 shadow-xs"
                  >
                    <Info className="w-3.5 h-3.5 text-studio-wine" />
                  </button>
                )}
              </div>

              {/* Bottom Card Copy */}
              <div className="p-2.5 sm:p-3 bg-white flex-1 flex flex-col justify-center text-left border-t border-studio-border/60 relative z-10">
                {isFront ? (
                  <div>
                    <h3 className="font-sans font-bold text-xs sm:text-[13px] text-studio-ink leading-snug">
                      {style.title}
                    </h3>
                    <p className="text-[11px] text-studio-secondary leading-snug mt-0.5 font-normal">
                      {description}
                    </p>
                  </div>
                ) : (
                  // Back card: clean footer without text poke-through
                  <div className="h-full bg-white" aria-hidden="true" />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 2. Mood Selectors Row */}
      <div className="w-full max-w-[320px] flex flex-col items-center gap-1.5 mt-2">
        <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-studio-muted">
          Pick your mood
        </span>

        <div
          role="radiogroup"
          aria-label="Pick your mood"
          className="grid grid-cols-3 gap-2 w-full"
        >
          {heroCards.map((style, idx) => {
            const isSelected = activeIdx === idx;
            const moodLabel = MOOD_LABELS[style.id] || (idx === 0 ? 'Simple' : idx === 1 ? 'Sparkly' : 'Bold');

            return (
              <button
                key={style.id || idx}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => {
                  setActiveHeroStyle(style.id);
                  playStudioChime();
                }}
                className={`min-h-[44px] px-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-center text-center select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-studio-wine active:scale-95 ${
                  isSelected
                    ? 'bg-studio-wine text-white shadow-xs font-bold'
                    : 'bg-studio-surface border border-studio-border text-studio-secondary hover:text-studio-ink hover:border-studio-borderStrong'
                }`}
              >
                {moodLabel}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Nail Recipe Floating Modal */}
      {showRecipeModal && (
        <ModalPortal isOpen={showRecipeModal} onClose={() => setShowRecipeModal(false)}>
          <div
            className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in"
            onClick={() => setShowRecipeModal(false)}
          >
            <div
              className="bg-studio-surface rounded-3xl max-w-sm w-full p-5 sm:p-6 shadow-studio-float border border-studio-border space-y-4 text-xs font-sans relative my-auto animate-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-studio-border">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-studio-wine block">
                    Design Details
                  </span>
                  <h3 className="font-display font-semibold text-base text-studio-ink">
                    {activeCard?.title}
                  </h3>
                </div>
                <button
                  onClick={() => setShowRecipeModal(false)}
                  className="w-8 h-8 rounded-full bg-studio-canvas flex items-center justify-center text-studio-muted hover:text-studio-ink"
                  aria-label="Close modal"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Recipe Details List */}
              <div className="space-y-2.5">
                <div className="p-3 rounded-2xl bg-studio-canvas border border-studio-border space-y-1">
                  <span className="text-[10px] font-bold text-studio-muted uppercase tracking-wider block">
                    Prep & Base
                  </span>
                  <p className="text-xs font-medium text-studio-ink leading-relaxed">
                    {recipeData.prep}
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-studio-canvas border border-studio-border space-y-1">
                  <span className="text-[10px] font-bold text-studio-muted uppercase tracking-wider block">
                    Color & Finish
                  </span>
                  <p className="text-xs font-medium text-studio-ink leading-relaxed">
                    {recipeData.base}
                  </p>
                  <p className="text-xs font-medium text-studio-wine leading-relaxed pt-0.5">
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
                  className="px-4 py-2.5 rounded-xl border border-studio-border text-studio-secondary text-xs font-semibold hover:bg-studio-canvas min-h-[40px]"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowRecipeModal(false);
                    if (onBookHeroStyle) onBookHeroStyle(activeCard?.id);
                  }}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-studio-wine hover:bg-studio-wineHover text-white text-xs font-semibold shadow-studio transition-all active:scale-95 flex items-center justify-center gap-1.5 min-h-[40px]"
                >
                  <span>Book This Look</span>
                </button>
              </div>
            </div>
          </div>
        </ModalPortal>
      )}

      {/* 4. Full-Size Nail Photo Modal */}
      {showPhotoModal && (
        <ModalPortal isOpen={showPhotoModal} onClose={handleClosePhotoModal}>
          <div
            className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-fade-in"
            onClick={handleClosePhotoModal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="hero-photo-modal-title"
          >
            <div
              className="bg-studio-surface rounded-3xl max-w-sm sm:max-w-md w-full overflow-hidden shadow-studio-float border border-studio-border text-xs font-sans relative my-auto animate-in zoom-in-95 duration-200 outline-none"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-3.5 sm:p-4 border-b border-studio-border bg-studio-surface">
                <div className="pr-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-studio-wine block">
                    {activeCard?.shape} • {activeCard?.length}
                  </span>
                  <h3 id="hero-photo-modal-title" className="font-display font-semibold text-base sm:text-lg text-studio-ink line-clamp-1">
                    {activeCard?.title}
                  </h3>
                </div>
                <button
                  ref={closePhotoBtnRef}
                  onClick={handleClosePhotoModal}
                  className="w-8 h-8 rounded-full bg-studio-canvas hover:bg-studio-subtle flex items-center justify-center text-studio-secondary hover:text-studio-ink transition-colors flex-shrink-0"
                  aria-label="Close photo view"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Complete Photo Display without card overlap */}
              <div className="relative bg-studio-canvas p-3 sm:p-4 flex items-center justify-center max-h-[60vh] overflow-hidden">
                <img
                  src={activeCard?.imageUrl || (activeIdx === 0 ? '/hero/soft-simple.jpg' : activeIdx === 1 ? '/hero/little-sparkle.jpg' : '/hero/make-statement.jpg')}
                  alt={activeCard?.title}
                  className="max-h-[52vh] w-auto max-w-full object-contain rounded-2xl shadow-xs"
                />
              </div>

              {/* Footer info & action */}
              <div className="p-3.5 sm:p-4 bg-studio-surface border-t border-studio-border flex items-center justify-between gap-3">
                <p className="text-[11px] text-studio-secondary line-clamp-1 pr-2">
                  {VERIFIED_DESCRIPTIONS[activeCard?.id] || activeCard?.subtitle || ''}
                </p>
                <button
                  type="button"
                  onClick={handleClosePhotoModal}
                  className="px-4 py-2 rounded-xl bg-studio-canvas hover:bg-studio-subtle border border-studio-border text-studio-ink text-xs font-semibold flex-shrink-0 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </ModalPortal>
      )}
    </div>
  );
}
