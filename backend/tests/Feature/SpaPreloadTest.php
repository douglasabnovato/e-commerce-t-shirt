<?php

/*
 * Preload da imagem do LCP no HTML da SPA (#33): na vitrine sem filtro, o
 * Laravel injeta no index.html um <link rel="preload"> da imagem do
 * produto mais recente (o primeiro card), para o download começar com o
 * HTML. Cada teste usa um index.html temporário, sem tocar no build real.
 */

namespace Tests\Feature;

use App\Models\Produto;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class SpaPreloadTest extends TestCase
{
    use RefreshDatabase;

    private const HTML = "<!DOCTYPE html>\n<html lang=\"pt-BR\">\n  <head>\n    <meta charset=\"UTF-8\" />\n    <title>T-Shirt Store</title>\n  </head>\n  <body><div id=\"app\"></div></body>\n</html>\n";

    private string $pasta;

    /**
     * Aponta o public_path() para uma pasta temporária com spa/index.html.
     */
    protected function setUp(): void
    {
        parent::setUp();

        $this->pasta = sys_get_temp_dir().DIRECTORY_SEPARATOR.'spa-preload-'.uniqid();
        File::ensureDirectoryExists($this->pasta.DIRECTORY_SEPARATOR.'spa');
        $this->escreverIndice(self::HTML);
        $this->app->usePublicPath($this->pasta);
    }

    protected function tearDown(): void
    {
        File::deleteDirectory($this->pasta);

        parent::tearDown();
    }

    private function escreverIndice(string $html): void
    {
        File::put($this->pasta.DIRECTORY_SEPARATOR.'spa'.DIRECTORY_SEPARATOR.'index.html', $html);
    }

    private function preload(string $caminho): string
    {
        return '<link rel="preload" as="image" fetchpriority="high" data-preload-lcp href="'
            .e(Storage::disk('public')->url($caminho)).'" />';
    }

    /**
     * A vitrine sai com o preload da imagem do produto mais recente, logo
     * depois do <meta charset>, e continua sem cache.
     */
    public function test_vitrine_pre_carrega_a_imagem_do_produto_mais_recente(): void
    {
        Produto::factory()->create(['imagem' => 'produtos/antigo.webp']);
        Produto::factory()->create(['imagem' => 'produtos/novo.webp']);

        $resposta = $this->get('/')->assertOk();

        $html = $resposta->getContent();
        $this->assertStringContainsString('<meta charset="UTF-8" />'.$this->preload('produtos/novo.webp'), $html);
        $this->assertStringNotContainsString('antigo.webp', $html);
        $this->assertSame(1, substr_count($html, 'data-preload-lcp'));
        $this->assertStringContainsString('no-store', (string) $resposta->headers->get('Cache-Control'));
        $this->assertStringContainsString('text/html', (string) $resposta->headers->get('Content-Type'));
    }

    /**
     * Caracteres especiais do caminho saem escapados no atributo.
     */
    public function test_endereco_da_imagem_sai_escapado(): void
    {
        Produto::factory()->create(['imagem' => 'produtos/a"b&c.webp']);

        $html = $this->get('/')->assertOk()->getContent();

        $esperado = e(Storage::disk('public')->url('produtos/a"b&c.webp'));
        $this->assertStringContainsString('href="'.$esperado.'"', $html);
        $this->assertStringNotContainsString('a"b', $html);
    }

    /**
     * Sem produto, ou com o mais recente sem imagem, o HTML sai como está.
     */
    public function test_sem_produto_ou_sem_imagem_o_html_sai_sem_preload(): void
    {
        $this->assertSame(self::HTML, $this->get('/')->assertOk()->getContent());

        Produto::factory()->create(['imagem' => 'produtos/antigo.webp']);
        Produto::factory()->create(['imagem' => null]);

        $this->assertSame(self::HTML, $this->get('/')->assertOk()->getContent());
    }

    /**
     * Com filtro na URL ou em outra página, a primeira imagem é outra (ou
     * nenhuma): sem preload.
     */
    public function test_com_filtro_ou_em_outra_pagina_nao_ha_preload(): void
    {
        Produto::factory()->create(['imagem' => 'produtos/novo.webp']);

        foreach (['/?ordem=menor-preco', '/?categoria=camisetas', '/checkout', '/teste-tecnico'] as $caminho) {
            $this->assertSame(self::HTML, $this->get($caminho)->assertOk()->getContent(), $caminho);
        }
    }

    /**
     * Sem <meta charset>, o preload entra antes do </head>.
     */
    public function test_sem_meta_charset_o_preload_entra_antes_do_fim_do_head(): void
    {
        $this->escreverIndice('<html><head><title>x</title></head><body></body></html>');
        Produto::factory()->create(['imagem' => 'produtos/novo.webp']);

        $html = $this->get('/')->assertOk()->getContent();

        $this->assertStringContainsString($this->preload('produtos/novo.webp').'</head>', $html);
    }

    /**
     * Sem a tabela de produtos (banco fora), a vitrine ainda abre, sem preload.
     */
    public function test_sem_banco_a_vitrine_abre_sem_preload(): void
    {
        Schema::drop('produtos');

        $this->assertSame(self::HTML, $this->get('/')->assertOk()->getContent());
    }
}

/* Fim de tests/Feature/SpaPreloadTest.php */
