<?php

use App\Http\Controllers\API\v1\ResidentDocumentController;
use App\Http\Controllers\API\v1\SitioController;
use App\Http\Controllers\API\v1\ResidentController;
use App\Http\Controllers\API\v1\BeneficiaryDistributionController;
use App\Http\Controllers\API\v1\AnnouncementController;
use App\Http\Controllers\API\v1\DocumentRequestController;
use App\Http\Controllers\API\v1\OfficialController;
use App\Http\Controllers\API\v1\AuthController;
use App\Http\Controllers\API\v1\BeneficiaryExportController;
use App\Http\Controllers\API\v1\N8nController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// n8n integration routes (No Sanctum token required for local n8n access)
Route::prefix('n8n')->group(function () {
    Route::get('/residents', [N8nController::class, 'getResidents']);
});

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
        Route::post('/residents/{resident}/export-document', [ResidentDocumentController::class, 'export']);

        // Beneficiary Export Routes
        Route::prefix('beneficiaries')->group(function () {
            Route::get('/pwd/export', [BeneficiaryExportController::class, 'exportPwd']);
            Route::get('/solo-parent/export', [BeneficiaryExportController::class, 'exportSoloParent']);
            Route::get('/4ps/export', [BeneficiaryExportController::class, 'export4ps']);
            Route::get('/senior-citizen/export', [BeneficiaryExportController::class, 'exportSeniorCitizen']);
        });

        Route::get('/officials', [OfficialController::class, 'index']);
        Route::get('/officials/{official}', [OfficialController::class, 'show']);
        Route::post('/officials', [OfficialController::class, 'store']);
        Route::put('/officials/{official}', [OfficialController::class, 'update']);
        Route::delete('/officials/{official}', [OfficialController::class, 'destroy']);

        // Document Request Routes
        Route::get('/document-requests', [DocumentRequestController::class, 'index']);
        Route::post('/document-requests', [DocumentRequestController::class, 'store']);
        Route::patch('/document-requests/{id}/status', [DocumentRequestController::class, 'updateStatus']);

        // Announcement Routes
        Route::get('/announcements', [AnnouncementController::class, 'index']);
        Route::post('/announcements', [AnnouncementController::class, 'store']);
        Route::delete('/announcements/{id}', [AnnouncementController::class, 'destroy']);

        // Emergency Broadcast Route (Server-side to n8n)
        Route::post('/emergency-broadcast', [N8nController::class, 'triggerEmergencyBroadcast']);

        // Beneficiary Distribution Routes
        Route::get('/beneficiary-distributions', [BeneficiaryDistributionController::class, 'index']);
        Route::post('/beneficiary-distributions', [BeneficiaryDistributionController::class, 'store']);
        Route::post('/beneficiary-distributions/{id}/notify', [BeneficiaryDistributionController::class, 'notify']);
        Route::delete('/beneficiary-distributions/{id}', [BeneficiaryDistributionController::class, 'destroy']);
    });
});
