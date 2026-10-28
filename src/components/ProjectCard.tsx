import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { useCursor } from '../context/useCursor';
import type { ProjectItem } from '../config/content';

interface ProjectCardProps {
  project: ProjectItem;
  index: number;
}

export const ProjectCard = ({ project, index }: ProjectCardProps) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const { setCursorVariant, resetCursor } = useCursor();

  // Pointer position normalized to [-0.5, 0.5]
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { stiffness: 220, damping: 24, mass: 0.6 };
  const mouseXSpring = useSpring(x, springConfig);
  const mouseYSpring = useSpring(y, springConfig);

  // Maximum 5 degrees perspective tilt
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['5deg', '-5deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-5deg', '5deg']);

  // Inner image/frame translation (max 6px depth offset)
  const innerX = useTransform(mouseXSpring, [-0.5, 0.5], [-6, 6]);
  const innerY = useTransform(mouseYSpring, [-0.5, 0.5], [-6, 6]);

  // Directional specular highlight following pointer
  const sheenX = useTransform(mouseXSpring, [-0.5, 0.5], ['0%', '100%']);
  const sheenY = useTransform(mouseYSpring, [-0.5, 0.5], ['0%', '100%']);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    if (width === 0 || height === 0) return;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    x.set(mouseX / width - 0.5);
    y.set(mouseY / height - 0.5);
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLElement>) => {
    setCursorVariant('project', 'VIEW');
    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.28)';
    e.currentTarget.style.boxShadow =
      '0 35px 70px -10px rgba(0, 0, 0, 0.95), inset 0 1px 2px rgba(255, 255, 255, 0.2)';
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLElement>) => {
    x.set(0);
    y.set(0);
    resetCursor();
    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
    e.currentTarget.style.boxShadow =
      '0 25px 50px -12px rgba(0, 0, 0, 0.8), inset 0 1px 1px rgba(255, 255, 255, 0.12)';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 35, rotateX: 6 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: false, amount: 0.25, margin: '0px 0px -40px 0px' }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      style={{ perspective: '1200px' }}
    >
      {/* Stable, stationary hit-area wrapper (no chasing moving targets) */}
      <Link
        to={`/projects/${project.slug}`}
        style={{ textDecoration: 'none', display: 'block', outline: 'none' }}
        tabIndex={0}
      >
        <motion.article
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          style={{
            rotateX,
            rotateY,
            transformStyle: 'preserve-3d',
            backgroundColor: 'rgba(15, 15, 19, 0.85)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            borderRadius: '24px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            padding: 'clamp(20px, 3.5vw, 36px)',
            position: 'relative',
            overflow: 'hidden',
            boxShadow:
              '0 25px 50px -12px rgba(0, 0, 0, 0.8), inset 0 1px 1px rgba(255, 255, 255, 0.12)',
            transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
          }}
        >
          {/* Faint directional highlight following pointer */}
          <motion.div
            style={{
              position: 'absolute',
              inset: 0,
              background: `radial-gradient(circle at ${sheenX} ${sheenY}, rgba(255, 255, 255, 0.09) 0%, transparent 65%)`,
              pointerEvents: 'none',
              zIndex: 3,
            }}
          />

          {/* Inner content layer moving slightly within clipped frame for depth */}
          <motion.div
            style={{
              x: innerX,
              y: innerY,
              position: 'relative',
              zIndex: 4,
            }}
          >
            {/* Top Metadata Row */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1.5rem',
              }}
            >
              <span
                style={{
                  fontSize: '0.78rem',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--silver-muted)',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                }}
              >
                {project.category} &middot; {project.year}
              </span>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                }}
              >
                <ArrowUpRight size={17} />
              </div>
            </div>

            {/* Stable Title */}
            <h2
              style={{
                fontSize: 'clamp(1.8rem, 3.2vw, 2.6rem)',
                fontWeight: 800,
                letterSpacing: '-0.03em',
                marginBottom: '1rem',
                color: '#ffffff',
              }}
            >
              {project.title}
            </h2>

            {/* Stable Subtitle */}
            <p
              style={{
                fontSize: '1rem',
                color: 'var(--silver-secondary)',
                lineHeight: 1.65,
                marginBottom: '2rem',
                maxWidth: '680px',
              }}
            >
              {project.subtitle}
            </p>

            {/* Technologies Chips */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {project.technologies.map((tech) => (
                <span
                  key={tech}
                  style={{
                    fontSize: '0.75rem',
                    fontFamily: 'var(--font-mono)',
                    padding: '4px 10px',
                    borderRadius: '9999px',
                    backgroundColor: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    color: 'var(--silver-muted)',
                  }}
                >
                  {tech}
                </span>
              ))}
            </div>
          </motion.div>
        </motion.article>
      </Link>
    </motion.div>
  );
};
