import React from 'react';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import './Footer.css';

export default function Footer() {
  return (
    <footer>
      <h2 className="contact-me">#Contact me</h2>
      <div className="icon-container">
        <a
          className="icon"
          href="https://www.linkedin.com/in/nicholas-perpich-5241b228/"
        >
          <LinkedInIcon fontSize="large" />
        </a>
        <a className="icon" href="https://github.com/nperpich">
          <GitHubIcon fontSize="large" />
        </a>
      </div>
    </footer>
  );
}
