import React, { FC, useState } from 'react';

import * as S from './styles';
import i18n from 'services/localization';

import { validateEmail } from 'utils/helpers';
import { useChatMessenger } from 'contexts/MessangerContext';
import { CHAT_ACTIONS } from 'utils/types';
import { INPUT_TYPES } from 'components/Layout/Input/types';

type PropsType = {};
const rows = 3;

const validateFields = (email: string, text: string) => {
  const errors = [];
  const emailError = validateEmail(email);
  if (emailError) {
    errors.push({ name: 'email', text: emailError });
  }
  if (!text) {
    errors.push({ name: 'description', text: 'Required' });
  }
  return errors;
};

export const QuestionForm: FC<PropsType> = () => {
  const { triggerAction } = useChatMessenger();
  const [errors, setErrors] = useState<{ name: string; text: string }[]>([]);
  const [email, setEmail] = useState('');
  const [description, setDescription] = useState('');
  const sendTxt = i18n.t('buttons:send');

  const onSubmit = () => {
    const updatedErrors = validateFields(email, description);
    if (!updatedErrors.length) {
      triggerAction({ type: CHAT_ACTIONS.QUESTION_RESPONSE });
    } else {
      setErrors(updatedErrors);
    }
  };
  const emailError = errors.find((e) => e.name === 'email')?.text || '';
  const descriptionError =
    errors.find((e) => e.name === 'description')?.text || '';

  const onChangeEmail = (e: any) => {
    setEmail(e.target.value);
    if (errors.length) {
      const updatedErrors = validateFields(e.target.value, description);
      setErrors(updatedErrors);
    }
  };

  const onChangeDescription = (e: any) => {
    setDescription(e.target.value);
    if (errors.length) {
      const updatedErrors = validateFields(email, e.target.value);
      setErrors(updatedErrors);
    }
  };

  return (
    <div>
      <S.Wrapper>
        <S.Title>Question form</S.Title>
        <S.QuestionInput
          type={INPUT_TYPES.TEXT}
          value={email}
          onChange={onChangeEmail}
          placeholder={'Email'}
          error={!!emailError}
          helperText={emailError}
        />
        <S.QuestionInput
          multiline={true}
          minRows={rows}
          value={description}
          onChange={onChangeDescription}
          placeholder={'Text'}
          error={!!descriptionError}
          helperText={descriptionError}
        />
        <S.SubmitButton onClick={onSubmit}>{sendTxt}</S.SubmitButton>
      </S.Wrapper>
    </div>
  );
};
