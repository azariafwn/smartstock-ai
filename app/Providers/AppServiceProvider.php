<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\URL;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // FIX: Jika URL mengandung 'ngrok' atau env bukan local, paksa HTTPS
        if (str_contains(request()->url(), 'ngrok-free.dev') || config('app.env') !== 'local') {
            URL::forceScheme('https');
        }
    }
}
