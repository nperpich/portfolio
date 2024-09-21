import React, { useState } from 'react';
import classes from './ContactForm.module.css';
import useInput from './useInput';
import { TextField } from '@mui/material';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import AccountCircle from '@mui/icons-material/AccountCircle';
import EmailIcon from '@mui/icons-material/Email';
import MessageIcon from '@mui/icons-material/Message';
import SendIcon from '@mui/icons-material/Send';
import useFetchOnDemand from './useFetchOnDemand';
import LoadingButton from '@mui/lab/LoadingButton';
import ContactComponent from './ContactComponent';
import { openInNewTab } from './ProjectSummary';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import HomeIcon from '@mui/icons-material/Home';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
// import './ContactComponent.css';
// import EmailIcon from '@mui/icons-material/Email';
// import { withStyles } from '@material-ui/core/styles';

export const SendMessageButton = styled(Button)(({ theme }) => ({
  boxShadow: 'none',
  backgroundColor: 'var(--sky-blue-darker)',
  '&:hover': {
    boxShadow: 'none',
    backgroundColor: 'var(--sky-blue-darker])',
  },
  //   '&:disabled': {
  //     boxShadow: 'none',
  //     color: 'white',
  //     backgroundColor: 'var(--accent)',
  //     opacity: 0.6,
  //   },
  color: 'white',
}));

const StyledTextField = styled(TextField)`
  background: none;
  width: 100%;
  margin: 10px 0;
  border-bottom-color: var(--rustic-blue);
  
  & .MuiInput-underline:hover:before {
    // border-color: red;
    border-bottom: 3px solid var(--rustic-blue);
    border-color: var(--rustic-blue);
  },

  & .MuiInputBase-input {
    color: var(--rustic-blue);
    border-bottom-color: var(--rustic-blue);

      border-radius: 0;
    },

    & label.Mui-focused {
        color: var(--rustic-blue);
    }
    & .MuiInput-underline:after {
      border-radius: 0;
      border-bottom-color: var(--rustic-blue);
    }
    & .MuiInput-underline:before {
      border-radius: 0;
      border-bottom-color: var(--rustic-blue);
    }
    & .MuiOutlinedInput-root {
     & fieldset {
        border-radius: 0;
      border-color: var(--rustic-blue);
    }
    &:hover fieldset {
      // border-color: red;
      // border-bottom: 1px solid red;
      // border-color: var(--rustic-blue);
    }
    
    &.Mui-focused fieldset {
      // border-bottom: 1px solid red;
      // border-color: var(--rustic-blue);
    }
  }


    & .MuiFormHelperText-root {
      color: red;
     
    },
  
  
`;

const AAAStyledTextField = styled(TextField)({
  //   variant: 'standard',
  //   border: 'none',
  borderColor: 'green',

  '& .MuiInput-underline:before': {
    border: 'none',
    borderBottom: '1px solid rgba(0, 0, 0, 0.42)', // Default bottom border
  },
  '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
    border: 'none',
    borderBottom: '2px solid rgba(0, 0, 0, 0.87)', // Hover state
  },
  '& .MuiInput-underline:after': {
    border: 'none',
    borderBottom: '2px solid #1976d2', // Focus state
  },
  width: '100%', // Full width
});

