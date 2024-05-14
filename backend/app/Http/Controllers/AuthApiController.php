<?php

namespace App\Http\Controllers;

use App\Models\User;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Log;

class AuthApiController extends Controller
{
    public function userList()
    {
        $users = User::select('id', 'name')->orderBy('name')->get();
        return response()->json(['users' => $users, 'success' => true]);
    }

    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');
        $user = User::where('email', $credentials['email'])->first();

        if (!$user || !Hash::check($credentials['password'], $user->password)) {
            return response()->json(['success' => false, 'message' => 'Invalid credentials'], 401);
        }

        return response()->json(['success' => true, 'message' => 'Login successful', 'user' => $user]);
    }

    public function register(Request $request)
    {
        try {
            Log::info('Request Data:', $request->all());
            $validatedData = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users',
                'password' => 'required|string|min:6',
            ]);

            $validatedData['password'] = Hash::make($validatedData['password']);
            $validatedData['role'] = "user";
            $validatedData['status'] = "Enabled";

            $user = User::create($validatedData);

            return response()->json(['success' => true, 'message' => 'User registered successfully', 'user' => $user->name]);
        } catch (ValidationException $e) {
            $errors = $e->validator->getMessageBag()->toArray();
            return response()->json(['success' => false, 'message' => 'Registration failed', 'error' => $errors], 422);
        } catch (Exception $e) {
            return response()->json(['success' => false, 'message' => 'Registration failed', 'error' => $e->getMessage()], 400);
        }
    }
}
