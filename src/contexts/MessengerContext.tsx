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
import firebase from "firebase";
import "firebase/auth";

import {
  MessageType,
  ILocalMessage,
  CHAT_ACTIONS,
  ButtonsOptions,
  IRequisition,
  IMessageID,
  IJobAlertData,
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
  IRequisitionsResponse,
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
  getStorageValue,
  generateLocalId,
  LOG,
  parseFirebaseMessages,
  validationUserContacts,
  getParsedSnapshots,
  getProcessedSnapshots,
} from "utils/helpers";
import {
  IChatMessengerContext,
  IPortionMessages,
  ISubmitMessageProps,
  ITriggerActionProps,
  IUser,
} from "./types";
import { useRequisitions } from "services/hooks";
import i18n from "services/localization";
import { apiInstance } from "services/api";
import { userAPI } from "services/api/user.api";
import { FirebaseSocketReactivePagination } from "services/firebase/socket";
import { SocketCollectionPreset } from "services/firebase/socket.options";
import { COLORS } from "utils/colors";
import find from "lodash/find";
import filter from "lodash/filter";
import { getQuestions } from "components/ChatContent/data";

interface IChatProviderProps {
  children: React.ReactNode;
  isReferralEnabled: boolean;
  companyName: string | null;
  chatBotToken: string;
  chatBotId?: string | null;
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
  logout: () => {},
  createJobAlert: () => {},
  clearJobFilters: () => {},
  isChatInputAvailable: false,
  setIsChatInputAvailable: () => {},
  requisitionsPage: 0,
  setRequisitionsPage: () => {},
  setIsChatLoading: () => {},
  setCandidateId: () => {},
  setIsCandidateAnonym: () => {},
  setEmployeeId: () => {},
  isReferralEnabled: false,
  referralCompanyName: null,
};

const ChatContext = createContext<IChatMessengerContext>(
  chatMessengerDefaultState
);

