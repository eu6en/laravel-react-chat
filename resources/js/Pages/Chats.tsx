import { index, store } from "@/api/ChatAPI";
import ChatCard from "@/Components/chat/ChatCard";
import ChatSingle from "@/Components/chat/ChatSingle";
import CreateNewChatModal from "@/Components/chat/CreateNewChatModal";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import Notification from "@/Components/chat/Notification";
import { RootState } from '@/store';
import { setChatsListInfo, addNewChatToList, setCurrentChat } from '@/store/chatsSlice';
import { useDispatch, useSelector } from 'react-redux';
import { PencilSquareIcon } from "@heroicons/react/24/solid";

export default function Chats() {

    const dispatch = useDispatch();
    const chats = useSelector((state: RootState) => state.chats.chatsListInfo);
    const currentChat = useSelector((state: RootState) => state.chats.currentChat);

    const [error, setError] = useState<Error | null>(null);

    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {

        // Fetch the list of chats
        index().then(response => {
            switch (response._t) {
                case 'success':
                    dispatch(setChatsListInfo(response.result));
                    break;
                default:
                    setError(response.error);
                    break;
            }
        });

    }, []);

    const handleNewChatClick = () => {
        setIsModalOpen(true);
    }

    const handleModalClose = () => {
        setIsModalOpen(false);
    };

    const handleFormSubmit = (chatName: string, chatUserName: string, isGroup: boolean) => {
        store(chatName, chatUserName, isGroup)
            .then(response => {
                switch (response._t) {
                    case 'success':
                        dispatch(addNewChatToList(response.result));
                        break;
                    default:
                        setError(response.error);
                        break;
                }
            });
    };

    if (error) { throw error; }

    return (
        <>
            <Helmet>
                <title>Chats</title>
                <meta name="description" content="List of user chats" />
            </Helmet>
            <div className="flex h-full">
                {/* Left column - Chat list */}
                <div className="w-1/3 max-w-sm bg-white dark:bg-gray-800 dark:text-white flex flex-col border-r border-gray-300 dark:border-black">
                    <div className="bg-blue-500 text-white py-4 px-6 text-xl font-semibold shadow flex justify-between items-center h-16 border-b-gray-300 dark:border-b-black border-b">
                        <header>
                            Chats
                        </header>
                        <button title="Start New Chat" onClick={ handleNewChatClick } className="rounded-full size-8 flex justify-center items-center">
                            <PencilSquareIcon className="w-6 h-6" />
                        </button>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {chats.map((chatInfo) => (
                            <ChatCard
                                chatId={chatInfo.id}
                                key={chatInfo.id}
                                onClick={() => currentChat?.id != chatInfo.id ? dispatch(setCurrentChat(chatInfo)) : ''} // Set selected chat on click
                            />
                        ))}
                    </div>
                </div>

                {/* Right column - Selected chat messages */}
                <div className="flex-1 flex flex-col bg-gray-50 dark:bg-gray-800">
                    {currentChat ? (
                        <ChatSingle chatId={currentChat.id} />
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-500">
                            Select a chat to view messages
                        </div>
                    )}
                </div>
            </div>
            <CreateNewChatModal isOpen={isModalOpen} onClose={handleModalClose} onSubmit={handleFormSubmit} />
            <Notification />
        </>
    );
}
