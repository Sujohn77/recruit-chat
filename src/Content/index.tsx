import { useChatMessenger } from "contexts/MessengerContext";
import { FC, useEffect, useState } from "react";

import { Chat } from "components";
import { Intro } from "screens";
import {
  EventIds,
  REFRESH_APP_TIMEOUT,
  REFRESH_TOKEN_TIMEOUT,
} from "utils/constants";
import { postMessToParent } from "utils/helpers";

export const Content: FC = () => {
  const { setIsApplyJobFlow, messages } = useChatMessenger();

  const [isSelectedOption, setIsSelectedOption] = useState<boolean | null>(
    null
  );

  useEffect(() => {
    if (!isSelectedOption) {
      setIsApplyJobFlow(false);
    }
  }, [isSelectedOption]);

  useEffect(() => {
    // REFRESH CHATBOT
    const timeout = setTimeout(() => {
      postMessToParent(EventIds.RefreshChatbot);
    }, REFRESH_APP_TIMEOUT);

    return () => clearTimeout(timeout);
  }, [messages.length]);

  useEffect(() => {
    // REFRESH TOKEN
    const interval = setInterval(() => {
      postMessToParent(EventIds.RefreshToken);
    }, REFRESH_TOKEN_TIMEOUT);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {isSelectedOption && (
        <Chat
          setIsSelectedOption={setIsSelectedOption}
          isSelectedOption={isSelectedOption}
        />
      )}

      <Intro
        setIsSelectedOption={setIsSelectedOption}
        isSelectedOption={isSelectedOption}
      />
    </>
  );
};
