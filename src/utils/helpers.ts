import { CHAT_TYPE_MESSAGES, IMessage, USER_INPUTS } from "redux/slices/types";
import { colors } from "./colors";

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

export const getChatResponseOnMessage = (userInput: string): IMessage[] => {
  const createdAt = `${new Date()}`;

  switch (userInput.toLowerCase()) {
    case USER_INPUTS.ASK_QUESTION: {
      const content = {
        text: "Output of existing most popular questions",
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