// resources/js/Components/chat/ChatHeader.tsx
import React, { useState } from "react";
import { Helmet } from "react-helmet";

type ChatHeaderProps = {
  chatInfo: ChatResource;
  onSearch: (searchTerm: string) => void;
};

const ChatHeader = ({ chatInfo, onSearch }: ChatHeaderProps) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchClick = () => {
    setIsSearchOpen(!isSearchOpen);
    setSearchTerm(""); // Reset search term when closing search
    onSearch("");      // Clear search results when closing search
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    onSearch(term);
  };

  const chatHeadline = chatInfo.is_group
    ? chatInfo.name || "Group Chat"
    : `Chat with ${chatInfo.participants[1].user_name}`;

  return (
    <>
        <Helmet>
            <title>{chatHeadline}</title>
        </Helmet>
        <header className="bg-blue-500 text-white py-4 px-6 text-xl font-semibold shadow flex items-center">
        {chatHeadline}
        <button onClick={handleSearchClick} className="ml-auto">
            <img className="w-6 text-white" src={isSearchOpen ? '/images/cross-icon.svg' : '/images/search-icon.svg'} alt="Search Icon" />

        </button>
        {isSearchOpen && (
            <input
            type="text"
            placeholder="Search messages..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="ml-4 px-2 py-1 rounded-md text-black"
            />
        )}
        </header>
    </>
  );
};

export default ChatHeader;
