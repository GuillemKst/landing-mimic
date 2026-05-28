'use client';

/* =========================================================================
 * MIMIC — Landing V2 (improved)
 *
 * Key improvements over V1:
 * - Dark hero with stronger visual impact
 * - Social proof / testimonials section
 * - Animated product demo (search → winners → generate → script)
 * - Better visual hierarchy and spacing
 * - Animated number counters
 * - Smoother FAQ accordion with CSS transitions
 * - Stronger CTA placement throughout
 * ========================================================================= */

import {
  useState,
  useEffect,
  useLayoutEffect,
  useRef,
  useMemo,
  useCallback,
  createContext,
  useContext,
  type FC,
  type ReactNode,
} from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Logo } from '@/components/Logo';
import { Icon, Button } from '@/components/ui/common';
import '@/styles/landing2.css';
import '@/styles/hero-scene.css';

type LandingTheme = 'mix' | 'light' | 'dark';

const LandingThemeContext = createContext<{
  theme: LandingTheme;
  setTheme: (theme: LandingTheme) => void;
}>({ theme: 'mix', setTheme: () => {} });

function useLandingTheme() {
  return useContext(LandingThemeContext);
}

function LandingThemeToggle() {
  const { theme, setTheme } = useLandingTheme();
  const options: { id: LandingTheme; label: string }[] = [
    { id: 'mix', label: 'Mix' },
    { id: 'light', label: 'Claro' },
    { id: 'dark', label: 'Oscuro' },
  ];

  return (
    <div className="landing2-theme-toggle" role="group" aria-label="Tema de la landing">
      {options.map((opt) => (
        <button
          key={opt.id}
          type="button"
          className={theme === opt.id ? 'active' : ''}
          onClick={() => setTheme(opt.id)}
          aria-pressed={theme === opt.id}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function Sq({ size = 8, color = 'var(--c-green)', style }: { size?: number; color?: string; style?: React.CSSProperties }) {
  return <span style={{ width: size, height: size, background: color, display: 'inline-block', flexShrink: 0, ...style }} aria-hidden />;
}

function useCountUp(target: number, duration = 1800, enabled = true) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    if (!enabled || started.current) return;
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const animate = (now: number) => {
            const progress = Math.min(1, (now - start) / duration);
            const eased = 1 - Math.pow(1 - progress, 3);
            setValue(Math.round(target * eased));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration, enabled]);

  return { value, ref };
}

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = () => setMatches(mq.matches);
    onChange();
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [query]);

  return matches;
}

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, visible };
}

// =========================================================================
// NAV
// =========================================================================

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const { theme } = useLandingTheme();
  const logoTheme = theme === 'light' ? 'dark' : 'light';

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <header className="landing2-nav" style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      background: scrolled ? 'var(--l2-nav-bg-scrolled)' : 'transparent',
      backdropFilter: scrolled ? 'blur(12px)' : 'none',
      borderBottom: scrolled ? '1px solid var(--l2-nav-border-scrolled)' : '1px solid transparent',
      transition: 'all 300ms ease',
    }}>
      <div style={{
        maxWidth: 1200, margin: '0 auto',
        padding: '14px 24px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <Logo size="md" theme={logoTheme} href="/landing-old" />
        <nav className="landing2-nav-links" style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
          <LandingThemeToggle />
          <a href="#como-funciona" style={{ color: 'var(--l2-nav-link)', padding: '8px 14px', fontSize: 14, fontFamily: 'var(--font-body)', textDecoration: 'none', transition: 'color 150ms' }}>
            Cómo funciona
          </a>
          <a href="#precio" style={{ color: 'var(--l2-nav-link)', padding: '8px 14px', fontSize: 14, fontFamily: 'var(--font-body)', textDecoration: 'none', transition: 'color 150ms' }}>
            Precio
          </a>
          <a href="#faq" style={{ color: 'var(--l2-nav-link)', padding: '8px 14px', fontSize: 14, fontFamily: 'var(--font-body)', textDecoration: 'none', transition: 'color 150ms' }}>
            FAQ
          </a>
          <Link href="/login" style={{ color: 'var(--l2-nav-login)', padding: '8px 14px', fontSize: 14, fontFamily: 'var(--font-body)', fontWeight: 600, textDecoration: 'none' }}>
            Entrar
          </Link>
          <Button variant="primary" size="sm" href="/checkout" style={{ marginLeft: 8 }}>
            Probar 7 días — 9 €
          </Button>
        </nav>
      </div>
    </header>
  );
}

// =========================================================================
// DARK HERO
// =========================================================================

function HeroSection() {
  const isMobile = useMediaQuery('(max-width: 720px)');

  return (
    <section className="landing2-hero" style={{
      background: 'var(--l2-hero-bg)',
      position: 'relative',
      overflow: 'hidden',
      paddingTop: 100,
    }}>
      {/* Gradient orbs */}
      <div style={{ position: 'absolute', top: -100, left: '15%', width: 500, height: 500, background: 'radial-gradient(circle, rgba(16,190,134,0.15) 0%, transparent 65%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: -80, right: '10%', width: 400, height: 400, background: 'radial-gradient(circle, rgba(16,190,134,0.08) 0%, transparent 65%)', pointerEvents: 'none' }} />
      {/* Grid pattern overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'linear-gradient(var(--l2-hero-grid) 1px, transparent 1px), linear-gradient(90deg, var(--l2-hero-grid) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: 1080, margin: '0 auto', padding: '0 24px', position: 'relative', textAlign: 'center' }}>
        {/* Badge */}
        <div style={{ marginBottom: 24 }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(16,190,134,0.10)', border: '1px solid rgba(16,190,134,0.25)',
            padding: '6px 16px', borderRadius: 999,
            fontSize: 13, color: 'var(--c-green-bright)', fontFamily: 'var(--font-body)', fontWeight: 500,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--c-green)', boxShadow: '0 0 8px var(--c-green)' }} />
            Para quienes ya invierten en Meta Ads y crean creatividades cada semana
          </span>
        </div>

        {/* H1 */}
        <h1 style={{
          fontFamily: 'var(--font-heading)',
          fontWeight: 700,
          fontSize: 'clamp(32px, 5vw, 56px)',
          lineHeight: 1.15,
          letterSpacing: '-0.025em',
          color: 'var(--l2-hero-title)',
          marginBottom: 28,
          maxWidth: 900,
          marginLeft: 'auto', marginRight: 'auto',
        }}>
          Para de inventar guiones{' '}
          <span style={{
            textDecoration: 'line-through',
            textDecorationColor: 'var(--c-error)',
            textDecorationThickness: 3,
            opacity: 0.75,
          }}>desde cero</span>.<br />
          <span style={{ color: 'var(--c-green)' }}>
            Créalos desde lo que tu mercado ya validó.
          </span>
        </h1>

        {/* Subhead */}
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: 'clamp(16px, 2vw, 19px)',
          lineHeight: 1.6,
          color: 'var(--l2-hero-sub)',
          maxWidth: 680,
          margin: '0 auto 36px',
        }}>
          MIMIC selecciona los anuncios ganadores de tu sector
          y genera un guion original adaptado a tu negocio —
          hook, estructura, ángulo y CTA que el mercado ya demostró que convierte.
          {' '}<strong style={{ color: 'var(--l2-hero-title)' }}>Grabas con ventaja, no con fe.</strong>
        </p>

        {/* CTAs */}
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 12 }}>
          <Button variant="primary" size="lg" href="/checkout" style={{ minWidth: 260, fontSize: 16 }}>
            <Icon name="zap" size={18} /> Probar 7 días por 9 €
          </Button>
          <a href="#como-funciona" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            color: 'var(--c-green-bright)', padding: '14px 20px',
            fontSize: 15, fontFamily: 'var(--font-body)', fontWeight: 500,
            textDecoration: 'none', transition: 'opacity 150ms',
          }}>
            Ver cómo funciona
            <Icon name="arrowRight" size={16} color="var(--c-green-bright)" />
          </a>
        </div>
        <p style={{ fontSize: 13, color: 'var(--l2-hero-sub)', fontFamily: 'var(--font-body)' }}>
          7 días. Si no grabas al menos un vídeo con más confianza, te devolvemos los 9 €. Sin emails. Sin excusas.
        </p>

        {/* Product preview — oculto en móvil */}
        {!isMobile && (
          <div className="landing2-hero-preview" style={{ marginTop: 56, position: 'relative' }}>
            <ProductPreview />
          </div>
        )}
      </div>
    </section>
  );
}

// ─── Animated product preview (hero demo) ────────────────────────────────────

