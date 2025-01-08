import { ChatResource, MessageResource } from "@/Types/Controllers/ChatController";
import { useUser } from "@/Context/UserContext";
import { UserResource } from "@/Types/Controllers/UserController";
import React, { useEffect, useRef } from "react";
import SingleMessage from "./SingleMessage";
import { isToday, isYesterday } from "@/utils/dateUtils";
import useMessageObserver from "@/hooks/useMessageObserver";
import { RootState } from "@/store";
import { useSelector } from "react-redux";

type MessagesListProps = {
    messagesListRef?: React.RefObject<HTMLDivElement>;
    searchTerm: string;
};

const MessagesList = ({ messagesListRef, searchTerm }: MessagesListProps) => {

    const chatInfo = useSelector((state: RootState) => state.chats.currentChat); // Get the current chat

    // Get the current user
    const { user }: { user: UserResource | null } = useUser();

    if (!user || !chatInfo?.messages) return null;

    const messageRefs = useRef<Record<number, HTMLDivElement | null>>({});

    useEffect(() => {
        if (searchTerm) {
            // Find the first message that matches the search term
            const matchingMessage = chatInfo?.messages?.find((message) =>
            message.content.toLowerCase().includes(searchTerm.toLowerCase())
            );

            if (matchingMessage && messageRefs.current[matchingMessage.id]) {
            // Scroll to the matching message
            messageRefs.current[matchingMessage.id]?.scrollIntoView({ behavior: "smooth", block: "center" });
            }
        }
    }, [searchTerm, chatInfo.messages]);

    // Observe messages to mark them as read
    useMessageObserver(user.id);

    return (
        <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={messagesListRef}>
            {chatInfo.messages.map((message, index) => {
                const previousMessage = chatInfo.messages ? chatInfo.messages[index - 1] : undefined;
                const messageDate = new Date(message.created_at);
                const showDate = !previousMessage || new Date(previousMessage.created_at).toDateString() !== messageDate.toDateString(); // Show date if the previous message is from a different day

                // Check if the message content includes the search term
                const isMatch = searchTerm && message.content.toLowerCase().includes(searchTerm.toLowerCase());

                return (
                    <React.Fragment key={message.id}>
                        {showDate && (
                            <div className="text-center my-2 text-gray-500">
                                {isToday(messageDate) ? 'Today' : isYesterday(messageDate) ? 'Yesterday' : messageDate.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                            </div>
                        )}

                    <div
                        ref={(el) => (messageRefs.current[message.id] = el)}
                        className={isMatch ? "bg-yellow-200" : ""}
                    >
                        <SingleMessage messageId={message.id} searchTerm={searchTerm} />
                    </div>

                    </React.Fragment>
                );
            })}
        </div>
    );
};

export default MessagesList;
