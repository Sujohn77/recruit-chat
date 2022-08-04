
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

export const FIREBASE_TOKEN = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiIxNTQzMiIsImlzcyI6ImZpcmViYXNlLWFkbWluc2RrLW5qc3k0QGxvb3AtbWVzc2VuZ2VyLWZpcmViYXNlLmlhbS5nc2VydmljZWFjY291bnQuY29tIiwic3ViIjoiZmlyZWJhc2UtYWRtaW5zZGstbmpzeTRAbG9vcC1tZXNzZW5nZXItZmlyZWJhc2UuaWFtLmdzZXJ2aWNlYWNjb3VudC5jb20iLCJhdWQiOiJodHRwczovL2lkZW50aXR5dG9vbGtpdC5nb29nbGVhcGlzLmNvbS9nb29nbGUuaWRlbnRpdHkuaWRlbnRpdHl0b29sa2l0LnYxLklkZW50aXR5VG9vbGtpdCIsImV4cCI6MTY1OTU5NzM0NywiaWF0IjoxNjU5NTkzNzQ3fQ.SW0Bf29Jgjr6DqStyVyDtLqUVBO0tgYqvXyYrrLb_cfsNdfZg45vV_RuO39ycheuAC4KivSdT7tcMAH_HitJYDZxtIg1Yqgdua_H67Kb0EkWfGOZXlsJBL2-7bVK04ZYE8faLI6cVxetnzCrz1DxCHN7M-ltzCy6Hrns58A4po9iPJUeBYog0nRShofoXDsCAUCPP9Y1CTv9wvbJ7hFOFgMVY3Edtxxpf74UbveyYYlN7u00DeMlbhfhVPkUn7aCUzKpmk6KwaBBIxJi_LfzJLwxymwBcT8ziwb_y9MLnvcAFBYOLWk6T5zI0FlUFDx3r0uBi-IJcaTarUAinqINCg';
export const ACCESS_TOKEN = "voxDypGTjNUoH_WV7X5JztZRrF12AlAAjZzm-7ZGEhkaCI1Cu9BAPqKB4RCv9kxEC0QTYBXdq8gaRbqb7ZWkxGPIuohXMm2mD0VMKRBKA362svxvwCwbEurdnYK4Xpd3HaNBtIBs2yZ8Cq9Y-EWiSL2bpLncMCPFHw13pK7v5hi-cO1e7yQ18dFi9WhrU8-jgAEHgVCHadq9NU6Eli_pxccMs68Rgz8WQ2WljPSLtpyflCGDwAB9RE2ldwSjizONJQdczYJwxh8UhGKaDh124-dp13GToncjkm_QWD3oAKpyvuonl-j6RmYwklPv-P53sZgMcgSSjEMMtLuMnznP8vKiou5rIOESuv2jbnbW6B82LZeiTwDZka9JihMd03y6BIb65yzyHkW8UTrvo-BYxpsExp5YpUtHP1bOoU3yqN_6eLYe9aO3GBouJo0RA26oTBabJBgKiHcs9sWf-ql5CDLp4QeSz1j12e-WXfnxhjj4O0fTMsV94zQHfZMhO9USpuqMmUVeWOH_wpiEQMkfimnyR2orw7NeMrQ3FEAk3g_sTKtLwbIawUUH5VNyN7_zla0HltQWxYMNwtsElEplnSNjxKnS7LA5EJ1jYgtHvZ08vGUE-tlVMsCIi4DRN-VYF52nV2Hcae3aqFrn1QANU_m_6BxJoSgt9avuKo-nKhxOF-Pdkdxd-I-N3YKCh-IU6xk0I2XqDNXSZD37Kxgxpws2-7ArkJee3T2VG28oH5TuuW6Z04guMne4uBRr1jSOORqm5sMgXn-5da0wHBpZ-jdBNMN7VUVLTWjLOUjAoKtGKKpr7suC9yfdW-bjJ9h4rgedFJ7e6XUVgs34_7wUckouKV3WB8jioI143GkwHjcIfizC99Sc42vURE2Y8dFl63Y86kz4SOmX9LFj0g7YaCFBstD5e-XzfFAo52vhuR6pLwRR7SZ5aUi4wP5pbnVOIjv5yvkocDpXxFsi3OWTqW-uB58wiO8N6YMYODK9zNM3Vd6mb0I_aouB3hYDOOELeKHbZkOwIYBrx-Rhf6cJ0Kt1tc4UpNkkDYvTeD_fIGdcyg2qGK_8utfaYUPPNExD1M9brt3XQmythvPeeI20dI-9ZqNDZsBOtOoFfagshSAsjsrGLeiZyItYNqxwrmup150CcdTyZknUPIcph29MSZd60qCrbkGDL1N5vmznc-z-H6rD9QLoHpNE4KQ0_wTBvI3HrfT7Ro0rJUSotm81H5m95BFrWUrF_kuMYoTOzlFxVPD85Gt7v0TybT3CWkqzUSNvOhQV2_Dpkr0Hutu3Tnih5_OWjTIEMUoKQjEgOU-zrl4YGEY4kJle5ghdrkKLYzHrPR0DasWAQQTZaVVv9lDL3JqzK-6GAKDdcwYMy_M";
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
