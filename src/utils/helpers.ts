import randomString from 'random-string';
import {
  MessageType,
  ILocalMessage,
  CHAT_ACTIONS,
  USER_INPUTS,
  IContent,
  QueuesState,
  UpdateQueueChatRoomMessagesAction,
  IQueueChatRoom,
  IMessageID,
  IGetUpdatedMessages,
  IFilterItemsWithType,
  IReplaceLocalMessages,
} from './types';
import { colors } from './colors';
import moment from 'moment';

import {
  IChatMessangerContext,
  IFileUploadContext,
  IJobPosition,
  ITriggerActionProps,
} from 'contexts/types';
import {
  IApiMessage,
  IMessage,
  IUserSelf,
  ServerMessageType,
} from 'services/types';

import { findIndex, sortBy } from 'lodash';
import { getProcessedSnapshots } from 'firebase/config';
import { profile } from 'contexts/mockData';
import { jobOffers } from 'components/Chat/mockData';

import i18n from 'services/localization';
import { getChatActionResponse } from './constants';

export const capitalize = (str: string) =>
  (str = str.charAt(0).toUpperCase() + str.slice(1));

export interface IMessageProps {
  color: string;
  backColor: string;
  isOwn: boolean;
  padding: string;
  cursor?: string;
  isText?: boolean;
}

export const generateLocalId = (): string => randomString({ length: 32 });

export const getMessageProps = (msg: ILocalMessage): IMessageProps => {
  const padding =
    msg.content.subType === MessageType.FILE ? '8px' : '12px 16px';
  const cursor =
    msg.content.subType === MessageType.BUTTON ? 'pointer' : 'initial';

  if (!msg.isOwn) {
    return {
      color: colors.dustyGray,
      backColor: colors.alto,
      isOwn: !!msg.isOwn,
      padding,
      cursor,
    };
  }
  return {
    color:
      msg.content.subType === MessageType.BUTTON
        ? colors.tundora
        : colors.white,
    backColor:
      msg.content.subType === MessageType.BUTTON ? colors.alto : colors.boulder,
    padding,
    isOwn: !!msg.isOwn,
    cursor,
  };
};

export const getChatResponseOnMessage = (
  userInput = '',
  isCategory = false
): ILocalMessage[] => {
  console.log(
    (userInput.toLowerCase(), USER_INPUTS.HIRING_PROCESS.toLowerCase())
  );
  switch (userInput.toLowerCase()) {
    case USER_INPUTS.ASK_QUESTION.toLowerCase(): {
      return getParsedMessages([
        {
          text: 'What is the hiring process?',
          subType: MessageType.BUTTON,
          isChatMessage: true,
          isOwn: true,
        },
        {
          text: 'Can I submit my CV',
          subType: MessageType.BUTTON,
          isChatMessage: true,
          isOwn: true,
        },
        {
          text: 'How much work experience do I need for your company?',
          subType: MessageType.BUTTON,
          isChatMessage: true,
          isOwn: true,
        },
        {
          text: 'OK! Here are a few popular questions to help you get started.',
          subType: MessageType.TEXT,
        },
      ]);
    }
    case USER_INPUTS.FIND_JOB.toLowerCase(): {
      return getParsedMessages([
        {
          subType: MessageType.BUTTON,
          text: 'Answer questions',
          isOwn: true,
          isChatMessage: true,
        },
        {
          subType: MessageType.BUTTON,
          text: 'Upload CV',
          isOwn: true,
          isChatMessage: true,
        },
        {
          subType: MessageType.TEXT,
          text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor',
        },
      ]);
    }
    case USER_INPUTS.UPLOAD_CV.toLowerCase(): {
      return getParsedMessages([{ subType: MessageType.UPLOAD_CV }]);
    }
    case USER_INPUTS.HIRING_PROCESS.toLowerCase(): {
      return getParsedMessages([{ subType: MessageType.HIRING_PROCESS }]);
    }
    case USER_INPUTS.ANSWER_QUESTIONS.toLowerCase(): {
      return getParsedMessages([
        {
          subType: MessageType.TEXT,
          text: "What's your preferred job title? We'll try finding similar jobs.",
        },
      ]);
    }

    default: {
      return [];
    }
  }
};

