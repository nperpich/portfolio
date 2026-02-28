import React, { useState } from 'react';
import './Header.css';
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';
import TextSnippetOutlinedIcon from '@mui/icons-material/TextSnippetOutlined';
import Modal from './Modal';

export default function Header({ toggleChat }) {
  const [showResume, setShowResume] = useState(false);
  return (
    <>
      {showResume && (
        <Modal xColor="white" onModalClose={() => setShowResume(false)}>
          <div
            // ref={pdfContainer}
            className="pdf-modal"

            // style={{ position: 'relative', top: '35px' }}
          >
            <object
              data="/resume_2026.pdf"
              // data="https://d2qxuoym2zs537.cloudfront.net/forPortfolio/Perpich_Fullstack_1208.pdf"
              type="application/pdf"
              width="100%"
              height="100%"
            ></object>
          </div>
        </Modal>
      )}
      <header className="App-header">
        <div className="chat-button sparkle" onClick={toggleChat}>
          <div className="mui-icon">
            <AutoAwesomeOutlinedIcon
              style={{
                filter: 'inherit',
              }}
            />
          </div>
          <div style={{ filter: 'none' }} className="live-chat">
            CHAT
          </div>
        </div>
        <div className="chat-button" onClick={() => setShowResume(true)}>
          <div className="mui-icon">
            <TextSnippetOutlinedIcon />
          </div>
          <div style={{ filter: 'none' }} className="live-chat">
            RESUME
          </div>
        </div>
        {/* <div className="chat-button" style={{ padding: 0 }}></div> */}
      </header>
    </>
  );
}
