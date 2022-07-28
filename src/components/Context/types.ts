
import { Dispatch, SetStateAction} from "react";
import { CHAT_OPTIONS } from "screens/intro";
import { IMessage } from "services/types";
import { CHAT_ACTIONS, MessageType, ILocalMessage } from "utils/types";

export interface IChatMessangerContext {
    messages: ILocalMessage[];
    chatOption: CHAT_OPTIONS | null;
    // serverMessages: IMessage[];
    ownerId: string | null;
    category: string | null;
    addMessage: (props: IAddMessageProps) => void;
    pushMessages: (message: ILocalMessage[]) => void;
    setOption: (option: CHAT_OPTIONS | null) => void;
    updateMessages: (serverMessages: IMessage[]) => void;
    chooseButtonOption: (text: string) => void;
    popMessage: () => void;
    triggerAction: (action: ITriggerActionProps) => void;
    locations:string[]
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
    subType?: MessageType;
}
type PayloadType = {
    item?: string | null;
    items?: string[];
}
export interface ITriggerActionProps {type: CHAT_ACTIONS, payload: PayloadType}
export type IResponseAction = {
    [key in CHAT_ACTIONS]?: {
        replaceLatest?: boolean;
        messages: ILocalMessage[];
    };
};