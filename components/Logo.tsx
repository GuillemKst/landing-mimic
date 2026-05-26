'use client';

import Link from 'next/link';

export interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  theme?: 'light' | 'dark';
  href?: string;
}

const dims: Record<NonNullable<LogoProps['size']>, { square: number; text: number; gap: number }> = {
  sm: { square: 8,  text: 16, gap: 8  },
  md: { square: 10, text: 18, gap: 10 },
  lg: { square: 12, text: 22, gap: 11 },
  xl: { square: 16, text: 28, gap: 12 },
};

export function Logo({ size = 'md', theme = 'light', href = '/' }: LogoProps) {
  const d = dims[size];
  const color = theme === 'light' ? 'var(--c-white)' : 'var(--c-ink)';

  const inner = (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: d.gap }}>
      <span
        style={{ width: d.square, height: d.square, background: 'var(--c-green)', flexShrink: 0 }}
        aria-hidden
      />
      <span
        style={{
          fontFamily: 'var(--font-heading)',
          fontWeight: 700,
          fontSize: d.text,
          letterSpacing: 0.5,
          color,
        }}
      >
        MIMIC
      </span>
    </span>
  );

  if (href.startsWith('/')) {
    return (
      <Link href={href} style={{ textDecoration: 'none', display: 'inline-flex' }}>
        {inner}
      </Link>
    );
  }

  return (
    <a href={href} style={{ textDecoration: 'none', display: 'inline-flex' }}>
      {inner}
    </a>
  );
}
