// import React from 'react';
import React, { useEffect, useRef, useState } from 'react';
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
import useFetchOnDemand from './useFetchOnDemand';
import TypingAnimation from './TypingAnimation';

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

const interviewQuestions = [
  'What are your strengths?',
  'Why do you want this job?',
  'What motivates you?',
  'Describe yourself in one word.',
  'What are your career goals?',
];

const backend = 'https://dance-vid-backend-1541fef8c031.herokuapp.com/';

export default function ChatBox({ open, setOpen }) {
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [messages, setMessages] = useState([
    {
      text: 'Hi! 👋 Ask me any question or click on one of the following prompts!',
      author: 'chatbot',
    },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const messageContainerRef = useRef(null);

  const handleSendMessage = (prompt) => {
    if (newMessage.trim() !== '') {
      setMessages([...messages, { text: newMessage, author: 'user' }]);
      setNewMessage('');
      console.log('about to send chat');
      sendChat();
    }
  };

  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTo({
        top: 100000,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  const {
    loading: chatLoading,
    error: chatError,
    sendData: sendChat,
  } = useFetchOnDemand(
    `${backend}api/v1/chat`,
    (data) => {
      console.log({ data });
      console.log(data.choices?.at(0)?.message?.content);
      const answerText = data.choices?.at(0)?.message?.content;
      if (answerText) {
        setMessages((prev) => [
          ...prev,
          { text: answerText, author: 'chatbot' },
        ]);
      }
    },
    {
      method: 'POST',
      credentials: 'include', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json',
      },
      //   body: 'what is the capitcal of the United States',
      body: JSON.stringify({
        question: newMessage,
      }),
    },
    [messages, newMessage]
  );

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
          <div style={{ flexGrow: 1 }}>
            <div>AI Nick</div>
            <div style={{ fontSize: '16px', fontWeight: 'normal' }}>
              representative
            </div>
          </div>
          <div className="exit-chat" onClick={handleClose}>
            <CloseIcon />
          </div>
        </nav>
        <main ref={messageContainerRef} className="message-container">
          <List className="chat-list">
            {messages.map((message, index) => (
              <div
                key={index}
                className="single-chat"
                style={
                  message.author === 'chatbot'
                    ? { alignSelf: 'flex-start' }
                    : {
                        alignSelf: 'flex-end',
                        color: 'white',
                        backgroundColor: 'var(--teal-darker)',
                      }
                }
              >
                {message.text}
              </div>
            ))}
            {chatLoading && (
              <div
                className="single-chat"
                style={{
                  minWidth: '50px',
                  height: '15px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <TypingAnimation />
              </div>
            )}
          </List>
          {messages.length <= 1 && (
            <div className="prompt-list">
              {interviewQuestions.map((prompt) => (
                <div className="prompt" onClick={() => {}}>
                  {prompt}
                </div>
              ))}
              {/* <div>
                <TypingAnimation />
              </div> */}
            </div>
          )}
        </main>
        <Box sx={{ display: 'flex', gap: 0 }} className="chat-texfield">
          <TextField
            fullWidth
            autoComplete="off"
            // focused
            sx={{ p: 1 }}
            // style={{ color: 'green' }}
            // variant=""
            variant="standard"
            // color="green"
            placeholder="Type a message"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSendMessage();
              }
            }}
            InputProps={{
              disableUnderline: true,
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