const ChatProvider = ({
  chatBotId = "17",
  children,
  companyName,
  isReferralEnabled,
  chatBotToken,
}: IChatProviderProps) => {
  const messagesSocketConnection = useRef<any>(null);
  // -------------------------------- State -------------------------------- //
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [isLoadedMessages, setIsLoadedMessages] = useState(false);
  const [category, setCategory] = useState<string | null>(null);
  const [_categoryTitle, _setCategoryTitle] = useState<string | null>(null);
  const [searchLocations, setSearchLocations] = useState<string[]>([]);
  const [offerJobs, setOfferJobs] = useState<IRequisition[]>([]);
  const [viewJob, setViewJob] = useState<IRequisition | null>(null);
  const [preferredJob, setPreferredJob] = useState<IRequisition | null>(null);
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
  const [requisitionsPage, setRequisitionsPage] = useState(0);

  const [shouldCallAgain, setShouldCallAgain] = useState(false);

  const { clearAuthConfig } = useAuthContext();
  const { requisitions, locations, setJobPositions } = useRequisitions(
    searchRequisitionsTrigger,
    setIsChatLoading,
    requisitionsPage,
    setRequisitionsPage
  );
  // ----------------------------------------------------------------------------- //
  const [firebaseToken, _setFirebaseToken] = useState<string | null>(null);

  const [isAuthInFirebase, setIsAuthInFirebase] = useState(false);
  const [_firebaseMessages, _setFirebaseMessages] = useState<IMessage[]>([]);

  const [isCandidateAnonym, setIsCandidateAnonym] = useState<boolean>(true);
  const [candidateId, setCandidateId] = useState<number | undefined>();
  const [chatId, setChatID] = useState<number | undefined>();
  const [isApplyJobSuccessfully, setIsApplyJobSuccessfully] = useState(false);
  const [isCandidateWithEmail, setIsCandidateWithEmail] = useState(false);

  const [isApplyJobFlow, setIsApplyJobFlow] = useState(false);
  const [flowId, setFlowId] = useState<number | undefined>(undefined);
  const [subscriberWorkflowId, setSubscriberWorkflowId] = useState<
    number | undefined
  >(undefined);
  const [isChatInputAvailable, setIsChatInputAvailable] = useState(false);

  // Candidate info
  const [emailAddress, setEmailAddress] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  // ----------------------------- referral state ----------------------------------------------- //
  const [employeeId, setEmployeeId] = useState<number | undefined>(undefined);

  // -------------------------------------------------------------------------------------------- //
  useEffect(() => {
    switch (currentMsgType) {
      case CHAT_ACTIONS.UPDATE_OR_MERGE_CANDIDATE:
      case CHAT_ACTIONS.ASK_QUESTION:
      case CHAT_ACTIONS.SET_CATEGORY:
      case CHAT_ACTIONS.SET_LOCATIONS:
      case CHAT_ACTIONS.SET_ALERT_EMAIL:
      case CHAT_ACTIONS.MAKE_REFERRAL:
      case CHAT_ACTIONS.MAKE_REFERRAL_FRIED:
        setIsChatInputAvailable(true);
        break;
      default:
        setIsChatInputAvailable(false);
    }
  }, [currentMsgType]);

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
        }
      );
    }
    return () => savedSocketConnection?.unsubscribe();
  }, [isApplyJobSuccessfully]);

  // useEffect(() => {
  //   LOG(_firebaseMessages, "_firebaseMessages", COLORS.WHITE);
  // }, [_firebaseMessages]);
  // useEffect(() => {
  //   LOG(candidateId, "candidateId", COLORS.WHITE);
  // }, [candidateId]);
  // useEffect(() => {
  //   LOG(chatId, "chatId", COLORS.WHITE);
  // }, [chatId]);
  // useEffect(() => {
  //   LOG(isCandidateAnonym, "isCandidateAnonym", COLORS.WHITE);
  // }, [isCandidateAnonym]);

  const createAnonymCandidate = useCallback(async () => {
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
          _setFirebaseToken(firebaseTokenResponse.data);
        }

        const chatRes: ApiResponse<ICreateChatResponse> =
          await userAPI.createChatByAnonymUser(res.data.id);

        if (chatRes.data?.chatId) {
          setChatID(chatRes.data?.chatId);
        }
      }
    } catch (error) {
      LOG(error, "CreateAnonymCandidate ERROR");
    } finally {
      setIsLoadedMessages(false);
    }
  }, []);

  useEffect(() => {
    createAnonymCandidate();
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
  }, [nextMessages.length && nextMessages[0].data?.localId]);

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
    async (action: ITriggerActionProps) => {
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
          if (payload?.item?.trim()) {
            const searchCategory = payload?.item?.trim()?.toLowerCase();
            let foundRequisition = find(
              requisitions,
              (r) => r.title.toLowerCase() === searchCategory
            );

            if (!requisitions.length) {
              const searchParams = {
                pageSize: requisitionsPage !== 0 ? requisitionsPage * 25 : 25,
                keyword: "*",
                minDatePosted: "2016-11-13T00:00:00",
                uniqueTitles: true,
                page: 0,
              };
              const requisitionsResponse: ApiResponse<IRequisitionsResponse> =
                await apiInstance.searchRequisitions(searchParams);

              if (requisitionsResponse.data?.requisitions.length) {
                foundRequisition = find(
                  map(
                    requisitionsResponse?.data?.requisitions,
                    (c: IRequisition) => ({
                      title: c.title,
                      category: c.categories![0],
                    })
                  ),
                  (r) => r.title.toLowerCase() === searchCategory
                );
              }
            }

            setCategory(foundRequisition?.category || payload?.item?.trim());
            _setCategoryTitle(foundRequisition?.title || payload?.item?.trim());
            payload!.item = foundRequisition?.title || payload?.item?.trim();
          }

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
          setPreferredJob(job!);
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
            clearJobFilters();
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
          clearJobFilters();

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
              searchLocations[0]?.split(",")[0] || searchLocations[0]
            );
            setIsChatLoading(true);
            try {
              const res: ApiResponse<IRequisitionsResponse> =
                await apiInstance.searchRequisitions(data);

              additionalCondition = !!res.data?.requisitions.length;

              if (res.data?.requisitions.length) {
                const offersWithSelectedTitle = filter(
                  res.data.requisitions,
                  (r) => r.title === _categoryTitle
                );
                const restOffers = filter(
                  res.data.requisitions,
                  (r) => r.title !== _categoryTitle
                );

                setOfferJobs([...offersWithSelectedTitle, ...restOffers]);
                setSearchLocations([]);
                setCategory(null);
                _setCategoryTitle(null);
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
              _setCategoryTitle(null);
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
                LOG(
                  candidateRes,
                  "UpdateOrMargeCandidate Response",
                  COLORS.WHITE
                );

                const sendTranscriptRes: ApiResponse<ISendTranscriptResponse> =
                  await apiInstance.sendTranscript({
                    ChatID: chatId,
                  });

                LOG(sendTranscriptRes, "Send Transcript Response");
              }
            }
          } catch (error) {
            LOG(error, "Send Transcript Response ERROR");
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
        case CHAT_ACTIONS.ASK_QUESTION: {
          if (payload?.question) {
            setIsChatLoading(true);
            const questionMess: ILocalMessage = {
              content: {
                subType: MessageType.TEXT,
                text: payload.question?.trim(),
              },
              isOwn: true,
              localId: generateLocalId(),
              _id: generateLocalId(),
            };
            // hiringProcessMessage for another phase
            // const hiringProcessMessage = getChatActionResponse({
            //   type: CHAT_ACTIONS.HIRING_PROCESS,
            // });
            const lastMessIsButton =
              messages[0]?.content.subType === MessageType.BUTTON;

            try {
              const data = {
                question: payload.question?.trim(),
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
                updatedMessages = [
                  // ...hiringProcessMessage,
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

                updatedMessages = [
                  // ...hiringProcessMessage,
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
                ? // ? [...hiringProcessMessage, withoutAnswer, ...messages]
                  [withoutAnswer, ...messages]
                : [
                    // ...hiringProcessMessage,
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
      const responseMessages = getChatActionResponse({
        type,
        additionalCondition,
        param,
        isQuestion,
        employeeId,
        withReferralFlow: isReferralEnabled,
        referralCompanyName: companyName,
      });

      // console.log(
      //   "%cresponseMessages",
      //   "color: green; font-size: 16px;",
      //   responseMessages
      // );
      // console.log(
      //   "%cupdatedMessages 1",
      //   "color: green; font-size: 16px;",
      //   updatedMessages
      // );
      // console.log("%cmessages", "color: green; font-size: 16px;", messages);

      updatedMessages = getMessagesOnAction({
        action,
        messages: updatedMessages,
        responseMessages,
      });

      // console.log(
      //   "%cupdatedMessages 2",
      //   "color: green; font-size: 16px;",
      //   updatedMessages
      // );
      // Simulate chat bot reaction
      updatedMessages?.length && setMessages(updatedMessages);
      const nextMsgType = getNextActionType(type);

      setCurrentMsgType(nextMsgType);
      setStatus(Status.DONE);

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

  const clearJobFilters = () => {
    setCategory(null);
    _setCategoryTitle(null);
    setCurrentMsgType(null);
    setAlertCategories(null);
    setSearchLocations([]);
  };

  const submitMessage = ({ type, messageId }: ISubmitMessageProps) => {
    const updatedMessages = map(messages, (msg) =>
      msg?.content.subType === type && !msg._id
        ? { ...msg, _id: messageId }
        : msg
    );

    setMessages(updatedMessages);
  };

  const setSnapshotMessages = useCallback(
    (messagesSnapshots: ISnapshot<IMessage>[]) => {
      if (!nextMessages.length) {
        setCurrentMsgType(null);
        setNextMessages(messagesSnapshots);
      }
    },
    [nextMessages]
  );

  // for sending answer (after "Apply job")
  const sendPreScreenMessage = async (
    message: string,
    optionId?: number,
    chatItemId?: number
  ) => {
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
          SubscriberWorkflowID: subscriberWorkflowId,
          localId: localMess?.localId?.toString()!,
          FlowID: flowId,
          candidateId,
          message,
          optionId,
          chatItemId,
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

  const chooseButtonOption = (excludeItem: ButtonsOptions, param?: string) => {
    const type = getActionTypeByOption(excludeItem, companyName);
    const updatedMessages = replaceItemsWithType({
      type: MessageType.BUTTON,
      messages,
      excludeItem,
      // for ask questions
      withoutFiltering: getQuestions(isReferralEnabled, companyName).some(
        (q) => q.text === excludeItem
      ),
    });

    if (type) {
      const responseMessages = getChatActionResponse({
        type,
        additionalCondition: undefined,
        param,
        employeeId,
        withReferralFlow: isReferralEnabled,
        referralCompanyName: companyName,
      });

      switch (type) {
        case CHAT_ACTIONS.ANSWER_QUESTIONS:
          setIsChatInputAvailable(true);
          setCurrentMsgType(CHAT_ACTIONS.SET_CATEGORY);
          setSearchRequisitionsTrigger((prevValue) => prevValue + 1);
          setTimeout(
            () => setMessages([...responseMessages, ...updatedMessages]),
            1000
          );
          break;
        case CHAT_ACTIONS.CANCEL_JOB_SEARCH_WITH_RESUME:
          if (messages[0]?.content.subType === MessageType.SUBMIT_FILE) {
            setChatAction(null);
            setMessages(messages.slice(1));
          }
          break;
        case CHAT_ACTIONS.UPLOADED_CV:
          break;

        case CHAT_ACTIONS.MAKE_REFERRAL:
          setMessages([...responseMessages, ...updatedMessages]);

          setCurrentMsgType(
            employeeId
              ? CHAT_ACTIONS.MAKE_REFERRAL_FRIED
              : CHAT_ACTIONS.MAKE_REFERRAL
          );
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
      // LOG(updatedMessages, "updatedMessages", COLORS.BLACK, COLORS.WHITE);
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
            (localmsg) => msg?.localId === localmsg?.localId
          ) === -1
        );
      });
      if (newMessages.length) {
        setMessages([...messages, ...parsedMessages]);
      } else {
        const updatedMessages = map(messages, (localmsg) => {
          const updatedIndex = findIndex(
            parsedMessages,
            (msg) => msg?.localId === localmsg?.localId
          );
          return updatedIndex !== -1 ? parsedMessages[updatedIndex] : localmsg;
        });

        setMessages(updatedMessages);
      }
    }
  };

  const logout = useCallback(() => {
    // firebase logout
    firebase.auth()?.signOut();
    // Clear state
    setIsApplyJobSuccessfully(false);
    setIsChatLoading(false);
    setIsLoadedMessages(false);
    setSearchLocations([]);
    setOfferJobs([]);
    setViewJob(null);
    setPreferredJob(null);
    setAlertCategories([]);
    setUser(null);
    setMessages([]);
    setStatus(null);
    setError(null);
    setResumeName("");
    setIsCandidateAnonym(true);
    setCandidateId(undefined);
    setEmailAddress("");
    setFirstName("");
    setLastName("");
    setSubscriberWorkflowId(undefined);
    setFlowId(undefined);
    setIsApplyJobFlow(false);
    setIsAuthInFirebase(false);
    setIsCandidateWithEmail(false);
    _setCategoryTitle(null);
    // create new anonym user
    createAnonymCandidate();
  }, []);

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
    prefferedJob: preferredJob,
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
    logout,
    createJobAlert,
    clearJobFilters,
    isChatInputAvailable,
    setIsChatInputAvailable,
    requisitionsPage,
    setRequisitionsPage,
    setIsChatLoading,
    setCandidateId,
    setIsCandidateAnonym,
    setEmployeeId,
    employeeId,
    referralCompanyName: companyName,
    isReferralEnabled,
  };

  // console.log(
  //   "%c   chat state   ",
  //   `color: ${COLORS.PASTEL_GRIN}; font-size: 14px; background-color: ${COLORS.BLACK};`,
  //   chatState
  // );

  return (
    <ChatContext.Provider value={chatState}>{children}</ChatContext.Provider>
  );
};

const useChatMessenger = () => useContext(ChatContext);

export { ChatProvider, useChatMessenger };
