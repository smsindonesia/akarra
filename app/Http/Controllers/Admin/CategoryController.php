<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Category\StoreCategoryRequest;
use App\Models\Category;
use Illuminate\Http\RedirectResponse;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class CategoryController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Categories/Index', [
            'categories' => Category::withCount('articles')->orderBy('name')->get(),
        ]);
    }

    public function store(StoreCategoryRequest $request): RedirectResponse
    {
        Category::create($request->validated());

        return back()->with('success', 'Kategori ditambahkan.');
    }

    public function update(StoreCategoryRequest $request, Category $category): RedirectResponse
    {
        // Slug tidak ikut berubah saat nama diperbarui, agar URL kategori
        // yang sudah tersebar tidak putus. Ubah manual bila memang perlu.
        $category->update($request->safe()->only(['name', 'description']));

        return back()->with('success', 'Kategori diperbarui.');
    }

    public function destroy(Category $category): RedirectResponse
    {
        $count = $category->articles()->count();

        if ($count > 0) {
            throw ValidationException::withMessages([
                'category' => "Kategori ini dipakai {$count} artikel. Pindahkan artikelnya terlebih dahulu.",
            ]);
        }

        $category->delete();

        return back()->with('success', 'Kategori dihapus.');
    }
}
