import { Fragment } from 'react';
import ReactDOM from 'react-dom';

import classes from './Modal.module.css';
import { motion } from 'framer-motion';

// const Backdrop = (props) => {
//   return <div className={classes.backdrop} onClick={props.onClose}/>;
// };

const ModalOverlay = (props) => {
  return (
    <motion.div
      key={`chatbox`}
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
      className={classes.modal}
      style={{ pointerEvents: 'none' }}
    >
      <div
        // style={{ display: 'inline-block' }}
        className={classes.content}
      >
        {props.children}
      </div>
    </motion.div>
  );
};

const portalElement = document.getElementById('chatbox');

const ModalSimple = (props) => {
  return (
    <Fragment>
      {/* {ReactDOM.createPortal(<Backdrop onClose={props.onClose} />, portalElement)} */}
      {ReactDOM.createPortal(
        <ModalOverlay>{props.children}</ModalOverlay>,
        portalElement
      )}
    </Fragment>
  );
};

export default ModalSimple;
