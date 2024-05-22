import { ICONS } from "assets";
import { ChatScreens } from "utils/constants";
import { CHAT_ACTIONS, IScreenOption } from "utils/types";

export const defOptions: IScreenOption[] = [
  {
    icon: ICONS.SEARCH_ICON,
    type: CHAT_ACTIONS.FIND_JOB,
    size: "16px",
    screen: ChatScreens.FindAJob,
    i18n: "buttons:find_job",
    i18nProps: null,
  },
  {
    icon: ICONS.QUESTION,
    type: CHAT_ACTIONS.ASK_QUESTION,
    size: "16px",
    screen: ChatScreens.QnA,
    i18n: "buttons:ask_questions",
    i18nProps: null,
  },
];

export const askQuestionOption: IScreenOption[] = [
  {
    icon: ICONS.QUESTION,
    type: CHAT_ACTIONS.ASK_QUESTION,
    size: "16px",
    screen: ChatScreens.QnA,
    i18n: "buttons:ask_questions",
    i18nProps: null,
  },
];

export const optionWithReferral: IScreenOption[] = [
  {
    icon: ICONS.SEARCH_ICON,
    type: CHAT_ACTIONS.MAKE_REFERRAL,
    size: "16px",
    screen: ChatScreens.MakeReferral,
    i18n: "buttons:make_referral",
    i18nProps: null,
  },
  {
    icon: ICONS.QUESTION,
    type: CHAT_ACTIONS.ASK_QUESTION,
    size: "16px",
    screen: ChatScreens.QnA,
    i18n: "buttons:ask_questions",
    i18nProps: null,
  },
];
