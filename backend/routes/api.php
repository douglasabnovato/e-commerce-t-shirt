<?php

/*
 * Rotas da API (prefixo /api).
 * Ex. 10: rotas REST de produtos, com leitura pública e escrita restrita a
 * usuários autenticados. Autenticação via Sanctum em modo SPA (cookie de
 * sessão + CSRF).
 */

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProdutoController;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Route;

/*
 * Saúde que toca o banco: o /up do Laravel só prova que o PHP sobe. Esta rota
 * conta os produtos; sem banco, responde 503.
 */
Route::get('/saude', function () {
    try {
        $produtos = DB::table('produtos')->count();

        return response()->json(['ok' => true, 'banco' => 'ok', 'produtos' => $produtos]);
    } catch (\Throwable $erro) {
        Log::error('Saúde: o banco não respondeu.', ['erro' => $erro->getMessage()]);

        return response()->json(['ok' => false, 'banco' => 'fora'], 503);
    }
})->name('saude');

Route::post('/login', [AuthController::class, 'login'])
    ->middleware('throttle:login')
    ->name('auth.login');

Route::apiResource('produtos', ProdutoController::class)->only(['index', 'show']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'usuario'])->name('auth.usuario');
    Route::post('/logout', [AuthController::class, 'logout'])->name('auth.logout');

    Route::apiResource('produtos', ProdutoController::class)->except(['index', 'show']);
});

/* Fim de routes/api.php */
