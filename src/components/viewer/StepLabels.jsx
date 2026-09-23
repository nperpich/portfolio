import { useEffect, useRef, useState } from 'react';
import { activeStepIndex } from './stepTiming';

// Step-label list, bottom-left, overlapping the 3D box. The model's clip
// now plays continuously on a loop — this just reads the live playhead
// time off timelineRef every frame and highlights whichever step's
// startTime/endTime range currently contains it.
export function StepLabels({ steps, timelineRef }) {
  // Config can list the same label more than once — collapse those into
  // one entry in the list, and treat it as active whenever the current
  // step's label matches, however many ranges share that label.
  const labels = [...new Set(steps.map((s) => s.label))];
  const [activeLabel, setActiveLabel] = useState(null);

  useEffect(() => {
    let raf;
    const tick = () => {
      const time = timelineRef?.current?.time ?? 0;
      const idx = activeStepIndex(steps, time);
      const label = idx >= 0 ? steps[idx].label : null;
      setActiveLabel((prev) => (prev === label ? prev : label));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [steps, timelineRef]);

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 'calc(env(safe-area-inset-bottom, 0px) + 16px)',
        left: 16,
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        background: 'rgba(10, 20, 32, 0.75)',
        border: '1px solid #1c3a4a',
        borderRadius: 6,
        padding: '10px 14px',
        fontFamily: 'sans-serif',
        fontSize: 13,
        pointerEvents: 'none',
      }}
    >
      {labels.map((label) => (
        <span
          key={label}
          style={{
            color: label === activeLabel ? '#ffffff' : '#5c7a87',
            fontWeight: label === activeLabel ? 600 : 400,
            transition: 'color 0.3s ease, font-weight 0.3s ease',
          }}
        >
          {label}
        </span>
      ))}
    </div>
  );
}
