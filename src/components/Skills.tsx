import React from 'react';
import { motion } from 'framer-motion';

interface SkillCategory {
  name: string;
  skills: string[];
}

const skillCategories: SkillCategory[] = [
  {
    name: 'Frontend',
    skills: ['React', 'TypeScript', 'JavaScript', 'HTML', 'CSS', 'Tailwind'],
  },
  {
    name: 'Backend',
    skills: ['Node.js', 'Express', 'PostgreSQL', 'REST APIs', 'GraphQL'],
  },
  {
    name: 'Tools & DevOps',
    skills: ['Git', 'Docker', 'AWS', 'Linux', 'Vite', 'CI/CD'],
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
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
      className="bg-bg2 dark:bg-bg2-dark border border-borderMuted dark:border-borderMuted p-6"
    >
      <h3 className="text-2xl font-bold text-primary dark:text-primary-dark mb-6 border-l-4 border-primary dark:border-primary-dark pl-4">Skills</h3>
      
      <div className="grid md:grid-cols-3 gap-6">
        {skillCategories.map((category) => (
          <div key={category.name}>
            <h4 className="text-sm font-semibold text-muted dark:text-muted-dark uppercase tracking-wider mb-3 border-b border-borderMuted dark:border-borderMuted pb-2">
              {category.name}
            </h4>
            <ul className="flex flex-wrap gap-2">
              {category.skills.map((skill) => (
                <motion.li
                  key={skill}
                  variants={itemVariants}
                  className="px-3 py-1.5 bg-bg dark:bg-bg-dark border border-borderMuted dark:border-borderMuted text-text dark:text-text-dark text-sm font-mono hover:border-primary dark:hover:border-primary-dark transition-colors cursor-default"
                >
                  {skill}
                </motion.li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default Skills;
