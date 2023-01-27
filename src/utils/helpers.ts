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
  IRequisition,
  IPushMessage,
} from './types';
import { colors } from './colors';
import moment from 'moment';

import {
  IAuthContext,
  IChatMessangerContext,
  IFileUploadContext,
  IUser,
} from 'contexts/types';
import {
  ContactType,
  IApiMessage,
  IMessage,
  ISearchJobsPayload,
  IUserSelf,
  LocationType,
  ServerMessageType,
} from 'services/types';

import { capitalize, findIndex, sortBy } from 'lodash';
import { getProcessedSnapshots } from '../firebase/config';
import { profile } from 'contexts/mockData';

import i18n from 'services/localization';
import {
  defaultServerMessage,
  getReplaceMessageType,
  isPushMessageType,
  isReversePush,
  TextFieldTypes,
} from './constants';
import { IApiThemeResponse } from './api';
import { sendMessage } from 'services/hooks';

export interface IMessageProps {
  color?: string;
  backColor?: string;
  isOwn?: boolean;
  padding?: string;
  cursor?: string;
  isLastMessage?: boolean;
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

export const getActionTypeByOption = (option: USER_INPUTS) => {
  switch (option.toLowerCase()) {
    case USER_INPUTS.UPLOAD_CV.toLowerCase(): {
      return CHAT_ACTIONS.UPLOAD_CV;
    }
    case USER_INPUTS.HIRING_PROCESS.toLowerCase(): {
      return CHAT_ACTIONS.HIRING_PROCESS;
    }
    case USER_INPUTS.ANSWER_QUESTIONS.toLowerCase(): {
      return CHAT_ACTIONS.ANSWER_QUESTIONS;
    }

    default: {
      return null;
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
  status: null,
  category: null,
  user: null,
  searchLocations: [],
  requisitions: [],
  locations: [],
  offerJobs: [],
  currentMsgType: null,
  alertCategories: null,
  error: null,
  viewJob: null,
  prefferedJob: null,
  nextMessages: [],
  accessToken: null,
  chooseButtonOption: emptyFunc,
  triggerAction: emptyFunc,
  setSnapshotMessages: emptyFunc,
  setCurrentMsgType: emptyFunc,
  setError: emptyFunc,
  setViewJob: emptyFunc,
  submitMessage: emptyFunc,
  setIsInitialized: emptyFunc,
};

export const authDefaultState: IAuthContext = {
  loginByEmail: emptyFunc,
  setError: emptyFunc,
  clearAuthConfig: emptyFunc,
  error: '',
  subscriberID: null,
  isVerified: false,
  isOTPpSent: false,
  verifyEmail: '',
  mobileSubscribeId: null,
};

export const fileUploadDefaultState: IFileUploadContext = {
  file: null,
  notification: null,
  resetFile: emptyFunc,
  saveFile: emptyFunc,
  sendFile: emptyFunc,
  setNotification: emptyFunc,
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

export const validateEmailOrPhone = (value: string) => {
  if (!value) {
    return i18n.t('labels:required');
  }
  const emailRegExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/is;
  const phoneRegExp =
    /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;

  if (!emailRegExp.test(value) && !phoneRegExp.test(value)) {
    return i18n.t('labels:email_or_phone_invalid');
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
  searchLocations: string[];
}
export const getMatchedItems = ({
  message,
  searchItems,
  searchLocations,
}: IGetMatchedItems) => {
  const compareItem = message?.toLowerCase() || '';
  const matchedPositions = searchItems.filter((item) =>
    isMatches({ item, compareItem })
  );

  const matchedPart =
    matchedPositions.length && message?.length
      ? matchedPositions[0].slice(0, message.length)
      : '';
  const matchedItems = matchedPositions
    .filter((p) => {
      return !searchLocations.includes(p);
    })
    .map((item) => item.slice(message?.length, item.length));

  return {
    matchedItems,
    matchedPart,
  };
};

export const getParsedMessage = ({
  text,
  subType,
  isOwn = true,
  isChatMessage = false,
  localId = generateLocalId(),
}: {
  text: string;
  subType: MessageType;
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
    _id: !isChatMessage ? null : localId,
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

export const getItemById = (items: any[], id: string) => {
  return items.find((job) => job.id === Number(id));
};
export const isValidEmailOrText = (type: CHAT_ACTIONS, item: string) => {
  switch (type) {
    case CHAT_ACTIONS.SET_ALERT_EMAIL:
    case CHAT_ACTIONS.GET_USER_EMAIL:
    case CHAT_ACTIONS.APPLY_EMAIL: {
      return !validateEmail(item).length;
    }
  }
  return true;
};
export const getMessagesOnAction = ({
  action,
  messages,
  responseAction,
  additionalCondition,
}: IGetUpdatedMessages) => {
  const { type, payload } = action;
  let updatedMessages = [...messages];

  if (!isPushMessageType(type)) {
    updatedMessages = popMessage({
      type: getReplaceMessageType(type),
      messages: !messages.length ? [...messages, ...initialMessages] : messages,
    });
  }

  if (isReversePush(type)) {
    const text = payload?.item
      ? payload.item
      : payload?.items?.join('\r\n') || '';
    const message = getParsedMessage({
      text,
      subType:
        type === CHAT_ACTIONS.SUCCESS_UPLOAD_CV
          ? MessageType.FILE
          : MessageType.TEXT,
      isChatMessage: !!action.payload?.isChatMessage,
    });
    return [message, ...responseAction.newMessages, ...updatedMessages];
  }

  return [...responseAction.newMessages, ...updatedMessages];
};

const initialMessages = getParsedMessages([
  {
    text: i18n.t('messages:initialMessage'),
    isChatMessage: true,
  },
]);

export const pushMessage = ({
  action,
  messages,
  setMessages,
  accessToken,
}: IPushMessage) => {
  const { type, payload } = action;
  const text = payload?.item
    ? payload.item
    : payload?.items?.join('\r\n') || '';

  const message = getParsedMessage({
    text,
    subType:
      type === CHAT_ACTIONS.SUCCESS_UPLOAD_CV
        ? MessageType.FILE
        : MessageType.TEXT,
    isChatMessage: !!action.payload?.isChatMessage,
  });

  const updatedMessages = popMessage({
    type: getReplaceMessageType(type),
    messages: !messages.length ? [...messages, ...initialMessages] : messages,
  });

  if (message.content.subType !== MessageType.TEXT || !!text)
    setMessages([message, ...updatedMessages]);

  if (message.content.text) {
    if (accessToken) {
      // Push initial message
      const initialMessage = {
        ...defaultServerMessage,
        msg: initialMessages[0].content.text || '',
        localId: `${initialMessages[0].localId}`,
      };

      // !messages.length && sendMessage(initialMessage, accessToken);

      // // Send chat message
      // const msg = {
      //   ...defaultServerMessage,
      //   msg: message.content.text,
      //   localId: `${message.localId}`,
      // };

      // sendMessage(msg, accessToken);
    }
  }

  return updatedMessages;
};

export const popMessage = ({
  type,
  messages,
}: {
  type: MessageType | null;
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
  const item = messages.find(
    (msg) => msg.content.subType === type && msg.content.text === excludeItem
  );
  const updatedMessages = messages.filter(
    (msg, index) => msg.content.subType !== type
  );
  if (item) {
    item.content.subType = MessageType.TEXT;
    return [item, ...updatedMessages];
  }

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

export const getNextActionType = (chatMsgType: CHAT_ACTIONS | null) => {
  switch (chatMsgType) {
    case CHAT_ACTIONS.REFINE_SEARCH:
    case CHAT_ACTIONS.FIND_JOB:
    case CHAT_ACTIONS.APPLY_ETHNIC:
    case CHAT_ACTIONS.GET_USER_EMAIL:
      return CHAT_ACTIONS.SET_CATEGORY;
    case CHAT_ACTIONS.SET_ALERT_PERIOD:
      return CHAT_ACTIONS.SET_ALERT_EMAIL;
    case CHAT_ACTIONS.SET_ALERT_EMAIL:
      return CHAT_ACTIONS.SET_CATEGORY;
    case CHAT_ACTIONS.INTERESTED_IN:
      return CHAT_ACTIONS.GET_USER_NAME;
    case CHAT_ACTIONS.GET_USER_NAME:
      return CHAT_ACTIONS.GET_USER_EMAIL;
    case CHAT_ACTIONS.APPLY_POSITION:
      return CHAT_ACTIONS.APPLY_NAME;
    case CHAT_ACTIONS.APPLY_NAME:
      return CHAT_ACTIONS.APPLY_EMAIL;
    case CHAT_ACTIONS.APPLY_EMAIL:
      return CHAT_ACTIONS.APPLY_AGE;
    case CHAT_ACTIONS.APPLY_AGE:
      return CHAT_ACTIONS.SET_WORK_PERMIT;
    case CHAT_ACTIONS.SET_SALARY:
      return CHAT_ACTIONS.APPLY_ETHNIC;
    case CHAT_ACTIONS.SET_JOB_ALERT:
      return CHAT_ACTIONS.SET_ALERT_CATEGORIES;
    case CHAT_ACTIONS.SET_ALERT_CATEGORIES:
      return CHAT_ACTIONS.SEND_ALERT_CATEGORIES;
    case CHAT_ACTIONS.SEND_ALERT_CATEGORIES:
      return CHAT_ACTIONS.SET_ALERT_PERIOD;
    case CHAT_ACTIONS.SET_CATEGORY:
      return CHAT_ACTIONS.SET_LOCATIONS;
    case CHAT_ACTIONS.SET_LOCATIONS:
      return CHAT_ACTIONS.SEND_LOCATIONS;

    default:
      return chatMsgType;
  }
};

export const getSearchJobsData = (
  category: string,
  city: string
): ISearchJobsPayload => {
  return {
    pageSize: 10,
    page: 0,
    keyword: '*',
    companyId: '6591',
    minDatePosted: '2016-11-13T00:00:00',
    categories: [category],
    location: {
      city,
      state: null,
      postalCode: null,
      country: null,
      latitude: null,
      longitude: null,
      radius: null,
      radiusUnit: 'km',
    },
    externalSystemId: 789,
  };
};

export const getCreateCandidateData = ({
  user,
  prefferedJob,
}: {
  user: IUser;
  prefferedJob: IRequisition | null;
}) => {
  return {
    firstName: user.name!.split('')[0]!,
    lastName: user.name!.split('')[1],
    profile: {
      currentJobTitle: prefferedJob?.title!,
      currentEmployer: '',
    },
    typeId: '',
    contactMethods: [
      {
        address: user.email!,
        isPrimary: true,
        location: 'Home',
        type: ContactType.EMAIL,
      },
    ],
  };
};

export const getAccessWriteType = (type: CHAT_ACTIONS | null) => {
  switch (type) {
    // case CHAT_ACTIONS.APPLY_AGE:
    case CHAT_ACTIONS.SET_WORK_PERMIT:
    case CHAT_ACTIONS.SET_SALARY:
      return false; // TODO: test
    default:
      return true;
  }
};

export const getFormattedDate = (date: string) => {
  return moment(date).format('MM/DD/YYYY');
};

export const getFormattedLocations = (locations: LocationType[]) => {
  const items = locations.map((item) => {
    if (item.state) {
      return `${item.city}, ${item.state}, ${item.country.slice(0, 13)}`;
    }
    return `${item.city}, ${item.country.slice(0, 13)}`;
  });
  return getUniqueItems(items);
};

export const getUniqueItems = (items: string[]) => {
  const uniqueItems: string[] = [];
  items.forEach((item) => {
    if (uniqueItems.indexOf(item) === -1) {
      uniqueItems.push(item);
    }
  });
  return uniqueItems;
};

export const isResultsType = (type: CHAT_ACTIONS | null) => {
  return (
    !type ||
    type === CHAT_ACTIONS.FIND_JOB ||
    type === CHAT_ACTIONS.ASK_QUESTION ||
    type === CHAT_ACTIONS.SET_JOB_ALERT ||
    type === CHAT_ACTIONS.SET_CATEGORY ||
    // type === CHAT_ACTIONS.GET_USER_EMAIL ||
    type === CHAT_ACTIONS.SUCCESS_UPLOAD_CV ||
    type === CHAT_ACTIONS.REFINE_SEARCH ||
    type === CHAT_ACTIONS.ANSWER_QUESTIONS ||
    type === CHAT_ACTIONS.SEND_LOCATIONS ||
    type === CHAT_ACTIONS.UPLOAD_CV ||
    type === CHAT_ACTIONS.SET_LOCATIONS ||
    type === CHAT_ACTIONS.SET_ALERT_CATEGORIES
  );
};

export const isMultiSelectType = (type: CHAT_ACTIONS | null) => {
  return (
    type === CHAT_ACTIONS.SET_LOCATIONS ||
    type === CHAT_ACTIONS.SET_ALERT_CATEGORIES
  );
};

export const getInputType = ({
  actionType,
  category,
}: {
  actionType: CHAT_ACTIONS | null;
  category: string | null;
}) => {
  return isMultiSelectType(actionType)
    ? TextFieldTypes.MultiSelect
    : TextFieldTypes.Select;
};

export const isResults = ({
  draftMessage,
  searchItems,
}: {
  draftMessage: string | null;
  searchItems: string[];
}) => {
  return (
    !draftMessage ||
    !!searchItems.find((s) => s.toLowerCase() === draftMessage.toLowerCase())
  );
};

export const getMatchedItem = ({
  searchItems,
  draftMessage,
}: {
  draftMessage: string | null;
  searchItems: string[];
}) => {
  return searchItems.find(
    (l) => l.slice(0, draftMessage?.length) === capitalize(draftMessage || '')
  );
};

export const parseThemeResponse = (res: IApiThemeResponse) => {
  return {
    primaryColor: res.client_primary_colour,
    secondaryColor: res.client_secondary_color,
    imageUrl: res.chatbot_logo_URL,
    borderStyle: res.chatbot_border_style,
    borderWidth: res.chatbot_border_thickness,
    borderColor: res.chatbot_border_color,
    headerColor: res.chatbot_header_color,
    messageButtonColor: res.chatbot_bubble_color,
    buttonSecondaryColor: res.chat_button_secondary_color,
    searchResultsColor: res.chat_search_results_color,
  };
};

export const generateOtp = ({ length = 6 }: { length?: number }) => {
  const digits = '0123456789';
  let otp = '';

  for (let i = 1; i <= length; i++) {
    const index = Math.floor(Math.random() * digits.length);

    otp = otp + digits[index];
  }

  return otp;
};
