/** Glass bubble button system: translucent, blurred, pill-shaped, with a glossy top highlight. */

export const GLASS_BASE =
  "relative overflow-hidden rounded-full border backdrop-blur-md ring-1 ring-white/20 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:hover:translate-y-0 before:pointer-events-none before:absolute before:inset-x-2 before:top-0.5 before:h-2/5 before:rounded-full before:bg-gradient-to-b before:from-white/60 before:to-transparent before:blur-[2px] before:content-['']";

export const GLASS_PRIMARY =
  GLASS_BASE +
  " border-white/30 bg-gradient-to-b from-primary/40 via-primary/70 to-primary/90 text-primary-foreground shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40";

export const GLASS_AMBER =
  GLASS_BASE +
  " border-amber-300/40 bg-gradient-to-b from-amber-300/30 via-amber-500/45 to-amber-600/60 text-foreground shadow-lg shadow-amber-900/10 hover:shadow-xl hover:shadow-amber-600/25 hover:border-amber-400/60";

export const GLASS_RED =
  GLASS_BASE +
  " border-red-300/40 bg-gradient-to-b from-red-300/30 via-red-500/45 to-red-600/60 text-foreground shadow-lg shadow-red-900/10 hover:shadow-xl hover:shadow-red-600/25 hover:border-red-400/60";

export const GLASS_NEUTRAL =
  GLASS_BASE +
  " border-white/25 bg-gradient-to-b from-white/15 via-white/5 to-transparent text-foreground shadow-lg shadow-black/10 hover:shadow-xl hover:shadow-black/15";

export const GLASS_DESTRUCTIVE =
  GLASS_BASE +
  " border-white/30 bg-gradient-to-b from-destructive/40 via-destructive/70 to-destructive/90 text-destructive-foreground shadow-lg shadow-destructive/30 hover:shadow-xl hover:shadow-destructive/40";
