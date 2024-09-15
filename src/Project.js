import React, { useEffect, useState } from 'react';
import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined';
import './Project.css';
import ModalFull from './ModalFull';
import { motion } from 'framer-motion';
import ProjectBlurb from './ProjectBlurb';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import CloseIcon from '@mui/icons-material/Close';
import EastIcon from '@mui/icons-material/East';
import WestIcon from '@mui/icons-material/West';

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

const danceWebsite = 'https://www.dancelearningspace.com/demo';

export default function Project({ isMobile, close }) {
  const [showQRCode, setShowQRCode] = useState(false);

  return (
    <>
      <ModalFull onModalClose={close}>
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
                  For the best experience, scan the following code with a mobile
                  device 😁
                </p>

                <div className="phone-hand-container">
                  <img
                    // layoutId="project-pic"
                    className="phone-hand"
                    // style={{ width: '100%' }}
                    // className="gradient-overlay"
                    src="https://d2qxuoym2zs537.cloudfront.net/forPortfolio/qr-on-phone-2.png"
                  ></img>
                </div>
                <div style={{ flexGrow: 1 }} />
                <p
                  className="skip-qr"
                  onClick={() => {
                    openInNewTab(danceWebsite);
                  }}
                >
                  continue without mobile
                </p>
              </div>
            </Box>
          </Modal>
        )}
        <div style={{ width: '100%', height: '100%' }}>
          <motion.div layoutId="project-pic" className="img-container details">
            <motion.img
              layoutId="project-pic-img"
              style={{ width: '100%' }}
              // className="gradient-overlay"
              src="https://d2qxuoym2zs537.cloudfront.net/forPortfolio/dance-app-collage-3.png"
            ></motion.img>
            <motion.div
              // layoutId="proj-header"
              className="project-title-overlay"
            >
              Dance Library
            </motion.div>
            <motion.div
              layoutId="image-filter"
              className="image-filter details"
            ></motion.div>
          </motion.div>
          <div className="project-content">
            {/* <div className="qr-code-new"></div> */}
            <motion.div
              // layoutId="proj-header"
              className="project-title-outside"
            >
              Dance Library
            </motion.div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              {/* <EastIcon style={{ color: 'var(--sky-blue)' }} /> */}
              <div
                className="live-demo"
                onClick={() => {
                  if (isMobile) {
                    openInNewTab(danceWebsite);
                  } else setShowQRCode(true);
                }}
              >
                LIVE DEMO
              </div>
              {/* <WestIcon style={{ color: 'var(--sky-blue)' }} /> */}
            </div>
            <div className="experience-collection">
              <ProjectBlurb>
                {{
                  year: 'Frontend',
                  title: 'Fullstack Engineer',
                  text: [
                    'Created an appeasing design using modern design technique with smooth and natural transitions for an enjoyable experience',
                    'Continuously refactoring code to reduce re-renders and to make easier to navigate',
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
                    'Framer-Motion',
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
                    `Uses automated email services for signing up new users`,
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
                    'SendGrid',
                  ],
                }}
              </ProjectBlurb>
            </div>
          </div>
        </div>
      </ModalFull>
    </>
  );
}

function openInNewTab(url) {
  window.open(url, '_blank').focus();
}
