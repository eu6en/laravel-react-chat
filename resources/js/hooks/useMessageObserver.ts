import { useEffect, useRef } from 'react';
import axios from 'axios';
import { MessageResource } from "@/Types/Controllers/ChatController";
import { markAsRead } from "@/api/MessageAPI";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { markMessageAsRead } from "@/store/chatsSlice";

// Observe messages in chat to mark them as read
const useMessageObserver = (userId: number) => {

    const dispatch = useDispatch();
    const messages = useSelector((state: RootState) => state.chats.currentChat?.messages);
    const observer = useRef<IntersectionObserver | null>(null);
    const readMessages = useRef<Set<number>>(new Set());

    useEffect(() => {

        // Prefill the readMessages set with already read messages to avoid marking them as read again
        messages?.forEach(message => {
            if (message.read_at) {
                readMessages.current.add(message.id);
            }
        });

        if (observer.current) observer.current.disconnect();

        // Create a new observer
        observer.current = new IntersectionObserver((entries) => {
            // Loop through the observer entries
            entries.forEach(entry => {
                // Check if the entry is intersecting
                if (entry.isIntersecting) {
                    // Make sure the entry is a message by checking the data-message-id attribute
                    const messageId = Number(entry.target.getAttribute('data-message-id'));
                    // If the message ID is not in the readMessages set
                    if (messageId && !readMessages.current.has(messageId)) {
                        // Find the message in the messages array
                        const message = messages?.find(msg => msg.id === messageId);
                        // If the message exists and has not been read yet and the sender is not the current user mark it as read
                        if (message && !message.read_at && message.sender_id !== userId) {
                            markAsRead(messageId).then(response => {
                                switch (response._t) {
                                    case 'success':
                                        // Add the message ID to the readMessages set
                                        readMessages.current.add(messageId);
                                        // Update the message read status
                                        dispatch(markMessageAsRead({ message_id: messageId, read_at: response.result.read_at }));
                                        // message.read_at = response.result.read_at;
                                        break;
                                    default:
                                        throw response.error;
                                }
                            });
                        }
                    }
                }
            });
        });

        const messageElements = document.querySelectorAll('[data-message-id]');
        messageElements.forEach(element => observer.current?.observe(element));

        return () => {
            observer.current?.disconnect();
        };
    }, [messages, userId]);
};

export default useMessageObserver;
