<?php

namespace App\Http\Controllers\Site;

use App\Http\Controllers\Controller;
use App\Models\Article;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Kelima halaman publik (Home, Ecosystem, Products, Services, Founders).
 *
 * Kontennya sendiri (grup 'settings') dibagikan secara global lewat
 * HandleInertiaRequests, jadi tiap method di sini hanya perlu me-render
 * komponen halamannya.
 */
class PageController extends Controller
{
    public function home(): Response
    {
        return Inertia::render('Home', [
            // Artikel bukan bagian dari 'settings' yang dibagikan global,
            // jadi pratinjau artikel di beranda butuh prop sendiri di sini.
            'latestArticles' => Article::query()
                ->published()
                ->with('category')
                ->latest('published_at')
                ->take(3)
                ->get(),
        ]);
    }

    public function ecosystem(): Response
    {
        return Inertia::render('Ecosystem');
    }

    public function products(): Response
    {
        return Inertia::render('Products');
    }

    public function services(): Response
    {
        return Inertia::render('Services');
    }

    public function founders(): Response
    {
        return Inertia::render('Founders');
    }
}
