'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Logo } from '@/components/Logo';
import { Icon, Button } from '@/components/ui/common';
import HeroPreview from '@/components/HeroPreview';
import '@/styles/tokens.css';
import '@/styles/buttons.css';
import '@/styles/landingv3.css';

// ---------------------------------------------------------------------------
// Hooks
// ---------------------------------------------------------------------------

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);
  return { ref, visible };
}

function useCountUp(target: number, duration = 1800) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || started.current) return;
    const observer = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !started.current) {
          started.current = true;
          const t0 = performance.now();
          const tick = (now: number) => {
            const p = Math.min(1, (now - t0) / duration);
            setValue(Math.round(target * (1 - Math.pow(1 - p, 3))));
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration]);
  return { value, ref };
}

function Sq({ size = 6, color = 'var(--v3-accent)', style }: { size?: number; color?: string; style?: React.CSSProperties }) {
  return (
    <span
      style={{ width: size, height: size, background: color, display: 'inline-block', flexShrink: 0, ...style }}
      aria-hidden
    />
  );
}

// ---------------------------------------------------------------------------
// Nav
// ---------------------------------------------------------------------------

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, []);

  return (
    <header className={`v3-nav ${scrolled ? 'v3-nav--scrolled' : ''}`}>
      <div className="v3-nav-inner">
        <Logo size="md" theme="light" href="/" />
        <nav className="v3-nav-links">
          <a href="#como-funciona">Cómo funciona</a>
          <a href="#precio">Precio</a>
          <a href="#faq">FAQ</a>
          <Link href="/login" className="v3-nav-login">Entrar</Link>
          <Button variant="primary" size="sm" href="/checkout">
            Probar 7 días — 9 €
          </Button>
        </nav>
      </div>
    </header>
  );
}

// ---------------------------------------------------------------------------
// Hero
// ---------------------------------------------------------------------------

