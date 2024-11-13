import ChatCard from "@/Components/chat/ChatCard";
import ChatSingle from "@/Components/chat/ChatSingle";
import CreateNewChatModal from "@/Components/chat/CreateNewChatModal";
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { GetUserChatsResource } from "@/Types/Controllers/ChatController";
import axios from "axios";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";

export default function Chats() {
    const [chats, setChats] = useState<GetUserChatsResource[]>([]);
    const [selectedChat, setSelectedChat] = useState<GetUserChatsResource | null>(null);

    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        axios.get('/api/chats')
            .then(response => {
                setChats(response.data);
            })
            .catch(error => console.error(error));
    }, []);

    const handleNewChatClick = () => {
        setIsModalOpen(true);
    }

    const handleModalClose = () => {
        setIsModalOpen(false);
    };

    const handleFormSubmit = (chatName: string, chatUserName: string) => {
        console.log('handleFormSubmit function is not implemented yet');
    };

    return (
        <>
            <Helmet>
                <title>Chats</title>
                <meta name="description" content="List of user chats" />
            </Helmet>
            <AuthenticatedLayout>
                <div className="flex h-full bg-gray-100">
                    {/* Left column - Chat list */}
                    <div className="w-1/3 max-w-sm bg-white flex flex-col border-r border-gray-200">
                        <div className="bg-blue-500 text-white py-4 px-6 text-xl font-semibold shadow flex justify-between">
                            <header>
                                Chats
                            </header>
                            <button title="Start New Chat" onClick={ handleNewChatClick } className="bg-white shadow rounded-full text-black size-8 flex justify-center items-center">
                                <img className="size-6" src="/images/plus-icon.svg" alt="Start New Chat" />
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto">
                            {chats.map((chatInfo) => (
                                <ChatCard
                                    chatInfo={chatInfo}
                                    key={chatInfo.id}
                                    onClick={() => setSelectedChat(chatInfo)} // Set selected chat on click
                                />
                            ))}
                        </div>
                    </div>

                    {/* Right column - Selected chat messages */}
                    <div className="flex-1 flex flex-col bg-gray-50">
                        {selectedChat ? (
                            <ChatSingle chatId={selectedChat.id} />
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-500">
                                Select a chat to view messages
                            </div>
                        )}
                    </div>
                </div>
                <CreateNewChatModal isOpen={isModalOpen} onClose={handleModalClose} onSubmit={handleFormSubmit} />
            </AuthenticatedLayout>
        </>
    );
}
