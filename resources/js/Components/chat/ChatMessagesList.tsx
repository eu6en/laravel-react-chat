import { MessageResource } from "@/Types/Controllers/ChatController";
import { useUser } from "@/Context/UserContext"
import { UserResource } from "@/Types/Controllers/UserController";

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

    return (
        <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={messagesListRef}>
            {messages.map((message, index) => (
                <div
                    key={index}
                    className={`flex ${message.sender_id == user.id ? "justify-end" : "justify-start"}`}
                >
                    <div
                        className={`px-4 py-2 rounded-lg ${message.sender_id == user.id ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"
                            }`}
                    >
                        {isGroup && message.sender_id != user.id && (
                            <div className="text-xs text-gray-500 mb-1">
                                {message.sender_name}
                            </div>
                        )}
                        <p>{message.content}</p>
                        <div className="text-xs w-fit ml-auto">{message.updated_at}</div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default MessagesList;
