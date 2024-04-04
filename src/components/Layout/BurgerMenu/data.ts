import i18n from "services/localization";
import { CHAT_ACTIONS } from "utils/types";

export const baseWithRefItems = (
  languages: string[],
  isMultiLanguage: boolean
) => {
  const base = [
    {
      type: CHAT_ACTIONS.MAKE_REFERRAL,
      text: i18n.t("buttons:make_referral"),
      i18n: "buttons:make_referral",
    },
    {
      type: CHAT_ACTIONS.ASK_QUESTION,
      text: i18n.t("chat_menu:ask_question"),
      i18n: "chat_menu:ask_question",
    },
  ];

  return isMultiLanguage
    ? [
        {
          type: CHAT_ACTIONS.CHANGE_LANG,
          text: i18n.t("chat_menu:change_lang"),
          isDropdown: true,
          options: languages,
          i18n: "chat_menu:change_lang",
        },
        ...base,
      ]
    : base;
};

export const baseWithRef = (languages: string[], isMultiLanguage: boolean) => {
  const base = [
    {
      type: CHAT_ACTIONS.MAKE_REFERRAL,
      text: i18n.t("buttons:make_referral"),
      i18n: "buttons:make_referral",
    },
    {
      type: CHAT_ACTIONS.SEE_MY_REFERRALS,
      text: i18n.t("chat_menu:see_my_referrals"),
      i18n: "chat_menu:see_my_referrals",
    },
    {
      type: CHAT_ACTIONS.ASK_QUESTION,
      text: i18n.t("chat_menu:ask_question"),
      i18n: "chat_menu:ask_question",
    },
  ];

  return isMultiLanguage
    ? [
        {
          type: CHAT_ACTIONS.CHANGE_LANG,
          text: i18n.t("chat_menu:change_lang"),
          isDropdown: true,
          options: languages,
          i18n: "hat_menu:change_lang",
        },
        ...base,
      ]
    : base;
};

export const menuItems = (languages: string[], isMultiLanguage: boolean) => {
  const base = [
    {
      type: CHAT_ACTIONS.FIND_JOB,
      text: i18n.t("chat_menu:find_job"),
      i18n: "chat_menu:find_job",
    },
    {
      type: CHAT_ACTIONS.ASK_QUESTION,
      text: i18n.t("chat_menu:ask_question"),
      i18n: "chat_menu:ask_question",
    },
  ];

  return isMultiLanguage
    ? [
        {
          type: CHAT_ACTIONS.CHANGE_LANG,
          text: i18n.t("chat_menu:change_lang"),
          isDropdown: true,
          options: languages,
          i18n: "chat_menu:change_lang",
        },
        ...base,
      ]
    : base;
};

export const menuForCandidateWithEmail = (
  languages: string[],
  isMultiLanguage: boolean
) => {
  const base = [
    {
      type: CHAT_ACTIONS.SAVE_TRANSCRIPT,
      text: i18n.t("chat_menu:save_transcript"),
      i18n: "chat_menu:save_transcript",
    },

    {
      type: CHAT_ACTIONS.FIND_JOB,
      text: i18n.t("chat_menu:find_job"),
      i18n: "chat_menu:find_job",
    },
    {
      type: CHAT_ACTIONS.ASK_QUESTION,
      text: i18n.t("chat_menu:ask_question"),
      i18n: "chat_menu:ask_question",
    },
  ];

  return isMultiLanguage
    ? [
        {
          type: CHAT_ACTIONS.CHANGE_LANG,
          text: i18n.t("chat_menu:change_lang"),
          isDropdown: true,
          options: languages,
          i18n: "chat_menu:change_lang",
        },
        ...base,
      ]
    : base;
};
