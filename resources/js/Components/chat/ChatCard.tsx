import { useUser } from "@/Context/UserContext";
import { useNotificationHandler } from "@/hooks/useNotificationListener";
import { ChatResource, MessageResource } from "@/Types/Controllers/ChatController";
import { useEffect, useState } from "react";

interface ChatCardProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    chatInfo: ChatResource;
}

export default function ChatCard({
    chatInfo,
    ...props
}: ChatCardProps) {

    const { user } = useUser(); // Get the currently authenticated user from the user context

    const [lastMessage, setLastMessage] = useState<MessageResource | undefined>(chatInfo.messages?.[chatInfo.messages.length - 1]); // Get the last message in the chat
    const [lastMessageTimestamp, setLastMessageTimestamp] = useState<string | undefined>(lastMessage?.updated_at || lastMessage?.created_at); // Get the timestamp of the last message
    const chatName = chatInfo.is_group ? chatInfo.name || 'Group Chat' : chatInfo.participants?.filter(participant => !chatInfo.is_group && participant.id !== user?.id )?.[0].user_name; // If it's a group chat, use the chat name. Otherwise, use the other participant's name.

    useNotificationHandler(notification => {
        if (notification.chat_id === chatInfo.id) {
            setLastMessage(notification.message);
        }
    });

    useEffect(() => {
        setLastMessage(chatInfo.messages?.[chatInfo.messages.length - 1]);
    }, [chatInfo.messages]);

    return (
        <div
            {...(props as any)}
            className="flex px-6 py-4 hover:bg-gray-200 cursor-pointer border-b items-start relative"
        >
            {/* Display the chat icon */}
            <img
                src='/images/chat-bubble-oval-left.svg'
                alt={`${chatName} icon`}
                className="w-12 h-12 rounded-full mr-4"
            />
            {/* Display the chat name and last message */}
            <div className="flex-1">
                <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-gray-900">{chatName}</h2>
                    {lastMessageTimestamp && (
                        <span className="text-sm text-gray-500">
                            {lastMessageTimestamp}
                        </span>
                    )}
                </div>
                {lastMessage?.content && (
                    <p className="text-sm text-gray-600 truncate">
                        {lastMessage.content.trim().substring(0, 40)}
                        {lastMessage.content.trim().length > 40 && '...'}
                    </p>
                )}
            </div>
            {lastMessage && !lastMessage.read_at && (
                <div className="w-3 h-3 bg-blue-500 rounded-full absolute right-4 bottom-4"></div>
            )}
        </div>
    );
}
