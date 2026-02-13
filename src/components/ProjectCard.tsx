import React from 'react';
import { motion } from 'framer-motion';
import { GithubRepo } from '../types';

interface ProjectCardProps {
  project: GithubRepo;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="bg-bg2 dark:bg-bg2-dark border border-borderMuted dark:border-borderMuted rounded-sm p-5 hover:border-primary dark:hover:border-primary transition-colors"
    >
      <h3 className="text-lg font-semibold mb-2">
        <a
          href={project.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary dark:text-primary-dark hover:text-primary/80 dark:hover:text-primary-dark/80 transition-colors"
        >
          {project.name}
        </a>
      </h3>
      <p className="text-muted dark:text-muted-dark text-sm mb-4">{project.description}</p>
      <div className="flex gap-4 text-sm text-primary dark:text-primary-dark">
        <span>★ {project.stargazers_count}</span>
        <span>Forks: {project.forks_count}</span>
      </div>
    </motion.div>
  );
};

export default ProjectCard;
