<?php

namespace App\Http\Controllers\API\v1;

use App\Http\Controllers\Controller;
use App\Models\Resident;
use App\Services\BeneficiaryExportService;
use Illuminate\Http\Request;

class BeneficiaryExportController extends Controller
{
    protected $exportService;

    public function __construct(BeneficiaryExportService $exportService)
    {
        $this->exportService = $exportService;
    }

    public function exportPwd(Request $request)
    {
        $query = Resident::where('is_pwd', true);
        $this->applyFilters($query, $request);

        $format = $request->get('format', 'xlsx');
        return $this->exportService->export($query, $format, 'pwd_beneficiaries', 'PWD');
    }

    public function exportSoloParent(Request $request)
    {
        $query = Resident::where('is_solo_parent', true);
        $this->applyFilters($query, $request);

        $format = $request->get('format', 'xlsx');
        return $this->exportService->export($query, $format, 'solo_parent_beneficiaries', 'Solo Parent');
    }

    public function export4ps(Request $request)
    {
        $query = Resident::where('is_4ps', true);
        $this->applyFilters($query, $request);

        $format = $request->get('format', 'xlsx');
        return $this->exportService->export($query, $format, '4ps_beneficiaries', '4Ps');
    }

    public function exportSeniorCitizen(Request $request)
    {
        $query = Resident::where('is_senior_citizen', true);
        $this->applyFilters($query, $request);

        $format = $request->get('format', 'xlsx');
        return $this->exportService->export($query, $format, 'senior_citizen_beneficiaries', 'Senior Citizen');
    }

    protected function applyFilters($query, Request $request)
    {
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                  ->orWhere('last_name', 'like', "%{$search}%");
            });
        }

        if ($request->has('sitio_id')) {
            $query->where('sitio_id', $request->sitio_id);
        }

        $query->orderBy('last_name', 'asc')->orderBy('first_name', 'asc');
    }
}
