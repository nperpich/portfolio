import React, { useEffect, useState } from 'react';
import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined';
import './Project.css';
import ModalFull from './ModalFull';
import { motion } from 'framer-motion';
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
  // border: '2px solid #000',
  borderRadius: 2,
  outline: 0,
  boxShadow: 24,
  p: 4,
};

export default function Project({ isMobile }) {
  const [showDetails, setShowDetails] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);

  useEffect(() => {
    if (showDetails) {
      document.querySelector('body').classList.add('freeze-overflow');
    } else {
      document.querySelector('body').classList.remove('freeze-overflow');
    }
  }, [showDetails]);

  return (
    <>
      {showDetails && (
        <ModalFull
          onModalClose={() => {
            setShowDetails(false);
          }}
        >
          {showQRCode && (
            <Modal
              // style={{ border: 'none', borderRadius: '8px' }}
              open={true}
              onClose={() => {
                setShowQRCode(false);
              }}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={style}>
                <div
                  className="close-qr-modal"
                  onClick={() => {
                    setShowQRCode(false);
                  }}
                >
                  <CloseIcon style={{ fontSize: '32px', color: 'gray' }} />
                </div>
                <div className="warning-container">
                  <h2>Warning!</h2>
                  <p>
                    For the best experience, scan the following code with a
                    mobile device 😁
                  </p>

                  <div className="phone-hand-container">
                    <img
                      // layoutId="project-pic"
                      className="phone-hand"
                      // style={{ width: '100%' }}
                      // className="gradient-overlay"
                      src="https://d2qxuoym2zs537.cloudfront.net/forPortfolio/qr-on-phone-1.png"
                    ></img>
                  </div>
                  <div style={{ flexGrow: 1 }} />
                  <p
                    className="skip-qr"
                    onClick={() => {
                      openInNewTab('https://www.dancelearningspace.com');
                    }}
                  >
                    continue without mobile
                  </p>
                </div>
              </Box>
            </Modal>
          )}
          <div style={{ width: '100%', height: '100%' }}>
            <motion.div
              layoutId="project-pic"
              className="img-container details"
            >
              <motion.img
                layoutId="project-pic-img"
                style={{ width: '100%' }}
                className="gradient-overlay"
                src="https://d2qxuoym2zs537.cloudfront.net/forPortfolio/dance-app-collage-2.png"
              ></motion.img>
              <motion.div
                layoutId="image-filter"
                className="image-filter details"
              ></motion.div>
            </motion.div>
            <div
              className="live-demo"
              onClick={() => {
                if (isMobile) {
                  openInNewTab('https://www.dancelearningspace.com');
                } else setShowQRCode(true);
              }}
            >
              LIVE DEMO
            </div>
            <div className="project-content">
              {/* <div className="qr-code-new"></div> */}
              <div className="experience-collection">
                <ProjectBlurb>
                  {{
                    year: 'Frontend',
                    title: 'Fullstack Engineer',
                    text: [
                      'asdfasdf',
                      'Worked tirelessly to cut down on unnecessary re-renders',
                    ],
                    skills: [
                      'HTML',
                      'CSS',
                      'JavaScript',
                      'ReactJS',
                      'Redux',
                      'React Router',
                      'Git',
                      'Heroku',
                    ],
                  }}
                </ProjectBlurb>
                <ProjectBlurb>
                  {{
                    year: 'Backend',
                    title: 'Senior Design Engineer',
                    text: [
                      `Worked with AWS services to manage video uploads, from creating presigned-URLs, processing the videos with Elastic Transcoder, storing in S3 buckets and distributing using CloudFront. These process are automated together with the help of Lambda Functions`,
                      `Uses HLS video format to drastically reduce the amount of data transfered. Allows for streaming discrete sections`,
                    ],
                    skills: [
                      'Node.js',
                      'Next.js',
                      'Express.js',
                      'MongoDB',
                      'Postman',
                      'AWS S3',
                      'AWS CloudFront',
                      'AWS Lambda Functions',
                      'AWS Elastic Transcoder',
                    ],
                  }}
                </ProjectBlurb>
              </div>
            </div>
          </div>
        </ModalFull>
      )}
      <div className="project">
        <motion.div layoutId="project-pic" className="img-container">
          <motion.img
            layoutId="project-pic-img"
            className="gradient-overlay"
            src="https://d2qxuoym2zs537.cloudfront.net/forPortfolio/dance-app-collage-2.png"
          ></motion.img>
          {/* <motion.div
            layoutId="image-filter"
            className="image-filter"
          ></motion.div> */}
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

function openInNewTab(url) {
  window.open(url, '_blank').focus();
}
