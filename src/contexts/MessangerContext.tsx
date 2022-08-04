import React, {
  createContext,
  useCallback,
  useContext,
  useState,
  useEffect,
} from 'react';

import { MessageType, ILocalMessage, CHAT_ACTIONS } from 'utils/types';
import { IMessage, ISnapshot } from 'services/types';
import { CHAT_OPTIONS } from 'screens/intro';
import { CHAT_ACTIONS_RESPONSE, languages } from 'utils/constants';
import {
  chatMessangerDefaultState,
  generateLocalId,
  getChatResponseOnMessage,
  getJobMatches,
  getMessageBySubtype,
  getParsedMessage,
  getResponseMessages,
  getServerParsedMessages,
  ResponseMessageTypes,
} from 'utils/helpers';
import {
  IAddMessageProps,
  IChatMessangerContext,
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

const ChatProvider = ({ children }: PropsType) => {
  // State
  const [category, setCategory] = useState<string | null>(null);
  const [locations, setLocations] = useState<string[]>([]);
  const [offerJobs, setOfferJobs] = useState<string[]>([]);
  // const [alertCategory, setAlertCategory] = useState<string | null>(null);
  const [messages, setMessages] = useState<ILocalMessage[]>([]);
  const [serverMessages, setServerMessages] = useState<IMessage[]>([]);
  const [chatOption, setChatOption] = useState<CHAT_OPTIONS | null>(null);
  const [nextMessages, setNextMessages] = useState<IPortionMessages[]>([]);
  const [lastActionType, setLastActionType] = useState<CHAT_ACTIONS>();
  const [language, setLanguage] = useState(languages[0]);
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
    }
  }, [nextMessages]);

  // Callbacks
  // TODO: refactor
  const triggerAction = useCallback(
    ({ type, payload }: ITriggerActionProps) => {
      let response = CHAT_ACTIONS_RESPONSE[type] || { messages: [] };

      if (!payload?.item) {
        response.messages.length && pushMessages(response.messages);
        setLastActionType(type);
      }

      switch (type) {
        case CHAT_ACTIONS.SET_CATEGORY: {
          addMessage({ text: payload?.item!, isCategory: true });
          payload?.item && setCategory(payload.item);
          break;
        }
        case CHAT_ACTIONS.SET_LOCATIONS: {
          if (payload?.items) {
            setLocations(payload.items);
          }

          break;
        }
        case CHAT_ACTIONS.SEND_LOCATIONS: {
          const locationsMessage = getResponseMessages([
            {
              subType: MessageType.TEXT,
              text: locations.join('\r\n'),
              isOwn: true,
            },
          ]);
          const jobs = getJobMatches({ category: category!, locations });
          if (!jobs?.length) {
            pushMessages([
              ...getChatResponseOnMessage(''),
              ...locationsMessage,
            ]);
          } else {
            const messages =
              CHAT_ACTIONS_RESPONSE[CHAT_ACTIONS.FETCH_JOBS]?.messages;
            setOfferJobs(jobs);
            messages && pushMessages([...messages, ...locationsMessage]);
          }
          setLocations([]);
          setCategory(null);
          break;
        }
        case CHAT_ACTIONS.REFINE_SEARCH: {
          setLocations([]);
          setCategory(null);
          break;
        }
        case CHAT_ACTIONS.FIND_JOB:
        case CHAT_ACTIONS.ASK_QUESTION: {
          addMessage({
            text: payload?.item!,
          });
          break;
        }
        case CHAT_ACTIONS.SAVE_TRANSCRIPT:
        case CHAT_ACTIONS.SUCCESS_UPLOAD_CV: {
          response.replaceLatest && popMessage();
          if (payload?.item) {
            const message = getParsedMessage({
              text: payload?.item!,
              subType: ResponseMessageTypes[type],
            });
            pushMessages([...response.messages, message]);
          }

          break;
        }
        case CHAT_ACTIONS.SEND_EMAIL: {
          const messages = popMessage(MessageType.EMAIL_FORM);
          setMessages([...response.messages, ...messages]);

          break;
        }

        default:
          break;
      }
    },
    [messages, locations.length]
  );

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
    isCategory = false,
    isChatMessage = false,
  }: IAddMessageProps) => {
    const localId = generateLocalId();
    const message = getParsedMessage({ text, subType, localId, isChatMessage });
    isCategory && setCategory(text);
    // TODO: fix after backend is ready
    if (!isChatMessage) {
      const updatedMessages = getChatResponseOnMessage(text, isCategory);
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

  const setOption = (option: CHAT_OPTIONS) => {
    setChatOption(option);
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
    const updatedMessages = !type
      ? messages
      : messages.filter((msg) => msg.content.subType !== type);
    console.log(updatedMessages);
    !type && updatedMessages.shift();
    console.log(updatedMessages);
    setMessages(updatedMessages);
    return updatedMessages;
  };

  return (
    <ChatContext.Provider
      value={{
        messages,
        addMessage,
        pushMessages,
        chatOption,
        setOption,
        setSnapshotMessages,
        popMessage,
        chooseButtonOption,
        triggerAction,
        category,
        locations,
        categories,
        setLastActionType,
        lastActionType,
        changeLang,
        offerJobs,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

const useChatMessanger = () => useContext(ChatContext);

export { ChatProvider, useChatMessanger };
