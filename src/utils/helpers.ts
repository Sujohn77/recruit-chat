import { profile } from "contexts/mockData";
import { IUser } from "contexts/types";
import { CSSProperties } from "react";
import { Buffer } from "buffer";
import moment from "moment";
import randomString from "random-string";
import capitalize from "lodash/capitalize";
import findIndex from "lodash/findIndex";
import unionBy from "lodash/unionBy";
import sortBy from "lodash/sortBy";
import filter from "lodash/filter";
import remove from "lodash/remove";
import some from "lodash/some";
import find from "lodash/find";
import map from "lodash/map";
import libPhoneNumber from "google-libphonenumber";

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
  IParsedTheme,
  IApiThemeResponse,
  IPopMessage,
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

window.Buffer = Buffer;

interface IGetMatchedItems {
  searchStr: string | null;
  searchItems: string[];
}

interface IIsResultType {
  type: CHAT_ACTIONS | null;
  matchedItems: string[];
  value?: string;
}

export interface IMessageProps {
  backgroundColor?: string | null;
  isOwn?: boolean;
  padding?: string;
  cursor?: string;
  flexDirection?: CSSProperties["flexDirection"];
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
      isOwn: !!msg.isOwn,
      padding,
      cursor,
    };
  } else {
    return {
      padding,
      isOwn: !!msg.isOwn,
      cursor,
    };
  }
};

