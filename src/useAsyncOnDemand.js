import { useCallback, useEffect, useState } from 'react';

export default function useAsyncOnDemand(
  callback,
  dispatchCallback,
  dependencies = []
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  //   const [value, setValue] = useState();

  const callbackMemoized = useCallback(() => {
    setLoading(true);
    setError(undefined);
    // setValue(undefined);
    callback()
      .then(dispatchCallback)
      .catch(setError)
      .finally(() => setLoading(false));
  }, dependencies);

  // useEffect(() => {
  //   callbackMemoized();
  // }, [callbackMemoized]);
  const sendData = callbackMemoized;

  return { loading, error, sendData };
}
