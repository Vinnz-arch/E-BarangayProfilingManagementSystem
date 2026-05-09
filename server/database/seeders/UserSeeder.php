<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@barangay.gov'],
            [
                'name' => 'System Administrator',
                'password' => Hash::make('admin123'),
                'email_verified_at' => now(),
            ]
        );
    }
}
