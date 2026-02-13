import React, { useEffect, useRef } from 'react';

interface Boid {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

interface CanvasEffectProps {
  className?: string;
  style?: React.CSSProperties;
}

const BoidsEffect: React.FC<CanvasEffectProps> = ({ className = '', style = {} }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let animationId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    function resizeCanvas() {
      if (!canvas) return;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    }
    window.addEventListener('resize', resizeCanvas);

    const NUM_BOIDS = Math.floor((width * height) / 9600);
    const boids: Boid[] = [];
    for (let i = 0; i < NUM_BOIDS; i++) {
      boids.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: Math.cos(Math.random() * 2 * Math.PI),
        vy: Math.sin(Math.random() * 2 * Math.PI),
      });
    }
    const maxSpeed = 2.2;
    const maxForce = 0.045;
    const perception = 64;
    const separationDist = 24;

    function limit(vx: number, vy: number, max: number): [number, number] {
      const mag = Math.sqrt(vx * vx + vy * vy);
      if (mag > max) {
        return [vx / mag * max, vy / mag * max];
      }
      return [vx, vy];
    }

    function animate() {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < boids.length; i++) {
        const b = boids[i];
        let alignX = 0, alignY = 0, alignCount = 0;
        let cohX = 0, cohY = 0, cohCount = 0;
        let sepX = 0, sepY = 0, sepCount = 0;
        for (let j = 0; j < boids.length; j++) {
          if (i === j) continue;
          const other = boids[j];
          const dx = other.x - b.x;
          const dy = other.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < perception) {
            alignX += other.vx;
            alignY += other.vy;
            alignCount++;
            cohX += other.x;
            cohY += other.y;
            cohCount++;
          }
          if (dist < separationDist && dist > 0) {
            sepX -= (other.x - b.x) / dist;
            sepY -= (other.y - b.y) / dist;
            sepCount++;
          }
        }
        if (alignCount > 0) {
          alignX /= alignCount;
          alignY /= alignCount;
          [alignX, alignY] = limit(alignX, alignY, maxSpeed);
          alignX -= b.vx;
          alignY -= b.vy;
          [alignX, alignY] = limit(alignX, alignY, maxForce);
        }
        if (cohCount > 0) {
          cohX /= cohCount;
          cohY /= cohCount;
          cohX -= b.x;
          cohY -= b.y;
          [cohX, cohY] = limit(cohX, cohY, maxSpeed);
          cohX -= b.vx;
          cohY -= b.vy;
          [cohX, cohY] = limit(cohX, cohY, maxForce);
        }
        if (sepCount > 0) {
          sepX /= sepCount;
          sepY /= sepCount;
          [sepX, sepY] = limit(sepX, sepY, maxSpeed);
          sepX -= b.vx;
          sepY -= b.vy;
          [sepX, sepY] = limit(sepX, sepY, maxForce * 1.5);
        }
        b.vx += alignX * 1.1 + cohX * 0.7 + sepX * 1.7;
        b.vy += alignY * 1.1 + cohY * 0.7 + sepY * 1.7;
        [b.vx, b.vy] = limit(b.vx, b.vy, maxSpeed);
        b.x += b.vx;
        b.y += b.vy;
        if (b.x < 0) b.x += width;
        if (b.x > width) b.x -= width;
        if (b.y < 0) b.y += height;
        if (b.y > height) b.y -= height;
        ctx.save();
        ctx.translate(b.x, b.y);
        ctx.rotate(Math.atan2(b.vy, b.vx));
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(-10, 3.5);
        ctx.lineTo(-7, 0);
        ctx.lineTo(-10, -3.5);
        ctx.closePath();
        ctx.fillStyle = 'rgba(78,161,255,0.82)';
        ctx.shadowColor = '#4ea1ff';
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.restore();
      }
      animationId = requestAnimationFrame(animate);
    }
    animate();
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return <canvas ref={canvasRef} className={className} style={style} />;
};

export default BoidsEffect;
