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
  'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiIxNTQzMiIsImlzcyI6ImZpcmViYXNlLWFkbWluc2RrLW5qc3k0QGxvb3AtbWVzc2VuZ2VyLWZpcmViYXNlLmlhbS5nc2VydmljZWFjY291bnQuY29tIiwic3ViIjoiZmlyZWJhc2UtYWRtaW5zZGstbmpzeTRAbG9vcC1tZXNzZW5nZXItZmlyZWJhc2UuaWFtLmdzZXJ2aWNlYWNjb3VudC5jb20iLCJhdWQiOiJodHRwczovL2lkZW50aXR5dG9vbGtpdC5nb29nbGVhcGlzLmNvbS9nb29nbGUuaWRlbnRpdHkuaWRlbnRpdHl0b29sa2l0LnYxLklkZW50aXR5VG9vbGtpdCIsImV4cCI6MTY2MDkwODI2NiwiaWF0IjoxNjYwOTA0NjY2fQ.QATCcMAfCi5FVUr-1exewz29H7G7fBFxV1wo6byOZd_4WMltr2ZjZkWsWT8v0AIZNfdcVXXaxy0oDKS4vrDMgOXVRwE6Sfj1-7hnnnI_QKUFMetSSDUwFaDvhJh5O_ys755om9xAQd_HcQkqU6zvP6_OOP1dp_aqaA0uEZzmrgqV3ErGf5yfQH4tDc7dCPSL5rDysspp0igi3h2ravsyypeYuib5yNMmfObyNqdTJW19ynyWzjjsMKAh5OtgoJfQliLJTTu7sxmJn_uTcLyxy72UmSKrKB7xVFCB8KznFd6_ZjAzsOn7UFaE0x_vmNAOeJz2Kbw_EQVXk763vesJ7A';

export const ACCESS_TOKEN =
  'tg58ojl8MiQX8r-saKIDkWShR2aNIcx0l_ae1ZpsrAHzgvOqsZWvs8LGkR5_esvdHAcc30J_bZDFglFrZubMBQJTxN6S-dE8-hQbz-yo5kFBXHGLLwR2z8admGZEDDAt__5v9OEmovtDzijJtkWCFG6byGEbw5x0fAyOt6nHZ7FZ0AuysbWvUga3xNKUBKNx0F1kj7YRMflmvt7pNWyy-bGb1kAaOIIFUnlRiuzK76t4l3iXYY6eBBgc1SWmnBTRp1ZzruJatTqIH-Le39FABZwiyc-_k27RovZd8H2eEqqAbM0u5RFql9UI4EGWYVFLlGV5WtL5d-UndUNK9kVY44MQihwjwTMHre87fiUMhgY2-g4cmaiI9V3YbkRBplFNKpzsox2-svbB8DFPSvGHDRIOqCBuWaCYZeBRcLvaUuVL-Sc5MSXeE79jzReFQOx1R1bRn4kUSxgciLXdH9dkJ4ntC4h0kfNGWItJfXmwKgTbrXG9jnP4oLAlibw7uFauoY9TNUR86uZBQt-Vhkls7rRapGersMUVNa48fPcng0ITUI9LL7LLpmlX7L8Gu5t2O7nXYvmBDtJLh0oyR9m4J15Os3NKgaRiZ4dMMm2FCddUPKHuPT03FHh_yGuIW0PUaImJwUesXZTmjPrc0DQuY-jTlHKRY5iGYhX-XDdrr0KXKwVdSXGZVGK7lX8NY1k-TDTMptO1BJUfpNqAjxklNBEsWTvRdWBl8injzr-1I4eax_zr-4ZAR2nGq95klnrq24XBe9Zd1smL0PAguJWAi-i_2NY-Um4KG41trPZUQIGhyM4P050amGnrEc_PucFTqwcFj6zPA0oe0y9HKBgELXruLfMHLl4biwC8QqZiSR9r9GcbtUMFBCS_bRx49zZmJxP8me4LLeD5t_SwER-D8JYkJFqNRGarhYDc9DGjy73Pc4P9E2-Gv5v-wZDuC-StAQbvAg_pZshtAXswAp-2ZxLd_zBQdnospjGWyUYXccVmCNcSXuyeQRId6rwsJqQzjk2yqTXiNNzph8EVf0fZXkNo-KJATAmKT5RgLILZ8gq-YN5SWi1Iw41AJ1AAxBzVQtPlKxX60xcLYsfPO0yLaFilDPBD_aszZG8BSzLQP4vkl0vZK_tNG_ch_zH_r6XY8oSj5qxBoQILrp7e38GivcuzjJYR-1ftfqSZjpdKz8DeigyopYaeH7GjwekAjm12RuMX4mlAZ_rFqR7XShR4xgQQE34SaQsyzIjCqjcuEA_uSt9yUOZvvMpnbMPxzAIx1-6ut8eEiLIrwHjb-dWjkFB7dS3rtgfDMOedoPiApiZYqHh9Me1RM1J9fY97sBU-4u7ivG56L6iIc7t4kLpipNBtMzhOxtDtj12lHSx7Ovg';

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
