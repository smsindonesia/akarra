<?php

namespace App\Http\Requests\Article;

use App\Models\Article;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateArticleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('update', $this->route('article')) ?? false;
    }

    public function rules(): array
    {
        return [
            'title' => ['sometimes', 'required', 'string', 'max:180'],
            'category_id' => ['sometimes', 'required', 'integer', 'exists:categories,id'],
            'excerpt' => ['nullable', 'string', 'max:300'],
            'body' => ['sometimes', 'required', 'string'],
            'cover_image' => ['nullable', 'string', 'max:255'],
            'status' => ['sometimes', 'required', Rule::in([Article::STATUS_DRAFT, Article::STATUS_PUBLISHED])],
            'meta_title' => ['nullable', 'string', 'max:70'],
            'meta_description' => ['nullable', 'string', 'max:160'],
            'published_at' => ['nullable', 'date'],
        ];
    }

    public function messages(): array
    {
        return (new StoreArticleRequest)->messages();
    }
}
