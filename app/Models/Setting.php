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
     */
    public static function groupedAll(): array
    {
        return Cache::rememberForever(self::CACHE_KEY, function () {
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
