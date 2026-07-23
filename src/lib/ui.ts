/**
 * Shared UI primitives. Design goals: one radius per role, one shadow level,
 * visible keyboard focus on everything interactive, and a clear 3-tier
 * hierarchy — primary (the one action that matters most on screen), accent
 * (a strong but secondary call to action, used sparingly), and secondary
 * (everything else that's clickable).
 */

const FOCUS =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background";

// No justify-content here on purpose: Tailwind resolves conflicting utilities
// by CSS source order, not by where they appear in the class string, so a
// caller's justify-between/justify-center must not have to fight a baked-in
// default. Each call site sets its own.
const BTN_BASE =
  `inline-flex items-center gap-2 rounded-xl text-sm font-semibold transition-colors duration-150 disabled:opacity-50 disabled:pointer-events-none ${FOCUS}`;

export const BTN_PRIMARY = `${BTN_BASE} bg-primary text-primary-foreground hover:bg-primary/90`;

export const BTN_SECONDARY = `${BTN_BASE} border border-border bg-card text-foreground hover:bg-secondary`;

export const BTN_DESTRUCTIVE = `${BTN_BASE} bg-destructive text-destructive-foreground hover:bg-destructive/90`;

/** Solid, saturated — reserve for the single strongest call to action in a given accent color (e.g. "buy all parts"). */
export const BTN_ACCENT_AMBER = `${BTN_BASE} bg-amber-600 text-white hover:bg-amber-700`;

/** Soft tint — for lower-emphasis, possibly-repeated items in an accent color (individual links/chips). */
export const CHIP_AMBER =
  `flex items-center justify-between gap-2 rounded-xl border border-amber-600/30 bg-amber-500/10 px-3.5 py-2.5 text-sm text-foreground transition-colors duration-150 hover:bg-amber-500/15 ${FOCUS}`;

export const CHIP_RED =
  `flex items-center justify-between gap-2 rounded-xl border border-red-600/30 bg-red-500/10 px-3.5 py-2.5 text-sm text-foreground transition-colors duration-150 hover:bg-red-500/15 ${FOCUS}`;

/** Flat card: one border, one shadow, no gradients or glow. */
export const CARD = "rounded-2xl border border-border bg-card shadow-sm";

export const INPUT =
  `rounded-xl border border-border bg-card text-foreground outline-none transition-colors duration-150 focus-visible:border-primary ${FOCUS}`;
