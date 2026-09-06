import Footer from './Footer';

// src/pages/VenturePlugPage.jsx — this is your current App.jsx content
import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Bounds } from '@react-three/drei';
import { VenturePlug } from './3dComponents/VenturePlug';

export default function MechanicalEngineer() {
  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <Canvas>
        <ambientLight intensity={0.6} />
        <directionalLight position={[2, 3, 2]} intensity={1.5} />
        <Suspense fallback={null}>
          <Bounds fit clip observe margin={1.2}>
            <VenturePlug />
          </Bounds>
        </Suspense>
        <OrbitControls makeDefault />
      </Canvas>
    </div>
  );
}
