<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('chat_participants', function (Blueprint $table) {
            $table->foreignId('chat_id')->constrained('chats')->onDelete('cascade'); // Link to chats table
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade'); // Link to users table
            $table->timestamp('joined_at')->nullable();
            $table->boolean('is_admin')->default(false);
            $table->timestamps();

            // Unique constraint to prevent duplicate user entries in the same chat
            $table->unique(['chat_id', 'user_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('chat_participants');
    }
};
