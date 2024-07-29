import useAsync from './useAsyncOnDemand';

const DEFAULT_OPTIONS = {
  headers: { 'Content-Type': 'application/json' },
};

export default function useFetchOnDemand(
  url,
  dispatchCallback,
  options = {},
  dependencies = []
) {
  return useAsync(
    () => {
      return fetch(url, { ...DEFAULT_OPTIONS, ...options }).then((res) => {
        if (res.ok) return res.json();
        return res.json().then((json) => Promise.reject(json));
      });
    },
    dispatchCallback,
    dependencies
  );
}
