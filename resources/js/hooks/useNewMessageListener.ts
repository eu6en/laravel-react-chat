import { MessageResource } from "@/Types/Controllers/ChatController";
import { useEffect } from 'react';

export const useNewMessageListener = (chatId: number, handleMessage: (message: MessageResource) => void) => {

  useEffect(() => {

    // Listen for new messages in the chat and update the chat info
    const channel = window.Echo.private(`chat.${chatId}`).listen(
      'MessageSent',
      (event) => {
        if (!event.message) {
          console.error('MessageSent event received without a message object');
          return;
        }
        const messageObject: MessageResource = event.message;

        handleMessage(messageObject);

      }
    );

    // Cleanup function to unbind the event listener
    return () => {
      channel.stopListening('MessageSent');
    };

  }, [chatId]);
};
