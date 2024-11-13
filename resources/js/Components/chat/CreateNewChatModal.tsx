import React, { useState, useEffect, ChangeEvent, useCallback } from 'react';
import { debounce } from 'lodash';
import axios from 'axios';
import { UserResource } from "@/Types/Controllers/UserController";
import { fetchUsersByName } from "@/apis/user";

interface CreateNewChatModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (chatName: string, chatUser: string) => void;
}

const CreateNewChatModal: React.FC<CreateNewChatModalProps> = ({ isOpen, onClose, onSubmit }) => {
    const [groupChatName, setGroupChatName] = useState(''); // Group chat name input value
    const [chatUserName, setChatUserName] = useState(''); // User name input value
    const [suggestions, setSuggestions] = useState<string[]>([]); // List of user suggestions
    const [suggestionsMessage, setSuggestionsMessage] = useState(''); // Message to show when there are no suggestions
    const [showSuggestions, setShowSuggestions] = useState(false); // If true, show the suggestions list
    const [isGroupChat, setIsGroupChat] = useState(false); // If true, the chat is a group chat

    // Set user name input value to the selected suggestion and hide the suggestions list
    const handleSuggestionClick = (suggestion: string) => {
        setChatUserName(suggestion);
        setShowSuggestions(false);
    };

    const userNameInputRef = React.useRef<HTMLInputElement>(null);



    // Submit the form, reset all form input values and close the modal
    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!userNameInputRef?.current) throw new Error('User name input ref is not set.');

        // Check if the user name input value is in the suggestions list and show an error if it's not
        if (!suggestions.includes(chatUserName)) {
            userNameInputRef.current.setCustomValidity('User not found. Please select a valid user from the suggestions.');
            userNameInputRef.current.reportValidity();
            return;
        }
        setGroupChatName('');
        setChatUserName('');
        setSuggestions([]);
        setShowSuggestions(false);
        onSubmit(groupChatName, chatUserName);
        onClose();
    };

    function handleInputChange(event: ChangeEvent<HTMLInputElement>): void {
        event.target.setCustomValidity(''); // Reset any error messages on the input
        const inputValue = event.target.value;
        setChatUserName(inputValue);
        fetchUserSuggestions(inputValue);
    }

    const fetchUserSuggestions = useCallback(
        debounce((userName: string) => {
            if (userName.length < 3) {
                setSuggestions([]);
                setShowSuggestions(false);
                return;
            }
            fetchUsersByName(userName)
                .then(response => {
                    switch (response._t) {
                        case 'success':
                            setSuggestions(response.result.map((user: UserResource) => user.name));
                            setShowSuggestions(true);
                            break;
                        case 'empty-response-error':
                            setSuggestions([]);
                            setSuggestionsMessage('No users found');
                            setShowSuggestions(true);
                            break;
                        default:
                            throw response.error;
                    }
                }
            );
        }, 500), []); // 500ms debounce delay

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-4 rounded shadow-lg w-1/3 relative">
                <button className="absolute top-2 right-2 text-3xl leading-none" onClick={onClose}>
                    &times;
                </button>
                <h2 className="text-xl font-semibold mb-4">Start New Chat</h2>
                <form onSubmit={handleFormSubmit}>
                    <div className="mb-4 relative">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="chatUser">
                            User Name
                        </label>
                        <input
                            type="text"
                            id="chatUser"
                            value={chatUserName}
                            onChange={ handleInputChange }
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                            ref={userNameInputRef}
                        />
                        {showSuggestions && suggestions.length > 0 && (
                            <ul className="absolute z-10 bg-white border border-gray-300 rounded w-full mt-1">
                                {suggestions.map((suggestion, index) => (
                                    <li
                                        key={index}
                                        className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                                        onClick={() => handleSuggestionClick(suggestion)}
                                        tabIndex={0}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                handleSuggestionClick(suggestion);
                                            }
                                        }}
                                    >
                                        {suggestion}
                                    </li>
                                ))}
                            </ul>
                        )}
                        {showSuggestions && suggestions.length === 0 && (
                            <div className="absolute z-10 bg-white border border-gray-300 rounded w-full mt-1 px-4 py-2">
                                {suggestionsMessage}
                            </div>
                        )}
                    </div>
                    <div className="mb-4 flex gap-2 items-center">
                        <input
                            type="checkbox"
                            id="isGroupChat"
                            checked={isGroupChat}
                            onChange={(e) => setIsGroupChat(e.target.checked)}
                            className="mr-2 leading-tight cursor-pointer"
                        />
                        <label className="block text-gray-700 text-sm font-bold cursor-pointer" htmlFor="isGroupChat">
                            Is Group Chat
                        </label>
                    </div>
                    {isGroupChat && (
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="chatName">
                                Group Chat Name
                            </label>
                            <input
                                type="text"
                                id="chatName"
                                value={groupChatName}
                                onChange={(e) => setGroupChatName(e.target.value)}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                required
                            />
                        </div>
                    )}
                    <div className="flex items-center justify-between">
                        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                            Create Chat
                        </button>
                        <button type="button" onClick={onClose} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateNewChatModal;
