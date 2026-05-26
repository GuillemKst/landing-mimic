'use client';

import React from 'react';
import Link from 'next/link';

export const ICON_PATHS = {
  search: 'M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16Zm0 0 6 6',
  arrowLeft: 'M19 12H5M12 19l-7-7 7-7',
  arrowRight: 'M5 12h14M12 5l7 7-7 7',
  chevronDown: 'm6 9 6 6 6-6',
  chevronUp: 'm6 15 6-6 6 6',
  chevronRight: 'm9 6 6 6-6 6',
  star: 'M12 2 14.8 8.6 22 9.3l-5.5 4.7 1.7 7L12 17.3 5.8 21l1.7-7L2 9.3l7.2-.7z',
  starFilled: 'M12 2 14.8 8.6 22 9.3l-5.5 4.7 1.7 7L12 17.3 5.8 21l1.7-7L2 9.3l7.2-.7z',
  check: 'M5 12l4 4L19 7',
  x: 'M18 6 6 18M6 6l12 12',
  shield: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z',
  zap: 'M13 2 3 14h9l-1 8 10-12h-9l1-8Z',
  clock: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20ZM12 6v6l4 2',
  building: 'M3 21V8l9-5 9 5v13M9 21V12h6v9M3 21h18',
  fileText: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6ZM14 2v6h6M8 13h8M8 17h8M8 9h2',
} as const;

export type IconName = keyof typeof ICON_PATHS;

interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
  stroke?: number;
  style?: React.CSSProperties;
  className?: string;
  filled?: boolean;
}

export function Icon({ name, size = 18, color, stroke = 1.7, style, className = '', filled }: IconProps) {
  const d = ICON_PATHS[name] ?? ICON_PATHS.search;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? color || 'currentColor' : 'none'}
      stroke={filled ? 'none' : color || 'currentColor'}
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={{ flexShrink: 0, ...style }}
      aria-hidden
    >
      <path d={d} />
    </svg>
  );
}

interface ButtonBaseProps {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'lg';
  full?: boolean;
  style?: React.CSSProperties;
  className?: string;
  children?: React.ReactNode;
}

interface ButtonAsAnchor extends ButtonBaseProps {
  href: string;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
  disabled?: never;
  type?: never;
}

interface ButtonAsButton extends ButtonBaseProps {
  href?: never;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  type?: React.ButtonHTMLAttributes<HTMLButtonElement>['type'];
}

type ButtonProps = ButtonAsAnchor | ButtonAsButton;

const VARIANT_MAP: Record<string, string> = {
  primary: 'btn btn-primary',
  secondary: 'btn btn-secondary',
  ghost: 'btn btn-ghost',
};

export function Button(props: ButtonProps) {
  const { variant = 'primary', size, full, style, className = '', children } = props;
  const sizeCls = size === 'sm' ? ' btn-sm' : size === 'lg' ? ' btn-lg' : '';
  const cls = `${VARIANT_MAP[variant] || VARIANT_MAP.primary}${sizeCls}${full ? ' btn-full' : ''} ${className}`.trim();

  if ('href' in props && props.href) {
    const isExternal = props.href.startsWith('http');
    if (isExternal) {
      return (
        <a className={cls} href={props.href} style={style} target="_blank" rel="noopener noreferrer">
          {children}
        </a>
      );
    }
    return (
      <Link className={cls} href={props.href} style={style}>
        {children}
      </Link>
    );
  }

  const { onClick, disabled, type = 'button' } = props as ButtonAsButton;
  return (
    <button className={cls} type={type} onClick={onClick} disabled={disabled} style={style}>
      {children}
    </button>
  );
}
