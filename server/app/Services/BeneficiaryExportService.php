<?php

namespace App\Services;

use App\Models\Resident;
use Carbon\Carbon;
use OpenSpout\Common\Entity\Row;
use OpenSpout\Common\Entity\Cell;
use OpenSpout\Writer\AbstractWriter;
use OpenSpout\Writer\CSV\Writer as CSVWriter;
use OpenSpout\Writer\XLSX\Writer as XLSXWriter;
use OpenSpout\Writer\WriterInterface;
use Symfony\Component\HttpFoundation\StreamedResponse;

class BeneficiaryExportService
{
    /**
     * Export residents to a streamed response.
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param string $format
     * @param string $filename
     * @param string $beneficiaryType
     * @return StreamedResponse
     */
    public function export($query, string $format, string $filename, string $beneficiaryType): StreamedResponse
    {
        return new StreamedResponse(function () use ($query, $format, $beneficiaryType) {
            $writer = $this->getWriter($format);
            $writer->openToFile('php://output');

            // Header Row
            $header = [
                'Full Name',
                'Age',
                'Gender',
                'Address',
                'Sitio',
                'Civil Status',
                'Occupation',
                'Beneficiary Type',
                'Date Registered'
            ];
            $writer->addRow(Row::fromValues($header));

            // Chunk the results for memory efficiency
            $query->with('sitio')->chunk(200, function ($residents) use ($writer, $beneficiaryType) {
                foreach ($residents as $resident) {
                    $fullName = "{$resident->last_name}, {$resident->first_name}" . ($resident->middle_initial ? " {$resident->middle_initial}." : "");
                    $age = Carbon::parse($resident->date_of_birth)->age;
                    
                    $writer->addRow(Row::fromValues([
                        $fullName,
                        $age,
                        $resident->gender,
                        $resident->sitio->address ?? 'N/A',
                        $resident->sitio->name ?? 'N/A',
                        $resident->civil_status,
                        $resident->occupation ?? 'N/A',
                        $beneficiaryType,
                        $resident->created_at->format('Y-m-d')
                    ]));
                }
            });

            $writer->close();
        }, 200, [
            'Content-Type' => $format === 'xlsx' 
                ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
                : 'text/csv',
            'Content-Disposition' => 'attachment; filename="' . $filename . '.' . $format . '"',
            'Cache-Control' => 'max-age=0',
        ]);
    }

    /**
     * Get the appropriate writer for the format.
     *
     * @param string $format
     * @return WriterInterface
     */
    protected function getWriter(string $format): WriterInterface
    {
        if ($format === 'csv') {
            return new CSVWriter();
        }

        return new XLSXWriter();
    }
}
