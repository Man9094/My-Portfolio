import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowDown, RotateCcw } from 'lucide-react';
import { ParticleField } from './ParticleField';

type IntroPhase = 'dot' | 'name' | 'hold' | 'morph' | 'hero';

interface CinematicIntroHeroProps {
  onNavigate: (sectionId: string) => void;
}

export const CinematicIntroHero = ({ onNavigate }: CinematicIntroHeroProps) => {
  // Check for reduced motion preference
  const prefersReducedMotion = typeof window !== 'undefined'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const [phase, setPhase] = useState<IntroPhase>(prefersReducedMotion ? 'hero' : 'dot');

  const skipIntro = useCallback(() => {
    setPhase('hero');
  }, []);

  const replayIntro = () => {
    setPhase('dot');
  };

  // Keyboard shortcut: Escape to skip
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && phase !== 'hero') {
        skipIntro();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [phase, skipIntro]);

  // Main intro sequence timers
  useEffect(() => {
    if (prefersReducedMotion || phase === 'hero') return;

    let timeoutId: number;

    if (phase === 'dot') {
      // Step 1: Dot moves across and explodes into name
      timeoutId = window.setTimeout(() => {
        setPhase('name');
      }, 1100);
    } else if (phase === 'name') {
      // Step 2 & 3: Letters rotate & settle into MAN CHAUDHARI, then hold
      timeoutId = window.setTimeout(() => {
        setPhase('hold');
      }, 1200);
    } else if (phase === 'hold') {
      // Step 3: Hold long enough to read MAN CHAUDHARI (~1.8s)
      timeoutId = window.setTimeout(() => {
        setPhase('morph');
      }, 1900);
    } else if (phase === 'morph') {
      // Step 4 & 5: Transition into PORTFOLIO, then move/scale into lower-left hero
      timeoutId = window.setTimeout(() => {
        setPhase('hero');
      }, 1300);
    }

    return () => clearTimeout(timeoutId);
  }, [phase, prefersReducedMotion]);

  const nameLetters = 'MAN CHAUDHARI'.split('');
  const portfolioLetters = 'PORTFOLIO'.split('');

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100vh',
        backgroundColor: 'var(--bg-deep)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Step 6: Subtle Silver Particle Field (Revealed in hero phase, or faint in intro) */}
      <ParticleField opacity={phase === 'hero' ? 0.75 : 0.25} />

      {/* Skip Intro Button (Visible only during intro sequence) */}
      <AnimatePresence>
        {phase !== 'hero' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'fixed',
              top: '1.75rem',
              right: '2rem',
              zIndex: 60,
            }}
          >
            <button
              onClick={skipIntro}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                borderRadius: '9999px',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: 'var(--silver-muted)',
                fontSize: '0.78rem',
                fontFamily: 'var(--font-mono)',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#ffffff';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--silver-muted)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
              }}
              aria-label="Skip introductory animation"
            >
              <span>Skip Intro</span>
              <span style={{ opacity: 0.5 }}>[ESC]</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Final Minimal Navigation (Fades in during Step 6 / Hero Phase) */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{
          opacity: phase === 'hero' ? 1 : 0,
          y: phase === 'hero' ? 0 : -20,
        }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          padding: '1.75rem clamp(1.5rem, 5vw, 4rem)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pointerEvents: phase === 'hero' ? 'auto' : 'none',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
        }}
        aria-label="Primary Navigation"
      >
        {/* Name kept visible in final navigation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            style={{
              fontSize: '1rem',
              fontWeight: 800,
              fontFamily: 'var(--font-display)',
              letterSpacing: '-0.02em',
              color: 'var(--silver-bright)',
              textTransform: 'uppercase',
            }}
          >
            MAN CHAUDHARI
          </a>
        </div>

        {/* Minimal links: Work, About, Contact */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          {['work', 'about', 'contact'].map((item) => (
            <button
              key={item}
              onClick={() => onNavigate(item)}
              style={{
                fontSize: '0.88rem',
                fontFamily: 'var(--font-body)',
                fontWeight: 500,
                color: 'var(--silver-secondary)',
                textTransform: 'capitalize',
                letterSpacing: '0.02em',
                transition: 'color 0.2s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--silver-secondary)')}
            >
              {item}
            </button>
          ))}

          {/* Subtle Replay Intro action */}
          <button
            onClick={replayIntro}
            title="Replay intro animation"
            aria-label="Replay intro animation"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: 'var(--silver-muted)',
              transition: 'all 0.2s ease',
              marginLeft: '0.5rem',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#ffffff';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.25)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--silver-muted)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
            }}
          >
            <RotateCcw size={13} />
          </button>
        </div>
      </motion.nav>

      {/* Main Full-Screen Intro & Hero Stage */}
      <div
        style={{
          position: 'relative',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: phase === 'hero' ? 'flex-end' : 'center',
          alignItems: phase === 'hero' ? 'flex-start' : 'center',
          padding: 'clamp(2rem, 6vw, 5rem) clamp(1.5rem, 5vw, 4rem)',
          zIndex: 10,
        }}
      >
        {/* Step 1: Small White Moving Dot */}
        <AnimatePresence>
          {phase === 'dot' && (
            <motion.div
              key="intro-dot"
              initial={{ x: '-35vw', y: 0, opacity: 0, scale: 0.4 }}
              animate={{
                x: ['-35vw', '0vw'],
                opacity: [0, 1, 1],
                scale: [0.6, 1.4, 1],
              }}
              exit={{ scale: 3.5, opacity: 0 }}
              transition={{
                duration: 1.05,
                ease: [0.22, 1, 0.36, 1],
              }}
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: '#ffffff',
                boxShadow: '0 0 24px 8px rgba(255, 255, 255, 0.8), 0 0 60px 20px rgba(226, 232, 240, 0.3)',
              }}
            />
          )}
        </AnimatePresence>

        {/* Step 2 & 3: Individually Animated Letters Rotate & Settle into "MAN CHAUDHARI" */}
        <AnimatePresence>
          {(phase === 'name' || phase === 'hold') && (
            <motion.div
              key="intro-name"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{
                opacity: 0,
                scale: 1.08,
                filter: 'blur(8px)',
                transition: { duration: 0.3 },
              }}
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '0.15em',
                textAlign: 'center',
                perspective: '1000px',
                maxWidth: '92vw',
              }}
            >
              {nameLetters.map((char, index) => {
                if (char === ' ') {
                  return (
                    <span
                      key={index}
                      style={{
                        display: 'inline-block',
                        width: 'clamp(0.8rem, 2.5vw, 2rem)',
                      }}
                    >
                      &nbsp;
                    </span>
                  );
                }

                return (
                  <motion.span
                    key={index}
                    initial={{
                      opacity: 0,
                      y: 50,
                      rotateX: -85,
                      rotateY: (index % 2 === 0 ? 1 : -1) * 35,
                      scale: 0.75,
                      filter: 'blur(10px)',
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      rotateX: 0,
                      rotateY: 0,
                      scale: 1,
                      filter: 'blur(0px)',
                    }}
                    transition={{
                      type: 'spring',
                      stiffness: 280,
                      damping: 20,
                      delay: index * 0.038,
                    }}
                    style={{
                      display: 'inline-block',
                      fontFamily: 'var(--font-display)',
                      fontSize: 'clamp(2.4rem, 6.8vw, 6.5rem)',
                      fontWeight: 900,
                      letterSpacing: '-0.04em',
                      color: '#ffffff',
                      textShadow: '0 4px 30px rgba(255, 255, 255, 0.25)',
                      transformStyle: 'preserve-3d',
                    }}
                  >
                    {char}
                  </motion.span>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Step 4: Letters Transition Into "PORTFOLIO" in Center */}
        <AnimatePresence>
          {phase === 'morph' && (
            <motion.div
              key="intro-portfolio-morph"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                perspective: '1000px',
              }}
            >
              {portfolioLetters.map((char, index) => (
                <motion.span
                  key={index}
                  initial={{
                    opacity: 0,
                    y: 60,
                    rotateX: -90,
                    rotateZ: (index - 4) * 3,
                    scale: 0.8,
                    filter: 'blur(12px)',
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    rotateX: 0,
                    rotateZ: 0,
                    scale: 1,
                    filter: 'blur(0px)',
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 300,
                    damping: 22,
                    delay: index * 0.04,
                  }}
                  style={{
                    display: 'inline-block',
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(2.8rem, 8vw, 7.5rem)',
                    fontWeight: 900,
                    letterSpacing: '-0.04em',
                    color: '#ffffff',
                    textShadow: '0 6px 36px rgba(255, 255, 255, 0.35)',
                    transformStyle: 'preserve-3d',
                  }}
                >
                  {char}
                </motion.span>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Step 5 & 6: Final Hero Composition - Lower-Left PORTFOLIO & Subtle Accents */}
        {phase === 'hero' && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              marginTop: 'auto',
              paddingBottom: 'clamp(1rem, 3vw, 2.5rem)',
            }}
          >
            {/* Imposing, bold, tightly composed lower-left PORTFOLIO typography */}
            <motion.h1
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(3.8rem, 12vw, 11rem)',
                fontWeight: 900,
                lineHeight: 0.88,
                letterSpacing: '-0.045em',
                textTransform: 'uppercase',
                margin: 0,
                color: '#ffffff',
                textShadow: '0 8px 40px rgba(0, 0, 0, 0.6), 0 0 80px rgba(255, 255, 255, 0.08)',
              }}
              className="silver-chrome-text"
            >
              PORTFOLIO
            </motion.h1>

            {/* Bottom Row: Minimal coordinates / scroll prompt */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                flexWrap: 'wrap',
                gap: '1.5rem',
                marginTop: '2.5rem',
                paddingTop: '1.5rem',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <span
                  style={{
                    fontSize: '0.85rem',
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--silver-muted)',
                    letterSpacing: '0.05em',
                  }}
                >
                  MAN CHAUDHARI &middot; 2025
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--silver-secondary)' }}>
                <span style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Scroll
                </span>
                <motion.div
                  animate={{ y: [0, 4, 0] }}
                  transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
                >
                  <ArrowDown size={14} />
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};
