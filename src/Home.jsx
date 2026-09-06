import { useEffect, useRef } from 'react';
import Codebox from './Codebox';
import Experience from './Experience';
import OnLoadImage from './OnLoadImage';
import Footer from './Footer';
import ProjectSummary from './ProjectSummary';

export const projects = [
  {
    id: 'dance-library',

    // ===== SUMMARY CARD =====
    title: 'Dance Library',
    summaryTitle: '#Dance Library',
    blurb:
      '— A video service for dance studios that allows for easy indexing, sharing, and various tools to practice',

    image:
      'https://d2qxuoym2zs537.cloudfront.net/forPortfolio/dance-app-collage-3.png',

    gradientClass: 'img-container-gradient',

    // ===== LINKS =====
    liveDemo: 'https://www.dancelearningspace.com/demo',

    // ===== QR MODAL =====
    qr: {
      phoneImage:
        'https://d2qxuoym2zs537.cloudfront.net/forPortfolio/qr-on-phone-2.png',
      warningTitle: 'Warning!',
      warningText:
        'For the best experience, scan the following code with a mobile device 😁',
      skipText: 'continue without mobile',
    },

    // ===== DETAIL SECTIONS =====
    experience: [
      {
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
          'Framer Motion',
        ],
      },

      {
        year: 'Backend',
        title: 'Senior Design Engineer',
        text: [
          'Worked with AWS services to manage video uploads, from creating presigned-URLs, processing the videos with Elastic Transcoder, storing in S3 buckets and distributing using CloudFront. These process are automated together with the help of Lambda Functions',
          'Strong knowledge of MongoDB including schema creation, post/pre-hooks, indexing for quick and resource-efficient queries, populates, and aggregation',
          'Uses HLS video format to drastically reduce the amount of data transfered. Allows for streaming discrete sections',
          'Uses automated email services for signing up new users',
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
      },
    ],
  },
  {
    id: 'date-with-destiny',

    // ===== SUMMARY CARD =====
    title: 'Date With Destiny',
    summaryTitle: '#Date With Destiny',

    blurb:
      '— An immersive relationship transformation journey inspired by Tony Robbins, featuring shared rituals, guided reflections, and real-time partner presence.',

    image: '/hero-images/date-with-destiny-hero.jpg', // replace with your collage

    gradientClass: 'img-container-gradient-tony', // optional custom gradient theme

    // ===== LINKS =====
    liveDemo: 'https://date-with-destiny.vercel.app/demo', // or null if private

    // ===== QR MODAL =====
    // qr: {
    //   phoneImage: 'https://your-cdn.com/tony-app/qr-preview.png', // optional
    //   warningTitle: 'Best experienced together 📱',
    //   warningText:
    //     'This journey is designed for two partners. Scan on your mobile device to enter the shared experience.',
    //   skipText: 'continue solo preview',
    // },

    // ===== EXPERIENCE / CASE STUDY =====
    experience: [
      {
        year: 'Experience Design',
        title: 'Immersive Journey Architect',
        text: [
          'Designed a 30-day guided relationship transformation journey inspired by Tony Robbins frameworks',
          'Crafted structured daily flows including Opening Frames, Shared Rituals, Reflections, and Closing Integrations',
          'Focused on emotional pacing, psychological safety, and progressive vulnerability',
        ],
        skills: [
          'UX Design',
          'Journey Mapping',
          'Behavioral Psychology',
          'Emotional Design',
        ],
      },

      {
        year: 'Frontend',
        title: 'Interactive Systems Engineer',
        text: [
          'Built immersive animated interfaces using Framer Motion with shared layout transitions',
          'Developed audio-reactive UI elements including waveform visualizers and ambient soundscapes',
          'Created modular journey components such as Waiting Rooms, Presence Avatars, and Reflection Flows',
        ],
        skills: [
          'ReactJS',
          'Framer Motion',
          'MUI',
          'CSS Modules',
          'Audio APIs',
        ],
      },

      {
        year: 'Realtime Infrastructure',
        title: 'Partner Presence Systems',
        text: [
          'Engineered real-time partner presence using Supabase Realtime channels',
          'Built synchronized readiness states, waiting rooms, and shared ritual triggers',
          'Designed database schemas for containers, participants, and shared reflections',
        ],
        skills: [
          'Supabase',
          'PostgreSQL',
          'Realtime WebSockets',
          'Presence Systems',
        ],
      },

      {
        year: 'Backend & Data',
        title: 'Journey Data Architect',
        text: [
          'Modeled relational data structures for phases, days, rituals, and reflections',
          'Implemented persistence for individual and shared responses',
          'Designed scalable container-based session architecture',
        ],
        skills: [
          'Node.js',
          'API Design',
          'Database Modeling',
          'Session Architecture',
        ],
      },
    ],
  },
  {
    id: 'delmari-tours',

    // ===== SUMMARY CARD =====
    title: 'Delmari Tours',
    summaryTitle: '#Delmari Tours',

    blurb:
      '— A tourism booking platform for discovering and reserving curated local experiences across Medellín and surrounding regions.',

    image: '/hero-images/tour-hero.jpg', // replace with real collage

    gradientClass: 'img-container-gradient-delmari',

    // ===== LINKS =====
    // liveDemo: 'https://www.delmari.tours', // replace if different

    // ===== QR MODAL =====
    qr: {
      phoneImage: 'https://your-cdn.com/delmari/qr-preview.png', // optional
      warningTitle: 'Explore on mobile 🌎',
      warningText:
        'Browse tours, galleries, and booking options seamlessly from your mobile device.',
      skipText: 'continue on desktop',
    },

    // ===== EXPERIENCE / CASE STUDY =====
    experience: [
      {
        year: 'Product Design',
        title: 'Travel Experience Platform',
        text: [
          'Designed an end-to-end tourism booking experience focused on clarity, trust, and visual storytelling',
          'Structured tour pages with rich media galleries, itineraries, accessibility info, and pricing widgets',
          'Optimized UX for international travelers booking experiences in Colombia',
        ],
        skills: [
          'UX Design',
          'Product Design',
          'Conversion Optimization',
          'Travel Platform Architecture',
        ],
      },

      {
        year: 'Frontend',
        title: 'Interactive Booking Interfaces',
        text: [
          'Built dynamic tour pages with image galleries, expandable itineraries, and interactive pricing components',
          'Developed reusable components such as AttractionGallery, PriceWidget, and AccessibilityChips',
          'Implemented responsive layouts optimized for mobile-first booking flows',
        ],
        skills: [
          'ReactJS',
          'Framer Motion',
          'MUI',
          'Responsive Design',
          'Component Architecture',
        ],
      },

      {
        year: 'Payments & Checkout',
        title: 'Stripe Booking System',
        text: [
          'Integrated Stripe Checkout Sessions for secure international payments',
          'Modeled booking metadata including tour date, group size, and language preferences',
          'Implemented webhook handling for booking confirmations and fulfillment workflows',
        ],
        skills: [
          'Stripe API',
          'Webhooks',
          'Payment Processing',
          'Checkout Systems',
        ],
      },

      {
        year: 'Backend & Infrastructure',
        title: 'Tour Management Systems',
        text: [
          'Built REST APIs for managing tours, bookings, and media assets',
          'Implemented AWS S3 storage for tour images and promotional content',
          'Designed MongoDB schemas for tours, availability scheduling, and reservations',
        ],
        skills: ['Node.js', 'Express.js', 'MongoDB', 'AWS S3', 'REST APIs'],
      },

      {
        year: 'Scheduling & Logistics',
        title: 'Availability & Calendar Systems',
        text: [
          'Integrated calendar-based scheduling for tour availability and booking windows',
          'Designed admin workflows for managing tour capacity and blackout dates',
          'Enabled real-time booking validation to prevent overbooking',
        ],
        skills: [
          'Google Calendar API',
          'Scheduling Systems',
          'Availability Modeling',
        ],
      },
    ],
  },
];

