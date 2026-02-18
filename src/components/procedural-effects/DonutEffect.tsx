import React, { useEffect, useRef } from 'react';
interface CanvasEffectProps {
  className?: string;
  style?: React.CSSProperties;
}

export interface DonutConfig {
  // Rotation speeds
  speedA?: number;
  speedB?: number;

  // Appearance
  brightness?: number;
  color?: { r: number; g: number; b: number };

  // Rendering grid
  gridWidth?: number;
  gridHeight?: number;
  charSpacingX?: number;
  charSpacingY?: number;

  // Character set for depth rendering
  chars?: string;

  // Rendering precision
  thetaStep?: number;  // loop step (around tube)
  phiStep?: number;    // loop step (around torus)

  // Font
  fontSizeMin?: number;
  fontSizeMax?: number;

  // Position offset from center
  offsetX?: number;
  offsetY?: number;

  // Render scale
  scaleX?: number;
  scaleY?: number;

  // Render mode
  renderMode?: 'ascii' | 'pixel';
  pixelSize?: number;
}

// Default configuration constants
const DEFAULTS = {
  speedA: 0,
  speedB: 0,
  brightness: 1.0,
  color: { r: 139, g: 196, b: 255 },
  gridWidth: 80,
  gridHeight: 24,
  charSpacingX: 5,
  charSpacingY: 9,
  chars: '.,-~:;=!*#$@',
  thetaStep: 0.07,
  phiStep: 0.03,
  fontSizeMin: 10,
  fontSizeMax: 14,
  offsetX: 40,
  offsetY: 12,
  scaleX: 40,
  scaleY: 20,
  renderMode: 'ascii' as const,
  pixelSize: 1,
};

const DonutEffect: React.FC<CanvasEffectProps & DonutConfig> = ({
  className = '',
  style = {},
  speedA = DEFAULTS.speedA,
  speedB = DEFAULTS.speedB,
  color = DEFAULTS.color,
  chars = DEFAULTS.chars,
  thetaStep = DEFAULTS.thetaStep,
  phiStep = DEFAULTS.phiStep,
  fontSizeMin = DEFAULTS.fontSizeMin,
  fontSizeMax = DEFAULTS.fontSizeMax,
  renderMode = DEFAULTS.renderMode,
  pixelSize = DEFAULTS.pixelSize,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    const textAspectRatio = 0.8;
    let A = 0;
    let B = 0;

    function resizeCanvas() {
      if (!canvas || !ctx) return;
      const container = canvas.parentElement;
      if (container) {
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
      } else {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    function render() {
      if (!canvas || !ctx) return;

      ctx.fillStyle = 'rgba(0, 0, 0, 1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${1})`;


      const fontSize = Math.max(fontSizeMin, Math.min(fontSizeMax, canvas.width / 80));
      ctx.font = `${fontSize}px monospace`;

      const charSpacingX = fontSize * 0.8;
      const charSpacingY = charSpacingX / textAspectRatio;

      const cols = Math.floor(canvas.width / charSpacingX);
      const rows = Math.floor(canvas.height / charSpacingY);
      const centerX = Math.floor(cols / 2);
      const centerY = Math.floor(rows / 2);
      const offsetX = (canvas.width - cols * charSpacingX) / 2;
      const offsetY = (canvas.height - rows * charSpacingY) / 2;

      const pi = Math.PI;
      const r1 = 1
      const r2 = 2
      const k2 = 5

      const k1 = centerX * k2 * 3 / (8 * (r1 + r2));

      const cosA = Math.cos(A), sinA = Math.sin(A);
      const cosB = Math.cos(B), sinB = Math.sin(B);


      const output = Array.from({ length: rows }, () => Array(cols).fill(" "));
      const luminance = Array.from({ length: rows }, () => Array(cols).fill(0));
      const zBuff = Array.from({ length: rows }, () => Array(cols).fill(0));


      for (let theta = 0; theta < 2 * pi; theta += thetaStep) {
        const cosTheta = Math.cos(theta), sinTheta = Math.sin(theta);
        for (let phi = 0; phi < 2 * pi; phi += phiStep) {
          const cosPhi = Math.cos(phi), sinPhi = Math.sin(phi);

          const circleX = r2 + r1 * cosTheta;
          const circleY = r1 * sinTheta;

          const x = circleX * (cosB * cosPhi + sinA * sinB * sinPhi) - circleY * cosA * cosB;
          const y = circleX * (sinB * cosPhi - sinA * cosB * sinPhi) + circleY * cosA * cosB;
          const z = k2 + cosA * circleX * sinPhi + circleY * sinA;
          const z_inv = 1 / z;

          const xp = Math.trunc(centerX + k1 * z_inv * x);
          const yp = Math.trunc(centerY - k1 * z_inv * y * textAspectRatio);

          const l = cosPhi * cosTheta * sinB - cosA * cosTheta * sinPhi -
            sinA * sinTheta + cosB * (cosA * sinTheta - cosTheta * sinA * sinPhi);

          if (l > 0) {
            if (yp >= 0 && yp < rows && xp >= 0 && xp < cols && z_inv > zBuff[yp][xp]) {
              zBuff[yp][xp] = z_inv;
              luminance[yp][xp] = l;
              const luminance_index = Math.min(10, Math.max(0, Math.trunc(l * 8)));
              output[yp][xp] = chars[luminance_index];
            }
          }
        }
      }

      if (renderMode === 'pixel') {
        for (let y = 0; y < rows; y++) {
          for (let x = 0; x < cols; x++) {
            const l = luminance[y][x];
            if (l > 0) {
              const r = Math.floor(color.r * l);
              const g = Math.floor(color.g * l);
              const b = Math.floor(color.b * l);
              ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
              ctx.fillRect(
                x * charSpacingX + offsetX,
                y * charSpacingY + offsetY,
                pixelSize,
                pixelSize
              );
            }
          }
        }
      } else {
        ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${1})`;
        for (let y = 0; y < rows; y++) {
          for (let x = 0; x < cols; x++) {
            const char = output[y][x];
            if (char !== ' ') {
              ctx.fillText(
                char,
                x * charSpacingX + offsetX,
                y * charSpacingY + offsetY
              );
            }
          }
        }
      }

      A += speedA;
      B += speedB;

      animationId = requestAnimationFrame(render);
    }

    render();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, [speedA, speedB, color, chars, thetaStep, phiStep, fontSizeMin, fontSizeMax, renderMode, pixelSize]);

  return <canvas ref={canvasRef} className={className} style={style} />;
};

export default DonutEffect;
