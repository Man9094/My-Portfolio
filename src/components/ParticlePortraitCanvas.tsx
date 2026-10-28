import { useEffect, useRef, useState, useCallback, useImperativeHandle } from 'react';
import { samplePortraitImage, loadAndDecodeImage, BUCKET_COLORS, type SamplingResult } from '../utils/portraitSampler';
import type { IntroStage } from '../pages/HomePage';

export interface ParticleCanvasHandle {
  wake: () => void;
  resetToScattered: () => void;
  disperseForReentry: () => void;
}

interface ParticlePortraitCanvasProps {
  stage: IntroStage;
  imageSrc?: string;
  prefersReducedMotion?: boolean;
  pointerRef: React.RefObject<{ x: number; y: number; active: boolean }>;
  reentryKey?: number;
  onLoaded?: () => void;
  apiRef?: React.RefObject<ParticleCanvasHandle | null>;
}

interface ParticleBuffers {
  count: number;
  homeX: Float32Array;
  homeY: Float32Array;
  x: Float32Array;
  y: Float32Array;
  vx: Float32Array;
  vy: Float32Array;
  scatterX: Float32Array;
  scatterY: Float32Array;
  sizes: Float32Array;
  alphas: Float32Array;
  baseAlphas: Float32Array;
  bucketLists: Int32Array[]; // Indices grouped by color bucket for 6-call batched rendering
}

// Module-level cache so route re-entry never resamples or re-decodes the portrait image
let moduleCachedSampledData: SamplingResult | null = null;

