// File: app/Http/resources/ChatController.php
// Function: getUserChats
export interface GetUserChatsResource {
    id: number;
    name: string;
    is_group: boolean;
    last_message: string;
    last_message_timestamp: string;
    link: string;
}


// File: app/Http/resources/ChatParticipantResource.php
export interface ChatParticipantResource {
    user_name: number;
    joined_at: string | null;
    is_admin: boolean;
}
// File: app/Http/resources/MessagesResource.php
export interface MessagesResource {
    sender_name: string;
    is_you: boolean;
    content: string;
    read_at: string | null;
    created_at: string;
    updated_at: string;
}
// File: app/Http/resources/ChatController.php
// Function: getSingleChat
export interface GetSingleChatResource {
    chat_name: string | null;
    is_group: boolean;
    participants: ChatParticipantResource[];
    messages: MessagesResource[];
    created_at: string;
}
