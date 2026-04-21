// ─────────────────────────────────────────────────────────────────────────────
// Savoury — Motion Design Token System
// Philosophy: purposeful, subtle, physics-based. Every animation has a reason.
// ─────────────────────────────────────────────────────────────────────────────

// ── Timing (seconds) ─────────────────────────────────────────────────────────
export const DURATION = {
  instant: 0.08,  // button press snap
  fast:    0.15,  // hover state transitions
  medium:  0.3,   // UI transitions
  slow:    0.5,   // section reveals
  slower:  0.7,   // complex multi-step reveals
};

// ── Easing Curves ────────────────────────────────────────────────────────────
export const EASE = {
  out:     [0.0,  0.0, 0.2, 1.0],      // decelerating — for entrances
  in:      [0.4,  0.0, 1.0, 1.0],      // accelerating — for exits
  inOut:   [0.4,  0.0, 0.2, 1.0],      // symmetric — for transitions
  premium: [0.25, 0.46, 0.45, 0.94],   // Savoury signature curve
  back:    [0.34, 1.56, 0.64, 1],      // slight overshoot — delightful
};

// ── Spring Presets ───────────────────────────────────────────────────────────
export const SPRING = {
  gentle: { type: 'spring', stiffness: 120, damping: 20, mass: 0.8 },
  smooth: { type: 'spring', stiffness: 200, damping: 25, mass: 0.5 },
  snappy: { type: 'spring', stiffness: 350, damping: 28, mass: 0.3 },
  bouncy: { type: 'spring', stiffness: 400, damping: 18 },
  stiff:  { type: 'spring', stiffness: 600, damping: 35 },
};

// ── Viewport Config ──────────────────────────────────────────────────────────
// Use this for all whileInView scroll reveals
export const VIEWPORT = { once: true, margin: '-60px' };

// ── Reusable Variants ────────────────────────────────────────────────────────

/** Fade in + rise from below */
export const fadeInUp = (delay = 0, distance = 20) => ({
  hidden:  { opacity: 0, y: distance },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: DURATION.slow, ease: EASE.premium, delay },
  },
});

/** Fade in + slide from left */
export const slideInLeft = (delay = 0) => ({
  hidden:  { opacity: 0, x: -30 },
  visible: {
    opacity: 1, x: 0,
    transition: { duration: DURATION.slow, ease: EASE.premium, delay },
  },
});

/** Fade in + slide from right */
export const slideInRight = (delay = 0) => ({
  hidden:  { opacity: 0, x: 30 },
  visible: {
    opacity: 1, x: 0,
    transition: { duration: DURATION.slow, ease: EASE.premium, delay },
  },
});

/** Scale in from slightly smaller */
export const scaleIn = (delay = 0) => ({
  hidden:  { opacity: 0, scale: 0.92 },
  visible: {
    opacity: 1, scale: 1,
    transition: { duration: DURATION.medium, ease: EASE.premium, delay },
  },
});

/** Stagger container — wraps items that reveal sequentially */
export const staggerContainer = (stagger = 0.1, delayChildren = 0) => ({
  hidden:  {},
  visible: { transition: { staggerChildren: stagger, delayChildren } },
});

/** Individual item for staggered lists */
export const staggerItem = {
  hidden:  { opacity: 0, y: 16 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: DURATION.slow, ease: EASE.premium },
  },
};
