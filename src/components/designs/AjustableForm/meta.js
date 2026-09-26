// Dummy second project — proves out the /projects grid + registry with a
// second entry. Reuses VenturePlug's model/asset since there's no separate
// GLB for it yet; swap modelUrl in project.config.js once there is one.
const meta = {
  slug: 'adjustable-form',
  title: 'Adjustable Form',
  impact: { value: '$200k+', label: 'yearly savings' },
  tags: ['Fixturing', 'Automation'],
  order: 1,
  thumbnail: '/hero-images/components-top-rm-bkg.png', // set once a real capture exists
};

export default meta;
