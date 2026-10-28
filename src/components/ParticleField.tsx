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

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Reel reference: dense luminous particulate galaxy in center-upper region + subtle ambient field
    const totalCount = Math.min(140, Math.floor((width * height) / 10000));
    
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
        // Gaussian-like concentration in upper-center (reel 06 reference)
        const angle = Math.random() * Math.PI * 2;
        const radius = (Math.random() ** 1.8) * Math.min(width, height) * 0.42;
        x = width * 0.5 + Math.cos(angle) * radius;
        y = height * 0.38 + Math.sin(angle) * radius * 0.65;
      } else {
        x = Math.random() * width;
        y = Math.random() * height;
      }

      const size = Math.random() * 1.6 + 0.3;
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
      if (document.hidden) {
        animationFrameId = requestAnimationFrame(render);
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

      // Render individual silver particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.speedX;
        p.y += p.speedY;

        // Wrap boundaries
        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;
        if (p.y < -20) p.y = height + 20;
        if (p.y > height + 20) p.y = -20;

        const currentAlpha =
          p.baseAlpha + Math.sin(tick * p.pulseSpeed + p.pulseOffset) * 0.18;
        const clampedAlpha = Math.max(0.04, Math.min(0.9, currentAlpha)) * opacity;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(240, 244, 250, ${clampedAlpha})`;
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
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
