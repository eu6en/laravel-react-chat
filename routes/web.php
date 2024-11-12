<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::get('/test-laravel-page', function () {
    return view('test-laravel-page');
});

// Serve the React app at the root level and delegate routing to React Router
Route::middleware(['auth', 'verified'])->group(function () {

    Route::get('/dashboard', function () {
        return redirect('/');
    })->name('dashboard');

});

Route::get('/', function () {
    if (!Auth::check()) {
        return redirect('/login');
    } else {
        return Inertia::render('App');
    }
});

require __DIR__.'/auth.php';
