import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring } from 'motion/react';
import { ArrowDown, ArrowUpRight, Sparkles } from 'lucide-react';
import { ParticlePortraitCanvas, type ParticleCanvasHandle } from '../components/ParticlePortraitCanvas';
import { PortraitImage } from '../components/PortraitImage';
import { MagneticButton } from '../components/MagneticButton';
import { useCursor } from '../context/useCursor';
import { PORTFOLIO_CONFIG } from '../config/content';

export type IntroStage = 'dot' | 'name' | 'hold' | 'morph' | 'settle' | 'hero';

export const HomePage = () => {
  const prefersReducedMotion = typeof window !== 'undefined'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isFinePointer = typeof window !== 'undefined'
    && window.matchMedia('(pointer: fine)').matches;

  const { setCursorVariant, resetCursor } = useCursor();

  // Initial Home entry plays the connected cinematic intro; reduced motion skips directly to hero
  const [stage, setStage] = useState<IntroStage>(() => {
    if (prefersReducedMotion) return 'hero';
    return 'dot';
  });

  const particleApiRef = useRef<ParticleCanvasHandle | null>(null);
  const timersRef = useRef<number[]>([]);

  const clearAllTimers = useCallback(() => {
    timersRef.current.forEach((id) => clearTimeout(id));
    timersRef.current = [];
  }, []);

  const runIntroSequence = useCallback(() => {
    clearAllTimers();

    if (prefersReducedMotion) {
      setStage('hero');
      return;
    }

    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }

    particleApiRef.current?.resetToScattered();
    setStage('dot');

    // Sequence stages:
    // 1. dot: 0.0 - 0.6s
    // 2. name (MAN CHAUDHARI): 0.6 - 1.9s (1.3s assemble)
    // 3. hold: 1.9 - 2.55s (0.65s hold & light sweep)
    // 4. morph: 2.55 - 3.55s (1.0s disperse & incoming PORTFOLIO letters form)
    // 5. settle: 3.55 - 4.5s (0.95s continuous glide to hero anchor)
    // 6. hero: > 4.5s (full hero revealed)
    const t1 = window.setTimeout(() => setStage('name'), 600);
    const t2 = window.setTimeout(() => setStage('hold'), 1900);
    const t3 = window.setTimeout(() => setStage('morph'), 2550);
    const t4 = window.setTimeout(() => setStage('settle'), 3550);
    const t5 = window.setTimeout(() => setStage('hero'), 4500);

    timersRef.current = [t1, t2, t3, t4, t5];
  }, [clearAllTimers, prefersReducedMotion]);

  const skipIntro = useCallback(() => {
    clearAllTimers();
    setStage('hero');
    particleApiRef.current?.wake();
  }, [clearAllTimers]);

  // Initial Home load schedules the sequence timers
  useEffect(() => {
    if (prefersReducedMotion) return;
    const t1 = window.setTimeout(() => setStage('name'), 600);
    const t2 = window.setTimeout(() => setStage('hold'), 1900);
    const t3 = window.setTimeout(() => setStage('morph'), 2550);
    const t4 = window.setTimeout(() => setStage('settle'), 3550);
    const t5 = window.setTimeout(() => setStage('hero'), 4500);

    timersRef.current = [t1, t2, t3, t4, t5];
    return () => clearAllTimers();
  }, [clearAllTimers, prefersReducedMotion]);

  // Replay custom event listener (from Home link or Wordmark click while on Home)
  useEffect(() => {
    const handleReplay = () => runIntroSequence();
    window.addEventListener('mc-replay-intro', handleReplay);
    return () => window.removeEventListener('mc-replay-intro', handleReplay);
  }, [runIntroSequence]);

  // Keyboard shortcut: Escape to skip intro
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && stage !== 'hero') {
        skipIntro();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [stage, skipIntro]);

  // Decoupled pointer tracking: zero React state updates on mousemove
  const heroRef = useRef<HTMLDivElement | null>(null);
  const pointerCoordRef = useRef<{ x: number; y: number; active: boolean }>({
    x: -9999,
    y: -9999,
    active: false,
  });

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const spotlightClientX = useMotionValue(typeof window !== 'undefined' ? window.innerWidth * 0.75 : 800);
  const spotlightClientY = useMotionValue(typeof window !== 'undefined' ? window.innerHeight * 0.45 : 350);

  // Smooth springs for perspective tilt
  const springCfg = { stiffness: 180, damping: 25, mass: 0.7 };
  const smoothPX = useSpring(pointerX, springCfg);
  const smoothPY = useSpring(pointerY, springCfg);
  const smoothSpotX = useSpring(spotlightClientX, { stiffness: 160, damping: 28 });
  const smoothSpotY = useSpring(spotlightClientY, { stiffness: 160, damping: 28 });

  // Foreground decorative layer offset
  const decoOffsetX = useTransform(smoothPX, [-1, 1], [-20, 20]);
  const decoOffsetY = useTransform(smoothPY, [-1, 1], [-20, 20]);

  // Restrained heading perspective tilt (max 3 degrees)
  const headingTiltX = useTransform(smoothPY, [-1, 1], ['3deg', '-3deg']);
  const headingTiltY = useTransform(smoothPX, [-1, 1], ['-3deg', '3deg']);

  // Soft silver spotlight background following pointer
  const spotlightBackground = useTransform(
    [smoothSpotX, smoothSpotY],
    ([x, y]) =>
      `radial-gradient(600px circle at ${x}px ${y}px, rgba(255, 255, 255, 0.04) 0%, rgba(200, 215, 240, 0.015) 35%, transparent 75%)`
  );

  const handleHeroMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (stage !== 'hero' || prefersReducedMotion) return;
    if (typeof window !== 'undefined' && !window.matchMedia('(pointer: fine)').matches) return;
    const rect = e.currentTarget.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    const canvasX = e.clientX - rect.left;
    const canvasY = e.clientY - rect.top;

    pointerCoordRef.current = { x: canvasX, y: canvasY, active: true };
    particleApiRef.current?.wake();

    const normX = (canvasX / rect.width) * 2 - 1;
    const normY = (canvasY / rect.height) * 2 - 1;
    pointerX.set(Math.max(-1, Math.min(1, normX)));
    pointerY.set(Math.max(-1, Math.min(1, normY)));

    spotlightClientX.set(canvasX);
    spotlightClientY.set(canvasY);
  };

  const handleHeroMouseLeave = () => {
    pointerCoordRef.current = { x: -9999, y: -9999, active: false };
    pointerX.set(0);
    pointerY.set(0);
    particleApiRef.current?.wake();
  };

  // Auto-fitting single-line title sizing for both PORTFOLIO and MAN CHAUDHARI
  const titleContainerRef = useRef<HTMLDivElement | null>(null);
  const measureRulerRef = useRef<HTMLSpanElement | null>(null);
  const measureNameRulerRef = useRef<HTMLSpanElement | null>(null);

  const [titleFontSize, setTitleFontSize] = useState<number>(() => {
    if (typeof window === 'undefined') return 64;
    const w = window.innerWidth;
    if (w < 400) return 38;
    if (w < 860) return 56;
    return 108;
  });

  const [nameFontSize, setNameFontSize] = useState<number>(() => {
    if (typeof window === 'undefined') return 48;
    const w = window.innerWidth;
    if (w < 400) return 24;
    if (w < 860) return 38;
    return 68;
  });

  const calculateTitleFontSize = useCallback(() => {
    const container = titleContainerRef.current;
    const ruler = measureRulerRef.current;
    if (!container || !ruler) return;

    const availWidth = container.clientWidth;
    if (availWidth <= 0) return;

    const rulerWidth = ruler.offsetWidth;
    if (rulerWidth <= 0) return;

    const pxPerPx = rulerWidth / 100;
    const isMobile = window.innerWidth < 860;

    let targetWidth: number;
    if (isMobile) {
      targetWidth = availWidth * 0.94;
    } else {
      // Desktop: Title sits in left 56%, portrait in right 44%
      targetWidth = Math.min(availWidth * 0.56, 800);
    }

    let optimalTitle = targetWidth / pxPerPx;
    if (!isMobile) {
      optimalTitle = Math.min(optimalTitle, 122);
    } else {
      optimalTitle = Math.min(optimalTitle, 70);
    }
    optimalTitle = Math.max(optimalTitle, 26);
    setTitleFontSize(Math.round(optimalTitle * 10) / 10);

    // Measure and size MAN CHAUDHARI
    const nameRuler = measureNameRulerRef.current;
    if (nameRuler) {
      const nameRulerWidth = nameRuler.offsetWidth;
      if (nameRulerWidth > 0) {
        const namePxPerPx = nameRulerWidth / 100;
        let optimalName = targetWidth / namePxPerPx;
        if (!isMobile) {
          optimalName = Math.min(optimalName, 76);
        } else {
          optimalName = Math.min(optimalName, 50);
        }
        optimalName = Math.max(optimalName, 18);
        setNameFontSize(Math.round(optimalName * 10) / 10);
      }
    }
  }, []);

  useEffect(() => {
    calculateTitleFontSize();

    if (typeof document !== 'undefined' && 'fonts' in document) {
      document.fonts.ready.then(() => {
        calculateTitleFontSize();
      });
    }

    const container = titleContainerRef.current;
    if (!container) return;

    const ro = new ResizeObserver(() => {
      calculateTitleFontSize();
    });
    ro.observe(container);

    window.addEventListener('resize', calculateTitleFontSize);
    window.addEventListener('orientationchange', calculateTitleFontSize);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', calculateTitleFontSize);
      window.removeEventListener('orientationchange', calculateTitleFontSize);
    };
  }, [calculateTitleFontSize]);

  // Viewport re-entry detection with separate entry & exit thresholds
  const hasExitedHeroRef = useRef<boolean>(false);
  const [heroReentryKey, setHeroReentryKey] = useState<number>(0);

  useEffect(() => {
    const heroEl = heroRef.current;
    if (!heroEl) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;

        // Full exit: element has completely left the viewport
        if (entry.intersectionRatio === 0) {
          hasExitedHeroRef.current = true;
        }
        // Meaningful re-entry: element is at least 35% visible
        else if (entry.intersectionRatio >= 0.35) {
          if (hasExitedHeroRef.current) {
            hasExitedHeroRef.current = false;
            if (stage === 'hero') {
              setHeroReentryKey((k) => k + 1);
              if (isFinePointer) {
                particleApiRef.current?.disperseForReentry();
              }
            }
          }
        }
      },
      { threshold: [0, 0.35] }
    );

    observer.observe(heroEl);
    return () => observer.disconnect();
  }, [stage, isFinePointer]);

  // 3D Scroll Depth Sequence (bound directly via useTransform, no React state updates)
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: scrollContainerRef,
    offset: ['start start', 'end end'],
  });

  const scrollZ = useTransform(scrollYProgress, [0, 0.45], [0, -100]);
  const scrollScale = useTransform(scrollYProgress, [0, 0.45], [1, 0.92]);
  const scrollOpacity = useTransform(scrollYProgress, [0, 0.45], [1, 0.4]);

  const cardRotateX = useTransform(scrollYProgress, [0.15, 0.52], ['16deg', '0deg']);
  const cardScale = useTransform(scrollYProgress, [0.15, 0.52], [0.88, 1]);
  const cardOpacity = useTransform(scrollYProgress, [0.12, 0.38], [0, 1]);
  const cardY = useTransform(scrollYProgress, [0.15, 0.52], [60, 0]);

  const featuredProject = PORTFOLIO_CONFIG.projects[0];
  const nameChars = 'MAN CHAUDHARI'.split('');
  const portfolioChars = 'PORTFOLIO'.split('');

  return (
    <div
      ref={scrollContainerRef}
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100vh',
        backgroundColor: 'var(--bg-deep)',
        overflow: 'hidden',
      }}
    >
      {/* Offscreen ruler measuring exact font width of PORTFOLIO */}
      <span
        ref={measureRulerRef}
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: -9999,
          left: -9999,
          visibility: 'hidden',
          whiteSpace: 'nowrap',
          fontFamily: 'var(--font-display)',
          fontWeight: 900,
          fontSize: '100px',
          letterSpacing: '-0.04em',
          textTransform: 'uppercase',
          pointerEvents: 'none',
        }}
      >
        PORTFOLIO
      </span>

      {/* Offscreen ruler measuring exact font width of MAN CHAUDHARI */}
      <span
        ref={measureNameRulerRef}
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: -9999,
          left: -9999,
          visibility: 'hidden',
          whiteSpace: 'nowrap',
          fontFamily: 'var(--font-display)',
          fontWeight: 900,
          fontSize: '100px',
          letterSpacing: '-0.03em',
          textTransform: 'uppercase',
          pointerEvents: 'none',
        }}
      >
        MAN CHAUDHARI
      </span>

      {/* Skip Intro Button (positioned cleanly below fixed header, zIndex 45) */}
      <AnimatePresence>
        {stage !== 'hero' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: 'calc(var(--header-height) + 12px)',
              right: 'clamp(1rem, 3vw, 2rem)',
              zIndex: 45,
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
                backgroundColor: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.16)',
                color: 'var(--silver-bright)',
                fontSize: '0.78rem',
                fontFamily: 'var(--font-mono)',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                transition: 'all 0.2s ease',
                cursor: 'pointer',
              }}
              aria-label="Skip intro animation"
            >
              <span>Skip Intro</span>
              <span style={{ opacity: 0.5 }}>[ESC]</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>



      {/* Hero Section Container (Isolated Stacking Context) */}
      <section
        ref={heroRef}
        onMouseMove={handleHeroMouseMove}
        onMouseLeave={handleHeroMouseLeave}
        className="hero-viewport-section"
        style={{
          position: 'relative',
          isolation: 'isolate', // Stacking context isolated from rest of page
          overflow: 'hidden', // Clips particles inside hero bounds
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          paddingTop: 'calc(var(--header-height) + env(safe-area-inset-top, 0px) + var(--space-4))',
          paddingBottom: 'clamp(2rem, 4vw, 3.5rem)',
          perspective: '1200px',
          zIndex: 1,
        }}
      >
        {/* Particle Portrait Canvas (Decorative background, pointer-events: none) */}
        <ParticlePortraitCanvas
          stage={stage}
          imageSrc={PORTFOLIO_CONFIG.personal.portraitPath}
          prefersReducedMotion={prefersReducedMotion}
          pointerRef={pointerCoordRef}
          reentryKey={heroReentryKey}
          apiRef={particleApiRef}
        />

        {/* Soft silver spotlight background (desktop only) */}
        {!prefersReducedMotion && isFinePointer && stage === 'hero' && (
          <motion.div
            style={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              zIndex: 2,
              background: spotlightBackground,
            }}
          />
        )}

        {/* Hero Foreground Content (z-index: 10, completely above canvas) */}
        <div
          ref={titleContainerRef}
          className="page-container"
          style={{ width: '100%', position: 'relative', zIndex: 10, pointerEvents: 'auto' }}
        >
          {/* Scroll Depth Layer */}
          <motion.div
            style={{
              transformStyle: isFinePointer && !prefersReducedMotion ? 'preserve-3d' : 'flat',
              z: prefersReducedMotion || !isFinePointer ? 0 : scrollZ,
              scale: prefersReducedMotion ? 1 : scrollScale,
              opacity: prefersReducedMotion ? 1 : scrollOpacity,
            }}
          >
            {/* Cursor-driven perspective tilt (desktop only) */}
            <motion.div
              style={{
                transformStyle: isFinePointer && !prefersReducedMotion ? 'preserve-3d' : 'flat',
                rotateX: stage === 'hero' && !prefersReducedMotion && isFinePointer ? headingTiltX : 0,
                rotateY: stage === 'hero' && !prefersReducedMotion && isFinePointer ? headingTiltY : 0,
              }}
            >
              {/* Title Stage Area: Holds intro sequence and final PORTFOLIO heading without layout shifts */}
              <div
                style={{
                  position: 'relative',
                  minHeight: `${Math.max(titleFontSize * 1.15, 60)}px`,
                  display: 'flex',
                  alignItems: 'center',
                  overflow: 'visible',
                  perspective: '1200px',
                }}
              >
                {/* 1. Silver Dot Entrance inside Hero Title area (0.0s - 0.6s) */}
                {stage === 'dot' && (
                  <motion.div
                    key="hero-intro-dot"
                    initial={{ scale: 0, x: -16, opacity: 0 }}
                    animate={{
                      scale: [0, 1.35, 0.95, 1],
                      x: [-16, 0],
                      opacity: 1,
                    }}
                    exit={{ scale: 1.6, opacity: 0, transition: { duration: 0.16 } }}
                    transition={{
                      duration: 0.55,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    style={{
                      width: '14px',
                      height: '14px',
                      borderRadius: '50%',
                      backgroundColor: '#ffffff',
                      boxShadow: '0 0 20px 6px rgba(255, 255, 255, 0.85), 0 0 40px 14px rgba(226, 232, 240, 0.35)',
                    }}
                  />
                )}

                {/* 2. MAN CHAUDHARI Emergence & Shimmer inside Hero Title area (0.6s - 2.55s) */}
                {(stage === 'name' || stage === 'hold') && (
                  <motion.div
                    key="hero-intro-name-wrapper"
                    style={{
                      position: 'relative',
                      display: 'inline-flex',
                      flexWrap: 'nowrap',
                      alignItems: 'center',
                      gap: '0.04em',
                      perspective: '1000px',
                      maxWidth: '100%',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {nameChars.map((char, index) => {
                      if (char === ' ') {
                        return (
                          <span key={`name-space-${index}`} style={{ width: 'clamp(0.4rem, 1.2vw, 1rem)' }}>
                            &nbsp;
                          </span>
                        );
                      }

                      const offsetOriginY = index % 2 === 0 ? 22 : -22;

                      return (
                        <motion.span
                          key={`name-char-${index}`}
                          initial={{
                            opacity: 0,
                            y: offsetOriginY,
                            rotateX: -65,
                            scale: 0.8,
                          }}
                          animate={{
                            opacity: 1,
                            y: 0,
                            rotateX: 0,
                            scale: 1,
                          }}
                          transition={{
                            type: 'spring',
                            stiffness: 260,
                            damping: 20,
                            delay: index * 0.035,
                          }}
                          style={{
                            display: 'inline-block',
                            fontFamily: 'var(--font-display)',
                            fontSize: `${nameFontSize}px`,
                            fontWeight: 900,
                            letterSpacing: '-0.03em',
                            lineHeight: 1,
                            color: '#ffffff',
                            textShadow: '0 4px 28px rgba(255, 255, 255, 0.25)',
                            transformStyle: 'preserve-3d',
                          }}
                        >
                          {char}
                        </motion.span>
                      );
                    })}

                    {/* Subtle light sweep across complete name */}
                    {stage === 'hold' && (
                      <motion.div
                        key="name-light-sweep"
                        initial={{ left: '-15%', opacity: 0 }}
                        animate={{ left: '115%', opacity: [0, 0.9, 0.9, 0] }}
                        transition={{ duration: 0.55, ease: 'easeInOut' }}
                        style={{
                          position: 'absolute',
                          top: 0,
                          bottom: 0,
                          width: '30%',
                          background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.7) 50%, transparent 100%)',
                          mixBlendMode: 'overlay',
                          pointerEvents: 'none',
                        }}
                      />
                    )}
                  </motion.div>
                )}

                {/* 3. Choreographed Transition into PORTFOLIO inside Title area (2.55s - 3.55s) */}
                {stage === 'morph' && (
                  <div
                    style={{
                      position: 'relative',
                      display: 'inline-flex',
                      alignItems: 'center',
                      perspective: '1200px',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {/* Outgoing MAN CHAUDHARI */}
                    <div style={{ position: 'absolute', left: 0, display: 'inline-flex', gap: '0.04em', whiteSpace: 'nowrap' }}>
                      {nameChars.map((char, index) => (
                        <motion.span
                          key={`out-${index}`}
                          initial={{ opacity: 1, y: 0, rotateX: 0 }}
                          animate={{
                            opacity: 0,
                            y: index % 2 === 0 ? -28 : 28,
                            rotateX: index % 2 === 0 ? 55 : -55,
                            scale: 0.82,
                          }}
                          transition={{
                            duration: 0.42,
                            delay: (index % 5) * 0.02,
                            ease: [0.16, 1, 0.3, 1],
                          }}
                          style={{
                            display: 'inline-block',
                            fontFamily: 'var(--font-display)',
                            fontSize: `${nameFontSize}px`,
                            fontWeight: 900,
                            lineHeight: 1,
                            color: 'rgba(255, 255, 255, 0.4)',
                          }}
                        >
                          {char}
                        </motion.span>
                      ))}
                    </div>

                    {/* Incoming single-line PORTFOLIO forming in place */}
                    <div style={{ display: 'inline-flex', perspective: '1000px', whiteSpace: 'nowrap' }}>
                      {portfolioChars.map((char, index) => (
                        <motion.span
                          key={`in-${index}`}
                          initial={{
                            opacity: 0,
                            y: 35,
                            rotateX: -75,
                            scale: 0.82,
                          }}
                          animate={{
                            opacity: 1,
                            y: 0,
                            rotateX: 0,
                            scale: 1,
                          }}
                          transition={{
                            type: 'spring',
                            stiffness: 280,
                            damping: 22,
                            delay: 0.14 + index * 0.03,
                          }}
                          style={{
                            display: 'inline-block',
                            fontFamily: 'var(--font-display)',
                            fontSize: `${titleFontSize}px`,
                            fontWeight: 900,
                            lineHeight: 0.92,
                            letterSpacing: '-0.04em',
                            color: '#ffffff',
                            textShadow: '0 6px 36px rgba(255, 255, 255, 0.35)',
                            transformStyle: 'preserve-3d',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {char}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                )}

                {/* 4. Final Settle & Hero Single-Line PORTFOLIO Heading */}
                {(stage === 'settle' || stage === 'hero') && (
                  <motion.h1
                    key={`hero-title-${heroReentryKey}`}
                    initial={{ opacity: 1, y: 0 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: `${titleFontSize}px`,
                      fontWeight: 900,
                      lineHeight: 0.92,
                      letterSpacing: '-0.04em',
                      textTransform: 'uppercase',
                      margin: 0,
                      color: '#ffffff',
                      textShadow: '0 8px 40px rgba(0, 0, 0, 0.6), 0 0 80px rgba(255, 255, 255, 0.08)',
                      whiteSpace: 'nowrap',
                    }}
                    className="portfolio-hero-title silver-chrome-text"
                  >
                    PORTFOLIO
                  </motion.h1>
                )}
              </div>
            </motion.div>

            {/* Subtitle Layer */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{
                opacity: stage === 'hero' ? 1 : 0,
                y: stage === 'hero' ? 0 : 15,
              }}
              transition={{ duration: 0.55, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              style={{
                x: stage === 'hero' && !prefersReducedMotion && isFinePointer ? decoOffsetX : 0,
                y: stage === 'hero' && !prefersReducedMotion && isFinePointer ? decoOffsetY : 0,
                marginTop: '1.25rem',
                fontSize: 'clamp(0.85rem, 1.4vw, 1.15rem)',
                fontFamily: 'var(--font-mono)',
                color: 'var(--silver-secondary)',
                letterSpacing: '0.04em',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                visibility: stage === 'hero' ? 'visible' : 'hidden',
              }}
            >
              <span>{PORTFOLIO_CONFIG.personal.name}</span>
              <span style={{ color: 'var(--silver-muted)' }}>&middot;</span>
              <span style={{ color: 'var(--silver-muted)' }}>Creative Developer</span>
            </motion.div>
          </motion.div>

          {/* Bottom Status & Replay Control Row */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{
              opacity: stage === 'hero' ? 1 : 0,
              y: stage === 'hero' ? 0 : 15,
            }}
            transition={{ duration: 0.55, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              flexWrap: 'wrap',
              gap: '1.5rem',
              marginTop: 'clamp(2.5rem, 5vw, 3.5rem)',
              paddingTop: '1.5rem',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              position: 'relative',
              zIndex: 14,
              visibility: stage === 'hero' ? 'visible' : 'hidden',
              pointerEvents: stage === 'hero' ? 'auto' : 'none',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <span
                style={{
                  fontSize: '0.8rem',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--silver-muted)',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                }}
              >
                {PORTFOLIO_CONFIG.personal.status}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--silver-secondary)' }}>
              <span style={{ fontSize: '0.78rem', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Scroll for Preview
              </span>
              <motion.div
                animate={{ y: [0, 4, 0] }}
                transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
              >
                <ArrowDown size={14} />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Signature 3D Scroll Sequence: Selected Project Preview */}
      {featuredProject && (
        <section
          style={{
            paddingBlock: 'var(--section-space)',
            perspective: '1400px',
            position: 'relative',
            zIndex: 10,
          }}
        >
          <div className="page-container">
            <div style={{ marginBottom: 'var(--space-4)', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
              <span style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: 'var(--silver-muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                Signature Preview &mdash; 01
              </span>
              <Link
                to="/projects"
                style={{
                  fontSize: '0.88rem',
                  fontFamily: 'var(--font-body)',
                  color: 'var(--silver-bright)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  textDecoration: 'none',
                  minHeight: '44px',
                }}
              >
                <span>Explore Gallery</span>
                <ArrowUpRight size={15} />
              </Link>
            </div>

            <motion.div
              style={{
                rotateX: prefersReducedMotion || !isFinePointer ? 0 : cardRotateX,
                scale: prefersReducedMotion ? 1 : cardScale,
                opacity: prefersReducedMotion ? 1 : cardOpacity,
                y: prefersReducedMotion ? 0 : cardY,
                transformStyle: isFinePointer && !prefersReducedMotion ? 'preserve-3d' : 'flat',
              }}
            >
              <Link
                to={`/projects/${featuredProject.slug}`}
                style={{ textDecoration: 'none', display: 'block' }}
                onMouseEnter={() => setCursorVariant('project', 'VIEW')}
                onMouseLeave={() => resetCursor()}
              >
                <div
                  className="mobile-light-blur"
                  style={{
                    backgroundColor: 'rgba(18, 18, 22, 0.75)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    borderRadius: '24px',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    padding: 'clamp(20px, 3.5vw, 36px)',
                    boxShadow: '0 30px 60px -12px rgba(0, 0, 0, 0.8), inset 0 1px 1px rgba(255, 255, 255, 0.15)',
                    transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                    e.currentTarget.style.boxShadow =
                      '0 35px 70px -10px rgba(0, 0, 0, 0.9), inset 0 1px 2px rgba(255, 255, 255, 0.25)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
                    e.currentTarget.style.boxShadow =
                      '0 30px 60px -12px rgba(0, 0, 0, 0.8), inset 0 1px 1px rgba(255, 255, 255, 0.15)';
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
                    <div>
                      <span
                        style={{
                          fontSize: '0.78rem',
                          fontFamily: 'var(--font-mono)',
                          color: 'var(--silver-muted)',
                          textTransform: 'uppercase',
                          letterSpacing: '0.08em',
                        }}
                      >
                        {featuredProject.category} &middot; {featuredProject.year}
                      </span>
                      <h2
                        style={{
                          fontSize: 'clamp(1.9rem, 4vw, 3.2rem)',
                          fontWeight: 800,
                          letterSpacing: '-0.03em',
                          marginTop: '0.5rem',
                          marginBottom: '0.75rem',
                          color: '#ffffff',
                        }}
                      >
                        {featuredProject.title}
                      </h2>
                    </div>

                    <div
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(255, 255, 255, 0.06)',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#ffffff',
                        flexShrink: 0,
                      }}
                    >
                      <ArrowUpRight size={18} />
                    </div>
                  </div>

                  <p
                    className="text-prose"
                    style={{
                      marginBottom: '1.75rem',
                    }}
                  >
                    {featuredProject.subtitle}
                  </p>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {featuredProject.technologies.map((tech) => (
                      <span
                        key={tech}
                        style={{
                          padding: '4px 12px',
                          borderRadius: '9999px',
                          backgroundColor: 'rgba(255, 255, 255, 0.04)',
                          border: '1px solid rgba(255, 255, 255, 0.08)',
                          fontSize: '0.78rem',
                          fontFamily: 'var(--font-mono)',
                          color: 'var(--silver-secondary)',
                        }}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            </motion.div>
          </div>
        </section>
      )}

      {/* Viewport Re-entry Section: Introduction */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.25 }}
        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        style={{
          paddingBlock: 'var(--section-space)',
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          position: 'relative',
          zIndex: 10,
        }}
      >
        <div className="page-container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(200px, 280px) 1fr',
              gap: 'clamp(2rem, 5vw, 4rem)',
              alignItems: 'center',
            }}
            className="home-intro-grid"
          >
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <PortraitImage size="md" enableTilt={true} />
            </div>

            <div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.8rem',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--silver-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  marginBottom: '1rem',
                }}
              >
                <Sparkles size={13} />
                <span>Introduction</span>
              </div>

              <h2
                style={{
                  fontSize: 'clamp(1.75rem, 3.2vw, 2.6rem)',
                  fontWeight: 800,
                  letterSpacing: '-0.03em',
                  lineHeight: 1.25,
                  marginBottom: '1.25rem',
                  color: '#ffffff',
                }}
              >
                Designing at the intersection of performance and cinematic movement.
              </h2>

              <p
                className="text-prose"
                style={{
                  marginBottom: 'var(--space-5)',
                }}
              >
                {PORTFOLIO_CONFIG.personal.shortBio}
              </p>

              {/* Magnetic Buttons */}
              <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
                <MagneticButton to="/about" variant="primary" icon={<ArrowUpRight size={15} />}>
                  Read Full Bio
                </MagneticButton>

                <MagneticButton to="/contact" variant="secondary">
                  Get in Touch
                </MagneticButton>
              </div>
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  );
};
