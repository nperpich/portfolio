import { useRef } from 'react';
import { OrbitControls } from '@react-three/drei';
import './ProjectViewer.css';
import { DesignStage } from './DesignStage';
import { FlybyCamera } from './FlybyCamera';
import { PathVisual } from './PathVisual';
import { StepLabels } from './StepLabels';
import { TimedTextOverlay } from './TimedTextOverlay';
import { EditOverlays } from './EditOverlays';
import { ProjectText } from './ProjectText';
import { ModelRig as DefaultModelRig } from './ModelRig';
import { useViewerState } from './useViewerState';
import { theme } from './theme';

// The edit toggle (and edit mode itself) only shows up in dev, or when a
// visitor explicitly asks for it via ?edit — it's an authoring tool, not
// something real site visitors should stumble into.
const EDIT_ENABLED =
  import.meta.env.DEV ||
  new URLSearchParams(window.location.search).has('edit');

// Generic, config-driven project viewer — a project's own config (see
// components/designs/*/project.config.js) supplies the model, timing, and
// copy; this component is the same for every project. Adding a new project
// should mean "write a new config file," not "write new components."
export function ProjectViewer({ project }) {
  const {
    slug,
    modelUrl,
    steps,
    flybyPoints,
    textCues,
    loopEndTime,
    title,
    sections,
    Rig,
  } = project;
  const Model = Rig || DefaultModelRig;

  const {
    editMode,
    setEditMode,
    points,
    setPoints,
    selectedIndex,
    setSelectedIndex,
    action,
    setAction,
    timelineRef,
    cameraRef,
    controlsRef,
    previewRef,
    previewing,
    setPreviewing,
  } = useViewerState(flybyPoints);

  // Exposes { gl, scene, camera } (see DesignStage's ContextBridge) for the
  // "Capture thumbnail" button below.
  const captureRef = useRef(null);

  const handleCaptureThumbnail = () => {
    const ctx = captureRef.current;
    if (!ctx) return;
    const { gl, scene, camera } = ctx;
    const size = 800;
    const prevWidth = gl.domElement.width;
    const prevHeight = gl.domElement.height;
    const prevAspect = camera.aspect;

    // Render a square frame off the current camera — not a crop of the
    // normal 4:3 view, an actual square-aspect render — then restore the
    // real canvas size/aspect and re-render so the visible viewer doesn't
    // stay squashed.
    camera.aspect = 1;
    camera.updateProjectionMatrix();
    gl.setSize(size, size, false);
    gl.render(scene, camera);
    const dataUrl = gl.domElement.toDataURL('image/webp', 0.92);

    camera.aspect = prevAspect;
    camera.updateProjectionMatrix();
    gl.setSize(prevWidth, prevHeight, false);
    gl.render(scene, camera);

    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `${slug}.webp`;
    link.click();
  };

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
      <div className="project-layout">
        <div className="project-3d-wrap">
          <DesignStage
            modelUrl={modelUrl}
            editMode={editMode}
            cameraRef={cameraRef}
            controlsRef={controlsRef}
            captureRef={captureRef}
          >
            <Model
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

          {editMode && (
            <EditOverlays
              action={action}
              points={points}
              onChangePoints={setPoints}
              cameraRef={cameraRef}
              controlsRef={controlsRef}
              selectedIndex={selectedIndex}
              setSelectedIndex={setSelectedIndex}
              previewRef={previewRef}
              setPreviewing={setPreviewing}
            />
          )}

          <StepLabels steps={steps} timelineRef={timelineRef} />

          {EDIT_ENABLED && (
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
          )}

          {editMode && (
            <button
              onClick={handleCaptureThumbnail}
              style={{
                position: 'absolute',
                top: 12,
                left: 48,
                height: 28,
                padding: '0 10px',
                display: 'flex',
                alignItems: 'center',
                borderRadius: 6,
                border: `1px solid ${theme.border}`,
                background: theme.panelBg,
                color: theme.textPrimary,
                fontSize: 12,
                fontFamily: theme.font,
                cursor: 'pointer',
              }}
            >
              Capture thumbnail
            </button>
          )}
        </div>

        <div className="project-text-wrap">
          <ProjectText title={title} sections={sections} />
        </div>
      </div>
    </div>
  );
}
