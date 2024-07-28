import React, { useState } from 'react';
import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined';
import './Project.css';
import Modal from './Modal';
import { motion } from 'framer-motion';

export default function Project() {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <>
      {showDetails && (
        <Modal
          onModalClose={() => {
            setShowDetails(false);
          }}
        >
          <div>
            <motion.div
              layoutId="project-pic"
              className="img-container details"
            >
              <motion.img
                // layoutId="project-pic"
                style={{ width: '100%' }}
                className="gradient-overlay"
                src="https://d2qxuoym2zs537.cloudfront.net/forPortfolio/work-012x.jpg"
              ></motion.img>
              <motion.div
                layoutId="image-filter"
                className="image-filter details"
              ></motion.div>
            </motion.div>
            <div className="project-content">
              <div className="qr-code-new"></div>
            </div>
          </div>
        </Modal>
      )}
      <div className="project">
        <motion.div layoutId="project-pic" className="img-container">
          <motion.img
            // layoutId="project-pic"
            className="gradient-overlay"
            src="https://d2qxuoym2zs537.cloudfront.net/forPortfolio/work-012x.jpg"
          ></motion.img>
          <motion.div
            layoutId="image-filter"
            className="image-filter"
          ></motion.div>
        </motion.div>
        <div className="project-summary">
          <h3 className="title">#Dance</h3>
          <p className="info">
            — Duis aute irure dolor in reprehenderit in voluptate velit esse.
          </p>
        </div>
        <div
          className="see-more-project"
          onClick={() => {
            setShowDetails(true);
          }}
        >
          <div>View work</div>
          <div className="caret-container">
            <ArrowForwardIosOutlinedIcon />
          </div>
        </div>
      </div>
    </>
  );
}
