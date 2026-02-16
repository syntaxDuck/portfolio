import GameOfLifeEffect from "./GameOfLifeEffect";
import FlowFieldEffect from "./FlowFieldEffect";
import LissajousEffect from "./LissajousEffect";
import BoidsEffect from "./BoidsEffect";

export type EffectKey = 'life' | 'flow' | 'lissajous' | 'boids';
export const Effects: Record<EffectKey, { label: string; component: React.FC<{ className?: string; style?: React.CSSProperties }> }> = {
  life: { label: 'Game of Life', component: GameOfLifeEffect },
  flow: { label: 'Flow Field', component: FlowFieldEffect },
  lissajous: { label: 'Lissajous Curves', component: LissajousEffect },
  boids: { label: 'Boids (Flocking)', component: BoidsEffect },
} as const;

export const selectRandomEffect = (): EffectKey => {
  const keys = Object.keys(Effects) as EffectKey[];
  return keys[Math.floor(Math.random() * keys.length)];
};
