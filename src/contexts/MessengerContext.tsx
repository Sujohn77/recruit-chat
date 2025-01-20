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
import uniq from "lodash/uniq";
import find from "lodash/find";
import filter from "lodash/filter";
import sortBy from "lodash/sortBy";
import unionBy from "lodash/unionBy";
import findIndex from "lodash/findIndex";
import { ApiResponse } from "apisauce";
import { useTranslation } from "react-i18next";
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
  IFollowingResponse,
  IMessage,
  ISnapshot,
  IUpdateOrMergeCandidateRequest,
  IUpdateOrMergeCandidateResponse,
  IRequisitionsResponse,
} from "services/types";
import {
  ChatScreens,
  getChatActionResponse,
  isPushMessageType,
  LocalStorage,
  REFERRAL_OFFER_TEXT,
  Status,
  StorageKeys,
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
  createTextMess,
  createSendMessPayload,
} from "utils/helpers";
import {
  IChatMessengerContext,
  IPPKeys,
  IPortionMessages,
  IQnAState,
  ISendNewMessage,
  ISubmitMessageProps,
  ITriggerActionProps,
  IUser,
} from "./types";
import { useCreateAnonymCandidate, useGetPopularQuestions } from "./hooks";
import { useIsTabActive, useRequisitions } from "services/hooks";
import i18n from "services/localization";
import { apiInstance } from "services/api";
import { FirebaseSocketReactivePagination } from "services/firebase/socket";
import { SocketCollectionPreset } from "services/firebase/socket.options";
import { chatMessengerDefaultState } from "./data";
import { useDetectCountry } from "utils/hooks";
import { ReferralSteps } from "components/Chat/СhatComponents/ChatInput/data";

interface Task {
  task: () => Promise<void>;
  localId: string;
}

interface IChatProviderProps extends IPPKeys {
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
  defaultLanguage: string;
  withFindJobOption: boolean;
  parentPathname: string;
  isJobSearchLocationMultiSelect: boolean;
  welcomeMessage?: string;
  chatbotMaxHeigh: string;
  chatbotParentHeigh?: string;
  chatbotName: string;
}

const ChatContext = createContext<IChatMessengerContext>(
  chatMessengerDefaultState
);

