<?php

namespace App\Http\Requests\Article;

use App\Models\Article;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreArticleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('create', Article::class) ?? false;
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:180'],
            'category_id' => ['required', 'integer', 'exists:categories,id'],
            'excerpt' => ['nullable', 'string', 'max:300'],
            'body' => ['required', 'string'],
            'cover_image' => ['nullable', 'string', 'max:255'],
            'status' => ['required', Rule::in([Article::STATUS_DRAFT, Article::STATUS_PUBLISHED])],
            'meta_title' => ['nullable', 'string', 'max:70'],
            'meta_description' => ['nullable', 'string', 'max:160'],
            'published_at' => ['nullable', 'date'],
        ];
    }

    public function messages(): array
    {
        return [
            'title.required' => 'Judul artikel wajib diisi.',
            'title.max' => 'Judul terlalu panjang, maksimal 180 karakter.',
            'category_id.required' => 'Pilih satu kategori.',
            'category_id.exists' => 'Kategori yang dipilih tidak ditemukan.',
            'body.required' => 'Isi artikel masih kosong.',
            'excerpt.max' => 'Ringkasan maksimal 300 karakter.',
            'meta_title.max' => 'Meta title maksimal 70 karakter agar tidak terpotong di Google.',
            'meta_description.max' => 'Meta description maksimal 160 karakter.',
        ];
    }
}
