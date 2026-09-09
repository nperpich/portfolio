import { useMemo } from 'react';
import { Line, Html } from '@react-three/drei';
import { buildFlybyCurves } from './flybyMath';

// In-scene markers for each recorded flyby point — click one to select it
// for editing in FlybyEditor. Selecting shows its look-at point and a dashed
// line to it. The connecting line follows the same Catmull-Rom curve
// FlybyCamera actually flies, so what you see here is what you get — not a
// straight-line approximation of it. Rendered inside the Canvas (needs real
// 3D positions), only mounted by the page in editMode.
export function PathVisual({ points, selectedIndex, onSelect }) {
  const curves = useMemo(() => buildFlybyCurves(points), [points]);
  const linePoints = useMemo(
    () => (curves ? curves.posCurve.getPoints(200) : []),
    [curves],
  );

  return (
    <>
      {linePoints.length > 0 && (
        <Line
          points={linePoints}
          color="#4fd1e8"
          lineWidth={1.5}
          transparent
          opacity={0.4}
        />
      )}
      {points.map((p, i) => {
        const active = i === selectedIndex;
        return (
          <group key={i}>
            <mesh
              position={p.position}
              onClick={(e) => {
                e.stopPropagation();
                onSelect(i);
              }}
            >
              <sphereGeometry args={[active ? 0.11 : 0.08, 16, 16]} />
              <meshBasicMaterial color={active ? '#f5a623' : '#7a8f99'} />
            </mesh>
            <Html distanceFactor={8} position={p.position}>
              <div
                style={{
                  pointerEvents: 'none',
                  transform: 'translateY(-16px)',
                  borderRadius: 4,
                  background: 'rgba(10, 20, 32, 0.7)',
                  padding: '0 4px',
                  fontSize: 10,
                  color: '#cfe8ef',
                }}
              >
                {i}
              </div>
            </Html>
            {active && (
              <>
                <mesh position={p.target}>
                  <sphereGeometry args={[0.07, 16, 16]} />
                  <meshBasicMaterial color="#ff5fd1" />
                </mesh>
                <Line
                  points={[p.position, p.target]}
                  color="#ff5fd1"
                  lineWidth={1}
                  dashed
                  dashSize={0.1}
                  gapSize={0.08}
                  transparent
                  opacity={0.7}
                />
              </>
            )}
          </group>
        );
      })}
    </>
  );
}
