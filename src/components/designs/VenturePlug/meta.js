// Loaded eagerly (see components/designs/index.js) for the /projects index
// grid — keep this small; the heavy stuff (model, steps, flyby points)
// belongs in project.config.js, which is lazy-loaded instead.
const meta = {
  slug: 'custom-shower-former',
  title: 'Large Custom Shower Former',
  impact: { value: '4→1', label: 'vacuum boxes' },
  tags: ['Manufacturing', 'Tooling', 'Automation'],
  order: 1,
  thumbnail: '/hero-images/venture-plug.webp', // set once a real capture exists
};

export default meta;
