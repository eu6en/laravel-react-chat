import { MessageResource } from "@/Types/Controllers/ChatController"

export const useMessageRead = (chatId: number, handleMessageRead: (message: MessageResource) => void) => {
    // Listen for new read messages and update the read status
    window.Echo.private(`message-read.${chatId}`)
        .listen('MessageRead', (event) => {
            if (!event.message) {
                throw new Error('Web Socket event does not contain a message object');
            };
            const messageObject: MessageResource = event.message;
            // Update the message read status
            handleMessageRead(messageObject);
        });
}
