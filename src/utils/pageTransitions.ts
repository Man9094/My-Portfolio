import type { Variants } from 'motion/react';

/**
 * Shared Page Transition & Reveal Variants
 * High-performance, staggered entrance animations for every route entry.
 */

// Top-level page container with orchestrated child stagger
export const pageContainerVariants: Variants = {
  initial: {
    opacity: 0,
    y: 14,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: [0.16, 1, 0.3, 1],
      when: 'beforeChildren',
      staggerChildren: 0.08,
      delayChildren: 0.04,
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: {
      duration: 0.22,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

// Mask reveal for page titles (heading lines rise up out of an overflow-hidden mask)
export const titleMaskVariants: Variants = {
  initial: {
    y: '100%',
    opacity: 0,
  },
  animate: {
    y: '0%',
    opacity: 1,
    transition: {
      duration: 0.65,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

// Tagline / category label reveal
export const tagVariants: Variants = {
  initial: {
    opacity: 0,
    y: 10,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

// Content block settle with subtle upward move and scale
export const contentBlockVariants: Variants = {
  initial: {
    opacity: 0,
    y: 24,
    scale: 0.98,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.55,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

// Card / Grid Item Stagger
export const cardItemVariants: Variants = {
  initial: {
    opacity: 0,
    y: 28,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

// Media / Portrait Frame scale settle
export const mediaFrameVariants: Variants = {
  initial: {
    opacity: 0,
    scale: 0.94,
    y: 20,
  },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.65,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

// Re-entry viewport configuration with separate enter/exit thresholds
export const reentryViewportConfig = {
  once: false,
  amount: 0.2,
  margin: '0px 0px -40px 0px',
};
