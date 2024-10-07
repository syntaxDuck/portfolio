// src/pages/Projects.jsx
import React, { useEffect, useState } from 'react';
import { fetchGitHubRepos } from '../services/github';
import ProjectCard from '../components/ProjectCard';

const Projects = () => {
  const [repos, setRepos] = useState([]);
  const githubUsername = 'syntaxDuck';

  useEffect(() => {
    const getRepos = async () => {
      const data = await fetchGitHubRepos(githubUsername);
      setRepos(data);
    };
    getRepos();
  }, []);

  return (
    <div className="projects-page">
      <h2>My GitHub Projects</h2>
      <div className="projects-grid">
        {repos.map((repo) => (
          <ProjectCard key={repo.id} project={repo} />
        ))}
      </div>
    </div>
  );
};

export default Projects;
