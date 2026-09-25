<?php

/*
 * Rotas da API (prefixo /api).
 * Ex. 10: rotas REST de produtos, com leitura pública e escrita restrita a
 * usuários autenticados. Autenticação via Sanctum em modo SPA (cookie de
 * sessão + CSRF).
 */

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProdutoController;
use Illuminate\Support\Facades\Route;

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
