import React, { useEffect, useRef, useState } from 'react';
import styles from './styles/HeroSection.module.css';

const HeroSection = () => {
  const canvasRef = useRef(null);
  const [animation, setAnimation] = useState('life'); // 'life', 'flow', or 'lissajous'

  // Conway's Game of Life effect for hero background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;
    let cleanup = () => {};

    // --- Perlin Noise Implementation (simple, 2D) ---
    function Perlin() {
      const grad3 = [
        [1,1,0],[-1,1,0],[1,-1,0],[-1,-1,0],
        [1,0,1],[-1,0,1],[1,0,-1],[-1,0,-1],
        [0,1,1],[0,-1,1],[0,1,-1],[0,-1,-1]
      ];
      const p = [];
      for (let i=0; i<256; i++) p[i] = Math.floor(Math.random()*256);
      const perm = [];
      for(let i=0; i<512; i++) perm[i]=p[i & 255];
      function dot(g, x, y) { return g[0]*x + g[1]*y; }
      function fade(t) { return t*t*t*(t*(t*6-15)+10); }
      function lerp(a, b, t) { return (1-t)*a + t*b; }
      this.noise = function(xin, yin) {
        let X = Math.floor(xin) & 255;
        let Y = Math.floor(yin) & 255;
        let x = xin - Math.floor(xin);
        let y = yin - Math.floor(yin);
        let gi00 = perm[X+perm[Y]] % 12;
        let gi01 = perm[X+perm[Y+1]] % 12;
        let gi10 = perm[X+1+perm[Y]] % 12;
        let gi11 = perm[X+1+perm[Y+1]] % 12;
        let n00 = dot(grad3[gi00], x, y);
        let n10 = dot(grad3[gi10], x-1, y);
        let n01 = dot(grad3[gi01], x, y-1);
        let n11 = dot(grad3[gi11], x-1, y-1);
        let u = fade(x);
        let v = fade(y);
        return lerp(
          lerp(n00, n10, u),
          lerp(n01, n11, u),
          v
        );
      }
    }

    if (animation === 'life') {
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
        animationId = setTimeout(() => requestAnimationFrame(animate), 120);
      }
      drawGrid();
      animationId = requestAnimationFrame(animate);

      cleanup = () => {
        window.removeEventListener('resize', resizeCanvas);
        clearTimeout(animationId);
      };
    } else if (animation === 'flow') {
      // Perlin noise flow field with even more visible, denser particles
      function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
      resizeCanvas();
      window.addEventListener('resize', resizeCanvas);
      const perlin = new Perlin();
      // Reduce particle count for a less dense effect
      const numParticles = Math.floor((window.innerWidth * window.innerHeight) / 900); // Fewer particles
      const particles = [];
      for (let i = 0; i < numParticles; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: 0,
          vy: 0,
          alpha: 0.38 + Math.random() * 0.22,
        });
      }
      let t = 0;
      function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particles.length; i++) {
          let p = particles[i];
          // Get angle from Perlin noise
          const angle = perlin.noise(p.x * 0.012, p.y * 0.012 + t * 0.0008) * Math.PI * 2;
          const speed = 1.1 + Math.random() * 0.2;
          p.vx = Math.cos(angle) * speed;
          p.vy = Math.sin(angle) * speed;
          p.x += p.vx;
          p.y += p.vy;
          // Respawn at random position if out of bounds
          if (p.x < 0 || p.x > canvas.width || p.y < 0 || p.y > canvas.height) {
            p.x = Math.random() * canvas.width;
            p.y = Math.random() * canvas.height;
          }
          // Draw particle (larger and brighter)
          ctx.save();
          ctx.beginPath();
          ctx.arc(p.x, p.y, 2.8, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(78,161,255,${p.alpha})`;
          ctx.shadowColor = '#4ea1ff';
          ctx.shadowBlur = 12;
          ctx.fill();
          ctx.restore();
        }
        t++;
        animationId = requestAnimationFrame(animate);
      }
      animate();
      cleanup = () => {
        window.removeEventListener('resize', resizeCanvas);
        cancelAnimationFrame(animationId);
      };
    } else if (animation === 'lissajous') {
      // Lissajous Curves / Parametric Motion effect
      function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
      resizeCanvas();
      window.addEventListener('resize', resizeCanvas);
      const numCurves = 12;
      const numPoints = 180;
      let t = 0;
      function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // Use nearly the full canvas for amplitude
        const marginX = canvas.width * 0.04;
        const marginY = canvas.height * 0.04;
        const ampX = (canvas.width / 2) - marginX;
        const ampY = (canvas.height / 2) - marginY;
        for (let c = 0; c < numCurves; c++) {
          const a = 2 + c % 4;
          const b = 3 + (c * 2) % 5;
          const delta = (Math.PI / 6) * c;
          ctx.save();
          ctx.beginPath();
          for (let i = 0; i <= numPoints; i++) {
            const phi = (i / numPoints) * Math.PI * 2;
            const x = canvas.width / 2 + ampX * Math.sin(a * phi + delta + t * 0.012 + c * 0.1);
            const y = canvas.height / 2 + ampY * Math.sin(b * phi + t * 0.014 - delta - c * 0.13);
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.strokeStyle = `rgba(78,161,255,${0.18 + 0.06 * Math.sin(t * 0.02 + c)})`;
          ctx.lineWidth = 2.2 + 1.2 * Math.sin(t * 0.01 + c);
          ctx.shadowColor = '#4ea1ff';
          ctx.shadowBlur = 10;
          ctx.stroke();
          ctx.restore();
        }
        t++;
        animationId = requestAnimationFrame(animate);
      }
      animate();
      cleanup = () => {
        window.removeEventListener('resize', resizeCanvas);
        cancelAnimationFrame(animationId);
      };
    }
    return cleanup;
  }, [animation]);

  // List of available effects
  const effects = [
    { key: 'life', label: 'Game of Life' },
    { key: 'flow', label: 'Flow Field' },
    { key: 'lissajous', label: 'Lissajous Curves' },
  ];
  const currentIdx = effects.findIndex(e => e.key === animation);
  const handlePrev = () => {
    setAnimation(effects[(currentIdx - 1 + effects.length) % effects.length].key);
  };
  const handleNext = () => {
    setAnimation(effects[(currentIdx + 1) % effects.length].key);
  };

  return (
    <section className={styles.heroSection}>
      <div className={styles.heroGameOfLifeBg}>
        <canvas ref={canvasRef} className={styles.gameOfLifeCanvas} />
      </div>
      <div className={styles.heroGradientBg} />
      <div className={styles.heroEffectSelector}>
        <button
          className={styles.heroButtonOutline}
          onClick={handlePrev}
          aria-label="Previous Effect"
        >
          &#8592;
        </button>
        <span>{effects[currentIdx].label}</span>
        <button
          className={styles.heroButtonOutline}
          onClick={handleNext}
          aria-label="Next Effect"
        >
          &#8594;
        </button>
      </div>
      <div className={styles.heroContent}>
        <h1 className={styles.heroTitle}>Hi, I'm Kameron Comer</h1>
        <p className={styles.heroSubtitle}>
          Software Engineer &amp; Full Stack Developer
        </p>
        <p className={styles.heroDescription}>
          I build modern web applications with a focus on performance, accessibility, and beautiful user experiences. Explore my portfolio to see my latest projects, GitHub activity, and more.
        </p>
        <div className={styles.heroActions}>
          <a href="#projects" className={styles.heroButton}>View Projects</a>
          <a href="#contact" className={styles.heroButtonOutline}>Contact Me</a>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
