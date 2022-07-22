import { CHAT_TYPE_MESSAGES, ILocalMessage, USER_INPUTS } from "redux/slices/types";
import { colors } from "./colors";
import moment from 'moment';
import { IApiMessage, IMessage, IUserSelf, MessageType } from "saga/types";
// interface IGetMessageColorProps {
//     isOwn?: boolean;
// }

interface IMessageProps {
    color: string;
    backColor: string
    isOwn: boolean;
}

export const getMessageColorProps = (isOwn?: boolean):IMessageProps  => {
  if (isOwn) {
    return {
      color: colors.white,
      backColor: colors.boulder,
      isOwn
    };
  }
  return {
    color: colors.dustyGray,
    backColor: colors.alto,
    isOwn: !!isOwn
  };
};

export const getChatResponseOnMessage = (userInput: string): ILocalMessage[] => {
  const createdAt = `${new Date()}`;

  switch (userInput.toLowerCase()) {
    case USER_INPUTS.ASK_QUESTION: {
      const content = {
        text: "Output of existing most popular questions",
        subType: CHAT_TYPE_MESSAGES.TEXT,
        subTypeId: 1,
        // typeId: 1,
        // contextId: "1",
        // url: ''
      };
      return [
        {
          createdAt,
          content,
          messageId: Math.random() * 5000,
          isReceived: true,
        },
      ];
    }
    case USER_INPUTS.FIND_JOB: {
      const content = {
        text: "There are our job propositions",
        subType: CHAT_TYPE_MESSAGES.TEXT,
        subTypeId: 1,
      };
      return [
        {
          createdAt,
          content,
          messageId: Math.random() * 5000,
          isReceived: true,
        },
        {
          createdAt,
          content: {
            subType: CHAT_TYPE_MESSAGES.BROWSE,
            subTypeId: 2,
          },
          messageId: Math.random() * 5000,
          isReceived: true,
        },
      ];
    }
    default: {
      const content = {
        subType: CHAT_TYPE_MESSAGES.REFINE_SERCH,
        subTypeId: 1,
      };
      return [
        {
          createdAt,
          content,
          messageId: Math.random() * 5000,
          isReceived: true,
        },
      ];
    }
  }
};

export const MessageTypeId: Record<MessageType, number> = {
  /* Default text */
  [MessageType.Text]: 1,

  /* Events */
  [MessageType.Date]: 2,
  [MessageType.UnreadMessages]: 2,
  [MessageType.Transcript]: 2,
  [MessageType.ChatCreated]: 2,

  /* Files */
  [MessageType.Video]: 2,
  [MessageType.Document]: 2,
  [MessageType.File]: 2,
};


export const getLocalMessage = (requestMessage: IApiMessage, sender: IUserSelf): IMessage => {
  const currentUnixTime = moment().unix();

  return {
    chatItemId: -1,
    localId: requestMessage.localId,
    content: {
      typeId: MessageTypeId.text,
      subTypeId: null,
      contextId: requestMessage.contextId || null,
      text: requestMessage.msg,
      subType: MessageType.Text,
      url: null,
    },
    dateCreated: {
      seconds: currentUnixTime,
    },
    dateModified: {
      seconds: currentUnixTime,
    },
    isEdited: false,
    isReceived: false,
    sender,
    searchValue: '',
  };
};

