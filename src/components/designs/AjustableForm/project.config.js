const IMG = '/public/media/AdjustableForm';

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
      id: 'overview',
      body: 'A modular, adjustable base for the pink-foam plugs (hats) used to form custom shower bases. Instead of gluing and routing a full stack of foam for every custom size, a single routed sheet of foam sits on top of a reconfigurable base — drastically reducing foam, glue, and router time while improving the quality of finished parts.',
      bullets: [
        'Cuts cost per plug from $116 to $36 — about $80 saved on every plug',
        'At least $210,000 in estimated annual savings on the standard 3-inch replacement shower alone',
        'Covers shower lengths of 30″–84″ and widths of 30″–48″ in ¼″ increments',
        'Eliminates glue entirely and halves foam use and router time',
      ],
    },
    {
      id: 'current-process',
      heading: 'Current process',
      body: 'Three sheets of pink insulation foam are glued together, then cut on the CNC router to make the plug (hat) for each unique custom shower size.',
      media: [
        {
          type: 'image',
          src: `${IMG}/current-foam-stack.png`,
          label: 'Three sheets of pink foam glued into a stack',
        },
        {
          type: 'image',
          src: `${IMG}/current-routed-plug.png`,
          label: 'Finished plug routed from the full stack',
        },
      ],
    },
    {
      id: 'cost-savings',
      heading: 'Estimated cost savings',
      body: 'The system would be built first for the standard 3-inch replacement shower, which runs at least 10 per day — an estimated annual savings of at least $210,000.',
      table: {
        label: 'Cost per pink plug',
        columns: ['', 'Current', 'New'],
        rows: [
          ['Foam ($25/sheet)', '$42', '$21'],
          ['Glue ($22/can)', '$44', '—'],
          ['Router time ($125/hr)', '$30', '$15'],
          { cells: ['Total', '$116', '$36'], strong: true },
          { cells: ['Savings per plug', '$80', ''], strong: true },
        ],
      },
    },
    {
      id: 'components',
      heading: 'Modular components',
      body: 'Interchangeable inserts set the width and length of the shower base. Only one sheet of pink foam is routed and placed on top of the assembled base.',
      media: [
        {
          type: 'image',
          src: `${IMG}/components-top.png`,
          label: 'Full insert set, top view',
        },
        {
          type: 'image',
          src: `${IMG}/components-iso.png`,
          label: 'Full insert set, isometric view',
        },
      ],
    },
    {
      id: 'example-setups',
      heading: 'Example setups',
      body: 'Each shower size is built from a combination of 6″, 1″, and 1.5″ inserts.',
      bullets: [
        '54″ × 32.5″ shower: four 6″, four 1″, and two 1.5″ inserts',
        '48″ × 36″ shower: three 6″, twelve 1″, and two 1.5″ inserts',
      ],
      media: [
        {
          type: 'image',
          src: `${IMG}/setup-54x32-exploded.png`,
          label: '54″ × 32.5″ setup, exploded with foam cap',
        },
        {
          type: 'image',
          src: `${IMG}/setup-54x32-assembled.png`,
          label: '54″ × 32.5″ setup, assembled',
        },
        {
          type: 'image',
          src: `${IMG}/setup-48x36-exploded.png`,
          label: '48″ × 36″ setup, exploded with foam cap',
        },
        {
          type: 'image',
          src: `${IMG}/setup-48x36-assembled.png`,
          label: '48″ × 36″ setup, assembled',
        },
      ],
      note: 'Examples show a center drain; the same setup works for a left or right drain.',
    },
    {
      id: 'interlock',
      heading: 'How the parts interlock',
      body: 'Male and female mating features keep the interchangeable parts aligned from one setup to the next.',
      media: [
        {
          type: 'image',
          src: `${IMG}/interlock-male.png`,
          label: 'Male locating features',
        },
        {
          type: 'image',
          src: `${IMG}/interlock-female.png`,
          label: 'Female mating pockets',
        },
      ],
    },
    {
      id: 'air-cooling',
      heading: 'Air-cooled plug',
      body: [
        'After the part is foamed and has had time to cure, cold air is pushed through air lines machined into the inserts. This is meant to keep the plug from overheating and deforming at the corners.',
        'The approach builds on a proven result: air-conditioning units under the seated-shower foam fixtures had already reduced cure time.',
      ],
      media: [
        {
          type: 'image',
          src: `${IMG}/air-cooled-insert.png`,
          label: 'Air-line inlets and outlets machined into an insert',
        },
      ],
    },
    {
      id: 'assembly',
      heading: 'Assembly and serviceability',
      body: 'Most inserts are made from the same three pieces, stacked and fastened with threaded rods, nuts, and dowel pins. If a piece breaks, it can be pulled and swapped for a spare without rebuilding the insert.',
      media: [
        {
          type: 'image',
          src: `${IMG}/assembly-exploded.png`,
          label: 'Insert pieces, exploded',
        },
        {
          type: 'image',
          src: `${IMG}/assembly-complete.png`,
          label: 'Assembled insert',
        },
      ],
    },
    {
      id: 'machining',
      heading: 'Machining',
      body: 'A complete set is machined from five precision boards, each in two simple setups on the high-flow box. A prototype needs three boards.',
      media: [
        {
          type: 'image',
          src: `${IMG}/machining-nesting.png`,
          label: 'Part nesting across the precision boards',
        },
      ],
    },
    {
      id: 'material',
      heading: 'Material selection',
      body: [
        'Candidates were benchmarked against RenShape 473, the board used on the seated-shower injection mold. PBHT-40 was recommended for its high hardness (durability), low weight, and ability to withstand high temperatures.',
        'Estimated material cost is about $2,200 for a prototype and an additional $1,300 for a complete set — the prototype parts carry over into the final set.',
      ],
      table: {
        label: 'Tooling board comparison',
        columns: [
          '',
          'Hardness (Shore D)',
          'Density (lb/ft³)',
          'Tensile (psi)',
          'Compressive (psi)',
          'Flexural (psi)',
          'Glass temp (°F)',
          'Max service (°F)',
          'CTE (in/in/°F)',
          'Cost / sheet',
          'Sized for application',
        ],
        rows: [
          [
            'RenShape 473',
            '72',
            '50',
            '2,500',
            '3,500',
            '4,000',
            '212',
            '—',
            '30.0 × 10⁻⁶',
            '—',
            'No',
          ],
          [
            'PBLT-40',
            '56',
            '40',
            '1,500',
            '2,550',
            '2,370',
            '217',
            '200',
            '23.0 × 10⁻⁶',
            '$455',
            'Yes',
          ],
          {
            cells: [
              'PBHT-40',
              '92',
              '40',
              '1,506',
              '2,570',
              '2,370',
              '284',
              '300',
              '26.0 × 10⁻⁶',
              '$631',
              'Yes',
            ],
            strong: true,
          },
        ],
      },
      media: [
        {
          type: 'image',
          src: `${IMG}/renshape-473-mold.png`,
          label: 'Seated-shower mold built from RenShape 473',
        },
        // Video example — drop an .mp4 in /public and uncomment:
        // { type: 'video', src: `${IMG}/prototype-demo.mp4`, poster: `${IMG}/prototype-demo.jpg`, label: 'Prototype changeover' },
      ],
    },
  ],
};

export default project;
