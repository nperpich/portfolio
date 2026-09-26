// Loaded eagerly (see components/designs/index.js) for the /projects index
// grid — keep this small; the heavy stuff (model, steps, flyby points)
// belongs in project.config.js, which is lazy-loaded instead.
const meta = {
  slug: 'custom-shower-former',
  title: 'Large Custom Shower Former',
  impact: { value: '4→1', label: 'vacuum boxes' },
  tags: ['Manufacturing', 'Tooling', 'Automation'],
  order: 2,
  thumbnail: '/hero-images/thumb-from-right-former.png', // set once a real capture exists
};

export default meta;
