<?php

namespace App\Http\Controllers;

use App\Models\Chat;
use Illuminate\Http\Request;

class ChatController extends Controller
{
    public function getUserChats(Request $request)
    {
        $user = $request->user();
        $chats = Chat::whereHas('participants', function ($query) use ($user) {
            $query->where('user_id', $user->id);
        })->get();

        return response()->json($chats);
    }
}
