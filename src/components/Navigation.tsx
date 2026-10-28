import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X } from 'lucide-react';
import { PORTFOLIO_CONFIG } from '../config/content';

export const Navigation = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const toggleRef = useRef<HTMLButtonElement | null>(null);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Keyboard accessibility: Escape closes mobile drawer and returns focus to toggle
  useEffect(() => {
    if (!mobileOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileOpen(false);
        toggleRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileOpen]);

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/projects', label: 'Work' },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' },
  ];

  const isItemActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const handleHomeClick = (e: React.MouseEvent) => {
    if (mobileOpen) setMobileOpen(false);
    if (location.pathname === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      window.dispatchEvent(new CustomEvent('mc-replay-intro'));
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
  };

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        paddingTop: 'env(safe-area-inset-top, 0px)',
        paddingLeft: 'env(safe-area-inset-left, 0px)',
        paddingRight: 'env(safe-area-inset-right, 0px)',
        backgroundColor: scrolled || mobileOpen ? 'rgba(7, 7, 9, 0.94)' : 'rgba(7, 7, 9, 0.55)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: scrolled ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid transparent',
        transition: 'background-color 0.25s ease, border-color 0.25s ease',
      }}
    >
      <div
        className="page-container"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          minHeight: 'var(--header-height)',
        }}
      >
        {/* Brand Identity / Home Link */}
        <Link
          to="/"
          onClick={handleHomeClick}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            textDecoration: 'none',
            minHeight: '44px',
          }}
          aria-label="Man Chaudhari - Home"
        >
          <div
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.05rem',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              color: 'var(--silver-bright)',
              textTransform: 'uppercase',
            }}
          >
            {PORTFOLIO_CONFIG.personal.name}
          </div>
        </Link>

        {/* Desktop Navigation Links: Home | Work | About | Contact */}
        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'clamp(1.4rem, 2.8vw, 2.4rem)',
          }}
          className="desktop-nav"
          aria-label="Main Navigation"
        >
          {navItems.map((item) => {
            const isActive = isItemActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={(e) => {
                  if (item.path === '/') {
                    handleHomeClick(e);
                  }
                }}
                style={{
                  position: 'relative',
                  fontSize: '0.92rem',
                  fontFamily: 'var(--font-body)',
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? 'var(--silver-bright)' : 'var(--silver-secondary)',
                  letterSpacing: '0.02em',
                  transition: 'color 0.2s ease',
                  paddingBlock: '8px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  textDecoration: 'none',
                  minHeight: '44px',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.color = 'var(--silver-secondary)';
                }}
              >
                {item.label}
                {isActive && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: '2px',
                      backgroundColor: 'var(--silver-bright)',
                      borderRadius: '2px',
                      boxShadow: '0 0 8px rgba(255, 255, 255, 0.6)',
                    }}
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Mobile Menu Hamburger Toggle (44x44px touch target) */}
        <button
          ref={toggleRef}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav-drawer"
          className="mobile-toggle"
          style={{
            display: 'none',
            alignItems: 'center',
            justifyContent: 'center',
            width: '44px',
            height: '44px',
            color: 'var(--silver-bright)',
            borderRadius: '10px',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            cursor: 'pointer',
          }}
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Fullscreen Navigation Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-nav-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile Navigation"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22 }}
            style={{
              position: 'fixed',
              top: 'calc(var(--header-height) + env(safe-area-inset-top, 0px))',
              left: 0,
              right: 0,
              maxHeight: 'calc(100dvh - var(--header-height) - env(safe-area-inset-top, 0px))',
              overflowY: 'auto',
              backgroundColor: 'rgba(10, 10, 14, 0.98)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
              paddingBlock: 'var(--space-5)',
              paddingBottom: 'calc(var(--space-6) + env(safe-area-inset-bottom, 0px))',
              zIndex: 49,
              boxShadow: '0 24px 48px rgba(0, 0, 0, 0.95)',
            }}
          >
            <div className="page-container" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              {navItems.map((item) => {
                const isActive = isItemActive(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={(e) => {
                      setMobileOpen(false);
                      if (item.path === '/') {
                        handleHomeClick(e);
                      }
                    }}
                    style={{
                      fontSize: '1.35rem',
                      fontFamily: 'var(--font-display)',
                      fontWeight: 700,
                      color: isActive ? '#ffffff' : 'var(--silver-secondary)',
                      textDecoration: 'none',
                      minHeight: '44px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <span>{item.label}</span>
                    {isActive && (
                      <span
                        style={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          backgroundColor: 'var(--silver-bright)',
                          boxShadow: '0 0 8px rgba(255, 255, 255, 0.8)',
                        }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
