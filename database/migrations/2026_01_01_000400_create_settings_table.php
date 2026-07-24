<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('settings', function (Blueprint $table) {
            $table->id();

            // Grup mengikuti halaman di Figma: global, home, ecosystem,
            // products, services, founders.
            $table->string('group', 40)->index();

            $table->string('key', 120);
            $table->longText('value')->nullable();
            $table->string('type', 20)->default('string');
            $table->timestamps();

            $table->unique(['group', 'key']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('settings');
    }
};
