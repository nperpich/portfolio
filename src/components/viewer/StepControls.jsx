// Purely presentational — no animation logic, just label + prev/next.
export function StepControls({ steps, stepIndex, onChange }) {
  return (
    <div
      style={{
        position: 'absolute',
        // Real Chrome-for-Android can dock its toolbar at the bottom of the
        // screen and visually overlap the last ~50-60px of the page even
        // though `dvh` reports that area as part of the viewport — a known
        // inconsistency in how it tracks its own dynamic chrome (desktop
        // mobile-emulation doesn't reproduce it, since there's no real
        // toolbar to dock). env(safe-area-inset-bottom) is the standard hook
        // browsers expose for exactly this; the extra 32px is a safety
        // buffer on top of it for the cases the inset alone doesn't cover.
        bottom: 'calc(env(safe-area-inset-bottom, 0px) + 32px)',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        color: '#cfe8ef',
        fontFamily: 'sans-serif',
      }}
    >
      <button
        onClick={() => onChange(Math.max(0, stepIndex - 1))}
        disabled={stepIndex === 0}
      >
        ←
      </button>
      <span>{steps[stepIndex]?.label}</span>
      <button
        onClick={() => onChange(Math.min(steps.length - 1, stepIndex + 1))}
        disabled={stepIndex === steps.length - 1}
      >
        →
      </button>
    </div>
  );
}
