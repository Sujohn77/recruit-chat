import { FC, useEffect, useState } from "react";

import { Chat } from "components";
import { Intro } from "screens";
import { useChatMessenger } from "contexts/MessengerContext";

export const HomeContent: FC = () => {
  const { setIsApplyJobFlow } = useChatMessenger();
  const [isSelectedOption, setIsSelectedOption] = useState<boolean | null>(
    null
  );

  useEffect(() => {
    if (!isSelectedOption) {
      setIsApplyJobFlow(false);
    }
  }, [isSelectedOption]);

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
