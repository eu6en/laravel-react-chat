import { configureStore } from '@reduxjs/toolkit';
import chatsReducer from './chatsSlice';
import themeReducer from './themeSlice';

export const store = configureStore({
    reducer: {
        chats: chatsReducer,
        theme: themeReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
