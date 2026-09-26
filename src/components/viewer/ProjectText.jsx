import { theme } from './theme';

// Renders a project's title + sections — driven entirely by the project
// config, so a new project means new config content, not new markup.
//
// Section shape (every field optional):
// {
//   id:        'stable-key',                 // used as React key if present
//   heading:   'Section title',
//   body:      'One paragraph' | ['Paragraph 1', 'Paragraph 2'],
//   bullets:   ['...', '...'],
//   table:     { label, columns: [...], rows: [[...], { cells: [...], strong: true }] },
//   media:     [
//     { type: 'image', src: '/projects/x/photo.png', label: 'Caption', alt: 'Alt text' },
//     { type: 'video', src: '/projects/x/clip.mp4', label: 'Caption', poster: '/projects/x/poster.jpg',
//       autoplay: false, loop: false },
//     { type: 'embed', src: 'https://www.youtube.com/embed/VIDEO_ID', label: 'Caption' },
//   ],
//   mediaMinWidth: 240,                        // px before grid items wrap to 1 column
//   note:      'Small footnote text',
// }
//
// `src` paths starting with "/" are served from your /public folder and are
// prefixed with the Vite base URL, so they still work if the site is deployed
// under a sub-path (e.g. GitHub Pages).

const BASE = (import.meta.env?.BASE_URL ?? '/').replace(/\/$/, '');

function resolveSrc(src) {
  if (!src) return src;
  if (/^(https?:|data:|blob:)/.test(src) || src.startsWith('//')) return src;
  return `${BASE}/${src.replace(/^\//, '')}`;
}

const captionStyle = {
  fontSize: '0.85em',
  lineHeight: 1.4,
  marginTop: 6,
  color: theme.textSecondary,
  opacity: 0.85,
};

function MediaItem({ item }) {
  const { type = 'image', label, alt, aspectRatio, fit = 'contain' } = item;
  const mediaStyle = {
    display: 'block',
    width: '100%',
    height: aspectRatio ? '100%' : 'auto',
    aspectRatio,
    objectFit: fit,
    borderRadius: 6,
  };

  let content;
  if (type === 'video') {
    const autoplay = !!item.autoplay;
    content = (
      <video
        src={resolveSrc(item.src)}
        poster={item.poster ? resolveSrc(item.poster) : undefined}
        controls={item.controls ?? !autoplay}
        autoPlay={autoplay}
        // Browsers only allow autoplay when muted.
        muted={autoplay || !!item.muted}
        loop={item.loop ?? autoplay}
        playsInline
        preload="metadata"
        aria-label={alt ?? label}
        style={mediaStyle}
      />
    );
  } else if (type === 'embed') {
    content = (
      <div
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: aspectRatio ?? '16 / 9',
        }}
      >
        <iframe
          src={item.src}
          title={alt ?? label ?? 'Embedded video'}
          loading="lazy"
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            border: 0,
            borderRadius: 6,
          }}
        />
      </div>
    );
  } else {
    content = (
      <img
        src={resolveSrc(item.src)}
        alt={alt ?? label ?? ''}
        loading="lazy"
        decoding="async"
        style={mediaStyle}
      />
    );
  }

  return (
    <figure style={{ margin: 0, minWidth: 0 }}>
      {content}
      {label && <figcaption style={captionStyle}>{label}</figcaption>}
    </figure>
  );
}

function MediaGrid({ media, minWidth = 240 }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(auto-fit, minmax(min(100%, ${minWidth}px), 1fr))`,
        gap: 16,
        margin: '16px 0',
      }}
    >
      {media.map((item, i) => (
        <MediaItem key={item.src ?? i} item={item} />
      ))}
    </div>
  );
}

function DataTable({ table }) {
  const cellBase = { padding: '6px 10px', whiteSpace: 'nowrap' };
  const align = (i) => table.align?.[i] ?? (i === 0 ? 'left' : 'right');
  const divider = '1px solid color-mix(in srgb, currentColor 20%, transparent)';

  return (
    <figure style={{ margin: '16px 0' }}>
      <div style={{ overflowX: 'auto' }}>
        <table
          style={{
            borderCollapse: 'collapse',
            width: '100%',
            fontSize: '0.9em',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {table.columns && (
            <thead>
              <tr>
                {table.columns.map((col, i) => (
                  <th
                    key={i}
                    scope="col"
                    style={{
                      ...cellBase,
                      textAlign: align(i),
                      color: theme.textPrimary,
                      borderBottom: divider,
                      whiteSpace: 'normal',
                      verticalAlign: 'bottom',
                    }}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
          )}
          <tbody>
            {table.rows.map((row, r) => {
              const cells = Array.isArray(row) ? row : row.cells;
              const strong = !Array.isArray(row) && row.strong;
              return (
                <tr key={r} style={strong ? { borderTop: divider } : undefined}>
                  {cells.map((cell, c) => {
                    const Tag = c === 0 ? 'th' : 'td';
                    return (
                      <Tag
                        key={c}
                        scope={c === 0 ? 'row' : undefined}
                        style={{
                          ...cellBase,
                          textAlign: align(c),
                          fontWeight: strong || c === 0 ? 600 : 400,
                          color: strong ? theme.textPrimary : undefined,
                        }}
                      >
                        {cell}
                      </Tag>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {table.label && (
        <figcaption style={captionStyle}>{table.label}</figcaption>
      )}
    </figure>
  );
}

export function ProjectText({ title, sections }) {
  return (
    <div
      className="project-text-content"
      style={{
        color: theme.textSecondary,
        fontFamily: theme.font,
        textAlign: 'left',
      }}
    >
      <h2 style={{ marginTop: 0, color: theme.textPrimary }}>{title}</h2>
      {sections.map((section, i) => {
        const paragraphs = Array.isArray(section.body)
          ? section.body
          : section.body
            ? [section.body]
            : [];

        return (
          <section key={section.id ?? i} style={{ marginBottom: 32 }}>
            {section.heading && (
              <h3 style={{ color: theme.textPrimary, marginBottom: 8 }}>
                {section.heading}
              </h3>
            )}
            {paragraphs.map((p, j) => (
              <p key={j} style={{ lineHeight: 1.6 }}>
                {p}
              </p>
            ))}
            {section.bullets && (
              <ul style={{ lineHeight: 1.6, paddingLeft: 20, margin: 0 }}>
                {section.bullets.map((bullet, j) => (
                  <li key={j}>{bullet}</li>
                ))}
              </ul>
            )}
            {section.table && <DataTable table={section.table} />}
            {section.media?.length > 0 && (
              <MediaGrid
                media={section.media}
                minWidth={section.mediaMinWidth}
              />
            )}
            {section.note && <p style={captionStyle}>{section.note}</p>}
          </section>
        );
      })}
    </div>
  );
}
