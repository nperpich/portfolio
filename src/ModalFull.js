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
    <div className={`${classes.modal}`}>
      <main>
        {' '}
        <div>{children}</div>
        <div
          className={`${classes['exit-button']} ${classes['back-animation']}`}
          onClick={onClose}
        >
          <ArrowBackOutlinedIcon style={{ fontSize: '30px' }} />
          <div>Back </div>
        </div>
      </main>
    </div>
  );
};

const portalElement = document.getElementById('modal');

const ModalFull = ({ onModalClose, children }) => {
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

export default ModalFull;
