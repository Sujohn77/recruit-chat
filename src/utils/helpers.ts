
import randomString from 'random-string';
import { CHAT_TYPE_MESSAGES,  ILocalMessage, USER_CHAT_ACTIONS, USER_INPUTS } from "./types";
import { colors } from "./colors";
import moment from 'moment';

import { IChatMessangerContext, IFileUploadContext } from "components/Context/types";
import { IApiMessage, IMessage, IUserSelf, MessageType } from 'services/types';

// interface IGetMessageColorProps {
//     isOwn?: boolean;
// }

export interface IMessageProps {
    color: string;
    backColor: string
    isOwn: boolean;
    padding: string;
    cursor?:string
}

export const generateLocalId = (): string => randomString({ length: 32 });

export const getMessageProps = (msg: ILocalMessage):IMessageProps  => {
  const padding = msg.content.subType === CHAT_TYPE_MESSAGES.FILE? '8px': '12px 16px';
  const cursor = msg.content.subType === CHAT_TYPE_MESSAGES.BUTTON? 'pointer': 'initial';
  
  if (!msg.isReceived) {
    return {
      color: colors.white,
      backColor: colors.boulder,
      padding,
      isOwn:!msg.isReceived,
      cursor
    };
  }
  return {
    color: colors.dustyGray,
    backColor: colors.alto,
    isOwn: !msg.isReceived,
    padding,
    cursor
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
          _id: Math.random() * 5000,
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
          _id: generateLocalId(),
          isReceived: true,
        },
        {
          createdAt,
          content: {
            subType: CHAT_TYPE_MESSAGES.BUTTON,
            text: 'Upload CV',
            // subTypeId: 2,
          },
          _id: generateLocalId(),
        },
        {
          createdAt,
          content: {
            subType: CHAT_TYPE_MESSAGES.BUTTON,
            text: 'Answer questions',
            // subTypeId: 2,
          },
          _id: generateLocalId(),
        }
        // {
        //   createdAt,
        //   content: {
        //     subType: CHAT_TYPE_MESSAGES.BROWSE,
        //     // subTypeId: 2,
        //   },
        //   _id: Math.random() * 5000,
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
          _id: Math.random() * 5000,
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
          _id: Math.random() * 5000,
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
          _id: Math.random() * 5000,
          isReceived: true,
        },
      ];
    }
  }
};
interface IPayload {
  text?: string
}
export const getChatResponseOnAction = (userInput: USER_CHAT_ACTIONS, payload: IPayload): ILocalMessage[] => {
  const createdAt = `${new Date()}`;

  switch (userInput) {
    case USER_CHAT_ACTIONS.JOB_POSITION: {
      return [
        {
          createdAt,
          content: {
            text: "bot message Where do you want to work? This can be your current location or a list of preferred locations.",
            subType: CHAT_TYPE_MESSAGES.TEXT,
          },
          _id: Math.random() * 5000,
          isReceived: true,
        },
      ];
    }
    case USER_CHAT_ACTIONS.SUCCESS_UPLOAD_CV: {
      return [
        {  
          _id: Math.random() * 5000,
          createdAt,
          content: {
            text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor",
            subType: CHAT_TYPE_MESSAGES.TEXT,
          },
        
          isReceived: true,
        },
        {
          _id: Math.random() * 5000,
          createdAt,
          content: {
            text: payload.text,
     
            subType: CHAT_TYPE_MESSAGES.FILE,
          },
        },
      
      ];
    }
  }
  return []
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

// CONTEXT

const emptyFunc = () => console.log();
export const chatMessangerDefaultState: IChatMessangerContext = {
  messages: [],
  chatOption: null,
  serverMessages: [],
  ownerId: null,
  jobPosition: null,
  addMessage: emptyFunc,
  pushMessages: emptyFunc,
  setOption: emptyFunc,
  updateMessages: emptyFunc,
  chooseButtonOption: emptyFunc,
  popMessage: emptyFunc,
  selectJobPosition: emptyFunc
};

export const fileUploadDefaultState: IFileUploadContext = {
  file: null,
  notification: null,
  resetFile: emptyFunc,
  saveFile: emptyFunc,
  sendFile: emptyFunc,
  setNotification: emptyFunc,
};

enum FILE_TYPES {
  PDF = 'pdf',
  DOCX = 'docx',
  DOC = 'doc'
}

export const isRightFormat = (type: string) => {
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  return (<any>Object).values(FILE_TYPES).includes(type);
}

interface IIsMatches {
  item: string;
  compareItem: string
}
const isMatches = ({item,compareItem}:IIsMatches) => { 
    const str = item.toLowerCase();
    const firstWord = item.toLowerCase().split(" ")[0];
    return (
      str.toLowerCase().indexOf(compareItem) !== -1 &&
      firstWord.indexOf(compareItem) !== -1
    );

}

interface IGetMatchedItems {
  message: string | null;
  searchItems: string[]
}
export const getMatchedItems = ({message,searchItems}:IGetMatchedItems) => { 
  const compareItem = message?.toLowerCase()
  if(compareItem?.length){
    return searchItems
      .filter((item) => isMatches({item, compareItem}))
      .map((p) => p.slice(compareItem.length, p.length))
  }
  return []
 }