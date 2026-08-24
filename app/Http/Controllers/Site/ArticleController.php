<?php

namespace App\Http\Controllers\Site;

use App\Http\Controllers\Controller;
use App\Models\Article;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class ArticleController extends Controller
{
    public function index(Request $request): Response
    {
        $articles = Article::query()
            ->published()
            ->with(['category', 'author'])
            ->when($request->string('category')->toString(), function ($q, $slug) {
                $q->whereHas('category', fn ($c) => $c->where('slug', $slug));
            })
            ->search($request->string('search')->toString())
            ->latest('published_at')
            ->paginate(config('akarra.articles_per_page'))
            ->withQueryString();

        // Canonical ikut menyertakan halaman dan filter yang sedang aktif.
        // Kalau selalu menunjuk /articles polos, Google membaca halaman 2 dan
        // seterusnya sebagai duplikat halaman 1 lalu tidak mengindeksnya sama
        // sekali. Nilai kosong dan page=1 sengaja dibuang supaya halaman
        // pertama tetap punya satu alamat kanonik yang bersih.
        $canonicalParams = array_filter([
            'category' => $request->string('category')->toString() ?: null,
            'search' => $request->string('search')->toString() ?: null,
            'page' => $request->integer('page') > 1 ? $request->integer('page') : null,
        ]);

        return Inertia::render('Articles/Index', [
            'articles' => $articles,
            'filters' => $request->only(['category', 'search']),
            'canonicalUrl' => route('articles.index', $canonicalParams),
        ]);
    }

    public function show(Article $article): Response
    {
        // Route model binding memakai slug, jadi draft pun bisa terjaring.
        // Dicegah di sini agar artikel yang belum tayang tidak bisa diintip.
        if (! $article->isPublished()) {
            throw new NotFoundHttpException('Artikel tidak ditemukan.');
        }

        $article->load(['category', 'author']);

        $related = Article::query()
            ->published()
            ->where('category_id', $article->category_id)
            ->whereKeyNot($article->id)
            ->with('category')
            ->latest('published_at')
            ->take(3)
            ->get();

        return Inertia::render('Articles/Show', [
            'article' => $article,
            'related' => $related,
            'canonicalUrl' => route('articles.show', $article),
            'coverImageUrl' => $this->absoluteUrl($article->cover_image),
        ]);
    }

    /**
     * cover_image normalnya sudah URL penuh (dari UploadService), tapi
     * dijaga di sini kalau-kalau tersimpan sebagai path relatif.
     */
    private function absoluteUrl(?string $path): ?string
    {
        if (blank($path)) {
            return null;
        }

        return Str::startsWith($path, ['http://', 'https://']) ? $path : url($path);
    }
}
