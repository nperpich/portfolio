const round = (n) => Math.round(n * 1000) / 1000;
const roundArr = (a) => a.map(round);

// Camera-point authoring UI for FlybyCamera. Rendered as a plain DOM panel
// alongside (not inside) the Canvas — cameraRef/controlsRef come from
// DesignStage's ContextBridge. Deliberately not a <Html> overlay: Html hides
// itself whenever its 3D anchor point rotates behind the camera, which made
// this panel disappear mid-orbit. A plain absolutely-positioned DOM element
// has no such 3D-anchor visibility check. Only mounted by the page when
// editMode is true.
export function FlybyEditor({ points, onChange, cameraRef, controlsRef }) {
  const recordPoint = () => {
    const camera = cameraRef?.current;
    const target = controlsRef?.current?.target;
    if (!camera) return;
    const position = roundArr(camera.position.toArray());
    const targetArr = target ? roundArr(target.toArray()) : [0, 0, 0];
    const time = points.length ? points[points.length - 1].time + 1 : 0;
    onChange([...points, { time, position, target: targetArr }]);
  };

  const updateTime = (index, time) => {
    if (Number.isNaN(time)) return;
    onChange(points.map((p, i) => (i === index ? { ...p, time } : p)));
  };

  const deletePoint = (index) => {
    onChange(points.filter((_, i) => i !== index));
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
        gap: 8,
        minWidth: 220,
        background: 'rgba(14, 30, 44, 0.9)',
        border: '1px solid #1c3a4a',
        borderRadius: 6,
        padding: 10,
        color: '#cfe8ef',
        fontSize: 11,
        fontFamily: 'monospace',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ textTransform: 'uppercase', color: '#7fa6b3' }}>
          Flyby points
        </span>
        <button onClick={recordPoint}>Record point</button>
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
          maxHeight: 160,
          overflowY: 'auto',
        }}
      >
        {points.map((p, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span>t=</span>
            <input
              type="number"
              step="0.1"
              value={p.time}
              onChange={(e) => updateTime(i, parseFloat(e.target.value))}
              style={{ width: 48 }}
            />
            <span style={{ color: '#7fa6b3' }}>
              [{p.position.map((n) => n.toFixed(1)).join(', ')}]
            </span>
            <button onClick={() => deletePoint(i)}>✕</button>
          </div>
        ))}
        {points.length === 0 && (
          <span style={{ color: '#5c8496', fontStyle: 'italic' }}>
            No points yet — orbit the view, then "Record point".
          </span>
        )}
      </div>

      <button onClick={copyAsJson}>Copy as JSON</button>
    </div>
  );
}
