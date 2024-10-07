// src/components/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Navbar.module.css';

const Navbar = () => {
  return (
    <nav className={`${styles.navbar} navbar`}>
      <div className="logo">
        <Link to="/">My Portfolio</Link>
      </div>
      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/projects">Projects</Link>
        <Link to="/blog">Blog</Link>
        <Link to="/about">About</Link>
      </div>
    </nav>
  );
};

export default Navbar;
