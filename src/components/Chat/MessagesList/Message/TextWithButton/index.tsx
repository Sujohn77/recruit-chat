import moment from 'moment';
import React, { FC, memo } from 'react';

import { ICONS, IMAGES } from 'utils/constants';
import { getMessageProps } from 'utils/helpers';
import { ILocalMessage, MessageType } from 'utils/types';

import { MS_1000 } from '..';
import { Icon } from '../../styles';
import * as S from '../styles';

interface IProps {
    message: ILocalMessage;
    isLastMessage?: boolean;
    onClick: () => void;
    buttonTxt: string;
}
export const TextWithButton: FC<IProps> = memo(({ message, isLastMessage, buttonTxt, onClick }) => {
    const messageProps = { ...getMessageProps(message) };

    const createdAt = moment(message.dateCreated?.seconds! * MS_1000).format('HH:mm A');

    const renderSendingTime = (message: ILocalMessage) => {
        if (message.localId !== message._id && message.isOwn) {
            if (message._id) {
                return <S.TimeText>{createdAt}</S.TimeText>;
            }
            return <S.MessageUnsendIcon src={IMAGES.CLOCK} />;
        }

        return null;
    };
    const isActionButton = buttonTxt && onClick;
    return (
        <S.MessageBox {...messageProps} isLastMessage={isLastMessage}>
            <S.MessageText>{message.content.text || message.content.subType}</S.MessageText>
            {isActionButton && <S.ActionButton onClick={onClick}>{buttonTxt}</S.ActionButton>}
            {renderSendingTime(message)}
        </S.MessageBox>
    );
});
