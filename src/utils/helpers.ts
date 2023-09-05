import { profile } from "contexts/mockData";
import { IUser } from "contexts/types";
import moment from "moment";
import randomString from "random-string";
import capitalize from "lodash/capitalize";
import unionBy from "lodash/unionBy";
import filter from "lodash/filter";
import find from "lodash/find";
import map from "lodash/map";
import { Buffer } from "buffer";

import {
  MessageType,
  ILocalMessage,
  CHAT_ACTIONS,
  ButtonsOptions,
  IContent,
  IGetUpdatedMessages,
  IFilterItemsWithType,
  IRequisition,
  IPushMessage,
  ISnapshot,
} from "./types";
import { COLORS } from "./colors";
import {
  getReplaceMessageType,
  isPushMessageType,
  LocalStorage,
  TextFieldTypes,
  SessionStorage,
  EventIds,
} from "./constants";
import { IApiThemeResponse } from "./api";
import {
  ContactType,
  IApiMessage,
  IMessage,
  ISearchJobsPayload,
  IUserSelf,
  I_id,
  LocationType,
  ServerMessageType,
  SnapshotType,
} from "services/types";
import i18n from "services/localization";
import sortBy from "lodash/sortBy";
import findIndex from "lodash/findIndex";
import remove from "lodash/remove";

window.Buffer = Buffer;

interface IIsMatches {
  item: string;
  compareItem: string;
}

interface IGetMatchedItems {
  message: string | null;
  searchItems: string[];
  searchLocations: string[];
  alertCategories?: string[] | null;
}

interface IIsResultType {
  type: CHAT_ACTIONS | null;
  matchedItems: string[];
  value?: string;
}

export interface IMessageProps {
  color?: string;
  backColor?: string;
  isOwn?: boolean;
  padding?: string;
  cursor?: string;
  isLastMessage?: boolean;
}

interface IUserContact {
  isPhoneType: boolean;
  contact: string | undefined | null;
}

export const generateLocalId = (): string => randomString({ length: 32 });

export const getMessageProps = (msg: ILocalMessage): IMessageProps => {
  const padding =
    msg?.content.subType === MessageType.FILE ? "8px" : "12px 16px";
  const cursor =
    msg?.content.subType === MessageType.BUTTON ? "pointer" : "initial";

  if (!msg.isOwn) {
    return {
      color: COLORS.DUSTY_GRAY,
      backColor: COLORS.ALTO,
      isOwn: !!msg.isOwn,
      padding,
      cursor,
    };
  }
  return {
    color:
      msg?.content.subType === MessageType.BUTTON
        ? COLORS.TUNDORA
        : COLORS.WHITE,
    backColor:
      msg?.content.subType === MessageType.BUTTON
        ? COLORS.ALTO
        : COLORS.BOULDER,
    padding,
    isOwn: !!msg.isOwn,
    cursor,
  };
};

