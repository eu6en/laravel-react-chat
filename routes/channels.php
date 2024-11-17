<?php

use Illuminate\Support\Facades\Broadcast;
use App\Models\Chat;
use Illuminate\Support\Facades\Log;

// Broadcast::channel('chat.{chat_id}', function ($user, $chat_id) {
//     // Check if the user is a participant in the chat
//     return Chat::where('id', $chat_id)
//         ->whereHas('participants', function ($query) use ($user) {
//             $query->where('user_id', $user->id);
//         })->exists();
// });

Broadcast::channel('message-read.{chatId}', function ($user, $chatId) {
    // Retrieve the chat using the chatId
    $chat = Chat::find($chatId);

    // Check if the chat exists
    if (!$chat) {
        return false;
    }

    Log::info('User ID: ' . $user->id);
    Log::info('Chat with this user exists: ' . $chat->participants()->where('user_id', $user->id)->exists());

    // Check if the user is a participant in the chat
    return ($chat->participants()->where('user_id', $user->id)->exists());
});
