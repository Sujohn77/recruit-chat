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
<<<<<<< HEAD
  'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiIxNTQzMiIsImlzcyI6ImZpcmViYXNlLWFkbWluc2RrLW5qc3k0QGxvb3AtbWVzc2VuZ2VyLWZpcmViYXNlLmlhbS5nc2VydmljZWFjY291bnQuY29tIiwic3ViIjoiZmlyZWJhc2UtYWRtaW5zZGstbmpzeTRAbG9vcC1tZXNzZW5nZXItZmlyZWJhc2UuaWFtLmdzZXJ2aWNlYWNjb3VudC5jb20iLCJhdWQiOiJodHRwczovL2lkZW50aXR5dG9vbGtpdC5nb29nbGVhcGlzLmNvbS9nb29nbGUuaWRlbnRpdHkuaWRlbnRpdHl0b29sa2l0LnYxLklkZW50aXR5VG9vbGtpdCIsImV4cCI6MTY2MDY1NjI3NywiaWF0IjoxNjYwNjUyNjc3fQ.RawwPgq4YCssQ5k5mKQL6R7xvM1t3nPlhhdPkzwIwBs5diRKJPRKyBDH8qiJBkBx4byy8F0NSuUREQKigP_YCPw5eNMTn2YcPIHl6MrT7kUdS2LLGpCv2hA0Jud86f014F3G9ntbCvWVrCWK3iXL5Ap4P_ceqNJIJpUnBCOSJNTcRxriHLpQiGrYSENItlnzyz3j3pt24_iDP9KQsR-67KAtqZkVxMvOvxags1CyGDFAjOq1Sd9Ez_k4OSPJJQoWoGyr4Yu4vXjCWv822JZbRvEg-Uukmr_v9jkJoa1htSNIzyWAfr4b0cU974VRYqMnbxr5Ean5Fe7d7cjXj9ZFPQ';
export const ACCESS_TOKEN =
  'UHrpIrEzQGCD6Jo4nt2uGH9Rp-69VAHF9JeQkoloz81yqiXTSKzZPYraD6kIJH2LeDJDpk0PLxW-7MsYLKBye599fr2-WU-ZTswVC0UweS8GpaBsDRsdmDu6EaE1yRyQ1bfCJ8s1NLlFGKS_6I-d0FG7nIw950avN0MHJ9onTyfhXmyGraskhTdCpvlXPzdbpCgIIDftXhyC_u-lz0rEA53F_TpuRRbDHIAx8ul_gcspxq-MPIbnhiAu3HGrevEmUgtH4giMYgjhP6A7aCDMSeLgj1KgNLyil4tFduZn-SBDsKcAKBz2zfAnhte6TF3vrmRgvv5anUGgWiNpFXPHQOb-sJkWaL_KiBIeSbd6tSsu5ieH7ucDkWMgJN828oR1v_oo346SDehaSsReCtsyctw3K8yLjifkVioEN57JF9tFESWpsTjgWX-NmwdfsyAgt907WTXFR59cXylI2wsn-DdVO4hvibKBX9hZzFZSU24OWdZic20885IjZSeCFABOQqTGDccxW4LiGJRZW8mcJFUrYPfdxI5blZMF87ISprDLxz2IQu1lTHRi-VY82SiWoCaATYs5fFiKK2FBexpPAy6VTJ0YLssZHRXgEBLbIApAIaS-3cE4ACHb8-fb_Kne-FfQrDWBmF9sYkq9MQlFv3TsxkU1P85fW-umT9179CRrwhSe8HWjpNopm2mFbNLFHunWRGAKwRB6w_9dKZXCVMZIc-e1ELh1J8ZxwgvCDZfEP5vRjezohc2xRcEOCRHiYK3pgxUlv5Q8DXJHUT5Clv0lCkTbuT8Rh9zRGzSzBVpbNjw_Me1983OYLozNXusjq_SKgagy5oo4cXezWvVEWFU-3gXgfnkbLpqMz-sZTZKgDfd3Jq4Ta1qyqClpHVMjIqko1UPtwVFPNvU88oKfbzo2Ld9Nu5r_4ikrcnlhxZOOfUmUiJE3u6f_MBujD1EdXfm1DnztkWCiUCxedXSWIPg3CPnm_E36clRvCkDWpfW2IhGGXIZ8GTzk84NeF65jBWBGY6xSHu48OSsJ4CkQoFdXK4ukcyqjxaWASKdJKpb7ZMfVS8Mi6oEOb5y4TUoo-RymCWWAyuxVoi-a_mFzvG176GqMTONkLfVe1z36nD4vRnkXRB-xprm66WhrfYeV1nqCgRh5nsk-39GrLLmm7VF36HYiHrwFMEbcYy62Mi2isje38Hh2ag9st-FzbanGxKnadjfbs78ZQIpL6U7qCY0cLTaUsXSCrKqdS2gBQ01maGH2zbZEW8HnVdIdcwfpzuP9KqZh1l4lj1dGQoIDLrRn45A11IUPBlic22HvTMMxUJ2qegf05LtFvv2DNqESXv39nqlqQKKJtzZyhhbLUX6ZonROMyakHaDCWq9otWw';
