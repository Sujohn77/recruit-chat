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
  getChatResponseOnMessage,
  getItemById,
  getJobMatches,
  getMessageBySubtype,
  getParsedMessage,
  getServerParsedMessages,
  getUpdatedMessages,
  validateEmail,
} from 'utils/helpers';
import {
  IAddMessageProps,
  IChatMessangerContext,
  IJobPosition,
  IPortionMessages,
  ITriggerActionProps,
} from './types';
import { sendMessage, useCategories } from 'services/hooks';
import { getParsedSnapshots } from 'services/utils';
import i18n from 'services/localization';

type PropsType = {
  children: React.ReactNode;
};

const ChatContext = createContext<IChatMessangerContext>(
  chatMessangerDefaultState
);
const noMatchMessages = getChatResponseOnMessage('');
const ChatProvider = ({ children }: PropsType) => {
  // State
  const [category, setCategory] = useState<string | null>(null);
  const [locations, setLocations] = useState<string[]>([]);
  const [offerJobs, setOfferJobs] = useState<IJobPosition[]>([]);
  const [viewJob, setViewJob] = useState<IJobPosition | null>(null);
  const [prefferedJob, setPrefferedJob] = useState<IJobPosition | null>(null);
  const [alertCategory, setAlertCategory] = useState<string | null>(null);
  const [alertPeriod, setAlertPeriod] = useState<string | null>(null);
  const [alertEmail, setAlertEmail] = useState<string | null>(null);

  const [messages, setMessages] = useState<ILocalMessage[]>([]);
  const [serverMessages, setServerMessages] = useState<IMessage[]>([]);
  const [nextMessages, setNextMessages] = useState<IPortionMessages[]>([]);
  const [lastActionType, setLastActionType] = useState<CHAT_ACTIONS>();
  const [initialAction, setInitialAction] = useState<ITriggerActionProps>();
  const [language, setLanguage] = useState(languages[0]);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setInitialized] = useState(false);
  const categories = useCategories();

  console.log('DEFAULT_LANG: ', language);
  console.log('ALERT PERIOD: ', alertPeriod);
  console.log('ALERT EMAIL: ', alertEmail);

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

      let response = getChatActionResponse(type);
      switch (type) {
        case CHAT_ACTIONS.SET_CATEGORY: {
          setCategory(payload?.item!);
          break;
        }
        case CHAT_ACTIONS.SET_LOCATIONS: {
          setLocations(payload?.items!);
          setLastActionType(type);
          break;
        }
        case CHAT_ACTIONS.SET_ALERT_CATEGORY: {
          setAlertCategory(payload?.item!);
          setLastActionType(CHAT_ACTIONS.SET_ALERT_PERIOD);
          break;
        }
        case CHAT_ACTIONS.SET_ALERT_PERIOD: {
          setAlertPeriod(payload?.item!);
          setLastActionType(CHAT_ACTIONS.SET_ALERT_EMAIL);
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
            response.messages = jobs.length
              ? response.messages
              : noMatchMessages;
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

      updatedMessages?.length && setMessages(updatedMessages);
      setLastActionType(type);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [messages.length, locations.length, lastActionType]
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

    sendMessage(serverMessage);
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
    setMessages(parsedMessages);
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
