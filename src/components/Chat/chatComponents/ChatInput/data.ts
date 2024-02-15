import i18n from "services/localization";
import { MessageOptionTypes, ReferralResponse } from "utils/constants";
import { generateLocalId } from "utils/helpers";
import { ILocalMessage, MessageType } from "utils/types";

export enum ReferralSteps {
  EmployeeId,
  ReferralLastName,
  ReferralBirth,
  UserFirstName,
  UserLastName,
  UserEmail,
  UserConfirmationEmail,
  UserMobileNumber,
}

export const getReferralQuestion = (step: ReferralSteps): ILocalMessage => {
  switch (step) {
    case ReferralSteps.EmployeeId:
      return {
        isOwn: false,
        localId: generateLocalId(),
        content: {
          subType: MessageType.TEXT,
          text: i18n.t("referral:lastname"),
        },
        _id: generateLocalId(),
      };
    case ReferralSteps.ReferralLastName:
      return {
        isOwn: false,
        localId: generateLocalId(),
        content: {
          subType: MessageType.TEXT,
          text: i18n.t("referral:birth"),
        },
        _id: generateLocalId(),
      };
    case ReferralSteps.ReferralBirth:
      return {
        isOwn: false,
        localId: generateLocalId(),
        content: {
          subType: MessageType.TEXT,
          text: i18n.t("referral:thanks"),
        },
        _id: generateLocalId(),
      };
    case ReferralSteps.UserFirstName:
      return {
        isOwn: false,
        localId: generateLocalId(),
        content: {
          subType: MessageType.TEXT,
          text: i18n.t("referral:friend_firstname"),
        },
        _id: generateLocalId(),
      };
    case ReferralSteps.UserLastName:
      return {
        isOwn: false,
        localId: generateLocalId(),
        content: {
          subType: MessageType.TEXT,
          text: i18n.t("referral:friend_lastname"),
        },
        _id: generateLocalId(),
      };
    case ReferralSteps.UserEmail:
      return {
        isOwn: false,
        localId: generateLocalId(),
        content: {
          subType: MessageType.TEXT,
          text: i18n.t("referral:friend_email"),
        },
        _id: generateLocalId(),
      };
    case ReferralSteps.UserConfirmationEmail:
      return {
        isOwn: false,
        localId: generateLocalId(),
        content: {
          subType: MessageType.TEXT,
          text: i18n.t("referral:confirm_email"),
        },
        _id: generateLocalId(),
      };
    case ReferralSteps.UserMobileNumber:
      return {
        isOwn: false,
        localId: generateLocalId(),
        content: {
          subType: MessageType.TEXT,
          text: i18n.t("referral:friend_mobile_number"),
        },
        _id: generateLocalId(),
      };

    default:
      return {
        _id: null,
        content: { subType: MessageType.TEXT },
        localId: generateLocalId(),
      };
  }
};

export const getReferralResponseMess = (
  previouslyReferredState: ReferralResponse,
  refFirstName?: string,
  refLastName?: string,
  refCompanyName?: string | null
): string => {
  switch (previouslyReferredState) {
    case 0:
      return i18n.t("referral:thanks_you");
    case 1:
      return i18n.t("referral:previously_referred", {
        refFirstName,
        refLastName,
      });
    case 2:
      return i18n.t("referral:previously_referred_to_company", {
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
  userLastName: string
): ILocalMessage => ({
  isOwn: false,
  localId: generateLocalId(),
  content: {
    subType: MessageType.TEXT,
    text: i18n.t("referral:referral_options", { userLastName: userLastName }),
  },
  _id: generateLocalId(),
  optionList: {
    type: MessageOptionTypes.AvailableJobs,
    isActive: true,
    options: [
      {
        id: 1,
        itemId: 1,
        isSelected: false,
        name: i18n.t("referral:job_in_my_area"),
        text: i18n.t("referral:job_in_my_area"),
      },
      {
        id: 2,
        itemId: 2,
        isSelected: false,
        name: i18n.t("referral:job_in_my_area", { title: searchCategory }),
        text: i18n.t("referral:job_in_my_area", { title: searchCategory }),
      },
      {
        id: 3,
        itemId: 3,
        isSelected: false,
        name: i18n.t("referral:any_job"),
        text: i18n.t("referral:any_job"),
      },
      {
        id: 4,
        itemId: 4,
        isSelected: false,
        name: i18n.t("referral:general_referral"),
        text: i18n.t("referral:general_referral"),
      },
    ],
  },
});
