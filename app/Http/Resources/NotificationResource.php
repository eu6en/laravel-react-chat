<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class NotificationResource extends JsonResource
{
    protected $chat;
    protected $messageResource;

    public function __construct($resource)
    {
        parent::__construct($resource);
        $this->chat = $resource['chat'];
        $this->messageResource = $resource['messageResource'];
    }

    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'chat_id' => $this->chat->id,
            'is_group' => $this->chat->is_group,
            'chat_name' => $this->chat->name,
            'message' => $this->messageResource,
        ];
    }
}
