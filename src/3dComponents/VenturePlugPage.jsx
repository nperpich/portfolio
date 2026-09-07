// src/pages/VenturePlugPage.jsx
import React, {
  Suspense,
  useRef,
  useState,
  useMemo,
  useCallback,
  useEffect,
} from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
  OrbitControls,
  Line,
  Html,
  Environment,
  Bounds,
} from '@react-three/drei';
import * as THREE from 'three';
import { VenturePlug, STEPS } from './VenturePlug';

// ---- Waypoints -------------------------------------------------------
// Stored/exported form is always Cartesian { pos: [x,y,z], look: [x,y,z] }.
// Editing happens by orbiting the live camera to the shot you want, then
// "Add from view" / "Update from view" to capture it — no manual coordinate
// entry, so there's no way to land on a degenerate (gimbal-locked) angle.
const DEFAULT_WAYPOINTS = [
  { pos: [3.9, 1.16, 3.9], look: [1.5, 0, 1.5] },
  { pos: [1.5, 1.44, 4.94], look: [1.5, 0, 1.5] },
  { pos: [-0.94, 1.16, 3.9], look: [1.5, 0, 1.5] },
  { pos: [-0.94, 0.3, 1.06], look: [1.5, 0.3, 1.5] },
  { pos: [1.5, 0.44, -0.02], look: [1.5, 0.3, 1.5] },
  { pos: [3.9, 1.16, 3.9], look: [1.5, 0, 1.5] },
];

const round = (n) => Math.round(n * 1000) / 1000;
const roundArr = (a) => a.map(round);

function buildCurves(waypoints) {
  if (waypoints.length < 2) return null;
  const posCurve = new THREE.CatmullRomCurve3(
    waypoints.map((w) => new THREE.Vector3(...w.pos)),
    false,
    'catmullrom',
    0.5,
  );
  const lookCurve = new THREE.CatmullRomCurve3(
    waypoints.map((w) => new THREE.Vector3(...w.look)),
    false,
    'catmullrom',
    0.5,
  );
  return { posCurve, lookCurve };
}

function PathVisual({ waypoints, selectedIndex, onSelect }) {
  const curves = useMemo(() => buildCurves(waypoints), [waypoints]);
  const points = useMemo(
    () => (curves ? curves.posCurve.getPoints(200) : []),
    [curves],
  );
  return (
    <>
      {points.length > 0 && (
        <Line
          points={points}
          color="#4fd1e8"
          lineWidth={1.5}
          transparent
          opacity={0.55}
        />
      )}
      {waypoints.map((w, i) => {
        const active = i === selectedIndex;
        return (
          <group key={i}>
            <mesh
              position={w.pos}
              onClick={(e) => {
                e.stopPropagation();
                onSelect(i);
              }}
            >
              <sphereGeometry args={[active ? 0.11 : 0.08, 16, 16]} />
              <meshBasicMaterial color={active ? '#f5a623' : '#7a8f99'} />
            </mesh>
            <Html distanceFactor={8} position={w.pos}>
              <div className="text-[10px] text-[#cfe8ef] bg-[#0a1420]/70 px-1 rounded pointer-events-none -translate-y-4">
                {i}
              </div>
            </Html>
            {active && (
              <>
                <mesh position={w.look}>
                  <sphereGeometry args={[0.07, 16, 16]} />
                  <meshBasicMaterial color="#ff5fd1" />
                </mesh>
                <Line
                  points={[w.pos, w.look]}
                  color="#ff5fd1"
                  lineWidth={1}
                  dashed
                  dashSize={0.1}
                  gapSize={0.08}
                  transparent
                  opacity={0.7}
                />
              </>
            )}
          </group>
        );
      })}
    </>
  );
}

