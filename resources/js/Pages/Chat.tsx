// resources/js/Pages/Chat.tsx
import { usePage } from "@inertiajs/react";
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { PageProps } from "../../../vendor/laravel/breeze/stubs/inertia-react-ts/resources/js/types";
import { useEffect, useState } from "react";
import axios from "axios";
import { GetSingleChatResource } from "@/Types/ChatController";

type ChatProps = PageProps & {
    chatId: string;
};

export default function Chat() {
    const { props } = usePage<ChatProps>();

    const [chatInfo, setChatInfo] = useState<GetSingleChatResource | null>(null);

    useEffect(() => {

        try {
            axios.get(`/api/chats/${props.chatId}`).then(response => {
                console.log(response.data);
                setChatInfo(response.data);
            });
        } catch (error) {
            console.error(error);
        };

    }, []);

    if (!chatInfo) {
        return (
            <AuthenticatedLayout>
                <Head title="Loading chat..." />
                <div className="flex flex-col h-screen items-center justify-center">
                    <p>Loading chat...</p>
                </div>
            </AuthenticatedLayout>
        );
    }

    return (
        <AuthenticatedLayout>
            <Head title={"Chat with " + chatInfo.chat_name} />
            <div className="flex flex-col h-screen bg-gray-100">
                <header className="bg-blue-500 text-white py-4 px-6 text-xl font-semibold shadow">
                    Chat with {chatInfo.chat_name}
                </header>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {chatInfo.messages.map((message, index) => (
                        <div
                            key={index}
                            className={`flex ${message.is_you ? "justify-end" : "justify-start"}`}
                        >
                            <div
                                className={`px-4 py-2 rounded-lg ${message.is_you ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"
                                    }`}
                            >
                                {chatInfo.is_group && !message.is_you && (
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

                <footer className="p-4 border-t">
                    <input
                        type="text"
                        placeholder="Type a message..."
                        className="w-full px-4 py-2 rounded-full border focus:outline-none"
                    />
                </footer>
            </div>
        </AuthenticatedLayout>
    );
};
