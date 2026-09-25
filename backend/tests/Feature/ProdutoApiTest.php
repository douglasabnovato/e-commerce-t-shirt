<?php

/*
 * Testes de feature da API de produtos (Ex. 10).
 * Cobrem leitura pública, bloqueio de escrita para visitantes (401),
 * validação (422) e o ciclo de vida das imagens no disco.
 */

namespace Tests\Feature;

use App\Models\Produto;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class ProdutoApiTest extends TestCase
{
    use RefreshDatabase;

    private const PNG_1X1 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';

    /**
     * Prepara um disco "public" falso para que nenhum teste grave arquivos
     * reais.
     */
    protected function setUp(): void
    {
        parent::setUp();

        Storage::fake('public');
    }

    /**
     * Visitante consegue listar os produtos, com paginação.
     */
    public function test_visitante_lista_produtos(): void
    {
        Produto::factory()->count(3)->create();

        $this->getJson('/api/produtos')
            ->assertOk()
            ->assertJsonCount(3, 'data')
            ->assertJsonStructure([
                'data' => [['id', 'nome', 'descricao', 'preco', 'imagem_url', 'criado_em']],
                'links',
                'meta' => ['current_page', 'per_page', 'total'],
            ]);
    }

    /**
     * O parâmetro busca filtra a lista pelo nome do produto.
     */
    public function test_busca_filtra_produtos_pelo_nome(): void
    {
        Produto::factory()->create(['nome' => 'Camiseta Azul']);
        Produto::factory()->create(['nome' => 'Moletom Preto']);

        $this->getJson('/api/produtos?busca=Moletom')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.nome', 'Moletom Preto');
    }

    /**
     * Visitante consegue ver um produto; id inexistente responde 404.
     */
    public function test_visitante_exibe_produto_e_recebe_404_para_id_inexistente(): void
    {
        $produto = Produto::factory()->create(['preco' => 79.9]);

        $this->getJson("/api/produtos/{$produto->id}")
            ->assertOk()
            ->assertJsonPath('data.nome', $produto->nome)
            ->assertJsonPath('data.preco', 79.9);

        $this->getJson('/api/produtos/999999')
            ->assertNotFound()
            ->assertJsonPath('message', 'Recurso não encontrado.');
    }

    /**
     * Visitante não pode criar, atualizar nem excluir produtos.
     */
    public function test_visitante_nao_modifica_produtos(): void
    {
        $produto = Produto::factory()->create();

        $this->postJson('/api/produtos', $this->dadosValidos())->assertUnauthorized();
        $this->putJson("/api/produtos/{$produto->id}", $this->dadosValidos())->assertUnauthorized();
        $this->deleteJson("/api/produtos/{$produto->id}")->assertUnauthorized();

        $this->assertDatabaseHas('produtos', ['id' => $produto->id, 'nome' => $produto->nome]);
    }

    /**
     * Usuário autenticado cria um produto com imagem.
     */
    public function test_usuario_autenticado_cria_produto_com_imagem(): void
    {
        $resposta = $this->actingAs(User::factory()->create())
            ->post('/api/produtos', [
                ...$this->dadosValidos(),
                'imagem' => $this->imagem('camiseta.png'),
            ], ['Accept' => 'application/json']);

        $resposta->assertCreated()->assertJsonPath('data.nome', 'Camiseta Teste');

        $produto = Produto::firstOrFail();
        Storage::disk('public')->assertExists($produto->imagem);
        $this->assertNotNull($resposta->json('data.imagem_url'));
    }

    /**
     * Preço com vírgula é aceito e gravado com ponto.
     */
    public function test_preco_com_virgula_e_aceito(): void
    {
        $this->actingAs(User::factory()->create())
            ->post('/api/produtos', [
                ...$this->dadosValidos(),
                'preco' => '89,90',
                'imagem' => $this->imagem('camiseta.png'),
            ], ['Accept' => 'application/json'])
            ->assertCreated()
            ->assertJsonPath('data.preco', 89.9);
    }

    /**
     * Criação sem dados responde 422 com erro em todos os campos obrigatórios.
     */
    public function test_criacao_invalida_retorna_422(): void
    {
        $this->actingAs(User::factory()->create())
            ->postJson('/api/produtos', ['preco' => 0])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['nome', 'descricao', 'preco', 'imagem'])
            ->assertJsonPath('errors.preco.0', 'O preço deve ser maior que zero.');
    }

    /**
     * Atualizar sem enviar imagem mantém a imagem atual.
     */
    public function test_atualizacao_sem_imagem_mantem_imagem_atual(): void
    {
        $imagem = $this->imagem('atual.png')->store('produtos', 'public');
        $produto = Produto::factory()->create(['imagem' => $imagem]);

        $this->actingAs(User::factory()->create())
            ->putJson("/api/produtos/{$produto->id}", [
                ...$this->dadosValidos(),
                'nome' => 'Nome Atualizado',
            ])
            ->assertOk()
            ->assertJsonPath('data.nome', 'Nome Atualizado');

        $this->assertSame($imagem, $produto->fresh()->imagem);
        Storage::disk('public')->assertExists($imagem);
    }

    /**
     * Atualizar com imagem nova (multipart com _method=PUT) apaga a antiga.
     */
    public function test_atualizacao_com_imagem_nova_remove_a_antiga(): void
    {
        $antiga = $this->imagem('antiga.png')->store('produtos', 'public');
        $produto = Produto::factory()->create(['imagem' => $antiga]);

        $this->actingAs(User::factory()->create())
            ->post("/api/produtos/{$produto->id}", [
                ...$this->dadosValidos(),
                '_method' => 'PUT',
                'imagem' => $this->imagem('nova.png'),
            ], ['Accept' => 'application/json'])
            ->assertOk();

        $nova = $produto->fresh()->imagem;
        $this->assertNotSame($antiga, $nova);
        Storage::disk('public')->assertMissing($antiga);
        Storage::disk('public')->assertExists($nova);
    }

    /**
     * Excluir remove o registro e a imagem do disco.
     */
    public function test_exclusao_remove_produto_e_imagem(): void
    {
        $imagem = $this->imagem('excluir.png')->store('produtos', 'public');
        $produto = Produto::factory()->create(['imagem' => $imagem]);

        $this->actingAs(User::factory()->create())
            ->deleteJson("/api/produtos/{$produto->id}")
            ->assertNoContent();

        $this->assertModelMissing($produto);
        Storage::disk('public')->assertMissing($imagem);
    }

    /**
     * Dados válidos de um produto, sem a imagem.
     *
     * @return array<string, mixed>
     */
    private function dadosValidos(): array
    {
        return [
            'nome' => 'Camiseta Teste',
            'descricao' => 'Descrição de teste com mais de dez caracteres.',
            'preco' => 99.9,
        ];
    }

    /**
     * Cria um arquivo PNG real (1x1 pixel) para upload, sem depender da
     * extensão GD.
     */
    private function imagem(string $nome): UploadedFile
    {
        return UploadedFile::fake()->createWithContent($nome, base64_decode(self::PNG_1X1));
    }
}

/* Fim dos testes ProdutoApiTest */
