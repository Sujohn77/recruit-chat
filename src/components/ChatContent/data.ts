import moment from "moment";

import i18n from "services/localization";
import { IMessage, IUserSelf, UserLicenseTypes } from "services/types";
import { MessageTypeId, generateLocalId, getLocalMessage } from "utils/helpers";
import { ISnapshot, MessageType } from "utils/types";

const chatBotSender: IUserSelf = {
  id: -2,
  userLicenseType: UserLicenseTypes.Standard,
  userLicenseTypeId: 1,
};

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
  `Can I refer a friend to ${referralCompanyName} ?`;

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
