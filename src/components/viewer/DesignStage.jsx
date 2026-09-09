import { Suspense, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { Environment, useGLTF } from '@react-three/drei';

// Grabs the live camera + default controls (OrbitControls, when it's mounted
// with makeDefault) out to plain refs, so DOM UI *outside* the Canvas — like
// FlybyEditor's panel — can read them without drei's <Html> occlusion/
// behind-camera hiding, and without needing its own r3f context.
function ContextBridge({ cameraRef, controlsRef }) {
  const { camera, controls } = useThree();
  useEffect(() => {
    if (cameraRef) cameraRef.current = camera;
  }, [camera, cameraRef]);
  useEffect(() => {
    if (controlsRef) controlsRef.current = controls;
  }, [controls, controlsRef]);
  return null;
}

// Reusable 3D staging shell for a design viewer — Canvas, lighting, and
// framing. Presentation-only by default; editMode just toggles the dev
// reference grid/axes (the actual OrbitControls/FlybyEditor are rendered by
// the page as children, since they need editMode-conditional mounting too).
export function DesignStage({
  modelUrl,
  editMode = false,
  cameraRef,
  controlsRef,
  children,
}) {
  useEffect(() => {
    if (modelUrl) useGLTF.preload(modelUrl);
  }, [modelUrl]);

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Canvas shadows camera={{ position: [3, 2, 3], fov: 45 }}>
        <color attach="background" args={['#0a1420']} />
        <fog attach="fog" args={['#0a1420', 12, 26]} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 8, 4]} intensity={1.1} castShadow />

        <ContextBridge cameraRef={cameraRef} controlsRef={controlsRef} />

        {editMode && (
          <>
            <gridHelper
              args={[20, 20, '#1c3a4a', '#132735']}
              position={[0, -0.01, 0]}
            />
            <axesHelper args={[2]} />
          </>
        )}

        {/* No <Bounds> here on purpose: it auto-fits the camera whenever its
            fit/observe deps change, including every time OrbitControls
            mounts/unmounts (editMode/previewing toggles) — and its fit
            animation resets controls.target to the model's bounding-box
            center, silently overriding whatever point you'd actually
            selected. FlybyCamera and FlybyEditor's snap-on-select now fully
            own camera positioning, so Bounds is redundant and was actively
            fighting them for control of the orbit target. */}
        <Suspense fallback={null}>{children}</Suspense>

        <Environment files="/hdri/studio_small_03_1k.hdr" />
      </Canvas>
    </div>
  );
}