const PREVIEW_ADS = [
  { id: 'p1', company: 'Clínica Premium', handle: '@clinicaesteticapremium', initials: 'CP', target: 347, isWinner: true,  tint: ['#1F3D33', '#0F2620'] as [string, string], video: true, thumbnailUrl: '/mock-ads/ad-001.jpg' },
  { id: 'p2', company: 'MedSpa Madrid', handle: '@medspamadridoficial', initials: 'MM', target: 213, isWinner: true,  tint: ['#1E3D3B', '#0E2422'] as [string, string], video: true, thumbnailUrl: '/mock-ads/ad-002.jpg' },
  { id: 'p3', company: 'Centro Láser', handle: '@laservital', initials: 'CL', target: 180, isWinner: true,  tint: ['#243E36', '#142420'] as [string, string], video: false, thumbnailUrl: '/mock-ads/ad-003.jpg' },
  { id: 'p4', company: 'Clínica Belle', handle: '@clinicabelle.es', initials: 'CB', target: 92,  isWinner: false, tint: ['#293B33', '#162420'] as [string, string], video: true, thumbnailUrl: '/mock-ads/ad-004.jpg' },
  { id: 'p5', company: 'Renova Estética', handle: '@renovaestetica', initials: 'RE', target: 67, isWinner: false, tint: ['#2E3D33', '#192420'] as [string, string], video: true, thumbnailUrl: '/mock-ads/ad-005.jpg' },
];

const PREVIEW_SCRIPT = [
  {
    id: 'hook',
    title: 'HOOK DE APERTURA',
    timing: '0-3 s',
    say: '¿Te miras al espejo y ya no te reconoces? Hoy te cuento qué ha cambiado la confianza de cientos de pacientes en Clínica Estética Carmen.',
    visual: 'Plano cerrado a cámara. Doctora sostiene espejo. Texto en pantalla: "¿Te reconoces?"',
  },
  {
    id: 'problema',
    title: 'PROBLEMA / DOLOR',
    timing: '3-10 s',
    say: 'La mayoría busca cirugía sin saber que existen tratamientos no invasivos con resultados visibles en pocas semanas.',
    visual: 'Plano de móvil con anuncio genérico de estética. Corte a paciente indecisa en consulta.',
  },
  {
    id: 'solucion',
    title: 'SOLUCIÓN / PROPUESTA',
    timing: '10-22 s',
    say: 'En Clínica Estética Carmen combinamos tecnología láser premium con consulta personalizada. Sin lista de espera.',
    visual: 'Plano de consulta real, equipo láser al fondo. Texto: "Consulta sin compromiso".',
  },
  {
    id: 'cta',
    title: 'CTA / CIERRE',
    timing: '22-30 s',
    say: 'Reserva tu valoración gratuita esta semana. Solo 12 plazas — agenda en el enlace.',
    visual: 'Doctora señala enlace en pantalla. Botón CTA verde superpuesto.',
  },
];

const PREVIEW_SEARCH = 'Clínica Estética Premium';

const PREVIEW_SOURCE = PREVIEW_ADS[1]; // MedSpa Madrid — anuncio fuente del guión
const PREVIEW_WINNERS = PREVIEW_ADS.filter((ad) => ad.isWinner);

const PREVIEW_PHASES = [
  { id: 'input', startMs: 0 },
  { id: 'searching', startMs: 1600 },
  { id: 'results', startMs: 2800 },
  { id: 'analyzing', startMs: 5200 },
  { id: 'output', startMs: 7200 },
  { id: 'cursor', startMs: 8600 },
  { id: 'click', startMs: 9800 },
  { id: 'generating', startMs: 10400 },
  { id: 'script', startMs: 11400 },
] as const;

const PREVIEW_LOOP_MS = 16800;

function usePreviewTypewriter(text: string, opts: { speedMs?: number; enabled?: boolean } = {}) {
  const { speedMs = 38, enabled = true } = opts;
  const [out, setOut] = useState('');
  useEffect(() => {
    if (!enabled) { setOut(text); return; }
    setOut('');
    let i = 0;
    const iv = setInterval(() => {
      i += 1;
      setOut(text.slice(0, i));
      if (i >= text.length) clearInterval(iv);
    }, speedMs);
    return () => clearInterval(iv);
  }, [text, enabled, speedMs]);
  return out;
}

function usePreviewTickUp(target: number, ms: number, enabled = true, resetKey = 0) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!enabled) { setN(0); return; }
    setN(0);
    const start = performance.now();
    let raf: number;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / ms);
      setN(Math.round(target * (1 - Math.pow(1 - p, 2))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, ms, enabled, resetKey]);
  return n;
}

function PreviewSearchBar({ typing, searching, loopKey }: { typing: boolean; searching: boolean; loopKey: number }) {
  const text = usePreviewTypewriter(PREVIEW_SEARCH, { speedMs: 42, enabled: typing });
  const showText = typing ? text : PREVIEW_SEARCH;
  return (
    <div className="hero-search" key={`search-${loopKey}`}>
      <div className="hero-search-input" style={searching ? { borderColor: 'var(--c-green)', boxShadow: '0 0 0 3px rgba(16,190,134,0.1)' } : undefined}>
        <Icon name="search" size={16} color="var(--c-green)" />
        <span className="hero-search-text">
          {showText}
          {typing && text.length < PREVIEW_SEARCH.length && <span className="hero-cursor">|</span>}
        </span>
      </div>
      <div className="hero-search-meta">
        <span className="t-label-up">PROYECTO ACTIVO:</span>
        <span className="hero-search-meta-project">Clínica Estética Carmen</span>
      </div>
    </div>
  );
}

function PreviewAdMedia({
  ad,
  className,
  playSize = 10,
  showWinnerBadge = false,
}: {
  ad: typeof PREVIEW_ADS[0];
  className?: string;
  playSize?: number;
  showWinnerBadge?: boolean;
}) {
  return (
    <div
      className={className}
      style={{
        background: `radial-gradient(ellipse at 30% 20%, ${ad.tint[0]}80, ${ad.tint[1]}), linear-gradient(160deg, ${ad.tint[0]}, ${ad.tint[1]})`,
      }}
    >
      {ad.thumbnailUrl && (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={ad.thumbnailUrl}
            alt=""
            className="hero-preview-ad-img"
            loading="lazy"
            decoding="async"
          />
          <div className="hero-preview-ad-shade" aria-hidden />
        </>
      )}
      <span className="hero-thumb-handle">{ad.handle}</span>
      {ad.video && (
        <span className="hero-play">
          <svg width={playSize} height={playSize} viewBox="0 0 24 24" fill="currentColor"><path d="M6 4l14 8-14 8z" /></svg>
        </span>
      )}
      {!ad.thumbnailUrl && <span className="hero-thumb-initials">{ad.initials}</span>}
      {showWinnerBadge && <span className="hero-badge-winner">Ganador</span>}
    </div>
  );
}

function PreviewAdCard({ ad, index, highlight, dim, animate, loopKey }: {
  ad: typeof PREVIEW_ADS[0]; index: number; highlight: boolean; dim: boolean; animate: boolean; loopKey: number;
}) {
  const days = usePreviewTickUp(ad.target, 650, animate, loopKey);
  return (
    <div
      className={`hero-card ${highlight ? 'winner' : ''} ${dim ? 'dim' : ''}`}
      style={{ animationDelay: `${index * 70}ms` }}
    >
      <PreviewAdMedia ad={ad} className="hero-thumb" showWinnerBadge={highlight} />
      <div className="hero-card-foot">
        <div className="hero-card-name">{ad.company}</div>
        <div className="hero-card-days">{days} días activo</div>
      </div>
    </div>
  );
}

