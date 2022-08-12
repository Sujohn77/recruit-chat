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
  'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiIxNTQzMiIsImlzcyI6ImZpcmViYXNlLWFkbWluc2RrLW5qc3k0QGxvb3AtbWVzc2VuZ2VyLWZpcmViYXNlLmlhbS5nc2VydmljZWFjY291bnQuY29tIiwic3ViIjoiZmlyZWJhc2UtYWRtaW5zZGstbmpzeTRAbG9vcC1tZXNzZW5nZXItZmlyZWJhc2UuaWFtLmdzZXJ2aWNlYWNjb3VudC5jb20iLCJhdWQiOiJodHRwczovL2lkZW50aXR5dG9vbGtpdC5nb29nbGVhcGlzLmNvbS9nb29nbGUuaWRlbnRpdHkuaWRlbnRpdHl0b29sa2l0LnYxLklkZW50aXR5VG9vbGtpdCIsImV4cCI6MTY2MDIxNDQwNCwiaWF0IjoxNjYwMjEwODA0fQ.Ltgkmbg8GebXza0oiAcsvQH_v5UjVRae7GQrkejfbHmhD0_MY9wmG4s7tobAdlwL1bvsvwb_C8euTwq30-tiq45tWOVhgZRbu6cugc26TxGF3FuuXvljJ327OFWaa3FOdce7qqnzGN7ms5hgtJ0sI7-2dSP7FTc56_XR_Jx_ek4VbWD8I5iZ77r58YuspIMhQkm9rxDsZI-jqlXdrdpM-i1rC9Z7j6NAGWhGwuFn4SjSGHoknFmSWfY8pZu3I8DjOs6gSS-5ZwOHrLrHUa6kpwjZQppYfoIPS7A72befa80beJn_3a32o4pRo2O1XTYV632R-dxnAnLD8O8u9m8Xkg';
export const ACCESS_TOKEN =
  'ipyVkSdHA4QDpwZxaulx_d3ikH7dHMkAOAO69DWtdePj2E6AgrSouSdlqxAfGlvh0Tz09T_q3PC2rJ-0ibnu1ht4Qr4uO_Ymb_MSf54HWkAljxisKmjzXC-buwzeS2u154KEXKOvbP6a2i14qZsdATNRiB2WkDDRsMWLRDmy5quVHTy44hqVWDqD_dT13PyMvoATiMD_yHYYrNpFRQrNWMDgNx1ffUvtt9F6QUANuDTC6TSGQn9AI4IN4dkF0ZKzrFk6szjiV5zRUT7EysUPoheRL1Iv9745g3iTz80IpfsXv2C5MgTlfvHhc5USKbvx3zYEIqHqsVY8Kdbd2YgVRhHmxzyqcTAtLDY3NlxJ-HfLI9AXccUx8OpXYiPSS7hfDr77lzEscTErEwx_sKul4lmYunYwRhlb-jcwh-7pbb2GcgJQbIPPm3DIXp2es3aebf60MOlzQDRdLz0Duj4t1n5kRYGw_fH4P_JOSAxb0ldPYUTUn5q6ScFxkXqNrgX0n-rkUGMt1VtpZIp9pSlCyKkgrqfg2l4y6oje5aeOpykIRI4q8xxLmhc0a-W_Z4K8ADrPHZE9XEPprUNrNto_4xNdvuIemv9aYk6XoiwrkpNKPq2bog2oGlImG1I3y2W6Bd-6vqdVgq_KX1oFbN4CYHf2L2NzBe3h1NAKmKiIzx7-E8fNYKzlTmoBpq6LBaawlHIwssUZtwtx5A5ZCBNJuXYVK5PdCXFYPX0yKA1Ubec86_FSApNU0hB3DsAi66RkdiYNSrquyjvJjsdcGT4QZ-YBj74u5R2kmRFBKs3bs4Nn81hoHFaOrBNt-doxqvqGJC4opI0a31NSUq879z78XC8Buvw-E62CvomCfBDE3sc0rz6P4bWSIAWBASoDJEG8pnP6O5HTaZV0h3d-3Ek_ZXae5hiJcxkM4gAk0q7RZCSH890vrEAEZtbnEl2KvMev8p3e2rY2UZe5BXXl6D6KtRvUy4G0heW5PBvNfveXP2S3-_fMoovmCCzpq7kbzPyAzYPyQH8pFsXryB0A_9yQJdPNezJfdjFqaK7dWXpI_KeJcZjkHU4Pi3flqmYJ_FP-OMrkMilVSI0RuTkY4y5ANYxKBJ5pqUmyJs16u83a80JvEj8BEEnIJm3XKdu2fkfochCLIznIBu_T5McyErHj1EL3Ijgt1a0RGxCSo09OERfXpCdNZMsnBarEtp8XnOJq5szkE66LhpdeV3aJlz6eN34g7xKpbLbsS6-eqlvrs_WOo6LLuC03jfvzzhX-6C670_2PJaXHt4rC6LZSdCGrzF2XKe9MWoGhaU6Rn43Uapvjj7r-FaEDGgN60mqE3X11w1_0gVV3uSEKLy-Ku3Hu-A';

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
