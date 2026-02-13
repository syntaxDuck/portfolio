import React from 'react';
import { motion } from 'framer-motion';

const skills = [
  'JavaScript',
  'React',
  'Node.js',
  'CSS',
  'HTML',
  'Git',
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 10, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

const Skills = () => {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={containerVariants}
      className="bg-bg2 dark:bg-bg2-dark border border-borderMuted dark:border-borderMuted rounded-xl p-6 shadow-lg"
    >
      <h3 className="text-2xl font-bold text-primary dark:text-primary-dark mb-6">My Skills</h3>
      <ul className="flex flex-wrap gap-3">
        {skills.map((skill) => (
          <motion.li
            key={skill}
            variants={itemVariants}
            className="px-4 py-2 bg-bg dark:bg-bg-dark border border-borderMuted dark:border-borderMuted rounded-lg text-text dark:text-text-dark text-sm font-medium hover:border-primary dark:hover:border-primary transition-colors cursor-default"
          >
            {skill}
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
};

export default Skills;
