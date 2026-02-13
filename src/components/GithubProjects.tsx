import { useState } from 'react';
import { motion } from 'framer-motion';
import { useGithubRepos } from '../hooks';

interface GithubProjectsProps {
  username?: string;
}

const GithubProjects: React.FC<GithubProjectsProps> = ({ username }) => {
  const { repos, loading, error } = useGithubRepos({ username });
  const [current, setCurrent] = useState(0);

  const handlePrev = () => {
    setCurrent((prev) => (prev - 4 + repos.length) % repos.length);
  };

  const handleNext = () => {
    setCurrent((prev) => (prev + 4) % repos.length);
  };

  const getCarouselIndices = () => {
    const n = repos.length;
    if (n === 0) return [];
    return [
      current,
      (current + 1) % n,
      (current + 2) % n,
      (current + 3) % n
    ];
  };

  const carouselIndices = getCarouselIndices();

  const cardVariants = {
    center: { opacity: 1, zIndex: 10 },
    left: { opacity: 0.7, zIndex: 5 },
    right: { opacity: 0.7, zIndex: 5 },
    hidden: { opacity: 0, zIndex: 0 },
  };

  if (loading) return (
    <div className="text-center py-12 text-muted dark:text-muted-dark">
      Loading GitHub projects...
    </div>
  );

  if (error) return (
    <div className="text-center py-12 text-danger dark:text-danger">
      {error}
    </div>
  );

  return (
    <section className="py-12">
      <h2 className="text-3xl font-bold text-primary dark:text-primary-dark mb-8 text-left border-l-4 border-primary dark:border-primary-dark pl-4 font-mono">GitHub Projects</h2>

      <div className="relative flex items-center justify-center gap-4 min-h-[320px]">
        <button
          onClick={handlePrev}
          className="z-20 w-12 h-12 bg-gradient-primary dark:bg-gradient-primary-dark text-white dark:text-bg-dark font-mono text-lg rounded-sm hover:opacity-90 transition-opacity flex items-center justify-center"
          aria-label="Previous project"
        >
          ←
        </button>

        <div className="flex gap-6 justify-center items-stretch flex-1 max-w-5xl">
          {carouselIndices.map((repoIdx, idx) => {
            const repo = repos[repoIdx];
            if (!repo) return null;

            let position: 'center' | 'left' | 'right' = 'center';
            if (idx === 0) position = 'left';
            else if (idx === 3) position = 'right';

            return (
              <motion.a
                key={repo.id}
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                initial="center"
                animate={position}
                variants={cardVariants}
                transition={{ duration: 0.3 }}
                className="flex-1 min-w-0 max-w-sm bg-bg2 dark:bg-bg2-dark text-text dark:text-text-dark rounded-sm p-5 border border-borderMuted dark:border-borderMuted hover:border-primary dark:hover:border-primary transition-colors flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-lg font-semibold text-primary dark:text-primary-dark mb-2 font-mono">{repo.name}</h3>
                  <p className="text-muted dark:text-muted-dark text-sm mb-4 font-mono">
                    {repo.description || 'No description provided.'}
                  </p>
                </div>
                <div className="flex gap-4 text-sm text-primary dark:text-primary-dark font-mono">
                  <span>★ {repo.stargazers_count}</span>
                  <span>Forks: {repo.forks_count}</span>
                </div>
              </motion.a>
            );
          })}
        </div>

        <button
          onClick={handleNext}
          className="z-20 w-12 h-12 bg-gradient-primary dark:bg-gradient-primary-dark text-white dark:text-bg-dark font-mono text-lg rounded-sm hover:opacity-90 transition-opacity flex items-center justify-center"
          aria-label="Next project"
        >
          →
        </button>
      </div>
    </section>
  );
};

export default GithubProjects;
