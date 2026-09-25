<?php

/*
 * Testes da rota que entrega o front (D15 e D20): páginas do Vue respondem
 * pelo Laravel, enquanto API e health check continuam com as próprias rotas.
 */

namespace Tests\Feature;

use Tests\TestCase;

class SpaTest extends TestCase
{
    /**
     * Rotas do front respondem 200 (index.html da SPA ou página padrão).
     */
    public function test_rotas_do_front_respondem_pela_rota_coringa(): void
    {
        foreach (['/', '/checkout', '/teste-tecnico', '/admin/produtos/1/editar'] as $caminho) {
            $this->get($caminho)->assertOk();
        }
    }

    /**
     * Um endereço inexistente da API continua devolvendo 404 em JSON.
     */
    public function test_rota_inexistente_da_api_nao_cai_na_spa(): void
    {
        $this->getJson('/api/rota-inexistente')
            ->assertNotFound()
            ->assertJson(['message' => 'Recurso não encontrado.']);
    }

    /**
     * O health check do Laravel continua disponível.
     */
    public function test_health_check_continua_disponivel(): void
    {
        $this->get('/up')->assertOk();
    }
}

/* Fim de tests/Feature/SpaTest.php */
