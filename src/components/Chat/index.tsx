import { useChatMessenger } from "contexts/MessengerContext";
import React, { Dispatch, FC, SetStateAction } from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "styled-components";

import {
  ChatHeader,
  MessageInput,
  MessagesList,
  ViewJob,
} from "./chatComponents";
import * as S from "./styles";
import { CHAT_ACTIONS, IRequisition } from "utils/types";
import { ThemeType } from "utils/theme/default";

interface IChatProps {
  isSelectedOption: boolean;
  setIsSelectedOption: Dispatch<SetStateAction<boolean>>;
  children?: React.ReactNode | React.ReactNode[];
}

export const Chat: FC<IChatProps> = ({
  isSelectedOption,
  setIsSelectedOption,
  children,
}) => {
  const { t } = useTranslation();
  const theme = useTheme() as ThemeType;
  const { viewJob, setViewJob, dispatch } = useChatMessenger();

  const title = viewJob
    ? t("chat_item_description:view_job_title")
    : theme.chatbotName || t("chat_item_description:title");

  const handleApplyJobClick = (viewJob: IRequisition | null) => {
    setViewJob(null);
    dispatch({
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
