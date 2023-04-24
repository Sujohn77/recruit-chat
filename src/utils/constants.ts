import moment from "moment";

import i18n from "services/localization";
import { generateLocalId, getParsedMessages } from "./helpers";
import {
  CHAT_ACTIONS,
  HTTPStatusCodes,
  IGetChatResponseProps,
  ILocalMessage,
  MessageType,
} from "./types";

export const currencies = ["$", "€"];

export const HTTP_RESPONSES = {
  UNAUTHORIZED_401: 401,
  FORBIDDEN_403: 403,
  NOT_FOUND_404: 404,
};

export const HTTP_STATUSES: Record<HTTPStatusCodes, number> = {
  [HTTPStatusCodes.UNAUTHORIZED_401]: HTTP_RESPONSES.UNAUTHORIZED_401,
  [HTTPStatusCodes.FORBIDDEN_403]: HTTP_RESPONSES.FORBIDDEN_403,
  [HTTPStatusCodes.NOT_FOUND_404]: HTTP_RESPONSES.NOT_FOUND_404,
};

export enum ChannelName {
  SMS = "SMS",
}

export const defaultServerMessage = {
  channelName: ChannelName.SMS,
  candidateId: 49530690,
  contextId: null,
  images: [],
};

export const initialChatMessage = {
  _id: null,
  localId: generateLocalId(),
  content: {
    subType: MessageType.INITIAL_MESSAGE,
    text: "Please choose one of the following options to begin your job search",
  },
  dateCreated: { seconds: moment().unix() },
  isOwn: false,
};

