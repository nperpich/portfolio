import { useEffect, useRef, useState } from 'react';
import './App.css';

export default function OnLoadImage({ src, className = '' }) {
  const imgEl = useRef(null);
  const [loaded, setLoaded] = useState(false);

  const onImageLoaded = () => {
    setLoaded(true);
  };

  useEffect(() => {
    const imgElCurrent = imgEl.current;

    if (imgElCurrent) {
      // Check if the image is already loaded (cached)
      if (imgElCurrent.complete) {
        onImageLoaded(); // Manually trigger the image loaded callback
      } else {
        // Add load event listener for non-cached images
        imgElCurrent.addEventListener('load', onImageLoaded);
      }

      // Cleanup event listener when component unmounts
      return () => imgElCurrent.removeEventListener('load', onImageLoaded);
    }
  }, [imgEl]);

  return (
    <>
      <img
        ref={imgEl}
        style={loaded ? {} : { display: 'none' }}
        src={src}
        className={`${className} just-loaded`}
      />
      {!loaded && <div className="portrait"></div>}
    </>
  );
}

// import { useEffect, useRef, useState } from 'react';
// import './App.css';

// export default function OnLoadImage({ src, className = '' }) {
//   const imgEl = useRef(null);
//   const [loaded, setLoaded] = useState(false);

//   const onImageLoaded = () => {
//     // alert('loaded');
//     setLoaded(true);
//   };

//   useEffect(() => {
//     const imgElCurrent = imgEl.current;

//     if (imgElCurrent) {
//       imgElCurrent.addEventListener('load', onImageLoaded);
//       return () => imgElCurrent.removeEventListener('load', onImageLoaded);
//     }
//   }, [imgEl]);

//   return (
//     <>
//       <img
//         ref={imgEl}
//         //   style={loaded ? {} : { visibility: 'hidden' }}
//         style={loaded ? {} : { display: 'none' }}
//         src={src}
//         className={`${className} just-loaded`}
//       ></img>
//       {!loaded && <div className="portrait"></div>}
//     </>
//   );
// }
