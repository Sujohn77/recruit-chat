import { useChatMessenger } from "contexts/MessengerContext";
import { useCallback } from "react";
import { ApiResponse } from "apisauce";
import { useTranslation } from "react-i18next";

import { apiInstance } from "services/api";
import { ICheckAnswerResponse } from "services/types";
import { createTextMess } from "utils/helpers";
import { CHAT_ACTIONS, MessageType } from "utils/types";
import { TextFieldTypes } from "utils/constants";
import { useTextField } from "utils/hooks";

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
      !!messages?.[0]?.optionList?.options?.length) ||
    messages?.[0]?.content?.subType === MessageType.TRY_AGAIN;
  const disabled =
    !isChatInputAvailable ||
    isLastMessageWithOptions ||
    (isChatLoading &&
      currentMsgType !== CHAT_ACTIONS.SET_CATEGORY &&
      currentMsgType !== CHAT_ACTIONS.SET_LOCATIONS);

  return disabled;
};

// TODO: test
export const useInputPlaceholder = (
  type: TextFieldTypes,
  isInputDisabled: boolean,
  isAlreadyAsked: boolean
) => {
  const { t } = useTranslation();
  const { currentMsgType, messages, companyName } = useChatMessenger();
  const { placeHolder } = useTextField();

  if (
    type === TextFieldTypes.Select &&
    isInputDisabled &&
    currentMsgType !== CHAT_ACTIONS.SUCCESS_INTERESTED_IN &&
    currentMsgType !== CHAT_ACTIONS.CREATED_JOB_ALERT
  ) {
    return "";
  } else if (messages[0]?.optionList) {
    return t("placeHolders:selectOption");
  }

  switch (currentMsgType) {
    case CHAT_ACTIONS.ASK_QUESTION:
      return t(
        `placeHolders:${isAlreadyAsked ? "aks_another_question" : "default"}`
      );
    case CHAT_ACTIONS.UPDATE_OR_MERGE_CANDIDATE:
      return t("placeHolders:default");
    case CHAT_ACTIONS.SUCCESS_INTERESTED_IN:
    case CHAT_ACTIONS.CREATED_JOB_ALERT:
      return t("placeHolders:click_menu");
  }

  if (
    messages?.[0]?.content?.text ===
    t("messages:employeeId", {
      companyName,
    })
  ) {
    return t("placeHolders:enter_employee_id");
  }
  return placeHolder || t("placeHolders:bot_typing");
};
