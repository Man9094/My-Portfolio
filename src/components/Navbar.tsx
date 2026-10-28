import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './Icons';

interface NavbarProps {
  activeSection: string;
}

export const Navbar: React.FC<NavbarProps> = ({ activeSection }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'work', label: 'Case Studies' },
    { id: 'playground', label: 'Design Playground' },
    { id: 'craft', label: 'Craft & Philosophy' },
    { id: 'experience', label: 'Experience' },
    { id: 'contact', label: 'Contact' },
  ];

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        isScrolled
          ? 'py-3 bg-white/80 backdrop-blur-md border-b border-slate-200/80 shadow-sm'
          : 'py-5 bg-transparent'
      }`}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        backgroundColor: isScrolled ? 'rgba(255, 255, 255, 0.88)' : 'rgba(252, 252, 253, 0.65)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: isScrolled ? '1px solid var(--border-default)' : '1px solid transparent',
        transition: 'all 0.2s ease',
      }}
    >
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Brand identity */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            textDecoration: 'none',
            color: 'var(--text-primary)',
          }}
        >
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: 'var(--radius-sm)',
              background: 'linear-gradient(135deg, #0f172a 0%, #2563eb 100%)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontFamily: 'var(--font-heading)',
              fontSize: '1rem',
              boxShadow: '0 2px 8px rgba(37, 99, 235, 0.25)',
            }}
          >
            AR
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', letterSpacing: '-0.01em', lineHeight: 1.2 }}>
              Alex Rivera
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              Creative Frontend &middot; UI/UX
            </div>
          </div>
        </a>

        {/* Center Navigation Links (Desktop) */}
        <nav
          className="desktop-nav"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
            background: 'rgba(241, 245, 249, 0.75)',
            padding: '4px',
            borderRadius: 'var(--radius-full)',
            border: '1px solid var(--border-default)',
          }}
          aria-label="Main Navigation"
        >
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <button
                key={link.id}
                onClick={() => scrollTo(link.id)}
                style={{
                  position: 'relative',
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.85rem',
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                  transition: 'color 0.15s ease',
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  zIndex: 1,
                }}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    style={{
                      position: 'absolute',
                      inset: 0,
                      backgroundColor: '#ffffff',
                      borderRadius: 'var(--radius-full)',
                      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
                      zIndex: -1,
                    }}
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Right Action: Status Pill & Direct CTA */}
        <div className="header-actions" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Availability Status Badge */}
          <div
            className="status-pill"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '5px 12px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--accent-emerald-light)',
              border: '1px solid rgba(5, 150, 105, 0.2)',
              fontSize: '0.78rem',
              fontWeight: 600,
              color: 'var(--accent-emerald)',
            }}
          >
            <span
              style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                backgroundColor: 'var(--accent-emerald)',
                display: 'inline-block',
                boxShadow: '0 0 0 0 rgba(5, 150, 105, 0.7)',
                animation: 'pulseGlow 2s infinite',
              }}
            />
            <span>Open for Projects</span>
          </div>

          <button
            onClick={() => scrollTo('contact')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 16px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--text-primary)',
              color: '#ffffff',
              fontSize: '0.85rem',
              fontWeight: 600,
              boxShadow: '0 2px 4px rgba(15, 23, 42, 0.15)',
              transition: 'transform 0.15s ease, background-color 0.15s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--accent-primary)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--text-primary)')}
          >
            <span>Let&apos;s Connect</span>
            <ArrowUpRight size={14} aria-hidden="true" />
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            className="mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            style={{
              display: 'none',
              padding: '6px',
              color: 'var(--text-primary)',
              borderRadius: 'var(--radius-xs)',
            }}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            style={{
              overflow: 'hidden',
              backgroundColor: '#ffffff',
              borderBottom: '1px solid var(--border-default)',
              boxShadow: 'var(--shadow-lg)',
            }}
          >
            <div className="container" style={{ paddingBlock: '1.25rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {navLinks.map((link) => (
                  <button
                    key={link.id}
                    onClick={() => scrollTo(link.id)}
                    style={{
                      textAlign: 'left',
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.95rem',
                      fontWeight: activeSection === link.id ? 600 : 500,
                      color: activeSection === link.id ? 'var(--accent-primary)' : 'var(--text-primary)',
                      backgroundColor: activeSection === link.id ? 'var(--accent-light)' : 'transparent',
                    }}
                  >
                    {link.label}
                  </button>
                ))}
                <div style={{ paddingTop: '0.75rem', borderTop: '1px solid var(--border-default)', display: 'flex', gap: '1rem' }}>
                  <a
                    href="https://github.com"
                    target="_blank"
                    rel="noreferrer"
                    style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}
                  >
                    <GithubIcon size={16} /> GitHub
                  </a>
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noreferrer"
                    style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}
                  >
                    <LinkedinIcon size={16} /> LinkedIn
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
