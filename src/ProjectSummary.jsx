import React, { useEffect, useState } from 'react';
import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined';
import { motion } from 'framer-motion';
import Project from './Project';

export default function ProjectSummary({ project, isMobile }) {
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const body = document.querySelector('body');

    if (showDetails) {
      body.classList.add('freeze-overflow');
    } else {
      body.classList.remove('freeze-overflow');
    }
  }, [showDetails]);

  return (
    <>
      <div className="project">
        {/* Image */}
        <motion.div
          layoutId={`project-pic-${project.id}`}
          id="img-container-gradient"
          className={`img-container ${project.gradientClass}`}
        >
          <motion.img
            layoutId={`project-pic-img-${project.id}`}
            className="gradient-overlay"
            src={project.image}
            alt={project.title}
          />
        </motion.div>

        {/* Summary */}
        <div className="project-summary">
          <motion.div layoutId={`proj-header-${project.id}`} className="title">
            {project.title}
          </motion.div>

          <p className="info">{project.blurb}</p>
        </div>

        {/* CTA */}
        <div
          className="see-more-project"
          onClick={() => setShowDetails(true)}
          style={{ cursor: 'pointer' }}
        >
          <div>View work</div>
          <div className="caret-container">
            <ArrowForwardIosOutlinedIcon />
          </div>
        </div>
      </div>

      {/* Modal / Detail */}
      {showDetails && (
        <Project
          project={project}
          isMobile={isMobile}
          close={() => setShowDetails(false)}
        />
      )}
    </>
  );
}
export function openInNewTab(url) {
  window.open(url, '_blank').focus();
}
