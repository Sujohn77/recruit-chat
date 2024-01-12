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
          text: "What is your last name?",
        },
        _id: generateLocalId(),
      };
    case ReferralSteps.ReferralLastName:
      return {
        isOwn: false,
        localId: generateLocalId(),
        content: {
          subType: MessageType.TEXT,
          text: "What is your year of birth?",
        },
        _id: generateLocalId(),
      };
    case ReferralSteps.ReferralBirth:
      return {
        isOwn: false,
        localId: generateLocalId(),
        content: {
          subType: MessageType.TEXT,
          text: "Thanks for confirming your employee details.\nTo continue, answer the following questions about your referral.",
        },
        _id: generateLocalId(),
      };
    case ReferralSteps.UserFirstName:
      return {
        isOwn: false,
        localId: generateLocalId(),
        content: {
          subType: MessageType.TEXT,
          text: "What is your Referral's First Name?",
        },
        _id: generateLocalId(),
      };
    case ReferralSteps.UserLastName:
      return {
        isOwn: false,
        localId: generateLocalId(),
        content: {
          subType: MessageType.TEXT,
          text: "What is your Referral's Last Name?",
        },
        _id: generateLocalId(),
      };
    case ReferralSteps.UserEmail:
      return {
        isOwn: false,
        localId: generateLocalId(),
        content: {
          subType: MessageType.TEXT,
          text: "What is your Referral's Email Address?",
        },
        _id: generateLocalId(),
      };
    case ReferralSteps.UserConfirmationEmail:
      return {
        isOwn: false,
        localId: generateLocalId(),
        content: {
          subType: MessageType.TEXT,
          text: "Please confirm your Referral's Email Address",
        },
        _id: generateLocalId(),
      };
    case ReferralSteps.UserMobileNumber:
      return {
        isOwn: false,
        localId: generateLocalId(),
        content: {
          subType: MessageType.TEXT,
          text: "What is your Referral's Mobile Number?",
        },
        _id: generateLocalId(),
      };

    default:
      return { _id: null, content: { subType: MessageType.TEXT } };
  }
};
