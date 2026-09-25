<?php

/*
 * Rotas web.
 * Em produção, o Laravel entrega o front (build do Vue em public/spa) no
 * mesmo domínio da API (D15 e D20). Qualquer caminho que não seja da API,
 * do Sanctum, das imagens ou do health check devolve o index.html da SPA,
 * e o Vue Router decide qual página mostrar. Sem o build (ambiente local),
 * a rota devolve a página padrão do Laravel.
 */

use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Route;

/**
 * Entrega o index.html da SPA sem cache, para que um novo deploy seja
 * visto na hora (os arquivos de /spa/assets têm hash no nome).
 */
Route::get('/{caminho?}', function () {
    $indice = public_path('spa/index.html');

    if (! File::exists($indice)) {
        return view('welcome');
    }

    return response()->file($indice, [
        'Content-Type' => 'text/html; charset=UTF-8',
        'Cache-Control' => 'no-cache, no-store, must-revalidate',
    ]);
})->where('caminho', '^(?!(api|sanctum|storage|spa|up)(/|$)).*$')->name('spa');

/* Fim de routes/web.php */
