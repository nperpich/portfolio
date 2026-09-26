// Dummy project — reuses VenturePlug's model/timing as a placeholder so the
// /projects grid and viewer routing have a second real entry to exercise.
// Swap modelUrl/steps/flybyPoints for the real asset once there is one.
const project = {
  slug: 'quick-change-fixture',
  modelUrl: '/models/cad_model567-optimized.glb',

  steps: [
    { label: 'seated', startTime: 0, endTime: 8 },
    { label: 'release', startTime: 8, endTime: 16 },
    { label: 'swap', startTime: 16, endTime: 24 },
  ],

  loopEndTime: 24,

  flybyPoints: [
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
  ],

  textCues: [],

  sections: [
    {
      body: 'A quick-change fixture plate that lets a single base carry interchangeable locating inserts, so changeover between part variants is a single pin-pull instead of a full fixture swap.',
      bullets: [
        'Cuts fixture changeover from ~20 minutes to under 5',
        'One base plate covers 6 part variants',
        'Repeatable locating within 0.05mm across swaps',
      ],
    },
  ],
};

export default project;
