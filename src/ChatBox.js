// import React from 'react';
import React, { useState } from 'react';
// import Box from '@mui/material/Box';
// import Button from '@mui/material/Button';
// import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import './ChatBox.css';
import {
  Box,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Typography,
  Paper,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import { border } from '@mui/system';

const style = {
  //   position: 'absolute',
  //   top: '50%',
  //   left: '50%',
  //   transform: 'translate(-50%, -50%)',
  //   width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  //   p: 4,
};

export default function ChatBox({ open, setOpen }) {
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    if (newMessage.trim() !== '') {
      setMessages([...messages, newMessage]);
      setNewMessage('');
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      className="chat-modal"
    >
      <Box sx={style} className="outer-container">
        <nav className="chat-header">
          <img
            className="me-chat-image"
            src="https://d2qxuoym2zs537.cloudfront.net/forPortfolio/customer-service-img-2.png"
          ></img>
          <div>Hi there 👋</div>
          <div className="exit-chat" onClick={handleClose}>
            <CloseIcon />
          </div>
        </nav>
        <main className="message-container">
          <List className="chat-list">
            {messages.map((message, index) => (
              <div
                key={index}
                className="single-chat"
                style={{
                  alignSelf: index % 3 === 0 ? 'flex-start' : 'flex-end',
                }}
              >
                {message}
              </div>
            ))}
          </List>
        </main>
        <Box sx={{ display: 'flex', gap: 0 }} className="chat-texfield">
          <TextField
            fullWidth
            sx={{ border: 'orange ' }}
            style={{ borderWidth: 0 }}
            // variant=""
            placeholder="Type a message"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSendMessage();
              }
            }}
            InputProps={{
              classes: {
                notchedOutline: 'fuuck',
              },
            }}
          />
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '10px',
            }}
          >
            <SendRoundedIcon
              onClick={handleSendMessage}
              fontSize="large"
              sx={{ color: 'rgba(0,0,0,0.4)' }}
            />
          </div>
        </Box>
      </Box>
    </Modal>
  );
}
