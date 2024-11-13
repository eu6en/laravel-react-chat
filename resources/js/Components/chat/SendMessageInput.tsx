import { ChatResource } from "@/Types/Controllers/ChatController";
import { Message } from "@/Types/DBInterfaces";
import axios from "axios";
import React, { FormEvent, useState } from "react";

interface SendMessageInputProps {
    chatId: Message['chat_id'];
    setChatInfo: React.Dispatch<React.SetStateAction<ChatResource | null>>;
}

export default function SendMessageInput({ chatId, setChatInfo }: SendMessageInputProps) {
    const [message, setMessage] = useState("");

    const handleMessageInputChange = (event: React.ChangeEvent<HTMLInputElement>) => setMessage(event.target.value);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!message.trim()) return;  // Prevent sending empty messages

        try {
            const response = await axios.post(`/api/chats/${chatId}/send-message`, {
                content: message,
            });

            setChatInfo((prevChatInfo) => {
                if (!prevChatInfo) return null;

                const updatedChatInfo = {
                    ...prevChatInfo,
                    messages: [
                        ...prevChatInfo.messages,
                        response.data.data, // Access the message from the response correctly
                    ],
                };

                return updatedChatInfo;
            });

            setMessage(""); // Reset the input field value

        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

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
