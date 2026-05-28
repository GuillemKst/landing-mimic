'use client';

import Link from 'next/link';

export interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  theme?: 'light' | 'dark';
  href?: string;
}

const dims: Record<NonNullable<LogoProps['size']>, { icon: number; text: number; gap: number }> = {
  sm: { icon: 22,  text: 16, gap: 8  },
  md: { icon: 28, text: 18, gap: 10 },
  lg: { icon: 34, text: 22, gap: 11 },
  xl: { icon: 42, text: 28, gap: 12 },
};

export function Logo({ size = 'md', theme = 'light', href = '/' }: LogoProps) {
  const d = dims[size];
  const color = theme === 'light' ? 'var(--c-white)' : 'var(--c-ink)';

  const inner = (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: d.gap }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logo-mimic.png"
        alt="MIMIC"
        width={d.icon}
        height={d.icon}
        style={{ borderRadius: d.icon * 0.18, flexShrink: 0 }}
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
