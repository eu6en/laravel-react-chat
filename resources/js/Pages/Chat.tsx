// resources/js/Pages/Chat.tsx
import React from "react";
import { usePage } from "@inertiajs/react";
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { PageProps } from "../../../vendor/laravel/breeze/stubs/inertia-react-ts/resources/js/types";

type ChatProps = PageProps & {
  userSlug: string;
};

type Message = {
  id: number;
  sender: string;
  content: string;
  timestamp: string;
};

const messages: Message[] = [
  { id: 1, sender: "Alice", content: "Hey, are you there?", timestamp: "10:32 AM" },
  { id: 2, sender: "You", content: "Yes, I'm here!", timestamp: "10:33 AM" },
  { id: 3, sender: "Alice", content: "Great to hear!", timestamp: "10:34 AM" },
  // Add more messages as needed
];

const Chat: React.FC = () => {
  const { props } = usePage<ChatProps>();
  const { userSlug } = props;

  return (
    <AuthenticatedLayout>
        <Head title={"Chat with " + userSlug} />
        <div className="flex flex-col h-screen bg-gray-100">
            <header className="bg-blue-500 text-white py-4 px-6 text-xl font-semibold shadow">
                Chat with {userSlug}
            </header>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                <div
                    key={message.id}
                    className={`flex ${message.sender === "You" ? "justify-end" : "justify-start"}`}
                >
                    <div
                    className={`px-4 py-2 rounded-lg ${
                        message.sender === "You" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"
                    }`}
                    >
                    <p>{message.content}</p>
                    <span className="text-xs text-gray-500">{message.timestamp}</span>
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

export default Chat;
