import { Dispatch, SetStateAction } from "react";
import { IMessage, ISnapshot, LocationType } from "services/types";
import { Status } from "utils/constants";
import {
  CHAT_ACTIONS,
  MessageType,
  ILocalMessage,
  USER_INPUTS,
  IRequisition,
} from "utils/types";
import { IResumeData } from "./FileUploadContext";

export interface ISearchRequisition {
  title: string;
  category: string;
}

export interface IChatMessengerContext {
  messages: ILocalMessage[];
  requisitions: ISearchRequisition[];
  category: string | null;
  user: IUser | null;
  status: Status | null;
  chooseButtonOption: (text: string) => void;
  triggerAction: (action: ITriggerActionProps) => void;
  searchLocations: string[];
  locations: LocationType[];
  setSnapshotMessages: (messageSnapshots: ISnapshot<IMessage>[]) => void;
  setCurrentMsgType: React.Dispatch<React.SetStateAction<CHAT_ACTIONS>>;
  currentMsgType: CHAT_ACTIONS | null;
  offerJobs: IRequisition[];
  alertCategories: string[] | null;
  error: string | null;
  setError: Dispatch<React.SetStateAction<string | null>>;
  viewJob: IRequisition | null;
  setViewJob: Dispatch<React.SetStateAction<IRequisition | null>>;
  prefferedJob: IRequisition | null;
  submitMessage: ({
    type,
    messageId,
  }: {
    type: MessageType;
    messageId: number;
  }) => void;
  nextMessages: IPortionMessages[];
  setJobPositions: (requisitions: IRequisition[]) => void;
  setIsInitialized: Dispatch<SetStateAction<boolean>>;
  resumeName: string;
}

export interface IFileUploadContext {
  file: File | null;
  showFile: Dispatch<SetStateAction<File | null>>;
  searchWithResume: () => void;
  resetFile: () => void;
  notification: string | null;
  setNotification: Dispatch<SetStateAction<string | null>>;
  resumeData: IResumeData | null;
}

export interface IAuthContext {
  setError: (error: string | null) => void;
  loginByEmail: ({
    email,
    oneTimePassword,
  }: {
    email?: string;
    oneTimePassword?: string;
  }) => void;
  error: string | null;

  mobileSubscribeId: number | null;
  isVerified: boolean;
  isOTPpSent: boolean;
  verifyEmail: string | null;
  clearAuthConfig: () => void;
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
  Text = "text",
  Transcript = "transcript_sent",
  Video = "video_uploaded",
  ChatCreated = "chat_created",
  Document = "document_uploaded",
  File = "resume_uploaded",
  UnreadMessages = "unread_messages",
  Date = "date",
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

export interface IUser {
  name?: string;
  email?: string;
  phone?: string;
  age?: string;
  isPermitWork?: boolean;
  wishSalary?: number;
  salaryCurrency?: string;
}
