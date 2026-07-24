<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\TavilyService;
use Illuminate\Http\Client\RequestException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TavilyController extends Controller
{
    public function __construct(private readonly TavilyService $tavily) {}

    /** Dipakai kartu integrasi di admin untuk menampilkan status terhubung/tidak. */
    public function status(): JsonResponse
    {
        return response()->json([
            'data' => [
                'configured' => $this->tavily->configured(),
            ],
        ]);
    }

    public function search(Request $request): JsonResponse
    {
        $data = $request->validate([
            'query' => ['required', 'string', 'max:400'],
            'max_results' => ['sometimes', 'integer', 'min:1', 'max:20'],
        ]);

        if (! $this->tavily->configured()) {
            return response()->json(['message' => 'TAVILY_API_KEY belum diatur.'], 422);
        }

        try {
            $result = $this->tavily->search($data['query'], $data['max_results'] ?? 5);
        } catch (RequestException $e) {
            return response()->json(['message' => 'Permintaan ke Tavily gagal.'], 502);
        }

        return response()->json(['data' => $result]);
    }
}
