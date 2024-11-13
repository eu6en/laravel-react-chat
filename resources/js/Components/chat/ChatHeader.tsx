import { ChatResource } from "@/Types/Controllers/ChatController";
import { Helmet } from "react-helmet";

const ChatHeader = ({ chatInfo }: { chatInfo: ChatResource }) => {

    const chatHeadline = chatInfo.is_group ? chatInfo.name || 'Group Chat' : `Chat with ${chatInfo.participants[1].user_name}`;

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
