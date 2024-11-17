<?php

namespace App\Http\Controllers;

use App\Events\MessageRead;
use App\Models\Message;
use App\Http\Resources\MessageResource;
use Illuminate\Http\JsonResponse;

class MessageController extends Controller
{
    /**
     * Mark a message as read.
     *
     * @param int $messageId
     * @return JsonResponse
     */
    public function markAsRead(int $messageId): JsonResponse
    {
        $message = Message::find($messageId);

        if (!$message) {
            return response()->json(['error' => 'Message not found'], 404);
        }

        $message->read_at = now();
        $message->save();

        $messageResource = new MessageResource($message);

        broadcast(new MessageRead($messageResource))->toOthers();

        return response()->json($messageResource);
    }
}