export const getChatActionMessages = (type: CHAT_ACTIONS, param?: string) => {
  switch (type) {
    case CHAT_ACTIONS.SET_CATEGORY:
      return [
        {
          subType: MessageType.TEXT,
          text: i18n.t("messages:botMessageYou"),
        },
      ];
    case CHAT_ACTIONS.SUCCESS_UPLOAD_CV:
      return [
        {
          subType: MessageType.SUBMIT_FILE,
          text: i18n.t("messages:submitFile"),
        },
      ];
    case CHAT_ACTIONS.REFINE_SEARCH:
      return [
        {
          subType: MessageType.TEXT,
          text: i18n.t("messages:whatJobTitle"),
        },
      ];
    case CHAT_ACTIONS.SAVE_TRANSCRIPT:
      return [
        {
          subType: MessageType.EMAIL_FORM,
        },
      ];
    case CHAT_ACTIONS.SEND_TRANSCRIPT_EMAIL:
      return [
        {
          subType: MessageType.TRANSCRIPT,
        },
      ];
    case CHAT_ACTIONS.SEND_LOCATIONS:
      return [
        {
          subType: MessageType.JOB_POSITIONS,
        },
        {
          subType: MessageType.TEXT,
          text: i18n.t("messages:jobRecommendations"),
        },
      ];
    case CHAT_ACTIONS.SET_JOB_ALERT:
      return [
        {
          text: i18n.t("messages:interestedCategories"),
          subType: MessageType.TEXT,
        },
        {
          subType: MessageType.TEXT,
          text: i18n.t("messages:setJobAlert"),
          isOwn: true,
          isChatMessage: true,
        },
      ];
    case CHAT_ACTIONS.SEND_ALERT_CATEGORIES:
      return [
        {
          subType: MessageType.TEXT,
          text: i18n.t("messages:alertEmail"),
        },
      ];
    case CHAT_ACTIONS.SET_ALERT_EMAIL:
      return [
        {
          subType: MessageType.TEXT,
          text: i18n.t("messages:successSubscribed"),
        },
      ];
    case CHAT_ACTIONS.APPLY_POSITION:
      return [
        {
          text: i18n.t("messages:provideName"),
        },
        {
          text: i18n.t("messages:applyThanks"),
        },
      ];
    case CHAT_ACTIONS.INTERESTED_IN:
      return [
        {
          text: i18n.t("messages:whatFullName"),
        },
        {
          text: i18n.t("messages:fewQuestions"),
        },
        {
          subType: MessageType.INTERESTED_IN,
          isOwn: true,
          isChatMessage: true,
        },
      ];
    case CHAT_ACTIONS.FIND_JOB:
      return [
        {
          subType: MessageType.BUTTON,
          text: i18n.t("messages:answerQuestions"),
          isOwn: true,
          isChatMessage: true,
        },
        {
          subType: MessageType.BUTTON,
          text: i18n.t("messages:uploadCV"),
          isOwn: true,
          isChatMessage: true,
        },
        {
          subType: MessageType.TEXT,
          text: "Please choose one of the following options to begin your job search",
        },
      ];
    case CHAT_ACTIONS.ASK_QUESTION:
      return [
        {
          text: i18n.t("messages:whatHiring"),
          subType: MessageType.BUTTON,
          isChatMessage: true,
          isOwn: true,
        },
        {
          text: i18n.t("messages:howSubmitCV"),
          subType: MessageType.BUTTON,
          isChatMessage: true,
          isOwn: true,
        },
        {
          text: i18n.t("messages:howMuchExperience"),
          subType: MessageType.BUTTON,
          isChatMessage: true,
          isOwn: true,
        },
        {
          text: i18n.t("messages:popularQuestions"),
          subType: MessageType.TEXT,
        },
      ];
    case CHAT_ACTIONS.GET_USER_NAME:
      return [
        {
          text: i18n.t("messages:reachEmail"),
          subType: MessageType.TEXT,
        },
        {
          text: i18n.t("messages:niceToMeet", { name: param }),
          subType: MessageType.TEXT,
        },
      ];
    case CHAT_ACTIONS.GET_USER_EMAIL:
      return [
        {
          text: i18n.t("messages:botThanks"),
          subType: MessageType.TEXT,
        },
        {
          text: i18n.t("messages:contactLater"),
          subType: MessageType.TEXT,
        },
        {
          text: i18n.t("messages:thanks"),
          subType: MessageType.TEXT,
        },
      ];
    case CHAT_ACTIONS.HIRING_PROCESS:
      return [{ subType: MessageType.HIRING_PROCESS }];
    case CHAT_ACTIONS.UPLOAD_CV:
      return [{ subType: MessageType.UPLOAD_CV }];
    case CHAT_ACTIONS.ANSWER_QUESTIONS:
      return [{ text: i18n.t("messages:whatJobTitle") }];
    case CHAT_ACTIONS.APPLY_NAME:
      return [{ text: i18n.t("messages:provideEmail") }];
    case CHAT_ACTIONS.APPLY_EMAIL:
      return [{ text: i18n.t("messages:provideAge") }];
    case CHAT_ACTIONS.APPLY_AGE:
      return [
        {
          text: i18n.t("messages:permitWork"),
          subType: MessageType.TEXT_WITH_CHOICE,
        },
      ];
    case CHAT_ACTIONS.SET_WORK_PERMIT: {
      return [
        { subType: MessageType.SALARY_FORM },
        { text: i18n.t("messages:desireSalary") },
      ];
    }
    case CHAT_ACTIONS.NO_PERMIT_WORK: {
      return [
        { subType: MessageType.REFINE_SEARCH },
        { text: i18n.t("messages:noPermitWork") },
      ];
    }
    case CHAT_ACTIONS.SET_SALARY: {
      return [
        {
          text: i18n.t("messages:ethnicHispanic"),
          subType: MessageType.BUTTON,
          isOwn: true,
        },
        {
          text: i18n.t("messages:ethnicWhite"),
          subType: MessageType.BUTTON,
          isOwn: true,
        },
        {
          text: i18n.t("messages:wishNotSay"),
          subType: MessageType.BUTTON,
          isOwn: true,
        },
        { text: i18n.t("messages:ethnic") },
      ];
    }
    case CHAT_ACTIONS.HELP: {
      return [{ subType: MessageType.QUESTION_FORM }];
    }
    case CHAT_ACTIONS.NO_MATCH: {
      return [
        { subType: MessageType.NO_MATCH },
        {
          subType: MessageType.TEXT,
          text: i18n.t("messages:noMatchMessage"),
        },
      ];
    }
    case CHAT_ACTIONS.QUESTION_RESPONSE: {
      return [{ text: i18n.t("messages:emailAnswer") }];
    }
    case CHAT_ACTIONS.CHANGE_LANG: {
      return [
        {
          text: i18n.t("messages:changeLang", { lang: param }),
          isOwn: true,
        },
      ];
    }
    case CHAT_ACTIONS.SET_LOCATIONS: {
      return [];
    }
    case CHAT_ACTIONS.UPLOADED_CV: {
      return [
        {
          subType: MessageType.UPLOADED_CV,
          text: param,
        },
      ];
    }
    default:
      return [];
  }
};

