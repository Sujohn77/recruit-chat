import i18n from "services/localization";
import { MessageType } from "utils/types";

const defaultQuestions = (referralCompanyName: string | null) => [
  {
    text: i18n.t("questions:recruitment_process"),
    subType: MessageType.BUTTON,
    isChatMessage: true,
    isOwn: true,
    i18n: "questions:recruitment_process",
  },
  {
    text: i18n.t("questions:part_time"),
    subType: MessageType.BUTTON,
    isChatMessage: true,
    isOwn: true,
  },
  {
    text: i18n.t("questions:flexible_work", {
      companyName: referralCompanyName,
    }),
    subType: MessageType.BUTTON,
    isChatMessage: true,
    isOwn: true,
    i18n: "questions:recruitment_process",
    i18nProps: {
      companyName: referralCompanyName,
    },
  },
  {
    text: i18n.t("questions:about_company"),
    subType: MessageType.BUTTON,
    isChatMessage: true,
    isOwn: true,
    i18n: "questions:about_company",
  },
  {
    text: i18n.t("messages:popularQuestions"),
    subType: MessageType.TEXT,
    i18n: "messages:popularQuestions",
  },
];

export const getReferralMessText = (referralCompanyName: string | null) =>
  i18n.t("questions:refer_friend", { referralCompanyName });

export const getQuestions = (
  withReferralFlow: boolean,
  referralCompanyName: string | null
) => {
  if (withReferralFlow && referralCompanyName) {
    return [
      {
        text: getReferralMessText(referralCompanyName),
        subType: MessageType.BUTTON,
        isChatMessage: true,
        isOwn: true,
        i18n: "questions:refer_friend",
        i18nProps: {
          companyName: referralCompanyName,
        },
      },
      ...defaultQuestions(referralCompanyName),
    ];
  }

  return defaultQuestions(referralCompanyName);
};

export const findJobMessages = [
  {
    subType: MessageType.BUTTON,
    text: i18n.t("messages:answerQuestions"),
    isOwn: true,
    isChatMessage: true,
    is18n: "messages:answerQuestions",
  },
  {
    subType: MessageType.BUTTON,
    text: i18n.t("messages:uploadCV"),
    isOwn: true,
    isChatMessage: true,
    is18n: "messages:uploadCV",
  },
  {
    subType: MessageType.TEXT,
    text: i18n.t("messages:please_choose"),
    is18n: "messages:please_choose",
  },
];
