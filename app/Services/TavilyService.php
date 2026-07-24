<?php

namespace App\Services;

use Illuminate\Http\Client\RequestException;
use Illuminate\Support\Facades\Http;

class TavilyService
{
    private string $key;

    private string $baseUrl;

    public function __construct()
    {
        $this->key = (string) config('services.tavily.key');
        $this->baseUrl = (string) config('services.tavily.base_url');
    }

    public function configured(): bool
    {
        return $this->key !== '';
    }

    /**
     * @return array<string, mixed>
     *
     * @throws RequestException
     */
    public function search(string $query, int $maxResults = 5): array
    {
        return $this->post('/search', [
            'query' => $query,
            'max_results' => $maxResults,
        ]);
    }

    /**
     * @param  array<string, mixed>  $payload
     * @return array<string, mixed>
     *
     * @throws RequestException
     */
    private function post(string $path, array $payload): array
    {
        $response = Http::withToken($this->key)
            ->baseUrl($this->baseUrl)
            ->post($path, $payload)
            ->throw();

        return $response->json();
    }
}
