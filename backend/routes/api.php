<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\CartController;
use App\Http\Controllers\Api\OrderController;
use App\Models\Category;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login',    [AuthController::class, 'login']);

// Public routes
Route::apiResource('products', ProductController::class)->only(['index','show']);
Route::get('categories', [CategoryController::class, 'index']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout',   [AuthController::class, 'logout']);

    Route::prefix('cart')->group(function () {
        Route::get('/',      [CartController::class, 'index']);
        Route::post('/',     [CartController::class, 'store']);
        Route::put('/{cartItem}',    [CartController::class, 'update']);
        Route::delete('/{cartItem}', [CartController::class, 'destroy']);
    });

    Route::post('/checkout', [OrderController::class, 'checkout']);
    Route::get('/orders',    [OrderController::class, 'index']);
});
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::prefix('admin')->middleware(['auth:sanctum', 'is_admin'])->group(function () {
    Route::apiResource('products', \App\Http\Controllers\Api\Admin\ProductController::class)->names('admin.products');
    Route::get('categories', [CategoryController::class, 'index']);
    Route::post('categories', [CategoryController::class, 'store']);
    Route::delete('categories/{id}', [CategoryController::class, 'destroy']);
});