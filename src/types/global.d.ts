import { IChatMessengerContext } from "contexts/types";

// global.d.ts
export {};

declare global {
  interface Window {
    __chatbot: {
      CODE_VERSION: string | number;
      type: string;
      state: IChatMessengerContext;
    };
  }
}
