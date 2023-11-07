/* eslint-disable react-hooks/exhaustive-deps */
import React, { createContext, useCallback, useContext, useState } from "react";

import { IAuthContext } from "./types";
import { LocalStorage } from "utils/constants";

interface IAuthProviderProps {
  children: React.ReactNode;
}

export const authDefaultState: IAuthContext = {
  setError: () => {},
  clearAuthConfig: () => {},

  error: "",
  mobileSubscribeId: null,
};

const AuthContext = createContext<IAuthContext>(authDefaultState);

const AuthProvider = ({ children }: IAuthProviderProps) => {
  const [error, setError] = useState<string | null>(null);
  const [mobileSubscribeId, setMobileSubscribeId] = useState<number | null>(
    null
  );

  const clearAuthConfig = useCallback(() => {
    localStorage.removeItem(LocalStorage.SubscriberID);
    setMobileSubscribeId(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        setError,
        error,

        mobileSubscribeId,
        clearAuthConfig,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const useAuthContext = () => useContext(AuthContext);

export { AuthProvider, useAuthContext };
