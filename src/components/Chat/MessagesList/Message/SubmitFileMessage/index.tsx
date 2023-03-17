import moment from 'moment';
import React, { FC, memo } from 'react';

import { IMAGES } from 'utils/constants';
import { getMessageProps } from 'utils/helpers';
import { ILocalMessage } from 'utils/types';

import { MS_1000 } from '..';
import { useFileUploadContext } from '../../../../../contexts/FileUploadContext';
import i18n from '../../../../../services/localization';
import { resumeElementId } from '../BrowseFile';

import * as S from '../styles';

interface IProps {
    message: ILocalMessage;
    isLastMessage?: boolean;
    onClick: () => void;
    buttonTxt: string;
}
export const SubmitFileMessage: FC<IProps> = memo(({ message, isLastMessage, buttonTxt, onClick }) => {
    const { resetFile } = useFileUploadContext();
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

    const onResetResume = () => {
        const resumeInput = document.getElementById(resumeElementId) as HTMLInputElement;
        if (resumeInput) {
            resumeInput.value = '';
            resetFile();
        }
    };

    const cancelTxt = i18n.t('buttons:cancel');
    const isActionButton = buttonTxt && onClick;
    return (
        <S.MessageBox {...messageProps} isLastMessage={isLastMessage}>
            <S.MessageText>{message.content.text || message.content.subType}</S.MessageText>
            {isActionButton && <S.ActionButton onClick={onClick}>{buttonTxt}</S.ActionButton>}
            {renderSendingTime(message)}
            {<S.Cancel onClick={onResetResume}>{cancelTxt}</S.Cancel>}
        </S.MessageBox>
    );
});
