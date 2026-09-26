import { theme } from './theme';

// Renders a project's title + sections (each an optional paragraph and/or
// bullet list) — driven entirely by the project config, so a new project
// means new config content, not new markup.
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
      {sections.map((section, i) => (
        <div key={i}>
          {section.body && (
            <p style={{ lineHeight: 1.6 }}>{section.body}</p>
          )}
          {section.bullets && (
            <ul style={{ lineHeight: 1.6, paddingLeft: 20, margin: 0 }}>
              {section.bullets.map((bullet, j) => (
                <li key={j}>{bullet}</li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}
