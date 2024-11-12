<?php

use Illuminate\Support\Facades\Broadcast;
use App\Models\Chat;

// Broadcast::channel('chat.{chat_id}', function ($user, $chat_id) {
//     // Check if the user is a participant in the chat
//     return Chat::where('id', $chat_id)
//         ->whereHas('participants', function ($query) use ($user) {
//             $query->where('user_id', $user->id);
//         })->exists();
// });
