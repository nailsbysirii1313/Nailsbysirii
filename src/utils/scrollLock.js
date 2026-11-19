import { stopSmoothScroll, startSmoothScroll } from './smoothScroll';

// Utility for thread-safe body & root scroll locking across multiple stacked modals
let lockCount = 0;
let previousBodyOverflow = '';
let previousHtmlOverflow = '';
let previousBodyOverscroll = '';
let previousHtmlOverscroll = '';
let previousBodyPaddingRight = '';

export function lockBodyScroll() {
  if (typeof document === 'undefined') return;

  if (lockCount === 0) {
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    previousBodyOverflow = document.body.style.overflow || '';
    previousHtmlOverflow = document.documentElement.style.overflow || '';
    previousBodyOverscroll = document.body.style.overscrollBehavior || '';
    previousHtmlOverscroll = document.documentElement.style.overscrollBehavior || '';
    previousBodyPaddingRight = document.body.style.paddingRight || '';
    
    // Prevent layout shift on desktop when scrollbar disappears
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    // Prevent background scrolling on desktop & mobile Safari / Android
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overscrollBehavior = 'none';
    document.documentElement.style.overscrollBehavior = 'none';

    // Stop GSAP Lenis momentum scroll while modal is active
    stopSmoothScroll();
  }
  lockCount++;
}

export function unlockBodyScroll() {
  if (typeof document === 'undefined') return;

  lockCount = Math.max(0, lockCount - 1);
  if (lockCount === 0) {
    document.body.style.overflow = previousBodyOverflow;
    document.documentElement.style.overflow = previousHtmlOverflow;
    document.body.style.overscrollBehavior = previousBodyOverscroll;
    document.documentElement.style.overscrollBehavior = previousHtmlOverscroll;
    document.body.style.paddingRight = previousBodyPaddingRight;

    // Resume GSAP Lenis momentum scroll
    startSmoothScroll();
  }
}
