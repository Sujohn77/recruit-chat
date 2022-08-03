import { Button, FormControl, TextField } from '@mui/material';
import { useChatMessanger } from 'contexts/MessangerContext';
import * as React from 'react';
import { FC, useState } from 'react';
import i18n from 'services/localization';
import styled from 'styled-components';
import { colors } from 'utils/colors';
import { CHAT_ACTIONS } from 'utils/types';

export const Wrapper = styled.div`
  background: ${colors.alto};
  border-radius: 10px;
  padding: 16px 18px;
  width: 249px;
  display: flex;
  flex-flow: column;
  gap: 20px;
  box-sizing: border-box;
  margin-bottom: 24px;
`;

export const Title = styled.p`
  margin: 0;
  font-size: 14px;
  line-height: 17px;
  color: ${colors.scorpion};
  text-align: center;
  font-weight: 500;
`;

export const Input = styled(TextField)`
  input {
    background: #f3f2f2;
    border-radius: 10px;

    padding: 7px 12px;
    font-family: Inter;
    font-weight: 400;
    font-size: 14px;
    line-height: 17px;
    height: 32px;
  }
  fieldset {
    border: none;
  }
  p {
    position: absolute;
    top: 12px;
    right: 8px;
  }
`;

export const FormButton = styled(Button)`
  background: ${colors.boulder}!important;
  border-radius: 100px !important;
  font-weight: 500 !important;
  color: ${colors.white}!important;
  font-size: 14px !important;
  line-height: 17px !important;
  height: 40px;
  text-transform: initial!import;
`;

type PropsType = {};

export const EmailForm: FC<PropsType> = () => {
  const { triggerAction } = useChatMessanger();
  const [error, setError] = useState<string>('');
  const [touched, setTouched] = useState(false);
  const [value, setValue] = useState('');

  const onChange = (e: any) => {
    if (error) {
      const updatedError = validate(value);
      updatedError !== error && setError(updatedError);
    }
    setValue(e.target.value);
  };

  const onClick = (value: string) => {
    const error = validate(value);
    if (error) {
      error && setError(error);
    } else {
      triggerAction({
        type: CHAT_ACTIONS.SEND_EMAIL,
        payload: { item: value },
      });
    }
  };
  const enterEmailTxt = i18n.t('chat_item_description:enter_email_title');
  const sendTxt = i18n.t('buttons:send');
  return (
    <Wrapper>
      <Title>{enterEmailTxt}</Title>
      <FormControl>
        <Input
          value={value}
          onChange={onChange}
          error={!!error}
          helperText={error}
          onClick={() => setTouched(!touched)}
          placeholder="Email"
        />
      </FormControl>
      <FormButton onClick={() => onClick(value)}>{sendTxt}</FormButton>
    </Wrapper>
  );
};

const validate = (value: string) => {
  if (!value) {
    return i18n.t('labels:required');
  }
  if (value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
    return i18n.t('labels:email_invalid');
  }
  return '';
};
