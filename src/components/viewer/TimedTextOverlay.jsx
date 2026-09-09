import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

const CORNERS = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];
const MARGIN = 24;

function cornerStyle(corner) {
  const style = {};
  style[corner.includes('top') ? 'top' : 'bottom'] = MARGIN;
  style[corner.includes('left') ? 'left' : 'right'] = MARGIN;
  return style;
}

// The line has to start from whichever edge of the box actually faces the
// model, not a fixed side — e.g. a top-left box's line should leave from
// its bottom-right corner, not its top-left one.
function boxAnchor(corner, rect) {
  return {
    x: corner.includes('left') ? rect.right : rect.left,
    y: corner.includes('top') ? rect.bottom : rect.top,
  };
}

// Plain DOM overlay (not drei's <Html>) — same reasoning as FlybyEditor:
// Html hides itself when its 3D anchor rotates behind the camera, which is
// wrong for a screen-fixed corner box. Cues are keyed to stepIndex (not the
// model's continuous clock), so this needs no useFrame/Canvas access at all
// for the boxes themselves — only the connecting lines need the live camera
// (via cameraRef, from DesignStage's ContextBridge) to project lookAt
// points to screen space each frame.
export function TimedTextOverlay({ cues, stepIndex, cameraRef }) {
  // The cue currently assigned to each corner, kept even after it stops
  // being "active" so the box can fade out showing its last text instead
  // of going blank instantly.
  const [displayed, setDisplayed] = useState({});
  const boxRefs = useRef({});
  const lineRefs = useRef({});

  const activeCue = (corner) =>
    cues.find((c) => c.corner === corner && c.stepIndex === stepIndex);

  useEffect(() => {
    setDisplayed((prev) => {
      const next = { ...prev };
      for (const corner of CORNERS) {
        const match = activeCue(corner);
        if (match) next[corner] = match;
      }
      return next;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stepIndex, cues]);

  // Projects each visible cue's lookAt point to screen space every frame
  // and updates the SVG line directly (not React state — this runs at
  // rAF rate while the camera is moving through a step transition).
  useEffect(() => {
    let raf;
    const tick = () => {
      const camera = cameraRef?.current;
      for (const corner of CORNERS) {
        const cue = displayed[corner];
        const lineEl = lineRefs.current[corner];
        const boxEl = boxRefs.current[corner];
        const show = camera && boxEl && cue?.lookAt && !!activeCue(corner);
        if (lineEl) {
          if (show) {
            const projected = new THREE.Vector3(...cue.lookAt).project(camera);
            const x = (projected.x * 0.5 + 0.5) * window.innerWidth;
            const y = (-projected.y * 0.5 + 0.5) * window.innerHeight;
            const anchor = boxAnchor(corner, boxEl.getBoundingClientRect());
            lineEl.setAttribute('x1', anchor.x);
            lineEl.setAttribute('y1', anchor.y);
            lineEl.setAttribute('x2', x);
            lineEl.setAttribute('y2', y);
            lineEl.style.transition = `opacity ${cue.fadeDuration ?? 0.3}s ease`;
            lineEl.style.opacity = 1;
          } else {
            lineEl.style.opacity = 0;
          }
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displayed, stepIndex, cues, cameraRef]);

  return (
    <>
      <svg
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
        }}
      >
        {CORNERS.map((corner) => (
          <line
            key={corner}
            ref={(el) => (lineRefs.current[corner] = el)}
            stroke="#4fd1e8"
            strokeWidth={1.5}
            strokeDasharray="4 3"
            opacity={0}
          />
        ))}
      </svg>

      {CORNERS.map((corner) => {
        const cue = displayed[corner];
        if (!cue) return null;
        return (
          <div
            key={corner}
            ref={(el) => (boxRefs.current[corner] = el)}
            style={{
              position: 'absolute',
              ...cornerStyle(corner),
              maxWidth: 240,
              opacity: activeCue(corner) ? 1 : 0,
              transition: `opacity ${cue.fadeDuration ?? 0.3}s ease`,
              background: 'rgba(10, 20, 32, 0.75)',
              border: '1px solid #1c3a4a',
              borderRadius: 6,
              padding: '8px 12px',
              color: '#cfe8ef',
              fontFamily: 'sans-serif',
              fontSize: 13,
              lineHeight: 1.4,
              pointerEvents: 'none',
            }}
          >
            {cue.text}
          </div>
        );
      })}
    </>
  );
}
