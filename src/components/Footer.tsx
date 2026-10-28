import { ArrowUp } from 'lucide-react';
import { PORTFOLIO_CONFIG } from '../config/content';

const CURRENT_YEAR = new Date().getFullYear();

export const Footer = () => {
  const { personal, contact } = PORTFOLIO_CONFIG;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const availableSocials = Object.values(contact.socials).filter(
    (social) => social.url && social.url.trim() !== ''
  );

  return (
    <footer
      style={{
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        backgroundColor: '#070709',
        paddingBlock: 'var(--space-5)',
        position: 'relative',
        zIndex: 20,
      }}
    >
      <div
        className="page-container"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 'var(--space-4)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: '0.95rem',
              color: '#ffffff',
              letterSpacing: '-0.02em',
              textTransform: 'uppercase',
            }}
          >
            {personal.name}
          </span>
          <span style={{ color: 'var(--silver-muted)', fontSize: '0.8rem' }}>&middot;</span>
          <span style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: 'var(--silver-muted)' }}>
            &copy; {CURRENT_YEAR}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
          {availableSocials.map((social) => (
            <a
              key={social.label}
              href={social.url}
              target="_blank"
              rel="noreferrer"
              style={{
                fontSize: '0.82rem',
                fontFamily: 'var(--font-mono)',
                color: 'var(--silver-muted)',
                textDecoration: 'none',
                transition: 'color 0.2s ease',
                minHeight: '44px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                paddingInline: '4px',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--silver-muted)')}
            >
              {social.label.toLowerCase() === 'github' && (
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                  <path d="M9 18c-4.51 2-5-2-7-2" />
                </svg>
              )}
              <span>{social.label}</span>
            </a>
          ))}

          <button
            onClick={scrollToTop}
            aria-label="Back to top"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: '9999px',
              backgroundColor: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              fontSize: '0.78rem',
              fontFamily: 'var(--font-mono)',
              color: 'var(--silver-secondary)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              minHeight: '44px',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#ffffff';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.25)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--silver-secondary)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
            }}
          >
            <span>Top</span>
            <ArrowUp size={13} />
          </button>
        </div>
      </div>
    </footer>
  );
};
