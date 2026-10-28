export interface Project {
  id: string;
  title: string;
  tagline: string;
  category: 'Design Systems' | 'Web Applications' | 'Motion & 3D';
  featured: boolean;
  year: string;
  role: string;
  stats: { label: string; value: string }[];
  overview: string;
  challenge: string;
  solution: string;
  technologies: string[];
  metrics: string[];
  codeSnippet?: {
    filename: string;
    code: string;
  };
  links: {
    live?: string;
    github?: string;
  };
}

export interface ExperienceItem {
  period: string;
  role: string;
  company: string;
  location: string;
  summary: string;
  highlights: string[];
  skills: string[];
}

export const PORTFOLIO_PROJECTS: Project[] = [
  {
    id: 'aura-design-system',
    title: 'Aura Design System',
    tagline: 'Enterprise multi-brand design system powering 40+ web applications with automated token pipelines.',
    category: 'Design Systems',
    featured: true,
    year: '2025',
    role: 'Lead Design Systems Engineer',
    stats: [
      { label: 'Component Adoptions', value: '94%' },
      { label: 'Engineering Velocity', value: '+3.2x' },
      { label: 'WCAG Score', value: '100% AAA' },
    ],
    overview:
      'A cross-platform token engine and component library engineered for high-concurrency web apps, with zero runtime CSS overhead, accessible primitive components, and automated Figma sync.',
    challenge:
      'Fragmented UI across 6 disparate engineering teams leading to inconsistent user journeys, duplicate CSS bloat, and recurring accessibility regressions.',
    solution:
      'Architected a headless component primitive foundation paired with CSS custom property token cascades, automated visual regression suites with Playwright, and zero-config Storybook documentation.',
    technologies: ['React 19', 'TypeScript', 'Motion', 'CSS Variables', 'Storybook', 'Figma API'],
    metrics: [
      'Eliminated 142KB of duplicate bundle CSS across core repositories',
      'Reduced component bug cycle time from 12 days to under 4 hours',
      'Unified design language for 2.4M monthly active enterprise users',
    ],
    codeSnippet: {
      filename: 'tokens/engine.ts',
      code: `export const createTokenScale = <T extends Record<string, string>>(
  prefix: string,
  tokens: T
): Record<keyof T, string> => {
  return Object.entries(tokens).reduce((acc, [key, val]) => {
    const varName = \`--\${prefix}-\${key}\`;
    acc[key as keyof T] = \`var(\${varName}, \${val})\`;
    return acc;
  }, {} as Record<keyof T, string>);
};`,
    },
    links: {
      live: '#',
      github: 'https://github.com',
    },
  },
  {
    id: 'kinetic-studio',
    title: 'Kinetic Timeline Studio',
    tagline: 'Browser-based timeline keyframe animator with 60fps real-time curve manipulation.',
    category: 'Motion & 3D',
    featured: true,
    year: '2024',
    role: 'Staff Frontend Engineer',
    stats: [
      { label: 'Frame Budget', value: '16.6ms' },
      { label: 'Offscreen Canvas', value: '2 Workers' },
      { label: 'Export Formats', value: 'CSS / Lottie / JSON' },
    ],
    overview:
      'High-performance motion authoring suite running purely in the web browser, allowing designers to tweak spring physics and bezier interpolation with instant visual previews.',
    challenge:
      'Complex timeline scrubbing with 100+ simultaneous animated elements caused severe layout thrashing and dropped frames on lower-end devices.',
    solution:
      'Offloaded keyframe calculations to Web Workers, decoupled render loops via requestAnimationFrame, and rendered curve visualizations directly onto an OffscreenCanvas.',
    technologies: ['React', 'TypeScript', 'Motion', 'Canvas API', 'Web Workers', 'Web Audio'],
    metrics: [
      'Sustained solid 60fps on complex sequences with 200+ nodes',
      'Zero garbage collection stutters during active timeline scrub',
      'Direct one-click export to React Motion and CSS linear() spring code',
    ],
    codeSnippet: {
      filename: 'motion/springSolver.ts',
      code: `export function solveSpring(stiffness: number, damping: number, mass: number) {
  const w0 = Math.sqrt(stiffness / mass);
  const zeta = damping / (2 * Math.sqrt(stiffness * mass));
  return { w0, zeta, duration: zeta < 1 ? Math.PI / (w0 * Math.sqrt(1 - zeta * zeta)) : 0.4 };
}`,
    },
    links: {
      live: '#',
      github: 'https://github.com',
    },
  },
  {
    id: 'nebula-analytics',
    title: 'Nebula Fintech Command Center',
    tagline: 'High-density trading & telemetry workspace with sub-10ms interaction latency.',
    category: 'Web Applications',
    featured: true,
    year: '2024',
    role: 'Frontend Architect',
    stats: [
      { label: 'Virtual Rows', value: '100,000+' },
      { label: 'Latency', value: '<8ms' },
      { label: 'Bundle Impact', value: '44KB core' },
    ],
    overview:
      'An ultra-responsive dashboard designed for real-time market data monitoring, complete with customizable bento widgets, keyboard-driven navigation, and accessible data tables.',
    challenge:
      'Ingesting 1,500 WebSocket updates per second while keeping UI interactions crisp and preventing DOM node proliferation.',
    solution:
      'Engineered a custom windowing virtualizer with buffer pooling, fine-grained state slices, and hardware-accelerated transform layers.',
    technologies: ['React', 'TypeScript', 'WebSockets', 'Virtualization', 'CSS Modules', 'Zustand'],
    metrics: [
      'Handled 2.5k updates/sec with zero noticeable input delay',
      'Full keyboard shortcut system mapping 48 terminal actions',
      'Lighthouse accessibility score of 100 on financial data tables',
    ],
    codeSnippet: {
      filename: 'hooks/useVirtualWindow.ts',
      code: `export function useVirtualWindow(itemCount: number, rowHeight: number, containerHeight: number) {
  const [scrollTop, setScrollTop] = useState(0);
  const startIndex = Math.max(0, Math.floor(scrollTop / rowHeight) - 2);
  const visibleCount = Math.ceil(containerHeight / rowHeight) + 4;
  return { startIndex, endIndex: Math.min(itemCount, startIndex + visibleCount) };
}`,
    },
    links: {
      live: '#',
      github: 'https://github.com',
    },
  },
  {
    id: 'veloce-commerce',
    title: 'Veloce Editorial Commerce',
    tagline: 'Luxury goods showcase featuring seamless shared-layout transitions and fluid micro-interactions.',
    category: 'Web Applications',
    featured: false,
    year: '2023',
    role: 'Senior UI/UX Developer',
    stats: [
      { label: 'Lighthouse Performance', value: '99/100' },
      { label: 'Cart Conversion', value: '+28%' },
      { label: 'CLS Score', value: '0.00' },
    ],
    overview:
      'An editorial-led e-commerce experience celebrating typographic hierarchy, cinematic product card transitions, and fluid checkout drawer interactions.',
    challenge:
      'Creating high-end magazine aesthetics without sacrificing page load performance and SEO crawlability.',
    solution:
      'Implemented shared layout animations with Motion layoutId, responsive image srcSets with AVIF formats, and speculative prefetching on cursor proximity.',
    technologies: ['React', 'Next.js', 'Motion', 'Tailwind/CSS', 'Stripe Elements'],
    metrics: [
      'Cumulative Layout Shift (CLS) reduced to an absolute 0.00',
      'Average page load time under 650ms on 4G cellular networks',
      'Over 28% increase in checkout completions via instant drawer',
    ],
    links: {
      live: '#',
      github: 'https://github.com',
    },
  },
];

