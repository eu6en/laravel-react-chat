<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Auth;

class ChatResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $chat = $this->resource;

        return [
            'id' => $chat->id,
            'name' => $chat->name,
            'is_group' => $chat->is_group,
            'participants' => ChatParticipantResource::collection($chat->participants),
            'messages' => MessageResource::collection($chat->messages),
            'created_at' => $chat->created_at,
        ];
    }
}
