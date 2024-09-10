import { profile } from "contexts/mockData";
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
import find from "lodash/find";
import map from "lodash/map";
import libPhoneNumber from "google-libphonenumber";
import { TFunction } from "react-i18next";

import {
  MessageType,
  ILocalMessage,
  CHAT_ACTIONS,
  ButtonsOptions,
  IContent,
  IGetUpdatedMessages,
  IFilterItemsWithType,
  IPushMessage,
  ISnapshot,
  IParsedTheme,
  IApiThemeResponse,
  IPopMessage,
  IPrivacyPolicy,
  NextMsgType,
} from "./types";
import { COLORS } from "./colors";
import {
  getReplaceMessageType,
  isPushMessageType,
  LocalStorage,
  TextFieldTypes,
  SessionStorage,
  EventIds,
  TryAgainTypes,
  MessageOptionTypes,
} from "./constants";
import {
  IMessage,
  IMessageOption,
  IMessageOptions,
  ISearchJobsPayload,
  ISendAnswerRequest,
  I_id,
  LocationType,
  SnapshotType,
} from "services/types";
import i18n from "services/localization";
import { ISendNewMessage } from "contexts/types";
import i18next from "i18next";

window.Buffer = Buffer;
const phoneUtil = libPhoneNumber.PhoneNumberUtil.getInstance();

interface ICreateMessage {
  text: string;
  isOwn?: boolean;
  i18n?: string;
  i18nProps?: Object;
  isError?: boolean;
  subType?: MessageType;
  tryAgainType?: TryAgainTypes;
  _id?: string | null;
  localId?: string;
  dateCreated?: { seconds: number };
  optionList?: null | IMessageOptions;
  locations?: string[];
  nextMsgType?: NextMsgType;
}
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
  nextMessFromSameSender?: boolean;
}
interface IUserContact {
  isPhoneType: boolean;
  contact: string | undefined | null;
}
interface IParseParentPathName {
  keyword: string | null;
  jobId: number | null;
}
export interface ICreateSendMessPayload extends ISendNewMessage {
  candidateId: number;
  queueId?: number | null;
  subscriberWorkflowId?: number;
  flowId?: number;
  directionId: 1 | 2;
}
interface IGetSearchJob {
  category?: string | string[];
  city?: string;
  country?: string;
  employeeLocationID?: string;
  employeeJobFamilyNames?: string[];
}

export const generateLocalId = (): string => randomString({ length: 32 });

export const getMessageProps = (msg: ILocalMessage): IMessageProps => ({
  isOwn: !!msg.isOwn,
  padding: "8px",
  cursor: msg?.content?.subType === MessageType.BUTTON ? "pointer" : "initial",
});

export const getActionTypeByOption = (
  excludeItem: ButtonsOptions | null | string,
  t: TFunction
) => {
  switch (excludeItem?.toLowerCase()) {
    case t("messages:uploadCV").toLowerCase():
    case ButtonsOptions.UPLOAD_CV.toLowerCase(): {
      return CHAT_ACTIONS.UPLOAD_CV;
    }
    case t("messages:answerQuestions").toLowerCase():
    case ButtonsOptions.ANSWER_QUESTIONS.toLowerCase(): {
      return CHAT_ACTIONS.ANSWER_QUESTIONS;
    }
    case ButtonsOptions.UPLOADED_CV: {
      return CHAT_ACTIONS.UPLOADED_CV;
    }
    case ButtonsOptions.CANCEL_JOB_SEARCH_WITH_RESUME:
      return CHAT_ACTIONS.CANCEL_JOB_SEARCH_WITH_RESUME;
    case t("buttons:make_referral").toLowerCase():
    case ButtonsOptions.MAKE_REFERRAL.toLowerCase():
      return CHAT_ACTIONS.MAKE_REFERRAL;

    default: {
      return null;
    }
  }
};

interface IResMessages {
  i18n?: string;
  subType?: MessageType;
  text?: string;
  isOwn?: boolean;
  isChatMessage?: boolean;
  i18nProps?: Object | null;
  optionList?: null | IMessageOptions;
}

export const getParsedMessages = (
  messages: IResMessages[]
): ILocalMessage[] => {
  const responseMessages = [];
  for (const msg of messages) {
    const localId = generateLocalId();
    const message: ILocalMessage = {
      _id: localId,
      content: {
        subType: msg.subType || MessageType.TEXT,
        text: msg.text,
        i18n: msg.i18n || "",
        i18nProps: msg.i18nProps || null,
      },
      localId,
      isOwn: !!msg.isOwn,
      optionList: msg.optionList,
    };

    responseMessages.push(message);
  }

  return responseMessages;
};

// CONTEXT

