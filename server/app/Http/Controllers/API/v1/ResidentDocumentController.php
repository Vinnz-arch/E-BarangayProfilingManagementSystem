<?php

namespace App\Http\Controllers\API\v1;

use App\Http\Controllers\Controller;
use App\Models\Official;
use App\Models\Resident;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;

class ResidentDocumentController extends Controller
{
    public function export(Request $request, Resident $resident)
    {
        $request->validate([
            'type' => 'required|in:barangay-clearance,business-clearance,certificate-of-indigency',
            'purpose' => 'nullable|string',
            'business_name' => 'nullable|string',
            'business_address' => 'nullable|string',
            'business_type' => 'nullable|string',
        ]);

        $type = $request->type;
        $captain = Official::where('position', 'Punong Barangay')->where('is_active', true)->first();
        
        // If no active captain, try to find any captain
        if (!$captain) {
            $captain = Official::where('position', 'Punong Barangay')->first();
        }

        $data = [
            'resident' => $resident,
            'captain' => $captain,
            'date' => now()->format('F d, Y'),
            'purpose' => $request->purpose,
            'business_name' => $request->business_name,
            'business_address' => $request->business_address,
            'business_type' => $request->business_type,
            'ref_no' => 'BRGY-' . now()->format('Ymd') . '-' . str_pad($resident->id, 4, '0', STR_PAD_LEFT)
        ];

        $view = "pdf." . str_replace('-', '_', $type);
        $filename = "{$type}-{$resident->last_name}.pdf";

        $pdf = Pdf::loadView($view, $data)->setPaper('a4', 'portrait');

        return $pdf->download($filename);
    }
}
