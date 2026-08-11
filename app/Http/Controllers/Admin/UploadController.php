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
     * Menerima unggahan dari beberapa tempat: gambar sampul artikel, lampiran
     * di dalam editor Trix (event trix-attachment-add), dan video pada field
     * pengaturan (mis. story_video di beranda). Jenis berkas ditentukan lewat
     * input `type` (image/video), default gambar supaya pemanggil lama yang
     * belum mengirim `type` tetap berjalan seperti sebelumnya.
     */
    public function __invoke(Request $request): JsonResponse
    {
        $type = $request->input('type', 'image');

        if ($type === 'video') {
            return $this->handleVideo($request);
        }

        return $this->handleImage($request);
    }

    private function handleImage(Request $request): JsonResponse
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

    private function handleVideo(Request $request): JsonResponse
    {
        $maxSize = config('akarra.upload_max_video_size');
        $mimes = implode(',', config('akarra.upload_video_mimes'));

        $validated = $request->validate([
            'file' => ['required', 'file', "mimetypes:video/mp4,video/webm,video/quicktime", "mimes:{$mimes}", "max:{$maxSize}"],
            'folder' => ['nullable', 'string', 'in:articles,covers,settings'],
        ], [
            'file.required' => 'Tidak ada berkas yang dikirim.',
            'file.mimetypes' => 'Berkas harus berupa video.',
            'file.mimes' => 'Format video harus MP4, WEBM, atau MOV.',
            'file.max' => 'Ukuran video melebihi batas '.round($maxSize / 1024, 1).' MB.',
        ]);

        $result = $this->uploads->storeVideo(
            $validated['file'],
            $validated['folder'] ?? 'settings'
        );

        return response()->json($result, 201);
    }
}
