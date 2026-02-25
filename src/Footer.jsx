import React from 'react';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import './Footer.css';
import ContactForm from './ContactForm';
import { openInNewTab } from './ProjectSummary';

export default function Footer() {
  return (
    <footer>
      <ContactForm />
      {/* <div className="icon-container">
        <a
          className="icon"
          onClick={() => {
            openInNewTab(
              'https://www.linkedin.com/in/nicholas-perpich-5241b228/'
            );
          }}
          // href="https://www.linkedin.com/in/nicholas-perpich-5241b228/"
          style={{ cursor: 'pointer' }}
        >
          <LinkedInIcon fontSize="large" />
        </a>
        <a
          className="icon"
          // href="https://github.com/nperpich"
          onClick={() => {
            openInNewTab('https://github.com/nperpich');
          }}
          style={{ cursor: 'pointer' }}
        >
          <GitHubIcon fontSize="large" />
        </a>
      </div> */}
    </footer>
  );
}
