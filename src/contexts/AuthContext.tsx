/* eslint-disable react-hooks/exhaustive-deps */
import React, { createContext, useContext, useEffect, useState } from 'react';

import { authInstance } from 'services';
import { IAuthContext } from './types';
import { authDefaultState, generateOtp } from 'utils/helpers';

type PropsType = {
  children: React.ReactNode;
};

const AuthContext = createContext<IAuthContext>(authDefaultState);
const AuthProvider = ({ children }: PropsType) => {
  const [error, setError] = useState<string | null>(null);
  const [subscriberID, setSubscriberID] = useState<number | null>(null);
  const [mobileSubscribeId, setMobileSubscribeId] = useState<number | null>(
    null
  );

  useEffect(() => {}, []);

  const loginByEmail = async (email: string) => {
    try {
      const response = await authInstance.verifyByEmail({
        email,
        verificationCode: generateOtp({ length: 6 }),
      });

      if (response.data?.isEmailExists) {
        const { subscriberID, MSISDN } = response.data;
        subscriberID && setSubscriberID(subscriberID);
        MSISDN && setMobileSubscribeId(MSISDN);
      }

      return response.ok;
    } catch (err) {
      setError(error);
    }
  };

  return (
    <AuthContext.Provider
      value={{ loginByEmail, setError, error, subscriberID, mobileSubscribeId }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const useAuthContext = () => useContext(AuthContext);

export { AuthProvider, useAuthContext };
