import { FC, useEffect } from "react";
import { useChatStore } from "store/chat.store";

import { Intro } from "screens";
import { Chat } from "components";
import { findJobMessages, questions } from "./data";
import { getParsedMessages } from "utils/helpers";
import { ChatScreens } from "utils/constants";

export const ChatContent: FC = () => {
  const { chatScreen, addNewMessages } = useChatStore();

  const showChat = !!chatScreen && chatScreen !== ChatScreens.Default;

  useEffect(() => {
    switch (chatScreen) {
      case ChatScreens.FindAJob:
        addNewMessages(getParsedMessages(findJobMessages));
        break;

      case ChatScreens.QnA:
        addNewMessages(getParsedMessages(questions));
        break;

      default:
        break;
    }
  }, [chatScreen]);

  return (
    <>
      {showChat && <Chat isShowChat={showChat} />}

      <Intro isSelectedOption={showChat} />
    </>
  );
};
