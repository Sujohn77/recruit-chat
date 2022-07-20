import { createAction } from "@reduxjs/toolkit";

// What should I write instead of any
// to not get error here - dispatch(asyncAction(userFormData)) - in Component
// and here - takeEvery(asyncAction.type, workFunc) - in sagas
const initChatAction: any = createAction("INIT_CHAT");
export const sagaActions = {
  FETCH_DATA_SAGA: "FETCH_DATA_SAGA",
};
export default initChatAction;
