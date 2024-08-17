import { useState } from 'react';

const useInput = (validateFunction, defaultValue = '') => {
  const [enteredValue, setEnteredValue] = useState(defaultValue);
  const [isTouched, setIsTouched] = useState(false);

  const isValidValue = validateFunction(enteredValue);
  const hasError = !isValidValue && isTouched;

  const onChangeHandler = (event) => {
    setEnteredValue(event.target.value);
  };

  const onBlurHandler = (event) => {
    setIsTouched(true);
  };

  return {
    enteredValue,
    hasError,
    onBlurHandler,
    onChangeHandler,
    isValidValue,
  };
};

export default useInput;