export const validateEmail = (
  value: string,
  requiredPhrase?: string
): string => {
  if (!value) {
    return requiredPhrase || i18n.t(`labels:required`);
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
  // @ts-ignore
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
  i18nPhrase = "",
  i18nProps,
}: {
  text: string;
  subType: MessageType;
  isOwn?: boolean;
  localId?: string;
  isChatMessage?: boolean;
  i18nPhrase: string;
  i18nProps: Object | null;
}) => {
  const dateCreated = { seconds: moment().unix() };
  const content: IContent = {
    subType: subType || MessageType.TEXT,
    text,
    i18n: i18nPhrase,
    i18nProps,
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
      subType: msg?.content?.subType,
      text: msg?.content.text,
      i18n: msg.content.i18n,
      i18nProps: msg.content.i18nProps,
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

export const getItemById = (items: any[], id: string) =>
  find(items, (job) => job.id === Number(id));

export const getMessagesOnAction = ({
  action,
  messages,
  responseMessages,
  isReferralEnabled,
  withFindJob,
  sendNewMessage,
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
        ? [
            ...updatedMessages,
            ...initialMessages(isReferralEnabled, withFindJob),
          ]
        : updatedMessages,
    });
  }

  console.log(
    "%c   push   ",
    `color: ${COLORS.PASTEL_GRIN}; background-color: ${COLORS.BLACK};`,
    responseMessages,
    updatedMessages
  );
  responseMessages.forEach(
    (mess) =>
      !mess.isOwn &&
      sendNewMessage({
        isOwn: false,
        message: mess.content.text,
        localId: mess?.localId?.toString(),
      })
  );
  return [...responseMessages, ...updatedMessages];
};

const initialMessages = (isReferralEnabled: boolean, withFindJob: boolean) =>
  getParsedMessages([
    {
      text: i18n.t(
        `messages:${
          isReferralEnabled
            ? "refInitialMessage"
            : withFindJob
            ? "initialMessage"
            : "initialMessage2"
        }`
      ),
      isChatMessage: true,
      i18n: `messages:${
        isReferralEnabled
          ? "refInitialMessage"
          : withFindJob
          ? "initialMessage"
          : "initialMessage2"
      }`,
      i18nProps: null,
    },
  ]);

export const getConsentOpInText = (
  consentOptIn: IPrivacyPolicy | null,
  currentLanguage: string
): string | undefined => {
  switch (currentLanguage) {
    case "en":
      return consentOptIn?.content_en || undefined;
    case "fr":
      return consentOptIn?.content_fr || undefined;
    default:
      return undefined;
  }
};

export const createConsentInMsg = ({
  currentLanguage,
  consentOptIn,
  companyName,
  t,
}: {
  currentLanguage: string;
  consentOptIn: IPrivacyPolicy | null;
  t: TFunction;
  companyName?: string | null;
}): ILocalMessage | null => {
  if (!consentOptIn) return null;

  const consentOptInText = getConsentOpInText(consentOptIn, currentLanguage);

  const consentOptInOptionList: IMessageOptions = {
    isActive: true,
    type: MessageOptionTypes.Consent,
    options: [
      {
        id: 1,
        itemId: 1,
        isSelected: false,
        text: t("labels:privacy_policy", { companyName }),
      },
      {
        id: 2,
        itemId: 2,
        isSelected: false,
        text: t("labels:wish_continue"),
      },
    ],
  };

  const consentInMessage = getParsedMessages([
    {
      subType: MessageType.TEXT,
      text: consentOptInText,
      optionList: consentOptInOptionList,
    },
  ])[0];

  return consentInMessage;
};

export const pushMessage = ({
  action,
  messages,
  setMessages,
  isReferralEnabled,
  chatConsent,
  currentLanguage,
  companyName,
  consentOptIn,
  t,
  withFindJob,
  sendNewMessage,
}: IPushMessage) => {
  const { type, payload, i18n, i18nProps } = action;

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
    i18nPhrase: i18n || "",
    i18nProps,
  });

  const updatedMessages = popMessage({
    type: getReplaceMessageType(type),
    messages: !messages.length
      ? [...messages, ...initialMessages(isReferralEnabled, withFindJob)]
      : messages,
  });

  if (message?.content.subType !== MessageType.TEXT || !!text) {
    const consentInMessage = createConsentInMsg({
      consentOptIn,
      currentLanguage,
      companyName,
      t,
    });

    let newMessages: ILocalMessage[] = updatedMessages;
    if (messages.length && chatConsent) {
      newMessages = [message, ...updatedMessages];
    } else if (messages.length && !chatConsent && consentInMessage) {
      newMessages = [consentInMessage, message, ...updatedMessages];
    } else if (chatConsent) {
      // newMessages = updatedMessages;
    } else if (consentInMessage) {
      newMessages = [consentInMessage, ...updatedMessages];
    } else {
      // newMessages = updatedMessages;
    }
    setMessages(newMessages);

    // setMessages(
    //   messages.length
    //     ? [message, ...updatedMessages]
    //     : chatConsent
    //     ? updatedMessages
    //     : consentInMessage
    //     ? [consentInMessage, ...updatedMessages]
    //     : updatedMessages
    // );
  }

  return updatedMessages;
};

