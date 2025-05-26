// src/components/Navbar.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './styles/Navbar.module.css';

const Navbar = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShow(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    setShow(window.scrollY > 0);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={styles.navbar} style={{
      opacity: show ? 1 : 0,
      pointerEvents: show ? 'auto' : 'none',
      transform: show ? 'translateY(0)' : 'translateY(-100%)',
    }}>
      <div className={styles.logo}>
        <Link to="/">My Portfolio</Link>
      </div>
      <div className={styles.navLinks}>
        <Link to="/">Home</Link>
        <Link to="/projects">Projects</Link>
        <Link to="/blog">Blog</Link>
        <Link to="/about">About</Link>
      </div>
    </nav>
  );
};

export default Navbar;
