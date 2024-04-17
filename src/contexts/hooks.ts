import { useChatMessenger } from "./MessengerContext";
import isNumber from "lodash/isNumber";
import { ApiResponse } from "apisauce";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";

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
import {
  CHAT_ACTIONS,
  ILocalMessage,
  IReferralData,
  MessageType,
} from "utils/types";
import { generateLocalId } from "utils/helpers";
import some from "lodash/some";

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
  } = useChatMessenger();

  return useCallback(async () => {
    if (chatId && chatQueueId) {
      const currentMess: ILocalMessage = {
        _id: generateLocalId(),
        localId: generateLocalId(),
        isOwn: true,
        content: {
          subType: MessageType.TEXT,
          text: "can i speak to someone?",
          i18n: null,
          i18nProps: null,
        },
      };
      setMessages((prev) => [currentMess, ...prev]);
      setCurrentMsgType(CHAT_ACTIONS.LIVE_CHAT);

      try {
        setIsChatLoading(true);
        const res: ApiResponse<IAskAQuestionResponse> =
          await apiInstance.connectToLiveChat();

        if (res.data?.answers[0]) {
          const answer: ILocalMessage = {
            _id: generateLocalId(),
            localId: generateLocalId(),
            content: {
              subType: MessageType.TEXT,
              text: res.data?.answers[0],
              i18n: null,
              i18nProps: null,
            },
          };
          setMessages((prev) => [answer, ...prev]);
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
              const candidateData: IUpdateOrMergeCandidateRequest = {
                firstName,
                lastName,
                candidateId: candidateId!,
                chatId: chatId!,
                skipEmailCheck: true,
              };
              const candidateRes: ApiResponse<IUpdateOrMergeCandidateResponse> =
                await apiInstance.updateOrMargeCandidate(candidateData);

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
                {
                  isOwn: false,
                  localId: generateLocalId(),
                  _id: generateLocalId(),
                  content: {
                    subType: MessageType.TEXT,
                    text: t("messages:provide_firstname"),
                    i18n: "messages:provide_firstname",
                    i18nProps: null,
                  },
                },
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
  }, [chatQueueId, chatId]);
};
