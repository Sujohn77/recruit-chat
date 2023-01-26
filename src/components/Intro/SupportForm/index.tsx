import React, { FC, useState } from 'react';

import * as S from './styles';
import i18n from 'services/localization';

import { validateEmail } from 'utils/helpers';
import { useChatMessanger } from 'contexts/MessangerContext';
import { CHAT_ACTIONS } from 'utils/types';
import { INPUT_TYPES } from 'components/Layout/Input/types';
import { DefaultButton } from 'components/Layout/Buttons';
import { ButtonsTheme } from 'components/Layout/Buttons/types';

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

export const SupportForm: FC<PropsType> = () => {
  const { triggerAction } = useChatMessanger();
  const [errors, setErrors] = useState<{ name: string; text: string }[]>([]);
  const [email, setEmail] = useState('');
  const [isSubmit, setIsSubmit] = useState(false);
  const [description, setDescription] = useState('');
  const sendTxt = i18n.t('buttons:send');

  const onSubmit = () => {
    const updatedErrors = validateFields(email, description);
    if (!updatedErrors.length) {
      setIsSubmit(true);
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
        <S.Title>Support</S.Title>
        <S.Description>How we can help you?</S.Description>
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
        {!isSubmit ? (
          <DefaultButton
            onClick={onSubmit}
            theme={ButtonsTheme.Purple}
            value={sendTxt}
          />
        ) : (
          <S.SuccessText>
            We will send you an email with a response!
          </S.SuccessText>
        )}
      </S.Wrapper>
    </div>
  );
};
