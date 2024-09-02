import { useChatMessenger } from "contexts/MessengerContext";
import { useCallback } from "react";
import { ApiResponse } from "apisauce";
import { useTranslation } from "react-i18next";

import { apiInstance } from "services/api";
import { ICheckAnswerResponse } from "services/types";
import { createTextMess } from "utils/helpers";
import { CHAT_ACTIONS, MessageType } from "utils/types";

interface ISetUserDataProps {
  messageValue: string;
  withEmail?: boolean;
}

export const useSetUserData = (): ((
  props: ISetUserDataProps
) => Promise<void>) => {
  const { t } = useTranslation();
  const {
    firstName,
    setFirstName,
    setMessages,
    setIsChatLoading,
    sendNewMessage,
  } = useChatMessenger();

  const setResponseWithDelay = useCallback((text: string, i18n?: string) => {
    setIsChatLoading(true);
    setTimeout(() => {
      setIsChatLoading(false);
      const res = createTextMess({ text, i18n });
      sendNewMessage({
        isOwn: false,
        message: res.content.text,
        localId: res.localId,
      });
      setMessages((prevMessages) => [res, ...prevMessages]);
    }, 500);
  }, []);

  return useCallback(
    async ({ messageValue }: ISetUserDataProps) => {
      if (!firstName) {
        setFirstName(messageValue.trim());
        setMessages((prev) => [
          createTextMess({ isOwn: true, text: messageValue }),
          ...prev,
        ]);

        setResponseWithDelay(
          t("messages:provide_lastname"),
          "messages:provide_lastname"
        );

        return;
      }
    },
    [firstName]
  );
};

export const useCheckAnswer = () =>
  useCallback(
    async (
      messageValue: string,
      isAcceptedApplyJob: boolean
    ): Promise<boolean | null | undefined> => {
      if (isAcceptedApplyJob) {
        return Promise.resolve(false);
      }
      try {
        const response: ApiResponse<ICheckAnswerResponse> =
          await apiInstance.checkAnswer({
            body: messageValue,
          });
        return Promise.resolve(response.data?.result);
      } catch (error) {
        Promise.resolve(false);
      }
    },
    []
  );

export const useIsDisabledInput = () => {
  const { currentMsgType, isChatLoading, messages, isChatInputAvailable } =
    useChatMessenger();

  const isLastMessageWithOptions =
    (!!messages?.[0]?.optionList &&
      !!messages?.[0]?.optionList.options.length) ||
    messages?.[0].content.subType === MessageType.TRY_AGAIN;
  const disabled =
    !isChatInputAvailable ||
    isLastMessageWithOptions ||
    (isChatLoading &&
      currentMsgType !== CHAT_ACTIONS.SET_CATEGORY &&
      currentMsgType !== CHAT_ACTIONS.SET_LOCATIONS);

  return disabled;
};