function PreviewResultsGrid({ show, highlight, loading, placeholder, loopKey }: {
  show: boolean; highlight: boolean; loading?: boolean; placeholder?: boolean; loopKey: number;
}) {
  return (
    <div className="hero-preview-results-slot" key={`results-${loopKey}`}>
      <div className={`hero-preview-layer hero-preview-results-msg placeholder ${placeholder ? 'visible' : ''}`}>
        Introduce un competidor para analizar su mercado
      </div>
      <div className={`hero-preview-layer hero-preview-results-msg ${loading ? 'visible' : ''}`}>
        <span className="hero-analysis-spinner" aria-hidden />
        Buscando en Meta Ad Library…
      </div>
      <div className={`hero-preview-layer hero-preview-results-grid ${show ? 'visible' : ''}`}>
        <div className="hero-results preview-5">
          {PREVIEW_ADS.map((ad, i) => (
            <PreviewAdCard
              key={ad.id}
              ad={ad}
              index={i}
              highlight={highlight && ad.isWinner}
              dim={highlight && !ad.isWinner}
              animate={show}
              loopKey={loopKey}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function PreviewAnalysisBar({ visible }: { visible: boolean }) {
  return (
    <div className="hero-preview-analysis-slot">
      <div className={`hero-analysis-bar hero-preview-layer ${visible ? 'visible' : ''}`}>
        <span className="hero-analysis-spinner" aria-hidden />
        Analizando 24 anuncios activos…
      </div>
    </div>
  );
}

function PreviewOutputPanel({ generating, pressed, btnRef }: { generating: boolean; pressed?: boolean; btnRef?: React.RefObject<HTMLSpanElement | null> }) {
  return (
    <div className="hero-output-panel">
      <div className="hero-output-info">
        <span className="hero-output-check" aria-hidden>✓</span>
        <div>
          <div className="hero-output-title">3 anuncios ganadores · guión listo para generar</div>
          <div className="hero-output-sub">Copy + planos adaptados a Clínica Estética Carmen</div>
        </div>
      </div>
      <span
        ref={btnRef}
        className={`hero-output-btn hero-preview-generate-btn ${generating ? 'loading' : ''} ${pressed ? 'pressed' : ''}`}
      >
        {generating ? (
          <>
            <span className="hero-analysis-spinner" style={{ width: 12, height: 12, borderWidth: 1.5 }} />
            Generando guión…
          </>
        ) : (
          <>
            <Icon name="zap" size={14} color="var(--c-ink)" />
            Generar mi guión
          </>
        )}
      </span>
    </div>
  );
}

function PreviewFakeCursor({
  visible,
  clicking,
  loopKey,
  from,
  to,
}: {
  visible: boolean;
  clicking: boolean;
  loopKey: number;
  from: { x: number; y: number };
  to: { x: number; y: number };
}) {
  if (!visible) return null;
  return (
    <div
      key={`cursor-${loopKey}-${clicking ? 'click' : 'move'}`}
      className={`hero-preview-cursor ${clicking ? 'clicking' : 'moving'}`}
      style={{
        '--cursor-from-x': `${from.x}px`,
        '--cursor-from-y': `${from.y}px`,
        '--cursor-to-x': `${to.x}px`,
        '--cursor-to-y': `${to.y}px`,
        ...(clicking ? { left: to.x, top: to.y } : {}),
      } as React.CSSProperties}
      aria-hidden
    >
      <svg width="22" height="26" viewBox="0 0 18 22" fill="none">
        <path
          d="M1 1L1 16.5L5.2 12.8L8.5 20.5L11.2 19.2L7.9 11.5L13.5 11.5L1 1Z"
          fill="#fff"
          stroke="#101814"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

function scrollWithinTimeline(timeline: HTMLElement, scene: HTMLElement) {
  const buffer = 6;
  const timelineRect = timeline.getBoundingClientRect();
  const sceneRect = scene.getBoundingClientRect();

  if (sceneRect.top < timelineRect.top + buffer) {
    timeline.scrollTop -= timelineRect.top + buffer - sceneRect.top;
  } else if (sceneRect.bottom > timelineRect.bottom - buffer) {
    timeline.scrollTop += sceneRect.bottom - timelineRect.bottom + buffer;
  }
}

function PreviewScriptScene({
  section,
  index,
  loopKey,
  timelineRef,
}: {
  section: typeof PREVIEW_SCRIPT[0];
  index: number;
  loopKey: number;
  timelineRef: React.RefObject<HTMLDivElement | null>;
}) {
  const sceneRef = useRef<HTMLElement>(null);
  const [armed, setArmed] = useState(false);
  useEffect(() => {
    setArmed(false);
    const t = setTimeout(() => setArmed(true), 120 + index * 180);
    return () => clearTimeout(t);
  }, [index, loopKey]);
  useEffect(() => {
    const timeline = timelineRef.current;
    const scene = sceneRef.current;
    if (!armed || !timeline || !scene) return;
    scrollWithinTimeline(timeline, scene);
  }, [armed, timelineRef]);
  const sayOut = usePreviewTypewriter(section.say, { speedMs: 12, enabled: armed });
  const visualOut = usePreviewTypewriter(section.visual, { speedMs: 10, enabled: armed });

  return (
    <article ref={sceneRef} className="hero-preview-scene">
      <div className="hero-preview-scene-head">
        <span className="hero-preview-scene-num">{index + 1}</span>
        <div className="hero-preview-scene-title-wrap">
          <span className="hero-preview-scene-title">{section.title}</span>
          <span className="hero-preview-scene-timing">{section.timing}</span>
        </div>
      </div>
      <div className="hero-preview-scene-block">
        <span className="hero-preview-scene-label">QUÉ DECIR</span>
        <p className="hero-preview-scene-say">{armed ? sayOut : '\u00A0'}</p>
      </div>
      <div className="hero-preview-scene-block hero-preview-scene-visual">
        <span className="hero-preview-scene-label">PLANOS / QUÉ HACER</span>
        <p className="hero-preview-scene-action">{armed ? visualOut : '\u00A0'}</p>
      </div>
    </article>
  );
}

function PreviewInspirationPanel({ loopKey }: { loopKey: number }) {
  const [idx, setIdx] = useState(0);
  const total = PREVIEW_WINNERS.length;
  const ad = PREVIEW_WINNERS[idx];

  useEffect(() => {
    setIdx(0);
    const timers = PREVIEW_WINNERS.map((_, i) =>
      i === 0 ? null : setTimeout(() => setIdx(i), 1500 + (i - 1) * 1500)
    );
    return () => { timers.forEach((t) => t && clearTimeout(t)); };
  }, [loopKey]);

  const goNext = () => setIdx((i) => (i + 1) % total);

  return (
    <aside className="hero-preview-inspiration">
      <div className="hero-preview-inspiration-head">
        <div className="hero-preview-inspiration-label">
          <Sq size={4} color="var(--c-green-bright)" />
          INSPIRACIÓN · GANADORES
        </div>
        <span className="hero-preview-inspiration-count">{idx + 1} / {total}</span>
      </div>

      <PreviewAdMedia
        key={`${loopKey}-${ad.id}`}
        ad={ad}
        className="hero-preview-inspiration-video"
        playSize={14}
        showWinnerBadge
      />

      <div className="hero-preview-inspiration-meta">
        <div className="hero-preview-inspiration-name">{ad.company}</div>
        <div className="hero-preview-inspiration-days">{ad.target} días activo en Meta Ads</div>
      </div>

      <div className="hero-preview-inspiration-nav">
        <div className="hero-preview-inspiration-dots">
          {PREVIEW_WINNERS.map((w, i) => (
            <span key={w.id} className={`hero-preview-inspiration-dot ${i === idx ? 'active' : ''}`} />
          ))}
        </div>
        <button type="button" className="hero-preview-inspiration-next" onClick={goNext}>
          Siguiente
          <Icon name="arrowRight" size={11} color="var(--c-ink)" />
        </button>
      </div>
    </aside>
  );
}

function PreviewScriptScreen({ loopKey }: { loopKey: number }) {
  const timelineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (timelineRef.current) timelineRef.current.scrollTop = 0;
  }, [loopKey]);

  return (
    <div className="hero-preview-script-view" key={`script-${loopKey}`}>
      <div className="hero-preview-script-top">
        <div>
          <div className="hero-preview-script-eyebrow">
            <Sq size={4} />
            GUION DE VÍDEO · REEL 30 S
          </div>
          <div className="hero-preview-script-title">Errores al elegir clínica — adaptado a Carmen</div>
          <div className="hero-preview-script-meta">
            Basado en <strong>{PREVIEW_SOURCE.company}</strong> · {PREVIEW_SOURCE.target} días activo
          </div>
        </div>
        <span className="hero-preview-script-badge">Listo para grabar</span>
      </div>

      <div className="hero-preview-script-split">
        <div className="hero-preview-script-col">
          <div className="hero-preview-script-col-label">GUIÓN · ESCENAS</div>
          <div ref={timelineRef} className="hero-preview-script-timeline">
            {PREVIEW_SCRIPT.map((s, i) => (
              <PreviewScriptScene key={s.id} section={s} index={i} loopKey={loopKey} timelineRef={timelineRef} />
            ))}
          </div>
        </div>
        <PreviewInspirationPanel loopKey={loopKey} />
      </div>
    </div>
  );
}

type PreviewTheme = 'dark' | 'light';

function PreviewSceneFrame({
  phase, showResults, showWinners, showAnalysis, showOutput, showScript, showLibrary,
  showCursor, cursorClick, loopKey, reducedMotion, theme,
}: {
  phase: string;
  showResults: boolean;
  showWinners: boolean;
  showAnalysis: boolean;
  showOutput: boolean;
  showScript: boolean;
  showLibrary: boolean;
  showCursor: boolean;
  cursorClick: boolean;
  loopKey: number;
  reducedMotion: boolean;
  theme: PreviewTheme;
}) {
  const url = showScript ? 'mimic.app/guion/clinica-carmen' : 'mimic.app/libreria';
  const frameRef = useRef<HTMLDivElement>(null);
  const generateBtnRef = useRef<HTMLSpanElement>(null);
  const [cursorPos, setCursorPos] = useState({
    from: { x: 420, y: 280 },
    to: { x: 720, y: 400 },
  });

  useLayoutEffect(() => {
    const frame = frameRef.current;
    const btn = generateBtnRef.current;
    if (!frame || !btn || !showOutput) return;

    const fr = frame.getBoundingClientRect();
    const br = btn.getBoundingClientRect();
    const tipX = br.left - fr.left + Math.min(br.width * 0.72, br.width - 4);
    const tipY = br.top - fr.top + Math.min(br.height * 0.55, br.height - 4);

    setCursorPos({
      from: { x: fr.width * 0.62, y: fr.height * 0.48 },
      to: { x: tipX, y: tipY },
    });
  }, [showOutput, showCursor, cursorClick, loopKey, phase]);

  return (
    <div
      ref={frameRef}
      className={`hero-scene-frame landing2-preview ${theme === 'light' ? 'landing2-preview--light' : ''} ${showCursor ? 'show-cursor' : ''} ${cursorClick ? 'cursor-click' : ''}`}
    >
      <PreviewFakeCursor
        visible={showCursor || cursorClick}
        clicking={cursorClick}
        loopKey={loopKey}
        from={cursorPos.from}
        to={cursorPos.to}
      />
      <div className="hero-progress" aria-hidden>
        <div className={`hero-progress-fill landing2-preview-progress ${reducedMotion ? 'done' : ''}`} />
      </div>

      <div className="hero-chrome">
        <span className="hero-dot" style={{ background: '#FF6058' }} />
        <span className="hero-dot" style={{ background: '#FFBC2E' }} />
        <span className="hero-dot" style={{ background: '#28C940' }} />
        <div className="hero-urlbar">
          <span style={{ color: 'var(--c-green)', fontWeight: 700 }}>■</span>
          <span>{url}</span>
        </div>
      </div>

      <div className="hero-scene-inner landing2-preview-inner">
        <div className="hero-mini-sidebar">
          <div className="hero-mini-logo">
            <Sq size={8} />
            <span>MIMIC</span>
          </div>
          <div className="hero-mini-project">
            <div className="hero-mini-project-label">PROYECTO ACTIVO</div>
            <div className="hero-mini-project-btn">
              <span className="hero-mini-project-name">Clínica Estética Carmen</span>
              <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, opacity: 0.7 }}>
                <path d="m6 9 6 6 6-6" />
              </svg>
            </div>
          </div>
          <div className="hero-mini-nav">
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--c-muted-dark)' }} />
            Inicio
          </div>
          <div className="hero-mini-nav">Buscador</div>
          <div className={showLibrary ? 'hero-mini-active' : 'hero-mini-nav'}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: showLibrary ? 'var(--c-green)' : 'var(--c-muted-dark)' }} />
            Librería
          </div>
          <div className={showScript ? 'hero-mini-active' : 'hero-mini-nav'}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: showScript ? 'var(--c-green)' : 'var(--c-muted-dark)' }} />
            Mis guiones
          </div>
        </div>

        <div className="hero-mini-main landing2-preview-main">
          <div className="hero-preview-main-stage">
            <div className={`hero-preview-layer hero-preview-library-stage ${showLibrary ? 'visible' : ''}`}>
              <PreviewSearchBar typing={phase === 'input'} searching={phase === 'searching'} loopKey={loopKey} />
              <PreviewAnalysisBar visible={showAnalysis} />
              <PreviewResultsGrid
                show={showResults}
                highlight={showWinners}
                loading={phase === 'searching'}
                placeholder={phase === 'input'}
                loopKey={loopKey}
              />
              <div className="hero-preview-bottom-slot">
                <div className={`hero-preview-layer hero-preview-bottom-panel ${showOutput ? 'visible' : ''}`}>
                  <PreviewOutputPanel
                    generating={phase === 'generating'}
                    pressed={phase === 'click'}
                    btnRef={generateBtnRef}
                  />
                </div>
              </div>
            </div>
            <div className={`hero-preview-layer hero-preview-script-stage ${showScript ? 'visible' : ''}`}>
              <PreviewScriptScreen loopKey={loopKey} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductPreview() {
  const reducedMotion = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches || false;
  }, []);

  const scriptPhaseIdx = PREVIEW_PHASES.findIndex((p) => p.id === 'script');
  const [phaseIdx, setPhaseIdx] = useState(reducedMotion ? scriptPhaseIdx : 0);
  const [loopKey, setLoopKey] = useState(0);
  const { theme: landingTheme } = useLandingTheme();
  const previewTheme: PreviewTheme = landingTheme === 'light' ? 'light' : 'dark';
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }, []);

  const startLoop = useCallback(() => {
    clearTimers();
    setPhaseIdx(0);
    setLoopKey((k) => k + 1);

    PREVIEW_PHASES.forEach((p, idx) => {
      if (idx === 0) return;
      const t = setTimeout(() => setPhaseIdx(idx), p.startMs);
      timersRef.current.push(t);
    });

    const loopT = setTimeout(() => startLoop(), PREVIEW_LOOP_MS);
    timersRef.current.push(loopT);
  }, [clearTimers]);

  useEffect(() => {
    if (reducedMotion) return;
    startLoop();
    return clearTimers;
  }, [reducedMotion, startLoop, clearTimers]);

  const phase = PREVIEW_PHASES[phaseIdx]?.id || 'input';
  const showResults = ['results', 'analyzing', 'output', 'cursor', 'click', 'generating'].includes(phase);
  const showWinners = ['analyzing', 'output', 'cursor', 'click', 'generating'].includes(phase);
  const showAnalysis = phase === 'analyzing';
  const showOutput = ['output', 'cursor', 'click', 'generating'].includes(phase);
  const showScript = phase === 'script';
  const showLibrary = !showScript;
  const showCursor = phase === 'cursor';
  const cursorClick = ['click', 'generating'].includes(phase);

  const replay = useCallback(() => {
    startLoop();
  }, [startLoop]);

  return (
    <div className="hero-scene-wrap" style={{ position: 'relative', maxWidth: 1080, width: '100%', margin: '0 auto' }}>
      <PreviewSceneFrame
        phase={phase}
        showResults={showResults}
        showWinners={showWinners}
        showAnalysis={showAnalysis}
        showOutput={showOutput}
        showScript={showScript}
        showLibrary={showLibrary}
        showCursor={showCursor}
        cursorClick={cursorClick}
        loopKey={loopKey}
        reducedMotion={reducedMotion}
        theme={previewTheme}
      />
      {!reducedMotion && (
        <button
          type="button"
          onClick={replay}
          className="hero-replay-btn"
          aria-label="Reiniciar animación"
          title="Reiniciar"
        >
          ↻ Reiniciar
        </button>
      )}
    </div>
  );
}

