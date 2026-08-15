<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Setting\UpdateSettingRequest;
use App\Models\Setting;
use App\Services\HtmlSanitizerService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class SettingController extends Controller
{
    /** Sama seperti pola di resources/js/components/admin/MediaListField.jsx — harus tetap sinkron. */
    private const IMAGE_KEY_PATTERN = '/image|photo|portrait|logo|favicon|cover/i';

    private const VIDEO_KEY_PATTERN = '/video/i';

    private const GALLERY_KEY_PATTERN = '/gallery/i';

    public function __construct(private readonly HtmlSanitizerService $sanitizer) {}

    public function index(Request $request): Response
    {
        $groups = config('akarra.setting_groups');
        $activeGroup = $request->query('group');

        if (! in_array($activeGroup, $groups, true)) {
            $activeGroup = $groups[0];
        }

        $activeLocale = $request->query('locale');

        if (! in_array($activeLocale, ['id', 'en'], true)) {
            $activeLocale = 'id';
        }

        return Inertia::render('Admin/Settings/Index', [
            'settings' => Setting::grouped($activeLocale),
            'groups' => $groups,
            'activeGroup' => $activeGroup,
            'activeLocale' => $activeLocale,
        ]);
    }

    /**
     * Menyimpan banyak pengaturan sekaligus dalam satu transaksi, supaya satu
     * tab pengaturan tidak pernah tersimpan setengah jadi.
     */
    public function update(UpdateSettingRequest $request): RedirectResponse
    {
        DB::transaction(function () use ($request) {
            foreach ($request->validated('settings') as $item) {
                $type = $item['type'] ?? 'string';
                $rawValue = $item['value'];

                $value = match ($type) {
                    'json' => json_encode($rawValue, JSON_UNESCAPED_UNICODE),
                    'html' => $this->sanitizer->plain(is_string($rawValue) ? $rawValue : ''),
                    'boolean' => $rawValue ? '1' : '0',
                    default => is_scalar($rawValue) ? (string) $rawValue : json_encode($rawValue),
                };

                Setting::updateOrCreate(
                    ['group' => $item['group'], 'key' => $item['key'], 'locale' => $item['locale']],
                    ['value' => $value, 'type' => $type],
                );

                $this->propagateMediaToOtherLocale($item, $type, $rawValue);
            }
        });

        return back()->with('success', 'Perubahan tersimpan dan langsung tampil di situs.');
    }

    /**
     * Foto/video bersifat sama untuk kedua bahasa — admin tidak perlu
     * mengunggah dua kali. Field gambar/video (dideteksi dari nama field,
     * termasuk yang bersarang di dalam JSON, mis. `pillars[].image`)
     * disalin ke locale yang lain; field teks di sekitarnya (judul, body,
     * dll) tidak disentuh supaya terjemahan yang sudah ada tidak tertimpa.
     */
    private function propagateMediaToOtherLocale(array $item, string $type, mixed $rawValue): void
    {
        $otherLocale = $item['locale'] === 'id' ? 'en' : 'id';

        if ($type === 'string') {
            if (! $this->isMediaKey($item['key'])) {
                return;
            }

            Setting::updateOrCreate(
                ['group' => $item['group'], 'key' => $item['key'], 'locale' => $otherLocale],
                ['value' => is_scalar($rawValue) ? (string) $rawValue : '', 'type' => 'string'],
            );

            return;
        }

        if ($type !== 'json') {
            return;
        }

        // Kalau field itu SENDIRI adalah field media (mis. `gallery`: daftar
        // URL foto tanpa nama field di tiap item), tidak ada apa pun untuk
        // "dicocokkan berdasarkan nama field" di dalamnya — seluruh isinya
        // memang media, jadi disalin utuh. mergeMedia() di bawah baru
        // relevan untuk JSON yang mencampur teks dan gambar per item
        // (mis. `pillars[].image`, ada `body`/`title` yang harus tetap per
        // bahasa).
        if ($this->isMediaKey($item['key'])) {
            Setting::updateOrCreate(
                ['group' => $item['group'], 'key' => $item['key'], 'locale' => $otherLocale],
                ['value' => json_encode($rawValue, JSON_UNESCAPED_UNICODE), 'type' => 'json'],
            );

            return;
        }

        $other = Setting::query()
            ->where(['group' => $item['group'], 'key' => $item['key'], 'locale' => $otherLocale])
            ->first();

        $otherValue = $other ? json_decode((string) $other->value, true) : null;
        $merged = $this->mergeMedia($rawValue, $otherValue);

        Setting::updateOrCreate(
            ['group' => $item['group'], 'key' => $item['key'], 'locale' => $otherLocale],
            ['value' => json_encode($merged, JSON_UNESCAPED_UNICODE), 'type' => 'json'],
        );
    }

    private function isMediaKey(string $key): bool
    {
        return preg_match(self::IMAGE_KEY_PATTERN, $key) === 1
            || preg_match(self::VIDEO_KEY_PATTERN, $key) === 1
            || preg_match(self::GALLERY_KEY_PATTERN, $key) === 1;
    }

    /**
     * Menyalin nilai dari $source ke $target secara rekursif berdasarkan nama
     * field: field gambar/video/galeri disalin, field lain (teks) di $target
     * dipertahankan apa adanya — kecuali belum ada sama sekali di $target,
     * yang berarti item itu baru dan diisi awal dengan nilai dari $source.
     */
    private function mergeMedia(mixed $source, mixed $target): mixed
    {
        if (! is_array($source)) {
            return $target;
        }

        if (array_is_list($source)) {
            // Daftar objek (mis. pillars, subcards) direkonsiliasi per index
            // supaya field gambar di dalamnya tetap tersinkron. Daftar teks
            // polos (mis. bullets, mission) TIDAK direkonsiliasi per index —
            // tidak ada nama field untuk dicocokkan pada tiap item, jadi
            // mencocokkan berdasarkan posisi saja berisiko: kalau panjang
            // daftar berbeda antar locale (item ditambah/dihapus di salah
            // satu bahasa), rekonsiliasi per index akan memotong atau
            // menimpa teks locale lain dengan null. Daftar seperti ini
            // dibiarkan utuh di locale lain (atau diisi dari source kalau
            // memang belum ada sama sekali).
            $isObjectList = collect($source)->contains(fn ($item) => is_array($item));

            if (! $isObjectList) {
                return is_array($target) && $target !== [] ? $target : $source;
            }

            $result = [];

            foreach ($source as $index => $item) {
                $result[$index] = $this->mergeMedia($item, $target[$index] ?? null);
            }

            return $result;
        }

        $result = is_array($target) ? $target : [];

        foreach ($source as $key => $value) {
            if ($this->isMediaKey((string) $key)) {
                $result[$key] = $value;
            } elseif (is_array($value)) {
                $result[$key] = $this->mergeMedia($value, $result[$key] ?? null);
            } elseif (! array_key_exists($key, $result)) {
                $result[$key] = $value;
            }
        }

        return $result;
    }
}
