<?php

namespace App\Http\Controllers\API\v1;

use App\Http\Controllers\Controller;
use App\Models\Resident;
use Illuminate\Http\Request;

class ResidentController extends Controller
{
    public function index(Request $request)
    {
        $query = Resident::with('sitio');

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                  ->orWhere('last_name', 'like', "%{$search}%");
            });
        }

        if ($request->has('sitio_id')) {
            $query->where('sitio_id', $request->sitio_id);
        }

        if ($request->has('is_4ps')) {
            $query->where('is_4ps', $request->boolean('is_4ps'));
        }

        if ($request->has('is_pwd')) {
            $query->where('is_pwd', $request->boolean('is_pwd'));
        }

        if ($request->has('is_solo_parent')) {
            $query->where('is_solo_parent', $request->boolean('is_solo_parent'));
        }

        if ($request->has('is_senior_citizen')) {
            $query->where('is_senior_citizen', $request->boolean('is_senior_citizen'));
        }

        if ($request->has('is_household_type')) {
            $query->where('is_household_type', $request->is_household_type);
        }

        $limit = $request->input('limit');
        if ($limit) {
            $residents = $query->latest()->paginate($limit);
        } else {
            $residents = $query->latest()->get();
        }

        return response()->json($residents);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'sitio_id' => 'required|exists:sitios,id',
            'last_name' => 'required|string|max:255',
            'first_name' => 'required|string|max:255',
            'middle_initial' => 'nullable|string|max:10',
            'is_household_type' => 'required|string',
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
            'is_household_type' => 'required|string',
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