const popMessage = ({ type, messages }: IPopMessage): ILocalMessage[] =>
  !type ? messages : filter(messages, (msg) => msg?.content?.subType !== type);

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
    (msg) => msg?.content?.subType === type && msg.content.text === excludeItem
  );
  const updatedMessages = filter(
    messages,
    (msg) => msg?.content?.subType !== type
  );

  if (item) {
    item.content.subType = MessageType.TEXT;
    return [item, ...updatedMessages];
  }

  return updatedMessages;
};

export const getNextActionType = (
  chatMsgType: CHAT_ACTIONS | null,
  excludeItem?: ButtonsOptions | null | string
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

export const getSearchJobsData = ({
  category,
  city,
  country,
  employeeJobFamilyNames,
  employeeLocationID,
}: IGetSearchJob): ISearchJobsPayload => {
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
  secondaryColor: theme.client_secondary_colour,
  imageUrl: theme.chatbot_logo_URL,
  borderStyle: theme.chatbot_border_style,
  borderWidth: theme.chatbot_border_thickness,
  borderColor: theme.chatbot_border_colour,
  headerColor: theme.chatbot_header_colour,
  messageBubbleColor: theme.chatbot_bubble_colour,
  buttonSecondaryColor: theme.chat_button_secondary_colour,
  searchResultsColor: theme.chat_search_results_colour,
  chatbotName: theme.chatbot_name,
  chatbotHeaderTextColor: theme.chatbot_header_text_colour,
  messageTextColor: theme.chatbot_bubble_text_colour,
  buttonPrimaryColor: theme.chat_button_primary_colour,
  linkColor:
    theme.chatbot_bubble_link_colour || theme.chatbot_bubble_link_color,
  avatarBorderStyle: theme.avatar_border_style,
  startMessBackground: theme.start_ui_welcome_message_colour,
  startMessColor: theme.start_ui_welcome_message_text_colour,
  startBtnBackground: theme.start_ui_button_message_colour,
  startBtnColor: theme.start_ui_button_message_text_colour,
  userMessageBubbleColor: theme.chatbot_user_bubble_colour,
  userMessageTextColor: theme.chatbot_user_bubble_text_colour,
});

export const getStorageValue = (
  key: LocalStorage | SessionStorage,
  defaultValue?: string | number | null
) => {
  const item = localStorage.getItem(key) || sessionStorage.getItem(key);
  const value = item && typeof item == "object" ? JSON.parse(item) : item;

  return value || defaultValue;
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
  log = true
) => {
  if (description && log) {
    console.log(
      `%c   ${description}   `,
      `color: ${color}; font-size: 12px; background-color: ${background};`,
      logObj
    );
  } else {
    console.log(
      `%c   ___   `,
      `color: ${
        description?.includes("ERROR") ? COLORS.TORCH_RED : color
      }; font-size: 12px; background-color: ${background};`,
      logObj
    );
  }
  console.log("_____________________________________________________________");
};

export const parseFirebaseMessages = (
  fMessages: IMessage[],
  t: TFunction,
  candidateId?: number
): ILocalMessage[] => {
  let messages = fMessages;

  if (fMessages.length > 1) {
    const indexLastMess = fMessages.findIndex(
      (m) => m.content.text === t("messages:jobRecommendations")
    );
    if (indexLastMess !== -1) {
      messages = fMessages.slice(0, indexLastMess);
    }
  }
  // console.log("====================================");
  // console.log(fMessages, "fMessages");
  // console.log(candidateId, "candidateId");
  // console.log(messages, "messages");
  // console.log("====================================");

  return unionBy(
    map(
      filter(messages, (mess) => mess?.content.subType !== "chat_created"),
      (mess) => ({
        dateCreated: mess.dateCreated,
        content: mess.content,
        isOwn: mess.sender.id === candidateId,
        localId: mess.localId,
        optionList: mess?.optionList,
        _id: mess.chatItemId,
        chatItemId: mess.chatItemId,
        sender: mess.sender,
      })
    ),
    "chatItemId"
  );
};

