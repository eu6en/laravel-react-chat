<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Queue\SerializesModels;
use Illuminate\Broadcasting\InteractsWithSockets;
use App\Http\Resources\MessagesResource;

class MessageSent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $messageResource;

    public function __construct(MessagesResource $messageResource)
    {
        $this->messageResource = $messageResource;
    }

    public function broadcastOn()
    {
        // dd('Broadcasting on channel: chat.' . $this->message->chat_id);

        // return new PrivateChannel('chat.' . $this->message->chat_id);
        return new Channel('chat.' . $this->messageResource->chat_id);
    }

    // public function broadcastAs()
    // {
    //     return 'message.sent';
    // }

    public function broadcastWith()
    {
        return [
            'message' => $this->messageResource,
        ];
    }
}
