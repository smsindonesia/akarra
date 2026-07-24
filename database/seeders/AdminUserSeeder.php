<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => env('ADMIN_EMAIL', 'admin@akarra.co.id')],
            [
                'name' => env('ADMIN_NAME', 'Admin AKARRA'),
                'password' => env('ADMIN_PASSWORD', 'ubah-password-ini'),
                'role' => User::ROLE_ADMIN,
            ]
        );

        $this->command->warn('Admin dibuat. Ganti ADMIN_PASSWORD di .env sebelum deploy.');
    }
}
