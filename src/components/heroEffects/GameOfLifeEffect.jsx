import React, { useEffect, useRef } from 'react';

const GameOfLifeEffect = ({ className = '', style = {} }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
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
      animationId = setTimeout(() => requestAnimationFrame(animate), 120);
    }
    drawGrid();
    animationId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      clearTimeout(animationId);
    };
  }, []);

  return <canvas ref={canvasRef} className={className} style={style} />;
};

export default GameOfLifeEffect;
