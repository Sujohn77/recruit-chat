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
          text: "What is your friend's first name?",
        },
        _id: generateLocalId(),
      };
    case ReferralSteps.UserLastName:
      return {
        isOwn: false,
        localId: generateLocalId(),
        content: {
          subType: MessageType.TEXT,
          text: "What is your friend's last name?",
        },
        _id: generateLocalId(),
      };
    case ReferralSteps.UserEmail:
      return {
        isOwn: false,
        localId: generateLocalId(),
        content: {
          subType: MessageType.TEXT,
          text: "What is your friend's  email address?",
        },
        _id: generateLocalId(),
      };
    case ReferralSteps.UserConfirmationEmail:
      return {
        isOwn: false,
        localId: generateLocalId(),
        content: {
          subType: MessageType.TEXT,
          text: "Please confirm your friend's email address",
        },
        _id: generateLocalId(),
      };
    case ReferralSteps.UserMobileNumber:
      return {
        isOwn: false,
        localId: generateLocalId(),
        content: {
          subType: MessageType.TEXT,
          text: "What is your friend's mobile number?",
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
      return "Thank you for your referral";
    case 1:
      return `You have previously referred ${refFirstName} ${refLastName} to this job`;
    case 2:
      return `You have previously referred ${refFirstName} ${refLastName} to ${refCompanyName}`;
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
    text: `Hi ${userLastName}, thanks for validating!
          
      \nTo refer a friend to a job, firstly choose one of the following options to narrow down the jobs available. You can choose to refer to jobs in your area, your job group or any job`,
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
        name: "Jobs in my area",
        text: "Jobs in my area",
      },
      {
        id: 2,
        itemId: 2,
        isSelected: false,
        name: `${searchCategory} jobs`,
        text: `${searchCategory} jobs`,
      },
      {
        id: 3,
        itemId: 3,
        isSelected: false,
        name: "Any job",
        text: "Any job",
      },
      {
        id: 4,
        itemId: 4,
        isSelected: false,
        name: "General Referral",
        text: "General Referral",
      },
    ],
  },
});
