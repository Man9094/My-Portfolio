import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, Copy, TrendingUp, Cpu, Award } from 'lucide-react';
import { GithubIcon } from './Icons';
import type { Project } from '../data/portfolioData';

interface CaseStudyModalProps {
  project: Project | null;
  onClose: () => void;
}

export const CaseStudyModal: React.FC<CaseStudyModalProps> = ({ project, onClose }) => {
  const [copiedCode, setCopiedCode] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (project) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [project, onClose]);

  if (!project) return null;

  const copySnippet = () => {
    if (project.codeSnippet) {
      navigator.clipboard.writeText(project.codeSnippet.code);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  return (
    <AnimatePresence>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.5rem',
        }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-project-title"
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(8px)',
          }}
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', stiffness: 380, damping: 28 }}
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: '820px',
            maxHeight: '90vh',
            backgroundColor: '#ffffff',
            borderRadius: 'var(--radius-xl)',
            boxShadow: 'var(--shadow-xl)',
            border: '1px solid var(--border-default)',
            overflowY: 'auto',
            padding: '2.5rem',
            zIndex: 10,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            aria-label="Close case study dialog"
            style={{
              position: 'absolute',
              top: '1.5rem',
              right: '1.5rem',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: 'var(--bg-surface-subtle)',
              border: '1px solid var(--border-default)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--bg-surface-active)';
              e.currentTarget.style.color = 'var(--text-primary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--bg-surface-subtle)';
              e.currentTarget.style.color = 'var(--text-secondary)';
            }}
          >
            <X size={18} />
          </button>

          {/* Modal Header */}
          <div style={{ marginBottom: '1.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.75rem' }}>
              <span
                style={{
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--accent-primary)',
                  backgroundColor: 'var(--accent-light)',
                  padding: '3px 10px',
                  borderRadius: 'var(--radius-full)',
                }}
              >
                {project.category}
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>&middot; {project.year}</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>&middot; {project.role}</span>
            </div>

            <h2 id="modal-project-title" style={{ fontSize: '2rem', letterSpacing: '-0.03em', marginBottom: '0.5rem' }}>
              {project.title}
            </h2>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>
              {project.tagline}
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '1rem',
              padding: '1.25rem',
              backgroundColor: 'var(--bg-surface-subtle)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-default)',
              marginBottom: '2rem',
            }}
          >
            {project.stats.map((stat, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.45rem', fontWeight: 700, color: 'var(--accent-primary)', fontFamily: 'var(--font-heading)' }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Deep Dive: Challenge & Architectural Solution */}
          <div style={{ display: 'grid', gap: '1.5rem', marginBottom: '2rem' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem' }}>
                <TrendingUp size={16} color="var(--accent-primary)" />
                The Core Challenge
              </h3>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>
                {project.challenge}
              </p>
            </div>

            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem' }}>
                <Cpu size={16} color="var(--accent-emerald)" />
                Engineering Solution &amp; Architecture
              </h3>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>
                {project.solution}
              </p>
            </div>
          </div>

          {/* Code Architecture Sample */}
          {project.codeSnippet && (
            <div style={{ marginBottom: '2rem' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backgroundColor: '#0f172a',
                  color: '#94a3b8',
                  padding: '8px 16px',
                  borderTopLeftRadius: 'var(--radius-md)',
                  borderTopRightRadius: 'var(--radius-md)',
                  fontSize: '0.78rem',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                <span>{project.codeSnippet.filename}</span>
                <button
                  onClick={copySnippet}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    color: '#e2e8f0',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                  }}
                >
                  {copiedCode ? <Check size={13} color="#34d399" /> : <Copy size={13} />}
                  <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <pre
                style={{
                  backgroundColor: '#1e293b',
                  color: '#f8fafc',
                  padding: '1.25rem',
                  borderBottomLeftRadius: 'var(--radius-md)',
                  borderBottomRightRadius: 'var(--radius-md)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.85rem',
                  overflowX: 'auto',
                  lineHeight: 1.5,
                  margin: 0,
                }}
              >
                <code>{project.codeSnippet.code}</code>
              </pre>
            </div>
          )}

          {/* Quantifiable Results */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.75rem' }}>
              <Award size={16} color="var(--accent-amber)" />
              Measured Impact &amp; Results
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gap: '0.5rem' }}>
              {project.metrics.map((metric, idx) => (
                <li
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px',
                    fontSize: '0.9rem',
                    color: 'var(--text-secondary)',
                  }}
                >
                  <span
                    style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--accent-emerald-light)',
                      color: 'var(--accent-emerald)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      marginTop: '2px',
                    }}
                  >
                    <Check size={11} />
                  </span>
                  <span>{metric}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Tech stack tags */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '2rem' }}>
            {project.technologies.map((tech) => (
              <span
                key={tech}
                style={{
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: 'var(--bg-surface-subtle)',
                  border: '1px solid var(--border-default)',
                  fontSize: '0.78rem',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--text-secondary)',
                }}
              >
                {tech}
              </span>
            ))}
          </div>

          {/* Modal Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', borderTop: '1px solid var(--border-default)', paddingTop: '1.25rem' }}>
            {project.links.github && (
              <a
                href={project.links.github}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '9px 16px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--bg-surface-subtle)',
                  border: '1px solid var(--border-default)',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                }}
              >
                <GithubIcon size={15} />
                <span>Source Code</span>
              </a>
            )}
            <button
              onClick={onClose}
              style={{
                padding: '9px 20px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--text-primary)',
                color: '#ffffff',
                fontSize: '0.88rem',
                fontWeight: 600,
              }}
            >
              Done Reading
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
