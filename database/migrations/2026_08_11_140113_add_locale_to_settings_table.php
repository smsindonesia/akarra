<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('settings', function (Blueprint $table) {
            $table->string('locale', 5)->default('id')->after('key');
        });

        Schema::table('settings', function (Blueprint $table) {
            $table->dropUnique(['group', 'key']);
            $table->unique(['group', 'key', 'locale']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('settings', function (Blueprint $table) {
            $table->dropUnique(['group', 'key', 'locale']);
        });

        // Baris locale=en (duplikat) tidak dihapus otomatis di sini — cukup
        // hentikan pemisahan per-locale; grouped() lama akan tetap membaca
        // semua baris tanpa filter, jadi baris 'en' yang tersisa aman diabaikan
        // (bukan tanggung jawab rollback skema untuk membersihkan data).
        Schema::table('settings', function (Blueprint $table) {
            $table->unique(['group', 'key']);
            $table->dropColumn('locale');
        });
    }
};
