// import SEARCH_ICON from '../assets/imgs/search.png'

import UPLOAD_FILE from '../assets/imgs/file.png'
import CLOCK from '../assets/imgs/clock.png'

import OPENED_BURGER from '../assets/icons/openedBurger.svg'
import BURGER from '../assets/icons/burger.svg'
import INPUT_PLANE from '../assets/icons/plane.svg'
import ATTACHED_FILE from '../assets/icons/attachedFile.svg'
import { CHAT_OPTIONS } from 'screens/intro'
import { HTTPStatusCodes } from './types'

export const IMAGES = {
  UPLOAD_FILE,
  CLOCK
}
export const ICONS = {
    OPENED_BURGER,
    BURGER,
    INPUT_PLANE,
    ATTACHED_FILE
}

export const defaultChatHistory = {
  [CHAT_OPTIONS.FIND_JOB]: {
    initialMessages: [
      {
        text: "Lorem ipsum dolor sit amet",
      },
      {
        isOwner: true,
        text: "Find a job",
      },
    ],
  },
  [CHAT_OPTIONS.ASK_QUESTION]: {
    initialMessages: [
      {
        text: "Lorem ipsum dolor sit amet",
      },
      {
        isOwner: true,
        text: "Ask a question",
      },
    ],
  },
};

// TODO: fix mock
export const positions = ["Devops", "Developer ios", "Developer backend"];
export const locations = ["Oslo", "Liverpool", "Toronto"];

export const botTypingTxt = "Bot is typing...";
export const wrongFormat = "Wrong format. Try again...";

export const categoryHeaderName = 'Searched category title';
export const locationHeaderName = 'Searched location';

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

export enum ChannelName  {
  SMS = 'SMS'
}