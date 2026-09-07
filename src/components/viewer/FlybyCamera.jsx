import { useFrame, useThree } from '@react-three/fiber';

const lerp = (a, b, t) => a + (b - a) * t;
const lerpVec = (a, b, t) => [
  lerp(a[0], b[0], t),
  lerp(a[1], b[1], t),
  lerp(a[2], b[2], t),
];

// Drives the camera along the recorded flyby points, keyed to the model's
// own animation clock (timelineRef.current.time) rather than its own clock —
// so the camera and the model explosion/reassembly always stay in sync.
export function FlybyCamera({ points, timelineRef, editMode }) {
  const { camera } = useThree();

  useFrame(() => {
    // OrbitControls owns the camera while authoring — stay out of the way.
    if (editMode || !points || points.length < 1) return;

    const time = timelineRef.current.time;
    let i = 0;
    while (i < points.length - 1 && points[i + 1].time <= time) i++;
    const a = points[i];
    const b = points[Math.min(i + 1, points.length - 1)];
    const span = b.time - a.time;
    const t = span > 0 ? Math.min(Math.max((time - a.time) / span, 0), 1) : 0;

    camera.position.set(...lerpVec(a.position, b.position, t));
    camera.lookAt(...lerpVec(a.target, b.target, t));
  });

  return null;
}
