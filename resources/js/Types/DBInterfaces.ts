export interface Chat {
    id: number;
    name: string;
    is_group: boolean;
    created_at: string;
    updated_at: string;
}

export interface Message {
    id: number;
    chat_id: number;
    sender_id: number;
    content: string;
    read_at: string | null;
    created_at: string;
    updated_at: string;
}

export interface User {
    id: number;
    name: string;
    slug: string;
    email: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
}
