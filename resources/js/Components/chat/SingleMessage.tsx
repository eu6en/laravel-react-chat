import { useUser } from "@/Context/UserContext";
import { MessageResource } from "@/Types/Controllers/ChatController";
import { UserResource } from "@/Types/Controllers/UserController";
import React from "react";
import { useState } from "react";

type SingleMessageProps = {
    initialMessage: MessageResource;
    messageDate: Date;
    chatId: number;
    isGroup: boolean;
};

const SingleMessage: React.FC<SingleMessageProps> = React.memo(({ initialMessage, messageDate, chatId, isGroup }) => {

    const { user }: { user: UserResource | null } = useUser();
    const [message, setmessage] = useState<MessageResource | null>(initialMessage);

    if (!user || !message) return null;

    // Listen for new read messages and update the read status
    window.Echo.private(`message-read.${chatId}`)
        .listen('MessageRead', (event) => {
            if (!event.message) {
                console.error('NO MESSAGE');
            };
            const messageObject: MessageResource = event.message;
            // Update the message read status
            if (messageObject.id === message.id) {
                console.log('UPDATE MESSAGE READ STATUS: ', messageObject.content);
                setmessage(prevMessage => {
                    if (!prevMessage) return null;
                    return {
                        ...prevMessage,
                        read_at: messageObject.read_at
                    };
                });
            }
        });

    return (
        <div
            className={`flex ${message.sender_id == user.id ? "justify-end" : "justify-start"}`}
            data-message-id={message.id}
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
                {message.sender_id == user.id && message.read_at && (
                    <div className="text-xs text-green-500 ml-2">
                        Read
                    </div>
                )}
            </div>
        </div>
  )
});

export default SingleMessage;
