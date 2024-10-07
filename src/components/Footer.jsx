// src/components/Footer.jsx
import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <p>&copy; {new Date().getFullYear()} Your Name. All rights reserved.</p>
      <p>
        <a href="https://github.com/your-github-username" target="_blank" rel="noopener noreferrer">
          GitHub
        </a>
        {' | '}
        <a href="https://linkedin.com/in/your-linkedin" target="_blank" rel="noopener noreferrer">
          LinkedIn
        </a>
      </p>
    </footer>
  );
};

export default Footer;
