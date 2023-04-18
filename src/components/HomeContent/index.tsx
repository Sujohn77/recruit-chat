import { SocketProvider } from "contexts/SocketContext";
import { FC, useState } from "react";

import { Chat } from "components";
import { Intro } from "screens";

export const HomeContent: FC = () => {
  const [isSelectedOption, setIsSelectedOption] = useState<boolean | null>(
    null
  );

  return (
    <SocketProvider>
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
    </SocketProvider>
  );
};
