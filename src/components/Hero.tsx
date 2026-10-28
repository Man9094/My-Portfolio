import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowRight,
  Code2,
  Copy,
  Check,
  Zap,
  ShieldCheck,
  Layers,
  Sparkles,
  Sliders,
  RotateCcw,
} from 'lucide-react';

interface HeroProps {
  onExploreWork: () => void;
  onExplorePlayground: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreWork, onExplorePlayground }) => {
  const [copied, setCopied] = useState(false);
  const [springPreset, setSpringPreset] = useState<'bouncy' | 'smooth' | 'snappy'>('bouncy');
  const [triggerCount, setTriggerCount] = useState(0);

  const copyEmail = () => {
    navigator.clipboard.writeText('alex.rivera.dev@gmail.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const springConfigs = {
    bouncy: { stiffness: 450, damping: 14, mass: 1 },
    smooth: { stiffness: 220, damping: 28, mass: 1 },
    snappy: { stiffness: 600, damping: 32, mass: 0.8 },
  };

  const skills = [
    { label: 'React 19 Primitives', icon: Layers },
    { label: 'Multi-Brand Token Systems', icon: Sliders },
    { label: '60fps Motion Physics', icon: Zap },
    { label: 'WCAG AAA Accessibility', icon: ShieldCheck },
  ];

  return (
    <section
      id="hero"
      style={{
        paddingTop: 'calc(80px + var(--space-3xl))',
        paddingBottom: 'var(--space-3xl)',
        position: 'relative',
      }}
    >
      <div className="container">
        <div className="hero-grid" style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.9fr', gap: '3rem', alignItems: 'center' }}>
          {/* Left Column: Typography & Bio */}
          <div>
            {/* Supertitle badge */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-default)',
                boxShadow: 'var(--shadow-xs)',
                marginBottom: '1.5rem',
              }}
            >
              <Sparkles size={14} color="var(--accent-primary)" />
              <span
                style={{
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--text-secondary)',
                }}
              >
                Frontend Architecture &middot; UI/UX Craft
              </span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.08 }}
              style={{
                fontSize: 'clamp(2.5rem, 5.2vw, 3.85rem)',
                lineHeight: 1.08,
                letterSpacing: '-0.035em',
                fontWeight: 700,
                color: 'var(--text-primary)',
                marginBottom: '1.5rem',
              }}
            >
              Engineering <span style={{ color: 'var(--accent-primary)', textDecoration: 'underline', textDecorationColor: 'var(--accent-border)', textUnderlineOffset: '6px' }}>living design systems</span> &amp; fluid web interfaces.
            </motion.h1>

            {/* Subtitle / Paragraph */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.16 }}
              style={{
                fontSize: '1.15rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.65,
                maxWidth: '580px',
                marginBottom: '2rem',
              }}
            >
              Staff Frontend &amp; Design Systems Engineer specializing in design token pipelines,
              accessible React 19 primitives, and purposeful Motion physics with frame-budget discipline.
            </motion.p>

            {/* Primary Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.22 }}
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                gap: '1rem',
                marginBottom: '2.5rem',
              }}
            >
              <button
                onClick={onExploreWork}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '13px 26px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: 'var(--text-primary)',
                  color: '#ffffff',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  boxShadow: 'var(--shadow-md)',
                  transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--accent-primary)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--text-primary)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                }}
              >
                <span>View Case Studies</span>
                <ArrowRight size={17} />
              </button>

              <button
                onClick={onExplorePlayground}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 22px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: 'var(--bg-surface)',
                  color: 'var(--text-primary)',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  border: '1px solid var(--border-default)',
                  boxShadow: 'var(--shadow-xs)',
                  transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--text-primary)';
                  e.currentTarget.style.backgroundColor = 'var(--bg-surface-subtle)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-default)';
                  e.currentTarget.style.backgroundColor = 'var(--bg-surface)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <Code2 size={17} color="var(--accent-primary)" />
                <span>Component Lab</span>
              </button>

              {/* Direct email copy */}
              <button
                onClick={copyEmail}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 14px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: 'transparent',
                  color: 'var(--text-muted)',
                  fontSize: '0.85rem',
                  fontFamily: 'var(--font-mono)',
                  border: '1px dashed var(--border-default)',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--text-primary)';
                  e.currentTarget.style.borderColor = 'var(--border-strong)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--text-muted)';
                  e.currentTarget.style.borderColor = 'var(--border-default)';
                }}
                aria-label="Copy email address"
              >
                {copied ? <Check size={14} color="var(--accent-emerald)" /> : <Copy size={14} />}
                <span>{copied ? 'Email Copied!' : 'alex.rivera.dev@gmail.com'}</span>
              </button>
            </motion.div>

            {/* Technical Skills Pill Grid */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '0.75rem',
                paddingTop: '1.5rem',
                borderTop: '1px solid var(--border-default)',
              }}
            >
              {skills.map((skill, index) => {
                const IconComponent = skill.icon;
                return (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      color: 'var(--text-secondary)',
                    }}
                  >
                    <div
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: 'var(--radius-xs)',
                        backgroundColor: 'var(--accent-light)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--accent-primary)',
                      }}
                    >
                      <IconComponent size={14} />
                    </div>
                    <span>{skill.label}</span>
                  </div>
                );
              })}
            </motion.div>
          </div>

          {/* Right Column: Live Interactive Motion Physics Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid var(--border-default)',
              boxShadow: 'var(--shadow-xl)',
              padding: '1.75rem',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Header of Interactive Card */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingBottom: '1rem',
                borderBottom: '1px solid var(--border-subtle)',
                marginBottom: '1.25rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--accent-primary)',
                  }}
                />
                <span style={{ fontSize: '0.8rem', fontWeight: 600, fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Interactive Physics Playground
                </span>
              </div>
              <span
                style={{
                  fontSize: '0.72rem',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--accent-emerald)',
                  backgroundColor: 'var(--accent-emerald-light)',
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-full)',
                  fontWeight: 600,
                }}
              >
                60.0 FPS
              </span>
            </div>

            {/* Preset Selector */}
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '6px', fontWeight: 500 }}>
                Motion Spring Preset:
              </div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '6px',
                  backgroundColor: 'var(--bg-surface-subtle)',
                  padding: '4px',
                  borderRadius: 'var(--radius-sm)',
                }}
              >
                {(['bouncy', 'smooth', 'snappy'] as const).map((preset) => (
                  <button
                    key={preset}
                    onClick={() => {
                      setSpringPreset(preset);
                      setTriggerCount((c) => c + 1);
                    }}
                    style={{
                      padding: '6px 8px',
                      borderRadius: 'var(--radius-xs)',
                      fontSize: '0.78rem',
                      fontWeight: springPreset === preset ? 600 : 500,
                      backgroundColor: springPreset === preset ? '#ffffff' : 'transparent',
                      color: springPreset === preset ? 'var(--accent-primary)' : 'var(--text-secondary)',
                      boxShadow: springPreset === preset ? 'var(--shadow-xs)' : 'none',
                      textTransform: 'capitalize',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            {/* Interactive Spring Simulator Canvas/Box */}
            <div
              style={{
                backgroundColor: 'var(--bg-app)',
                borderRadius: 'var(--radius-lg)',
                border: '1px dashed var(--border-default)',
                padding: '2rem 1.5rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '190px',
                position: 'relative',
              }}
            >
              <motion.div
                key={`${springPreset}-${triggerCount}`}
                initial={{ scale: 0.6, rotate: -8 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  type: 'spring',
                  ...springConfigs[springPreset],
                }}
                whileHover={{ scale: 1.05, rotate: 2 }}
                whileTap={{ scale: 0.92 }}
                drag
                dragConstraints={{ left: -50, right: 50, top: -30, bottom: 30 }}
                style={{
                  width: '120px',
                  height: '120px',
                  borderRadius: 'var(--radius-lg)',
                  background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                  boxShadow: '0 12px 24px -6px rgba(37, 99, 235, 0.45)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  cursor: 'grab',
                  userSelect: 'none',
                  textAlign: 'center',
                  padding: '12px',
                }}
              >
                <Sparkles size={24} style={{ marginBottom: '6px' }} />
                <div style={{ fontSize: '0.78rem', fontWeight: 700, fontFamily: 'var(--font-heading)' }}>
                  Drag &amp; Release
                </div>
                <div style={{ fontSize: '0.65rem', opacity: 0.85, fontFamily: 'var(--font-mono)' }}>
                  Spring Physics
                </div>
              </motion.div>

              <button
                onClick={() => setTriggerCount((c) => c + 1)}
                style={{
                  position: 'absolute',
                  bottom: '10px',
                  right: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '0.72rem',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--text-muted)',
                  padding: '4px 8px',
                  borderRadius: 'var(--radius-xs)',
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border-default)',
                }}
              >
                <RotateCcw size={11} /> Re-trigger
              </button>
            </div>

            {/* Spring Parameters readout */}
            <div
              style={{
                marginTop: '1rem',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--bg-surface-subtle)',
                display: 'flex',
                justifyContent: 'space-between',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                color: 'var(--text-secondary)',
              }}
            >
              <span>stiffness: {springConfigs[springPreset].stiffness}</span>
              <span>damping: {springConfigs[springPreset].damping}</span>
              <span>mass: {springConfigs[springPreset].mass}</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
