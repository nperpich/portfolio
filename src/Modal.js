import { Fragment } from 'react';
import { useEffect } from 'react';
import ReactDOM from 'react-dom';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import classes from './Modal.module.css';

const Backdrop = ({ onClose }) => {
  return <div className={classes.backdrop} onClick={onClose} />;
};

const ModalOverlay = ({ onClose, children }) => {
  return (
    <main className={`${classes.modal}`}>
      <div>{children}</div>

      <button className={classes['exit-button']} onClick={onClose}>
        <ArrowBackOutlinedIcon sx={{ color: 'white' }} />
      </button>
    </main>
  );
};

const portalElement = document.getElementById('modal');

const Modal = ({ onModalClose, children }) => {
  const handleUserKeyPress = (event) => {
    const { keyCode } = event;
    if (keyCode === 27) {
      onModalClose();
    }
  };
  useEffect(() => {
    window.addEventListener('keydown', handleUserKeyPress);
    return () => {
      window.removeEventListener('keydown', handleUserKeyPress);
    };
  }, []);

  return (
    <Fragment>
      {ReactDOM.createPortal(
        <Backdrop onClose={onModalClose} />,
        portalElement
      )}
      {ReactDOM.createPortal(
        <ModalOverlay onClose={onModalClose}>{children}</ModalOverlay>,
        portalElement
      )}
    </Fragment>
  );
};

export default Modal;
