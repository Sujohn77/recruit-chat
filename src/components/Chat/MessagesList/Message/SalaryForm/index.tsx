import React, { FC, useState } from 'react';

import * as S from './styles';
import i18n from 'services/localization';
import { Button } from 'components/Layout/styles';
import { currencies, ICONS } from 'utils/constants';

import { CHAT_ACTIONS, ILocalMessage } from 'utils/types';
import { getMessageProps } from 'utils/helpers';

import { map } from 'lodash';
import { TextField } from 'components/Layout/Input';
import { useChatMessanger } from 'contexts/MessangerContext';

type PropsType = { message: ILocalMessage };

export const SalaryForm: FC<PropsType> = ({ message }) => {
  const { triggerAction } = useChatMessanger();
  const [salary, setSalary] = useState('');
  const [currency, setCurrency] = useState('$');
  const messagesProps = getMessageProps(message);
  const buttonTxt = i18n.t('buttons:sent');

  const optionItems = map(currencies, (opt, index) => (
    <S.Option
      isActive={currency === opt}
      key={`currency-${index}`}
      onClick={() => setCurrency(opt)}
    >
      {opt}
    </S.Option>
  ));
  return (
    <S.Wrapper {...messagesProps}>
      <TextField
        value={salary}
        onChange={(e: any) => setSalary(e.target.value)}
        placeHolder={'0'}
      />
      <S.Options>{optionItems}</S.Options>
      <Button
        onClick={() =>
          triggerAction({
            type: CHAT_ACTIONS.SET_SALARY,
            payload: { item: `${salary} ${currency}` },
          })
        }
        isBackground
      >
        {buttonTxt}
      </Button>
    </S.Wrapper>
  );
};
