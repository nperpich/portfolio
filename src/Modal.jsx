import { Fragment } from 'react';
import { useEffect } from 'react';
import ReactDOM from 'react-dom';
// import { IonIcon } from '@ionic/react';
// import { closeOutline } from 'ionicons/icons';
import classes from './Modal.module.css';
import { height } from '@mui/system';
import CloseIcon from '@mui/icons-material/Close';

const Backdrop = ({ onClose }) => {
  return (
    <div
      className={classes.backdropTransparent}
      onClick={onClose}
      //   style={{ opacity: 0.75 }}
    />
  );
};

const ModalOverlay = ({
  onClose,
  children,
  fixedHeight,
  xColor,
  hideX,
  paddingLeft,
  paddingRight,
}) => {
  return (
    <div
      className={`${classes.modal} ${
        fixedHeight
          ? classes['modal-fixed-height']
          : classes['modal-flexible-height']
      }`}
      style={
        {
          // left: paddingLeft,
          // right: paddingRight,
        }
      }
    >
      <div
        className={true ? classes.content : classes['content-flexible']}
        // className={fixedHeight ? classes.content : classes['content-flexible']}
      >
        {children}
      </div>
      {!hideX && (
        <button
          className={classes['exit-button']}
          onClick={onClose}
          style={{ color: xColor }}
        >
          <CloseIcon color="white" style={{ fontSize: '40px' }} />
        </button>
      )}
    </div>
  );
};

const portalElement = document.getElementById('overlays');

const Modal = ({
  onModalClose,
  children,
  fixedHeight = true,
  xColor = 'black',
  paddingLeft = '5%',
  paddingRight = '5%',
  hideX = false,
}) => {
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
        <ModalOverlay
          onClose={onModalClose}
          fixedHeight={fixedHeight}
          xColor={xColor}
          hideX={hideX}
          paddingLeft={paddingLeft}
          paddingRight={paddingRight}
        >
          {children}
        </ModalOverlay>,
        portalElement
      )}
    </Fragment>
  );
};

export default Modal;
