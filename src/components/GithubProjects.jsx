import React, { useEffect, useState } from 'react';
import styles from './GithubProjects.module.css';
import { fetchGithubRepos } from '../services/github';

const GITHUB_USERNAME = 'syntaxDuck';
const REPOS_PER_PAGE = 4;

const GithubProjects = ({ username = GITHUB_USERNAME }) => {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    setLoading(true);
    fetchGithubRepos(username, REPOS_PER_PAGE, page)
      .then(data => {
        setRepos(data.repos);
        setTotalCount(data.totalCount);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load repositories.');
        setLoading(false);
      });
  }, [username, page]);

  const totalPages = Math.ceil(totalCount / REPOS_PER_PAGE);

  if (loading) return <div className={styles.loading}>Loading GitHub projects...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <section className={styles.githubSection}>
      <h2 className={styles.heading}>GitHub Projects</h2>
      <div className={styles.projectsGrid}>
        {repos.map(repo => (
          <a
            key={repo.id}
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.projectCard}
          >
            <h3>{repo.name}</h3>
            <p>{repo.description || 'No description provided.'}</p>
            <div className={styles.repoMeta}>
              <span>★ {repo.stargazers_count}</span>
              <span>Forks: {repo.forks_count}</span>
            </div>
          </a>
        ))}
      </div>
      <div className={styles.pagination}>
        <button
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
          className={styles.pageButton}
        >
          Previous
        </button>
        <span className={styles.pageInfo}>
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => setPage(page + 1)}
          disabled={page === totalPages}
          className={styles.pageButton}
        >
          Next
        </button>
      </div>
    </section>
  );
};

export default GithubProjects;
