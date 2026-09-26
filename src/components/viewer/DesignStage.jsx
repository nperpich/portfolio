import { Suspense, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { Environment, useGLTF } from '@react-three/drei';
import { ACESFilmicToneMapping } from 'three';

// Grabs the live camera + default controls (OrbitControls, when it's mounted
// with makeDefault) out to plain refs, so DOM UI *outside* the Canvas — like
// FlybyEditor's panel — can read them without drei's <Html> occlusion/
// behind-camera hiding, and without needing its own r3f context.
// captureRef (optional) additionally exposes { gl, scene, camera } for the
// edit-mode "Capture thumbnail" button, which needs to trigger an
// off-frame square render.
function ContextBridge({ cameraRef, controlsRef, captureRef }) {
  const { camera, controls, gl, scene } = useThree();
  useEffect(() => {
    if (cameraRef) cameraRef.current = camera;
  }, [camera, cameraRef]);
  useEffect(() => {
    if (controlsRef) controlsRef.current = controls;
  }, [controls, controlsRef]);
  useEffect(() => {
    if (captureRef) captureRef.current = { gl, scene, camera };
  }, [captureRef, gl, scene, camera]);
  return null;
}

// Parented to the camera (not the scene) so the key light always rakes
// across the model from the same relative angle no matter how you orbit —
// the gltf-viewer "pop" trick.
function CameraLight() {
  const { camera } = useThree();
  return (
    <primitive object={camera}>
      {/* <ambientLight intensity={0.5} /> */}
      <directionalLight
        position={[0.5, 0, 0.866]}
        intensity={1.5}
        castShadow
        shadow-radius={8}
      />
    </primitive>
  );
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
  captureRef,
  children,
}) {
  useEffect(() => {
    if (modelUrl) useGLTF.preload(modelUrl);
  }, [modelUrl]);

  return (
    <div
      className="design-stage-frame"
      style={{
        width: '100%',
        aspectRatio: '4 / 3',
        // Longhand, not the `margin` shorthand — that would also pin
        // margin-top to 0 inline, and inline styles always beat external
        // stylesheet rules, silently defeating any margin-top override
        // ProjectViewer.css sets on this element's className.
        marginLeft: 'auto',
        marginRight: 'auto',
        position: 'relative',
      }}
    >
      <Canvas
        shadows="soft"
        camera={{ position: [3, 2, 3], fov: 45 }}
        gl={{ toneMapping: ACESFilmicToneMapping, toneMappingExposure: 0.8 }}
      >
        {/* <color attach="background" args={['#0a1420']} /> */}
        <fog attach="fog" args={['#0a1420', 12, 26]} />
        <CameraLight />
        <ContextBridge
          cameraRef={cameraRef}
          controlsRef={controlsRef}
          captureRef={captureRef}
        />
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
        {/* <Environment files="/hdri/studio_small_03_1k.hdr" background={false} /> */}
        {/* <Environment preset="warehouse" background={false} /> */}
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}
