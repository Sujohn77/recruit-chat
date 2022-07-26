
import firebase from "firebase";
import { findIndex, remove, sortBy } from "lodash";

import {
  IChatRoom,
  IMessage,
  I_id,
  ISnapshot,
  SnapshotType,
} from "services/types";
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain:process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId:process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

export const FIREBASE_TOKEN = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiIxNTQzMiIsImlzcyI6ImZpcmViYXNlLWFkbWluc2RrLW5qc3k0QGxvb3AtbWVzc2VuZ2VyLWZpcmViYXNlLmlhbS5nc2VydmljZWFjY291bnQuY29tIiwic3ViIjoiZmlyZWJhc2UtYWRtaW5zZGstbmpzeTRAbG9vcC1tZXNzZW5nZXItZmlyZWJhc2UuaWFtLmdzZXJ2aWNlYWNjb3VudC5jb20iLCJhdWQiOiJodHRwczovL2lkZW50aXR5dG9vbGtpdC5nb29nbGVhcGlzLmNvbS9nb29nbGUuaWRlbnRpdHkuaWRlbnRpdHl0b29sa2l0LnYxLklkZW50aXR5VG9vbGtpdCIsImV4cCI6MTY1ODc2MjY4MiwiaWF0IjoxNjU4NzU5MDgyfQ.JmPF5e0cjVPRqSmpNUB6Lm4KxbGELW_t7Tg0gCAUT6ZHE1reLwiGeolDX17LEwoqGGapHbCyRosRgLIwZQXCSA4Wz355pV80D_5dLdXPB2IzmXh_tldthVY1F1n5B4OS0h8Y2L91GC678Fx0ScW7itdiDotwSs1eBBLWFCyis5yQt7qLUF-Kui6Ca7ulGKavkOWJDSQ7gOmRKZmiymaZsjK8nH_0fkC6TH251QVya5fGhMdpnZyDykqZ5Trp7odT4Sa_crkQ3qRp3Kl0784FW4YVeKYQ7MkvYu0WLf2AYVOz1V4NYYz9AQiNuI7KCPDd-z6A5dgZysAJhW9-RWxzwA';
export const ACCESS_TOKEN = 'nwAs0kUA98w3DumZm53XDEYpSblg15W8U7-ITetm5pglD8aqJb-0MXArKHA1acMETJZFbguGPVCmvBmqLtZaRe2Bo0MkUxbvau4v1yfSa5PtGg4mye6yfO5gqBYCaw-bk9YuFKYN4oTTy3kzNyutNQjn1yXC3ftgbDpPsOFvF_U6UqU339GKM5uucmuigA-wm9bSZbDIwM5alzWewCH0z0-me7AP8MvBt8LvdSC9pOp3-icd9MTZ-k3gE63KH2tZ6I4Bn7W9wU8M_Nj-04aFoJqCO51nuwyniTXQAHbbVAaPT9Btm8heNjxDTBZmwcCQimAAOKCFloUPo2Hg0yPKrxpc7tgmQgeG3f2UWjm4IeOME_dcQP9tc7JACYAHKWB6cPzBFP-pEOkyp5zPJ77uEnoXG2eSXXSTJH3aBglzIZ_WuPJJ2inE_tLhPsLqZNiWbpgULgZ0rYwObxVEmZN74GmupaEnWeD9qz1s7UrxgXOhSu1bcbe--6V-Jz8P-OHCRTegtmMsUq_nz2UF46dr43xPckWypHA3Y1sWTxcm-eCKU5cZx6wNEAzoXCCoGhMjiUlWEaBChDN5kP2fo-4YasKuVVMYdtlsXkazcV3VaVMZwxs6NZ_62i0hzcLURq2tXcwWZg9nsTaQTbYY7FxaSTz1MgZuzbiby2vuK0LAIRZ2r0z6fb9OXFgnWnI2E_9QRc2MXF0OeDmVyp8iKkoIzlMK9uBOtJSc_kXvGyjEc8ATFrIsqib1JFR_4987lCRRTEeQewTOCCa67_glJIaamztPxoUhrOeBfHQ47i-sGHWBgCbWfZCeIQ9SjJ_zgoUPQmTjxFt9Z76sapikYaG0bWt5kHf30IX_bnRdciFjPYNa4ofj-Fo5X4qg0a2TJx62NzQRpYEt0LTOiDvPMrEZGKT0iO9M2jvh3079jhUzbPEDbtPsmCPaBQYxN4rTtR0rTthkasyB3Iaj21usuI_IerWuLhlq7Bl7298vL6nTAuboiyfQdZ3XCe4KxnpjT9AYuRcXt86snDpT79MjO-T6be3A1A520MJh3mOw8l6By4y4iL4vCtUb8GqlyvU-tdOBlTiMi-dvA92Hy_KeWDbozvi8PRt4rNczWZUFh4JkB5m_hY2eEmPrBmoQhK6x9nwKk_Ji9IpQJW011HbyAvyXXPfQ-m8x8uxX5JzEOWgPQHDt6oHIa0xLmcjaM6qPs9zc5Ch54TZ2KfahW7q7YLMTDYu9b48XEDuS85OMYiFBmGjBk-NJmU-ttdSGZgD2BV2O7UoWmsVb3YgC1g0ajlofZqT_qE-JUR9PjMc9Vzv3GYI4If8kCGj84na021CM9bUjSuztlAjcJuJdgLrbBv9Xgg';

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
    const processedSnapshots = sortBy(
      getProcessedSnapshots<I_id, IMessage>(
        updatedRooms[foundRoomIndex].messages || [],
        messagesSnapshots,
        "chatItemId",
        [],
        "localId"
      ),
      (message: any) => -message.dateCreated.seconds
    );

    updatedRooms[foundRoomIndex] = {
      ...updatedRooms[foundRoomIndex],
      messages: processedSnapshots,
    };
    return processedSnapshots;
  }
  return [];
};

// export function* handleUpdateChatMessages(
//   state: any,
//   { chatId, messages }: any
// ) {
//   // TODO: fix mocked state
//   const proceedMessages = updateChatRoomMessages(state, {
//     messagesSnapshots: messages,
//     chatId,
//   });
//   yield put(updateMessages(proceedMessages));
// }
