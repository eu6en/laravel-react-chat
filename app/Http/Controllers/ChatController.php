<?php

namespace App\Http\Controllers;

use App\Models\Chat;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

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
        ->get()
        ->map(function ($chat) use ($user) {
            $lastMessage = $chat->messages->first();
            $chatName = $chat->is_group ? $chat->name : $chat->participants->where('user_id', '!=', $user->id)->first()->user->name;
            $chatSlug = $chat->is_group ? $chat->slug : $chat->participants->where('user_id', '!=', $user->id)->first()->user->slug;
            return [
                'id' => $chat->id,
                'name' => $chatName,
                'is_group' => $chat->is_group,
                'last_message' => $lastMessage ? ($lastMessage->sender->id == $user->id ? 'You: ' : '') . $lastMessage->content : null,
                'last_message_timestamp' => $lastMessage ? $lastMessage->created_at->format('m/d/Y') : $chat->created_at->format('m/d/Y'),
                'link' => $chatSlug,
            ];
        });

        return response()->json($userChats);
    }
}
