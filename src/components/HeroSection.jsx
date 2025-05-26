import React, { useState } from 'react';
import styles from './styles/HeroSection.module.css';
import GameOfLifeEffect from './heroEffects/GameOfLifeEffect';
import FlowFieldEffect from './heroEffects/FlowFieldEffect';
import LissajousEffect from './heroEffects/LissajousEffect';
import BoidsEffect from './heroEffects/BoidsEffect';

const HeroSection = () => {
  const [animation, setAnimation] = useState('life'); // 'life', 'flow', 'lissajous', or 'boids'

  // List of available effects
  const effects = [
    { key: 'life', label: 'Game of Life', component: GameOfLifeEffect },
    { key: 'flow', label: 'Flow Field', component: FlowFieldEffect },
    { key: 'lissajous', label: 'Lissajous Curves', component: LissajousEffect },
    { key: 'boids', label: 'Boids (Flocking)', component: BoidsEffect },
  ];
  const currentIdx = effects.findIndex(e => e.key === animation);
  const handlePrev = () => {
    setAnimation(effects[(currentIdx - 1 + effects.length) % effects.length].key);
  };
  const handleNext = () => {
    setAnimation(effects[(currentIdx + 1) % effects.length].key);
  };
  const EffectComponent = effects[currentIdx].component;

  return (
    <section className={styles.heroSection}>
      <div className={styles.heroGameOfLifeBg}>
        <EffectComponent className={styles.gameOfLifeCanvas} />
      </div>
      <div className={styles.heroGradientBg} />
      <div className={styles.heroEffectSelector}>
        <button
          className={styles.heroButtonOutline}
          onClick={handlePrev}
          aria-label="Previous Effect"
        >
          &#8592;
        </button>
        <span>{effects[currentIdx].label}</span>
        <button
          className={styles.heroButtonOutline}
          onClick={handleNext}
          aria-label="Next Effect"
        >
          &#8594;
        </button>
      </div>
      <div className={styles.heroContent}>
        <h1 className={styles.heroTitle}>Hi, I'm Kameron Comer</h1>
        <p className={styles.heroSubtitle}>
          Software Engineer &amp; Full Stack Developer
        </p>
        <p className={styles.heroDescription}>
          I build modern web applications with a focus on performance, accessibility, and beautiful user experiences. Explore my portfolio to see my latest projects, GitHub activity, and more.
        </p>
        <div className={styles.heroActions}>
          <a href="#projects" className={styles.heroButton}>View Projects</a>
          <a href="#contact" className={styles.heroButtonOutline}>Contact Me</a>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
