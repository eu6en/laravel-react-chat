// File: app/Http/resources/ChatParticipantResource.php
export interface ChatParticipantResource {
    id: number;
    user_name: string;
    joined_at: string | null;
    is_admin: boolean;
}
// File: app/Http/resources/MessageResource.php
export interface MessageResource {
    id: number;
    sender_name: string;
    sender_id: number;
    content: string;
    read_at: string | null;
    created_at: string;
    updated_at: string;
}
// File: app/Http/resources/ChatController.php
// Function: getSingleChat
export interface ChatResource {
    id: number;
    name: string | null;
    is_group: boolean;
    participants: ChatParticipantResource[];
    messages: MessageResource[] | undefined;
    created_at: string;
}
