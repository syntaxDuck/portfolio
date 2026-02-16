import React, { useEffect, useRef } from 'react';

class Perlin {
  private perm: number[];
  private grad3: number[][];

  constructor() {
    this.grad3 = [
      [1,1,0],[-1,1,0],[1,-1,0],[-1,-1,0],
      [1,0,1],[-1,0,1],[1,0,-1],[-1,0,-1],
      [0,1,1],[0,-1,1],[0,1,-1],[0,-1,-1]
    ];
    const p: number[] = [];
    for (let i = 0; i < 256; i++) p[i] = Math.floor(Math.random() * 256);
    this.perm = [];
    for (let i = 0; i < 512; i++) this.perm[i] = p[i & 255];
  }

  private dot(g: number[], x: number, y: number): number {
    return g[0] * x + g[1] * y;
  }

  private fade(t: number): number {
    return t * t * t * (t * (t * 6 - 15) + 10);
  }

  private lerp(a: number, b: number, t: number): number {
    return (1 - t) * a + t * b;
  }

  noise(xin: number, yin: number): number {
    const X = Math.floor(xin) & 255;
    const Y = Math.floor(yin) & 255;
    const x = xin - Math.floor(xin);
    const y = yin - Math.floor(yin);
    const gi00 = this.perm[X + this.perm[Y]] % 12;
    const gi01 = this.perm[X + this.perm[Y + 1]] % 12;
    const gi10 = this.perm[X + 1 + this.perm[Y]] % 12;
    const gi11 = this.perm[X + 1 + this.perm[Y + 1]] % 12;
    const n00 = this.dot(this.grad3[gi00], x, y);
    const n10 = this.dot(this.grad3[gi10], x - 1, y);
    const n01 = this.dot(this.grad3[gi01], x, y - 1);
    const n11 = this.dot(this.grad3[gi11], x - 1, y - 1);
    const u = this.fade(x);
    const v = this.fade(y);
    return this.lerp(
      this.lerp(n00, n10, u),
      this.lerp(n01, n11, u),
      v
    );
  }
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
}

interface CanvasEffectProps {
  className?: string;
  style?: React.CSSProperties;
}

const FlowFieldEffect: React.FC<CanvasEffectProps> = ({ className = '', style = {} }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const perlin = new Perlin();
    const numParticles = Math.floor((window.innerWidth * window.innerHeight) / 900);
    const particles: Particle[] = [];
    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: 0,
        vy: 0,
        alpha: 0.38 + Math.random() * 0.22,
      });
    }
    let t = 0;
    let animationId: number;

    function resizeCanvas() {
      if (!canvas || !ctx) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    function animate() {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const angle = perlin.noise(p.x * 0.012, p.y * 0.012 + t * 0.0008) * Math.PI * 2;
        const speed = 1.1 + Math.random() * 0.2;
        p.vx = Math.cos(angle) * speed;
        p.vy = Math.sin(angle) * speed;
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width || p.y < 0 || p.y > canvas.height) {
          p.x = Math.random() * canvas.width;
          p.y = Math.random() * canvas.height;
        }
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
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return <canvas ref={canvasRef} className={className} style={style} />;
};

export default FlowFieldEffect;
