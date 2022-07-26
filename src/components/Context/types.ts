
import { CHAT_OPTIONS } from "screens/intro";
import { IMessage } from "services/types";
import { CHAT_TYPE_MESSAGES, ILocalMessage } from "utils/types";

export interface IChatMessangerContext {
    messages: ILocalMessage[];
    chatOption: CHAT_OPTIONS | null;
    serverMessages: IMessage[];
    ownerId: string | null;
    addMessage: (props: IAddMessageProps) => void;
    pushMessage: (message: ILocalMessage[]) => void
    setOption: (option: CHAT_OPTIONS | null) => void
    updateMessages: (serverMessages: IMessage[]) => void
    chooseButtonOption: (text: string) => void
}

export interface IAddMessageProps {
    text: string;
    subType: CHAT_TYPE_MESSAGES;
}