export const getParsedMessages = (
  messages: {
    subType?: MessageType;
    text?: string;
    isOwn?: boolean;
    isChatMessage?: boolean;
  }[]
): ILocalMessage[] => {
  const responseMessages = [];
  for (const msg of messages) {
    const dateCreated = { seconds: moment().unix() };
    const localId = generateLocalId();
    const message: ILocalMessage = {
      _id: !!msg.isChatMessage ? localId : null,
      dateCreated,
      content: {
        subType: msg.subType || MessageType.TEXT,
      },
      localId,
      isOwn: !!msg.isOwn,
    };
    if (msg.text) {
      message.content.text = msg.text;
    }
    responseMessages.push(message);
  }

  return responseMessages;
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

export const getLocalMessage = (
  requestMessage: IApiMessage,
  sender: IUserSelf
): IMessage => {
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

export const capitalizeFirstLetter = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// CONTEXT

const emptyFunc = () => console.log();
export const chatMessangerDefaultState: IChatMessangerContext = {
  messages: [],
  category: null,
  locations: [],
  categories: [],
  offerJobs: [],
  lastActionType: undefined,
  alertCategory: null,
  error: null,
  viewJob: null,
  prefferedJob: null,
  addMessage: emptyFunc,
  pushMessages: emptyFunc,
  chooseButtonOption: emptyFunc,
  triggerAction: emptyFunc,
  setSnapshotMessages: emptyFunc,
  setLastActionType: emptyFunc,
  changeLang: emptyFunc,
  setError: emptyFunc,
  setViewJob: emptyFunc,
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
  DOC = 'doc',
}

export const isRightFormat = (type: string) => {
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  return (<any>Object).values(FILE_TYPES).includes(type);
};

export const validateEmail = (value: string) => {
  if (!value) {
    return i18n.t('labels:required');
  }
  if (value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
    return i18n.t('labels:email_invalid');
  }
  return '';
};

interface IIsMatches {
  item: string;
  compareItem: string;
}
const isMatches = ({ item, compareItem }: IIsMatches) => {
  const compareWord = compareItem.toLowerCase();
  const searchItem = item.toLowerCase();

  return (
    searchItem.slice(0, compareWord.length) === compareWord &&
    searchItem.includes(compareItem)
  );
};

interface IGetMatchedItems {
  message: string | null;
  searchItems: string[];
}
export const getMatchedItems = ({ message, searchItems }: IGetMatchedItems) => {
  const compareItem = message?.toLowerCase();
  if (compareItem?.length) {
    return searchItems
      .filter((item) => isMatches({ item, compareItem }))
      .map((p) => p.slice(compareItem.length, p.length));
  }
  return [];
};

export const getParsedMessage = ({
  text,
  subType,
  isOwn = true,
  isChatMessage = false,
  localId = generateLocalId(),
}: {
  text: string;
  subType?: MessageType;
  isOwn?: boolean;
  localId?: string;
  isChatMessage?: boolean;
}) => {
  const dateCreated = { seconds: moment().unix() };
  const content: IContent = {
    subType: subType || MessageType.TEXT,
    text,
  };
  return {
    dateCreated,
    content,
    isOwn: !!isOwn,
    localId,
    _id:
      content.subType !== MessageType.FILE && !isChatMessage ? null : localId,
  };
};

export const getServerParsedMessages = (messages: IMessage[]) => {
  const parsedMessages = messages.map((msg) => {
    const content: IContent = {
      subType: msg.content.subType,
      text: msg.content.text,
    };
    return {
      dateCreated: msg.dateCreated,
      content,
      isOwn: msg.sender.id === profile.id,
      localId: msg.localId,
      _id: msg.chatItemId,
    };
  });
  return parsedMessages;
};

type Handler<A> = (state: QueuesState, action: A) => QueuesState;
export const updateChatRoomMessages: Handler<
  UpdateQueueChatRoomMessagesAction
> = (state, { messagesSnapshots, chatId, queueId }) => {
  const chatRooms: IQueueChatRoom[] = [...state.rooms[queueId]];

  // Find room
  const foundRoomIndex = findIndex(
    state.rooms[queueId],
    (room) => room.chatId?.toString() === chatId
  );

  if (foundRoomIndex !== -1) {
    // Update whole room (link) with new messages
    const processedSnapshots = sortBy(
      getProcessedSnapshots<IMessageID, IMessage>(
        chatRooms[foundRoomIndex].messages || [],
        messagesSnapshots,
        'chatItemId',
        [],
        'localId'
      ),
      (message) => -message.dateCreated.seconds
    );

    chatRooms[foundRoomIndex] = {
      ...chatRooms[foundRoomIndex],
      messages: processedSnapshots,
    };
  }

  return { ...state, rooms: { ...state.rooms, [queueId]: chatRooms } };
};

const responseMessages = {
  refineSearch: "Let's try again to find a job",
  changeLang: 'You changed the \n language to ',
};

export const getMessageBySubtype = ({
  subType,
  value,
}: {
  subType: string | undefined;
  value?: string;
}) => {
  if (!subType) {
    return undefined;
  }
  switch (subType) {
    case CHAT_ACTIONS.REFINE_SEARCH:
      return responseMessages.refineSearch;
    case CHAT_ACTIONS.CHANGE_LANG:
      return responseMessages.changeLang + value;
    default:
      return null;
  }
};

export const getResponseMessageType = (type: CHAT_ACTIONS) => {
  return;
};

export const ResponseMessageTypes = {
  [CHAT_ACTIONS.SUCCESS_UPLOAD_CV]: MessageType.FILE,
  [CHAT_ACTIONS.SAVE_TRANSCRIPT]: MessageType.TEXT,
  [CHAT_ACTIONS.SEND_EMAIL]: MessageType.TEXT,
};

export const getJobMatches = ({
  category,
  locations,
}: {
  category: string;
  locations: string[];
}): IJobPosition[] => {
  const jobs = jobOffers
    .filter((offer) => {
      console.log(offer.category, category, offer.category === category);
      return (
        offer.category === category &&
        locations.findIndex((l) => l === offer.location) !== -1
      );
    })
    .map((offer) => offer.jobs);
  if (!jobs.length) {
    return [];
  }
  return jobs[0] as IJobPosition[];
};

export const getItemById = (items: any[], id: string) => {
  return items.find((job) => job._id === Number(id));
};

export const getUpdatedMessages = ({
  action,
  messages,
  responseAction,
}: IGetUpdatedMessages) => {
  const { type, payload } = action;

  const text = payload?.item ? payload.item : payload?.items?.join('\r\n');
  const isAlertEmail = type === CHAT_ACTIONS.SET_ALERT_EMAIL;
  const isValidPush = !isAlertEmail || !validateEmail(payload?.item!).length;

  if (responseAction.messages.length && isValidPush) {
    const updatedMessages = popMessage({
      type: responseAction.replaceType,
      messages,
    });
    if (text && responseAction.isPushMessage) {
      const localMessage = getParsedMessage({ text });
      return [...responseAction.messages, localMessage, ...updatedMessages];
    } else {
      return [...responseAction.messages, ...updatedMessages];
    }
  }
};

const popMessage = ({
  type,
  messages,
}: {
  type: MessageType | undefined;
  messages: ILocalMessage[];
}) => {
  if (!type) {
    return messages;
  }

  const updatedMessages = !type
    ? messages
    : messages.filter((msg) => msg.content.subType !== type);

  !type && updatedMessages.shift();

  return updatedMessages;
};

export const replaceItemsWithType = ({
  type,
  messages,
  excludeItem,
}: IFilterItemsWithType) => {
  const updatedMessages = messages.filter((msg) => {
    const { text, subType } = msg.content;
    return subType !== type || (text === excludeItem && subType === type);
  });
  updatedMessages[0].content.subType = MessageType.TEXT;
  return updatedMessages;
};

export const replaceLocalMessages = ({
  messages,
  parsedMessages,
}: IReplaceLocalMessages) => {
  return messages.map((msg) => {
    if (!msg._id) {
      const updatedMessage = parsedMessages.find(
        (updateMsg) => updateMsg.localId === msg.localId
      );
      return updatedMessage || msg;
    }
    return msg;
  });
};
