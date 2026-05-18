<?php

namespace App\Http\Controllers\API\v1;

use App\Http\Controllers\Controller;
use App\Models\DocumentRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class DocumentRequestController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $requests = DocumentRequest::with('resident.sitio')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($requests);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'resident_id' => 'required|exists:residents,id',
            'document_type' => 'required|string|max:255',
            'purpose' => 'required|string',
        ]);

        // Generate a unique tracking number
        $trackingNumber = 'REQ-' . date('Ymd') . '-' . strtoupper(Str::random(6));

        $documentRequest = DocumentRequest::create([
            'resident_id' => $validated['resident_id'],
            'document_type' => $validated['document_type'],
            'purpose' => $validated['purpose'],
            'tracking_number' => $trackingNumber,
            'status' => DocumentRequest::STATUS_PENDING,
        ]);

        $documentRequest->load('resident');

        // Trigger n8n Webhook for "Request Received"
        $this->triggerN8NWebhook($documentRequest, "Your request for {$documentRequest->document_type} has been received and is currently being processed.");

        return response()->json([
            'message' => 'Document request submitted successfully.',
            'data' => $documentRequest
        ], 201);
    }

    /**
     * Update the status of the document request.
     */
    public function updateStatus(Request $request, $id)
    {
        $documentRequest = DocumentRequest::findOrFail($id);
        $documentRequest->load('resident');

        $validated = $request->validate([
            'status' => 'required|string|in:Pending,Processing,Ready for Pickup,Claimed,Rejected',
            'remarks' => 'nullable|string',
        ]);

        $oldStatus = $documentRequest->status;
        $documentRequest->update($validated);

        // Trigger webhook if status changed to something important (e.g., Ready for Pickup)
        if ($oldStatus !== $documentRequest->status) {
            $message = "Your request status has been updated to: {$documentRequest->status}.";
            
            if ($documentRequest->status === DocumentRequest::STATUS_READY) {
                $message = "Great news! Your {$documentRequest->document_type} is now ready for pickup at the Barangay Hall.";
            } elseif ($documentRequest->status === DocumentRequest::STATUS_REJECTED) {
                $message = "Your request for {$documentRequest->document_type} was rejected. Remarks: " . ($documentRequest->remarks ?? 'No reason provided.');
            }

            $this->triggerN8NWebhook($documentRequest, $message);
        }

        return response()->json([
            'message' => 'Status updated successfully.',
            'data' => $documentRequest
        ]);
    }

    /**
     * Helper to trigger n8n Webhook
     */
    private function triggerN8NWebhook(DocumentRequest $documentRequest, string $message)
    {
        $webhookUrl = env('N8N_WEBHOOK_URL');

        if (empty($webhookUrl)) {
            Log::warning('N8N_WEBHOOK_URL is not configured.');
            return;
        }

        try {
            Http::timeout(5)->post($webhookUrl, [
                'resident_name' => "{$documentRequest->resident->first_name} {$documentRequest->resident->last_name}",
                'email' => $documentRequest->resident->email_address,
                'document_type' => $documentRequest->document_type,
                'status' => $documentRequest->status,
                'tracking_number' => $documentRequest->tracking_number,
                'message' => $message,
                'updated_at' => $documentRequest->updated_at->toDateTimeString(),
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to trigger n8n webhook: ' . $e->getMessage());
        }
    }
}
