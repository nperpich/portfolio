import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { designs, projectMetas } from '../components/designs';
import { ProjectViewer } from '../components/viewer/ProjectViewer';

// Renders any registered project by slug. /projects/:slug reads the slug
// from the URL; a fixed `slug` prop lets a dedicated route (e.g. the
// legacy /mechanical-engineer path) point at a specific project without
// exposing the /projects/:slug URL shape.
export default function ProjectPage({ slug: fixedSlug }) {
  const params = useParams();
  const slug = fixedSlug || params.slug;
  const meta = projectMetas.find((m) => m.slug === slug);
  const [config, setConfig] = useState(null);

  useEffect(() => {
    setConfig(null);
    const loadConfig = designs[slug];
    if (!loadConfig) return;
    let cancelled = false;
    loadConfig().then((mod) => {
      if (!cancelled) setConfig(mod.default);
    });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (!meta || !config) return null;

  // Title lives on meta (it's also needed for the /projects card grid,
  // which never loads project.config.js), so it's merged in here.
  return (
    <ProjectViewer key={slug} project={{ ...config, title: meta.title }} />
  );
}
