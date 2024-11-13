<?php

namespace App\Http\Controllers;

use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    public function fetchUsersByName(Request $request) {
        $userName = $request->input('userName');
        if (!$userName || strlen($userName) < 3) {
            return response()->json([
                'message' => 'Error. Please provide a valid username to search for.',
            ], 400);
        }

        $users = User::where('name', 'like', '%' . $userName . '%')->take(10)->get();
        return response()->json(UserResource::collection($users));
    }

    /**
     * Get the authenticated user.
     */
    public function getCurrentUserData() {
        return new UserResource(Auth::user());
    }
}
