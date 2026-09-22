export const modelUrl = '/models/cad_model567-optimized.glb';

// Times line up with the "Motion Study 1" clip baked into the .gltf —
// pulled from the previous hardcoded STEPS start values in VenturePlug.jsx.
export const steps = [
  { label: 'Assembled', time: 0 },
  { label: 'Assembled', time: 0.1 },
  { label: 'Exploded', time: 3 },
  { label: 'Reassembled', time: 10.5 },
  { label: 'Reassembled', time: 13 },
  { label: 'Reassembled', time: 17 },
  { label: 'Reassembled', time: 21.2 },
  { label: 'Reassembled', time: 24 },
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
    time: 0.5,
    position: [-1.955, 1.969, 3.503],
    target: [-0.6, -0.058, 0.55],
  },
  {
    time: 3,
    position: [1.749, 2.381, 2.338],
    target: [-0.6, -0.258, 0.55],
  },
  {
    time: 6,
    position: [1.749, 2.381, 2.338],
    target: [-0.6, -0.258, 0.55],
  },
];
// Each cue is keyed to a step index (not raw time) — it appears when that
// step becomes active, fades in over fadeDuration, and stays fully visible
// until you move to a step with no cue in that corner. Up to 4 can be shown
// at once, one per corner. `lookAt` is optional — a 3D point (same space as
// flybyPoints) the box draws a line to; omit it for no line.
// Placeholder — swap in real copy once the timing above is tuned.
export const textCues = [];
//   [
//   {
//     stepIndex: 0,
//     corner: 'top-left',
//     text: 'Single-piece plug body.',
//     fadeDuration: 0.3,
//     lookAt: [1.5, 0, 1.5],
//   },
//   {
//     stepIndex: 1,
//     corner: 'bottom-right',
//     text: 'Exploding to show the internal seal.',
//     fadeDuration: 0.3,
//     lookAt: [0.5, 0.0, 0.3],
//   },
// ];
