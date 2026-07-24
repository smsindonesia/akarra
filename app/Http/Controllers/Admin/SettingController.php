<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Setting\UpdateSettingRequest;
use App\Models\Setting;
use App\Services\HtmlSanitizerService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class SettingController extends Controller
{
    public function __construct(private readonly HtmlSanitizerService $sanitizer) {}

    public function index(): Response
    {
        return Inertia::render('Admin/Settings/Index', [
            'settings' => Setting::grouped(),
            'groups' => config('akarra.setting_groups'),
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
                $value = $item['value'];

                $value = match ($type) {
                    'json' => json_encode($value, JSON_UNESCAPED_UNICODE),
                    'html' => $this->sanitizer->plain(is_string($value) ? $value : ''),
                    'boolean' => $value ? '1' : '0',
                    default => is_scalar($value) ? (string) $value : json_encode($value),
                };

                Setting::updateOrCreate(
                    ['group' => $item['group'], 'key' => $item['key']],
                    ['value' => $value, 'type' => $type],
                );
            }
        });

        return back()->with('success', 'Perubahan tersimpan dan langsung tampil di situs.');
    }
}
