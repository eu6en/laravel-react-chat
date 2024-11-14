import { MessageResource } from "@/Types/Controllers/ChatController";
import axios from "axios";

type Store_Success = { _t: 'success', result: MessageResource };
type Store_InvalidMessageError = { _t: 'invalid-message-error', error: Error };
type Store_InvalidChatIdError = { _t: 'invalid-chat-id-error', error: Error };
type Store_EmptyResponseError = { _t: 'empty-response-error', error: Error };
type Store_AxiosError = { _t: 'axios-error', error: Error };
type Store_UnknownError = { _t: 'unknown-error', error: Error };
type Store_Result =
    | Store_Success
    | Store_InvalidMessageError
    | Store_InvalidChatIdError
    | Store_EmptyResponseError
    | Store_AxiosError
    | Store_UnknownError;

export async function store(chatId: number, message: string): Promise<Store_Result> {
    if (!message.trim()) return { _t: 'invalid-message-error', error: new Error('Message cannot be empty') };
    if (!chatId || isNaN(chatId)) return { _t: 'invalid-chat-id-error', error: new Error('Invalid chat ID: Chat ID must be a number') };

    try {

        const response = await axios.post(`/api/chats/${chatId}/send-message`, {
            content: message,
        });

        if (!response.data) return { _t: 'empty-response-error', error: new Error('No message data returned') };

        return { _t: 'success', result: response.data };

    } catch (error) {

        if (axios.isAxiosError(error)) {
            return { _t: 'axios-error', error: new Error('An error occurred while sending the message. Please try again later.') };
        } else {
            return { _t: 'unknown-error', error: new Error('An unknown error occurred while sending the message. Please try again later.') };
        }
    }
}
