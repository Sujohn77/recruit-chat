import { Dispatch, SetStateAction } from 'react';
import { IMessage, ISnapshot, LocationType } from 'services/types';
import { CHAT_ACTIONS, MessageType, ILocalMessage, USER_INPUTS, IRequisition } from 'utils/types';

export interface ISearchRequisition {
  title: string;
  category: string;
}

export interface IChatMessangerContext {
  messages: ILocalMessage[];
  requisitions: ISearchRequisition[];
  category: string | null;
  chooseButtonOption: (text: string) => void;
  triggerAction: (action: ITriggerActionProps) => void;
  searchLocations: string[];
  locations: LocationType[];
  setSnapshotMessages: (messsageSnapshots: ISnapshot<IMessage>[]) => void;
  setLastActionType: React.Dispatch<React.SetStateAction<CHAT_ACTIONS>>;
  lastActionType: CHAT_ACTIONS | null;
  offerJobs: IRequisition[];
  alertCategory: string | null;
  error: string | null;
  setError: Dispatch<React.SetStateAction<string | null>>;
  viewJob: IRequisition | null;
  setViewJob: Dispatch<React.SetStateAction<IRequisition | null>>;
  prefferedJob: IRequisition | null;
  submitMessage: ({ type, messageId }: { type: MessageType; messageId: number }) => void;
}

export interface IFileUploadContext {
  file: File | null;
  saveFile: Dispatch<SetStateAction<File | null>>;
  sendFile: (file: File) => void;
  resetFile: () => void;
  notification: string | null;
  setNotification: Dispatch<SetStateAction<string | null>>;
}

export interface IFileData {
  lastModified: number;
  name: string;
  readonly size: number;
  readonly type: string;
  arrayBuffer(): Promise<ArrayBuffer>;
  slice(start?: number, end?: number, contentType?: string): Blob;
  stream(): ReadableStream;
  text(): Promise<string>;
}

export interface IAddMessageProps {
  text: string;
  subType?: MessageType;
  isChatMessage?: boolean;
}
type PayloadType = {
  item?: string | null;
  items?: any[];
  isChatMessage?: boolean;
};
export interface ITriggerActionProps {
  type: CHAT_ACTIONS;
  payload?: PayloadType;
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

// export interface IRequisition {
//   _id: number | string;
//   title: string;
//   location: string;
//   postedDate: string;
//   fullTime: string;
//   introDescription: string;
//   description: string;
// }

export interface ISubmitMessageProps {
  type: MessageType;
  messageId: number;
}
