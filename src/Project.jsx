import React, { useState } from 'react';
import './Project.css';
import { motion } from 'framer-motion';
import ModalFull from './ModalFull';
import ProjectBlurb from './ProjectBlurb';

import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import CloseIcon from '@mui/icons-material/Close';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 360,
  bgcolor: 'background.paper',
  borderRadius: 2,
  outline: 0,
  boxShadow: 24,
  p: 4,
};

export default function Project({ project, isMobile, close }) {
  const [showQRCode, setShowQRCode] = useState(false);

  const openInNewTab = (url) => {
    window.open(url, '_blank').focus();
  };

  return (
    <>
      <ModalFull onModalClose={close}>
        {/* ===== QR MODAL ===== */}
        {showQRCode && (
          <Modal open onClose={() => setShowQRCode(false)}>
            <Box sx={style}>
              <div
                className="close-qr-modal"
                onClick={() => setShowQRCode(false)}
              >
                <CloseIcon style={{ fontSize: 32, color: 'gray' }} />
              </div>

              <div className="warning-container">
                <h2>{project.qr.warningTitle}</h2>

                <p>{project.qr.warningText}</p>

                <div className="phone-hand-container">
                  <img
                    className="phone-hand"
                    src={project.qr.phoneImage}
                    alt="QR preview"
                  />
                </div>

                <div style={{ flexGrow: 1 }} />

                <p
                  className="skip-qr"
                  onClick={() => openInNewTab(project.liveDemo)}
                >
                  {project.qr.skipText}
                </p>
              </div>
            </Box>
          </Modal>
        )}

        {/* ===== HERO IMAGE ===== */}
        <div style={{ width: '100%', height: '100%' }}>
          <motion.div
            layoutId={`project-pic-${project.id}`}
            className="img-container details"
          >
            <motion.img
              layoutId={`project-pic-img-${project.id}`}
              style={{ width: '100%' }}
              src={project.image}
              alt={project.title}
            />

            <motion.div className="project-title-overlay">
              {project.title}
            </motion.div>

            <motion.div
              layoutId="image-filter"
              className="image-filter details"
            />
          </motion.div>

          {/* ===== CONTENT ===== */}
          <div className="project-content">
            <motion.div className="project-title-outside">
              {project.title}
            </motion.div>

            {/* LIVE DEMO CTA */}
            {project.liveDemo && (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                <div
                  className="live-demo"
                  onClick={() => {
                    if (isMobile || !project.qr) {
                      openInNewTab(project.liveDemo);
                    } else {
                      setShowQRCode(true);
                    }
                  }}
                >
                  LIVE DEMO
                </div>
              </div>
            )}

            {/* EXPERIENCE SECTIONS */}
            <div className="experience-collection">
              {project.experience.map((item, index) => (
                <ProjectBlurb key={index}>{item}</ProjectBlurb>
              ))}
            </div>
          </div>
        </div>
      </ModalFull>
    </>
  );
}
