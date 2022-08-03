import React, {
  createContext,
  useCallback,
  useContext,
  useState,
  useEffect,
} from "react";

import { MessageType, ILocalMessage, CHAT_ACTIONS } from "utils/types";
import { IMessage, ISnapshot } from "services/types";
import { CHAT_OPTIONS } from "screens/intro";
import { CHAT_ACTIONS_RESPONSE } from "utils/constants";
import {
  chatMessangerDefaultState,
  generateLocalId,
  getChatResponseOnMessage,
  getParsedMessage,
  getServerParsedMessages,
  ResponseMessageTypes,
} from "utils/helpers";
import {
  IAddMessageProps,
  IChatMessangerContext,
  IPortionMessages,
  ITriggerActionProps,
} from "./types";
import { useCategories } from "services/hooks";
import { getParsedSnapshots } from "services/utils";

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
  const [messages, setMessages] = useState<ILocalMessage[]>([]);
  const [serverMessages, setServerMessages] = useState<IMessage[]>([]);
  const [chatOption, setChatOption] = useState<CHAT_OPTIONS | null>(null);
  const [nextMessages, setNextMessages] = useState<IPortionMessages[]>([]);
  const [lastActionType, setLastActionType] = useState<CHAT_ACTIONS>();
  const categories = useCategories();

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
  const triggerAction = useCallback(
    ({ type, payload }: ITriggerActionProps) => {
      let response = CHAT_ACTIONS_RESPONSE[type] || { messages: [] };

      if (!payload?.item) {
        response.messages.length && pushMessages(response.messages);
      }

      switch (type) {
        case CHAT_ACTIONS.SET_CATEGORY: {
          addMessage({ text: payload?.item! });
          payload?.item && setCategory(payload.item);
          break;
        }
        case CHAT_ACTIONS.SET_LOCATIONS: {
          payload?.items && setLocations(payload.items);
          break;
        }
        case CHAT_ACTIONS.SEND_LOCATIONS: {
          setLocations([]);
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
          response.replaceLatest && popMessage();
          pushMessages([...response.messages]);

          break;
        }

        default:
          break;
      }
    },
    [messages]
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
  }: IAddMessageProps) => {
    const localId = generateLocalId();
    const message = getParsedMessage({ text, subType, localId });
    // TODO: fix after backend is ready
    const updatedMessages = getChatResponseOnMessage(text);
    const actionType = updatedMessages[0].content.subType;
    actionType && triggerAction({ type: actionType as any });
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
    setMessages([...updatedMessages, message, ...messages]);
  };

  const setOption = (option: CHAT_OPTIONS) => {
    setChatOption(option);
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

  const popMessage = () => {
    const updatedMessages = messages;
    updatedMessages.shift();
    setMessages(updatedMessages);
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
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

const useChatMessanger = () => useContext(ChatContext);

export { ChatProvider, useChatMessanger };
