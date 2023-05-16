/* eslint-disable react-hooks/exhaustive-deps */
import { useAuthContext } from "./AuthContext";
import React, {
  createContext,
  useCallback,
  useContext,
  useState,
  useEffect,
} from "react";
import { useTranslation } from "react-i18next";
import findIndex from "lodash/findIndex";
import map from "lodash/map";
import moment from "moment";
import Autolinker from "autolinker";
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
import { colors } from "utils/colors";
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
  showJobAutocompleteBox: false,
  chooseButtonOption: () => {},
  dispatch: () => {},
  setSnapshotMessages: () => {},
  setCurrentMsgType: () => {},
  setError: () => {},
  setViewJob: () => {},
  submitMessage: () => {},
  setIsInitialized: () => {},
  setJobPositions: () => {},
  setShowJobAutocompleteBox: () => {},
  _setMessages: () => {},
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
  const { t } = useTranslation();
  // -------------------------------- State -------------------------------- //
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [isLoadedMessages, setIsLoadedMessages] = useState(false);
  const [category, setCategory] = useState<string | null>(null);
  const [searchLocations, setSearchLocations] = useState<string[]>([]);
  const [offerJobs, setOfferJobs] = useState<IRequisition[]>([]);
  const [viewJob, setViewJob] = useState<IRequisition | null>(null);
  const [prefferedJob, setPrefferedJob] = useState<IRequisition | null>(null);
  const [alertCategories, setAlertCategories] = useState<string[] | null>([]);
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
  const [searchRequisitionsTrigger, setSearchRequisitionsTrigger] = useState(1);
  const [resumeName, setResumeName] = useState("");
  const [showJobAutocompleteBox, setShowJobAutocompleteBox] = useState(false);

  const { clearAuthConfig } = useAuthContext();
  const { requisitions, locations, setJobPositions } = useRequisitions(
    searchRequisitionsTrigger,
    setIsChatLoading
  );

  useEffect(() => {
    let timeout: undefined | NodeJS.Timeout;
    // return trigger to the default state (if active)
    if (showJobAutocompleteBox) {
      timeout = setTimeout(() => setShowJobAutocompleteBox(false), 1000);
    }

    return () => {
      timeout && clearTimeout(timeout);
    };
  }, [showJobAutocompleteBox]);

  // -------------------------------------------------------------------------- //

  // isDevMode && console.log("searchLocations", searchLocations);
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
          candidateId: 50994334,
          // candidateId: 49530690,
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
        console.log("%capiError", apiError, "color: #ff8c00;");
        if (typeof parsedError == "string") setError(parsedError);

        sessionStorage.removeItem(SessionStorage.ApiError);
        return;
      }

      // Check if all previous actions were completed
      const { type, payload } = action;
      let isErrors = false;

      const isInitialAction =
        type === CHAT_ACTIONS.FIND_JOB ||
        type === CHAT_ACTIONS.ANSWER_QUESTIONS;

      if (type === chatAction?.type && isInitialAction) {
        if (status === Status.PENDING || !isInitialized) {
          !isInitialized && setInitialAction(action);
        }
        return;
      }

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

          setSearchRequisitionsTrigger((prevValue) => prevValue + 1);
          setShowJobAutocompleteBox(true);
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
    if (chatAction && messages.length) {
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
              isDevMode &&
                console.log(
                  "%c getChatBotResponse err ",
                  err,
                  `color: #ff8c00;`
                );
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
            await apiInstance.sendTranscript({
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
            const questionMess: ILocalMessage = {
              content: {
                subType: MessageType.TEXT,
                text: payload.question.trim(),
              },
              isOwn: true,
              localId: generateLocalId(),
              _id: generateLocalId(),
            };
            const hiringProcessMessage = getChatActionResponse({
              type: CHAT_ACTIONS.HIRING_PROCESS,
            });
            const lastMessIsButton =
              messages[0].content.subType === MessageType.BUTTON;

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
                    dateCreated: { seconds: moment().unix() },
                  })
                );

                updatedMessages = lastMessIsButton
                  ? [...hiringProcessMessage, ...answers, ...messages]
                  : [
                      ...hiringProcessMessage,
                      ...answers,
                      questionMess,
                      ...messages,
                    ];
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
                  dateCreated: { seconds: moment().unix() },
                };
                updatedMessages = lastMessIsButton
                  ? [...hiringProcessMessage, withoutAnswer, ...messages]
                  : [
                      ...hiringProcessMessage,
                      withoutAnswer,
                      questionMess,
                      ...messages,
                    ];
              }
            } catch (error) {
              const withoutAnswer: ILocalMessage = {
                isOwn: false,
                content: {
                  subType: MessageType.TEXT,
                  // TODO: add translate
                  text: "Sorry, I don't have an answer to that question yet...",
                },
                localId: generateLocalId(),
                _id: generateLocalId(),
                dateCreated: { seconds: moment().unix() },
              };
              updatedMessages = lastMessIsButton
                ? [...hiringProcessMessage, withoutAnswer, ...messages]
                : [
                    ...hiringProcessMessage,
                    withoutAnswer,
                    questionMess,
                    ...messages,
                  ];
            } finally {
              setIsChatLoading(false);
            }
          }
          break;
        }
      }

      //  Update state with response
      const param = action.payload?.item || "";
      let responseMessages = getChatActionResponse({
        type,
        additionalCondition,
        param,
      });

      const withPopularQuestions = updatedMessages.some(
        (msg) =>
          msg.content.subType === MessageType.BUTTON &&
          (msg.content.text === t("messages:whatHiring") ||
            msg.content.text === t("messages:howSubmitCV") ||
            msg.content.text === t("messages:howMuchExperience") ||
            msg.content.text === t("messages:popularQuestions"))
      );

      const responseMessWithPopularQuestions = responseMessages.some(
        (msg) =>
          msg.content.subType === MessageType.BUTTON &&
          (msg.content.text === t("messages:whatHiring") ||
            msg.content.text === t("messages:howSubmitCV") ||
            msg.content.text === t("messages:howMuchExperience") ||
            msg.content.text === t("messages:popularQuestions"))
      );

      if (withPopularQuestions && responseMessWithPopularQuestions) {
        responseMessages = responseMessages.filter((msg) => {
          if (
            msg.content.text === t("messages:whatHiring") ||
            msg.content.text === t("messages:howSubmitCV") ||
            msg.content.text === t("messages:howMuchExperience") ||
            msg.content.text === t("messages:popularQuestions")
          ) {
            return false;
          } else {
            return true;
          }
        });
      }

      updatedMessages = getMessagesOnAction({
        action,
        messages: updatedMessages,
        responseMessages,
        additionalCondition,
      });

      // console.log("responseMessages", responseMessages);
      // console.log("updatedMessages", updatedMessages);

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

      switch (type) {
        case CHAT_ACTIONS.ANSWER_QUESTIONS:
          setSearchRequisitionsTrigger((prevValue) => prevValue + 1);
          setTimeout(
            () => setMessages([...responseMessages, ...updatedMessages]),
            1000
          );
          break;
        case CHAT_ACTIONS.CANCEL_JOB_SEARCH_WITH_RESUME:
          if (messages[0].content.subType === MessageType.SUBMIT_FILE) {
            setChatAction(null);
            setMessages(messages.slice(1));
          }
          break;
        case CHAT_ACTIONS.UPLOADED_CV:
          break;
        default:
          setMessages([...responseMessages, ...updatedMessages]);
          break;
      }
    } else {
      const chatType = getNextActionType(currentMsgType);

      if (chatType) {
        const action: ITriggerActionProps =
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
          findIndex(
            messages,
            (localmsg) => msg.localId === localmsg.localId
          ) === -1
        );
      });
      if (newMessages.length) {
        setMessages([...messages, ...parsedMessages]);
      } else {
        const updatedMessages = map(messages, (localmsg) => {
          const updatedIndex = findIndex(
            parsedMessages,
            (msg) => msg.localId === localmsg.localId
          );
          return updatedIndex !== -1 ? parsedMessages[updatedIndex] : localmsg;
        });

        setMessages(updatedMessages);
      }
    }
  };

  const chatState = {
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
    dispatch: triggerAction,
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
    _setMessages: setMessages,
    setShowJobAutocompleteBox,
    showJobAutocompleteBox,
  };

  console.log(
    "%c   chat state   ",
    `color: ${colors.shamrock}; font-size: 14px; background-color: ${colors.black};`,
    chatState
  );

  return (
    <ChatContext.Provider value={chatState}>{children}</ChatContext.Provider>
  );
};

const useChatMessenger = () => useContext(ChatContext);

export { ChatProvider, useChatMessenger };
