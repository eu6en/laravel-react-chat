import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ChatResource, MessageResource } from "@/Types/Controllers/ChatController";
import SendMessageInput from "@/Components/chat/SendMessageInput";
import ChatHeader from "@/Components/chat/ChatHeader";
import ChatLoading from "@/Components/chat/ChatLoading";
import ChatMessagesList from "@/Components/chat/ChatMessagesList";
import { Message } from "@/Types/DBInterfaces";
import { show } from "@/apis/chat";

type ChatProps = {
    chatId: Message['chat_id'];
};

const Chat = ({ chatId }: ChatProps) => {

    if (chatId === undefined) throw new Error("Chat ID is undefined");

    const [chatInfo, setChatInfo] = useState<ChatResource | null>(null);
    const chatContainerRef = useRef<HTMLDivElement | null>(null);
    const messagesListRef = useRef<HTMLDivElement | null>(null);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {

        show(chatId).then((response) => {
            switch (response._t) {
                case 'success':
                    setChatInfo(response.result);
                    break;
                default:
                    setError(response.error);
                    break;
            }
        });

        // Listen for new messages in the chat and update the chat info
        window.Echo.channel(`chat.${chatId}`)
            .listen('MessageSent', (event) => {
                if (!event.message) {
                    console.error('NO MESSAGE');
                };
                const messageObject: MessageResource = event.message;
                setChatInfo((prevChatInfo) => {
                    if (!prevChatInfo) return null;
                    return {
                        ...prevChatInfo,
                        messages: [...prevChatInfo.messages, messageObject]
                    };
                });
            });

    }, [chatId]);

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
        <div className="flex flex-col b`g-gray-100" ref={chatContainerRef}>
            {!chatInfo ? (
                <ChatLoading />
            ) : (
                <>
                    <ChatHeader chatInfo={chatInfo} />
                    <ChatMessagesList messages={chatInfo.messages} isGroup={chatInfo.is_group} messagesListRef={messagesListRef} />
                    <footer className="p-4 border-t">
                        <SendMessageInput chatId={chatId} setChatInfo={setChatInfo} />
                    </footer>
                </>
            )}
        </div>
    );
};

export default Chat;
