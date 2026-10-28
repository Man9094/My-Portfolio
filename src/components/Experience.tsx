import React from 'react';
import { motion } from 'motion/react';
import { Briefcase, Calendar, MapPin, CheckCircle2 } from 'lucide-react';
import { EXPERIENCES } from '../data/portfolioData';

export const Experience: React.FC = () => {
  return (
    <section id="experience" style={{ paddingBlock: 'var(--space-4xl)', backgroundColor: 'var(--bg-app)' }}>
      <div className="container">
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '680px', marginInline: 'auto', marginBottom: '3.5rem' }}>
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
            <Briefcase size={13} />
            <span>Track Record</span>
          </div>

          <h2
            style={{
              fontSize: 'clamp(2rem, 3.8vw, 2.75rem)',
              letterSpacing: '-0.03em',
              marginBottom: '1rem',
              color: 'var(--text-primary)',
            }}
          >
            Work Experience &amp; Leadership
          </h2>
          <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)' }}>
            8+ years scaling design systems, optimizing frontend rendering pipelines, and building world-class user interfaces.
          </p>
        </div>

        {/* Timeline Container */}
        <div style={{ maxWidth: '840px', marginInline: 'auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {EXPERIENCES.map((exp, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.25 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              style={{
                backgroundColor: 'var(--bg-surface)',
                borderRadius: 'var(--radius-xl)',
                border: '1px solid var(--border-default)',
                padding: '2.25rem',
                boxShadow: 'var(--shadow-sm)',
                position: 'relative',
                transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-strong)';
                e.currentTarget.style.boxShadow = 'var(--shadow-md)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-default)';
                e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
              }}
            >
              {/* Card Header */}
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', marginBottom: '1.25rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
                    {exp.role}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', fontSize: '0.9rem' }}>
                    <span style={{ fontWeight: 600, color: 'var(--accent-primary)' }}>{exp.company}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                      <MapPin size={13} /> {exp.location}
                    </span>
                  </div>
                </div>

                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '4px 12px',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: 'var(--bg-surface-subtle)',
                    border: '1px solid var(--border-default)',
                    fontSize: '0.8rem',
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--text-secondary)',
                    fontWeight: 600,
                  }}
                >
                  <Calendar size={13} />
                  <span>{exp.period}</span>
                </div>
              </div>

              {/* Summary */}
              <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.65, marginBottom: '1.25rem' }}>
                {exp.summary}
              </p>

              {/* Bulleted Key Achievements */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '1.5rem' }}>
                {exp.highlights.map((highlight, hIdx) => (
                  <div key={hIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                    <span
                      style={{
                        width: '16px',
                        height: '16px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--accent-emerald-light)',
                        color: 'var(--accent-emerald)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        marginTop: '3px',
                      }}
                    >
                      <CheckCircle2 size={11} />
                    </span>
                    <span>{highlight}</span>
                  </div>
                ))}
              </div>

              {/* Skill Tags */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem' }}>
                {exp.skills.map((skill) => (
                  <span
                    key={skill}
                    style={{
                      fontSize: '0.75rem',
                      fontFamily: 'var(--font-mono)',
                      padding: '3px 10px',
                      borderRadius: 'var(--radius-xs)',
                      backgroundColor: 'var(--bg-app)',
                      border: '1px solid var(--border-default)',
                      color: 'var(--text-secondary)',
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
