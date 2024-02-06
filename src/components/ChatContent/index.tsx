import { FC, useEffect } from "react";
import { useChatStore } from "store/chat.store";

import { Intro } from "screens";
import { Chat } from "components";
import { findJobMessages, getQuestions } from "./data";
import { getParsedMessages } from "utils/helpers";
import { useChatMessenger } from "contexts/MessengerContext";
import { ChatScreens } from "utils/constants";

export const ChatContent: FC = () => {
  const { addNewMessages } = useChatStore();
  const { isReferralEnabled, referralCompanyName, chatScreen } =
    useChatMessenger();

  const showChat = !!chatScreen && chatScreen !== ChatScreens.Default;

  useEffect(() => {
    switch (chatScreen) {
      case ChatScreens.FindAJob:
        addNewMessages(getParsedMessages(findJobMessages));
        break;

      case ChatScreens.QnA:
        addNewMessages(
          getParsedMessages(
            getQuestions(isReferralEnabled, referralCompanyName)
          )
        );
        break;

      default:
        break;
    }
  }, [chatScreen, isReferralEnabled]);

  return (
    <>
      {showChat && <Chat isShowChat={showChat} />}

      <Intro isSelectedOption={showChat} />
    </>
  );
};
