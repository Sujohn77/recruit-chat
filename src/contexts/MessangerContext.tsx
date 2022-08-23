/* eslint-disable react-hooks/exhaustive-deps */
import React, { createContext, useCallback, useContext, useState, useEffect } from 'react';

import { MessageType, ILocalMessage, CHAT_ACTIONS, USER_INPUTS, IRequisition } from 'utils/types';
import { ContactType, IMessage, ISnapshot } from 'services/types';
import {
  ChannelName,
  getChatActionResponse,
  getReplaceMessageType,
  isPushMessageType,
  isReversePush,
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
import { IChatMessangerContext, IPortionMessages, ISubmitMessageProps, ITriggerActionProps } from './types';
import { useRequisitions } from 'services/hooks';
import { getParsedSnapshots } from 'services/utils';
import i18n from 'services/localization';
import { apiInstance } from 'services';
import { FIREBASE_TOKEN, handleSignInWithCustomToken } from './../firebase/config';
import { STATUS_CODES } from 'http';

type PropsType = {
  children: React.ReactNode;
};

const ChatContext = createContext<IChatMessangerContext>(chatMessangerDefaultState);
export interface IUser {
  name?: string;
  email?: string;
  age?: string;
  isPermitWork?: boolean;
  wishSalary?: number;
  salaryCurrency?: string;
}

const ChatProvider = ({ children }: PropsType) => {
  // State
  const [category, setCategory] = useState<string | null>(null);
  const [searchLocations, setSearchLocations] = useState<string[]>([]);
  const [offerJobs, setOfferJobs] = useState<IRequisition[]>([]);
  const [viewJob, setViewJob] = useState<IRequisition | null>(null);
  const [prefferedJob, setPrefferedJob] = useState<IRequisition | null>(null);
  const [alertCategory, setAlertCategory] = useState<string | null>(null);
  const [user, setUser] = useState<IUser | null>(null);
  const [alertPeriod, setAlertPeriod] = useState<string | null>(null);
  const [applyUser, setApplyUser] = useState<IUser | null>(null);

  const [messages, setMessages] = useState<ILocalMessage[]>([]);
  const [serverMessages, setServerMessages] = useState<IMessage[]>([]);
  const [nextMessages, setNextMessages] = useState<IPortionMessages[]>([]);
  const [lastActionType, setLastActionType] = useState<CHAT_ACTIONS | null>(null);
  const [chatAction, setChatAction] = useState<ITriggerActionProps | null>(null);
  const [status, setStatus] = useState<Status | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const { requisitions, locations } = useRequisitions();

  const [initialAction, setInitialAction] = useState<ITriggerActionProps>();
  // const [alertEmail, setAlertEmail] = useState<string | null>(null);

  // Effects
  useEffect(() => {
    handleSignInWithCustomToken(FIREBASE_TOKEN).then((error) => {
      if (error.message) {
        setIsInitialized(true);
      }
    });
  }, []);

  useEffect(() => {
    if (nextMessages.length) {
      const processedSnapshots: IMessage[] = getParsedSnapshots({
        serverMessages,
        nextMessages,
      });

      updateMessages(processedSnapshots);
      setServerMessages(processedSnapshots);
      !isInitialized && setIsInitialized(true);
    }
  }, [nextMessages.length && nextMessages[0].data.localId]);

  useEffect(() => {
    isInitialized && initialAction && triggerAction(initialAction);
  }, [isInitialized]);

  const getMessageParam = (action: ITriggerActionProps) => {
    const isAlertLastType = action.type === CHAT_ACTIONS.SET_ALERT_EMAIL && alertPeriod;
    const param = isAlertLastType ? alertPeriod : action.payload?.item;
    return param || undefined;
  };

  const triggerAction = (action: ITriggerActionProps) => {
    const { type, payload } = action;

    if (status === Status.PENDING || !isInitialized) {
      !isInitialized && setInitialAction(action);
      return null;
    }

    let isErrors = false;

    switch (type) {
      case CHAT_ACTIONS.SET_CATEGORY: {
        const searchCategory = payload?.item!.toLowerCase();
        const requisition = requisitions.find((r) => r.title.toLowerCase() === searchCategory);
        requisition && setCategory(requisition.category);
        payload!.item = requisition?.title;
        break;
      }
      case CHAT_ACTIONS.SET_LOCATIONS: {
        setSearchLocations(payload?.items!);
        break;
      }
      case CHAT_ACTIONS.SET_ALERT_CATEGORY: {
        setAlertCategory(payload?.item!);
        break;
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
      case CHAT_ACTIONS.GET_USER_NAME: {
        setUser({ name: payload?.item! });
        break;
      }
      case CHAT_ACTIONS.GET_USER_AGE: {
        setUser({ age: payload?.item! });
        break;
      }
      case CHAT_ACTIONS.APPLY_NAME: {
        setApplyUser({ name: payload?.item! });
        break;
      }
      case CHAT_ACTIONS.APPLY_AGE: {
        setApplyUser({ ...applyUser, age: payload?.item! });
        break;
      }
      case CHAT_ACTIONS.SET_SALARY: {
        if (payload?.item) {
          const salaryInfo = payload?.item.split(' ');
          setApplyUser({
            ...applyUser,
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
        const isApplyEmail = type === CHAT_ACTIONS.APPLY_EMAIL;
        const isPhoneType = type === CHAT_ACTIONS.GET_USER_EMAIL;
        const error = isPhoneType ? validateEmailOrPhone(payload?.item!) : validateEmail(payload?.item!);
        if (payload?.item && !error?.length) {
          isApplyEmail && setApplyUser({ ...applyUser, email: payload?.item! });
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
        const updatedMessages = pushMessage({ action, messages, setMessages });
        setMessages(updatedMessages);
      }
      setLastActionType(type);
      setChatAction(action);
    }
  };

  useEffect(() => {
    if (chatAction !== null) {
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
            const data = getSearchJobsData(category, searchLocations[0]?.split(',')[0]);
            const apiResponse = await apiInstance.searchJobs(data);
            additionalCondition = !!apiResponse.data?.requisitions.length;

            if (apiResponse.data?.requisitions.length) {
              setOfferJobs(apiResponse.data?.requisitions);
            }
            setCategory(null);
            setSearchLocations([]);
          }
          break;
        }
        case CHAT_ACTIONS.SET_WORK_PERMIT: {
          const isPermitWork = payload?.item === 'Yes';
          setApplyUser({ ...applyUser, isPermitWork });
          additionalCondition = isPermitWork;
          console.log('lastActionType', type);
          break;
        }
        case CHAT_ACTIONS.APPLY_ETHNIC: {
          if (applyUser?.name) {
            const createCandidateData = getCreateCandidateData({ applyUser, prefferedJob });
            apiInstance.createCandidate(createCandidateData);
          }
          break;
        }
      }

      //  Update state with response
      const param = getMessageParam(action);
      const response = getChatActionResponse({ type, additionalCondition, param });
      if (response.newMessages.length) {
        setStatus(Status.DONE);
        updatedMessages = getMessagesOnAction({
          action,
          messages: updatedMessages,
          responseAction: response,
          additionalCondition,
        });

        updatedMessages?.length && setMessages(updatedMessages);
        setChatAction(null);
      } else {
        setStatus(Status.ERROR);
      }
    },
    [messages.length, searchLocations.length, lastActionType, user, isInitialized]
  );

  const clearFilters = () => {
    setCategory(null);
    setLastActionType(null);
    setAlertCategory(null);
    setSearchLocations([]);
  };

  const submitMessage = ({ type, messageId }: ISubmitMessageProps) => {
    const updatedMessages = messages.map((msg, index) =>
      msg.content.subType === type && !msg._id ? { ...msg, _id: messageId } : msg
    );
    setMessages(updatedMessages);
  };

  const setSnapshotMessages = (messagesSnapshots: ISnapshot<IMessage>[]) => {
    if (!nextMessages.length) {
      setLastActionType(null);
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
      const chatType = getNextActionType(lastActionType);
      chatType && updateStateOnRequest({ type: chatType });
      setMessages(updatedMessages);
    }
    console.log(type, 'type');
    setLastActionType(type);
  };

  const updateMessages = async (serverMessages: IMessage[]) => {
    const parsedMessages = getServerParsedMessages(serverMessages);

    if (!messages.length) {
      setMessages(parsedMessages);
    } else {
      const newMessages = parsedMessages.filter((msg) => {
        return messages.findIndex((localmsg) => msg.localId === localmsg.localId) === -1;
      });
      if (newMessages.length) {
        setMessages([...messages, ...parsedMessages]);
      } else {
        const updatedMessages = messages.map((localmsg) => {
          const updatedIndex = parsedMessages.findIndex((msg) => msg.localId === localmsg.localId);
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
        lastActionType,
        offerJobs,
        alertCategory,
        viewJob,
        prefferedJob,
        user,
        chooseButtonOption,
        triggerAction,
        submitMessage,
        setSnapshotMessages,
        setLastActionType,
        setError,
        setViewJob,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

const useChatMessanger = () => useContext(ChatContext);

export { ChatProvider, useChatMessanger };
