import { useChatMessenger } from "contexts/MessengerContext";
import { FC, useCallback, useEffect, useState } from "react";
import { useTheme } from "styled-components";

import { StorePersist } from "./Persist";
import { Intro } from "screens";
import { Loader } from "components/Layout";
import { Chat, ChatWrapper } from "components";
import { usePersisState } from "contexts/persist";
import { useChatbotSideEffects } from "utils/hooks";
import { DefaultThemeType } from "utils/theme/default";
import { ChatScreens, EventIds, isMobile } from "utils/constants";
import { ImgWrapper, MobileIntroImg } from "screens/styles";

export const Content: FC = () => {
  const { chatScreen, messages, hostname } = useChatMessenger();
  const theme = useTheme() as DefaultThemeType;

  const [showLoader, setShowLoader] = useState(true);
  const [showIcon, setShowIcon] = usePersisState<boolean>({
    initialState: isMobile,
    storageKey: hostname + "show_icon",
  });
  const [isClosed, setIsClosed] = usePersisState<boolean>({
    initialState: false,
    storageKey: hostname + "isClosed",
  });

  const isSelectedOption =
    !isClosed &&
    !!chatScreen &&
    chatScreen !== ChatScreens.Default &&
    !!messages.length;

  useChatbotSideEffects(isSelectedOption);

  const onIconClick = useCallback(() => {
    window.parent.postMessage(
      JSON.parse(
        JSON.stringify({
          event_id: EventIds.IFrameHeight,
          isSelectedOption: true,
        })
      ),
      "*"
    );
    setIsClosed(false);
    setShowIcon(false);
  }, []);

  useEffect(() => {
    if (showIcon) {
      window.parent.postMessage(
        JSON.parse(
          JSON.stringify({
            event_id: EventIds.IFrameHeight,
            isSelectedOption: false,
          })
        ),
        "*"
      );
    }
  }, [showIcon]);

  useEffect(() => {
    setTimeout(() => setShowLoader(false), 1000);
  }, []);

  return (
    <StorePersist>
      {showLoader ? (
        <Loader showLoader margin="0 auto" />
      ) : (
        <>
          {showIcon ? (
            <ImgWrapper>
              <MobileIntroImg
                onClick={onIconClick}
                src={theme?.imageUrl}
                alt=""
              />
            </ImgWrapper>
          ) : (
            <>
              <ChatWrapper isChatOpen={isSelectedOption}>
                {isSelectedOption && (
                  <Chat setShowIcon={setShowIcon} setIsClosed={setIsClosed} />
                )}
              </ChatWrapper>

              <Intro
                isClosed={isClosed}
                isSelectedOption={isSelectedOption}
                setIsClosed={setIsClosed}
              />
            </>
          )}
        </>
      )}
    </StorePersist>
  );
};
