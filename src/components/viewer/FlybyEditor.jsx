import { useEffect, useState } from 'react';

const round = (n) => Math.round(n * 1000) / 1000;
const roundArr = (a) => a.map(round);

// Camera-point authoring UI for FlybyCamera. Rendered as a plain DOM panel
// alongside (not inside) the Canvas — cameraRef/controlsRef come from
// DesignStage's ContextBridge. Deliberately not a <Html> overlay: Html hides
// itself whenever its 3D anchor point rotates behind the camera, which made
// this panel disappear mid-orbit. A plain absolutely-positioned DOM element
// has no such 3D-anchor visibility check. Only mounted by the page when
// editMode is true.
export function FlybyEditor({
  points,
  onChange,
  cameraRef,
  controlsRef,
  selectedIndex,
  setSelectedIndex,
}) {
  const selected = selectedIndex !== null ? points[selectedIndex] : null;
  const [step, setStep] = useState(0.1);

  // Snap the live camera to the selected point's exact shot, so you see it
  // before orbiting away to adjust. Deliberately keyed only on
  // selectedIndex (not points) — this should fire when you pick a point,
  // not every time you nudge its look-at afterward, otherwise editing the
  // look-at would keep yanking the camera back to the old shot.
  useEffect(() => {
    if (selectedIndex === null) return;
    const point = points[selectedIndex];
    const camera = cameraRef?.current;
    if (!camera || !point) return;
    camera.position.set(...point.position);
    camera.lookAt(...point.target);
    const controls = controlsRef?.current;
    if (controls) {
      controls.target.set(...point.target);
      controls.update();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedIndex]);

  const recordPoint = () => {
    const camera = cameraRef?.current;
    if (!camera) return;
    const position = roundArr(camera.position.toArray());
    const previous = points[points.length - 1];
    // Inherit the previous point's look-at rather than the live orbit
    // target — you're usually orbiting around the same subject, so this
    // keeps consecutive points aimed at the same spot by default instead of
    // picking up wherever the target happened to drift to.
    const controlsTarget = controlsRef?.current?.target;
    const target = previous
      ? previous.target
      : controlsTarget
        ? roundArr(controlsTarget.toArray())
        : [0, 0, 0];
    const time = points.length ? points[points.length - 1].time + 1 : 0;
    onChange([...points, { time, position, target }]);
    setSelectedIndex(points.length);
  };

  const updateSelectedFromView = () => {
    const camera = cameraRef?.current;
    const target = controlsRef?.current?.target;
    if (!camera || selectedIndex === null) return;
    const position = roundArr(camera.position.toArray());
    const targetArr = target
      ? roundArr(target.toArray())
      : points[selectedIndex].target;
    onChange(
      points.map((p, i) =>
        i === selectedIndex ? { ...p, position, target: targetArr } : p,
      ),
    );
  };

  // Shared by both the Position and Look-at sections below. Live-nudges the
  // actual camera/controls too — for position that's `camera.position`
  // directly (OrbitControls' next update() re-derives its internal spherical
  // state from wherever the camera currently is, so this doesn't fight it);
  // for target it's `controls.target`, same as before.
  const setSelectedFieldAxis = (field, axis, value) => {
    if (Number.isNaN(value) || selectedIndex === null) return;
    onChange(
      points.map((p, i) =>
        i === selectedIndex
          ? { ...p, [field]: p[field].map((v, a) => (a === axis ? value : v)) }
          : p,
      ),
    );
    const axisKey = ['x', 'y', 'z'][axis];
    const camera = cameraRef?.current;
    const controls = controlsRef?.current;
    if (field === 'position' && camera) {
      camera.position[axisKey] = value;
      controls?.update();
    } else if (field === 'target' && controls) {
      controls.target[axisKey] = value;
      controls.update();
    }
  };

  const nudgeSelectedField = (field, axis, delta) => {
    if (selectedIndex === null) return;
    setSelectedFieldAxis(field, axis, round(points[selectedIndex][field][axis] + delta));
  };

  const updateTime = (index, time) => {
    if (Number.isNaN(time)) return;
    onChange(points.map((p, i) => (i === index ? { ...p, time } : p)));
  };

  const deletePoint = (index) => {
    onChange(points.filter((_, i) => i !== index));
    setSelectedIndex((sel) =>
      sel === index ? null : sel > index ? sel - 1 : sel,
    );
  };

  const copyAsJson = () => {
    navigator.clipboard.writeText(JSON.stringify(points, null, 2));
  };

  return (
    <div
      style={{
        position: 'absolute',
        top: 112,
        right: 12,
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        width: 190,
        background: 'rgba(14, 30, 44, 0.85)',
        border: '1px solid #1c3a4a',
        borderRadius: 6,
        padding: 6,
        color: '#cfe8ef',
        fontSize: 10,
        fontFamily: 'monospace',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ textTransform: 'uppercase', color: '#7fa6b3' }}>
          Points
        </span>
        <button onClick={recordPoint}>+ record</button>
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          maxHeight: 90,
          overflowY: 'auto',
        }}
      >
        {points.map((p, i) => (
          <div
            key={i}
            onClick={() => setSelectedIndex(i)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              cursor: 'pointer',
              background: i === selectedIndex ? '#1c3a4a' : 'transparent',
              borderRadius: 3,
              padding: '1px 3px',
            }}
          >
            <span>t=</span>
            <input
              type="number"
              step="0.1"
              value={p.time}
              onClick={(e) => e.stopPropagation()}
              onChange={(e) => updateTime(i, parseFloat(e.target.value))}
              style={{ width: 36 }}
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                deletePoint(i);
              }}
              style={{ marginLeft: 'auto' }}
            >
              ✕
            </button>
          </div>
        ))}
        {points.length === 0 && (
          <span style={{ color: '#5c8496', fontStyle: 'italic' }}>
            Orbit, then "+ record".
          </span>
        )}
      </div>

      {selectedIndex !== null && selected && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
            borderTop: '1px solid #1c3a4a',
            paddingTop: 4,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#7fa6b3' }}>#{selectedIndex}</span>
            <select
              value={step}
              onChange={(e) => setStep(parseFloat(e.target.value))}
              style={{ fontSize: 9 }}
            >
              {[0.05, 0.1, 0.5, 1, 5].map((s) => (
                <option key={s} value={s}>
                  ±{s}
                </option>
              ))}
            </select>
            <button onClick={updateSelectedFromView}>from view</button>
          </div>

          {['position', 'target'].map((field) => (
            <div key={field} style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <span style={{ width: 24, color: '#7fa6b3' }}>
                {field === 'position' ? 'pos' : 'look'}
              </span>
              {['x', 'y', 'z'].map((label, axis) => (
                <input
                  key={label}
                  type="number"
                  step={step}
                  title={label}
                  value={selected[field][axis]}
                  onChange={(e) =>
                    setSelectedFieldAxis(field, axis, parseFloat(e.target.value) || 0)
                  }
                  style={{ width: 40 }}
                />
              ))}
            </div>
          ))}
        </div>
      )}

      <button onClick={copyAsJson}>Copy as JSON</button>
    </div>
  );
}
