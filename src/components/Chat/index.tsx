import { useChatMessenger } from "contexts/MessengerContext";
import React, { Dispatch, FC, SetStateAction, useState } from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "styled-components";

import {
  ChatHeader,
  MessageInput,
  MessagesList,
  ViewJob,
} from "./chatComponents";
import * as S from "./styles";
import { ThemeType } from "utils/theme/default";
interface IChatProps {
  isSelectedOption: boolean;
  setIsSelectedOption: Dispatch<SetStateAction<boolean>>;
  children?: React.ReactNode | React.ReactNode[];
}

export const Chat: FC<IChatProps> = ({
  isSelectedOption,
  setIsSelectedOption,
}) => {
  const { t } = useTranslation();
  const theme = useTheme() as ThemeType;
  const { viewJob } = useChatMessenger();

  const [height, setHeight] = useState(480);

  const title = viewJob
    ? t("chat_item_description:view_job_title")
    : theme.chatbotName || t("chat_item_description:title");

  return (
    <S.Wrapper isOpened={!!isSelectedOption}>
      <ChatHeader title={title} setIsSelectedOption={setIsSelectedOption} />
      <MessagesList resultsHeight={height} />
      <ViewJob />
      <MessageInput setHeight={setHeight} />
    </S.Wrapper>
  );
};
