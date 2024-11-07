import { MessagesResource } from "@/Types/ChatController";

type MessagesListProps = {
    messages: MessagesResource[];
    isGroup: boolean;
    messagesListRef?: React.RefObject<HTMLDivElement>;
};

const MessagesList = ({ messages, isGroup, messagesListRef }: MessagesListProps) => (
    <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={messagesListRef}>
        {messages.map((message, index) => (
            <div
                key={index}
                className={`flex ${message.is_you ? "justify-end" : "justify-start"}`}
            >
                <div
                    className={`px-4 py-2 rounded-lg ${message.is_you ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"
                        }`}
                >
                    {isGroup && !message.is_you && (
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

export default MessagesList;
