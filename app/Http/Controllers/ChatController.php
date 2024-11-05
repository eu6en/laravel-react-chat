<?php

namespace App\Http\Controllers;

use App\Models\Chat;
use Illuminate\Http\Request;

class ChatController extends Controller
{
    public function getUserChats(Request $request)
    {
        $user = $request->user();

        // Get all chats where the user is a participant alongside the last message and its timestamp
        $chats = Chat::whereHas('participants', function ($query) use ($user) {
            $query->where('user_id', $user->id);
        })
        ->with(['participants', 'messages' => function ($query) {
            $query->latest()->first();
        }])
        ->get()
        ->map(function ($chat) use ($user) {
            $lastMessage = $chat->messages->first();
            return [
                'id' => $chat->id,
                'name' => $chat->name,
                'is_group' => $chat->is_group,
                'last_message' => $lastMessage ? ($lastMessage->sender->id == $user->id ? 'You: ' : '') . $lastMessage->content : null,
                'last_message_timestamp' => $lastMessage ? $lastMessage->created_at->format('m/d/Y') : null,
            ];
        });


        // $chats = Chat::whereHas('participants', function ($query) use ($user) {
        //     $query->where('user_id', $user->id);
        // })->get();

        return response()->json($chats);
    }
}


// Function to calculate 2+2
