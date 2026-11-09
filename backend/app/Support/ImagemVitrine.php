<?php

/*
 * Versão reduzida das imagens de produto para a vitrine (#24).
 * O card mostra a imagem com 232 px de largura; um PNG de 1,1 MB atrasava
 * o LCP no celular. Aqui a imagem vira WebP com até 600 px de largura
 * (cobre telas de densidade 2x), com a extensão GD.
 * Se o servidor não tiver GD com WebP, ou se a imagem não puder ser lida,
 * nada é convertido e quem chamou mantém o arquivo original.
 */

namespace App\Support;

class ImagemVitrine
{
    public const LARGURA_MAXIMA = 600;

    public const QUALIDADE = 80;

    /**
     * Indica se o PHP atual consegue gerar WebP.
     */
    public static function disponivel(): bool
    {
        return function_exists('imagecreatefromstring') && function_exists('imagewebp');
    }

    /**
     * Converte o conteúdo binário de uma imagem em WebP reduzido. Devolve
     * null quando não é possível converter.
     */
    public static function reduzir(string $conteudo): ?string
    {
        if (! self::disponivel() || $conteudo === '') {
            return null;
        }

        $original = @imagecreatefromstring($conteudo);
        if ($original === false) {
            return null;
        }

        $imagem = $original;
        if (imagesx($original) > self::LARGURA_MAXIMA) {
            $reduzida = imagescale($original, self::LARGURA_MAXIMA);
            if ($reduzida !== false) {
                $imagem = $reduzida;
            }
        }

        // WebP aceita transparência; PNG com paleta precisa virar truecolor.
        if (! imageistruecolor($imagem)) {
            imagepalettetotruecolor($imagem);
        }
        imagealphablending($imagem, false);
        imagesavealpha($imagem, true);

        ob_start();
        $ok = imagewebp($imagem, null, self::QUALIDADE);
        $webp = (string) ob_get_clean();

        return $ok && $webp !== '' ? $webp : null;
    }
}

/* Fim de ImagemVitrine */
