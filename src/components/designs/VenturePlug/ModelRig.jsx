import { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, useAnimations } from '@react-three/drei';
import gsap from 'gsap';

export function ModelRig({
  modelUrl,
  steps,
  stepIndex,
  timelineRef,
  onActionReady,
  ...props
}) {
  const group = useRef();
  const { scene, animations } = useGLTF(modelUrl);
  const { actions, names } = useAnimations(animations, group);
  const isFirstRun = useRef(true);

  // Whenever the parent tells us to go to a different step, tween the
  // playhead there instead of jump-cutting. On mount only: play + pause the
  // clip and jump straight to the initial step's time with no tween, so
  // there's no visible snap-to-zero-then-tween-away flash.
  useEffect(() => {
    const action = actions[names[0]];
    if (!action) return;

    if (isFirstRun.current) {
      action.reset().play();
      action.paused = true;
      action.time = steps[stepIndex]?.time ?? 0;
      isFirstRun.current = false;
      return;
    }

    // No reset() here — reset() snaps time back to 0 as a side effect, so
    // calling it on every step change would restart the clip from scratch
    // instead of tweening from wherever it currently is.
    //
    // Duration follows the actual gap between the current and target step
    // times (1 real second per 1 time unit) — a fixed duration would make
    // playback speed swing wildly whenever the step times in the config
    // change, since a bigger time gap would have to be covered in the same
    // fixed wall-clock time.
    const targetTime = steps[stepIndex].time;
    const duration = Math.abs(targetTime - action.time);
    gsap.to(action, {
      time: targetTime,
      duration,
      ease: 'power1.inOut',
      overwrite: true,
    });
  }, [stepIndex, actions, names, steps]);

  // The model's AnimationAction.time is the one real clock — write it to the
  // shared ref every frame so FlybyCamera/TimedTextOverlay can read it
  // without going through React state (which would re-render 60x/sec).
  useFrame(() => {
    const action = actions[names[0]];
    if (action && timelineRef) timelineRef.current.time = action.time;
  });

  // Hand the live action up to the page once it exists, so a plain-DOM time
  // scrubber can be rendered outside the Canvas (see TimeScrubber) — this is
  // a one-time "it's ready" notification, not a per-frame update.
  const action = actions[names[0]];
  useEffect(() => {
    if (action && onActionReady) onActionReady(action);
  }, [action, onActionReady]);

  return <primitive ref={group} object={scene} {...props} />;
}