export const getActionTypeByOption = (option: ButtonsOptions) => {
  switch (option.toLowerCase()) {
    case ButtonsOptions.UPLOAD_CV.toLowerCase(): {
      return CHAT_ACTIONS.UPLOAD_CV;
    }
    // case USER_INPUTS.HIRING_PROCESS.toLowerCase(): {
    //   return CHAT_ACTIONS.HIRING_PROCESS;
    // }
    case ButtonsOptions.ANSWER_QUESTIONS.toLowerCase(): {
      return CHAT_ACTIONS.ANSWER_QUESTIONS;
    }
    case ButtonsOptions.UPLOADED_CV: {
      return CHAT_ACTIONS.UPLOADED_CV;
    }
    case ButtonsOptions.CANCEL_JOB_SEARCH_WITH_RESUME:
      return CHAT_ACTIONS.CANCEL_JOB_SEARCH_WITH_RESUME;

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

export const getLocalMessage = (
  sender: IUserSelf,
  requestMessage?: IApiMessage,
  chatBotMessage?: IMessage
): IMessage => {
  const currentUnixTime = moment().unix();

  return {
    chatItemId: chatBotMessage?.chatItemId || -1,
    localId: requestMessage?.localId || chatBotMessage?.localId,
    content: {
      typeId: MessageTypeId.text,
      subTypeId: null,
      contextId:
        requestMessage?.contextId || chatBotMessage?.content.contextId || null,
      text: requestMessage?.msg || chatBotMessage?.text,
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
    isReceived: false,
    sender,
    searchValue: "",
    isOwn: false,
    subType: chatBotMessage?.subType || chatBotMessage?.content.subType,
  };
};

// CONTEXT

export const validateEmail = (value: string) => {
  if (!value) {
    return i18n.t("labels:required");
  }
  if (value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
    return i18n.t("labels:email_invalid");
  }
  return "";
};

export const validateEmailOrPhone = (value: string) => {
  if (!value) {
    return i18n.t("labels:required");
  }

  const emailRegExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/is;
  const phoneRegExp =
    /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;

  if (!emailRegExp.test(value) && !phoneRegExp.test(value)) {
    return i18n.t("labels:email_or_phone_invalid");
  }

  return "";
};

const isMatches = ({ item, compareItem }: IIsMatches) => {
  const compareWord = compareItem.toLowerCase();
  const searchItem = item.toLowerCase();

  return (
    searchItem.slice(0, compareWord.length) === compareWord &&
    searchItem.includes(compareItem)
  );
};

export const getMatchedItems = ({
  message,
  searchItems,
  searchLocations,
  alertCategories,
}: IGetMatchedItems) => {
  const compareItem = message?.toLowerCase() || "";
  const matchedPositions = filter(searchItems, (item) =>
    isMatches({ item, compareItem })
  );

  const matchedPart =
    matchedPositions.length && message?.length
      ? matchedPositions[0].slice(0, message.length)
      : "";

  let matchedItems = map(
    filter(matchedPositions, (p) => {
      return !searchLocations.includes(p);
    }),
    (item) => item.slice(message?.length, item.length)
  );

  if (alertCategories?.length) {
    matchedItems = map(
      filter(matchedPositions, (p) => {
        return !alertCategories.includes(p);
      }),
      (item) => item.slice(message?.length, item.length)
    );
  }

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
  const parsedMessages = map(messages, (msg) => {
    const content: IContent = {
      subType: msg?.content.subType,
      text: msg?.content.text,
    };
    return {
      dateCreated: msg.dateCreated,
      content,
      isOwn: msg.sender.id === profile.id,
      localId: msg?.localId,
      _id: msg.chatItemId,
    };
  });
  return parsedMessages;
};

export const getItemById = (items: any[], id: string) => {
  return find(items, (job) => job.id === Number(id));
};

export const getMessagesOnAction = ({
  action,
  messages,
  responseMessages,
  additionalCondition,
}: IGetUpdatedMessages) => {
  const { type } = action;
  let updatedMessages = messages;
  if (type === CHAT_ACTIONS.SEARCH_WITH_RESUME) {
    updatedMessages = popMessage({ type: MessageType.UPLOAD_CV, messages });
    updatedMessages = popMessage({ type: MessageType.SUBMIT_FILE, messages });
  }

  if (!isPushMessageType(type)) {
    updatedMessages = popMessage({
      type: getReplaceMessageType(type),
      messages: !updatedMessages.length
        ? [...updatedMessages, ...initialMessages]
        : updatedMessages,
    });
  }

  console.log(
    "%c   push   ",
    `color: ${COLORS.PASTEL_GRIN}; background-color: ${COLORS.BLACK};`,
    responseMessages,
    updatedMessages
  );
  return [...responseMessages, ...updatedMessages];
};

const initialMessages = getParsedMessages([
  {
    text: i18n.t("messages:initialMessage"),
    isChatMessage: true,
  },
]);

export const pushMessage = ({
  action,
  messages,
  setMessages,
}: IPushMessage) => {
  const { type, payload } = action;
  const text = payload?.item
    ? payload.item
    : payload?.items?.join("\r\n") || "";

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

  if (message?.content.subType !== MessageType.TEXT || !!text)
    setMessages([message, ...updatedMessages]);

  if (message?.content.text) {
    // Push initial message
    // TODO: uncomment when backend is ready
    // const isInitialMessage = !messages.length;
    // const serverMessage = {
    //     ...defaultServerMessage,
    //     msg: isInitialMessage ? initialMessages[0].content.text : message.content.text,
    //     // subType: isInitialMessage ? initialMessages[0].content.subType : message.content.subType,
    //     // msg: initialMessages[0].content.text || '',
    //     localId: `${initialMessages[0].localId}`,
    // };
    // sendMessage(serverMessage);
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
    : messages.filter((msg) => msg?.content.subType !== type);

  !type && updatedMessages.shift();

  return updatedMessages;
};

export const replaceItemsWithType = ({
  type,
  messages,
  excludeItem,
}: IFilterItemsWithType) => {
  const item = find(
    messages,
    (msg) => msg?.content.subType === type && msg.content.text === excludeItem
  );
  const updatedMessages = filter(
    messages,
    (msg) => msg?.content.subType !== type
  );

  if (item) {
    item.content.subType = MessageType.TEXT;
    return [item, ...updatedMessages];
  }

  return updatedMessages;
};

export const getNextActionType = (chatMsgType: CHAT_ACTIONS | null) => {
  switch (chatMsgType) {
    case CHAT_ACTIONS.REFINE_SEARCH:
    case CHAT_ACTIONS.FIND_JOB:
    case CHAT_ACTIONS.APPLY_ETHNIC:
    case CHAT_ACTIONS.GET_USER_EMAIL:
    case CHAT_ACTIONS.SEARCH_WITH_RESUME:
      return CHAT_ACTIONS.SET_CATEGORY;
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
      return CHAT_ACTIONS.SET_ALERT_JOB_LOCATIONS;

    // case CHAT_ACTIONS.SET_ALERT_JOB_LOCATIONS:
    //   return CHAT_ACTIONS.SEND_ALERT_JOB_LOCATIONS

    case CHAT_ACTIONS.SEND_ALERT_JOB_LOCATIONS:
      return CHAT_ACTIONS.SET_ALERT_EMAIL;

    case CHAT_ACTIONS.SET_CATEGORY:
      return CHAT_ACTIONS.SET_LOCATIONS;
    case CHAT_ACTIONS.SET_LOCATIONS:
      return CHAT_ACTIONS.SEND_LOCATIONS;
    case CHAT_ACTIONS.SUCCESS_UPLOAD_CV:
      return CHAT_ACTIONS.SEARCH_WITH_RESUME;
    default:
      return chatMsgType;
  }
};

export const getSearchJobsData = (
  category: string,
  city: string
): ISearchJobsPayload => {
  return {
    pageSize: 20,
    // page: 0,
    keyword: "*",
    // companyId: '6591',
    minDatePosted: "2016-11-13T00:00:00",
    categories: [category],
    location: {
      city,
      state: null,
      postalCode: null,
      country: null,
      latitude: null,
      longitude: null,
      radius: null,
      radiusUnit: "km",
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
}) => ({
  firstName: user.name!.split("")[0]!,
  lastName: user.name!.split("")[1],
  profile: {
    currentJobTitle: prefferedJob?.title!,
    currentEmployer: "",
  },
  typeId: "",
  contactMethods: [
    {
      address: user.email!,
      isPrimary: true,
      location: "Home",
      type: ContactType.EMAIL,
    },
  ],
});

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
  return moment(date).format("MM/DD/YYYY");
};

export const getUniqueItems = (items: string[]) => {
  const uniqueItems: string[] = [];
  items.forEach((item) => {
    if (uniqueItems?.indexOf(item) === -1) {
      uniqueItems.push(item);
    }
  });

  return uniqueItems;
};

export const getFormattedLocations = (locations: LocationType[]) => {
  const items = map(
    filter(locations, (location) => !!location?.city),
    (item) => {
      if (!item.country) {
        return item.city;
      }
      if (item.state) {
        return `${item.city}, ${item.state}, ${item.country}`;
      }
      return `${item.city}, ${item.country}`;
    }
  );

  return getUniqueItems(items);
};

export const isResultsType = ({ type, matchedItems }: IIsResultType) => {
  const isAllowedType =
    !type ||
    // type === CHAT_ACTIONS.ASK_QUESTION ||
    type === CHAT_ACTIONS.SEARCH_WITH_RESUME ||
    type === CHAT_ACTIONS.FIND_JOB ||
    type === CHAT_ACTIONS.SET_JOB_ALERT ||
    type === CHAT_ACTIONS.SET_CATEGORY ||
    type === CHAT_ACTIONS.REFINE_SEARCH ||
    type === CHAT_ACTIONS.SUCCESS_UPLOAD_CV ||
    type === CHAT_ACTIONS.ANSWER_QUESTIONS ||
    type === CHAT_ACTIONS.SEND_LOCATIONS ||
    type === CHAT_ACTIONS.UPLOAD_CV ||
    type === CHAT_ACTIONS.SET_LOCATIONS ||
    type === CHAT_ACTIONS.SET_ALERT_CATEGORIES ||
    type === CHAT_ACTIONS.SET_ALERT_JOB_LOCATIONS;

  return isAllowedType && !!matchedItems.length;
};

export const getInputType = (actionType: CHAT_ACTIONS | null) => {
  const isMultiselectInput =
    actionType === CHAT_ACTIONS.SET_LOCATIONS ||
    actionType === CHAT_ACTIONS.SET_ALERT_CATEGORIES ||
    actionType === CHAT_ACTIONS.SET_ALERT_JOB_LOCATIONS;

  return isMultiselectInput
    ? TextFieldTypes.MultiSelect
    : TextFieldTypes.Select;
};

export const isResults = (draftMessage: string | null, searchItems: string[]) =>
  !draftMessage ||
  !!searchItems.find((s) => s.toLowerCase() === draftMessage.toLowerCase());

export const getMatchedItem = (
  draftMessage: string | null,
  searchItems: string[]
) =>
  find(
    searchItems,
    (l) => l.slice(0, draftMessage?.length) === capitalize(draftMessage || "")
  );

export const parseThemeResponse = (res: IApiThemeResponse) => ({
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
  chatbotName: res.chatbot_name,
  chatbotHeaderTextColor: res.chatbot_header_text_colour,
});

export const getStorageValue = (
  key: LocalStorage | SessionStorage,
  defaultValue?: string | number | null
) => {
  const item = localStorage.getItem(key) || sessionStorage.getItem(key);
  const value = item && typeof item == "object" ? JSON.parse(item) : item;

  return value || defaultValue;
};

export const generateOtp = ({ length = 6 }: { length?: number }) => {
  const digits = "0123456789";
  let otp = "";

  for (let i = 1; i <= length; i++) {
    const index = Math.floor(Math.random() * digits.length);

    otp = otp + digits[index];
  }

  return otp;
};

export const validateFields = (email: string, text: string) => {
  const errors = [];
  const emailError = validateEmail(email);

  if (emailError) {
    errors.push({ name: "email", text: emailError });
  }

  if (!text) {
    errors.push({ name: "description", text: "Required" });
  }

  return errors;
};

export const validationUserContacts = ({
  isPhoneType,
  contact,
}: IUserContact) => {
  if (!contact) return "";

  return isPhoneType ? validateEmailOrPhone(contact) : validateEmail(contact);
};

// ----------------------------------- regex ----------------------------------- //
export const regExpUuid =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const regExpJWT = /^[\w-]*\.[\w-]*\.[\w-]*$/i;

// ---------------------------------------------------------------------------- //

export const LOG = (
  logObj: any,
  description?: string,
  color = COLORS.PURPLE,
  background = COLORS.BLACK
) => {
  console.log("====================================");

  if (description) {
    console.log(
      `%c   ${description}   `,
      `color: ${
        description?.includes("ERROR") ? COLORS.TORCH_RED : color
      }; font-size: 14px; background-color: ${background};`,
      logObj
    );
  } else {
    console.log(
      `%c   ___   `,
      `color: ${
        description?.includes("ERROR") ? COLORS.TORCH_RED : color
      }; font-size: 14px; background-color: ${background};`,
      logObj
    );
  }

  console.log("====================================");
};

export const parseFirebaseMessages = (
  fMessages: IMessage[]
): ILocalMessage[] => {
  return unionBy(
    map(
      filter(fMessages, (mess) => mess?.content.subType !== "chat_created"),
      (mess) => ({
        dateCreated: mess.dateCreated,
        content: mess?.content,
        isOwn: mess.sender.id === -2 ? false : true,
        _id: mess.chatItemId,
        localId: mess?.localId,
      })
    ),
    "chatItemId"
  );
};

export const getProcessedSnapshots = <TId, TItem extends TId>(
  initialItems: TItem[],
  snapshots: ISnapshot<TItem>[],
  idField: keyof TId,
  fieldsToSave: (keyof TItem)[] = [],
  localIdField: keyof TItem | null = null
): TItem[] => {
  let newItemsArray: TItem[] = initialItems.slice();
  snapshots.forEach((snapshot) => {
    const { type: snapshotType, data: snapshotData } = snapshot;

    /* Skipping objects without id field */
    if (!snapshotData[idField]) {
      return;
    }
    const updateItem = () => {
      let foundItemIndex: number = findIndex(
        newItemsArray,
        (item) => item[idField] === snapshotData[idField]
      );

      // // Try to find object with localId
      if (foundItemIndex === -1 && localIdField && snapshotData[localIdField]) {
        foundItemIndex = findIndex(
          newItemsArray,
          (item) => item[localIdField] === snapshotData[localIdField]
        );
      }

      if (foundItemIndex !== -1) {
        fieldsToSave.forEach((field) => {
          snapshotData[field] = newItemsArray[foundItemIndex][field];
        });

        newItemsArray = [
          ...newItemsArray.slice(0, foundItemIndex),
          snapshotData,
          ...newItemsArray.slice(foundItemIndex + 1),
        ];
      } else {
        fieldsToSave.forEach((field) => {
          if (!snapshotData[field]) {
            // @ts-ignore
            snapshotData[field] = [];
          }
        });

        newItemsArray = [snapshotData, ...newItemsArray];
      }
    };

    const removeItem = () => {
      remove(
        newItemsArray,
        (item: any) => item[idField] === snapshotData[idField]
      );
    };

    switch (snapshotType) {
      case SnapshotType.Added:
      case SnapshotType.Modified:
        updateItem();
        break;
      case SnapshotType.Removed:
        removeItem();
        break;
      default:
        break;
    }
  });

  return newItemsArray;
};

export const getParsedSnapshots = ({ serverMessages, nextMessages }: any) => {
  const processedSnapshots: IMessage[] = sortBy(
    getProcessedSnapshots<I_id, IMessage>(
      serverMessages || [],
      nextMessages,
      "chatItemId",
      []
    ),
    (message: any) => -message.dateCreated.seconds
  );
  return processedSnapshots;
};

export const postMessToParent = (eventId: EventIds = EventIds.RefreshToken) => {
  window.parent.postMessage(
    JSON.parse(
      JSON.stringify({
        event_id: eventId,
      })
    ),
    "*"
  );
};
