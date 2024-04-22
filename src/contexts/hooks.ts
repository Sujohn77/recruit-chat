import { useChatMessenger } from "./MessengerContext";
import { useCallback } from "react";
import { ApiResponse } from "apisauce";
import { useTranslation } from "react-i18next";
import isNumber from "lodash/isNumber";
import some from "lodash/some";

import { apiInstance } from "services/api";
import {
  IAskAQuestionResponse,
  IContactPersonRes,
  ISubmitReferralResponse,
  IUpdateOrMergeCandidateRequest,
  IUpdateOrMergeCandidateResponse,
  IValidateRefPayload,
  IValidateRefResponse as IValidateRefRes,
} from "services/types";
import { CHAT_ACTIONS, IReferralData } from "utils/types";
import { createTextMess } from "utils/helpers";

export interface ISubmitReferral {
  referralSourceTypeId: number;
  referredCandidate: {
    firstName: string;
    lastName: string;
    emailAddress: string;
    mobileNumber: string;
  };
  jobId?: number;
  jobSourceID?: string;
}

export const useValidateReferral = () => {
  const {
    candidateId,
    chatId,
    setIsChatLoading,
    setCandidateId,
    setEmployeeJobCategory,
    setEmployeeLocation,
    setEmployeeFullName,
    setEmployeeLocationID,
    setEmployeeJobFamilyNames,
  } = useChatMessenger();

  return useCallback(
    async (
      data: IReferralData,
      onSuccess: (fullName?: string) => void,
      onFailure: () => void
    ) => {
      if (candidateId && chatId) {
        const payload: IValidateRefPayload = {
          employeeId: +data.employeeId,
          lastName: data.lastName,
          candidateId: candidateId,
          chatId: chatId,
          "year-of-birth": data.yeanOrBirth,
        };

        try {
          setIsChatLoading(true);
          const res: ApiResponse<IValidateRefRes> =
            await apiInstance.validateReferral(payload);

          if (res.data) {
            const {
              candidateId,
              employeeLocationCity,
              employeeJobTitle,
              employeeFullName,
              employeeLocationId,
              employeeJobFamilyNames,
              updateChatBotCandidateId,
            } = res.data;

            if (candidateId && updateChatBotCandidateId) {
              setCandidateId(candidateId);
              // setIsCandidateAnonym(false);
            }
            employeeLocationCity && setEmployeeLocation(employeeLocationCity);
            employeeJobTitle && setEmployeeJobCategory(employeeJobTitle);
            employeeFullName && setEmployeeFullName(employeeFullName);
            employeeLocationId && setEmployeeLocationID(employeeLocationId);
            employeeJobFamilyNames.length &&
              setEmployeeJobFamilyNames(employeeJobFamilyNames);
          }

          if (res?.data?.isValid) {
            onSuccess(res.data.employeeFullName);
          }

          if (
            (res.data?.success === false && res.data?.errors.length) ||
            res?.data?.isValid === false
          ) {
            onFailure();
          }
        } catch (error) {
          onFailure();
        } finally {
          setIsChatLoading(false);
        }
      }
    },
    [candidateId, chatId]
  );
};

export const useSubmitReferral = () => {
  const { setIsChatLoading, candidateId } = useChatMessenger();

  return useCallback(
    async (
      payload: ISubmitReferral,
      onSuccess: (previouslyReferredState: number) => void,
      onFailure: Function
    ) => {
      try {
        setIsChatLoading(true);

        const res: ApiResponse<ISubmitReferralResponse> =
          await apiInstance.submitReferral({
            ...payload,
            referrerSubscriberId: candidateId!,
          });

        if (res.data && isNumber(res.data?.previouslyReferredState)) {
          onSuccess(res.data.previouslyReferredState);
        } else {
          onFailure();
        }
      } catch (error) {
      } finally {
        setIsChatLoading(false);
      }
    },
    [candidateId]
  );
};

export const useConnectToLiveChat = (
  chatId: number | null | undefined,
  chatQueueId: number | null
) => {
  const { t } = useTranslation();
  const {
    setIsChatLoading,
    setQueueId,
    setQueueChatId,
    setIsLiveChat,
    setMessages,
    setCurrentMsgType,
    firstName,
    lastName,
    candidateId,
    setCandidateId,
    setIsCandidateAnonym,
    queueId,
  } = useChatMessenger();

  return useCallback(async () => {
    if (chatId && chatQueueId) {
      setMessages((prev) => [
        createTextMess({
          text: "can i speak to someone?",
          isOwn: true,
        }),
        ...prev,
      ]);
      setCurrentMsgType(CHAT_ACTIONS.LIVE_CHAT);

      try {
        setIsChatLoading(true);
        const res: ApiResponse<IAskAQuestionResponse> =
          await apiInstance.connectToLiveChat();

        if (res.data?.answers[0]) {
          setMessages((prev) => [
            createTextMess({ text: res.data?.answers[0] || "" }),
            ...prev,
          ]);
        }

        if (
          some(
            res.data?.metadata,
            ({ KeyName, KeyValue }) =>
              KeyName === "queuechatswitch" && KeyValue === "true"
          )
        ) {
          const liveChat: ApiResponse<IContactPersonRes> =
            await apiInstance.getLiveChat({
              chatId: chatId!,
              SharedServiceQueueId: chatQueueId!,
            });

          if (liveChat?.data?.message === "Chat successfully moved") {
            setQueueId(chatQueueId!);
            setQueueChatId(chatId!);

            if (firstName && lastName) {
              const candidatePayload: IUpdateOrMergeCandidateRequest = {
                firstName,
                lastName,
                candidateId: candidateId!,
                chatId: chatId!,
                skipEmailCheck: true,
                queueId: chatQueueId,
              };
              const candidateRes: ApiResponse<IUpdateOrMergeCandidateResponse> =
                await apiInstance.updateOrMargeCandidate(candidatePayload);

              const res = candidateRes?.data;

              if (
                res?.success &&
                res?.updateChatBotCandidateId &&
                res?.candidateId
              ) {
                setCandidateId(res.candidateId);
                setIsCandidateAnonym(false);
              }
              setIsLiveChat(true);
            } else {
              setMessages((prev) => [
                createTextMess({
                  text: t("messages:provide_firstname"),
                  i18n: "messages:provide_firstname",
                }),
                ...prev,
              ]);
            }
          }
        }
      } catch (error) {
      } finally {
        setIsChatLoading(false);
      }
    } else {
      return;
    }
  }, [chatQueueId, chatId, queueId]);
};
