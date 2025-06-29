<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ChatParticipant extends Model
{
    use HasFactory;

    // Define the table associated with the model (optional if it follows naming conventions)
    protected $table = 'chat_participants';

    // Define the attributes that are mass assignable
    protected $fillable = ['chat_id', 'user_id', 'joined_at', 'is_admin'];

    // Define relationships
    public function chat()
    {
        return $this->belongsTo(Chat::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
