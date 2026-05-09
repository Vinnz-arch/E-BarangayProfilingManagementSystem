<?php

namespace App\Http\Controllers\API\v1;

use App\Http\Controllers\Controller;
use App\Models\Sitio;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class SitioController extends Controller
{
    public function index()
    {
        $sitios = Sitio::latest()->get();
        return response()->json($sitios);
    }

    public function show(Sitio $sitio)
    {
        return response()->json($sitio);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'required|string',
            'logo' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        if ($request->hasFile('logo')) {
            $path = $request->file('logo')->store('sitio-logos', 'public');
            $validated['logo'] = $path;
        }

        $sitio = Sitio::create($validated);

        return response()->json([
            'message' => 'Sitio created successfully',
            'data' => $sitio
        ], 201);
    }

    public function update(Request $request, Sitio $sitio)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'required|string',
            'logo' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        if ($request->hasFile('logo')) {
            // Delete old logo if exists
            if ($sitio->logo) {
                Storage::disk('public')->delete($sitio->logo);
            }
            $path = $request->file('logo')->store('sitio-logos', 'public');
            $validated['logo'] = $path;
        }

        $sitio->update($validated);

        return response()->json([
            'message' => 'Sitio updated successfully',
            'data' => $sitio
        ]);
    }

    public function destroy(Sitio $sitio)
    {
        // Delete logo if exists (Optional, depending on if you want to keep files for soft deleted records)
        // if ($sitio->logo) {
        //     Storage::disk('public')->delete($sitio->logo);
        // }
        
        $sitio->delete();

        return response()->json([
            'message' => 'Sitio deleted successfully'
        ]);
    }
}
