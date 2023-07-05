import { DocumentChangeType } from "@firebase/firestore-types";
import { IUserLoginDataKeys } from "utils/constants";
import { IRequisition, MessageType } from "utils/types";

export interface IUpdateMessagesResponse {
  errorOccurrenceId: null;
  errors: [];
  message: null;
  redirectUri: null;
  status: null;
  statusCode: null;
  success: boolean;
  unreadMsgCount: number;
}
export interface ISendMessageResponse {
  chatId: number;
  chatItems: IMessage[];
  errorOccurrenceId: null;
  errors: [];
  limits: { limits: [] };
  message: null;
  redirectUri: null;
  status: null;
  statusCode: null;
  success: boolean;
}

export interface IVerifyChatBotResponse {
  isDomainVerified: boolean;
  chatBotStyle: string | null;
  chatBotId: string | null;
}

export interface IUpdateMessagesResponse {
  errorOccurrenceId: null;
  errors: [];
  message: null;
  redirectUri: null;
  status: null;
  statusCode: null;
  success: boolean;
  unreadMsgCount: number;
}

export interface ISendTranscriptResponse extends ISuccessResponse {}

export interface ISendTranscript {
  ChatID: number;
}

export interface IApiMessage {
  channelName: "SMS";
  candidateId: number;
  contextId: string | null;
  msg: string | undefined;
  // subType: MessageType;
  images: Record<"url", string>[];
  messageTemplateId?: string;
  localId: string;
}

export enum UserLicenseTypes {
  Standard = "Standart",
}
export type AppKeyType = {
  appKey: string;
};
export interface IUserSelf {
  id: number;
  userLicenseType: UserLicenseTypes.Standard;
  photoURL: null | boolean | string;
  photoUrl: null | boolean | string;
  photoSasToken?: null | boolean | string;
  companies: [];
  messengerNumber: string;
  clientId: number;
  client: string;
  userLicenseTypeId: 1;
  username: string;
  externalId: null | boolean | string;
  location: null | boolean | string;
  firstName: string;
  lastName: string;
  email: string;
  countryCode: null | boolean | string;
  mobile: string;
  roles: [];
  allUnrestrictedCompanies: boolean;
  hasSingleSignOn: boolean;
  idpUserId: null | boolean | string;
  idpTenantId: null | boolean | string;
  idpGlobalUserId: null | boolean | string;
  jobTitle?: string | null;
  employer?: string | null;
  type?: string;
}

export interface I_id {
  chatItemId: number;
}
export interface IMessageContent {
  content: IMessageContentInnerInfo;
  options?: IMessageOption[];
}

export interface IMessageContentInnerInfo {
  typeId: number;
  contextId: string | null;
  subType: MessageType;
  text: string | undefined;
  url: null | string;
}

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

export interface IMessageOption {
  id: number;
  isSelected: boolean;
  itemId: number;
  name: string;
  text: string;
}

export interface IMessage extends I_id, IMessageContent {
  dateCreated: { seconds: number };
  optionList?: { isActive: boolean; options: IMessageOption[] };
  dateModified: { seconds: number };
  isEdited: boolean;
  localId?: string;
  isOwn: boolean;
  sender: IUserSelf;
  searchValue: string;
  isReceived?: boolean;
}

export interface ISnapshot<T = Object> {
  type: DocumentChangeType;
  data: T;
}
export interface IChatRoomID {
  chatId: number;
}
export interface IMutedUntil {
  seconds: number;
  nanoseconds: number;
}
export interface IMuteStatus {
  [key: string]: IMutedUntil;
}
export interface IChatRoom extends IChatRoomID {
  canChat: {
    canChat: boolean;
    errorCode: null;
    isImageEnabled: boolean;
    unavailableMessage: null;
  };
  countOfUnread: number;
  dateCreated: { seconds: string };
  dateModified: { seconds: string } | string | false;
  imageUrl: null;
  imageUrlSasToken: string;
  isOptedOut: boolean;
  isViewed: boolean;
  lastMessage: IMessage;
  participantIds: string[];
  participants: (IUserSelf & { countOfUnread: number; uniqueId?: string })[];
  subscriber: IUserSelf;
  subscriberId: number;
  messages: IMessage[];
  pinned: string[];
  archived: string[];
  muted: IMuteStatus[];
  ownerId: number;
}
export interface ChatsState {
  rooms: IChatRoom[];
  archivedRooms: IChatRoom[];
  totalUnread: number;
}

