import { ChatResource } from "@/Types/Controllers/ChatController";
import { Message } from "@/Types/DBInterfaces";
import axios from "axios";

type Show_Success = { _t: 'success', result: ChatResource | null };
type Show_InvalidChatIdError = { _t: 'invalid-chat-id-error', error: Error };
type Show_AxiosError = { _t: 'axios-error', error: Error };
type Show_UnknownError = { _t: 'unknown-error', error: Error };
type Show_Result =
    | Show_Success
    | Show_InvalidChatIdError
    | Show_AxiosError
    | Show_UnknownError;

export async function show(chatId: Message['chat_id']): Promise<Show_Result> {
    if (!chatId || isNaN(Number(chatId))) return { _t: 'invalid-chat-id-error', error: new Error('Invalid chat ID: Chat ID must be a number') };
    try {
        const response = await axios.get(`/api/chats/${chatId}`);
        return { _t: 'success', result: response.data };
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            return { _t: 'axios-error', error: new Error(`${error.message}\n${error?.response?.data.message}`) };
        } else {
            return { _t: 'unknown-error', error: new Error(`An unknown error occurred while fetching the chat. Please try again later.\n${error}`) };
        }
    }
};


type Store_Success = { _t: 'success', result: ChatResource };
type Store_InvalidChatUserNameError = { _t: 'invalid-chat-user-name-error', error: Error };
type Store_EmptyResponseError = { _t: 'empty-response-error', error: Error };
type Store_AxiosError = { _t: 'axios-error', error: Error };
type Store_UnknownError = { _t: 'unknown-error', error: Error };
type Store_Result =
    | Store_Success
    | Store_InvalidChatUserNameError
    | Store_EmptyResponseError
    | Store_AxiosError
    | Store_UnknownError;

export async function store(chatName: string, chatParticipantName: string, isGroup: boolean): Promise<Store_Result> {
    if (chatParticipantName.trim() === '') return { _t: 'invalid-chat-user-name-error', error: new Error('Chat participant name cannot be empty') };
    try {
        const response = await axios.post('/api/chats', {
            chatName,
            chatParticipantName,
            isGroup,
        });
        if (!response.data) return { _t: 'empty-response-error', error: new Error('No chat data returned') };
        return { _t: 'success', result: response.data };
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            return { _t: 'axios-error', error: new Error(`${error.message}\n${error?.response?.data.message}`) };
        } else {
            return { _t: 'unknown-error', error: new Error(`An unknown error occurred while storing the chat. Please try again later.\n${error}`) };
        }
    }
};


type Index_Success = { _t: 'success', result: ChatResource[] };
type Index_EmptyResponseError = { _t: 'empty-response-error', error: Error };
type Index_AxiosError = { _t: 'axios-error', error: Error };
type Index_UnknownError = { _t: 'unknown-error', error: Error };
type Index_Result =
    | Index_Success
    | Index_EmptyResponseError
    | Index_AxiosError
    | Index_UnknownError;

export async function index(): Promise<Index_Result> {
    try {

        const response = await axios.get('/api/chats');

        if (!response.data) return { _t: 'empty-response-error', error: new Error('No chat data returned') };

        return { _t: 'success', result: response.data };

    } catch (error) {

        if (axios.isAxiosError(error)) {
            return { _t: 'axios-error', error: new Error('An error occurred while sending the message. Please try again later.') };
        } else {
            return { _t: 'unknown-error', error: new Error('An unknown error occurred while sending the message. Please try again later.') };

        }
    }
}
