import { GetSingleChatResource } from "@/Types/Controllers/ChatController";
import { Helmet } from "react-helmet";

const ChatHeader = ({ chatName }: { chatName: GetSingleChatResource['chat_name'] }) => {

    const chatHeadline = "Chat" + (chatName ? ` with ${chatName}` : '');

    return (
        <>
            <Helmet>
                <title>{chatHeadline}</title>
            </Helmet>
            <header className="bg-blue-500 text-white py-4 px-6 text-xl font-semibold shadow">
                {chatHeadline}
            </header>
        </>
    )
};

export default ChatHeader;