// =========================================================================
// TRUST METRICS (animated counters)
// =========================================================================

function MetricsStrip() {
  const metrics = [
    { value: 6, suffix: 'h', label: 'de research semanal que dejan de ser trabajo manual' },
    { value: 200, prefix: '+', label: 'anuncios activos analizados por cada búsqueda' },
    { value: 3, suffix: ' min', label: 'de la URL a un guion grabable, sin formularios' },
    { value: 9, suffix: '€', label: 'para probarlo. Sin plan gratuito. Sin trampa.' },
  ];

  return (
    <section className="landing2-metrics">
      <div className="landing2-metrics-card">
        {metrics.map((m, i) => {
          const counter = useCountUp(m.value);
          return (
            <div key={i} ref={counter.ref} style={{ borderLeft: i > 0 ? '1px solid var(--l2-card-border)' : 'none', paddingLeft: i > 0 ? 24 : 0 }}>
              <div className="landing2-metric-value" style={{
                fontFamily: 'var(--font-heading)', fontWeight: 700,
                fontSize: 36, color: 'var(--l2-heading)', lineHeight: 1, marginBottom: 6,
                letterSpacing: '-0.02em',
              }}>
                {m.prefix || ''}{counter.value}{m.suffix || ''}
              </div>
              <div className="landing2-metric-label" style={{ fontSize: 13, color: 'var(--l2-body-muted)', fontFamily: 'var(--font-body)', lineHeight: 1.4 }}>
                {m.label}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

// =========================================================================
// SOCIAL PROOF (new section — missing from V1)
// =========================================================================

function TestimonialCard({
  t,
  visible,
  index,
}: {
  t: { text: string; name: string; role: string; initials: string; avatar?: string };
  visible: boolean;
  index: number;
}) {
  return (
    <div
      className="landing2-social-card"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(20px)',
        transition: `opacity 500ms ease ${index * 120}ms, transform 500ms ease ${index * 120}ms`,
      }}
    >
      <div style={{ display: 'flex', gap: 2, marginBottom: 16 }}>
        {Array.from({ length: 5 }).map((_, j) => (
          <Icon key={j} name="star" size={16} color="var(--c-green)" filled />
        ))}
      </div>
      <p className="landing2-social-card-text">&ldquo;{t.text}&rdquo;</p>
      <div className="landing2-social-card-foot">
        {t.avatar ? (
          <img
            src={t.avatar}
            alt={t.name}
            className="landing2-social-card-avatar"
            style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              objectFit: 'cover',
              flexShrink: 0,
            }}
          />
        ) : (
          <div className="landing2-social-card-avatar">{t.initials}</div>
        )}
        <div>
          <div className="landing2-card-name">{t.name}</div>
          <div className="landing2-card-role">{t.role}</div>
        </div>
      </div>
    </div>
  );
}

function TestimonialsCarousel({
  testimonials,
  visible,
}: {
  testimonials: { text: string; name: string; role: string; initials: string }[];
  visible: boolean;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const onScroll = () => {
      const slideW = el.clientWidth;
      if (slideW <= 0) return;
      setActive(Math.min(testimonials.length - 1, Math.round(el.scrollLeft / slideW)));
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, [testimonials.length]);

  const goTo = (i: number) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollTo({ left: i * el.clientWidth, behavior: 'smooth' });
    setActive(i);
  };

  return (
    <div className="landing2-testimonials-carousel">
      <div ref={trackRef} className="landing2-testimonials-grid" aria-label="Testimonios">
        {testimonials.map((t, i) => (
          <TestimonialCard key={t.name} t={t} visible={visible} index={i} />
        ))}
      </div>
      <div className="landing2-testimonials-dots" role="tablist" aria-label="Navegación testimonios">
        {testimonials.map((t, i) => (
          <button
            key={t.name}
            type="button"
            role="tab"
            aria-selected={active === i}
            aria-label={`Testimonio ${i + 1}: ${t.name}`}
            className={active === i ? 'active' : ''}
            onClick={() => goTo(i)}
          />
        ))}
      </div>
    </div>
  );
}

function SocialProof() {
  const testimonials = [
    {
      text: 'Cada lunes perdía 2 horas en la Ad Library abriendo anuncios uno a uno, transcribiendo vídeos y apuntando ideas en un Google Doc. La primera vez que usé MIMIC me dió el guion adaptado a mi clínica en 3 minutos. Literal, lo grabé esa misma tarde.',
      name: 'Laura M.',
      role: 'Directora de marketing · Clínica dental en Madrid · invierte 4.000 €/mes en Meta Ads',
      initials: 'LM',
      avatar: 'https://i.pravatar.cc/150?img=47',
    },
    {
      text: 'Mi cliente me pidió "un anuncio como el de la competencia pero nuestro". Antes eso eran 3 horas de research. Se lo entregué en 20 minutos con MIMIC. El reel sacó un 3,2x de ROAS — mejor que cualquier creativo que le hice escribiendo yo solo.',
      name: 'Sergio R.',
      role: 'Media buyer freelance · 8 clientes activos',
      initials: 'SR',
      avatar: 'https://i.pravatar.cc/150?img=12',
    },
    {
      text: 'Gestiono Meta Ads para 6 clientes de estética. Antes dedicaba una tarde entera por cliente solo al research. Con MIMIC hago los 6 en menos de una hora, y los guiones salen mejor que cuando los escribía yo a las 11 de la noche.',
      name: 'Ana P.',
      role: 'Fundadora de agencia de paid media · 3 personas en el equipo',
      initials: 'AP',
      avatar: 'https://i.pravatar.cc/150?img=32',
    },
  ];

  const { ref, visible } = useInView();

  return (
    <section ref={ref} className="landing2-social" style={{ padding: '0 24px 80px', background: 'var(--l2-section-a)' }}>
      <div style={{ maxWidth: 1080, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <Sq />
            <span style={{
              fontFamily: 'var(--font-heading)', fontWeight: 700,
              fontSize: 11, letterSpacing: '0.08em', color: 'var(--c-green)',
              textTransform: 'uppercase' as const,
            }}            >RESULTADOS REALES, NEGOCIOS REALES</span>
          </div>
          <h2 style={{
            fontFamily: 'var(--font-heading)', fontWeight: 700,
            fontSize: 'clamp(26px, 3.5vw, 38px)', color: 'var(--l2-heading)',
            lineHeight: 1.15, maxWidth: 700, margin: '0 auto',
          }}>
            Convirtieron los ganadores de su competencia{' '}
            <span style={{ color: 'var(--c-green)' }}>en los suyos propios.</span>
          </h2>
        </div>

        <TestimonialsCarousel testimonials={testimonials} visible={visible} />
      </div>
    </section>
  );
}

// =========================================================================
// FOR WHOM
// =========================================================================

function ForWhomBlock() {
  const { ref, visible } = useInView();

  return (
    <section ref={ref} className="landing2-for-whom" style={{ padding: '80px 24px', background: 'var(--l2-section-b)', borderTop: '1px solid var(--l2-card-border)', borderBottom: '1px solid var(--l2-card-border)' }}>
      <div style={{ maxWidth: 1080, margin: '0 auto' }}>
        <div
          className="landing2-for-whom-grid"
          style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(24px)',
          transition: 'all 600ms ease',
        }}
        >
          {/* YES */}
          <div className="landing2-for-whom-yes" style={{
            background: 'linear-gradient(180deg, rgba(16,190,134,0.06) 0%, var(--l2-card-bg) 100%)',
            border: '2px solid var(--c-green)',
            borderRadius: 16, padding: 32,
            boxShadow: '0 8px 24px rgba(16,190,134,0.08)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <Sq />
              <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 11, letterSpacing: '0.08em', color: 'var(--c-green)', textTransform: 'uppercase' as const }}>
                ESTO ES PARA TI SI...
              </span>
            </div>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 24, color: 'var(--l2-heading)', lineHeight: 1.2, marginBottom: 20 }}>
              Produces anuncios para Meta cada semana y ya estás harto de empezar desde cero.
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 14 }}>
              {[
                'Gestionas o produces Meta Ads con presupuesto real — no estás aprendiendo, estás ejecutando.',
                'Cada semana necesitas creatividades nuevas y el proceso de research te come tardes enteras.',
                'Ya conoces la Ad Library. El problema no es encontrar anuncios — es convertirlos en algo útil.',
                'Tienes clientes o un negocio que depende de que los anuncios rindan, no de que queden bonitos.',
                'Quieres un sistema repetible, no improvisar cada semana con ChatGPT.',
              ].map(t => (
                <li key={t} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <span style={{
                    width: 24, height: 24, borderRadius: '50%', flexShrink: 0, marginTop: 1,
                    background: 'var(--c-green)', display: 'grid', placeItems: 'center',
                  }}>
                    <Icon name="check" size={13} color="var(--c-white)" stroke={3} />
                  </span>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: 15, color: 'var(--l2-heading)', lineHeight: 1.5 }}>{t}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* NO */}
          <div className="landing2-for-whom-no" style={{
            background: 'var(--l2-for-whom-no-bg)',
            border: '1px solid var(--l2-card-border)',
            borderTop: '3px solid var(--c-error)',
            borderRadius: 16, padding: 32,
          }}>
            <div className="landing2-for-whom-no-head" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Sq color="var(--c-error)" />
                <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 11, letterSpacing: '0.08em', color: 'var(--c-error)', textTransform: 'uppercase' as const }}>
                  NO ES PARA TI SI
                </span>
              </div>
              <span style={{
                fontSize: 10, color: 'var(--l2-body-muted)',
                background: 'var(--l2-section-a)', padding: '3px 8px', borderRadius: 999,
                fontFamily: 'var(--font-body)',
              }}>Preferimos ser honestos</span>
            </div>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 22, color: 'var(--l2-heading)', lineHeight: 1.2, marginBottom: 20 }}>
              Si no produces anuncios para Meta cada semana, MIMIC no es para ti todavía.
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 14 }}>
              {[
                'Aún no tienes anuncios activos en Meta — no hay data que analizar hasta que los tengas.',
                'Estás aprendiendo cómo funciona la publicidad digital — MIMIC es para quien ya ejecuta, no para quien empieza.',
                'Buscas una herramienta gratuita — el Sprint de 9 € existe precisamente para filtrar a quien de verdad lo necesita.',
                'Crees que con ChatGPT y creatividad propia ya tienes suficiente — quizás sí, y está bien.',
              ].map(t => (
                <li key={t} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <span style={{
                    width: 24, height: 24, borderRadius: '50%', flexShrink: 0, marginTop: 1,
                    background: 'rgba(229,91,91,0.10)', display: 'grid', placeItems: 'center',
                  }}>
                    <Icon name="x" size={13} color="var(--c-error)" stroke={2.5} />
                  </span>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: 15, color: 'var(--l2-heading)', lineHeight: 1.5 }}>{t}</span>
                </li>
              ))}
            </ul>
            <p style={{
              marginTop: 20, paddingTop: 16,
              borderTop: '1px solid var(--l2-card-border)',
              fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--l2-body-muted)',
              fontStyle: 'italic', lineHeight: 1.6,
            }}>
              No vendemos humo a 9 €. <strong style={{ color: 'var(--l2-heading)', fontStyle: 'normal' }}>Si no es tu momento, preferimos que vuelvas cuando lo sea.</strong>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// =========================================================================
