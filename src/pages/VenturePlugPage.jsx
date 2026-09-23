import { useEffect, useRef, useState } from 'react';
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
import { theme } from '../components/viewer/theme';
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
  // Mobile-only: .project-3d-wrap starts full-size/uncropped and flips into
  // its clipped, collapsed state once scrolled past a small threshold — a
  // binary toggle, not a value tied continuously to scroll position, so the
  // CSS transition on .project-3d-wrap/.design-stage-frame animates it as a
  // single smooth step rather than scrubbing frame-by-frame with scroll.
  const [collapsed, setCollapsed] = useState(false);
  const scrollLayoutRef = useRef(null);

  useEffect(() => {
    const layoutEl = scrollLayoutRef.current;
    if (!layoutEl) return;
    const handleScroll = () => setCollapsed(layoutEl.scrollTop > 5);
    layoutEl.addEventListener('scroll', handleScroll, { passive: true });
    return () => layoutEl.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        boxSizing: 'border-box',
        background: theme.pageBg,
        fontFamily: theme.font,
      }}
    >
      <div className="project-layout" ref={scrollLayoutRef}>
        <div className={`project-3d-wrap${collapsed ? ' is-collapsed' : ''}`}>
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
              border: `1px solid ${theme.border}`,
              background: editMode ? theme.textPrimary : theme.panelBg,
              color: editMode ? '#ffffff' : theme.textPrimary,
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
            color: theme.textSecondary,
            fontFamily: theme.font,
            textAlign: 'left',
          }}
        >
          <h2 style={{ marginTop: 0, color: theme.textPrimary }}>
            Large Custom Shower Former
          </h2>
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
