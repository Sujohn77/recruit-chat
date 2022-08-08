import moment from 'moment';
import React, { FC } from 'react';

import { ICONS, IMAGES } from 'utils/constants';
import { getMessageProps } from 'utils/helpers';
import { ILocalMessage, MessageType } from 'utils/types';

import { MS_1000 } from '..';
import { Icon } from '../../styles';
import * as S from '../styles';

interface IProps {
  message: ILocalMessage;
}
export const TextMessage: FC<IProps> = ({ message }) => {
  const subType = message.content.subType;
  const messageProps = { ...getMessageProps(message) };

  const isFile = subType === MessageType.FILE;
  const createdAt = moment(message.dateCreated?.seconds! * MS_1000).format(
    'HH:mm A'
  );

  const renderSendingTime = (message: ILocalMessage) => {
    if (message._id) {
      return <S.TimeText>{createdAt}</S.TimeText>;
    }
    if (message.isOwn) {
      return <S.MessageUnsendIcon src={IMAGES.CLOCK} />;
    }
    return null;
  };

  return (
    <S.MessageBox {...messageProps} isText>
      <S.MessageContent isFile={isFile}>
        {isFile && <Icon src={ICONS.ATTACHED_FILE} />}

        <S.MessageText>
          {message.content.text || message.content.subType}
        </S.MessageText>

        {renderSendingTime(message)}
      </S.MessageContent>
    </S.MessageBox>
  );
};
