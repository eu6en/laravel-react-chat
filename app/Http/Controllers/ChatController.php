<?php

namespace App\Http\Controllers;

use App\Models\Chat;
use Illuminate\Http\Request;
use App\Http\Resources\ChatResource;
use App\Http\Resources\MessageResource;
use App\Events\MessageSent;
use App\Models\User;

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

        return ChatResource::collection($userChats);
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

        $messageResource = new MessageResource($messageArr);

        broadcast(new MessageSent($messageResource))->toOthers();

        return response()->json([
            'message' => 'Message sent successfully',
            'data' => $messageResource,
        ]);
    }

    public function store (Request $request)
    {
        $chatParticipantName = $request->input('chatParticipantName');
        $chatName = $request->input('chatName');
        $isGroup = $request->input('isGroup');

        $chatParticipantUser = User::where('name', $chatParticipantName)->first();

        // Check if the user exists
        if (! $chatParticipantUser) {
            return response()->json([
                'message' => 'User not found',
            ], 404);
        }

        $chatParams = [];

        // If it's a group chat, ensure a name is provided
        if ($isGroup) {
            if (!$chatName) {
                return response()->json([
                    'message' => 'Please provide a name for the group chat',
                ], 400);
            };
            $chatParams = [
                'name' => $chatName,
                'user_id' =>  $chatParticipantUser->id,
            ];
        } else {
            $chatParams = [
                'name' => null,
                'user_id' =>  $chatParticipantUser->id,
            ];
        }

        $chat = Chat::create($chatParams);

        // Create a chat participant entry for the user who joined the chat
        $chat->participants()->create([
            'chat_id' => $chat->id,
            'user_id' =>  $chatParticipantUser->id,
            'joined_at' => now(),
        ]);

        // Create a chat participant entry for the authenticated user
        $chat->participants()->create([
            'chat_id' => $chat->id,
            'user_id' => $request->user()->id, // Get the authenticated user id
            'joined_at' => now(),
            'is_admin' => $isGroup ?? false, // Assign admin status if it's a group chat
        ]);

        // Return the chat resource
        return new ChatResource($chat);
    }
}