export default function ContactForm() {
  const [isSent, setIsSent] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [sendingTest, setSendingTest] = useState(false);

  const {
    enteredValue: enteredName,
    hasError: nameHasError,
    onBlurHandler: nameBlurHandler,
    onChangeHandler: nameChangeHandler,
    isValidValue: enteredNameIsValid,
    isTouched: nameIsTouched,
  } = useInput((value) => value.includes('@'), submitError);

  const {
    enteredValue: enteredEmail,
    hasError: emailHasError,
    onBlurHandler: emailBlurHandler,
    onChangeHandler: emailChangeHandler,
    isValidValue: enteredEmailIsValid,
    isTouched: emailIsTouched,
  } = useInput((value) => value.includes('@'), submitError);

  const {
    enteredValue: enteredMessage,
    hasError: messageHasError,
    onBlurHandler: messageBlurHandler,
    onChangeHandler: messageChangeHandler,
    isValidValue: enteredMessageIsValid,
    isTouched: messageIsTouched,
  } = useInput((value) => value.length > 0, submitError);

  const [allowContinue, setAllowContinue] = useState(false);
  const formIsValid = enteredEmailIsValid && enteredMessageIsValid;

  const {
    loading: sending,
    error: error,
    sendData: sendData,
  } = useFetchOnDemand(
    `https://api.dancelearningspace.com/api/v1/chat/contactMessageEmail`,
    (data) => {
      // dispatch(authActions.login(data.data.user));
      // navigateHandler();

      setIsSent(true);
      // alert('email successfully sent');
    },
    {
      method: 'POST',
      credentials: 'include', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: enteredName,
        email: enteredEmail,
        message: enteredMessage,
      }),
    },
    [enteredName, enteredEmail, enteredMessage]
  );

  function sendMessage() {
    if (formIsValid) {
      setSendingTest(true);
      // if (true) {

      sendData();
      // alert('submit!');
    } else {
      setSubmitError(true);
      console.log('in the eles');
      const helpers = document.querySelectorAll('.MuiFormHelperText-root');
      helpers.forEach((el) => {
        console.log(el);
        el.classList.add(classes.shake);
        setTimeout(() => {
          el.classList.remove(classes.shake);
        }, 600);
      });
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        gap: '30px',
        flexWrap: 'wrap',
      }}
    >
      <div className={`${classes['flip-card']}`}>
        <div
          className={`${classes['flip-card-inner']} ${
            isSent ? classes['fliiip'] : ''
          }`}
        >
          <div
            className={`${classes['outer-container']} ${classes['flip-card-front']}`}
          >
            <h2 className="contact-me">Contact Me</h2>
            <StyledTextField
              variant="standard"
              value={enteredName}
              onBlur={nameBlurHandler}
              onChange={nameChangeHandler}
              type="text"
              name="name"
              placeholder="Name"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AccountCircle
                      style={{ color: 'var(--sky-blue-darker)' }}
                    />
                  </InputAdornment>
                ),
              }}
            />
            {/* <br /> */}
            {/* <input type="email" name="email" placeholder="Your Email" /> */}
            <StyledTextField
              variant="standard"
              value={enteredEmail}
              onBlur={emailBlurHandler}
              onChange={emailChangeHandler}
              placeholder="Email"
              type="email"
              id="email"
              helperText={emailHasError && 'Not a valid email'}
              // FormHelperTextProps={{
              //   className: 'fuck',
              //   // className: classes.customHelperText,
              // }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon style={{ color: 'var(--sky-blue-darker)' }} />
                  </InputAdornment>
                ),
              }}
            />
            <StyledTextField
              multiline
              variant="standard"
              value={enteredMessage}
              onBlur={messageBlurHandler}
              onChange={messageChangeHandler}
              placeholder="Message"
              type="text"
              id="message"
              helperText={messageHasError && 'Please leave a message'}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <MessageIcon style={{ color: 'var(--sky-blue-darker)' }} />
                  </InputAdornment>
                ),
              }}
            />

            {/* <br /> */}
            {/* <textarea name="comments" placeholder="Your Comments"></textarea> */}
            {/* <br /> */}
            {/* <SendMessageButton
              style={{
                alignSelf: 'flex-end',
                maxWidth: '50px',
                minWidth: '50px',
                aspectRatio: 1,
                borderRadius: '50%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onClick={() => {
                if (isSent) return;
                sendMessage();
              }}
            >
              {isSent ? (
                'Sent'
              ) : error ? (
                'Error 😢'
              ) : (
                <SendIcon
                  style={{ color: 'white', position: 'relative', left: '2px' }}
                />
              )}
            </SendMessageButton> */}
            <LoadingButton
              sx={{
                height: '50px',
                alignSelf: 'flex-end',
                borderRadius: '25px',
                backgroundColor: sendingTest
                  ? 'yellow'
                  : 'var(--sky-blue-darker)', // Change background color during loading

                '&.Mui-disabled': {
                  color: 'inherit', // Override color
                  backgroundColor: 'transparent', // Override background color
                  boxShadow: 'none', // Remove box-shadow
                },
              }}
              onClick={() => {
                if (isSent) return;
                sendMessage();

                // false &&
                //   setTimeout(() => {
                //     setSendingTest(false);
                //   }, 2000);
              }}
              endIcon={<SendIcon />}
              // loading={loading}
              loading={sendingTest}
              loadingPosition="end"
              variant="contained"
            >
              Send
            </LoadingButton>
            {/* <button>F</button> */}
          </div>
          <div
            className={`${classes['outer-container']} ${classes['flip-card-back']}`}
          >
            <h2 style={{ fontSize: '40px', margin: 0 }}>Sent!</h2>
            <p style={{ margin: 0, textAlign: 'center' }}>
              We will get back to you as soon as possible! Thank you for your
              patience
            </p>

            {/* <SendMessageButton
          style={{
            position: 'absolute',
            bottom: 0,

            right: 0,
          }}
          onClick={() => {
            if (isSent) return;
            sendMessage();
          }}
        >
          {isSent ? (
            'Sent'
          ) : error ? (
            'Error 😢'
          ) : (
            <SendIcon
              style={{ color: 'white', position: 'relative', left: '2px' }}
            />
          )}
        </SendMessageButton> */}
          </div>
        </div>
      </div>
      <div className={`${classes.myInfo}  contact-info-me`}>
        {/* <h2 className="contact-me" style={{ color: 'var(--background)' }}>
          Contact Me
        </h2> */}
        <ContactComponent
          icon={<LocalPhoneIcon />}
          text={
            <a
              href="tel:+16304337325"
              // style={{ textDecoration: 'none', color: 'inherit' }}
            >
              +1-630-433-7325
            </a>
          }
        />
        <ContactComponent
          icon={<EmailIcon />}
          text={
            <a href="mailto:nicholas.perpich@gmail.com">
              nicholas.perpich@gmail.com
            </a>
          }
        />
        <ContactComponent icon={<HomeIcon />} text="Astoria Queens, NY" />
        <ContactComponent
          icon={<LinkedInIcon />}
          text="LinkedIn"
          clickHandler={() => {
            openInNewTab(
              'https://www.linkedin.com/in/nicholas-perpich-5241b228/'
            );
          }}
        />
        <ContactComponent
          icon={<GitHubIcon />}
          text="Github"
          clickHandler={() => {
            openInNewTab('https://github.com/nperpich');
          }}
        />
      </div>
    </div>
  );
}
