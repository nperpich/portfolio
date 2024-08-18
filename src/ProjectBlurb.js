import React from 'react';
import './Experience.css';
import Chip from '@mui/material/Chip';
import { styled } from '@mui/material/styles';

const StyleChip = styled(Chip)(({ theme }) => ({
  boxShadow: 'none',
  color: 'var(--rustic-blue)',
  backgroundColor: 'transparent',
  border: '1px solid var(--rustic-blue)',
  // color: 'var(--background)',
  // backgroundColor: 'var(--rustic-blue-transparent)',
  // '&:hover': {
  //   boxShadow: 'none',
  //   backgroundColor: 'var(--rustic-blue)',
  // },
  //   '&:disabled': {
  //     boxShadow: 'none',
  //     color: 'white',
  //     backgroundColor: 'var(--accent)',
  //     opacity: 0.6,
  //   },
  // color: 'white',
}));

export default function ProjectBlurb({ children }) {
  return (
    <div className="experience-box">
      <h2 className="title">{children.year}</h2>
      <div className="chip-container">
        {children.skills.map((skill) => (
          <StyleChip label={skill} color="primary" />
        ))}
      </div>
      {/* <h3 className="info"> {children.title}</h3> */}

      <ul style={{ paddingLeft: '25px' }}>
        {children.text.map((text) => (
          <li className="experience-summary">{text}</li>
        ))}
      </ul>
    </div>
  );
}
