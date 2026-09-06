// src/components/VenturePlug.jsx
import { useEffect, useRef } from 'react';
import { useGLTF, useAnimations } from '@react-three/drei';
import gsap from 'gsap';

// Placeholder ranges — swap these for your motion study's real timing
export const STEPS = [
  { label: 'Assembled', start: 0, end: 1.2 },
  { label: 'Exploded', start: 1.2, end: 2.8 },
  { label: 'Reassembled', start: 2.8, end: 4.0 },
];

export function VenturePlug({ step, ...props }) {
  const group = useRef();
  const { scene, animations } = useGLTF('/models/test_3/test_3.gltf');
  const { actions, names } = useAnimations(animations, group);
  const isFirstRun = useRef(true);
  // On load: grab the clip, play it, then immediately freeze it.
  // We stay in control of .time from here on — the mixer keeps
  // applying whatever time we set, it just won't advance on its own.
  useEffect(() => {
    const action = actions[names[0]];
    console.log('clip duration:', action.getClip().duration); // check this against your STEPS values
    action.reset().play();
    action.paused = true;
    action.time = 0;
  }, [actions, names]);

  // Whenever the parent tells us to go to a different step,
  // tween the playhead there instead of jump-cutting.
  useEffect(() => {
    const action = actions[names[0]];
    if (!action) return;

    if (isFirstRun.current) {
      action.reset().play();
      action.paused = true;
      action.time = STEPS[step].start;
      isFirstRun.current = false;
      return;
    }

    // No reset() here — just move the existing playhead
    gsap.to(action, {
      time: STEPS[step].end,
      duration: 1,
      ease: 'power1.inOut',
      overwrite: true,
    });
  }, [step, actions, names]);

  return <primitive ref={group} object={scene} {...props} />;
}
