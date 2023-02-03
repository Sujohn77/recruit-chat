import { DefaultButton } from 'components/Layout/Buttons';
import { ButtonsTheme } from 'components/Layout/Buttons/types';
import { DefaultInput } from 'components/Layout/Input';
import { INPUT_TYPES } from 'components/Layout/Input/types';
import { useAuthContext } from 'contexts/AuthContext';
import React, { ChangeEvent, FC, useState } from 'react';
import { Close } from 'screens/intro/styles';

import { useTheme } from 'styled-components';
import { colors } from 'utils/colors';
import { InputTheme } from 'utils/constants';
import { validateEmail } from 'utils/helpers';
import { ThemeType } from 'utils/theme/default';
import * as S from '../styles';

type PropsType = {
  setIsEmailForm: React.Dispatch<React.SetStateAction<boolean>>;
};

export const EmailForm: FC<PropsType> = ({ setIsEmailForm }) => {
  const { loginByEmail, setError, error, verifyEmail, isOTPpSent } =
    useAuthContext();

  const theme = useTheme() as ThemeType;
  const [email, setEmail] = useState('');

  const onClick = () => {
    const emailError = validateEmail(email);

    if (!emailError.length) {
      loginByEmail({ email });
    } else {
      emailError !== error && setError(emailError);
    }
    setEmail('');
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setEmail(e.target.value);
  };

  return (
    <S.Wrapper theme={theme} id="bot_email_form">
      <DefaultInput
        type={INPUT_TYPES.EMAIL}
        placeHolder="Email"
        value={email}
        onChange={onChange}
        theme={InputTheme.Default}
        error={!verifyEmail ? error : null}
        style={{ fontSize: '14px' }}
        isErrorIcon
      />
      {!isOTPpSent ? (
        <>
          <S.InputDescription>
            Login with an email or verify a new one please
          </S.InputDescription>
          <DefaultButton
            value="Send"
            onClick={onClick}
            theme={ButtonsTheme.Purple}
          />
        </>
      ) : (
        <>
          <S.EmailSentText>You’ve sent your email!</S.EmailSentText>
        </>
      )}
      <Close
        height="12px"
        onClick={() => setIsEmailForm(false)}
        color={colors.doveGray}
        style={{ right: '7px', top: '8px' }}
      />
    </S.Wrapper>
  );
};
