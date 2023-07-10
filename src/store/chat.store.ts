import { create } from "zustand";
import { ApiResponse } from "apisauce";
import map from "lodash/map";
import moment from "moment";

import { apiInstance } from "services/api";
import { generateLocalId } from "utils/helpers";
import { IAskAQuestionResponse } from "services/types";
import { getChatActionResponse } from "utils/constants";
import { CHAT_ACTIONS, ILocalMessage, MessageType } from "utils/types";

export interface IChatState {
  isLoading: boolean;
  messages: ILocalMessage[];

  addNewMess: (message: ILocalMessage) => void;
  addNewMessages: (messages: ILocalMessage[]) => void;
  askAQuestion: (question: string) => Promise<void>;
  setIsLoading: (isLoading: boolean) => void;
}

export const useChatStore = create<IChatState>((set, get) => ({
  isLoading: false,
  messages: [],

  setIsLoading(isLoading) {
    set(() => ({ isLoading }));
  },

  addNewMess(message: ILocalMessage) {
    set(() => ({ messages: [message, ...get().messages] }));
  },
  addNewMessages(messages: ILocalMessage[]) {
    set(() => ({ messages: [...messages, ...get().messages] }));
  },
  askAQuestion: async (question: string) => {
    const { addNewMess, addNewMessages, setIsLoading } = get();
    const withoutAnswer: ILocalMessage = {
      isOwn: false,
      content: {
        subType: MessageType.TEXT,
        // TODO: add translate
        text: "Sorry, I don't have an answer to that question yet...",
      },
      localId: generateLocalId(),
      _id: null,
      dateCreated: { seconds: moment().unix() },
    };
    const questionMessage: ILocalMessage = {
      _id: generateLocalId(),
      localId: generateLocalId(),
      content: {
        subType: MessageType.TEXT,
        text: question.trim(),
      },
      isOwn: true,
    };

    addNewMess(questionMessage);

    try {
      setIsLoading(true);

      const data = {
        question: question,
        languageCode: "en",
        options: {
          answersNumber: 1,
          includeUnstructuredSources: true,
          confidenceScoreThreshold: 0.5,
        },
      };
      const response: ApiResponse<IAskAQuestionResponse> =
        await apiInstance.askAQuestion(data);

      if (response.data?.answers.length) {
        const answers: ILocalMessage[] = map(
          response.data?.answers,
          (answer) => ({
            content: {
              subType: MessageType.TEXT,
              text: answer,
            },
            isOwn: false,
            localId: generateLocalId(),
            _id: null,
            dateCreated: { seconds: moment().unix() },
          })
        );
        const hiringProcessMessage = getChatActionResponse({
          type: CHAT_ACTIONS.HIRING_PROCESS,
        });
        addNewMessages([...hiringProcessMessage, ...answers]);
      } else if (!response.data?.answers.length) {
        addNewMess(withoutAnswer);
      }
    } catch (error) {
      addNewMess(withoutAnswer);
    } finally {
      setIsLoading(false);
    }
  },
}));
