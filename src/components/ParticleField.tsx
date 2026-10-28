import { useEffect, useRef } from 'react';

interface ParticleFieldProps {
  opacity?: number;
  speedMultiplier?: number;
}

export const ParticleField = ({
  opacity = 0.75,
  speedMultiplier = 1,
}: ParticleFieldProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReducedMotion = typeof window !== 'undefined'
      && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = typeof window !== 'undefined'
      && (window.innerWidth < 768 || !window.matchMedia('(pointer: fine)').matches);

    let animationFrameId: number | null = null;
    let isSleeping = false;
    let isVisible = true;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particle density: 35 on mobile, up to 110 on desktop
    const maxParticles = isMobile ? 35 : 110;
    const totalCount = Math.min(maxParticles, Math.floor((width * height) / 12000));
    
    interface Particle {
      x: number;
      y: number;
      baseX: number;
      baseY: number;
      size: number;
      speedX: number;
      speedY: number;
      alpha: number;
      baseAlpha: number;
      pulseSpeed: number;
      pulseOffset: number;
      inCluster: boolean;
    }

    const particles: Particle[] = Array.from({ length: totalCount }, (_, i) => {
      const inCluster = i < totalCount * 0.65;
      let x: number;
      let y: number;

      if (inCluster) {
        const angle = Math.random() * Math.PI * 2;
        const radius = (Math.random() ** 1.8) * Math.min(width, height) * 0.42;
        x = width * 0.5 + Math.cos(angle) * radius;
        y = height * 0.38 + Math.sin(angle) * radius * 0.65;
      } else {
        x = Math.random() * width;
        y = Math.random() * height;
      }

      const size = Math.random() * 1.5 + 0.3;
      const baseAlpha = inCluster ? Math.random() * 0.6 + 0.25 : Math.random() * 0.35 + 0.1;

      return {
        x,
        y,
        baseX: x,
        baseY: y,
        size,
        speedX: (Math.random() - 0.5) * 0.18 * speedMultiplier,
        speedY: (Math.random() - 0.5) * 0.18 * speedMultiplier,
        alpha: baseAlpha,
        baseAlpha,
        pulseSpeed: Math.random() * 0.02 + 0.008,
        pulseOffset: Math.random() * Math.PI * 2,
        inCluster,
      };
    });

    let tick = 0;
    const render = () => {
      if (document.hidden || !isVisible) {
        isSleeping = true;
        animationFrameId = null;
        return;
      }

      ctx.clearRect(0, 0, width, height);
      tick += 1;

      // Draw faint center ambient nebula glow
      const grad = ctx.createRadialGradient(
        width * 0.5,
        height * 0.38,
        10,
        width * 0.5,
        height * 0.38,
        width * 0.45
      );
      grad.addColorStop(0, `rgba(255, 255, 255, ${0.035 * opacity})`);
      grad.addColorStop(0.5, `rgba(200, 210, 230, ${0.015 * opacity})`);
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Batched silver particles rendering in 3 alpha buckets
      const buckets: Particle[][] = [[], [], []];
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;
        if (p.y < -20) p.y = height + 20;
        if (p.y > height + 20) p.y = -20;

        const currentAlpha =
          p.baseAlpha + Math.sin(tick * p.pulseSpeed + p.pulseOffset) * 0.18;
        p.alpha = Math.max(0.04, Math.min(0.9, currentAlpha)) * opacity;

        const b = p.alpha > 0.4 ? 0 : p.alpha > 0.2 ? 1 : 2;
        buckets[b].push(p);
      }

      const bucketStyles = [
        `rgba(240, 244, 250, ${0.55 * opacity})`,
        `rgba(220, 230, 245, ${0.30 * opacity})`,
        `rgba(200, 210, 230, ${0.12 * opacity})`,
      ];

      for (let b = 0; b < 3; b++) {
        const list = buckets[b];
        if (list.length === 0) continue;
        ctx.fillStyle = bucketStyles[b];
        ctx.beginPath();
        for (let j = 0; j < list.length; j++) {
          const p = list[j];
          ctx.moveTo(p.x + p.size, p.y);
          ctx.arc(p.x, p.y, p.size, 0, 6.2831853);
        }
        ctx.fill();
      }

      if (!prefersReducedMotion) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    const wake = () => {
      if (isSleeping && !document.hidden && isVisible && !prefersReducedMotion) {
        isSleeping = false;
        if (!animationFrameId) {
          animationFrameId = requestAnimationFrame(render);
        }
      }
    };

    const handleVisibility = () => {
      if (document.hidden) {
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
          animationFrameId = null;
        }
        isSleeping = true;
      } else {
        wake();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
      if (entry.isIntersecting) {
        wake();
      } else {
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
          animationFrameId = null;
        }
        isSleeping = true;
      }
    }, { threshold: 0.05 });
    observer.observe(canvas);

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibility);
      observer.disconnect();
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [opacity, speedMultiplier]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 1,
        width: '100%',
        height: '100%',
      }}
      aria-hidden="true"
    />
  );
};
