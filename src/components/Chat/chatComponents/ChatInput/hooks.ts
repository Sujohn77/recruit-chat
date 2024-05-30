import { useChatMessenger } from "contexts/MessengerContext";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";

import { createTextMess } from "utils/helpers";

interface ISetUserDataProps {
  messageValue: string;
  withEmail?: boolean;
}

export const useSetUserData = (): ((
  props: ISetUserDataProps
) => Promise<void>) => {
  const { t } = useTranslation();
  const { firstName, setFirstName, setMessages, setIsChatLoading } =
    useChatMessenger();

  const setResponseWithDelay = useCallback((text: string, i18n?: string) => {
    setIsChatLoading(true);
    setTimeout(() => {
      setIsChatLoading(false);
      setMessages((prevMessages) => [
        createTextMess({
          text,
          i18n,
        }),
        ...prevMessages,
      ]);
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
