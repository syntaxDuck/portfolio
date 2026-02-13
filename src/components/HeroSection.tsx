import React, { useState } from 'react';
import { motion } from 'framer-motion';
import GameOfLifeEffect from './heroEffects/GameOfLifeEffect';
import FlowFieldEffect from './heroEffects/FlowFieldEffect';
import LissajousEffect from './heroEffects/LissajousEffect';
import BoidsEffect from './heroEffects/BoidsEffect';

type EffectKey = 'life' | 'flow' | 'lissajous' | 'boids';

interface Effect {
  key: EffectKey;
  label: string;
  component: React.FC<{ className?: string; style?: React.CSSProperties }>;
}

const effects: Effect[] = [
  { key: 'life', label: 'Game of Life', component: GameOfLifeEffect },
  { key: 'flow', label: 'Flow Field', component: FlowFieldEffect },
  { key: 'lissajous', label: 'Lissajous Curves', component: LissajousEffect },
  { key: 'boids', label: 'Boids (Flocking)', component: BoidsEffect },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5 },
  },
};

const HeroSection = () => {
  const [animation, setAnimation] = useState<EffectKey>('life');

  const currentIdx = effects.findIndex(e => e.key === animation);
  const handlePrev = () => {
    setAnimation(effects[(currentIdx - 1 + effects.length) % effects.length].key);
  };
  const handleNext = () => {
    setAnimation(effects[(currentIdx + 1) % effects.length].key);
  };
  const EffectComponent = effects[currentIdx].component;

  return (
    <section className="relative w-full min-h-[340px] flex flex-col items-center justify-center py-12 px-4 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <EffectComponent className="w-full h-full" />
      </div>
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-primary/30 via-transparent to-bg dark:to-bg-dark pointer-events-none" />
      
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="relative z-10 max-w-3xl text-center"
      >
        <motion.div variants={itemVariants} className="mb-2">
          <button
            onClick={handlePrev}
            className="mx-4 px-3 py-1 text-primary dark:text-primary-dark hover:bg-primary/10 dark:hover:bg-primary-dark/10 rounded transition-colors"
            aria-label="Previous Effect"
          >
            ←
          </button>
          <span className="text-muted dark:text-muted-dark text-sm">{effects[currentIdx].label}</span>
          <button
            onClick={handleNext}
            className="mx-4 px-3 py-1 text-primary dark:text-primary-dark hover:bg-primary/10 dark:hover:bg-primary-dark/10 rounded transition-colors"
            aria-label="Next Effect"
          >
            →
          </button>
        </motion.div>

        <motion.h1
          variants={itemVariants}
          className="text-4xl md:text-5xl font-extrabold text-text dark:text-text-dark mb-4 tracking-tight"
        >
          Hi, I'm Kameron Comer
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="text-xl md:text-2xl text-secondary dark:text-secondary-dark font-medium mb-5"
        >
          Software Engineer & Full Stack Developer
        </motion.p>

        <motion.p
          variants={itemVariants}
          className="text-base md:text-lg text-muted dark:text-muted-dark mb-8 max-w-xl mx-auto"
        >
          I build modern web applications with a focus on performance, accessibility, and beautiful user experiences. Explore my portfolio to see my latest projects, GitHub activity, and more.
        </motion.p>

        <motion.div variants={itemVariants} className="flex justify-center gap-4">
          <a
            href="#projects"
            className="px-6 py-3 bg-primary dark:bg-primary-dark text-bg dark:text-bg-dark font-semibold rounded-lg hover:bg-primary/90 dark:hover:bg-primary-dark/90 transition-colors shadow-lg"
          >
            View Projects
          </a>
          <a
            href="#contact"
            className="px-6 py-3 border-2 border-primary dark:border-primary-dark text-primary dark:text-primary-dark font-semibold rounded-lg hover:bg-primary dark:hover:bg-primary-dark hover:text-bg dark:hover:text-bg-dark transition-colors"
          >
            Contact Me
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
