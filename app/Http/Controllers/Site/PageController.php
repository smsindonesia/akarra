<?php

namespace App\Http\Controllers\Site;

use App\Http\Controllers\Controller;
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
        return Inertia::render('Home');
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
