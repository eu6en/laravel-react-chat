<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserChatsResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $userId = $request->user()->id;

        return $this->resource->map(function ($chat) use ($userId)
        {
            $lastMessage = $chat->messages->first();
            $chatName = $chat->is_group ? $chat->name : $chat->participants->where('user_id', '!=', $userId)->first()->user->name;

            return [
                'id' => $chat->id,
                'name' => $chatName,
                'is_group' => $chat->is_group,
                'last_message' => $lastMessage ? ($lastMessage->sender->id == $userId ? 'You: ' : '') . $lastMessage->content : null,
                'last_message_timestamp' => $lastMessage ? $lastMessage->created_at->format('m/d/Y') : $chat->created_at->format('m/d/Y'),
                'link' => "chats/{$chat->id}",
            ];
        })->toArray();
    }
}
