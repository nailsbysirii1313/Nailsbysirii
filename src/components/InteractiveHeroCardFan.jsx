import React, { useState, useRef, useEffect } from 'react';
import { X, Maximize2 } from 'lucide-react';
import { playStudioChime } from '../utils/audio';
import ModalPortal from './ModalPortal';

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
    const len = heroCards.length;
    const nextIdx = (activeIdx + direction + len) % len;
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
  const transitionDuration = prefersReducedMotion ? '0ms' : '300ms';
  const transitionEase = 'cubic-bezier(0.2, 0.8, 0.2, 1)';
  const totalCards = heroCards.length || 1;

  return (
    <div className={`relative flex flex-col items-center select-none w-full ${className}`}>
      {/* 1. Touch & Mouse Interactive Booklet Fan Deck Container */}
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

        {/* Booklet Overlapping Cards */}
        {heroCards.map((style, idx) => {
          const isFront = activeIdx === idx;
          const diff = (idx - activeIdx + totalCards) % totalCards;
          const isRight = diff === 1;
          const isLeft = diff === totalCards - 1;

          // Card transformation calculation based on position & dragOffset
          let transformStyle = {};
          let zIndex = 10;
          let opacity = 0;
          let cursor = 'default';
          let isInteractive = isFront || isRight || isLeft;

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
          } else if (isRight) {
            // Right Card: default translate right +8deg
            zIndex = 15;
            cursor = 'pointer';
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
          } else if (isLeft) {
            // Left Card: default translate left -8deg
            zIndex = 15;
            cursor = 'pointer';
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
          } else {
            // Deep stacked cards in booklet: hidden offstage until cycled
            zIndex = 5;
            opacity = 0;
            cursor = 'default';
            transformStyle = {
              transform: 'translate3d(0px, 0px, -40px) scale(0.85)',
              transition: `transform ${transitionDuration} ${transitionEase}, opacity ${transitionDuration} ease`,
              pointerEvents: 'none'
            };
          }

          const fallbackImg = '/hero/soft-simple.jpg';
          const cardImage = style.imageUrl || fallbackImg;
          const description = style.subtitle || style.description || '';

          return (
            <div
              key={style.id || idx}
              role={!isFront && isInteractive ? 'button' : undefined}
              aria-label={!isFront && isInteractive ? `Select ${style.title}` : undefined}
              onClick={() => {
                if (!isFront && isInteractive) {
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

                {/* Subtle gradient for contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10 pointer-events-none" />

                {/* Studio Tag / Badge (if configured in Studio Hub) */}
                {isFront && style.tag && (
                  <div className="absolute top-2 left-2 z-10">
                    <span className="text-[9px] font-semibold text-white/95 bg-black/45 backdrop-blur-sm px-2 py-0.5 rounded-full">
                      {style.tag}
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

      {/* 2. Booklet Cards Pagination Indicator */}
      <div className="flex items-center justify-center gap-1.5 mt-2.5 mb-1 select-none" aria-label="Booklet cards navigation">
        {heroCards.map((card, i) => (
          <button
            key={card.id || i}
            type="button"
            onClick={() => {
              setActiveHeroStyle(card.id);
              playStudioChime();
            }}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              activeIdx === i
                ? 'w-6 bg-studio-wine'
                : 'w-1.5 bg-studio-borderStrong/50 hover:bg-studio-muted'
            }`}
            aria-label={`View look ${i + 1}: ${card.title}`}
          />
        ))}
      </div>

      {/* 3. Full-Size Nail Photo Modal */}
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
                    {activeCard?.tag || 'Signature Look'}
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
                  src={activeCard?.imageUrl || '/hero/soft-simple.jpg'}
                  alt={activeCard?.title}
                  className="max-h-[52vh] w-auto max-w-full object-contain rounded-2xl shadow-xs"
                />
              </div>

              {/* Footer info & action */}
              <div className="p-3.5 sm:p-4 bg-studio-surface border-t border-studio-border flex items-center justify-between gap-3">
                <p className="text-[11px] text-studio-secondary line-clamp-1 pr-2">
                  {activeCard?.subtitle || activeCard?.description || ''}
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
