<?php

namespace App\Http\Controllers;

use App\Services\ChatService;
use App\Http\Requests\SendMessageRequest;
use App\Http\Requests\StoreChatRequest;
use App\Models\Chat;
use Illuminate\Http\Request;
use App\Http\Resources\ChatResource;

class ChatController extends Controller
{
    protected $chatService;

    public function __construct(ChatService $chatService)
    {
        $this->chatService = $chatService;
    }

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

    public function sendMessage(SendMessageRequest $request, $chatId)
    {
        $user = $request->user();

        try {
            $messageResource = $this->chatService->sendMessage($user, $chatId, $request->input('content'));
            return $messageResource;
        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 404);
        }
    }

    // Store a new chat in the database
    public function store(StoreChatRequest $request)
    {
        $authUser = $request->user();

        try {
            $chat = $this->chatService->createChat($request->validated(), $authUser);
            return new ChatResource($chat);
        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 404);
        }
    }
}
