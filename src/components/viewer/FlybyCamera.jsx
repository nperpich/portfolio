import { useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { buildFlybyCurves, timeToCurveU } from './flybyMath';

// Drives the camera along a Catmull-Rom spline through the recorded points
// — smoothly arcing through each shot rather than cutting straight lines
// with sharp corners. In presentation mode it's keyed to the model's own
// animation clock (timelineRef.current.time) so the camera and the
// explosion/reassembly always stay in sync. In edit mode it stays hands-off
// (OrbitControls owns the camera) *unless* previewing is true, in which
// case it reads previewRef instead — an independent clock so FlybyScrubber
// can preview the camera path alone, without touching the model's
// animation at all.
export function FlybyCamera({
  points,
  timelineRef,
  editMode,
  previewing,
  previewRef,
}) {
  const { camera } = useThree();
  const curves = useMemo(() => buildFlybyCurves(points), [points]);

  useFrame(() => {
    if (!curves) return;
    if (editMode && !previewing) return;

    const time = editMode ? previewRef.current.time : timelineRef.current.time;
    const u = timeToCurveU(points, time);

    camera.position.copy(curves.posCurve.getPoint(u));
    camera.lookAt(curves.targetCurve.getPoint(u));
  });

  return null;
}
