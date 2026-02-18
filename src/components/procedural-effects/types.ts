import GameOfLifeEffect from "./GameOfLifeEffect";
import FlowFieldEffect from "./FlowFieldEffect";
import LissajousEffect from "./LissajousEffect";
import BoidsEffect from "./BoidsEffect";
import DonutEffect, { DonutConfig } from "./DonutEffect";
import CubeEffect, { CubeConfig } from "./CubeEffect";

export type EffectConfig = DonutConfig | CubeConfig;

export type EffectKey = 'life' | 'flow' | 'lissajous' | 'boids' | 'donut' | 'cube';
export const Effects: Record<EffectKey, { label: string; component: React.FC<{ className?: string; style?: React.CSSProperties } & Partial<EffectConfig>>; config?: Partial<EffectConfig> }> = {
  life: { label: 'Game of Life', component: GameOfLifeEffect },
  flow: { label: 'Flow Field', component: FlowFieldEffect },
  lissajous: { label: 'Lissajous Curves', component: LissajousEffect },
  boids: { label: 'Boids (Flocking)', component: BoidsEffect },
  donut: { 
    label: '3D Donut', 
    component: DonutEffect,
    config: {
      speedA: 0.01,
      speedB: 0.005,
      brightness: 1.0,
      color: { r: 139, g: 196, b: 255 },
      gridWidth: 80,
      gridHeight: 24,
      charSpacingX: 10,
      charSpacingY: 18,
      chars: '.,-~:;=!*#$@',
      thetaStep: 0.07,
      phiStep: 0.02,
      fontSizeMin: 10,
      fontSizeMax: 14,
      offsetX: 40,
      offsetY: 12,
      scaleX: 40,
      scaleY: 20,
    }
  },
  cube: {
    label: '3D Cube',
    component: CubeEffect,
    config: {
      speedX: 0.01,
      speedY: 0.01,
      speedZ: 0,
    }
  },
} as const;

export const selectRandomEffect = (): EffectKey => {
  const keys = Object.keys(Effects) as EffectKey[];
  return keys[Math.floor(Math.random() * keys.length)];
};
