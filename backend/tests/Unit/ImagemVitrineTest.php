<?php

/*
 * Testes unitários de ImagemVitrine (#24): limites que fazem a conversão
 * desistir e deixar o arquivo original.
 */

namespace Tests\Unit;

use App\Support\ImagemVitrine;
use PHPUnit\Framework\TestCase;

class ImagemVitrineTest extends TestCase
{
    /**
     * PNG de 1x1 com o cabeçalho (IHDR) reescrito para outra largura e
     * altura: getimagesize lê só o cabeçalho, sem decodificar a imagem.
     */
    private function pngComCabecalho(int $largura, int $altura): string
    {
        $png = base64_decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==');

        return substr($png, 0, 16).pack('NN', $largura, $altura).substr($png, 24);
    }

    public function test_imagem_com_pixels_demais_nao_e_convertida(): void
    {
        $conteudo = $this->pngComCabecalho(5000, 4000);

        $this->assertSame([5000, 4000], array_slice(getimagesizefromstring($conteudo), 0, 2));
        $this->assertNull(ImagemVitrine::reduzir($conteudo));
    }

    public function test_conteudo_que_nao_e_imagem_nao_e_convertido(): void
    {
        $this->assertNull(ImagemVitrine::reduzir('isto não é uma imagem'));
        $this->assertNull(ImagemVitrine::reduzir(''));
    }
}

/* Fim dos testes ImagemVitrineTest */
