import { useUser } from "@/Context/UserContext";
import { useMessageRead } from "@/hooks/useMessageRead";
import { RootState } from "@/store";
import { markMessageAsRead } from "@/store/chatsSlice";
import { MessageResource } from "@/Types/Controllers/ChatController";
import { UserResource } from "@/Types/Controllers/UserController";
import React from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

type SingleMessageProps = {
    messageId: MessageResource['id'];
    searchTerm?: string;
};

const SingleMessage: React.FC<SingleMessageProps> = React.memo(({ messageId, searchTerm }) => {

    const { user }: { user: UserResource | null } = useUser();

    const dispatch = useDispatch();
    const message = useSelector((state: RootState) => state.chats.currentChat?.messages?.find((message) => message.id === messageId));
    const chatId = useSelector((state: RootState) => state.chats.currentChat?.id);
    const isGroup = useSelector((state: RootState) => state.chats.currentChat?.is_group);

    if (!user || !message || !chatId) return null;

    const messageDate = new Date(message.created_at);

    // Highlight the search term in the message content
    const highlightedContent = searchTerm
    ? message.content.replace(
        new RegExp(`(${searchTerm})`, "gi"),
        (match) => `<mark>${match}</mark>`
        )
    : message.content;

    useMessageRead(chatId, (response) => {
        // Update the message read status
        if (user.id == response.sender_id && response.id === message.id) {
            dispatch(markMessageAsRead({ message_id: messageId, read_at: response.read_at }));
        }
    });

    return (
        <div
            className={`flex ${message.sender_id == user.id ? "justify-self-end" : "justify-self-start"} max-w-[40rem]`}
            data-message-id={message.id}
        >
            <div
                className={`px-4 py-2 rounded-lg flex justify-between gap-3 items-end ${message.sender_id == user.id ? "bg-blue-500 text-white" : "bg-gray-200 dark:bg-gray-700 dark:text-white"
                    }`}
            >
                {isGroup && message.sender_id != user.id && (
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                        {message.sender_name}
                    </div>
                )}
                {/* <p>{message.content}</p> */}
                <p dangerouslySetInnerHTML={{ __html: highlightedContent }}></p>
                <div className="text-xs w-fit ml-auto">
                    {messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'UTC' })}
                </div>
                {message.sender_id == user.id && (
                    <div className="w-6 brightness-200 shrink-0">
                        {message.read_at ? (
                            <img src="/images/message_status_read.png" alt="" />
                        ) : (
                            <img src="/images/message_status_delivered.png" alt="" />
                        )}
                    </div>
                )}
            </div>
        </div>
    )
});

export default SingleMessage;
