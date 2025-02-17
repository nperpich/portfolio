import { useEffect, useRef, useState } from 'react';
import logo from './logo.svg';
import './App.css';

import Codebox from './Codebox';
import Header from './Header';
import Experience from './Experience';
import Project from './Project';
import Modal from './ModalFull';
import OnLoadImage from './OnLoadImage';
import Footer from './Footer';
import ChatBox from './ChatBox';
import ContactForm from './ContactForm';
import ProjectSummary from './ProjectSummary';
import { AnimatePresence } from 'framer-motion';

function App() {
  const [message, setMessage] = useState('');
  const appContainer = useRef(null);
  const pdfContainer = useRef(null);
  const pdfOuterContainer = useRef(null);
  const [openChat, setOpenChat] = useState(false);
  const [isMobile, setIsMobile] = useState(() => {
    let check = false;
    (function (a) {
      if (
        /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
          a
        ) ||
        /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
          a.substr(0, 4)
        )
      )
        check = true;
    })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
  });

  useEffect(() => {
    const childDiv = document.querySelector('.experience-holder'); // Replace with your child selector
    const parentDiv = document.querySelector('main'); // Replace with your parent selector
    // Get the top position of the child relative to the parent
    const topRelativeToParent = childDiv.offsetTop - parentDiv.offsetTop;
    console.log('Top relative to parent:', topRelativeToParent);
  }, []);

  useEffect(() => {
    getMessage();
  }, []);

  useEffect(() => {
    // appContainer.current;

    const handleScroll = () => {
      const pdfRect = pdfOuterContainer.current.getBoundingClientRect(); // Get the bounding rectangle of the pdfContainer
      const top = pdfRect.top;
      const right = pdfRect.right;
      const bottom = pdfRect.bottom;
      const height = bottom - top;

      // console.log({ top });
      // Check if the top of pdfContainer is within the viewport
      if (top <= 100) {
        if (top + height - (620 + 5.5) <= 100 + 35) {
          // pdfContainer.current.style.left = `${right}px`;
          pdfContainer.current.classList.remove('abc');
          // pdfContainer.current.classList.remove('pdf-container');
          pdfContainer.current.classList.add('def');
        } else {
          pdfContainer.current.classList.add('abc');
          pdfContainer.current.classList.remove('def');
          // pdfContainer.current.style.right = 0;
        }
        // pdfContainer.current.classList.remove('abc');
      } else {
        pdfContainer.current.classList.remove('abc');
        pdfContainer.current.classList.remove('def');
      }
    };

    appContainer.current.addEventListener('scroll', handleScroll);

    // Cleanup event listener on component unmount
    return () => {
      appContainer.current.removeEventListener('scroll', handleScroll);
    };
  }, []);

  async function getMessage() {
    const result = await fetch('/api/message');
    const json = await result.json();

    setMessage(json);
  }

  return (
    <>
      <AnimatePresence>
        {openChat && (
          <ChatBox open={openChat} setOpen={setOpenChat} isMobile={isMobile} />
        )}
      </AnimatePresence>
      <div className="App" ref={appContainer}>
        {/* <div id="chatbox"></div> */}
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

          {/* <iframe
            src="https://d2qxuoym2zs537.cloudfront.net/forPortfolio/Perpich_Fullstack_1208.pdf&embedded=true"
            style="width:600px; height:500px;"
            frameborder="0"
          ></iframe> */}

          <div
            className="experience-holder"
            ref={pdfOuterContainer}
            style={{
              display: 'flex',
              flexDirection: 'row',
              gap: '30px',
              position: 'relative',
            }}
          >
            <div className="experience-collection">
              <Experience>
                {{
                  year: '2023-present',
                  title: 'Full Stack Developer',
                  text: [
                    `Developed a strong interest in computer science while working as a Mechanical Engineer. Has continually explored different languages over the last 10 years from C++ to Python and has explored different fields in depth from computer vision to data analysis`,
                    `Continuously learning in order to take advantage of all the tools available to make the most efficient app in both the front-end and back-end`,
                  ],
                }}
              </Experience>
              <Experience>
                {{
                  year: '2017-2023',
                  title: 'Senior Design Engineer',
                  text: [
                    ` Developed processes from the ground-up to take in (or reject) custom orders, sort them by key metrics, create custom tooling needed for each and manage the tooling inventory. Work with teams including Order Entry, CNC Team, Thermoforming Team, and Injection Foaming Teams`,
                    `Performed Data Analysis on our custom orders to reduce the amount of tooling we had on hand and explore different methods of production`,
                    `Developed multiple large-scale thermoforming mechanisms that were able to form custom sized showers, utilizing quick-change devices, custom heaters, pneumatics, large vacuum pressures, gearing, and interchangeable floors that were sized based on results from data analysis of previous custom orders over the years`,
                    `Trained incoming engineers on our processes and expectations`,
                    `Developed software to manage our unique processes to interact
                  across multiple programs such as Excel, NetSuite, SolidWorks and Mastercam`,
                  ],
                }}
              </Experience>
            </div>
            <div
              className="pdf-to-hide"
              style={{
                minWidth: '400px',
                height: '100%',
                // position: 'relative',
              }}
              // onClick={() => {
              //   alert('cliiiickwd');
              // }}
            >
              <div
                ref={pdfContainer}
                className="pdf-container"
                // style={{ position: 'relative', top: '35px' }}
              >
                <object
                  data="https://d2qxuoym2zs537.cloudfront.net/forPortfolio/Perpich_Fullstack_1-18-25.pdf"
                  type="application/pdf"
                  width="400px"
                  height="620px"
                ></object>
              </div>
            </div>
          </div>
          <div className="project-outer-container">
            <div className="projects-intro">
              <h2 className="title">#Latest Work</h2>
              {/* <h5 className="info">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </h5> */}
            </div>

            <ProjectSummary isMobile={isMobile} />
            {/* <ContactForm /> */}
          </div>
          <Footer />
        </main>
      </div>
    </>
  );
}

export default App;
