import { FC, useEffect } from "react";
import { useChatStore } from "store/chat.store";
import { ChatStatuses, useAppStore } from "store/app.store";

import { Intro } from "screens";
import { Chat } from "components";
import { getFindJobMessages, getQnAMessages } from "./data";

export const ChatContent: FC = () => {
  const { chatStatus } = useAppStore();
  const { updateMessages } = useChatStore();

  const showChat =
    chatStatus === ChatStatuses.FindAJob || chatStatus === ChatStatuses.QnA;

  useEffect(() => {
    switch (chatStatus) {
      case ChatStatuses.FindAJob:
        updateMessages(getFindJobMessages());
        break;

      case ChatStatuses.QnA:
        updateMessages(getQnAMessages());
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
