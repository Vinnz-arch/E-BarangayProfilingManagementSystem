<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Official;

class BarangayOfficialSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $officials = [
            [
                'name' => 'Hon. Roberto A. Dela Cruz',
                'position' => 'Punong Barangay',
                'term' => '2023 - Present',
                'display_order' => 1,
            ],
            [
                'name' => 'Hon. Maria Elena S. Santos',
                'position' => 'Barangay Kagawad',
                'term' => '2023 - Present',
                'display_order' => 2,
            ],
            [
                'name' => 'Hon. Juan Miguel P. Garcia',
                'position' => 'Barangay Kagawad',
                'term' => '2023 - Present',
                'display_order' => 3,
            ],
            [
                'name' => 'Hon. Ricardo T. Lim',
                'position' => 'Barangay Kagawad',
                'term' => '2023 - Present',
                'display_order' => 4,
            ],
            [
                'name' => 'Hon. Sofia Isabelle R. Reyes',
                'position' => 'Barangay Kagawad',
                'term' => '2023 - Present',
                'display_order' => 5,
            ],
            [
                'name' => 'Hon. Antonio B. Mendoza',
                'position' => 'Barangay Kagawad',
                'term' => '2023 - Present',
                'display_order' => 6,
            ],
            [
                'name' => 'Hon. Cristina M. Lopez',
                'position' => 'Barangay Kagawad',
                'term' => '2023 - Present',
                'display_order' => 7,
            ],
            [
                'name' => 'Hon. Ferdinand G. Castro',
                'position' => 'Barangay Kagawad',
                'term' => '2023 - Present',
                'display_order' => 8,
            ],
            [
                'name' => 'Hon. Paolo V. Dizon',
                'position' => 'SK Chairman',
                'term' => '2023 - Present',
                'display_order' => 9,
            ],
            [
                'name' => 'Mrs. Linda S. Bautista',
                'position' => 'Barangay Secretary',
                'term' => '2023 - Present',
                'display_order' => 10,
            ],
            [
                'name' => 'Mr. Rodolfo C. Pineda',
                'position' => 'Barangay Treasurer',
                'term' => '2023 - Present',
                'display_order' => 11,
            ],
        ];

        foreach ($officials as $official) {
            Official::create($official);
        }
    }
}
