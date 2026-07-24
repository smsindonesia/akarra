<?php

namespace App\Services;

use App\Models\Article;
use Illuminate\Support\Str;

class ArticleService
{
    public function __construct(
        private readonly HtmlSanitizerService $sanitizer,
        private readonly UploadService $uploads,
    ) {}

    /**
     * @param  array<string, mixed>  $data
     */
    public function create(array $data, int $userId): Article
    {
        $data['user_id'] = $userId;
        $data['slug'] = $this->uniqueSlug($data['title']);
        $data['body'] = $this->sanitizer->article($data['body'] ?? null);
        $data['published_at'] = $this->resolvePublishedAt($data);

        return Article::create($data);
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function update(Article $article, array $data): Article
    {
        // Slug hanya diperbarui bila judul berubah, agar URL yang sudah
        // dibagikan atau terindeks mesin pencari tidak putus.
        if (isset($data['title']) && $data['title'] !== $article->title) {
            $data['slug'] = $this->uniqueSlug($data['title'], $article->id);
        }

        if (array_key_exists('body', $data)) {
            $data['body'] = $this->sanitizer->article($data['body']);
        }

        // Gambar sampul lama dihapus agar penyimpanan tidak menumpuk.
        if (array_key_exists('cover_image', $data) && $data['cover_image'] !== $article->cover_image) {
            $this->uploads->delete($article->cover_image);
        }

        $data['published_at'] = $this->resolvePublishedAt($data, $article);

        $article->update($data);

        return $article->fresh(['category', 'author']);
    }

    public function delete(Article $article): void
    {
        $this->uploads->delete($article->cover_image);
        $article->delete();
    }

    public function uniqueSlug(string $title, ?int $ignoreId = null): string
    {
        $base = Str::slug($title);
        $slug = $base ?: 'artikel';
        $i = 2;

        while (Article::where('slug', $slug)
            ->when($ignoreId, fn ($q) => $q->whereKeyNot($ignoreId))
            ->exists()) {
            $slug = "{$base}-{$i}";
            $i++;
        }

        return $slug;
    }

    /**
     * Aturan tanggal terbit:
     * - draft                       -> null
     * - terbit tanpa tanggal        -> sekarang
     * - terbit dengan tanggal       -> pakai tanggal itu (boleh dijadwalkan)
     *
     * @param  array<string, mixed>  $data
     */
    private function resolvePublishedAt(array $data, ?Article $article = null): ?string
    {
        $status = $data['status'] ?? $article?->status ?? Article::STATUS_DRAFT;

        if ($status === Article::STATUS_DRAFT) {
            return null;
        }

        if (filled($data['published_at'] ?? null)) {
            return $data['published_at'];
        }

        return $article?->published_at?->toDateTimeString() ?? now()->toDateTimeString();
    }
}