export const EXPERIENCES: ExperienceItem[] = [
  {
    period: '2023 — Present',
    role: 'Staff Design Systems & Frontend Engineer',
    company: 'Veloce Labs',
    location: 'San Francisco, CA (Remote)',
    summary:
      'Leading UI architecture and component infrastructure across 4 core engineering squads. Specced the multi-theme design token architecture and accessibility automation.',
    highlights: [
      'Built and maintained 50+ accessible React 19 components with 100% TypeScript coverage',
      'Mentored 14 frontend developers on motion design best practices and frame-budget discipline',
      'Engineered an automated contrast checker and ARIA validator into CI/CD pipelines',
    ],
    skills: ['React 19', 'Design Tokens', 'Motion', 'TypeScript', 'Accessibility (WCAG AAA)'],
  },
  {
    period: '2021 — 2023',
    role: 'Lead UI/UX Frontend Engineer',
    company: 'Prism Interface Systems',
    location: 'New York, NY',
    summary:
      'Engineered real-time collaboration canvas applications, data visualizations, and high-performance micro-frontends.',
    highlights: [
      'Decreased enterprise bundle size by 38% through modular component tree shaking',
      'Built interactive animation libraries now used across 12 SaaS products',
      'Partnered closely with product designers to establish the company Design System Master',
    ],
    skills: ['React', 'CSS Architecture', 'Canvas API', 'State Architecture', 'Storybook'],
  },
  {
    period: '2019 — 2021',
    role: 'Senior Frontend Engineer',
    company: 'HyperPixel Creative Studio',
    location: 'Austin, TX',
    summary:
      'Crafted award-winning interactive websites, client design systems, and animated digital experiences for Fortune 500 clients.',
    highlights: [
      'Delivered 18 client launches with zero critical accessibility regressions',
      'Won 3 Awwwards Site of the Day accolades for technical frontend execution',
      'Pioneered internal performance guidelines for layout-thrash-free animations',
    ],
    skills: ['Vanilla CSS', 'Motion Physics', 'Responsive Design', 'WebGL', 'Performance Optimization'],
  },
];

export const DESIGN_TOKENS = {
  colors: [
    { name: 'App Background', token: '--bg-app', value: '#FCFCFD', sample: '#FCFCFD', border: true },
    { name: 'Surface High', token: '--bg-surface', value: '#FFFFFF', sample: '#FFFFFF', border: true },
    { name: 'Primary Text', token: '--text-primary', value: '#0F172A', sample: '#0F172A', dark: true },
    { name: 'Accent Blue', token: '--accent-primary', value: '#2563EB', sample: '#2563EB', dark: true },
    { name: 'Accent Emerald', token: '--accent-emerald', value: '#059669', sample: '#059669', dark: true },
    { name: 'Border Subdued', token: '--border-default', value: '#E2E8F0', sample: '#E2E8F0', border: true },
  ],
  radii: [
    { name: 'Sharp (xs)', token: '--radius-xs', value: '4px' },
    { name: 'Card (sm)', token: '--radius-sm', value: '8px' },
    { name: 'Container (md)', token: '--radius-md', value: '12px' },
    { name: 'Panel (lg)', token: '--radius-lg', value: '16px' },
    { name: 'Pill (full)', token: '--radius-full', value: '9999px' },
  ],
  typography: [
    { role: 'Display Heading', font: 'Space Grotesk', weight: '700', sample: 'Crafting Living Systems' },
    { role: 'Body Interface', font: 'Plus Jakarta Sans', weight: '400', sample: 'Balancing architectural rigor and fluidity' },
    { role: 'Code & Tokens', font: 'JetBrains Mono', weight: '500', sample: 'const spring = { stiffness: 400 };' },
  ],
};
