/* eslint-disable react-hooks/exhaustive-deps */
import React, { createContext, useCallback, useContext, useState } from "react";

import { IAuthContext, IEmailLogin } from "./types";
import { authInstance } from "services/api";
import { LocalStorage } from "utils/constants";

interface IAuthProviderProps {
  children: React.ReactNode;
}

export const authDefaultState: IAuthContext = {
  loginByEmail: () => {},
  setError: () => {},
  clearAuthConfig: () => {},

  error: "",
  isVerified: false,
  isOTPpSent: false,
  verifyEmail: "",
  mobileSubscribeId: null,
};

const AuthContext = createContext<IAuthContext>(authDefaultState);

const AuthProvider = ({ children }: IAuthProviderProps) => {
  const [isOTPpSent, setIsOTPSent] = useState(false);
  const [verifyEmail, setVerifyEmail] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mobileSubscribeId, setMobileSubscribeId] = useState<number | null>(
    null
  );

  const loginByEmail = async ({ email, oneTimePassword }: IEmailLogin) => {
    try {
      email && setVerifyEmail(email);

      const data = {
        email: verifyEmail || email || "",
        verificationCode: oneTimePassword || undefined,
      };

      const response = await authInstance.verifyByEmail(data);
      if (response.data?.isEmailExists) {
        const { isOTPSent, MSISDN, isEmailVerified } = response.data;

        MSISDN && setMobileSubscribeId(MSISDN);
        setIsVerified(!!response.data.isEmailVerified);
        !isEmailVerified && setIsOTPSent(!!isOTPSent);
      } else {
        setError("");
      }

      oneTimePassword &&
        !response.data?.isEmailVerified &&
        setError("Verify code is wrong");

      return response.ok;
    } catch (err) {
      setError("");
    }
  };

  const clearAuthConfig = useCallback(() => {
    localStorage.removeItem(LocalStorage.SubscriberID);
    setMobileSubscribeId(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        loginByEmail,
        setError,
        error,

        mobileSubscribeId,
        isOTPpSent,
        isVerified,
        verifyEmail,
        clearAuthConfig,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const useAuthContext = () => useContext(AuthContext);

export { AuthProvider, useAuthContext };
