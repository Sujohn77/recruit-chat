import { DefaultButton } from 'components/Layout/Buttons';
import { ButtonsTheme } from 'components/Layout/Buttons/types';
import { DefaultInput } from 'components/Layout/Input';
import { INPUT_TYPES } from 'components/Layout/Input/types';
import { useAuthContext } from 'contexts/AuthContext';
import React, { ChangeEvent, useState } from 'react';

import { useTheme } from 'styled-components';
import { InputTheme } from 'utils/constants';

import { ThemeType } from 'utils/theme/default';
import * as S from '../styles';

export const OtpForm = () => {
  const { setError, error } = useAuthContext();
  const [isSubmit, setIsSubmit] = useState(false);
  const theme = useTheme() as ThemeType;
  const [oneTimePassword, setOneTimePassword] = useState('');

  const onClick = () => {
    setIsSubmit(true);
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setOneTimePassword(e.target.value);
  };

  return (
    <S.Wrapper theme={theme}>
      <DefaultInput
        type={INPUT_TYPES.EMAIL}
        placeHolder="0000"
        value={oneTimePassword}
        onChange={onChange}
        theme={InputTheme.Default}
        error={error}
        style={{ textAlign: 'center', marginBottom: '16px' }}
      />
      {!isSubmit ? (
        <DefaultButton
          value="Send"
          onClick={onClick}
          theme={ButtonsTheme.Purple}
          style={{ padding: '0 10px' }}
        />
      ) : (
        <S.EmailSentText>Thanks!</S.EmailSentText>
      )}
    </S.Wrapper>
  );
};
