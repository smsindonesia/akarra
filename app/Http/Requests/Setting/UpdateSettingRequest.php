<?php

namespace App\Http\Requests\Setting;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateSettingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isAdmin() ?? false;
    }

    public function rules(): array
    {
        return [
            'settings' => ['required', 'array', 'min:1'],
            'settings.*.group' => ['required', Rule::in(config('akarra.setting_groups'))],
            'settings.*.key' => ['required', 'string', 'max:120'],
            'settings.*.locale' => ['required', Rule::in(['id', 'en'])],
            'settings.*.value' => ['present'],
            'settings.*.type' => ['nullable', Rule::in(['string', 'html', 'json', 'boolean', 'integer'])],
        ];
    }

    public function messages(): array
    {
        return [
            'settings.required' => 'Tidak ada perubahan yang dikirim.',
            'settings.*.group.in' => 'Grup pengaturan tidak dikenali.',
        ];
    }
}
