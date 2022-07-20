import { configureStore } from '@reduxjs/toolkit'
import createSagaMiddleware from 'redux-saga'
import { rootSaga } from 'saga';
import chatReducer from './slices'

// Middleware
const saga = createSagaMiddleware()

export const store = configureStore({ reducer: chatReducer, middleware:[saga]});

saga.run(rootSaga)

export type IRootState = ReturnType<typeof store.getState>;