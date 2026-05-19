<?php

namespace App\Http\Controllers\API\v1;

use App\Http\Controllers\Controller;
use App\Models\BeneficiaryDistribution;
use App\Models\Resident;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class BeneficiaryDistributionController extends Controller
{
    /**
     * Display a listing of distributions.
     */
    public function index()
    {
        $distributions = BeneficiaryDistribution::with('author')
            ->orderBy('distribution_date', 'desc')
            ->get();
        return response()->json($distributions);
    }

    /**
     * Store a new distribution.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'target_group' => 'required|string|in:senior_citizen,pwd,4ps,solo_parent',
            'distribution_date' => 'required|date',
            'location' => 'required|string|max:255',
        ]);

        $distribution = BeneficiaryDistribution::create([
            'title' => $validated['title'],
            'target_group' => $validated['target_group'],
            'distribution_date' => $validated['distribution_date'],
            'location' => $validated['location'],
            'author_id' => $request->user()->id,
            'status' => 'Draft',
        ]);

        return response()->json([
            'message' => 'Distribution event created successfully.',
            'data' => $distribution
        ], 201);
    }

    /**
     * Trigger n8n notifications grouped by Sitio.
     */
    public function notify($id)
    {
        $distribution = BeneficiaryDistribution::findOrFail($id);
        
        // Map target_group to the actual column name in residents table
        $columnMap = [
            'senior_citizen' => 'is_senior_citizen',
            'pwd' => 'is_pwd',
            '4ps' => 'is_4ps',
            'solo_parent' => 'is_solo_parent',
        ];

        $column = $columnMap[$distribution->target_group];

        // Find eligible residents with emails
        $residents = Resident::with('sitio')
            ->where($column, true)
            ->whereNotNull('email_address')
            ->where('email_address', '!=', '')
            ->get();

        if ($residents->isEmpty()) {
            return response()->json(['message' => 'No eligible residents with email addresses found.'], 404);
        }

        // Group by Sitio
        $groupedData = [];
        foreach ($residents as $resident) {
            $sitioName = $resident->sitio ? $resident->sitio->name : 'Unassigned';
            
            if (!isset($groupedData[$sitioName])) {
                $groupedData[$sitioName] = [
                    'sitio_name' => $sitioName,
                    'emails' => [],
                ];
            }
            
            $groupedData[$sitioName]['emails'][] = $resident->email_address;
        }

        // Convert associative array to indexed array for n8n
        $payload = array_values($groupedData);

        // Update status
        $distribution->update(['status' => 'Notifying']);

        // Trigger n8n
        $webhookUrl = env('N8N_DISTRIBUTION_WEBHOOK_URL');

        if (empty($webhookUrl)) {
            Log::warning('N8N_DISTRIBUTION_WEBHOOK_URL is not configured.');
            return response()->json(['message' => 'Distribution saved, but n8n webhook is not configured.'], 200);
        }

        try {
            Http::timeout(15)->post($webhookUrl, [
                'title' => $distribution->title,
                'distribution_date' => $distribution->distribution_date,
                'location' => $distribution->location,
                'target_group_label' => ucwords(str_replace('_', ' ', $distribution->target_group)),
                'sitio_batches' => $payload,
            ]);
            
            return response()->json(['message' => 'Notifications triggered successfully via n8n.']);
        } catch (\Exception $e) {
            Log::error('Failed to trigger distribution webhook: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to reach n8n server.'], 500);
        }
    }

    /**
     * Delete a distribution.
     */
    public function destroy($id)
    {
        $distribution = BeneficiaryDistribution::findOrFail($id);
        $distribution->delete();
        return response()->json(['message' => 'Distribution deleted successfully.']);
    }
}
