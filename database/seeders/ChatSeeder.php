<?php

namespace Database\Seeders;

use App\Models\Chat;
use App\Models\ChatParticipant;
use App\Models\Message;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ChatSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Clear existing data
        DB::table('chats')->delete();
        DB::table('chat_participants')->delete();
        DB::table('messages')->delete();

        // Retrieve the users created in DatabaseSeeder
        $user1 = User::where('email', 'firstuser@example.com')->first();
        $user2 = User::where('email', 'seconduser@example.com')->first();
        $user3 = User::where('email', 'thirduser@example.com')->first();

        // Create a direct chat between User 1 and User 2
        $chat1 = Chat::create([
            'is_group' => false,
        ]);

        // Add participants for chat1
        ChatParticipant::create([
            'chat_id' => $chat1->id,
            'user_id' => $user1->id,
        ]);
        ChatParticipant::create([
            'chat_id' => $chat1->id,
            'user_id' => $user2->id,
        ]);

        // Seed messages for chat1
        Message::create([
            'chat_id' => $chat1->id,
            'sender_id' => $user1->id,
            'content' => 'Hello, User 2!',
        ]);

        Message::create([
            'chat_id' => $chat1->id,
            'sender_id' => $user2->id,
            'content' => 'Hi, User 1! How are you?',
        ]);

        // Optionally, create a group chat with User 1, User 2, and User 3
        $chat2 = Chat::create([
            'is_group' => true,
            'name' => 'Group Chat',
            'slug' => Str::slug('Group Chat'),
        ]);

        ChatParticipant::create([
            'chat_id' => $chat2->id,
            'user_id' => $user1->id,
        ]);
        ChatParticipant::create([
            'chat_id' => $chat2->id,
            'user_id' => $user2->id,
        ]);
        ChatParticipant::create([
            'chat_id' => $chat2->id,
            'user_id' => $user3->id,
        ]);

        Message::create([
            'chat_id' => $chat2->id,
            'sender_id' => $user1->id,
            'content' => 'Welcome to the group chat!',
        ]);

        Message::create([
            'chat_id' => $chat2->id,
            'sender_id' => $user2->id,
            'content' => 'Hello everyone!',
        ]);

        Message::create([
            'chat_id' => $chat2->id,
            'sender_id' => $user3->id,
            'content' => 'Hi all!',
        ]);
    }
}
