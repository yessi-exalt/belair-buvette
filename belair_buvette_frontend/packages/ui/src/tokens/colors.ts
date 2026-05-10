/**
 * Design Tokens — Colors
 *
 * Define your brand color palette here.
 * These CSS custom properties are the single source of truth for all colors across the design system.
 */
export const colorTokens = {
  // ─── Brand ─────────────────────────────────────────────────────────────────
  'color-brand-50': '#eff6ff',
  'color-brand-100': '#dbeafe',
  'color-brand-200': '#bfdbfe',
  'color-brand-300': '#93c5fd',
  'color-brand-400': '#60a5fa',
  'color-brand-500': '#3b82f6',
  'color-brand-600': '#2563eb',
  'color-brand-700': '#1d4ed8',
  'color-brand-800': '#1e40af',
  'color-brand-900': '#1e3a8a',

  // ─── Neutral ────────────────────────────────────────────────────────────────
  'color-neutral-0': '#ffffff',
  'color-neutral-50': '#f9fafb',
  'color-neutral-100': '#f3f4f6',
  'color-neutral-200': '#e5e7eb',
  'color-neutral-300': '#d1d5db',
  'color-neutral-400': '#9ca3af',
  'color-neutral-500': '#6b7280',
  'color-neutral-600': '#4b5563',
  'color-neutral-700': '#374151',
  'color-neutral-800': '#1f2937',
  'color-neutral-900': '#111827',
  'color-neutral-950': '#030712',

  // ─── Semantic ───────────────────────────────────────────────────────────────
  'color-success-light': '#d1fae5',
  'color-success-default': '#10b981',
  'color-success-dark': '#065f46',

  'color-warning-light': '#fef3c7',
  'color-warning-default': '#f59e0b',
  'color-warning-dark': '#92400e',

  'color-error-light': '#fee2e2',
  'color-error-default': '#ef4444',
  'color-error-dark': '#991b1b',

  'color-info-light': '#dbeafe',
  'color-info-default': '#3b82f6',
  'color-info-dark': '#1e40af',
} as const;

export type ColorToken = keyof typeof colorTokens;
