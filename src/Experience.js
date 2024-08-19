import React, { useEffect, useRef, useState } from 'react';
import './Experience.css';

export default function Experience({ children }) {
  const listRef = useRef(null);
  const [hiddenText, setHiddenText] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    // Handler to call on window resize
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Call handler right away so state gets updated with initial window size
    handleResize();

    // Remove event listener on cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []); // Empty array ensures that effect is only run on mount and unmount

  useEffect(() => {
    if (isTextOverflowing(listRef.current) && !expanded) {
      console.log('Text is overflowing');
      listRef.current.classList.add('fade-bottom');
      setHiddenText(true);
    } else {
      console.log('Text is not overflowing');
    }
  }, [windowSize]);

  useEffect(() => {
    if (expanded) {
      listRef.current.classList.remove('fade-bottom');
    }
  }, [expanded]);

  return (
    <div className="experience-box">
      <h2 className="title">{children.year}</h2>
      <h3 className="info"> {children.title}</h3>
      {/* <div className="experience-summary">
        {children.text.map((text) => (
          <p>{text}</p>
        ))}
      </div> */}
      <div
        ref={listRef}
        className="list-container"
        style={expanded ? { maxHeight: '1000px' } : {}}
      >
        <ul style={{ paddingLeft: '25px' }}>
          {children.text.map((text) => (
            <li className="experience-summary">{text}</li>
          ))}
        </ul>
      </div>
      {hiddenText && !expanded && (
        <div
          className="show-more"
          onClick={() => {
            setExpanded(true);
          }}
        >
          See More
        </div>
      )}
    </div>
  );
}

function isTextOverflowing(element) {
  console.log(
    'element.scrollHeight > element.clientHeight: ',
    element.scrollHeight,
    element.clientHeight
  );
  return (
    element.scrollHeight > element.clientHeight ||
    element.scrollWidth > element.clientWidth
  );
}

// Usage example
// const myDiv = document.getElementById('myDiv');
// if (isTextOverflowing(myDiv)) {
//   console.log('Text is overflowing');
// } else {
//   console.log('Text is not overflowing');
// }
