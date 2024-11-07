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
        return [
            'chat_name' => $this->is_group ? $this->name : $this->participants->where('id', '!=', Auth::id())->first()?->user->name,
            'is_group' => $this->is_group,
            'participants' => ChatParticipantsResource::collection($this->participants),
            'messages' => MessagesResource::collection($this->messages),
            'created_at' => $this->created_at,
        ];
    }
}
