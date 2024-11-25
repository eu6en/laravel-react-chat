<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\MessageController;

Route::middleware(['web', 'auth:sanctum'])->group(function () {
    Route::get('/chats', [ChatController::class, 'getUserChats']);
    Route::post('/chats/store', [ChatController::class, 'store']);
    Route::get('/chats/{chat}', [ChatController::class, 'getSingleChat']);
    Route::post('/chats/{chat}/send-message', [ChatController::class, 'sendMessage']);
    Route::post('/user', [UserController::class, 'getCurrentUserData']);
    Route::post('/users/search', [UserController::class, 'fetchUsersByName']);
    Route::post('/messages/{messageId}/read' , [MessageController::class, 'markAsRead']);
});
