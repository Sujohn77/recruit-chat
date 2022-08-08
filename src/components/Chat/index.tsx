import React, { Dispatch, FC, SetStateAction } from 'react';

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

type PropsType = {
  setIsSelectedOption: Dispatch<SetStateAction<boolean>>;
  children?: React.ReactNode | React.ReactNode[];
};

export const chatId = 2433044;

// TODO: refactor notification's part
export const Chat: FC<PropsType> = ({ setIsSelectedOption, children }) => {
  const { viewJob } = useChatMessanger();
  const { file, notification, resetFile } = useFileUploadContext();
  const title = viewJob
    ? i18n.t('chat_item_description:view_job_title')
    : i18n.t('chat_item_description:title');
  return (
    <S.Wrapper>
      <ChatHeader title={title} setIsSelectedOption={setIsSelectedOption} />
      <MessagesList />
      {viewJob && <ViewJob item={viewJob} />}
      {(file || notification) && (
        <S.Notification>
          {file?.name && <S.Icon src={ICONS.ATTACHED_FILE} />}
          <S.NotificationText>{file?.name || notification}</S.NotificationText>
          {file?.name && <Close onClick={() => resetFile()} />}
        </S.Notification>
      )}
      <MessageInput />
    </S.Wrapper>
  );
};
