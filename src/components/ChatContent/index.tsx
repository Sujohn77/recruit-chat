import { FC, useEffect } from "react";
import { useChatStore } from "store/chat.store";
import { ChatScreens, useAppStore } from "store/app.store";

import { Intro } from "screens";
import { Chat } from "components";
import { findJobMessages, questions } from "./data";
import { getParsedMessages } from "utils/helpers";

export const ChatContent: FC = () => {
  const { chatScreen } = useAppStore();
  const { addNewMessages } = useChatStore();

  const showChat =
    chatScreen === ChatScreens.FindAJob || chatScreen === ChatScreens.QnA;

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
      {/* {showChat && <Chat isShowChat={showChat} />} */}

      {/* <Intro isSelectedOption={showChat} /> */}
    </>
  );
};
