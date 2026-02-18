import { useState } from 'react';
import DonutEffect from '../../components/procedural-effects/DonutEffect';
import CubeEffect from '../../components/procedural-effects/CubeEffect';
import SliderInput from './EffectsPlayground/SliderInput';

type EffectType = 'donut' | 'cube';

function EffectsPlayground() {
  const [selectedEffect, setSelectedEffect] = useState<EffectType>('donut');
  const [speedA, setSpeedA] = useState(0);
  const [speedB, setSpeedB] = useState(0);
  const [speedX, setSpeedX] = useState(0);
  const [speedY, setSpeedY] = useState(0);
  const [speedZ, setSpeedZ] = useState(0);
  const [k1, setK1] = useState(5000);
  const [k2, setK2] = useState(5);
  const [z, setZ] = useState(100);
  const [centerX, setCenterX] = useState(0);
  const [centerY, setCenterY] = useState(0);
  const [renderMode, setRenderMode] = useState<'ascii' | 'pixel'>('ascii');
  const [pixelSize, setPixelSize] = useState(1);

  return (
    <div className="min-h-screen">
      <h1 className="text-3xl font-bold text-primary dark:text-primary-dark mb-8 border-l-4 border-primary dark:border-primary-dark pl-4">
        Procedural Effects Playground
      </h1>

      {/* Effect Selector */}
      <div className="mb-8 p-4 bg-bg2 dark:bg-bg2-dark border border-borderMuted dark:border-borderMuted">
        <h2 className="text-lg font-semibold mb-4">Select Effect</h2>
        <div className="flex gap-2">
          {(['donut', 'cube'] as EffectType[]).map((effect) => (
            <button
              key={effect}
              onClick={() => setSelectedEffect(effect)}
              className={`px-3 py-1 text-sm border ${
                selectedEffect === effect
                  ? 'border-primary dark:border-primary-dark bg-primary/10 dark:bg-primary-dark/10'
                  : 'border-borderMuted dark:border-borderMuted'
              }`}
            >
              {effect.charAt(0).toUpperCase() + effect.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="mb-8 p-4 bg-bg2 dark:bg-bg2-dark border border-borderMuted dark:border-borderMuted">
        <h2 className="text-lg font-semibold mb-4">Controls</h2>
        
        {selectedEffect === 'donut' && (
          <div className="flex flex-wrap gap-6">
            <div>
              <span className="block text-sm mb-2">Render Mode</span>
              <div className="flex gap-2">
                {(['ascii', 'pixel'] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setRenderMode(mode)}
                    className={`px-3 py-1 text-sm border ${
                      renderMode === mode
                        ? 'border-primary dark:border-primary-dark bg-primary/10 dark:bg-primary-dark/10'
                        : 'border-borderMuted dark:border-borderMuted'
                    }`}
                  >
                    {mode.charAt(0).toUpperCase() + mode.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <SliderInput label="Speed A (Theta)" value={speedA} onChange={setSpeedA} min={-0.1} max={0.1} step={0.005} />
            <SliderInput label="Speed B (Phi)" value={speedB} onChange={setSpeedB} min={-0.1} max={0.1} step={0.005} />
            <SliderInput label="scaleX" value={k1} onChange={setK1} min={10} max={100} step={5} />
            <SliderInput label="scaleY" value={k2} onChange={setK2} min={5} max={50} step={1} />
            <SliderInput label="offsetX" value={centerX} onChange={setCenterX} min={-100} max={100} step={5} />
            <SliderInput label="offsetY" value={centerY} onChange={setCenterY} min={-50} max={50} step={5} />
            {renderMode === 'pixel' && (
              <SliderInput label="pixelSize" value={pixelSize} onChange={setPixelSize} min={1} max={10} step={1} />
            )}
          </div>
        )}

        {selectedEffect === 'cube' && (
          <div className="flex flex-wrap gap-6">
            <SliderInput label="Speed X" value={speedX} onChange={setSpeedX} min={-0.1} max={0.1} step={0.005} />
            <SliderInput label="Speed Y" value={speedY} onChange={setSpeedY} min={-0.1} max={0.1} step={0.005} />
            <SliderInput label="Speed Z" value={speedZ} onChange={setSpeedZ} min={-0.1} max={0.1} step={0.005} />
            <SliderInput label="k1 (scale)" value={k1} onChange={setK1} min={1000} max={10000} step={500} />
            <SliderInput label="k2 (depth)" value={k2} onChange={setK2} min={1} max={20} step={1} />
            <SliderInput label="z (distance)" value={z} onChange={setZ} min={50} max={500} step={10} />
            <SliderInput label="centerX" value={centerX} onChange={setCenterX} min={-200} max={200} step={10} />
            <SliderInput label="centerY" value={centerY} onChange={setCenterY} min={-200} max={200} step={10} />
          </div>
        )}
      </div>

      {/* Effect Display */}
      <div className="border border-borderMuted dark:border-borderMuted overflow-hidden" style={{ height: '60vh' }}>
        {selectedEffect === 'donut' && (
          <DonutEffect speedA={speedA} speedB={speedB} scaleX={k1} scaleY={k2} offsetX={centerX} offsetY={centerY} renderMode={renderMode} pixelSize={pixelSize} />
        )}
        {selectedEffect === 'cube' && (
          <CubeEffect speedX={speedX} speedY={speedY} speedZ={speedZ} k1={k1} k2={k2} z={z} centerX={centerX} centerY={centerY} />
        )}
      </div>
    </div>
  );
}

export default EffectsPlayground;
