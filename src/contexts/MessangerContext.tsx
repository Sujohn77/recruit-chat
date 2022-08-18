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
import { ContactType, IMessage, ISnapshot } from 'services/types';
import { ChannelName, getChatActionResponse, languages } from 'utils/constants';
import {
  chatMessangerDefaultState,
  replaceItemsWithType,
  generateLocalId,
  getItemById,
  getJobMatches,
  getMessageBySubtype,
  getParsedMessage,
  getServerParsedMessages,
  getUpdatedMessages,
  validateEmail,
  validateEmailOrPhone,
  getActionTypeByOption,
  getNextActionType,
  getChatResponseOnMessage,
  getSearchJobsData,
} from 'utils/helpers';
import {
  IAddMessageProps,
  IChatMessangerContext,
  IJobPosition,
  IPortionMessages,
  ITriggerActionProps,
} from './types';
import { useCategories } from 'services/hooks';
import { getParsedSnapshots } from 'services/utils';
import i18n from 'services/localization';
import { apiInstance } from 'services';

type PropsType = {
  children: React.ReactNode;
};

const ChatContext = createContext<IChatMessangerContext>(
  chatMessangerDefaultState
);
interface IUser {
  name?: string;
  email?: string;
  age?: string;
  isPermitWork?: boolean;
  wishSalary?: number;
  salaryCurrency?: string;
}
const noMatchReponse = getChatActionResponse(CHAT_ACTIONS.REFINE_SEARCH);
const noPermitWorkReponse = getChatActionResponse(CHAT_ACTIONS.NO_PERMIT_WORK);

