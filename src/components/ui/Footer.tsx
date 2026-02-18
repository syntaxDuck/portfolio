import React from 'react';
import { motion } from 'framer-motion';
import { PortfolioConfig } from '../../config/portfolio';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="px-8 py-4 bg-gradient-bg dark:bg-gradient-bg-dark text-text dark:text-text-dark border-t border-borderMuted dark:border-borderMuted"
    >
      <div className="flex flex-col md:flex-row items-center justify-between gap-2">
        <p className="text-muted dark:text-muted-dark text-sm">
          &copy; {currentYear} {PortfolioConfig.name}. All rights reserved.
        </p>
        <div className="flex gap-2 text-muted dark:text-muted-dark text-sm">
          <a
            href={`https://github.com/${import.meta.env.VITE_GITHUB_USERNAME}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary dark:text-primary-dark hover:text-primary/80 dark:hover:text-primary-dark/80 transition-colors duration-200"
          >
            GitHub
          </a>
          <span className="text-muted dark:text-muted-dark">|</span>
          <a
            href={`https://linkedin.com/in/${import.meta.env.VITE_LINKEDIN_USERNAME}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary dark:text-primary-dark hover:text-primary/80 dark:hover:text-primary-dark/80 transition-colors duration-200"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
