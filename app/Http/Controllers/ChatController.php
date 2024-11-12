<?php

namespace App\Http\Controllers;

use App\Models\Chat;
use Illuminate\Http\Request;
use App\Http\Resources\ChatResource;
use App\Http\Resources\UserChatsResource;
use App\Http\Resources\MessagesResource;
use App\Events\MessageSent;

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

        if (!$chat) {
            return response()->json([
                'message' => 'The requested chat could not be found. Please check the chat ID and try again.',
            ], 404);
        }

        return new ChatResource($chat);
    }

    public function sendMessage(Request $request, $chatId)
    {
        $user = $request->user();
        $chat = Chat::where('id', $chatId)->first();

        if (!$chat) {
            return response()->json([
                'message' => 'Chat not found',
            ], 404);
        }

        $messageArr = $chat->messages()->create([
            'chat_id' => $chatId,
            'sender_id' => $user->id,
            'content' => $request->content,
            'read_at' => null,
        ]);

        $messageResource = new MessagesResource($messageArr);

        broadcast(new MessageSent($messageResource))->toOthers();

        return response()->json([
            'message' => 'Message sent successfully',
            'data' => $messageResource,
        ]);
    }
}
