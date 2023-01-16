import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';

import authReducer from './reducers/authSlice';


export const store = configureStore({
  reducer: {
    auth: authReducer,
  
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
		serializableCheck: false})
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
