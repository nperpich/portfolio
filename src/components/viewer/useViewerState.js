import { useRef, useState } from 'react';

// Shared state/refs for a project viewer — extracted so ProjectViewer's own
// body stays focused on layout/composition rather than wiring.
export function useViewerState(initialPoints) {
  const [editMode, setEditMode] = useState(false);
  const [points, setPoints] = useState(initialPoints);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [action, setAction] = useState(null);
  // The model's AnimationAction.time (or ModelRig's fallback clock) is the
  // one real clock. It changes every frame, so it lives in a ref, not
  // useState — piping it through React state would re-render the whole
  // page 60x/sec.
  const timelineRef = useRef({ time: 0 });
  // Live camera + OrbitControls (from DesignStage's ContextBridge), read by
  // FlybyEditor's "Record point" — plain refs, not state, since they're
  // only read on click, never used to drive rendering.
  const cameraRef = useRef();
  const controlsRef = useRef();
  // Independent clock for FlybyScrubber's preview — deliberately separate
  // from timelineRef so previewing the camera path never touches the
  // model's animation. `previewing` is state (not just part of the ref)
  // because it also has to gate whether <OrbitControls> is mounted.
  const previewRef = useRef({ time: 0 });
  const [previewing, setPreviewing] = useState(false);

  return {
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
  };
}
