'use client';

import {
  useState,
  useEffect,
  useLayoutEffect,
  useRef,
  useMemo,
  useCallback,
} from 'react';
import { Icon } from '@/components/ui/common';
import '@/styles/hero-scene.css';
import '@/styles/landing2.css';

function Sq({ size = 8, color = 'var(--c-green)', style }: { size?: number; color?: string; style?: React.CSSProperties }) {
  return <span style={{ width: size, height: size, background: color, display: 'inline-block', flexShrink: 0, ...style }} aria-hidden />;
}

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

const PREVIEW_SOURCE = PREVIEW_ADS[1];
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
        <p className="hero-preview-scene-say">{armed ? sayOut : ' '}</p>
      </div>
      <div className="hero-preview-scene-block hero-preview-scene-visual">
        <span className="hero-preview-scene-label">PLANOS / QUÉ HACER</span>
        <p className="hero-preview-scene-action">{armed ? visualOut : ' '}</p>
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

function PreviewSceneFrame({
  phase, showResults, showWinners, showAnalysis, showOutput, showScript, showLibrary,
  showCursor, cursorClick, loopKey, reducedMotion,
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
      className={`hero-scene-frame landing2-preview ${showCursor ? 'show-cursor' : ''} ${cursorClick ? 'cursor-click' : ''}`}
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

export default function HeroPreview() {
  const reducedMotion = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches || false;
  }, []);

  const scriptPhaseIdx = PREVIEW_PHASES.findIndex((p) => p.id === 'script');
  const [phaseIdx, setPhaseIdx] = useState(reducedMotion ? scriptPhaseIdx : 0);
  const [loopKey, setLoopKey] = useState(0);
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
      />
    </div>
  );
}
