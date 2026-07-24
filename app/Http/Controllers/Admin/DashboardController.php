<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Models\Category;
use App\Models\Contact;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(): Response
    {
        return Inertia::render('Admin/Dashboard', [
            'counts' => [
                'articles' => Article::count(),
                'published' => Article::published()->count(),
                'drafts' => Article::where('status', Article::STATUS_DRAFT)->count(),
                'categories' => Category::count(),
                'contacts' => Contact::count(),
                'unread_contacts' => Contact::where('is_read', false)->count(),
            ],
            'latestArticles' => Article::with(['category', 'author'])->latest()->take(5)->get(),
            'unreadContacts' => Contact::where('is_read', false)->latest()->take(5)->get(),
        ]);
    }
}
