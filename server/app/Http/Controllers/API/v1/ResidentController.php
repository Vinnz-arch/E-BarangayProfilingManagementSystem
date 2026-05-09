<?php

namespace App\Http\Controllers\API\v1;

use App\Http\Controllers\Controller;
use App\Models\Resident;
use Illuminate\Http\Request;

class ResidentController extends Controller
{
    public function index(Request $request)
    {
        $request->validate([
            'sitio_id' => 'required|exists:sitios,id'
        ]);

        $residents = Resident::where('sitio_id', $request->sitio_id)
            ->latest()
            ->get();

        return response()->json($residents);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'sitio_id' => 'required|exists:sitios,id',
            'last_name' => 'required|string|max:255',
            'first_name' => 'required|string|max:255',
            'middle_initial' => 'nullable|string|max:10',
            'household_type' => 'required|string',
            'gender' => 'required|string',
            'date_of_birth' => 'required|date',
            'citizenship' => 'required|string',
            'civil_status' => 'required|string',
            'occupation' => 'nullable|string',
            'school_attainment' => 'nullable|string',
            'skills' => 'nullable|string',
            'blood_type' => 'nullable|string',
            'is_4ps' => 'required|boolean',
            'is_pwd' => 'required|boolean',
            'is_solo_parent' => 'required|boolean',
            'is_senior_citizen' => 'required|boolean',
        ]);

        $resident = Resident::create($validated);

        return response()->json([
            'message' => 'Resident added successfully',
            'data' => $resident
        ], 201);
    }

    public function show(Resident $resident)
    {
        return response()->json($resident);
    }

    public function update(Request $request, Resident $resident)
    {
        $validated = $request->validate([
            'last_name' => 'required|string|max:255',
            'first_name' => 'required|string|max:255',
            'middle_initial' => 'nullable|string|max:10',
            'household_type' => 'required|string',
            'gender' => 'required|string',
            'date_of_birth' => 'required|date',
            'citizenship' => 'required|string',
            'civil_status' => 'required|string',
            'occupation' => 'nullable|string',
            'school_attainment' => 'nullable|string',
            'skills' => 'nullable|string',
            'blood_type' => 'nullable|string',
            'is_4ps' => 'required|boolean',
            'is_pwd' => 'required|boolean',
            'is_solo_parent' => 'required|boolean',
            'is_senior_citizen' => 'required|boolean',
        ]);

        $resident->update($validated);

        return response()->json([
            'message' => 'Resident updated successfully',
            'data' => $resident
        ]);
    }

    public function destroy(Resident $resident)
    {
        $resident->delete();

        return response()->json([
            'message' => 'Resident deleted successfully'
        ]);
    }
}
