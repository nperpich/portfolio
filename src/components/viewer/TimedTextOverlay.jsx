import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';

function opacityFor(cue, time) {
  const fade = cue.fadeDuration ?? 0;
  if (time < cue.start || time > cue.end) return 0;
  if (fade > 0 && time < cue.start + fade) {
    return (time - cue.start) / fade;
  }
  if (fade > 0 && time > cue.end - fade) {
    return (cue.end - time) / fade;
  }
  return 1;
}

// Fades text cues in/out against the model's animation clock. Opacity is
// written straight to the DOM each frame (not React state) for the same
// reason the shared timeline is a ref, not state — this runs every frame.
export function TimedTextOverlay({ cues, timelineRef }) {
  const elRefs = useRef([]);

  useFrame(() => {
    const time = timelineRef.current.time;
    cues.forEach((cue, i) => {
      const el = elRefs.current[i];
      if (el) el.style.opacity = opacityFor(cue, time);
    });
  });

  return (
    <Html fullscreen style={{ pointerEvents: 'none' }}>
      <div
        style={{
          position: 'absolute',
          bottom: 96,
          left: '50%',
          transform: 'translateX(-50%)',
          textAlign: 'center',
          maxWidth: 480,
        }}
      >
        {cues.map((cue, i) => (
          <div
            key={i}
            ref={(el) => (elRefs.current[i] = el)}
            style={{
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '100%',
              opacity: 0,
              color: '#cfe8ef',
              fontSize: 15,
              textShadow: '0 1px 4px rgba(0,0,0,0.6)',
            }}
          >
            {cue.text}
          </div>
        ))}
      </div>
    </Html>
  );
}
