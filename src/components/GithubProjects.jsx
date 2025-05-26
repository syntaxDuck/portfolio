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

  // Conway's Game of Life effect for hero background
  useEffect(() => {
    const canvas = document.getElementById('gameOfLifeCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;
    let cellSize, cols, rows, grid;

    function setupGrid() {
      cellSize = 12;
      cols = Math.floor(window.innerWidth / cellSize);
      rows = Math.floor(window.innerHeight / cellSize);
      grid = Array.from({ length: rows }, () =>
        Array.from({ length: cols }, () => (Math.random() > 0.82 ? 1 : 0))
      );
    }

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      setupGrid();
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    function drawGrid() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          if (grid[y][x]) {
            ctx.fillStyle = 'rgba(78,161,255,0.7)';
            ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
          }
        }
      }
    }

    function nextGen() {
      const newGrid = grid.map(arr => [...arr]);
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          let neighbors = 0;
          for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
              if (dx === 0 && dy === 0) continue;
              const ny = y + dy;
              const nx = x + dx;
              if (ny >= 0 && ny < rows && nx >= 0 && nx < cols) {
                neighbors += grid[ny][nx];
              }
            }
          }
          if (grid[y][x]) {
            newGrid[y][x] = neighbors === 2 || neighbors === 3 ? 1 : 0;
          } else {
            newGrid[y][x] = neighbors === 3 ? 1 : 0;
          }
        }
      }
      grid = newGrid;
    }

    function animate() {
      nextGen();
      drawGrid();
      animationId = setTimeout(() => requestAnimationFrame(animate), 120); // Slow down: 120ms per gen
    }
    drawGrid(); // Draw initial state
    animationId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      clearTimeout(animationId);
    };
  }, []);

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
