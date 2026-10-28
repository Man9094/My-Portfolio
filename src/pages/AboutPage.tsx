import { motion } from 'motion/react';
import { ArrowUpRight, GraduationCap, Compass, Mail } from 'lucide-react';
import { PortraitImage } from '../components/PortraitImage';
import { ParticleField } from '../components/ParticleField';
import { MagneticButton } from '../components/MagneticButton';
import { PORTFOLIO_CONFIG } from '../config/content';
import {
  pageContainerVariants,
  titleMaskVariants,
  tagVariants,
  contentBlockVariants,
  mediaFrameVariants,
  cardItemVariants,
  reentryViewportConfig,
} from '../utils/pageTransitions';

export const AboutPage = () => {
  const { personal, contact } = PORTFOLIO_CONFIG;

  return (
    <motion.div
      variants={pageContainerVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      style={{
        position: 'relative',
        minHeight: '100vh',
        backgroundColor: 'var(--bg-deep)',
        color: 'var(--silver-primary)',
        paddingTop: 'var(--page-top-offset)',
        paddingBottom: 'clamp(4rem, 8vw, 7rem)',
      }}
    >
      <ParticleField opacity={0.35} />

      <div className="page-container" style={{ position: 'relative', zIndex: 10 }}>
        {/* Page Header with Mask Reveal */}
        <div style={{ marginBottom: 'clamp(2.5rem, 5vw, 4rem)' }}>
          <motion.span
            variants={tagVariants}
            style={{
              fontSize: '0.82rem',
              fontFamily: 'var(--font-mono)',
              color: 'var(--silver-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              display: 'block',
              marginBottom: '0.75rem',
            }}
          >
            02 &mdash; Biography &middot; Portrait
          </motion.span>

          <div style={{ overflow: 'hidden' }}>
            <motion.h1
              variants={titleMaskVariants}
              style={{
                fontSize: 'clamp(2.6rem, 6.5vw, 5rem)',
                fontWeight: 900,
                letterSpacing: '-0.04em',
                lineHeight: 1.05,
                textTransform: 'uppercase',
                margin: 0,
              }}
              className="silver-chrome-text"
            >
              About
            </motion.h1>
          </div>
        </div>

        {/* Main Composition: Prominent Portrait Frame + Biography */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(260px, 360px) 1fr',
            gap: 'clamp(2rem, 5vw, 4.5rem)',
            alignItems: 'flex-start',
            marginBottom: 'var(--section-space)',
          }}
          className="about-grid"
        >
          {/* Prominent Portrait Area - Scale & Perspective Settle */}
          <motion.div
            variants={mediaFrameVariants}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}
          >
            <PortraitImage size="lg" circular={true} enableTilt={true} />

            <div
              style={{
                marginTop: '1.25rem',
                fontSize: '0.78rem',
                fontFamily: 'var(--font-mono)',
                color: 'var(--silver-muted)',
                textAlign: 'center',
                letterSpacing: '0.04em',
              }}
            >
              <span>{personal.name}</span> &middot; <span>{personal.location}</span>
            </div>
          </motion.div>

          {/* Biography Text & Narrative */}
          <motion.div
            variants={contentBlockVariants}
            style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}
          >
            <h2
              style={{
                fontSize: 'clamp(1.5rem, 2.6vw, 2.2rem)',
                fontWeight: 700,
                letterSpacing: '-0.03em',
                lineHeight: 1.3,
                color: '#ffffff',
                maxWidth: '32ch',
              }}
            >
              Engineering purposeful motion, typographic rigor, and intuitive digital interfaces.
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {personal.fullBio.map((paragraph, index) => (
                <p key={index} className="text-prose">{paragraph}</p>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: '0.75rem', flexWrap: 'wrap' }}>
              <MagneticButton to="/contact" variant="primary" icon={<Mail size={16} />}>
                Contact Man
              </MagneticButton>

              <MagneticButton to="/projects" variant="secondary" icon={<ArrowUpRight size={16} />}>
                View Projects
              </MagneticButton>
            </div>
          </motion.div>
        </div>

        {/* Structured Sections: Education & Interests - Replays on Viewport Re-entry */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={reentryViewportConfig}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
            gap: 'clamp(2rem, 5vw, 4rem)',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            paddingTop: 'var(--space-6)',
          }}
        >
          {/* Education Block */}
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.82rem',
                fontFamily: 'var(--font-mono)',
                color: 'var(--silver-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                marginBottom: '1.5rem',
              }}
            >
              <GraduationCap size={16} />
              <span>Education</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              {personal.education.map((item, idx) => (
                <motion.div
                  key={idx}
                  variants={cardItemVariants}
                  style={{
                    padding: 'clamp(18px, 3vw, 24px)',
                    borderRadius: '16px',
                    backgroundColor: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '6px' }}>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#ffffff' }}>
                      {item.degree}
                    </h3>
                    <span style={{ fontSize: '0.78rem', fontFamily: 'var(--font-mono)', color: 'var(--silver-muted)' }}>
                      {item.period}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.92rem', color: 'var(--silver-secondary)', marginBottom: '8px' }}>
                    {item.institution}
                  </div>
                  {item.details && (
                    <div style={{ fontSize: '0.82rem', color: 'var(--silver-muted)', lineHeight: 1.6 }}>
                      {item.details}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Interests & Craft Focus */}
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.82rem',
                fontFamily: 'var(--font-mono)',
                color: 'var(--silver-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                marginBottom: '1.5rem',
              }}
            >
              <Compass size={16} />
              <span>Interests &amp; Exploration</span>
            </div>

            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '10px',
              }}
            >
              {personal.interests.map((interest, idx) => (
                <motion.div
                  key={idx}
                  variants={cardItemVariants}
                  style={{
                    padding: '10px 18px',
                    borderRadius: '12px',
                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    fontSize: '0.88rem',
                    color: 'var(--silver-secondary)',
                    letterSpacing: '0.02em',
                  }}
                >
                  {interest}
                </motion.div>
              ))}
            </div>

            {/* Direct Contact note */}
            {contact.email && (
              <div
                style={{
                  marginTop: '2rem',
                  padding: '1.5rem',
                  borderRadius: '16px',
                  backgroundColor: 'rgba(255, 255, 255, 0.02)',
                  border: '1px dashed rgba(255, 255, 255, 0.1)',
                }}
              >
                <div style={{ fontSize: '0.78rem', fontFamily: 'var(--font-mono)', color: 'var(--silver-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>
                  Direct Contact
                </div>
                <div className="wrap-anywhere" style={{ fontSize: '0.95rem', fontFamily: 'var(--font-mono)', color: 'var(--silver-bright)' }}>
                  {contact.email}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};
