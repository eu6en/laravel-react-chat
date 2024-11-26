<?php

namespace App\Policies;

use App\Models\Message;
use App\Models\User;
use App\Models\Chat;
use Illuminate\Support\Facades\Log;

class MessagePolicy
{
    public function update(User $user, Message $message)
    {
        // User can mark as read if they are a participant
        $isParticipant = $message->chat->participants()->where('user_id', $user->id)->exists();

        // User can edit content if they are the sender
        $isSender = $message->sender_id === $user->id;

        return $isParticipant || $isSender;
    }

    public function store(User $user, Chat $chat)
    {
        // Log::info("message policy");
        // Log::info("User: ");
        // Log::info($user);
        // Log::info("Chat: ");
        // Log::info($chat);

        // User can send a message if they are a participant of the chat
        return $chat->participants()->where('user_id', $user->id)->exists();
    }
}
