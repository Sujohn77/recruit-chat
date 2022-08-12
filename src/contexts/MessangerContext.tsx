import React, {
  createContext,
  useCallback,
  useContext,
  useState,
  useEffect,
} from 'react';

import { MessageType, ILocalMessage, CHAT_ACTIONS } from 'utils/types';
import { IMessage, ISnapshot } from 'services/types';
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
  getChatResponseOnMessage,
  isValidEmailOrText,
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
// const noMatchResponse = [];
const noPermitWorkReponse = getChatActionResponse(CHAT_ACTIONS.NO_PERMIT_WORK);

const ChatProvider = ({ children }: PropsType) => {
  // State
  const [category, setCategory] = useState<string | null>(null);
  const [locations, setLocations] = useState<string[]>([]);
  const [offerJobs, setOfferJobs] = useState<IJobPosition[]>([]);
  const [viewJob, setViewJob] = useState<IJobPosition | null>(null);
  const [prefferedJob, setPrefferedJob] = useState<IJobPosition | null>(null);
  const [alertCategory, setAlertCategory] = useState<string | null>(null);
  const [user, setUser] = useState<IUser | null>(null);
  const [alertPeriod, setAlertPeriod] = useState<string | null>(null);
  const [alertEmail, setAlertEmail] = useState<string | null>(null);
  const [language, setLanguage] = useState(languages[0]);
  const [applyUser, setApplyUser] = useState<IUser | null>(null);

  const [messages, setMessages] = useState<ILocalMessage[]>([]);
  const [serverMessages, setServerMessages] = useState<IMessage[]>([]);
  const [nextMessages, setNextMessages] = useState<IPortionMessages[]>([]);
  const [lastActionType, setLastActionType] = useState<CHAT_ACTIONS>();
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
      setLastActionType(undefined);
      !isInitialized && setInitialized(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nextMessages, setServerMessages, serverMessages, messages.length]);

  useEffect(() => {
    console.log('triggerAction');
    initialAction && triggerAction(initialAction);
  }, [isInitialized]);

  // Callbacks
  const triggerAction = useCallback(
    (action: ITriggerActionProps) => {
      const { type, payload } = action;

      if (action.type === lastActionType || !isInitialized) {
        !isInitialized && setInitialAction(action);
        return null;
      }

      let response = getChatActionResponse(type, payload?.item!);
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
          break;
        }
        case CHAT_ACTIONS.SET_ALERT_PERIOD: {
          setAlertPeriod(payload?.item!);
          break;
        }
        case CHAT_ACTIONS.SET_ALERT_EMAIL: {
          const error = validateEmail(payload?.item!);
          if (payload?.item && !error?.length) {
            setAlertEmail(payload.item);
            setLastActionType(undefined);
          } else {
            setError(error);
          }
          break;
        }
        case CHAT_ACTIONS.SEND_LOCATIONS: {
          if (category) {
            const jobs = getJobMatches({ category, locations });
            response.messages = jobs.length ? response.messages : [];
            setOfferJobs(jobs);
            clearFilters();
          }
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
        case CHAT_ACTIONS.GET_USER_EMAIL: {
          const error = validateEmail(payload?.item!);
          if (payload?.item && !error?.length) {
            setUser({ email: payload?.item! });
            setLastActionType(undefined);
          } else {
            setError(error);
          }

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
        case CHAT_ACTIONS.APPLY_EMAIL: {
          const error = validateEmail(payload?.item!);
          if (payload?.item && !error?.length) {
            setApplyUser({ email: payload?.item! });
            setLastActionType(undefined);
          } else {
            setError(error);
          }

          break;
        }
        case CHAT_ACTIONS.APPLY_AGE: {
          setApplyUser({ age: payload?.item! });

          break;
        }

        case CHAT_ACTIONS.SET_WORK_PERMIT: {
          const isPermitWork = payload?.item === 'Yes';
          setUser({ isPermitWork });
          response.messages = isPermitWork
            ? response.messages
            : noPermitWorkReponse.messages;
          break;
        }

        case CHAT_ACTIONS.SET_SALARY: {
          if (payload?.item) {
            const salaryInfo = payload?.item.split(' ');
            setUser({
              wishSalary: Number(salaryInfo[0]),
              salaryCurrency: salaryInfo[1],
            });
          }

          break;
        }

        case CHAT_ACTIONS.REFINE_SEARCH: {
          clearFilters();
          break;
        }
        default:
          break;
      }

      const updatedMessages = getUpdatedMessages({
        action,
        messages,
        responseAction: response,
      });

      isValidEmailOrText(type, payload?.item!) && setLastActionType(type);
      updatedMessages?.length && setMessages(updatedMessages);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [messages.length, locations.length, lastActionType, user]
  );

  const clearFilters = () => {
    setLocations([]);
    setCategory(null);
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

    // sendMessage(serverMessage);
  };

  const changeLang = (lang: string) => {
    const text = getMessageBySubtype({
      subType: CHAT_ACTIONS.CHANGE_LANG,
      value: lang,
    });
    text && addMessage({ text, isChatMessage: true });
    setLanguage(lang);
    i18n.changeLanguage(lang.toLowerCase());
    // chrome.runtime.sendMessage({
    //   messageType: ChromeMessageTypes.GlobalChangeLanguage,
    //   msg: language,
    // });
  };

  const chooseButtonOption = (excludeItem: string) => {
    const updatedMessages = replaceItemsWithType({
      type: MessageType.BUTTON,
      messages,
      excludeItem,
    });

    const lastMessageText = updatedMessages[0].content.text;
    if (lastMessageText) {
      const newMessages = getChatResponseOnMessage(lastMessageText);
      setMessages([...newMessages, ...updatedMessages]);
    }
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