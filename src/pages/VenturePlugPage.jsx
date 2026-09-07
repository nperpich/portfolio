import { useRef, useState } from 'react';
import { OrbitControls } from '@react-three/drei';
import { DesignStage } from '../components/viewer/DesignStage';
import { FlybyCamera } from '../components/viewer/FlybyCamera';
import { FlybyEditor } from '../components/viewer/FlybyEditor';
import { StepControls } from '../components/viewer/StepControls';
import { TimedTextOverlay } from '../components/viewer/TimedTextOverlay';
import { TimeScrubber } from '../components/viewer/TimeScrubber';
import { ModelRig } from '../components/designs/VenturePlug/ModelRig';
import {
  modelUrl,
  steps,
  flybyPoints,
  textCues,
} from '../components/designs/VenturePlug/venturePlug.config';

export default function VenturePlugPage() {
  const [stepIndex, setStepIndex] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [points, setPoints] = useState(flybyPoints);
  const [action, setAction] = useState(null);
  // The model's AnimationAction.time is the one real clock. It changes every
  // frame during a GSAP tween, so it lives in a ref, not useState — piping
  // it through React state would re-render this whole page 60x/sec.
  const timelineRef = useRef({ time: 0 });
  // Live camera + OrbitControls (from DesignStage's ContextBridge), read by
  // FlybyEditor's "Record point" — plain refs, not state, since they're only
  // read on click, never used to drive rendering.
  const cameraRef = useRef();
  const controlsRef = useRef();

  return (
    <div
      style={{
        width: '100%',
        height: '100dvh',
        paddingTop: '100px',
        position: 'relative',
      }}
    >
      <DesignStage
        modelUrl={modelUrl}
        editMode={editMode}
        cameraRef={cameraRef}
        controlsRef={controlsRef}
      >
        <ModelRig
          modelUrl={modelUrl}
          steps={steps}
          stepIndex={stepIndex}
          timelineRef={timelineRef}
          onActionReady={setAction}
        />
        <FlybyCamera points={points} timelineRef={timelineRef} editMode={editMode} />
        {editMode && <OrbitControls makeDefault />}
        <TimedTextOverlay cues={textCues} timelineRef={timelineRef} />
      </DesignStage>

      {/* Edit-mode-only DOM overlays live outside the Canvas so they're
          plain CSS `position: absolute` — no drei <Html> behind-camera
          check to make them vanish mid-orbit. */}
      {editMode && (
        <>
          <TimeScrubber action={action} />
          <FlybyEditor
            points={points}
            onChange={setPoints}
            cameraRef={cameraRef}
            controlsRef={controlsRef}
          />
        </>
      )}

      <StepControls steps={steps} stepIndex={stepIndex} onChange={setStepIndex} />

      <button
        onClick={() => setEditMode((v) => !v)}
        style={{ position: 'absolute', top: 112, left: 12 }}
      >
        {editMode ? 'Edit mode: ON' : 'Edit mode: OFF'}
      </button>
    </div>
  );
}
