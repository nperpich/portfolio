import { useRef, useState } from 'react';
import { OrbitControls } from '@react-three/drei';
import { DesignStage } from '../components/viewer/DesignStage';
import { FlybyCamera } from '../components/viewer/FlybyCamera';
import { FlybyEditor } from '../components/viewer/FlybyEditor';
import { FlybyScrubber } from '../components/viewer/FlybyScrubber';
import { PathVisual } from '../components/viewer/PathVisual';
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
  const [selectedIndex, setSelectedIndex] = useState(null);
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
  // Independent clock for FlybyScrubber's preview — deliberately separate
  // from timelineRef so previewing the camera path never touches the
  // model's animation. `previewing` is state (not just part of the ref)
  // because it also has to gate whether <OrbitControls> is mounted below.
  const previewRef = useRef({ time: 0 });
  const [previewing, setPreviewing] = useState(false);

  return (
    <div
      style={{
        width: '100%',
        height: '100dvh',
        paddingTop: '100px',
        position: 'relative',
        boxSizing: 'border-box',
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
        <FlybyCamera
          points={points}
          timelineRef={timelineRef}
          editMode={editMode}
          previewing={previewing}
          previewRef={previewRef}
        />
        {/* Unmounted while previewing — otherwise OrbitControls' own
            per-frame update() would fight FlybyCamera for the camera. */}
        {editMode && !previewing && <OrbitControls makeDefault />}
        {editMode && (
          <PathVisual
            points={points}
            selectedIndex={selectedIndex}
            onSelect={setSelectedIndex}
          />
        )}
        <TimedTextOverlay cues={textCues} timelineRef={timelineRef} />
      </DesignStage>

      {/* Edit-mode-only DOM overlays live outside the Canvas so they're
          plain CSS `position: absolute` — no drei <Html> behind-camera
          check to make them vanish mid-orbit. */}
      {editMode && (
        <>
          <TimeScrubber action={action} />
          <FlybyScrubber
            points={points}
            previewRef={previewRef}
            setPreviewing={setPreviewing}
          />
          <FlybyEditor
            points={points}
            onChange={setPoints}
            cameraRef={cameraRef}
            controlsRef={controlsRef}
            selectedIndex={selectedIndex}
            setSelectedIndex={setSelectedIndex}
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
