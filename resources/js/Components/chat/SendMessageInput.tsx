import { store } from "@/api/MessageAPI";
import { Message } from "@/Types/DBInterfaces";
import React, { FormEvent, useState } from "react";
import { useDispatch } from 'react-redux';
import { addMessageToCurrentChat } from '@/store/chatsSlice';
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";

interface SendMessageInputProps {
    chatId: Message['chat_id'];
}

export default function SendMessageInput({ chatId }: SendMessageInputProps) {
    const dispatch = useDispatch();

    const [message, setMessage] = useState("");
    const [error, setError] = useState<Error | null>(null);

    const handleMessageInputChange = (event: React.ChangeEvent<HTMLInputElement>) => setMessage(event.target.value);

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        store(chatId, message).then(response => {
            switch (response._t) {
                case 'success':
                    dispatch(addMessageToCurrentChat(response.result));
                    break;
                default:
                    setError(response.error);
                    break;
            }
        });
        setMessage(""); // Reset the input field value
    };

    if (error) { throw error; }

    return (
        <form onSubmit={handleSubmit}>
            <div className="flex dark:bg-gray-800">
                <input
                    name="message"
                    type="text"
                    placeholder="Type a message..."
                    className="w-full p-4 focus:ring-0 outline-none bg-transparent border-none dark:text-white"
                    value={message}
                    onChange={handleMessageInputChange}
                />
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 disabled:opacity-70"
                    disabled={!message.trim()} // Disable if message is empty
                >
                    <PaperAirplaneIcon className="w-6 h-6" />
                </button>
            </div>
        </form>
    );
};
