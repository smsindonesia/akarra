<?php

use App\Http\Controllers\Admin\ArticleController as AdminArticleController;
use App\Http\Controllers\Admin\CategoryController as AdminCategoryController;
use App\Http\Controllers\Admin\ContactController as AdminContactController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\SettingController as AdminSettingController;
use App\Http\Controllers\Admin\TavilyController;
use App\Http\Controllers\Admin\UploadController;
use App\Http\Controllers\Site\ArticleController;
use App\Http\Controllers\Site\ContactController;
use App\Http\Controllers\Site\PageController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Rute Publik
|--------------------------------------------------------------------------
| Kontennya (pengaturan situs per grup) dibagikan secara global lewat
| HandleInertiaRequests, sehingga setiap halaman tinggal dirender.
*/

Route::get('/', [PageController::class, 'home'])->name('home');
Route::get('/ecosystem', [PageController::class, 'ecosystem'])->name('ecosystem');
Route::get('/products', [PageController::class, 'products'])->name('products');
Route::get('/services', [PageController::class, 'services'])->name('services');
Route::get('/founders', [PageController::class, 'founders'])->name('founders');

Route::get('/articles', [ArticleController::class, 'index'])->name('articles.index');
Route::get('/articles/{article:slug}', [ArticleController::class, 'show'])->name('articles.show');

// Formulir "Mari Berkolaborasi". Dibatasi untuk meredam spam.
Route::post('/contacts', [ContactController::class, 'store'])
    ->middleware('throttle:5,1')
    ->name('contacts.store');

require __DIR__.'/auth.php';

/*
|--------------------------------------------------------------------------
| Rute Admin
|--------------------------------------------------------------------------
| Wajib login (auth) dan berperan admin/editor (middleware 'admin').
*/

Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {

    Route::get('/', DashboardController::class)->name('dashboard');

    Route::resource('articles', AdminArticleController::class)->except(['show']);
    Route::resource('categories', AdminCategoryController::class)
        ->only(['index', 'store', 'update', 'destroy']);

    Route::get('/contacts', [AdminContactController::class, 'index'])->name('contacts.index');
    Route::patch('/contacts/{contact}/read', [AdminContactController::class, 'toggleRead'])->name('contacts.toggle-read');
    Route::delete('/contacts/{contact}', [AdminContactController::class, 'destroy'])->name('contacts.destroy');

    Route::get('/settings', [AdminSettingController::class, 'index'])->name('settings.index');
    Route::put('/settings', [AdminSettingController::class, 'update'])->name('settings.update');

    Route::get('/integrations', fn () => Inertia::render('Admin/Integrations/Index'))->name('integrations.index');

    Route::post('/upload', UploadController::class)->name('upload');

    Route::get('/tavily/status', [TavilyController::class, 'status'])->name('tavily.status');
    Route::post('/tavily/search', [TavilyController::class, 'search'])->name('tavily.search');
});
