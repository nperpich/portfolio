// Config-driven project definition, consumed by ProjectViewer via the
// designs registry (see components/designs/index.js). Adding a new
// project should mean "write a new config file like this one," not "write
// new components." Card-grid metadata (title, tags, impact, order) lives
// in this folder's meta.js instead — that's loaded eagerly for /projects,
// while this file is lazy-loaded only once you're actually viewing the
// project.
const project = {
  slug: 'venture-plug',
  modelUrl: '/models/cad_model567-optimized.glb',

  // The clip (baked into the .gltf at 30fps) plays continuously on a loop.
  // Each entry is a time range (in seconds, matching AnimationAction.time)
  // that labels a segment of that continuous playback — whichever range
  // contains the live playhead time is the active step.
  steps: [
    { label: 'hand-crank', startTime: 3.5, endTime: 11 },
    { label: 'adjust side', startTime: 11, endTime: 13 },
    { label: 'channge floors', startTime: 13, endTime: 22 },
    { label: 'swap sides', startTime: 24, endTime: 30 },
  ],

  // The baked clip is actually 50s long, but nothing after 30s is labeled —
  // loop back to 0 as soon as the playhead passes this instead of playing
  // out the unlabeled tail before wrapping. Update this (and add a matching
  // step above) if you extend the labeled sequence further into the clip.
  loopEndTime: 30,

  // Pulled from the previous orbit-and-capture waypoint editor's tuned shots
  // for this model (real coordinates, not a generic placeholder) — refine
  // further in editMode with FlybyEditor's "Record point" as needed.
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
    {
      time: 6,
      position: [1.749, 2.381, 2.338],
      target: [-0.6, -0.258, 0.55],
    },
  ],

  // Each cue is keyed to a step index (not raw time) — it appears when that
  // step becomes active, fades in over fadeDuration, and stays fully
  // visible until you move to a step with no cue in that corner. Up to 4
  // can be shown at once, one per corner. `lookAt` is optional — a 3D point
  // (same space as flybyPoints) the box draws a line to; omit for no line.
  textCues: [],

  // Rendered by ProjectText, top to bottom — each section is an optional
  // paragraph followed by an optional bullet list.
  sections: [
    {
      body: 'A single vacuum former with interchangeable floor inserts, capable of producing showers of any requested size.',
      bullets: [
        'Reduces vacuum box count from 4+ down to 1',
        'Cuts changeover time to under 10 minutes',
        'Integrated heaters and quick-change tooling reduce part-to-part cycle time and prevent fixture damage',
        'Designed to accommodate electric motors for future automation',
      ],
    },
  ],
};

export default project;
