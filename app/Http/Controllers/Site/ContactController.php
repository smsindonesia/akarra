<?php

namespace App\Http\Controllers\Site;

use App\Http\Controllers\Controller;
use App\Http\Requests\Contact\StoreContactRequest;
use App\Models\Contact;
use Illuminate\Http\RedirectResponse;

class ContactController extends Controller
{
    /**
     * Formulir "Mari Berkolaborasi".
     *
     * Dipanggil dari beberapa halaman sekaligus, karena pada desain Figma
     * tidak ada halaman kontak terpisah.
     */
    public function store(StoreContactRequest $request): RedirectResponse
    {
        Contact::create($request->safe()->except('website'));

        return back()->with('success', 'Pesan Anda terkirim. Tim kami menghubungi dalam 1x24 jam kerja.');
    }
}