=======
  'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiIxNTQzMiIsImlzcyI6ImZpcmViYXNlLWFkbWluc2RrLW5qc3k0QGxvb3AtbWVzc2VuZ2VyLWZpcmViYXNlLmlhbS5nc2VydmljZWFjY291bnQuY29tIiwic3ViIjoiZmlyZWJhc2UtYWRtaW5zZGstbmpzeTRAbG9vcC1tZXNzZW5nZXItZmlyZWJhc2UuaWFtLmdzZXJ2aWNlYWNjb3VudC5jb20iLCJhdWQiOiJodHRwczovL2lkZW50aXR5dG9vbGtpdC5nb29nbGVhcGlzLmNvbS9nb29nbGUuaWRlbnRpdHkuaWRlbnRpdHl0b29sa2l0LnYxLklkZW50aXR5VG9vbGtpdCIsImV4cCI6MTY2MDU1NTgxNiwiaWF0IjoxNjYwNTUyMjE2fQ.EWnZ35dCBNIGHw0JwbAsIBYU-13Kcy_0sndyssW6FKEzFMgKcic_8FdbQcA8risAp3bHaJ_UrJNBH2Jb4FUYPTO7DG9aaLMIR76damPn7dRQhOAkYGYntei0HUDqjTyp3VtAlu-MkyrcqWr3UIOyb_OpM7gm_NBZoEWgSYjIvXpcEvX6110A8MYiaO9B3QRYYAF8N5UXIyYP86DP1IbMGPKb6SA678fc1X7Gky5FqVkS0KUSp9XEEMKqsMJOO5JXBZPUrUCmBVUxcc_RrzegCfFtx7Zpe8LEn9KYY_PL0Uu2mmvMHGRmwhNcZnIiQfp_S5WgQJc5xGABGO4_AHwHUA';
export const ACCESS_TOKEN =
  'sJ4SoYVyTs3sQROKmFQU-hIx04wnG6BDHgGRdMwo0pStX_aaBEJvFX9ALweRVP46_swS9CW9_7vxHgQne47ZXq1kwAXnrTpZ0I50i8vAbJlJCKX6wBZ3si0_mss8qB7k09E2Pg8y-Wqa-svw4-0gjyasNr0kEZafmejEW9Uiiuuj7dwYFyMT_z-XzKxEqUhpF25FE15BoRoiAZ6cmWw3zqn1tJ6sSEsS1h0z1YLseID7PGTTWuqsh6JNzMIXKkPjkUQYKts3-1UTumClafyJQWICepowAN0GBUWFfEmUcKWODpg4DYeWYqBzsqyFXsc6mCrQvBr1LdQaGf92Ta0i4pSBNFebXBYaw6WBqxPc-iB9fN9BDAx06x6NtM-JzzNM6j2gM_h5aQDJ7NCcMA_h-ANrKO9mJv-CVjTFEKnNKA-NWLR21RhNRqhLZsJxUkr9AAeicarHJwGZrOH647teTTDmOvppqlaNjxH1F1qyd4aRAohnaG35XQk024y9KibZCZFkhyATsIfBl0uyzLVyQPSCqTv1OEx-zHfGX9uge4-ItrUamdF3z-92jszMdmUZTHn4ujpAWuJ0VcqscU0pfBtqfeGh-hWX7vfiecoy-AOp3NPxx0UCw3RvhBz9oNGFYx-2cTyM_zSOlHjC8bFFR2yI03xMNRlzS0HzSb87yprQDIUfWcSFN7vffT_HV2SbhetFrwkdJJIGKQRoV9hZwbr41vcKol4oTBiHrnINYbCQkrj1RYVYFNwWGmqmDJ6amq4LQO7HQRNfPz43LpcLpCJ-9VFhM0Y-OXdVDddMJRjwYp4F1m6zbgURHO29Qt2oxvUbTgsSVLMj4PabGnccyjWtVtfkS12xf21VD8n9yi0HD1WStJaP6wLro6oL8CTqYfXz5tr9zJP9b4ty1nlbJEqyxEXABoxuC_QbqoF9FwMJ-J0mkkOgk5X7-kY4e9-FqOcbx1uT3ghWvoCsxjf_gXV9MMB_F2ik_2G8XLYLJB3R_uk9eSVRoOz811j-LwNswC9Rhrf-GXMdFbOtIysoYBGbPKRM-8htJiCiD-fQ8wYWzsHRJ04eA1LAuNtp-oTmYqix1aPNsxVWl1zpUEVAfklXdxy2rXPUBNaqzlMCwfVfmikaP1pwHl1ZA-FUaMmtO2ey0H3Z-Y9iVXlg8vViBACn-u0gM4P6P2Bw6w2eRjtwDOU75cpLROM75Ey2y_g-iymchcb1HRF9_PzS2HPnjCWcA3Xpl3OG9YLiP-P_iD5OvyEHmk9AvHvC6A5QF56FmuL7HWL4q3YBPinqO7sRbv0PME3gH77ML4ew1NP_iQw-5W8syuSd4_hOC8IU41JP5cZApIv2Y2PvoNtzrgRjvA';
>>>>>>> 7b055172912f1002d0afd380bc67bf5a53681ecc

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
