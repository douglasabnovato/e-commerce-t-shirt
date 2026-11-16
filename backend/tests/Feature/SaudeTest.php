<?php

/*
 * Testes da rota de saúde (/api/saude): ela consulta o banco, para o health
 * check provar a conexão e não só que o PHP sobe.
 */

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Schema;
use Tests\TestCase;

class SaudeTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Com o banco no ar, responde 200 e o número de produtos.
     */
    public function test_saude_consulta_o_banco(): void
    {
        $this->getJson('/api/saude')
            ->assertOk()
            ->assertJson(['ok' => true, 'banco' => 'ok', 'produtos' => 0]);
    }

    /**
     * Sem a tabela de produtos, responde 503 em JSON.
     */
    public function test_saude_responde_503_sem_o_banco(): void
    {
        Schema::drop('produtos');

        $this->getJson('/api/saude')
            ->assertStatus(503)
            ->assertJson(['ok' => false, 'banco' => 'fora']);
    }
}

/* Fim do SaudeTest */
