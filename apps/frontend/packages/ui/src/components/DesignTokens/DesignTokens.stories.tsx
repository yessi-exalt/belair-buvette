import type { Meta, StoryObj } from '@storybook/react';
import { colorTokens } from '../../tokens/colors';
import { typographyTokens } from '../../tokens/typography';
import { spacingTokens, borderRadiusTokens } from '../../tokens/spacing';

const meta: Meta = {
  title: 'Design System/Tokens',
  tags: ['autodocs'],
};

export default meta;

// ─── Color palette ──────────────────────────────────────────────────────────

function ColorSwatch({ name, value }: { name: string; value: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
      <div
        style={{
          width: '48px',
          height: '48px',
          borderRadius: '8px',
          backgroundColor: value,
          border: '1px solid rgba(0,0,0,0.08)',
          flexShrink: 0,
        }}
      />
      <div>
        <div style={{ fontFamily: 'monospace', fontSize: '13px', fontWeight: 600 }}>{name}</div>
        <div style={{ fontFamily: 'monospace', fontSize: '11px', color: '#6b7280' }}>{value}</div>
      </div>
    </div>
  );
}

export const ColorPalette: StoryObj = {
  render: () => (
    <div style={{ fontFamily: 'sans-serif' }}>
      <h2 style={{ marginBottom: '16px' }}>Colors</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '8px 32px' }}>
        {Object.entries(colorTokens).map(([name, value]) => (
          <ColorSwatch key={name} name={name} value={value} />
        ))}
      </div>
    </div>
  ),
};

// ─── Typography ─────────────────────────────────────────────────────────────

export const Typography: StoryObj = {
  render: () => (
    <div style={{ fontFamily: 'sans-serif' }}>
      <h2 style={{ marginBottom: '16px' }}>Font Sizes</h2>
      {Object.entries(typographyTokens)
        .filter(([key]) => key.startsWith('font-size'))
        .map(([name, value]) => (
          <div
            key={name}
            style={{ display: 'flex', alignItems: 'baseline', gap: '16px', marginBottom: '12px' }}
          >
            <span style={{ fontFamily: 'monospace', fontSize: '11px', color: '#6b7280', width: '180px' }}>
              {name}
            </span>
            <span style={{ fontSize: value as string }}>The quick brown fox</span>
            <span style={{ fontFamily: 'monospace', fontSize: '11px', color: '#9ca3af' }}>{value}</span>
          </div>
        ))}
    </div>
  ),
};

// ─── Spacing ────────────────────────────────────────────────────────────────

export const Spacing: StoryObj = {
  render: () => (
    <div style={{ fontFamily: 'sans-serif' }}>
      <h2 style={{ marginBottom: '16px' }}>Spacing Scale</h2>
      {Object.entries(spacingTokens).map(([name, value]) => (
        <div key={name} style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px' }}>
          <span style={{ fontFamily: 'monospace', fontSize: '11px', color: '#6b7280', width: '160px' }}>{name}</span>
          <div
            style={{
              width: value as string,
              height: '24px',
              backgroundColor: '#3b82f6',
              borderRadius: '2px',
              minWidth: '2px',
            }}
          />
          <span style={{ fontFamily: 'monospace', fontSize: '11px', color: '#9ca3af' }}>{value}</span>
        </div>
      ))}
    </div>
  ),
};

// ─── Border radius ──────────────────────────────────────────────────────────

export const BorderRadius: StoryObj = {
  render: () => (
    <div style={{ fontFamily: 'sans-serif' }}>
      <h2 style={{ marginBottom: '24px' }}>Border Radius</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px' }}>
        {Object.entries(borderRadiusTokens).map(([name, value]) => (
          <div key={name} style={{ textAlign: 'center' }}>
            <div
              style={{
                width: '80px',
                height: '80px',
                backgroundColor: '#3b82f6',
                borderRadius: value as string,
                marginBottom: '8px',
              }}
            />
            <div style={{ fontFamily: 'monospace', fontSize: '11px' }}>{name}</div>
            <div style={{ fontFamily: 'monospace', fontSize: '10px', color: '#9ca3af' }}>{value}</div>
          </div>
        ))}
      </div>
    </div>
  ),
};