export enum SnapshotType {
  Added = "added",
  Modified = "modified",
  Removed = "removed",
}

export type Handler<A> = (state: ChatsState, action: A) => ChatsState;
export interface IGetAllRequisitions {
  pageSize: number | null;
  page: number | null;
  keyword: string | undefined;
  minDatePosted?: string | null;
  location?: ILocationRequisition | null;
  externalSystemId?: number | null;
}

export interface ILocationRequisition {
  city: string | null;
  state: string | null;
  postalCode: string | null;
  country: string | null;
  latitude: string | null;
  longitude: string | null;
  radius: string | number | null;
  radiusUnit: string | null;
}

export interface IApiSignedRequest {
  appKey: string;
  codeVersion: string;
}

// Loop

export interface ISearchJobsPayload {
  pageSize: number;
  page: number;
  keyword: string;
  companyId?: string;
  minDatePosted?: string;
  appKey?: string;
  codeVersion?: string;
  categories?: string[];
  location?: {
    city: string;
    state: null;
    postalCode: null;
    country: null;
    latitude: null;
    longitude: null;
    radius: null;
    radiusUnit: "km";
  };
  externalSystemId?: number;
}

export interface IResumeDataPayload {
  candidateId: number;
  fileName: string;
  lastModified: string;
  resumeBlob: string | ArrayBuffer;
  // resumeId: number;
}

export interface IUploadCVPayload {
  candidateId: number;
  fileName: string;
  lastModified: string;
  blob: string | ArrayBuffer;
}

export enum ContactType {
  EMAIL = "email",
  Phone = "phone",
}

export interface IAddress {
  line1: string;
  line2: string;
  city: string;
  state: string;
  type: "home";
  zip: string;
  country: string;
}

export interface IContactMethod {
  type: ContactType;
  address: string;
  location: string;
  isPrimary: boolean;
}

export interface IEmploymentExperience {
  organizationName: string;
  jobTitle: string;
  startDate: Date;
  endDate: Date;
}

export interface IEducationHistoryModel {
  institution: string;
  institutionTypeId: string;
  educationType: string;
  courseTitle: string;
  measureSystem: null;
  measureValue: null;
  startDate: Date;
  endDate: Date;
}

export interface ISocial {
  type: "facebook" | "linkedin";
  url: string;
}

export interface ISkill {
  name: string;
  dateLastUsed: Date;
  totalMonths: number;
  proficiencyID: null;
}

export interface ICreateAnonymCandidateRequest {
  firstName: string;
  lastName: string;
  typeId: number;
}

export interface ICreationCandidatePayload {
  title?: string;
  firstName: string;
  lastName: string;
  status?: null;
  sourceType?: "Social Media";
  source?: "Twitter";
  companyID?: 4;
  addresses?: IAddress[];
  contactMethods: IContactMethod[];
  employmentExperience?: IEmploymentExperience[];
  educationHistoryModel?: IEducationHistoryModel[];
  profile: {
    headine?: string;
    summary?: string;
    photoURL?: string;
    currentEmployer: string;
    currentJobTitle: string;
    educationLevel?: string;
    jobFunction?: string;
    jobSpeciality?: string;
    yearsExperience?: string;
    willingToRelocate?: "true";
    communicationLanguage?: "French";
  };
  social?: ISocial[];
  tags?: string[];
  skills?: ISkill[];
}

// Api responses

export interface IUploadResponse {
  errorOccurrenceId: null;
  errors: [];
  fileName: string | undefined;
  postedAt: string | null;
  redirectUri: string | null;
  resumeId: number;
  status: string | null;
  statusCode: null;
  url: string;
}

export interface ICreateCandidateResponse {
  errorOccurrenceId: null;
  errors: [];
  id: number;
  message: null;
  status: null;
  statusCode: null | number;
  success: boolean;
}

