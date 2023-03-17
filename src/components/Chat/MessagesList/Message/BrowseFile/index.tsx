import React, { ChangeEvent, FC, useRef } from 'react';
import { useFileUploadContext } from 'contexts/FileUploadContext';
import DragAndDrop from 'components/DragAndDrop';

import * as S from './styles';
import i18n from 'services/localization';
import * as ChatStyles from '../../../styles';
import { ICONS } from '../../../../../utils/constants';
import { Close } from '../../../../Intro/DefautMessages/styles';
import { useTheme } from 'styled-components';
import { ThemeType } from '../../../../../utils/theme/default';

type PropsType = {};

export const resumeElementId = 'chatbot_resume';

export const BrowseFile: FC<PropsType> = () => {
    const theme = useTheme() as ThemeType;
    const inputFile = useRef<HTMLInputElement>(null);
    const { file, notification, resetFile, showFile } = useFileUploadContext();

    const handleDrop = (upload: File) => {
        showFile(upload);
    };

    const onChangeFile = (event: ChangeEvent<HTMLInputElement>) => {
        event.stopPropagation();
        event.preventDefault();

        if (event.target.files?.length) {
            const file = event.target.files[0];
            handleDrop(file);
        }
    };

    const onHandleUpload = () => {
        inputFile.current?.click();
    };

    const onClearFile = () => {
        if (inputFile.current) {
            inputFile.current.value = '';
        }
        resetFile();
    };
    const browseTxt = i18n.t('buttons:browse');
    const cancelTxt = i18n.t('buttons:cancel');
    const dragAndDropTxt = i18n.t('messages:uploadCV');

    return (
        <S.Wrapper>
            <DragAndDrop handleDrop={handleDrop}>
                <S.Circle>
                    <S.Avatar onClick={onHandleUpload} />
                </S.Circle>

                <S.Text>{dragAndDropTxt}</S.Text>
                <S.Text>or</S.Text>
                <S.Browse htmlFor={resumeElementId}>{browseTxt}</S.Browse>
                <input
                    type="file"
                    id={resumeElementId}
                    name="myfile"
                    ref={inputFile}
                    accept=".pdf,.doc,.docx"
                    hidden
                    onChange={onChangeFile}
                />
                {file && <S.Cancel onClick={onClearFile}>{cancelTxt}</S.Cancel>}
            </DragAndDrop>

            {(file || notification) && (
                <ChatStyles.Notification>
                    {file?.name && <ChatStyles.Icon src={ICONS.ATTACHED_FILE} />}
                    <ChatStyles.NotificationText>{file?.name || notification}</ChatStyles.NotificationText>
                    {file?.name && (
                        <Close onClick={onClearFile} color={theme.primaryColor} style={{ top: 'calc(50% - 8px)' }} />
                    )}
                </ChatStyles.Notification>
            )}
        </S.Wrapper>
    );
};
