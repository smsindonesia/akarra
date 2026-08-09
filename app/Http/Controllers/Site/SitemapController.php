<?php

namespace App\Http\Controllers\Site;

use App\Http\Controllers\Controller;
use App\Models\Article;
use Illuminate\Http\Response;

class SitemapController extends Controller
{
    /**
     * Sitemap XML dibangun manual (bukan lewat paket pihak ketiga) karena
     * cakupannya kecil: beberapa halaman statis plus artikel yang tayang.
     */
    public function index(): Response
    {
        $entries = collect([
            ['loc' => route('home'), 'lastmod' => null],
            ['loc' => route('ecosystem'), 'lastmod' => null],
            ['loc' => route('products'), 'lastmod' => null],
            ['loc' => route('services'), 'lastmod' => null],
            ['loc' => route('founders'), 'lastmod' => null],
            ['loc' => route('articles.index'), 'lastmod' => null],
        ])->concat(
            Article::published()
                ->get(['id', 'slug', 'published_at', 'updated_at'])
                ->map(fn (Article $article) => [
                    'loc' => route('articles.show', $article),
                    'lastmod' => ($article->updated_at ?? $article->published_at)?->toAtomString(),
                ])
        );

        $xml = '<?xml version="1.0" encoding="UTF-8"?>'."\n";
        $xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'."\n";

        foreach ($entries as $entry) {
            $xml .= '  <url>'."\n";
            $xml .= '    <loc>'.e($entry['loc']).'</loc>'."\n";

            if ($entry['lastmod']) {
                $xml .= '    <lastmod>'.$entry['lastmod'].'</lastmod>'."\n";
            }

            $xml .= '  </url>'."\n";
        }

        $xml .= '</urlset>';

        return response($xml, 200)->header('Content-Type', 'application/xml');
    }
}
