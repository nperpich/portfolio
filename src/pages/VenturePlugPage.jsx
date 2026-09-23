import { useRef, useState } from 'react';
import { OrbitControls } from '@react-three/drei';
import './VenturePlugPage.css';
import { DesignStage } from '../components/viewer/DesignStage';
import { FlybyCamera } from '../components/viewer/FlybyCamera';
import { FlybyEditor } from '../components/viewer/FlybyEditor';
import { FlybyScrubber } from '../components/viewer/FlybyScrubber';
import { PathVisual } from '../components/viewer/PathVisual';
import { StepLabels } from '../components/viewer/StepLabels';
import { TimedTextOverlay } from '../components/viewer/TimedTextOverlay';
import { TimeScrubber } from '../components/viewer/TimeScrubber';
import { ModelRig } from '../components/designs/VenturePlug/ModelRig';
import {
  modelUrl,
  steps,
  flybyPoints,
  textCues,
  loopEndTime,
} from '../components/designs/VenturePlug/venturePlug.config';

export default function VenturePlugPage() {
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
        minHeight: '100dvh',
        paddingTop: '100px',
        boxSizing: 'border-box',
      }}
    >
      <div className="project-layout">
        <div className="project-3d-wrap">
          <DesignStage
            modelUrl={modelUrl}
            editMode={editMode}
            cameraRef={cameraRef}
            controlsRef={controlsRef}
          >
            <ModelRig
              modelUrl={modelUrl}
              editMode={editMode}
              loopEndTime={loopEndTime}
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
          </DesignStage>

          {/* Plain DOM, not inside the Canvas — the active step is derived
              from timelineRef's live playhead time, so no r3f context is
              needed for the boxes themselves; only the connecting lines
              read cameraRef. */}
          <TimedTextOverlay
            cues={textCues}
            steps={steps}
            timelineRef={timelineRef}
            cameraRef={cameraRef}
          />

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

          <StepLabels steps={steps} timelineRef={timelineRef} />

          <button
            onClick={() => setEditMode((v) => !v)}
            title={editMode ? 'Edit mode: ON' : 'Edit mode: OFF'}
            style={{
              position: 'absolute',
              top: 12,
              left: 12,
              width: 28,
              height: 28,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 6,
              border: '1px solid #1c3a4a',
              background: editMode
                ? 'rgba(79, 209, 232, 0.85)'
                : 'rgba(10, 20, 32, 0.55)',
              color: editMode ? '#0a1420' : '#cfe8ef',
              fontSize: 14,
              lineHeight: 1,
              cursor: 'pointer',
              padding: 0,
            }}
          >
            ✎
          </button>
        </div>

        <div
          className="project-text-wrap"
          style={{
            background: 'rgba(10, 20, 32, 0.92)',
            border: '1px solid #1c3a4a',
            borderRadius: 8,
            padding: '20px 14px',
            color: '#cfe8ef',
            fontFamily: 'sans-serif',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
            textAlign: 'left',
          }}
        >
          <h2 style={{ marginTop: 0 }}>Large Custom Shower Former</h2>
          <p style={{ lineHeight: 1.6 }}>
            A single vacuum former with interchangeable floor inserts, capable
            of producing showers of any requested size.
          </p>
          <ul style={{ lineHeight: 1.6, paddingLeft: 20, margin: 0 }}>
            <li>Reduces vacuum box count from 4+ down to 1</li>
            <li>Cuts changeover time to under 10 minutes</li>
            <li>
              Integrated heaters and quick-change tooling reduce part-to-part
              cycle time and prevent fixture damage
            </li>
            <li>
              Designed to accommodate electric motors for future automation
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
