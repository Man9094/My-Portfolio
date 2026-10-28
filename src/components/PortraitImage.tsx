import { useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { PORTFOLIO_CONFIG } from '../config/content';

interface PortraitImageProps {
  size?: 'sm' | 'md' | 'lg';
  enableTilt?: boolean;
  circular?: boolean;
}

export const PortraitImage = ({
  size = 'lg',
  enableTilt = true,
  circular = false,
}: PortraitImageProps) => {
  const { portraitPath, portraitPosition, monogram, name } = PORTFOLIO_CONFIG.personal;
  const [imageFailed, setImageFailed] = useState(false);

  const isFinePointer = typeof window !== 'undefined'
    && window.matchMedia('(pointer: fine)').matches;
  const isReducedMotion = typeof window !== 'undefined'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const activeTilt = enableTilt && isFinePointer && !isReducedMotion;

  // 3D Pointer-Based Perspective Tilt (Desktop fine-pointer only)
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { stiffness: 200, damping: 24, mass: 0.6 };
  const mouseXSpring = useSpring(x, springConfig);
  const mouseYSpring = useSpring(y, springConfig);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['3.5deg', '-3.5deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-3.5deg', '3.5deg']);
  const innerX = useTransform(mouseXSpring, [-0.5, 0.5], [-4, 4]);
  const innerY = useTransform(mouseYSpring, [-0.5, 0.5], [-4, 4]);
  const sheenX = useTransform(mouseXSpring, [-0.5, 0.5], ['0%', '100%']);
  const sheenY = useTransform(mouseYSpring, [-0.5, 0.5], ['0%', '100%']);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!activeTilt) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    if (width === 0 || height === 0) return;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    x.set(mouseX / width - 0.5);
    y.set(mouseY / height - 0.5);
  };

  const handleMouseLeave = () => {
    if (!activeTilt) return;
    x.set(0);
    y.set(0);
  };

  const dimensions = circular
    ? {
        width: '100%',
        maxWidth: size === 'sm' ? '80px' : size === 'md' ? '240px' : '320px',
        height: 'auto',
        aspectRatio: '1 / 1',
        borderRadius: '50%',
      }
    : {
        sm: { width: '80px', maxWidth: '80px', height: '80px', aspectRatio: '1 / 1', borderRadius: '16px' },
        md: { width: '100%', maxWidth: '240px', height: 'auto', aspectRatio: '4 / 5', borderRadius: '20px' },
        lg: { width: '100%', maxWidth: '380px', height: 'auto', aspectRatio: '4 / 5', borderRadius: '24px' },
      }[size];

  return (
    <div
      style={{
        perspective: '1200px',
        display: 'inline-block',
        width: dimensions.width,
        maxWidth: dimensions.maxWidth,
      }}
    >
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          width: '100%',
          height: dimensions.height,
          aspectRatio: dimensions.aspectRatio,
          borderRadius: dimensions.borderRadius,
          position: 'relative',
          overflow: 'hidden',
          backgroundColor: '#0d0d11',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.05)',
          rotateX: activeTilt ? rotateX : 0,
          rotateY: activeTilt ? rotateY : 0,
          transformStyle: activeTilt ? 'preserve-3d' : 'flat',
        }}
      >
        {!imageFailed ? (
          <motion.div
            style={{
              width: '100%',
              height: '100%',
              x: activeTilt ? innerX : 0,
              y: activeTilt ? innerY : 0,
            }}
          >
            <img
              src={portraitPath}
              alt={name}
              onError={() => setImageFailed(true)}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: portraitPosition,
                display: 'block',
                filter: 'grayscale(15%) contrast(105%)',
              }}
            />
          </motion.div>
        ) : (
          /* Bespoke MC Monogram Placeholder on Obsidian/Silver Pedestal */
          <motion.div
            style={{
              width: '100%',
              height: '100%',
              x: enableTilt ? innerX : 0,
              y: enableTilt ? innerY : 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'radial-gradient(circle at 50% 40%, #1c1c24 0%, #0a0a0d 100%)',
              position: 'relative',
              userSelect: 'none',
              padding: '1.5rem',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                position: 'absolute',
                inset: 0,
                opacity: 0.08,
                backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.6) 1px, transparent 1px)',
                backgroundSize: '16px 16px',
              }}
            />

            <div
              style={{
                width: size === 'sm' ? '46px' : '96px',
                height: size === 'sm' ? '46px' : '96px',
                borderRadius: '50%',
                border: '1px solid rgba(255, 255, 255, 0.18)',
                background:
                  'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%)',
                boxShadow:
                  '0 8px 32px rgba(0, 0, 0, 0.5), inset 0 1px 1px rgba(255, 255, 255, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: size === 'sm' ? '0' : '1rem',
                position: 'relative',
                zIndex: 2,
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 900,
                  fontSize: size === 'sm' ? '1rem' : '1.75rem',
                  letterSpacing: '0.05em',
                  background: 'linear-gradient(180deg, #FFFFFF 0%, #CBD5E1 50%, #64748B 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {monogram}
              </span>
            </div>

            {size !== 'sm' && (
              <div style={{ position: 'relative', zIndex: 2 }}>
                <div
                  style={{
                    fontSize: '0.82rem',
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--silver-secondary)',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    marginBottom: '4px',
                  }}
                >
                  {name}
                </div>
                <div
                  style={{
                    fontSize: '0.68rem',
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--silver-muted)',
                    opacity: 0.7,
                  }}
                >
                  Portrait Placeholder
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Faint directional highlight */}
        {enableTilt && (
          <motion.div
            style={{
              position: 'absolute',
              inset: 0,
              background: `radial-gradient(circle at ${sheenX} ${sheenY}, rgba(255, 255, 255, 0.12) 0%, transparent 60%)`,
              pointerEvents: 'none',
              zIndex: 5,
            }}
          />
        )}
      </motion.div>
    </div>
  );
};
