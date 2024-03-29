/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  createContext,
  useCallback,
  useContext,
  useState,
  useEffect,
} from 'react';

import {
  MessageType,
  ILocalMessage,
  CHAT_ACTIONS,
  USER_INPUTS,
  IRequisition,
} from 'utils/types';
import { IMessage, ISnapshot } from 'services/types';
import {
  getChatActionResponse,
  isPushMessageType,
  Status,
} from 'utils/constants';
import {
  chatMessangerDefaultState,
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
} from 'utils/helpers';
import {
  IChatMessangerContext,
  IPortionMessages,
  ISubmitMessageProps,
  ITriggerActionProps,
  IUser,
} from './types';
import { apiPayload, useRequisitions } from 'services/hooks';
import { getParsedSnapshots } from 'services/utils';
import i18n from 'services/localization';
import { apiInstance } from 'services';
import { chatId } from 'components/Chat';
import { loginUser } from 'services/auth';

type PropsType = {
  children: React.ReactNode;
};

const ChatContext = createContext<IChatMessangerContext>(
  chatMessangerDefaultState
);

export const info = {
  username: 'RomanAndreevUpworkPlaypen',
  password: 'SomeStrongPassword1234',
};
const ChatProvider = ({ children }: PropsType) => {
  // State
  const [category, setCategory] = useState<string | null>(null);
  const [searchLocations, setSearchLocations] = useState<string[]>([]);
  const [offerJobs, setOfferJobs] = useState<IRequisition[]>([]);
  const [viewJob, setViewJob] = useState<IRequisition | null>(null);
  const [prefferedJob, setPrefferedJob] = useState<IRequisition | null>(null);
  const [alertCategories, setAlertCategories] = useState<string[] | null>([]);
  const [alertPeriod, setAlertPeriod] = useState<string | null>(null);
  const [user, setUser] = useState<IUser | null>(null);

  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [messages, setMessages] = useState<ILocalMessage[]>([]);
  const [serverMessages, setServerMessages] = useState<IMessage[]>([]);
  const [nextMessages, setNextMessages] = useState<IPortionMessages[]>([]);
  const [currentMsgType, setCurrentMsgType] = useState<CHAT_ACTIONS | null>(
    null
  );
  const [chatAction, setChatAction] = useState<ITriggerActionProps | null>(
    null
  );
  const [initialAction, setInitialAction] =
    useState<ITriggerActionProps | null>(null);
  const [status, setStatus] = useState<Status | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoadedMessages, setIsLoadedMessages] = useState(false);

  const { requisitions, locations } = useRequisitions(accessToken);

  // Effects
  useEffect(() => {
    loginUser({ data: info })
      .then((result) => {
        setAccessToken(result?.access_token);
      })
      .catch((error) => {
        if (error.message) {
          setIsInitialized(true);
        }
      });
  }, []);

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

  const getMessageParam = (action: ITriggerActionProps) => {
    const isAlertLastType =
      action.type === CHAT_ACTIONS.SET_ALERT_EMAIL && alertPeriod;
    const param = isAlertLastType ? alertPeriod : action.payload?.item;
    return param || undefined;
  };

  const triggerAction = useCallback(
    (action: ITriggerActionProps) => {
      const { type, payload } = action;

      if (status === Status.PENDING || !isInitialized) {
        !isInitialized && setInitialAction(action);
        return null;
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
        case CHAT_ACTIONS.SET_ALERT_PERIOD: {
          setAlertPeriod(payload?.item!);
          break;
        }
        case CHAT_ACTIONS.INTERESTED_IN: {
          const job = getItemById(offerJobs, payload?.item!);
          setPrefferedJob(job!);
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
            setError('Incorrect age');
            isErrors = true;
          } else {
            setError('');
          }
          setUser({ ...user, age: payload?.item! });
          break;
        }
        case CHAT_ACTIONS.SET_SALARY: {
          if (payload?.item) {
            const salaryInfo = payload?.item.split(' ');
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
          const error = isPhoneType
            ? validateEmailOrPhone(payload?.item!)
            : validateEmail(payload?.item!);

          if (payload?.item && !error?.length) {
            if (isPhoneType) {
              setUser({ ...user, phone: payload?.item! });
            } else {
              setUser({ ...user, email: payload?.item! });
            }
            clearFilters();
          } else {
            setError(error);
            isErrors = true;
          }
          break;
        }
        case CHAT_ACTIONS.REFINE_SEARCH: {
          clearFilters();
          break;
        }
      }
      if (!isErrors) {
        if (isPushMessageType(action.type)) {
          setStatus(Status.PENDING);
          pushMessage({ action, messages, setMessages, accessToken });
        }

        setCurrentMsgType(getNextActionType(type));
        setChatAction(action);
      }
    },
    [user, isInitialized, messages, requisitions.length, accessToken]
  );

  useEffect(() => {
    if (chatAction !== null && messages.length) {
      updateStateOnRequest(chatAction);
    }
  }, [chatAction]);

  // Callbacks
  const updateStateOnRequest = useCallback(
    async (action: ITriggerActionProps) => {
      const { type, payload } = action;

      let additionalCondition = null;
      let updatedMessages = [...messages];

      //  Make async action
      switch (type) {
        case CHAT_ACTIONS.SEND_LOCATIONS: {
          if (category) {
            const data = getSearchJobsData(
              category,
              searchLocations[0]?.split(',')[0]
            );
            const apiResponse = await apiInstance.searchJobs(data);
            additionalCondition = !!apiResponse.data?.requisitions.length;

            setCategory(null);
            setSearchLocations([]);
            if (apiResponse.data?.requisitions.length) {
              setOfferJobs(apiResponse.data?.requisitions);
            } else {
              triggerAction({ type: CHAT_ACTIONS.NO_MATCH });
            }
          }
          break;
        }
        case CHAT_ACTIONS.SAVE_TRANSCRIPT: {
          apiInstance.sendTranscript({ chatId, ...apiPayload });
          break;
        }
        case CHAT_ACTIONS.SET_WORK_PERMIT: {
          const isPermitWork = payload?.item === 'Yes';
          setUser({ ...user, isPermitWork });
          additionalCondition = isPermitWork;
          break;
        }
        case CHAT_ACTIONS.APPLY_ETHNIC: {
          if (user?.name) {
            const createCandidateData = getCreateCandidateData({
              user,
              prefferedJob,
            });
            apiInstance.createCandidate(createCandidateData);
          }
          break;
        }
      }

      //  Update state with response
      const param = getMessageParam(action);
      const response = getChatActionResponse({
        type,
        additionalCondition,
        param,
      });
      if (response.newMessages.length) {
        setStatus(Status.DONE);
        updatedMessages = getMessagesOnAction({
          action,
          messages: updatedMessages,
          responseAction: response,
          additionalCondition,
        });

        setTimeout(() => {
          updatedMessages?.length && setMessages(updatedMessages);
        }, 500);

        setChatAction(null);
      } else {
        setStatus(Status.ERROR);
      }
    },
    [
      messages,
      searchLocations.length,
      currentMsgType,
      user,
      isInitialized,
      requisitions.length,
    ]
  );

  const clearFilters = () => {
    setCategory(null);
    setCurrentMsgType(null);
    setAlertCategories(null);
    setSearchLocations([]);
  };

  const submitMessage = ({ type, messageId }: ISubmitMessageProps) => {
    const updatedMessages = messages.map((msg, index) =>
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

  const chooseButtonOption = (excludeItem: USER_INPUTS) => {
    const type = getActionTypeByOption(excludeItem);
    const updatedMessages = replaceItemsWithType({
      type: MessageType.BUTTON,
      messages,
      excludeItem,
    });

    if (type) {
      const response = getChatActionResponse({ type });
      setMessages([...response.newMessages, ...updatedMessages]);
    } else {
      const chatType = getNextActionType(currentMsgType);
      chatType && updateStateOnRequest({ type: chatType });
      setMessages(updatedMessages);
    }

    // setCurrentMsgType(type);
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
        const updatedMessages = messages.map((localmsg) => {
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
        accessToken,
        setIsInitialized,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

const useChatMessanger = () => useContext(ChatContext);

export { ChatProvider, useChatMessanger };
