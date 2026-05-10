/**
 * Design Tokens — Spacing
 *
 * A consistent spacing scale based on a 4px base unit.
 */
export const spacingTokens = {
  'spacing-0': '0px',
  'spacing-px': '1px',
  'spacing-0.5': '2px',
  'spacing-1': '4px',
  'spacing-1.5': '6px',
  'spacing-2': '8px',
  'spacing-2.5': '10px',
  'spacing-3': '12px',
  'spacing-3.5': '14px',
  'spacing-4': '16px',
  'spacing-5': '20px',
  'spacing-6': '24px',
  'spacing-7': '28px',
  'spacing-8': '32px',
  'spacing-9': '36px',
  'spacing-10': '40px',
  'spacing-12': '48px',
  'spacing-14': '56px',
  'spacing-16': '64px',
  'spacing-20': '80px',
  'spacing-24': '96px',
  'spacing-32': '128px',
  'spacing-40': '160px',
  'spacing-48': '192px',
  'spacing-56': '224px',
  'spacing-64': '256px',
} as const;

/**
 * Border radii tokens
 */
export const borderRadiusTokens = {
  'radius-none': '0px',
  'radius-sm': '2px',
  'radius-base': '4px',
  'radius-md': '6px',
  'radius-lg': '8px',
  'radius-xl': '12px',
  'radius-2xl': '16px',
  'radius-3xl': '24px',
  'radius-full': '9999px',
} as const;

/**
 * Shadow tokens
 */
export const shadowTokens = {
  'shadow-none': 'none',
  'shadow-sm': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  'shadow-base': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  'shadow-md': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  'shadow-lg': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  'shadow-xl': '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  'shadow-2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  'shadow-inner': 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
} as const;

export type SpacingToken = keyof typeof spacingTokens;
export type BorderRadiusToken = keyof typeof borderRadiusTokens;
export type ShadowToken = keyof typeof shadowTokens;
