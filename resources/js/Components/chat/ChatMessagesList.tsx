import { MessageResource } from "@/Types/Controllers/ChatController";
import { useUser } from "@/Context/UserContext"
import { UserResource } from "@/Types/Controllers/UserController";
import React from "react";

type MessagesListProps = {
    messages: MessageResource[];
    isGroup: boolean;
    messagesListRef?: React.RefObject<HTMLDivElement>;
};

const MessagesList = ({ messages, isGroup, messagesListRef }: MessagesListProps) => {

    const { user }: { user: UserResource | null } = useUser();

    if (!user) {
        return null;
    }

    const isToday = (date: Date) => {
        const today = new Date();
        return date.getUTCDate() === today.getUTCDate() &&
            date.getUTCMonth() === today.getUTCMonth() &&
            date.getUTCFullYear() === today.getUTCFullYear();
    };

    const isYesterday = (date: Date) => {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        return date.getUTCDate() === yesterday.getUTCDate() &&
            date.getUTCMonth() === yesterday.getUTCMonth() &&
            date.getUTCFullYear() === yesterday.getUTCFullYear();
    };

    return (
        <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={messagesListRef}>
            {messages.map((message, index) => {
                const previousMessage = messages[index - 1];
                const messageDate = new Date(message.created_at);
                const showDate = !previousMessage || new Date(previousMessage.created_at).toDateString() !== messageDate.toDateString();

                return (
                    <React.Fragment key={index}>
                        {showDate && (
                            <div className="text-center my-2 text-gray-500">
                                {isToday(messageDate) ? 'Today' : isYesterday(messageDate) ? 'Yesterday' : messageDate.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                            </div>
                        )}
                        <div
                            className={`flex ${message.sender_id == user.id ? "justify-end" : "justify-start"}`}
                        >
                            <div
                                className={`px-4 py-2 rounded-lg flex justify-between gap-3 items-end ${message.sender_id == user.id ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"
                                    }`}
                            >
                                {isGroup && message.sender_id != user.id && (
                                    <div className="text-xs text-gray-500 mb-1">
                                        {message.sender_name}
                                    </div>
                                )}
                                <p>{message.content}</p>
                                <div className="text-xs w-fit ml-auto">
                                    {messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'UTC' })}
                                </div>
                            </div>
                        </div>
                    </React.Fragment>
                );
            })}
        </div>
    );
};

export default MessagesList;
