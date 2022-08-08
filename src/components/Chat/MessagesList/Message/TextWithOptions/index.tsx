import { useChatMessanger } from 'contexts/MessangerContext';
import { map } from 'lodash';
import React, { FC } from 'react';
import { IMessageProps } from 'utils/helpers';
import { CHAT_ACTIONS } from 'utils/types';
import { MessageBox, MessageText } from '../styles';
import * as S from './styles';

interface IProps extends IMessageProps {
  text: string;
}

export const TextWithOptions: FC<IProps> = (props) => {
  const { text, ...messageProps } = props;
  const { triggerAction, lastActionType } = useChatMessanger();

  const onClick = (opt: string) => {
    if (lastActionType) {
      triggerAction({
        type: lastActionType,
        payload: { item: opt },
      });
    }
  };

  const options = lastActionType && getMessageOptions(lastActionType);
  const optionItems = map(options, (opt, index) => (
    <S.Option
      {...messageProps}
      key={`option-${lastActionType}=${index}`}
      onClick={() => onClick(opt)}
    >
      {opt}
    </S.Option>
  ));
  return (
    <div>
      <MessageBox {...messageProps} isText>
        <MessageText>{text}</MessageText>
      </MessageBox>
      <S.Options>{lastActionType && optionItems}</S.Options>
    </div>
  );
};

export const getMessageOptions = (type: CHAT_ACTIONS) => {
  switch (type) {
    case CHAT_ACTIONS.SET_ALERT_PERIOD:
      return ['Daily', 'Weekly', 'Monthly'];
    default:
      return [];
  }
};
