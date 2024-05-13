import { useState, useEffect } from "react";
import browserStorage from "store";

// This hook receives two parameters:
// storageKey: This is the name of our storage that gets used when we retrieve/save our persistent data.
// initialState: This is our default value, but only if the store doesn't exist, otherwise it gets overwritten by the store.

interface IUsePersisState<T> {
  storageKey: string;
  initialState: T;
}

export const usePersisState = <T>({
  initialState,
  storageKey,
}: IUsePersisState<T>) => {
  const [state, setInternalState] = useState(initialState);

  useEffect(() => {
    const storageInBrowser = browserStorage.get(storageKey);

    if (storageInBrowser) {
      setInternalState(storageInBrowser);
    }
  }, []);

  const setState = (newState: any) => {
    browserStorage.set(storageKey, newState);
    setInternalState(newState);
  };

  return [state, setState];
};
