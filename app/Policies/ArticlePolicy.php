<?php

namespace App\Policies;

use App\Models\Article;
use App\Models\User;

class ArticlePolicy
{
    public function viewAny(User $user): bool
    {
        return $user->isAdmin();
    }

    public function view(User $user, Article $article): bool
    {
        return $user->isAdmin();
    }

    public function create(User $user): bool
    {
        return $user->isAdmin();
    }

    /**
     * Editor hanya boleh menyunting tulisannya sendiri; admin boleh semuanya.
     */
    public function update(User $user, Article $article): bool
    {
        return $user->role === User::ROLE_ADMIN || $user->id === $article->user_id;
    }

    public function delete(User $user, Article $article): bool
    {
        return $this->update($user, $article);
    }
}
