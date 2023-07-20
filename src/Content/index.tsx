import { useChatMessenger } from "contexts/MessengerContext";
import { FC, useEffect, useState } from "react";

import { Chat } from "components";
import { Intro } from "screens";
import { TIMEOUT } from "utils/constants";

export const Content: FC = () => {
  const { setIsApplyJobFlow, logout, messages } = useChatMessenger();
  const [isSelectedOption, setIsSelectedOption] = useState<boolean | null>(
    null
  );

  useEffect(() => {
    if (!isSelectedOption) {
      setIsApplyJobFlow(false);
    }
  }, [isSelectedOption]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      logout();
      setIsSelectedOption(false);
    }, TIMEOUT);

    return () => clearTimeout(timeout);
  }, [messages.length]);

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
