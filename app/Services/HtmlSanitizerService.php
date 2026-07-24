<?php

namespace App\Services;

use Mews\Purifier\Facades\Purifier;

/**
 * Satu-satunya sumber kebenaran untuk pembersihan HTML.
 *
 * Isi artikel datang dari editor Trix di browser, artinya sepenuhnya berada
 * di bawah kendali klien dan tidak boleh dipercaya. Pembersihan di sisi React
 * bukan pengaman — siapa pun dapat memanggil API ini langsung.
 */
class HtmlSanitizerService
{
    /** Membersihkan isi artikel dari Trix. */
    public function article(?string $html): string
    {
        if (blank($html)) {
            return '';
        }

        $clean = Purifier::clean($html, 'article');

        return $this->stripEmptyWrapper($clean);
    }

    /** Membersihkan teks pendek pada pengaturan situs (headline, narasi). */
    public function plain(?string $html): string
    {
        if (blank($html)) {
            return '';
        }

        return trim(Purifier::clean($html, 'plain'));
    }

    /**
     * Trix kerap menyisakan pembungkus kosong di akhir dokumen.
     * Dibersihkan agar spasi bawah pada halaman artikel tidak melebar.
     */
    private function stripEmptyWrapper(string $html): string
    {
        return trim(preg_replace('/(<div>\s*<br\s*\/?>\s*<\/div>\s*)+$/i', '', $html) ?? $html);
    }
}
