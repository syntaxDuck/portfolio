import React, { useEffect, useState } from 'react';
import styles from './styles/GithubProjects.module.css';
import { fetchGithubRepos } from '../services/github';

const GITHUB_USERNAME = 'syntaxDuck';
const REPOS_PER_PAGE = 4;

const GithubProjects = ({ username = GITHUB_USERNAME }) => {
  const [allRepos, setAllRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState(null);

  useEffect(() => {
    fetchGithubRepos(username)
      .then(data => {
        setAllRepos(data.repos || []);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load repositories.');
        setLoading(false);
      });
  }, [username]);

  const handlePrev = () => {
    if (animating) return;
    setDirection('prev');
    setAnimating(true);
    setTimeout(() => {
      setCurrent((prev) => (prev - 4 + allRepos.length) % allRepos.length);
      setAnimating(false);
    }, 150);
  };
  const handleNext = () => {
    if (animating) return;
    setDirection('next');
    setAnimating(true);
    setTimeout(() => {
      setCurrent((prev) => (prev + 4) % allRepos.length);
      setAnimating(false);
    }, 150);
  };

  const getCarouselIndices = () => {
    // Show 4 cards: current, next, next+1, next+2
    const n = allRepos.length;
    if (n === 0) return [];
    return [
      current,
      (current + 1) % n,
      (current + 2) % n,
      (current + 3) % n
    ];
  };
  const carouselIndices = getCarouselIndices();

  const getPositionClass = (idx) => {
    if (idx === 0) return styles.leftCard;
    if (idx === 1) return styles.centerLeftCard;
    if (idx === 2) return styles.centerRightCard;
    if (idx === 3) return styles.rightCard;
    return '';
  };

  if (loading) return <div className={styles.loading}>Loading GitHub projects...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <>
      <section className={styles.githubSection}>
        <h2 className={styles.heading}>GitHub Projects</h2>
        <div className={`${styles.carouselWrapper} ${animating ? (direction === 'next' ? styles.animNext : styles.animPrev) : ''}`}>
          {carouselIndices.map((repoIdx, idx) => {
            const repo = allRepos[repoIdx];
            if (!repo) return null;
            return (
              <a
                key={repo.id}
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className={`${styles.projectCard} ${getPositionClass(idx)}`}
              >
                <h3>{repo.name}</h3>
                <p>{repo.description || 'No description provided.'}</p>
                <div className={styles.repoMeta}>
                  <span>★ {repo.stargazers_count}</span>
                  <span>Forks: {repo.forks_count}</span>
                </div>
              </a>
            );
          })}
        </div>
        <div className={styles.carouselNavRow}>
          <button onClick={handlePrev} className={styles.carouselButton} aria-label="Previous project">&#8592;</button>
          <button onClick={handleNext} className={styles.carouselButton} aria-label="Next project">&#8594;</button>
        </div>
      </section>
    </>
  );
};

export default GithubProjects;
