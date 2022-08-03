
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

export const FIREBASE_TOKEN = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiIxNTQzMiIsImlzcyI6ImZpcmViYXNlLWFkbWluc2RrLW5qc3k0QGxvb3AtbWVzc2VuZ2VyLWZpcmViYXNlLmlhbS5nc2VydmljZWFjY291bnQuY29tIiwic3ViIjoiZmlyZWJhc2UtYWRtaW5zZGstbmpzeTRAbG9vcC1tZXNzZW5nZXItZmlyZWJhc2UuaWFtLmdzZXJ2aWNlYWNjb3VudC5jb20iLCJhdWQiOiJodHRwczovL2lkZW50aXR5dG9vbGtpdC5nb29nbGVhcGlzLmNvbS9nb29nbGUuaWRlbnRpdHkuaWRlbnRpdHl0b29sa2l0LnYxLklkZW50aXR5VG9vbGtpdCIsImV4cCI6MTY1OTQ0NzYxNCwiaWF0IjoxNjU5NDQ0MDE0fQ.lanaJmtn_S0eeWdNrL_cuWF4nn0aGJZc-i93SlaHc9dL7e3QBhFJnk1XZLo5xVhQU2F-aL-bIqB6dk3HlEeq-PkbgYvi1UWJX2yxJTM1Qi_TY6MYhwsWwMoFyzcefc1s-mrwqI8ZEXCU34HrVGrS3P66qNMcsvljfZ4qYVgZX_c7N-UYaKMrt393iaVbp0CW0IVzfLb0SQvikzfVemJ6egncCv3KUrPSQY2GZmi-IFIPMptXj1upRqdZYBTXOPZaXPhnEJwdpGgM0M3D8wpWP7pmDuFYIcy28Dk0RExyq1Q5If14HRetcz2SU0PZgeJO4kxI6WwtImIOwpv2QASWJw';
export const ACCESS_TOKEN = "xr4R0W9l8Ymb-wtsv_AlYZF_lVHOppVXRmbTUD64BUMVGzVpVPe22mboUPshs2hHpVBdr29G09YjloO_cnK7XkL-Ux0sc027v3GjRnJVZAtvo2snaTwp0Ihs3LfeWSotTLQn21-UY03lt9I_xhSYMc0L9cMz5w-uvWWol2AjMkLV6RQj7f9vup-fcYo0IAh1LZxTNJzpXCfis5qvAc_r5EjxtFutH8H52FQwFVojoM62djYTQifStHBI1kp1P1-jb1hbwnS9LTTKVIFzOmECxeN6kjiemsXDH3XVE7kVkbBpwuXTT4VQEGuO4phtZC5K3-5JcqB7T0zAlnDmDmcBWMQcO5KCNjrKsyWisWb6mmI8Df5phv9N1QNcUW5eKgz9D2Ar2CAZebN07YZNq-mF3hB19j50XAK69aeHNXZWsb6UGJ_VqKq0wgk-0AMbULVR_xPL9Oq8anf7rld4C20azM4g3SR2u6IbvZOvdNhpZksPZiGrE4tLLE4r13z6faNFe7JgLdZyqxHA-LlRm96ocR-LIsIO8Tzq9xm92vFUsPy1EaqisUoo1MsHfw0_nuCawZyWgLr-IVig5VsRg_pVH1u_gNKTaLtv8aXm_q0N0k8q9e04huASi9LJojVV-015QTcBsA6VMwlc1uwqpvaHv7wjq_RQfgswpvhSDqh7i0wjMvXOG-9p7rt2IWJ4WrlWKHrTg0Tpvk6as9nLUDyEmFgU5FSX70OlbIv7GKOm1dG6njgTgC11hl55OWSDblMR88GU06g0ZGRHyygWDku4jmce23nCk46QrmN1zcOzmoVKNuax2IP-O2RasH5jujKEs_yNycCsMYlXQjuIb3ikjdibTGXXD87RbsjhtHmosIwwSjp7v0bZj_-iOkUpOUVCXLJ8WijKtpaHiGzbYT4Pv_FB6LBkcMruxXyW83_c3C0G-sGNRyKP97qWM27au6gCrX3Wn5WTLydsUJ61HpEC28Ysj5onnI7i4tSFWnXLEEcMHDsb1V4OptksjSbDpJcBQZ5afvy3e-JjTka3kcsubf2xZYBBcP-eMiAGp6mxehDJZld4B6-PzZsb7l6KWptgeZfXL0u-B0JyXz0e5Eu9nX83ArCb_zp4s9duSBeQP6JGfKHk6lx3AptvYYw9m8w1mcw2_9E8eF8dBtcAumM0822StvGN6kdC5N7-2kfyYH8F-s0a6GIbNQWm-YkQOcreylJMDzbevG30FH_YlxX5QLHLQNOgsShtgAfpaQaBAEHWXApMhpaTb4JzWNnb9Q4qLto8X51n52m4XEiAqdEXMUwxY44vaDoMCkjHtqqdQYHitERuO2I0E5jnENXe8I-GNEGOC-RUKy_8Qv-0GZ3bvg";
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
