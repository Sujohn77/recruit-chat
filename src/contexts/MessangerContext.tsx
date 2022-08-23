/* eslint-disable react-hooks/exhaustive-deps */
import React, { createContext, useCallback, useContext, useState, useEffect } from 'react';

import { MessageType, ILocalMessage, CHAT_ACTIONS, USER_INPUTS, IRequisition } from 'utils/types';
import { ContactType, IMessage, ISnapshot } from 'services/types';
import { ChannelName, getChatActionResponse } from 'utils/constants';
import {
  chatMessangerDefaultState,
  replaceItemsWithType,
  getItemById,
  getServerParsedMessages,
  getUpdatedMessages,
  validateEmail,
  validateEmailOrPhone,
  getActionTypeByOption,
  getNextActionType,
  getSearchJobsData,
  getCreateCandidateData,
} from 'utils/helpers';
import {
  IChatMessangerContext,
  IPortionMessages,
  ISubmitMessageProps,
  ITriggerActionProps,
} from './types';
import { sendMessage, useRequisitions } from 'services/hooks';
import { getParsedSnapshots } from 'services/utils';
import i18n from 'services/localization';
import { apiInstance } from 'services';
import { FIREBASE_TOKEN, handleSignInWithCustomToken } from './../firebase/config';

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
  const [initialAction, setInitialAction] = useState<ITriggerActionProps>();

  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const { requisitions, locations } = useRequisitions();

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
    initialAction && triggerAction(initialAction);
  }, [isInitialized]);

  const getMessageParam = (action: ITriggerActionProps) => {
    const isAlertLastType = action.type === CHAT_ACTIONS.SET_ALERT_EMAIL && alertPeriod;
    const param = isAlertLastType ? alertPeriod : action.payload?.item;
    return param;
  };

  // Callbacks
  const triggerAction = useCallback(
    async (action: ITriggerActionProps) => {
      const { type, payload } = action;

      //  Check access to action
      if (action.type === lastActionType || !isInitialized) {
        !isInitialized && setInitialAction(action);
        return null;
      }

      
      //  Make action

      const param = getMessageParam(action);

      let response = getChatActionResponse(type, param!);
      let isValidPush = true;
      let additionalCondition = null;

      switch (type) {
        case CHAT_ACTIONS.SET_CATEGORY: {
          const category = requisitions.find((r) => r.title === payload?.item)?.category;
          category && setCategory(category);
          setLastActionType(type);
          break;
        }
        case CHAT_ACTIONS.SET_LOCATIONS: {
          setSearchLocations(payload?.items!);
          setLastActionType(type);
          break;
        }
        case CHAT_ACTIONS.SET_ALERT_CATEGORY: {
          setAlertCategory(payload?.item!);
          setLastActionType(type);
          break;
        }
        case CHAT_ACTIONS.SET_ALERT_PERIOD: {
          setAlertPeriod(payload?.item!);
          setLastActionType(type);
          break;
        }
        case CHAT_ACTIONS.SET_ALERT_EMAIL: {
          const error = validateEmail(payload?.item!);
          if (payload?.item && !error?.length) {
            // setAlertEmail(payload.item);
            clearFilters();
          } else {
            setError(error);
            isValidPush = false;
          }
          break;
        }
        case CHAT_ACTIONS.SEND_LOCATIONS: {
          if (category) {
            const data = getSearchJobsData(category, searchLocations[0]?.split(',')[0]);
            const apiResponse = await apiInstance.searchJobs(data);
            additionalCondition = !!apiResponse.data?.requisitions.length;

            if (apiResponse.data?.requisitions.length) {
              setOfferJobs(apiResponse.data?.requisitions);
            }

            setLastActionType(type);
            setCategory(null);
          }
          break;
        }
        case CHAT_ACTIONS.INTERESTED_IN: {
          const job = getItemById(offerJobs, payload?.item!);
          setPrefferedJob(job!);
          setLastActionType(type);
          break;
        }
        case CHAT_ACTIONS.GET_USER_NAME: {
          setUser({ name: payload?.item! });
          setLastActionType(type);
          break;
        }
        case CHAT_ACTIONS.GET_USER_EMAIL: {
          const error = validateEmailOrPhone(payload?.item!);
          if (payload?.item && !error?.length) {
            setUser({ email: payload?.item! });
            clearFilters();
            setLastActionType(type);
          } else {
            setError(error);
            isValidPush = false;
          }

          break;
        }
        case CHAT_ACTIONS.GET_USER_AGE: {
          setUser({ age: payload?.item! });
          setLastActionType(type);
          break;
        }
        case CHAT_ACTIONS.APPLY_NAME: {
          setApplyUser({ name: payload?.item! });
          setLastActionType(type);
          break;
        }
        case CHAT_ACTIONS.APPLY_EMAIL: {
          const error = validateEmail(payload?.item!);
          if (payload?.item && !error?.length) {
            setApplyUser({ ...applyUser, email: payload?.item! });
            setLastActionType(type);
          } else {
            setError(error);
            isValidPush = false;
          }
          break;
        }
        case CHAT_ACTIONS.APPLY_AGE: {
          setApplyUser({ ...applyUser, age: payload?.item! });
          setLastActionType(type);
          break;
        }
        case CHAT_ACTIONS.SET_WORK_PERMIT: {
          const isPermitWork = payload?.item === 'Yes';
          setApplyUser({ ...applyUser, isPermitWork });
          additionalCondition = isPermitWork;
          setLastActionType(type);
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
            setLastActionType(type);
          }
          break;
        }
        case CHAT_ACTIONS.APPLY_ETHNIC: {
          if (applyUser?.name) {
            const createCandidateData = getCreateCandidateData({ applyUser, prefferedJob });
            apiInstance.createCandidate(createCandidateData);
          }
          break;
        }
        case CHAT_ACTIONS.CHANGE_LANG: {
          if (payload?.item) {
            i18n.changeLanguage(payload.item.toLowerCase());
          }
          break;
        }
        case CHAT_ACTIONS.REFINE_SEARCH: {
          clearFilters();
          break;
        }
        default: {
          setLastActionType(type);
        }
      }

      //  Push message (optional)

      //  Show response
      
      if (response.newMessages.length && isValidPush) {
        const updatedMessages = getUpdatedMessages({
          action,
          messages,
          responseAction: response,
          sendMessage: addMessage,
          additionalCondition,
        });

        updatedMessages?.length && setMessages(updatedMessages);
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
      setNextMessages(messagesSnapshots);
    }
  };

  const addMessage = (message: ILocalMessage) => {
    if (message.content.text) {
      const serverMessage = {
        channelName: ChannelName.SMS,
        candidateId: 49530690,
        contextId: null,
        msg: message.content.text,
        images: [],
        localId: `${message.localId}`,
      };

      sendMessage(serverMessage);
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
      const response = getChatActionResponse(type);
      setMessages([...response.newMessages, ...updatedMessages]);
    } else {
      const chatType = getNextActionType(lastActionType);
      chatType && triggerAction({ type: chatType });
      setMessages(updatedMessages);
    }
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
