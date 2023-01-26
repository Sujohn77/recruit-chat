import { DefaultButton } from 'components/Layout/Buttons';
import { ButtonsTheme } from 'components/Layout/Buttons/types';
import { DefaultInput } from 'components/Layout/Input';
import { INPUT_TYPES } from 'components/Layout/Input/types';
import { useAuthContext } from 'contexts/AuthContext';
import React, { ChangeEvent, useRef, useState } from 'react';

import { useTheme } from 'styled-components';
import { InputTheme } from 'utils/constants';

import { ThemeType } from 'utils/theme/default';
import * as S from './styles';
import * as IntoStyles from '../styles';

export const OtpForm = () => {
  const [error, setError] = useState<string | null>(null);
  const [isSubmit, setIsSubmit] = useState(false);
  const theme = useTheme() as ThemeType;
  const [oneTimePassword, setOneTimePassword] = useState('');
  const ref = useRef<HTMLInputElement>(null);

  const onClick = () => {
    if (oneTimePassword.length === 6) {
      setIsSubmit(true);
    } else {
      setError('Incorrect length');
      setOneTimePassword('');
      ref.current?.focus();
    }
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length < 7) {
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
        error={error}
        style={{ textAlign: 'center', marginBottom: '16px' }}
        ref={ref}
      />
      {!isSubmit ? (
        <DefaultButton
          value="Send"
          onClick={onClick}
          theme={ButtonsTheme.Purple}
          style={{ padding: '0 10px' }}
        />
      ) : (
        <S.OtpSentText>Thanks!</S.OtpSentText>
      )}
    </IntoStyles.Wrapper>
  );
};
