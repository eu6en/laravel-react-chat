<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('users')->delete();


        User::factory()->create([
            'name' => 'First User',
            'slug' => 'first-user',
            'email' => 'firstuser@example.com',
            'password' => Hash::make('firstuser'), // Hashing password
        ]);
        User::factory()->create([
            'name' => 'Second User',
            'slug' => 'second-user',
            'email' => 'seconduser@example.com',
            'password' => Hash::make('seconduser'),
        ]);
        User::factory()->create([
            'name' => 'Third User',
            'slug' => 'third-user',
            'email' => 'thirduser@example.com',
            'password' => Hash::make('thirduser'),
        ]);
    }
}
