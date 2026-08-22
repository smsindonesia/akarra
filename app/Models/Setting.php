<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class Setting extends Model
{
    public const CACHE_KEY = 'akarra.settings';

    protected $fillable = [
        'group',
        'key',
        'locale',
        'value',
        'type',
    ];

    protected static function booted(): void
    {
        // Konten situs jarang berubah tetapi dibaca di setiap kunjungan,
        // jadi di-cache dan dibersihkan setiap kali admin menyimpan.
        static::saved(fn () => Cache::forget(self::CACHE_KEY));
        static::deleted(fn () => Cache::forget(self::CACHE_KEY));
    }

    /**
     * Seluruh pengaturan dikelompokkan per bahasa lalu per grup halaman:
     * ['id' => ['global' => [...], 'home' => [...]], 'en' => [...]]
     *
     * Dibagikan utuh (kedua bahasa) lewat Inertia supaya toggle ID/EN di
     * frontend instan tanpa kunjungan baru ke server.
     *
     * TTL dibatasi (bukan rememberForever) sebagai jaring pengaman: cache
     * dibersihkan otomatis lewat event saved()/deleted() di atas untuk
     * setiap simpanan lewat panel admin, tapi kalau suatu saat ada tulisan
     * langsung ke tabel ini yang melewati Eloquent (query builder mentah,
     * perintah tinker, dll — event model itu tidak akan terpanggil), cache
     * lama tidak akan tersangkut selamanya. Situs akan menampilkan data
     * benar lagi dalam hitungan menit tanpa perlu campur tangan manual.
     */
    public static function groupedAll(): array
    {
        return Cache::remember(self::CACHE_KEY, now()->addMinutes(10), function () {
            return static::query()
                ->orderBy('locale')
                ->orderBy('group')
                ->orderBy('key')
                ->get()
                ->groupBy('locale')
                ->map(fn ($localeItems) => $localeItems
                    ->groupBy('group')
                    ->map(fn ($items) => $items->mapWithKeys(
                        fn (Setting $s) => [$s->key => $s->castValue()]
                    )))
                ->toArray();
        });
    }

    /** Sama seperti groupedAll(), tapi cuma satu bahasa — dipakai panel admin. */
    public static function grouped(string $locale = 'id'): array
    {
        return static::groupedAll()[$locale] ?? [];
    }

    public function castValue(): mixed
    {
        return match ($this->type) {
            'json' => json_decode((string) $this->value, true) ?? [],
            'boolean' => filter_var($this->value, FILTER_VALIDATE_BOOLEAN),
            'integer' => (int) $this->value,
            default => $this->value,
        };
    }
}
