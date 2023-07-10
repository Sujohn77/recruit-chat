import { FC, useEffect } from "react";
import { useChatStore } from "store/chat.store";
import { ChatStatuses, useAppStore } from "store/app.store";

import { Intro } from "screens";
import { Chat } from "components";
import { findJobMessages, questions } from "./data";
import { getParsedMessages } from "utils/helpers";

export const ChatContent: FC = () => {
  const { chatStatus } = useAppStore();
  const { addNewMessages } = useChatStore();

  const showChat =
    chatStatus === ChatStatuses.FindAJob || chatStatus === ChatStatuses.QnA;

  useEffect(() => {
    switch (chatStatus) {
      case ChatStatuses.FindAJob:
        addNewMessages(getParsedMessages(findJobMessages));
        break;

      case ChatStatuses.QnA:
        addNewMessages(getParsedMessages(questions));
        break;

      default:
        break;
    }
  }, [chatStatus]);

  return (
    <>
      {showChat && <Chat isShowChat={showChat} />}

      <Intro isSelectedOption={showChat} />
    </>
  );
};
