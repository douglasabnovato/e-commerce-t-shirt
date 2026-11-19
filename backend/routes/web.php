<?php

/*
 * Rotas web.
 * Em produção, o Laravel entrega o front (build do Vue em public/spa) no
 * mesmo domínio da API (D15 e D20). Qualquer caminho que não seja da API,
 * do Sanctum, das imagens ou do health check devolve o index.html da SPA,
 * e o Vue Router decide qual página mostrar. Sem o build (ambiente local),
 * a rota devolve a página padrão do Laravel.
 */

use App\Models\Produto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;

/**
 * Entrega o index.html da SPA sem cache, para que um novo deploy seja
 * visto na hora (os arquivos de /spa/assets têm hash no nome).
 *
 * Na vitrine sem filtro (/ sem query), o HTML já sai com um
 * <link rel="preload" as="image" fetchpriority="high"> da imagem do
 * primeiro produto, o elemento do LCP (#33). Assim o download começa com o
 * HTML, sem esperar o JavaScript nem a resposta de /api/produtos. A ordem é
 * a mesma da página 1 da vitrine (mais recente primeiro, ver
 * ProdutoController::index). Sem produto, sem imagem ou sem banco, o HTML
 * sai como está e a busca do index.html faz o preload pelo front.
 */
Route::get('/{caminho?}', function (Request $request, ?string $caminho = null) {
    $indice = public_path('spa/index.html');

    if (! File::exists($indice)) {
        return view('welcome');
    }

    $html = File::get($indice);

    if (($caminho === null || $caminho === '') && $request->getQueryString() === null) {
        try {
            $imagem = Produto::query()->orderByDesc('id')->value('imagem');
        } catch (\Throwable $erro) {
            Log::warning('SPA: sem o preload da imagem da vitrine.', ['erro' => $erro->getMessage()]);
            $imagem = null;
        }

        if (is_string($imagem) && $imagem !== '') {
            $preload = '<link rel="preload" as="image" fetchpriority="high" data-preload-lcp href="'
                .e(Storage::disk('public')->url($imagem)).'" />';
            // Logo depois do <meta charset>, antes dos scripts e do CSS; o
            // callback não interpreta "$" nem "\" que venham no endereço.
            $comPreload = preg_replace_callback(
                '/<meta\s+charset=[^>]*>/i',
                fn (array $achado) => $achado[0].$preload,
                $html,
                1,
                $trocas,
            );
            $html = $trocas === 1 ? $comPreload : str_ireplace('</head>', $preload.'</head>', $html);
        }
    }

    return response($html, 200, [
        'Content-Type' => 'text/html; charset=UTF-8',
        'Cache-Control' => 'no-cache, no-store, must-revalidate',
    ]);
})->where('caminho', '^(?!(api|sanctum|storage|spa|up)(/|$)).*$')->name('spa');

/* Fim de routes/web.php */
