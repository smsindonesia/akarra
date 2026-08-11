<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Konfigurasi khusus AKARRA
    |--------------------------------------------------------------------------
    */

    // Ukuran maksimum unggahan gambar dalam kilobyte.
    'upload_max_size' => (int) env('UPLOAD_MAX_SIZE', 2048),

    // Tipe gambar yang diterima.
    'upload_mimes' => ['jpg', 'jpeg', 'png', 'webp'],

    // Ukuran maksimum unggahan video dalam kilobyte (default 50 MB).
    'upload_max_video_size' => (int) env('UPLOAD_MAX_VIDEO_SIZE', 51200),

    // Tipe video yang diterima.
    'upload_video_mimes' => ['mp4', 'webm', 'mov'],

    // Jumlah artikel per halaman pada endpoint publik.
    'articles_per_page' => 9,

    /*
    | Daftar minat pada formulir "Mari Berkolaborasi". Nilai ini divalidasi di
    | backend dan dipakai untuk memfilter inbox admin. Selaraskan dengan
    | dropdown di frontend.
    */
    'interests' => [
        'fashionpreneur' => 'Akarra Fashionpreneur',
        'creative-labs' => 'Akarra Creative Labs',
        'advertising' => 'Akarra Advertising',
        'other' => 'Lainnya',
    ],

    /*
    | Grup pengaturan situs. Disusun per halaman, mengikuti struktur Figma,
    | bukan per jenis data — supaya admin mengedit dengan cara yang sama
    | seperti ia melihat situsnya.
    */
    'setting_groups' => [
        'global',
        'home',
        'ecosystem',
        'products',
        'services',
        'founders',
    ],

];
