<?php

/*
 * Factory de Produto: gera produtos de exemplo com o faker em pt_BR.
 * Usada pelos testes automatizados e disponível para popular o banco.
 */

namespace Database\Factories;

use App\Models\Produto;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Produto>
 */
class ProdutoFactory extends Factory
{
    protected $model = Produto::class;

    /**
     * Define os valores padrão de um produto fictício.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $tipo = fake()->randomElement(['Camiseta', 'Moletom', 'Caneca', 'Sketchbook']);

        return [
            'nome' => $tipo.' '.ucfirst(fake()->words(2, true)),
            'descricao' => fake()->sentence(12),
            'preco' => fake()->randomFloat(2, 39, 249),
            'imagem' => null,
        ];
    }
}

/* Fim da factory ProdutoFactory */
