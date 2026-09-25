export const COLORS = {
  // ─── Base Backgrounds — Deep Mauve & Soft Pink Blush Palette ──────────────
  bgGradientStart: '#674D66',   // DEEP MAUVE (Image 2)
  bgGradientMid:   '#523B51',   // Rich Mauve Plum
  bgGradientEnd:   '#EBD6DC',   // SOFT PINK BLUSH (Image 2)

  surfaceLight:    '#755673',   // Frosted Mauve surface
  surfaceWarm:     '#5B3F5A',   // Deep Mauve card
  surfacePeach:    '#F7ECF0',   // Soft Pink Blush tinted card
  surfaceBlush:    '#EBD6DC',   // Pure Soft Pink Blush
  surfaceCardDark: '#4A3449',   // Deep Plum Card

  // ─── Glassmorphism — Frosted Glass with Mauve & Blush Tint ────────────────
  surfaceGlass:         'rgba(255, 255, 255, 0.18)',
  surfaceGlassElevated: 'rgba(255, 255, 255, 0.28)',
  surfaceGlassSubtle:   'rgba(255, 255, 255, 0.08)',
  surfaceGlassNavy:     'rgba(103, 77, 102, 0.75)',   // Translucent Deep Mauve
  surfaceGlassBlush:    'rgba(235, 214, 220, 0.30)',  // Translucent Blush

  // ─── Borders ──────────────────────────────────────────────────────────────
  borderGlass:  'rgba(255, 255, 255, 0.35)',
  borderSubtle: 'rgba(255, 255, 255, 0.20)',
  borderActive: '#EBD6DC',
  borderGlow:   'rgba(235, 214, 220, 0.65)',

  // ─── Primary — Soft Pink Blush & Radiant Mauve Accent ─────────────────────
  primary:      '#EBD6DC',   // Soft Pink Blush — Main highlight
  primaryDark:  '#D4BAC2',   // Deeper Blush
  primaryLight: 'rgba(235, 214, 220, 0.20)',
  primaryGlow:  'rgba(235, 214, 220, 0.40)',
  primaryVibrant: '#C24379', // Radiant Magenta-Mauve (from Image 3 CTA)
  primaryVibrantGlow: 'rgba(194, 67, 121, 0.45)',

  // ─── Brand Accents ────────────────────────────────────────────────────────
  accentMauve:     '#674D66',
  accentBlush:     '#EBD6DC',
  accentBerry:     '#8C386A',
  accentNavy:      '#4A3449',
  accentNavyLight: '#7A5B79',
  accentBlue:      '#38BDF8',
  accentBlueLight: 'rgba(56, 189, 248, 0.20)',

  // ─── Warm Accents ─────────────────────────────────────────────────────────
  accentPeach:      '#EBD6DC',
  accentPeachDeep:  '#D4BAC2',
  accentPeachLight: 'rgba(235, 214, 220, 0.20)',
  accentPeachGlow:  'rgba(235, 214, 220, 0.35)',
  accentGold:       '#F59E0B',
  accentGoldBright: '#FCD34D',
  accentGoldLight:  'rgba(245, 158, 11, 0.18)',
  accentGoldGlow:   'rgba(245, 158, 11, 0.25)',
  accentOrange:     '#F97316',

  // Backward compat
  accentTeal:      '#10B981',
  accentTealLight: 'rgba(16, 185, 129, 0.15)',
  accentCyan:      '#38BDF8',
  accentCyanLight: 'rgba(56, 189, 248, 0.15)',
  accentPeachLight2:'rgba(235, 214, 220, 0.15)',

  // ─── Status ───────────────────────────────────────────────────────────────
  success:      '#10B981',
  successLight: 'rgba(16, 185, 129, 0.18)',
  warning:      '#F59E0B',
  warningLight: 'rgba(245, 158, 11, 0.18)',
  danger:       '#EF4444',
  dangerLight:  'rgba(239, 68, 68, 0.18)',
  info:         '#38BDF8',
  infoLight:    'rgba(56, 189, 248, 0.18)',

  // ─── Typography — Dual Contrast for 100% Readability ──────────────────────
  // For dark mauve backgrounds:
  textNavy:      '#FFFFFF',   // Pure White headings
  textBody:      '#F7ECF0',   // Very light blush body
  textSecondary: '#EBD6DC',   // Soft pink blush secondary
  textMuted:     '#C4A9B3',   // Muted blush
  textWhite:     '#FFFFFF',

  // For light/blush cards (guarantees text is NEVER washed out):
  textDarkHead:  '#2B152A',   // Deepest rich plum (crystal clear on white/blush)
  textDarkBody:  '#4A2D48',   // Deep mauve body
  textDarkMuted: '#7D5C7B',   // Medium mauve muted
};