const ChatProvider = ({
  chatBotId,
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
  defaultLanguage,
  PPLinkUrl,
  consentOptIn,
  footerPrivacyLink,
  inlineDisclaimer,
  withFindJobOption,
  parentPathname,
  isJobSearchLocationMultiSelect,
  chatbotMaxHeigh,
  welcomeMessage,
  chatbotParentHeigh,
  chatbotName,
  cookiePPLinkUrl,
  secondaryPrivacyPolicyLink,
}: IChatProviderProps) => {
  const detectedCountry = useDetectCountry(true, isReferralEnabled);
  const { t } = useTranslation();
  const isTabActive = useIsTabActive();
  const getPopularQuestions = useGetPopularQuestions();

  const firstMessDate = useRef<Date | null>(null);
  const messagesSocketConnection = useRef<any>(null);
  const queueMessagesSocketConnection = useRef<any>(null);

  useEffect(() => {
    const storedFirstMessDate = localStorage.getItem(
      hostname + StorageKeys.FirstMessDate
    );
    if (storedFirstMessDate) {
      firstMessDate.current = new Date(storedFirstMessDate);
    }
  }, []);
  // -------------------------------- State -------------------------------- //
  const sentMessagesRef = useRef<string[]>([]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [isLoadedMessages, setIsLoadedMessages] = useState(false);
  const [chatConsent, setChatConsent] = useState(!consentOptIn?.enabled);

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
  const [queueForSendingMessages, setQueueForSendingMessages] = useState<
    Task[]
  >([]);
  const [isProcessing, setIsProcessing] = useState(false);

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

  const [QnAState, setQnAState] = useState<IQnAState>({
    questions: [],
    message: null,
  });

  useEffect(() => {
    getPopularQuestions().then((QnAState) => setQnAState(QnAState));
  }, []);

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
  const [currentLanguage, setCurrentLanguage] = useState(defaultLanguage);
  const [chatId, setChatId] = useState<number | undefined>();

  const candidateIdRef = useRef<number | undefined>();
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
    (localStorage.getItem(hostname + "referralStep") as ReferralSteps) ||
      ReferralSteps.EmployeeId
  );
  const [queueId, setQueueId] = useState<null | number>(null);

  const createAnonymCandidate = useCreateAnonymCandidate({
    chatBotToken,
    hostname,
    setCandidateId,
    setChatId,
    setFirebaseToken,
    setIsLoadedMessages,
  });

  useEffect(() => {
    createAnonymCandidate();
  }, []);

  useEffect(() => {
    candidateIdRef.current = candidateId;
  }, [candidateId]);

  useEffect(() => {
    const storedCurrentLanguage = localStorage.getItem(
      hostname + "currentLanguage"
    );

    if (storedCurrentLanguage) {
      setCurrentLanguage(storedCurrentLanguage);
      i18n.changeLanguage(storedCurrentLanguage);
      localStorage.setItem(hostname + "currentLanguage", storedCurrentLanguage);
    } else if (defaultLanguage) {
      localStorage.setItem(hostname + "currentLanguage", defaultLanguage);
      i18n.changeLanguage(defaultLanguage);
      setCurrentLanguage(defaultLanguage);
    }
  }, [defaultLanguage]);

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
      case CHAT_ACTIONS.GET_EMAIL:
      case CHAT_ACTIONS.APPLY_JOB_FROM_PARENT_SITE:
        setIsChatInputAvailable(true);
        break;
      default:
        setIsChatInputAvailable(false);
    }
  }, [currentMsgType]);

  // ----------------------------------------------------------------------------- //

  useEffect(() => {
    setMessages((prevMessages) =>
      unionBy<ILocalMessage>(
        [
          ...parseFirebaseMessages({
            fMessages: _firebaseMessages,
            t,
            candidateId,
          }).filter(
            (newMsg) =>
              !prevMessages.some(
                (msg) =>
                  msg._id === newMsg._id ||
                  (!!msg.localId && msg.localId === newMsg.localId)
              )
          ),
          ...prevMessages,
        ],
        "_id"
      )
    );
  }, [_firebaseMessages]);

  useEffect(() => {
    let savedSocketConnection: any;
    if (isApplyJobSuccessfully) {
      LOG(
        `.collection("chats").doc(${chatId}?.toString()).collection("messages")`,
        `chatId=${chatId}`
      );
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
    setMessages((prevMessages) =>
      unionBy<ILocalMessage>(
        [
          ...parseFirebaseMessages({
            fMessages: _firebaseQueueMessages,
            t,
            candidateId,
          }),
          ...prevMessages,
        ],
        "_id"
      )
    );
  }, [_firebaseQueueMessages]);

  useEffect(() => {
    let savedSocketConnection: any;

    if (isLiveChat && queueId && queueChatId && isTabActive) {
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
              [],
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
  }, [isLiveChat, queueId, queueChatId, isTabActive]);

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
    async ({ email, type, successText }: IJobAlertData) => {
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
            const responseMessage = createTextMess({
              text: successText || res.data,
            });

            sendNewMessage({
              isOwn: false,
              message: responseMessage.content.text,
              localId: responseMessage.localId,
            });
            setMessages((prev) => [responseMessage, ...prev]);
            setCurrentMsgType(CHAT_ACTIONS.CREATED_JOB_ALERT);
          } else if (res.status !== 200) {
            const errorMess = createTextMess({
              text: t("errors:something_went_wrong"),
              i18n: "errors:something_went_wrong",
            });

            sendNewMessage({
              isOwn: false,
              message: errorMess.content.text,
              localId: errorMess.localId,
            });
            setMessages((prev) => [errorMess, ...prev]);
          }
        } catch (err) {
          const errorMess = createTextMess({
            text: t("errors:something_went_wrong"),
            i18n: t("errors:something_went_wrong"),
          });

          sendNewMessage({
            isOwn: false,
            message: errorMess.content.text,
            localId: errorMess.localId,
          });
          setMessages((prev) => [errorMess, ...prev]);
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

  const sendNewMessage = useCallback(
    async (props: ISendNewMessage) => {
      if (!candidateId || !props.message) {
        return Promise.resolve();
      }
      const payload = createSendMessPayload({
        ...props,
        isLiveChat,
        queueId,
        flowId,
        subscriberWorkflowId,
        candidateId: props.newCandidateId || candidateId,
        directionId: props.isOwn ? 1 : 2,
        localId: props.localId,
      });

      if (!payload) {
        return Promise.resolve();
      }

      if (sentMessagesRef.current.includes(props.localId.toString())) {
        return Promise.resolve();
      }

      if (!firstMessDate.current) {
        firstMessDate.current = new Date();
        localStorage.setItem(
          hostname + StorageKeys.FirstMessDate,
          new Date().toString()
        );
      }

      return new Promise<void>((resolve, reject) => {
        const task = async () => {
          if (candidateId && props.message) {
            try {
              if (props.isOwn) setIsChatLoading(true);
              const answerResponse: ApiResponse<IFollowingResponse> =
                await apiInstance.sendMessage(payload);

              setIsChatLoading(false);
              if (answerResponse.data?.success) {
                resolve();
              } else {
                reject();
              }
            } catch (error) {
              setIsChatLoading(false);
              reject();
            }
          } else {
            resolve();
          }
        };
        addToQueue(task, props.localId.toString());
      });
    },
    [isLiveChat, candidateId, queueId, flowId, subscriberWorkflowId]
  );

  // Initiate an action & set state
  const dispatch = useCallback(
    async (action: ITriggerActionProps) => {
      LOG(action, "DISPATCH action: " + action.type, "#ff8c00");

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
          payload?.items && setAlertCategories(payload?.items);
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
          pushMessage({
            action,
            messages,
            setMessages,
            isReferralEnabled,
            chatConsent,
            consentOptIn,
            currentLanguage,
            companyName,
            t,
            withFindJob: withFindJobOption,
            sendNewMessage,
          });
        }

        setChatAction(action);
      }
    },
    [
      user,
      isInitialized,
      messages,
      requisitions.length,
      inlineDisclaimer,
      consentOptIn,
      currentLanguage,
      PPLinkUrl,
      withFindJobOption,
      sendNewMessage,
      chatConsent,
      cookiePPLinkUrl,
    ]
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
      const payload = getSearchJobsData({
        category: searchCategory,
        city: searchLocation,
        country: searchCountry,
        employeeLocationID,
        employeeJobFamilyNames,
      });

      setIsChatLoading(true);
      try {
        const res: ApiResponse<IRequisitionsResponse> =
          await apiInstance.searchRequisitions(payload);

        if (res.data?.requisitions.length) {
          const offersWithSelectedTitle = filter(
            res.data.requisitions,
            (r) => r.title?.trim() === payload.keyword?.trim()
          );
          const restOffers = filter(
            res.data.requisitions,
            (r) => r.title?.trim() !== payload.keyword?.trim()
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

            // LOG(searchLocations, "searchLocations");
            // LOG(locations, "locations");
            // LOG(payload?.items, "payload?.items");
            try {
              setIsChatLoading(true);
              additionalCondition = await searchRequisitions(
                category,
                locations
              );
            } catch (error) {
            } finally {
              setIsChatLoading(true);
              setTimeout(() => setIsChatLoading(false), 1500);
            }
          }
          break;
        }
        case CHAT_ACTIONS.SEND_REFERRAL_LOCATIONS: {
          additionalCondition = await searchRequisitions(
            undefined,
            employeeLocation
          );
          break;
        }
        case CHAT_ACTIONS.SEND_TRANSCRIPT_EMAIL: {
          // Currently unused
          if (chatId) {
            setIsChatLoading(true);
            try {
              if (chatId) {
                await apiInstance.sendTranscript({
                  ChatID: chatId,
                });
              }
            } catch (error) {
            } finally {
              setIsChatLoading(false);
            }
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
                  skipEmailCheck: !payload.candidateData.emailAddress,
                };
                candidateData.emailAddress &&
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

                if (res?.success) {
                  candidateData.emailAddress &&
                    setEmailAddress(candidateData.emailAddress);
                  setFirstName(candidateData.firstName);
                  setLastName(candidateData.lastName);
                  setIsCandidateWithEmail(true);
                }

                setShouldCallAgain(true);
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
            if (payload.item?.length) {
              setMessages((prev) => [
                createTextMess({
                  text: t("messages:processed_your_resume"),
                  i18n: "messages:processed_your_resume",
                }),
                ...prev,
              ]);
            }

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
            const questionMess = createTextMess({
              isOwn: true,
              text: payload.question?.trim(),
              i18n,
            });

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

                updatedMessages = [...answers, questionMess, ...messages];
              } else if (!response.data?.answers.length) {
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

                updatedMessages = [withoutAnswer, questionMess, ...messages];
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
              updatedMessages = lastMessIsButton
                ? [withoutAnswer, ...messages]
                : [withoutAnswer, questionMess, ...messages];
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
          (!!action.payload?.item &&
            action.payload.item !== t("chat_menu:ask_question")));

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
        chatConsent,
        PPLinkUrl,
        consentOptIn,
        currentLanguage,
        inlineDisclaimer,
        messages,
        QnAState,
      });

      updatedMessages = getMessagesOnAction({
        action,
        messages: updatedMessages,
        responseMessages,
        isReferralEnabled,
        withFindJob: withFindJobOption,
        sendNewMessage,
        companyName,
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
      searchLocations,
      currentMsgType,
      user,
      isInitialized,
      requisitions.length,
      chatBotId,
      companyName,
      withFindJobOption,
      sendNewMessage,
      chatConsent,
      QnAState.message,
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
      msg?.content?.subType === type && !msg._id
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

  const addToQueue = useCallback(
    (task: () => Promise<void>, localId: string) => {
      setQueueForSendingMessages((prevQueue) => {
        if (
          prevQueue.some((queuedTask) => queuedTask.localId === localId) ||
          sentMessagesRef.current.includes(localId)
        ) {
          return prevQueue;
        }
        sentMessagesRef.current = [...sentMessagesRef.current, localId];
        return [...prevQueue, { task, localId }];
      });
    },
    []
  );

  const processQueue = useCallback(async () => {
    if (isProcessing || queueForSendingMessages.length === 0) return;
    const nextTask = queueForSendingMessages[0].task;
    setIsProcessing(true);
    await nextTask();

    setQueueForSendingMessages((prevQueue) => prevQueue.slice(1));
    setIsProcessing(false);
  }, [isProcessing, queueForSendingMessages]);

  useEffect(() => {
    if (!isProcessing && queueForSendingMessages.length > 0) {
      processQueue();
    }
  }, [queueForSendingMessages, isProcessing, processQueue]);

  const chooseButtonOption = (
    excludeItem: ButtonsOptions | null,
    param?: string,
    i18nPhrase = ""
  ) => {
    const type = getActionTypeByOption(excludeItem, t);
    const updatedMessages = replaceItemsWithType({
      type: MessageType.BUTTON,
      messages,
      excludeItem,
      // for ask questions
      withoutFiltering: QnAState.questions.some((q) => q === excludeItem),
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
        chatConsent,
        PPLinkUrl,
        consentOptIn,
        currentLanguage,
        inlineDisclaimer,
        messages,
        QnAState,
      });

      switch (type) {
        case CHAT_ACTIONS.ANSWER_QUESTIONS:
          setIsChatInputAvailable(true);
          setCurrentMsgType(CHAT_ACTIONS.SET_CATEGORY);
          setSearchRequisitionsTrigger((prevValue) => prevValue + 1);

          responseMessages.forEach(
            (mess) =>
              !mess.isOwn &&
              sendNewMessage({
                isOwn: false,
                message: mess.content.text,
                localId: mess.localId,
              })
          );
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
          responseMessages.forEach(
            (mess) =>
              !mess.isOwn &&
              sendNewMessage({
                isOwn: false,
                message: mess.content.text,
                localId: mess.localId,
              })
          );
          setMessages(
            param
              ? [
                  ...responseMessages,
                  createTextMess({
                    text: param || "",
                    isOwn: true,
                    i18n: i18nPhrase,
                  }),
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
          responseMessages.forEach(
            (mess) =>
              !mess.isOwn &&
              sendNewMessage({
                isOwn: false,
                message: mess.content.text,
                localId: mess.localId,
              })
          );
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
    const parsedMessages = getServerParsedMessages(serverMessages, candidateId);

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
    secondaryPrivacyPolicyLink,
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
    isApplyJobSuccessfully,
    setIsApplyJobSuccessfully,
    isApplyJobFlow,
    setFlowId,
    subscriberWorkflowId,
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
    companyName,
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
    setIsCandidateWithEmail,
    chatConsent,
    setChatConsent,
    cookiePPLinkUrl,
    PPLinkUrl,
    consentOptIn,
    footerPrivacyLink,
    inlineDisclaimer,
    withFindJobOption,
    flowId,
    parentPathname,
    isJobSearchLocationMultiSelect,
    chatbotMaxHeigh,
    welcomeMessage,
    chatbotParentHeigh,
    detectedCountry,
    chatbotName,
    QNA: QnAState,
  };

  return (
    <ChatContext.Provider value={chatState}>{children}</ChatContext.Provider>
  );
};

const useChatMessenger = () => useContext(ChatContext);

export { ChatProvider, useChatMessenger };
