import { Dispatch, SetStateAction } from "react";
import {
  IMessage,
  IQuestionOptions,
  ISnapshot,
  LocationType,
} from "services/types";
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
  chooseButtonOption: (text: string, param?: string) => void;
  dispatch: (action: ITriggerActionProps) => void;
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
  isChatLoading: boolean;
  // _setMessages: (messages: ILocalMessage[]) => void;
  _setMessages: React.Dispatch<React.SetStateAction<ILocalMessage[]>>;
  showJobAutocompleteBox: boolean;
  setShowJobAutocompleteBox: (show: boolean) => void;
  candidateId?: number;
  chatId?: number;
  isAnonym: boolean;
  shouldCallAgain: boolean;
  isCandidateWithEmail: boolean;
  chatBotToken?: string;
  firebaseToken: string | null;
  isAuthInFirebase: boolean;
  setIsAuthInFirebase: (isAuth: boolean) => void;
  setIsApplyJobSuccessfully: (isSuccessful: boolean) => void;
  isApplyJobFlow: boolean;
  setFlowId: (flowId: number) => void;
  setSubscriberWorkflowId: (id: number) => void;
  setIsApplyJobFlow: (isApplyJobFlow: boolean) => void;
  sendPreScreenMessage: (message: string) => Promise<any>;
  emailAddress: string;
  firstName: string;
  lastName: string;
  setEmailAddress: (email: string) => void;
  setFirstName: (name: string) => void;
  setLastName: (name: string) => void;
  setSearchLocations: (locations: string[]) => void;
  logout: () => void;
  setChatBotToken: (token: string) => void;
}

export interface IFileUploadContext {
  file: File | null;
  showFile: Dispatch<SetStateAction<File | null>>;
  notification: string | null;
  resumeData: IResumeData | null;
  isFileDownloading: boolean;
  isJobSearchingLoading: boolean;
  resetFile: () => void;
  searchWithResume: () => void;
  setNotification: Dispatch<SetStateAction<string | null>>;
  showJobTitles: boolean;
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

export type PayloadType = {
  item?: string | null;
  items?: any[];
  isChatMessage?: boolean;

  // ------- ask question ------- //
  question?: string;
  languageCode?: string | null;
  options?: null | IQuestionOptions;
  // ----------------------------- //

  // - update or merge candidate - //
  candidateData?: {
    firstName: string;
    lastName: string;
    emailAddress: string;
    callback?: Function;
  };

  // ----------------------------- //
};

export interface ITriggerActionProps {
  type: CHAT_ACTIONS;
  payload?: PayloadType;
}

export interface IPortionMessages extends ISnapshot<IMessage> {}

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

export interface IEmailLogin {
  oneTimePassword?: string;
  email?: string;
}
