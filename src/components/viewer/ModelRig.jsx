import { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, useAnimations } from '@react-three/drei';
import { LoopRepeat } from 'three';

// The default rig for ProjectViewer — a project's config can override this
// with its own `Rig` component for models needing bespoke logic.
//
// The clip just plays continuously on a loop — step labels are derived
// from the live playhead time (see stepTiming.js), not from tweening the
// model to discrete snapshots. editMode pauses playback (via the paused
// flag, not stopping the mixer) so FlybyEditor/TimeScrubber can hold the
// model still at an exact time while tuning a shot.
//
// If the GLB has no baked animation clip at all, there's nothing for the
// mixer to drive — timelineRef instead advances as a plain elapsed-time
// clock, so StepLabels/TimedTextOverlay/FlybyCamera still have a live
// "playhead" to read.
export function ModelRig({
  modelUrl,
  editMode,
  loopStartTime = 0,
  loopEndTime,
  timelineRef,
  onActionReady,
  ...props
}) {
  const group = useRef();
  const { scene, animations } = useGLTF(modelUrl);
  const { actions, names } = useAnimations(animations, group);
  const hasClip = names.length > 0;
  // Not React state on purpose: `actions[names[0]]` can still be null on the
  // very first render (the mesh ref hasn't attached to the mixer's root
  // yet), so initialization has to happen once useFrame actually gets a
  // real action — reading it at render time risked silently never firing
  // again if nothing else happened to re-render this component afterward.
  const ready = useRef(false);
  const fallbackClock = useRef(0);

  // First real frame after mount: start the clip looping. Also the
  // one-time "it's ready" notification up to the page, for the plain-DOM
  // TimeScrubber.
  useFrame((_state, delta) => {
    if (!hasClip) {
      if (!editMode) fallbackClock.current += delta;
      if (timelineRef) timelineRef.current.time = fallbackClock.current;
      return;
    }

    const action = actions[names[0]];
    if (!action) return;
    // The baked clip can run well past the last labeled step (dead/repeat
    // motion at the tail) — loop back to loopStartTime as soon as we pass
    // loopEndTime instead of waiting for the clip's own full duration, so
    // there's no unlabeled pause before it wraps.
    if (loopEndTime != null && !editMode && action.time >= loopEndTime) {
      action.time = loopStartTime;
    }
    if (timelineRef) timelineRef.current.time = action.time;
    if (!ready.current) {
      ready.current = true;
      action.reset();
      action.setLoop(LoopRepeat, Infinity);
      action.clampWhenFinished = false;
      action.paused = !!editMode;
      action.play();
      if (onActionReady) onActionReady(action);
    }
  });

  useEffect(() => {
    if (!hasClip) return;
    const action = actions[names[0]];
    if (action) action.paused = !!editMode;
  }, [editMode, actions, names, hasClip]);

  return <primitive ref={group} object={scene} {...props} />;
}
