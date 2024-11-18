import { ChatResource, MessageResource } from "@/Types/Controllers/ChatController";
import { useUser } from "@/Context/UserContext";
import { UserResource } from "@/Types/Controllers/UserController";
import React from "react";
import SingleMessage from "./SingleMessage";
import { isToday, isYesterday } from "@/utils/dateUtils";
import useMessageObserver from "@/hooks/useMessageObserver";

type MessagesListProps = {
    chatInfo: ChatResource | null;
    messagesListRef?: React.RefObject<HTMLDivElement>;
};

const MessagesList = ({ chatInfo, messagesListRef }: MessagesListProps) => {

    // Get the current user
    const { user }: { user: UserResource | null } = useUser();

    if (!user || !chatInfo?.messages) return null;

    // Observe messages to mark them as read
    useMessageObserver(chatInfo.messages, user.id);

    return (
        <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={messagesListRef}>
            {chatInfo.messages.map((message, index) => {
                const previousMessage = chatInfo.messages ? chatInfo.messages[index - 1] : undefined;
                const messageDate = new Date(message.created_at);
                const showDate = !previousMessage || new Date(previousMessage.created_at).toDateString() !== messageDate.toDateString(); // Show date if the previous message is from a different day

                return (
                    <React.Fragment key={message.id}>
                        {showDate && (
                            <div className="text-center my-2 text-gray-500">
                                {isToday(messageDate) ? 'Today' : isYesterday(messageDate) ? 'Yesterday' : messageDate.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                            </div>
                        )}

                        <SingleMessage initialMessage={message} messageDate={messageDate} isGroup={chatInfo.is_group} chatId={chatInfo.id} />

                    </React.Fragment>
                );
            })}
        </div>
    );
};

export default MessagesList;
