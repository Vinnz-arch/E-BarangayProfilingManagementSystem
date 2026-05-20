<?php

namespace App\Http\Controllers\API\v1;

use App\Http\Controllers\Controller;
use App\Models\Resident;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class N8nController extends Controller
{
    /**
     * Fetch residents for n8n emergency broadcast.
     * Expects 'sitio_id' in the query parameter ('all' or specific ID).
     */
    public function getResidents(Request $request)
    {
        $sitioId = $request->query('sitio_id');

        $query = Resident::query();

        if ($sitioId && $sitioId !== 'all') {
            $query->where('sitio_id', $sitioId);
        }

        // Only fetch residents who have an email address
        $query->whereNotNull('email_address');

        // Select email_address aliased as email for n8n
        $residents = $query->select(['id', 'first_name', 'last_name', 'email_address as email', 'contact_number'])->get();

        return response()->json([
            'data' => $residents
        ]);
    }

    /**
     * Trigger the n8n emergency broadcast webhook from the server side.
     * This avoids browser CORS issues.
     */
    public function triggerEmergencyBroadcast(Request $request)
    {
        $validated = $request->validate([
            'alert_type' => 'required|string',
            'severity' => 'required|string',
            'target_sitio' => 'required',
            'message' => 'required|string',
        ]);

        // Fallback to local URL if not in .env
        $webhookUrl = env('N8N_EMERGENCY_WEBHOOK_URL', 'http://localhost:5678/webhook/emergency-broadcast');

        try {
            $response = Http::timeout(5)->post($webhookUrl, $validated);
            
            if ($response->successful()) {
                return response()->json(['message' => 'Emergency broadcast triggered successfully']);
            } else {
                Log::error('n8n webhook returned error: ' . $response->body());
                return response()->json(['message' => 'Failed to trigger broadcast'], 500);
            }
        } catch (\Exception $e) {
            Log::error('Failed to trigger n8n emergency broadcast: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to trigger broadcast'], 500);
        }
    }
}
