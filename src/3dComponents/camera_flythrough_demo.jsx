import React, { useRef, useState, useMemo, useCallback } from 'react';
// src/pages/VenturePlugPage.jsx
import { Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
  OrbitControls,
  Line,
  Html,
  Environment,
  Bounds,
} from '@react-three/drei';
import * as THREE from 'three';
import { VenturePlug, STEPS } from '../3dComponents/VenturePlug';

// ---- Waypoints -------------------------------------------------------
// Swap these for real coordinates pulled from your SolidWorks camera keys.
// Each waypoint = camera position + the point it should be looking at.
const scale = 0.4;

const WAYPOINTS = [
  { pos: [6, 2.5, 6].map((v) => v * scale), look: [1.5, 0, 1.5] },
  { pos: [0, 3.5, 8].map((v) => v * scale), look: [1.5, 0, 1.5] },
  { pos: [-6, 2, 5].map((v) => v * scale), look: [1.5, 0, 1.5] },
  { pos: [-4, 1, -5].map((v) => v * scale), look: [1.5, 0, 1.5] },
  { pos: [3, 1.2, -6].map((v) => v * scale), look: [1.5, 0, 1.5] },
  { pos: [6, 2.5, 6].map((v) => v * scale), look: [1.5, 0, 1.5] }, // loop back to start
];

function usePathCurves() {
  return useMemo(() => {
    const posCurve = new THREE.CatmullRomCurve3(
      WAYPOINTS.map((w) => new THREE.Vector3(...w.pos)),
      false,
      'catmullrom',
      0.5,
    );
    const lookCurve = new THREE.CatmullRomCurve3(
      WAYPOINTS.map((w) => new THREE.Vector3(...w.look)),
      false,
      'catmullrom',
      0.5,
    );
    return { posCurve, lookCurve };
  }, []);
}

function StandInPart() {
  // Placeholder geometry standing in for your imported GLB assembly.
  return (
    <group>
      <mesh position={[0, 0.6, 0]} castShadow>
        <cylinderGeometry args={[1.1, 1.4, 1.2, 8]} />
        <meshStandardMaterial
          color="#3a7d8c"
          metalness={0.4}
          roughness={0.35}
        />
      </mesh>
      <mesh position={[0, 1.5, 0]} castShadow>
        <torusKnotGeometry args={[0.55, 0.16, 128, 16]} />
        <meshStandardMaterial
          color="#e8a34f"
          metalness={0.6}
          roughness={0.25}
        />
      </mesh>
    </group>
  );
}

function PathVisual() {
  const { posCurve } = usePathCurves();
  const points = useMemo(() => posCurve.getPoints(200), [posCurve]);
  return (
    <>
      <Line
        points={points}
        color="#4fd1e8"
        lineWidth={1.5}
        dashed={false}
        transparent
        opacity={0.55}
      />
      {WAYPOINTS.map((w, i) => (
        <mesh key={i} position={w.pos}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshBasicMaterial color="#f5a623" />
        </mesh>
      ))}
    </>
  );
}

function FlightRig({ playing, duration, loop, onProgress, onFinish }) {
  const { camera } = useThree();
  const { posCurve, lookCurve } = usePathCurves();
  const tRef = useRef(0);

  useFrame((_, delta) => {
    if (!playing) return;
    tRef.current += delta / duration;
    if (tRef.current >= 1) {
      if (loop) {
        tRef.current = 0;
      } else {
        tRef.current = 1;
        onFinish?.();
      }
    }
    const t = tRef.current;
    const p = posCurve.getPointAt(Math.min(t, 0.999));
    const l = lookCurve.getPointAt(Math.min(t, 0.999));
    camera.position.copy(p);
    camera.lookAt(l);
    onProgress?.(t, p, l);
  });

  return null;
}

export default function CameraFlythroughDemo() {
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState(8);
  const [loop, setLoop] = useState(true);
  const [readout, setReadout] = useState({ t: 0, p: [0, 0, 0], l: [0, 0, 0] });
  const controlsRef = useRef();

  const handleProgress = useCallback((t, p, l) => {
    setReadout({
      t,
      p: [p.x, p.y, p.z].map((n) => n.toFixed(2)),
      l: [l.x, l.y, l.z].map((n) => n.toFixed(2)),
    });
  }, []);

  const togglePlay = () => setPlaying((v) => !v);
  const reset = () => setPlaying(false);

  return (
    <div className="w-full h-[640px] relative bg-[#0a1420] rounded-lg overflow-hidden font-sans">
      <Canvas shadows camera={{ position: WAYPOINTS[0].pos, fov: 45 }}>
        <color attach="background" args={['#0a1420']} />
        <fog attach="fog" args={['#0a1420', 12, 26]} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 8, 4]} intensity={1.1} castShadow />
        <gridHelper
          args={[20, 20, '#1c3a4a', '#132735']}
          position={[0, -0.01, 0]}
        />
        <axesHelper args={[2]} />
        <Suspense fallback={null}>
          <Bounds fit clip observe margin={1.2}>
            <VenturePlug step={step} />
          </Bounds>
          <Environment files="/hdri/studio_small_03_1k.hdr" />
        </Suspense>
        {/* <StandInPart /> */}
        <PathVisual />

        <FlightRig
          playing={playing}
          duration={duration}
          loop={loop}
          onProgress={handleProgress}
          onFinish={() => setPlaying(false)}
        />

        <OrbitControls ref={controlsRef} enabled={!playing} />
      </Canvas>

      {/* Controls */}
      <div className="absolute left-4 bottom-4 bg-[#0e1e2c]/90 border border-[#1c3a4a] rounded-md px-4 py-3 flex flex-col gap-3 text-[#cfe8ef] text-sm min-w-[260px]">
        <div className="flex items-center gap-2">
          <button
            onClick={togglePlay}
            className="px-3 py-1.5 rounded bg-[#4fd1e8] text-[#0a1420] font-medium hover:bg-[#7de0f0] transition-colors"
          >
            {playing ? 'Pause' : 'Play flythrough'}
          </button>
          <button
            onClick={reset}
            className="px-3 py-1.5 rounded border border-[#2a4a5c] hover:border-[#4fd1e8] transition-colors"
          >
            Stop
          </button>
          <label className="flex items-center gap-1.5 ml-1 text-xs text-[#9fc3d0]">
            <input
              type="checkbox"
              checked={loop}
              onChange={(e) => setLoop(e.target.checked)}
            />
            loop
          </label>
        </div>

        <div className="flex items-center gap-2 text-xs text-[#9fc3d0]">
          <span className="w-16">Duration</span>
          <input
            type="range"
            min="2"
            max="20"
            step="0.5"
            value={duration}
            onChange={(e) => setDuration(parseFloat(e.target.value))}
            className="flex-1"
          />
          <span className="font-mono w-10 text-right">
            {duration.toFixed(1)}s
          </span>
        </div>

        <div className="h-1 bg-[#132735] rounded overflow-hidden">
          <div
            className="h-full bg-[#f5a623] transition-[width] duration-75"
            style={{ width: `${readout.t * 100}%` }}
          />
        </div>

        <div className="font-mono text-[11px] text-[#7fa6b3] leading-relaxed">
          pos&nbsp; {readout.p.join(', ')}
          <br />
          look {readout.l.join(', ')}
        </div>
      </div>

      <div className="absolute right-4 top-4 text-[11px] text-[#5c8496] font-mono">
        drag to orbit while stopped
      </div>
    </div>
  );
}
