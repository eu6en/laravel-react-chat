<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\MessageController;

Route::middleware(['web', 'auth:sanctum'])->group(function () {

    Route::apiResource('/chats', ChatController::class);
    Route::apiResource('chats.messages', MessageController::class)->shallow();

    Route::post('/user', [UserController::class, 'getCurrentUserData']);
    Route::post('/users/search', [UserController::class, 'fetchUsersByName']);

});
