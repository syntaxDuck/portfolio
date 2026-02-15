import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const ASCII_CHARS = ' .:-=+*#%@';
const MATRIX_CHARS = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789';

interface AsciiArtProps {
  mouseX: number;
  mouseY: number;
}

const AsciiArtPage: React.FC = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [activeEffect, setActiveEffect] = useState<'mouse' | 'matrix' | 'wave' | 'radar'>('mouse');
  const [asciiOutput, setAsciiOutput] = useState<string[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const WIDTH = 80;
  const HEIGHT = 30;

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    let animationFrame: number;
    let time = 0;

    const generateAscii = () => {
      const lines: string[] = [];
      
      switch (activeEffect) {
        case 'mouse': {
          for (let y = 0; y < HEIGHT; y++) {
            let line = '';
            for (let x = 0; x < WIDTH; x++) {
              const dx = x - (mousePos.x / window.innerWidth) * WIDTH;
              const dy = y - (mousePos.y / window.innerHeight) * HEIGHT;
              const dist = Math.sqrt(dx * dx + dy * dy);
              const charIndex = Math.min(Math.floor((dist / 20) * ASCII_CHARS.length), ASCII_CHARS.length - 1);
              line += ASCII_CHARS[charIndex] || ' ';
            }
            lines.push(line);
          }
          break;
        }
        case 'matrix': {
          for (let y = 0; y < HEIGHT; y++) {
            let line = '';
            for (let x = 0; x < WIDTH; x++) {
              const charIndex = Math.floor((Math.sin(x * 0.3 + time * 0.1) * 0.5 + 0.5) * MATRIX_CHARS.length);
              line += MATRIX_CHARS[charIndex] || ' ';
            }
            lines.push(line);
          }
          break;
        }
        case 'wave': {
          for (let y = 0; y < HEIGHT; y++) {
            let line = '';
            for (let x = 0; x < WIDTH; x++) {
              const wave = Math.sin(x * 0.2 + time * 2) * Math.cos(y * 0.2 + time);
              const charIndex = Math.floor((wave + 1) * 0.5 * ASCII_CHARS.length);
              line += ASCII_CHARS[Math.max(0, Math.min(charIndex, ASCII_CHARS.length - 1))];
            }
            lines.push(line);
          }
          break;
        }
        case 'radar': {
          const centerX = WIDTH / 2;
          const centerY = HEIGHT / 2;
          for (let y = 0; y < HEIGHT; y++) {
            let line = '';
            for (let x = 0; x < WIDTH; x++) {
              const dx = x - centerX;
              const dy = y - centerY;
              const dist = Math.sqrt(dx * dx + dy * dy);
              const angle = Math.atan2(dy, dx) + time;
              const radar = Math.sin(dist * 0.3 - time * 3) * Math.cos(angle * 3);
              const charIndex = Math.floor((radar + 1) * 0.5 * ASCII_CHARS.length);
              line += ASCII_CHARS[Math.max(0, Math.min(charIndex, ASCII_CHARS.length - 1))];
            }
            lines.push(line);
          }
          break;
        }
      }
      
      setAsciiOutput(lines);
      time += 0.016;
      animationFrame = requestAnimationFrame(generateAscii);
    };

    generateAscii();
    return () => cancelAnimationFrame(animationFrame);
  }, [activeEffect, mousePos]);

  const effects = [
    { key: 'mouse', label: 'Mouse Tracker' },
    { key: 'matrix', label: 'Digital Rain' },
    { key: 'wave', label: 'Sine Wave' },
    { key: 'radar', label: 'Radar' },
  ] as const;

  return (
    <div className="max-w-4xl mx-auto py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary dark:text-primary-dark mb-2">ASCII Art Visualizations</h1>
        <p className="text-muted dark:text-muted-dark">
          Interactive text-based animations
        </p>
      </div>

      <div className="flex gap-2 mb-4">
        {effects.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveEffect(key)}
            className={`px-4 py-2 text-sm border transition-colors ${
              activeEffect === key
                ? 'bg-primary dark:bg-primary-dark text-bg dark:text-bg-dark border-primary dark:border-primary-dark'
                : 'border-borderMuted text-muted dark:text-muted-dark hover:border-primary dark:hover:border-primary-dark'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="bg-bg2 dark:bg-bg2-dark border border-borderMuted p-4 overflow-hidden">
        <pre className="font-mono text-xs leading-tight text-primary dark:text-primary-dark whitespace-pre">
          {asciiOutput.join('\n')}
        </pre>
      </div>

      <div className="mt-4 p-4 bg-bg2 dark:bg-bg2-dark border border-borderMuted">
        <div className="text-sm text-muted dark:text-muted-dark">
          Move your mouse for the Mouse Tracker effect
        </div>
      </div>
    </div>
  );
};

export default AsciiArtPage;
