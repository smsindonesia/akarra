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
     * Seluruh pengaturan dikelompokkan per grup halaman:
     * ['global' => [...], 'home' => [...], 'services' => [...], ...]
     */
    public static function grouped(): array
    {
        return Cache::rememberForever(self::CACHE_KEY, function () {
            return static::query()
                ->orderBy('group')
                ->orderBy('key')
                ->get()
                ->groupBy('group')
                ->map(fn ($items) => $items->mapWithKeys(
                    fn (Setting $s) => [$s->key => $s->castValue()]
                ))
                ->toArray();
        });
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