// HOW IT WORKS (3 steps — improved visual)
// =========================================================================

function HowItWorks() {
  const { ref, visible } = useInView();

  const steps = [
    { n: '01', title: 'Pega tu URL. MIMIC entiende tu negocio.', body: 'Pegas la web de tu negocio y MIMIC extrae automáticamente qué vendes, a quién y cuál es tu ángulo diferencial. Nada de rellenar formularios de 20 campos.', time: '10 segundos', icon: 'building' as const },
    { n: '02', title: 'Elige competidores. Encontramos sus ganadores.', body: 'Te sugerimos competidores reales de tu sector o añades los que ya tienes fichados. MIMIC escanea todos sus anuncios activos en Meta y te muestra cuáles llevan semanas o meses funcionando — los ganadores de verdad.', time: '30 segundos', icon: 'search' as const },
    { n: '03', title: 'Convierte sus ganadores en tu guion.', body: 'La IA entiende por qué ese anuncio funciona — el ángulo, el gancho emocional, la estructura — y crea desde cero un guion completamente nuevo para tu negocio. Tu producto, tu voz, tu mensaje. Inspirado en lo que el mercado ya validó.', time: '2 minutos', icon: 'fileText' as const },
  ];

  return (
    <section id="como-funciona" ref={ref} className="landing2-how" style={{ padding: '88px 24px', background: 'var(--l2-section-a)' }}>
      <div style={{ maxWidth: 1080, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <Sq />
            <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 11, letterSpacing: '0.08em', color: 'var(--c-green)', textTransform: 'uppercase' as const }}>
              ASÍ DE RÁPIDO ES
            </span>
          </div>
          <h2 style={{
            fontFamily: 'var(--font-heading)', fontWeight: 700,
            fontSize: 'clamp(28px, 3.5vw, 40px)', color: 'var(--l2-heading)', lineHeight: 1.15,
          }}>
            Tres pasos.{' '}
            <span style={{ color: 'var(--c-green)' }}>Aprendes de lo que funciona. Creas algo tuyo.</span>
          </h2>
        </div>

        <div className="landing2-how-grid">
          {steps.map((s, i) => (
            <div key={s.n} className="landing2-how-card" style={{
              background: 'var(--l2-card-bg)',
              border: '1px solid var(--l2-card-border)',
              borderRadius: 16,
              padding: 32,
              position: 'relative',
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(24px)',
              transition: `all 500ms ease ${i * 150}ms`,
            }}>
              {/* Step number */}
              <div style={{
                fontFamily: 'var(--font-heading)', fontWeight: 700,
                fontSize: 56, color: 'var(--c-green)',
                lineHeight: 1, marginBottom: 20, opacity: 0.25,
                position: 'absolute', top: 20, right: 24,
              }}>{s.n}</div>

              {/* Icon */}
              <div style={{
                width: 48, height: 48, borderRadius: 12,
                background: 'var(--c-green-tint-08)',
                display: 'grid', placeItems: 'center', marginBottom: 20,
              }}>
                <Icon name={s.icon} size={22} color="var(--c-green)" />
              </div>

              <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 20, color: 'var(--l2-heading)', marginBottom: 10, lineHeight: 1.2 }}>
                {s.title}
              </h3>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--l2-body-muted)', lineHeight: 1.65, marginBottom: 20 }}>
                {s.body}
              </p>
              <div className="landing2-step-time" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Icon name="clock" size={14} color="var(--c-green)" />
                <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--c-green)', fontWeight: 600 }}>{s.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// =========================================================================
// COMPARISON (Sin MIMIC vs Con MIMIC)
// =========================================================================

function ComparisonBlock() {
  const rows = [
    { sin: 'Grabas el vídeo, lo editas, lo publicas — y rezas para que funcione', con: 'Grabas sabiendo que el ángulo y el hook ya funcionaron en tu mercado', tag: 'Certeza' },
    { sin: 'Cada semana inventas el guion desde cero, sin saber si el ángulo convierte', con: 'El guion parte de estructuras validadas por el mercado, adaptadas a tu negocio', tag: 'Base' },
    { sin: '4-6 horas buscando referencias, transcribiendo vídeos, tomando notas', con: '15 minutos. Research + análisis + guion listo para grabar', tag: 'Tiempo' },
    { sin: 'Tu anuncio compite con presupuesto, no con inteligencia creativa', con: 'Cada creativo tuyo parte de lo que ya demostró generar atención en Meta', tag: 'Ventaja' },
    { sin: 'Sin historial, sin sistema — cada semana empiezas de cero', con: 'Librería de anuncios + guiones guardados por proyecto. Sistema que escala.', tag: 'Sistema' },
  ];

  return (
    <section className="landing2-comparison" style={{ padding: '88px 24px', background: 'var(--l2-section-dark)' }}>
      <div style={{ maxWidth: 1020, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <Sq />
            <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 11, letterSpacing: '0.08em', color: 'var(--c-green-bright)', textTransform: 'uppercase' as const }}>
              LO QUE TE CUESTA NO USAR MIMIC
            </span>
          </div>
          <h2 style={{
            fontFamily: 'var(--font-heading)', fontWeight: 700,
            fontSize: 'clamp(26px, 3.5vw, 38px)', color: 'var(--l2-on-dark-heading)', lineHeight: 1.15,
            maxWidth: 700, margin: '0 auto',
          }}>
            La diferencia entre grabar{' '}
            <span style={{ color: 'var(--c-error)' }}>con fe</span>{' '}
            y grabar{' '}
            <span style={{ color: 'var(--c-green-bright)' }}>con datos.</span>
          </h2>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 16, color: 'var(--l2-on-dark-muted)', marginTop: 16, maxWidth: 620, margin: '16px auto 0' }}>
            No es solo tiempo. Es seguir lanzando creatividades que podrían no funcionar
            cuando ya existen señales claras de lo que convierte en tu sector.
            MIMIC cuesta 9 € para empezar.
          </p>
        </div>

        <div className="landing2-comparison-grid">
          {/* Sin */}
          <div className="landing2-comparison-sin" style={{
            background: 'var(--l2-comparison-sin-bg)', border: '1px solid var(--l2-card-border-dark)',
            borderRadius: 16, padding: '28px 26px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 22 }}>
              <Sq color="var(--c-error)" />
              <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 11, letterSpacing: '0.08em', color: 'var(--c-error)', textTransform: 'uppercase' as const }}>
                SIN MIMIC · HOY
              </span>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 16 }}>
              {rows.map((r, i) => (
                <li key={i} style={{
                  display: 'flex', alignItems: 'flex-start', gap: 12,
                  paddingBottom: i < rows.length - 1 ? 16 : 0,
                  borderBottom: i < rows.length - 1 ? '1px solid var(--l2-comparison-row-border)' : 'none',
                }}>
                  <span style={{
                    width: 24, height: 24, borderRadius: '50%', flexShrink: 0, marginTop: 1,
                    background: 'rgba(229,91,91,0.15)', display: 'grid', placeItems: 'center',
                  }}>
                    <Icon name="x" size={13} color="var(--c-error)" stroke={2.5} />
                  </span>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: 15, color: 'var(--l2-on-dark-heading)', lineHeight: 1.5 }}>{r.sin}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Con */}
          <div className="landing2-comparison-con" style={{
            background: 'var(--l2-comparison-con-bg)',
            border: '2px solid var(--c-green)',
            borderRadius: 16, padding: '28px 26px',
            position: 'relative',
            boxShadow: '0 12px 30px rgba(16,190,134,0.12)',
          }}>
            <span style={{
              position: 'absolute', top: -1, right: 18,
              background: 'var(--c-green)', color: 'var(--c-ink)',
              padding: '4px 12px', borderRadius: '0 0 8px 8px',
              fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 10,
            }}>RECOMENDADO</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 22 }}>
              <Sq />
              <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 11, letterSpacing: '0.08em', color: 'var(--c-green-bright)', textTransform: 'uppercase' as const }}>
                CON MIMIC
              </span>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 16 }}>
              {rows.map((r, i) => (
                <li key={i} style={{
                  display: 'flex', alignItems: 'flex-start', gap: 12,
                  paddingBottom: i < rows.length - 1 ? 16 : 0,
                  borderBottom: i < rows.length - 1 ? '1px solid var(--l2-comparison-con-row-border)' : 'none',
                }}>
                  <span style={{
                    width: 24, height: 24, borderRadius: '50%', flexShrink: 0, marginTop: 1,
                    background: 'var(--c-green)', display: 'grid', placeItems: 'center',
                  }}>
                    <Icon name="check" size={13} color="var(--c-white)" stroke={3} />
                  </span>
                  <div>
                    <span style={{ fontFamily: 'var(--font-body)', fontSize: 15, color: 'var(--l2-on-dark-heading)', lineHeight: 1.5 }}>{r.con}</span>
                    <div style={{ marginTop: 3, fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 10, color: 'var(--c-green-bright)', letterSpacing: '0.04em', textTransform: 'uppercase' as const }}>
                      ✓ {r.tag}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Cost comparison line */}
        <div style={{ marginTop: 32, textAlign: 'center' }}>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 15, color: 'var(--l2-on-dark-muted)', maxWidth: 740, margin: '0 auto' }}>
            <strong style={{ color: 'var(--l2-on-dark-heading)' }}>Haz las cuentas: </strong>
            5h/semana de media buyer a 50 €/h ={' '}
            <span style={{ color: 'var(--c-error)', fontWeight: 600 }}>1.000 €/mes</span> solo en research.
            Foreplay o AdSpy (en inglés, sin guiones):{' '}
            <span style={{ color: 'var(--c-error)', fontWeight: 600 }}>149-249 $/mes</span>.
            MIMIC, con research + guiones + en español, para los primeros 100 fundadores:{' '}
            <span style={{ color: 'var(--c-green-bright)', fontWeight: 700 }}>41 €/mes</span>.
          </p>
        </div>
      </div>
    </section>
  );
}

