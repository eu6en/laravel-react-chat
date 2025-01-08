import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ChatResource, MessageResource } from '@/Types/Controllers/ChatController';
import { Message } from "postcss";

interface ChatsState {
    chatsListInfo: ChatResource[];
    currentChat: ChatResource | null;
}

const initialState: ChatsState = {
    chatsListInfo: [],
    currentChat: null,
};

const chatsSlice = createSlice({
    name: 'chatsListInfo',
    initialState,
    reducers: {
        setChatsListInfo(state, action: PayloadAction<ChatResource[]>) {
            state.chatsListInfo = action.payload;
        },
        addNewChatToList(state, action: PayloadAction<ChatResource>) {
            state.chatsListInfo.push(action.payload);
        },
        setCurrentChat(state, action: PayloadAction<ChatResource | null>) {
            state.currentChat = action.payload;
        },
        addMessageToCurrentChat(state, action: PayloadAction<MessageResource>) {
            if (state.currentChat) {
                // Update current chat
                state.currentChat.messages?.push(action.payload);
                // Update last message in the chats list
                state.chatsListInfo.find(chat => chat.id === state.currentChat?.id)?.messages?.push(action.payload);
            }
        },
        markMessageAsRead(state, action: PayloadAction<{ message_id: MessageResource['id'], read_at: MessageResource['read_at'] }>) {
            if (state.currentChat) {
                const message = state.currentChat.messages?.find(message => message.id === action.payload.message_id);
                if (message) {
                    message.read_at = action.payload.read_at;
                }
            }
        },
    },
});

export const { setChatsListInfo, addNewChatToList, setCurrentChat, addMessageToCurrentChat, markMessageAsRead } = chatsSlice.actions;
export default chatsSlice.reducer;
