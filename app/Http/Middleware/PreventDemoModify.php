<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class PreventDemoModify
{
    public function handle(Request $request, Closure $next): Response
    {
        // Email akun demo yang ingin diproteksi
        $demoEmail = 'superadmin@demo.com';

        // Cek jika user login sebagai demo DAN mencoba mengubah data (POST, PUT, DELETE)
        if ($request->user() && $request->user()->email === $demoEmail) {
            if (!$request->isMethod('get') && !$request->routeIs('logout')) {
                return redirect()->back()->with('error', 'You are currently using a Demo Account. Data modification is disabled to maintain system integrity.');
            }
        }

        return $next($request);
    }
}