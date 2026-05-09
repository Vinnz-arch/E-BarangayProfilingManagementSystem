<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Sitio;
use App\Models\Resident;
use Faker\Factory as Faker;
use Carbon\Carbon;

class SitioAndResidentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Faker::create('en_PH');

        $sitios = [
            [
                'name' => 'Agbalagon',
                'address' => 'Jaena norte, Jamindan, Capiz',
            ],
            [
                'name' => 'Dumalag',
                'address' => 'Dumalag, Capiz',
            ],
            [
                'name' => 'Lucero',
                'address' => 'Jamindan, Capiz',
            ],
        ];

        foreach ($sitios as $sitioData) {
            $sitio = Sitio::create($sitioData);

            for ($i = 0; $i < 50; $i++) {
                $gender = $faker->randomElement(['Male', 'Female']);
                $birthDate = $faker->dateTimeBetween('-85 years', '-2 years');
                $age = Carbon::parse($birthDate)->age;
                
                Resident::create([
                    'sitio_id' => $sitio->id,
                    'last_name' => $faker->lastName,
                    'first_name' => $faker->firstName($gender),
                    'middle_initial' => strtoupper($faker->lexify('?')),
                    'is_household_type' => $faker->randomElement(['0', '1']),
                    'gender' => $gender,
                    'date_of_birth' => $birthDate,
                    'citizenship' => 'Filipino',
                    'civil_status' => $faker->randomElement(['Single', 'Married', 'Widowed', 'Separated']),
                    'occupation' => $faker->optional(0.7)->jobTitle,
                    'school_attainment' => $faker->randomElement(['Elementary Undergraduate', 'Elementary Graduate', 'High School Undergraduate', 'High School Graduate', 'College Undergraduate', 'College Graduate', 'Vocational']),
                    'skills' => $faker->optional(0.3)->sentence(3),
                    'blood_type' => $faker->randomElement(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']),
                    'is_4ps' => $faker->boolean(25), // 25% chance
                    'is_pwd' => $faker->boolean(8),   // 8% chance
                    'is_solo_parent' => $faker->boolean(12), // 12% chance
                    'is_senior_citizen' => $age >= 60,
                ]);
            }
        }
    }
}
