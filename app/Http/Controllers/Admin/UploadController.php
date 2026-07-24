<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\UploadService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UploadController extends Controller
{
    public function __construct(private readonly UploadService $uploads) {}

    /**
     * Menerima unggahan dari dua tempat: gambar sampul artikel, dan lampiran
     * di dalam editor Trix (event trix-attachment-add).
     */
    public function __invoke(Request $request): JsonResponse
    {
        $maxSize = config('akarra.upload_max_size');
        $mimes = implode(',', config('akarra.upload_mimes'));

        $validated = $request->validate([
            'file' => ['required', 'file', 'image', "mimes:{$mimes}", "max:{$maxSize}"],
            'folder' => ['nullable', 'string', 'in:articles,covers,settings'],
        ], [
            'file.required' => 'Tidak ada berkas yang dikirim.',
            'file.image' => 'Berkas harus berupa gambar.',
            'file.mimes' => 'Format gambar harus JPG, PNG, atau WEBP.',
            'file.max' => 'Ukuran gambar melebihi batas '.round($maxSize / 1024, 1).' MB.',
        ]);

        $result = $this->uploads->storeImage(
            $validated['file'],
            $validated['folder'] ?? 'articles'
        );

        return response()->json($result, 201);
    }
}
