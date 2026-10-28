import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';
import { useCursor } from '../context/useCursor';

export const CustomCursor = () => {
  const { cursorVariant, cursorText } = useCursor();
  const [enabled, setEnabled] = useState(() => {
    if (typeof window === 'undefined') return false;
    const finePointer = window.matchMedia('(pointer: fine)').matches;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    return finePointer && !reducedMotion;
  });
  const [visible, setVisible] = useState(false);

  // Position MotionValues
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Smooth trailing spring
  const springConfig = { stiffness: 450, damping: 28, mass: 0.5 };
  const smoothX = useSpring(cursorX, springConfig);
  const smoothY = useSpring(cursorY, springConfig);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const finePointerQuery = window.matchMedia('(pointer: fine)');
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const isFine = finePointerQuery.matches && !reducedMotionQuery.matches;

    const updateEnabled = () => {
      const active = finePointerQuery.matches && !reducedMotionQuery.matches;
      setEnabled(active);
    };

    finePointerQuery.addEventListener('change', updateEnabled);
    reducedMotionQuery.addEventListener('change', updateEnabled);

    if (!isFine) {
      return () => {
        finePointerQuery.removeEventListener('change', updateEnabled);
        reducedMotionQuery.removeEventListener('change', updateEnabled);
      };
    }

    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!visible) setVisible(true);
    };

    const handleMouseLeave = () => {
      setVisible(false);
    };

    const handleMouseEnter = () => {
      setVisible(true);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      finePointerQuery.removeEventListener('change', updateEnabled);
      reducedMotionQuery.removeEventListener('change', updateEnabled);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [cursorX, cursorY, visible]);

  if (!enabled || !visible) return null;

  const isProject = cursorVariant === 'project';
  const isButton = cursorVariant === 'button';

  return (
    <motion.div
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        x: smoothX,
        y: smoothY,
        translateX: '-50%',
        translateY: '-50%',
        pointerEvents: 'none',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      aria-hidden="true"
    >
      <motion.div
        animate={{
          width: isProject ? 76 : isButton ? 38 : 24,
          height: isProject ? 32 : isButton ? 38 : 24,
          borderRadius: 9999,
          backgroundColor: isProject
            ? 'rgba(255, 255, 255, 0.92)'
            : isButton
            ? 'rgba(255, 255, 255, 0.12)'
            : 'rgba(255, 255, 255, 0.04)',
          borderColor: isProject ? 'transparent' : 'rgba(255, 255, 255, 0.45)',
          borderWidth: 1,
          borderStyle: 'solid',
          boxShadow: isProject
            ? '0 8px 24px rgba(255, 255, 255, 0.35)'
            : '0 0 12px rgba(255, 255, 255, 0.1)',
        }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        {isProject && (
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            style={{
              fontSize: '0.65rem',
              fontFamily: 'var(--font-mono)',
              fontWeight: 700,
              color: '#070709',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
            }}
          >
            {cursorText || 'VIEW'}
          </motion.span>
        )}
      </motion.div>
    </motion.div>
  );
};
