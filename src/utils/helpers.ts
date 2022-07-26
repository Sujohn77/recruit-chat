// generateLocalId
import randomString from 'random-string';
import { CHAT_TYPE_MESSAGES, ILocalMessage, USER_INPUTS } from "./types";
import { colors } from "./colors";
import moment from 'moment';
// import { IApiMessage, IMessage, IUserSelf, MessageType } from "saga/types";
import { IChatMessangerContext } from "components/Context/types";
import { IApiMessage, IMessage, IUserSelf, MessageType } from 'services/types';

// interface IGetMessageColorProps {
//     isOwn?: boolean;
// }

interface IMessageProps {
    color: string;
    backColor: string
    isOwn: boolean;
}

export const generateLocalId = (): string => randomString({ length: 32 });

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
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor",
        subType: CHAT_TYPE_MESSAGES.TEXT,
        subTypeId: 1,
      };
      return [
        {
          createdAt,
          content,
          messageId: generateLocalId(),
          isReceived: true,
        },
        {
          createdAt,
          content: {
            subType: CHAT_TYPE_MESSAGES.BUTTON,
            text: 'Upload CV',
            // subTypeId: 2,
          },
          messageId: generateLocalId(),
        },
        {
          createdAt,
          content: {
            subType: CHAT_TYPE_MESSAGES.BUTTON,
            text: 'Answer questions',
            // subTypeId: 2,
          },
          messageId: generateLocalId(),
        }
        // {
        //   createdAt,
        //   content: {
        //     subType: CHAT_TYPE_MESSAGES.BROWSE,
        //     // subTypeId: 2,
        //   },
        //   messageId: Math.random() * 5000,
        //   isReceived: true,
        // },
      ];
    }
    case USER_INPUTS.UPLOAD_CV: {
      return [
        {
          createdAt,
          content: {
            subType: CHAT_TYPE_MESSAGES.UPLOAD_CV,
          },
          messageId: Math.random() * 5000,
          isReceived: true,
        },
      ];
    }
    case USER_INPUTS.ANSWER_QUESTIONS: {
      return [
        {
          createdAt,
          content: {
            text: "What's your preferred job title? We'll try finding similar jobs.",
            subType: CHAT_TYPE_MESSAGES.TEXT,
          },
          messageId: Math.random() * 5000,
          isReceived: true,
        },
      ];
    }
    case USER_INPUTS.JOB_POSITION: {
      return [
        {
          createdAt,
          content: {
            text: "bot message Where do you want to work? This can be your current location or a list of preferred locations.",
            subType: CHAT_TYPE_MESSAGES.TEXT,
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

export const capitalizeFirstLetter = (str: string)=> {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

const emptyFunc = () => console.log();

export const chatMessangerDefaultState: IChatMessangerContext = {
  messages: [],
  chatOption: null,
  serverMessages: [],
  ownerId: null,
  addMessage: emptyFunc,
  pushMessage: emptyFunc,
  setOption: emptyFunc,
  updateMessages: emptyFunc,
  chooseButtonOption: emptyFunc,
};