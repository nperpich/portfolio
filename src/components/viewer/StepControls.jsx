// Purely presentational — no animation logic, just label + prev/next.
export function StepControls({ steps, stepIndex, onChange }) {
  return (
    <div
      style={{
        position: 'absolute',
        bottom: 24,
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
