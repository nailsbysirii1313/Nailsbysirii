import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import Lenis from 'lenis';

// Register GSAP plugins globally
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
}

let lenisInstance = null;
let tickerCallback = null;

/**
 * Initialize GSAP-driven smooth scrolling with Lenis
 */
export function initSmoothScroll() {
  if (typeof window === 'undefined') return null;
  if (lenisInstance) return lenisInstance;

  try {
    lenisInstance = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.2,
      infinite: false,
    });

    // Synchronize Lenis scroll position with GSAP ScrollTrigger
    lenisInstance.on('scroll', ScrollTrigger.update);

    // Drive Lenis RAF loop through GSAP's master ticker
    tickerCallback = (time) => {
      if (lenisInstance) {
        lenisInstance.raf(time * 1000);
      }
    };
    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0);

    // Global listener for smooth anchor navigation with GSAP
    const handleAnchorClick = (e) => {
      const anchor = e.target.closest('a[href^="#"]');
      if (!anchor) return;

      const href = anchor.getAttribute('href');
      if (!href || href === '#' || href === '#/') return;

      // Skip studio hub and invoice router hashes
      if (
        href.startsWith('#invoice-') ||
        href.startsWith('#catalogue') ||
        href.startsWith('#studio') ||
        href.startsWith('#pressons')
      ) {
        return;
      }

      const targetId = href.replace('#', '');
      const targetElement = document.getElementById(targetId) || document.querySelector(href);

      if (targetElement) {
        e.preventDefault();
        scrollToTarget(targetElement, { offset: -70 });

        if (window.history && window.history.pushState) {
          window.history.pushState(null, '', href);
        }
      }
    };

    document.addEventListener('click', handleAnchorClick, { passive: false });

    // Expose lenis and gsap on window for verification & inspect
    window.__lenis = lenisInstance;
    window.__gsap = gsap;

    return lenisInstance;
  } catch (err) {
    console.warn('Failed to initialize GSAP smooth scroll:', err);
    return null;
  }
}

/**
 * Smoothly scroll to a specific target (selector, HTMLElement, or number)
 */
export function scrollToTarget(target, options = {}) {
  const mergedOptions = {
    offset: -70,
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    ...options,
  };

  if (lenisInstance) {
    lenisInstance.scrollTo(target, mergedOptions);
  } else if (typeof window !== 'undefined') {
    // Fallback using GSAP ScrollToPlugin directly
    if (typeof target === 'number') {
      gsap.to(window, {
        duration: 1.2,
        scrollTo: { y: target, autoKill: true },
        ease: 'power3.out',
      });
    } else {
      const el = typeof target === 'string' ? document.querySelector(target) : target;
      if (el) {
        gsap.to(window, {
          duration: 1.2,
          scrollTo: { y: el, offsetY: Math.abs(mergedOptions.offset), autoKill: true },
          ease: 'power3.out',
        });
      }
    }
  }
}

/**
 * Temporarily pause smooth scroll (used when modals are open)
 */
export function stopSmoothScroll() {
  if (lenisInstance) {
    lenisInstance.stop();
  }
}

/**
 * Resume smooth scroll (when all modals are closed)
 */
export function startSmoothScroll() {
  if (lenisInstance) {
    lenisInstance.start();
  }
}

/**
 * Get active Lenis instance
 */
export function getSmoothScroll() {
  return lenisInstance;
}

/**
 * Cleanup function on teardown
 */
export function destroySmoothScroll() {
  if (tickerCallback) {
    gsap.ticker.remove(tickerCallback);
    tickerCallback = null;
  }
  if (lenisInstance) {
    lenisInstance.destroy();
    lenisInstance = null;
  }
}
