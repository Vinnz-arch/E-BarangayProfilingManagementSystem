<?php

namespace App\Http\Controllers\API\v1;

use App\Http\Controllers\Controller;
use App\Models\Official;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class OfficialController extends Controller
{
    public function index()
    {
        $officials = Official::orderBy('display_order', 'asc')->get();
        return response()->json($officials);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'position' => 'required|string|max:255',
            'term' => 'required|string|max:255',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'display_order' => 'nullable|integer',
            'is_active' => 'nullable|boolean',
        ]);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('official-images', 'public');
            $validated['image'] = $path;
        }

        $official = Official::create($validated);

        return response()->json([
            'message' => 'Official created successfully',
            'data' => $official
        ], 201);
    }

    public function show(Official $official)
    {
        return response()->json($official);
    }

    public function update(Request $request, Official $official)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'position' => 'required|string|max:255',
            'term' => 'required|string|max:255',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'display_order' => 'nullable|integer',
            'is_active' => 'nullable|boolean',
        ]);

        if ($request->hasFile('image')) {
            if ($official->image) {
                Storage::disk('public')->delete($official->image);
            }
            $path = $request->file('image')->store('official-images', 'public');
            $validated['image'] = $path;
        }

        $official->update($validated);

        return response()->json([
            'message' => 'Official updated successfully',
            'data' => $official
        ]);
    }

    public function destroy(Official $official)
    {
        $official->delete();

        return response()->json([
            'message' => 'Official deleted successfully'
        ]);
    }
}
