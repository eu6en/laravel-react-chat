import { GetSingleChatResource } from "@/Types/Controllers/ChatController";
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
