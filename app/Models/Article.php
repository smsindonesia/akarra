<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Article extends Model
{
    use HasFactory;

    public const STATUS_DRAFT = 'draft';

    public const STATUS_PUBLISHED = 'published';

    protected $fillable = [
        'category_id',
        'user_id',
        'title',
        'slug',
        'excerpt',
        'body',
        'cover_image',
        'status',
        'meta_title',
        'meta_description',
        'published_at',
    ];

    // Dilampirkan otomatis saat model diserialisasi ke Inertia (kartu artikel
    // publik & daftar admin).
    protected $appends = [
        'published_at_human',
        'reading_time',
    ];

    protected function casts(): array
    {
        return [
            'published_at' => 'datetime',
        ];
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    public function isPublished(): bool
    {
        return $this->status === self::STATUS_PUBLISHED
            && $this->published_at !== null
            && ! $this->published_at->isFuture();
    }

    /**
     * Hanya artikel yang sudah benar-benar tayang.
     * Artikel terjadwal (published_at di masa depan) sengaja disembunyikan.
     */
    public function scopePublished(Builder $query): Builder
    {
        return $query->where('status', self::STATUS_PUBLISHED)
            ->whereNotNull('published_at')
            ->where('published_at', '<=', now());
    }

    public function scopeSearch(Builder $query, ?string $term): Builder
    {
        if (blank($term)) {
            return $query;
        }

        return $query->where(function (Builder $q) use ($term) {
            $q->where('title', 'like', "%{$term}%")
                ->orWhere('excerpt', 'like', "%{$term}%");
        });
    }

    protected function publishedAtHuman(): Attribute
    {
        return Attribute::make(get: fn () => $this->published_at?->translatedFormat('j F Y'));
    }

    /**
     * Estimasi waktu baca dalam menit, dihitung dari isi tanpa tag HTML.
     * 200 kata per menit adalah rata-rata pembaca berbahasa Indonesia.
     */
    protected function readingTime(): Attribute
    {
        return Attribute::make(get: function () {
            $words = str_word_count(strip_tags((string) $this->body));

            return max(1, (int) ceil($words / 200));
        });
    }
}
