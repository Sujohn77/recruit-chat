import React, { createContext, useCallback, useContext, useState } from "react";

import {
  MessageType,
  IContent,
  ILocalMessage,
  CHAT_ACTIONS,
} from "utils/types";
import { IMessage } from "services/types";
import { CHAT_OPTIONS } from "screens/intro";
import { defaultChatHistory } from "utils/constants";
import {
  chatMessangerDefaultState,
  generateLocalId,
  getChatResponseOnMessage,
  getParsedMessage,
  getServerParsedMessages,
} from "utils/helpers";
import {
  IAddMessageProps,
  IChatMessangerContext,
  IResponseAction,
  ITriggerActionProps,
} from "./types";
import { mockData } from "components/Chat/mockData";
import { useEffect } from "react";

type PropsType = {
  children: React.ReactNode;
};

const ChatContext = createContext<IChatMessangerContext>(
  chatMessangerDefaultState
);

export const initialChatMessage = {
  _id: generateLocalId(),
  localId: generateLocalId(),
  content: {
    subType: MessageType.INITIAL_MESSAGE,
    text: mockData.initialMessage,
  },
  dateCreated: { seconds: new Date().getSeconds() },
  isOwn: true,
};

const CHAT_ACTIONS_RESPONSE: IResponseAction = {
  [CHAT_ACTIONS.SET_CATEGORY]: {
    replaceLatest: false,
    messages: [
      {
        localId: generateLocalId(),
        _id: null,
        content: {
          subType: MessageType.TEXT,
          text: "bot message Where do you want to work? This can be your current location or a list of preferred locations.",
        },
        isOwn: true,
      },
    ],
  },
  [CHAT_ACTIONS.SUCCESS_UPLOAD_CV]: {
    messages: [],
  },
};

export enum ServerMessageType {
  Text = "text",
  Transcript = "transcript_sent",
  Video = "video_uploaded",
  ChatCreated = "chat_created",
  Document = "document_uploaded",
  File = "resume_uploaded",
  UnreadMessages = "unread_messages",
  Date = "date",
}

const ChatProvider = ({ children }: PropsType) => {
  const [category, setCategory] = useState<string | null>(null);
  const [locations, setLocations] = useState<string[]>([]);
  const [messages, setMessages] = useState<ILocalMessage[]>([]);
  const [portionMessages, setPortionMessages] = useState<ILocalMessage[]>([]);
  const [chatOption, setChatOption] = useState<CHAT_OPTIONS | null>(null);
  const [ownerId, setOwnerId] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  useEffect(() => {
    if (portionMessages.length) {
      setMessages([...portionMessages, ...messages]);
      setPortionMessages([]);
    }
  }, [portionMessages, messages]);

  const pushMessages = useCallback(
    (chatMessages: ILocalMessage[]) => {
      setMessages([...messages, ...chatMessages]);
    },
    [messages]
  );

  const addMessage = ({
    text,
    subType = MessageType.TEXT,
  }: IAddMessageProps) => {
    const message = getParsedMessage({ text, subType });

    const initialMessages = chatOption
      ? defaultChatHistory[chatOption].initialMessages
      : 0;

    if (
      initialMessages &&
      subType !== MessageType.BUTTON &&
      messages?.length > initialMessages.length
    ) {
      if (text) {
        const updatedMessages = getChatResponseOnMessage(text);
        pushMessages([message, ...updatedMessages]);
      }
    } else {
      pushMessages([message]);
    }
  };

  // useEffect(() => {
  //   if (chatOption) {
  //     const updatedMessages: ILocalMessage[] = [...initialMessages];
  //     const chat = defaultChatHistory[chatOption];
  //     for (const msg of chat.initialMessages) {
  //       const content: IContent = {
  //         subType: MessageType.TEXT,
  //         text: msg.text || "",
  //       };
  //       updatedMessages.push({
  //         content,
  //         dateCreated: { seconds: new Date().getSeconds() },
  //         localId: generateLocalId(),
  //         _id: null,
  //         isOwn: !msg.isOwner,
  //       });
  //     }
  //     setMessages(updatedMessages);

  //     // TODO: fix after discussing with client
  //     const lastMessage =
  //       initialMessages[initialMessages.length - 1].content.text;
  //     setTimeout(() => {
  //       if (lastMessage) {
  //         const messages = getChatResponseOnMessage(lastMessage);
  //         pushMessages([...updatedMessages, ...messages]);
  //       }
  //     }, 500);
  //   }
  // }, []);

  const setOption = (option: CHAT_OPTIONS) => {
    if (option !== null) {
      const ownerId = `${Math.random() * 500}`;
      const updatedMessages: ILocalMessage[] = [];
      const chat = defaultChatHistory[option];
      // TODO: refactor
      for (const msg of chat.initialMessages) {
        const content: IContent = {
          subType: MessageType.TEXT,
          text: msg.text || "",
        };
        updatedMessages.push({
          content,
          dateCreated: { seconds: new Date().getSeconds() },
          localId: generateLocalId(),
          _id: null,
          isOwn: !msg.isOwner,
        });
      }
      setMessages(updatedMessages);

      // TODO: fix after discussing with client
      const lastMessage =
        updatedMessages[updatedMessages.length - 1].content.text;
      setTimeout(() => {
        if (lastMessage) {
          const messages = getChatResponseOnMessage(lastMessage);
          pushMessages([...updatedMessages, ...messages]);
        }
      }, 500);

      setOwnerId(ownerId);
    }

    setChatOption(option);
  };

  const chooseButtonOption = (optionText: string) => {
    const updatedMessages = messages.filter(
      (msg) =>
        msg.content.subType !== MessageType.BUTTON ||
        (msg.content.text === optionText &&
          msg.content.subType === MessageType.BUTTON)
    );
    updatedMessages[updatedMessages.length - 1].content.subType =
      MessageType.TEXT;
    const lastMessageText =
      updatedMessages[updatedMessages.length - 1].content.text;

    if (lastMessageText) {
      const newMessages = getChatResponseOnMessage(lastMessageText);
      setMessages([...updatedMessages, ...newMessages]);
    } else {
      setMessages(updatedMessages);
    }
  };

  const triggerAction = ({ type, payload }: ITriggerActionProps) => {
    let response = CHAT_ACTIONS_RESPONSE[type];

    if (response) {
      response.replaceLatest && popMessage();

      if (payload.item) {
        const message = getParsedMessage({
          text: payload.item,
          subType: MessageType.TEXT,
        });
        pushMessages([message, ...response.messages]);
      } else {
        pushMessages(response.messages);
      }
    }

    switch (type) {
      case CHAT_ACTIONS.SET_CATEGORY: {
        payload.item && setCategory(payload.item);
        break;
      }
      case CHAT_ACTIONS.SET_LOCATIONS: {
        payload.items && setLocations(payload.items);
        break;
      }
      default:
        break;
    }
  };

  const updateMessages = (serverMessages: IMessage[]) => {
    const updatedMessages = getServerParsedMessages(serverMessages);
    setPortionMessages(updatedMessages);
    isInitialized && setIsInitialized(true);
  };

  const popMessage = () => {
    const updatedMessages = messages;
    updatedMessages.pop();
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
        updateMessages,
        ownerId,
        popMessage,
        chooseButtonOption,
        triggerAction,
        category,
        locations,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

const useChatMessanger = () => useContext(ChatContext);

export { ChatProvider, useChatMessanger };