export default function Home({ isMobile, appContainerRef }) {
  const pdfContainer = useRef(null);
  const pdfOuterContainer = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const pdfRect = pdfOuterContainer.current.getBoundingClientRect(); // Get the bounding rectangle of the pdfContainer
      const top = pdfRect.top;
      const right = pdfRect.right;
      const bottom = pdfRect.bottom;
      const height = bottom - top;

      // Check if the top of pdfContainer is within the viewport
      if (top <= 100) {
        if (top + height - (620 + 5.5) <= 100 + 35) {
          pdfContainer.current.classList.remove('abc');
          pdfContainer.current.classList.add('def');
        } else {
          pdfContainer.current.classList.add('abc');
          pdfContainer.current.classList.remove('def');
        }
      } else {
        pdfContainer.current.classList.remove('abc');
        pdfContainer.current.classList.remove('def');
      }
    };

    const scrollEl = appContainerRef.current;
    scrollEl.addEventListener('scroll', handleScroll);

    return () => {
      scrollEl.removeEventListener('scroll', handleScroll);
    };
  }, [appContainerRef]);

  return (
    <main>
      <div className="pic-and-name">
        <div className="portrait-container">
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
                stack: 'MERN',
              }}
              rightAlign={true}
            />
          </div>
        </div>
      </div>

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
          }}
        >
          <div ref={pdfContainer} className="pdf-container">
            <object
              data="/resume_2026.pdf"
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
        </div>
        {projects.map((project) => (
          <ProjectSummary
            key={project.id}
            project={project}
            isMobile={isMobile}
          />
        ))}
      </div>
      <Footer />
    </main>
  );
}
