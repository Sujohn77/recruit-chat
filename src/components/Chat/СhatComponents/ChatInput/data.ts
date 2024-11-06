import i18n from "services/localization";
import { IMessageOption } from "services/types";
import { MessageOptionTypes, ReferralResponse } from "utils/constants";
import { createTextMess, generateLocalId } from "utils/helpers";
import { ILocalMessage, MessageType } from "utils/types";

export enum ReferralSteps {
  EmployeeId = "employeeId",
  ReferralLastName = "referralLastName",
  ReferralBirth = "referralBirth",
  UserFirstName = "userFirstName",
  UserLastName = "userLastName",
  UserEmail = "userEmail",
  UserConfirmationEmail = "userConfirmationEmail",
  UserMobileNumber = "userMobileNumber",
}

export const getReferralQuestion = (step: ReferralSteps): ILocalMessage => {
  const dateCreated = {
    seconds: new Date().getTime(),
  };

  switch (step) {
    case ReferralSteps.EmployeeId:
      return {
        isOwn: false,
        localId: generateLocalId(),
        content: {
          subType: MessageType.TEXT,
          text: i18n.t("referral:lastname"),
          i18n: "referral:lastname",
          i18nProps: null,
        },
        _id: generateLocalId(),
        dateCreated,
      };
    case ReferralSteps.ReferralLastName:
      return {
        isOwn: false,
        localId: generateLocalId(),
        content: {
          subType: MessageType.TEXT,
          text: i18n.t("referral:birth"),
          i18n: "referral:birth",
          i18nProps: null,
        },
        _id: generateLocalId(),
        dateCreated,
      };
    case ReferralSteps.ReferralBirth:
      return {
        isOwn: false,
        localId: generateLocalId(),
        content: {
          subType: MessageType.TEXT,
          text: i18n.t("referral:thanks"),
          i18n: "referral:thanks",
          i18nProps: null,
        },
        _id: generateLocalId(),
        dateCreated,
      };
    case ReferralSteps.UserFirstName:
      return {
        isOwn: false,
        localId: generateLocalId(),
        content: {
          subType: MessageType.TEXT,
          text: i18n.t("referral:friend_firstname"),
          i18n: "referral:friend_firstname",
          i18nProps: null,
        },
        _id: generateLocalId(),
        dateCreated,
      };
    case ReferralSteps.UserLastName:
      return {
        isOwn: false,
        localId: generateLocalId(),
        content: {
          subType: MessageType.TEXT,
          text: i18n.t("referral:friend_lastname"),
          i18n: "referral:friend_lastname",
          i18nProps: null,
        },
        _id: generateLocalId(),
        dateCreated,
      };
    case ReferralSteps.UserEmail:
      return {
        isOwn: false,
        localId: generateLocalId(),
        content: {
          subType: MessageType.TEXT,
          text: i18n.t("referral:friend_email"),
          i18n: "referral:friend_email",
          i18nProps: null,
        },
        _id: generateLocalId(),
        dateCreated,
      };
    case ReferralSteps.UserConfirmationEmail:
      return {
        isOwn: false,
        localId: generateLocalId(),
        content: {
          subType: MessageType.TEXT,
          text: i18n.t("referral:confirm_email"),
          i18n: "referral:confirm_email",
          i18nProps: null,
        },
        _id: generateLocalId(),
        dateCreated,
      };
    case ReferralSteps.UserMobileNumber:
      return {
        isOwn: false,
        localId: generateLocalId(),
        content: {
          subType: MessageType.TEXT,
          text: i18n.t("referral:friend_mobile_number"),
          i18n: "referral:friend_mobile_number",
          i18nProps: null,
        },
        _id: generateLocalId(),
        dateCreated,
      };

    default:
      return {
        _id: null,
        content: { subType: MessageType.TEXT, i18n: "", i18nProps: null },
        localId: generateLocalId(),
        isOwn: false,
        dateCreated,
      };
  }
};

export const getReferralResponseMess = (
  previouslyReferredState: ReferralResponse,
  refFirstName?: string,
  refLastName?: string,
  refCompanyName?: string | null,
  isI18nPhase = false
): string => {
  switch (previouslyReferredState) {
    case 0:
      return isI18nPhase
        ? "referral:thanks_you"
        : i18n.t("referral:thanks_you");

    case 1:
      return isI18nPhase
        ? "referral:previously_referred"
        : i18n.t("referral:previously_referred", {
            refFirstName,
            refLastName,
          });
    case 2:
      return isI18nPhase
        ? "referral:previously_referred_to_company"
        : i18n.t("referral:previously_referred_to_company", {
            refFirstName,
            refLastName,
            refCompanyName,
          });
    default:
      return "";
  }
};

