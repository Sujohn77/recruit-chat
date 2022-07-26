import React, { createContext, useContext, useEffect, useState } from "react";

import { CHAT_TYPE_MESSAGES, IContent, ILocalMessage } from "utils/types";
import { IMessage } from "services/types";
import { CHAT_OPTIONS } from "screens/intro";
import { defaultChatHistory } from "utils/constants";
import {
  chatMessangerDefaultState,
  generateLocalId,
  getChatResponseOnMessage,
} from "utils/helpers";
import { IAddMessageProps, IChatMessangerContext } from "./types";

type PropsType = {
  children: React.ReactNode;
};

const ChatContext = createContext<IChatMessangerContext>(
  chatMessangerDefaultState
);

const ChatProvider = ({ children }: PropsType) => {
  const [messages, setMessages] = useState<ILocalMessage[]>([]);
  const [chatOption, setChatOption] = useState<CHAT_OPTIONS | null>(null);
  const [serverMessages, setServerMessages] = useState<IMessage[]>([]);
  const [ownerId, setOwnerId] = useState<string | null>(null);
  // const [status, setStatus] = useState<Status | null>(null);

  useEffect(() => {
    if (chatOption !== null) {
      const lastMessage =
        messages.length && messages[messages.length - 1]?.content.text;
      if (lastMessage) {
        setTimeout(() => {
          const messages = getChatResponseOnMessage(lastMessage);
          pushMessage(messages);
          // setStatus(Status.DONE);
        }, 500);
      }
    }
  }, [chatOption]);

  useEffect(() => {
    if (messages.length) {
      const lastMessage = messages[messages.length - 1];
      const initialMessages = chatOption
        ? defaultChatHistory[chatOption].initialMessages
        : 0;
      const isUserMessage = !lastMessage.isReceived;
      if (
        isUserMessage &&
        initialMessages &&
        lastMessage.content.subType !== CHAT_TYPE_MESSAGES.BUTTON &&
        messages?.length > initialMessages.length
      ) {
        const lastMessageText = messages[messages.length - 1].content.text;

        if (lastMessageText) {
          const updatedMessages = getChatResponseOnMessage(lastMessageText);
          pushMessage(updatedMessages);
        }
      }
    }
  }, [messages]);

  const addMessage = ({
    text,
    subType = CHAT_TYPE_MESSAGES.TEXT,
  }: IAddMessageProps) => {
    const createdAt = `${new Date()}`;
    const content: IContent = {
      subType,
      text,
    };

    setMessages([
      ...messages,
      {
        createdAt,
        content,
        messageId: messages.length + 1,
      },
    ]);
  };

  const pushMessage = (chatMessages: ILocalMessage[]) => {
    setMessages([...messages, ...chatMessages]);
  };

  const setOption = (option: CHAT_OPTIONS) => {
    if (option !== null && !messages.length) {
      const chat = defaultChatHistory[option];
      const createdAt = `${new Date()}`;

      const ownerId = `${Math.random() * 500}`;
      const initialMessages = [];
      for (const msg of chat.initialMessages) {
        const content: IContent = {
          subType: CHAT_TYPE_MESSAGES.TEXT,
          text: msg.text || "",
        };
        initialMessages.push({
          content,
          createdAt,
          messageId: generateLocalId(),
          isReceived: !msg.isOwner,
        });
      }
      setMessages([...messages, ...initialMessages]);

      setOwnerId(ownerId);
    }
    setChatOption(option);
  };

  const chooseButtonOption = (optionText: string) => {
    const updatedMessages = messages.filter(
      (msg) =>
        msg.content.subType !== CHAT_TYPE_MESSAGES.BUTTON ||
        (msg.content.text === optionText &&
          msg.content.subType === CHAT_TYPE_MESSAGES.BUTTON)
    );
    updatedMessages[updatedMessages.length - 1].content.subType =
      CHAT_TYPE_MESSAGES.TEXT;

    setMessages(updatedMessages);
  };

  const updateMessages = (serverMessages: IMessage[]) => {
    setServerMessages(serverMessages);
  };

  return (
    <ChatContext.Provider
      value={{
        messages,
        addMessage,
        pushMessage,
        chatOption,
        setOption,
        updateMessages,
        ownerId,
        serverMessages,
        chooseButtonOption,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

const useChatMessanger = () => useContext(ChatContext);

export { ChatProvider, useChatMessanger };
