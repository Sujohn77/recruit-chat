/* eslint-disable react-hooks/exhaustive-deps */
import { useAuthContext } from "./AuthContext";
import React, {
  createContext,
  useCallback,
  useContext,
  useState,
  useEffect,
} from "react";
import map from "lodash/map";
import Autolinker, { Match } from "autolinker";
import { ApiResponse } from "apisauce";

import {
  MessageType,
  ILocalMessage,
  CHAT_ACTIONS,
  USER_INPUTS,
  IRequisition,
} from "utils/types";
import { IAskAQuestionResponse, IMessage, ISnapshot } from "services/types";
import {
  autolinkerClassName,
  chatId,
  getChatActionResponse,
  isDevMode,
  isPushMessageType,
  LocalStorage,
  SessionStorage,
  Status,
} from "utils/constants";
import {
  replaceItemsWithType,
  getItemById,
  getServerParsedMessages,
  getMessagesOnAction,
  validateEmail,
  validateEmailOrPhone,
  getActionTypeByOption,
  getNextActionType,
  getSearchJobsData,
  getCreateCandidateData,
  pushMessage,
  getFormattedLocations,
  getStorageValue,
  generateLocalId,
  autolinkerReplaceFn,
} from "utils/helpers";
import {
  IChatMessengerContext,
  IPortionMessages,
  ISubmitMessageProps,
  ITriggerActionProps,
  IUser,
} from "./types";
import { useRequisitions } from "services/hooks";
import { getParsedSnapshots } from "services/utils";
import i18n from "services/localization";
import { apiInstance } from "services";

interface IChatProviderProps {
  children: React.ReactNode;
  chatBotID?: string | null;
}

export const chatMessengerDefaultState: IChatMessengerContext = {
  messages: [],
  status: null,
  category: null,
  user: null,
  searchLocations: [],
  requisitions: [],
  locations: [],
  offerJobs: [],
  currentMsgType: null,
  alertCategories: null,
  error: null,
  viewJob: null,
  prefferedJob: null,
  nextMessages: [],
  resumeName: "",
  isChatLoading: false,
  chooseButtonOption: () => {},
  triggerAction: () => {},
  setSnapshotMessages: () => {},
  setCurrentMsgType: () => {},
  setError: () => {},
  setViewJob: () => {},
  submitMessage: () => {},
  setIsInitialized: () => {},
  setJobPositions: () => {},
};

const ChatContext = createContext<IChatMessengerContext>(
  chatMessengerDefaultState
);

export const info = {
  username: "RomanAndreevUpworkPlaypen",
  password: "SomeStrongPassword1234",
};

interface IUserContact {
  isPhoneType: boolean;
  contact: string | undefined | null;
}

interface IJobAlertData {
  email: string;
  type: CHAT_ACTIONS;
}

export const validationUserContacts = ({
  isPhoneType,
  contact,
}: IUserContact) => {
  if (!contact) return "";

  return isPhoneType ? validateEmailOrPhone(contact) : validateEmail(contact);
};

