// Dummy second project — proves out the /projects grid + registry with a
// second entry. Reuses VenturePlug's model/asset since there's no separate
// GLB for it yet; swap modelUrl in project.config.js once there is one.
const meta = {
  slug: 'quick-change-fixture',
  title: 'Quick-Change Fixture Plate',
  impact: { value: '3x', label: 'faster changeover' },
  tags: ['Fixturing', 'Automation'],
  order: 2,
};

export default meta;
