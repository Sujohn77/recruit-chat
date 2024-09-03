import { useChatMessenger } from "contexts/MessengerContext";
import { FC, useCallback, useEffect, useRef, useState } from "react";
import { useTheme } from "styled-components";
import isNull from "lodash/isNull";

import { StorePersist } from "./Persist";
import { Chat } from "components";
import { Intro } from "screens";
import {
  ChatScreens,
  EventIds,
  REFRESH_TOKEN_TIMEOUT,
  isMobile,
} from "utils/constants";
import { Loader } from "components/Layout";
import { postMessToParent } from "utils/helpers";
import { usePersisState } from "contexts/persist";
import { ImgWrapper, MobileIntroImg } from "screens/Intro/styles";
import { DefaultThemeType } from "utils/theme/default";

export const Content: FC = () => {
  const { setIsApplyJobFlow, chatScreen, messages, hostname } =
    useChatMessenger();
  const firstTime = useRef<Date>(new Date());
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

  const onIconClick = useCallback(() => {
    setIsClosed(false);
    setShowIcon(false);
  }, []);

  useEffect(() => {
    setTimeout(() => setShowLoader(false), 1000);
  }, []);

  useEffect(() => {
    // for parent iframe height size
    window.parent.postMessage(
      JSON.parse(
        JSON.stringify({
          event_id: EventIds.IFrameHeight,
          isSelectedOption,
          isMobile,
        })
      ),
      "*"
    );
  }, [isSelectedOption]);

  useEffect(() => {
    if (chatScreen !== ChatScreens.FindAJob) {
      setIsApplyJobFlow(false);
    }
  }, [chatScreen]);

  useEffect(() => {
    // REFRESH TOKEN
    let timeout: NodeJS.Timeout | undefined;
    let interval: NodeJS.Timer | undefined;

    // the candidate may not initiate the chatbot for a long time (not selected anything in init screen)
    // in this case do not start the interval for token refresh
    if (!isNull(chatScreen)) {
      const currentTime = new Date();
      const difference = currentTime.getTime() - firstTime.current.getTime(); // difference in milliseconds
      let resultInMinutes = Math.round(difference / 60000);

      // when the candidate selects one of the chatbot options (ask a question or find a job)
      // then check how much time the token has left
      // and if it has expired then immediately refresh the token
      // and start an interval that will refresh the token after 29 minutes.

      if (resultInMinutes === 0) {
        // candidate chose the option immediately
        interval = setInterval(() => {
          postMessToParent(EventIds.RefreshToken);
        }, REFRESH_TOKEN_TIMEOUT);
      } else if (resultInMinutes > 28) {
        // if token exp.
        postMessToParent(EventIds.RefreshToken);
        interval = setInterval(() => {
          postMessToParent(EventIds.RefreshToken);
        }, REFRESH_TOKEN_TIMEOUT);
      } else {
        // otherwise we calculate how much time is left and start a timeout with the remaining time as prop.
        // and in the same timeout start an interval that will update the token every 29 min.

        const minutes = !!resultInMinutes ? 28 - resultInMinutes : 1;

        console.log(
          `%c no token expired soon -> refresh token (timeout ms: ${
            minutes * 60 * 1000
          }, min: ${minutes} ) + add interval for refresh token`,
          "background-color: darkblue; color: white; font-style: italic; border: 5px solid hotpink; font-size: 1em; padding: 5px;"
        );

        timeout = setTimeout(() => {
          postMessToParent(EventIds.RefreshToken);
          sessionStorage.clear();

          interval = setInterval(() => {
            postMessToParent(EventIds.RefreshToken);
          }, REFRESH_TOKEN_TIMEOUT);
        }, minutes * 60 * 1000);
      }

      firstTime.current = new Date();
    }

    return () => {
      timeout && clearTimeout(timeout);
      interval && clearInterval(interval);
    };
  }, [chatScreen]);

  return (
    <StorePersist>
      {showLoader ? (
        <Loader showLoader />
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
              {isSelectedOption && (
                <Chat
                  isShowChat={isSelectedOption}
                  setShowIcon={setShowIcon}
                  setIsClosed={setIsClosed}
                />
              )}
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
