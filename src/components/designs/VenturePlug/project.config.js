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
      id: 'overview',
      body: 'A single heated, adjustable vacuum-forming mold with a roughly 6 × 9 ft footprint that replaced four similar-size molds, each of which needed its own maintenance. Hand-placed flanges and fixtures became a fully rigid system, adjusted by hand crank, that holds squareness and fixture position through the forming cycle.',
      bullets: [
        'Replaces 4 molds with 1, and covers 98.3% of the showers the old molds produced (with 3 extra floors)',
        'Floor sizes chosen from an analysis of 3,500 past custom showers',
        'Cuts changeover time to under 10 minutes',
        'Integrated heaters and locked-in tooling eliminate torch heating and fixture damage to the mold floor',
        'Designed for serviceability, safe floor changes, and future stepper-motor automation',
      ],
      media: [
        {
          type: 'image',
          label: 'The finished mold on the shop floor',
          shot: 'Hero photo: full mold, 3/4 view, ideally with a formed shower on it or a person for scale',
          aspectRatio: '16 / 9',
        },
      ],
      mediaMinWidth: 480,
    },
    {
      id: 'problem',
      heading: 'The problem',
      body: [
        'Custom sizes were made across four separate molds. Flanges and fixtures were placed by hand for every setup, and moving them risked dropping them onto the mold floor. Fixtures could also release and fall after a part was formed, causing more damage.',
        'The shower-shelf forms were heated with a butane torch before each form — an extra step, and one notorious for scorching the wood floor.',
      ],
      media: [
        {
          type: 'image',
          label: 'One of the four previous molds, with hand-placed fixtures',
          shot: 'Photo of an old mold setup (or a CAD recreation if no photo exists)',
        },
        {
          type: 'image',
          label: 'Floor damage from dropped fixtures and torch heating',
          shot: 'Close-up of dents or scorch marks on an old mold floor (optional, only if you have one)',
        },
      ],
    },
    {
      id: 'floor-sizing',
      heading: 'Choosing floor sizes from data',
      body: 'I analyzed the previous 3,500 custom showers to find the floor sizes that would capture the most custom dimensions. With the main floor plus a selection of three extra floors, the new mold covers 98.3% of the showers made on the previous four molds.',
      media: [
        {
          type: 'image',
          label:
            'Past orders by width and length, with each floor’s coverage overlaid',
          shot: 'Chart: scatter of the 3,500 showers (length vs. width) with shaded rectangles for each floor’s adjustable range. Can be built from your spreadsheet.',
          aspectRatio: '16 / 10',
        },
        {
          type: 'image',
          label: 'The main floor and three extra floors',
          shot: 'Photo or CAD of the floor set side by side',
        },
      ],
    },
    {
      id: 'crank-adjustment',
      heading: 'Rigid, crank-driven adjustment',
      body: 'Every shower size is set with a hand crank instead of hand-placed parts. The drive keeps the frame square and holds each fixture in place while the part is formed. The mechanisms that move the shelf molds are packed into the tightest spaces possible, which leaves room to form the largest shower sizes.',
      media: [
        {
          type: 'video',
          label: 'Cranking the mold to a new size',
          shot: 'Short clip (10–20 s): turning the crank while the flanges move in sync. Record in landscape, no audio needed.',
        },
        {
          type: 'image',
          label: 'Crank drive mechanism',
          shot: 'CAD section or cutaway of the crank drive and linkage',
        },
        {
          type: 'image',
          label: 'Shelf-mold mechanism packed into the frame',
          shot: 'CAD view with covers hidden, showing how compact the shelf mechanism is',
        },
      ],
    },
    {
      id: 'flanges',
      heading: 'Swappable flanges',
      body: 'The side shelf pieces (flanges) swap out quickly, each held by two quarter-turn quick fasteners. One flange set forms showers 30″–42″ deep, and a second set covers 42″–48″.',
      media: [
        {
          type: 'image',
          label: 'Quarter-turn fasteners holding a flange',
          shot: 'Close-up of one flange showing both quick fasteners',
        },
        {
          type: 'image',
          label: 'The two flange sets: 30″–42″ and 42″–48″ deep',
          shot: 'Both flange sets laid out side by side, or CAD of each',
        },
      ],
    },
    {
      id: 'heaters',
      heading: 'Built-in shelf heaters',
      body: 'Heaters installed under the shower-shelf forms replace the butane torch entirely, removing a step from every cycle and one of the main sources of damage to the wood floor.',
      media: [
        {
          type: 'image',
          label: 'Heater installed under a shelf form',
          shot: 'Photo or CAD of the underside of a shelf form with the heater visible',
        },
      ],
    },
    {
      id: 'thermal-expansion',
      heading: 'Staying precise under heat',
      body: 'Keeping the system rigid and precise was difficult because parts heat unevenly and are made of materials with different coefficients of thermal expansion. I solved it with deliberate expansion allowances at each joint between dissimilar materials and careful material selection.',
      media: [
        {
          type: 'image',
          label: 'Expansion allowance at a heated joint',
          shot: 'CAD detail (with dimension callouts) of a slotted hole, float gap, or sliding joint between a heated part and the frame',
        },
      ],
      // Optional: add a `table` comparing the materials you used and their CTEs.
    },
    {
      id: 'floor-changeover',
      heading: 'Safe, fast floor changes',
      body: [
        'To change floors, large pneumatic cylinders raise the vacuum box. I tuned them to move slowly both up and down, so that any failure results in a slow, controlled motion rather than a sudden drop.',
        'The vacuum box also opens so a forklift can get its forks under the floor, turning the floor swap into a quick, controlled lift.',
      ],
      media: [
        {
          type: 'video',
          label: 'Floor changeover',
          shot: 'Clip: vacuum box rising, forks sliding under the floor, floor lifted out. Speed up if long; aim for under 30 s.',
        },
        {
          type: 'image',
          label: 'Vacuum box open with fork access',
          shot: 'Photo or CAD of the raised box showing the fork clearance under the floor',
        },
      ],
    },
    {
      id: 'serviceability',
      heading: 'Built to be repaired',
      body: [
        'Repairability drove the layout. Nearly every component can be reached by removing a few screws and a single access plate.',
        'Every critical connection was designed with room for adjustment, so the assembly can be trued up despite imperfect fabrication.',
      ],
      media: [
        {
          type: 'image',
          label: 'Access plate removed',
          shot: 'Photo with one access plate off, showing the mechanism behind it',
        },
        {
          type: 'image',
          label: 'Adjustable connection detail',
          shot: 'Close-up or CAD of slotted holes, shims, or jack screws at a critical joint',
        },
      ],
    },
    {
      id: 'automation',
      heading: 'Ready for automation',
      body: 'The design leaves room to drive all four flanges with stepper motors. That upgrade would speed up setup and set each size to an exact, repeatable dimension instead of relying on hand cranking.',
      media: [
        {
          type: 'image',
          label: 'Planned stepper-motor mounting',
          shot: 'CAD concept of a motor on one crank drive (optional, only if a model exists)',
        },
      ],
    },
  ],
};

export default project;
