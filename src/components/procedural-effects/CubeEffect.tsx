import React, { useEffect, useRef } from 'react';

interface CanvasEffectProps {
  className?: string;
  style?: React.CSSProperties;
}

export interface CubeConfig {
  speedX?: number;
  speedY?: number;
  speedZ?: number;
  k1?: number;
  k2?: number;
  z?: number;
  centerX?: number;
  centerY?: number;
  color?: { r: number; g: number; b: number };
  chars?: string;
  fontSizeMin?: number;
  fontSizeMax?: number;
}

const DEFAULTS = {
  speedX: 0,
  speedY: 0,
  speedZ: 0,
  k1: 5000,
  k2: 5,
  z: 100,
  centerX: 0,
  centerY: 0,
  color: { r: 139, g: 196, b: 255 },
  fontSizeMin: 10,
  fontSizeMax: 14,
};

const CubeEffect: React.FC<CanvasEffectProps & CubeConfig> = ({
  className = '',
  style = {},
  speedX = DEFAULTS.speedX,
  speedY = DEFAULTS.speedY,
  speedZ = DEFAULTS.speedZ,
  k1 = DEFAULTS.k1,
  k2 = DEFAULTS.k2,
  z = DEFAULTS.z,
  centerX = DEFAULTS.centerX,
  centerY = DEFAULTS.centerY,
  color = DEFAULTS.color,
  fontSizeMin = DEFAULTS.fontSizeMin,
  fontSizeMax = DEFAULTS.fontSizeMax,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let rotationX = speedX;
    let rotationY = speedY;
    let rotationZ = speedZ;

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
    resizeCanvas()

    type point = {
      x: number, y: number, z: number
    }
    const scale = 50

    const cx = canvas.width / 2 + centerX;
    const cy = canvas.height / 2 + centerY;

    function createCube() {
      const points: point[] = [];
      let z = 0
      for (let i = 0; i < 2; i++) {
        if (i == 0)
          z = -50
        else z = 50

        points.push({ x: cx - scale, y: cy - scale, z: z });
        points.push({ x: cx - scale, y: cy + scale, z: z });
        points.push({ x: cx + scale, y: cy + scale, z: z });
        points.push({ x: cx + scale, y: cy - scale, z: z });
      }
      return points;
    }

    type edge = { p1: point, p2: point }
    function createEdges(points: point[]) {
      const edges: edge[] = [];
      for (let i = 0; i < 2; i++) {
        const offset = 4 * i;
        edges.push({ p1: points[0 + offset], p2: points[1 + offset] })
        edges.push({ p1: points[1 + offset], p2: points[2 + offset] })
        edges.push({ p1: points[2 + offset], p2: points[3 + offset] })
        edges.push({ p1: points[3 + offset], p2: points[0 + offset] })
      }
      edges.push({ p1: points[0], p2: points[4] })
      edges.push({ p1: points[1], p2: points[5] })
      edges.push({ p1: points[2], p2: points[6] })
      edges.push({ p1: points[3], p2: points[7] })


      return edges
    }

    const faceIndices = [
      [0, 1, 2, 3], // front
      [4, 5, 6, 7], // back
      [0, 1, 5, 4], // left
      [2, 3, 7, 6], // right
      [0, 3, 7, 4], // top
      [1, 2, 6, 5], // bottom
    ];

    const faceColors = [
      '#ff4444', // front - red
      '#44ff44', // back - green
      '#4444ff', // left - blue
      '#ffff44', // right - yellow
      '#44ffff', // top - cyan
      '#ff44ff', // bottom - magenta
    ];

    const points: point[] = createCube();

    const w = 10;
    const h = 10;
    window.addEventListener('resize', resizeCanvas);

    function render() {
      if (!canvas || !ctx) return;

      ctx.fillStyle = 'rgba(0, 0, 0, 1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = 'rgba(0, 255, 0, 1)';

      const pp: point[] = []
      for (const p of points) {
        // Y-axis rotation (yaw)
        const x1 = (p.x - cx) * Math.cos(rotationY) + p.z * Math.sin(rotationY);
        const z1 = -(p.x - cx) * Math.sin(rotationY) + p.z * Math.cos(rotationY);

        // X-axis rotation (pitch)
        const y2 = (p.y - cy) * Math.cos(rotationX) - z1 * Math.sin(rotationX);
        const z2 = (p.y - cy) * Math.sin(rotationX) + z1 * Math.cos(rotationX);

        // Z-axis rotation (roll)
        const x3 = x1 * Math.cos(rotationZ) - y2 * Math.sin(rotationZ);
        const y3 = x1 * Math.sin(rotationZ) + y2 * Math.cos(rotationZ);

        // Apply perspective projection
        const depth = k2 + z + z2;
        const projectedX = x3 * k1 / depth;
        const projectedY = (y3 * k1 / depth);

        pp.push({
          x: projectedX + cx,
          y: projectedY + cy,
          z: z2
        });
      }

      const edges = createEdges(pp)
      for (const p of pp) {
        ctx.fillRect(p.x - w / 2, p.y - h / 2, w, h)
      }

      ctx.lineWidth = 1; // sets the line width to 5 pixels
      ctx.strokeStyle = "red"; // sets the line color to red
      for (const e of edges) {
        ctx.beginPath()
        ctx.moveTo(e.p1.x, e.p1.y)
        ctx.lineTo(e.p2.x, e.p2.y)
        ctx.stroke()
      }

      // Sort faces by depth (painter's algorithm - back to front)
      const sortedFaces = faceIndices.map((indices, i) => ({
        indices,
        avgZ: indices.reduce((sum, idx) => sum + pp[idx].z, 0) / 4,
        color: faceColors[i]
      })).sort((a, b) => b.avgZ - a.avgZ);

      // Render sorted faces
      for (const face of sortedFaces) {
        ctx.beginPath();
        ctx.moveTo(pp[face.indices[0]].x, pp[face.indices[0]].y);
        for (let i = 1; i < face.indices.length; i++) {
          ctx.lineTo(pp[face.indices[i]].x, pp[face.indices[i]].y);
        }
        ctx.closePath();
        ctx.fillStyle = face.color;
        ctx.fill();
      }

      rotationX += speedX;
      rotationY += speedY;
      rotationZ += speedZ;

      // Use rotation values to prevent unused variable warnings
      void rotationX;
      void rotationY;
      void rotationZ;

      animationId = requestAnimationFrame(render);
    }

    render();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, [speedX, speedY, speedZ, k1, k2, z, centerX, centerY, color, fontSizeMin, fontSizeMax]);

  return <canvas ref={canvasRef} className={className} style={style} />;
};

export default CubeEffect;
