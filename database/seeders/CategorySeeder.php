<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['name' => 'Fashion & Tren', 'description' => 'Perkembangan industri fashion dan arah tren.'],
            ['name' => 'Creative Labs', 'description' => 'Proses kreatif, desain, dan produksi.'],
            ['name' => 'Event & Pertunjukan', 'description' => 'Penyelenggaraan acara dan pengalaman brand.'],
            ['name' => 'Digital & Periklanan', 'description' => 'Strategi digital, media, dan periklanan.'],
            ['name' => 'Tips Bisnis Fashion', 'description' => 'Panduan praktis membangun bisnis fashion.'],
            ['name' => 'Berita Perusahaan', 'description' => 'Kabar terbaru dari ekosistem AKARRA.'],
            ['name' => 'Studi Kasus Klien', 'description' => 'Cerita kerja sama dan hasilnya.'],
        ];

        foreach ($categories as $category) {
            Category::updateOrCreate(['name' => $category['name']], $category);
        }
    }
}
