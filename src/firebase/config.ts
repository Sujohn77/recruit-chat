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
  'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiIxNTQzMiIsImlzcyI6ImZpcmViYXNlLWFkbWluc2RrLW5qc3k0QGxvb3AtbWVzc2VuZ2VyLWZpcmViYXNlLmlhbS5nc2VydmljZWFjY291bnQuY29tIiwic3ViIjoiZmlyZWJhc2UtYWRtaW5zZGstbmpzeTRAbG9vcC1tZXNzZW5nZXItZmlyZWJhc2UuaWFtLmdzZXJ2aWNlYWNjb3VudC5jb20iLCJhdWQiOiJodHRwczovL2lkZW50aXR5dG9vbGtpdC5nb29nbGVhcGlzLmNvbS9nb29nbGUuaWRlbnRpdHkuaWRlbnRpdHl0b29sa2l0LnYxLklkZW50aXR5VG9vbGtpdCIsImV4cCI6MTY2MDc0OTc5NCwiaWF0IjoxNjYwNzQ2MTk0fQ.oIEHCeGEu2QIlOfBjTG0KPBGt_MbYdZK0aUyo2onwbWX56rkJ8R0MOLz7jPneYi1wV4plPTucGFybyvS0TTluo6LoT8hj04cCYeh_2doZm3IdZ3CuEORfc8zDGVcincQPJEv6b-o8RALLjhoOftyEqdnAqgqq-X9H-5eKY148E_jzoQPeQt_h6axkOl-9MGhmh7NRKFzeu426VMxHc29YPOp_dN6yNyN8nrXWeznJX1wp-W318R4Xx0LAf484dkjPf90rK84ERDGnC9T1VZRsDjrdfIVzWUpZPCiu_niKNLVsXcqSSEpb-OtKm67DupKASroeYw8nfJZYm50P9h7NQ';

export const ACCESS_TOKEN =
  'aiwbLfUwjFpCuT1lpE4YmQfxnrWCfLk3b7lmAKI9i7PEpcreCFsqjFlloUwhDLkS9zPB0Jgqu2hd37bL6YQEf06p4hT6WI08o3dulACI3SnhWmb6m8y0tZhO6l_hqytoqhW_xWa7PLGZ_FsdO-BLxCCPyH-AAVAm9XWacdh_t5bRFwQ7ktSAj1DAXBctIchDB12fg4-YsjO0HrxOe3cY6NQ4aVm-QS-rz0WE202A_t-ryWflhfGyoSfSfVeK6aWPpLlwDcMNCJkkf-8E-l6Atwc5SjLFXoR4ww1KiAwolyKV7FAD_lACo0nd1dFVxowKLxDZioHmlx8h1fdJovYTf3JgvleKxDmqe2TXlYclfgFdtcYPI3-oOrD3q9STfuOcI7sx6ilW2JDn5uNRnseJfN_WwQdCKJKjKpv1GWrWZHZE5gH_owsDy1bBq_0XiidyXSFs2FBIcWPIp2nY7hdb6ENHAkWn4y4vZHBl5cc6jMCHPOTja3OfKTrIhEz3MGEJx_0IkNRK4fdFcSK975xVuLHsXnCEEwiXTY816Aj_T2mISyRyNJd7nFycbwOYkgHZdQW987dUbdfYfY3hEQRtux30i0Wdj3k2fARPOTg4ky3o5OdivQuCOsJVDzfg4nivNwBEHiwr1yUjrKeJKiSWNWZkMijuv3rVL17uqsZ1S5OzRgKO8JzAxW7MZqbwYyzEbP_4GvOdfWqAsf8m_WjLzZ8-mrLwwbFYrZs7fT8Qn8VI6liTGCOdPpksZuN_timZBvUTtIGE3AetZ-HH2zqv6DaXuJgo5QrN32M3vK_iZcjPQBvEeiXtkTY4wiGiODnUWn2k0dh0g2dqBnmMDavwxSVNT8pWI745AIFxVDh5ijxoKVfNCTicld68QSU8pjJpsy7gAWD9ohhhNEj0LT6LUJQm8SzBPwVSp2xPckpQV8bGP9zIbuj4_okAYWFPcB8wTJDKmVxiwBvfYQZrlxu0sQ8DvVZmZiJINSb-hgfmIl4-BKLzNICcM956F6qz9Myy0448Yyt9IamxiYd-QHKLFhWakxljQoD6zxU5aezsGrmMySk6n8vx-wNTHqqC3g804_h4XrZtf9wRVnvVFLsKzIb8TLn9iHrxlJhxSY3XHhfiIE9bYfBzkC5tSPQQwCS0M-fAtL33tHTzZyFpP3GWCOaCgd5IjVBSZEOJ57uTRFcniJMcfLSDUYw5GVMkBwxM2l_nl6_mnQmE7QHiIbc4VsSFfaPj-Zz4tAF-XsP5d8dv-iB-98wQEwfxfecIQ-_0QI_v08rnbyXwaGEYN6qvofxqTgGRv5kaatYQmWmldTlUpjVI81M_aEgpuacmX3F46xSUKdD1L4K_nyABfi7dNQ';

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
