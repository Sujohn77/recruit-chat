import { DocumentChangeType } from '@firebase/firestore-types';
export interface ISnapshot<T = Object> {
    type: DocumentChangeType;
    data: T;
}