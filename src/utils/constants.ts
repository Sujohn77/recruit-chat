import i18n from "services/localization";
import { LOG, getParsedMessages } from "./helpers";
import {
  CHAT_ACTIONS,
  HTTPStatusCodes,
  IGetChatResponseProps,
  ILocalMessage,
  MessageType,
} from "./types";
import { COLORS } from "./colors";
import { getQuestions } from "components/ChatContent/data";

export const BASE_API_URL = "https://qa-integrations.loopworks.com/";
export const isDevMode = process.env.NODE_ENV === "development";
export const currencies = ["$", "€"];
export const resumeElementId = "chatbot_resume";
export const autolinkerClassName = "link-in-message";
export const REFRESH_APP_TIMEOUT = 20 * 60 * 1000;
export const _TIMEOUT = 5 * 60 * 1000; // for testing
export const REFRESH_TOKEN_TIMEOUT = 29 * 60 * 1000;
export const APP_VERSION = "1.0.3";
export const MS_1000 = 1000;
export const REFERRAL_OFFER_TEXT =
  "Yes, you can refer as many people as you like to either specific jobs or to the company generally. To begin, click below.";

export enum ChatScreens {
  Default = "Default",
  QnA = "AskAQuestion",
  FindAJob = "FindAJob",
  MakeReferral = "MakeReferral",
}

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

const getChatActionMessages = (
  type: CHAT_ACTIONS,
  withReferralFlow: boolean,
  referralCompanyName: string | null,
  param?: string,
  withoutDefaultQuestions?: boolean,
  employeeId?: number
) => {
  LOG(type, "getChatActionMessages TYPE", COLORS.WHITE);
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
    case CHAT_ACTIONS.SET_ALERT_JOB_LOCATIONS:
      return [
        {
          subType: MessageType.TEXT,
          text: i18n.t("messages:botMessageYou"),
        },
        // {
        //   subType: MessageType.TEXT,
        //   text: i18n.t("messages:alertEmail"),
        // },
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
      return withoutDefaultQuestions
        ? []
        : getQuestions(withReferralFlow, referralCompanyName);
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
      return [];
      // return [{ subType: MessageType.QUESTION_FORM }]; // for phase 2
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
          subType: MessageType.TEXT,
          text: i18n.t("messages:processed_your_resume"),
        },
        {
          subType: MessageType.UPLOADED_CV,
          text: param,
        },
      ];
    }
    case CHAT_ACTIONS.MAKE_REFERRAL:
      return employeeId
        ? [
            {
              subType: MessageType.TEXT,
              text: i18n.t("referral:friend_first_name"),
            },
          ]
        : [
            {
              subType: MessageType.TEXT,
              text: i18n.t("messages:employeeId"),
            },
          ];
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

export const isPushMessageType = (type: CHAT_ACTIONS) =>
  type !== CHAT_ACTIONS.INTERESTED_IN &&
  type !== CHAT_ACTIONS.CHANGE_LANG &&
  type !== CHAT_ACTIONS.SUCCESS_UPLOAD_CV &&
  type !== CHAT_ACTIONS.SET_LOCATIONS &&
  type !== CHAT_ACTIONS.REFINE_SEARCH &&
  type !== CHAT_ACTIONS.APPLY_POSITION &&
  type !== CHAT_ACTIONS.QUESTION_RESPONSE &&
  type !== CHAT_ACTIONS.SEND_TRANSCRIPT_EMAIL &&
  type !== CHAT_ACTIONS.SEARCH_WITH_RESUME &&
  type !== CHAT_ACTIONS.SET_ALERT_CATEGORIES;

export const getChatActionResponse = ({
  type,
  withReferralFlow,
  referralCompanyName,
  additionalCondition,
  param,
  isQuestion = false,
  employeeId,
}: IGetChatResponseProps): ILocalMessage[] => {
  if (
    additionalCondition !== null &&
    additionalCondition !== undefined &&
    !additionalCondition
  ) {
    const newType =
      type === CHAT_ACTIONS.SET_WORK_PERMIT
        ? CHAT_ACTIONS.NO_PERMIT_WORK
        : CHAT_ACTIONS.NO_MATCH;
    return getChatActionResponse({
      type: newType,
      employeeId,
      withReferralFlow,
      referralCompanyName,
    });
  }

  const responseMessages = getChatActionMessages(
    type,
    withReferralFlow,
    referralCompanyName,
    param,
    isQuestion,
    employeeId
  );
  return getParsedMessages(responseMessages);
};

export const languages = ["EN", "FR", "UA"];

export enum CHAT_OPTIONS {
  FIND_JOB = "FIND JOB",
  ASK_QUESTION = "ASK QUESTION",
}

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

export enum EventIds {
  RefreshToken = "refresh_token",
  RefreshChatbot = "refresh_chatbot",
  IFrameHeight = "iframe_height",
  GetChatBotData = "get_chatbot_data",
  HideSpinner = "hide_spinner",
}

export enum ReferralResponse {
  NotPreviouslyReferred = 0,
  PreviouslyReferredToGivenJob = 1,
  PreviouslyReferredNonJobSpecific = 2,
}

export enum MessageOptionTypes {
  Referral = "referral",
  AvailableJobs = "available_job",
}

export enum MessageStatuses {
  ok = "ok",
  warning = "warning",
  error = "error",
}
