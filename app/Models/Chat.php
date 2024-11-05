<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Chat extends Model
{
    // Define the table associated with the model (optional if it follows naming conventions)
    protected $table = 'chats';

    // Define the attributes that are mass assignable
    protected $fillable = ['name', 'is_group'];

    // Define relationships, e.g., a chat has many messages
    public function messages()
    {
        return $this->hasMany(Message::class, 'chat_id');
    }

    public function participants()
    {
        return $this->hasMany(ChatParticipant::class, 'chat_id');
    }
}
