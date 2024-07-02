import { useChatMessenger } from "./MessengerContext";
import { useCallback, useState } from "react";
import { ApiResponse } from "apisauce";
import { useTranslation } from "react-i18next";
import isNumber from "lodash/isNumber";
import some from "lodash/some";
import map from "lodash/map";
import moment from "moment";

import { apiInstance } from "services/api";
import {
  IAskAQuestionResponse,
  IContactPersonRes,
  ICreateCandidateResponse,
  ICreateChatResponse,
  IRequisitionsResponse,
  ISubmitReferralResponse,
  IUpdateOrMergeCandidateRequest,
  IUpdateOrMergeCandidateResponse,
  IValidateRefPayload,
  IValidateRefResponse as IValidateRefRes,
} from "services/types";
import { ChatScreens, REFERRAL_OFFER_TEXT } from "utils/constants";
import {
  CHAT_ACTIONS,
  ILocalMessage,
  IReferralData,
  MessageType,
} from "utils/types";
import { createTextMess, generateLocalId, parsePathname } from "utils/helpers";
import { userAPI } from "services/api/user.api";

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

export interface IUseCreateAnonymCandidate {
  chatBotToken: string;
  hostname: string;
  setCandidateId: (id: number) => void;
  setChatId: (id: number) => void;
  setFirebaseToken: (token: string) => void;
  setIsLoadedMessages: (isLoading: boolean) => void;
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
  }, [chatQueueId, chatId, queueId, firstName, lastName]);
};

export const useSearchJobFromParentSite = () => {
  const { t } = useTranslation();
  const {
    parentPathname,
    setMessages,
    setCurrentMsgType,
    setChatScreen,
    sendNewMessage,
  } = useChatMessenger();

  return useCallback(async () => {
    const { jobId, keyword } = parsePathname(parentPathname);
    if (jobId && keyword) {
      try {
        const res: ApiResponse<IRequisitionsResponse> =
          await apiInstance.searchRequisitions({
            pageSize: 50,
            keyword,
          });

        if (res.data?.requisitions.length) {
          const currentRequisition = res.data.requisitions.find(
            (r) => +r.id === jobId
          );

          if (currentRequisition) {
            setChatScreen(ChatScreens.ApplyJob);
            setCurrentMsgType(CHAT_ACTIONS.APPLY_JOB_FROM_PARENT_SITE);
            const initMess = createTextMess({
              text: t("messages:initialMessage3"),
              i18n: "messages:initialMessage3",
            });
            sendNewMessage({
              isOwn: false,
              message: initMess.content.text,
              localId: initMess.localId,
            });
            setMessages(() => [initMess]);
          }
        }
      } catch (error) {}
    }
  }, [parentPathname, sendNewMessage]);
};

export const useCreateAnonymCandidate = ({
  chatBotToken,
  hostname,
  setCandidateId,
  setChatId,
  setFirebaseToken,
  setIsLoadedMessages,
}: IUseCreateAnonymCandidate) =>
  useCallback(async () => {
    const storedCandidateId = localStorage.getItem(hostname + "candidateId");
    const storedChatId = localStorage.getItem(hostname + "chatId");

    storedCandidateId && setCandidateId(Number(storedCandidateId));
    storedChatId && setChatId(Number(storedChatId));

    if (!storedCandidateId?.trim()) {
      setIsLoadedMessages(true);
      try {
        if (chatBotToken) {
          userAPI.setAuthHeader(chatBotToken);
        }

        const res: ApiResponse<ICreateCandidateResponse> =
          await userAPI.createAnonymCandidate({
            firstName: "Anonymous",
            lastName: "ChatbotUser",
            typeId: 17,
          });

        if (res.data?.id) {
          setCandidateId(res.data.id);

          const firebaseTokenResponse: ApiResponse<string> =
            await userAPI.getFirebaseAccessToken(res.data?.id);

          if (firebaseTokenResponse.data) {
            setFirebaseToken(firebaseTokenResponse.data);
          }

          if (!storedChatId) {
            const chatRes: ApiResponse<ICreateChatResponse> =
              await userAPI.createChatByAnonymUser(res.data.id);
            chatRes.data?.chatId && setChatId(chatRes.data?.chatId);
          }
        }
      } catch (error) {
      } finally {
        setIsLoadedMessages(false);
      }
    }
  }, [hostname, chatBotToken]);

export const useAksQuestion = () => {
  const { t } = useTranslation();
  const { setIsChatLoading, setMessages, sendNewMessage } = useChatMessenger();
  const [isAlreadyAsked, setIsAlreadyAsked] = useState(false);

  const askQuestionHandler = useCallback(
    async (
      setMessageValue: (value: string) => void,
      question?: string | null,
      i18n?: string
    ) => {
      if (!question) return;
      setIsAlreadyAsked(true);
      const questionMess = createTextMess({
        isOwn: true,
        text: question?.trim(),
        i18n,
      });

      sendNewMessage({
        message: questionMess.content.text,
        isOwn: true,
        localId: questionMess.localId,
      });
      setMessageValue("");
      setMessages((prev) => [questionMess, ...prev]);

      try {
        setIsChatLoading(true);
        const data = {
          question: question?.trim(),
          languageCode: "en",
          options: {
            answersNumber: 1,
            includeUnstructuredSources: true,
            confidenceScoreThreshold: 0.5,
          },
        };

        const response: ApiResponse<IAskAQuestionResponse> =
          await apiInstance.askAQuestion(data);

        if (response.data?.answers.length) {
          const answers: ILocalMessage[] = map(
            response.data?.answers,
            (answer) => ({
              content: {
                subType:
                  answer === REFERRAL_OFFER_TEXT
                    ? MessageType.REFERRAL
                    : MessageType.TEXT,
                text: answer,
                i18n: i18n || null,
                i18nProps: null,
              },
              isOwn: false,
              localId: generateLocalId(),
              _id: generateLocalId(),
              dateCreated: { seconds: moment().unix() },
            })
          );
          answers.forEach(
            (mess: ILocalMessage) =>
              !mess.isOwn &&
              sendNewMessage({
                isOwn: false,
                message: mess.content.text,
                localId: mess.localId,
              })
          );
          setMessages((prev) => [...answers, ...prev]);
        } else if (!response.data?.answers.length) {
          const withoutAnswer = createTextMess({
            text: t("messages:dont_have_answer"),
            i18n: "messages:dont_have_answer",
            dateCreated: { seconds: moment().unix() },
          });
          setMessages((prev) => [withoutAnswer, ...prev]);
          sendNewMessage({
            isOwn: false,
            message: withoutAnswer.content.text,
            localId: withoutAnswer.localId,
          });
        }
      } catch (error) {
        const withoutAnswer = createTextMess({
          text: t("messages:dont_have_answer"),
          i18n: "messages:dont_have_answer",
          dateCreated: { seconds: moment().unix() },
        });
        sendNewMessage({
          isOwn: false,
          message: withoutAnswer.content.text,
          localId: withoutAnswer.localId,
        });

        setMessages((prev) => [withoutAnswer, ...prev]);
      } finally {
        setIsChatLoading(false);
      }
    },
    []
  );

  return { askQuestionHandler, isAlreadyAsked };
};
