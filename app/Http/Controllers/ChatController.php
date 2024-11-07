<?php

namespace App\Http\Controllers;

use App\Models\Chat;
use Illuminate\Http\Request;
use App\Http\Resources\ChatResource;
use App\Http\Resources\UserChatsResource;

class ChatController extends Controller
{
    public function getUserChats(Request $request)
    {
        $user = $request->user();

        // Get all chats where the user is a participant alongside the last message and its timestamp
        $userChats = Chat::whereHas('participants', function ($query) use ($user) {
            $query->where('user_id', $user->id);
        })
        ->with(['participants', 'messages' => function ($query) {
            $query->latest()->limit(1);
        }])
        ->get();

        return new UserChatsResource($userChats);
    }

    public function getSingleChat(Request $request, $chatId)
    {
        $chat = Chat::where('id', $chatId)->first();

        return new ChatResource($chat);
    }
}
