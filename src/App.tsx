import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { MotionConfig, AnimatePresence, motion } from 'motion/react';
import { CursorProvider } from './context/CursorProvider';
import { CustomCursor } from './components/CustomCursor';
import { Navigation } from './components/Navigation';
import { Footer } from './components/Footer';
import { ScrollToTop } from './components/ScrollToTop';
import { HomePage } from './pages/HomePage';
import './App.css';

// Code-split secondary routes for rapid initial load of home hero
const AboutPage = lazy(() => import('./pages/AboutPage').then((m) => ({ default: m.AboutPage })));
const ProjectsPage = lazy(() => import('./pages/ProjectsPage').then((m) => ({ default: m.ProjectsPage })));
const ProjectDetailPage = lazy(() => import('./pages/ProjectDetailPage').then((m) => ({ default: m.ProjectDetailPage })));
const ContactPage = lazy(() => import('./pages/ContactPage').then((m) => ({ default: m.ContactPage })));

const AnimatedRoutes = () => {
  const location = useLocation();

  // On every route change, reset scroll to top and move focus to heading / landmark
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    const timer = setTimeout(() => {
      const heading = document.querySelector('h1');
      if (heading) {
        heading.setAttribute('tabindex', '-1');
        heading.focus?.({ preventScroll: true });
      }
    }, 50);
    return () => clearTimeout(timer);
  }, [location.pathname, location.key]);

  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-deep)' }} />}>
      <AnimatePresence mode="wait">
        <motion.div
          key={location.key || location.pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          style={{ width: '100%', flex: 1, display: 'flex', flexDirection: 'column' }}
        >
          <Routes location={location}>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/projects/:slug" element={<ProjectDetailPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="*" element={<HomePage />} />
          </Routes>
        </motion.div>
      </AnimatePresence>
    </Suspense>
  );
};

export function App() {
  return (
    <MotionConfig reducedMotion="user">
      <CursorProvider>
        <BrowserRouter>
          <ScrollToTop />
          <CustomCursor />
          <div
            className="portfolio-app"
            style={{
              minHeight: '100vh',
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: 'var(--bg-deep)',
              color: 'var(--silver-primary)',
            }}
          >
            <Navigation />
            <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <AnimatedRoutes />
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </CursorProvider>
    </MotionConfig>
  );
}

export default App;
