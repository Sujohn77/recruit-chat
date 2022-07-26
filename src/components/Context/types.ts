
import { Dispatch, SetStateAction} from "react";
import { CHAT_OPTIONS } from "screens/intro";
import { IMessage } from "services/types";
import { CHAT_TYPE_MESSAGES, ILocalMessage } from "utils/types";

export interface IChatMessangerContext {
    messages: ILocalMessage[];
    chatOption: CHAT_OPTIONS | null;
    serverMessages: IMessage[];
    ownerId: string | null;
    jobPosition: string | null;
    addMessage: (props: IAddMessageProps) => void;
    pushMessages: (message: ILocalMessage[]) => void
    setOption: (option: CHAT_OPTIONS | null) => void
    updateMessages: (serverMessages: IMessage[]) => void
    chooseButtonOption: (text: string) => void
    popMessage: () => void
    selectJobPosition: Dispatch<React.SetStateAction<string | null>>
}

export interface IFileUploadContext {
    file: File | null;
    saveFile: Dispatch<SetStateAction<File | null>>;
    sendFile: (file: File) => void;
    resetFile: () => void;
    notification: string | null;
    setNotification: Dispatch<SetStateAction<string | null>>;
}

export interface IAddMessageProps {
    text: string;
    subType?: CHAT_TYPE_MESSAGES;
}