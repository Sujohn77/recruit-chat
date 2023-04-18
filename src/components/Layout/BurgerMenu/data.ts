import i18n from "services/localization";
import { languages } from "utils/constants";
import { CHAT_ACTIONS } from "utils/types";

export const menuItems = [
  {
    type: CHAT_ACTIONS.SAVE_TRANSCRIPT,
    text: i18n.t("chat_menu:save_transcript"),
  },
  {
    type: CHAT_ACTIONS.CHANGE_LANG,
    text: i18n.t("chat_menu:change_lang"),
    isDropdown: true,
    options: languages,
  },
  {
    type: CHAT_ACTIONS.FIND_JOB,
    text: i18n.t("chat_menu:find_job"),
  },
  {
    type: CHAT_ACTIONS.ASK_QUESTION,
    text: i18n.t("chat_menu:ask_question"),
  },
];
