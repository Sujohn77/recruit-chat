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
  categories: string[];
  category: string | null;
  addMessage: (props: IAddMessageProps) => void;
  pushMessages: (message: ILocalMessage[]) => void;
  chooseButtonOption: (text: string) => void;
  popMessage: () => void;
  triggerAction: (action: ITriggerActionProps) => void;
  locations: string[];
  setSnapshotMessages: (messsageSnapshots: ISnapshot<IMessage>[]) => void;
  setLastActionType: React.Dispatch<React.SetStateAction<CHAT_ACTIONS>>;
  changeLang: (lang: string) => void;
  lastActionType: CHAT_ACTIONS | undefined;
  offerJobs: IJobPosition[];
  alertCategory: string | null;
  error: string | null;
  setError: Dispatch<React.SetStateAction<string | null>>;
  viewJob: IJobPosition | null;
  setViewJob: Dispatch<React.SetStateAction<IJobPosition | null>>;
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

export interface IJobPosition {
  _id: number | string;
  title: string;
  location: string;
  postedDate: string;
  fullTime: string;
  introDescription: string;
  description: string;
}
