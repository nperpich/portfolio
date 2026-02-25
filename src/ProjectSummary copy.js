import React, { useEffect, useState } from 'react';
import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined';
import './Project.css';
import ModalFull from './ModalFull';
import { motion } from 'framer-motion';
import ProjectBlurb from './ProjectBlurb';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import CloseIcon from '@mui/icons-material/Close';
import Project from './Project';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 360,
  bgcolor: 'background.paper',
  // border: '2px solid #000',
  borderRadius: 2,
  outline: 0,
  boxShadow: 24,
  p: 4,
};

export default function ProjectSummary({ isMobile }) {
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    if (showDetails) {
      document.querySelector('body').classList.add('freeze-overflow');
      // document
      //   .querySelector('#img-container-gradient')
      //   .classList.remove('img-container-gradient');
    } else {
      document.querySelector('body').classList.remove('freeze-overflow');
      // document
      //   .querySelector('#img-container-gradient')
      //   .classList.add('img-container-gradient');
    }
  }, [showDetails]);

  return (
    <>
      <div className="project">
        <motion.div
          layoutId="project-pic"
          id="img-container-gradient"
          className="img-container img-container-gradient"
        >
          <motion.img
            layoutId="project-pic-img"
            className="gradient-overlay"
            src="https://d2qxuoym2zs537.cloudfront.net/forPortfolio/dance-app-collage-3.png"
          ></motion.img>
          {/* <motion.div
            layoutId="image-filter"
            className="image-filter"
          ></motion.div> */}
        </motion.div>

        <div className="project-summary">
          <motion.div layoutId="proj-header" className="title">
            #Dance Library
          </motion.div>
          <p className="info">
            — A video service for dance studios that allows for easy indexing,
            sharing, and various tools to practice
          </p>
        </div>
        <div
          className="see-more-project"
          onClick={() => {
            setShowDetails(true);
          }}
          style={{ cursor: 'pointer' }}
        >
          <div>View work</div>
          <div className="caret-container">
            <ArrowForwardIosOutlinedIcon />
          </div>
        </div>
      </div>
      {showDetails && (
        <Project
          isMobile={isMobile}
          close={() => {
            setShowDetails(false);
          }}
        />
      )}
    </>
  );
}

export function openInNewTab(url) {
  window.open(url, '_blank').focus();
}
