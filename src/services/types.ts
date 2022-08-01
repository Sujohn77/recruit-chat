import { DocumentChangeType } from '@firebase/firestore-types';
import { MessageType } from 'utils/types';

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
export interface IApiMessage {
  channelName: "SMS";
  candidateId: number;
  contextId: string | null;
  msg: string;
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
  subTypeId: number | null;
  contextId: string | null;
  subType: MessageType;
  text: string;
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

export interface IRequisitionsResponse {
  requisitionCount: number;
  requisitions: any[];
}