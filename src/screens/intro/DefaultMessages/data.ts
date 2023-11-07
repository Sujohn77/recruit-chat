import { ICONS } from "assets";
import i18n from "services/localization";
import { CHAT_ACTIONS } from "utils/types";

export const defMessages = {
  options: [
    {
      icon: ICONS.SEARCH_ICON,
      message: i18n.t("buttons:find_job"),
      type: CHAT_ACTIONS.FIND_JOB,
      size: "16px",
    },
    {
      icon: ICONS.QUESTION,
      message: i18n.t("buttons:ask_questions"),
      type: CHAT_ACTIONS.ASK_QUESTION,
      size: "16px",
    },
  ],
};
