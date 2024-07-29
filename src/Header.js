import React from 'react';
import './Header.css';
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';

export default function Header({ toggleChat }) {
  return (
    <header className="App-header">
      <div className="chat-button sparkle" onClick={toggleChat}>
        <AutoAwesomeOutlinedIcon />
        <div>LIVE CHAT</div>
      </div>

      {/* <div className="chat-button" style={{ padding: 0 }}></div> */}
    </header>
  );
}
