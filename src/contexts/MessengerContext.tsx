/* eslint-disable react-hooks/exhaustive-deps */
import { useAuthContext } from "./AuthContext";
import React, {
  createContext,
  useCallback,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import findIndex from "lodash/findIndex";
import map from "lodash/map";
import moment from "moment";
import sortBy from "lodash/sortBy";
import { ApiResponse } from "apisauce";

import {
  MessageType,
  ILocalMessage,
  CHAT_ACTIONS,
  USER_INPUTS,
  IRequisition,
  IMessageID,
} from "utils/types";
import {
  IAskAQuestionResponse,
  ICreateCandidateResponse,
  ICreateChatResponse,
  ISendAnswerRequest,
  IFollowingResponse,
  IMessage,
  ISendTranscriptResponse,
  ISnapshot,
  IUpdateOrMergeCandidateRequest,
  IUpdateOrMergeCandidateResponse,
} from "services/types";
import {
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
  getActionTypeByOption,
  getNextActionType,
  getSearchJobsData,
  getCreateCandidateData,
  pushMessage,
  getFormattedLocations,
  getStorageValue,
  generateLocalId,
  LOG,
  parseFirebaseMessages,
  validationUserContacts,
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
import { apiInstance } from "services/api";
import { userAPI } from "services/api/user.api";
import { FirebaseSocketReactivePagination } from "services/firebase/socket";
import { SocketCollectionPreset } from "services/firebase/socket.options";
import { getProcessedSnapshots } from "firebase/config";
import { colors } from "utils/colors";

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
  isAnonym: true,
  chatId: 0,
  shouldCallAgain: false,
  isCandidateWithEmail: false,
  firebaseToken: null,
  isAuthInFirebase: false,
  setIsAuthInFirebase: () => {},
  setIsApplyJobSuccessfully: () => {},
  isApplyJobFlow: false,
  setFlowId: () => {},
  setSubscriberWorkflowId: () => {},
  setIsApplyJobFlow: () => {},
  sendPreScreenMessage: () => Promise.resolve(),
  emailAddress: "",
  firstName: "",
  lastName: "",
  setEmailAddress: () => {},
  setFirstName: () => {},
  setLastName: () => {},
  setSearchLocations: () => {},
};

const ChatContext = createContext<IChatMessengerContext>(
  chatMessengerDefaultState
);

interface IJobAlertData {
  email: string;
  type: CHAT_ACTIONS;
}

const ChatProvider = ({
  chatBotID: chatBotId = "17",
  children,
}: IChatProviderProps) => {
  const messagesSocketConnection = useRef<any>(null);
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

  const [isCandidateAnonym, setIsCandidateAnonym] = useState<boolean>(true);
  const [candidateId, setCandidateId] = useState<number | undefined>();
  const [chatId, setChatID] = useState<number | undefined>();

  const [shouldCallAgain, setShouldCallAgain] = useState(false);
  const [isCandidateWithEmail, setIsCandidateWithEmail] = useState(false);

  const { clearAuthConfig } = useAuthContext();
  const { requisitions, locations, setJobPositions } = useRequisitions(
    searchRequisitionsTrigger,
    setIsChatLoading
  );
  // ----------------------------------------------------------------------------- //

  const [isApplyJobSuccessfully, setIsApplyJobSuccessfully] = useState(false);
  const [_firebaseMessages, _setFirebaseMessages] = useState<IMessage[]>([]);
  const [chatBotToken, setToken] = useState(
    getStorageValue(SessionStorage.Token)
  );
  const [firebaseToken, _setFirebaseToken] = useState<string | null>(null);
  const [isAuthInFirebase, setIsAuthInFirebase] = useState(false);
  const [isApplyJobFlow, setIsApplyJobFlow] = useState(false);
  const [flowId, setFlowId] = useState<number>();
  const [subscriberWorkflowId, setSubscriberWorkflowId] = useState<number>();
  const [emailAddress, setEmailAddress] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  // ----------------------------------------------------------------------------- //

  useEffect(() => {
    setMessages((prevMessages) => [
      ...parseFirebaseMessages(_firebaseMessages),
      ...prevMessages,
    ]);
  }, [_firebaseMessages]);

  useEffect(() => {
    let savedSocketConnection: any;
    if (isApplyJobSuccessfully) {
      messagesSocketConnection.current =
        new FirebaseSocketReactivePagination<IMessage>(
          SocketCollectionPreset.Messages,
          chatId
        );

      savedSocketConnection = messagesSocketConnection.current;
      savedSocketConnection.subscribe(
        (messagesSnapshots: ISnapshot<IMessage>[]) => {
          const processedSnapshots = sortBy(
            getProcessedSnapshots<IMessageID, IMessage>(
              _firebaseMessages,
              messagesSnapshots,
              "chatItemId",
              [],
              "localId"
            ),
            (message: IMessage) => {
              if (typeof message.dateCreated === "string") {
                return -moment(message.dateCreated).unix();
              } else if (message.dateCreated.seconds) {
                return -message.dateCreated.seconds;
              }
            }
          );

          setIsApplyJobFlow(true);
          _setFirebaseMessages(processedSnapshots);

          // LOG(messagesSnapshots, "messagesSnapshots");
          // LOG(processedSnapshots, "processedSnapshots");
        }
      );
    }
    return () => savedSocketConnection?.unsubscribe();
  }, [isApplyJobSuccessfully]);

  useEffect(() => {
    LOG(_firebaseMessages, "_firebaseMessages", colors.white);
  }, [_firebaseMessages]);
  useEffect(() => {
    LOG(candidateId, "candidateId", colors.white);
  }, [candidateId]);
  useEffect(() => {
    LOG(chatId, "chatId", colors.white);
  }, [chatId]);
  useEffect(() => {
    LOG(isCandidateAnonym, "isCandidateAnonym", colors.white);
  }, [isCandidateAnonym]);

  useEffect(() => {
    const createAnonymCandidateId = async () => {
      setIsLoadedMessages(true);
      try {
        const token: string | null = getStorageValue(SessionStorage.Token);
        if (token) {
          userAPI.setAuthHeader(token);
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
            _setFirebaseToken(firebaseTokenResponse.data);
          }

          const chatRes: ApiResponse<ICreateChatResponse> =
            await userAPI.createChatByAnonymUser(res.data.id);

          if (chatRes.data?.chatId) {
            setChatID(chatRes.data?.chatId);
          }
        }
      } catch (error) {
        console.log("====================================");
        console.log("error", error);
        console.log("====================================");
      } finally {
        setIsLoadedMessages(false);
      }
    };

    createAnonymCandidateId();
  }, []);

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
      dispatch(initialAction);
      setInitialAction(null);
    }
  }, [serverMessages.length, isInitialized]);

  const createJobAlert = useCallback(
    async ({ email, type }: IJobAlertData) => {
      if (type === CHAT_ACTIONS.SET_ALERT_EMAIL && candidateId) {
        setIsChatLoading(true);
        try {
          await apiInstance.createJobAlert({
            email: email,
            location: searchLocations.join(" "),
            jobCategory: alertCategories?.length ? alertCategories[0] : "",
            candidateId: candidateId,
          });
        } catch (err) {
          clearAuthConfig();
        } finally {
          setIsChatLoading(false);
          setSearchLocations([]);
        }
      }
    },
    [searchLocations, alertCategories, candidateId]
  );

  // Initiate an action & set state
  const dispatch = useCallback(
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
      // console.warn("action type -->", type);
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
                dispatch({ type: CHAT_ACTIONS.NO_MATCH });
              }
            } catch (err) {
              isDevMode &&
                console.log(
                  "%c getChatBotResponse (searchRequisitions) error ",
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
          // Currently unused
          setIsChatLoading(true);
          try {
            if (chatId) {
              if (candidateId && payload?.candidateData) {
                const candidateData: IUpdateOrMergeCandidateRequest = {
                  ...payload.candidateData,
                  candidateId: candidateId,
                  chatId: chatId,
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

                setIsCandidateWithEmail(true);
                payload.candidateData.callback?.();
                LOG(candidateRes, "UpdateOrMargeCandidate Response");

                const sendTranscriptRes: ApiResponse<ISendTranscriptResponse> =
                  await apiInstance.sendTranscript({
                    ChatID: chatId,
                  });

                LOG(sendTranscriptRes, "Send Transcript Response");
              }
            }
          } catch (error) {
          } finally {
            setIsChatLoading(false);
          }
          break;
        }

        case CHAT_ACTIONS.UPDATE_OR_MERGE_CANDIDATE: {
          if (chatId) {
            setIsChatLoading(true);
            try {
              if (candidateId && payload?.candidateData) {
                const candidateData: IUpdateOrMergeCandidateRequest = {
                  ...payload.candidateData,
                  candidateId: candidateId,
                  chatId: chatId,
                };
                setEmailAddress(candidateData.emailAddress);
                setFirstName(candidateData.firstName);
                setLastName(candidateData.lastName);

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

                setShouldCallAgain(true);
                setIsCandidateWithEmail(true);
                payload.candidateData.callback?.();

                LOG(
                  candidateRes,
                  "UPDATE_OR_MERGE_CANDIDATE Candidate Response"
                );
              }
            } catch (error) {
            } finally {
              setIsChatLoading(false);
            }
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
            dispatch({ type: CHAT_ACTIONS.NO_MATCH });
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

              if (response.data?.answers.length) {
                const answers: ILocalMessage[] = map(
                  response.data?.answers,
                  (answer) => ({
                    content: {
                      subType: MessageType.TEXT,
                      text: answer,
                    },
                    isOwn: false,
                    localId: generateLocalId(),
                    _id: null,
                    dateCreated: { seconds: moment().unix() },
                  })
                );
                // updatedMessages = lastMessIsButton
                //   ? [...hiringProcessMessage, ...answers, ...messages]
                //   : [
                //       ...hiringProcessMessage,
                //       ...answers,
                //       questionMess,
                //       ...messages,
                //     ];
                updatedMessages = [
                  ...hiringProcessMessage,
                  ...answers,
                  questionMess,
                  ...messages,
                ];
              } else if (!response.data?.answers.length) {
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
                // updatedMessages = lastMessIsButton
                //   ? [...hiringProcessMessage, withoutAnswer, ...messages]
                //   : [
                //       ...hiringProcessMessage,
                //       withoutAnswer,
                //       questionMess,
                //       ...messages,
                //     ];

                updatedMessages = [
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

      const isQuestion =
        action.type === CHAT_ACTIONS.ASK_QUESTION &&
        (!!action.payload?.question ||
          (!!action.payload?.item && action.payload.item !== "Ask questions"));

      //  Update state with response
      const param = action.payload?.item || "";
      let responseMessages = getChatActionResponse({
        type,
        additionalCondition,
        param,
        isQuestion,
      });

      // ----- for filtering messages (if the sample questions are only needed once)  ----- //
      //
      // const withPopularQuestions = updatedMessages.some(
      //   (msg) =>
      //     msg.content.subType === MessageType.BUTTON &&
      //     (msg.content.text === t("messages:whatHiring") ||
      //       msg.content.text === t("messages:howSubmitCV") ||
      //       msg.content.text === t("messages:howMuchExperience") ||
      //       msg.content.text === t("messages:popularQuestions"))
      // );

      // const responseMessWithPopularQuestions = responseMessages.some(
      //   (msg) =>
      //     msg.content.subType === MessageType.BUTTON &&
      //     (msg.content.text === t("messages:whatHiring") ||
      //       msg.content.text === t("messages:howSubmitCV") ||
      //       msg.content.text === t("messages:howMuchExperience") ||
      //       msg.content.text === t("messages:popularQuestions"))
      // );

      // if (withPopularQuestions && responseMessWithPopularQuestions) {
      //   responseMessages = responseMessages.filter((msg) => {
      //     if (
      //       msg.content.text === t("messages:whatHiring") ||
      //       msg.content.text === t("messages:howSubmitCV") ||
      //       msg.content.text === t("messages:howMuchExperience") ||
      //       msg.content.text === t("messages:popularQuestions")
      //     ) {
      //       return false;
      //     } else {
      //       return true;
      //     }
      //   });
      // }

      // console.warn("-----------------------------------");
      // console.log("messages", messages);
      // console.log("responseMessages", responseMessages);
      // console.log(
      //   "responseMessWithPopularQuestions",
      //   responseMessWithPopularQuestions
      // );
      // console.error("updatedMessages", updatedMessages);
      // console.log("withPopularQuestions", withPopularQuestions);
      // console.warn("-----------------------------------");

      // --------------------------------------------------------------------------- //

      updatedMessages = getMessagesOnAction({
        action,
        messages: updatedMessages,
        responseMessages,
        additionalCondition,
      });

      // console.log("responseMessages", responseMessages);
      // console.log("updatedMessages", updatedMessages);

      // console.log(
      //   "%cupdatedMessages",
      //   "color: green; font-size: 16px;",
      //   updatedMessages
      // );
      // Simulate chat bot reaction
      setTimeout(() => {
        updatedMessages?.length && setMessages(updatedMessages);
        const nextMsgType = getNextActionType(type);

        // console.log("====================================");
        // console.log("__type", type);
        // console.log("__nextMsgType", nextMsgType);
        // console.log("====================================");

        setCurrentMsgType(nextMsgType);
        setStatus(Status.DONE);
      }, 0);

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
      chatBotId,
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

  // for sending answer (after "Apply job")
  const sendPreScreenMessage = async (message: string) => {
    if (flowId && subscriberWorkflowId && candidateId) {
      const localMess: ILocalMessage = {
        localId: generateLocalId(),
        isOwn: true,
        content: {
          subType: MessageType.TEXT,
          text: message,
        },
        _id: generateLocalId(),
      };

      try {
        setIsChatLoading(true);
        const payload: ISendAnswerRequest = {
          FlowID: flowId,
          SubscriberWorkflowID: subscriberWorkflowId,
          candidateId,
          message,
          localId: localMess.localId?.toString()!,
        };

        const answerResponse: ApiResponse<IFollowingResponse> =
          await apiInstance.sendAnswer(payload);

        LOG(answerResponse, "answerResponse");
        if (answerResponse.data?.success) {
          return Promise.resolve(answerResponse.data);
        } else {
          return Promise.reject(answerResponse);
        }
      } catch (error) {
        return Promise.reject(error?.message);
      } finally {
        setIsChatLoading(false);
      }
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

  const chatState: IChatMessengerContext = {
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
    dispatch,
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
    isAnonym: isCandidateAnonym,
    candidateId,
    chatId: chatId,
    shouldCallAgain,
    isCandidateWithEmail,
    chatBotToken,
    firebaseToken,
    isAuthInFirebase,
    setIsAuthInFirebase,
    setIsApplyJobSuccessfully,
    isApplyJobFlow,
    setFlowId,
    setSubscriberWorkflowId,
    sendPreScreenMessage,
    setIsApplyJobFlow,
    emailAddress,
    firstName,
    lastName,
    setEmailAddress,
    setFirstName,
    setLastName,
    setSearchLocations,
  };

  // console.log(
  //   "%c   chat state   ",
  //   `color: ${colors.shamrock}; font-size: 14px; background-color: ${colors.black};`,
  //   chatState
  // );

  return (
    <ChatContext.Provider value={chatState}>{children}</ChatContext.Provider>
  );
};

const useChatMessenger = () => useContext(ChatContext);

export { ChatProvider, useChatMessenger };
