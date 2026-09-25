<?php

/*
 * Seeder de produtos: cadastra 12 produtos de exemplo (camisetas, moletons
 * e acessórios) com imagem. As imagens ficam versionadas em
 * database/seeders/imagens e são copiadas para o disco "public", no mesmo
 * lugar em que o upload do CRUD grava os arquivos.
 * Nomes e imagens inspirados no catálogo da Chico Rei, com uso permitido
 * pelo enunciado do teste.
 */

namespace Database\Seeders;

use App\Models\Produto;
use Illuminate\Database\Seeder;
use Illuminate\Http\File;
use Illuminate\Support\Facades\Storage;

class ProdutoSeeder extends Seeder
{
    /**
     * Cria ou atualiza cada produto pelo nome, para que o seeder possa ser
     * executado mais de uma vez sem duplicar registros.
     */
    public function run(): void
    {
        foreach ($this->produtos() as $item) {
            $caminho = Storage::disk('public')->putFileAs(
                'produtos',
                new File(database_path('seeders/imagens/'.$item['arquivo'])),
                $item['arquivo']
            );

            Produto::updateOrCreate(
                ['nome' => $item['nome']],
                [
                    'descricao' => $item['descricao'],
                    'preco' => $item['preco'],
                    'imagem' => $caminho,
                ]
            );
        }
    }

    /**
     * Dados dos produtos de exemplo.
     *
     * @return array<int, array{nome: string, descricao: string, preco: float, arquivo: string}>
     */
    private function produtos(): array
    {
        return [
            [
                'nome' => 'Camiseta Gogh Night',
                'descricao' => 'Camiseta em algodão com estampa inspirada nas noites estreladas de Van Gogh.',
                'preco' => 94.99,
                'arquivo' => 'camiseta-gogh-night.jpg',
            ],
            [
                'nome' => 'Camiseta Paulo Freire',
                'descricao' => 'Camiseta em algodão em homenagem ao Patrono da Educação Brasileira.',
                'preco' => 74.99,
                'arquivo' => 'camiseta-paulo-freire.jpg',
            ],
            [
                'nome' => 'Camiseta O Auto da Compadecida',
                'descricao' => 'Camiseta em algodão com estampa inspirada na obra de Ariano Suassuna.',
                'preco' => 74.99,
                'arquivo' => 'camiseta-auto-da-compadecida.jpg',
            ],
            [
                'nome' => 'Camiseta Pagodinho',
                'descricao' => 'Camiseta em algodão com estampa que celebra o samba de roda.',
                'preco' => 79.99,
                'arquivo' => 'camiseta-pagodinho.jpg',
            ],
            [
                'nome' => 'Moletom Nothing Lasts Forever',
                'descricao' => 'Moletom flanelado com estampa inspirada no chinelo remendado brasileiro.',
                'preco' => 174.99,
                'arquivo' => 'moletom-nothing-lasts-forever.jpg',
            ],
            [
                'nome' => 'Moletom Cachacinha Supremacy',
                'descricao' => 'Moletom flanelado com estampa que homenageia a bebida mais brasileira.',
                'preco' => 229.99,
                'arquivo' => 'moletom-cachacinha-supremacy.jpg',
            ],
            [
                'nome' => 'Moletom Canguru La Luna',
                'descricao' => 'Moletom canguru com capuz e estampa inspirada nas fases da lua.',
                'preco' => 229.99,
                'arquivo' => 'moletom-canguru-la-luna.jpg',
            ],
            [
                'nome' => 'Moletom Canguru Let It Be',
                'descricao' => 'Moletom canguru com capuz e estampa sobre deixar o tempo passar.',
                'preco' => 219.99,
                'arquivo' => 'moletom-canguru-let-it-be.jpg',
            ],
            [
                'nome' => 'Sketchbook Praise the Sun',
                'descricao' => 'Sketchbook com capa ilustrada e folhas lisas para desenho e anotações.',
                'preco' => 64.99,
                'arquivo' => 'sketchbook-praise-the-sun.jpg',
            ],
            [
                'nome' => 'Sketchbook Simone de Beauvoir',
                'descricao' => 'Sketchbook com capa ilustrada em homenagem a Simone de Beauvoir.',
                'preco' => 66.99,
                'arquivo' => 'sketchbook-simone-de-beauvoir.jpg',
            ],
            [
                'nome' => 'Sketchbook Tomá Café',
                'descricao' => 'Sketchbook com capa ilustrada para quem não começa o dia sem café.',
                'preco' => 74.99,
                'arquivo' => 'sketchbook-toma-cafe.jpg',
            ],
            [
                'nome' => 'Sketchbook Cafezim',
                'descricao' => 'Sketchbook com capa ilustrada e folhas lisas, companhia para qualquer dia.',
                'preco' => 64.99,
                'arquivo' => 'sketchbook-cafezim.jpg',
            ],
        ];
    }
}

/* Fim do seeder ProdutoSeeder */
