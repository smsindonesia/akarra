<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Article\StoreArticleRequest;
use App\Http\Requests\Article\UpdateArticleRequest;
use App\Models\Article;
use App\Models\Category;
use App\Services\ArticleService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ArticleController extends Controller
{
    public function __construct(private readonly ArticleService $articles) {}

    public function index(Request $request): Response
    {
        $this->authorize('viewAny', Article::class);

        $articles = Article::query()
            ->with(['category', 'author'])
            ->when($request->string('status')->toString(), fn ($q, $s) => $q->where('status', $s))
            ->when($request->string('category')->toString(), function ($q, $slug) {
                $q->whereHas('category', fn ($c) => $c->where('slug', $slug));
            })
            ->search($request->string('search')->toString())
            ->latest('updated_at')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Admin/Articles/Index', [
            'articles' => $articles,
            'categories' => Category::orderBy('name')->get(),
            'filters' => $request->only(['status', 'category', 'search']),
        ]);
    }

    public function create(): Response
    {
        $this->authorize('create', Article::class);

        return Inertia::render('Admin/Articles/Form', [
            'categories' => Category::orderBy('name')->get(),
        ]);
    }

    public function store(StoreArticleRequest $request): RedirectResponse
    {
        $article = $this->articles->create($request->validated(), $request->user()->id);

        return to_route('admin.articles.index')
            ->with('success', $article->isPublished() ? 'Artikel terbit.' : 'Draft tersimpan.');
    }

    public function edit(Article $article): Response
    {
        $this->authorize('update', $article);

        return Inertia::render('Admin/Articles/Form', [
            'article' => $article->load(['category', 'author']),
            'categories' => Category::orderBy('name')->get(),
        ]);
    }

    public function update(UpdateArticleRequest $request, Article $article): RedirectResponse
    {
        $updated = $this->articles->update($article, $request->validated());

        return to_route('admin.articles.index')
            ->with('success', $updated->isPublished() ? 'Perubahan tersimpan dan tayang.' : 'Draft tersimpan.');
    }

    public function destroy(Article $article): RedirectResponse
    {
        $this->authorize('delete', $article);

        $this->articles->delete($article);

        return back()->with('success', 'Artikel dihapus.');
    }
}
