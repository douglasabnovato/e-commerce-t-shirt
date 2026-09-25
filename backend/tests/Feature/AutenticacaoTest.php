<?php

/*
 * Testes de feature da autenticação Sanctum SPA (Ex. 10 e Ex. 2).
 * As requisições de login e logout enviam o cabeçalho Origin do frontend
 * (localhost:5173), como o navegador faz, para receberem sessão.
 */

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AutenticacaoTest extends TestCase
{
    use RefreshDatabase;

    private const ORIGEM = ['Origin' => 'http://localhost:5173', 'Referer' => 'http://localhost:5173/login'];

    /**
     * Credenciais corretas iniciam a sessão e devolvem os dados públicos
     * do usuário.
     */
    public function test_login_com_credenciais_validas(): void
    {
        $usuario = User::factory()->create(['password' => 'senha-segura-123']);

        $this->withHeaders(self::ORIGEM)
            ->postJson('/api/login', ['email' => $usuario->email, 'password' => 'senha-segura-123'])
            ->assertOk()
            ->assertJsonPath('usuario.email', $usuario->email)
            ->assertJsonMissingPath('usuario.password');

        $this->assertAuthenticatedAs($usuario);
    }

    /**
     * Senha errada responde 422 com mensagem genérica, sem revelar se o
     * e-mail existe.
     */
    public function test_login_com_senha_errada_retorna_422(): void
    {
        $usuario = User::factory()->create(['password' => 'senha-segura-123']);

        $this->withHeaders(self::ORIGEM)
            ->postJson('/api/login', ['email' => $usuario->email, 'password' => 'errada'])
            ->assertUnprocessable()
            ->assertJsonPath('errors.email.0', 'E-mail ou senha inválidos.');

        $this->assertGuest();
    }

    /**
     * Requisição de fora da aplicação (sem Origin permitido) não recebe
     * sessão e é recusada.
     */
    public function test_login_sem_origem_da_aplicacao_e_recusado(): void
    {
        $this->postJson('/api/login', ['email' => 'a@a.com', 'password' => 'x'])
            ->assertStatus(400);
    }

    /**
     * Após 5 tentativas em um minuto, o login é bloqueado (429).
     */
    public function test_login_bloqueado_apos_cinco_tentativas(): void
    {
        $dados = ['email' => 'alguem@tshirt.test', 'password' => 'errada'];

        for ($tentativa = 1; $tentativa <= 5; $tentativa++) {
            $this->withHeaders(self::ORIGEM)->postJson('/api/login', $dados)->assertUnprocessable();
        }

        $this->withHeaders(self::ORIGEM)->postJson('/api/login', $dados)->assertStatus(429);
    }

    /**
     * Rota do usuário atual exige login e responde 401 em português.
     */
    public function test_rota_do_usuario_exige_login(): void
    {
        $this->getJson('/api/user')
            ->assertUnauthorized()
            ->assertJsonPath('message', 'Não autenticado.');

        $usuario = User::factory()->create();

        $this->actingAs($usuario)
            ->getJson('/api/user')
            ->assertOk()
            ->assertJsonPath('usuario.id', $usuario->id);
    }

    /**
     * Logout encerra a sessão.
     */
    public function test_logout_encerra_a_sessao(): void
    {
        $this->actingAs(User::factory()->create())
            ->withHeaders(self::ORIGEM)
            ->postJson('/api/logout')
            ->assertNoContent();

        $this->assertGuest('web');
    }
}

/* Fim dos testes AutenticacaoTest */