function FlightRig({
  waypoints,
  playing,
  duration,
  loop,
  onProgress,
  onFinish,
}) {
  const { camera } = useThree();
  const curves = useMemo(() => buildCurves(waypoints), [waypoints]);
  const tRef = useRef(0);

  useFrame((_, delta) => {
    if (!playing || !curves) return;
    tRef.current += delta / duration;
    if (tRef.current >= 1) {
      if (loop) tRef.current = 0;
      else {
        tRef.current = 1;
        onFinish?.();
      }
    }
    const t = tRef.current;
    const p = curves.posCurve.getPointAt(Math.min(t, 0.999));
    const l = curves.lookCurve.getPointAt(Math.min(t, 0.999));
    camera.position.copy(p);
    camera.lookAt(l);
    onProgress?.(t, p, l);
  });

  return null;
}

// Captures a live reference to the R3F camera so HTML controls
// outside the <Canvas> can read/snap it.
function CameraCapture({ cameraRef }) {
  const { camera } = useThree();
  useEffect(() => {
    cameraRef.current = camera;
  }, [camera, cameraRef]);
  return null;
}

export default function VenturePlugPage() {
  const [step, setStep] = useState(0);

  const [editMode, setEditMode] = useState(true);
  const [waypoints, setWaypoints] = useState(DEFAULT_WAYPOINTS);
  const [selectedIndex, setSelectedIndex] = useState(null);

  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState(8);
  const [loop, setLoop] = useState(true);
  const [readout, setReadout] = useState({ t: 0, p: [0, 0, 0], l: [0, 0, 0] });

  const controlsRef = useRef();
  const cameraRef = useRef();
  const codeRef = useRef();

  const orbitEnabled = !playing;
  const selected = selectedIndex !== null ? waypoints[selectedIndex] : null;

  // Snap the live camera to the selected waypoint's exact pos/look, so you
  // see the shot before orbiting away from it to adjust. Deliberately keyed
  // only on selectedIndex (not waypoints) — this should fire when you pick a
  // waypoint, not every time you nudge its look values afterward, otherwise
  // editing "look" would keep yanking the camera back to the stored pos.
  useEffect(() => {
    if (!editMode || selectedIndex === null || playing) return;
    const cam = cameraRef.current;
    const wp = waypoints[selectedIndex];
    if (!cam || !wp) return;
    cam.position.set(...wp.pos);
    cam.lookAt(new THREE.Vector3(...wp.look));
    if (controlsRef.current) {
      controlsRef.current.target.set(...wp.look);
      controlsRef.current.update();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editMode, selectedIndex, playing]);

  const addFromCurrentView = () => {
    const cam = cameraRef.current;
    const target = controlsRef.current?.target;
    if (!cam || !target) return;
    const newWp = {
      pos: roundArr(cam.position.toArray()),
      look: roundArr(target.toArray()),
    };
    setWaypoints((wps) => {
      const next = [...wps, newWp];
      setSelectedIndex(next.length - 1);
      return next;
    });
  };

  const updateSelectedFromView = () => {
    const cam = cameraRef.current;
    const target = controlsRef.current?.target;
    if (!cam || !target || selectedIndex === null) return;
    const pos = roundArr(cam.position.toArray());
    const look = roundArr(target.toArray());
    setWaypoints((wps) =>
      wps.map((w, i) => (i === selectedIndex ? { pos, look } : w)),
    );
  };

  const deleteWaypoint = (i) => {
    setWaypoints((wps) => wps.filter((_, idx) => idx !== i));
    setSelectedIndex((sel) => (sel === i ? null : sel > i ? sel - 1 : sel));
  };

  const setSelectedLookAxis = (axis, value) => {
    if (Number.isNaN(value) || selectedIndex === null) return;
    setWaypoints((wps) =>
      wps.map((w, i) =>
        i === selectedIndex
          ? { ...w, look: w.look.map((v, a) => (a === axis ? value : v)) }
          : w,
      ),
    );
    // Re-aim the live orbit target only — leave the camera's current
    // position alone so wherever you've orbited to stays put.
    const controls = controlsRef.current;
    if (controls) {
      controls.target[['x', 'y', 'z'][axis]] = value;
      controls.update();
    }
  };

  const nudgeSelectedLook = (axis, delta) => {
    if (selectedIndex === null) return;
    setSelectedLookAxis(axis, round(waypoints[selectedIndex].look[axis] + delta));
  };

  const handleProgress = useCallback((t, p, l) => {
    setReadout({
      t,
      p: [p.x, p.y, p.z].map((n) => n.toFixed(2)),
      l: [l.x, l.y, l.z].map((n) => n.toFixed(2)),
    });
  }, []);

  const code = useMemo(() => {
    const lines = waypoints
      .map(
        (w) =>
          `  { pos: [${w.pos.map((n) => n.toFixed(3)).join(', ')}], look: [${w.look
            .map((n) => n.toFixed(3))
            .join(', ')}] },`,
      )
      .join('\n');
    return `const WAYPOINTS = [\n${lines}\n];`;
  }, [waypoints]);

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      codeRef.current?.select();
    }
  };

  const canPlay = waypoints.length >= 2;

  return (
    <div className="w-full h-[720px] relative bg-[#0a1420] rounded-lg overflow-hidden font-sans flex">
      <div className="flex-1 relative">
        <Canvas
          shadows
          camera={{ position: waypoints[0]?.pos ?? [3, 2, 3], fov: 45 }}
        >
          <color attach="background" args={['#0a1420']} />
          <fog attach="fog" args={['#0a1420', 12, 26]} />
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 8, 4]} intensity={1.1} castShadow />
          <gridHelper
            args={[20, 20, '#1c3a4a', '#132735']}
            position={[0, -0.01, 0]}
          />
          <axesHelper args={[2]} />

          <CameraCapture cameraRef={cameraRef} />

          <Suspense fallback={null}>
            <Bounds fit clip observe margin={1.2}>
              <VenturePlug step={step} />
            </Bounds>
            <Environment files="/hdri/studio_small_03_1k.hdr" />
          </Suspense>

          <PathVisual
            waypoints={waypoints}
            selectedIndex={selectedIndex}
            onSelect={setSelectedIndex}
          />

          <FlightRig
            waypoints={waypoints}
            playing={playing}
            duration={duration}
            loop={loop}
            onProgress={handleProgress}
            onFinish={() => setPlaying(false)}
          />

          <OrbitControls ref={controlsRef} enabled={orbitEnabled} />
        </Canvas>

        {/* Playback controls */}
        <div className="absolute left-4 bottom-4 bg-[#0e1e2c]/90 border border-[#1c3a4a] rounded-md px-4 py-3 flex flex-col gap-3 text-[#cfe8ef] text-sm min-w-[260px]">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPlaying((v) => !v)}
              disabled={!canPlay}
              className="px-3 py-1.5 rounded bg-[#4fd1e8] text-[#0a1420] font-medium hover:bg-[#7de0f0] transition-colors disabled:opacity-40"
            >
              {playing ? 'Pause' : 'Play flythrough'}
            </button>
            <button
              onClick={() => setPlaying(false)}
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

        <div className="absolute right-4 top-4 flex items-center gap-2">
          <button
            onClick={() => {
              setEditMode((v) => !v);
              setSelectedIndex(null);
            }}
            className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
              editMode
                ? 'bg-[#f5a623] text-[#0a1420]'
                : 'bg-[#0e1e2c]/90 border border-[#2a4a5c] text-[#cfe8ef]'
            }`}
          >
            {editMode ? 'Edit mode: ON' : 'Edit mode: OFF'}
          </button>
        </div>
      </div>

      {editMode && (
        <div className="w-[340px] bg-[#0e1e2c] border-l border-[#1c3a4a] p-4 flex flex-col gap-4 overflow-y-auto text-[#cfe8ef] text-sm">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs uppercase tracking-wide text-[#7fa6b3]">
                Waypoints
              </span>
              <button
                onClick={addFromCurrentView}
                className="px-2 py-1 rounded bg-[#4fd1e8] text-[#0a1420] text-xs font-medium hover:bg-[#7de0f0]"
              >
                + Add from view
              </button>
            </div>
            <div className="flex flex-col gap-1 max-h-[140px] overflow-y-auto">
              {waypoints.map((w, i) => (
                <div
                  key={i}
                  onClick={() => setSelectedIndex(i)}
                  className={`flex items-center justify-between px-2 py-1 rounded cursor-pointer text-xs font-mono ${
                    i === selectedIndex
                      ? 'bg-[#f5a623] text-[#0a1420]'
                      : 'bg-[#132735] hover:bg-[#1c3a4a]'
                  }`}
                >
                  <span>
                    {i} · [{w.pos.map((n) => n.toFixed(1)).join(', ')}]
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteWaypoint(i);
                    }}
                    className="ml-2 opacity-70 hover:opacity-100"
                  >
                    ✕
                  </button>
                </div>
              ))}
              {waypoints.length === 0 && (
                <div className="text-xs text-[#5c8496] italic">
                  No waypoints yet — orbit the view, then "Add from view".
                </div>
              )}
            </div>
          </div>

          {selectedIndex !== null && selected && (
            <div className="flex flex-col gap-3 border-t border-[#1c3a4a] pt-3">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wide text-[#7fa6b3]">
                  Editing #{selectedIndex}
                </span>
                <button
                  onClick={updateSelectedFromView}
                  className="px-2 py-1 rounded bg-[#4fd1e8] text-[#0a1420] text-xs font-medium hover:bg-[#7de0f0]"
                >
                  Update from view
                </button>
              </div>
              <div className="text-[10px] text-[#5c8496] italic">
                Orbit/pan/zoom the scene to frame the shot you want, then
                click "Update from view" to save it into this waypoint.
              </div>
              <div className="font-mono text-[11px] text-[#7fa6b3] leading-relaxed">
                pos&nbsp; [{selected.pos.map((n) => n.toFixed(2)).join(', ')}]
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] uppercase tracking-wide text-[#7fa6b3]">
                  Look at
                </span>
                {['x', 'y', 'z'].map((label, axis) => (
                  <div key={label} className="flex items-center gap-1.5">
                    <span className="w-3 font-mono text-[11px] text-[#5c8496]">
                      {label}
                    </span>
                    <button
                      onClick={() => nudgeSelectedLook(axis, -0.1)}
                      className="w-6 h-6 rounded border border-[#2a4a5c] hover:border-[#4fd1e8] text-xs leading-none"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      step="0.1"
                      value={selected.look[axis]}
                      onChange={(e) =>
                        setSelectedLookAxis(axis, parseFloat(e.target.value))
                      }
                      className="w-16 bg-[#0a1420] border border-[#1c3a4a] rounded px-1.5 py-0.5 font-mono text-[11px] text-[#cfe8ef]"
                    />
                    <button
                      onClick={() => nudgeSelectedLook(axis, 0.1)}
                      className="w-6 h-6 rounded border border-[#2a4a5c] hover:border-[#4fd1e8] text-xs leading-none"
                    >
                      +
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col gap-1.5 border-t border-[#1c3a4a] pt-3 mt-auto">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wide text-[#7fa6b3]">
                Copy into your component
              </span>
              <button
                onClick={copyCode}
                className="px-2 py-1 rounded border border-[#2a4a5c] hover:border-[#4fd1e8] text-xs"
              >
                Copy
              </button>
            </div>
            <textarea
              ref={codeRef}
              readOnly
              value={code}
              rows={Math.min(10, waypoints.length + 2)}
              className="w-full bg-[#0a1420] border border-[#1c3a4a] rounded p-2 font-mono text-[11px] text-[#9fc3d0] resize-none"
              onFocus={(e) => e.target.select()}
            />
          </div>
        </div>
      )}
    </div>
  );
}
