<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ChatController;

Route::middleware(['web', 'auth:sanctum'])->get('/chats', [ChatController::class, 'getUserChats']);