export const getActionTypeByOption = (option: ButtonsOptions | null) => {
  switch (option?.toLowerCase()) {
    // case USER_INPUTS.HIRING_PROCESS.toLowerCase(): {
    //   return CHAT_ACTIONS.HIRING_PROCESS;
    // }
    case ButtonsOptions.UPLOAD_CV.toLowerCase(): {
      return CHAT_ACTIONS.UPLOAD_CV;
    }
    case ButtonsOptions.ANSWER_QUESTIONS.toLowerCase(): {
      return CHAT_ACTIONS.ANSWER_QUESTIONS;
    }
    case ButtonsOptions.UPLOADED_CV: {
      return CHAT_ACTIONS.UPLOADED_CV;
    }
    case ButtonsOptions.CANCEL_JOB_SEARCH_WITH_RESUME:
      return CHAT_ACTIONS.CANCEL_JOB_SEARCH_WITH_RESUME;
    case ButtonsOptions.MAKE_REFERRAL.toLowerCase():
      return CHAT_ACTIONS.MAKE_REFERRAL;
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
    localId:
      requestMessage?.localId || chatBotMessage?.localId || generateLocalId(),
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

function advancedSearch(
  searchTerm: string | null,
  searchItems: string[]
): string[] {
  if (!searchTerm?.trim()) {
    return searchItems;
  }
  const searchTerms = searchTerm?.toLowerCase().split(" ");
  return searchItems.filter((item) => {
    const lowerItem = item.toLowerCase();
    return searchTerms?.every(
      (term) =>
        lowerItem.includes(term) ||
        lowerItem.split(" ").some((word) => word.startsWith(term))
    );
  });
}

export const getMatchedItems = ({
  searchStr,
  searchItems,
}: IGetMatchedItems): { matchedItems: string[]; matchedPart: string } => {
  const searchText = searchStr?.toLowerCase()?.trim() || "";
  const matchedItems = advancedSearch(searchStr, searchItems);

  const matchedPart =
    matchedItems.length && searchStr?.length
      ? searchText[0].toUpperCase() + searchText.slice(1, searchText.length)
      : "";

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
      localId: msg.localId,
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
  isReferralEnabled,
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
        ? [...updatedMessages, ...initialMessages(isReferralEnabled)]
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

const initialMessages = (isReferralEnabled: boolean) =>
  getParsedMessages([
    {
      text: i18n.t(
        `messages:${isReferralEnabled ? "refInitialMessage" : "initialMessage"}`
      ),
      isChatMessage: true,
    },
  ]);

export const pushMessage = ({
  action,
  messages,
  setMessages,
  isReferralEnabled,
}: IPushMessage) => {
  const { type, payload } = action;
  // const text =
  //   payload?.item ||
  //   payload?.items?.map((i) => i.substring(0, i.indexOf(","))).join("\r\n") ||
  //   "";

  const text = payload?.item
    ? payload.item
    : payload?.items?.join("\r\n") || "";

  LOG(payload?.items, "payload?.items", COLORS.WHITE, COLORS.BLACK, true);
  LOG(text, "text", COLORS.BLACK, COLORS.WHITE, true);

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
    messages: !messages.length
      ? [...messages, ...initialMessages(isReferralEnabled)]
      : messages,
  });

  if (message?.content.subType !== MessageType.TEXT || !!text) {
    setMessages([message, ...updatedMessages]);
  }

  return updatedMessages;
};

const popMessage = ({ type, messages }: IPopMessage) => {
  if (!type) {
    return messages;
  }

  const updatedMessages = !type
    ? messages
    : filter(messages, (msg) => msg?.content.subType !== type);

  !type && updatedMessages.shift();

  return updatedMessages;
};

export const replaceItemsWithType = ({
  type,
  messages,
  excludeItem,
  withoutFiltering = false,
}: IFilterItemsWithType) => {
  // for ask questions
  if (withoutFiltering) {
    return messages;
  }

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

export const getNextActionType = (
  chatMsgType: CHAT_ACTIONS | null,
  excludeItem?: ButtonsOptions | null
): CHAT_ACTIONS | null => {
  if (excludeItem === ButtonsOptions.JOBS_IN_MY_AREA) {
    return CHAT_ACTIONS.SEND_REFERRAL_LOCATIONS;
  }

  switch (chatMsgType) {
    case CHAT_ACTIONS.REFINE_SEARCH:
    case CHAT_ACTIONS.ANSWER_QUESTIONS:
    case CHAT_ACTIONS.GET_USER_EMAIL:
    case CHAT_ACTIONS.SEARCH_WITH_RESUME:
      return CHAT_ACTIONS.SET_CATEGORY;
    case CHAT_ACTIONS.SET_ALERT_EMAIL:
      return null;
    case CHAT_ACTIONS.INTERESTED_IN:
      return CHAT_ACTIONS.GET_USER_NAME;
    case CHAT_ACTIONS.GET_USER_NAME:
      return CHAT_ACTIONS.GET_USER_EMAIL;

    case CHAT_ACTIONS.SET_JOB_ALERT:
      return CHAT_ACTIONS.SET_ALERT_CATEGORIES;
    case CHAT_ACTIONS.SET_ALERT_CATEGORIES:
      return CHAT_ACTIONS.SET_ALERT_JOB_LOCATIONS;
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
  category?: string | string[],
  city?: string,
  country?: string,
  employeeLocationID?: string,
  employeeJobFamilyNames?: string[]
): ISearchJobsPayload => {
  return {
    page: 0,
    pageSize: 50,
    keyword: typeof category === "string" ? category : "*",
    minDatePosted: "2016-11-13T00:00:00",
    uniqueTitles: true,
    categories: employeeJobFamilyNames?.length
      ? employeeJobFamilyNames
      : undefined,
    location:
      !employeeLocationID && city
        ? {
            city: city,
            state: null,
            postalCode: null,
            country: country?.trim() || null,
            latitude: null,
            longitude: null,
            radius: null,
            radiusUnit: "km",
          }
        : undefined,
    customData: employeeLocationID
      ? [{ name: "Custom2", value: employeeLocationID }]
      : undefined,
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

export const parseThemeResponse = (theme: IApiThemeResponse): IParsedTheme => ({
  primaryColor: theme.client_primary_colour,
  secondaryColor: theme.client_secondary_color,
  imageUrl: theme.chatbot_logo_URL,
  borderStyle: theme.chatbot_border_style,
  borderWidth: theme.chatbot_border_thickness,
  borderColor: theme.chatbot_border_color,
  headerColor: theme.chatbot_header_color,
  messageButtonColor: theme.chatbot_bubble_color,
  buttonSecondaryColor: theme.chat_button_secondary_color,
  searchResultsColor: theme.chat_search_results_color,
  chatbotName: theme.chatbot_name,
  chatbotHeaderTextColor: theme.chatbot_header_text_colour,
  messageTextColor: theme.chatbot_bubble_text_color,
  buttonPrimaryColor: theme.chat_button_primary_colour,
});

export const getStorageValue = (
  key: LocalStorage | SessionStorage,
  defaultValue?: string | number | null
) => {
  const item = localStorage.getItem(key) || sessionStorage.getItem(key);
  const value = item && typeof item == "object" ? JSON.parse(item) : item;

  return value || defaultValue;
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

// ---------------------------------------------------------------------------- //

export const LOG = (
  logObj: any,
  description?: string,
  color = COLORS.PURPLE,
  background = COLORS.BLACK,
  log = false
) => {
  if (description && log) {
    console.log(
      `%c   ${description}   `,
      `color: ${color}; font-size: 14px; background-color: ${background};`,
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
  console.log("_____________________________________________________________");
};

export const parseFirebaseMessages = (
  fMessages: IMessage[]
): ILocalMessage[] => {
  console.log("====================================");
  console.log(fMessages, "fMessages");
  console.log("====================================");
  return unionBy(
    map(
      filter(fMessages, (mess) => mess?.content.subType !== "chat_created"),
      (mess) => ({
        dateCreated: mess.dateCreated,
        content: mess.content,
        isOwn: mess.sender.id === -2 ? false : true,
        localId: mess.localId,
        optionList: mess?.optionList,
        _id: mess.chatItemId,
        chatItemId: mess.chatItemId,
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

export const postMessToParent = (eventId: EventIds) => {
  window.parent.postMessage(
    JSON.parse(
      JSON.stringify({
        event_id: eventId,
      })
    ),
    "*"
  );
};

export const isValidColor = (strColor?: string): boolean => {
  if (strColor) {
    const s = new Option().style;
    s.color = strColor;
    return s.color !== "";
  } else {
    return false;
  }
};

const phoneUtil = libPhoneNumber.PhoneNumberUtil.getInstance();

const parse = (number: string, iso2?: string) => {
  try {
    return phoneUtil.parse(number, iso2);
  } catch (err) {
    // @ts-ignore
    console.log(`Exception was thrown: ${err.toString()}`);
    return null;
  }
};

export const isValidNumber = (number: string, iso2?: string) => {
  const phoneInfo = parse(number, iso2);

  if (phoneInfo) {
    return phoneUtil.isValidNumber(phoneInfo);
  }

  return false;
};

export const isStringArray = (property: any): property is string[] => {
  if (!Array.isArray(property)) return false;
  return property.every((item) => typeof item === "string");
};