// =========================================================================
// PRICING
// =========================================================================

function PricingBlock() {
  return (
    <section id="precio" className="landing2-pricing" style={{ padding: '88px 24px', background: 'var(--l2-section-a)' }}>
      <div style={{ maxWidth: 1020, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <Sq />
            <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 11, letterSpacing: '0.08em', color: 'var(--c-green)', textTransform: 'uppercase' as const }}>
              SIN COMPROMISO · SIN SUSCRIPCIÓN OCULTA
            </span>
          </div>
          <h2 style={{
            fontFamily: 'var(--font-heading)', fontWeight: 700,
            fontSize: 'clamp(28px, 3.5vw, 40px)', color: 'var(--l2-heading)', lineHeight: 1.15,
            maxWidth: 720, margin: '0 auto',
          }}>
            Pruébalo por lo que cuesta un café con tostada.{' '}
            <span style={{ color: 'var(--c-green)' }}>Quédate si te ahorra horas.</span>
          </h2>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 16, color: 'var(--l2-body-muted)', marginTop: 14, maxWidth: 600, margin: '14px auto 0' }}>
            El Sprint de 9 € te da acceso completo durante 7 días.
            Si te convence, bloqueas el precio de fundador para siempre.
            Quedan{' '}
            <strong style={{ color: 'var(--l2-heading)' }}>73 de las 100 plazas</strong>.
          </p>
        </div>

        <div className="landing2-pricing-panel" style={{
          maxWidth: 920, margin: '0 auto',
          display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 0,
          background: 'var(--l2-pricing-panel-bg)',
          border: '2px solid var(--c-green)',
          borderRadius: 20, overflow: 'hidden',
          boxShadow: '0 30px 80px rgba(16,190,134,0.15), 0 0 0 6px rgba(16,190,134,0.06)',
        }}>
          {/* Left: Sprint */}
          <div style={{ padding: 40, borderRight: '1px solid var(--l2-card-border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <Sq />
              <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 11, letterSpacing: '0.08em', color: 'var(--c-green)', textTransform: 'uppercase' as const }}>
                MIMIC SPRINT
              </span>
            </div>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 24, color: 'var(--l2-heading)', lineHeight: 1.2, marginBottom: 20 }}>
              7 días para demostrarte que funciona
            </h3>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 8 }}>
              <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 64, color: 'var(--c-green)', lineHeight: 1, letterSpacing: '-0.02em' }}>9 €</span>
              <span style={{ fontSize: 14, color: 'var(--l2-body-muted)', fontFamily: 'var(--font-body)' }}>pago único</span>
            </div>
            <p className="landing2-price-note" style={{ fontSize: 13, color: 'var(--l2-body-muted)', fontFamily: 'var(--font-body)', marginBottom: 24 }}>
              Menos de lo que cobras por 10 minutos de tu tiempo. Y te ahorra tardes enteras.
            </p>
            <div style={{ height: 1, background: 'var(--l2-card-border)', marginBottom: 24 }} />
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--l2-heading)', fontWeight: 600, marginBottom: 16 }}>
              Tu Sprint incluye:
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 12 }}>
              {[
                '5 búsquedas de competidores — analiza todo tu mercado',
                '10 guiones completos adaptados a tu negocio y sector',
                'Librería visual con todos los anuncios ganadores encontrados',
                'Edición por secciones — regenera solo el hook o el CTA si quieres',
                'Todo lo que generas es tuyo para siempre, aunque canceles',
              ].map(t => (
                <li key={t} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <Icon name="check" size={16} color="var(--c-green)" style={{ marginTop: 3, flexShrink: 0 }} />
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--l2-heading)' }}>{t}</span>
                </li>
              ))}
            </ul>
            <Button variant="primary" full size="lg" href="/checkout" style={{ marginTop: 28, fontSize: 16 }}>
              <Icon name="zap" size={18} /> Empezar ahora — 9 €
            </Button>
            <p className="landing2-price-note" style={{ fontSize: 12, color: 'var(--l2-body-muted)', fontFamily: 'var(--font-body)', textAlign: 'center', marginTop: 12 }}>
              Pago seguro vía Gumroad. Acceso en menos de 1 minuto. Cancela en 1 clic.
            </p>
          </div>

          {/* Right: Founder + scarcity + guarantee */}
          <div className="landing2-pricing-side" style={{
            padding: 36,
            background: 'var(--l2-pricing-side-bg)',
            display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                <Sq />
                <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 11, letterSpacing: '0.08em', color: 'var(--c-green)', textTransform: 'uppercase' as const }}>
                  DÍA 8: FUNDADOR
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 4 }}>
                <span className="landing2-price-main" style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 36, color: 'var(--l2-heading)' }}>41 €</span>
                <span style={{ fontSize: 14, color: 'var(--l2-body-muted)', fontFamily: 'var(--font-body)' }}>/ mes</span>
              </div>
              <div style={{ fontSize: 13, color: 'var(--c-green)', fontWeight: 600, fontFamily: 'var(--font-body)', marginBottom: 8 }}>
                Bloqueado de por vida — ahorras 40 % para siempre
              </div>
              <div style={{ fontSize: 13, color: 'var(--l2-body-muted)', fontFamily: 'var(--font-body)', textDecoration: 'line-through' }}>
                precio normal: 69 €/mes
              </div>

              <div style={{ height: 1, background: 'var(--l2-card-border)', margin: '20px 0' }} />

              {/* Scarcity bar */}
              <div className="landing2-pricing-scarcity" style={{
                background: 'var(--l2-card-bg)',
                border: '1px solid var(--l2-card-border)',
                borderRadius: 12, padding: 16,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                  <Icon name="zap" size={14} color="var(--c-green)" />
                  <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 12, color: 'var(--l2-heading)', letterSpacing: 0.5 }}>
                    QUEDAN 73 DE 100 PLAZAS
                  </span>
                </div>
                <div style={{ height: 8, background: 'var(--l2-card-border)', borderRadius: 4, overflow: 'hidden', marginBottom: 10 }}>
                  <div style={{
                    width: '27%', height: '100%',
                    background: 'linear-gradient(90deg, var(--c-green), var(--c-green-bright))',
                    borderRadius: 4,
                    boxShadow: '0 0 8px rgba(16,190,134,0.4)',
                  }} />
                </div>
                <p style={{ fontSize: 12, color: 'var(--l2-body-muted)', fontFamily: 'var(--font-body)', lineHeight: 1.5 }}>
                  Cuando se llenen las 100, el precio sube a 69 €/mes para todo el mundo. Tu plaza se bloquea en 41 € para siempre.
                </p>
              </div>
            </div>

            {/* Guarantee */}
            <div className="landing2-pricing-guarantee" style={{
              background: 'var(--c-green-tint-08)', border: '1px solid rgba(16,190,134,0.25)',
              borderRadius: 12, padding: 16, marginTop: 24,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                <Icon name="shield" size={14} color="var(--c-green)" />
                <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 12, color: 'var(--c-green)', letterSpacing: 0.5 }}>
                  GARANTÍA TOTAL
                </span>
              </div>
              <p style={{ fontSize: 13, color: 'var(--l2-heading)', fontFamily: 'var(--font-body)', lineHeight: 1.6 }}>
                Si en 7 días no consigues al menos un guion que usarías de verdad, te devolvemos los 9 € íntegros. Un email, cero preguntas, cero formularios.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// =========================================================================
