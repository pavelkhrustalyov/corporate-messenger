import { configureStore } from '@reduxjs/toolkit';
// import { userSlice } from './userSlice';
import { authSlice } from './authSlice/authSlice';
import { userSlice } from './userSlice/userSlice';
import { apiSlice } from './apiSlice';

// Создаем Redux store
export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    users: userSlice.reducer,
    auth: authSlice.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware()
    .concat(apiSlice.middleware),
  devTools: true,
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
