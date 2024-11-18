<?php

use Illuminate\Support\Facades\Broadcast;
use App\Models\Chat;

Broadcast::channel('chat.{chatId}', function ($user, $chatId) {

    // Retrieve the chat using the chatId
    $chat = Chat::find($chatId);

    // Check if the chat exists
    if (!$chat) {
        return false;
    }

    // Check if the user is a participant in the chat
    return $chat->participants()->where('user_id', $user->id)->exists();
});

Broadcast::channel('message-read.{chatId}', function ($user, $chatId) {

    // Retrieve the chat using the chatId
    $chat = Chat::find($chatId);

    // Check if the chat exists
    if (!$chat) {
        return false;
    }

    // Check if the user is a participant in the chat
    return $chat->participants()->where('user_id', $user->id)->exists();
});
