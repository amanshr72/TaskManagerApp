<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AuthMiddleware
{
    public function handle($request, Closure $next): Response
    {
        $header = $request->header('Authorization');
        $expectedAuthString = 'Basic QWRtaW46MQ==';

        if ($header != $expectedAuthString) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        return $next($request);
    }
}
