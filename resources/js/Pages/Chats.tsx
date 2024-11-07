import ChatCard from "@/Components/ChatCard";
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { GetUserChatsResource } from "@/Types/ChatController";
import { Head } from '@inertiajs/react';
import axios from "axios";
import { useEffect, useState } from "react";

export default function Chats() {

    const [chats, setChats] = useState<GetUserChatsResource[]>([]);

    useEffect(() => {

        try {
            axios.get('/api/chats').then(response => {
                console.log(response.data);
                setChats(response.data);
            });
        } catch (error) {
            console.error(error);
        };

    }, []);

    return (
        <AuthenticatedLayout>
            <Head title="Chats" />

            <div className="flex flex-col h-screen bg-gray-100 max-w-96">
                <header className="bg-blue-500 text-white py-4 px-6 text-xl font-semibold shadow">
                    Chats
                </header>

                <div className="flex-1 overflow-y-auto">
                    {chats.map((chatInfo) => (
                        <ChatCard chatInfo={chatInfo} key={chatInfo.id}/>
                    ))}
                </div>
            </div>

        </AuthenticatedLayout>
    );
}
