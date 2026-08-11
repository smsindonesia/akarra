<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class UploadService
{
    /**
     * Menyimpan gambar dan mengembalikan path relatif serta URL publik.
     *
     * Berkas disusun per tahun/bulan agar direktori tidak membengkak menjadi
     * ribuan berkas dalam satu folder setelah beberapa tahun berjalan.
     *
     * @return array{path: string, url: string, name: string, size: int}
     */
    public function storeImage(UploadedFile $file, string $folder = 'articles'): array
    {
        return $this->store($file, $folder);
    }

    /** Sama seperti storeImage, dipisah namanya supaya jelas dipanggil untuk berkas video. */
    public function storeVideo(UploadedFile $file, string $folder = 'settings'): array
    {
        return $this->store($file, $folder);
    }

    /**
     * Menyimpan berkas dan mengembalikan path relatif serta URL publik.
     *
     * Berkas disusun per tahun/bulan agar direktori tidak membengkak menjadi
     * ribuan berkas dalam satu folder setelah beberapa tahun berjalan.
     *
     * @return array{path: string, url: string, name: string, size: int}
     */
    private function store(UploadedFile $file, string $folder): array
    {
        $extension = strtolower($file->getClientOriginalExtension());

        // Nama berkas dibuat ulang, tidak memakai nama asli dari pengguna.
        $filename = Str::random(24).'.'.$extension;

        $directory = sprintf('%s/%s/%s', $folder, now()->format('Y'), now()->format('m'));

        $path = $file->storeAs($directory, $filename, 'public');

        return [
            'path' => $path,
            'url' => Storage::disk('public')->url($path),
            'name' => $file->getClientOriginalName(),
            'size' => $file->getSize(),
        ];
    }

    /** Menghapus berkas jika masih ada. Aman dipanggil dengan nilai null. */
    public function delete(?string $path): void
    {
        if (blank($path)) {
            return;
        }

        // Menerima URL penuh maupun path relatif.
        $relative = Str::after($path, '/storage/');

        if (Storage::disk('public')->exists($relative)) {
            Storage::disk('public')->delete($relative);
        }
    }
}
