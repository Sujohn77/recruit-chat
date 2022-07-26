// import SEARCH_ICON from '../assets/imgs/search.png'

import UPLOAD_FILE from '../assets/imgs/file.png'

import OPENED_BURGER from '../assets/icons/openedBurger.svg'
import BURGER from '../assets/icons/burger.svg'
import INPUT_PLANE from '../assets/icons/plane.svg'
import ATTACHED_FILE from '../assets/icons/attachedFile.svg'
import { CHAT_OPTIONS } from 'screens/intro'

export const IMAGES = {
  UPLOAD_FILE,
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