import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from './ThemeToggle';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/projects', label: 'Projects' },
  { to: '/blog', label: 'Blog' },
  { to: '/about', label: 'About' },
  { to: '/demo/terminal', label: 'Terminal' },
  { to: '/demo/github-activity', label: 'Activity' },
  { to: '/demo/code-playground', label: 'Playground' },
  { to: '/demo/ascii-art', label: 'ASCII' },
  { to: '/demo/achievements', label: 'Badges' },
];

const Navbar = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 5);
    };
    window.addEventListener('scroll', handleScroll);
    const timeout = setTimeout(() => {
      setIsVisible(window.scrollY > 5);
    }, 0);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timeout);
    };
  }, []);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <>
      {/* Hamburger button - visible on mobile */}
      <button
        onClick={() => setIsMobileMenuOpen(true)}
        className="fixed top-4 right-4 z-50 p-2 md:hidden bg-bg dark:bg-bg-dark border border-borderMuted"
        aria-label="Open menu"
      >
        <svg className="w-6 h-6 text-primary dark:text-primary-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Desktop Navigation */}
      <AnimatePresence>
        {isVisible && (
          <motion.nav
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed top-0 left-0 right-0 z-50 hidden md:flex items-center justify-between px-8 py-4 bg-gradient-bg dark:bg-gradient-bg-dark border-b-2 border-primary"
          >
            <div className="text-xl font-semibold text-primary dark:text-primary-dark">
              <Link to="/">My Portfolio</Link>
            </div>
            <div className="flex items-center gap-5">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-primary dark:text-primary-dark text-sm hover:text-primary/80 dark:hover:text-primary-dark/80 transition-colors duration-200"
                >
                  {link.label}
                </Link>
              ))}
              <ThemeToggle />
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/50 md:hidden"
              onClick={closeMobileMenu}
            />
            
            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-64 bg-bg dark:bg-bg-dark border-l border-borderMuted md:hidden"
            >
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-borderMuted">
                  <span className="text-lg font-semibold text-primary dark:text-primary-dark">
                    Menu
                  </span>
                  <button
                    onClick={closeMobileMenu}
                    className="p-1 text-muted hover:text-text dark:hover:text-text-dark"
                    aria-label="Close menu"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Links */}
                <nav className="flex-1 overflow-y-auto py-4">
                  {navLinks.map((link) => (
                    <Link
                      key={link.to}
                      to={link.to}
                      onClick={closeMobileMenu}
                      className="block px-4 py-3 text-primary dark:text-primary-dark hover:bg-bg2 dark:hover:bg-bg2-dark transition-colors"
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>

                {/* Theme Toggle */}
                <div className="p-4 border-t border-borderMuted">
                  <ThemeToggle />
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
