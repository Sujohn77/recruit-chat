import { Dispatch, SetStateAction } from 'react';
import { CHAT_OPTIONS } from 'screens/intro';
import { IMessage, ISnapshot } from 'services/types';
import {
  CHAT_ACTIONS,
  MessageType,
  ILocalMessage,
  USER_INPUTS,
} from 'utils/types';

export interface IChatMessangerContext {
  messages: ILocalMessage[];
  chatOption: CHAT_OPTIONS | null;
  categories: string[];
  category: string | null;
  addMessage: (props: IAddMessageProps) => void;
  pushMessages: (message: ILocalMessage[]) => void;
  setOption: (option: CHAT_OPTIONS | null) => void;
  chooseButtonOption: (text: string) => void;
  popMessage: () => void;
  triggerAction: (action: ITriggerActionProps) => void;
  locations: string[];
  setSnapshotMessages: (messsageSnapshots: ISnapshot<IMessage>[]) => void;
  setLastActionType: React.Dispatch<React.SetStateAction<CHAT_ACTIONS>>;
  changeLang: (lang: string) => void;
  lastActionType: CHAT_ACTIONS | undefined;
  offerJobs: string[];
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
  isCategory?: boolean;
  isChatMessage?: boolean;
}
type PayloadType = {
  item?: string | null;
  items?: string[];
};
export interface ITriggerActionProps {
  type: CHAT_ACTIONS;
  payload?: PayloadType;
  isResponseFirst?: boolean;
}
export type IResponseAction = {
  [key in CHAT_ACTIONS]?: {
    replaceLatest?: boolean;
    messages: ILocalMessage[];
  };
};
export type IResponseInput = {
  [key in USER_INPUTS]?: {
    replaceLatest?: boolean;
    messages: ILocalMessage[];
  };
};

export enum ServerMessageType {
  Text = 'text',
  Transcript = 'transcript_sent',
  Video = 'video_uploaded',
  ChatCreated = 'chat_created',
  Document = 'document_uploaded',
  File = 'resume_uploaded',
  UnreadMessages = 'unread_messages',
  Date = 'date',
}

export interface IPortionMessages extends ISnapshot<IMessage> {}
