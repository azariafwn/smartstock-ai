<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, ...$roles)
    {
        // Cek apakah user sudah login dan memiliki role yang sesuai [cite: 3]
        if (! $request->user() || ! in_array($request->user()->role, $roles)) {
            return response()->json(['message' => 'Forbidden: Access Denied'], 403); // Sesuai API Doc 
        }

        return $next($request);
    }
}