function HeroSection() {
  return (
    <section className="v3-hero">
      <div className="v3-hero-spotlight" />
      <div className="v3-container">
        <div className="v3-hero-badge">
          <span className="v3-hero-badge-dot" />
          Para quienes ya invierten en Meta Ads y crean creatividades cada semana
        </div>

        <h1>
          Para de inventar guiones{' '}
          <span className="v3-hero-strike">desde cero</span>.<br />
          <span className="v3-accent-text">Créalos desde lo que tu mercado ya validó.</span>
        </h1>

        <p className="v3-hero-sub">
          MIMIC selecciona los anuncios ganadores de tu sector y genera un guion original
          adaptado a tu negocio — hook, estructura, ángulo y CTA que el mercado ya demostró
          que convierte. <strong>Grabas con ventaja, no con fe.</strong>
        </p>

        <div className="v3-hero-actions">
          <Button variant="primary" size="lg" href="/checkout" style={{ minWidth: 260, fontSize: 16 }}>
            <Icon name="zap" size={18} /> Probar 7 días por 9 €
          </Button>
          <a href="#como-funciona" className="v3-hero-link">
            Ver cómo funciona
            <Icon name="arrowRight" size={16} color="var(--v3-accent-bright)" />
          </a>
        </div>

        <p className="v3-hero-note">
          7 días. Si no grabas al menos un vídeo con más confianza, te devolvemos los 9 €. Sin emails. Sin excusas.
        </p>

        <div className="v3-hero-preview" style={{ marginTop: 56 }}>
          <HeroPreview />
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Metrics
// ---------------------------------------------------------------------------

function MetricsStrip() {
  const metrics = [
    { value: 6, suffix: 'h', label: 'de research semanal que dejan de ser trabajo manual' },
    { value: 200, prefix: '+', label: 'anuncios activos analizados por cada búsqueda' },
    { value: 3, suffix: ' min', label: 'de la URL a un guion grabable, sin formularios' },
    { value: 9, suffix: '€', label: 'para probarlo. Sin plan gratuito. Sin trampa.' },
  ];

  return (
    <section className="v3-metrics">
      <div className="v3-metrics-card">
        {metrics.map((m, i) => {
          const counter = useCountUp(m.value);
          return (
            <div key={i} ref={counter.ref} className="v3-metric">
              <div className="v3-metric-value">
                {m.prefix || ''}{counter.value}{m.suffix || ''}
              </div>
              <div className="v3-metric-label">{m.label}</div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Testimonials
// ---------------------------------------------------------------------------

const TESTIMONIALS = [
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

function SocialProof() {
  const { ref, visible } = useInView();

  return (
    <section ref={ref} className="v3-section" style={{ paddingTop: 160 }}>
      <div className="v3-container">
        <div className="v3-section-header">
          <div className="v3-eyebrow">
            <Sq /> RESULTADOS REALES, NEGOCIOS REALES
          </div>
          <h2 className="v3-heading">
            Convirtieron los ganadores de su competencia{' '}
            <span className="v3-accent-text">en los suyos propios.</span>
          </h2>
        </div>

        <div className={`v3-testimonials-grid v3-stagger ${visible ? '' : ''}`}>
          {TESTIMONIALS.map((t, i) => (
            <div
              key={t.name}
              className={`v3-card v3-testimonial v3-reveal ${visible ? 'visible' : ''}`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div className="v3-testimonial-stars">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Icon key={j} name="star" size={16} color="var(--v3-accent)" filled />
                ))}
              </div>
              <p className="v3-testimonial-text">&ldquo;{t.text}&rdquo;</p>
              <div className="v3-testimonial-footer">
                {t.avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={t.avatar} alt={t.name} className="v3-testimonial-avatar" />
                ) : (
                  <div className="v3-testimonial-avatar-fallback">{t.initials}</div>
                )}
                <div>
                  <div className="v3-testimonial-name">{t.name}</div>
                  <div className="v3-testimonial-role">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// For Whom
// ---------------------------------------------------------------------------

function ForWhomBlock() {
  const { ref, visible } = useInView();

  const yesItems = [
    'Gestionas o produces Meta Ads con presupuesto real — no estás aprendiendo, estás ejecutando.',
    'Cada semana necesitas creatividades nuevas y el proceso de research te come tardes enteras.',
    'Ya conoces la Ad Library. El problema no es encontrar anuncios — es convertirlos en algo útil.',
    'Tienes clientes o un negocio que depende de que los anuncios rindan, no de que queden bonitos.',
    'Quieres un sistema repetible, no improvisar cada semana con ChatGPT.',
  ];

  const noItems = [
    'Aún no tienes anuncios activos en Meta — no hay data que analizar hasta que los tengas.',
    'Estás aprendiendo cómo funciona la publicidad digital — MIMIC es para quien ya ejecuta, no para quien empieza.',
    'Buscas una herramienta gratuita — el Sprint de 9 € existe precisamente para filtrar a quien de verdad lo necesita.',
    'Crees que con ChatGPT y creatividad propia ya tienes suficiente — quizás sí, y está bien.',
  ];

  return (
    <section ref={ref} className="v3-section v3-forwhom">
      <div className="v3-container">
        <div className={`v3-forwhom-grid v3-reveal ${visible ? 'visible' : ''}`}>
          {/* YES */}
          <div className="v3-forwhom-yes">
            <div className="v3-eyebrow">
              <Sq /> ESTO ES PARA TI SI...
            </div>
            <h3 className="v3-forwhom-title">
              Produces anuncios para Meta cada semana y ya estás harto de empezar desde cero.
            </h3>
            <ul className="v3-list">
              {yesItems.map((t) => (
                <li key={t}>
                  <span className="v3-list-icon v3-list-icon--green">
                    <Icon name="check" size={12} color="var(--v3-bg)" stroke={3} />
                  </span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* NO */}
          <div className="v3-forwhom-no">
            <div className="v3-forwhom-no-head">
              <div className="v3-eyebrow" style={{ color: 'var(--v3-error)' }}>
                <Sq color="var(--v3-error)" /> NO ES PARA TI SI
              </div>
              <span className="v3-forwhom-no-tag">Preferimos ser honestos</span>
            </div>
            <h3 className="v3-forwhom-title">
              Si no produces anuncios para Meta cada semana, MIMIC no es para ti todavía.
            </h3>
            <ul className="v3-list">
              {noItems.map((t) => (
                <li key={t}>
                  <span className="v3-list-icon v3-list-icon--red">
                    <Icon name="x" size={12} color="var(--v3-error)" stroke={2.5} />
                  </span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
            <p className="v3-forwhom-note">
              No vendemos humo a 9 €.{' '}
              <strong>Si no es tu momento, preferimos que vuelvas cuando lo sea.</strong>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// How It Works
// ---------------------------------------------------------------------------

function HowItWorks() {
  const { ref, visible } = useInView();
  const [active, setActive] = useState(0);
  const [drag, setDrag] = useState({ on: false, x0: 0, dx: 0 });

  const steps = [
    {
      n: '01',
      title: 'Pega tu URL. MIMIC entiende tu negocio.',
      body: 'Pegas la web de tu negocio y MIMIC extrae automáticamente qué vendes, a quién y cuál es tu ángulo diferencial. Nada de rellenar formularios de 20 campos.',
      time: '10 segundos',
      icon: 'building' as const,
    },
    {
      n: '02',
      title: 'Elige competidores. Encontramos sus ganadores.',
      body: 'Te sugerimos competidores reales de tu sector o añades los que ya tienes fichados. MIMIC escanea todos sus anuncios activos en Meta y te muestra cuáles llevan semanas o meses funcionando — los ganadores de verdad.',
      time: '30 segundos',
      icon: 'search' as const,
    },
    {
      n: '03',
      title: 'Convierte sus ganadores en tu guion.',
      body: 'La IA entiende por qué ese anuncio funciona — el ángulo, el gancho emocional, la estructura — y crea desde cero un guion completamente nuevo para tu negocio. Tu producto, tu voz, tu mensaje. Inspirado en lo que el mercado ya validó.',
      time: '2 minutos',
      icon: 'fileText' as const,
    },
  ];

  const onPointerDown = (e: React.PointerEvent) => {
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    setDrag({ on: true, x0: e.clientX, dx: 0 });
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.on) return;
    setDrag((d) => ({ ...d, dx: e.clientX - d.x0 }));
  };
  const onPointerUp = () => {
    if (!drag.on) return;
    const threshold = 80;
    if (drag.dx < -threshold && active < steps.length - 1) {
      setActive((a) => a + 1);
    } else if (drag.dx > threshold && active > 0) {
      setActive((a) => a - 1);
    }
    setDrag({ on: false, x0: 0, dx: 0 });
  };

  return (
    <section id="como-funciona" ref={ref} className="v3-section">
      <div className="v3-container">
        <div className="v3-section-header">
          <div className="v3-eyebrow">
            <Sq /> ASÍ DE RÁPIDO ES
          </div>
          <h2 className="v3-heading">
            Tres pasos.{' '}
            <em className="v3-accent-text" style={{ fontStyle: 'italic' }}>Aprendes de lo que funciona.</em>{' '}
            Creas algo tuyo.
          </h2>
          <p className="v3-sub">
            Arrastra la carta o haz clic en cada paso
          </p>
        </div>

        <div className={`v3-hiw-layout v3-reveal ${visible ? 'visible' : ''}`}>
          {/* Left: Step list */}
          <div className="v3-hiw-list">
            {steps.map((s, i) => (
              <button
                key={s.n}
                type="button"
                className={`v3-hiw-item ${active === i ? 'is-active' : ''}`}
                onClick={() => setActive(i)}
              >
                <span className="v3-hiw-item-num">{s.n}</span>
                <div className="v3-hiw-item-content">
                  <h3>{s.title}</h3>
                  <p>{s.body}</p>
                </div>
              </button>
            ))}
          </div>

          {/* Right: Card deck */}
          <div className="v3-hiw-deck">
            {steps.map((s, i) => {
              const offset = i - active;
              const isActive = i === active;
              const isBehind = offset > 0;
              const isGone = offset < 0;

              let tx = 0, ty = 0, rot = 0, sc = 1, op = 1;
              if (isGone) {
                tx = -420; rot = -12; sc = 0.88; op = 0;
              } else if (isBehind) {
                tx = offset * 24; ty = offset * -14; rot = offset * 4; sc = 1 - offset * 0.06;
              }
              if (isActive && drag.on) {
                tx = drag.dx;
                rot = drag.dx * 0.04;
              }

              return (
                <div
                  key={s.n}
                  className={`v3-hiw-card ${isActive ? 'is-active' : ''} ${isGone ? 'is-gone' : ''} ${isActive && drag.on ? 'is-dragging' : ''}`}
                  style={{
                    zIndex: steps.length - Math.abs(offset),
                    transform: `translateX(${tx}px) translateY(${ty}px) rotate(${rot}deg) scale(${sc})`,
                    opacity: op,
                  }}
                  onPointerDown={isActive ? onPointerDown : undefined}
                  onPointerMove={isActive ? onPointerMove : undefined}
                  onPointerUp={isActive ? onPointerUp : undefined}
                  onPointerCancel={isActive ? onPointerUp : undefined}
                >
                  <div className="v3-hiw-card-eyebrow">PASO {s.n}</div>
                  <div className="v3-hiw-card-icon">
                    <Icon name={s.icon} size={28} color="var(--v3-accent)" />
                  </div>
                  <p className="v3-hiw-card-body">{s.body}</p>
                  <div className="v3-hiw-card-footer">
                    <h4>{s.title}</h4>
                    <div className="v3-hiw-card-time">
                      <Icon name="clock" size={13} color="var(--v3-accent)" />
                      {s.time}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Comparison
// ---------------------------------------------------------------------------

function ComparisonBlock() {
  const { ref, visible } = useInView();

  const rows = [
    { sin: 'Grabas el vídeo, lo editas, lo publicas — y rezas para que funcione', con: 'Grabas sabiendo que el ángulo y el hook ya funcionaron en tu mercado', tag: 'Certeza' },
    { sin: 'Cada semana inventas el guion desde cero, sin saber si el ángulo convierte', con: 'El guion parte de estructuras validadas por el mercado, adaptadas a tu negocio', tag: 'Base' },
    { sin: '4-6 horas buscando referencias, transcribiendo vídeos, tomando notas', con: '15 minutos. Research + análisis + guion listo para grabar', tag: 'Tiempo' },
    { sin: 'Tu anuncio compite con presupuesto, no con inteligencia creativa', con: 'Cada creativo tuyo parte de lo que ya demostró generar atención en Meta', tag: 'Ventaja' },
    { sin: 'Sin historial, sin sistema — cada semana empiezas de cero', con: 'Librería de anuncios + guiones guardados por proyecto. Sistema que escala.', tag: 'Sistema' },
  ];

  return (
    <section ref={ref} className="v3-section v3-comparison">
      <div className="v3-container">
        <div className="v3-section-header">
          <div className="v3-eyebrow">
            <Sq /> LO QUE TE CUESTA NO USAR MIMIC
          </div>
          <h2 className="v3-heading">
            La diferencia entre grabar{' '}
            <span style={{ color: 'var(--v3-error)' }}>con fe</span> y grabar{' '}
            <span className="v3-accent-text">con datos.</span>
          </h2>
          <p className="v3-sub" style={{ maxWidth: 620, margin: '16px auto 0' }}>
            No es solo tiempo. Es seguir lanzando creatividades que podrían no funcionar
            cuando ya existen señales claras de lo que convierte en tu sector. MIMIC cuesta 9 € para empezar.
          </p>
        </div>

        <div className={`v3-comparison-grid v3-reveal ${visible ? 'visible' : ''}`}>
          {/* Sin */}
          <div className="v3-comparison-sin">
            <div className="v3-eyebrow" style={{ color: 'var(--v3-error)', marginBottom: 22 }}>
              <Sq color="var(--v3-error)" /> SIN MIMIC · HOY
            </div>
            <ul className="v3-comparison-list">
              {rows.map((r, i) => (
                <li key={i}>
                  <span className="v3-list-icon v3-list-icon--red" style={{ width: 22, height: 22 }}>
                    <Icon name="x" size={12} color="var(--v3-error)" stroke={2.5} />
                  </span>
                  <span>{r.sin}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Con */}
          <div className="v3-comparison-con">
            <span className="v3-comparison-recommended">RECOMENDADO</span>
            <div className="v3-eyebrow" style={{ marginBottom: 22 }}>
              <Sq /> CON MIMIC
            </div>
            <ul className="v3-comparison-list">
              {rows.map((r, i) => (
                <li key={i}>
                  <span className="v3-list-icon v3-list-icon--green" style={{ width: 22, height: 22 }}>
                    <Icon name="check" size={12} color="var(--v3-bg)" stroke={3} />
                  </span>
                  <div>
                    <span>{r.con}</span>
                    <div className="v3-comparison-tag">✓ {r.tag}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="v3-comparison-cost">
          <strong>Haz las cuentas: </strong>
          5h/semana de media buyer a 50 €/h ={' '}
          <span style={{ color: 'var(--v3-error)', fontWeight: 600 }}>1.000 €/mes</span> solo en research.
          Foreplay o AdSpy (en inglés, sin guiones):{' '}
          <span style={{ color: 'var(--v3-error)', fontWeight: 600 }}>149-249 $/mes</span>.
          MIMIC, con research + guiones + en español, para los primeros 100 fundadores:{' '}
          <span style={{ color: 'var(--v3-accent-bright)', fontWeight: 700 }}>41 €/mes</span>.
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Pricing
// ---------------------------------------------------------------------------

function PricingBlock() {
  return (
    <section id="precio" className="v3-section">
      <div className="v3-container">
        <div className="v3-section-header">
          <div className="v3-eyebrow">
            <Sq /> SIN COMPROMISO · SIN SUSCRIPCIÓN OCULTA
          </div>
          <h2 className="v3-heading">
            Pruébalo por lo que cuesta un café con tostada.{' '}
            <span className="v3-accent-text">Quédate si te ahorra horas.</span>
          </h2>
          <p className="v3-sub">
            El Sprint de 9 € te da acceso completo durante 7 días.
            Si te convence, bloqueas el precio de fundador para siempre.
            Quedan <strong style={{ color: 'var(--v3-text)' }}>73 de las 100 plazas</strong>.
          </p>
        </div>

        <div className="v3-pricing-panel">
          {/* Left: Sprint */}
          <div className="v3-pricing-left">
            <div className="v3-eyebrow" style={{ marginBottom: 8 }}>
              <Sq /> MIMIC SPRINT
            </div>
            <h3 style={{ fontWeight: 700, fontSize: 24, color: 'var(--v3-text)', lineHeight: 1.2, marginBottom: 24 }}>
              7 días para demostrarte que funciona
            </h3>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 8 }}>
              <span className="v3-pricing-price">9 €</span>
              <span className="v3-pricing-price-note">pago único</span>
            </div>
            <p style={{ fontSize: 13, color: 'var(--v3-text-tertiary)', marginBottom: 28 }}>
              Menos de lo que cobras por 10 minutos de tu tiempo. Y te ahorra tardes enteras.
            </p>
            <hr className="v3-divider" style={{ marginBottom: 24 }} />
            <p style={{ fontWeight: 600, fontSize: 14, color: 'var(--v3-text)', marginBottom: 16 }}>
              Tu Sprint incluye:
            </p>
            <ul className="v3-pricing-features">
              {[
                '5 búsquedas de competidores — analiza todo tu mercado',
                '10 guiones completos adaptados a tu negocio y sector',
                'Librería visual con todos los anuncios ganadores encontrados',
                'Edición por secciones — regenera solo el hook o el CTA si quieres',
                'Todo lo que generas es tuyo para siempre, aunque canceles',
              ].map((t) => (
                <li key={t}>
                  <Icon name="check" size={16} color="var(--v3-accent)" style={{ marginTop: 2, flexShrink: 0 }} />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
            <Button variant="primary" full size="lg" href="/checkout" style={{ marginTop: 28, fontSize: 16 }}>
              <Icon name="zap" size={18} /> Empezar ahora — 9 €
            </Button>
            <p style={{ fontSize: 12, color: 'var(--v3-text-tertiary)', textAlign: 'center', marginTop: 12 }}>
              Pago seguro vía Gumroad. Acceso en menos de 1 minuto. Cancela en 1 clic.
            </p>
          </div>

          {/* Right: Founder */}
          <div className="v3-pricing-right">
            <div>
              <div className="v3-eyebrow" style={{ marginBottom: 14 }}>
                <Sq /> DÍA 8: FUNDADOR
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 4 }}>
                <span style={{ fontWeight: 700, fontSize: 36, color: 'var(--v3-text)' }}>41 €</span>
                <span className="v3-pricing-price-note">/ mes</span>
              </div>
              <div style={{ fontSize: 13, color: 'var(--v3-accent)', fontWeight: 600, marginBottom: 8 }}>
                Bloqueado de por vida — ahorras 40 % para siempre
              </div>
              <div style={{ fontSize: 13, color: 'var(--v3-text-tertiary)', textDecoration: 'line-through' }}>
                precio normal: 69 €/mes
              </div>

              <hr className="v3-divider" style={{ margin: '20px 0' }} />

              <div className="v3-pricing-scarcity">
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                  <Icon name="zap" size={14} color="var(--v3-accent)" />
                  <span style={{ fontWeight: 700, fontSize: 12, color: 'var(--v3-text)', letterSpacing: 0.5 }}>
                    QUEDAN 73 DE 100 PLAZAS
                  </span>
                </div>
                <div className="v3-pricing-bar">
                  <div className="v3-pricing-bar-fill" />
                </div>
                <p style={{ fontSize: 12, color: 'var(--v3-text-tertiary)', lineHeight: 1.5 }}>
                  Cuando se llenen las 100, el precio sube a 69 €/mes para todo el mundo.
                  Tu plaza se bloquea en 41 € para siempre.
                </p>
              </div>
            </div>

            <div className="v3-pricing-guarantee">
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Icon name="shield" size={14} color="var(--v3-accent)" />
                <span style={{ fontWeight: 700, fontSize: 12, color: 'var(--v3-accent)', letterSpacing: 0.5 }}>
                  GARANTÍA TOTAL
                </span>
              </div>
              <p>
                Si en 7 días no consigues al menos un guion que usarías de verdad,
                te devolvemos los 9 € íntegros. Un email, cero preguntas, cero formularios.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// FAQ
// ---------------------------------------------------------------------------

const FAQ_ITEMS = [
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

function FAQItem({ q, a, open, onClick }: { q: string; a: string; open: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className={`v3-faq-item ${open ? 'is-open' : ''}`} type="button">
      <div className="v3-faq-q-row">
        <div className="v3-faq-q">
          <Sq style={{ marginTop: 7 }} />
          <span>{q}</span>
        </div>
        <span className="v3-faq-chevron">
          <Icon name="chevronDown" size={14} color={open ? 'var(--v3-accent)' : 'var(--v3-text-tertiary)'} />
        </span>
      </div>
      <div className={`v3-faq-answer ${open ? 'is-open' : ''}`}>
        <div className="v3-faq-answer-inner">
          <p>{a}</p>
        </div>
      </div>
    </button>
  );
}

function FAQBlock() {
  const [open, setOpen] = useState(0);

  return (
    <section id="faq" className="v3-section v3-faq">
      <div className="v3-container">
        <div className="v3-section-header">
          <div className="v3-eyebrow">
            <Sq /> PREGUNTAS HONESTAS, RESPUESTAS DIRECTAS
          </div>
          <h2 className="v3-heading">
            Todo lo que te estás preguntando ahora mismo.
          </h2>
        </div>

        <div className="v3-faq-list">
          {FAQ_ITEMS.map((it, i) => (
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

// ---------------------------------------------------------------------------
// Closing CTA
// ---------------------------------------------------------------------------

function ClosingCTA() {
  return (
    <section className="v3-cta">
      <div className="v3-cta-spotlight" />
      <div className="v3-container" style={{ position: 'relative' }}>
        <h2>
          Esta semana vas a grabar anuncios igualmente.<br />
          <span className="v3-accent-text">¿Lo haces a ciegas o con lo que ya funciona?</span>
        </h2>
        <p>
          7 días. 9 €. Guiones basados en lo que el mercado ya validó, adaptados a tu negocio.
          Si no grabas con más confianza, te devolvemos el dinero sin preguntas.
        </p>
        <Button variant="primary" size="lg" href="/checkout" style={{ minWidth: 280, fontSize: 16 }}>
          <Icon name="zap" size={18} /> Probar MIMIC 7 días — 9 €
        </Button>
        <p className="v3-cta-note">
          73 plazas de fundador restantes. Precio bloqueado en 41 €/mes de por vida.
        </p>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Footer
// ---------------------------------------------------------------------------

function Footer() {
  return (
    <footer className="v3-footer">
      <div className="v3-footer-inner">
        <Logo size="sm" theme="light" href="/" />
        <div className="v3-footer-links">
          <span>MIMIC © 2026 · Pago seguro vía Gumroad</span>
          <Link href="/legal">Términos</Link>
          <span>·</span>
          <Link href="/legal">Privacidad</Link>
        </div>
      </div>
    </footer>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function LandingV2Page() {
  return (
    <div className="v3">
      <Nav />
      <HeroSection />
      <MetricsStrip />
      <SocialProof />
      <ForWhomBlock />
      <HowItWorks />
      <ComparisonBlock />
      <PricingBlock />
      <FAQBlock />
      <ClosingCTA />
      <Footer />
    </div>
  );
}