const ChatProvider = ({ chatBotID = "17", children }: IChatProviderProps) => {
  // State
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [category, setCategory] = useState<string | null>(null);
  const [searchLocations, setSearchLocations] = useState<string[]>([]);
  const [offerJobs, setOfferJobs] = useState<IRequisition[]>([]);
  const [viewJob, setViewJob] = useState<IRequisition | null>(null);
  const [prefferedJob, setPrefferedJob] = useState<IRequisition | null>(null);
  const [alertCategories, setAlertCategories] = useState<string[] | null>([]);

  isDevMode && console.log("searchLocations", searchLocations);

  const [user, setUser] = useState<IUser | null>(null);
  const [messages, setMessages] = useState<ILocalMessage[]>([]);
  const [serverMessages, setServerMessages] = useState<IMessage[]>([]);
  const [nextMessages, setNextMessages] = useState<IPortionMessages[]>([]);
  const [currentMsgType, setCurrentMsgType] = useState<CHAT_ACTIONS | null>(
    null
  );
  const [chatAction, setChatAction] = useState<ITriggerActionProps | null>(
    getStorageValue(LocalStorage.InitChatActionType, null)
  );
  const [initialAction, setInitialAction] =
    useState<ITriggerActionProps | null>(null);
  const [status, setStatus] = useState<Status | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoadedMessages, setIsLoadedMessages] = useState(false);

  const { requisitions, locations, setJobPositions } = useRequisitions();
  const { clearAuthConfig } = useAuthContext();
  const [resumeName, setResumeName] = useState("");

  // Test
  // useEffect(() => {
  //     console.log('trigger', currentMsgType);
  //     if (
  //         currentMsgType === CHAT_ACTIONS.SET_CATEGORY &&
  //         !messages.some((m) => m.content.subType === MessageType.SUBMIT_FILE)
  //     ) {
  //         triggerAction({ type: CHAT_ACTIONS.UPLOAD_CV });
  //     } else if (currentMsgType === CHAT_ACTIONS.UPLOAD_CV) {
  //         triggerAction({ type: CHAT_ACTIONS.SUCCESS_UPLOAD_CV });
  //     } else if (currentMsgType === CHAT_ACTIONS.SEARCH_WITH_RESUME) {
  //         triggerAction({ type: CHAT_ACTIONS.SEARCH_WITH_RESUME, payload: { items: mockCategories } });
  //     }
  // }, [currentMsgType]);

  useEffect(() => {
    if (isDevMode) {
      // console.log("Current chat action: ", currentMsgType);
    }
  }, [currentMsgType]);

  // Effects
  useEffect(() => {
    if (isInitialized) {
      const processedSnapshots: IMessage[] = getParsedSnapshots({
        serverMessages,
        nextMessages,
      });

      updateMessages(processedSnapshots);
      setServerMessages(processedSnapshots);
      setIsLoadedMessages(true);
    }
  }, [nextMessages.length && nextMessages[0].data.localId]);

  useEffect(() => {
    if (isLoadedMessages && initialAction) {
      triggerAction(initialAction);
      setInitialAction(null);
    }
  }, [serverMessages.length, isInitialized]);

  const createJobAlert = async ({ email, type }: IJobAlertData) => {
    if (type === CHAT_ACTIONS.SET_ALERT_EMAIL) {
      setIsChatLoading(true);
      try {
        await apiInstance.createJobAlert({
          email: email,
          location: getFormattedLocations(locations)[0],
          jobCategory: alertCategories?.length ? alertCategories[0] : "",
        });
      } catch (err) {
        clearAuthConfig();
      } finally {
        setIsChatLoading(false);
      }
    }
  };

  // Initiate an action & set state
  const triggerAction = useCallback(
    (action: ITriggerActionProps) => {
      // Check if there were errors before
      const apiError = sessionStorage.getItem(SessionStorage.ApiError);
      const parsedError = apiError && JSON.parse(apiError);
      if (!!apiError) {
        console.log("apiError", apiError);
        if (typeof parsedError == "string") setError(parsedError);

        sessionStorage.removeItem(SessionStorage.ApiError);
        return;
      }

      // Check if all previous actions were completed
      const { type, payload } = action;
      const isInitialAction =
        type === CHAT_ACTIONS.FIND_JOB ||
        type === CHAT_ACTIONS.ANSWER_QUESTIONS;
      if (type === chatAction?.type && isInitialAction) {
        if (status === Status.PENDING || !isInitialized) {
          !isInitialized && setInitialAction(action);
        }
        return;
      }

      let isErrors = false;
      switch (type) {
        case CHAT_ACTIONS.SET_CATEGORY: {
          const searchCategory = payload?.item!.toLowerCase();
          const requisition = requisitions.find(
            (r) => r.title.toLowerCase() === searchCategory
          );
          requisition && setCategory(requisition.category);

          payload!.item = requisition?.title;
          break;
        }
        case CHAT_ACTIONS.SET_LOCATIONS: {
          setSearchLocations(payload?.items!);
          return;
        }
        case CHAT_ACTIONS.SET_ALERT_CATEGORIES: {
          setAlertCategories(payload?.items!);
          return;
        }
        case CHAT_ACTIONS.INTERESTED_IN: {
          const job = getItemById(offerJobs, payload?.item!);
          setPrefferedJob(job!);
          break;
        }
        case CHAT_ACTIONS.SUCCESS_UPLOAD_CV: {
          payload?.item && setResumeName(payload?.item);
          break;
        }
        case CHAT_ACTIONS.GET_USER_AGE: {
          setUser({ ...user, age: payload?.item! });
          break;
        }
        case CHAT_ACTIONS.GET_USER_NAME:
        case CHAT_ACTIONS.APPLY_NAME: {
          setUser({ ...user, name: payload?.item! });
          break;
        }
        case CHAT_ACTIONS.APPLY_AGE: {
          const age = Number(payload?.item);
          if (age < 15 || age > 80) {
            setError("Incorrect age");
            isErrors = true;
          } else {
            setError(null);
          }
          setUser({ ...user, age: payload?.item! });
          break;
        }
        case CHAT_ACTIONS.SET_SALARY: {
          if (payload?.item) {
            const salaryInfo = payload?.item.split(" ");
            setUser({
              ...user,
              wishSalary: Number(salaryInfo[0]),
              salaryCurrency: salaryInfo[1],
            });
          }
          break;
        }
        case CHAT_ACTIONS.CHANGE_LANG: {
          if (payload?.item) {
            i18n.changeLanguage(payload.item.toLowerCase());
          }
          break;
        }

        case CHAT_ACTIONS.APPLY_EMAIL:
        case CHAT_ACTIONS.GET_USER_EMAIL:
        case CHAT_ACTIONS.SET_ALERT_EMAIL: {
          const isPhoneType = type === CHAT_ACTIONS.GET_USER_EMAIL;
          const emailOrPhone = payload?.item!;
          const error = validationUserContacts({
            isPhoneType,
            contact: emailOrPhone,
          });

          if (emailOrPhone && !error?.length) {
            clearFilters();
            createJobAlert({ type, email: emailOrPhone });
            setUser({
              ...user,
              [isPhoneType ? "phone" : "email"]: emailOrPhone,
            });
          } else {
            setError(error);
            isErrors = true;
          }
          break;
        }
        case CHAT_ACTIONS.REFINE_SEARCH: {
          clearFilters();
          console.log("clear");
          break;
        }
      }
      if (!isErrors) {
        if (isPushMessageType(action.type)) {
          setStatus(Status.PENDING);
          pushMessage({ action, messages, setMessages });
        }

        setChatAction(action);
      }
    },
    [user, isInitialized, messages, requisitions.length]
  );

  useEffect(() => {
    if (chatAction !== null && messages.length) {
      getChatBotResponse(chatAction);
    }
  }, [chatAction]);

  // Callbacks
  const getChatBotResponse = useCallback(
    async (action: ITriggerActionProps) => {
      const { type, payload } = action;

      let additionalCondition = null;
      let updatedMessages = [...messages];

      //  Async actions
      switch (type) {
        case CHAT_ACTIONS.SEND_LOCATIONS: {
          if (category) {
            const data = getSearchJobsData(
              category,
              searchLocations[0]?.split(",")[0]
            );
            setIsChatLoading(true);
            try {
              const apiResponse = await apiInstance.searchRequisitions(data);
              additionalCondition = !!apiResponse.data?.requisitions.length;
              setSearchLocations([]);
              setCategory(null);
              if (apiResponse.data?.requisitions.length) {
                setOfferJobs(apiResponse.data?.requisitions);
              } else {
                triggerAction({ type: CHAT_ACTIONS.NO_MATCH });
              }
            } catch (err) {
              isDevMode && console.log("getChatBotResponse", err);
            } finally {
              setCategory(null);
              setSearchLocations([]);
              setIsChatLoading(false);
            }
          }
          break;
        }
        case CHAT_ACTIONS.SEND_TRANSCRIPT_EMAIL: {
          setIsChatLoading(true);
          try {
            const response = await apiInstance.sendTranscript({
              ChatID: chatId,
            });
          } catch (error) {
          } finally {
            setIsChatLoading(false);
          }
          break;
        }
        case CHAT_ACTIONS.SET_WORK_PERMIT: {
          const isPermitWork = payload?.item === "Yes";
          setUser({ ...user, isPermitWork });
          additionalCondition = isPermitWork;
          break;
        }
        case CHAT_ACTIONS.SEARCH_WITH_RESUME: {
          if (payload?.items) {
            setJobPositions(payload.items);
            additionalCondition = !!payload.items.length;
          } else {
            triggerAction({ type: CHAT_ACTIONS.NO_MATCH });
          }
          break;
        }
        case CHAT_ACTIONS.APPLY_ETHNIC: {
          if (user?.name) {
            setIsChatLoading(true);
            try {
              const createCandidateData = getCreateCandidateData({
                user,
                prefferedJob,
              });
              await apiInstance.createCandidate(createCandidateData);
            } catch (error) {
            } finally {
              setIsChatLoading(false);
            }
          }
          break;
        }
        case CHAT_ACTIONS.ASK_QUESTION: {
          if (payload?.question) {
            setIsChatLoading(true);
            try {
              const data = {
                question: payload.question.trim(),
                languageCode: "en",
                options: {
                  answersNumber: 1,
                  includeUnstructuredSources: true,
                  confidenceScoreThreshold: 0.5,
                },
              };

              const response: ApiResponse<IAskAQuestionResponse> =
                await apiInstance.askAQuestion(data);

              if (response.data?.answers) {
                const answers: ILocalMessage[] = map(
                  response.data?.answers,
                  (answer) => ({
                    content: {
                      subType: MessageType.TEXT,
                      text: Autolinker.link(answer, {
                        replaceFn: autolinkerReplaceFn,
                      }),
                    },
                    isOwn: false,
                    localId: generateLocalId(),
                    _id: null,
                  })
                );

                updatedMessages = [...answers, ...messages];
              } else if (response.data?.answers) {
                const withoutAnswer: ILocalMessage = {
                  isOwn: false,
                  content: {
                    subType: MessageType.TEXT,
                    // TODO: add translate
                    text: "Sorry, I don't have an answer to that question yet...",
                  },
                  localId: generateLocalId(),
                  _id: generateLocalId(),
                };
                updatedMessages = [withoutAnswer, ...messages];
              }
            } catch (error) {
            } finally {
              setIsChatLoading(false);
            }
          }
          break;
        }
      }

      //  Update state with response
      const param = action.payload?.item || "";
      const responseMessages = getChatActionResponse({
        type,
        additionalCondition,
        param,
      });
      console.log("responseMessages", responseMessages);

      updatedMessages = getMessagesOnAction({
        action,
        messages: updatedMessages,
        responseMessages,
        additionalCondition,
      });
      console.log("updatedMessages", updatedMessages);

      // Simulate chat bot reaction
      setTimeout(() => {
        updatedMessages?.length && setMessages(updatedMessages);
        setCurrentMsgType(getNextActionType(type));
        setStatus(Status.DONE);
      }, 500);

      setError(null);
      setChatAction(null);
    },
    [
      messages,
      searchLocations.length,
      currentMsgType,
      user,
      isInitialized,
      requisitions.length,
      chatBotID,
    ]
  );

  const clearFilters = () => {
    setCategory(null);
    setCurrentMsgType(null);
    setAlertCategories(null);
    setSearchLocations([]);
  };

  const submitMessage = ({ type, messageId }: ISubmitMessageProps) => {
    const updatedMessages = map(messages, (msg) =>
      msg.content.subType === type && !msg._id
        ? { ...msg, _id: messageId }
        : msg
    );

    setMessages(updatedMessages);
  };

  const setSnapshotMessages = (messagesSnapshots: ISnapshot<IMessage>[]) => {
    if (!nextMessages.length) {
      setCurrentMsgType(null);
      setNextMessages(messagesSnapshots);
    }
  };

  const chooseButtonOption = (excludeItem: USER_INPUTS, param?: string) => {
    const type = getActionTypeByOption(excludeItem);
    const updatedMessages = replaceItemsWithType({
      type: MessageType.BUTTON,
      messages,
      excludeItem,
    });

    if (type) {
      const responseMessages = getChatActionResponse({
        type,
        additionalCondition: undefined,
        param,
      });

      setMessages([...responseMessages, ...updatedMessages]);
    } else {
      const chatType = getNextActionType(currentMsgType);

      if (chatType) {
        const action =
          currentMsgType === CHAT_ACTIONS.ASK_QUESTION
            ? { type: chatType, payload: { question: excludeItem } }
            : { type: chatType };

        getChatBotResponse(action);
      }
      setMessages(updatedMessages);
    }
  };

  const updateMessages = async (serverMessages: IMessage[]) => {
    const parsedMessages = getServerParsedMessages(serverMessages);

    if (!messages.length) {
      setMessages(parsedMessages.reverse());
    } else {
      const newMessages = parsedMessages.filter((msg) => {
        return (
          messages.findIndex((localmsg) => msg.localId === localmsg.localId) ===
          -1
        );
      });
      if (newMessages.length) {
        setMessages([...messages, ...parsedMessages]);
      } else {
        const updatedMessages = map(messages, (localmsg) => {
          const updatedIndex = parsedMessages.findIndex(
            (msg) => msg.localId === localmsg.localId
          );
          return updatedIndex !== -1 ? parsedMessages[updatedIndex] : localmsg;
        });

        setMessages(updatedMessages);
      }
    }
  };

  return (
    <ChatContext.Provider
      value={{
        status,
        messages,
        category,
        searchLocations,
        locations,
        requisitions,
        error,
        currentMsgType,
        offerJobs,
        alertCategories,
        viewJob,
        prefferedJob,
        user,
        chooseButtonOption,
        triggerAction,
        submitMessage,
        setSnapshotMessages,
        setCurrentMsgType,
        setError,
        setViewJob,
        nextMessages,
        setIsInitialized,
        resumeName,
        setJobPositions,
        isChatLoading,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

const useChatMessenger = () => useContext(ChatContext);

export { ChatProvider, useChatMessenger };
