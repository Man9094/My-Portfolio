import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sliders,
  Palette,
  Sparkles,
  Copy,
  Check,
  ChevronDown,
  Layers,
  Play,
  RotateCcw,
} from 'lucide-react';
import { DESIGN_TOKENS } from '../data/portfolioData';

export const ComponentPlayground: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'spring' | 'tokens' | 'primitives'>('spring');

  // Spring tuner state
  const [stiffness, setStiffness] = useState(380);
  const [damping, setDamping] = useState(22);
  const [mass, setMass] = useState(1);
  const [springKey, setSpringKey] = useState(0);
  const [copiedCode, setCopiedCode] = useState(false);

  // Micro-interaction states
  const [toggleState, setToggleState] = useState(true);
  const [segmentedValue, setSegmentedValue] = useState('Production');
  const [accordionOpen, setAccordionOpen] = useState(true);
  const [counter, setCounter] = useState(42);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  const copySpringCode = () => {
    const code = `// Motion for React 19 Spring Configuration
import { motion } from "motion/react";

<motion.div
  initial={{ scale: 0.8, opacity: 0 }}
  animate={{ scale: 1, opacity: 1 }}
  transition={{
    type: "spring",
    stiffness: ${stiffness},
    damping: ${damping},
    mass: ${mass}
  }}
/>`;
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const copyTokenValue = (tokenName: string) => {
    navigator.clipboard.writeText(`var(${tokenName})`);
    setCopiedToken(tokenName);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  return (
    <section id="playground" style={{ paddingBlock: 'var(--space-4xl)', backgroundColor: 'var(--bg-app)' }}>
      <div className="container">
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '720px', marginInline: 'auto', marginBottom: '3rem' }}>
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
            <Sliders size={13} />
            <span>Interactive Laboratory</span>
          </div>
          <h2
            style={{
              fontSize: 'clamp(2rem, 3.8vw, 2.75rem)',
              letterSpacing: '-0.03em',
              marginBottom: '1rem',
              color: 'var(--text-primary)',
            }}
          >
            Design Systems &amp; Motion Lab
          </h2>
          <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)' }}>
            Live playground demonstrating token architectures, spring physics solvers, and accessible micro-interaction patterns built with Motion and React 19.
          </p>
        </div>

        {/* Playground Navigation Tabs */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '2.5rem',
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              padding: '6px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-default)',
              boxShadow: 'var(--shadow-sm)',
              gap: '4px',
            }}
          >
            {[
              { id: 'spring', label: 'Spring Physics Tuner', icon: Sparkles },
              { id: 'tokens', label: 'Design Tokens', icon: Palette },
              { id: 'primitives', label: 'UI Primitives Lab', icon: Layers },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  style={{
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 18px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.88rem',
                    fontWeight: isActive ? 600 : 500,
                    color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    zIndex: 1,
                    transition: 'color 0.15s ease',
                  }}
                >
                  {isActive && (
                    <motion.div
                      layoutId="playgroundTab"
                      style={{
                        position: 'absolute',
                        inset: 0,
                        backgroundColor: 'var(--accent-light)',
                        border: '1px solid var(--accent-border)',
                        borderRadius: 'var(--radius-full)',
                        zIndex: -1,
                      }}
                      transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                    />
                  )}
                  <Icon size={15} color={isActive ? 'var(--accent-primary)' : 'currentColor'} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab 1: Spring Physics Tuner */}
        {activeTab === 'spring' && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '2rem',
              backgroundColor: 'var(--bg-surface)',
              padding: '2.5rem',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid var(--border-default)',
              boxShadow: 'var(--shadow-lg)',
            }}
            className="playground-grid"
          >
            {/* Left: Sliders & Controls */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 700 }}>Spring Dynamics Controls</h3>
                <button
                  onClick={() => {
                    setStiffness(380);
                    setDamping(22);
                    setMass(1);
                    setSpringKey((k) => k + 1);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '0.78rem',
                    color: 'var(--text-muted)',
                    fontFamily: 'var(--font-mono)',
                    padding: '4px 8px',
                    borderRadius: 'var(--radius-xs)',
                    border: '1px solid var(--border-default)',
                  }}
                >
                  <RotateCcw size={12} /> Reset
                </button>
              </div>

              {/* Slider 1: Stiffness */}
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.88rem' }}>
                  <span style={{ fontWeight: 600 }}>Stiffness (k)</span>
                  <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-primary)', fontWeight: 600 }}>{stiffness}</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="800"
                  step="10"
                  value={stiffness}
                  onChange={(e) => {
                    setStiffness(Number(e.target.value));
                    setSpringKey((k) => k + 1);
                  }}
                  style={{ width: '100%', accentColor: 'var(--accent-primary)', cursor: 'pointer' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  <span>Gentle (100)</span>
                  <span>Hyper-responsive (800)</span>
                </div>
              </div>

              {/* Slider 2: Damping */}
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.88rem' }}>
                  <span style={{ fontWeight: 600 }}>Damping (c)</span>
                  <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-primary)', fontWeight: 600 }}>{damping}</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="60"
                  step="1"
                  value={damping}
                  onChange={(e) => {
                    setDamping(Number(e.target.value));
                    setSpringKey((k) => k + 1);
                  }}
                  style={{ width: '100%', accentColor: 'var(--accent-primary)', cursor: 'pointer' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  <span>Oscillatory / Bouncy (5)</span>
                  <span>Overdamped (60)</span>
                </div>
              </div>

              {/* Slider 3: Mass */}
              <div style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.88rem' }}>
                  <span style={{ fontWeight: 600 }}>Mass (m)</span>
                  <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-primary)', fontWeight: 600 }}>{mass}</span>
                </div>
                <input
                  type="range"
                  min="0.2"
                  max="3"
                  step="0.1"
                  value={mass}
                  onChange={(e) => {
                    setMass(Number(e.target.value));
                    setSpringKey((k) => k + 1);
                  }}
                  style={{ width: '100%', accentColor: 'var(--accent-primary)', cursor: 'pointer' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  <span>Featherlight (0.2)</span>
                  <span>Heavy Inertia (3.0)</span>
                </div>
              </div>

              {/* Copy Code Button */}
              <button
                onClick={copySpringCode}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 18px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--bg-surface-subtle)',
                  border: '1px solid var(--border-default)',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  boxShadow: 'var(--shadow-xs)',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-surface-hover)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-surface-subtle)')}
              >
                {copiedCode ? <Check size={15} color="var(--accent-emerald)" /> : <Copy size={15} />}
                <span>{copiedCode ? 'React Motion Code Copied!' : 'Copy Spring Preset Config'}</span>
              </button>
            </div>

            {/* Right: Live Interactive Canvas & Physics Simulator */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: 'var(--bg-surface-subtle)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-default)',
                padding: '2rem',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                minHeight: '340px',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: '1rem',
                  left: '1.25rem',
                  fontSize: '0.75rem',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--text-muted)',
                }}
              >
                TARGET ANIMATION PREVIEW
              </div>

              {/* Dynamic Animated Motion Card */}
              <motion.div
                key={springKey}
                initial={{ scale: 0.3, y: 50, rotate: -15, opacity: 0 }}
                animate={{ scale: 1, y: 0, rotate: 0, opacity: 1 }}
                transition={{
                  type: 'spring',
                  stiffness: stiffness,
                  damping: damping,
                  mass: mass,
                }}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.94 }}
                drag
                dragConstraints={{ left: -100, right: 100, top: -70, bottom: 70 }}
                style={{
                  width: '160px',
                  height: '160px',
                  borderRadius: 'var(--radius-xl)',
                  background: 'linear-gradient(145deg, #ffffff 0%, #f1f5f9 100%)',
                  border: '2px solid var(--accent-primary)',
                  boxShadow: '0 20px 30px -10px rgba(37, 99, 235, 0.35)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'grab',
                  userSelect: 'none',
                  textAlign: 'center',
                  padding: '1.25rem',
                }}
              >
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'var(--accent-light)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--accent-primary)',
                    marginBottom: '8px',
                  }}
                >
                  <Sparkles size={22} />
                </div>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Fluid Motion
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: '2px' }}>
                  {stiffness}k &middot; {damping}c
                </div>
              </motion.div>

              <button
                onClick={() => setSpringKey((k) => k + 1)}
                style={{
                  marginTop: '2rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 16px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: 'var(--accent-primary)',
                  color: '#ffffff',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                <Play size={13} fill="currentColor" />
                <span>Trigger Entry Animation</span>
              </button>
            </div>
          </motion.div>
        )}

        {/* Tab 2: Design Tokens Inspector */}
        {activeTab === 'tokens' && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            style={{
              display: 'grid',
              gap: '2rem',
            }}
          >
            {/* Color Tokens */}
            <div
              style={{
                backgroundColor: 'var(--bg-surface)',
                borderRadius: 'var(--radius-xl)',
                border: '1px solid var(--border-default)',
                padding: '2rem',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                Color System &amp; Accessible Contrasts
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                Click any token to copy its CSS variable string directly to your clipboard.
              </p>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))',
                  gap: '1rem',
                }}
              >
                {DESIGN_TOKENS.colors.map((color) => {
                  const isCopied = copiedToken === color.token;
                  return (
                    <button
                      key={color.token}
                      onClick={() => copyTokenValue(color.token)}
                      style={{
                        textAlign: 'left',
                        padding: '12px',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: 'var(--bg-surface-subtle)',
                        border: '1px solid var(--border-default)',
                        transition: 'transform 0.15s ease, border-color 0.15s ease',
                        cursor: 'pointer',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--accent-primary)')}
                      onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border-default)')}
                    >
                      <div
                        style={{
                          height: '48px',
                          borderRadius: 'var(--radius-sm)',
                          backgroundColor: color.sample,
                          border: color.border ? '1px solid var(--border-default)' : 'none',
                          marginBottom: '10px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {isCopied && <Check size={18} color={color.dark ? '#ffffff' : '#0f172a'} />}
                      </div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '2px' }}>
                        {color.name}
                      </div>
                      <div style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-primary)' }}>
                        {color.token}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                        {color.value}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Typography Tokens */}
            <div
              style={{
                backgroundColor: 'var(--bg-surface)',
                borderRadius: 'var(--radius-xl)',
                border: '1px solid var(--border-default)',
                padding: '2rem',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem' }}>
                Typographic Hierarchy
              </h3>
              <div style={{ display: 'grid', gap: '1.25rem' }}>
                {DESIGN_TOKENS.typography.map((type, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '1rem',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--bg-surface-subtle)',
                      border: '1px solid var(--border-subtle)',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginBottom: '6px' }}>
                      <span>{type.role} &middot; {type.font} ({type.weight})</span>
                    </div>
                    <div style={{ fontFamily: `var(--font-${type.font.toLowerCase().includes('space') ? 'heading' : type.font.toLowerCase().includes('jetbrains') ? 'mono' : 'body'})`, fontSize: idx === 0 ? '1.5rem' : '1.05rem', fontWeight: Number(type.weight) || 600, color: 'var(--text-primary)' }}>
                      {type.sample}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Tab 3: Primitives Lab */}
        {activeTab === 'primitives' && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.75rem',
            }}
          >
            {/* Primitive 1: Segmented Pill Controller */}
            <div
              style={{
                backgroundColor: 'var(--bg-surface)',
                borderRadius: 'var(--radius-xl)',
                border: '1px solid var(--border-default)',
                padding: '2rem',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <div style={{ fontSize: '0.78rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-primary)', marginBottom: '4px' }}>
                LAYOUT ID COMPONENT
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1rem' }}>
                Segmented Controller
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                Shared layout animation with continuous spring physics between tab transitions.
              </p>

              <div
                style={{
                  display: 'flex',
                  backgroundColor: 'var(--bg-surface-subtle)',
                  padding: '4px',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid var(--border-default)',
                }}
              >
                {['Staging', 'Preview', 'Production'].map((env) => {
                  const isCurrent = segmentedValue === env;
                  return (
                    <button
                      key={env}
                      onClick={() => setSegmentedValue(env)}
                      style={{
                        flex: 1,
                        position: 'relative',
                        padding: '8px 12px',
                        fontSize: '0.82rem',
                        fontWeight: isCurrent ? 600 : 500,
                        color: isCurrent ? 'var(--text-primary)' : 'var(--text-muted)',
                        borderRadius: 'var(--radius-full)',
                        cursor: 'pointer',
                        zIndex: 1,
                      }}
                    >
                      {isCurrent && (
                        <motion.div
                          layoutId="primitiveSegment"
                          style={{
                            position: 'absolute',
                            inset: 0,
                            backgroundColor: '#ffffff',
                            borderRadius: 'var(--radius-full)',
                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.08)',
                            zIndex: -1,
                          }}
                          transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                        />
                      )}
                      {env}
                    </button>
                  );
                })}
              </div>

              <div style={{ marginTop: '1rem', fontSize: '0.78rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                Active Target: <span style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>{segmentedValue}</span>
              </div>
            </div>

            {/* Primitive 2: Accessible Smooth Switch */}
            <div
              style={{
                backgroundColor: 'var(--bg-surface)',
                borderRadius: 'var(--radius-xl)',
                border: '1px solid var(--border-default)',
                padding: '2rem',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <div style={{ fontSize: '0.78rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-primary)', marginBottom: '4px' }}>
                INTERACTIVE STATE
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1rem' }}>
                Fluid Spring Toggle
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                Accessible switch control supporting keyboard focus, ARIA role, and tactile spring feedback.
              </p>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Haptic Feedback</span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={toggleState}
                  onClick={() => setToggleState(!toggleState)}
                  style={{
                    width: '56px',
                    height: '30px',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: toggleState ? 'var(--accent-primary)' : 'var(--border-strong)',
                    padding: '3px',
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s ease',
                  }}
                >
                  <motion.div
                    animate={{ x: toggleState ? 26 : 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 28 }}
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      backgroundColor: '#ffffff',
                      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)',
                    }}
                  />
                </button>
              </div>

              <div style={{ marginTop: '1.25rem', fontSize: '0.78rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                Status: {toggleState ? 'ENABLED (true)' : 'DISABLED (false)'}
              </div>
            </div>

            {/* Primitive 3: Height Auto Accordion */}
            <div
              style={{
                backgroundColor: 'var(--bg-surface)',
                borderRadius: 'var(--radius-xl)',
                border: '1px solid var(--border-default)',
                padding: '2rem',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <div style={{ fontSize: '0.78rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-primary)', marginBottom: '4px' }}>
                DYNAMIC HEIGHT ANIMATION
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1rem' }}>
                Height Auto Drawer
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                Animates height between 0 and auto with zero CLS layout penalty.
              </p>

              <div style={{ border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                <button
                  onClick={() => setAccordionOpen(!accordionOpen)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: 'var(--bg-surface-subtle)',
                    fontSize: '0.88rem',
                    fontWeight: 600,
                  }}
                >
                  <span>WCAG Token Verification</span>
                  <motion.div
                    animate={{ rotate: accordionOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown size={16} />
                  </motion.div>
                </button>

                <AnimatePresence initial={false}>
                  {accordionOpen && (
                    <motion.div
                      key="accordionContent"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                      style={{ overflow: 'hidden' }}
                    >
                      <div style={{ padding: '14px 16px', fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.6, backgroundColor: '#ffffff' }}>
                        All primary and secondary token combinations enforce an automated 4.5:1 minimum contrast ratio test in continuous deployment.
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Primitive 4: Interactive Numeric Stepper */}
            <div
              style={{
                backgroundColor: 'var(--bg-surface)',
                borderRadius: 'var(--radius-xl)',
                border: '1px solid var(--border-default)',
                padding: '2rem',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <div style={{ fontSize: '0.78rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-primary)', marginBottom: '4px' }}>
                SPRING NUMBER ANIMATION
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1rem' }}>
                Spring Numeric Stepper
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                Tactile state incrementor with layout animations on digit transitions.
              </p>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.25rem' }}>
                <button
                  onClick={() => setCounter((c) => Math.max(0, c - 1))}
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: 'var(--bg-surface-subtle)',
                    border: '1px solid var(--border-default)',
                    fontSize: '1.2rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                  aria-label="Decrement value"
                >
                  -
                </button>

                <motion.div
                  key={counter}
                  initial={{ scale: 0.7, y: -8, opacity: 0 }}
                  animate={{ scale: 1, y: 0, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                  style={{
                    fontSize: '2rem',
                    fontWeight: 700,
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--accent-primary)',
                    minWidth: '60px',
                    textAlign: 'center',
                  }}
                >
                  {counter}
                </motion.div>

                <button
                  onClick={() => setCounter((c) => c + 1)}
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: 'var(--accent-primary)',
                    color: '#ffffff',
                    fontSize: '1.2rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                  aria-label="Increment value"
                >
                  +
                </button>
              </div>

              <div style={{ marginTop: '1.25rem', textAlign: 'center', fontSize: '0.78rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                Physics-driven digit pulse
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
};
