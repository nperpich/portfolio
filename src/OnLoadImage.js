import { useEffect, useRef, useState } from 'react';
import './App.css';

export default function OnLoadImage({ src, className = '' }) {
  const imgEl = useRef(null);
  const [loaded, setLoaded] = useState(false);

  const onImageLoaded = () => {
    // alert('loaded');
    setLoaded(true);
  };

  useEffect(() => {
    const imgElCurrent = imgEl.current;

    if (imgElCurrent) {
      imgElCurrent.addEventListener('load', onImageLoaded);
      return () => imgElCurrent.removeEventListener('load', onImageLoaded);
    }
  }, [imgEl]);

  return (
    // <div className={className}>
    <img
      ref={imgEl}
      style={loaded ? {} : { display: 'none' }}
      src={src}
      className={`${className} just-loaded`}
    ></img>
    // </div>
  );
}
