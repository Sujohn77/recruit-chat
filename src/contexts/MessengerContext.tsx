/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  createContext,
  useCallback,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import moment from "moment";
import map from "lodash/map";
import find from "lodash/find";
import filter from "lodash/filter";
import sortBy from "lodash/sortBy";
import findIndex from "lodash/findIndex";
import { ApiResponse } from "apisauce";
import { useTranslation } from "react-i18next";
import firebaseApp from "firebase/app";
import firebase from "firebase";
import "firebase/auth";
import "firebase/firestore";

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
  ChatScreens,
  getChatActionResponse,
  isDevMode,
  isPushMessageType,
  LocalStorage,
  REFERRAL_OFFER_TEXT,
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
import { ReferralSteps } from "components/Chat/ChatComponents/ChatInput/data";
import { getQuestions } from "./data";
import uniq from "lodash/uniq";

interface IChatProviderProps {
  children: React.ReactNode;
  isReferralEnabled: boolean;
  companyName: string | null;
  chatBotToken: string;
  chatBotRefBaseURL: string;
  jobSourceID: string;
  chatBotId?: string | null;
  clientApiToken?: string;
  hostname: string;
  languages: string[];
  isMultiLanguage: boolean;
  chatQueueId: number | null;
  alertTemplateId: undefined | number;
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
  chooseButtonOption() {},
  dispatch() {},
  setSnapshotMessages() {},
  setCurrentMsgType() {},
  setError() {},
  setViewJob() {},
  submitMessage() {},
  setIsInitialized() {},
  setJobPositions() {},
  setShowJobAutocompleteBox() {},
  setMessages() {},
  isAnonym: true,
  shouldCallAgain: false,
  isCandidateWithEmail: false,
  firebaseToken: null,
  isAuthInFirebase: false,
  setIsAuthInFirebase() {},
  setIsApplyJobSuccessfully() {},
  isApplyJobFlow: false,
  setFlowId() {},
  setSubscriberWorkflowId() {},
  setIsApplyJobFlow() {},
  sendNewMessage: () => Promise.resolve(),
  emailAddress: "",
  firstName: "",
  lastName: "",
  setEmailAddress() {},
  setFirstName() {},
  setLastName() {},
  setSearchLocations() {},
  logout() {},
  createJobAlert() {},
  clearJobFilters() {},
  isChatInputAvailable: false,
  setIsChatInputAvailable() {},
  requisitionsPage: 0,
  setRequisitionsPage() {},
  setIsChatLoading() {},
  setCandidateId() {},
  setIsCandidateAnonym() {},
  setEmployeeId() {},
  isReferralEnabled: false,
  referralCompanyName: null,
  setRefBirth() {},
  setRefLastName() {},
  refBirth: "",
  refLastName: "",
  refURL: "",
  chatScreen: null,
  setChatScreen() {},
  employeeLocation: "",
  employeeJobCategory: "",
  setEmployeeJobCategory() {},
  setEmployeeLocation() {},
  searchRequisitions: () => Promise.resolve(null),
  employeeFullName: "",
  setEmployeeFullName() {},
  setUser() {},
  setRequisitions() {},
  setFirebaseToken() {},
  setAlertCategories() {},
  setOfferJobs() {},
  setChatId() {},
  setLocations() {},
  setCategory() {},
  employeeLocationID: "",
  setEmployeeLocationID() {},
  jobSourceID: "",
  employeeJobFamilyNames: [""],
  setEmployeeJobFamilyNames() {},
  referralStep: ReferralSteps.EmployeeId,
  setReferralStep() {},
  hostname: "",
  searchRequisitionsByKeyword: () => Promise.resolve(null),
  searchLocation: () => Promise.resolve(null),
  categoriesForAlert: [],
  languages: [],
  isMultiLanguage: false,
  currentLanguage: "en",
  setCurrentLanguage() {},
  isLiveChat: false,
  setIsLiveChat() {},
  queueId: null,
  setQueueId() {},
  queueChatId: null,
  setQueueChatId() {},
  chatQueueId: null,
  alertTemplateId: undefined,
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
  chatBotRefBaseURL,
  clientApiToken,
  jobSourceID,
  hostname,
  languages,
  isMultiLanguage,
  chatQueueId,
  alertTemplateId,
}: IChatProviderProps) => {
  const messagesSocketConnection = useRef<any>(null);
  const queueMessagesSocketConnection = useRef<any>(null);
  const { t } = useTranslation();
  // -------------------------------- State -------------------------------- //

  const [isChatLoading, setIsChatLoading] = useState(false);
  const [isLoadedMessages, setIsLoadedMessages] = useState(false);

  const [chatScreen, setChatScreen] = useState<ChatScreens | null>(null);
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

  const [categoriesForAlert, setCategoriesForAlert] = useState<string[]>([]);

  useEffect(() => {
    const getCategoriesForAlert = async () => {
      const searchParams = {
        pageSize: 50,
        keyword: "*",
        minDatePosted: "2016-11-13T00:00:00",
        uniqueTitles: true,
        page: 0,
      };
      try {
        const requisitionsResponse: ApiResponse<IRequisitionsResponse> =
          await apiInstance.searchRequisitions(searchParams);

        if (requisitionsResponse.data?.facets.Categories.length) {
          setCategoriesForAlert((prev) =>
            uniq([
              ...prev,
              ...map(
                requisitionsResponse.data?.facets.Categories,
                (c) => c.value
              ),
            ])
          );
        }
      } catch (error) {}
    };

    getCategoriesForAlert();
  }, []);

  const [shouldCallAgain, setShouldCallAgain] = useState(false);

  const {
    requisitions,
    locations,
    setJobPositions,
    setRequisitions,
    setLocations,
    searchRequisitionsByKeyword,
    searchLocation,
  } = useRequisitions(
    searchRequisitionsTrigger,
    setIsChatLoading,
    requisitionsPage,
    setRequisitionsPage,
    setCategoriesForAlert,
    categoriesForAlert
  );
  // ----------------------------------------------------------------------------- //
  const [firebaseToken, setFirebaseToken] = useState<string | null>(null);

  const [isAuthInFirebase, setIsAuthInFirebase] = useState(false);
  const [_firebaseMessages, _setFirebaseMessages] = useState<IMessage[]>([]);
  const [_firebaseQueueMessages, _setFirebaseQueueMessages] = useState<
    IMessage[]
  >([]);

  const [isCandidateAnonym, setIsCandidateAnonym] = useState<boolean>(true);
  const [candidateId, setCandidateId] = useState<number | undefined>();
  const [chatId, setChatId] = useState<number | undefined>();
  const [queueChatId, setQueueChatId] = useState<number | null>(null);
  const [isApplyJobSuccessfully, setIsApplyJobSuccessfully] = useState(false);
  const [isCandidateWithEmail, setIsCandidateWithEmail] = useState(false);
  const [isLiveChat, setIsLiveChat] = useState(false);

  const [isApplyJobFlow, setIsApplyJobFlow] = useState(false);
  const [flowId, setFlowId] = useState<number | undefined>(undefined);
  const [subscriberWorkflowId, setSubscriberWorkflowId] = useState<
    number | undefined
  >(undefined);
  const [isChatInputAvailable, setIsChatInputAvailable] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState("en");

  // Candidate info
  const [emailAddress, setEmailAddress] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  // ----------------------------- referral state ----------------------------------------------- //
  const [employeeId, setEmployeeId] = useState<number | undefined>(undefined);
  const [refLastName, setRefLastName] = useState("");
  const [employeeFullName, setEmployeeFullName] = useState("");
  const [refBirth, setRefBirth] = useState("");
  const [refURL] = useState(chatBotRefBaseURL);

  const [employeeLocation, setEmployeeLocation] = useState("");
  const [employeeJobCategory, setEmployeeJobCategory] = useState("");
  const [employeeLocationID, setEmployeeLocationID] = useState("");
  const [employeeJobFamilyNames, setEmployeeJobFamilyNames] = useState<
    string[]
  >([]);
  const [referralStep, setReferralStep] = useState<ReferralSteps>(
    ReferralSteps.EmployeeId
  );
  const [queueId, setQueueId] = useState<null | number>(null);

  useEffect(() => {
    const onPersistViewJob = ({ key, newValue }: StorageEvent) => {
      if (key === hostname + "viewJob") {
        setViewJob(newValue ? JSON.parse(newValue) : null);
      }
    };

    window.addEventListener("storage", onPersistViewJob);
    return () => {
      window.removeEventListener("storage", onPersistViewJob);
    };
  }, []);

  useEffect(() => {
    employeeId &&
      localStorage.setItem(hostname + "employeeId", employeeId.toString());
    refLastName && localStorage.setItem(hostname + "refLastName", refLastName);
  }, [refLastName, employeeId]);

  useEffect(() => {
    const storedEmployeeId = localStorage.getItem(hostname + "employeeId");
    const storedRefLastName = localStorage.getItem(hostname + "refLastName");

    storedEmployeeId && setEmployeeId(+storedEmployeeId);
    storedRefLastName && setRefLastName(storedRefLastName);
  }, []);
  // -------------------------------------------------------------------------------------------- //

  useEffect(() => {
    LOG(currentMsgType, "currentMsgType");
    switch (currentMsgType) {
      case CHAT_ACTIONS.UPDATE_OR_MERGE_CANDIDATE:
      case CHAT_ACTIONS.ASK_QUESTION:
      case CHAT_ACTIONS.SET_CATEGORY:
      case CHAT_ACTIONS.SET_LOCATIONS:
      case CHAT_ACTIONS.SET_ALERT_EMAIL:
      case CHAT_ACTIONS.MAKE_REFERRAL:
      case CHAT_ACTIONS.MAKE_REFERRAL_FRIEND:
      case CHAT_ACTIONS.SET_USER_FIRST_NAME:
      case CHAT_ACTIONS.SET_USER_LAST_NAME:
      case CHAT_ACTIONS.SET_USER_EMAIL:
      case CHAT_ACTIONS.LIVE_CHAT:
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

  useEffect(() => {
    setMessages((prevMessages) => [
      ...parseFirebaseMessages(_firebaseQueueMessages),
      ...prevMessages,
    ]);
  }, [_firebaseQueueMessages]);

  useEffect(() => {
    LOG(queueChatId, "queueChatId", undefined, undefined, true);
    let savedSocketConnection: any;

    if (isLiveChat && queueId && queueChatId) {
      queueMessagesSocketConnection.current =
        new FirebaseSocketReactivePagination<IMessage>(
          SocketCollectionPreset.QueuesChatMessages,
          queueId,
          queueChatId
        );

      savedSocketConnection = queueMessagesSocketConnection.current;
      savedSocketConnection.subscribe(
        (messagesSnapshots: ISnapshot<IMessage>[]) => {
          const processedSnapshots = sortBy(
            getProcessedSnapshots<IMessageID, IMessage>(
              _firebaseQueueMessages,
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

          _setFirebaseQueueMessages(processedSnapshots);
        }
      );
    }
    return () => savedSocketConnection?.unsubscribe();
  }, [isLiveChat, queueId, queueChatId]);

  const createAnonymCandidate = useCallback(async () => {
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
    async ({ email, type, successText, i18nPhrase = "" }: IJobAlertData) => {
      if (type === CHAT_ACTIONS.SET_ALERT_EMAIL && candidateId) {
        setIsChatLoading(true);
        try {
          const res = await apiInstance.createJobAlert({
            email: email,
            location: searchLocations.join(" "),
            jobCategory: alertCategories?.length ? alertCategories[0] : "",
            candidateId: candidateId,
            chatbotAlertTemplateId: alertTemplateId,
          });

          if (typeof res.data === "string") {
            const responseMessage: ILocalMessage = {
              content: {
                subType: MessageType.TEXT,
                text: successText || res.data,
                i18n: "",
                i18nProps: null,
              },
              isOwn: false,
              localId: generateLocalId(),
              _id: generateLocalId(),
            };
            setMessages((prev) => [responseMessage, ...prev]);
            setCurrentMsgType(CHAT_ACTIONS.CREATED_JOB_ALERT);
          } else if (res.status !== 200) {
            setMessages((prev) => [
              {
                _id: generateLocalId(),
                localId: generateLocalId(),
                isOwn: false,
                content: {
                  subType: MessageType.TEXT,
                  text: t("errors:something_went_wrong"),
                  i18n: "errors:something_went_wrong",
                  i18nProps: null,
                },
              },
              ...prev,
            ]);
          }
        } catch (err) {
          setMessages((prev) => [
            {
              _id: generateLocalId(),
              localId: generateLocalId(),
              isOwn: false,
              content: {
                subType: MessageType.TEXT,
                text: t("errors:something_went_wrong"),
                i18n: i18nPhrase,
                i18nProps: null,
              },
            },
            ...prev,
          ]);
        } finally {
          setIsChatLoading(false);
          setSearchLocations([]);
        }
      }
    },
    [
      searchLocations,
      alertCategories,
      candidateId,
      firstName,
      lastName,
      emailAddress,
      alertTemplateId,
    ]
  );

  // Initiate an action & set state
  const dispatch = useCallback(
    async (action: ITriggerActionProps) => {
      LOG(action.type, "DISPATCH", "#ff8c00", undefined, true);
      LOG(action.payload, "DISPATCH payload", "#ff8c00", undefined, true);
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

              if (requisitionsResponse.data?.facets.Categories.length) {
              }

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

            setCategory(foundRequisition?.title || payload?.item?.trim());
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
        case CHAT_ACTIONS.CHANGE_LANG: {
          if (payload?.item) {
            i18n.changeLanguage(payload.item.toLowerCase());
            setCurrentLanguage(payload.item.toLowerCase());
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
          pushMessage({ action, messages, setMessages, isReferralEnabled });
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

  const searchRequisitions = useCallback(
    async (
      searchCategory?: string | string[],
      searchLocation?: string,
      searchCountry?: string,
      employeeLocationID?: string,
      employeeJobFamilyNames?: string[]
    ): Promise<null | boolean> => {
      const payload = getSearchJobsData(
        searchCategory,
        searchLocation,
        searchCountry,
        employeeLocationID,
        employeeJobFamilyNames
      );

      setIsChatLoading(true);
      try {
        const res: ApiResponse<IRequisitionsResponse> =
          await apiInstance.searchRequisitions(payload);

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
          dispatch({ type: CHAT_ACTIONS.NO_MATCH, i18nProps: null });
        }
        return !!res.data?.requisitions.length;
      } catch (err) {
        isDevMode &&
          console.log(
            "%c getChatBotResponse (searchRequisitions) error ",
            err,
            `color: #ff8c00;`
          );
        return null;
      } finally {
        setCategory(null);
        _setCategoryTitle(null);
        setSearchLocations([]);
        setIsChatLoading(false);
      }
    },
    []
  );

  // Callbacks
  const getChatBotResponse = useCallback(
    async (action: ITriggerActionProps) => {
      const { type, payload, i18n = "" } = action;

      let additionalCondition = null;
      let updatedMessages = [...messages];

      //  Async actions
      switch (type) {
        case CHAT_ACTIONS.SEND_LOCATIONS: {
          if (category) {
            const locations = searchLocations.length
              ? searchLocations[0]?.split(",")[0] || searchLocations[0]
              : payload?.items?.[0];
            try {
              additionalCondition = await searchRequisitions(
                category,
                locations
              );
            } catch {}
          }
          break;
        }
        case CHAT_ACTIONS.SEND_REFERRAL_LOCATIONS: {
          try {
            additionalCondition = await searchRequisitions(
              undefined,
              employeeLocation
            );
          } catch {}

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

                const sendTranscriptRes: ApiResponse<ISendTranscriptResponse> =
                  await apiInstance.sendTranscript({
                    ChatID: chatId,
                  });
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
            dispatch({ type: CHAT_ACTIONS.NO_MATCH, i18nProps: null });
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
                i18n: i18n,
                i18nProps: null,
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
                      subType:
                        answer === REFERRAL_OFFER_TEXT
                          ? MessageType.REFERRAL
                          : MessageType.TEXT,
                      text: answer,
                      i18n: i18n,
                      i18nProps: null,
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
                    text: t("messages:dont_have_answer"),
                    i18n: "messages:dont_have_answer",
                    i18nProps: null,
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
                  text: t("messages:dont_have_answer"),
                  i18n: "messages:dont_have_answer",
                  i18nProps: null,
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
        i18nPhrase: i18n,
      });

      updatedMessages = getMessagesOnAction({
        action,
        messages: updatedMessages,
        responseMessages,
        isReferralEnabled,
      });

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
      companyName,
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
  const sendNewMessage = async (
    message: string,
    i18n: string,
    optionId?: number,
    chatItemId?: number,
    i18nProps?: Object | null,
    isLiveChat = false
  ) => {
    if (isLiveChat && candidateId && queueId) {
      const payload: ISendAnswerRequest = {
        candidateId,
        message,
        queueId,
      };
      const answerResponse: ApiResponse<IFollowingResponse> =
        await apiInstance.sendAnswer(payload);

      if (answerResponse.data?.success) {
        return Promise.resolve(answerResponse.data);
      } else {
        return Promise.reject(answerResponse);
      }
    } else if (flowId && subscriberWorkflowId && candidateId) {
      const localMess: ILocalMessage = {
        localId: generateLocalId(),
        isOwn: true,
        content: {
          subType: MessageType.TEXT,
          text: message,
          i18n,
          i18nProps: i18nProps || null,
        },
        _id: generateLocalId(),
      };

      try {
        setIsChatLoading(true);
        const payload: ISendAnswerRequest = {
          SubscriberWorkflowID: subscriberWorkflowId,
          localId: localMess?.localId?.toString()!,
          FlowID: isLiveChat ? undefined : flowId,
          candidateId,
          message,
          optionId,
          chatItemId,
        };

        const answerResponse: ApiResponse<IFollowingResponse> =
          await apiInstance.sendAnswer(payload);

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

  const chooseButtonOption = (
    excludeItem: ButtonsOptions | null,
    param?: string,
    i18nPhrase = ""
  ) => {
    const type = getActionTypeByOption(excludeItem);
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
        i18nPhrase: i18nPhrase,
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
          setMessages(
            param
              ? [
                  ...responseMessages,
                  {
                    _id: generateLocalId(),
                    localId: generateLocalId(),
                    content: {
                      subType: MessageType.TEXT,
                      text: param,
                      i18n: i18nPhrase,
                      i18nProps: null,
                    },
                    isOwn: true,
                  },
                  ...updatedMessages,
                ]
              : [...responseMessages, ...updatedMessages]
          );

          setCurrentMsgType(
            employeeId
              ? CHAT_ACTIONS.MAKE_REFERRAL_FRIEND
              : CHAT_ACTIONS.MAKE_REFERRAL
          );
          break;
        default:
          setMessages([...responseMessages, ...updatedMessages]);
          break;
      }
    } else {
      const chatType = getNextActionType(currentMsgType, excludeItem);

      if (chatType) {
        const action: ITriggerActionProps =
          currentMsgType === CHAT_ACTIONS.ASK_QUESTION && excludeItem
            ? {
                type: chatType,
                payload: { question: excludeItem },
                i18nProps: null,
              }
            : { type: chatType, i18nProps: null };
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

    localStorage.clear();
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
    setMessages,
    setShowJobAutocompleteBox,
    showJobAutocompleteBox,
    isAnonym: isCandidateAnonym,
    candidateId,
    chatId,
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
    sendNewMessage,
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
    setRefBirth,
    setRefLastName,
    refBirth,
    refLastName,
    refURL,
    clientApiToken,
    chatScreen,
    setChatScreen,
    employeeJobCategory,
    setEmployeeJobCategory,
    employeeLocation,
    setEmployeeLocation,
    searchRequisitions,
    employeeFullName,
    setEmployeeFullName,
    setUser,
    setRequisitions,
    setFirebaseToken,
    setAlertCategories,
    setOfferJobs,
    setChatId,
    setLocations,
    setCategory,
    employeeLocationID,
    setEmployeeLocationID,
    jobSourceID,
    employeeJobFamilyNames,
    setEmployeeJobFamilyNames,
    referralStep,
    setReferralStep,
    hostname,
    searchRequisitionsByKeyword,
    searchLocation,
    categoriesForAlert,
    languages,
    isMultiLanguage,
    currentLanguage,
    setCurrentLanguage,
    isLiveChat,
    setIsLiveChat,
    queueId,
    setQueueId,
    queueChatId,
    setQueueChatId,
    chatQueueId,
    alertTemplateId,
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
