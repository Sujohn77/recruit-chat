// import SEARCH_ICON from '../assets/imgs/search.png'

import UPLOAD_FILE from '../assets/imgs/file.png';
import CLOCK from '../assets/imgs/clock.png';

import OPENED_BURGER from '../assets/icons/openedBurger.svg';
import BURGER from '../assets/icons/burger.svg';
import INPUT_PLANE from '../assets/icons/plane.svg';
import ATTACHED_FILE from '../assets/icons/attachedFile.svg';
import { CHAT_OPTIONS } from 'screens/intro';
import {
  CHAT_ACTIONS,
  HTTPStatusCodes,
  MessageType,
  USER_INPUTS,
} from './types';
import { generateLocalId, getParsedMessages } from './helpers';
import moment from 'moment';
import { IResponseAction, IResponseInput } from 'contexts/types';

export const IMAGES = {
  UPLOAD_FILE,
  CLOCK,
};
export const ICONS = {
  OPENED_BURGER,
  BURGER,
  INPUT_PLANE,
  ATTACHED_FILE,
};

export const defaultChatHistory = {
  [CHAT_OPTIONS.FIND_JOB]: {
    initialMessages: [
      {
        text: 'Lorem ipsum dolor sit amet',
      },
      {
        isOwner: true,
        text: 'Find a job',
      },
    ],
  },
  [CHAT_OPTIONS.ASK_QUESTION]: {
    initialMessages: [
      {
        text: 'Lorem ipsum dolor sit amet',
      },
      {
        isOwner: true,
        text: 'Ask a question',
      },
    ],
  },
};

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
    case CHAT_ACTIONS.INTERESTED_IN:
      return [
        {
          text: 'Please provide your name',
        },
        {
          text: 'Thanks for applying for this position',
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
    default:
      return undefined;
  }
};

export const getChatActionResponse = (type: CHAT_ACTIONS) => {
  const messages = getChatActionMessages(type);
  const replaceType = getReplaceMessageType(type);
  return { messages: getParsedMessages(messages), replaceType };
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
