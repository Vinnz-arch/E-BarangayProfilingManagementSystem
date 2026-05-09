<?php

use App\Http\Controllers\API\v1\SitioController;
use App\Http\Controllers\API\v1\ResidentController;
use App\Http\Controllers\API\v1\OfficialController;
use App\Http\Controllers\API\v1\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    // Public routes
    Route::post('/login', [AuthController::class, 'login']);

    // Protected routes
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/me', [AuthController::class, 'me']);
        Route::post('/logout', [AuthController::class, 'logout']);

        Route::get('/sitios', [SitioController::class, 'index']);
        Route::get('/sitios/{sitio}', [SitioController::class, 'show']);
        Route::post('/sitios', [SitioController::class, 'store']);
        Route::put('/sitios/{sitio}', [SitioController::class, 'update']);
        Route::delete('/sitios/{sitio}', [SitioController::class, 'destroy']);

        Route::get('/residents', [ResidentController::class, 'index']);
        Route::get('/residents/{resident}', [ResidentController::class, 'show']);
        Route::post('/residents', [ResidentController::class, 'store']);
        Route::put('/residents/{resident}', [ResidentController::class, 'update']);
        Route::delete('/residents/{resident}', [ResidentController::class, 'destroy']);

        Route::get('/officials', [OfficialController::class, 'index']);
        Route::get('/officials/{official}', [OfficialController::class, 'show']);
        Route::post('/officials', [OfficialController::class, 'store']);
        Route::put('/officials/{official}', [OfficialController::class, 'update']);
        Route::delete('/officials/{official}', [OfficialController::class, 'destroy']);
    });
});
