import { useUser } from "@/Context/UserContext";
import { ChatResource } from "@/Types/Controllers/ChatController";

interface ChatCardProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    chatInfo: ChatResource;
}

export default function ChatCard({
    chatInfo,
    ...props
}: ChatCardProps) {

    const { user } = useUser(); // Get the currently authenticated user from the user context
    const lastMessage = chatInfo.messages?.[chatInfo.messages.length - 1]; // Get the last message in the chat
    const lastMessageTimestamp = lastMessage?.updated_at || lastMessage?.created_at;
    const chatName = chatInfo.is_group ? chatInfo.name || 'Group Chat' : chatInfo.participants?.filter(participant => !chatInfo.is_group && participant.id !== user?.id )?.[0].user_name; // If it's a group chat, use the chat name. Otherwise, use the other participant's name.

    return (
        <div
            {...(props as any)}
            className="flex px-6 py-4 hover:bg-gray-200 cursor-pointer border-b items-start"
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
                    <span className="text-sm text-gray-500">
                        {lastMessageTimestamp}
                    </span>
                </div>
                {lastMessage?.content && (
                    <p className="text-sm text-gray-600 truncate">
                        {lastMessage.content.trim().substring(0, 40)}
                        {lastMessage.content.trim().length > 40 && '...'}
                    </p>
                )}
            </div>
        </div>
    );
}
