<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\UserController;

Route::middleware(['web', 'auth:sanctum'])->group(function () {
    Route::get('/chats', [ChatController::class, 'getUserChats']);
    Route::get('/chats/{chatId}', [ChatController::class, 'getSingleChat']);
    Route::post('/chats/{chatId}/send-message', [ChatController::class, 'sendMessage']);
    Route::post('/user', [UserController::class, 'getCurrentUserData']);
    Route::post('/users/search', [UserController::class, 'fetchUsersByName']);
});
