import firebase from 'firebase';
import { findIndex, remove, sortBy } from 'lodash';

import {
  IChatRoom,
  IMessage,
  I_id,
  ISnapshot,
  SnapshotType,
} from 'services/types';
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

export const FIREBASE_TOKEN =
  'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiIxNTQzMiIsImlzcyI6ImZpcmViYXNlLWFkbWluc2RrLW5qc3k0QGxvb3AtbWVzc2VuZ2VyLWZpcmViYXNlLmlhbS5nc2VydmljZWFjY291bnQuY29tIiwic3ViIjoiZmlyZWJhc2UtYWRtaW5zZGstbmpzeTRAbG9vcC1tZXNzZW5nZXItZmlyZWJhc2UuaWFtLmdzZXJ2aWNlYWNjb3VudC5jb20iLCJhdWQiOiJodHRwczovL2lkZW50aXR5dG9vbGtpdC5nb29nbGVhcGlzLmNvbS9nb29nbGUuaWRlbnRpdHkuaWRlbnRpdHl0b29sa2l0LnYxLklkZW50aXR5VG9vbGtpdCIsImV4cCI6MTY2MDU1NTgxNiwiaWF0IjoxNjYwNTUyMjE2fQ.EWnZ35dCBNIGHw0JwbAsIBYU-13Kcy_0sndyssW6FKEzFMgKcic_8FdbQcA8risAp3bHaJ_UrJNBH2Jb4FUYPTO7DG9aaLMIR76damPn7dRQhOAkYGYntei0HUDqjTyp3VtAlu-MkyrcqWr3UIOyb_OpM7gm_NBZoEWgSYjIvXpcEvX6110A8MYiaO9B3QRYYAF8N5UXIyYP86DP1IbMGPKb6SA678fc1X7Gky5FqVkS0KUSp9XEEMKqsMJOO5JXBZPUrUCmBVUxcc_RrzegCfFtx7Zpe8LEn9KYY_PL0Uu2mmvMHGRmwhNcZnIiQfp_S5WgQJc5xGABGO4_AHwHUA';
export const ACCESS_TOKEN =
  'sJ4SoYVyTs3sQROKmFQU-hIx04wnG6BDHgGRdMwo0pStX_aaBEJvFX9ALweRVP46_swS9CW9_7vxHgQne47ZXq1kwAXnrTpZ0I50i8vAbJlJCKX6wBZ3si0_mss8qB7k09E2Pg8y-Wqa-svw4-0gjyasNr0kEZafmejEW9Uiiuuj7dwYFyMT_z-XzKxEqUhpF25FE15BoRoiAZ6cmWw3zqn1tJ6sSEsS1h0z1YLseID7PGTTWuqsh6JNzMIXKkPjkUQYKts3-1UTumClafyJQWICepowAN0GBUWFfEmUcKWODpg4DYeWYqBzsqyFXsc6mCrQvBr1LdQaGf92Ta0i4pSBNFebXBYaw6WBqxPc-iB9fN9BDAx06x6NtM-JzzNM6j2gM_h5aQDJ7NCcMA_h-ANrKO9mJv-CVjTFEKnNKA-NWLR21RhNRqhLZsJxUkr9AAeicarHJwGZrOH647teTTDmOvppqlaNjxH1F1qyd4aRAohnaG35XQk024y9KibZCZFkhyATsIfBl0uyzLVyQPSCqTv1OEx-zHfGX9uge4-ItrUamdF3z-92jszMdmUZTHn4ujpAWuJ0VcqscU0pfBtqfeGh-hWX7vfiecoy-AOp3NPxx0UCw3RvhBz9oNGFYx-2cTyM_zSOlHjC8bFFR2yI03xMNRlzS0HzSb87yprQDIUfWcSFN7vffT_HV2SbhetFrwkdJJIGKQRoV9hZwbr41vcKol4oTBiHrnINYbCQkrj1RYVYFNwWGmqmDJ6amq4LQO7HQRNfPz43LpcLpCJ-9VFhM0Y-OXdVDddMJRjwYp4F1m6zbgURHO29Qt2oxvUbTgsSVLMj4PabGnccyjWtVtfkS12xf21VD8n9yi0HD1WStJaP6wLro6oL8CTqYfXz5tr9zJP9b4ty1nlbJEqyxEXABoxuC_QbqoF9FwMJ-J0mkkOgk5X7-kY4e9-FqOcbx1uT3ghWvoCsxjf_gXV9MMB_F2ik_2G8XLYLJB3R_uk9eSVRoOz811j-LwNswC9Rhrf-GXMdFbOtIysoYBGbPKRM-8htJiCiD-fQ8wYWzsHRJ04eA1LAuNtp-oTmYqix1aPNsxVWl1zpUEVAfklXdxy2rXPUBNaqzlMCwfVfmikaP1pwHl1ZA-FUaMmtO2ey0H3Z-Y9iVXlg8vViBACn-u0gM4P6P2Bw6w2eRjtwDOU75cpLROM75Ey2y_g-iymchcb1HRF9_PzS2HPnjCWcA3Xpl3OG9YLiP-P_iD5OvyEHmk9AvHvC6A5QF56FmuL7HWL4q3YBPinqO7sRbv0PME3gH77ML4ew1NP_iQw-5W8syuSd4_hOC8IU41JP5cZApIv2Y2PvoNtzrgRjvA';

