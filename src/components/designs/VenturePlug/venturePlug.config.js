export const modelUrl = '/models/test_3/test_3.gltf';

// Times line up with the "Motion Study 1" clip baked into the .gltf —
// pulled from the previous hardcoded STEPS start values in VenturePlug.jsx.
export const steps = [
  { label: 'Assembled', time: 0 },
  { label: 'Exploded', time: 1.2 },
  { label: 'Reassembled', time: 2.8 },
];

// Pulled from the previous orbit-and-capture waypoint editor's tuned shots
// for this model (real coordinates, not a generic placeholder) — refine
// further in editMode with FlybyEditor's "Record point" as needed.
//
// Times rescaled from the originally-recorded [0..7] range down to [0..2.8]
// (factor 2.8/7 = 0.4) — the model's clip time never advances past the last
// step's time (2.8), so points beyond that were unreachable dead weight, and
// having the first four crammed into 0..1.3 made the camera swing through
// nearly half an orbit inside a single 1s step tween. Positions/targets are
// untouched — just spread across the range that's actually reachable.
export const flybyPoints = [
  {
    time: 0,
    position: [2.832, 3.099, 4.625],
    target: [1.021, 0.35, 1.484],
  },
  {
    time: 0.16,
    position: [4.735, 2.807, 2.417],
    target: [1.021, 0.35, 1.484],
  },
  {
    time: 0.36,
    position: [3.771, 3.345, -0.559],
    target: [1.021, 0.35, 1.484],
  },
  {
    time: 0.52,
    position: [2.441, 2.418, -2.313],
    target: [1.021, 0.35, 1.484],
  },
  {
    time: 1.6,
    position: [-1.264, 2.045, -2.068],
    target: [1.021, 0.35, 1.484],
  },
  {
    time: 2.0,
    position: [-3.364, 1.325, 2.215],
    target: [1.021, 0.35, 1.484],
  },
  {
    time: 2.4,
    position: [-1.513, 0.874, 3.329],
    target: [1.021, 0.35, 1.484],
  },
  {
    time: 2.8,
    position: [1.063, 0.601, 3.004],
    target: [0.499, 0.458, 1.864],
  },
];

// Placeholder — swap in real copy once the timing above is tuned.
export const textCues = [
  {
    text: 'Single-piece plug body.',
    start: 0,
    end: 1.0,
    fadeDuration: 0.3,
  },
  {
    text: 'Exploding to show the internal seal.',
    start: 1.2,
    end: 2.6,
    fadeDuration: 0.3,
  },
];
