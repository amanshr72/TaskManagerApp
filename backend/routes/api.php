<?php

use App\Http\Controllers\AuthApiController;
use App\Http\Controllers\TaskApiController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::middleware('user.auth')->group(function () {
    Route::get('user-list', [AuthApiController::class, 'userList']);
    Route::post('login', [AuthApiController::class, 'login']);
    Route::post('register', [AuthApiController::class, 'register']);

    Route::get('task', [TaskApiController::class, 'index']);
    Route::get('categories', [TaskApiController::class, 'taskCategory']);
    Route::get('category-list', [TaskApiController::class, 'categoryList']);
    Route::post('my-task', [TaskApiController::class, 'myTask']);
    Route::post('imp-task', [TaskApiController::class, 'impTask']);

    Route::post('task/store', [TaskApiController::class, 'store']);
    Route::post('category/store', [TaskApiController::class, 'storeCategory']);
    Route::put('task/update', [TaskApiController::class, 'update']);

    Route::post('mark-important', [TaskApiController::class, 'markImportant']);
    Route::post('unmark-important', [TaskApiController::class, 'unmarkImportant']);
});