export const getValidationRefResponse = (
  searchCategory: string,
  fullName: string,
  isValidation: boolean,
  withReferralsHistoryBtn = false
): ILocalMessage =>
  createTextMess({
    text: withReferralsHistoryBtn
      ? i18n.t("referral:ok") + i18n.t("referral:referral_options")
      : isValidation
      ? i18n.t("referral:successful_validation", { userLastName: fullName }) +
        i18n.t("referral:referral_options")
      : i18n.t("referral:referral_options"),
    i18n: withReferralsHistoryBtn
      ? ""
      : isValidation
      ? ""
      : "referral:referral_options",
    optionList: {
      type: MessageOptionTypes.AvailableJobs,
      isActive: true,
      options: getReferralOptions(searchCategory, withReferralsHistoryBtn),
    },
    dateCreated: {
      seconds: new Date().getTime(),
    },
  });

const getReferralOptions = (
  searchCategory: string,
  withReferralHistoryBtn = false
): IMessageOption[] =>
  withReferralHistoryBtn
    ? [
        {
          id: 1,
          itemId: 1,
          isSelected: false,
          name: i18n.t("referral:job_in_my_area"),
          text: i18n.t("referral:job_in_my_area"),
          i18nPhrase: "referral:job_in_my_area",
        },
        {
          id: 2,
          itemId: 2,
          isSelected: false,
          name: i18n.t("referral:jobs", { title: searchCategory }),
          text: i18n.t("referral:jobs", { title: searchCategory }),
          i18nPhrase: "referral:jobs",
          i18nProps: { title: searchCategory },
        },
        {
          id: 3,
          itemId: 3,
          isSelected: false,
          name: i18n.t("referral:any_job"),
          text: i18n.t("referral:any_job"),
          i18nPhrase: "referral:any_job",
        },
        {
          id: 4,
          itemId: 4,
          isSelected: false,
          name: i18n.t("referral:general_referral"),
          text: i18n.t("referral:general_referral"),
          i18nPhrase: "referral:general_referral",
        },
        {
          id: 5,
          itemId: 5,
          isSelected: false,
          name: i18n.t("chat_menu:see_my_referrals"),
          text: i18n.t("chat_menu:see_my_referrals"),
          i18nPhrase: "chat_menu:see_my_referrals",
        },
      ]
    : [
        {
          id: 1,
          itemId: 1,
          isSelected: false,
          name: i18n.t("referral:job_in_my_area"),
          text: i18n.t("referral:job_in_my_area"),
          i18nPhrase: "referral:job_in_my_area",
        },
        {
          id: 2,
          itemId: 2,
          isSelected: false,
          name: i18n.t("referral:jobs", { title: searchCategory }),
          text: i18n.t("referral:jobs", { title: searchCategory }),
          i18nPhrase: "referral:jobs",
          i18nProps: { title: searchCategory },
        },
        {
          id: 3,
          itemId: 3,
          isSelected: false,
          name: i18n.t("referral:any_job"),
          text: i18n.t("referral:any_job"),
          i18nPhrase: "referral:any_job",
        },
        {
          id: 4,
          itemId: 4,
          isSelected: false,
          name: i18n.t("referral:general_referral"),
          text: i18n.t("referral:general_referral"),
          i18nPhrase: "referral:general_referral",
        },
      ];

export const getAlertJobMessage = (
  firstName: string,
  lastName: string,
  emailAddress: string
): ILocalMessage => {
  const dateCreated = {
    seconds: new Date().getTime(),
  };
  if (!firstName) {
    return createTextMess({
      text: i18n.t("messages:provide_firstname"),
      i18n: "messages:provide_firstname",
      dateCreated,
    });
  } else if (!lastName) {
    return createTextMess({
      text: i18n.t("messages:provide_lastname"),
      i18n: "messages:provide_lastname",
      dateCreated,
    });
  } else {
    return createTextMess({
      text: i18n.t(
        `messages:${emailAddress ? "emailAlreadyProvided" : "alertEmail"}`
      ),
      i18n: `messages:${emailAddress ? "emailAlreadyProvided" : "alertEmail"}`,
      dateCreated,
    });
  }
};

export const referralOptions = [
  {
    id: 1,
    itemId: 1,
    isSelected: false,
    name: i18n.t("labels:yes"),
    text: i18n.t("labels:yes"),
    i18nPhrase: "labels:yes",
  },
  {
    id: 2,
    itemId: 2,
    isSelected: false,
    name: i18n.t("labels:no"),
    text: i18n.t("labels:no"),
    i18nPhrase: "labels:no",
  },
];
