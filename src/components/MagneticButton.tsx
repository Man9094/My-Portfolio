import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionValue, useSpring } from 'motion/react';
import { useCursor } from '../context/useCursor';

interface MagneticButtonProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  to?: string;
  href?: string;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'ghost';
  style?: React.CSSProperties;
  className?: string;
  disabled?: boolean;
  'aria-label'?: string;
}

export const MagneticButton = ({
  children,
  icon,
  onClick,
  to,
  href,
  type = 'button',
  variant = 'primary',
  style,
  disabled = false,
  'aria-label': ariaLabel,
}: MagneticButtonProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { setCursorVariant, resetCursor } = useCursor();

  // Motion values for magnetic displacement
  const visualX = useMotionValue(0);
  const visualY = useMotionValue(0);
  const iconX = useMotionValue(0);
  const iconY = useMotionValue(0);

  const springConfig = { stiffness: 380, damping: 22, mass: 0.6 };
  const smoothVisualX = useSpring(visualX, springConfig);
  const smoothVisualY = useSpring(visualY, springConfig);
  const smoothIconX = useSpring(iconX, springConfig);
  const smoothIconY = useSpring(iconY, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;

    const normX = Math.max(-1, Math.min(1, distanceX / (rect.width / 2)));
    const normY = Math.max(-1, Math.min(1, distanceY / (rect.height / 2)));

    // Outer visual movement: maximum 6px
    visualX.set(normX * 6);
    visualY.set(normY * 6);

    // Inner icon movement: maximum 10px
    iconX.set(normX * 10);
    iconY.set(normY * 10);
  };

  const handleMouseLeave = () => {
    visualX.set(0);
    visualY.set(0);
    iconX.set(0);
    iconY.set(0);
    resetCursor();
  };

  const handleMouseEnter = () => {
    if (!disabled) {
      setCursorVariant('button');
    }
  };

  const variantStyles: Record<string, React.CSSProperties> = {
    primary: {
      backgroundColor: '#ffffff',
      color: '#070709',
      border: '1px solid #ffffff',
      boxShadow: '0 4px 18px rgba(255, 255, 255, 0.15)',
    },
    secondary: {
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      color: 'var(--silver-bright)',
      border: '1px solid rgba(255, 255, 255, 0.14)',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.4)',
    },
    ghost: {
      backgroundColor: 'transparent',
      color: 'var(--silver-muted)',
      border: '1px solid transparent',
    },
  };

  const innerContent = (
    <motion.div
      style={{
        x: smoothVisualX,
        y: smoothVisualY,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        minHeight: '44px',
        minWidth: '44px',
        padding: '10px 22px',
        borderRadius: '9999px',
        fontSize: '0.88rem',
        fontFamily: 'var(--font-body)',
        fontWeight: variant === 'primary' ? 600 : 500,
        letterSpacing: '0.02em',
        userSelect: 'none',
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        ...variantStyles[variant],
        ...style,
      }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 500, damping: 25 }}
    >
      <span>{children}</span>
      {icon && (
        <motion.span
          style={{
            x: smoothIconX,
            y: smoothIconY,
            display: 'inline-flex',
            alignItems: 'center',
          }}
        >
          {icon}
        </motion.span>
      )}
    </motion.div>
  );

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      style={{
        display: 'inline-block',
        position: 'relative',
        verticalAlign: 'middle',
      }}
    >
      {to ? (
        <Link
          to={to}
          aria-label={ariaLabel}
          onClick={onClick}
          style={{ textDecoration: 'none', display: 'inline-block' }}
        >
          {innerContent}
        </Link>
      ) : href ? (
        <a
          href={href}
          target="_blank"
          rel="noreferrer"
          aria-label={ariaLabel}
          onClick={onClick}
          style={{ textDecoration: 'none', display: 'inline-block' }}
        >
          {innerContent}
        </a>
      ) : (
        <button
          type={type}
          onClick={onClick}
          disabled={disabled}
          aria-label={ariaLabel}
          style={{
            background: 'none',
            border: 'none',
            padding: 0,
            cursor: disabled ? 'not-allowed' : 'pointer',
            display: 'inline-block',
          }}
        >
          {innerContent}
        </button>
      )}
    </div>
  );
};
