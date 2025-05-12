// src/components/Footer.jsx
import React from 'react';

const Footer = () => {
  console.log(process.env)
  return (
    <footer className="footer">
      <p>&copy; {new Date().getFullYear()} Your Name. All rights reserved.</p>
      <p>
        <a href={`https://github.com/${process.env.REACT_APP_GITHUB_USERNAME}`} target="_blank" rel="noopener noreferrer">
          GitHub
        </a>
        {' | '}
        <a href={`https://linkedin.com/in/${process.env.REACT_APP_LINKEDIN_USERNAME}`} target="_blank" rel="noopener noreferrer">
          LinkedIn
        </a>
      </p>
    </footer>
  );
};

export default Footer;
