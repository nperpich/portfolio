// meta.js is small (card-grid data only) and needed up front for /projects,
// so it's loaded eagerly. project.config.js carries the heavy stuff (model
// url, steps, flyby points) and is only needed once you're actually
// viewing that project, so it stays a lazy import — keyed here by slug
// (read from the sibling meta.js) rather than by folder name, so a
// project's folder name and its slug don't have to match.
const metaModules = import.meta.glob('./*/meta.js', { eager: true });
const configLoaders = import.meta.glob('./*/project.config.js');

export const projectMetas = [];
export const designs = {};

for (const path in metaModules) {
  const meta = metaModules[path].default;
  const folder = path.replace(/\/meta\.js$/, '');
  const configPath = `${folder}/project.config.js`;
  projectMetas.push(meta);
  designs[meta.slug] = configLoaders[configPath];
}
