import React, { useState } from 'react';
import styles from './styles/HeroSection.module.css';
import GameOfLifeEffect from './heroEffects/GameOfLifeEffect';
import FlowFieldEffect from './heroEffects/FlowFieldEffect';
import LissajousEffect from './heroEffects/LissajousEffect';

const HeroSection = () => {
  const [currentEffect, setCurrentEffect] = useState('life'); // 'life', 'flow', or 'lissajous'

  // List of available effects
  const effects = [
    { key: 'life', label: 'Game of Life', component: GameOfLifeEffect },
    { key: 'flow', label: 'Flow Field', component: FlowFieldEffect },
    { key: 'lissajous', label: 'Lissajous Curves', component: LissajousEffect },
  ];
  const currentIdx = effects.findIndex(e => e.key === currentEffect);
  const handlePrev = () => {
    setCurrentEffect(effects[(currentIdx - 1 + effects.length) % effects.length].key);
  };
  const handleNext = () => {
    setCurrentEffect(effects[(currentIdx + 1) % effects.length].key);
  };
  const EffectComponent = effects[currentIdx].component;

  return (
    <section className={styles.heroSection}>
      <div className={styles.heroEffectBg}>
        <EffectComponent className={styles.heroEffectCanvas} />
      </div>

      <div className={styles.heroEffectSelector}>
        <button
          className='material-symbols-outlined'
          onClick={handlePrev}
          aria-label="Previous Effect"
        >
          arrow_back
        </button>
        <span>{effects[currentIdx].label}</span>
        <button
          className='material-symbols-outlined'
          onClick={handleNext}
          aria-label="Next Effect"
        >
          arrow_forward
        </button>
      </div>

      <div className={styles.heroContent}>
        <h1 className={styles.heroTitle}>Kameron Comer</h1>
        <p className={styles.heroSubtitle}>
          Software Engineer &amp; Full Stack Developer
        </p>
      </div>

      <div className={styles.learnMore}>
        <span>Learn More</span>
        <span className={`material-symbols-outlined ${styles.learnMoreIcon}`}>
          arrow_drop_down
        </span>
      </div>
    </section>
  );
};

export default HeroSection;
