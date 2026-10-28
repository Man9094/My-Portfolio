import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, ArrowUpRight, CheckCircle2, ChevronRight } from 'lucide-react';
import { ParticleField } from '../components/ParticleField';
import { MagneticButton } from '../components/MagneticButton';
import { PORTFOLIO_CONFIG } from '../config/content';
import {
  pageContainerVariants,
  titleMaskVariants,
  tagVariants,
  contentBlockVariants,
  reentryViewportConfig,
} from '../utils/pageTransitions';

const GithubIcon = ({ size = 15 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

export const ProjectDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { projects } = PORTFOLIO_CONFIG;

  const projectIndex = projects.findIndex((p) => p.slug === slug);
  const project = projects[projectIndex];

  if (!project) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'var(--bg-deep)',
          color: 'var(--silver-primary)',
          padding: '2rem',
          textAlign: 'center',
        }}
      >
        <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1rem' }}>Project Not Found</h1>
        <p style={{ color: 'var(--silver-muted)', marginBottom: '2rem' }}>
          The requested project archive does not exist.
        </p>
        <MagneticButton to="/projects" variant="primary" icon={<ArrowLeft size={16} />}>
          Return to Projects
        </MagneticButton>
      </div>
    );
  }

  const prevProject = projectIndex > 0 ? projects[projectIndex - 1] : null;
  const nextProject = projectIndex < projects.length - 1 ? projects[projectIndex + 1] : null;

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
      <ParticleField opacity={0.3} />

      <div className="page-container" style={{ position: 'relative', zIndex: 10, maxWidth: '980px' }}>
        {/* Back Link */}
        <motion.div variants={tagVariants} style={{ marginBottom: 'var(--space-4)' }}>
          <Link
            to="/projects"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: 'var(--silver-muted)',
              fontSize: '0.85rem',
              fontFamily: 'var(--font-mono)',
              textDecoration: 'none',
              transition: 'color 0.2s ease',
              minHeight: '44px',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--silver-muted)')}
          >
            <ArrowLeft size={14} />
            <span>Archive / Projects</span>
          </Link>
        </motion.div>

        {/* Project Header */}
        <header style={{ marginBottom: 'var(--space-6)' }}>
          <motion.div
            variants={tagVariants}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.75rem' }}
          >
            <span
              style={{
                fontSize: '0.8rem',
                fontFamily: 'var(--font-mono)',
                color: 'var(--silver-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
              }}
            >
              {project.category} &middot; {project.year}
            </span>
          </motion.div>

          <div style={{ overflow: 'hidden' }}>
            <motion.h1
              variants={titleMaskVariants}
              style={{
                fontSize: 'clamp(2.4rem, 5.5vw, 4.4rem)',
                fontWeight: 900,
                letterSpacing: '-0.035em',
                lineHeight: 1.1,
                marginBottom: '1rem',
                color: '#ffffff',
              }}
              className="silver-chrome-text"
            >
              {project.title}
            </motion.h1>
          </div>

          <motion.p
            variants={contentBlockVariants}
            className="text-prose"
            style={{
              fontSize: 'clamp(1.05rem, 1.8vw, 1.25rem)',
              color: 'var(--silver-secondary)',
              lineHeight: 1.65,
            }}
          >
            {project.subtitle}
          </motion.p>

          {/* Action Links (Only shown if URLs are actually provided) */}
          {(project.liveUrl || project.githubUrl) && (
            <motion.div
              variants={contentBlockVariants}
              style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-4)', flexWrap: 'wrap' }}
            >
              {project.liveUrl && (
                <MagneticButton
                  href={project.liveUrl}
                  variant="primary"
                  icon={<ArrowUpRight size={15} />}
                >
                  Live Preview
                </MagneticButton>
              )}
              {project.githubUrl && (
                <MagneticButton
                  href={project.githubUrl}
                  variant="secondary"
                  icon={<GithubIcon size={15} />}
                >
                  Source Code
                </MagneticButton>
              )}
            </motion.div>
          )}
        </header>

        {/* Narrative & Deep Dive */}
        <motion.div
          variants={contentBlockVariants}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={reentryViewportConfig}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--section-space-sm)',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            paddingTop: 'var(--space-6)',
            marginBottom: 'var(--space-7)',
          }}
        >
          {/* Overview */}
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ffffff', marginBottom: 'var(--space-3)', letterSpacing: '-0.02em' }}>
              Overview
            </h2>
            <p className="text-prose">
              {project.overview}
            </p>
          </div>

          {/* Key Architecture & Technical Highlights */}
          {project.highlights && project.highlights.length > 0 && (
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ffffff', marginBottom: 'var(--space-3)', letterSpacing: '-0.02em' }}>
                Technical Execution
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                {project.highlights.map((highlight, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '12px',
                      padding: 'clamp(16px, 2.5vw, 20px)',
                      borderRadius: '14px',
                      backgroundColor: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid rgba(255, 255, 255, 0.06)',
                    }}
                  >
                    <CheckCircle2 size={16} color="var(--silver-bright)" style={{ marginTop: '3px', flexShrink: 0 }} />
                    <span style={{ fontSize: '0.95rem', color: 'var(--silver-secondary)', lineHeight: 1.6 }}>
                      {highlight}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Full Narrative */}
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ffffff', marginBottom: 'var(--space-3)', letterSpacing: '-0.02em' }}>
              Design &amp; Implementation Details
            </h2>
            <p className="text-prose">
              {project.description}
            </p>
          </div>

          {/* Technologies Used */}
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ffffff', marginBottom: 'var(--space-3)', letterSpacing: '-0.02em' }}>
              Stack &amp; Primitives
            </h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {project.technologies.map((tech) => (
                <span
                  key={tech}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '9999px',
                    backgroundColor: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.09)',
                    fontSize: '0.82rem',
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--silver-secondary)',
                  }}
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Project Pagination Navigation */}
        <motion.div
          variants={contentBlockVariants}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            paddingTop: 'var(--space-5)',
            flexWrap: 'wrap',
            gap: '1.5rem',
          }}
        >
          {prevProject ? (
            <Link
              to={`/projects/${prevProject.slug}`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                color: 'var(--silver-secondary)',
                textDecoration: 'none',
                minHeight: '44px',
              }}
            >
              <ArrowLeft size={16} />
              <div>
                <div style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--silver-muted)', textTransform: 'uppercase' }}>
                  Previous
                </div>
                <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#ffffff' }}>
                  {prevProject.title}
                </div>
              </div>
            </Link>
          ) : (
            <div />
          )}

          {nextProject && (
            <Link
              to={`/projects/${nextProject.slug}`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                textAlign: 'right',
                color: 'var(--silver-secondary)',
                textDecoration: 'none',
                minHeight: '44px',
              }}
            >
              <div>
                <div style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--silver-muted)', textTransform: 'uppercase' }}>
                  Next
                </div>
                <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#ffffff' }}>
                  {nextProject.title}
                </div>
              </div>
              <ChevronRight size={16} />
            </Link>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

