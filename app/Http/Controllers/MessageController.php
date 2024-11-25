<?php

namespace App\Http\Controllers;

use App\Events\MessageRead;
use App\Models\Message;
use App\Http\Resources\MessageResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use App\Http\Requests\SendMessageRequest;
use App\Models\Chat;
use App\Services\ChatService;

class MessageController extends Controller
{
    use AuthorizesRequests;

    protected $chatService;

    public function __construct(ChatService $chatService)
    {
        $this->chatService = $chatService;
    }

    // Mark a message as read
    public function markAsRead(int $messageId): JsonResponse
    {
        $message = Message::find($messageId);

        if (!$message) {
            return response()->json(['error' => 'Message not found'], 404);
        }

        $message->read_at = now();
        $message->save();

        $messageResource = new MessageResource($message);

        broadcast(new MessageRead($messageResource));

        return response()->json($messageResource);
    }

    // Send a message to a chat
    public function store(SendMessageRequest $request, Chat $chat)
    {
        $this->authorize('sendMessage', $chat);
        $user = $request->user();

        try {
            $messageResource = $this->chatService->sendMessage($user, $chat->id, $request->input('content'));
            return $messageResource;
        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 404);
        }
    }
}
