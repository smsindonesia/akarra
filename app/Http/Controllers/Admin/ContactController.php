<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Contact;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ContactController extends Controller
{
    public function index(Request $request): Response
    {
        $contacts = Contact::query()
            ->when($request->string('interest')->toString(), fn ($q, $i) => $q->where('interest', $i))
            ->when($request->has('is_read'), fn ($q) => $q->where('is_read', $request->boolean('is_read')))
            ->when($request->string('search')->toString(), function ($q, $term) {
                $q->where(fn ($s) => $s->where('name', 'like', "%{$term}%")
                    ->orWhere('email', 'like', "%{$term}%")
                    ->orWhere('subject', 'like', "%{$term}%"));
            })
            ->latest()
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('Admin/Contacts/Index', [
            'contacts' => $contacts,
            'filters' => $request->only(['interest', 'is_read', 'search']),
            'unreadTotal' => Contact::where('is_read', false)->count(),
        ]);
    }

    public function toggleRead(Contact $contact): RedirectResponse
    {
        $contact->update(['is_read' => ! $contact->is_read]);

        return back()->with('success', $contact->is_read ? 'Ditandai sudah dibaca.' : 'Ditandai belum dibaca.');
    }

    public function destroy(Contact $contact): RedirectResponse
    {
        $contact->delete();

        return back()->with('success', 'Pesan dihapus.');
    }
}
