import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from './ThemeToggle';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/projects', label: 'Projects' },
  { to: '/blog', label: 'Blog' },
  { to: '/about', label: 'About' },
];

const Navbar = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    setIsVisible(window.scrollY > 0);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.nav
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 bg-gradient-bg dark:bg-gradient-bg-dark border-b-2 border-primary"
        >
          <div className="text-xl font-semibold text-primary dark:text-primary-dark">
            <Link to="/">My Portfolio</Link>
          </div>
          <div className="flex items-center gap-5">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-primary dark:text-primary-dark font-medium hover:text-primary/80 dark:hover:text-primary-dark/80 transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
            <ThemeToggle />
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
};

export default Navbar;
