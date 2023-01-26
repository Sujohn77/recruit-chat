import React, { FC, useState } from 'react';

import * as S from './styles';
import i18n from 'services/localization';
import { DarkButton } from 'components/Layout/styles';
import { currencies } from 'utils/constants';

import { CHAT_ACTIONS, ILocalMessage } from 'utils/types';
import { getMessageProps } from 'utils/helpers';

import { map } from 'lodash';
import { useChatMessanger } from 'contexts/MessangerContext';
import { DefaultInput } from 'components/Layout/Input';

type PropsType = { message: ILocalMessage };

export const SalaryForm: FC<PropsType> = ({ message }) => {
  const { triggerAction, error } = useChatMessanger();
  const [salary, setSalary] = useState('');
  const [currency, setCurrency] = useState('$');
  const messagesProps = getMessageProps(message);
  const buttonTxt = i18n.t('buttons:sent');

  const optionItems = map(currencies, (opt, index) => (
    <S.Option
      selected={currency === opt}
      key={`currency-${index}`}
      onClick={() => setCurrency(opt)}
    >
      {opt}
    </S.Option>
  ));
  return (
    <S.Wrapper {...messagesProps}>
      <DefaultInput
        value={salary}
        onChange={(e: any) => setSalary(e.target.value)}
        placeHolder={'0'}
        error={error}
      />
      <S.Options>{optionItems}</S.Options>
      <DarkButton
        onClick={() =>
          Number(salary) > 400 &&
          Number(salary) < 15000 &&
          triggerAction({
            type: CHAT_ACTIONS.SET_SALARY,
            payload: { item: `${salary} ${currency}` },
          })
        }
      >
        {buttonTxt}
      </DarkButton>
    </S.Wrapper>
  );
};
