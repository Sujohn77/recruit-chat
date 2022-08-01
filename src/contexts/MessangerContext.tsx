import React, { createContext, useCallback, useContext, useState } from "react";

import { MessageType, ILocalMessage, CHAT_ACTIONS } from "utils/types";
import { IMessage, ISnapshot, I_id } from "services/types";
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
import { getProcessedSnapshots } from "firebase/config";
import { sortBy } from "lodash";
import moment from "moment";
import { apiInstance, APP_VERSION } from "services";

type PropsType = {
  children: React.ReactNode;
};

const ChatContext = createContext<IChatMessangerContext>(
  chatMessangerDefaultState
);

export const initialChatMessage = {
  _id: null,
  localId: generateLocalId(),
  content: {
    subType: MessageType.INITIAL_MESSAGE,
    text: mockData.initialMessage,
  },
  dateCreated: { seconds: moment().unix() },
  isOwn: false,
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
        isOwn: false,
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
interface IPortionMessages extends ISnapshot<IMessage> {}

const ChatProvider = ({ children }: PropsType) => {
  const [category, setCategory] = useState<string | null>(null);
  const [locations, setLocations] = useState<string[]>([]);
  const [messages, setMessages] = useState<ILocalMessage[]>([]);

  const [serverMessages, setServerMessages] = useState<IMessage[]>([]);
  const [chatOption, setChatOption] = useState<CHAT_OPTIONS | null>(null);

  const [portionMessages, setPortionMessages] = useState<IPortionMessages[]>(
    []
  );
  const [lastActionType, setLastActionType] = useState<CHAT_ACTIONS | null>(
    null
  );

  const [categories, setCategories] = useState<string[]>([]);

  // TODO: refactor
  useEffect(() => {
    if (portionMessages.length) {
      const processedSnapshots: IMessage[] = sortBy(
        getProcessedSnapshots<I_id, IMessage>(
          serverMessages || [],
          portionMessages,
          "chatItemId",
          [],
          "localId"
        ),
        (message: any) => -message.dateCreated.seconds
      );

      updateMessages(processedSnapshots);
      setServerMessages(serverMessages);
    }
  }, [portionMessages]);

  useEffect(() => {
    const getCategories = async () => {
      const data = {
        pageSize: 20,
        page: 1,
        keyword: "",
        appKey: "",
        codeVersion: APP_VERSION,
      };
      const response = await apiInstance.searchRequisitions(data);
      response.data && setCategories(response.data as any);
    };
    getCategories();
  }, []);

  const setSnapshotMessages = (messagesSnapshots: ISnapshot<IMessage>[]) => {
    setPortionMessages(messagesSnapshots);
  };

  const pushMessages = useCallback(
    (chatMessages: ILocalMessage[]) => {
      chatMessages.findIndex(
        (msg) => msg.content.subType === MessageType.REFINE_SERCH
      ) &&
        triggerAction({
          type: CHAT_ACTIONS.REFINE_SEARCH,
          isServer: true,
        });
      setMessages([...messages, ...chatMessages]);
    },
    [messages]
  );

  const addMessage = ({
    text,
    subType = MessageType.TEXT,
    localId,
  }: IAddMessageProps) => {
    const message = getParsedMessage({ text, subType, localId });

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

  const setOption = (option: CHAT_OPTIONS) => {
    if (option !== null) {
      // const ownerId = `${Math.random() * 500}`;
      // const updatedMessages: ILocalMessage[] = [];
      // const chat = defaultChatHistory[option];
      // TODO: refactor
      // for (const msg of chat.initialMessages) {
      //   const content: IContent = {
      //     subType: MessageType.TEXT,
      //     text: msg.text || "",
      //   };
      //   updatedMessages.push({
      //     content,
      //     dateCreated: { seconds: new Date().getSeconds() },
      //     localId: generateLocalId(),
      //     _id: null,
      //     isOwn: !msg.isOwner,
      //   });
      // }
      // setMessages(updatedMessages);
      // // TODO: delete after backend is ready
      // const lastMessage =
      //   updatedMessages[updatedMessages.length - 1].content.text;
      // setTimeout(() => {
      //   if (lastMessage) {
      //     const messages = getChatResponseOnMessage(lastMessage);
      //     pushMessages([...updatedMessages, ...messages]);
      //   }
      // }, 500);
      // setOwnerId(ownerId);
    }

    setChatOption(option);
  };
  // TODO: refactor
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

  const triggerAction = ({
    type,
    payload,
    isServer = false,
  }: ITriggerActionProps) => {
    let response = CHAT_ACTIONS_RESPONSE[type];

    if (response) {
      response.replaceLatest && popMessage();

      if (payload?.item) {
        const message = getParsedMessage({
          text: payload.item,
          subType: MessageType.TEXT,
        });

        pushMessages([message, ...response.messages]);
      } else if (!isServer) {
        response.messages.length && pushMessages(response.messages);
      }
    }

    switch (type) {
      case CHAT_ACTIONS.SET_CATEGORY: {
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
      default:
        break;
    }
  };

  const updateStateMessages = (messagesIds: number[]) => {
    // setMessagesIds(messagesIds);
  };

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
    setPortionMessages([]);
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
        setSnapshotMessages,
        // ownerId,
        popMessage,
        chooseButtonOption,
        triggerAction,
        category,
        locations,
        updateStateMessages,
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
