<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MessageResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'sender_name' => $this->sender->name,
            'sender_id' => $this->sender_id,
            'content' => $this->content,
            'read_at' => $this->read_at,
            'created_at' => $this->created_at->format('m-d-y h:i'),
            'updated_at' => $this->updated_at->format('m-d-y h:i'),
        ];
    }
}