export const getReplaceMessageType = (type: CHAT_ACTIONS) => {
  switch (type) {
    case CHAT_ACTIONS.SAVE_TRANSCRIPT:
      return MessageType.TEXT;
    case CHAT_ACTIONS.SEND_TRANSCRIPT_EMAIL:
      return MessageType.EMAIL_FORM;
    case CHAT_ACTIONS.INTERESTED_IN:
      return MessageType.JOB_POSITIONS;
    default:
      return null;
  }
};

export const isPushMessageType = (type: CHAT_ACTIONS) => {
  return (
    type !== CHAT_ACTIONS.INTERESTED_IN &&
    type !== CHAT_ACTIONS.CHANGE_LANG &&
    type !== CHAT_ACTIONS.SUCCESS_UPLOAD_CV &&
    type !== CHAT_ACTIONS.SET_LOCATIONS &&
    type !== CHAT_ACTIONS.REFINE_SEARCH &&
    type !== CHAT_ACTIONS.APPLY_POSITION &&
    type !== CHAT_ACTIONS.QUESTION_RESPONSE &&
    type !== CHAT_ACTIONS.SEND_TRANSCRIPT_EMAIL &&
    type !== CHAT_ACTIONS.SEARCH_WITH_RESUME &&
    type !== CHAT_ACTIONS.SET_ALERT_CATEGORIES
  );
};

// export const isReversePush = (type: CHAT_ACTIONS) => {
//     return type === CHAT_ACTIONS.SUCCESS_UPLOAD_CV;
// };

export const getChatActionResponse = ({
  type,
  additionalCondition,
  param,
}: IGetChatResponseProps): ILocalMessage[] => {
  const messages = getChatActionMessages(type, param);

  if (
    additionalCondition !== null &&
    additionalCondition !== undefined &&
    !additionalCondition
  ) {
    const newType =
      type === CHAT_ACTIONS.SET_WORK_PERMIT
        ? CHAT_ACTIONS.NO_PERMIT_WORK
        : CHAT_ACTIONS.NO_MATCH;
    return getChatActionResponse({ type: newType });
  }

  const responseChatMessages = getParsedMessages(messages);
  // TODO: uncomment when backend is ready
  // for (let msg of responseChatMessages) {
  //     const serverMessage = {
  //         ...defaultServerMessage,
  //         msg: msg.content.text,
  //         subType: msg.content.subType,
  //         localId: `${msg.localId}`,
  //     };
  //     sendMessage(serverMessage);
  // }

  // const isPushMessage = isPushMessageType(type);
  return responseChatMessages;
};

export enum EnvironmentMode {
  Development = "development",
  Production = "production",
  Test = "test",
}

export const languages = ["EN", "FR", "UA"];

export enum Status {
  PENDING = "PENDING",
  ERROR = "ERROR",
  DONE = "Done",
}

export enum TextFieldTypes {
  MultiSelect = "MultiSelect",
  Select = "Select",
}

export enum InputTheme {
  Default = "default",
  Secondary = "secondary",
}

export enum LocalStorage {
  SubscriberID = "subscriberID",
  InitChatActionType = "initChatActionType",
}

export enum SessionStorage {
  Token = "token",
  ApiError = "ApiError",
}

export enum INPUT_TYPES {
  TEXT = "text",
  TEXTAREA = "textarea",
  NUMBER = "number",
  EMAIL = "email",
}

export enum IUserLoginDataKeys {
  GrantType = "grant_type",
  Username = "username",
  Password = "password",
  TwoFactorAuthCode = "twofactorauthcode",
  AppKey = "appKey",
  CodeVersion = "codeVersion",
}

export const chatId = 2433044;

export const resumeElementId = "chatbot_resume";
