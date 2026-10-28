import React from 'react';
import { motion } from 'motion/react';
import { Zap, ShieldCheck, Layers, Gauge, Cpu, CheckCircle2 } from 'lucide-react';

export const CraftPrinciples: React.FC = () => {
  const principles = [
    {
      number: '01',
      title: '60fps Frame Budget & Physics',
      tag: 'Performance & Motion',
      icon: Zap,
      accent: 'var(--accent-primary)',
      bgAccent: 'var(--accent-light)',
      description:
        'Animations must communicate spatial intent without compromising responsiveness. Rely strictly on composited properties (transform, opacity) and spring dynamics tuned to human biomechanics.',
      metrics: ['<16.6ms per frame render', 'Zero forced reflows', 'prefers-reduced-motion compliant'],
    },
    {
      number: '02',
      title: 'Token-Driven Architecture',
      tag: 'Design Infrastructure',
      icon: Layers,
      accent: 'var(--accent-purple)',
      bgAccent: 'var(--accent-purple-light)',
      description:
        'Centralizing semantic tokens eliminates visual divergence. Design decisions flow effortlessly from Figma design tokens directly into CSS custom properties with zero runtime JavaScript weight.',
      metrics: ['100% theme sync', 'Zero runtime CSS payload', 'Multi-brand scalable'],
    },
    {
      number: '03',
      title: 'Accessible by Architectural Default',
      tag: 'Inclusion & Standards',
      icon: ShieldCheck,
      accent: 'var(--accent-emerald)',
      bgAccent: 'var(--accent-emerald-light)',
      description:
        'Accessibility is never an afterthought. Every primitive is constructed with semantic HTML5 elements, full keyboard navigation loops, ARIA compliance, and high-contrast color pairs (4.5:1+).',
      metrics: ['WCAG 2.2 AAA standard', 'Full keyboard navigation', 'Screen-reader validated'],
    },
    {
      number: '04',
      title: 'Zero-Jank Layout Stability',
      tag: 'Core Web Vitals',
      icon: Gauge,
      accent: 'var(--accent-amber)',
      bgAccent: 'var(--accent-amber-light)',
      description:
        'Eliminating Cumulative Layout Shift (CLS) through fixed aspect ratio reserving, skeleton loading buffers, and CSS layout containment, ensuring stable visual anchors on all screens.',
      metrics: ['CLS < 0.01 benchmark', 'INP < 50ms interaction', 'Sub-800ms LCP on 4G'],
    },
  ];

  return (
    <section id="craft" style={{ paddingBlock: 'var(--space-4xl)', backgroundColor: 'var(--bg-surface)' }}>
      <div className="container">
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '680px', marginInline: 'auto', marginBottom: '3.5rem' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 12px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--accent-light)',
              color: 'var(--accent-primary)',
              fontSize: '0.82rem',
              fontWeight: 600,
              fontFamily: 'var(--font-mono)',
              marginBottom: '1rem',
            }}
          >
            <Cpu size={13} />
            <span>Engineering Discipline</span>
          </div>

          <h2
            style={{
              fontSize: 'clamp(2rem, 3.8vw, 2.75rem)',
              letterSpacing: '-0.03em',
              marginBottom: '1rem',
              color: 'var(--text-primary)',
            }}
          >
            Core Craft &amp; Engineering Philosophy
          </h2>
          <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)' }}>
            The foundational standards guiding every line of component code, motion curve, and token system I deliver.
          </p>
        </div>

        {/* Bento Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.75rem',
          }}
          className="bento-grid"
        >
          {principles.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.25 }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                style={{
                  backgroundColor: 'var(--bg-app)',
                  borderRadius: 'var(--radius-xl)',
                  border: '1px solid var(--border-default)',
                  padding: '2rem',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.borderColor = 'var(--border-strong)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = 'var(--border-default)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {/* Top header row */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: item.bgAccent,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: item.accent,
                    }}
                  >
                    <Icon size={20} />
                  </div>
                  <span
                    style={{
                      fontSize: '1.25rem',
                      fontFamily: 'var(--font-heading)',
                      fontWeight: 700,
                      color: 'var(--text-faint)',
                    }}
                  >
                    {item.number}
                  </span>
                </div>

                <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: item.accent, fontWeight: 600, marginBottom: '6px' }}>
                  {item.tag}
                </div>

                <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
                  {item.title}
                </h3>

                <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.5rem', flex: 1 }}>
                  {item.description}
                </p>

                {/* Metrics Pill List */}
                <div style={{ borderTop: '1px solid var(--border-default)', paddingTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {item.metrics.map((metric, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
                      <CheckCircle2 size={13} color="var(--accent-emerald)" />
                      <span>{metric}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
