import { configureStore } from '@reduxjs/toolkit'

import chatReducer from './slices'

export const store = configureStore({ reducer: chatReducer })
export type IRootState = ReturnType<typeof store.getState>;