import { useState, useEffect } from "react";
import browserStorage from "store";

// This hook receives two parameters:
// storageKey: This is the name of our storage that gets used when we retrieve/save our persistent data.
// initialState: This is our default value, but only if the store doesn't exist, otherwise it gets overwritten by the store.

interface IUsePersisState<T> {
  storageKey: string;
  initialState: T;
}

type UsePersisStateType = <T>(
  props: IUsePersisState<T>
) => [T, (newValue: T) => void];

export const usePersisState: UsePersisStateType = ({
  initialState,
  storageKey,
}) => {
  const [state, setInternalState] = useState(initialState);

  useEffect(() => {
    const storageInBrowser = browserStorage.get(storageKey);

    if (storageInBrowser) {
      setInternalState(
        typeof state === "string"
          ? storageInBrowser
          : JSON.parse(storageInBrowser)
      );
    }
  }, []);

  const setState = (newState: any) => {
    browserStorage.set(storageKey, newState);
    setInternalState(newState);
  };

  return [state, setState];
};
