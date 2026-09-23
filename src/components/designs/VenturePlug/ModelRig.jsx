import { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, useAnimations } from '@react-three/drei';
import { LoopRepeat } from 'three';

// The clip just plays continuously on a loop now — step labels are derived
// from the live playhead time (see stepTiming.js), not from tweening the
// model to discrete snapshots. editMode pauses playback (via the paused
// flag, not stopping the mixer) so FlybyEditor/TimeScrubber can hold the
// model still at an exact time while tuning a shot.
export function ModelRig({ modelUrl, editMode, timelineRef, onActionReady, ...props }) {
  const group = useRef();
  const { scene, animations } = useGLTF(modelUrl);
  const { actions, names } = useAnimations(animations, group);
  // Not React state on purpose: `actions[names[0]]` can still be null on the
  // very first render (the mesh ref hasn't attached to the mixer's root
  // yet), so initialization has to happen once useFrame actually gets a
  // real action — reading it at render time risked silently never firing
  // again if nothing else happened to re-render this component afterward.
  const ready = useRef(false);

  // First real frame after mount: start the clip looping. Also the
  // one-time "it's ready" notification up to the page, for the plain-DOM
  // TimeScrubber.
  useFrame(() => {
    const action = actions[names[0]];
    if (!action) return;
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
    const action = actions[names[0]];
    if (action) action.paused = !!editMode;
  }, [editMode, actions, names]);

  return <primitive ref={group} object={scene} {...props} />;
}
