import { useEffect, useRef, useState } from 'react';

// Independent play/scrub preview for the recorded flyby path — deliberately
// decoupled from the model's timeline (TimeScrubber/timelineRef). Dragging
// or playing this moves only the camera, via its own previewRef, so you can
// check the recorded shot without triggering the explode/reassemble tween.
// `previewing` is lifted to the page because it also has to gate whether
// <OrbitControls> is mounted (see VenturePlugPage) — otherwise OrbitControls'
// own per-frame update() would fight this for control of the camera.
export function FlybyScrubber({ points, previewRef, setPreviewing }) {
  const maxTime = points.length ? points[points.length - 1].time : 0;
  const inputRef = useRef();
  const rafRef = useRef();
  const lastTsRef = useRef(0);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!playing) return;

    lastTsRef.current = performance.now();
    const tick = (ts) => {
      const dt = (ts - lastTsRef.current) / 1000;
      lastTsRef.current = ts;
      const next = Math.min(maxTime, previewRef.current.time + dt);
      previewRef.current.time = next;
      if (inputRef.current) inputRef.current.value = next;

      if (next >= maxTime) {
        setPlaying(false);
        setPreviewing(false);
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [playing, maxTime, previewRef, setPreviewing]);

  const togglePlay = () => {
    if (playing) {
      setPlaying(false);
      setPreviewing(false);
      return;
    }
    if (previewRef.current.time >= maxTime) previewRef.current.time = 0;
    setPreviewing(true);
    setPlaying(true);
  };

  const handleScrub = (e) => {
    setPlaying(false);
    previewRef.current.time = parseFloat(e.target.value);
    setPreviewing(true);
  };

  const releaseScrub = () => {
    if (!playing) setPreviewing(false);
  };

  if (!points.length) return null;

  return (
    <div
      style={{
        position: 'absolute',
        top: 200,
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
      <button onClick={togglePlay}>{playing ? '⏸' : '▶'}</button>
      <span>flyby</span>
      <input
        ref={inputRef}
        type="range"
        min={0}
        max={maxTime}
        step={0.01}
        defaultValue={previewRef.current.time}
        onChange={handleScrub}
        onMouseUp={releaseScrub}
        onTouchEnd={releaseScrub}
      />
    </div>
  );
}
