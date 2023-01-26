import { DefaultButton } from 'components/Layout/Buttons';
import { ButtonsTheme } from 'components/Layout/Buttons/types';
import { DefaultInput } from 'components/Layout/Input';
import { INPUT_TYPES } from 'components/Layout/Input/types';
import { useAuthContext } from 'contexts/AuthContext';
import React, {
  ChangeEvent,
  Dispatch,
  FC,
  SetStateAction,
  useState,
} from 'react';

import { useTheme } from 'styled-components';
import { InputTheme } from 'utils/constants';
import { validateEmail } from 'utils/helpers';
import { ThemeType } from 'utils/theme/default';
import * as S from '../styles';

type PropsType = {
  isOtpSent: boolean;
  setIsOtpSent: Dispatch<SetStateAction<boolean>>;
};

export const EmailForm: FC<PropsType> = ({ isOtpSent, setIsOtpSent }) => {
  const { loginByEmail, setError, error } = useAuthContext();

  const theme = useTheme() as ThemeType;
  const [email, setEmail] = useState('');

  const onClick = () => {
    const emailError = validateEmail(email);

    if (!emailError.length) {
      loginByEmail(email);
      setEmail('');
      setIsOtpSent(true);
    } else {
      emailError !== error && setError(error);
    }
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setEmail(e.target.value);
  };

  return (
    <S.Wrapper theme={theme}>
      <DefaultInput
        type={INPUT_TYPES.EMAIL}
        placeHolder="Email"
        value={email}
        onChange={onChange}
        theme={InputTheme.Default}
        error={error}
      />
      {!isOtpSent ? (
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
    </S.Wrapper>
  );
};
