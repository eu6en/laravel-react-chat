<?php

namespace App\Events;

use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Queue\SerializesModels;
use Illuminate\Broadcasting\InteractsWithSockets;
use App\Http\Resources\MessageResource;

class MessageSent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $messageResource;

    public function __construct(MessageResource $messageResource)
    {
        $this->messageResource = $messageResource;
    }

    public function broadcastOn()
    {
        return new PrivateChannel('chat.' . $this->messageResource->chat_id);
    }

    public function broadcastWith()
    {
        return [
            'message' => $this->messageResource,
        ];
    }
}
