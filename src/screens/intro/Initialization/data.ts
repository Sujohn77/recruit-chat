import { ICONS } from "assets";
import i18n from "services/localization";
import { ChatScreens } from "utils/constants";
import { CHAT_ACTIONS, IScreenOption } from "utils/types";

export const options: IScreenOption[] = [
  {
    icon: ICONS.SEARCH_ICON,
    message: i18n.t("buttons:find_job"),
    type: CHAT_ACTIONS.FIND_JOB,
    size: "16px",
    screen: ChatScreens.FindAJob,
  },
  {
    icon: ICONS.QUESTION,
    message: i18n.t("buttons:ask_questions"),
    type: CHAT_ACTIONS.ASK_QUESTION,
    size: "16px",
    screen: ChatScreens.QnA,
  },
];

export const optionWithReferral: IScreenOption[] = [
  {
    icon: ICONS.SEARCH_ICON,
    message: i18n.t("buttons:make_referral"),
    type: CHAT_ACTIONS.MAKE_REFERRAL,
    size: "16px",
    screen: ChatScreens.MakeReferral,
  },
  {
    icon: ICONS.QUESTION,
    message: i18n.t("buttons:ask_questions"),
    type: CHAT_ACTIONS.ASK_QUESTION,
    size: "16px",
    screen: ChatScreens.QnA,
  },
];
