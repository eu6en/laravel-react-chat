import { GetUserChatsResource } from "@/Types/ChatController";

interface ChatCardProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    chatInfo: GetUserChatsResource;
}

export default function ChatCard({
    chatInfo,
    ...props
}: ChatCardProps) {
    return (
        <div
            {...(props as any)}
            className="flex px-6 py-4 hover:bg-gray-200 cursor-pointer border-b items-start"
        >
            <img
                src='/images/chat-bubble-oval-left.svg'
                alt={`${chatInfo.name} icon`}
                className="w-12 h-12 rounded-full mr-4"
            />
            <div className="flex-1">
                <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-gray-900">{chatInfo.name}</h2>
                    <span className="text-sm text-gray-500">{chatInfo.last_message_timestamp}</span>
                </div>
                <p className="text-sm text-gray-600 truncate">{chatInfo.last_message}</p>
            </div>
        </div>
    );
}
