import { GetSingleChatResource, GetUserChatsResource } from "@/Types/Controllers/ChatController";
import { Message } from "@/Types/DBInterfaces";
import axios from "axios";

type Success = { _t: 'success', result: GetSingleChatResource | null };
type InvalidChatIdError = { _t: 'invalid-chat-id-error', error: Error };
type fetchChatAxiosError = { _t: 'fetch-chat-axios-error', error: Error };
type UnknownError = { _t: 'unknown-error', error: Error };
type fetchChatResult =
    | Success
    | InvalidChatIdError
    | fetchChatAxiosError
    | UnknownError;

export async function fetchChat(chatId: Message['chat_id']): Promise<fetchChatResult> {
    if (!chatId || isNaN(Number(chatId))) return { _t: 'invalid-chat-id-error', error: new Error('Invalid chat ID: Chat ID must be a number') };
    try {
        const response = await axios.get(`/api/chats/${chatId}`);
        return { _t: 'success', result: response.data };
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            return { _t: 'fetch-chat-axios-error', error: new Error(`${error.message}\n${error?.response?.data.message}`) };
        } else {
            return { _t: 'unknown-error', error: new Error(`An unknown error occurred while fetching the chat. Please try again later.\n${error}`) };
        }
    }
};


type StoreSuccess = { _t: 'success', result: GetUserChatsResource };
type StoreInvalidChatUserNameError = { _t: 'invalid-chat-user-name-error', error: Error };
type StoreResponseEmptyError = { _t: 'response-empty-error', error: Error };
type StoreAxiosError = { _t: 'axios-error', error: Error };
type StoreUnknownError = { _t: 'unknown-error', error: Error };
type StoreResult =
    | StoreSuccess
    | StoreInvalidChatUserNameError
    | StoreResponseEmptyError
    | StoreAxiosError
    | StoreUnknownError;

export async function store(chatName: string, chatParticipantName: string, isGroup: boolean): Promise<StoreResult> {
    if (chatParticipantName.trim() === '') return { _t: 'invalid-chat-user-name-error', error: new Error('Chat participant name cannot be empty') };
    try {
        const response = await axios.post('/api/chats/store', {
            chatName,
            chatParticipantName,
            isGroup,
        });
        if (!response.data) return { _t: 'response-empty-error', error: new Error('No chat data returned') };
        return { _t: 'success', result: response.data };
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            return { _t: 'axios-error', error: new Error(`${error.message}\n${error?.response?.data.message}`) };
        } else {
            return { _t: 'unknown-error', error: new Error(`An unknown error occurred while storing the chat. Please try again later.\n${error}`) };
        }
    }
};