export const getProcessedSnapshots = <TId, TItem extends TId>(
  initialItems: TItem[],
  snapshots: ISnapshot<TItem>[],
  idField: keyof TId, // chatItemId
  fieldsToSave: (keyof TItem)[] = [], // []
  localIdField: keyof TItem | null = null // localId
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
        // case SnapshotType.Modified: // TODO: test
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

export const postMessToParent = (eventId: EventIds, payload?: object) => {
  window.parent.postMessage(
    JSON.parse(
      JSON.stringify({
        event_id: eventId,
        payload,
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

export const locationsStrToArray = (str?: string): string[] =>
  !str?.trim()
    ? []
    : str?.replace(/"/g, "")?.replace("{", "")?.replace("}", "")?.split(",");

export const createTextMess = ({
  text,
  i18n,
  i18nProps,
  isOwn,
  isError,
  tryAgainType,
  dateCreated,
  optionList,
  locations,
  nextMsgType,
  _id = generateLocalId(),
  localId = generateLocalId(),
  subType = MessageType.TEXT,
}: ICreateMessage): ILocalMessage => ({
  isOwn: isOwn || false,
  _id,
  localId,
  content: {
    text: text?.trim(),
    i18n: i18n || null,
    i18nProps: i18nProps || null,
    subType,
    isError,
    tryAgainType,
    locations,
    nextMsgType,
  },
  dateCreated,
  optionList,
});

export const createSendMessPayload = (
  props: ICreateSendMessPayload
): ISendAnswerRequest | null => {
  if (!props.message) {
    return null;
  }

  const {
    candidateId,
    message,
    chatItemId,
    isLiveChat,
    localId,
    optionId,
    subscriberWorkflowId,
    queueId,
    flowId,
    directionId,
  } = props;
  if (isLiveChat && queueId) {
    return localId
      ? {
          candidateId,
          message,
          queueId,
          directionId,
          localId: localId.toString(),
        }
      : {
          candidateId,
          message,
          queueId,
          directionId,
        };
  } else if (flowId && subscriberWorkflowId) {
    return {
      SubscriberWorkflowID: subscriberWorkflowId,
      localId: localId?.toString() || generateLocalId(),
      FlowID: flowId,
      candidateId,
      message,
      optionId,
      chatItemId,
      directionId,
    };
  } else {
    return localId
      ? { candidateId, message, localId: localId.toString(), directionId }
      : { candidateId, message, directionId };
  }
};

export const withSendNewMess = (
  messageValue: string | null,
  currentMsgType: CHAT_ACTIONS | null
): boolean =>
  messageValue?.trim() === "can i speak to someone?" ||
  currentMsgType === CHAT_ACTIONS.LIVE_CHAT ||
  currentMsgType === CHAT_ACTIONS.GET_EMAIL ||
  currentMsgType === CHAT_ACTIONS.APPLY_JOB_FROM_PARENT_SITE;

export const parsePathname = (pathname: string): IParseParentPathName => {
  const pattern = /\/job\/([^-]+(?:-[^-]*)*)\/(\d+)/;
  const match = pathname.match(pattern);

  let keyword: null | string = null;
  let jobId: null | number = null;

  if (match) {
    if (match[1]) {
      keyword = match[1].replace(/-/g, " ");
    }
    if (match[2] && !isNaN(Number(match[2]))) {
      jobId = Number(match[2]);
    }
  }

  return { keyword, jobId };
};

export const isConfirmationMessage = (message: string): boolean => {
  const text = message.trim().toLowerCase();
  return (
    text === "ye" ||
    text === "yes" ||
    text === "yea" ||
    text === "yep" ||
    text === "yup" ||
    text === "sure" ||
    text === "definitely" ||
    text === "definitely!" ||
    text === "i sure am" ||
    text === "maybe"
  );
};

export const getMessageOptionText = (option: IMessageOption, t: TFunction) => {
  if (option.i18nProps && option.i18nPhrase) {
    return t(option.i18nPhrase, option.i18nProps);
  } else if (option.i18nPhrase) {
    return t(option.i18nPhrase);
  } else return option.text;
};

export const checkTextInTranslations = async (
  text: string,
  key: string
): Promise<boolean> => {
  const languages: readonly string[] = i18next.languages;

  for (const lang of languages) {
    const translationExists = i18next.exists(key, { lng: lang });
    if (translationExists && i18next.t(key, { lng: lang }) === text) {
      return true;
    }
  }

  return false;
};

export const getIsNextMsgFromSameSender = ({
  isLastMess,
  currentMess,
  messages,
}: {
  isLastMess: boolean;
  currentMess: ILocalMessage;
  messages: ILocalMessage[];
}) => {
  const messageIndex = messages.findIndex(
    (m) => m.localId === currentMess.localId
  );
  const nextMessage: ILocalMessage | undefined = messages?.[messageIndex - 1];
  const isNextMessFromSameSender =
    !isLastMess && !!nextMessage?.isOwn === !!currentMess.isOwn;
  return isNextMessFromSameSender;
};
