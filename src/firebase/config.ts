
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

export const FIREBASE_TOKEN = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiIxNTQzMiIsImlzcyI6ImZpcmViYXNlLWFkbWluc2RrLW5qc3k0QGxvb3AtbWVzc2VuZ2VyLWZpcmViYXNlLmlhbS5nc2VydmljZWFjY291bnQuY29tIiwic3ViIjoiZmlyZWJhc2UtYWRtaW5zZGstbmpzeTRAbG9vcC1tZXNzZW5nZXItZmlyZWJhc2UuaWFtLmdzZXJ2aWNlYWNjb3VudC5jb20iLCJhdWQiOiJodHRwczovL2lkZW50aXR5dG9vbGtpdC5nb29nbGVhcGlzLmNvbS9nb29nbGUuaWRlbnRpdHkuaWRlbnRpdHl0b29sa2l0LnYxLklkZW50aXR5VG9vbGtpdCIsImV4cCI6MTY1OTA5NDc4OCwiaWF0IjoxNjU5MDkxMTg4fQ.eQRzbhj3C3KubChbevcdbmaPJPYj0jvgJhUJ-lkbSyZEjMnQPMWSRICWGypx094hwG70JZ43bE35VGGOxOD4tTipI4kvkjADKoiuH30pok9cvn6OxVMF6iQA3Bxl7ZQ3c789c8Ia5VMdf9mNN3Cuu_OFHVRfDkQP0ToGCoNrXlt_h38GxrRb-AdzAFQkmbEfMFCDLO0P1su_phBbsS0PCfpUUppKe48UsMBIYv12VHMsMP17L2MbJsHgvX0P9BkvSqM9J2taefFd0E8Hir8FUXYxgiQPRIU2ZL9jkZHl8_ktF2TslweOqyN6I29oZS8f5ALrHbQOYqQZbD47PxEnnQ';
export const ACCESS_TOKEN =  "3OeYX_rC3NonaEknavlUJ4pQzLCh5wx7ln34A0ZHPzlgC18FF-d16ilR21WkdW2Bc8TvCgZh73NJWlgoDhgUx-7jjhlxHs6d4hQSX4QsYxV-xxtGallgUG-6uzwhUPMHpJ6XeFcACUpTZvqTCGjs8I54OyC_sIbDVyG7LsqoyWb29ioeF4t1m-lbBu1YY0vHNUTaZ9ghevj10GJypkFuwPaA9NLN6Ho977_FScYvxs2c3HIF_WXqsm32KaPUFUGia3jIDN3v2zN9EQBgQtAKt1Ei5sFOXb2P3pIMmzv2Q4W8rDeYsJNA9rOhvz4ms4OK7oCj9629VGYQKSvNp7EaXGh8rywNBK88sNOGBKk1D0fYlyJPz01wMXX3OIQKkxuQuKeqZxFtC93eTvquDwsd0gAwwZNohmsTnXGbMd5wLti_irDLL8xzIgSEyAz-GUNAQwiJXZmalD-cAcU0TbHBWolxbTm1bMf-OdBoDWu4moMsnNfSiobYQl7ryBwCtyjD1Yhqrb8AqtDX4bLc5O4_TU9Nh0zoIEzcENZTdScg4h4Cv8_MgMPezlavj1O0zgvGd7FoGIG84Hos_yjV2R-7dGtvE26-lHxFiRWtOXbvb3fB2FdXfyAILRt4pyRsvOzdSZ_K-r2OLs5W7efi80mdnFkB684hZ6BTRq9zsPbafOEkaKY-KkmUtv05bzWvXIjZBPc1gPegq2_8FptCuItqpwOK57ZvqXgDrebqW7Gk6NkoYumWRBMSOg94UqDhmQ4086r13S0DlciBle2jdzBmuZ0QbIJNhi1AN9ukYNl0owzNBPf57UFzuu-v6sWVMtSrURGk_mHN67uaj2Dwo61K18Tbr9OFK5m9eOb0KyTBs9llIVutRjitPxD6ZmsVM6QXU-16-kwuoIWQUrntgAvG2wYNOrf-vg4_mnB84Aj8-RwfIDgJS5mQkP1RstmDs61OpxiqJ-YxH5-l-c01LmmaobedjLzoabvYIrcgA0mqX9DJusP5SS04vCgfd9Cl9hb2qFMcyJTrMtFxnLa3dKYaW3EEkMzQc2yUDLtGiy3JWiXLQC3h8dQfJJZsZBi_lFwXIDtAd8XZrn7_P9iVF405GVb-Ml2BlGqO2ZKSunzYMgdBMS30sTbHOFxzsRte_jERPV43Zl8Hls36zK11Ny29Xc7zkAy1OM1_qzNahTBiWnQ_Fi55fgAMZp5dBlZFUaqnFXJDAa6CHkgzxk2Dg4E4zwF4sPpZpgVY3NhqiPX7c80DWkbCt75f_ZecrmSGnJF9TxOKRXPLtStBAdCWIcpRIFCN0JwelcXaFASXuSc_K8gospKicASbvz9Ayd3GYZyGBAyfBT5g7h6I-axn73X12p3-1xufvjM4JK1viI7kaJU";

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
console.log(initialItems)
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
    const processedSnapshots:IMessage[] = sortBy(
      getProcessedSnapshots<I_id, IMessage>(
        updatedRooms[foundRoomIndex].messages || [],
        messagesSnapshots,
        "chatItemId",
        [],
        "localId"
      ),
      (message: any) => -message.dateCreated.seconds
    );

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
