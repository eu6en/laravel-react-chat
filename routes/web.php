<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    })->name('dashboard');

    Route::get('/', function () {
        return Inertia::render('Chats');
    })->name('chats');

    Route::get('/chats', function () {
        return redirect('/');
    });

    Route::get('/chats/{chatId}', function ($chatId) {
        return Inertia::render('Chat', ['chatId' => $chatId]);
    });

    Route::middleware('auth')->group(function () {
        Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
        Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
        Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    });
});

Route::get('/test-react-page', function () {
    return Inertia::render('TestReactPage');
});

Route::get('/test-laravel-page', function () {
    return view('test-laravel-page');
});

require __DIR__.'/auth.php';
