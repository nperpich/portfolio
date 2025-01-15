// import React from 'react';
import React, { useEffect, useRef, useState } from 'react';
// import Box from '@mui/material/Box';
// import Button from '@mui/material/Button';
// import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import Modal from '@mui/material/Modal';
// import Modal from './Modal';
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
import ModalSimple from './ModalSimple';

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

export default function ChatBox({ open, setOpen, isMobile }) {
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [messages, setMessages] = useState([
    {
      text: 'Hi! 👋  What burning questions do you have?',
      // text: 'Hi! 👋 Ask me any question or select one of the following prompts!',
      author: 'chatbot',
    },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const messageContainerRef = useRef(null);
  const chatInputRef = useRef(null);

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

  useEffect(() => {
    // if (chatInputRef.current) {
    // const textInput = document.querySelector('.MuiInputBase-input');
    chatInputRef?.current.focus();
    // if (textInput) {
    //   textInput.focus();
    // }
    // }
  }, [newMessage]);

  // useEffect(() => {
  //   console.log({ newMessage });
  // }, [newMessage]);

  const {
    loading: chatLoading,
    error: chatError,
    sendData: sendChat,
  } = useFetchOnDemand(
    `${backend}api/v1/chat`,
    (data) => {
      console.log({ data });
      // console.log(data.choices?.at(0)?.message?.content);
      // const answerText = data.choices?.at(0)?.message?.content;
      const messages = data.data;
      const answerText = messages[messages.length - 1].content[0].text.value;
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

  useEffect(() => {
    // Set overflow-y to hidden when the component mounts
    if (!isMobile) return;
    const appElement = document.querySelector('.App');
    if (appElement) {
      appElement.style.position = 'fixed';
      appElement.style.overflowY = 'hidden';
    }

    // Set overflow-y back to scroll when the component unmounts
    return () => {
      if (appElement) {
        appElement.style.position = 'relative';
        appElement.style.overflowY = 'scroll';
      }
    };
  }, []);

  return (
    <ModalSimple
      // disablePortal
      isMobile={isMobile}
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      className="chat-modal"
      PaperProps={{
        style: {
          backgroundColor: 'transparent',
          boxShadow: 'none',
        },
      }}
    >
      <Box sx={style} className={`outer-container ${isMobile ? 'mobile' : ''}`}>
        {/* <img
          className="under-contruction"
          src="https://d2qxuoym2zs537.cloudfront.net/forPortfolio/537-5378667_under-construction-tape-png-clipart.png"
        ></img> */}
        <nav className="chat-header">
          <div style={{ height: '55px', position: 'relative' }}>
            <img
              className="me-chat-image"
              src="https://d2qxuoym2zs537.cloudfront.net/forPortfolio/customer-service-img-2.png"
            ></img>
            <div className="online-dot"></div>
          </div>

          <div style={{ flexGrow: 1 }}>
            <div>NickGPT</div>
            <div style={{ fontSize: '16px', fontWeight: 'normal' }}>
              AI representative
            </div>
          </div>
          <div className="exit-chat" onClick={handleClose}>
            <CloseIcon style={{ fontSize: '30px' }} />
          </div>
        </nav>
        <div ref={messageContainerRef} className="message-container">
          <List className="chat-list">
            {messages.map((message, index) => (
              <div
                className="photo-message-container"
                style={
                  message.author === 'chatbot'
                    ? { alignSelf: 'flex-start', justifyContent: 'flex-start' }
                    : {
                        alignSelf: 'flex-end',
                        justifyContent: 'flex-end',
                      }
                }
              >
                {message.author === 'chatbot' && (
                  <img
                    className="me-chat-image smaller-image"
                    src="https://d2qxuoym2zs537.cloudfront.net/forPortfolio/customer-service-img-2.png"
                  ></img>
                )}
                <div
                  initial={{ opacity: 1 }}
                  animate={{ opacity: 0.5 }}
                  transition={{ duration: '3s' }}
                  key={`message-container-${index}`}
                  className="single-chat shared-message"
                  style={
                    message.author === 'chatbot'
                      ? {}
                      : {
                          color: 'white',
                          backgroundColor: 'var(--sky-blue-darker)',
                        }
                  }
                >
                  {message.text}
                </div>
              </div>
            ))}
            {chatLoading && (
              <div className="photo-message-container">
                <img
                  className="me-chat-image smaller-image"
                  src="https://d2qxuoym2zs537.cloudfront.net/forPortfolio/customer-service-img-2.png"
                ></img>
                <div
                  className="single-chat shared-message"
                  style={{
                    minWidth: '45px',
                    height: '15px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <TypingAnimation />
                </div>
              </div>
            )}
          </List>
          {/* {messages.length <= 1 && (
            <div className="prompt-list">
              {interviewQuestions.map((prompt) => (
                <div className="prompt shared-message" onClick={() => {}}>
                  {prompt}
                </div>
              ))}
         
            </div>
          )} */}
        </div>
        <Box sx={{ display: 'flex', gap: 0 }} className="chat-texfield">
          <TextField
            fullWidth
            inputRef={chatInputRef}
            autoComplete="off"
            // focused
            sx={{ p: 1 }}
            multiline
            style={{ justifyContent: 'center' }}
            // variant=""

            variant="standard"
            // color="green"
            placeholder="Ask our chatbot"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            InputProps={{
              disableUnderline: true,
              classes: {
                notchedOutline: 'fuuck',
                // root: 'fuuck',
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
    </ModalSimple>
  );
}
