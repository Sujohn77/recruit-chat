import { useChatMessenger } from "contexts/MessengerContext";
import { FC, useEffect, useRef } from "react";
import isNull from "lodash/isNull";

import { Chat } from "components";
import { Intro } from "screens";
import {
  EventIds,
  REFRESH_APP_TIMEOUT,
  REFRESH_TOKEN_TIMEOUT,
} from "utils/constants";
import { postMessToParent } from "utils/helpers";
import { ChatScreens, useAppStore } from "store/app.store";

export const Content: FC = () => {
  const { setIsApplyJobFlow, messages } = useChatMessenger();
  const firstTime = useRef<Date>(new Date());
  const { chatScreen } = useAppStore();

  const isSelectedOption = !!chatScreen && chatScreen !== ChatScreens.Default;

  useEffect(() => {
    // for parent iframe height size
    window.parent.postMessage(
      JSON.parse(
        JSON.stringify({
          event_id: EventIds.IFrameHeight,
          isSelectedOption,
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
    // REFRESH CHATBOT
    let timeout: NodeJS.Timeout | undefined;

    if (!isNull(chatScreen)) {
      timeout = setTimeout(
        () => postMessToParent(EventIds.RefreshChatbot),
        REFRESH_APP_TIMEOUT
      );
    }

    return () => timeout && clearTimeout(timeout);
  }, [chatScreen, messages.length]);

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
        // console.log(
        //   "%c token expired -> refresh token + add interval for refresh token",
        //   "background-color: darkblue; color: white; font-style: italic; border: 5px solid hotpink; font-size: 1em; padding: 5px;"
        // );
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
    <>
      {isSelectedOption && <Chat isShowChat={isSelectedOption} />}
      <Intro isSelectedOption={isSelectedOption} />
    </>
  );
};
