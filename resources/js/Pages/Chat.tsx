import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { usePage } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { PageProps } from "../../../vendor/laravel/breeze/stubs/inertia-react-ts/resources/js/types";
import { GetSingleChatResource } from "@/Types/ChatController";
import SendMessageInput from "@/Components/chat/SendMessageInput";
import ChatHeader from "@/Components/chat/ChatHeader";
import ChatLoading from "@/Components/chat/ChatLoading";
import ChatMessagesList from "@/Components/chat/ChatMessagesList";
import { Message } from "@/Types/DBInterfaces";
import { fetchChat } from "@/apis/chat";
import { useParams } from "react-router-dom";

type ChatPageProps = PageProps & {
    chatId: Message['chat_id'];
};

const Chat = () => {

    const { chatId } = useParams<{ chatId: string }>();
    if (chatId === undefined) throw new Error("Chat ID is undefined");

    const [chatInfo, setChatInfo] = useState<GetSingleChatResource | null>(null);
    const chatContainerRef = useRef<HTMLDivElement | null>(null);
    const messagesListRef = useRef<HTMLDivElement | null>(null);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        (async () => {
            const result = await fetchChat(chatId);
            switch (result._t) {
                case 'success':
                    setChatInfo(result.result);
                    break;
                default:
                    setError(result.error);
                    break;
            }
        })();
    }, []);

    if (error) {
        // This will cause the error to be thrown in render, triggering the ErrorBoundary since it can't be triggered in an async function
        throw error;
    }

    // // useLayoutEffect ensures that getBoundingClientRect returns the correct value
    useLayoutEffect(() => {

        if (!chatContainerRef.current || !messagesListRef.current) return;

        // Set the height of the chat container to fill the remaining space
        chatContainerRef.current.style.setProperty("height", `calc(100vh - ${chatContainerRef.current.getBoundingClientRect().top}px)`);

        // Scroll to the bottom of the messages list
        messagesListRef.current.scrollTo(0, messagesListRef.current.scrollHeight);

    }, [chatInfo]);

    return (
        <AuthenticatedLayout>
            <div className="flex flex-col bg-gray-100" ref={chatContainerRef}>
                {!chatInfo ? (
                    <ChatLoading />
                ) : (
                    <>
                        <ChatHeader chatName={chatInfo.chat_name} />
                        <ChatMessagesList messages={chatInfo.messages} isGroup={chatInfo.is_group} messagesListRef={messagesListRef} />
                        <footer className="p-4 border-t">
                            <SendMessageInput chatId={chatId} setChatInfo={setChatInfo} />
                        </footer>
                    </>
                )}
            </div>
        </AuthenticatedLayout>
    );
};

export default Chat;
