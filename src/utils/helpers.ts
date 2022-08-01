import randomString from 'random-string';
import { MessageType,  ILocalMessage, CHAT_ACTIONS, USER_INPUTS, IContent, QueuesState, UpdateQueueChatRoomMessagesAction, IQueueChatRoom, IMessageID } from "./types";
import { colors } from "./colors";
import moment from 'moment';

import { IChatMessangerContext, IFileUploadContext } from "contexts/types";
import {  IApiMessage, IMessage, IUserSelf, ServerMessageType } from 'services/types';

import { findIndex, sortBy } from 'lodash';
import { getProcessedSnapshots } from 'firebase/config';
import { profile } from 'contexts/mockData';

// interface IGetMessageColorProps {
//     isOwn?: boolean;
// }

export interface IMessageProps {
    color: string;
    backColor: string
    isOwn: boolean;
    padding: string;
    cursor?:string
    isText?:boolean
}

export const generateLocalId = (): string => randomString({ length: 32 });

export const getMessageProps = (msg: ILocalMessage): IMessageProps  => {
  const padding = msg.content.subType === MessageType.FILE? '8px': '12px 16px';
  const cursor = msg.content.subType === MessageType.BUTTON? 'pointer': 'initial';

  if (!msg.isOwn) {
    return {
      color: colors.dustyGray ,
      backColor:  colors.alto,
      isOwn: !!msg.isOwn,
      padding,
      cursor
    };
  }
  return {
    color:msg.content.subType === MessageType.BUTTON? colors.tundora : colors.white,
    backColor: msg.content.subType === MessageType.BUTTON? colors.alto : colors.boulder,
    padding,
    isOwn: !!msg.isOwn,
    cursor
  };
};

export const getChatResponseOnMessage = (userInput: string): ILocalMessage[] => {
  const dateCreated = {seconds:moment().unix()}

  switch (userInput.toLowerCase()) {
    case USER_INPUTS.ASK_QUESTION: {
      const content = {
        text: "Output of existing most popular questions",
        subType: MessageType.TEXT,
        subTypeId: 1,
      };
      return [
        {
          dateCreated,
          content,
          localId: generateLocalId(),
          _id: null,
          isOwn: false,
        },
      ];
    }
    case USER_INPUTS.FIND_JOB: {
      const content = {
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor",
        subType: MessageType.TEXT,
        subTypeId: 1,
      };
      return [
        {
          dateCreated,
          content,
          localId: generateLocalId(),
          _id: null,
          isOwn: false,
        },
        {
          dateCreated,
          content: {
            subType: MessageType.BUTTON,
            text: 'Upload CV',
          },
          localId: generateLocalId(),
          isOwn: true,
          _id: null,
        },
        {
          dateCreated,
          content: {
            subType: MessageType.BUTTON,
            text: 'Answer questions',
            // subTypeId: 2,
          },
          isOwn: true,
          localId: generateLocalId(),
          _id: null,
        }
        // {
        //   dateCreated,
        //   content: {
        //     subType: MessageType.BROWSE,
        //     // subTypeId: 2,
        //   },
        //   _id: Math.random() * 5000,
        //   isOwn: true,
        // },
      ];
    }
    case USER_INPUTS.UPLOAD_CV: {
      return [
        {
          dateCreated,
          content: {
            subType: MessageType.UPLOAD_CV,
          },
          localId: generateLocalId(),
          _id: null,
          isOwn: true,
        },
      ];
    }
    case USER_INPUTS.ANSWER_QUESTIONS: {
      return [
        {
          dateCreated,
          content: {
            text: "What's your preferred job title? We'll try finding similar jobs.",
            subType: MessageType.TEXT,
          },
          localId: generateLocalId(),
          _id: null,
          isOwn: false,
        },
      ];
    }

   
    default: {
      const content = {
        subType: MessageType.REFINE_SERCH,
        text: responseMessages.refineSearch,
        subTypeId: 1,
      };
      return [
        {
          dateCreated,
          content,
          _id: null,
          localId: generateLocalId(),
          isOwn: false,
        },
      ];
    }
  }
};
interface IPayload {
  text?: string
}
export const getChatResponseOnAction = (userInput: CHAT_ACTIONS, payload: IPayload): ILocalMessage[] => {
  const dateCreated = {seconds:moment().unix()}

  switch (userInput) {
    case CHAT_ACTIONS.SET_CATEGORY: {
      return [
        {
          _id: null,
          dateCreated,
          content: {
            text: "bot message Where do you want to work? This can be your current location or a list of preferred locations.",
            subType: MessageType.TEXT,
          },
          localId:generateLocalId(),
          isOwn: false,
        },
      ];
    }
    case CHAT_ACTIONS.SUCCESS_UPLOAD_CV: {
      return [
        {  
          _id: null,
          localId:generateLocalId(),
          dateCreated,
          content: {
            text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor",
            subType: MessageType.TEXT,
          },
        
          isOwn: false,
        },
        {
          _id: null,
          localId: generateLocalId(),
          dateCreated,
          content: {
            text: payload.text || '',
            subType: MessageType.FILE,
          },
          isOwn: true,
        },
      
      ];
    }
  }
  return []
};

