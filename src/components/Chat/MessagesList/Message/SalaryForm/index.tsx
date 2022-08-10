import React, { FC, useState } from 'react';

import * as S from './styles';
import i18n from 'services/localization';
import { Button } from 'components/Layout/styles';
import { currencies, ICONS } from 'utils/constants';

import { ILocalMessage } from 'utils/types';
import { getMessageProps } from 'utils/helpers';
import { Options } from '../TextWithOptions/styles';
import { map } from 'lodash';
import { TextField } from 'components/Layout/Input';

type PropsType = { message: ILocalMessage };

export const SalaryForm: FC<PropsType> = ({ message }) => {
  const [salary, setSalary] = useState('');
  const [currency, setCurrency] = useState('$');
  const messagesProps = getMessageProps(message);
  const buttonTxt = i18n.t('buttons:sent');

  const optionItems = map(currencies, (opt, index) => (
    <S.Option key={`currency-${index}`} onClick={() => setCurrency(opt)}>
      {opt}
    </S.Option>
  ));
  return (
    <S.Wrapper {...messagesProps} isText>
      <TextField
        value={salary}
        onChange={(e: any) => setSalary(e.target.value)}
        placeHolder={'0'}
      />
      <S.Options>{optionItems}</S.Options>
      <Button isBackground>{buttonTxt}</Button>
    </S.Wrapper>
  );
};
