// import SEARCH_ICON from '../assets/imgs/search.png'

import UPLOAD_FILE from '../assets/imgs/file.png';
import CLOCK from '../assets/imgs/clock.png';

import OPENED_BURGER from '../assets/icons/openedBurger.svg';
import BURGER from '../assets/icons/burger.svg';
import INPUT_PLANE from '../assets/icons/plane.svg';
import ATTACHED_FILE from '../assets/icons/attachedFile.svg';
import FINGER_UP from '../assets/icons/fingerUp.svg';
import { CHAT_OPTIONS } from 'screens/intro';
import { CHAT_ACTIONS, HTTPStatusCodes, MessageType } from './types';
import { generateLocalId, getParsedMessages } from './helpers';
import moment from 'moment';

export const IMAGES = {
  UPLOAD_FILE,
  CLOCK,
};
export const ICONS = {
  OPENED_BURGER,
  BURGER,
  INPUT_PLANE,
  ATTACHED_FILE,
  FINGER_UP,
};

export const currencies = ['$', '€'];

// TODO: fix mock
export const locations = [
  'Oslo, Oslo, Norway',
  'Oslavany, Jihomoravsky kraj, Czechia',
  'Oslomej, Oslomej, Macedonia',
  'Oslo, Minnesota, United States',
];

export const HTTP_RESPONSES = {
  UNAUTHORIZED_401: 401,
  FORBIDDEN_403: 403,
  NOT_FOUND_404: 404,
};

export const HTTP_STATUSES: Record<HTTPStatusCodes, number> = {
  [HTTPStatusCodes.UNAUTHORIZED_401]: HTTP_RESPONSES.UNAUTHORIZED_401,
  [HTTPStatusCodes.FORBIDDEN_403]: HTTP_RESPONSES.FORBIDDEN_403,
  [HTTPStatusCodes.NOT_FOUND_404]: HTTP_RESPONSES.NOT_FOUND_404,
};

export enum ChannelName {
  SMS = 'SMS',
}

export const initialChatMessage = {
  _id: null,
  localId: generateLocalId(),
  content: {
    subType: MessageType.INITIAL_MESSAGE,
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation',
  },
  dateCreated: { seconds: moment().unix() },
  isOwn: false,
};

export const getChatActionMessages = (type: CHAT_ACTIONS) => {
  switch (type) {
    case CHAT_ACTIONS.SET_CATEGORY:
      return [
        {
          subType: MessageType.TEXT,
          text: 'bot message Where do you want to work? This can be your current location or a list of preferred locations.',
        },
      ];
    case CHAT_ACTIONS.SUCCESS_UPLOAD_CV:
      return [
        {
          subType: MessageType.TEXT,
          text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor',
        },
      ];
    case CHAT_ACTIONS.SAVE_TRANSCRIPT:
      return [
        {
          subType: MessageType.EMAIL_FORM,
        },
      ];
    case CHAT_ACTIONS.SEND_EMAIL:
      return [
        {
          subType: MessageType.TRANSCRIPT,
        },
      ];
    case CHAT_ACTIONS.SEND_LOCATIONS:
      return [
        {
          subType: MessageType.JOB_POSITIONS,
        },
        {
          subType: MessageType.TEXT,
          text: 'Thanks Here are your job recommendations based on the information you provided.',
        },
      ];
    case CHAT_ACTIONS.SET_JOB_ALERT:
      return [
        {
          text: 'Which of our job categories are you interested in? \n \n ⁠You can select a single category or multiple.',
          subType: MessageType.TEXT,
        },
        {
          subType: MessageType.TEXT,
          text: 'Set Job Alert',
          isOwn: true,
          isChatMessage: true,
        },
      ];
    case CHAT_ACTIONS.SET_ALERT_CATEGORY:
      return [
        {
          subType: MessageType.TEXT_WITH_CHOICE,
          text: 'How often would you like to receive your job alerts?',
        },
      ];
    case CHAT_ACTIONS.SET_ALERT_PERIOD:
      return [
        {
          subType: MessageType.TEXT,
          text: "What's the best email address to reach you? \n \n We will only contact you for updates and potential job opportunities",
        },
      ];
    case CHAT_ACTIONS.SET_ALERT_EMAIL:
      return [
        {
          subType: MessageType.TEXT,
          text: "You've successfully subscribed to Weekly job alerts.",
        },
      ];
    case CHAT_ACTIONS.APPLY_POSITION:
      return [
        {
          text: 'Please provide your name',
        },
        {
          text: 'Thanks for applying for this position',
        },
      ];
    case CHAT_ACTIONS.INTERESTED_IN:
      return [
        {
          text: "What's your full name?",
        },
        {
          text: 'We have a few questions about your background and experience to get your application started.',
        },
        {
          subType: MessageType.INTERESTED_IN,
          isOwn: true,
          isChatMessage: true,
        },
      ];
    case CHAT_ACTIONS.FIND_JOB:
      return [
        {
          subType: MessageType.BUTTON,
          text: 'Answer questions',
          isOwn: true,
          isChatMessage: true,
        },
        {
          subType: MessageType.BUTTON,
          text: 'Upload CV',
          isOwn: true,
          isChatMessage: true,
        },
        {
          subType: MessageType.TEXT,
          text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor',
        },
      ];
    case CHAT_ACTIONS.ASK_QUESTION:
      return [
        {
          text: 'What is the hiring process?',
          subType: MessageType.BUTTON,
          isChatMessage: true,
          isOwn: true,
        },
        {
          text: 'Can I submit my CV',
          subType: MessageType.BUTTON,
          isChatMessage: true,
          isOwn: true,
        },
        {
          text: 'How much work experience do I need for your company?',
          subType: MessageType.BUTTON,
          isChatMessage: true,
          isOwn: true,
        },
        {
          text: 'OK! Here are a few popular questions to help you get started.',
          subType: MessageType.TEXT,
        },
      ];

    default:
      return [];
  }
};