// FAQ (animated accordion)
// =========================================================================

function FAQItem({ q, a, open, onClick }: { q: string; a: string; open: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`landing2-faq-item ${open ? 'is-open' : ''}`}
      style={{
        textAlign: 'left', width: '100%',
        background: open ? 'var(--l2-faq-open-bg)' : 'var(--l2-faq-closed-bg)',
        border: open ? '1px solid var(--c-green)' : '1px solid var(--l2-card-border)',
        borderRadius: 12, padding: '20px 24px',
        cursor: 'pointer',
        transition: 'background 200ms ease, border-color 200ms ease, box-shadow 200ms ease',
        boxShadow: open ? '0 4px 16px rgba(16,190,134,0.08)' : 'none',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <Sq style={{ marginTop: 7 }} />
          <span className="landing2-faq-q" style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 15, color: 'var(--l2-heading)', lineHeight: 1.4 }}>
            {q}
          </span>
        </div>
        <span style={{
          width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
          background: open ? 'var(--c-green-tint-08)' : 'var(--l2-card-bg)',
          border: '1px solid var(--l2-card-border)',
          display: 'grid', placeItems: 'center',
          transition: 'all 200ms ease',
          transform: open ? 'rotate(180deg)' : 'none',
        }}>
          <Icon name="chevronDown" size={14} color={open ? 'var(--c-green)' : 'var(--l2-body-muted)'} />
        </span>
      </div>
      <div className={`landing2-faq-answer ${open ? 'is-open' : ''}`}>
        <div className="landing2-faq-answer-inner">
          <p style={{
            fontFamily: 'var(--font-body)', fontSize: 14,
            color: 'var(--l2-body-muted)', marginTop: 14, marginLeft: 20, marginBottom: 0,
            lineHeight: 1.7,
          }}>
            {a}
          </p>
        </div>
      </div>
    </button>
  );
}

