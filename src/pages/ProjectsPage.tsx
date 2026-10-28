import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ProjectCard } from '../components/ProjectCard';
import { ParticleField } from '../components/ParticleField';
import { PORTFOLIO_CONFIG } from '../config/content';
import {
  pageContainerVariants,
  titleMaskVariants,
  tagVariants,
  contentBlockVariants,
} from '../utils/pageTransitions';

export const ProjectsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const { projects } = PORTFOLIO_CONFIG;

  // Extract unique categories
  const categories = ['All', ...Array.from(new Set(projects.map((p) => p.category)))];

  const filteredProjects = selectedCategory === 'All'
    ? projects
    : projects.filter((p) => p.category === selectedCategory);

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
            01 &mdash; Selected Archive
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
              Projects
            </motion.h1>
          </div>
        </div>

        {/* Working Category Filters */}
        {categories.length > 2 && (
          <motion.div
            variants={contentBlockVariants}
            style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: 'var(--space-6)' }}
          >
            {categories.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    position: 'relative',
                    padding: '8px 20px',
                    borderRadius: '9999px',
                    fontSize: '0.84rem',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: isActive ? 600 : 400,
                    color: isActive ? '#ffffff' : 'var(--silver-muted)',
                    backgroundColor: isActive ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.03)',
                    border: isActive ? '1px solid rgba(255, 255, 255, 0.28)' : '1px solid rgba(255, 255, 255, 0.08)',
                    transition: 'all 0.2s ease',
                    cursor: 'pointer',
                    minHeight: '44px',
                    display: 'inline-flex',
                    alignItems: 'center',
                  }}
                >
                  {cat}
                </button>
              );
            })}
          </motion.div>
        )}

        {/* Projects Grid */}
        <motion.div
          variants={contentBlockVariants}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 480px), 1fr))',
            gap: 'clamp(24px, 4vw, 40px)',
          }}
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, idx) => (
              <ProjectCard key={project.slug} project={project} index={idx} />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  );
};

