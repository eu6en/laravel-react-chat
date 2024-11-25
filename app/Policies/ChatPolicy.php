<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Chat;

class ChatPolicy
{
    public function sendMessage(User $user, Chat $chat)
    {
        return $chat->participants()->where('user_id', $user->id)->exists();
    }
}
