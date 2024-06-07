import { useChatMessenger } from "contexts/MessengerContext";
import { useCallback } from "react";
import { ApiResponse } from "apisauce";
import { useTranslation } from "react-i18next";

import { apiInstance } from "services/api";
import { ICheckAnswerResponse } from "services/types";
import { createTextMess } from "utils/helpers";

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
      });
      setMessages((prevMessages) => [res, ...prevMessages]);
    }, 500);
  }, []);

  return useCallback(
    async ({ messageValue, withEmail }: ISetUserDataProps) => {
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

export const useCheckAnswer = () => {
  return useCallback(
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
};
