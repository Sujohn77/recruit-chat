import i18n from "services/localization";
import { MessageType } from "utils/types";

const defaultQuestions = [
  {
    text: i18n.t("questions:recruitment_process"),
    subType: MessageType.BUTTON,
    isChatMessage: true,
    isOwn: true,
  },
  {
    text: i18n.t("questions:part_time"),
    subType: MessageType.BUTTON,
    isChatMessage: true,
    isOwn: true,
  },
  {
    text: i18n.t("questions:flexible_work"),
    subType: MessageType.BUTTON,
    isChatMessage: true,
    isOwn: true,
  },
  {
    text: i18n.t("questions:about_company"),
    subType: MessageType.BUTTON,
    isChatMessage: true,
    isOwn: true,
  },
  {
    text: i18n.t("messages:popularQuestions"),
    subType: MessageType.TEXT,
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
      },
      ...defaultQuestions,
    ];
  }

  return defaultQuestions;
};

export const findJobMessages = [
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