export interface IRequisitionsResponse {
  facets: {
    Categories: IFacentsValue[];
    City: IFacentsValue[];
    Country: IFacentsValue[];
    State: IFacentsValue[];
  };
  requisitionCount: number;
  requisitions: IRequisition[];
}

export interface IFacentsValue {
  value: string;
  count: number;
}

export type LocationType = {
  city: string;
  state?: string;
  country: string;
  zip?: string | null;
};

export enum IUserDataKeys {
  GrantType = "grant_type",
  Username = "username",
  Password = "password",
  TwoFactorAuthCode = "twofactorauthcode",
  AppKey = "appKey",
  CodeVersion = "codeVersion",
  RefreshToken = "refreshToken",
}

export enum IUserDataTokenKeys {
  AccessToken = "access_token",
  TokenType = "token_type",
  ExpiresIn = "expires_in",
  RefreshToken = "refresh_token",
  SasSubscriberAttachment = "sas_subscriber_attachment",
  SasSubscriberResume = "sas_subscriber_resume",
  SasSubscriberAvatar = "sas_subscriber_avatar",
  FirebaseAccessToken = "firebase_access_token",
  IssuedTokenDate = ".issued",
  ExpiresTokenDate = ".expires",
  ErrorDescription = "error_description",
  Error = "error",
  Errors = "errors",
}

// Requests
export interface IVerifyEmailRequest {
  email: string;
  verificationCode: string | undefined;
}

export interface IJobAlertRequest {
  email: string;
  location: string;
  jobCategory: string | null;
  candidateId: number;
  // subscriberID: number | null;
  // chatBotID: string | null;
}

// Responses

export interface IJobAlertResponse {
  success: string;
  message: string;
}

export interface ISuccessResponse {
  errorOccurrenceId: null | number | string;
  errors: string[];
  message: null | string;
  status: null | number;
  statusCode: null | number;
  success: boolean;
  redirectUri?: null | string;
  wdResponseResultModel?: null | unknown;
}

export interface IVerifyEmailResponse extends Partial<IVerifyErrorResponse> {
  isEmailExists: boolean;
  isOTPSent: boolean;
  isEmailVerified: boolean;
  subscriberID: number;
  MSISDN: number;
}

export interface IVerifyErrorResponse {
  errorOccurrenceId: null;
  errors: string[];
  message: string;
  redirectUri: null;
  status: null;
  statusCode: null;
  success: boolean;
}

export interface IUserLoginRequestData
  extends Record<IUserLoginDataKeys, string> {}

export interface GenerateGrantTypeData {
  [IUserDataKeys.GrantType]: string;
  [IUserDataTokenKeys.RefreshToken]: string;
}

export type GenerateGrantType = (
  userData: IUserLoginRequestData | GenerateGrantTypeData
) => string;

export interface IQuestionOptions {
  answersNumber: number; // maximum number of answers to be returned for the question
  includeUnstructuredSources: boolean; // flag to enable Query over Unstructured Sources
  confidenceScoreThreshold: number; // minimum threshold score for answers, value ranges from 0 to 1.
}

export interface IAskAQuestionRequest {
  question: string;
  languageCode?: string | null; // the language in which the question was asked [not required]. en_us by default, so leave this field null if the question is in English
  options?: null | IQuestionOptions; // options - QnA configuration options [not required, can be null]
}

export interface IAskAQuestionResponse {
  answers: string[];
}

export interface IApplyJobResponse extends ISuccessResponse {
  FlowID: number | null;
  SubscriberWorkflowID: number | null;
}

export interface IFollowingRequest {
  FlowID: number; //from previous api call
  SubscriberWorkflowID: number; //from previous api call
  message: string; // ("yes")  the user's typed response/answer
  candidateId: number;
}

export interface IFollowingResponse extends ISuccessResponse {}

export interface ICreateAnonymCandidateResponse extends ISuccessResponse {}

export interface IUpdateOrMergeCandidateRequest {
  firstName: string;
  lastName: string;
  emailAddress: string;
  candidateId: number;
  chatId: number;
}

export interface IUpdateOrMergeCandidateResponse extends ISuccessResponse {
  updateChatBotCandidateId?: boolean;
  candidateId?: number;
}
