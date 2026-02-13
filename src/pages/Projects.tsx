import React, { useEffect, useState } from 'react';
import { fetchGithubRepos } from '../services/github';
import { GithubRepo } from '../types';
import ProjectCard from '../components/ProjectCard';

const Projects = () => {
  const [repos, setRepos] = useState<GithubRepo[]>([]);
  const githubUsername = 'syntaxDuck';

  useEffect(() => {
    const getRepos = async () => {
      const data = await fetchGithubRepos(githubUsername);
      setRepos(data.repos);
    };
    getRepos();
  }, []);

  return (
    <div className="max-w-6xl mx-auto py-8">
      <h2 className="text-3xl font-bold text-primary dark:text-primary-dark mb-8 border-l-4 border-primary dark:border-primary-dark pl-4">My GitHub Projects</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 divide-y divide-borderMuted dark:divide-borderMuted">
        {repos.map((repo) => (
          <ProjectCard key={repo.id} project={repo} />
        ))}
      </div>
    </div>
  );
};

export default Projects;
