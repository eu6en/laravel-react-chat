import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

type Chat = {
    id: number;
    name: string;
    slug: string;
    message: string;
    timestamp: string;
    profileImage: string;
};

const chats: Chat[] = [
    {
        id: 1,
        name: "Alice Johnson",
        slug: "alice",
        message: "Hey! Are you coming to the meeting?",
        timestamp: "10:30 AM",
        profileImage: "https://via.placeholder.com/40x40",
    },
    {
        id: 2,
        name: "Bob Smith",
        slug: "bob",
        message: "See you at the event tonight!",
        timestamp: "9:15 AM",
        profileImage: "https://via.placeholder.com/40x40",
    },
    {
        id: 3,
        name: "Charlie Evans",
        slug: "charlie",
        message: "Thanks for the document!",
        timestamp: "Yesterday",
        profileImage: "https://via.placeholder.com/40x40",
    },
    // Add more chat data here as needed
];

export default function Chats() {
    return (
        <AuthenticatedLayout>
            <Head title="Chats" />

            <div className="flex flex-col h-screen bg-gray-100">
                <header className="bg-blue-500 text-white py-4 px-6 text-xl font-semibold shadow">
                    Chats
                </header>

                <div className="flex-1 overflow-y-auto">
                    {chats.map((chat) => (
                        <div
                            key={chat.id}
                            className="flex items-center px-6 py-4 hover:bg-gray-200 cursor-pointer border-b"
                        >
                            <img
                                src={chat.profileImage}
                                alt={`${chat.name}'s profile`}
                                className="w-12 h-12 rounded-full mr-4"
                            />
                            <div className="flex-1">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-lg font-semibold text-gray-900">{chat.name}</h2>
                                    <span className="text-sm text-gray-500">{chat.timestamp}</span>
                                </div>
                                <p className="text-sm text-gray-600 truncate">{chat.message}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </AuthenticatedLayout>
    );
}
