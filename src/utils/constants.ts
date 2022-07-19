import SEARCH_ICON from '../assets/imgs/search.png'
import QUESTION from '../assets/imgs/question.png'
import ROB_FACE from '../assets/imgs/rob-face.png'

import OPENED_BURGER from '../assets/icons/openedBurger.svg'
import BURGER from '../assets/icons/burger.svg'
import { CHAT_OPTIONS } from 'screens/intro'


export const ICONS = {
    OPENED_BURGER,
    BURGER
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

export const botTypingTxt = "Bot is typing...";