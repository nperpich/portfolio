// Shared by StepLabels and TimedTextOverlay so both agree on which step is
// "active" for a given point in the model's continuous, looping playhead
// time — steps are startTime/endTime ranges now, not single snapshot times.
export function activeStepIndex(steps, time) {
  for (let i = 0; i < steps.length; i++) {
    const { startTime, endTime } = steps[i];
    // Last step's range is inclusive of its endTime so the final frame of a
    // loop still matches something right up until it wraps back to 0.
    if (time >= startTime && (time < endTime || i === steps.length - 1)) {
      return i;
    }
  }
  return -1;
}
