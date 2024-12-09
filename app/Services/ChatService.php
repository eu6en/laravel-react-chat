<?php
// app/Services/ChatService.php

namespace App\Services;

use App\Models\Chat;
use App\Models\User;
use App\Http\Resources\MessageResource;
use App\Http\Resources\NotificationResource;
use App\Events\MessageSent;
use App\Events\UserNotification;

class ChatService
{
    public function sendMessage(User $user, int $chatId, string $content)
    {
        $chat = Chat::find($chatId);

        if (!$chat) {
            throw new \Exception('Chat not found');
        }

        $message = $chat->messages()->create([
            'sender_id' => $user->id,
            'content' => $content,
        ]);

        $messageResource = new MessageResource($message);

        broadcast(new MessageSent($messageResource))->toOthers();

        // Notify other participants in the chat (excluding the sender)
        $this->notifyParticipants($chat, $messageResource, $user->id);

        return $messageResource;
    }

    public function create(array $data, User $authUser)
    {
        $participantUser = User::where('name', $data['chatParticipantName'])->first();

        if (!$participantUser) {
            throw new \Exception('User not found');
        }

        $chatParams = [
            'name' => $data['isGroup'] ? $data['chatName'] : null,
            'is_group' => $data['isGroup'],
        ];

        $chat = Chat::create($chatParams);

        $chat->participants()->createMany([
            [
                'user_id' => $participantUser->id,
                'joined_at' => now(),
            ],
            [
                'user_id' => $authUser->id,
                'joined_at' => now(),
                'is_admin' => $data['isGroup'],
            ],
        ]);

        return $chat;
    }

    private function notifyParticipants(Chat $chat, MessageResource $messageResource, int $senderId)
    {
        $otherParticipants = $chat->participants()->where('user_id', '!=', $senderId)->get();

        foreach ($otherParticipants as $participant) {
            $notification = new NotificationResource([
                'chat' => $chat,
                'messageResource' => $messageResource,
            ]);

            broadcast(new UserNotification($notification->toArray(request()), $participant->user_id));
        }
    }
}