export const ParticlePortraitCanvas = ({
  stage,
  imageSrc = '/images/man-chaudhari.png',
  prefersReducedMotion = false,
  pointerRef,
  reentryKey = 0,
  onLoaded,
  apiRef,
}: ParticlePortraitCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [loadFailed, setLoadFailed] = useState(false);
  const [isReady, setIsReady] = useState(false);

  // Cached sampling data in typed arrays
  const sampledDataRef = useRef<SamplingResult | null>(null);
  const buffersRef = useRef<ParticleBuffers | null>(null);

  // Simulation loop state
  const stageRef = useRef<IntroStage>(stage);
  useEffect(() => {
    stageRef.current = stage;
  }, [stage]);

  const loopRef = useRef({
    animFrame: null as number | null,
    isVisible: true,
    isSleeping: false,
    lastTime: 0,
  });

  const renderFrameRef = useRef<(time: number) => void>(() => {});

  // Wake up animation loop if it paused
  const wakeLoop = useCallback(() => {
    const loop = loopRef.current;
    if (loop.isSleeping) {
      loop.isSleeping = false;
      if (!loop.animFrame) {
        loop.lastTime = 0;
        loop.animFrame = requestAnimationFrame((t) => renderFrameRef.current(t));
      }
    }
  }, []);

  // Expose handle for clean Replay and Re-entry triggers
  useImperativeHandle(
    apiRef,
    () => ({
      wake: wakeLoop,
      resetToScattered: () => {
        const buf = buffersRef.current;
        if (!buf) return;
        const count = buf.count;
        const x = buf.x;
        const y = buf.y;
        const vx = buf.vx;
        const vy = buf.vy;
        const scatterX = buf.scatterX;
        const scatterY = buf.scatterY;
        const alphas = buf.alphas;

        for (let i = 0; i < count; i++) {
          x[i] = scatterX[i];
          y[i] = scatterY[i];
          vx[i] = 0;
          vy[i] = 0;
          alphas[i] = 0.18;
        }
        wakeLoop();
      },
      disperseForReentry: () => {
        const buf = buffersRef.current;
        if (!buf || prefersReducedMotion) return;
        const count = buf.count;
        const homeX = buf.homeX;
        const homeY = buf.homeY;
        const x = buf.x;
        const y = buf.y;
        const vx = buf.vx;
        const vy = buf.vy;
        const alphas = buf.alphas;

        // Disperse locally around face area (30-80px) and smoothly spring back
        for (let i = 0; i < count; i++) {
          const angle = Math.random() * Math.PI * 2;
          const dist = 25 + Math.random() * 65;
          x[i] = homeX[i] + Math.cos(angle) * dist;
          y[i] = homeY[i] + Math.sin(angle) * dist;
          vx[i] = 0;
          vy[i] = 0;
          alphas[i] = 0.35;
        }
        wakeLoop();
      },
    }),
    [wakeLoop, prefersReducedMotion]
  );

  // Compute exact pixel home positions inside hero bounds
  const recalculateHomePositions = useCallback((width: number, height: number) => {
    const sampled = sampledDataRef.current;
    if (!sampled || sampled.totalCount === 0) return;

    const count = sampled.totalCount;
    const isMobile = width < 860;
    const aspect = sampled.aspectRatio || 0.84;

    let portraitW: number;
    let portraitH: number;
    let portraitCenterX: number;
    let portraitCenterY: number;

    if (isMobile) {
      // Mobile: Upper composition area so title and status sit completely unobstructed below
      portraitW = Math.min(width * 0.65, 270);
      portraitH = portraitW / aspect;
      portraitCenterX = width * 0.50;
      portraitCenterY = Math.max(portraitH * 0.52 + 56, height * 0.30);
    } else {
      // Desktop: Anchored on the right (60% to 94% X), leaving left 56% clear for title
      portraitW = Math.min(width * 0.38, 460);
      portraitH = portraitW / aspect;
      portraitCenterX = width * 0.76;
      portraitCenterY = Math.max(portraitH * 0.50 + 40, height * 0.44);
    }

    const portraitLeft = portraitCenterX - portraitW * 0.5;
    const portraitTop = portraitCenterY - portraitH * 0.5;

    const u = sampled.u;
    const v = sampled.v;

    let buf = buffersRef.current;
    if (!buf || buf.count !== count) {
      // Initialize typed array buffers
      const homeX = new Float32Array(count);
      const homeY = new Float32Array(count);
      const x = new Float32Array(count);
      const y = new Float32Array(count);
      const vx = new Float32Array(count);
      const vy = new Float32Array(count);
      const scatterX = new Float32Array(count);
      const scatterY = new Float32Array(count);
      const sizes = new Float32Array(sampled.sizes);
      const alphas = new Float32Array(count);
      const baseAlphas = new Float32Array(sampled.alphas);

      const isHeroOrReduced = stageRef.current === 'hero' || prefersReducedMotion;

      // Group indices by bucket for batched draw
      const buckets: number[][] = [[], [], [], [], [], []];

      for (let i = 0; i < count; i++) {
        const hx = portraitLeft + u[i] * portraitW;
        const hy = portraitTop + v[i] * portraitH;
        homeX[i] = hx;
        homeY[i] = hy;

        const scatterAngle = Math.random() * Math.PI * 2;
        const scatterDist = Math.random() * Math.max(width, height) * 0.5 + 80;
        const sx = width * 0.5 + Math.cos(scatterAngle) * scatterDist;
        const sy = height * 0.4 + Math.sin(scatterAngle) * scatterDist;

        scatterX[i] = sx;
        scatterY[i] = sy;
        x[i] = isHeroOrReduced ? hx : sx;
        y[i] = isHeroOrReduced ? hy : sy;
        alphas[i] = isHeroOrReduced ? baseAlphas[i] : 0.18;

        const b = sampled.bucketIndices[i] || 0;
        buckets[b].push(i);
      }

      const bucketLists = buckets.map((arr) => new Int32Array(arr));

      buf = {
        count,
        homeX,
        homeY,
        x,
        y,
        vx,
        vy,
        scatterX,
        scatterY,
        sizes,
        alphas,
        baseAlphas,
        bucketLists,
      };
      buffersRef.current = buf;
    } else {
      // Update targets smoothly
      const homeX = buf.homeX;
      const homeY = buf.homeY;
      for (let i = 0; i < count; i++) {
        homeX[i] = portraitLeft + u[i] * portraitW;
        homeY[i] = portraitTop + v[i] * portraitH;
      }
    }
  }, [prefersReducedMotion]);

  // Load and sample image once on mount
  useEffect(() => {
    let isCancelled = false;

    const preparePortrait = async () => {
      if (moduleCachedSampledData) {
        sampledDataRef.current = moduleCachedSampledData;
        setIsReady(true);
        if (onLoaded) onLoaded();
        if (containerRef.current) {
          const rect = containerRef.current.getBoundingClientRect();
          recalculateHomePositions(rect.width || window.innerWidth, rect.height || window.innerHeight);
        }
        return;
      }

      try {
        // Try background-removed PNG first; fallback to JPG
        let img: HTMLImageElement;
        try {
          img = await loadAndDecodeImage(imageSrc);
        } catch {
          img = await loadAndDecodeImage('/images/man-chaudhari.jpg');
        }

        const w = typeof window !== 'undefined' ? window.innerWidth : 1200;
        const isTouch = typeof window !== 'undefined' && !window.matchMedia('(pointer: fine)').matches;
        const cores = typeof navigator !== 'undefined' ? (navigator.hardwareConcurrency || 4) : 4;
        let particleBudget: number;
        if (w < 600 || isTouch) {
          particleBudget = 2800;
        } else if (w < 1024) {
          particleBudget = 4800;
        } else {
          particleBudget = 7500;
        }
        if (cores <= 4) {
          particleBudget = Math.round(particleBudget * 0.8);
        }

        const result = samplePortraitImage(img, particleBudget);
        if (isCancelled) return;

        if (!result.success || result.totalCount === 0) {
          setLoadFailed(true);
          return;
        }

        moduleCachedSampledData = result;
        sampledDataRef.current = result;
        setIsReady(true);
        if (onLoaded) onLoaded();

        if (containerRef.current) {
          const rect = containerRef.current.getBoundingClientRect();
          recalculateHomePositions(rect.width || window.innerWidth, rect.height || window.innerHeight);
        }
      } catch (err) {
        console.warn('Particle portrait image sampling failed, using fallback:', err);
        if (!isCancelled) {
          setLoadFailed(true);
        }
      }
    };

    const timer = window.setTimeout(preparePortrait, 0);

    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, [imageSrc, recalculateHomePositions, onLoaded]);

  // Handle stage transitions
  useEffect(() => {
    const buf = buffersRef.current;
    if (!buf) return;

    if (stage === 'hero' || prefersReducedMotion) {
      // Instantly snap to home positions
      const count = buf.count;
      const homeX = buf.homeX;
      const homeY = buf.homeY;
      const x = buf.x;
      const y = buf.y;
      const vx = buf.vx;
      const vy = buf.vy;
      const alphas = buf.alphas;
      const baseAlphas = buf.baseAlphas;

      for (let i = 0; i < count; i++) {
        x[i] = homeX[i];
        y[i] = homeY[i];
        vx[i] = 0;
        vy[i] = 0;
        alphas[i] = baseAlphas[i];
      }
    } else if (stage === 'dot') {
      const count = buf.count;
      const x = buf.x;
      const y = buf.y;
      const vx = buf.vx;
      const vy = buf.vy;
      const scatterX = buf.scatterX;
      const scatterY = buf.scatterY;
      const alphas = buf.alphas;

      for (let i = 0; i < count; i++) {
        x[i] = scatterX[i];
        y[i] = scatterY[i];
        vx[i] = 0;
        vy[i] = 0;
        alphas[i] = 0.18;
      }
    }
    wakeLoop();
  }, [stage, prefersReducedMotion, wakeLoop]);

  // Viewport re-entry trigger
  useEffect(() => {
    if (reentryKey === 0 || prefersReducedMotion) return;
    const buf = buffersRef.current;
    if (!buf) return;

    const count = buf.count;
    const homeX = buf.homeX;
    const homeY = buf.homeY;
    const x = buf.x;
    const y = buf.y;
    const vx = buf.vx;
    const vy = buf.vy;
    const alphas = buf.alphas;

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = 25 + Math.random() * 65;
      x[i] = homeX[i] + Math.cos(angle) * dist;
      y[i] = homeY[i] + Math.sin(angle) * dist;
      vx[i] = 0;
      vy[i] = 0;
      alphas[i] = 0.35;
    }
    wakeLoop();
  }, [reentryKey, prefersReducedMotion, wakeLoop]);

  // High-performance Canvas 2D Render & Physics Loop
  const renderFrame = useCallback((time: number) => {
    const canvas = canvasRef.current;
    const loop = loopRef.current;
    if (!canvas) {
      loop.animFrame = null;
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      loop.animFrame = null;
      return;
    }

    if (!loop.isVisible || document.hidden) {
      loop.animFrame = null;
      loop.isSleeping = true;
      return;
    }

    const dt = loop.lastTime > 0 ? Math.min((time - loop.lastTime) / 16.667, 1.8) : 1.0;
    loop.lastTime = time;

    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    ctx.clearRect(0, 0, width, height);

    const buf = buffersRef.current;
    if (!buf) {
      loop.animFrame = requestAnimationFrame((t) => renderFrameRef.current(t));
      return;
    }

    const count = buf.count;
    const homeX = buf.homeX;
    const homeY = buf.homeY;
    const x = buf.x;
    const y = buf.y;
    const vx = buf.vx;
    const vy = buf.vy;
    const sizes = buf.sizes;
    const alphas = buf.alphas;
    const baseAlphas = buf.baseAlphas;
    const bucketLists = buf.bucketLists;

    const currentStage = stageRef.current;
    const pointer = pointerRef.current || { x: -9999, y: -9999, active: false };

    // Convergence rate based on stage
    let convergenceRate = 0.055;
    let isAssembling = false;

    if (currentStage === 'dot' || currentStage === 'name') {
      convergenceRate = 0.003;
    } else if (currentStage === 'hold') {
      convergenceRate = 0.012;
      isAssembling = true;
    } else if (currentStage === 'morph') {
      convergenceRate = 0.045;
      isAssembling = true;
    } else if (currentStage === 'settle' || currentStage === 'hero') {
      convergenceRate = 0.065;
      isAssembling = true;
    }

    // Cursor repulsion parameters (100-140 CSS px)
    const canInteract = (currentStage === 'hero' || currentStage === 'settle') && pointer.active;
    const repelRadius = 120;
    const repelRadiusSq = 14400; // 120^2
    const repelStrength = 5.2;
    const damping = isAssembling ? 0.83 : 0.80;

    let totalMovementSq = 0;
    let maxDistToHome = 0;

    // Physics update in typed array
    for (let i = 0; i < count; i++) {
      const px = x[i];
      const py = y[i];

      // Spring toward home position
      const dx = homeX[i] - px;
      const dy = homeY[i] - py;
      vx[i] += dx * convergenceRate * dt;
      vy[i] += dy * convergenceRate * dt;

      // Local pointer repulsion with smooth falloff and slight flowing swirl
      if (canInteract) {
        const pdx = px - pointer.x;
        const pdy = py - pointer.y;
        const distSq = pdx * pdx + pdy * pdy;

        if (distSq < repelRadiusSq && distSq > 0.04) {
          const dist = Math.sqrt(distSq);
          const falloff = 1 - dist / repelRadius;
          const force = falloff * falloff * repelStrength;

          const normX = pdx / dist;
          const normY = pdy / dist;
          vx[i] += (normX * force - normY * force * 0.20) * dt;
          vy[i] += (normY * force + normX * force * 0.20) * dt;
        }
      }

      // Damping
      vx[i] *= damping;
      vy[i] *= damping;

      x[i] += vx[i] * dt;
      y[i] += vy[i] * dt;

      const speedSq = vx[i] * vx[i] + vy[i] * vy[i];
      totalMovementSq += speedSq;

      const distHomeSq = dx * dx + dy * dy;
      if (distHomeSq > maxDistToHome) maxDistToHome = distHomeSq;

      // Exact snap when settled
      if (isAssembling && !canInteract && speedSq < 0.003 && distHomeSq < 0.04) {
        x[i] = homeX[i];
        y[i] = homeY[i];
        vx[i] = 0;
        vy[i] = 0;
      }

      // Alpha transition
      if (currentStage === 'hero' || currentStage === 'settle') {
        alphas[i] += (baseAlphas[i] - alphas[i]) * 0.10 * dt;
      } else if (currentStage === 'morph') {
        alphas[i] += (baseAlphas[i] * 0.8 - alphas[i]) * 0.07 * dt;
      } else {
        alphas[i] += (0.18 - alphas[i]) * 0.03 * dt;
      }
    }

    // BATCHED RENDER: 6 path draws total (one per color bucket)
    // Runs in under 1ms on Canvas 2D with zero shadowBlur or filter overhead
    for (let b = 0; b < 6; b++) {
      const indices = bucketLists[b];
      const len = indices.length;
      if (len === 0) continue;

      ctx.fillStyle = BUCKET_COLORS[b];
      ctx.beginPath();

      for (let j = 0; j < len; j++) {
        const i = indices[j];
        const px = x[i];
        const py = y[i];
        const r = sizes[i];

        ctx.moveTo(px + r, py);
        ctx.arc(px, py, r, 0, 6.2831853);
      }

      ctx.fill();
    }

    // IDLE SETTLING OPTIMIZATION:
    // When portrait has fully settled and pointer is inactive, halt frames!
    const isSettled = isAssembling && !canInteract && totalMovementSq < 0.05 && maxDistToHome < 0.1;
    if (isSettled && currentStage === 'hero') {
      loop.isSleeping = true;
      loop.animFrame = null;
      return;
    }

    loop.animFrame = requestAnimationFrame((t) => renderFrameRef.current(t));
  }, [pointerRef]);

  useEffect(() => {
    renderFrameRef.current = renderFrame;
  }, [renderFrame]);

  // Setup canvas size and start loop
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container || !isReady) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const handleResize = () => {
      if (!canvas || !container) return;
      const rect = container.getBoundingClientRect();
      const w = Math.round(rect.width);
      const h = Math.round(rect.height);
      if (w === 0 || h === 0) return;

      // Cap DPR to 1.0 on touch/mobile to eliminate fill-rate bottleneck; cap at 2.0 on desktop
      const isTouch = typeof window !== 'undefined' && !window.matchMedia('(pointer: fine)').matches;
      const dpr = isTouch ? 1.0 : Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      recalculateHomePositions(w, h);
      wakeLoop();
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    const ro = new ResizeObserver(() => {
      handleResize();
    });
    ro.observe(container);

    const observer = new IntersectionObserver(
      ([entry]) => {
        loopRef.current.isVisible = entry.isIntersecting;
        if (entry.isIntersecting) {
          wakeLoop();
        }
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    // Visibility change: pause simulation when tab is in background
    const handleVisibilityChange = () => {
      if (document.hidden) {
        loopRef.current.isSleeping = true;
        if (loopRef.current.animFrame) {
          cancelAnimationFrame(loopRef.current.animFrame);
          loopRef.current.animFrame = null;
        }
      } else {
        if (loopRef.current.isVisible) {
          wakeLoop();
        }
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Canvas context loss handling: prevent default and show static fallback if context cannot recover
    const handleContextLost = (e: Event) => {
      e.preventDefault();
      setLoadFailed(true);
      if (loopRef.current.animFrame) {
        cancelAnimationFrame(loopRef.current.animFrame);
        loopRef.current.animFrame = null;
      }
    };

    const handleContextRestored = () => {
      setLoadFailed(false);
      handleResize();
    };

    canvas.addEventListener('contextlost', handleContextLost);
    canvas.addEventListener('contextrestored', handleContextRestored);

    loopRef.current.lastTime = 0;
    loopRef.current.animFrame = requestAnimationFrame((t) => renderFrameRef.current(t));

    const loop = loopRef.current;
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      canvas.removeEventListener('contextlost', handleContextLost);
      canvas.removeEventListener('contextrestored', handleContextRestored);
      ro.disconnect();
      observer.disconnect();
      if (loop.animFrame) {
        cancelAnimationFrame(loop.animFrame);
        loop.animFrame = null;
      }
    };
  }, [isReady, recalculateHomePositions, wakeLoop]);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 1, // Below hero content (z-index: 10)
        pointerEvents: 'none', // Never intercept clicks
        overflow: 'hidden',
      }}
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
          pointerEvents: 'none',
        }}
      />

      {/* Accessible static fallback portrait if particle sampling or canvas fails */}
      {loadFailed && (
        <div
          style={{
            position: 'absolute',
            right: '8%',
            top: '20%',
            width: 'clamp(240px, 32vw, 400px)',
            aspectRatio: '4 / 5',
            borderRadius: '24px',
            overflow: 'hidden',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)',
            backgroundColor: '#0d0d12',
            pointerEvents: 'none',
          }}
        >
          <img
            src={imageSrc}
            alt="Man Chaudhari Portrait"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center 20%',
              filter: 'grayscale(20%) contrast(110%)',
            }}
          />
        </div>
      )}
    </div>
  );
};
