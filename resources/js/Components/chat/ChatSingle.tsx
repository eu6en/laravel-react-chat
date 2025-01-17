import { useEffect, useLayoutEffect, useRef, useState } from "react";
import SendMessageInput from "@/Components/chat/SendMessageInput";
import ChatHeader from "@/Components/chat/ChatHeader";
import ChatLoading from "@/Components/chat/ChatLoading";
import ChatMessagesList from "@/Components/chat/ChatMessagesList";
import { Message } from "@/Types/DBInterfaces";
import { show } from "@/api/ChatAPI";
import { useNewMessageListener } from "@/hooks/useNewMessageListener";
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { setCurrentChat, addMessageToCurrentChat } from '@/store/chatsSlice';

type ChatProps = {
    chatId: Message['chat_id'];
};

const Chat = ({ chatId }: ChatProps) => {

    if (chatId === undefined) throw new Error("Chat ID is undefined");

    const dispatch = useDispatch();
    const chatInfo = useSelector((state: RootState) => state.chats.currentChat);

    const chatContainerRef = useRef<HTMLDivElement | null>(null);
    const messagesListRef = useRef<HTMLDivElement | null>(null);
    const [error, setError] = useState<Error | null>(null);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {

        // Fetch the chat info
        show(chatId).then((response) => {
            switch (response._t) {
                case 'success':
                    dispatch(setCurrentChat(response.result));
                    break;
                default:
                    setError(response.error);
                    break;
            }
        });

    }, [chatId]);

    useNewMessageListener(chatId, messageObject => {
        dispatch(addMessageToCurrentChat(messageObject));
    });

    // This will cause the error to be thrown in render, triggering the ErrorBoundary since it can't be triggered in an async function
    if (error) { throw error; }

    // useLayoutEffect ensures that getBoundingClientRect returns the correct value
    useLayoutEffect(() => {
        if (!chatContainerRef.current || !messagesListRef.current) return;

        // Set the height of the chat container to fill the remaining space
        chatContainerRef.current.style.setProperty("height", `calc(100vh - ${chatContainerRef.current.getBoundingClientRect().top}px)`);

        // Scroll to the bottom of the messages list
        messagesListRef.current.scrollTo(0, messagesListRef.current.scrollHeight);
    }, [chatInfo]);

    return (
        <div className="flex flex-col bg-gray-100 dark:bg-gray-900" ref={chatContainerRef}>
            {!chatInfo ? (
                <ChatLoading />
            ) : (
                <>
                    <ChatHeader onSearch={setSearchTerm}/>
                    {chatInfo.messages && (
                        <ChatMessagesList key={chatId} messagesListRef={messagesListRef} searchTerm={searchTerm} />
                    )}
                    <footer>
                        <SendMessageInput chatId={chatId}/>
                    </footer>
                </>
            )}
        </div>
    );
};

export default Chat;
