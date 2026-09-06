// src/pages/VenturePlugPage.jsx
import { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Bounds } from '@react-three/drei';
import { VenturePlug, STEPS } from './3dComponents/VenturePlug';

export default function VenturePlugPage() {
  const [step, setStep] = useState(0);

  return (
    <div style={{ width: '100%', height: '100vh', position: 'relative' }}>
      <Canvas>
        <ambientLight intensity={0.6} />
        <directionalLight position={[2, 3, 2]} intensity={1.5} />
        <Suspense fallback={null}>
          <Bounds fit clip observe margin={1.2}>
            <VenturePlug step={step} />
          </Bounds>
          <Environment files="/hdri/studio_small_03_1k.hdr" />
        </Suspense>
        <OrbitControls makeDefault />
      </Canvas>

      <div
        style={{
          position: 'absolute',
          bottom: 24,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: 16,
          alignItems: 'center',
        }}
      >
        <button
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
        >
          ←
        </button>
        <span>{STEPS[step].label}</span>
        <button
          onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}
          disabled={step === STEPS.length - 1}
        >
          →
        </button>
      </div>
    </div>
  );
}
