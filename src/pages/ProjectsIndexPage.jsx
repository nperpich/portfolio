import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useGLTF } from '@react-three/drei';
import { designs, projectMetas } from '../components/designs';
import { theme } from '../components/viewer/theme';
import './ProjectsIndexPage.css';

function thumbnailSrc(meta) {
  return meta.thumbnail || `/thumbs/${meta.slug}.webp`;
}

// TODO: remove this fallback once every project has a real thumbnail in
// public/thumbs/ — picsum's seed keeps each project's placeholder stable
// across reloads in the meantime.
function placeholderSrc(meta) {
  return `https://picsum.photos/seed/${meta.slug}/800`;
}

function preloadProject(slug) {
  const loadConfig = designs[slug];
  if (!loadConfig) return;
  loadConfig().then((mod) => {
    if (mod.default?.modelUrl) useGLTF.preload(mod.default.modelUrl);
  });
}

function ProjectCard({ meta }) {
  const [src, setSrc] = useState(thumbnailSrc(meta));

  return (
    <Link
      to={`/projects/${meta.slug}`}
      className="project-card"
      onMouseEnter={() => preloadProject(meta.slug)}
      onFocus={() => preloadProject(meta.slug)}
      style={{
        color: theme.textPrimary,
        fontFamily: theme.font,
        textDecoration: 'none',
      }}
    >
      <div className="project-card-thumb">
        <img
          src={src}
          alt=""
          onError={() => setSrc(placeholderSrc(meta))}
          style={{
            width: '100%',
            height: '100%',
            aspectRatio: '1 / 1',
            objectFit: 'cover',
            display: 'block',
          }}
        />
      </div>
      {meta.impact && (
        <div style={{ marginTop: 14 }}>
          <div
            style={{ fontSize: 28, fontWeight: 700, color: theme.textPrimary }}
          >
            {meta.impact.value}
          </div>
          <div style={{ fontSize: 13, color: theme.textMuted }}>
            {meta.impact.label}
          </div>
        </div>
      )}
      <div
        style={{
          marginTop: 6,
          fontSize: 15,
          fontWeight: 500,
          color: theme.textPrimary,
        }}
      >
        {meta.title}
      </div>
    </Link>
  );
}

export default function ProjectsIndexPage() {
  const sorted = [...projectMetas].sort(
    (a, b) => (a.order ?? 0) - (b.order ?? 0),
  );

  return (
    <div
      style={{
        minHeight: '100dvh',
        paddingTop: '100px',
        boxSizing: 'border-box',
        background: theme.pageBg,
        fontFamily: theme.font,
      }}
    >
      <div className="project-grid">
        {sorted.map((meta) => (
          <ProjectCard key={meta.slug} meta={meta} />
        ))}
      </div>
    </div>
  );
}