export const getReplaceMessageType = (type: CHAT_ACTIONS) => {
  switch (type) {
    case CHAT_ACTIONS.SAVE_TRANSCRIPT:
      return MessageType.TEXT;
    case CHAT_ACTIONS.SEND_EMAIL:
      return MessageType.EMAIL_FORM;
    case CHAT_ACTIONS.INTERESTED_IN:
      return MessageType.JOB_POSITIONS;
    default:
      return undefined;
  }
};

export const isPushMessageType = (type: CHAT_ACTIONS) => {
  return type !== CHAT_ACTIONS.INTERESTED_IN;
};

export const getChatActionResponse = (type: CHAT_ACTIONS) => {
  const messages = getChatActionMessages(type);
  const replaceType = getReplaceMessageType(type);
  const isPushMessage = isPushMessageType(type);
  return { messages: getParsedMessages(messages), replaceType, isPushMessage };
};

// export const CHAT_ACTIONS_RESPONSE: IResponseAction = {
//   [CHAT_ACTIONS.SET_CATEGORY]: {
//     replaceLatest: true,
//     messages: getParsedMessages([
//       {
//         subType: MessageType.TEXT,
//         text: 'bot message Where do you want to work? This can be your current location or a list of preferred locations.',
//       },
//     ]),
//   },
//   [CHAT_ACTIONS.SUCCESS_UPLOAD_CV]: {
//     messages: getParsedMessages([
//       {
//         subType: MessageType.TEXT,
//         text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor',
//       },
//     ]),
//   },
//   [CHAT_ACTIONS.SAVE_TRANSCRIPT]: {
//     replaceLatest: true,
//     messages: getParsedMessages([
//       {
//         subType: MessageType.EMAIL_FORM,
//       },
//     ]),
//   },
//   [CHAT_ACTIONS.SEND_EMAIL]: {
//     replaceLatest: true,
//     messages: getParsedMessages([
//       {
//         subType: MessageType.TRANSCRIPT,
//       },
//     ]),
//   },
//   [CHAT_ACTIONS.FETCH_JOBS]: {
//     messages: getParsedMessages([
//       {
//         subType: MessageType.JOB_POSITIONS,
//       },
//       {
//         subType: MessageType.TEXT,
//         text: 'Thanks Here are your job recommendations based on the information you provided.',
//       },
//     ]),
//   },
//   [CHAT_ACTIONS.SET_JOB_ALERT]: {
//     messages: getParsedMessages([
//       {
//         text: 'Which of our job categories are you interested in? \n \n ⁠You can select a single category or multiple.',
//         subType: MessageType.TEXT,
//       },
//       {
//         subType: MessageType.TEXT,
//         text: 'Set Job Alert',
//         isOwn: true,
//         isChatMessage: true,
//       },
//     ]),
//   },
//   [CHAT_ACTIONS.SET_ALERT_CATEGORY]: {
//     messages: getParsedMessages([
//       {
//         subType: MessageType.TEXT_WITH_CHOICE,
//         text: 'How often would you like to receive your job alerts?',
//       },
//     ]),
//   },
//   [CHAT_ACTIONS.SET_ALERT_PERIOD]: {
//     messages: getParsedMessages([
//       {
//         subType: MessageType.TEXT,
//         text: "What's the best email address to reach you? \n \n We will only contact you for updates and potential job opportunities",
//       },
//     ]),
//   },
//   [CHAT_ACTIONS.SET_ALERT_EMAIL]: {
//     messages: getParsedMessages([
//       {
//         subType: MessageType.TEXT,
//         text: "You've successfully subscribed to Weekly job alerts.",
//       },
//     ]),
//   },
// };

export enum EnvironmentMode {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

export const languages = ['EN', 'FR', 'UA'];
