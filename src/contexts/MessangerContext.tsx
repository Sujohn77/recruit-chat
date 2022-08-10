import React, {
  createContext,
  useCallback,
  useContext,
  useState,
  useEffect,
} from 'react';

import { MessageType, ILocalMessage, CHAT_ACTIONS } from 'utils/types';
import { IMessage, ISnapshot } from 'services/types';
import { getChatActionResponse, languages } from 'utils/constants';
import {
  chatMessangerDefaultState,
  generateLocalId,
  getChatResponseOnMessage,
  getItemById,
  getJobMatches,
  getMessageBySubtype,
  getParsedMessage,
  getServerParsedMessages,
  validateEmail,
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

  console.log(alertPeriod);
  console.log(alertEmail);

  const [messages, setMessages] = useState<ILocalMessage[]>([]);
  const [serverMessages, setServerMessages] = useState<IMessage[]>([]);
  const [nextMessages, setNextMessages] = useState<IPortionMessages[]>([]);
  const [lastActionType, setLastActionType] = useState<CHAT_ACTIONS>();
  const [language, setLanguage] = useState(languages[0]);
  const [error, setError] = useState<string | null>(null);
  const categories = useCategories();

  console.log('DEFAULT_LANG: ', language);

  // Effects
  useEffect(() => {
    if (nextMessages.length) {
      const processedSnapshots: IMessage[] = getParsedSnapshots({
        serverMessages,
        nextMessages,
      });

      updateMessages(processedSnapshots);
      setServerMessages(serverMessages);
      setLastActionType(undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nextMessages, setServerMessages, serverMessages]);

  // Callbacks
  // TODO: refactor
  const triggerAction = useCallback(
    (action: ITriggerActionProps) => {
      const { type, payload } = action;
      const text = payload?.item ? payload.item : payload?.items?.join('\r\n');
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
          const jobs = getJobMatches({
            category: category!,
            locations,
          });
          response.messages = jobs.length ? response.messages : noMatchMessages;

          setOfferJobs(jobs);
          clearFilters();
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

      if (type === lastActionType) {
        return null;
      }

      const isAlertEmail = type === CHAT_ACTIONS.SET_ALERT_EMAIL;
      const isValidPush =
        !isAlertEmail || !validateEmail(payload?.item!).length;

      if (response.messages.length && isValidPush) {
        const updatedMessages = popMessage(response.replaceType);
        if (text && response.isPushMessage) {
          const localMessage = getParsedMessage({ text });
          const updatedMessages = popMessage(response.replaceType);
          setMessages([...response.messages, localMessage, ...updatedMessages]);
        } else {
          setMessages([...response.messages, ...updatedMessages]);
        }
      }
      const updatedMessages = getUpdatedMessages(action, messages);
      setMessages(updatedMessages);
      setLastActionType(type);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [messages, locations.length, lastActionType]
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
    setNextMessages(messagesSnapshots);
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

    // const serverMessage = {
    //   channelName: ChannelName.SMS,
    //   candidateId: 49530690,
    //   contextId: null,
    //   msg: text,
    //   images: [],
    //   localId,
    // };
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
    // chrome.runtime.sendMessage({
    //   messageType: ChromeMessageTypes.GlobalChangeLanguage,
    //   msg: language,
    // });
    i18n.changeLanguage(lang.toLowerCase());
  };

  // TODO: refactor
  const chooseButtonOption = (optionText: string) => {
    const updatedMessages = messages.filter((msg) => {
      const subType = msg.content.subType;
      const text = msg.content.text;
      return (
        subType !== MessageType.BUTTON ||
        (text === optionText && subType === MessageType.BUTTON)
      );
    });
    updatedMessages[0].content.subType = MessageType.TEXT;
    const lastMessageText = updatedMessages[0].content.text;

    if (lastMessageText) {
      const newMessages = getChatResponseOnMessage(lastMessageText);
      setMessages([...newMessages, ...updatedMessages]);
    }
  };
  // TODO: refactor
  const updateMessages = (serverMessages: IMessage[]) => {
    const parsedMessages = getServerParsedMessages(serverMessages);

    const isMessagesWithoutId = messages.some((msg) => !msg._id);
    const updatedMessages = isMessagesWithoutId
      ? messages.map((msg) => {
          if (!msg._id) {
            const updatedMessage = parsedMessages.find(
              (updateMsg) => updateMsg.localId === msg.localId
            );
            return updatedMessage
              ? {
                  ...updatedMessage,
                  content: {
                    ...updatedMessage?.content,
                  },
                }
              : msg;
          }
          return msg;
        })
      : [...messages, ...parsedMessages];

    setMessages(updatedMessages);
    setNextMessages([]);
  };

  const popMessage = (type?: MessageType) => {
    if (!type) {
      return messages;
    }

    const updatedMessages = !type
      ? messages
      : messages.filter((msg) => msg.content.subType !== type);

    !type && updatedMessages.shift();

    return updatedMessages;
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
