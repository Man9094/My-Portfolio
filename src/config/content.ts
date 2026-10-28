/**
 * CENTRAL PORTFOLIO CONFIGURATION — MAN CHAUDHARI
 * 
 * Edit your details, biography, education, projects, and contact info in this file.
 * To update your photo, place your image at public/images/man-chaudhari.jpg.
 */

export interface ProjectItem {
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  year: string;
  overview: string;
  description: string;
  highlights: string[];
  technologies: string[];
  image?: string;
  liveUrl?: string;     // Leave undefined or empty if not yet deployed
  githubUrl?: string;   // Leave undefined or empty if private
}

export interface SocialLink {
  label: string;
  url: string;          // If empty string, the link will be cleanly hidden
}

export interface PortfolioContent {
  personal: {
    name: string;
    monogram: string;
    portraitPath: string;
    portraitPosition: string; // CSS object-position (e.g., 'center 20%' or 'center top')
    location: string;
    status: string;
    shortBio: string;
    fullBio: string[];
    education: {
      institution: string;
      degree: string;
      period: string;
      details?: string;
    }[];
    interests: string[];
  };
  projects: ProjectItem[];
  contact: {
    email: string;      // If empty, mailto will not be exposed
    socials: Record<string, SocialLink>;
    note: string;
  };
}

export const PORTFOLIO_CONFIG: PortfolioContent = {
  personal: {
    name: 'Man Chaudhari',
    monogram: 'MC',
    portraitPath: '/images/man-chaudhari.png',
    portraitPosition: 'center 25%', // Centers face in portrait frames
    location: 'Available Globally',
    status: 'Exploring New Opportunities',
    shortBio:
      'Focused on crafting fluid, cinematic web experiences with depth, purposeful 3D motion, and meticulous visual typography.',
    fullBio: [
      'I am Man Chaudhari, a developer dedicated to the intersection of code, motion, and digital craftsmanship.',
      'My focus is on engineering intuitive interfaces that feel tactile and responsive. By pairing modern web architectures with restrained 3D perspective and performance-first animation, I strive to build software that resonates visually while remaining fast and accessible.',
      'When approaching any digital medium, I prioritize architectural simplicity, typographic balance, and deliberate interaction over arbitrary complexity.',
    ],
    education: [
      {
        institution: 'Ganpat University',
        degree: 'BCA (Honours)',
        period: 'Expected 2028',
        details: 'Mehsana, Gujarat · In progress',
      },
    ],
    interests: [
      'Creative Development',
      'Real-Time Graphics & WebGL',
      'Motion Design & Choreography',
      'Minimalist Typography',
      'High-Performance Frontend Systems',
      'Design Engineering',
    ],
  },
  projects: [
    {
      slug: 'kinetic-canvas',
      title: 'Kinetic Canvas',
      subtitle: 'Real-time interactive particle physics and fluid gesture dynamics in the browser.',
      category: 'Creative Development',
      year: '2025',
      overview:
        'A browser-based motion laboratory exploring spring mathematics, kinetic particle behavior, and continuous cursor interaction.',
      description:
        'Kinetic Canvas was created to study how human gesture speed and inertia translate into digital animation curves. Built using native Canvas API and custom verlet integration routines to maintain high frame consistency without external physics libraries.',
      highlights: [
        'Custom verlet integration engine running entirely on requestAnimationFrame loops',
        'Hardware-accelerated rendering pipeline with automatic particle density throttling',
        'Direct mathematical mapping of pointer velocity to spring oscillation',
      ],
      technologies: ['TypeScript', 'HTML5 Canvas', 'Motion', 'Linear Algebra'],
      liveUrl: '',     // Add your live link when ready
      githubUrl: '',   // Add your repository link when ready
    },
    {
      slug: 'strata-interface',
      title: 'Strata Interface',
      subtitle: 'Spatial design exploration with layered perspective and tactile lighting responses.',
      category: 'Interactive UI',
      year: '2024',
      overview:
        'An experimental multi-layered desktop UI model exploring subtle 3D card tilt, dynamic light reflections, and spatial depth.',
      description:
        'Rather than static flat planes, Strata treats user interface layers as physical materials with depth and weight. Cards react to pointer vectors with calculated specular glare and parallax offset, creating a tangible sense of hierarchy.',
      highlights: [
        'Real-time pointer vector tracking converted to 3D rotation matrix',
        'Restrained CSS transform layers ensuring smooth framerate on lower-power devices',
        'Accessible fallback for touchscreens and users with reduced motion preferences',
      ],
      technologies: ['React', 'TypeScript', 'Motion', 'CSS 3D Transforms'],
      liveUrl: '',
      githubUrl: '',
    },
    {
      slug: 'monochrome-editorial',
      title: 'Monochrome Editorial',
      subtitle: 'Digital publication system prioritizing stark typographic scale and zero layout shift.',
      category: 'Web Architecture',
      year: '2024',
      overview:
        'A publication interface celebrating oversized brutalist-minimal typography, instantaneous route transitions, and responsive reading comfort.',
      description:
        'Engineered to showcase how typographic restraint and deliberate negative space create a cinematic reading experience. Features optimized client routing, speculative font preloading, and dynamic fluid sizing.',
      highlights: [
        'Zero layout shifts (CLS 0.00) across all responsive breakpoints',
        'Sub-second page transitions with state preservation',
        'Accessible high-contrast typography adhering strictly to WCAG guidelines',
      ],
      technologies: ['React', 'TypeScript', 'Motion', 'Vite'],
      liveUrl: '',
      githubUrl: '',
    },
  ],
  contact: {
    email: 'contact@manchaudhari.com', // Replace with your actual email address
    note:
      'Direct form submission backend is currently unconfigured. You can reach out directly via email.',
    socials: {
      github: {
        label: 'GitHub',
        url: 'https://github.com/Man9094',
      },
      linkedin: {
        label: 'LinkedIn',
        url: '', // Add your LinkedIn profile URL
      },
      twitter: {
        label: 'X (Twitter)',
        url: '', // Add your X/Twitter profile URL
      },
    },
  },
};
