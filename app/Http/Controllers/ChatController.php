<?php

namespace App\Http\Controllers;

use App\Services\ChatService;
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

    // Get all chats where the user is a participant and the last message in each
    public function index(Request $request)
    {
        $user = $request->user();

        $userChats = Chat::whereHas('participants', function ($query) use ($user) {
            $query->where('user_id', $user->id);
        })
        ->with(['participants', 'messages' => function ($query) {
            $query->latest()->limit(1);
        }])
        ->get();

        return ChatResource::collection($userChats);
    }

    // Get a single chat by ID
    public function show(Chat $chat)
    {
        if (!$chat) {
            return response()->json(['message' => 'Chat not found'], 404);
        }

        return new ChatResource($chat->load(['participants', 'messages']));
    }

    // Store a newly created chat in the database
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
