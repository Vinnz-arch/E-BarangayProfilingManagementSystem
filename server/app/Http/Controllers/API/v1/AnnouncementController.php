<?php

namespace App\Http\Controllers\API\v1;

use App\Http\Controllers\Controller;
use App\Models\Announcement;
use App\Models\Resident;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class AnnouncementController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $announcements = Announcement::with('author')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($announcements);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'category' => 'required|string|max:100',
        ]);

        $announcement = Announcement::create([
            'title' => $validated['title'],
            'content' => $validated['content'],
            'category' => $validated['category'],
            'author_id' => $request->user()->id,
            'is_published' => true,
        ]);

        // Fetch all residents with email addresses for the broadcast
        $emails = Resident::whereNotNull('email_address')
            ->where('email_address', '!=', '')
            ->pluck('email_address')
            ->toArray();

        // Trigger n8n Webhook for Announcement Broadcast
        $this->triggerN8NBroadcast($announcement, $emails);

        return response()->json([
            'message' => 'Announcement published and broadcasted successfully.',
            'data' => $announcement
        ], 201);
    }

    /**
     * Helper to trigger n8n Webhook for Broadcast
     */
    private function triggerN8NBroadcast(Announcement $announcement, array $emails)
    {
        $webhookUrl = env('N8N_ANNOUNCEMENT_WEBHOOK_URL');

        if (empty($webhookUrl)) {
            Log::warning('N8N_ANNOUNCEMENT_WEBHOOK_URL is not configured.');
            return;
        }

        try {
            Http::timeout(10)->post($webhookUrl, [
                'title' => $announcement->title,
                'content' => $announcement->content,
                'category' => $announcement->category,
                'published_at' => $announcement->created_at->toDateTimeString(),
                'recipients' => $emails, // Array of emails for n8n to loop through
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to trigger n8n announcement webhook: ' . $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $announcement = Announcement::findOrFail($id);
        $announcement->delete();

        return response()->json(['message' => 'Announcement deleted successfully.']);
    }
}
