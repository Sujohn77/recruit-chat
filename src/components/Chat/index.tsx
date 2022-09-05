import React, { Dispatch, FC, SetStateAction, useEffect } from 'react';

import { ChatHeader } from './ChatHeader';
import * as S from './styles';

import { MessageInput } from './MessageInput';
import { useFileUploadContext } from 'contexts/FileUploadContext';
import { MessagesList } from './MessagesList';
import { ICONS } from 'utils/constants';
import { Close } from 'screens/intro/styles';
import i18n from 'services/localization';
import { ViewJob } from './ViewJob';

import { useChatMessanger } from 'contexts/MessangerContext';
import { CHAT_ACTIONS, IRequisition } from 'utils/types';
import { useTheme } from 'styled-components';
import { ThemeType } from 'utils/theme/default';

type PropsType = {
  setIsSelectedOption: Dispatch<SetStateAction<boolean>>;
  children?: React.ReactNode | React.ReactNode[];
};

export const chatId = 2433044;

export const Chat: FC<PropsType> = ({ setIsSelectedOption, children }) => {
  const theme = useTheme() as ThemeType;
  const { viewJob, setViewJob, triggerAction } = useChatMessanger();
  const { file, notification, resetFile } = useFileUploadContext();
  const title = viewJob ? i18n.t('chat_item_description:view_job_title') : i18n.t('chat_item_description:title');

  const handleApplyJobClick = (viewJob: IRequisition | null) => {
    setViewJob(null);
    triggerAction({
      type: CHAT_ACTIONS.APPLY_POSITION,
    });
  };

  return (
    <S.Wrapper>
      <ChatHeader title={title} setIsSelectedOption={setIsSelectedOption} />
      <MessagesList />
      <ViewJob item={viewJob} onClick={() => handleApplyJobClick(viewJob)} />

      {(file || notification) && (
        <S.Notification>
          {file?.name && <S.Icon src={ICONS.ATTACHED_FILE} />}
          <S.NotificationText>{file?.name || notification}</S.NotificationText>
          {file?.name && <Close onClick={() => resetFile()} color={theme.primaryColor} />}
        </S.Notification>
      )}
      <MessageInput />
    </S.Wrapper>
  );
};
