import moment from "moment";

import i18n from "services/localization";
import { IMessage, IUserSelf, UserLicenseTypes } from "services/types";
import { MessageTypeId, getLocalMessage } from "utils/helpers";
import { ISnapshot, MessageType } from "utils/types";

const chatBotSender: IUserSelf = {
  id: -2,
  userLicenseType: UserLicenseTypes.Standard,
  userLicenseTypeId: 1,
};

export const questions = [
  {
    text: i18n.t("messages:whatHiring"),
    subType: MessageType.BUTTON,
    isChatMessage: true,
    isOwn: true,
  },
  {
    text: i18n.t("messages:howSubmitCV"),
    subType: MessageType.BUTTON,
    isChatMessage: true,
    isOwn: true,
  },
  {
    text: i18n.t("messages:howMuchExperience"),
    subType: MessageType.BUTTON,
    isChatMessage: true,
    isOwn: true,
  },
  {
    text: i18n.t("messages:popularQuestions"),
    subType: MessageType.TEXT,
  },
];

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

// For messages from firebase

export const getQnAMessages = (): ISnapshot<IMessage>[] => {
  const questions: IMessage[] = [
    {
      text: i18n.t("messages:whatHiring"),
      subType: MessageType.BUTTON,
      isChatMessage: true,
      isOwn: true,
      dateCreated: { seconds: moment.now() },
      content: {
        text: i18n.t("messages:whatHiring"),
        contextId: null,
        subType: MessageType.BUTTON,
        url: null,
        subTypeId: null,
        typeId: MessageTypeId.text,
      },
      sender: chatBotSender,
      chatItemId: 1650294333,
    },
    {
      text: i18n.t("messages:howSubmitCV"),
      subType: MessageType.BUTTON,
      isChatMessage: true,
      isOwn: true,
      dateCreated: { seconds: moment.now() },
      content: {
        text: i18n.t("messages:howSubmitCV"),
        contextId: null,
        subType: MessageType.BUTTON,
        url: null,
        subTypeId: null,
        typeId: MessageTypeId.text,
      },
      sender: chatBotSender,
      chatItemId: 62135596800,
    },
    {
      text: i18n.t("messages:howMuchExperience"),
      subType: MessageType.BUTTON,
      isChatMessage: true,
      isOwn: true,
      dateCreated: { seconds: moment.now() },
      content: {
        text: i18n.t("messages:howMuchExperience"),
        contextId: null,
        subType: MessageType.BUTTON,
        url: null,
        subTypeId: null,
        typeId: MessageTypeId.text,
      },
      sender: chatBotSender,
      chatItemId: 49530690,
    },
  ];

  return questions
    .map((question) => getLocalMessage(chatBotSender, undefined, question))
    .map((message) => ({
      data: message,
      type: "added",
    }));
};

export const getFindJobMessages = (): ISnapshot<IMessage>[] => {
  const findJobMessages: IMessage[] = [
    {
      subType: MessageType.BUTTON,
      text: i18n.t("messages:answerQuestions"),
      isOwn: true,
      isChatMessage: true,
      dateCreated: { seconds: moment.now() },
      content: {
        text: i18n.t("messages:answerQuestions"),
        contextId: null,
        subType: MessageType.BUTTON,
        url: null,
        subTypeId: null,
        typeId: MessageTypeId.text,
      },
      sender: chatBotSender,
      chatItemId: 763293000,
    },
    {
      subType: MessageType.BUTTON,
      text: i18n.t("messages:uploadCV"),
      isOwn: true,
      isChatMessage: true,
      dateCreated: { seconds: moment.now() },
      content: {
        text: i18n.t("messages:uploadCV"),
        contextId: null,
        subType: MessageType.BUTTON,
        url: null,
        subTypeId: null,
        typeId: MessageTypeId.text,
      },
      sender: chatBotSender,
      chatItemId: 1659342828,
    },
    {
      subType: MessageType.TEXT,
      text: "Please choose one of the following options to begin your job search",
      dateCreated: { seconds: moment.now() },
      content: {
        text: "Please choose one of the following options to begin your job search",
        contextId: null,
        subType: MessageType.BUTTON,
        url: null,
        subTypeId: null,
        typeId: MessageTypeId.text,
      },
      sender: chatBotSender,
      chatItemId: 1650294121,
    },
  ];

  return findJobMessages
    .map((mess) => getLocalMessage(chatBotSender, undefined, mess))
    .map((m) => ({
      data: m,
      type: "added",
    }));
};