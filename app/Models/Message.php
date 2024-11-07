<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Message extends Model
{
    use HasFactory;

    // Define the table associated with the model (optional if it follows naming conventions)
    protected $table = 'messages';

    // Define the attributes that are mass assignable
    protected $fillable = ['chat_id', 'sender_id', 'content', 'read_at'];

    protected $casts = [
        'is_you' => 'boolean',
    ];

    // Define relationships
    public function chat()
    {
        return $this->belongsTo(Chat::class, 'chat_id');
    }

    public function sender()
    {
        return $this->belongsTo(User::class, 'sender_id');
    }
}
