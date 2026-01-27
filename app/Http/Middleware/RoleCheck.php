<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleCheck
{
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        // Jika user belum login atau rolenya tidak ada dalam daftar yang diizinkan
        if (!$request->user() || !in_array($request->user()->role, $roles)) {
            // Tendang balik ke dashboard dengan pesan error
            return redirect('/dashboard')->with('error', 'Anda tidak memiliki akses ke halaman tersebut.');
        }

        return $next($request);
    }
}