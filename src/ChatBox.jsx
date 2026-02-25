// import React from 'react';
import React, { useEffect, useRef, useState } from 'react';
// import Box from '@mui/material/Box';
// import Button from '@mui/material/Button';
// import Typography from '@mui/material/Typography';
import { AnimatePresence, motion } from 'framer-motion';
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
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import { border } from '@mui/system';
import useFetchOnDemand from './useFetchOnDemand';
import TypingAnimation from './TypingAnimation';
import ModalSimple from './ModalSimple';
import { useLocalStorage, useSessionStorage } from './useStorage';

const chatImage =
  'https://d2qxuoym2zs537.cloudfront.net/forPortfolio/robotChatIcon2.svg';
// 'https://d2qxuoym2zs537.cloudfront.net/forPortfolio/me-fb-creation-1.png';

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
  const handleHide = () => setExpanded(false);
  const handleShow = () => setExpanded(true);

  const afterMount = useRef(false);
  const [expanded, setExpanded] = useState(true);

  const [messages, setMessages] = useState([
    {
      text: 'Hi! 👋  What questions do you have for Nick?',
      // text: 'Hi! 👋 Ask me any question or select one of the following prompts!',
      author: 'chatbot',
    },
  ]);
  const [newMessage, setNewMessage] = useState('');

  const [threadId, setThreadId, removeThreadId] = useLocalStorage(
    'chatThreadId',
    ''
  );
  console.log({ threadId });
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
    console.log('Effect ran');
    return () => {
      console.log('Cleanup ran');
      // removeThreadId();
      localStorage.removeItem('chatThreadId');
    };
  }, []);

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
    if (!isMobile || afterMount.current) {
      chatInputRef?.current.focus();
    } else {
      afterMount.current = true;
    }
    // if (textInput) {
    //   textInput.focus();
    // }
    // }
  }, [newMessage]);

  useEffect(() => {
    if (expanded && messageContainerRef.current) {
      messageContainerRef.current.scrollTo({
        top: 100000,
        // behavior: 'smooth',
      });
    }
  }, [expanded]);

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
      const messages = data.data.messages.body.data;
      const threadIdReceived = data.data.threadId;
      if (threadIdReceived !== threadId) {
        setThreadId(threadIdReceived);
      }
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
        threadId,
      }),
    },
    [messages, newMessage]
  );

  // useEffect(() => {
  //   // Set overflow-y to hidden when the component mounts
  //   // if (!isMobile) return;
  //   // const appElement = document.querySelector('.App');
  //   // if (appElement) {
  //   //   // appElement.style.position = 'fixed';
  //   //   appElement.style.overflowY = 'hidden';
  //   // }
  //   // // Set overflow-y back to scroll when the component unmounts
  //   // return () => {
  //   //   if (appElement) {
  //   //     // appElement.style.position = 'relative';
  //   //     appElement.style.overflowY = 'scroll';
  //   //   }
  //   // };
  // }, []);

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
      <AnimatePresence>
        {expanded ? (
          <motion.div
            key="chatBoxWhole"
            initial={{
              y: '100%',
            }}
            animate={{
              y: 0,
            }}
            exit={{ y: '100%' }}
            transition={{
              duration: 0.2, // Animation duration
              ease: 'easeInOut',
            }}
            // sx={style}
            style={{
              zIndex: 40,
              backgroundColor: 'white',
              boxShadow: `0px 11px 15px -7px rgba(0, 0, 0, 0.2), 
          0px 24px 38px 3px rgba(0, 0, 0, 0.14), 
          0px 9px 46px 8px rgba(0, 0, 0, 0.12)
`,
            }}
            className={`outer-container ${isMobile ? 'mobile' : ''}`}
          >
            {/* <img
          className="under-contruction"
          src="https://d2qxuoym2zs537.cloudfront.net/forPortfolio/537-5378667_under-construction-tape-png-clipart.png"
        ></img> */}
            <nav className="chat-header">
              {/* <div style={{ height: '55px', position: 'relative' }}>
            <img
              className="me-chat-image"
              src="https://d2qxuoym2zs537.cloudfront.net/forPortfolio/customer-service-img-2.png"
            ></img>
            <div className="online-dot"></div>
          </div> */}

              <div style={{ flexGrow: 1, paddingLeft: '15px' }}>
                <div>NickGPT</div>
                <div style={{ fontSize: '16px', fontWeight: 'normal' }}>
                  AI representative
                </div>
              </div>
              <div className="exit-chat" onClick={handleClose}>
                <CloseIcon style={{ fontSize: '30px' }} />
              </div>
              <div className="exit-chat" onClick={handleHide}>
                <ExpandMoreIcon
                  style={{ fontSize: '50px' }}
                  sx={{ stroke: 'var(--teal)', strokeWidth: 0.7 }}
                />
              </div>
            </nav>
            <div ref={messageContainerRef} className="message-container">
              <List className="chat-list">
                {messages.map((message, index) => {
                  const seachKey = '630-433-7325';
                  const text = message.text;
                  let messageHtml;
                  const indexOfKeyword = text.indexOf(seachKey);
                  if (indexOfKeyword === -1) {
                    messageHtml = text;
                  } else {
                    // const theSpan =
                    messageHtml = (
                      <>
                        <span>{text.slice(0, indexOfKeyword)}</span>
                        {/* <span style={{ color: 'blue' }}>{seachKey}</span> */}
                        <a href="tel:+16304337325">630-433-7325</a>
                        <span>
                          {text.slice(indexOfKeyword + seachKey.length)}
                        </span>
                      </>
                    );
                  }
                  return (
                    <div
                      className="photo-message-container"
                      style={
                        message.author === 'chatbot'
                          ? {
                              alignSelf: 'flex-start',
                              justifyContent: 'flex-start',
                            }
                          : {
                              alignSelf: 'flex-end',
                              justifyContent: 'flex-end',
                            }
                      }
                    >
                      {message.author === 'chatbot' && (
                        <img
                          className="me-chat-image smaller-image"
                          src={chatImage}
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
                                backgroundColor: 'var(--teal)',
                              }
                        }
                      >
                        {messageHtml}
                        {/* <a href="tel:+16304337325">630-433-7325</a> */}
                      </div>
                    </div>
                  );
                })}
                {chatLoading && (
                  <div className="photo-message-container">
                    <motion.img
                      layoutId="minimeForChat"
                      className="me-chat-image smaller-image"
                      src={chatImage}
                    ></motion.img>
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
          </motion.div>
        ) : (
          // <div style={{ height: '100%', width: '100%' }}>
          <motion.div
            key="chatSmallHolder"
            initial={{
              y: '100%',
            }}
            animate={{
              y: 0,
            }}
            exit={{ y: '100%' }}
            transition={{
              duration: 0.2, // Animation duration
              ease: 'easeInOut',
            }}
            style={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              padding: '30px',
            }}
          >
            <img
              style={{
                pointerEvents: 'all',
                boxShadow: `0px 11px 15px -7px rgba(0, 0, 0, 0.2), 
            0px 24px 38px 3px rgba(0, 0, 0, 0.14), 
            0px 9px 46px 8px rgba(0, 0, 0, 0.12)`,
              }}
              layoutId="minimeForChat"
              onClick={handleShow}
              // className="me-chat-image smaller-image"
              className="me-chat-image"
              src={chatImage}
            ></img>
            {/* </div> */}
          </motion.div>
        )}
      </AnimatePresence>
    </ModalSimple>
  );
}
