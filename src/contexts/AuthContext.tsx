/* eslint-disable react-hooks/exhaustive-deps */
import React, { createContext, useContext, useState } from 'react';

import { authInstance } from 'services';
import { IAuthContext } from './types';

import { LocalStorage } from 'utils/constants';
import { authDefaultState } from 'utils/helpers';
type PropsType = {
  children: React.ReactNode;
};

const AuthContext = createContext<IAuthContext>(authDefaultState);

const AuthProvider = ({ children }: PropsType) => {
  const [isOTPpSent, setIsOTPSent] = useState(false);
  const [verifyEmail, setVerifyEmail] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [subscriberID, setSubscriberID] = useState<number | null>(
    Number(localStorage.getItem(LocalStorage.SubscriberID))
  );
  const [mobileSubscribeId, setMobileSubscribeId] = useState<number | null>(
    null
  );

  const loginByEmail = async ({
    email,
    oneTimePassword,
  }: {
    oneTimePassword?: string;
    email?: string;
  }) => {
    try {
      email && setVerifyEmail(email);

      const data = {
        email: verifyEmail || email || '',
        verificationCode: oneTimePassword || undefined,
      };
      const response = await authInstance.verifyByEmail(data);
      if (response.data?.isEmailExists) {
        const { isOTPSent, MSISDN, isEmailVerified, subscriberID } =
          response.data;

        if (subscriberID) {
          setSubscriberID(subscriberID);
          localStorage.setItem(LocalStorage.SubscriberID, `${subscriberID}`);
        }
        MSISDN && setMobileSubscribeId(MSISDN);
        setIsVerified(!!response.data.isEmailVerified);
        !isEmailVerified && setIsOTPSent(!!isOTPSent);
      } else {
        setError('');
      }

      oneTimePassword &&
        !response.data?.isEmailVerified &&
        setError('Verify code is wrong');

      return response.ok;
    } catch (err) {
      setError('');
    }
  };

  const clearAuthConfig = () => {
    localStorage.removeItem(LocalStorage.SubscriberID);
    setSubscriberID(null);
    setMobileSubscribeId(null);
  };

  return (
    <AuthContext.Provider
      value={{
        loginByEmail,
        setError,
        error,
        subscriberID,
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