export const MessageTypeId: Record<ServerMessageType, number> = {
  /* Default text */
  [MessageType.TEXT]: 1,

  /* Events */
  [MessageType.DATE]: 2,
  [MessageType.UNREAD_MESSAGES]: 2,
  [MessageType.TRANSCRIPT]: 2,
  [MessageType.CHAT_CREATED]: 2,

  /* Files */
  [MessageType.VIDEO]: 2,
  [MessageType.DOCUMENT]: 2,
  [MessageType.FILE]: 2,
};

export const MessageSubtypeId: Record<ServerMessageType, number | null> = {
  /* Default text hasn't subtype */
  [MessageType.TEXT]: null,

  /* Each of file types has subtype */
  [MessageType.DATE]: 98,
  [MessageType.UNREAD_MESSAGES]: 99,
  [MessageType.VIDEO]: 2,
  [MessageType.DOCUMENT]: 4,
  [MessageType.FILE]: 5,

  /* Each of events has subtype */
  [MessageType.TRANSCRIPT]: 1,
  [MessageType.CHAT_CREATED]: 3,
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
      subType: MessageType.TEXT,
      url: null,
    },
    dateCreated: {
      seconds: currentUnixTime,
    },
    dateModified: {
      seconds: currentUnixTime,
    },
    isEdited: false,
    isOwn: false,
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
  // serverMessages: [],
  // ownerId: null,
  category: null,locations:[],
  addMessage: emptyFunc,
  pushMessages: emptyFunc,
  setOption: emptyFunc,
  chooseButtonOption: emptyFunc,
  popMessage: emptyFunc,
  triggerAction: emptyFunc, 
  updateStateMessages: emptyFunc,
  setSnapshotMessages: emptyFunc,
  setLastActionType: emptyFunc,
  lastActionType: null
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
    const str = compareItem.toLowerCase();
    const firstWord = item.toLowerCase().split(" ")[0];
    return (
      firstWord.length >= str.length &&
      firstWord.slice(0, str.length) === str
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

export const getParsedMessage = ({
  text,
  subType,
  isOwn  = true,
  localId = generateLocalId()
}: {
  text: string;
  subType: MessageType;
  isOwn?: boolean;
  localId?:string;
}) => {
  const dateCreated = { seconds: moment().unix()};
  const content: IContent = {
    subType,
    text,
  };
  return {
    dateCreated,
    content,
    isOwn: !!isOwn,
    localId,
    _id: null
  };
};

export const getServerParsedMessages = (messages: IMessage[]) => {
  const parsedMessages = messages.map((msg)=>{
    const content: IContent = {
      subType: msg.content.subType,
      text:msg.content.text
    };
    return {
      dateCreated:msg.dateCreated,
      content,
      isOwn: msg.sender.id === profile.id,
      localId: msg.localId,
      _id: msg.chatItemId,
    };
  })
 return parsedMessages;
};











// const INITIAL_STATE: QueuesState = {
//   queues: [],
//   queueIds: [],
//   rooms: {},
//   archivedRooms: [],
//   totalUnread: 0,
//   chatStatusFilter: [1, 2, 3, 4],
//   changeStatusError: null,
// };


type Handler<A> = (state: QueuesState, action: A) => QueuesState;
export const updateChatRoomMessages: Handler<UpdateQueueChatRoomMessagesAction> = (
  state,
  { messagesSnapshots, chatId, queueId },
) => {
  const chatRooms: IQueueChatRoom[] = [...state.rooms[queueId]];

  // Find room
  const foundRoomIndex = findIndex(
    state.rooms[queueId],
    (room) => room.chatId?.toString() === chatId,
  );

  if (foundRoomIndex !== -1) {
    // Update whole room (link) with new messages
    const processedSnapshots = sortBy(
      getProcessedSnapshots<IMessageID, IMessage>(
        chatRooms[foundRoomIndex].messages || [],
        messagesSnapshots,
        'chatItemId',
        [],
        'localId',
      ),
      (message) => -message.dateCreated.seconds,
    );

    chatRooms[foundRoomIndex] = {
      ...chatRooms[foundRoomIndex],
      messages: processedSnapshots,
    };
  }

  return { ...state, rooms: { ...state.rooms, [queueId]: chatRooms } };
};

const responseMessages = {
  refineSearch: "Let's try again to find a job"
}

export const getMessageBySubtype = (subType: string | undefined) => {
  if(!subType) {
    return undefined;
  }
  switch(subType){
    case CHAT_ACTIONS.REFINE_SEARCH: 
      return responseMessages.refineSearch
  }
}