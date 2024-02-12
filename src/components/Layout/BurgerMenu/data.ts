import i18n from "services/localization";
import { languages } from "utils/constants";
import { CHAT_ACTIONS } from "utils/types";

export const baseWithRfItems = [
  {
    type: CHAT_ACTIONS.CHANGE_LANG,
    text: i18n.t("chat_menu:change_lang"),
    isDropdown: true,
    options: languages,
  },
  {
    type: CHAT_ACTIONS.MAKE_REFERRAL,
    text: i18n.t("buttons:make_referral"),
  },
  {
    type: CHAT_ACTIONS.ASK_QUESTION,
    text: i18n.t("chat_menu:ask_question"),
  },
];

export const baseWithRef = [
  {
    type: CHAT_ACTIONS.CHANGE_LANG,
    text: i18n.t("chat_menu:change_lang"),
    isDropdown: true,
    options: languages,
  },
  {
    type: CHAT_ACTIONS.MAKE_REFERRAL,
    text: i18n.t("buttons:make_referral"),
  },
  {
    type: CHAT_ACTIONS.SEE_MY_REFERRALS,
    text: i18n.t("chat_menu:see_my_referrals"),
  },
  {
    type: CHAT_ACTIONS.ASK_QUESTION,
    text: i18n.t("chat_menu:ask_question"),
  },
];

export const menuItems = [
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

export const menuForCandidateWithEmail = [
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
