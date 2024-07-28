import React from 'react';
import './Experience.css';

export default function Experience({ children }) {
  return (
    <div className="experience-box">
      <h2 className="title">{children.year}</h2>
      <h3 className="info"> {children.title}</h3>
      <div className="experience-summary">{children.text}</div>
    </div>
  );
}
