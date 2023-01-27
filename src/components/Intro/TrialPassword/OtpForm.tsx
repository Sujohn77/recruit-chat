import { DefaultButton } from 'components/Layout/Buttons';
import { ButtonsTheme } from 'components/Layout/Buttons/types';
import { DefaultInput } from 'components/Layout/Input';
import { INPUT_TYPES } from 'components/Layout/Input/types';
import { useAuthContext } from 'contexts/AuthContext';
import React, { ChangeEvent, useEffect, useRef, useState } from 'react';

import { useTheme } from 'styled-components';
import { InputTheme } from 'utils/constants';

import { ThemeType } from 'utils/theme/default';
import * as S from './styles';
import * as IntoStyles from '../styles';

export const OtpForm = () => {
  const { loginByEmail, isVerified, error, setError } = useAuthContext();
  const [lengthError, setLengthError] = useState<string | null>(null);
  const [isSubmit, setIsSubmit] = useState(false);
  const theme = useTheme() as ThemeType;
  const [oneTimePassword, setOneTimePassword] = useState('');
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (error) {
      ref.current?.focus();
      setOneTimePassword('');
    }
  }, [error]);

  const onClick = async () => {
    if (oneTimePassword.length === 6) {
      await loginByEmail({ oneTimePassword });
      setIsSubmit(true);
    } else {
      setLengthError('Incorrect length');
      setOneTimePassword('');
      ref.current?.focus();
    }
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length < 7) {
      setLengthError(null);
      setError(null);
      setOneTimePassword(e.target.value);
    }
  };

  return (
    <IntoStyles.Wrapper theme={theme}>
      <DefaultInput
        type={INPUT_TYPES.NUMBER}
        placeHolder="0000"
        value={oneTimePassword}
        onChange={onChange}
        theme={InputTheme.Default}
        error={lengthError || error}
        style={{ textAlign: 'center', marginBottom: '16px' }}
        ref={ref}
      />
      {(!isSubmit || !isVerified) && (
        <DefaultButton
          value="Send"
          onClick={onClick}
          theme={ButtonsTheme.Purple}
          style={{ padding: '0 10px' }}
        />
      )}
      {isVerified && isSubmit && <S.OtpSentText>Thanks!</S.OtpSentText>}
    </IntoStyles.Wrapper>
  );
};
