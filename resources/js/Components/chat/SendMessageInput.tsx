import { store } from "@/apis/MessageAPI";
import { ChatResource } from "@/Types/Controllers/ChatController";
import { Message } from "@/Types/DBInterfaces";
import React, { FormEvent, useState } from "react";

interface SendMessageInputProps {
    chatId: Message['chat_id'];
    setChatInfo: React.Dispatch<React.SetStateAction<ChatResource | null>>;
}

export default function SendMessageInput({ chatId, setChatInfo }: SendMessageInputProps) {
    const [message, setMessage] = useState("");
    const [error, setError] = useState<Error | null>(null);

    const handleMessageInputChange = (event: React.ChangeEvent<HTMLInputElement>) => setMessage(event.target.value);

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        store(chatId, message).then(response => {
            switch (response._t) {
                case 'success':
                    setChatInfo((prevChatInfo) => {
                        if (!prevChatInfo) return null;

                        const updatedChatInfo = {
                            ...prevChatInfo,
                            messages: [
                                ...prevChatInfo.messages,
                                response.result, // Access the message from the response correctly
                            ],
                        };

                        return updatedChatInfo;
                    });
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
            <div className="flex">
                <input
                    name="message"
                    type="text"
                    placeholder="Type a message..."
                    className="w-full px-4 py-2 rounded-full border focus:outline-none"
                    value={message}
                    onChange={handleMessageInputChange}
                />
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded-full ml-2 disabled:opacity-70"
                    disabled={!message.trim()} // Disable if message is empty
                >
                    Send
                </button>
            </div>
        </form>
    );
};
