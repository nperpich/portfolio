import React from 'react';
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
  const {
    enteredValue: enteredName,
    hasError: nameHasError,
    onBlurHandler: nameBlurHandler,
    onChangeHandler: nameChangeHandler,
    isValidValue: enteredNameIsValid,
  } = useInput((value) => value.includes('@'));

  const {
    enteredValue: enteredEmail,
    hasError: emailHasError,
    onBlurHandler: emailBlurHandler,
    onChangeHandler: emailChangeHandler,
    isValidValue: enteredEmailIsValid,
  } = useInput((value) => value.includes('@'));

  const {
    enteredValue: enteredMessage,
    hasError: messageHasError,
    onBlurHandler: messageBlurHandler,
    onChangeHandler: messageChangeHandler,
    isValidValue: enteredMessageIsValid,
  } = useInput((value) => value.length > 0);

  const formIsValid = enteredEmailIsValid;

  return (
    <div className={classes['outer-container']}>
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
              <AccountCircle style={{ color: 'var(--sky-blue-darker)' }} />
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
      <SendMessageButton
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
        type="submit"
      >
        <SendIcon
          style={{ color: 'white', position: 'relative', left: '2px' }}
        />
      </SendMessageButton>
    </div>
  );
}