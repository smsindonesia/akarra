<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('articles', function (Blueprint $table) {
            $table->id();

            // Kategori dibatasi restrict: menghapus kategori yang masih dipakai
            // harus gagal, bukan diam-diam menghapus artikelnya.
            $table->foreignId('category_id')->constrained()->restrictOnDelete();

            // Penulis dihapus -> artikel tetap ada, penulisnya dikosongkan.
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();

            $table->string('title', 180);
            $table->string('slug', 200)->unique();
            $table->string('excerpt', 300)->nullable();
            $table->longText('body')->nullable();
            $table->string('cover_image')->nullable();

            $table->enum('status', ['draft', 'published'])->default('draft');
            $table->string('meta_title', 70)->nullable();
            $table->string('meta_description', 160)->nullable();
            $table->timestamp('published_at')->nullable();

            $table->timestamps();

            // Kueri publik selalu memfilter status + published_at lalu mengurutkan
            // berdasarkan published_at, jadi indeks gabungan ini yang terpakai.
            $table->index(['status', 'published_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('articles');
    }
};
