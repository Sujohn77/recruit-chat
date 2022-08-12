import React, { FC, useState } from 'react';

import * as S from './styles';
import i18n from 'services/localization';

import { INPUT_TYPES } from 'components/Layout/Input/types';
import { validateEmail } from 'utils/helpers';
import { useChatMessanger } from 'contexts/MessangerContext';
import { CHAT_ACTIONS } from 'utils/types';

type PropsType = {};
const rows = 3;
export const QuestionForm: FC<PropsType> = () => {
  const { error, setError } = useChatMessanger();
  const [email, setEmail] = useState('');
  const [text, setText] = useState('');
  const sendTxt = i18n.t('buttons:send');

  const onSubmit = () => {
    const emailError = validateEmail(email);
    !error && setError(emailError);
  };

  return (
    <div>
      <S.Wrapper>
        <S.Title>Question form</S.Title>
        <S.QuestionInput
          type={INPUT_TYPES.TEXT}
          value={email}
          onChange={(e: any) => setEmail(e.target.value)}
          placeholder={'Email'}
        />
        <S.QuestionInput
          multiline={true}
          minRows={rows}
          value={text}
          onChange={(e: any) => setText(e.target.value)}
          placeholder={'Text'}
        />
        <S.SubmitButton onClick={onSubmit} isBackground>
          {sendTxt}
        </S.SubmitButton>
      </S.Wrapper>
    </div>
  );
};
