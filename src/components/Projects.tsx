import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUpRight, Eye, Box } from 'lucide-react';
import { PORTFOLIO_PROJECTS } from '../data/portfolioData';
import type { Project } from '../data/portfolioData';

interface ProjectsProps {
  onSelectProject: (project: Project) => void;
}

export const Projects: React.FC<ProjectsProps> = ({ onSelectProject }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Design Systems', 'Web Applications', 'Motion & 3D'];

  const filteredProjects = selectedCategory === 'All'
    ? PORTFOLIO_PROJECTS
    : PORTFOLIO_PROJECTS.filter((p) => p.category === selectedCategory);

  return (
    <section id="work" style={{ paddingBlock: 'var(--space-4xl)', position: 'relative' }}>
      <div className="container">
        {/* Section Header */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '3rem' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 12px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--accent-light)',
              color: 'var(--accent-primary)',
              fontSize: '0.82rem',
              fontWeight: 600,
              fontFamily: 'var(--font-mono)',
              marginBottom: '1rem',
            }}
          >
            <Box size={13} />
            <span>Featured Case Studies</span>
          </div>

          <h2
            style={{
              fontSize: 'clamp(2rem, 3.8vw, 2.75rem)',
              letterSpacing: '-0.03em',
              marginBottom: '1rem',
              color: 'var(--text-primary)',
            }}
          >
            Selected Works &amp; Architecture
          </h2>
          <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', maxWidth: '650px' }}>
            Production systems engineered for scalability, rigorous accessibility standards, and 60fps micro-interaction polish.
          </p>
        </div>

        {/* Filter Navigation */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '3rem' }}>
          <div
            style={{
              display: 'inline-flex',
              padding: '4px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-default)',
              boxShadow: 'var(--shadow-xs)',
              gap: '4px',
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            {categories.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    position: 'relative',
                    padding: '7px 18px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.85rem',
                    fontWeight: isActive ? 600 : 500,
                    color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    zIndex: 1,
                    transition: 'color 0.15s ease',
                  }}
                >
                  {isActive && (
                    <motion.div
                      layoutId="categoryActivePill"
                      style={{
                        position: 'absolute',
                        inset: 0,
                        backgroundColor: '#ffffff',
                        borderRadius: 'var(--radius-full)',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.08)',
                        border: '1px solid var(--border-default)',
                        zIndex: -1,
                      }}
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Projects Grid */}
        <motion.div
          layout
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
            gap: '2rem',
          }}
          className="projects-grid"
        >
          <AnimatePresence>
            {filteredProjects.map((project) => (
              <motion.article
                layout
                key={project.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  borderRadius: 'var(--radius-xl)',
                  border: '1px solid var(--border-default)',
                  boxShadow: 'var(--shadow-sm)',
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-xl)';
                  e.currentTarget.style.borderColor = 'var(--border-strong)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                  e.currentTarget.style.borderColor = 'var(--border-default)';
                }}
              >
                {/* Decorative Top Accent Banner */}
                <div
                  style={{
                    height: '140px',
                    background: project.category === 'Design Systems'
                      ? 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)'
                      : project.category === 'Motion & 3D'
                      ? 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)'
                      : 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
                    padding: '1.25rem 1.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    borderBottom: '1px solid var(--border-subtle)',
                    position: 'relative',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        fontFamily: 'var(--font-mono)',
                        padding: '3px 10px',
                        borderRadius: 'var(--radius-full)',
                        backgroundColor: '#ffffff',
                        color: project.category === 'Design Systems'
                          ? 'var(--accent-primary)'
                          : project.category === 'Motion & 3D'
                          ? 'var(--accent-purple)'
                          : 'var(--accent-emerald)',
                        boxShadow: 'var(--shadow-xs)',
                      }}
                    >
                      {project.category}
                    </span>
                    <span style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                      {project.year}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                      Role: {project.role}
                    </span>
                  </div>
                </div>

                {/* Card Content Body */}
                <div style={{ padding: '1.75rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <h3
                    style={{
                      fontSize: '1.4rem',
                      fontWeight: 700,
                      marginBottom: '0.5rem',
                      letterSpacing: '-0.02em',
                      color: 'var(--text-primary)',
                    }}
                  >
                    {project.title}
                  </h3>

                  <p
                    style={{
                      fontSize: '0.92rem',
                      color: 'var(--text-secondary)',
                      lineHeight: 1.6,
                      marginBottom: '1.25rem',
                      flex: 1,
                    }}
                  >
                    {project.tagline}
                  </p>

                  {/* High Impact Stats Preview */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(3, 1fr)',
                      gap: '0.5rem',
                      backgroundColor: 'var(--bg-surface-subtle)',
                      padding: '10px 12px',
                      borderRadius: 'var(--radius-sm)',
                      marginBottom: '1.25rem',
                      textAlign: 'center',
                    }}
                  >
                    {project.stats.map((s, i) => (
                      <div key={i}>
                        <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--accent-primary)', fontFamily: 'var(--font-heading)' }}>
                          {s.value}
                        </div>
                        <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', lineHeight: 1.2 }}>
                          {s.label}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Tech stack tags */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '1.5rem' }}>
                    {project.technologies.slice(0, 4).map((tech) => (
                      <span
                        key={tech}
                        style={{
                          fontSize: '0.72rem',
                          fontFamily: 'var(--font-mono)',
                          padding: '2px 8px',
                          borderRadius: 'var(--radius-xs)',
                          backgroundColor: 'var(--bg-app)',
                          border: '1px solid var(--border-default)',
                          color: 'var(--text-secondary)',
                        }}
                      >
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 4 && (
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', alignSelf: 'center' }}>
                        +{project.technologies.length - 4} more
                      </span>
                    )}
                  </div>

                  {/* Card Actions */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
                    <button
                      onClick={() => onSelectProject(project)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '0.88rem',
                        fontWeight: 600,
                        color: 'var(--accent-primary)',
                        padding: '6px 0',
                        cursor: 'pointer',
                      }}
                    >
                      <Eye size={15} />
                      <span>Inspect Architecture</span>
                    </button>

                    <button
                      onClick={() => onSelectProject(project)}
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--bg-surface-subtle)',
                        border: '1px solid var(--border-default)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--text-primary)',
                        cursor: 'pointer',
                      }}
                      aria-label={`View details of ${project.title}`}
                    >
                      <ArrowUpRight size={15} />
                    </button>
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};
