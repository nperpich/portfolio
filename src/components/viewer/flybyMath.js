import * as THREE from 'three';

// Catmull-Rom curves through the recorded points — this is what makes the
// camera arc smoothly between shots instead of cutting straight lines with
// sharp corners at each point (ported from the standalone flythrough editor
// reference, which built curves the same way for both the preview line and
// the actual camera drive).
export function buildFlybyCurves(points) {
  if (!points || points.length < 2) return null;
  const posCurve = new THREE.CatmullRomCurve3(
    points.map((p) => new THREE.Vector3(...p.position)),
    false,
    'catmullrom',
    0.5,
  );
  const targetCurve = new THREE.CatmullRomCurve3(
    points.map((p) => new THREE.Vector3(...p.target)),
    false,
    'catmullrom',
    0.5,
  );
  return { posCurve, targetCurve };
}

// The curve's own u∈[0,1] parameter corresponds to control-point *index*
// spacing (point i sits at u = i/(n-1)), not to our authored `time` values.
// This maps a given time to the matching u, by finding the bracketing
// points and carrying their local fraction into the overall index — so
// playback still honors each point's authored pacing while getting smooth
// spline curvature from its neighbors, instead of a straight-line lerp.
export function timeToCurveU(points, time) {
  const n = points.length;
  if (n < 2) return 0;
  let i = 0;
  while (i < n - 2 && points[i + 1].time <= time) i++;
  const a = points[i];
  const b = points[i + 1];
  const span = b.time - a.time;
  const localT = span > 0 ? Math.min(Math.max((time - a.time) / span, 0), 1) : 0;
  return (i + localT) / (n - 1);
}
