<?php

use App\Models\Produto;
use App\Support\ImagemVitrine;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

/*
 * Reprocessa as imagens já salvas para a versão da vitrine (WebP de até
 * 600 px, #24). Uso no servidor, depois da publicação:
 *   php artisan produtos:reduzir-imagens
 * Por segurança, o arquivo original fica no disco; --apagar-originais o
 * remove depois que o produto passa a apontar para o WebP. A opção vale só
 * para as imagens convertidas na mesma execução: o comando não guarda o
 * caminho antigo, então uma segunda execução não acha os originais.
 */
Artisan::command('produtos:reduzir-imagens {--apagar-originais : Apaga o arquivo original depois da conversão}', function () {
    if (! ImagemVitrine::disponivel()) {
        $this->error('O PHP deste servidor não tem GD com WebP. Nada foi alterado.');

        return 1;
    }

    $disco = Storage::disk('public');
    $convertidas = 0;

    Produto::query()->whereNotNull('imagem')->orderBy('id')->each(function (Produto $produto) use ($disco, &$convertidas) {
        $original = $produto->imagem;

        if (str_ends_with(strtolower($original), '.webp')) {
            return;
        }
        if (! $disco->exists($original)) {
            $this->warn("Produto {$produto->id}: arquivo {$original} não encontrado; mantido.");

            return;
        }

        $webp = ImagemVitrine::reduzir((string) $disco->get($original));
        if ($webp === null) {
            $this->warn("Produto {$produto->id}: {$original} não pôde ser convertido; mantido.");

            return;
        }

        $novo = 'produtos/'.Str::random(40).'.webp';
        $disco->put($novo, $webp);

        try {
            $produto->update(['imagem' => $novo]);
        } catch (Throwable $erro) {
            $disco->delete($novo);
            throw $erro;
        }

        if ($this->option('apagar-originais')) {
            $disco->delete($original);
        }

        $this->line("Produto {$produto->id}: {$original} -> {$novo}");
        $convertidas++;
    });

    $this->info("{$convertidas} imagem(ns) convertida(s).");

    return 0;
})->purpose('Converte as imagens dos produtos para WebP de até 600 px (#24)');