function FAQBlock() {
  const items = [
    {
      q: '¿Esto no es lo mismo que pedirle un guion a ChatGPT?',
      a: 'No. ChatGPT escribe en el vacío — sin saber qué está funcionando en tu mercado ahora mismo. MIMIC lee las señales reales: analiza anuncios que llevan meses activos porque alguien los está pagando y están dando resultados, extrae el ángulo, el hook y la estructura — y desde ahí genera un guion completamente nuevo para tu negocio. Tu producto, tu tono, tu mensaje. No imitas a nadie: usas lo que el mercado ya validó como base inteligente.',
    },
    {
      q: 'Yo ya hago research manual. ¿Qué me aporta MIMIC?',
      a: 'Que dejes de hacerlo. Si dedicas 4-6 horas semanales a abrir la Ad Library, transcribir vídeos y apuntar ideas, estás gastando entre 200 y 1.000 €/mes en horas de trabajo — dependiendo de quién lo haga. MIMIC lo hace en 3 minutos y encima te da el guion adaptado. La primera búsqueda ya te devuelve la inversión de los 9 €.',
    },
    {
      q: '9 € por 7 días suena barato. ¿Qué pasa el día 8?',
      a: 'Si MIMIC te ha servido, pasas al plan Fundador: 41 €/mes bloqueado de por vida (el precio real será 69 €/mes). Si no te ha servido, cancelas en un clic antes del día 8 y no se te cobra nada más. Te mandamos un recordatorio el día 5 para que decidas con calma. Los guiones que generaste son tuyos para siempre.',
    },
    {
      q: 'Gestiono varios clientes / una agencia. ¿Puedo usarlo para todos?',
      a: 'MIMIC está diseñado exactamente para eso. Cada cliente es un proyecto independiente con su propio contexto, competidores y guiones. Cambias entre proyectos con un selector. Si gestionas 6 clientes, haces en una hora lo que antes te costaba 6 tardes. El plan Fundador no tiene límite de proyectos.',
    },
    {
      q: 'Mi competencia anuncia en inglés / otro idioma. ¿Funciona?',
      a: 'Perfectamente. MIMIC analiza la estructura del anuncio en su idioma original — el hook, el ángulo de dolor, la propuesta, el CTA — y genera el guion para tu negocio en español. De hecho, ahí es donde más valor sacas: aplicar estructuras que funcionan en mercados más maduros (EE.UU., UK) al mercado español, donde la competencia es menor.',
    },
    {
      q: '¿Foreplay, AdSpy y herramientas así no hacen lo mismo?',
      a: 'No. Foreplay y AdSpy te enseñan los anuncios. MIMIC te da el guion. Ellas son el mapa; MIMIC es el GPS que te lleva. Además, ninguna de esas herramientas está en español ni genera guiones adaptados a tu negocio concreto. Y la mayoría empieza en 149 $/mes sin período de prueba.',
    },
    {
      q: '¿Es legal usar los anuncios de mi competencia como base?',
      a: 'Sí. La Meta Ad Library es un registro público — Meta la publica por obligación de la normativa europea de transparencia publicitaria (DSA). MIMIC analiza esos datos públicos y genera un guion 100% original adaptado a tu negocio. No copias el anuncio: copias la estructura que funciona.',
    },
    {
      q: '¿Y si el guion que me genera no me gusta?',
      a: 'Regeneras solo la sección que no te convence: el hook, el cuerpo, el CTA — por separado. Si el ángulo entero no te encaja, eliges otro anuncio ganador como base y generas otro guion. Tienes 10 generaciones en tu Sprint. Pero normalmente, con 2-3 ya tienes un guion que grabas.',
    },
  ];

  const [open, setOpen] = useState(0);

  return (
    <section id="faq" className="landing2-faq" style={{ padding: '88px 24px', background: 'var(--l2-section-b)', borderTop: '1px solid var(--l2-card-border)' }}>
      <div style={{ maxWidth: 780, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <Sq />
            <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 11, letterSpacing: '0.08em', color: 'var(--c-green)', textTransform: 'uppercase' as const }}>
              PREGUNTAS HONESTAS, RESPUESTAS DIRECTAS
            </span>
          </div>
          <h2 style={{
            fontFamily: 'var(--font-heading)', fontWeight: 700,
            fontSize: 'clamp(26px, 3.5vw, 36px)', color: 'var(--l2-heading)', lineHeight: 1.15,
          }}>
            Todo lo que te estás preguntando ahora mismo.
          </h2>
        </div>

        <div style={{ display: 'grid', gap: 8 }}>
          {items.map((it, i) => (
            <FAQItem
              key={i}
              q={it.q}
              a={it.a}
              open={open === i}
              onClick={() => setOpen(open === i ? -1 : i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// =========================================================================
// CLOSING CTA
// =========================================================================

function ClosingCTA() {
  return (
    <section className="landing2-closing" style={{
      padding: '96px 24px',
      background: 'var(--l2-section-dark)',
      position: 'relative', overflow: 'hidden',
      textAlign: 'center',
    }}>
      {/* Gradient orb */}
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 600, height: 600, background: 'radial-gradient(circle, rgba(16,190,134,0.15) 0%, transparent 60%)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: 760, margin: '0 auto', position: 'relative' }}>
        <h2 style={{
          fontFamily: 'var(--font-heading)', fontWeight: 700,
          fontSize: 'clamp(28px, 4vw, 44px)', lineHeight: 1.15,
          color: 'var(--l2-on-dark-heading)', marginBottom: 20, letterSpacing: '-0.01em',
        }}>
          Esta semana vas a grabar anuncios igualmente.<br />
          <span style={{ color: 'var(--c-green-bright)' }}>¿Lo haces a ciegas o con lo que ya funciona?</span>
        </h2>
        <p style={{
          fontFamily: 'var(--font-body)', fontSize: 17, lineHeight: 1.6,
          color: 'var(--l2-on-dark-muted)', maxWidth: 600, margin: '0 auto 36px',
        }}>
          7 días. 9 €. Guiones basados en lo que el mercado ya validó, adaptados a tu negocio.
          Si no grabas con más confianza, te devolvemos el dinero sin preguntas.
        </p>
        <Button variant="primary" size="lg" href="/checkout" style={{ minWidth: 280, fontSize: 16 }}>
          <Icon name="zap" size={18} /> Probar MIMIC 7 días — 9 €
        </Button>
        <p style={{ fontSize: 13, color: 'var(--l2-on-dark-muted)', fontFamily: 'var(--font-body)', marginTop: 16 }}>
          73 plazas de fundador restantes. Precio bloqueado en 41 €/mes de por vida.
        </p>
      </div>
    </section>
  );
}

// =========================================================================
// FOOTER
// =========================================================================

function Footer() {
  const router = useRouter();
  const { theme } = useLandingTheme();
  const logoTheme = theme === 'light' ? 'dark' : 'light';

  return (
    <footer className="landing2-footer" style={{
      padding: '24px 24px',
      background: 'var(--l2-footer-bg)',
      borderTop: '1px solid var(--l2-footer-border)',
    }}>
      <div style={{
        maxWidth: 1200, margin: '0 auto',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12,
      }}>
        <Logo size="sm" theme={logoTheme} href="/landing-old" />
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 12, color: 'var(--l2-footer-text)', fontFamily: 'var(--font-body)' }}>
          <span>MIMIC © 2026 · Pago seguro vía Gumroad</span>
          <button
            onClick={() => router.push('/legal')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', font: 'inherit', padding: 0 }}
          >Términos</button>
          <span>·</span>
          <button
            onClick={() => router.push('/legal')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', font: 'inherit', padding: 0 }}
          >Privacidad</button>
        </div>
      </div>
    </footer>
  );
}

// =========================================================================
// PAGE
// =========================================================================

export default function Landing2Page() {
  const [theme, setTheme] = useState<LandingTheme>('mix');

  return (
    <LandingThemeContext.Provider value={{ theme, setTheme }}>
      <div
        data-screen-label="Landing V2"
        className={`landing2-page ${theme !== 'mix' ? `landing2-theme-${theme}` : ''}`}
        style={{ minHeight: '100vh' }}
      >
        <Nav />
        <div className="landing2-hero-block">
          <HeroSection />
          <MetricsStrip />
        </div>
        <SocialProof />
        <ForWhomBlock />
        <HowItWorks />
        <ComparisonBlock />
        <PricingBlock />
        <FAQBlock />
        <ClosingCTA />
        <Footer />
      </div>
    </LandingThemeContext.Provider>
  );
}
