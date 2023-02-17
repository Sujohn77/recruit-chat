import { useChatMessenger } from 'contexts/MessangerContext';
import { map } from 'lodash';
import React, { FC } from 'react';
import { getNextActionType, IMessageProps } from 'utils/helpers';
import { CHAT_ACTIONS } from 'utils/types';
import { MessageBox, MessageText } from '../styles';
import * as S from './styles';

interface IProps extends IMessageProps {
  text: string;
}

export const TextWithOptions: FC<IProps> = (props) => {
  const { text, ...messageProps } = props;
  const { triggerAction, currentMsgType } = useChatMessenger();

  const onClick = (opt: string) => {
    if (currentMsgType) {
      triggerAction({
        type: currentMsgType,
        payload: { item: opt },
      });
    }
  };

  const options = currentMsgType && getMessageOptions(currentMsgType);
  const optionItems = map(options, (opt, index) => (
    <S.Option
      {...messageProps}
      key={`option-${currentMsgType}=${index}`}
      onClick={() => onClick(opt)}
    >
      {opt}
    </S.Option>
  ));
  return (
    <div>
      <MessageBox {...messageProps}>
        <MessageText>{text}</MessageText>
      </MessageBox>
      {optionItems && currentMsgType && <S.Options>{optionItems}</S.Options>}
    </div>
  );
};

export const getMessageOptions = (type: CHAT_ACTIONS) => {
  switch (type) {
    // case CHAT_ACTIONS.SET_ALERT_PERIOD:
    //   return ['Daily', 'Weekly', 'Monthly'];
    case CHAT_ACTIONS.SET_WORK_PERMIT:
      return ['Yes', 'No'];
    default:
      return [];
  }
};
