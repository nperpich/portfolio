import { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';

import Codebox from './Codebox';
import Header from './Header';
import Experience from './Experience';
import Project from './Project';
import Modal from './Modal';
import OnLoadImage from './OnLoadImage';
import Footer from './Footer';
import ChatBox from './ChatBox';

function App() {
  const [message, setMessage] = useState('');
  const [openChat, setOpenChat] = useState(false);

  useEffect(() => {
    getMessage();
  }, []);

  async function getMessage() {
    const result = await fetch('/api/message');
    const json = await result.json();

    setMessage(json);
  }

  return (
    <>
      <ChatBox open={openChat} setOpen={setOpenChat} />
      <div className="App">
        {/* {true && (
          <Modal>
            <p>fuck</p>
          </Modal>
        )} */}
        <Header
          toggleChat={() => {
            setOpenChat((prev) => !prev);
          }}
        />

        <main>
          <div className="pic-and-name">
            <div className="portrait-container">
              {/* <img
                className="portrait"
                src="https://d2qxuoym2zs537.cloudfront.net/forPortfolio/me-fb-creation-1-hd.png"
              /> */}
              <OnLoadImage
                className="portrait"
                src="https://d2qxuoym2zs537.cloudfront.net/forPortfolio/me-fb-creation-1-hd.png"
              />
            </div>

            <div className="intro-container">
              <h1 className="title hello">Hello</h1>
              <h2 className="info me">I'm Nick</h2>
              <div className="codeboxes-container">
                <Codebox
                  variable="Name"
                  obj={{ FirstName: 'Nick', LastName: 'Perpich' }}
                />
                <Codebox
                  variable="My toolset"
                  obj={{
                    Profession: 'fullstack',
                    // stack: ['MongoDB', 'Express', 'React', 'Node'],
                    stack: 'MERN',
                  }}
                  rightAlign={true}
                />
              </div>
            </div>
          </div>

          <div className="experience-collection">
            <Experience>
              {{
                year: '2023-2024',
                title: 'Fullstack Engineer',
                text: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
            veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
            commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
            velit esse cillum dolore eu fugiat nulla pariatur.`,
              }}
            </Experience>
            <Experience>
              {{
                year: '2013-2020',
                title: 'Senior Design Engineer',
                text: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
      veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
      commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
      velit esse cillum dolore eu fugiat nulla pariatur.`,
              }}
            </Experience>
          </div>
          <div className="project-outer-container">
            <div className="projects-intro">
              <h2 className="title">#Latest Work</h2>
              <h5 className="info">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </h5>
            </div>
            <Project />
          </div>
          <Footer />
        </main>
      </div>
    </>
  );
}

export default App;
