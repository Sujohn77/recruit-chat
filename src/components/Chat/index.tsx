import React, { Dispatch, FC, SetStateAction } from 'react';

import { ChatHeader } from './ChatHeader';
import * as S from './styles';

import { MessageInput } from './MessageInput';

import { MessagesList } from './MessagesList';

import i18n from 'services/localization';
import { ViewJob } from './ViewJob';

import { useChatMessenger } from 'contexts/MessangerContext';
import { CHAT_ACTIONS, IRequisition } from 'utils/types';
import { useTheme } from 'styled-components';
import { ThemeType } from 'utils/theme/default';

type PropsType = {
    setIsSelectedOption: Dispatch<SetStateAction<boolean>>;
    children?: React.ReactNode | React.ReactNode[];
    isSelectedOption: boolean;
};

export const chatId = 2433044;

export const Chat: FC<PropsType> = ({ setIsSelectedOption, children, isSelectedOption }) => {
    const theme = useTheme() as ThemeType;
    const { viewJob, setViewJob, triggerAction } = useChatMessenger();

    const title = viewJob
        ? i18n.t('chat_item_description:view_job_title')
        : theme.chatbotName || i18n.t('chat_item_description:title');

    const handleApplyJobClick = (viewJob: IRequisition | null) => {
        setViewJob(null);
        triggerAction({
            type: CHAT_ACTIONS.APPLY_POSITION,
        });
    };

    return (
        <S.Wrapper isOpened={!!isSelectedOption}>
            <ChatHeader title={title} setIsSelectedOption={setIsSelectedOption} />
            <MessagesList />
            <ViewJob item={viewJob} onClick={() => handleApplyJobClick(viewJob)} />
            <MessageInput />
        </S.Wrapper>
    );
};
