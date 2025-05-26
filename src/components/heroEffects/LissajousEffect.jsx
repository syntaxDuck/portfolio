import React, { useEffect, useRef } from 'react';

const LissajousEffect = ({ className = '', style = {} }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const numCurves = 12;
    const numPoints = 180;
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
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return <canvas ref={canvasRef} className={className} style={style} />;
};

export default LissajousEffect;
