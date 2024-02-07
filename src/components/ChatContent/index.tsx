import { useChatMessenger } from "contexts/MessengerContext";
import { FC } from "react";

import { Intro } from "screens";
import { Chat } from "components";
import { ChatScreens } from "utils/constants";

export const ChatContent: FC = () => {
  const { chatScreen } = useChatMessenger();
  const showChat = !!chatScreen && chatScreen !== ChatScreens.Default;

  return (
    <>
      {showChat && <Chat isShowChat={showChat} />}
      <Intro isSelectedOption={showChat} />
    </>
  );
};
