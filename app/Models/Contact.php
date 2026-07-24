<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Contact extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'email',
        'phone',
        'interest',
        'subject',
        'message',
        'is_read',
    ];

    // Dilampirkan otomatis saat model diserialisasi ke Inertia (dashboard,
    // daftar & detail pesan admin).
    protected $appends = [
        'interest_label',
        'created_at_human',
    ];

    protected function casts(): array
    {
        return [
            'is_read' => 'boolean',
        ];
    }

    protected function interestLabel(): Attribute
    {
        return Attribute::make(
            get: fn () => config("akarra.interests.{$this->interest}", 'Lainnya'),
        );
    }

    protected function createdAtHuman(): Attribute
    {
        return Attribute::make(get: fn () => $this->created_at?->diffForHumans());
    }
}
