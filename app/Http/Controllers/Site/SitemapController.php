<?php

namespace App\Http\Controllers\Site;

use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Models\Setting;
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
            ['loc' => route('home'), 'lastmod' => null, 'changefreq' => 'weekly', 'priority' => '1.0'],
            ['loc' => route('ecosystem'), 'lastmod' => null, 'changefreq' => 'monthly', 'priority' => '0.8'],
            ['loc' => route('products'), 'lastmod' => null, 'changefreq' => 'monthly', 'priority' => '0.8'],
            ['loc' => route('services'), 'lastmod' => null, 'changefreq' => 'monthly', 'priority' => '0.8'],
            ['loc' => route('founders'), 'lastmod' => null, 'changefreq' => 'monthly', 'priority' => '0.6'],
            ['loc' => route('articles.index'), 'lastmod' => null, 'changefreq' => 'daily', 'priority' => '0.7'],
        ])->concat(
            Article::published()
                ->get(['id', 'slug', 'published_at', 'updated_at'])
                ->map(fn (Article $article) => [
                    'loc' => route('articles.show', $article),
                    'lastmod' => ($article->updated_at ?? $article->published_at)?->toAtomString(),
                    'changefreq' => 'monthly',
                    'priority' => '0.6',
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

            $xml .= '    <changefreq>'.$entry['changefreq'].'</changefreq>'."\n";
            $xml .= '    <priority>'.$entry['priority'].'</priority>'."\n";

            $xml .= '  </url>'."\n";
        }

        $xml .= '</urlset>';

        return response($xml, 200)->header('Content-Type', 'application/xml');
    }

    /**
     * llms.txt — ringkasan situs berformat teks/Markdown polos untuk crawler
     * berbasis AI (ChatGPT, Claude, Perplexity, dsb). Berbeda dari sitemap
     * XML yang ditujukan untuk mesin pencari tradisional, format ini memang
     * dirancang supaya bisa langsung dibaca/diringkas oleh model bahasa
     * tanpa perlu me-render halaman. Lihat konvensi https://llmstxt.org.
     */
    public function llms(): Response
    {
        $settings = Setting::grouped('id');
        $siteName = $settings['global']['site_name'] ?? 'AKARRA';
        $tagline = $settings['global']['tagline'] ?? '';
        $description = $settings['global']['description'] ?? '';

        $lines = [
            "# {$siteName}",
            '',
            trim("> {$tagline} — {$description}", '> '),
            '',
            '## Halaman',
            '- ['.$siteName.']('.route('home').'): Beranda dan ringkasan ekosistem.',
            '- [Ecosystem]('.route('ecosystem').'): '.($settings['ecosystem']['hero_subtitle'] ?? ''),
            '- [Products]('.route('products').'): '.($settings['products']['hero_subtitle'] ?? ''),
            '- [Services]('.route('services').'): '.($settings['services']['hero_subtitle'] ?? ''),
            '- [Founders]('.route('founders').'): '.($settings['founders']['hero_subtitle'] ?? ''),
            '- [Articles]('.route('articles.index').'): Artikel dan wawasan terbaru.',
            '',
            '## Artikel Terbaru',
        ];

        $articles = Article::published()
            ->latest('published_at')
            ->take(30)
            ->get(['title', 'slug', 'excerpt']);

        foreach ($articles as $article) {
            $title = $this->escapeMarkdownLinkText($article->title);
            $excerpt = $this->escapeMarkdownLinkText(str_replace("\n", ' ', (string) $article->excerpt));
            $lines[] = '- ['.$title.']('.route('articles.show', $article).')'.($excerpt ? ': '.$excerpt : '');
        }

        $lines[] = '';
        $lines[] = 'Sitemap: '.route('sitemap');

        return response(implode("\n", $lines), 200)->header('Content-Type', 'text/plain; charset=utf-8');
    }

    /** Judul/kutipan artikel bisa mengandung `[` atau `]` — tanpa di-escape, itu merusak sintaks tautan Markdown. */
    private function escapeMarkdownLinkText(string $text): string
    {
        return str_replace(['[', ']'], ['\\[', '\\]'], $text);
    }
}