export const app = firebase.initializeApp(firebaseConfig);
export const db = app.firestore();

const auth = firebase.auth();

export const handleSignInWithCustomToken = async (accessToken: string) => {
  try {
    const userCredential = await auth.signInWithCustomToken(accessToken);
    return userCredential.user;
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.error(errorCode, errorMessage);
  }
};

export const getProcessedSnapshots = <TId, TItem extends TId>(
  initialItems: TItem[],
  snapshots: ISnapshot<TItem>[],
  idField: keyof TId,
  fieldsToSave: (keyof TItem)[] = [],
  localIdField: keyof TItem | null = null
): TItem[] => {
  let newItemsArray: TItem[] = initialItems.slice();
  console.log(initialItems);
  snapshots.forEach((snapshot) => {
    const { type: snapshotType, data: snapshotData } = snapshot;

    /* Skipping objects without id field */
    if (!snapshotData[idField]) {
      return;
    }
    const updateItem = () => {
      let foundItemIndex: number = findIndex(
        newItemsArray,
        (item) => item[idField] === snapshotData[idField]
      );

      // // Try to find object with localId
      if (foundItemIndex === -1 && localIdField && snapshotData[localIdField]) {
        foundItemIndex = findIndex(
          newItemsArray,
          (item) => item[localIdField] === snapshotData[localIdField]
        );
      }

      if (foundItemIndex !== -1) {
        fieldsToSave.forEach((field) => {
          snapshotData[field] = newItemsArray[foundItemIndex][field];
        });

        newItemsArray = [
          ...newItemsArray.slice(0, foundItemIndex),
          snapshotData,
          ...newItemsArray.slice(foundItemIndex + 1),
        ];
      } else {
        fieldsToSave.forEach((field) => {
          if (!snapshotData[field]) {
            // @ts-ignore
            snapshotData[field] = [];
          }
        });

        newItemsArray = [snapshotData, ...newItemsArray];
      }
    };

    const removeItem = () => {
      remove(
        newItemsArray,
        (item: any) => item[idField] === snapshotData[idField]
      );
    };

    switch (snapshotType) {
      case SnapshotType.Added:
      case SnapshotType.Modified:
        updateItem();
        break;
      case SnapshotType.Removed:
        removeItem();
        break;
      default:
        break;
    }
  });

  return newItemsArray;
};

export const updateChatRoomMessages = (
  state: any,
  { messagesSnapshots, chatId }: any
) => {
  const updatedRooms: IChatRoom[] = [...state.rooms];

  // Find room
  const foundRoomIndex = findIndex(
    state.rooms,
    (room: any) => room.chatId === chatId
  );
  if (foundRoomIndex !== -1) {
    // Update whole room (link) with new messages
    const processedSnapshots: IMessage[] = sortBy(
      getProcessedSnapshots<I_id, IMessage>(
        updatedRooms[foundRoomIndex].messages || [],
        messagesSnapshots,
        'chatItemId',
        [],
        'localId'
      ),
      (message: any) => -message.dateCreated.seconds
    );

    return processedSnapshots;
  }
  return [];
};
