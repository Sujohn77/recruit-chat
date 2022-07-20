import { call, put, take, all, takeEvery } from "redux-saga/effects";
import { FIREBASE_TOKEN } from "firebase/config";
import { handleSignInWithCustomToken } from "./handlers";
import initChatAction, { sagaActions } from "redux/actions";

function* setUserDataAfterVerify(argUserData: { type?: string; payload: any }) {
  const { error } = yield call(handleSignInWithCustomToken, FIREBASE_TOKEN);
  //   yield put(
  //     appActionsCreators.setFirebaseSignInWithCustomTokenError(Boolean(error))
  //   );
}

export function* watchInit() {
  yield takeEvery(initChatAction().type, setUserDataAfterVerify);
}

export function* rootSaga() {
  yield all([watchInit()]);
}

// export const getMessagesSuccess = (data: any) => {
//     return { type: "chat/addMessage" };
//   };

// export function* workGetMessages() {
//   const data: any = yield call(() => fetch(""));
//   const formattedMessages = yield data.json();
//   yield put(getMessagesSuccess(formattedMessages));
// }

// function* watchMessages() {
//   yield take("chat/init", workGetMessages);
// }
