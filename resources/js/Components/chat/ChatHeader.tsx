import { GetSingleChatResource } from "@/Types/ChatController";
import { Head } from "@inertiajs/react";

const ChatHeader = ({ chatName }: { chatName: Pick<GetSingleChatResource, 'chat_name'>['chat_name'] }) => {

    const chatHeadline = "Chat" + (chatName ? ` with ${chatName}` : '');

    return (
        <>
            <Head title={chatHeadline} />
            <header className="bg-blue-500 text-white py-4 px-6 text-xl font-semibold shadow">
                {chatHeadline}
            </header>
        </>
    )
};

export default ChatHeader;