const ChatProvider = ({ children }: PropsType) => {
  // State
  const [category, setCategory] = useState<string | null>(null);
  const [locations, setLocations] = useState<string[]>([]);
  const [offerJobs, setOfferJobs] = useState<IRequisition[]>([]);
  const [viewJob, setViewJob] = useState<IRequisition | null>(null);
  const [prefferedJob, setPrefferedJob] = useState<IRequisition | null>(null);
  const [alertCategory, setAlertCategory] = useState<string | null>(null);
  const [user, setUser] = useState<IUser | null>(null);
  const [alertPeriod, setAlertPeriod] = useState<string | null>(null);
  const [alertEmail, setAlertEmail] = useState<string | null>(null);
  const [language, setLanguage] = useState(languages[0]);
  const [applyUser, setApplyUser] = useState<IUser | null>(null);

  const [messages, setMessages] = useState<ILocalMessage[]>([]);
  const [serverMessages, setServerMessages] = useState<IMessage[]>([]);
  const [nextMessages, setNextMessages] = useState<IPortionMessages[]>([]);
  const [lastActionType, setLastActionType] = useState<CHAT_ACTIONS | null>(
    null
  );
  const [initialAction, setInitialAction] = useState<ITriggerActionProps>();

  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setInitialized] = useState(false);
  const categories = useCategories();

  // console.log('DEFAULT_LANG: ', language);
  // console.log('ALERT PERIOD: ', alertPeriod);
  // console.log('ALERT EMAIL: ', alertEmail);

  // Effects
  useEffect(() => {
    if (nextMessages.length) {
      const processedSnapshots: IMessage[] = getParsedSnapshots({
        serverMessages,
        nextMessages,
      });

      updateMessages(processedSnapshots);
      setServerMessages(processedSnapshots);
      // setLastActionType(null);
      !isInitialized && setInitialized(true);
    }
  }, [nextMessages, setServerMessages, serverMessages, messages.length]);

  useEffect(() => {
    initialAction && triggerAction(initialAction);
  }, [isInitialized]);

  // Callbacks
  const triggerAction = useCallback(
    async (action: ITriggerActionProps) => {
      const { type, payload } = action;

      if (action.type === lastActionType || !isInitialized) {
        !isInitialized && setInitialAction(action);
        return null;
      }

      const isAlertLastType =
        type === CHAT_ACTIONS.SET_ALERT_EMAIL && alertPeriod;
      const param = isAlertLastType ? alertPeriod : payload?.item;

      let response = getChatActionResponse(type, param!);
      let isValidPush = true;

      switch (type) {
        case CHAT_ACTIONS.SET_CATEGORY: {
          setCategory(payload?.item!);
          break;
        }
        case CHAT_ACTIONS.SET_LOCATIONS: {
          setLocations(payload?.items!);
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
            setAlertEmail(payload.item);
            clearFilters();
          } else {
            setError(error);
            isValidPush = false;
          }
          break;
        }
        case CHAT_ACTIONS.SEND_LOCATIONS: {
          if (category) {
            const data = getSearchJobsData(category, locations);
            const apiResponse = await apiInstance.searchJobs(data);
            response.messages = apiResponse.data?.requisitions.length
              ? response.messages
              : noMatchReponse.messages;
            if (apiResponse.data?.requisitions.length) {
              setOfferJobs(apiResponse.data?.requisitions);
            }

            // const jobs = getJobMatches({ category, locations });

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
          response.messages = isPermitWork
            ? response.messages
            : noPermitWorkReponse.messages;
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
            const createCandidateData = {
              firstName: applyUser.name.split('')[0],
              lastName: applyUser.name.split('')[1],
              profile: {
                currentJobTitle: prefferedJob?.title!,
                currentEmployer: '',
              },
              typeId: '',
              contactMethods: [
                {
                  address: applyUser.email!,
                  isPrimary: true,
                  location: 'Home',
                  type: ContactType.EMAIL,
                },
              ],
            };
            apiInstance.createCandidate(createCandidateData);
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

      // isValidEmailOrText(type, payload?.item!) && setLastActionType(type);

      if (response.messages.length && isValidPush) {
        const updatedMessages = getUpdatedMessages({
          action,
          messages,
          responseAction: response,
        });
        updatedMessages?.length && setMessages(updatedMessages);
      }
    },
    [messages, locations.length, lastActionType, user]
  );

  const clearFilters = () => {
    setCategory(null);
    setLastActionType(null);
    setAlertCategory(null);
    setLocations([]);
  };

  const pushMessages = useCallback(
    (chatMessages: ILocalMessage[]) => {
      setMessages([...chatMessages, ...messages]);
    },
    [messages, setMessages]
  );

  const setSnapshotMessages = (messagesSnapshots: ISnapshot<IMessage>[]) => {
    !nextMessages.length && setNextMessages(messagesSnapshots);
  };
  // TODO: refator
  const addMessage = ({
    text,
    subType = MessageType.TEXT,
    isChatMessage = false,
  }: IAddMessageProps) => {
    const localId = generateLocalId();
    const message = getParsedMessage({ text, subType, localId, isChatMessage });
    // TODO: fix after backend is ready
    if (!isChatMessage) {
      const updatedMessages = getChatResponseOnMessage(text);
      const actionType = updatedMessages[0].content.subType;
      actionType && triggerAction({ type: actionType as any });
      setMessages([...updatedMessages, message, ...messages]);
    } else {
      setMessages([message, ...messages]);
    }

    const serverMessage = {
      channelName: ChannelName.SMS,
      candidateId: 49530690,
      contextId: null,
      msg: text,
      images: [],
      localId,
    };
    // ---------------------------------

    // sendMessage(serverMessage);=
  };

  const changeLang = (lang: string) => {
    const text = getMessageBySubtype({
      subType: CHAT_ACTIONS.CHANGE_LANG,
      value: lang,
    });
    text && addMessage({ text, isChatMessage: true });
    setLanguage(lang);
    i18n.changeLanguage(lang.toLowerCase());
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
      setMessages([...response.messages, ...updatedMessages]);
    } else {
      const chatType = getNextActionType(lastActionType);
      chatType && triggerAction({ type: chatType });
      setMessages(updatedMessages);
    }
    setLastActionType(type);
  };

  const updateMessages = (serverMessages: IMessage[]) => {
    const parsedMessages = getServerParsedMessages(serverMessages);
    const filteredMessages = parsedMessages.filter((msg) => {
      return (
        messages.findIndex((localMsg) => localMsg.localId === msg.localId) ===
        -1
      );
    });

    setMessages([...messages, ...filteredMessages]);
    setNextMessages([]);
  };

  return (
    <ChatContext.Provider
      value={{
        messages,
        addMessage,
        pushMessages,
        setSnapshotMessages,
        chooseButtonOption,
        triggerAction,
        category,
        locations,
        categories,
        setLastActionType,
        lastActionType,
        changeLang,
        offerJobs,
        alertCategory,
        error,
        setError,
        viewJob,
        setViewJob,
        prefferedJob,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

const useChatMessanger = () => useContext(ChatContext);

export { ChatProvider, useChatMessanger };
