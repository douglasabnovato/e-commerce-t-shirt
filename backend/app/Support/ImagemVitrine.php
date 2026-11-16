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

    /** 16 megapixels: cerca de 64 MB na memória do GD. */
    public const PIXELS_MAXIMOS = 16_000_000;

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

        // Decodificar uma foto muito grande estoura o memory_limit com erro
        // fatal, que não cai em catch: acima do limite, fica o original.
        $tamanho = @getimagesizefromstring($conteudo);
        if ($tamanho === false || $tamanho[0] * $tamanho[1] > self::PIXELS_MAXIMOS) {
            return null;
        }

        $original = @imagecreatefromstring($conteudo);
        if ($original === false) {
            return null;
        }

        $original = self::corrigirOrientacao($original, $conteudo, $tamanho['mime'] ?? '');
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

    /**
     * Foto de celular em JPEG pode vir "deitada" com a tag EXIF Orientation;
     * o WebP gerado não leva o EXIF, então a rotação é aplicada aqui. Sem a
     * extensão exif, a imagem segue como veio.
     */
    private static function corrigirOrientacao(\GdImage $imagem, string $conteudo, string $mime): \GdImage
    {
        if ($mime !== 'image/jpeg' || ! function_exists('exif_read_data')) {
            return $imagem;
        }

        $exif = @exif_read_data('data://image/jpeg;base64,'.base64_encode($conteudo));
        $angulo = match ((int) ($exif['Orientation'] ?? 1)) {
            3 => 180,
            6 => 270,
            8 => 90,
            default => 0,
        };

        if ($angulo === 0) {
            return $imagem;
        }

        $girada = imagerotate($imagem, $angulo, 0);

        return $girada === false ? $imagem : $girada;
    }
}

/* Fim de ImagemVitrine */
