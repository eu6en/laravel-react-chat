<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use App\Models\Chat;
use App\Models\Message;
use App\Policies\ChatPolicy;
use App\Policies\MessagePolicy;

class AuthServiceProvider extends ServiceProvider
{
    protected $policies = [
        Chat::class => ChatPolicy::class,
        Message::class => MessagePolicy::class,
    ];

    public function boot()
    {
        $this->registerPolicies();
    }
}
