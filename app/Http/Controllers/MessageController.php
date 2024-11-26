<?php

namespace App\Http\Controllers;

use App\Events\MessageRead;
use App\Models\Message;
use App\Http\Resources\MessageResource;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use App\Http\Requests\SendMessageRequest;
use Illuminate\Http\Request;
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

    // Update or mark a message as read
    public function update(Request $request, Message $message)
    {
        // Authorize the user
        $this->authorize('update', $message);

        // Validate the request data
        $data = $request->validate([
            'content' => 'sometimes|string',
            'read' => 'sometimes|boolean',
        ]);

        // Update the message content if provided
        if (isset($data['content'])) {
            // Ensure the user is the sender
            if ($message->sender_id !== $request->user()->id) {
                return response()->json(['error' => 'Unauthorized'], 403);
            }
            $message->content = $data['content'];
        }

        // Update the read_at timestamp if read flag is true
        if (isset($data['read']) && $data['read'] === true) {
            $message->read_at = now();
        }

        $message->save();

        // Prepare the message resource
        $messageResource = new MessageResource($message);

        // Broadcast events based on the request data
        if (isset($data['read']) && $data['read'] === true) {
            broadcast(new MessageRead($messageResource));
        }

        if (isset($data['content'])) {
            // Broadcast a MessageUpdated event
            // broadcast(new MessageUpdated($messageResource))->toOthers();
        }

        return response()->json($messageResource);
    }

    // Save sent message to the database
    public function store(SendMessageRequest $request, Chat $chat)
    {
        // $this->authorize('store', $chat);

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
