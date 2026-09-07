// Dev-only scrubber bound directly to the model's AnimationAction.time,
// bypassing GSAP entirely — for finding step times by dragging until a pose
// looks right, instead of guessing/saving/reloading. Plain DOM, rendered as
// a sibling of the Canvas so it's a normal CSS `position: absolute` overlay,
// not gated by any 3D-anchor visibility check.
export function TimeScrubber({ action }) {
  if (!action) return null;

  return (
    <div
      style={{
        position: 'absolute',
        top: 156,
        left: 12,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        background: 'rgba(14, 30, 44, 0.9)',
        border: '1px solid #1c3a4a',
        borderRadius: 6,
        padding: '6px 10px',
        color: '#cfe8ef',
        fontSize: 11,
        fontFamily: 'monospace',
      }}
    >
      <span>time</span>
      <input
        type="range"
        min={0}
        max={action.getClip().duration}
        step={0.01}
        defaultValue={action.time}
        onChange={(e) => {
          action.paused = true;
          action.time = parseFloat(e.target.value);
        }}
      />
    </div>
  );
}
