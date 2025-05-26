import React, { useEffect, useRef } from 'react';

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

const FlowFieldEffect = ({ className = '', style = {} }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const perlin = new Perlin();
    // Reduce particle count for a less dense effect
    const numParticles = Math.floor((window.innerWidth * window.innerHeight) / 900);
    const particles = [];
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
    let animationId;
    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
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
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return <canvas ref={canvasRef} className={className} style={style} />;
};

export default FlowFieldEffect;
